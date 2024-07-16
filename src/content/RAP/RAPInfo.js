import React, { useState } from 'react';
import {
  FormControl,
  Button,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Select,
  MenuItem,
  Card,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function RAPInfo() {
  const { t } = useTranslation();
  // const [jobCategories, setJobCategories] = useState([
  //   {
  //     label: "Category1",
  //     value: "Category1",
  //   },
  //   {
  //     label: "Category2",
  //     value: "Category2",
  //   },
  // ]);
  // const [jobTitles, setJobTitles] = useState([
  //   {
  //     label: "JobTitle1",
  //     value: "JobTitle1",
  //   },
  //   {
  //     label: "JobTitle2",
  //     value: "JobTitle2",
  //   },
  // ]);
  // const [requiredFields, setRequiredFields] = useState([
  //   "jobTitle",
  //   "approvedJobTitle",
  //   "industry",
  //   "category",
  //   "RAPIDSCode",
  //   "summary",
  //   "description",
  //   "programLength",
  // ]);
  const [inputFields, setInputFields] = useState({
    jobTitle: '',
    approvedJobTitle: '',
    industry: '',
    category: '',
    RAPIDSCode: '',
    summary: '',
    description: '',
    programLength: ''
  });

  const handleChange = (e) => {
    console.log(e.target.name);
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit}>
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
                RAP Info
              </Typography>
            </Stack>
          </Box>
          <Divider />
          <Box p={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <InputLabel id="jobTitle">Job Title</InputLabel>
                    <Select
                      name="jobTitle"
                      id="jobTitle"
                      value={inputFields['jobTitle']}
                      label="Job Title"
                      onChange={handleChange}
                    >
                      <MenuItem value={'ConstructionCraftLaborer'}>Construction Craft Laborer</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <TextField
                    name={'approvedJobTitle'}
                    value={inputFields['approvedJobTitle']}
                    onChange={handleChange}
                    label={'Approved Job Title'}
                    placeholder={'Approved Job Title'}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <InputLabel id="industry">Industry</InputLabel>
                    <Select
                      name={'industry'}
                      id="industry"
                      value={inputFields['industry']}
                      label="Industry"
                      onChange={handleChange}
                    >
                      <MenuItem value={'Solar'}>Solar</MenuItem>
                      <MenuItem value={'Construction'}>Construction</MenuItem>
                      <MenuItem value={'Building'}>Building</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <InputLabel id="category">Category</InputLabel>
                    <Select
                      name={'category'}
                      id="category"
                      value={inputFields['category']}
                      label="Category"
                      onChange={handleChange}
                    >
                      <MenuItem value={'Mechanical'}>Mechanical</MenuItem>
                      <MenuItem value={'Electrical'}>Electrical</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <TextField
                    name={'RAPIDSCode'}
                    value={inputFields['RAPIDSCode']}
                    onChange={handleChange}
                    label={'RAPIDS Code'}
                    placeholder={'RAPIDS Code'}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} />
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <TextField
                    id="summary"
                    label="Summary"
                    multiline
                    rows={4}
                    defaultValue=""
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <TextField
                    id="description"
                    label="Description"
                    multiline
                    rows={4}
                    defaultValue=""
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <TextField
                    name={'programLength'}
                    value={inputFields['programLength']}
                    onChange={handleChange}
                    label={'Program Length (Years)'}
                    placeholder={'Program Length (Years)'}
                  />
                </Stack>
              </Grid>
              {[...Array(parseInt(inputFields['programLength']) || 0)]?.map(
                (val, index) => {
                  return (
                    <>
                      <Grid item xs={6} md={6} />
                      <Grid item xs={6} md={3}>
                        <TextField
                          name={'OTJHoursYear' + (index + 1)}
                          value={inputFields['OTJHoursYear' + (index + 1)]}
                          onChange={handleChange}
                          label={'OTJ Hours Year' + (index + 1)}
                          placeholder={'OTJ Hours Year' + (index + 1)}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          name={'eLearnigHoursYear' + (index + 1)}
                          value={inputFields['eLearnigHoursYear' + (index + 1)]}
                          onChange={handleChange}
                          label={'eLearnig Hours Year' + (index + 1)}
                          placeholder={'eLearnig Hours Year' + (index + 1)}
                        />
                      </Grid>
                    </>
                  );
                }
              )}
            </Grid>
          </Box>
        </Card>
        <Card sx={{ mx: 0, mb: 3 }}>
          <Box p={2}>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" type="submit" color="primary">
                {t('Save')}
              </Button>
              <Button variant="outlined" type="submit" color="primary">
                {t('Cancel')}
              </Button>
            </Stack>
          </Box>
        </Card>
      </form>
    </>
  );
}

export default RAPInfo;
