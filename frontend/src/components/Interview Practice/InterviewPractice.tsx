import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, TextField, Button, CircularProgress, List, ListItem, ListItemText, Tab, Tabs } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import VideocamIcon from '@mui/icons-material/Videocam';

interface Question {
  id: number;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Feedback {
  content: string;
  confidence: number;
  suggestions: string[];
}

interface InterviewResult {
  date: string;
  question: string;
  answer: string;
  feedback: Feedback;
  score: number;
}

type InterviewMode = 'text' | 'voice' | 'video';

const InterviewPractice: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<InterviewResult[]>([]);
  const [mode, setMode] = useState<InterviewMode>('text');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchNextQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/interview/question');
      const data = await response.json();
      setCurrentQuestion(data);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
    setIsLoading(false);
  };

  const submitAnswer = async () => {
    setIsLoading(true);
    try {
      let formData = new FormData();
      formData.append('questionId', currentQuestion!.id.toString());
      formData.append('mode', mode);
      
      if (mode === 'text') {
        formData.append('answer', userAnswer);
      } else if (mode === 'voice' || mode === 'video') {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        formData.append('audio', audioBlob, 'answer.webm');
      }

      const response = await fetch('http://localhost:5000/api/interview/feedback', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to submit answer');
      }

      const data = await response.json();
      if (!data.feedback || typeof data.feedback.confidence !== 'number') {
        throw new Error('Invalid feedback received from server');
      }

      setFeedback(data.feedback);
      const newResult: InterviewResult = {
        date: new Date().toISOString().split('T')[0],
        question: currentQuestion!.text,
        answer: userAnswer,
        feedback: data.feedback,
        score: data.feedback.confidence * 100,
      };
      setInterviewHistory([...interviewHistory, newResult]);
    } catch (error) {
      console.error('Error submitting answer:', error);
      // You might want to show an error message to the user here
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNextQuestion();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: mode === 'video'
      });
      
      if (mode === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const renderProgressChart = () => {
    const chartData = interviewHistory.map((result, index) => ({
      name: `Interview ${index + 1}`,
      score: result.score,
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Interview Practice</Typography>
      <Tabs value={mode} onChange={(_, newValue) => setMode(newValue)} sx={{ mb: 2 }}>
        <Tab label="Text" value="text" />
        <Tab label="Voice" value="voice" />
        <Tab label="Video" value="video" />
      </Tabs>
      {isLoading ? (
        <CircularProgress />
      ) : currentQuestion ? (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>{currentQuestion.text}</Typography>
          {mode === 'text' ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              sx={{ mb: 2 }}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {mode === 'video' && <video ref={videoRef} width="400" height="300" autoPlay muted />}
              <Button
                variant="contained"
                color={isRecording ? "secondary" : "primary"}
                startIcon={isRecording ? <StopIcon /> : mode === 'voice' ? <MicIcon /> : <VideocamIcon />}
                onClick={isRecording ? stopRecording : startRecording}
                sx={{ mt: 2 }}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </Box>
          )}
          <Button variant="contained" onClick={submitAnswer} disabled={!userAnswer.trim() && !isRecording} sx={{ mt: 2 }}>
            Submit Answer
          </Button>
        </Paper>
      ) : null}
      {feedback && (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Feedback</Typography>
          <Typography>{feedback.content}</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>Confidence Score: {(feedback.confidence * 100).toFixed(0)}%</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>Suggestions:</Typography>
          <List>
            {feedback.suggestions.map((suggestion, index) => (
              <ListItem key={index}>
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" onClick={fetchNextQuestion} sx={{ mt: 2 }}>
            Next Question
          </Button>
        </Paper>
      )}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Your Progress</Typography>
        {interviewHistory.length > 0 ? (
          <>
            {renderProgressChart()}
            <Typography variant="body2" sx={{ mt: 2 }}>
              Your average score: {(interviewHistory.reduce((sum, result) => sum + result.score, 0) / interviewHistory.length).toFixed(2)}
            </Typography>
          </>
        ) : (
          <Typography>Complete your first interview to see your progress!</Typography>
        )}
      </Paper>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Interview History</Typography>
        <List>
          {interviewHistory.map((item, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={`${item.date}: ${item.question}`} 
                secondary={`Score: ${item.score.toFixed(2)} | Feedback: ${item.feedback.content.substring(0, 50)}...`} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default InterviewPractice;