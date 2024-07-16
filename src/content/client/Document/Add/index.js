import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import PageFormHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {
  Card,
  Box,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Autocomplete,
  Typography
} from '@mui/material';

import { useNavigate, useParams } from 'react-router-dom';

const documenttypes = [
  { label: 'Document Type 1', value: '1' },
  { label: 'Document Type 2', value: '2' },
  { label: 'Document Type 3', value: '3' },
  { label: 'Document Type 4', value: '4' }
  // Add more countries as needed
];
const ClientContact = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Profile - Client</title>
      </Helmet>
      <PageTitleWrapper>
        <PageFormHeader
          Component={Box}
          heading={t('Add Document')}
          description={'Fill in the below to add document'}
          pathname={`/client/client/view/${id}`}
          buttonHeading={t('Go back to all Document')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <Card sx={{ mx: 3 }}>
        <Box p={2}>
          <Formik
            initialValues={{
              // clientId: '',
              documenttypeid: null,
              // documentname: '',
              documentUpload: null
            }}
            validationSchema={Yup.object().shape({
              // clientId: Yup.string().max(255).required(t('Required')),
              documenttypeid: Yup.object().nullable().required('Required'),
              // documentname: Yup.string().max(255).required(t('Required')),
              documentUpload: Yup.mixed()
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
                })
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
                navigate('/client/document');
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
              handleSubmit,
              isSubmitting,
              touched,
              values,
              setFieldValue
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="documenttypeid"
                      name="documenttypeid"
                      options={documenttypes}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={values.documenttypeid}
                      onChange={(event, newValue) => {
                        // Set the selected country to form values
                        setFieldValue('documenttypeid', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Document"
                          variant="outlined"
                          fullWidth
                          error={Boolean(
                            touched.documenttypeid && errors.documenttypeid
                          )}
                          helperText={
                            touched.documenttypeid && errors.documenttypeid
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="subtitle1">Document</Typography>
                      <TextField
                        type="file"
                        accept=".jpeg, .jpg, .png"
                        onChange={(event) =>
                          setFieldValue(
                            'documentUpload',
                            event.currentTarget.files[0]
                          )
                        }
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.documentUpload && errors.documentUpload
                        )}
                        helperText={
                          touched.documentUpload && errors.documentUpload
                        }
                      />
                    </Stack>
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
        </Box>
      </Card>
    </>
  );
};

export default ClientContact;
