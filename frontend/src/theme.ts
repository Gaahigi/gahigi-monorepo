import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5733',
    },
  },
  components: {
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            color: '#FF5733',
          },
          '&.Mui-completed': {
            color: '#FF5733',
          },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: '#FF5733',
        },
      },
    },
  },
});

export default theme;