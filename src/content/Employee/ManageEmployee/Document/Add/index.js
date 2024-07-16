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
  Autocomplete,
  Typography
} from '@mui/material';
import {
  addEmployeeDocument,
  getAllEmployeeDocumentType,
  getEmployeeDocument,
  updateEmployeeDocument
} from 'src/api/employee/document';
import { AlphaNumeric } from 'src/constants/validations';

const EmployeeDocument = ({
  onCancelContactForm,
  onClick,
  employeeId,
  documentId
}) => {
  console.log(onClick, documentId);
  const { t } = useTranslation();
  const [documentType, setDocumentType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentFormat, setDocumentFormat] = useState();
  const [initialValues, setInitialValues] = useState({
    documentType: null,
    documentUpload: null,
    documentUploadUrl: null,
    documentName: ''
  });

  const fetchAllEmployeeDocuments = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllEmployeeDocumentType(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setDocumentType(
            res.data.data.map((item) => ({
              label: item.employmentDocumentType,
              value: item.employmentDocumentTypeId
            }))
          );
        } else if (res.data.data == null) {
          setDocumentType([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchEmployeeDocuments = async () => {
    setLoading(true);
    if (documentId) {
      const obj = {
        employeeDocumentId: documentId
      };
      await getEmployeeDocument(obj)
        .then((res) => {
          if (res) {
            setInitialValues({
              documentType: res?.data?.data?.employeeDocumentTypeModel,
              documentUpload: res?.data?.data?.documentMediaModel?.path,
              documentName: res?.data?.data?.documentName
            });
            setDocumentFormat(res?.data?.data?.documentMediaModel);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchAllEmployeeDocuments();
  }, []);

  useEffect(() => {
    fetchEmployeeDocuments();
  }, [documentId]);

  const handleClear = () => {
    setInitialValues({
      documentType: null,
      documentUpload: null,
      documentName: ''
    });
  };

  const handleDownload = () => {
    const file = documentFormat?.path;
    const link = document.createElement('a');
    link.href = file;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <>
      <Box>
        {loading && documentId ? (
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
              documentType: Yup.object().nullable().required('Required'),
              documentName: Yup.string()
                .max(255)
                .required('Required')
                .matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage),
              documentUpload: Yup.mixed().required('Required')
            })}
            onSubmit={async (
              _values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                if (documentId) {
                  const obj = {
                    employeeDocumentId: documentId,
                    employeeDocumentTypeId: _values?.documentType.value,
                    employeeId: employeeId,
                    documentName: _values?.documentName
                  };
                  if (_values?.documentUploadUrl) {
                    obj.documentMediaModel = {
                      base64String: _values.documentUploadUrl,
                      fileName: _values.documentUpload.name
                    };
                  } else {
                    obj.documentMediaModel = null;
                  }
                  await updateEmployeeDocument(obj)
                    .then((res) => {
                      if (res) {
                        if (res.status === 200) {
                          onClick();
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
                    employeeDocumentTypeId: _values?.documentType.value,
                    employeeId: employeeId,
                    documentName: _values?.documentName,
                    documentMediaModel: {
                      base64String: _values.documentUploadUrl,
                      fileName: _values.documentUpload.name
                    }
                  };
                  await addEmployeeDocument(obj)
                    .then((res) => {
                      if (res) {
                        if (res.status === 200) {
                          onClick();
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
              handleSubmit,
              isSubmitting,
              touched,
              handleChange,
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
                            id="documentType"
                            name="documentType"
                            options={documentType}
                            value={values.documentType}
                            onChange={(event, newValue) => {
                              setFieldValue('documentType', newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Document"
                                variant="outlined"
                                fullWidth
                                error={Boolean(
                                  touched.documentType && errors.documentType
                                )}
                                helperText={
                                  touched.documentType && errors.documentType
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            name="documentName"
                            helperText={
                              touched.documentName && errors.documentName
                            }
                            error={Boolean(
                              touched.documentName && errors.documentName
                            )}
                            value={values.documentName}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            label={t('Document Name')}
                            placeholder={t('Document Name ')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Typography variant="subtitle1">
                              Document
                            </Typography>
                            <TextField
                              type="file"
                              accept=".jpeg, .jpg, .png"
                              onChange={(event) => {
                                const file = event.currentTarget.files[0];
                                setFieldValue('documentUpload', file);

                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const dataUrl = reader.result;
                                  const cleanedDataUrl = dataUrl.split(',')[1];
                                  setFieldValue(
                                    'documentUploadUrl',
                                    cleanedDataUrl
                                  );
                                };
                                if (file) {
                                  reader.readAsDataURL(file);
                                } else {
                                  setFieldValue('documentUploadUrl', '');
                                }
                              }}
                              onBlur={handleBlur}
                              error={Boolean(
                                touched.documentUpload && errors.documentUpload
                              )}
                              helperText={
                                touched.documentUpload && errors.documentUpload
                              }
                            />
                          </Stack>
                          {/* {documentId && (
                            <img
                              alt="ETH"
                              src={initialValues?.documentUpload}
                              style={{ width: '100%', height: '10vw' }}
                            />
                          )} */}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          {documentId && documentId.length === 0 ? null : (
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Typography variant="subtitle1">
                                Download File:
                              </Typography>
                              <Typography
                                onClick={handleDownload}
                                sx={{ cursor: 'pointer', color: 'blue' }}
                                variant="body1"
                              >
                                {documentFormat?.fileName}
                              </Typography>
                            </Stack>
                          )}
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

export default EmployeeDocument;
