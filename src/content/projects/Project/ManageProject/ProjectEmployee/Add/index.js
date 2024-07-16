import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  CircularProgress,
  Grid,
  Autocomplete,
  Zoom,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { getAllProjectJobTitles, getProjectJobTitle } from 'src/api/projects/ProjectJobTitle';
import { getAllEmployementTermType } from 'src/api/settings/employeeTermType';
import { getAllNonMappedEmployee, addNewProjectEmployee, getAllMentorList, getEmployeeWageScaleList, getEmployeeWageScaleDetail } from 'src/api/projects/ProjectEmployee';


const AddProjectEmployee = ({ projectId, onCancelProjectJobEmployeeForm, onClick }) => {
  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5
        }
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff'
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600]
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
      }
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500
      })
    }
  }));


  const { t } = useTranslation();
  const [jobTitle, setJobTitle] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [employeeWageScaleDetail, setEmployeeWageScaleDetail] = useState(0);
  const [employeeWageScale, setEmployeeWageScale] = useState([]);
  const [employeeTermType, setEmployeeTermType] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [perDiem, setPerDiem] = useState(null);
  const [wageRate, setWageRate] = useState(null);
  const [fringe, setFringe] = useState(null);
  const [isApprentice, setIsApprentice] = useState(false);
  const [actualHourlyRate, setActualHourlyRate] = useState(null);
  const [open, setOpenModal] = React.useState(false);
  const [isRAPMapped, setIsRAPMapped] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3
  };

  useEffect( () => {
    fetchEmployees(false);
    fetchJobTitle();
    fetchEmployeeTermType();
    fetchMentors();
  }, []);

  const fetchEmployees = (isApprentice) => {
    let temp = [];
    getAllNonMappedEmployee(projectId, isApprentice)
      .then((res) => {
        console.log(res)
        if (res) {
          res.data.forEach((e) => {
            temp.push({
              label: e.firstName + " " + e.lastName,
              value: e.employeeId
            });
          });
          console.log(temp)
          setEmployees(temp);
        }
      })
      .catch((e) => console.log(e));
  }

  const fetchWageScaleList = (employeeId) => {
    let temp = [];
    setLoading(true)
    getEmployeeWageScaleList(employeeId, projectId)
      .then((res) => {
        res.data.data.forEach((e) => {
          temp.push({
            label: e.wageScaleTitle,
            value: e.assignRAPWageScaleId
          });
        });
        setLoading(false)
        if (temp.length === 0) {
          setIsRAPMapped(false)
        } else {
          setIsRAPMapped(true)
        }
        setEmployeeWageScale(temp);
      })
      .catch((e) => console.log(e));
  }

  const fetchWageScaleDetail = (id) => {
    getEmployeeWageScaleDetail(employeeId, id)
      .then((res) => {
        setEmployeeWageScaleDetail(res.data.data.wageRate)
      })
      .catch((e) => console.log(e));
  }

  const fetchMentors = () => {
    let temp = [];
    getAllMentorList(projectId)
      .then((res) => {
        console.log(res)
        if (res) {
          res.data.forEach((e) => {
            temp.push({
              label: e.firstName + " " + e.lastName,
              value: e.employeeId
            });
          });
          console.log(temp)
          setMentors(temp);
        }
      })
      .catch((e) => console.log(e));
  }

  const fetchJobTitle = () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ' '
    };
    let temp = [];
    getAllProjectJobTitles(obj, projectId)
      .then((res) => {
        if (res) {
          res.data.data.forEach((e) => {
            temp.push({
              label: e.jobTitle,
              value: e.projectJobTitleId
            });
          });
          setJobTitle(temp);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchEmployeeTermType = () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ' '
    };
    let temp = [];
    getAllEmployementTermType(obj)
      .then((res) => {
        if (res) {
          res.data.data.forEach((e) => {
            temp.push({
              label: e.employmentTermType,
              value: e.employmentTermTypeId
            });
          });
          setEmployeeTermType(temp);
        }
      })
      .catch((e) => console.log(e));
  };


  useEffect(() => {
    console.log(perDiem)
    console.log(wageRate)
    console.log(fringe)
  }, [perDiem, wageRate, fringe]);

  const fetchPerDiem = async (item) => {
    if(item?.value){
      await getProjectJobTitle(item?.value)
      .then((res) => {
        if (res) {
          console.log(res.data.data)
          if (res.data.data.perDiem !== null) {
            setPerDiem(res.data.data.perDiem);
            if (!isApprentice) {
              setWageRate(parseFloat(res.data.data.wageRate));
            }
            setFringe(parseFloat(res.data.data.fringe));
            setActualHourlyRate(parseFloat(res.data.data.wageRate) + parseFloat(res.data.data.fringe));
          }
          else {
            setPerDiem(0)
            setWageRate(0)
            setFringe(0)
            setActualHourlyRate(0);
          }

        }

      })
      .catch((e) => console.log(e))
    }else{
      setPerDiem(0)
      setWageRate(0)
      setFringe(0)
      setActualHourlyRate(0);
    }
    
  }

  const assignWageRate = () => {
    setWageRate(employeeWageScaleDetail)
    setActualHourlyRate(parseFloat(employeeWageScaleDetail) + parseFloat(fringe === null ? 0 : fringe));
    setOpenModal(false)
  }


  return (
    <>

      <Card sx={{ mx: 0, mb: 3 }}>
        <Box p={2}>
          <Formik
            initialValues={{
              jobTitle: null,
              clientId: null,
              employee: null,
              mentor: null,
              startDate: null,
              endDate: null,
              employeeTermType: null,
              perDiem: perDiem,
              rate: wageRate,
              fringe: fringe
            }}
            validationSchema={Yup.object().shape(isApprentice ? {
              jobTitle: Yup.object().nullable().required(t('Job title is required.')),
              employee: Yup.object().nullable().required(t('Employee is required.')),
              mentor: Yup.object().nullable().required(t('Mentor is required.')),
              startDate: Yup.date().nullable()
                .required(t('Start Date is required.')),
              endDate: Yup.date().nullable().min(
                Yup.ref('startDate'),
                "End date must be greater than start date."
              )
            } : {
              jobTitle: Yup.object().nullable().required(t('Job title is required.')),
              employee: Yup.object().nullable().required(t('Employee is required.')),
              startDate: Yup.date().nullable()
                .required(t('Start Date is required.')),
              endDate: Yup.date().nullable().min(
                Yup.ref('startDate'),
                "End date must be greater than start date."
              )
            })}
            onSubmit={async (
              _values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {

              console.log(_values)
              let obj = {
                "projectJobTitleId": _values?.jobTitle?.value,
                "employeeId": _values?.employee?.value,
                "startDate": _values?.startDate,
                "endDate": _values?.endDate,
                "employmentTermTypeId": _values?.employeeTermType === null ? null : _values?.employeeTermType?.value,
                "perDiem": perDiem,
                "rate": wageRate,
                "fringe": fringe,
                "mentorId": _values?.mentor?.value
              }
              console.log(obj)
              await addNewProjectEmployee(obj)
                .then((res) => {
                  if (res.data) {
                    onClick()
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
            }}
          >
            {({
              errors,
              handleSubmit,
              isSubmitting,
              touched,
              values,
              setFieldValue
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                  <FormControlLabel
                                value={isApprentice}
                                name="isApprentice"
                                onChange={(event, newValue) => {
                                  if (newValue === false) {
                                    setIsApprentice(false)
                                    fetchEmployees(false);
                                  } else {
                                    setIsApprentice(true)
                                    fetchEmployees(true);
                                  }
                                }}
                                control={
                                  <IOSSwitch
                                    sx={{ m: 1 }}
                                    checked={isApprentice}
                                  />
                                }
                                label="Apprentice"
                              />
                   
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="jobTitle"
                      name="jobTitle"
                      options={jobTitle}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={values.jobTitle}
                      onChange={(event, newValue) => {
                        setFieldValue('jobTitle', newValue);
                        if(newValue!== null)
                        fetchPerDiem(newValue)
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Job Title"
                          variant="outlined"
                          fullWidth
                          error={Boolean(touched.jobTitle && errors.jobTitle)}
                          helperText={touched.jobTitle && errors.jobTitle}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="employee"
                      name="employee"
                      options={employees}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={values.employee}
                      onChange={(event, newValue) => {
                        setFieldValue('employee', newValue);
                        if (isApprentice) {
                          if (newValue !== null) {
                            fetchWageScaleList(newValue?.value)
                            setEmployeeId(newValue?.value)
                            setEmployeeWageScaleDetail(null)
                            setOpenModal(true)
                          }

                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Employee"
                          variant="outlined"
                          fullWidth
                          error={Boolean(touched.employee && errors.employee)}
                          helperText={touched.employee && errors.employee}
                        />
                      )}
                    />
                  </Grid>
                  
                  {isApprentice ? <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="mentor"
                      name="mentor"
                      options={mentors}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={values.mentor}
                      onChange={(event, newValue) => {
                        setFieldValue('mentor', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Mentor"
                          variant="outlined"
                          fullWidth
                          error={Boolean(touched.mentor && errors.mentor)}
                          helperText={touched.mentor && errors.mentor}
                        />
                      )}
                    />
                  </Grid> : <></>}

                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Start Date"
                      value={values.startDate}
                      onChange={(newValue) => {
                        setFieldValue('startDate', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder={t('Start Date')}
                          error={Boolean(touched.startDate && errors.startDate)}
                          helperText={touched.startDate && errors.startDate}
                        />
                      )}
                      inputFormat="MM-dd-yyyy"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="End Date"
                      value={values.endDate}
                      onChange={(newValue) => {
                        setFieldValue('endDate', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder={t('End date')}
                          error={Boolean(touched.endDate && errors.endDate)}
                          helperText={touched.endDate && errors.endDate}
                        />
                      )}
                      inputFormat="MM-dd-yyyy"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      id="employeeTermType"
                      name="employeeTermType"
                      options={employeeTermType}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={values.employeeTermType}
                      onChange={(event, newValue) => {
                        setFieldValue('employeeTermType', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Employee Term Type"
                          variant="outlined"
                          fullWidth
                          error={Boolean(
                            touched.employeeTermType && errors.employeeTermType
                          )}
                          helperText={
                            touched.employeeTermType && errors.employeeTermType
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="perDiem"
                      helperText={touched.perDiem && errors.perDiem}
                      error={Boolean(touched.perDiem && errors.perDiem)}
                      value={perDiem || ''}
                      onChange={(e) => setPerDiem(e.target.value)}
                      variant="outlined"
                      label={t('PerDiem')}
                      placeholder={t('PerDiem')}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="rate"
                      helperText={touched.rate && errors.rate}
                      error={Boolean(touched.rate && errors.rate)}
                      value={wageRate || ''}
                      onChange={(e) => {
                        setWageRate(e.target.value);
                        setActualHourlyRate((parseFloat(e.target.value || 0) + parseFloat(fringe || 0)).toFixed(2));
                      }}
                      variant="outlined"
                      label={t('Hourly Wage Rate')}
                      placeholder={t('Hourly Wage Rate')}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="fringe"
                      helperText={touched.fringe && errors.fringe}
                      error={Boolean(touched.fringe && errors.fringe)}
                      value={fringe || ''}
                      onChange={(e) => {
                        setFringe(e.target.value);
                        setActualHourlyRate((parseFloat(e.target.value || 0) + parseFloat(wageRate || 0)).toFixed(2));
                      }}
                      variant="outlined"
                      label={t('Fringe')}
                      placeholder={t('Fringe')}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="actualHourlyRate"
                      helperText={touched.actualHourlyRate && errors.actualHourlyRate}
                      error={Boolean(touched.actualHourlyRate && errors.actualHourlyRate)}
                      value={actualHourlyRate || ''}
                      onChange={(e) => setActualHourlyRate(e.target.value)}
                      variant="outlined"
                      label={t('Actual Hourly Rate')}
                      placeholder={t('Actual Hourly Rate')}
                      type="number"
                      inputProps={
                        { readOnly: true, }
                      }
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
                    onClick={onCancelProjectJobEmployeeForm}
                    color="primary"
                  >
                    {t('Cancel')}
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style, width: 700 }}>
            <h2 id="parent-modal-title">Assign Wage Rate</h2>
            {loading ? (
              <>
                <CircularProgress
                  size="3rem"
                  sx={{ display: 'flex', margin: '0 auto', my: 5 }}
                />
              </>
            ) : <>{!isRAPMapped ? <p id="parent-modal-description">
              No RAP is mapped to this apprentice.
            </p> : <><Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  id="employeeWageScale"
                  name="employeeWageScale"
                  options={employeeWageScale}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  onChange={(event, newValue) => {
                    fetchWageScaleDetail(newValue.value)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Wage Scale"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-amount">Starting Hourly Comp</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label={t('Starting Hourly Comp')}
                    name="employeeWageScaleDetail"
                    value={employeeWageScaleDetail || ''}
                    inputProps={{readOnly:true}}
                  />
                </FormControl>

              </Grid>
            </Grid>
              <Stack direction="row" spacing={2} mt={5}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  onClick={assignWageRate}
                >
                  {t('Assign')}
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => setOpenModal(false)}
                  color="primary"
                >
                  {t('Cancel')}
                </Button>
              </Stack></>}</>}


          </Box>
        </Modal>
      </Card>
    </>
  );
};
export default AddProjectEmployee;
