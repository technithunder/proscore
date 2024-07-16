import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Box,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Autocomplete
} from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from 'src/components/PageHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addClientNotes, getAllNotesType } from 'src/api/client/notes';

// const notestype = [
//   { label: 'Note Type 1', value: '1' },
//   { label: 'Note Type 2', value: '2' },
//   { label: 'Note Type 3', value: '3' },
//   { label: 'Note Type 4', value: '4' }
//   // Add more countries as needed
// ];

const ClientNotes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [notesType, setNotesType] = useState([]);

  useEffect(() => {
    fetchAllNotesType();
  }, []);

  const fetchAllNotesType = async () => {
    let obj = {
      pageIndex: 0,
      pageSize: 100,
      orderByAscending: true,
      searchString: ' '
    };
    let temp = [];
    await getAllNotesType(obj)
      .then((res) => {
        if (res) {
          res?.data?.data?.forEach((e) => {
            temp.push({
              label: e.noteType,
              value: e.noteTypeId
            });
          });
          setNotesType(temp);
        }
      })
      .catch((e) => console.log(e));
  };

  console.log('==>', notesType);

  return (
    <>
      <Helmet>
        <title>Profile - Client Notes</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Box}
          heading={t('Add Notes')}
          description={'Fill in the below to add notes '}
          pathname={`/client/client/view/${id}`}
          buttonHeading={t('Go back to all notes')}
          Icon={ArrowBackIcon}
        />
      </PageTitleWrapper>
      <Card sx={{ mx: 3 }}>
        <Box p={2}>
          <Formik
            initialValues={{
              // clientId: '',
              noteTypeId: null,
              note: ''
              // fileupload: null,
            }}
            validationSchema={Yup.object().shape({
              noteTypeId: Yup.object().nullable().required('Required'),
              note: Yup.string().trim().required(t('Required'))
            })}
            onSubmit={async (
              _values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              let obj = {
                noteTypeId: _values.noteTypeId.value,
                notes: _values.note.trim(),
                isPrivate: true
              };
              await addClientNotes(obj)
                .then((res) => {
                  if (res) {
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    navigate('/client/notes');
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
                    <Autocomplete
                      id="notestypeid"
                      name="notestypeid"
                      options={notesType}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      value={values.noteTypeId}
                      onChange={(event, newValue) => {
                        // Set the selected country to form values
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
                          helperText={touched.noteTypeId && errors.noteTypeId}
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
                    onClick={() => navigate(`/client/client/view/${id}`)}
                    color="primary"
                  >
                    {t('Cancel')}
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>
      </Card>
    </>
  );
};

export default ClientNotes;
