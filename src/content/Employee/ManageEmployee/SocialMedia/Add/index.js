import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Box,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Autocomplete
} from '@mui/material';
import {
  addEmployeeocialMedia,
  getEmployeeocialMedia,
  getEmployeeocialMediaType,
  updateEmployeeocialMedia
} from 'src/api/employee/socailmedia';

const EmployeeAddSocialMedia = ({
  onCancelContactForm,
  onClick,
  employeeId,
  employeeSocialMediaId
}) => {
  console.log(onClick, employeeSocialMediaId);
  const { t } = useTranslation();
  const [socialMediaType, setsocialMediaType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    mediaType: null,
    handle: ''
  });

  const handleClear = () => {
    setInitialValues({
      mediaType: null,
      handle: ''
    });
  };
  const fetchAllEmployeeSocialMedia = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getEmployeeocialMediaType(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setsocialMediaType(
            res.data.data.map((item) => ({
              label: item.name,
              value: item.socialMediaId
            }))
          );
        } else if (res.data.data == null) {
          setsocialMediaType([]);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchAllEmployeeSocialMedia();
  }, []);

  useEffect(() => {
    fetchEmployeeSocialMedia();
  }, [employeeSocialMediaId]);

  const fetchEmployeeSocialMedia = async () => {
    setLoading(true);
    if (employeeSocialMediaId) {
      const obj = {
        proScoreEmployeeSocialMediaId: employeeSocialMediaId
      };
      await getEmployeeocialMedia(obj)
        .then((res) => {
          if (res) {
            setInitialValues({
              mediaType: res?.data?.data?.socialMediaModel,
              handle: res?.data?.data?.handle
            });
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Box>
        {loading && employeeSocialMediaId ? (
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
              mediaType: Yup.object().nullable().required('Required'),
              handle: Yup.string().max(255).required(t('Required'))
            })}
            onSubmit={async (
              _values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                if (employeeSocialMediaId) {
                  const obj = {
                    proScoreEmployeeSocialMediaId: employeeSocialMediaId,
                    socialMediaId: _values?.mediaType?.value,
                    handle: _values?.handle,
                    employeeId: employeeId
                  };
                  await updateEmployeeocialMedia(obj)
                    .then((res) => {
                      if (res) {
                        if (res.status === 200) {
                          resetForm();
                          setStatus({ success: true });
                          setSubmitting(false);
                          handleClear();
                          onCancelContactForm();
                        }
                      }
                    })
                    .catch((err) => {
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    });
                } else {
                  const obj = {
                    socialMediaId: _values?.mediaType?.value,
                    handle: _values?.handle,
                    employeeId: employeeId
                  };
                  await addEmployeeocialMedia(obj)
                    .then((res) => {
                      if (res) {
                        if (res.status === 200) {
                          resetForm();
                          setStatus({ success: true });
                          setSubmitting(false);
                          handleClear();
                          onCancelContactForm();
                        }
                      }
                    })
                    .catch((err) => {
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    });
                }
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
                <Card sx={{ mx: 0, mb: 3 }}>
                  <Box p={2}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Autocomplete
                            id="mediaType"
                            name="mediaType"
                            options={socialMediaType}
                            value={values.mediaType}
                            onChange={(event, newValue) => {
                              setFieldValue('mediaType', newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Social Media Type"
                                variant="outlined"
                                fullWidth
                                error={Boolean(
                                  touched.mediaType && errors.mediaType
                                )}
                                helperText={
                                  touched.mediaType && errors.mediaType
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            name="handle"
                            helperText={touched.handle && errors.handle}
                            error={Boolean(touched.handle && errors.handle)}
                            value={values.handle}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            label={t('Handle')}
                            placeholder={t('Handle')}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  </Box>
                </Card>

                <Card sx={{ mx: 0, mb: 3 }}>
                  <Box p={2}>
                    <Stack direction="row" spacing={2} mt={1}>
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
                  </Box>
                </Card>
              </form>
            )}
          </Formik>
        )}
      </Box>
    </>
  );
};

export default EmployeeAddSocialMedia;
