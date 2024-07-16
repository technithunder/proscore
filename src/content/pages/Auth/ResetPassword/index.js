import { useState, forwardRef } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  TextField,
  Container,
  Button,
  styled,
  Stack,
  CircularProgress,
  Typography,
  Alert,
  Avatar,
  Dialog,
  Collapse,
  Slide,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import useRefMounted from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';
import Logo from 'src/components/LogoSign';
import { useNavigate } from 'react-router-dom';
import { resetEmployeeUserPassword } from 'src/api';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import { encryptText } from 'src/utils/utils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function RecoverPassword() {
  const { t } = useTranslation();
  const isMountedRef = useRefMounted();
  const navigate = useNavigate();
  const [validationMessage, setValidationMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlert] = useState(true);
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const url = new URL(window.location.href);
  const employeeId = url.searchParams.get('employeeId');

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

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
                {t('Reset Password')}
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
                password: '',
                cpassword: ''
              }}
              validationSchema={Yup.object().shape({
                password: Yup.string().required(t('Required')),
                cpassword: Yup.string().required(t('Required'))
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                if (values.password !== values.cpassword) {
                  setValidationMessage('Password not match');
                  return;
                }

                let obj = {
                  password: encryptText(values.cpassword),
                  employeeId: employeeId
                };

                await resetEmployeeUserPassword(obj)
                  .then((res) => {
                    console.log(res);
                    if (res.status === 200) {
                      navigate('/dashboard');
                      handleOpenDialog();
                      setMessage(res?.data?.message);
                      setStatus({ success: true });
                      setSubmitting(false);
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
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label={t('Password')}
                    margin="normal"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    variant="outlined"
                    type={passwordVisible ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {passwordVisible ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    error={Boolean(touched.cpassword && errors.cpassword)}
                    fullWidth
                    helperText={touched.cpassword && errors.cpassword}
                    label={t('Confirm Password')}
                    margin="normal"
                    name="cpassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.cpassword}
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {confirmPasswordVisible ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />

                  {validationMessage && (
                    <Alert severity="error">{validationMessage}</Alert>
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
                    {t('Reset Password')}
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
            <Alert>{message}</Alert>
          </Collapse>

          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleCloseDialog}
          >
            {t('Continue to login')}
          </Button>
        </Box>
      </DialogWrapper>
    </>
  );
}

export default RecoverPassword;
