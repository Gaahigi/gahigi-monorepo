import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import AppButton from '../Button/AppButton';

interface CoursePageProps {
  courseTitle: string;
}

interface StepType {
  label: string;
  description: string;
}

const CoursePage: React.FC<CoursePageProps> = ({ courseTitle }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [steps, setSteps] = useState<StepType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/course/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courseTitle }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch course content');
        }
        const data = await response.json();
        console.log('Received data:', data); // Log the received data
        if (Array.isArray(data)) {
          setSteps(data);
        } else {
          console.error('Unexpected API response structure:', data);
          setSteps([]);
        }
      } catch (error) {
        console.error('Error fetching course content:', error);
        setError('An error occurred while fetching the course content. Please try again.');
        setSteps([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseTitle]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const newMessages = [
      ...chatMessages,
      { role: 'user', content: userInput },
    ];
    setChatMessages(newMessages);

    try {
      const response = await fetch('http://localhost:5000/api/course/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput, courseTitle }),
      });
      const data = await response.json();
      setChatMessages([...newMessages, { role: 'ai', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error (e.g., show an error message to the user)
    }

    setUserInput('');
  };

  if (isLoading) {
    return <div>Loading course content...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>{courseTitle}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Course Content</Typography>
            {steps.length > 0 ? (
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                    <StepContent>
                      <Typography>{step.description}</Typography>
                      <Box sx={{ mb: 2 }}>
                        <AppButton
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? 'Finish' : 'Continue'}
                        </AppButton>
                        {index > 0 && (
                          <Button
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Back
                          </Button>
                        )}
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            ) : (
              <Typography>No course content available.</Typography>
            )}
            {activeStep === steps.length && steps.length > 0 && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>All steps completed - you're finished</Typography>
                <AppButton onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </AppButton>
              </Paper>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, mb: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>AI Assistant</Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
              {chatMessages.map((message, index) => (
                <Box key={index} sx={{ mb: 1, textAlign: message.role === 'user' ? 'right' : 'left' }}>
                  <Paper sx={{ p: 1, display: 'inline-block', bgcolor: message.role === 'user' ? 'primary.light' : 'background.paper' }}>
                    <Typography variant="body2">{message.content}</Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask a question..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <AppButton variant="contained" onClick={handleSendMessage} sx={{ ml: 1 }}>Send</AppButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CoursePage;