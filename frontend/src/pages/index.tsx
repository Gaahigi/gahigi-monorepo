import { useTranslation } from "react-i18next";
import { Container, Grid2 as Grid, Stack, Typography } from "@mui/material";
import Signup from "@/components/signup/Signup";
import Login from "@/components/Login/Login";
import AppButton from "@/components/Button/AppButton";
import Link from 'next/link';

export default function Home() {
  const { t } = useTranslation();

  return (
    <Grid >
      <Link href="/login">
        <AppButton>Get Started</AppButton>
      </Link>
    </Grid>
  );
}
