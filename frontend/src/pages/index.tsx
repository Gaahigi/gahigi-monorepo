import { useTranslation } from "react-i18next";
import { Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import Signup from "@/components/signup/Signup";
import Login from "@/components/Login/Login";

export default function Home() {
  const { t } = useTranslation();

  return (
    <Grid >
      <Login />
      </Grid>
   
  );
}
