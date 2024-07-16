import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'src/theme/Styles/styles.css';
import {
  Card,
  Box,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Stack
} from '@mui/material';
import PageFormHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  addContact,
  singleContact,
  editContact
} from 'src/api/client/client/contact';

const AddContact = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id, clientcontactId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    cellPhone: '',
    officePhone: '',
    jobTitle: ''
  });

  useEffect(() => {
    setLoading(true);
    if (id) {
      singleContact({ clientContactId: clientcontactId })
        .then((res) => {
          if (res) {
            setInitialValues(res.data.data);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clientcontactId]);

  return (
    <>
      <Helmet>
        <title>
          {clientcontactId ? 'Edit Contact - Client' : 'Add Contact - Client'}
        </title>
      </Helmet>
      <PageTitleWrapper>
        <PageFormHeader
          Component={Box}
          heading={clientcontactId ? t('Edit Contact') : t('Add Contact')}
          description={
            clientcontactId
              ? t('Fill in the below to edit contact')
              : t('Fill in the below to add contact')
          }
          pathname={`/client/client/view/${id}`}
          buttonHeading={t('Go back to all contact')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <Card sx={{ mx: 3 }}>
        <Box p={2}>
          {loading && clientcontactId ? (
            <>
              <CircularProgress
                size="3rem"
                sx={{ display: 'flex', margin: '0 auto', my: 5 }}
              />
            </>
          ) : (
            <>
              <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                  firstName: Yup.string().trim().required(t('Required')),
                  middleName: Yup.string().trim().required(t('Required')),
                  lastName: Yup.string().trim().required(t('Required')),
                  officePhone: Yup.string().trim().required(t('Required')),
                  jobTitle: Yup.string().trim().required(t('Required')),
                  email: Yup.string()
                    .email(t('The email should be a valid'))
                    .trim()
                    .required(t('Required')),
                  cellPhone: Yup.string().trim().required(t('Required'))
                })}
                onSubmit={async (
                  _values,
                  { resetForm, setErrors, setStatus, setSubmitting }
                ) => {
                  let obj = {
                    clientId: id,
                    firstName: _values.firstName.trim(),
                    middleName: _values.middleName.trim(),
                    lastName: _values.lastName.trim(),
                    email: _values.email.trim(),
                    cellPhone: _values.cellPhone.trim(),
                    officePhone: _values.officePhone.trim(),
                    jobTitle: _values.jobTitle.trim()
                  };
                  if (clientcontactId) {
                    obj['clientContactId'] = clientcontactId;
                    await editContact(obj)
                      .then((res) => {
                        if (res) {
                          resetForm();
                          setStatus({ success: true });
                          setSubmitting(false);
                          navigate(`/client/client/view/${id}`);
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
                          resetForm();
                          setStatus({ success: true });
                          setSubmitting(false);
                          navigate(`/client/client/view/${id}`);
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
                  values
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="firstName"
                          helperText={touched.firstName && errors.firstName}
                          error={Boolean(touched.firstName && errors.firstName)}
                          value={values.firstName}
                          onBlur={handleBlur}
                          onChange={handleChange}
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
                          onChange={handleChange}
                          variant="outlined"
                          label={t('Middle Name')}
                          placeholder={t('Middle Name')}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={1} mt={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="lastName"
                          helperText={touched.lastName && errors.lastName}
                          error={Boolean(touched.lastName && errors.lastName)}
                          value={values.lastName}
                          onBlur={handleBlur}
                          onChange={handleChange}
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
                          label={t('Company Email')}
                          placeholder={t('Company Email')}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} mt={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="cellPhone"
                          helperText={touched.cellPhone && errors.cellPhone}
                          error={Boolean(touched.cellPhone && errors.cellPhone)}
                          value={values.cellPhone}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          label={t('Company Number')}
                          placeholder={t('Company Number')}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="officePhone"
                          helperText={touched.officePhone && errors.officePhone}
                          error={Boolean(
                            touched.officePhone && errors.officePhone
                          )}
                          value={values.officePhone}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          label={t('Office Number')}
                          placeholder={t('Office Number')}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={1} mt={2}>
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
                        onClick={() => navigate(`/client/client/view/${id}`)}
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
