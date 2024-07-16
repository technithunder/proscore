import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Stack,
  TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Formik } from 'formik';
import { DatePicker } from '@mui/lab';
import {
  GetAllClients,
  GetAllProject,
  generatePDF
} from 'src/api/projects/Project';
import PageHeader from 'src/components/PageHeader';

const Report1 = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [clientType, setClientType] = useState([]);
  const [clientId, setClientId] = useState([]);
  const [projectType, setProjectType] = useState([]);
  const [initialValues, setInitialValues] = useState({
    ClientTypeId: null,
    projectTypeId: null,
    StartDate: null
  });

  const handleClear = () => {
    setInitialValues({
      projectTypeId: null,
      StartDate: null
    });
  };

  const fetchAllClients = async (clientId) => {
    if (clientId) {
      let obj = {
        pageIndex: 1,
        pageSize: 100,
        orderByAscending: true,
        searchString: '',
        projectId: clientId
      };
      await GetAllClients(obj)
        .then((res) => {
          if (res && res.data && res.data.data) {
            setClientType(
              res.data.data.map((item) => ({
                label: item.clientName,
                value: item.clientId
              }))
            );
          } else if (res.data.data == null) {
            setClientType([]);
          }
        })
        .catch((e) => console.log(e));
    }
  };

  const fetchAllEmployeeProjects = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    setLoading(true);
    await GetAllProject(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setLoading(false);
          setProjectType(
            res.data.data.map((item) => ({
              label: item.projectName,
              value: item.projectId
            }))
          );
        } else if (res.data.data == null) {
          setProjectType([]);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    setClientId('');
    fetchAllEmployeeProjects();
  }, []);

  useEffect(() => {
    if (clientId) {
      fetchAllClients(clientId.value);
    }
  }, [clientId]);
  return (
    <>
      <Helmet>
        <title>Calendar - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader Component={Box} heading={t('Certified Payroll Reports')} />
        <Box>
          {loading ? (
            <>
              <CircularProgress
                size="3rem"
                sx={{ display: 'flex', margin: '0 auto', my: 5 }}
              />
            </>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object().shape({
                ClientTypeId: Yup.object().nullable().required('Required'),
                projectTypeId: Yup.object().nullable().required('Required'),
                StartDate: Yup.date().nullable().required(t('Required'))
              })}
              onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting }
              ) => {
                try {
                  const obj = {
                    clientId: _values?.ClientTypeId.value,
                    projectId: _values?.projectTypeId.value,
                    weekEndingDate: _values?.StartDate?.toISOString()
                  };

                  await generatePDF(obj)
                    .then((res) => {
                      if (res && res.status === 200) {
                        const binaryData = atob(res.data);
                        const arrayBuffer = new ArrayBuffer(binaryData.length);
                        const view = new Uint8Array(arrayBuffer);
                        for (let i = 0; i < binaryData.length; i++) {
                          view[i] = binaryData.charCodeAt(i);
                        }
                        const blob = new Blob([arrayBuffer], {
                          type: 'application/pdf'
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'CertifiedPayrollReport.pdf';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        resetForm();
                        setStatus({ success: true });
                        setSubmitting(false);
                        handleClear();
                        setClientId('');
                      }
                    })
                    .catch((err) => {
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    });
                } catch (err) {
                  resetForm();
                  handleClear();
                  console.error(err);
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }}
            >
              {({
                errors,
                handleSubmit,
                isSubmitting,
                touched,
                values,
                setFieldValue
              }) => (
                <form onSubmit={handleSubmit}>
                  <Card sx={{ mx: 0, mb: 3 }}>
                    <Box p={2}>
                      <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Autocomplete
                              id="projectTypeId"
                              name="projectTypeId"
                              options={projectType}
                              getOptionLabel={(option) => option.label || ''}
                              getOptionValue={(option) => option.value || ''}
                              value={values.projectTypeId}
                              onChange={(event, newValue) => {
                                setFieldValue('projectTypeId', newValue);
                                setClientId(newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Project"
                                  variant="outlined"
                                  fullWidth
                                  error={Boolean(
                                    touched.projectTypeId &&
                                      errors.projectTypeId
                                  )}
                                  helperText={
                                    touched.projectTypeId &&
                                    errors.projectTypeId
                                  }
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Autocomplete
                              id="ClientTypeId"
                              name="ClientTypeId"
                              options={clientType}
                              getOptionLabel={(option) => option.label || ''}
                              getOptionValue={(option) => option.value || ''}
                              value={values.ClientTypeId}
                              onChange={(event, newValue) => {
                                setFieldValue('ClientTypeId', newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Patner"
                                  variant="outlined"
                                  fullWidth
                                  error={Boolean(
                                    touched.ClientTypeId && errors.ClientTypeId
                                  )}
                                  helperText={
                                    touched.ClientTypeId && errors.ClientTypeId
                                  }
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <DatePicker
                              value={values.StartDate}
                              onChange={(newValue) => {
                                setFieldValue('StartDate', newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  placeholder={t('Start Date')}
                                  error={Boolean(
                                    touched.StartDate && errors.StartDate
                                  )}
                                  helperText={
                                    touched.StartDate && errors.StartDate
                                  }
                                  InputProps={{
                                    ...params.InputProps,
                                    inputProps: {
                                      ...params.inputProps,
                                      placeholder: 'MM/DD/YYYY',
                                      mask: '__/__/____'
                                    }
                                  }}
                                />
                              )}
                              inputFormat="MM/dd/yyyy"
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} mt={1}>
                          <Grid item xs={12} md={6}>
                            <Stack direction="row" spacing={2}>
                              <Button
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                                startIcon={
                                  isSubmitting ? (
                                    <CircularProgress size="1rem" />
                                  ) : null
                                }
                                color="primary"
                              >
                                {t('Generate')}
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Stack>
                    </Box>
                  </Card>
                </form>
              )}
            </Formik>
          )}
        </Box>
      </PageTitleWrapper>
    </>
  );
};

export default Report1;
