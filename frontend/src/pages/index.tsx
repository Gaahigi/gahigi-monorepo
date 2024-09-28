import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, Grid, Card, CardContent, 
  CardMedia, useMediaQuery, Theme
} from '@mui/material';
import { styled } from '@mui/system';
import { Link as ScrollLink } from 'react-scroll';
import Link from 'next/link';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  backgroundImage: 'url("/hero-background.jpg")', // Add your background image
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: theme.palette.common.white,
}));

const VideoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
}));

const FeatureSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.grey[100],
}));

const Footer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const LandingPage: React.FC = () => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#2C3E50' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gahigi
          </Typography>
          <ScrollLink to="solutions" smooth={true} duration={500}>
            <Button color="inherit">Solutions</Button>
          </ScrollLink>
          <ScrollLink to="demo" smooth={true} duration={500}>
            <Button color="inherit">See Demo</Button>
          </ScrollLink>
          <Link href="/login" passHref>
              <Button variant="contained" size="large" sx={{ 
               
              }}>
                Get Started
              </Button>
            </Link>
        </Toolbar>
      </AppBar>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundImage: 'url("/hero-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'common.white',
      }}>
        <Container>
          <Typography variant={isSmallScreen ? 'h3' : 'h2'} gutteSee Gahigi in ActionrBottom>
            Kickstart Your Career with AI-Powered Coaching
          </Typography>
          <Typography variant="h5" paragraph>
            Gahigi: Your personal AI career coach for young professionals in Rwanda
          </Typography>
        </Container>
      </Box>

      <Box id="demo" sx={{ py: 4 }}>
        <Container>
          <Typography variant="h3" gutterBottom align="center">
            See Gahigi in Action
          </Typography>
          <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', mb: 4 }}>
            <iframe 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your actual demo video
              title="Gahigi Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/login" passHref>
              <Button variant="contained" size="large" >
                Get Started
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      <Box id="solutions" sx={{ py: 4, backgroundColor: 'grey.100' }}>
        <Container>
          <Typography variant="h3" gutterBottom align="center">
            Meet Gahigi AI
          </Typography>
          <Grid container spacing={4}>
            {['Interview Practice', 'Skill-building Exercises', 'Personalized Career Advice', 'Job Market Insights'].map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`/${feature.toLowerCase().replace(' ', '-')}.jpg`}
                    alt={feature}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {feature}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getFeatureDescription(feature)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {['Interview Practice', 'Skill-building Exercises', 'Personalized Career Advice', 'Job Market Insights'].map((feature, index) => (
        <Box key={feature} sx={{ 
          py: 4, 
          backgroundColor: index % 2 === 0 ? 'background.paper' : 'background.default' 
        }}>
          <Container>
            <Grid container spacing={4} alignItems="center" direction={index % 2 === 0 ? 'row' : 'row-reverse'}>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  {getFeatureTitle(feature)}
                </Typography>
                <Typography variant="body1" paragraph>
                  {getFeatureDescription(feature)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box 
                  component="img" 
                  src={`/${feature.toLowerCase().replace(' ', '-')}-screenshot.jpg`} 
                  alt={feature} 
                  sx={{ width: '100%', borderRadius: 2 }} 
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      ))}

      <Box sx={{ 
        py: 3, 
        backgroundColor: '#FF5733', 
        color: 'common.white' 
      }}>
        <Container>
          <Typography variant="body1" align="center">
            © 2024 Gahigi AI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

function getFeatureDescription(feature: string): string {
  switch (feature) {
    case 'Interview Practice':
      return 'Gahigi simulates job interviews, giving you feedback to improve your performance.';
    case 'Skill-building Exercises':
      return 'Through interactive scenarios, Gahigi helps you develop essential workplace skills.';
    case 'Personalized Career Advice':
      return 'Based on your interests and strengths, Gahigi offers tailored guidance to help you find the right career path.';
    case 'Job Market Insights':
      return 'Gahigi keeps you informed about entry-level opportunities in Rwandas job market.';
    default:
      return '';
  }
}

function getFeatureTitle(feature: string): string {
  switch (feature) {
    case 'Interview Practice':
      return 'Ace Your Interviews';
    case 'Skill-building Exercises':
      return 'Develop Essential Skills';
    case 'Personalized Career Advice':
      return 'Get Tailored Guidance';
    case 'Job Market Insights':
      return 'Stay Informed on Opportunities';
    default:
      return '';
  }
}

export default LandingPage;