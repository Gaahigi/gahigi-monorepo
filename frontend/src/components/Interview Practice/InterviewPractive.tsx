import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, TextField, Button, CircularProgress, List, ListItem, ListItemText, Tabs, Tab } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const InterviewPractice: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<InterviewResult[]>([]);
  const [interviewType, setInterviewType] = useState<'text' | 'speech' | 'video'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const fetchNextQuestion = async () => {
    setIsLoading(true);
    // In a real application, this would be an API call to your backend
    const mockQuestion: Question = {
      id: Math.floor(Math.random() * 1000),
      text: "Tell me about a time when you had to work under pressure.",
      difficulty: 'medium'
    };
    setCurrentQuestion(mockQuestion);
    setIsLoading(false);
  };

  const submitAnswer = async () => {
    setIsLoading(true);
    // In a real application, this would be an API call to your AI backend
    const mockFeedback: Feedback = {
      content: "Your answer demonstrates experience with pressure situations. Consider providing more specific details about the outcome.",
      confidence: 0.75,
      suggestions: [
        "Mention specific techniques you used to manage the pressure",
        "Quantify the results of your actions if possible"
      ]
    };
    setFeedback(mockFeedback);
    const newResult: InterviewResult = {
      date: new Date().toISOString().split('T')[0],
      question: currentQuestion!.text,
      answer: userAnswer,
      feedback: mockFeedback,
      score: mockFeedback.confidence * 100
    };
    setInterviewHistory([...interviewHistory, newResult]);
    setIsLoading(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'text' | 'speech' | 'video') => {
    setInterviewType(newValue);
  };

  const startRecording = async () => {
    setIsRecording(true);
    if (interviewType === 'speech') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
        // Handle recording logic here
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    } else if (interviewType === 'video') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
        // Handle recording logic here
      } catch (err) {
        console.error('Error accessing camera and microphone:', err);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      // Handle stopping recording and processing the recorded data
    }
  };

  useEffect(() => {
    fetchNextQuestion();
  }, []);

  const renderProgressChart = () => {
    const chartData = interviewHistory.map((result, index) => ({
      name: `Interview ${index + 1}`,
      score: result.score
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
      <Tabs value={interviewType} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Text" value="text" />
        <Tab label="Speech" value="speech" icon={<MicIcon />} iconPosition="start" />
        <Tab label="Video" value="video" icon={<VideocamIcon />} iconPosition="start" />
      </Tabs>
      {isLoading ? (
        <CircularProgress />
      ) : currentQuestion ? (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>{currentQuestion.text}</Typography>
          {interviewType === 'text' && (
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
          {interviewType === 'speech' && (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color={isRecording ? "secondary" : "primary"}
                onClick={isRecording ? stopRecording : startRecording}
                startIcon={<MicIcon />}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </Box>
          )}
          {interviewType === 'video' && (
            <Box sx={{ mb: 2 }}>
              <video ref={videoRef} width="100%" height="auto" autoPlay muted />
              <Button
                variant="contained"
                color={isRecording ? "secondary" : "primary"}
                onClick={isRecording ? stopRecording : startRecording}
                startIcon={<VideocamIcon />}
                sx={{ mt: 1 }}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </Box>
          )}
          <Button variant="contained" onClick={submitAnswer} disabled={!userAnswer.trim() && !isRecording}>
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