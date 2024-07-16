import { useState, forwardRef } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Link,
  TextField,
  Typography,
  Container,
  Alert,
  Slide,
  Dialog,
  Collapse,
  Button,
  Avatar,
  styled,
  Stack,
  CircularProgress
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import useRefMounted from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';
import Logo from 'src/components/LogoSign';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import { forgotPassword } from 'src/api';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color:#fff;
`
);

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: ${theme.colors.shadows.success};
      top: -${theme.spacing(6)};
      position: absolute;
      left: 50%;
      margin-left: -${theme.spacing(6)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

function ForgotPassword() {
  const { t } = useTranslation();
  const isMountedRef = useRefMounted();
  const navigate = useNavigate();

  const [openAlert] = useState(true);
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate('/dashboard');
  };

  return (
    <>
      <Helmet>
        <title>Recover Password</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="sm">
          <Stack alignItems="center" justifyContent="center" spacing={2}>
            <Logo />
          </Stack>
          <Box
            sx={{
              mt: 3,
              p: 4
            }}
          >
            <Box>
              <Typography
                variant="h2"
                sx={{
                  mb: 1,
                  color: '#000'
                }}
              >
                {t('Forgot Password')}
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
                {t('Fill in the fields below to reset your account password.')}
              </Typography>
            </Box>
            <Formik
              initialValues={{
                username: '',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                username: Yup.string().max(255).required(t('Required'))
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                await forgotPassword(encodeURIComponent(values.username))
                  .then((res) => {
                    if (res.data.success) {
                      if (isMountedRef.current) {
                        localStorage.setItem(
                          'clientUserGuid',
                          res.data.data.clientUserGuid
                        );
                        setMessage(res.data.message);
                        setStatus({ success: true });
                        handleOpenDialog();
                        setSubmitting(false);
                      }
                    } else {
                      setErrorMessage(res.data.message);
                    }
                  })
                  .catch((err) => {
                    if (isMountedRef.current) {
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    }
                  });
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values,
                isSubmitting
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <TextField
                    error={Boolean(touched.username && errors.username)}
                    fullWidth
                    helperText={touched.username && errors.username}
                    label={t('Username')}
                    margin="normal"
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="username"
                    value={values.username}
                    variant="outlined"
                  />
                  {errorMessage && (
                    <Typography color="error" mb={1}>
                      {errorMessage}
                    </Typography>
                  )}
                  <Typography variant="subtitle1">
                    {t('Enter username to retrieve account details')}
                  </Typography>
                  <Button
                    sx={{
                      mt: 3
                    }}
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    disabled={isSubmitting}
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                  >
                    {t('Send me a new password')}
                  </Button>
                </form>
              )}
            </Formik>
          </Box>
          <Box textAlign="center" mr={5}>
            <Typography
              component="span"
              variant="subtitle2"
              color="text.primary"
              fontWeight="bold"
            >
              {t('Want to try to Log In again?')}
            </Typography>{' '}
            <Link component={RouterLink} to="/dashboard">
              <b>Login</b>
            </Link>
          </Box>
        </Container>
      </MainContent>

      <DialogWrapper
        open={openDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
      >
        <Box
          sx={{
            px: 4,
            pb: 4,
            pt: 10
          }}
        >
          <AvatarSuccess>
            <CheckTwoToneIcon />
          </AvatarSuccess>

          {message && (
            <Collapse in={openAlert}>
              <Alert>{message}</Alert>
            </Collapse>
          )}

          <Button
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            variant="contained"
            onClick={handleCloseDialog}
            // href="/dashboard"
          >
            {t('Continue to login')}
          </Button>
        </Box>
      </DialogWrapper>
    </>
  );
}

export default ForgotPassword;
