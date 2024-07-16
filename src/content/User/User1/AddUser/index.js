import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  Divider,
  Box,
  Grid,
  Button,
  TextField,
  Autocomplete,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  CircularProgress,
  Stack
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { Helmet } from 'react-helmet-async';

const genderOptions = [{ title: 'Male' }, { title: 'Female' }];

const countries = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Germany', value: 'DE' }
  // Add more countries as needed
];

const AddUser = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <Card sx={{ m: 3 }}>
        <CardHeader title={t('Add User')} />
        <Divider />
        <Box p={2}>
          <Formik
            initialValues={{
              fname: '',
              lname: '',
              gender: '',
              email: '',
              textbox: '',
              date: null,
              selectedCountry: null
            }}
            validationSchema={Yup.object().shape({
              fname: Yup.string().max(255).required(t('Required')),
              lname: Yup.string().max(255).required(t('Required')),
              gender: Yup.string().max(255).required(t('Required')),
              email: Yup.string()
                .email(t('The email should be a valid'))
                .max(255)
                .required(t('Required')),
              date: Yup.date()
                .nullable()
                .required(t('Required'))
                .test(
                  'date-future',
                  t('Selected date must be in the future'),
                  (value) => {
                    return value === null || value > new Date();
                  }
                ),
              selectedCountry: Yup.object().nullable().required('Required'),
              textbox: Yup.string().max(255).required(t('Required'))
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
                navigate('/user/user1');
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
                </Grid>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={6}>
                    {/* <Autocomplete
                      sx={{
                        m: 0
                      }}
                      getOptionLabel={(option) => option.title}
                      options={gender}
                      value={
                        gender.find(
                          (option) => option.title === values.gender
                        ) || null
                      }
                      onChange={handleChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          value={values.gender}
                          helperText={touched.gender && errors.gender}
                          error={Boolean(touched.gender && errors.gender)}
                          name="gender"
                          label={t('Select Gender')}
                          placeholder={t('Select Gender ')}
                        />
                      )}
                    /> */}
                    <FormControl
                      component="fieldset"
                      error={Boolean(touched.gender && errors.gender)}
                    >
                      <FormLabel component="legend">
                        {t('Select Gender')}
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-label="gender"
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                      >
                        {genderOptions.map((option) => (
                          <FormControlLabel
                            key={option.title}
                            value={option.title}
                            control={<Radio />}
                            label={option.title}
                          />
                        ))}
                      </RadioGroup>
                      <FormHelperText>
                        {touched.gender && errors.gender}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="email"
                      helperText={touched.email && errors.email}
                      error={Boolean(touched.email && errors.email)}
                      value={values.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Email')}
                      placeholder={t('Email ')}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      value={values.date}
                      onChange={(newValue) => {
                        setFieldValue('date', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder={t('Select date')}
                          error={Boolean(touched.date && errors.date)}
                          helperText={touched.date && errors.date}
                        />
                      )}
                      inputFormat="dd/MM/yyyy"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      multiline
                      helperText={touched.textbox && errors.textbox}
                      error={Boolean(touched.textbox && errors.textbox)}
                      value={values.textbox}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      rows={4}
                      name="textbox"
                      variant="outlined"
                      label={t('Sale price')}
                      placeholder={t('Sale price here ')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="selectedCountry"
                      name="selectedCountry"
                      options={countries}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={values.selectedCountry}
                      onChange={(event, newValue) => {
                        setFieldValue('selectedCountry', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Country"
                          variant="outlined"
                          fullWidth
                          error={Boolean(
                            touched.selectedCountry && errors.selectedCountry
                          )}
                          helperText={
                            touched.selectedCountry && errors.selectedCountry
                          }
                        />
                      )}
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
                    onClick={() => navigate('/user/user1')}
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

export default AddUser;
