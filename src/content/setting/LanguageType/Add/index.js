import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Stack,
  TextField
} from '@mui/material';
import { addLanguageType, editLanguageType, singleLanguageType } from 'src/api';
import { useParams, useNavigate } from 'react-router-dom';

const AddLanguageType = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({ languageType: '' });

  useEffect(() => {
    setLoading(true);
    if (id) {
      singleLanguageType(id)
        .then((res) => {
          if (res) {
            console.log(res.data.data.languageType);
            setInitialValues({ languageType: res.data.data.languageType });
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title>
          {id ? 'Edit language Type - Setting' : 'Add language Type - Setting'}
        </title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={id ? t('Edit language Type') : t('Add language Type')}
          description={
            id
              ? t('Fill in the below to edit language')
              : t('Fill in the below to add language')
          }
          pathname={'/setting/language-type'}
          buttonHeading={t('Go back to all language type')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <Card sx={{ mx: 3 }}>
        <Box p={2}>
          {loading && id ? (
            <>
              <CircularProgress
                size="3rem"
                sx={{ display: 'flex', margin: '0 auto', my: 5 }}
              />
            </>
          ) : (
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={Yup.object().shape({
                languageType: Yup.string().trim().required(t('Required'))
              })}
              onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting }
              ) => {
                let obj = {
                  languageType: _values.languageType.trim()
                };
                if (id) {
                  obj['languageTypeId'] = id;
                  await editLanguageType(obj)
                    .then((res) => {
                      if (res.data) {
                        resetForm();
                        setStatus({ success: true });
                        setSubmitting(false);
                        navigate('/setting/language-type');
                      }
                    })
                    .catch((err) => {
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    });
                } else {
                  await addLanguageType(obj)
                    .then((res) => {
                      if (res.data) {
                        resetForm();
                        setStatus({ success: true });
                        setSubmitting(false);
                        navigate('/setting/language-type');
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
                        name="languageType"
                        helperText={touched.languageType && errors.languageType}
                        error={Boolean(
                          touched.languageType && errors.languageType
                        )}
                        value={values.languageType}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Language Type')}
                        placeholder={t('Language Type ')}
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
                      onClick={() => navigate('/setting/language-type')}
                      color="primary"
                    >
                      {t('Cancel')}
                    </Button>
                  </Stack>
                </form>
              )}
            </Formik>
          )}
        </Box>
      </Card>
    </>
  );
};

export default AddLanguageType;
