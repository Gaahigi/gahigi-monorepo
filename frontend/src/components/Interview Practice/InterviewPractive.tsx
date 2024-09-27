import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

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

const InterviewPractice: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<{ question: string; answer: string; feedback: Feedback }[]>([]);

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
    setInterviewHistory([...interviewHistory, { 
      question: currentQuestion!.text, 
      answer: userAnswer, 
      feedback: mockFeedback 
    }]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNextQuestion();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Interview Practice</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : currentQuestion ? (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>{currentQuestion.text}</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={submitAnswer} disabled={!userAnswer.trim()}>
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
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Interview History</Typography>
        <List>
          {interviewHistory.map((item, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={item.question} 
                secondary={`Your answer: ${item.answer.substring(0, 50)}... | Confidence: ${(item.feedback.confidence * 100).toFixed(0)}%`} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default InterviewPractice;