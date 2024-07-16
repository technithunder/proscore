import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Switch from '@mui/material/Switch';
import Modal from '@mui/material/Modal';
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  CircularProgress,
  Grid,
  Divider,
  Autocomplete,
  Typography,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup
} from '@mui/material';
import {
  getProjectInfo,
  updateProjectInfo,
  addProjectInfo
} from 'src/api/projects/MyProjectInfo';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import { styled } from '@mui/material/styles';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { AlphaNumeric } from 'src/constants/validations';

const MyProjectInfo = ({ id }) => {
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
  const [open, setOpenModal] = React.useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [projectInfoId, setProjectInfoId] = useState(null);
  const [isTimekeepingPeriod, setTimekeepingPeriod] = useState(false);
  const [isTimekeepingProscore, setTimekeepingProscore] = useState(false);
  const [isElearningHoursPaid, setIsElearningHoursPaid] = useState(false);
  const [isElearningType, setIsElearningType] = useState('');
  const [typicalShiftArray, setTypicalShiftArray] = useState([]);
  const [preferredDaysArray, setPreferredDaysArray] = useState([]);
  const [timeKeepingPeriodArray, setTimeKeepingPeriodArray] = useState([]);
  const [mobileAppTimeKeepingObj, setMobileAppTimeKeepingObj] = useState({
    mobileAppTimeKeepingManagement_QC: false,
    mobileAppTimeKeepingManagement_FC: false,
    mobileAppTimeKeepingManagement_MO: false
  });
  const [typicalShiftObj, setTypicalShiftObj] = useState({
    typicalShiftDaySun: false,
    typicalShiftDayMon: false,
    typicalShiftDayTue: false,
    typicalShiftDayWed: false,
    typicalShiftDayThu: false,
    typicalShiftDayFri: false,
    typicalShiftDaySat: false
  });

  const [preferredDaysObj, setPreferredDaysObj] = useState({
    preferredDaySun: false,
    preferredDayMon: false,
    preferredDayTue: false,
    preferredDayWed: false,
    preferredDayThu: false,
    preferredDayFri: false,
    preferredDaySat: false
  });
  const [initialValues, setInitialValues] = useState({
    certifiedPayrollEmailAddress: '',
    moreThanFourEmployees: null,
    employeeCount: null,
    typicalShiftDay: '',
    shiftStartTime: null,
    shiftEndTime: null,
    startDate: null,
    endDate: null,
    totalWorkforceHours: null,
    payPeriodBegin: '',
    payPeriodEnd: '',
    useProscoreMobileApp: false,
    mobileAppTimeKeepingManagement: null,
    provideTimeKeepingOn: null,
    isAllowMoreThanOneSiteLocation: false,
    isAllowWorkerToAddMoreThanOneOccupation: false,
    payrollOn: null,
    timeKeepingSystem: '',
    adaptiveElearning: false,
    flexibleElearning: false,
    accelaratedElearning: false,
    courseContentDelivery: null,
    apprenticeHoursTracking: null,
    elearningHoursPaid: null,
    learningOrClassHoursPaid: null,
    maxPaidHoursPerDay: null,
    preferredDays: null,
    preferredDayStartTime: null,
    preferredDayEndTime: null,
    wageRate: null,
    fringe: null,
    relatedInstructionProvidedHours: null
  });
  const laborProvider = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];
  const timeKeepingPeriod = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' }
  ];
  const PayrollOnOption = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'BiWeekly', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' }
  ];
  const CourseContentDeliveryOptions = [
    { label: 'Fixed Schedule', value: '1' },
    { label: 'Flexible', value: '2' },
    { label: 'Adaptive E-Learning', value: '3' },
    { label: 'Accelerated Path', value: '4' },
    { label: 'ALL', value: '5' }
  ];
  const TrackingMethod = [
    { label: 'ProScore Mobile app', value: '1' },
    { label: 'Client Timekeeping System', value: '2' },
    { label: 'Manual Timesheet', value: '3' }
  ];
  const ElearningHoursPaidOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];
  const RelatedInstructionIsProvidedOptions = [
    { label: 'During Work Hours', value: 'DuringWorkHours' },
    { label: 'Not During Work Hours', value: 'NotDuringWorkHours' },
    {
      label: 'Both During and Not During Work Hours',
      value: 'BothDuringandNotDuringWorkHours'
    }
  ];

  useEffect( () => {
    setLoading(true);
    if (id) {
      const payload = {
        projectId: id
      };
       getProjectInfo(payload)
        .then((res) => {
          if (res) {
            setInitialValues({
              certifiedPayrollEmailAddress: res.data.data.payrollEmail,
              moreThanFourEmployees:
                res.data.data.moreThanFourEmployees !== null
                  ? laborProvider.filter(
                      (x) => x.value === res.data.data.moreThanFourEmployees
                    )[0]
                  : null,
              employeeCount: res.data.data.employeeCount,
              typicalShiftDay: res.data.data.typicalShiftDay,
              shiftStartTime:
                res.data?.data?.shiftStartTime !== null
                  ? new Date(
                      '1900-01-01T'.concat(res.data?.data?.shiftStartTime)
                    )
                  : null,
              shiftEndTime:
                res.data?.data?.shiftEndTime !== null
                  ? new Date('1900-01-01T'.concat(res.data?.data?.shiftEndTime))
                  : null,
              startDate: res.data.data.workforceStartDate,
              endDate: res.data.data.workforceEndDate,
              totalWorkforceHours: res.data.data.percentageApprenticeWork,
              payPeriodBegin: res.data.data.payPeriodBegin,
              payPeriodEnd: res.data.data.payPeriodEnd,
              useProscoreMobileApp: res.data.data.useProscoreMobileApp,
              mobileAppTimeKeepingManagement:
                res.data.data.mobileAppTimeKeepingManagement,
              provideTimeKeepingOn:
                res.data.data.provideTimeKeepingOn !== null
                  ? timeKeepingPeriod.filter(
                      (x) => x.value === res.data.data.provideTimeKeepingOn
                    )[0]
                  : null,
              timeKeepingSystem: res.data.data.timeKeepingSystem,
              isAllowMoreThanOneSiteLocation:
                res.data.data.isAllowMoreThanOneSiteLocation,
              isAllowWorkerToAddMoreThanOneOccupation:
                res.data.data.isAllowWorkerToAddMoreThanOneOccupation,
              payrollOn:
                res.data.data.payrollOn !== null
                  ? PayrollOnOption.filter(
                      (x) => x.value === res.data.data.payrollOn
                    )[0]
                  : null,
              adaptiveElearning:
                res.data?.data?.apprenticeManagementModel?.isAdaptive,
              flexibleElearning:
                res.data?.data?.apprenticeManagementModel?.isFlexible,
              accelaratedElearning:
                res.data?.data?.apprenticeManagementModel?.isAccelerated,
              courseContentDelivery:
                res.data.data.apprenticeManagementModel
                  ?.courseContentDelivery !== null
                  ? CourseContentDeliveryOptions.filter(
                      (x) =>
                        x.value ===
                        res.data.data.apprenticeManagementModel
                          ?.courseContentDelivery
                    )[0]
                  : null,
              apprenticeHoursTracking:
                res.data.data.apprenticeManagementModel
                  ?.apprenticeHoursTracking !== null
                  ? TrackingMethod.filter(
                      (x) =>
                        x.value ===
                        res.data.data.apprenticeManagementModel
                          ?.apprenticeHoursTracking
                    )[0]
                  : null,
              preferredDays:
                res.data?.data?.apprenticeManagementModel?.preferredDays,
              maxPaidHoursPerDay:
                res.data?.data?.apprenticeManagementModel?.maxPaidHoursPerDay,
              wageRate: res.data?.data?.apprenticeManagementModel?.wageRate,
              fringe: res.data?.data?.apprenticeManagementModel?.fringe,
              preferredDayStartTime:
                res.data?.data?.apprenticeManagementModel?.startTime !== null
                  ? new Date(
                      '1900-01-01T'.concat(
                        res.data?.data?.apprenticeManagementModel?.startTime
                      )
                    )
                  : null,
              preferredDayEndTime:
                res.data?.data?.apprenticeManagementModel?.endTime !== null
                  ? new Date(
                      '1900-01-01T'.concat(
                        res.data?.data?.apprenticeManagementModel?.endTime
                      )
                    )
                  : null,
              elearningHoursPaid:
                res.data.data.apprenticeManagementModel?.learningHoursPaid !==
                null
                  ? ElearningHoursPaidOptions.filter(
                      (x) =>
                        x.value ===
                        res.data.data.apprenticeManagementModel
                          ?.learningHoursPaid
                    )[0]
                  : null,
              learningOrClassHoursPaid:
                res.data.data.apprenticeManagementModel
                  ?.learningOrClassHoursPaid !== null
                  ? ElearningHoursPaidOptions.filter(
                      (x) =>
                        x.value ===
                        res.data.data.apprenticeManagementModel
                          ?.learningOrClassHoursPaid
                    )[0]
                  : null,
              relatedInstructionProvidedHours: res.data.data
                ?.apprenticeManagementModel?.relatedInstructionProvidedHours
                ? RelatedInstructionIsProvidedOptions.filter(
                    (x) =>
                      x.value ===
                      res.data.data?.apprenticeManagementModel
                        ?.relatedInstructionProvidedHours
                  )[0]
                : null
            });
            const objArray = res.data.data.typicalShiftDay?.split(',');
            setTypicalShiftArray(objArray || []);
            if (objArray?.filter((x) => x === 'Sun').length > 0) {
              typicalShiftObj.typicalShiftDaySun = true;
            } else {
              typicalShiftObj.typicalShiftDaySun = false;
            }
            if (objArray?.filter((x) => x === 'Mon').length > 0) {
              typicalShiftObj.typicalShiftDayMon = true;
            } else {
              typicalShiftObj.typicalShiftDayMon = false;
            }
            if (objArray?.filter((x) => x === 'Tue').length > 0) {
              typicalShiftObj.typicalShiftDayTue = true;
            } else {
              typicalShiftObj.typicalShiftDayTue = false;
            }
            if (objArray?.filter((x) => x === 'Wed').length > 0) {
              typicalShiftObj.typicalShiftDayWed = true;
            } else {
              typicalShiftObj.typicalShiftDayWed = false;
            }
            if (objArray?.filter((x) => x === 'Sun').length > 0) {
              typicalShiftObj.typicalShiftDaySun = true;
            } else {
              typicalShiftObj.typicalShiftDaySun = false;
            }
            if (objArray?.filter((x) => x === 'Thu').length > 0) {
              typicalShiftObj.typicalShiftDayThu = true;
            } else {
              typicalShiftObj.typicalShiftDayThu = false;
            }
            if (objArray?.filter((x) => x === 'Fri').length > 0) {
              typicalShiftObj.typicalShiftDayFri = true;
            } else {
              typicalShiftObj.typicalShiftDayFri = false;
            }
            if (objArray?.filter((x) => x === 'Sat').length > 0) {
              typicalShiftObj.typicalShiftDaySat = true;
            } else {
              typicalShiftObj.typicalShiftDaySat = false;
            }

            const preferredDaysObjArray =
              res.data.data.apprenticeManagementModel.preferredDays?.split(',');
            setPreferredDaysArray(preferredDaysObjArray || []);
            if (preferredDaysObjArray?.filter((x) => x === 'Sun').length > 0) {
              preferredDaysObj.preferredDaySun = true;
            } else {
              preferredDaysObj.preferredDaySun = false;
            }
            if (preferredDaysObjArray?.filter((x) => x === 'Mon').length > 0) {
              preferredDaysObj.preferredDayMon = true;
            } else {
              preferredDaysObj.preferredDayMon = false;
            }
            if (preferredDaysObjArray?.filter((x) => x === 'Tue').length > 0) {
              preferredDaysObj.preferredDayTue = true;
            } else {
              preferredDaysObj.preferredDayTue = false;
            }
            if (preferredDaysObjArray?.filter((x) => x === 'Wed').length > 0) {
              preferredDaysObj.preferredDayWed = true;
            } else {
              preferredDaysObj.preferredDayWed = false;
            }
            if (preferredDaysObjArray?.filter((x) => x === 'Sun').length > 0) {
              preferredDaysObj.preferredDaySun = true;
            } else {
              preferredDaysObj.preferredDaySun = false;
            }
            if (preferredDaysObjArray?.filter((x) => x === 'Thu').length > 0) {
              preferredDaysObj.preferredDayThu = true;
            } else {
              preferredDaysObj.preferredDayThu = false;
            }
            if (preferredDaysObjArray?.filter((x) => x === 'Fri').length > 0) {
              preferredDaysObj.preferredDayFri = true;
            } else {
              preferredDaysObj.preferredDayFri = false;
            }
            if (preferredDaysObjArray?.filter((x) => x === 'Sat').length > 0) {
              preferredDaysObj.preferredDaySat = true;
            } else {
              preferredDaysObj.preferredDaySat = false;
            }

            setProjectInfoId(res.data.data?.projectInfoId);
            setIsElearningType(
              res.data.data.apprenticeManagementModel?.courseContentDelivery
            );
            setIsElearningHoursPaid(
              res.data.data.apprenticeManagementModel?.learningHoursPaid
            );
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const timePickingChange = (item) => {
    if (item?.value === true) {
      setTimekeepingPeriod(true);
      setTimekeepingProscore(false);
    } else {
      setTimekeepingProscore(true);
      setTimekeepingPeriod(false);
    }
  };

  const handleTypicalShiftChange = (event) => {
    if (event.target.checked) {
      setTypicalShiftArray([...typicalShiftArray, event.target.value]);
    } else {
      const array = filterArray(typicalShiftArray, event.target.value);
      setTypicalShiftArray(array);
    }
    BindTypicalShift(event.target.name, event.target.checked);
  };

  const handlePreferredDaysChange = (event) => {
    if (event.target.checked) {
      setPreferredDaysArray([...preferredDaysArray, event.target.value]);
    } else {
      const array = filterArray(preferredDaysArray, event.target.value);
      setPreferredDaysArray(array);
    }
    BindPreferredDays(event.target.name, event.target.checked);
  };

  const handleTimekeepingPeriod = (event) => {
    if (event.target.checked) {
      setTimeKeepingPeriodArray([
        ...timeKeepingPeriodArray,
        event.target.value
      ]);
    } else {
      const array = filterArray(timeKeepingPeriodArray, event.target.value);
      setTimeKeepingPeriodArray(array);
    }
    BindMobileAppTimeKeeping(event.target.name, event.target.checked);
  };

  const filterArray = (array, toRemove) => {
    const index = array.indexOf(toRemove);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  };

  const BindTypicalShift = (item, val) => {
    setTypicalShiftObj({ ...typicalShiftObj, [item]: val });
  };

  const BindPreferredDays = (item, val) => {
    setPreferredDaysObj({ ...preferredDaysObj, [item]: val });
  };

  const BindMobileAppTimeKeeping = (item, val) => {
    setMobileAppTimeKeepingObj({ ...mobileAppTimeKeepingObj, [item]: val });
  };

  return (
    <>
      {!id ? <></> : <Outlet />}
      <>
        {loading && id ? (
          <>
            <CircularProgress
              size="3rem"
              sx={{ display: 'flex', margin: '0 auto', my: 5 }}
            />
          </>
        ) : (
          <>
            <Box>
              {loading && id ? (
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
                    certifiedPayrollEmailAddress: Yup.string()
                      .email('Must be a valid email')
                      .max(255),
                    timeKeepingSystem: Yup.string()
                      .nullable()
                      .matches(
                        AlphaNumeric.regexPattern,
                        AlphaNumeric.errorMessage
                      ),
                    startDate: Yup.date().nullable(),
                    endDate: Yup.date()
                      .nullable()
                      .min(
                        Yup.ref('startDate'),
                        'End date must be greater than start date.'
                      )
                  })}
                  onSubmit={ (
                    _values,
                    { resetForm, setErrors, setStatus, setSubmitting }
                  ) => {
                    try {
                      let payload = {
                        projectId: id,
                        payrollEmail: _values?.certifiedPayrollEmailAddress,
                        percentageApprenticeWork: _values?.totalWorkforceHours,
                        moreThanFourEmployees:
                          _values?.moreThanFourEmployees?.value,
                        employeeCount: _values?.employeeCount,
                        typicalShiftDay:
                          typicalShiftArray?.length > 0
                            ? Array.from(new Set(typicalShiftArray)).toString()
                            : '',
                        timeKeepingSystem: _values?.timeKeepingSystem,
                        // shiftStartTime: _values?.shiftStartTime,
                        // shiftEndTime: _values?.shiftEndTime,
                        shiftStartTime:
                          _values?.shiftStartTime !== null
                            ? _values?.shiftStartTime
                                .toTimeString()
                                .split(' ')[0]
                            : null,
                        shiftEndTime:
                          _values?.shiftEndTime !== null
                            ? _values?.shiftEndTime.toTimeString().split(' ')[0]
                            : null,
                        payPeriodBegin: _values?.payPeriodBegin,
                        payPeriodEnd: _values?.payPeriodEnd,
                        workforceStartDate: _values?.startDate,
                        workforceEndDate: _values?.endDate,
                        useProscoreMobileApp: _values?.useProscoreMobileApp,
                        mobileAppTimeKeepingManagement:
                          timeKeepingPeriodArray?.length > 0
                            ? Array.from(
                                new Set(timeKeepingPeriodArray)
                              ).toString()
                            : '',
                        provideTimeKeepingOn:
                          _values?.provideTimeKeepingOn?.value,
                        isAllowMoreThanOneSiteLocation:
                          _values?.isAllowMoreThanOneSiteLocation,
                        isAllowWorkerToAddMoreThanOneOccupation:
                          _values?.isAllowWorkerToAddMoreThanOneOccupation,
                        payrollOn:
                          _values.payrollOn !== null
                            ? _values?.payrollOn?.value
                            : null,
                        apprenticeManagementModel: {
                          isAdaptive: _values?.adaptiveElearning,
                          isFlexible: _values?.flexibleElearning,
                          isAccelerated: _values?.accelaratedElearning,
                          courseContentDelivery:
                            _values?.courseContentDelivery?.value,
                          apprenticeHoursTracking:
                            _values?.apprenticeHoursTracking?.value,
                          // startTime: _values?.preferredDayStartTime,
                          // endTime: _values?.preferredDayEndTime,
                          startTime:
                            _values?.preferredDayStartTime !== null
                              ? _values?.preferredDayStartTime
                                  .toTimeString()
                                  .split(' ')[0]
                              : null,
                          endTime:
                            _values?.preferredDayEndTime !== null
                              ? _values?.preferredDayEndTime
                                  .toTimeString()
                                  .split(' ')[0]
                              : null,
                          preferredDays:
                            preferredDaysArray?.length > 0
                              ? Array.from(
                                  new Set(preferredDaysArray)
                                ).toString()
                              : '',
                          learningHoursPaid: _values?.elearningHoursPaid?.value,
                          maxPaidHoursPerDay: _values?.maxPaidHoursPerDay,
                          fringe: _values?.fringe,
                          wageRate: _values?.wageRate,
                          learningOrClassHoursPaid:
                            _values?.learningOrClassHoursPaid?.value,
                          relatedInstructionProvidedHours:
                            _values?.relatedInstructionProvidedHours?.value
                        }
                      };

                      console.log('payload---', payload);

                      if (projectInfoId) {
                        payload = {
                          ...payload,
                          projectInfoId: projectInfoId
                        };
                         updateProjectInfo(payload)
                          .then((res) => {
                            if (res.data) {
                              resetForm();
                              setStatus({ success: true });
                              setSubmitting(false);
                              navigate('/projects/project', {
                                state: { action: 'updated' }
                              });
                            }
                          })
                          .catch((err) => {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                          });
                      } else {
                        console.log('shankar test ---', payload);
                         addProjectInfo(payload)
                          .then((res) => {
                            if (res.data) {
                              resetForm();
                              setStatus({ success: true });
                              setSubmitting(false);
                              navigate('/projects/project', {
                                state: { action: 'updated' }
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
                              My Project Information
                            </Typography>
                          </Stack>
                        </Box>
                        <Divider />
                        <Box p={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="totalWorkforceHours"
                                helperText={
                                  touched.totalWorkforceHours &&
                                  errors.totalWorkforceHours
                                }
                                error={Boolean(
                                  touched.totalWorkforceHours &&
                                    errors.totalWorkforceHours
                                )}
                                value={values.totalWorkforceHours}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t(
                                  'What % of Total Workforce Hours will be worked by Apprentices?'
                                )}
                                placeholder={t(
                                  'What % of Total Workforce Hours will be worked by Apprentices?'
                                )}
                                type="number"
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="moreThanFourEmployees"
                                name="moreThanFourEmployees"
                                options={laborProvider}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                value={values.moreThanFourEmployees}
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'moreThanFourEmployees',
                                    newValue
                                  );
                                  timePickingChange(newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="As a Labor Provider will you be employing more than 4 employees on this Project?"
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="timeKeepingSystem"
                                helperText={
                                  touched.timeKeepingSystem &&
                                  errors.timeKeepingSystem
                                }
                                error={Boolean(
                                  touched.timeKeepingSystem &&
                                    errors.timeKeepingSystem
                                )}
                                value={values.timeKeepingSystem}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t(
                                  'What Time Keeping System will be capturing worker time on a daily basis?'
                                )}
                                placeholder={t(
                                  'What Time Keeping System will be capturing worker time on a daily basis?'
                                )}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="employeeCount"
                                helperText={
                                  touched.employeeCount && errors.employeeCount
                                }
                                value={values.employeeCount}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t(
                                  'How many employees will you be hiring for this project?'
                                )}
                                placeholder={t(
                                  'How many employees will you be hiring for this project?'
                                )}
                                type="number"
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Typography mb={1}>
                                What will be the typical shift and days worked
                                by the workforce employed on this project?
                              </Typography>

                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={handleTypicalShiftChange}
                                    checked={typicalShiftObj.typicalShiftDaySun}
                                    name="typicalShiftDaySun"
                                    value="Sun"
                                  />
                                }
                                label="Sun"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={handleTypicalShiftChange}
                                    checked={typicalShiftObj.typicalShiftDayMon}
                                    name="typicalShiftDayMon"
                                    value="Mon"
                                  />
                                }
                                label="Mon"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={handleTypicalShiftChange}
                                    checked={typicalShiftObj.typicalShiftDayTue}
                                    name="typicalShiftDayTue"
                                    value="Tue"
                                  />
                                }
                                label="Tue"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={handleTypicalShiftChange}
                                    checked={typicalShiftObj.typicalShiftDayWed}
                                    name="typicalShiftDayWed"
                                    value="Wed"
                                  />
                                }
                                label="Wed"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={handleTypicalShiftChange}
                                    checked={typicalShiftObj.typicalShiftDayThu}
                                    name="typicalShiftDayThu"
                                    value="Thu"
                                  />
                                }
                                label="Thu"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={handleTypicalShiftChange}
                                    checked={typicalShiftObj.typicalShiftDayFri}
                                    name="typicalShiftDayFri"
                                    value="Fri"
                                  />
                                }
                                label="Fri"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={handleTypicalShiftChange}
                                    checked={typicalShiftObj.typicalShiftDaySat}
                                    name="typicalShiftDaySat"
                                    value="Sat"
                                  />
                                }
                                label="Sat"
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                name="certifiedPayrollEmailAddress"
                                helperText={
                                  touched.certifiedPayrollEmailAddress &&
                                  errors.certifiedPayrollEmailAddress
                                }
                                error={Boolean(
                                  touched.certifiedPayrollEmailAddress &&
                                    errors.certifiedPayrollEmailAddress
                                )}
                                value={values.certifiedPayrollEmailAddress}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                variant="outlined"
                                label={t(
                                  'Owner Certified Payroll Email Address'
                                )}
                                placeholder={t(
                                  'Owner Certified Payroll Email Address'
                                )}
                              />
                            </Grid>

                            <Grid item xs={12} md={3}>
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <Stack spacing={3}>
                                  <TimePicker
                                    label="Start Time"
                                    value={values.shiftStartTime}
                                    onChange={(newValue) => {
                                      setFieldValue('shiftStartTime', newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField {...params} />
                                    )}
                                  />
                                </Stack>
                              </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} md={3}>
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <Stack spacing={3}>
                                  <TimePicker
                                    label="End Time"
                                    value={values.shiftEndTime}
                                    onChange={(newValue) => {
                                      setFieldValue('shiftEndTime', newValue);
                                    }}
                                    renderInput={(params) => (
                                      <TextField {...params} />
                                    )}
                                  />
                                </Stack>
                              </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} md={6} />
                            <Grid item xs={12} md={6}>
                              <Typography mb={1}>
                                On what day of the week does your pay period
                                begin?
                              </Typography>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                value={values.payPeriodBegin}
                                name="payPeriodBegin"
                                onChange={(event) =>
                                  setFieldValue(
                                    'payPeriodBegin',
                                    event.target?.value
                                  )
                                }
                              >
                                <FormControlLabel
                                  value="Sun"
                                  control={<Radio />}
                                  label="Sun"
                                />
                                <FormControlLabel
                                  value="Mon"
                                  control={<Radio />}
                                  label="Mon"
                                />
                                <FormControlLabel
                                  value="Tue"
                                  control={<Radio />}
                                  label="Tue"
                                />
                                <FormControlLabel
                                  value="Wed"
                                  control={<Radio />}
                                  label="Wed"
                                />
                                <FormControlLabel
                                  value="Thu"
                                  control={<Radio />}
                                  label="Thu"
                                />
                                <FormControlLabel
                                  value="Fri"
                                  control={<Radio />}
                                  label="Fri"
                                />
                                <FormControlLabel
                                  value="Sat"
                                  control={<Radio />}
                                  label="Sat"
                                />
                              </RadioGroup>
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Typography mb={1}>
                                On what day of the week does your pay period
                                end?
                              </Typography>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                value={values.payPeriodEnd}
                                name="payPeriodEnd"
                                onChange={(event) =>
                                  setFieldValue(
                                    'payPeriodEnd',
                                    event.target?.value
                                  )
                                }
                              >
                                <FormControlLabel
                                  value="Sun"
                                  control={<Radio />}
                                  label="Sun"
                                />
                                <FormControlLabel
                                  value="Mon"
                                  control={<Radio />}
                                  label="Mon"
                                />
                                <FormControlLabel
                                  value="Tue"
                                  control={<Radio />}
                                  label="Tue"
                                />
                                <FormControlLabel
                                  value="Wed"
                                  control={<Radio />}
                                  label="Wed"
                                />
                                <FormControlLabel
                                  value="Thu"
                                  control={<Radio />}
                                  label="Thu"
                                />
                                <FormControlLabel
                                  value="Fri"
                                  control={<Radio />}
                                  label="Fri"
                                />
                                <FormControlLabel
                                  value="Sat"
                                  control={<Radio />}
                                  label="Sat"
                                />
                              </RadioGroup>
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <DatePicker
                                label="Workforce Start Date"
                                value={values.startDate}
                                onChange={(newValue) => {
                                  setFieldValue('startDate', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    placeholder={t('Workforce Start Date')}
                                    error={Boolean(
                                      touched.startDate && errors.startDate
                                    )}
                                    helperText={
                                      touched.startDate && errors.startDate
                                    }
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
                              <DatePicker
                                label="Workforce End Date (Est.)"
                                value={values.endDate}
                                onChange={(newValue) => {
                                  setFieldValue('endDate', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    placeholder={t('Workforce End Date')}
                                    error={Boolean(
                                      touched.endDate && errors.endDate
                                    )}
                                    helperText={
                                      touched.endDate && errors.endDate
                                    }
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
                              <FormControlLabel
                                id="useProscoreMobileApp"
                                value={values.useProscoreMobileApp}
                                name="useProscoreMobileApp"
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'useProscoreMobileApp',
                                    newValue
                                  );
                                  timePickingChange(newValue);
                                }}
                                control={
                                  <IOSSwitch
                                    sx={{ m: 1 }}
                                    checked={values.useProscoreMobileApp}
                                  />
                                }
                                label="Will you be using the ProScore Mobile App for Timekeeping Management?"
                              />
                            </Grid>
                            {isTimekeepingPeriod ? (
                              <Grid item xs={12} md={6}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={handleTimekeepingPeriod}
                                      name="mobileAppTimeKeepingManagement_QC"
                                      checked={
                                        mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_QC
                                      }
                                      value="QC"
                                    />
                                  }
                                  label="QR Code"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={handleTimekeepingPeriod}
                                      name="mobileAppTimeKeepingManagement_FC"
                                      checked={
                                        mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_FC
                                      }
                                      value="FC"
                                    />
                                  }
                                  label="Facial Recognisation"
                                />
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      onChange={handleTimekeepingPeriod}
                                      name="mobileAppTimeKeepingManagement_MO"
                                      checked={
                                        mobileAppTimeKeepingObj.mobileAppTimeKeepingManagement_MO
                                      }
                                      value="MO"
                                    />
                                  }
                                  label="Multiple Occupation"
                                />
                              </Grid>
                            ) : (
                              <></>
                            )}

                            {isTimekeepingProscore ? (
                              <Grid item xs={12} md={6}>
                                <Autocomplete
                                  id="provideTimeKeepingOn"
                                  name="provideTimeKeepingOn"
                                  options={timeKeepingPeriod}
                                  getOptionLabel={(option) => option.label}
                                  getOptionValue={(option) => option.value}
                                  value={values.provideTimeKeepingOn}
                                  onChange={(event, newValue) => {
                                    setFieldValue(
                                      'provideTimeKeepingOn',
                                      newValue
                                    );
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Will you be providing timekeeping data on a
                                    daily or weekly basis?"
                                      variant="outlined"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                            ) : (
                              <></>
                            )}

                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="payrollOn"
                                name="payrollOn"
                                options={PayrollOnOption}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                value={values.payrollOn}
                                onChange={(event, newValue) => {
                                  console.log(newValue);
                                  setFieldValue('payrollOn', newValue);
                                  if (newValue?.value === 'weekly') {
                                    setOpenModal(true);
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Are you running payroll on a weekly, biweekly, or monthly basis?"
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <FormControlLabel
                                id="isAllowMoreThanOneSiteLocation"
                                value={values.isAllowMoreThanOneSiteLocation}
                                name="isAllowMoreThanOneSiteLocation"
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'isAllowMoreThanOneSiteLocation',
                                    newValue
                                  );
                                  timePickingChange(newValue);
                                }}
                                control={
                                  <IOSSwitch
                                    sx={{ m: 1 }}
                                    checked={
                                      values.isAllowMoreThanOneSiteLocation
                                    }
                                  />
                                }
                                label="Does the Timekeeping System allow the worker to enter more than one site location (Apprentice)?"
                              />
                            </Grid>

                            <Grid item xs={12} md={5}>
                              <FormControlLabel
                                id="isAllowWorkerToAddMoreThanOneOccupation"
                                value={
                                  values.isAllowWorkerToAddMoreThanOneOccupation
                                }
                                name="isAllowWorkerToAddMoreThanOneOccupation"
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'isAllowWorkerToAddMoreThanOneOccupation',
                                    newValue
                                  );
                                  timePickingChange(newValue);
                                }}
                                control={
                                  <IOSSwitch
                                    sx={{ m: 1 }}
                                    checked={
                                      values.isAllowWorkerToAddMoreThanOneOccupation
                                    }
                                  />
                                }
                                label="Does the Timekeeping System (if not using the ProScore mobile app) allow the worker to enter more than one occupation during a work period (shift)?"
                              />
                            </Grid>

                            <Grid item xs={12} md={1}>
                              <Tooltip title="To ensure compliance under IRA framework the employer has to ensure the employee is getting paid the proper Prevailing Wage given the job or duties performed throughout the entire shift. For example: If an Electrician or Installer doesn't have any materials to install during the shift and they dig trenches or take out the trash, they would be classified as a different job title and a new rate potentially applies">
                                <IconButton>
                                  <HelpIcon />
                                </IconButton>
                              </Tooltip>
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
                              Apprentice Mgmt
                            </Typography>
                          </Stack>
                        </Box>
                        <Divider />
                        <Box p={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                              <Stack direction="row" spacing={0}>
                                <FormControlLabel
                                  id="adaptiveElearning"
                                  value={values.adaptiveElearning}
                                  name="adaptiveElearning"
                                  onChange={(event, newValue) => {
                                    setFieldValue(
                                      'adaptiveElearning',
                                      newValue
                                    );
                                  }}
                                  control={
                                    <IOSSwitch
                                      sx={{ m: 1 }}
                                      checked={values.adaptiveElearning}
                                    />
                                  }
                                  label="Adaptive E-Learning"
                                />
                                <Tooltip
                                  title="Scenario: Use a safety trailer during bad weather for continuous e-learning.
Benefit: Seamless training despite weather challenges."
                                >
                                  <IconButton>
                                    <HelpIcon />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={1} />

                            <Grid item xs={12} md={3}>
                              <Stack direction="row" spacing={0}>
                                <FormControlLabel
                                  id="flexibleElearning"
                                  value={values.flexibleElearning}
                                  name="flexibleElearning"
                                  onChange={(event, newValue) => {
                                    setFieldValue(
                                      'flexibleElearning',
                                      newValue
                                    );
                                  }}
                                  control={
                                    <IOSSwitch
                                      sx={{ m: 1 }}
                                      checked={values.flexibleElearning}
                                    />
                                  }
                                  label="Flexible E-Learning Options"
                                />
                                <Tooltip
                                  title="Scenario: Apprentices can choose bulk e-learning during downtime.
                                      Advantage: Flexible scheduling, no rigid daily/weekly structures."
                                >
                                  <IconButton>
                                    <HelpIcon />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={1} />

                            <Grid item xs={12} md={3}>
                              <Stack direction="row" spacing={0}>
                                <FormControlLabel
                                  id="accelaratedElearning"
                                  value={values.accelaratedElearning}
                                  name="accelaratedElearning"
                                  onChange={(event, newValue) => {
                                    setFieldValue(
                                      'accelaratedElearning',
                                      newValue
                                    );
                                  }}
                                  control={
                                    <IOSSwitch
                                      sx={{ m: 1 }}
                                      checked={values.accelaratedElearning}
                                    />
                                  }
                                  label="Accelerated Learning"
                                />

                                <Tooltip
                                  title="Scenario: Complete Year 1 curriculum in 3 weeks through intensive e-learning.
Outcome: Accelerated progress towards journeyworker certification."
                                >
                                  <IconButton>
                                    <HelpIcon />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={1} />

                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="courseContentDelivery"
                                name="courseContentDelivery"
                                options={CourseContentDeliveryOptions}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                value={values.courseContentDelivery}
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'courseContentDelivery',
                                    newValue
                                  );
                                  setIsElearningType(newValue?.value);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Course Content Delivery"
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Autocomplete
                                id="apprenticeHoursTracking"
                                name="apprenticeHoursTracking"
                                options={TrackingMethod}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                value={values.apprenticeHoursTracking}
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    'apprenticeHoursTracking',
                                    newValue
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Apprentice Hours Tracking"
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>

                            {isElearningType === '1' ? (
                              <>
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="elearningHoursPaid"
                                    name="elearningHoursPaid"
                                    options={ElearningHoursPaidOptions}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={values.elearningHoursPaid}
                                    onChange={(event, newValue) => {
                                      setFieldValue(
                                        'elearningHoursPaid',
                                        newValue
                                      );

                                      setIsElearningHoursPaid(newValue?.value);
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Are e-learning hours paid?"
                                        variant="outlined"
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="relatedInstructionProvidedHours"
                                    name="relatedInstructionProvidedHours"
                                    options={
                                      RelatedInstructionIsProvidedOptions
                                    }
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={
                                      values.relatedInstructionProvidedHours
                                    }
                                    onChange={(event, newValue) => {
                                      setFieldValue(
                                        'relatedInstructionProvidedHours',
                                        newValue
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Hours When Related Instruction Is Provided"
                                        variant="outlined"
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Grid>
                                {isElearningHoursPaid ? (
                                  <>
                                    <Grid item xs={12} md={6}>
                                      <TextField
                                        fullWidth
                                        name="wageRate"
                                        helperText={
                                          touched.wageRate && errors.wageRate
                                        }
                                        error={Boolean(
                                          touched.wageRate && errors.wageRate
                                        )}
                                        value={values.wageRate}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant="outlined"
                                        label={t('Wage Rate')}
                                        placeholder={t('Wage Rate')}
                                        type="number"
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <TextField
                                        fullWidth
                                        name="fringe"
                                        helperText={
                                          touched.fringe && errors.fringe
                                        }
                                        error={Boolean(
                                          touched.fringe && errors.fringe
                                        )}
                                        value={values.fringe}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        variant="outlined"
                                        label={t('Fringe')}
                                        placeholder={t('Fringe')}
                                        type="number"
                                      />
                                    </Grid>
                                  </>
                                ) : (
                                  <></>
                                )}
                                <Grid item xs={12} md={6}>
                                  <Typography mb={1}>
                                    Preferred days and time for e-learning/class
                                    time.
                                  </Typography>

                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        onChange={handlePreferredDaysChange}
                                        checked={
                                          preferredDaysObj.preferredDaySun
                                        }
                                        name="preferredDaySun"
                                        value="Sun"
                                      />
                                    }
                                    label="Sun"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        onChange={handlePreferredDaysChange}
                                        checked={
                                          preferredDaysObj.preferredDayMon
                                        }
                                        name="preferredDayMon"
                                        value="Mon"
                                      />
                                    }
                                    label="Mon"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        onChange={handlePreferredDaysChange}
                                        checked={
                                          preferredDaysObj.preferredDayTue
                                        }
                                        name="preferredDayTue"
                                        value="Tue"
                                      />
                                    }
                                    label="Tue"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        onChange={handlePreferredDaysChange}
                                        checked={
                                          preferredDaysObj.preferredDayWed
                                        }
                                        name="preferredDayWed"
                                        value="Wed"
                                      />
                                    }
                                    label="Wed"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        onChange={handlePreferredDaysChange}
                                        checked={
                                          preferredDaysObj.preferredDayThu
                                        }
                                        name="preferredDayThu"
                                        value="Thu"
                                      />
                                    }
                                    label="Thu"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        onChange={handlePreferredDaysChange}
                                        checked={
                                          preferredDaysObj.preferredDayFri
                                        }
                                        name="preferredDayFri"
                                        value="Fri"
                                      />
                                    }
                                    label="Fri"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        onChange={handlePreferredDaysChange}
                                        checked={
                                          preferredDaysObj.preferredDaySat
                                        }
                                        name="preferredDaySat"
                                        value="Sat"
                                      />
                                    }
                                    label="Sat"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6} />

                                <Grid item xs={12} md={3}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <Stack spacing={3}>
                                      <TimePicker
                                        label="Start Time"
                                        value={values.preferredDayStartTime}
                                        onChange={(newValue) => {
                                          setFieldValue(
                                            'preferredDayStartTime',
                                            newValue
                                          );
                                        }}
                                        renderInput={(params) => (
                                          <TextField {...params} />
                                        )}
                                      />
                                    </Stack>
                                  </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12} md={3}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <Stack spacing={3}>
                                      <TimePicker
                                        label="End Time"
                                        value={values.preferredDayEndTime}
                                        onChange={(newValue) => {
                                          setFieldValue(
                                            'preferredDayEndTime',
                                            newValue
                                          );
                                        }}
                                        renderInput={(params) => (
                                          <TextField {...params} />
                                        )}
                                      />
                                    </Stack>
                                  </LocalizationProvider>
                                </Grid>
                              </>
                            ) : (
                              <></>
                            )}

                            {isElearningType === '2' ? (
                              <>
                                <Grid item xs={12} md={6}>
                                  <Autocomplete
                                    id="learningOrClassHoursPaid"
                                    name="learningOrClassHoursPaid"
                                    options={ElearningHoursPaidOptions}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    value={values.learningOrClassHoursPaid}
                                    onChange={(event, newValue) => {
                                      setFieldValue(
                                        'learningOrClassHoursPaid',
                                        newValue
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Are all e-learning/class hours paid?"
                                        variant="outlined"
                                        fullWidth
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6} />
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    name="maxPaidHoursPerDay"
                                    helperText={
                                      touched.maxPaidHoursPerDay &&
                                      errors.maxPaidHoursPerDay
                                    }
                                    error={Boolean(
                                      touched.maxPaidHoursPerDay &&
                                        errors.maxPaidHoursPerDay
                                    )}
                                    value={values.maxPaidHoursPerDay}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    label={t(
                                      'What is the maximum paid hours per day?'
                                    )}
                                    placeholder={t(
                                      'What is the maximum paid hours per day?'
                                    )}
                                    type="number"
                                  />
                                </Grid>
                              </>
                            ) : (
                              <></>
                            )}
                          </Grid>
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
                              onClick={() => navigate('/projects/project')}
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

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box sx={{ ...style, width: 400 }}>
                <h2 id="parent-modal-title">Weekly Payroll</h2>
                <p id="parent-modal-description">
                  To be compliant under IRA framework the workforce will need to
                  be paid on a Weekly basis
                </p>
              </Box>
            </Modal>
          </>
        )}
      </>
    </>
  );
};

export default MyProjectInfo;
