import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Box,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Autocomplete,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  addEmployeeNoteType,
  getEmployeeNote,
  getEmployeeNoteType,
  updateEmployeeNote
} from 'src/api/employee/notes';
import { AlphaNumeric } from 'src/constants/validations';

const EmployeeAddNotes = ({
  onCancelContactForm,
  onClick,
  employeeId,
  noteId
}) => {
  console.log(onClick, noteId, employeeId);
  const { t } = useTranslation();
  const [noteType, setNoteType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    noteTypeId: null,
    note: '',
    IsPrivate: false
  });

  const handleClear = () => {
    setInitialValues({
      noteTypeId: null,
      note: '',
      IsPrivate: false
    });
  };

  const fetchAllEmployeeNotes = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    await getEmployeeNoteType(obj)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setNoteType(
            res.data.data.map((item) => ({
              label: item.noteType,
              value: item.noteTypeId
            }))
          );
        } else if (res.data.data == null) {
          setNoteType([]);
        }
      })
      .catch((e) => console.log(e));
  };

  const fetchEmployeeNotes = async () => {
    setLoading(true);
    if (noteId) {
      const obj = {
        employeeNoteId: noteId
      };
      await getEmployeeNote(obj)
        .then((res) => {
          if (res) {
            setInitialValues({
              noteTypeId: res?.data?.data?.noteTypeModel,
              note: res?.data?.data?.notes,
              IsPrivate: res?.data?.data?.isPrivate
            });
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchAllEmployeeNotes();
  }, []);

  useEffect(() => {
    fetchEmployeeNotes();
  }, [noteId]);

  return (
    <>
      <Box>
        {loading && noteId ? (
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
              noteTypeId: Yup.object().nullable().required('Required'),
              note: Yup.string()
                .max(255)
                .required(t('Required'))
                .matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage)
            })}
            onSubmit={async (
              _values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                if (noteId) {
                  const obj = {
                    employeeNoteId: noteId,
                    noteTypeId: _values?.noteTypeId?.value,
                    notes: _values?.note,
                    isPrivate: _values?.IsPrivate,
                    employeeId: employeeId
                  };

                  await updateEmployeeNote(obj)
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
                    noteTypeId: _values?.noteTypeId?.value,
                    notes: _values?.note,
                    isPrivate: _values?.IsPrivate,
                    employeeId: employeeId
                  };
                  await addEmployeeNoteType(obj)
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
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Autocomplete
                            id="noteTypeId"
                            name="noteTypeId"
                            options={noteType}
                            value={values.noteTypeId}
                            onChange={(event, newValue) => {
                              setFieldValue('noteTypeId', newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Note Type"
                                variant="outlined"
                                fullWidth
                                error={Boolean(
                                  touched.noteTypeId && errors.noteTypeId
                                )}
                                helperText={
                                  touched.noteTypeId && errors.noteTypeId
                                }
                              />
                            )}
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
                            label={t('Note')}
                            placeholder={t('Note')}
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
                              label={t('Is Private?')}
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

export default EmployeeAddNotes;
