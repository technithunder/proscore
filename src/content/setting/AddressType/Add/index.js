import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
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
  singleAddressType,
  editAddressType,
  addAddressType
} from 'src/api/settings/addressType';
import { useParams } from 'react-router-dom';

const AddAddress = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({ addressType: '' });

  useEffect(() => {
    setLoading(true);
    if (id) {
      singleAddressType(id)
        .then((res) => {
          if (res) {
            console.log(res.data.data.addressType);
            setInitialValues({ addressType: res.data.data.addressType });
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
          {id ? 'Edit Address Type - Setting' : 'Add Address Type - Setting'}
        </title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={id ? t('Edit address Type') : t('Add address Type')}
          description={
            id
              ? t('Fill in the below to edit address')
              : t('Fill in the below to add address')
          }
          pathname={'/setting/address-type'}
          buttonHeading={t('Go back to all address type')}
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
                addressType: Yup.string().trim().required(t('Required'))
              })}
              onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting }
              ) => {
                let obj = {
                  addressType: _values.addressType.trim()
                };
                if (id) {
                  obj['addressTypeId'] = id;
                  await editAddressType(obj)
                    .then((res) => {
                      if (res.data) {
                        resetForm();
                        setStatus({ success: true });
                        setSubmitting(false);
                        navigate('/setting/address-type');
                      }
                    })
                    .catch((err) => {
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    });
                } else {
                  await addAddressType(obj)
                    .then((res) => {
                      if (res.data) {
                        resetForm();
                        setStatus({ success: true });
                        setSubmitting(false);
                        navigate('/setting/address-type');
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
                        name="addressType"
                        helperText={touched.addressType && errors.addressType}
                        error={Boolean(
                          touched.addressType && errors.addressType
                        )}
                        value={values.addressType}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Address Type')}
                        placeholder={t('Address Type ')}
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
                      onClick={() => navigate('/setting/address-type')}
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
