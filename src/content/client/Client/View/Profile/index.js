import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Zoom
} from '@mui/material';
import InputNumber from 'src/components/InputNumber';
import {
  clientName,
  editClient,
  getAllClientType,
  singleClient
} from 'src/api/client/client';
import useRefMounted from 'src/hooks/useRefMounted';
import { useSnackbar } from 'notistack';
import { convertToNormalNumber } from 'src/utils/utils';
import ProgressBar from 'src/components/ProgressBar';
import { AlphaNumeric, OnlyLetters } from 'src/constants/validations';

const EditClient = ({ clientId, onClick }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRefMounted();
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');
  const [clientType, setClientType] = useState([]);
  const [initialValues, setInitialValues] = useState({
    logo: null,
    logoUrl: '',
    companyName: '',
    legalBusinessName: '',
    website: '',
    industrySector: '',
    dunsNumber: '',
    taxId: '',
    invitationCode: '',
    numberOfEmployee: '',
    mailingFirstName: '',
    mailingLastName: '',
    mailingAddress1: '',
    mailingEmail: '',
    mailingAddress2: '',
    mailingContactNumber: '',
    mailingCity: '',
    mailingState: '',
    mailingZip: '',
    billingFirstName: '',
    billingLastName: '',
    billingAddress1: '',
    billingEmail: '',
    billingAddress2: '',
    billingContactNumber: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    internaClientID: '',
    category: [],
    mainContactNumber: ''
  });

  useEffect(() => {
    setLoading(true);
    if (clientId && isMountedRef) {
      singleClient({ clientId: clientId })
        .then((res) => {
          if (res) {
            setInitialValues({
              ...res.data.data,
              category: res.data.data.clientMasterModel
            });

            setImage(res.data.data.logoMediaModel.path);
            onClick(res.data.data.companyName);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clientId, isMountedRef]);

  const fetchAllClientType = async () => {
    let obj = {
      pageIndex: 0,
      pageSize: 100,
      orderByAscending: false,
      searchString: ''
    };
    await getAllClientType(obj)
      .then((res) => {
        if (res.data) {
          let temp = [];
          res?.data?.data?.forEach((ele) => {
            temp?.push({
              label: ele?.clientType,
              value: ele?.clientTypeId
            });
          });
          setClientType(temp || []);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchAllClientType();
  }, [getAllClientType]);

  console.log('==>?', image);

  return (
    <>
      {loading && clientId ? (
        <>
          <ProgressBar />
        </>
      ) : (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            companyName: Yup.string()
              .trim()
              .required(t('Required'))
              .matches(OnlyLetters.regexPattern, OnlyLetters.errorMessage),
            legalBusinessName: Yup.string()
              .nullable()
              .matches(OnlyLetters.regexPattern, OnlyLetters.errorMessage),
            // website: Yup.string()
            //   .nullable()
            //   .matches(OnlyLetters.regexPattern, OnlyLetters.errorMessage),
            industrySector: Yup.string()
              .nullable()
              .matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage),
            taxId: Yup.string()
              .nullable()
              .matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage),
            mailingAddress1: Yup.string()
              .nullable()
              .matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage),
            mailingCity: Yup.string()
              .nullable()
              .matches(OnlyLetters.regexPattern, OnlyLetters.errorMessage),
            mailingAddress2: Yup.string()
              .nullable()
              .matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage),
            mailingState: Yup.string()
              .nullable()
              .matches(OnlyLetters.regexPattern, OnlyLetters.errorMessage),
            mailingEmail: Yup.string().email(t('The email should be a valid.')),
            mailingZip: Yup.string().nullable().min(5).max(5),

            billingAddress1: Yup.string()
              .nullable()
              .matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage),
            billingCity: Yup.string()
              .nullable()
              .matches(OnlyLetters.regexPattern, OnlyLetters.errorMessage),
            billingAddress2: Yup.string()
              .nullable()
              .matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage),
            billingState: Yup.string()
              .nullable()
              .matches(OnlyLetters.regexPattern, OnlyLetters.errorMessage),
            billingEmail: Yup.string().email(t('The email should be a valid.')),
            billingZip: Yup.string().nullable().min(5).max(5)
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            let obj = {
              logoMediaModel: {},
              companyName: _values.companyName.trim(),
              legalBusinessName: _values.legalBusinessName.trim(),
              contactFirstName: '',
              contactLastName: '',
              website: _values.website.trim(),
              industrySector: _values.industrySector.trim(),
              dunsNumber: convertToNormalNumber(
                _values.dunsNumber.trim(),
                'duns'
              ),
              taxId: _values.taxId.trim(),
              invitationCode: '',
              numberOfEmployee:
                typeof _values.numberOfEmployee === 'string'
                  ? Number(_values.numberOfEmployee.trim())
                  : _values.numberOfEmployee,
              mailingFirstName: '',
              mailingLastName: '',
              mailingAddress1: _values.mailingAddress1.trim(),
              mailingEmail: _values.mailingEmail.trim(),
              mailingAddress2: _values.mailingAddress2.trim(),
              mailingContactNumber: convertToNormalNumber(
                _values.mailingContactNumber.trim()
              ),
              mailingCity: _values.mailingCity.trim(),
              mailingState: _values.mailingState.trim(),
              mailingZip: _values.mailingZip.trim(),
              billingFirstName: '',
              billingLastName: '',
              billingAddress1: _values.billingAddress1.trim(),
              billingEmail: _values.billingEmail.trim(),
              billingAddress2: _values.billingAddress2.trim(),
              billingContactNumber: convertToNormalNumber(
                _values.billingContactNumber.trim()
              ),
              mainContactNumber: convertToNormalNumber(
                _values.mainContactNumber.trim()
              ),
              billingCity: _values.billingCity.trim(),
              billingState: _values.billingState.trim(),
              billingZip: _values.billingZip.trim(),
              internaClientID: '',
              clientTypeIds: _values?.category?.map((item) => item.value),
              clientId: clientId
            };

            if (typeof _values.logo === 'string') {
              obj['logo'] = _values?.logo;
              obj.logoMediaModel['base64String'] =
                _values?.logoMediaModel?.base64String;
              obj.logoMediaModel['fileName'] =
                _values?.logoMediaModel?.fileName;
            } else {
              obj['logo'] = _values?.logoUrl;
              obj.logoMediaModel['base64String'] = _values?.logoUrl;
              obj.logoMediaModel['fileName'] = _values?.logo?.name;
            }

            if (message.length > 0) {
              enqueueSnackbar(t('Company Name already exist'), {
                variant: 'error',
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right'
                },

                TransitionComponent: Zoom
              });
              return;
            }

            await editClient(obj)
              .then((res) => {
                if (res.data) {
                  resetForm();
                  setStatus({ success: true });
                  setSubmitting(false);
                  navigate('/partner');
                  enqueueSnackbar(t('Record Updated Successfully'), {
                    variant: 'success',
                    anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'right'
                    },

                    TransitionComponent: Zoom
                  });
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
              <Card>
                <Typography
                  variant="h6"
                  p={2}
                  fontWeight={700}
                  textTransform="uppercase"
                >
                  Partner Information
                </Typography>
                <Divider />
                <Box p={2}>
                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '1' }}
                        fullWidth
                        name="companyName"
                        helperText={touched.companyName && errors.companyName}
                        error={Boolean(
                          touched.companyName && errors.companyName
                        )}
                        value={values.companyName}
                        onBlur={handleBlur}
                        onChange={(event) => {
                          setFieldValue('companyName', event.target.value);
                          clientName(encodeURIComponent(event.target.value))
                            .then((res) => {
                              if (res?.data?.message === 'Success') {
                                setMessage('');
                              } else {
                                setMessage(res?.data?.message);
                              }
                            })
                            .catch((e) => console.log(e));
                        }}
                        variant="outlined"
                        label={t('Company Name')}
                        placeholder={t('Company Name')}
                      />
                      {message && (
                        <Typography color="error">{message}</Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '2' }}
                        fullWidth
                        name="legalBusinessName"
                        value={values.legalBusinessName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Legal Business Name')}
                        placeholder={t('Legal Business Name / Entity')}
                        helperText={
                          touched.legalBusinessName && errors.legalBusinessName
                        }
                        error={Boolean(
                          touched.legalBusinessName && errors.legalBusinessName
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '5' }}
                        fullWidth
                        name="website"
                        value={values.website}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Website')}
                        placeholder={t('Website ')}
                        helperText={touched.website && errors.website}
                        error={Boolean(touched.website && errors.website)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        name="industrySector"
                        value={values.industrySector}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Industry Sector')}
                        placeholder={t('Industry Sector ')}
                        inputProps={{ maxLength: 20, tabIndex: '6' }}
                        helperText={
                          touched.industrySector && errors.industrySector
                        }
                        error={Boolean(
                          touched.industrySector && errors.industrySector
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <InputNumber
                        mask="99-999-9999"
                        value={values.dunsNumber}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="dunsNumber"
                        label={t('Duns Number')}
                        placeholder={t('Duns Number')}
                        inputProps={{ maxLength: 11, tabIndex: '7' }}
                        helperText={touched.website && errors.website}
                        error={Boolean(touched.website && errors.website)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        name="taxId"
                        value={values.taxId}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Tax ID')}
                        placeholder={t('Tax ID ')}
                        inputProps={{ maxLength: 20, tabIndex: '8' }}
                        helperText={touched.taxId && errors.taxId}
                        error={Boolean(touched.taxId && errors.taxId)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        multiple
                        id="categoryid"
                        name="category"
                        options={clientType}
                        value={values.category || []}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value
                        }
                        onChange={(event, newValue) => {
                          setFieldValue('category', newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Partner Category"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                        helperText={touched.category && errors.category}
                        error={Boolean(touched.category && errors.category)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InputNumber
                        mask="(999) 999-9999"
                        value={values.mainContactNumber}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="mainContactNumber"
                        helperText={
                          touched.mainContactNumber && errors.mainContactNumber
                        }
                        error={Boolean(
                          touched.mainContactNumber && errors.mainContactNumber
                        )}
                        label={t('Main Contact Number')}
                        placeholder={t('Main Contact Number')}
                        inputProps={{ maxLength: 14, tabIndex: '17' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack
                        sx={{ width: '100%' }}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        <Typography variant="subtitle1">Logo</Typography>
                        <TextField
                          type="file"
                          accept=".jpeg, .jpg, .png, .webp"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            setFieldValue('logo', file);

                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const dataUrl = reader.result;
                              const cleanedDataUrl = dataUrl.split(',')[1];
                              setFieldValue('logoUrl', cleanedDataUrl);
                            };
                            if (file) {
                              reader.readAsDataURL(file);
                            } else {
                              setFieldValue('logoUrl', '');
                            }
                          }}
                          onBlur={handleBlur}
                        />
                        {values.logo && (
                          <img src={image} alt="logo" className="image" />
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
              <Card sx={{ my: 2 }}>
                <Typography
                  p={2}
                  fontWeight={700}
                  variant="h6"
                  textTransform="uppercase"
                >
                  Mailing Address
                </Typography>
                <Divider />
                <Box p={2}>
                  <Grid container spacing={2} mb={4}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '11' }}
                        fullWidth
                        name="mailingAddress1"
                        value={values.mailingAddress1}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Address 1')}
                        placeholder={t('Address 1 ')}
                        helperText={
                          touched.mailingAddress1 && errors.mailingAddress1
                        }
                        error={Boolean(
                          touched.mailingAddress1 && errors.mailingAddress1
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '13' }}
                        fullWidth
                        name="mailingCity"
                        value={values.mailingCity}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('City')}
                        placeholder={t('City ')}
                        helperText={touched.mailingCity && errors.mailingCity}
                        error={Boolean(
                          touched.mailingCity && errors.mailingCity
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '12' }}
                        fullWidth
                        name="mailingAddress2"
                        value={values.mailingAddress2}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Address 2')}
                        placeholder={t('Address 2')}
                        helperText={
                          touched.mailingAddress2 && errors.mailingAddress2
                        }
                        error={Boolean(
                          touched.mailingAddress2 && errors.mailingAddress2
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '14' }}
                        fullWidth
                        name="mailingState"
                        value={values.mailingState}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('State')}
                        placeholder={t('State ')}
                        helperText={touched.mailingState && errors.mailingState}
                        error={Boolean(
                          touched.mailingState && errors.mailingState
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '16' }}
                        fullWidth
                        name="mailingEmail"
                        value={values.mailingEmail}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Email')}
                        placeholder={t('Email ')}
                        helperText={touched.mailingEmail && errors.mailingEmail}
                        error={Boolean(
                          touched.mailingEmail && errors.mailingEmail
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        name="mailingZip"
                        value={values.mailingZip}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          let inputValue = e.target.value;
                          if (inputValue.length > 5) {
                            inputValue = inputValue.slice(0, 5);
                          }
                          setFieldValue('mailingZip', inputValue);
                        }}
                        variant="outlined"
                        label={t('Zip')}
                        placeholder={t('Zip ')}
                        type="number"
                        inputProps={{ tabIndex: '15' }}
                        helperText={touched.mailingZip && errors.mailingZip}
                        error={Boolean(touched.mailingZip && errors.mailingZip)}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} />
                  </Grid>
                </Box>
              </Card>
              <Card sx={{ my: 2 }}>
                <Typography
                  p={2}
                  fontWeight={700}
                  variant="h6"
                  textTransform="uppercase"
                >
                  Billing Address
                </Typography>
                <Divider />
                <Box p={2}>
                  <Grid container spacing={2} mb={4}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '18' }}
                        fullWidth
                        name="billingAddress1"
                        value={values.billingAddress1}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Address 1')}
                        placeholder={t('Address 1 ')}
                        helperText={
                          touched.billingAddress1 && errors.billingAddress1
                        }
                        error={Boolean(
                          touched.billingAddress1 && errors.billingAddress1
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '20' }}
                        fullWidth
                        name="billingCity"
                        value={values.billingCity}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('City')}
                        placeholder={t('City ')}
                        helperText={touched.billingCity && errors.billingCity}
                        error={Boolean(
                          touched.billingCity && errors.billingCity
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '19' }}
                        fullWidth
                        name="billingAddress2"
                        value={values.billingAddress2}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Address 2')}
                        placeholder={t('Address 2')}
                        helperText={
                          touched.billingAddress2 && errors.billingAddress2
                        }
                        error={Boolean(
                          touched.billingAddress2 && errors.billingAddress2
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '21' }}
                        fullWidth
                        name="billingState"
                        value={values.billingState}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('State')}
                        placeholder={t('State ')}
                        helperText={touched.billingState && errors.billingState}
                        error={Boolean(
                          touched.billingState && errors.billingState
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        inputProps={{ tabIndex: '23' }}
                        fullWidth
                        name="billingEmail"
                        value={values.billingEmail}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        variant="outlined"
                        label={t('Email')}
                        placeholder={t('Email ')}
                        helperText={touched.billingEmail && errors.billingEmail}
                        error={Boolean(
                          touched.webillingEmailbsite && errors.billingEmail
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        name="billingZip"
                        value={values.billingZip}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          let inputValue = e.target.value;
                          if (inputValue.length > 5) {
                            inputValue = inputValue.slice(0, 5);
                          }
                          setFieldValue('billingZip', inputValue);
                        }}
                        variant="outlined"
                        label={t('Zip')}
                        placeholder={t('Zip ')}
                        type="number"
                        inputProps={{ tabIndex: '22' }}
                        helperText={touched.billingZip && errors.billingZip}
                        error={Boolean(touched.billingZip && errors.billingZip)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} />
                  </Grid>
                </Box>
              </Card>
              <Card sx={{ my: 2 }}>
                <Stack direction="row" spacing={2} p={2}>
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
                    onClick={() => navigate('/partner')}
                    color="primary"
                  >
                    {t('Cancel')}
                  </Button>
                </Stack>
              </Card>
            </form>
          )}
        </Formik>
      )}
    </>
  );
};

export default EditClient;
