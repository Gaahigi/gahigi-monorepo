import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import VideocamIcon from "@mui/icons-material/Videocam";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AppButton from "../Button/AppButton";
import { toast } from "react-toastify";

interface Question {
  text: string;
  difficulty: "easy" | "medium" | "hard";
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

type InterviewMode = "text" | "voice" | "video";

const InterviewPractice: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<InterviewResult[]>(
    []
  );
  const [mode, setMode] = useState<InterviewMode>("text");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4999/course/interview/question"
      );
      const data = await response.json();
      setQuestions(data);
      setCurrentQuestion(data[0]);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    setIsLoading(false);
  };

  const goToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestion(questions[nextIndex]);
      setCurrentQuestionIndex(nextIndex);
    } else {
      // All questions have been answered
      console.log("All questions completed");
      // You might want to add some UI feedback here
    }
  };

  const submitAnswer = async () => {
    setIsSubmitting(true);
    try {
      // send answer to backend
      const answer = {
        answer: userAnswer,
        mode: mode,
      };
      const response = await fetch(
        "http://localhost:4999/course/interview/feedback",

        {
          method: "POST",
          body: JSON.stringify({
            question: currentQuestion?.text,
            answer: userAnswer,
          }),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to submit answer");
      }

      const data = await response.json();
      if (!data.feedback || typeof data.feedback.confidence !== "number") {
        throw new Error("Invalid feedback received from server");
      }

      setFeedback(data.feedback);

      // setInterviewHistory([...interviewHistory, newResult]);
      toast.success("Answer submitted successfully!");
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer. Please try again.");
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mode === "video",
      });

      if (mode === "video" && videoRef.current) {
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
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Transcribe audio
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.wav");

        const response = await fetch(
          "http://localhost:4999/career/transcribe",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.text();

        setTranscribedText(data);
        setUserAnswer(data); // Set the transcribed text as the user answer
      };

      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
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
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Interview Practice
      </Typography>
      <Tabs
        value={mode}
        onChange={(_, newValue) => setMode(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Text" value="text" />
        <Tab label="Voice" value="voice" />
        <Tab label="Video" value="video" />
      </Tabs>
      {isLoading ? (
        <CircularProgress />
      ) : currentQuestion ? (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {currentQuestion.text}
          </Typography>
          {mode === "text" ? (
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {mode === "video" && (
                <video ref={videoRef} width="400" height="300" autoPlay muted />
              )}
              <Button
                variant="contained"
                color={isRecording ? "secondary" : "primary"}
                startIcon={
                  isRecording ? (
                    <StopIcon />
                  ) : mode === "voice" ? (
                    <MicIcon />
                  ) : (
                    <VideocamIcon />
                  )
                }
                onClick={isRecording ? stopRecording : startRecording}
                sx={{ mt: 2 }}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              {audioUrl && (
                <Button
                  variant="outlined"
                  startIcon={<PlayArrowIcon />}
                  onClick={playAudio}
                  sx={{ mt: 2 }}
                >
                  Play Recording
                </Button>
              )}
              {transcribedText && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={transcribedText}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  sx={{ mt: 2, mb: 2 }}
                />
              )}
            </Box>
          )}

          <Button
            variant="contained"
            onClick={submitAnswer}
            disabled={(!userAnswer.trim() && !isRecording) || isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit Answer"
            )}
          </Button>
        </Paper>
      ) : null}
      {feedback && (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Feedback
          </Typography>
          <Typography>{feedback.content}</Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Confidence Score: {(feedback.confidence * 100).toFixed(0)}%
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Suggestions:
          </Typography>
          <List>
            {feedback.suggestions.map((suggestion, index) => (
              <ListItem key={index}>
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" onClick={goToNextQuestion} sx={{ mt: 2 }}>
            Next Question
          </Button>
        </Paper>
      )}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Your Progress
        </Typography>
        {interviewHistory.length > 0 ? (
          <>
            {renderProgressChart()}
            <Typography variant="body2" sx={{ mt: 2 }}>
              Your average score:{" "}
              {(
                interviewHistory.reduce(
                  (sum, result) => sum + result.score,
                  0
                ) / interviewHistory.length
              ).toFixed(2)}
            </Typography>
          </>
        ) : (
          <Typography>
            Complete your first interview to see your progress!
          </Typography>
        )}
      </Paper>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Interview History
        </Typography>
        <List>
          {interviewHistory.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${item.date}: ${item.question}`}
                secondary={`Score: ${item.score.toFixed(
                  2
                )} | Feedback: ${item.feedback.content.substring(0, 50)}...`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default InterviewPractice;
