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
  Autocomplete,
  Zoom
} from '@mui/material';
import {
  addClientSocialMedia,
  singleClientSocialMedia,
  editClientSocialMedia
} from 'src/api/client/client/socialMedia';
import ProgressBar from 'src/components/ProgressBar';

const AddSocialMedia = ({
  id,
  clientSocialMediaId,
  onCancelSocialMediaForm,
  socialMediaType,
  onClick
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    socialMediaId: null,
    link: ''
  });

  useEffect(() => {
    setLoading(true);
    if (id && clientSocialMediaId) {
      singleClientSocialMedia(clientSocialMediaId)
        .then((res) => {
          if (res) {
            const x = socialMediaType.find(
              (e) => e.value === res?.data?.data?.socialMediaId
            );
            setInitialValues({ ...res.data.data, socialMediaId: x });
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clientSocialMediaId, id]);

  return (
    <>
      <Card>
        <Box p={2}>
          {loading && clientSocialMediaId ? (
            <>
              <ProgressBar />
            </>
          ) : (
            <>
              <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                  socialMediaId: Yup.object().nullable().required('Required'),
                  link: Yup.string().trim().required(t('Required'))
                })}
                onSubmit={async (
                  _values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  let obj = {
                    clientId: id,
                    socialMediaId: _values.socialMediaId.value.trim(),
                    link: _values.link.trim()
                  };
                  if (clientSocialMediaId) {
                    obj['clientSocialMediaId'] =
                      clientSocialMediaId.clientSocialMediaId;
                    await editClientSocialMedia(obj)
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
                    await addClientSocialMedia(obj)
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
                          id="socialMediaId"
                          name="socialMediaId"
                          options={socialMediaType}
                          value={values.socialMediaId}
                          onChange={(event, newValue) => {
                            setFieldValue('socialMediaId', newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Social Media"
                              variant="outlined"
                              fullWidth
                              error={Boolean(
                                touched.socialMediaId && errors.socialMediaId
                              )}
                              helperText={
                                touched.socialMediaId && errors.socialMediaId
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="link"
                          helperText={touched.link && errors.link}
                          error={Boolean(touched.link && errors.link)}
                          value={values.link}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          label={t('Link')}
                          placeholder={t('Link')}
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
                        onClick={onCancelSocialMediaForm}
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

export default AddSocialMedia;
