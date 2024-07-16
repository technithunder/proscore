import { Box, Typography, Container, styled, Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import useAuth from 'src/hooks/useAuth';
// import Auth0Login from '../LoginAuth0';
// import FirebaseAuthLogin from '../LoginFirebaseAuth';
import JWTLogin from '../LoginJWT';
// import AmplifyLogin from '../LoginAmplify';
import { useTranslation } from 'react-i18next';
import Logo from 'src/components/LogoSign';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  () => `
  display: flex;
  width: 100%;
  flex: 1;
  padding: 20px;
  background-color:#fff;
`
);

function LoginBasic() {
  const { method } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Login - Basic</title>
      </Helmet>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
            <Box
              sx={{
                mt: 3,
                px: 4,
                pt: 5,
                pb: 3
              }}
            >
              <Stack alignItems="center" justifyContent="center" spacing={2}>
                <Logo />
              </Stack>
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1,
                    color: '#000'
                  }}
                >
                  {t('Log In')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3,
                    color: '#000'
                  }}
                >
                  {t('Fill in the fields below to Log Into your account.')}
                </Typography>
              </Box>
              {method === 'JWT' && <JWTLogin />}
            </Box>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default LoginBasic;
