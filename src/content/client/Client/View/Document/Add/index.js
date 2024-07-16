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
  Autocomplete,
  Typography
} from '@mui/material';

import {
  singleDocument,
  addDocument,
  editDocument
} from 'src/api/client/client/document';
import ProgressBar from 'src/components/ProgressBar';
import { AlphaNumeric } from 'src/constants/validations';

const AddDocument = ({
  id,
  clientDocumentId,
  onCancelDocumentForm,
  onClick,
  documentType
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    clientDocumentTypeId: null,
    documentName: '',
    document: null,
    documentUrl: ''
  });

  useEffect(() => {
    if (!Array.isArray(clientDocumentId)) {
      setLoading(true);
      if (id && clientDocumentId) {
        singleDocument(clientDocumentId)
          .then((res) => {
            if (res) {
              const x = documentType.find(
                (e) => e.value === res?.data?.data?.clientDocumentTypeId
              );

              setInitialValues({
                ...res.data.data,
                clientDocumentTypeId: x
              });
            }
          })
          .catch((e) => console.log(e))
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [clientDocumentId, id]);

  const handleDownload = () => {
    const file = initialValues.documentMediaModel.path;
    const link = document.createElement('a');
    link.href = file;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <>
      <Card>
        <Box p={2}>
          {loading && clientDocumentId ? (
            <>
              <ProgressBar />
            </>
          ) : (
            <>
              <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                  clientDocumentTypeId: Yup.object()
                    .nullable()
                    .required('Required'),
                  documentName: Yup.string().trim().required(t('Required')).matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage),
                  // document: Yup.mixed()
                  //   .required('Required')
                  //   .test('fileFormat', 'Unsupported file format', (value) => {
                  //     return (
                  //       value &&
                  //       [
                  //         'application/pdf',
                  //         'application/msword',
                  //         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  //         'text/csv',
                  //         'application/vnd.ms-excel',
                  //         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  //         'text/plain',
                  //         'application/vnd.ms-powerpoint',
                  //         'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                  //       ].includes(value.type)
                  //     );
                  //   })
                })}
                onSubmit={async (
                  _values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  let obj = {
                    clientId: id,
                    clientDocumentTypeId: _values.clientDocumentTypeId.value,
                    documentName: _values.documentName.trim(),
                    documentMediaModel: {}
                  };

                  if (clientDocumentId.clientDocumentId) {
                    obj['clientDocumentId'] = clientDocumentId.clientDocumentId;
                    if (_values.document) {
                      obj.documentMediaModel['base64String'] =
                        _values.documentUrl;
                      obj.documentMediaModel['fileName'] =
                        _values.document.name;
                    } else {
                      obj.documentMediaModel['base64String'] =
                        _values.documentMediaModel.base64String;
                      obj.documentMediaModel['fileName'] =
                        _values.documentMediaModel.fileName;
                    }
                    await editDocument(obj)
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
                    obj.documentMediaModel['base64String'] =
                      _values.documentUrl;
                    obj.documentMediaModel['fileName'] = _values.document.name;
                    await addDocument(obj)
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
                          id="documenttypeid"
                          name="documenttypeid"
                          options={documentType}
                          value={values.clientDocumentTypeId}
                          onChange={(event, newValue) => {
                            setFieldValue('clientDocumentTypeId', newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Document"
                              variant="outlined"
                              fullWidth
                              error={Boolean(
                                touched.clientDocumentTypeId &&
                                errors.clientDocumentTypeId
                              )}
                              helperText={
                                touched.clientDocumentTypeId &&
                                errors.clientDocumentTypeId
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
                            accept=".pdf, .doc, .docx, .csv, .xls, .xlsx, .txt, .ppt, .pptx"
                            onChange={(event) => {
                              const file = event.currentTarget.files[0];
                              setFieldValue('document', file);

                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const dataUrl = reader.result;
                                const cleanedDataUrl = dataUrl.split(',')[1];
                                setFieldValue('documentUrl', cleanedDataUrl);
                              };
                              if (file) {
                                reader.readAsDataURL(file);
                              } else {
                                setFieldValue('documentUrl', '');
                              }
                            }}
                            onBlur={handleBlur}
                          // error={Boolean(touched.document && errors.document)}
                          // helperText={touched.document && errors.document}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          rows={4}
                          multiline
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
                          placeholder={t('Document Name')}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {clientDocumentId &&
                          clientDocumentId.length === 0 ? null : (
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
                              {values?.documentMediaModel?.fileName}
                            </Typography>
                          </Stack>
                        )}
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
                        onClick={onCancelDocumentForm}
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

export default AddDocument;
