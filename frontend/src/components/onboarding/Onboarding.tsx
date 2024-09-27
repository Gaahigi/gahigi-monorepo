import React, { useState } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';

const questions = [
  {
    id: "employmentStatus",
    question: "What is your current employment status?",
    options: ["Student", "Recent graduate", "Employed", "Unemployed"]
  },
  {
    id: "educationLevel",
    question: "What is your highest level of education?",
    options: ["High school", "Bachelor's degree", "Master's degree", "PhD"]
  },
  {
    id: "industryInterest",
    question: "Which industry are you most interested in?",
    options: ["Technology", "Finance", "Healthcare", "Education", "Other"]
  },
  {
    id: "careerChallenge",
    question: "What is your biggest career challenge right now?",
    options: ["Finding job opportunities", "Interview preparation", "Skill development", "Networking"]
  },
  {
    id: "publicSpeaking",
    question: "How comfortable are you with public speaking?",
    options: ["Very comfortable", "Somewhat comfortable", "Neutral", "Uncomfortable", "Very uncomfortable"]
  }
];

interface OnboardingProps {
  onComplete: (answers: Record<string, string>) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  console.log(answers);
  const handleAnswer = (answer: string) => {
    const currentQuestionId = questions[currentQuestion].question;
    const newAnswers = { ...answers, [currentQuestionId]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Let's get to know you better
      </Typography>
      <Typography variant="body1" gutterBottom>
        Question {currentQuestion + 1} of {questions.length}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {questions[currentQuestion].question}
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup>
          {questions[currentQuestion].options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option}
              control={<Radio />}
              label={option}
              onClick={() => handleAnswer(option)}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default Onboarding;
