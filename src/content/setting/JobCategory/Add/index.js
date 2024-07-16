import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Box,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Stack
} from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const AddJobCategory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Add Job Category - Settings</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add Job Category')}
          description={'Fill in the below to add job category '}
          pathname={'/setting/jobcategory'}
          buttonHeading={t('Go back to all job category')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>

      <Card sx={{ mx: 3 }}>
        <Box p={2}>
          <Formik
            initialValues={{
              name: '',
              description: ''
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().max(255).required(t('Required')),
              description: Yup.string().max(255).required(t('Required'))
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
                navigate('/setting/jobcategory');
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
                      name="name"
                      helperText={touched.name && errors.name}
                      error={Boolean(touched.name && errors.name)}
                      value={values.name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Job Category Name')}
                      placeholder={t('Job Category Name')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="description"
                      helperText={touched.description && errors.description}
                      error={Boolean(touched.description && errors.description)}
                      value={values.description}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Job Category Description')}
                      placeholder={t('Job Category Description')}
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
                    onClick={() => navigate('/setting/jobcategory')}
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

export default AddJobCategory;
