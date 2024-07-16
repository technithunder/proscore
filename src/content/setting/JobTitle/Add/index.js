import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

const category = [
  { label: 'Category 1', value: '1' },
  { label: 'Category 2', value: '2' },
  { label: 'Category 3', value: '3' },
  { label: 'Category 4', value: '4' }
];

const compensationType = [
  { label: 'Compensation Type 1', value: '1' },
  { label: 'Compensation Type 2', value: '2' },
  { label: 'Compensation Type 3', value: '3' },
  { label: 'Compensation Type 4', value: '4' }
];

const bonusType = [
  { label: 'Bonus Type 1', value: '1' },
  { label: 'Bonus Type 2', value: '2' },
  { label: 'Bonus Type 3', value: '3' },
  { label: 'Bonus Type 4', value: '4' }
];

const AddJobTitle = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Add job title - Setting</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add job title')}
          description={'Fill in the below to add job title'}
          pathname={'/setting/job-title'}
          buttonHeading={t('Go back to all job title')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <Card sx={{ mx: 3 }}>
        <Box p={2}>
          <Formik
            initialValues={{
              category: null,
              compensationType: null,
              titleName: '',
              description: '',
              compensationAmount: '',
              bonusAmount: '',
              startDate: '',
              endDate: '',
              bonusType: null
            }}
            validationSchema={Yup.object().shape({
              category: Yup.object().nullable().required(t('Required')),
              compensationType: Yup.object().nullable().required(t('Required')),
              titleName: Yup.string().required(t('Required')),
              description: Yup.string().required(t('Required')),
              compensationAmount: Yup.string().required(t('Required')),
              bonusAmount: Yup.string().required(t('Required')),
              startDate: Yup.date()
                .nullable()
                .required(t('Required'))
                .test(
                  'date-future',
                  t('Selected date must be in the future'),
                  (value) => {
                    return value === null || value > new Date();
                  }
                ),
              endDate: Yup.date()
                .nullable()
                .required(t('Required'))
                .test(
                  'date-future',
                  t('Selected date must be in the future'),
                  (value) => {
                    return value === null || value > new Date();
                  }
                ),
              bonusType: Yup.object().nullable().required(t('Required'))
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
                navigate('/setting/job-title');
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
                    <Autocomplete
                      id="category"
                      name="category"
                      options={category}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={values.category}
                      onChange={(event, newValue) => {
                        setFieldValue('category', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Job Category"
                          variant="outlined"
                          fullWidth
                          error={Boolean(touched.category && errors.category)}
                          helperText={touched.category && errors.category}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="compensationType"
                      name="compensationType"
                      options={compensationType}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={values.compensationType}
                      onChange={(event, newValue) => {
                        setFieldValue('compensationType', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Compensation Type"
                          variant="outlined"
                          fullWidth
                          error={Boolean(
                            touched.compensationType && errors.compensationType
                          )}
                          helperText={
                            touched.compensationType && errors.compensationType
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="titleName"
                      helperText={touched.titleName && errors.titleName}
                      error={Boolean(touched.titleName && errors.titleName)}
                      value={values.titleName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Title Name')}
                      placeholder={t('Title Name ')}
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
                      label={t('Description')}
                      placeholder={t('Description ')}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="compensationAmount"
                      helperText={
                        touched.compensationAmount && errors.compensationAmount
                      }
                      error={Boolean(
                        touched.compensationAmount && errors.compensationAmount
                      )}
                      value={values.compensationAmount}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Compensation Amount')}
                      placeholder={t('Compensation Amount ')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="bonusAmount"
                      helperText={touched.bonusAmount && errors.bonusAmount}
                      error={Boolean(touched.bonusAmount && errors.bonusAmount)}
                      value={values.bonusAmount}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      label={t('Bonus Amount')}
                      placeholder={t('Bonus Amount ')}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} md={6}>
                    <Typography mb={1}>Start Date</Typography>
                    <DatePicker
                      value={values.startDate}
                      onChange={(newValue) => {
                        setFieldValue('startDate', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder={t('Start date')}
                          error={Boolean(touched.startDate && errors.startDate)}
                          helperText={touched.startDate && errors.startDate}
                        />
                      )}
                      inputFormat="dd-MM-yyyy"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography mb={1}>End Date</Typography>
                    <DatePicker
                      value={values.endDate}
                      onChange={(newValue) => {
                        setFieldValue('endDate', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder={t('End date')}
                          error={Boolean(touched.endDate && errors.endDate)}
                          helperText={touched.endDate && errors.endDate}
                        />
                      )}
                      inputFormat="dd-MM-yyyy"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="bonusType"
                      name="bonusType"
                      options={bonusType}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={values.bonusType}
                      onChange={(event, newValue) => {
                        setFieldValue('bonusType', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Bonus Type"
                          variant="outlined"
                          fullWidth
                          error={Boolean(touched.bonusType && errors.bonusType)}
                          helperText={touched.bonusType && errors.bonusType}
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
                    onClick={() => navigate('/setting/job-title')}
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

export default AddJobTitle;
