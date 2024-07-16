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
  addDepartmentType,
  editDepartmentType,
  singleDepartmentType
} from 'src/api/settings/departmentType';

const DepartmentType = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    departmentType: ''
  });

  useEffect(() => {
    setLoading(true);
    if (id) {
      singleDepartmentType(id)
        .then((res) => {
          if (res) {
            console.log(res.data.data.departmentType);
            setInitialValues({ contractorType: res.data.data.departmentType });
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
            ? 'Edit Department Type - Setting'
            : 'Add Department Type - Setting'}
        </title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={id ? t('Edit Department Type') : t('Add Department Type')}
          description={
            id
              ? t('Fill in the below to edit department type')
              : t('Fill in the below to add department type')
          }
          pathname={'/setting/department-type'}
          buttonHeading={t('Go back to all department type')}
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
                departmentType: Yup.string().trim().required(t('Required'))
              })}
              onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting }
              ) => {
                let obj = {
                  departmentType: _values.departmentType.trim()
                };
                if (id) {
                  obj['departmentTypeId'] = id;
                  await editDepartmentType(obj)
                    .then((res) => {
                      if (res.data) {
                        resetForm();
                        setStatus({ success: true });
                        setSubmitting(false);
                        navigate('/setting/department-type');
                      }
                    })
                    .catch((err) => {
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    });
                } else {
                  await addDepartmentType(obj)
                    .then((res) => {
                      if (res.data) {
                        resetForm();
                        setStatus({ success: true });
                        setSubmitting(false);
                        navigate('/setting/department-type');
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
                        name="departmentType"
                        helperText={
                          touched.departmentType && errors.departmentType
                        }
                        error={Boolean(
                          touched.departmentType && errors.departmentType
                        )}
                        value={values.departmentType}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Department Type')}
                        placeholder={t('Department Type ')}
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
                      onClick={() => navigate('/setting/department-type')}
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

export default DepartmentType;
