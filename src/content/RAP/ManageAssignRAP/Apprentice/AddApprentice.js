import React, { useEffect, useState } from 'react';
// import * as Yup from 'yup';
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
  Zoom
} from '@mui/material';
import { addContact, singleContact } from 'src/api/client/client/contact';
import { convertToNormalNumber } from 'src/utils/utils';
import ProgressBar from 'src/components/ProgressBar';
import { getAllApprentice } from 'src/api/rap';
// import { OnlyLetters } from 'src/constants/validations';

const AddApprentice = ({
  id,
  clientContactId,
  onCancelContactForm,
  onClick,
  contactType
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    employee_name: '',
    dateApprenticeshipebegin: '',
    otjHours: '',
    rtiHours: ''
  });

  useEffect(() => {
    setLoading(true);
    getAllApprentice((res) => console.log(res)).catch((err) =>
      console.log(err)
    );
    if (id && clientContactId) {
      singleContact(clientContactId)
        .then((res) => {
          if (res) {
            const x = contactType.find(
              (e) => e.value === res?.data?.data?.contactTypeId
            );
            setInitialValues(res.data.data);
            setInitialValues({
              ...res.data.data,
              contactTypeId: x
            });
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clientContactId, id]);

  return (
    <>
      <Card>
        <Box p={2}>
          {loading && clientContactId ? (
            <>
              <ProgressBar />
            </>
          ) : (
            <>
              <Formik
                initialValues={initialValues}
                onSubmit={async (
                  _values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  let obj = {
                    clientId: id,
                    firstName: _values.firstName.trim(),
                    dateApprenticeshipebegin:
                      _values.dateApprenticeshipebegin.trim(),
                    otjHours: _values.otjHours.trim(),
                    rtiHours: _values.rtiHours.trim(),
                    cellPhone: convertToNormalNumber(_values.cellPhone.trim()),
                    officePhone: convertToNormalNumber(
                      _values.officePhone.trim()
                    ),
                    jobTitle: _values.jobTitle.trim(),
                    contactTypeId: _values.contactTypeId.value
                  };
                  await addContact(obj)
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
                        <TextField
                          fullWidth
                          name="employee_name"
                          helperText={
                            touched.employee_name && errors.employee_name
                          }
                          error={Boolean(
                            touched.employee_name && errors.employee_name
                          )}
                          value={values.employee_name}
                          onBlur={handleBlur}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            setFieldValue('employee_name', inputValue);
                          }}
                          variant="outlined"
                          label={t('Employee Name')}
                          placeholder={t('Employee Name')}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="dateApprenticeshipebegin"
                          helperText={
                            touched.dateApprenticeshipebegin &&
                            errors.dateApprenticeshipebegin
                          }
                          error={Boolean(
                            touched.dateApprenticeshipebegin &&
                              errors.dateApprenticeshipebegin
                          )}
                          value={values.dateApprenticeshipebegin}
                          onBlur={handleBlur}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            setFieldValue(
                              'dateApprenticeshipebegin',
                              inputValue
                            );
                          }}
                          variant="outlined"
                          label={t('DateApprenticeshipebegin')}
                          placeholder={t('DateApprenticeshipebegin')}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="number"
                          name="otjHours"
                          helperText={touched.otjHours && errors.otjHours}
                          error={Boolean(touched.otjHours && errors.otjHours)}
                          value={values.otjHours}
                          onBlur={handleBlur}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            setFieldValue('otjHours', inputValue);
                          }}
                          variant="outlined"
                          label={t('OTJ Hours')}
                          placeholder={t('OTJ Hours')}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="number"
                          name="rtiHours"
                          helperText={touched.rtiHours && errors.rtiHours}
                          error={Boolean(touched.rtiHours && errors.rtiHours)}
                          value={values.rtiHours}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          label={t('RTI Hours')}
                          placeholder={t('RTI Hours')}
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
                        onClick={onCancelContactForm}
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

export default AddApprentice;
