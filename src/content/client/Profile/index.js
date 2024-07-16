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
  Stack,
  Typography
} from '@mui/material';
import PageFormHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { useNavigate } from 'react-router-dom';

const ClientProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Profile - Client</title>
      </Helmet>
      <PageTitleWrapper>
        <PageFormHeader
          Component={Box}
          heading={t('Add Profile')}
          description={'Fill in the below to add profile'}
          pathname={'/client/document'}
        />
      </PageTitleWrapper>
      <Card sx={{ mx: 3 }}>
        <Box p={2}>
          <Formik
            initialValues={{
              cname: '',
              fname: '',
              lname: '',
              website: '',
              address1: '',
              address2: '',
              city: '',
              state: '',
              zip: '',
              logo: null,
              cemail: '',
              cphone: '',
              title: '',
              inviteCode: '',
              dunsNumber: '',
              textId: '',
              industrySector: ''
            }}
            validationSchema={Yup.object().shape({
              cname: Yup.string().max(255).required(t('Required')),
              fname: Yup.string().max(255).required(t('Required')),
              lname: Yup.string().max(255).required(t('Required')),
              website: Yup.string().max(255).required(t('Required')),
              address1: Yup.string().max(255).required(t('Required')),
              address2: Yup.string().max(255).required(t('Required')),
              city: Yup.string().max(255).required(t('Required')),
              state: Yup.string().max(255).required(t('Required')),
              zip: Yup.string().max(255).required(t('Required')),
              logo: Yup.mixed()
                .required('Required')
                .test('fileSize', 'File size is too large', (value) => {
                  return value && value.size <= 5000000; // 5MB limit
                })
                .test('fileFormat', 'Unsupported file format', (value) => {
                  return (
                    value &&
                    ['image/jpeg', 'image/png', 'image/jpg'].includes(
                      value.type
                    )
                  );
                }),
              cemail: Yup.string()
                .email(t('The email should be a valid'))
                .max(255)
                .required(t('Required')),
              cphone: Yup.string().max(255).required(t('Required')),
              title: Yup.string().max(255).required(t('Required')),
              inviteCode: Yup.string().max(255).required(t('Required')),
              dunsNumber: Yup.string().max(255).required(t('Required')),
              textId: Yup.string().max(255).required(t('Required')),
              industrySector: Yup.string().max(255).required(t('Required'))
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
                navigate('/dashboard');
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
              values,
              setFieldValue
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="cname"
                      helperText={touched.cname && errors.cname}
                      error={Boolean(touched.cname && errors.cname)}
                      value={values.cname}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Company Name')}
                      placeholder={t('Company Name')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="fname"
                      helperText={touched.fname && errors.fname}
                      error={Boolean(touched.fname && errors.fname)}
                      value={values.fname}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('First Name')}
                      placeholder={t('First Name ')}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="lname"
                      helperText={touched.lname && errors.lname}
                      error={Boolean(touched.lname && errors.lname)}
                      value={values.lname}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Last Name')}
                      placeholder={t('Last Name ')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="website"
                      helperText={touched.website && errors.website}
                      error={Boolean(touched.website && errors.website)}
                      value={values.website}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Website')}
                      placeholder={t('Website ')}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="address1"
                      helperText={touched.address1 && errors.address1}
                      error={Boolean(touched.address1 && errors.address1)}
                      value={values.address1}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Address1')}
                      placeholder={t('Address1 ')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="address2"
                      helperText={touched.address2 && errors.address2}
                      error={Boolean(touched.address2 && errors.address2)}
                      value={values.address2}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Address2')}
                      placeholder={t('Address2')}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="city"
                      helperText={touched.city && errors.city}
                      error={Boolean(touched.city && errors.city)}
                      value={values.city}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('City')}
                      placeholder={t('City ')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="state"
                      helperText={touched.state && errors.state}
                      error={Boolean(touched.state && errors.state)}
                      value={values.state}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('State')}
                      placeholder={t('State ')}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="zip"
                      helperText={touched.zip && errors.zip}
                      error={Boolean(touched.zip && errors.zip)}
                      value={values.zip}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Zip')}
                      placeholder={t('Zip ')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="subtitle1">Logo</Typography>
                      <TextField
                        type="file"
                        accept=".jpeg, .jpg, .png"
                        onChange={(event) =>
                          setFieldValue('logo', event.currentTarget.files[0])
                        }
                        onBlur={handleBlur}
                        error={Boolean(touched.logo && errors.logo)}
                        helperText={touched.logo && errors.logo}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="cemail"
                      helperText={touched.cemail && errors.cemail}
                      error={Boolean(touched.cemail && errors.cemail)}
                      value={values.cemail}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Company Email')}
                      placeholder={t('Company Email ')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="cphone"
                      helperText={touched.cphone && errors.cphone}
                      error={Boolean(touched.cphone && errors.cphone)}
                      value={values.cphone}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Company Number')}
                      placeholder={t('Company Number')}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="title"
                      helperText={touched.title && errors.title}
                      error={Boolean(touched.title && errors.title)}
                      value={values.title}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Title')}
                      placeholder={t('Title ')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="inviteCode"
                      helperText={touched.inviteCode && errors.inviteCode}
                      error={Boolean(touched.inviteCode && errors.inviteCode)}
                      value={values.inviteCode}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Invitation Code')}
                      placeholder={t('Invitation Code ')}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="dunsNumber"
                      helperText={touched.dunsNumber && errors.dunsNumber}
                      error={Boolean(touched.dunsNumber && errors.dunsNumber)}
                      value={values.dunsNumber}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('DunsNumber')}
                      placeholder={t('DunsNumber ')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="textId"
                      helperText={touched.textId && errors.textId}
                      error={Boolean(touched.textId && errors.textId)}
                      value={values.textId}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('TAXId')}
                      placeholder={t('TAXId ')}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="industrySector"
                      helperText={
                        touched.industrySector && errors.industrySector
                      }
                      error={Boolean(
                        touched.industrySector && errors.industrySector
                      )}
                      value={values.industrySector}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('IndustrySector')}
                      placeholder={t('IndustrySector ')}
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
                    onClick={() => navigate('/dashboard')}
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

export default ClientProfile;
