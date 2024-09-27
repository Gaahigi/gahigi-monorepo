import { useTranslation } from 'react-i18next';
import { Container, Typography, Button } from '@mui/material';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {t('welcome')}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t('description')}
      </Typography>
      <Button variant="contained" color="primary">
        {t('getStarted')}
      </Button>
    </Container>
  );
}
