import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  CircularProgress,
  Autocomplete,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  addTimeSheet,
  getAllProjects,
  getAllReasonType,
  getEmployeeTimeSheet,
  updateEmployeeTimeSheet
} from 'src/api/employee/timesheet';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const AddTimeSheet = ({
  onCancelContactForm,
  onClick,
  employeeId,
  timesheetId
}) => {
  console.log(onClick, timesheetId);
  const { t } = useTranslation();
  const [projectType, setProjectType] = useState([]);
  const [reasonEntryType, setReasonEntryType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    project: null,
    note: '',
    timeZone: '',
    entryReasonType: null,
    workDate: null,
    startTime: null,
    endTime: null,
    IsPrivate: false
  });
  const handleClear = () => {
    setInitialValues({
      project: null,
      note: '',
      timeZone: '',
      entryReasonType: null,
      workDate: null,
      startTime: null,
      endTime: null,
      IsPrivate: false
    });
  };

  const fetchAllEmployeeProject = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllProjects(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setProjectType(
            res.data.data.map((item) => ({
              label: item.projectName,
              value: item.projectId
            }))
          );
        } else if (res.data.data == null) {
          setProjectType([]);
        }
      })
      .catch((e) => console.log(e));
  };
  const fetchAllEmployeeTimeEntryReasonType = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getAllReasonType(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setReasonEntryType(
            res.data.data.map((item) => ({
              label: item.timeEntryReasonType,
              value: item.timeEntryReasonTypeId
            }))
          );
        } else if (res.data.data == null) {
          setReasonEntryType([]);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchAllEmployeeProject();
    fetchAllEmployeeTimeEntryReasonType();
  }, []);

  useEffect(() => {
    fetchEmployeeProject();
  }, [timesheetId]);

  const fetchEmployeeProject = async () => {
    setLoading(true);
    if (timesheetId) {
      const obj = {
        employeeTimesheetId: timesheetId
      };
      try {
        const res = await getEmployeeTimeSheet(obj);

        if (res && res.data && res.data.data) {
          setInitialValues({
            project: res.data.data.projectModel,
            note: res.data.data.comment,
            entryReasonType: res.data.data.timeEntryReasonTypeModel,
            workDate: res.data.data.workDate,
            startTime: res.data.data.startTime,
            endTime: res.data.data.endTime,
            timeZone: res.data.data.timeZone,
            IsPrivate: res.data.data.isOT
          });
        }
      } catch (error) {
        console.error('Error fetching employee timesheet:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Box>
        {loading && timesheetId ? (
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
              project: Yup.object().nullable().required(t('Required')),
              note: Yup.string().max(255).required('Required'),
              entryReasonType: Yup.object().nullable().required('Required'),
              workDate: Yup.date().nullable().required('Required'),
              startTime: Yup.date().nullable().required('Required'),
              endTime: Yup.date().nullable().required('Required'),
              timeZone: Yup.string().max(255).required('Required')
            })}
            onSubmit={async (
              _values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                if (timesheetId) {
                  const obj = {
                    employeeTimesheetId: timesheetId,
                    projectId: _values?.project?.value,
                    timeEntryType: null,
                    timeEntryReasonTypeId: _values?.entryReasonType?.value,
                    timeEntered: null,
                    employeeId: employeeId,
                    startTime: _values?.startTime,
                    endTime: _values?.endTime,
                    workDate: _values?.workDate,
                    isOT: _values?.IsPrivate,
                    comment: _values?.note,
                    timeZone: _values?.timeZone
                  };
                  await updateEmployeeTimeSheet(obj)
                    .then((res) => {
                      if (res) {
                        if (res.status === 200) {
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
                    projectId: _values?.project?.value,
                    timeEntryType: null,
                    timeEntryReasonTypeId: _values?.entryReasonType?.value,
                    timeEntered: null,
                    employeeId: employeeId,
                    startTime: _values?.startTime,
                    endTime: _values?.endTime,
                    workDate: _values?.workDate,
                    isOT: _values?.IsPrivate,
                    comment: _values?.note,
                    timeZone: _values?.timeZone
                  };
                  console.log(obj);
                  await addTimeSheet(obj)
                    .then((res) => {
                      if (res) {
                        if (res.status === 200) {
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
              handleSubmit,
              isSubmitting,
              touched,
              values,
              setFieldValue,
              handleBlur,
              handleChange
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
                            id="project"
                            name="project"
                            options={projectType}
                            value={values.project}
                            onChange={(event, newValue) => {
                              setFieldValue('project', newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Project"
                                variant="outlined"
                                fullWidth
                                error={Boolean(
                                  touched.project && errors.project
                                )}
                                helperText={touched.project && errors.project}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DatePicker
                            label="Work Date"
                            value={values.workDate}
                            onChange={(newValue) => {
                              setFieldValue('workDate', newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                placeholder={t('Work Date')}
                                error={Boolean(
                                  touched.workDate && errors.workDate
                                )}
                                helperText={touched.workDate && errors.workDate}
                                InputProps={{
                                  ...params.InputProps,
                                  inputProps: {
                                    ...params.inputProps,
                                    placeholder: 'MM/DD/YYYY',
                                    mask: '__/__/____'
                                  }
                                }}
                              />
                            )}
                            inputFormat="MM/dd/yyyy"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            name="note"
                            helperText={touched.note && errors.note}
                            error={Boolean(touched.note && errors.note)}
                            value={values.note}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            label={t('Comments')}
                            placeholder={t('Comments')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Autocomplete
                            id="entryReasonType"
                            name="entryReasonType"
                            options={reasonEntryType}
                            value={values.entryReasonType}
                            onChange={(event, newValue) => {
                              setFieldValue('entryReasonType', newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select TimeEntry Reason Type"
                                variant="outlined"
                                fullWidth
                                error={Boolean(
                                  touched.entryReasonType &&
                                    errors.entryReasonType
                                )}
                                helperText={
                                  touched.entryReasonType &&
                                  errors.entryReasonType
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={3}>
                              <TimePicker
                                label="Start Time"
                                value={values.startTime}
                                onChange={(newValue) => {
                                  setFieldValue('startTime', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={Boolean(
                                      touched.startTime && errors.startTime
                                    )}
                                    helperText={
                                      touched.startTime && errors.startTime
                                    }
                                  />
                                )}
                              />
                            </Stack>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={3}>
                              <TimePicker
                                label="End Time"
                                value={values.endTime}
                                onChange={(newValue) => {
                                  setFieldValue('endTime', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={Boolean(
                                      touched.endTime && errors.endTime
                                    )}
                                    helperText={
                                      touched.endTime && errors.endTime
                                    }
                                  />
                                )}
                              />
                            </Stack>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            name="timeZone"
                            helperText={touched.timeZone && errors.timeZone}
                            error={Boolean(touched.timeZone && errors.timeZone)}
                            value={values.timeZone}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            label={t('Time Zone')}
                            placeholder={t('Time Zone')}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl component="fieldset">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.IsPrivate}
                                  onChange={(event) =>
                                    setFieldValue(
                                      'IsPrivate',
                                      event.target.checked
                                    )
                                  }
                                />
                              }
                              label={t('Is Over Time?')}
                            />
                          </FormControl>
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

export default AddTimeSheet;
