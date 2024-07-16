import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
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
  Zoom,
  Autocomplete,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { addNotes, singleNotes, editNotes } from 'src/api/client/client/notes';
import ProgressBar from 'src/components/ProgressBar';
import { AlphaNumeric } from 'src/constants/validations';

const AddNotes = ({
  id,
  clientNoteId,
  onCancelNotesForm,
  onClick,
  notesType
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    noteTypeId: null,
    notes: '',
    isPrivate: false
  });

  useEffect(() => {
    setLoading(true);
    if (id && clientNoteId) {
      singleNotes(clientNoteId)
        .then((res) => {
          if (res) {
            const x = notesType.find(
              (e) => e.value === res.data.data.noteTypeId
            );

            setInitialValues({
              notes: res.data.data.notes,
              noteTypeId: x,
              isPrivate: res.data.data.isPrivate
            });
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [clientNoteId, id]);

  return (
    <>
      <Card>
        <Box p={2}>
          {loading && clientNoteId ? (
            <>
              <ProgressBar />
            </>
          ) : (
            <>
              <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                  noteTypeId: Yup.object().nullable().required('Required'),
                  notes: Yup.string().trim().required(t('Required')).matches(AlphaNumeric.regexPattern, AlphaNumeric.errorMessage),
                })}
                onSubmit={async (
                  _values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  let obj = {
                    clientId: id,
                    notes: _values.notes.trim(),
                    noteTypeId: _values.noteTypeId.value,
                    isPrivate: _values.isPrivate
                  };

                  if (clientNoteId) {
                    obj['clientNoteId'] = clientNoteId.clientNoteId;
                    await editNotes(obj)
                      .then((res) => {
                        if (res) {
                          onClick();
                          enqueueSnackbar(t('Record Updated Successfully'), {
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
                  } else {
                    await addNotes(obj)
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
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Autocomplete
                          id="notestypeid"
                          name="notestypeid"
                          options={notesType}
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
                          multiline
                          rows={4}
                          name="notes"
                          helperText={touched.notes && errors.notes}
                          error={Boolean(touched.notes && errors.notes)}
                          value={values.notes}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          variant="outlined"
                          label={t('Note')}
                          placeholder={t('Note')}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values.isPrivate}
                              onChange={(e) =>
                                setFieldValue('isPrivate', e.target.checked)
                              }
                              onBlur={handleBlur}
                              name="isPrivate"
                            />
                          }
                          label="IsPrivate"
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
                        onClick={onCancelNotesForm}
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

export default AddNotes;
