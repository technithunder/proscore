import { useState, forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  TextField,
  Container,
  Alert,
  Slide,
  Dialog,
  Collapse,
  Button,
  Avatar,
  styled,
  Stack,
  CircularProgress,
  Typography
} from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';
import Logo from 'src/components/LogoSign';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import { useLocation, useNavigate } from 'react-router-dom';
import { clientUserResetURL, validateOTP } from 'src/api';

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

function Otp() {
  const { t } = useTranslation();
  const isMountedRef = useRefMounted();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const key = queryParams.get('key');

  const [openAlert] = useState(true);
  const userGuidId = localStorage.getItem('clientUserGuid');
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate('/reset-password');
  };

  useEffect(() => {
    if (key) {
      clientUserResetURL(encodeURIComponent(key))
        .then((res) => {
          console.log('res', res.data);
        })
        .catch((e) => console.log(e));
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>OTP</title>
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
                {t('OTP')}
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
                otp: ''
              }}
              validationSchema={Yup.object().shape({
                otp: Yup.string().max(255).required(t('Required'))
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                let obj = {
                  otp: values.otp,
                  userGuid: userGuidId
                };
                await validateOTP(obj)
                  .then((res) => {
                    if (res.data.success) {
                      setStatus({ success: true });
                      handleOpenDialog();
                      setSubmitting(false);
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
                    error={Boolean(touched.otp && errors.otp)}
                    fullWidth
                    helperText={touched.otp && errors.otp}
                    label={t('Enter OTP')}
                    margin="normal"
                    name="otp"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="otp"
                    value={values.otp}
                    variant="outlined"
                  />
                  {errorMessage && (
                    <Typography color="error">{errorMessage}</Typography>
                  )}
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
                    {t('Validate OTP')}
                  </Button>
                </form>
              )}
            </Formik>
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

          <Collapse in={openAlert}>
            <Alert>{t('Your OTP has been confirmed.')}</Alert>
          </Collapse>

          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleCloseDialog}
          >
            {t('Continue to reset password')}
          </Button>
        </Box>
      </DialogWrapper>
    </>
  );
}

export default Otp;
