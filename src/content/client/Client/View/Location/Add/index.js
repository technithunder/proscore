import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'src/theme/Styles/styles.css';
import {
  Card,
  Box,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Zoom
} from '@mui/material';
import {
  addClientLocation,
  singleClientLocation,
  editClientLocation
} from 'src/api/client/client/location';
import { convertToNormalNumber } from 'src/utils/utils';
import InputNumber from 'src/components/InputNumber';
import ProgressBar from 'src/components/ProgressBar';
import { OnlyLetters, AlphaNumeric } from 'src/constants/validations';

const AddLocation = ({
  id,
  clientLocationId,
  onCancelContactForm,
  onClick
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: '',
    email: '',
    address1: '',
    contactNumber: '',
    address2: '',
    city: '',
    state: '',
    zip: ''
  });

  useEffect(() => {
    setLoading(true);
    if (id && clientLocationId) {
      singleClientLocation(clientLocationId)
        .then((res) => {
          if (res) {
            setInitialValues(res?.data?.data);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clientLocationId, id]);

  return (
    <>
      <Card>
        <Box p={2}>
          {loading && clientLocationId ? (
            <>
              <ProgressBar />
            </>
          ) : (
            <>
              <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                  title: Yup.string().trim().required(t('Required')).matches(OnlyLetters.regexPattern, OnlyLetters.errorMessage),
                  email: Yup.string()
                    .email(t('The email should be a valid'))
                    .trim()
                    .required(t('Required')),
                  address1: Yup.string().trim().required(t('Required')).matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage),
                  address2: Yup.string().nullable().matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage),
                  contactNumber: Yup.string()
                    .trim()
                    .required(t('Required'))
                    .test(
                      'is-ten-digits',
                      t('Contact Number must be 10 digits'),
                      (value) =>
                        value ? value.replace(/\D/g, '').length === 10 : false
                    ),
                  city: Yup.string().trim().required(t('Required')).matches(OnlyLetters.regexPattern, OnlyLetters.errorMessage),
                  state: Yup.string().trim().required(t('Required')).matches(OnlyLetters.regexPattern, OnlyLetters.errorMessage),
                  zip: Yup.string().trim().required(t('Required')).min(5).max(5)
                })}
                onSubmit={async (
                  _values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  let obj = {
                    clientId: id,
                    title: _values.title ? _values.title.trim() : '',
                    address1: _values.address1 ? _values.address1.trim() : '',
                    address2: _values.address2 ? _values.address2.trim() : '',
                    email: _values.email ? _values.email.trim() : '',
                    contactNumber: convertToNormalNumber(
                      _values.contactNumber ? _values.contactNumber.trim() : ''
                    ),
                    city: _values.city ? _values.city.trim() : '',
                    state: _values.state ? _values.state.trim() : '',
                    zip: _values.zip ? _values.zip.trim() : ''
                  };
                  if (clientLocationId) {
                    obj['clientLocationId'] = clientLocationId.clientLocationId;
                    await editClientLocation(obj)
                      .then((res) => {
                        if (res) {
                          onClick();
                          enqueueSnackbar(t('Record Updated Successfully'), {
                            variant: 'success',
                            anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'right'
                            },
                            TransitionComponent: Zoom
                          });
                          navigate(`/partner/view/${id}`);
                        }
                      })
                      .catch((err) => {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                      });
                  } else {
                    await addClientLocation(obj)
                      .then((res) => {
                        if (res) {
                          onClick();
                          enqueueSnackbar(t('Record Added Successfully'), {
                            variant: 'success',
                            anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'right'
                            },
                            TransitionComponent: Zoom
                          });
                          navigate(`/partner/view/${id}`);
                        }
                      })
                      .catch((err) => {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                      });
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
                          name="title"
                          helperText={touched.title && errors.title}
                          error={Boolean(touched.title && errors.title)}
                          value={values.title}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          label={t('Title')}
                          placeholder={t('Title')}
                        />
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
                          placeholder={t('Email')}
                        />
                      </Grid>

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
                          label={t('Address 1')}
                          placeholder={t('Address 1')}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InputNumber
                          mask="(999) 999-9999"
                          value={values.contactNumber}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name="contactNumber"
                          helperText={
                            touched.contactNumber && errors.contactNumber
                          }
                          error={Boolean(
                            touched.contactNumber && errors.contactNumber
                          )}
                          label={t('Contact Number')}
                          placeholder={t('Contact Number')}
                          inputProps={{ maxLength: 14 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="address2"
                          value={values.address2}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          label={t('Address 2')}
                          placeholder={t('Address 2')}
                          helperText={
                            touched.address2 && errors.address2
                          }
                          error={Boolean(
                            touched.address2 && errors.address2
                          )}
                        />
                      </Grid>

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
                          placeholder={t('City')}
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
                          placeholder={t('State')}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="zip"
                          helperText={touched.zip && errors.zip}
                          error={Boolean(touched.zip && errors.zip)}
                          value={values.zip}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            let inputValue = e.target.value;
                            if (inputValue.length > 5) {
                              inputValue = inputValue.slice(0, 5);
                            }
                            setFieldValue('zip', inputValue);
                          }}
                          variant="outlined"
                          label={t('Zip')}
                          placeholder={t('Zip')}
                          type="number"
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
                        onClick={onCancelContactForm}
                        color="primary"
                      >
                        {t('Cancel')}
                      </Button>
                    </Stack>
                  </form>
                )}
              </Formik>
            </>
          )}
        </Box>
      </Card>
    </>
  );
};

export default AddLocation;
