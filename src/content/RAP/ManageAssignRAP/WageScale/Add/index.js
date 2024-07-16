import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Box,
  Grid,
  Stack,
  TextField,
  CircularProgress,
  Zoom,
  Autocomplete,
  Typography,
  Divider
} from '@mui/material';
import {
  // singleAssignRAPWageScale,
  addAssignRAPWageScale,
  singleAssignRAPWageScale,
  updateAssignRAPWageScale,
  addAssignRAPWageScaleDetail
} from 'src/api/rap';

import WageRate from './WageRate';
import { getAllStates } from 'src/api/client/client';

const AddWageScale = ({
  id,
  assignRAPWageScaleId,
  onCancelProjectJobTitleForm,
  onClick
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [loading] = useState(false);
  const [states, setStates] = useState([]);

  const [initialValues, setInitialValues] = useState({
    wageScaleTitle: '',
    state: null,
    county: '',
    programLength : 0,
    wageRateUnit: null,
    wageRateType: null,
    journeymanWage: 0,
  });

  const [updateWageRates, setUpdateWageRates] = useState([]);
  const WageRateUnit = [
    { label: 'Hourly', value: 1 },
    { label: 'Weekly', value: 2 },
    { label: 'Quarterly', value: 3},
    { label: 'Annually', value: 4},
    { label: 'Semi-Annually', value: 5},
  ];

  const WageRateType = [
    { label: '% of Journeyworker wage', value: 1 },
    { label: '$ amount of wage', value: 2 },
    { label: 'Both % and $ amount of wage', value: 3 }
  ];
  // Function to update the array state
  const updatedWageRates = (newArray) => {
    setUpdateWageRates(newArray);
  };

  function saveWageRatesDetail(assignRAPWageScaleGuid) {
    updateWageRates.forEach((item) => {
      item.assignRAPWageScaleGuid = assignRAPWageScaleGuid;
      addAssignRAPWageScaleDetail(item);
    });
  }

  useEffect(() => {
    fetchAllStates();
  }, []);

  useEffect(() => {
    if (assignRAPWageScaleId) {
      debugger;
      singleAssignRAPWageScale(assignRAPWageScaleId.assignRAPWageScaleId)
        .then((res) => {
          if (res.data) {
            const x = states.filter(
              (x) => x.value === res?.data.data.state
            )[0];
            const y = WageRateUnit.filter(
              (y) => y.value === res?.data.data.wageRateUnit
            )[0];
            const z = WageRateType.filter(
              (z) => z.value === res?.data.data.wageRateType
            )[0];
            setInitialValues({
              wageScaleTitle: res.data.data.wageScaleTitle,
              wageRateUnit: y,
              wageRateType: z,
              journeymanWage: res.data.data.journeymanWage,
              state: x,
              county: '',
              programLength : res.data.data.programLength
            });
          }
        })
        .catch((e) => console.log(e));
    }
  }, [assignRAPWageScaleId, states]);

  const fetchAllStates = async () => {
    let obj = {
      pageIndex: 0,
      pageSize: 100,
      orderByAscending: false,
      searchString: ''
    };
    await getAllStates(obj)
      .then((res) => {
        if (res.data) {
          let temp = [];
          temp?.push({
            label: "All States",
            value: "All States"
          });
          res?.data?.data?.forEach((ele) => {
            temp?.push({
              label: ele?.stateName,
              value: ele?.stateAbrv
            });
          });
          setStates(temp);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <Box>
        {loading ? (
          <>
            <CircularProgress
              size="3rem"
              sx={{ display: 'flex', margin: '0 auto', my: 5 }}
            />
          </>
        ) : (
          <>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={Yup.object().shape({
                wageScaleTitle: Yup.string().required(t('Required'))
              })}
              onSubmit={async (
                _values,
                { resetForm, setErrors, setStatus, setSubmitting }
              ) => {
                try {
                  console.log(_values.JourneymanWage);
                  debugger;
                  const obj = {
                    wageScaleTitle: _values.wageScaleTitle,
                    state: _values.state.value,
                    journeymanWage: _values.journeymanWage,
                    wageRateType: _values.wageRateType.value,
                    wageRateUnit: _values.wageRateUnit.value,
                    county: '',
                    assignRAPInfoGuid: id
                  };
                  console.log(_values);

                  if (assignRAPWageScaleId) {
                    obj['assignRAPWageScaleId'] =
                      assignRAPWageScaleId.assignRAPWageScaleId;
                    await updateAssignRAPWageScale(obj)
                      .then((res) => {
                        if (res.data) {
                          saveWageRatesDetail(
                            assignRAPWageScaleId.assignRAPWageScaleId
                          );
                          onClick();
                          resetForm();
                          setStatus({ success: true });
                          setSubmitting(false);

                          enqueueSnackbar(t('Record updated Successfully'), {
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
                  } else {
                    await addAssignRAPWageScale(obj)
                      .then((res) => {
                        if (res.data) {
                          saveWageRatesDetail(res.data.data);
                          onClick();
                          resetForm();
                          setStatus({ success: true });
                          setSubmitting(false);

                          enqueueSnackbar(t('Record added Successfully'), {
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
                        <Typography
                          variant="h4"
                          fontWeight="700"
                          textTransform="uppercase"
                        >
                          Assign Rap info
                        </Typography>
                      </Stack>
                    </Box>
                    <Divider />
                    <Box p={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            name="wageScaleTitle"
                            helperText={
                              touched.wageScaleTitle && errors.wageScaleTitle
                            }
                            error={Boolean(
                              touched.wageScaleTitle && errors.wageScaleTitle
                            )}
                            value={values.wageScaleTitle}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            label={t('Wage Scale Title')}
                            placeholder={t('Wage Scale Title')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Autocomplete
                            id="state"
                            name="state"
                            options={states}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            value={values.state}
                            onChange={(event, newValue) => {
                              setFieldValue('state', newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="State"
                                variant="outlined"
                                fullWidth
                                error={Boolean(touched.state && errors.state)}
                                helperText={touched.state && errors.state}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            name="journeymanWage"
                            helperText={
                              touched.journeymanWage && errors.journeymanWage
                            }
                            error={Boolean(
                              touched.journeymanWage && errors.journeymanWage
                            )}
                            value={values.journeymanWage}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            label={t('Journeyman Wage')}
                            type="number"
                            placeholder={t('Journeyman Wage')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Autocomplete
                            id="wageRateUnit"
                            name="wageRateUnit"
                            options={WageRateUnit}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            value={values.wageRateUnit}
                            onChange={(event, newValue) => {
                              setFieldValue('wageRateUnit', newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Wage Rate Unit"
                                variant="outlined"
                                fullWidth
                                error={Boolean(touched.wageRateUnit && errors.wageRateUnit)}
                                helperText={touched.wageRateUnit && errors.wageRateUnit}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Autocomplete
                            id="wageRateType"
                            name="wageRateType"
                            options={WageRateType}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            value={values.wageRateType}
                            onChange={(event, newValue) => {
                              setFieldValue('wageRateType', newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Wage Rate Type"
                                variant="outlined"
                                fullWidth
                                error={Boolean(touched.wageRateType && errors.wageRateType)}
                                helperText={touched.wageRateType && errors.wageRateType}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                  <Card sx={{ mx: 0, mb: 3 }}>
                    <Box p={2}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="h4"
                          fontWeight="700"
                          textTransform="uppercase"
                        >
                          Wage Rate
                        </Typography>
                      </Stack>
                    </Box>
                    <Divider />
                    <Box p={2}>
                      <WageRate
                        updatedWageRates={updatedWageRates}
                        assignRAPWageScaleId={assignRAPWageScaleId}
                        programLength={initialValues.programLength}
                      />
                    </Box>
                  </Card>
                  <Card sx={{ mx: 0, mb: 3 }}>
                    <Box p={2}>
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={isSubmitting}
                          startIcon={
                            isSubmitting ? (
                              <CircularProgress size="1rem" />
                            ) : null
                          }
                          color="primary"
                        >
                          {t('Submit')}
                        </Button>
                        <Button
                          variant="outlined"
                          type="submit"
                          onClick={onCancelProjectJobTitleForm}
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
          </>
        )}
      </Box>
    </>
  );
};
export default AddWageScale;
