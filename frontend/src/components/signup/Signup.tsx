import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Container, 
  useTheme, 
  useMediaQuery 
} from '@mui/material';
import Input from '@/components/Input/Input';
import AppInput from '@/components/Input/Input';

const Signup: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Left side - Career Booster info */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: '#FFF1F0',
                borderRadius: '16px',
                padding: '32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  Boost your career with Gahigi!
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Discover tailored career advice and resources.
                </Typography>
              </Box>
              {/* You would replace this with your actual image */}
              <Box
                component="img"
                src="/illustration.png"
                alt="Career boost illustration"
                sx={{ maxWidth: '100%', height: 'auto', my: 4 }}
              />
              <Typography variant="body2">
                Enhance your career with expert advice.
              </Typography>
            </Box>
          </Grid>

          {/* Right side - Sign up form */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Get started for free
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Unlock premium career tools for free.
              </Typography>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <AppInput placeholder="Your full name" fullWidth margin="normal" />
                <AppInput placeholder="Your professional email" fullWidth margin="normal" />
                <AppInput placeholder="Create a password" type="password" fullWidth margin="normal" />
                <Input placeholder="Confirm password" type="password" fullWidth margin="normal" />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: '#FF5733',
                    '&:hover': {
                      backgroundColor: '#E64A2E',
                    },
                    borderRadius: '9999px',
                    padding: '12px 0',
                  }}
                >
                  Sign up
                </Button>
                <Typography variant="body2" align="center" sx={{ mt: 1, mb: 2 }}>
                  Lorem ipsum
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        backgroundColor: '#FF5733',
                        '&:hover': {
                          backgroundColor: '#E64A2E',
                        },
                        borderRadius: '9999px',
                      }}
                    >
                      Google
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        backgroundColor: '#FF5733',
                        '&:hover': {
                          backgroundColor: '#E64A2E',
                        },
                        borderRadius: '9999px',
                      }}
                    >
                      Facebook
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Signup;
