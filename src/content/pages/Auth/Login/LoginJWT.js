import { createContext, useState } from 'react';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import { Formik } from 'formik';

import {
  Box,
  Button,
  TextField,
  CircularProgress,
  ThemeProvider,
  Typography,
  Link,
  InputAdornment,
  IconButton
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';

import '@mui/lab/themeAugmentation';

import { PureLightTheme } from 'src/theme/schemes/PureLightTheme';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const ThemeContext = createContext();

const LoginJWT = () => {
  const { login, message } = useAuth();

  const isMountedRef = useRefMounted();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ThemeContext.Provider value={'PureLightTheme'}>
      <ThemeProvider theme={PureLightTheme}>
        <Formik
          initialValues={{
            userName: '',
            password: ''
          }}
          validationSchema={Yup.object().shape({
            userName: Yup.string().required(t('Required')),
            password: Yup.string().required(t('Required'))
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              await login(values.userName, values.password);

              if (isMountedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
              }
            } catch (err) {
              if (isMountedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <TextField
                error={Boolean(touched.userName && errors.userName)}
                fullWidth
                margin="normal"
                helperText={touched.userName && errors.userName}
                label={t('Username')}
                name="userName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.userName}
                variant="outlined"
              />
              <TextField
                error={Boolean(touched.password && errors.password)}
                fullWidth
                margin="normal"
                helperText={touched.password && errors.password}
                label={t('Password')}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {message && <Typography color="error">{message}</Typography>}
              <Box alignItems="center" display="flex" justifyContent="center">
                <Link component={RouterLink} to="/forgot-password">
                  <b>{t('Forgot password?')}</b>
                </Link>
              </Box>

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
                {t('Log In')}
              </Button>
            </form>
          )}
        </Formik>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default LoginJWT;
