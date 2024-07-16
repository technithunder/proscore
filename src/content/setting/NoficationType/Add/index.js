import React from 'react';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { Formik } from 'formik';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  CircularProgress,
  Grid
} from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AddNotificationType = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Add notification type - Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add notification type')}
          description={'Fill in the below to add notification'}
          pathname={'/setting/notification-type'}
          buttonHeading={t('Go back to all notification type')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <Card sx={{ mx: 3 }}>
        <Box p={2}>
          <Formik
            initialValues={{
              notificationType: ''
            }}
            validationSchema={Yup.object().shape({
              notificationType: Yup.string().max(255).required(t('Required'))
            })}
            onSubmit={async (
              _values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                console.log('===>', _values);
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                navigate('/setting/notification-type');
              } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
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
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="notificationType"
                      helperText={
                        touched.notificationType && errors.notificationType
                      }
                      error={Boolean(
                        touched.notificationType && errors.notificationType
                      )}
                      value={values.notificationType}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('NotificationType')}
                      placeholder={t('NotificationType')}
                    />
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2} mt={5}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    color="primary"
                  >
                    {t('Submit')}
                  </Button>
                  <Button
                    variant="outlined"
                    type="submit"
                    onClick={() => navigate('/setting/notification-type')}
                    color="primary"
                  >
                    {t('Cancel')}
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>
      </Card>
    </>
  );
};

export default AddNotificationType;
