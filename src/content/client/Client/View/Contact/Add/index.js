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
  Zoom,
  Autocomplete
} from '@mui/material';
import {
  addContact,
  singleContact,
  editContact
} from 'src/api/client/client/contact';
import { convertToNormalNumber } from 'src/utils/utils';
import InputNumber from 'src/components/InputNumber';
import ProgressBar from 'src/components/ProgressBar';
import { OnlyLetters } from 'src/constants/validations';

const AddContact = ({
  id,
  clientContactId,
  onCancelContactForm,
  onClick,
  contactType
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    cellPhone: '',
    officePhone: '',
    jobTitle: '',
    contactTypeId: null
  });

  useEffect(() => {
    setLoading(true);
    if (id && clientContactId) {
      singleContact(clientContactId)
        .then((res) => {
          if (res) {
            const x = contactType.find(
              (e) => e.value === res?.data?.data?.contactTypeId
            );
            setInitialValues(res.data.data);
            setInitialValues({
              ...res.data.data,
              contactTypeId: x
            });
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clientContactId, id]);

  return (
    <>
      <Card>
        <Box p={2}>
          {loading && clientContactId ? (
            <>
              <ProgressBar />
            </>
          ) : (
            <>
              <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                  firstName: Yup.string()
                    .trim()
                    .required(t('Required'))
                    .matches(
                      OnlyLetters.regexPattern,
                      OnlyLetters.errorMessage
                    ),
                  middleName: Yup.string()
                    .nullable()
                    .matches(
                      OnlyLetters.regexPattern,
                      OnlyLetters.errorMessage
                    ),
                  lastName: Yup.string()
                    .trim()
                    .required(t('Required'))
                    .matches(
                      OnlyLetters.regexPattern,
                      OnlyLetters.errorMessage
                    ),
                  officePhone: Yup.string()
                    .trim()
                    .required(t('Required'))
                    .test(
                      'is-ten-digits',
                      t('Office Phone Number must be 10 digits'),
                      (value) =>
                        value ? value.replace(/\D/g, '').length === 10 : false
                    ),
                  jobTitle: Yup.string()
                    .trim()
                    .required(t('Required'))
                    .matches(
                      OnlyLetters.regexPattern,
                      OnlyLetters.errorMessage
                    ),
                  email: Yup.string()
                    .email(t('The email should be a valid'))
                    .trim()
                    .required(t('Required')),
                  cellPhone: Yup.string()
                    .trim()
                    .required(t('Required'))
                    .test(
                      'is-ten-digits',
                      t('Cell Phone Number must be 10 digits'),
                      (value) =>
                        value ? value.replace(/\D/g, '').length === 10 : false
                    ),
                  contactTypeId: Yup.object().nullable().required('Required')
                })}
                onSubmit={async (
                  _values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  let obj = {
                    clientId: id,
                    firstName: _values.firstName.trim(),
                    middleName: _values.middleName.trim(),
                    lastName: _values.lastName.trim(),
                    email: _values.email.trim(),
                    cellPhone: convertToNormalNumber(_values.cellPhone.trim()),
                    officePhone: convertToNormalNumber(
                      _values.officePhone.trim()
                    ),
                    jobTitle: _values.jobTitle.trim(),
                    contactTypeId: _values.contactTypeId.value
                  };
                  if (clientContactId) {
                    obj['clientContactId'] = clientContactId.clientContactId;
                    await editContact(obj)
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
                    await addContact(obj)
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
                        <Autocomplete
                          id="contactTypeId"
                          name="contactTypeId"
                          options={contactType}
                          value={values.contactTypeId}
                          onChange={(event, newValue) => {
                            setFieldValue('contactTypeId', newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Contact Type"
                              variant="outlined"
                              fullWidth
                              error={Boolean(
                                touched.contactTypeId && errors.contactTypeId
                              )}
                              helperText={
                                touched.contactTypeId && errors.contactTypeId
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="firstName"
                          helperText={touched.firstName && errors.firstName}
                          error={Boolean(touched.firstName && errors.firstName)}
                          value={values.firstName}
                          onBlur={handleBlur}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            setFieldValue('firstName', inputValue);
                            // if (/^[A-Za-z ]*$/.test(inputValue)) {
                            //   setFieldValue('firstName', inputValue);
                            // } else {
                            //   setFieldValue('firstName', '');
                            // }
                          }}
                          variant="outlined"
                          label={t('First Name')}
                          placeholder={t('First Name')}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="middleName"
                          helperText={touched.middleName && errors.middleName}
                          error={Boolean(
                            touched.middleName && errors.middleName
                          )}
                          value={values.middleName}
                          onBlur={handleBlur}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            setFieldValue('middleName', inputValue);
                            // if (/^[A-Za-z ]*$/.test(inputValue)) {
                            //   setFieldValue('middleName', inputValue);
                            // } else {
                            //   setFieldValue('middleName', '');
                            // }
                          }}
                          variant="outlined"
                          label={t('Middle Name')}
                          placeholder={t('Middle Name')}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="lastName"
                          helperText={touched.lastName && errors.lastName}
                          error={Boolean(touched.lastName && errors.lastName)}
                          value={values.lastName}
                          onBlur={handleBlur}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            setFieldValue('lastName', inputValue);
                            // if (/^[A-Za-z ]*$/.test(inputValue)) {
                            //   setFieldValue('lastName', inputValue);
                            // } else {
                            //   setFieldValue('lastName', '');
                            // }
                          }}
                          variant="outlined"
                          label={t('Last Name')}
                          placeholder={t('Last Name')}
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
                        <InputNumber
                          mask="(999) 999-9999"
                          value={values.cellPhone}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name="cellPhone"
                          helperText={touched.cellPhone && errors.cellPhone}
                          error={Boolean(touched.cellPhone && errors.cellPhone)}
                          label={t('Cell Phone')}
                          placeholder={t('Cell Phone')}
                          inputProps={{ maxLength: 14 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InputNumber
                          mask="(999) 999-9999"
                          value={values.officePhone}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name="officePhone"
                          helperText={touched.officePhone && errors.officePhone}
                          error={Boolean(
                            touched.officePhone && errors.officePhone
                          )}
                          label={t('Office Number')}
                          placeholder={t('Office Number')}
                          inputProps={{ maxLength: 14 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="jobTitle"
                          helperText={touched.jobTitle && errors.jobTitle}
                          error={Boolean(touched.jobTitle && errors.jobTitle)}
                          value={values.jobTitle}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          label={t('Job Title')}
                          placeholder={t('Job Title')}
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

export default AddContact;
