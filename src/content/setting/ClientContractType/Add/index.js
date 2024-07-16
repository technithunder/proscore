import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import {
  addClientContractorType,
  editClientContractorType,
  singleClientContractorType
} from 'src/api/settings/clientContractorType';

const AddAddress = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    clientContractType: ''
  });

  useEffect(() => {
    setLoading(true);
    if (id) {
      singleClientContractorType({ clientContractTypeId: id })
        .then((res) => {
          if (res) {
            console.log(res.data.data.clientContractType);
            setInitialValues({
              clientContractType: res.data.data.clientContractType
            });
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
          {id
            ? 'Edit Client Contract Type - Setting'
            : 'Add Client Contract Type - Setting'}
        </title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={
            id ? t('Edit Client Contract Type') : t('Add Client Contract Type')
          }
          description={
            id
              ? t('Fill in the below to edit client contract type')
              : t('Fill in the below to add client contract type')
          }
          pathname={'/setting/clientcontract-type'}
          buttonHeading={t('Go back to all client contract type')}
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
                clientContractType: Yup.string().trim().required(t('Required'))
              })}
              onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting }
              ) => {
                let obj = {
                  clientContractType: _values.clientContractType.trim()
                };
                if (id) {
                  obj['clientContractTypeId'] = id;
                  await editClientContractorType(obj)
                    .then((res) => {
                      if (res.data) {
                        resetForm();
                        setStatus({ success: true });
                        setSubmitting(false);
                        navigate('/setting/clientcontract-type');
                      }
                    })
                    .catch((err) => {
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    });
                } else {
                  await addClientContractorType(obj)
                    .then((res) => {
                      if (res.data) {
                        resetForm();
                        setStatus({ success: true });
                        setSubmitting(false);
                        navigate('/setting/clientcontract-type');
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
                        name="clientContractType"
                        helperText={
                          touched.clientContractType &&
                          errors.clientContractType
                        }
                        error={Boolean(
                          touched.clientContractType &&
                            errors.clientContractType
                        )}
                        value={values.clientContractType}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Conractor Type')}
                        placeholder={t('Conractor Type ')}
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
                      onClick={() => navigate('/setting/clientcontract-type')}
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

export default AddAddress;
