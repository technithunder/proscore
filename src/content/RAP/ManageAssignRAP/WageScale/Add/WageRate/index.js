import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  TextField,
  IconButton,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Zoom
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
// import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  getAllAssignRAPWageScaleDetail,
  deleteAssignRAPWageScaleDetail
} from 'src/api/rap';

function WageRate({ updatedWageRates, assignRAPWageScaleId, programLength }) {
  // const navigation = useNavigate();
  // const formData = new FormData();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [errors] = useState({});
  const [isSubmit] = useState(false);
  const [inputFields, setInputFields] = useState({
    startHours: '',
    endHours: '',
    wageRate: '',
    isStartHoursReadonly : false
  });
  const [wageRates, setWageRates] = useState([]);
  const saveWageRateDetail = () => {
    let isError = false;
    if (!inputFields.startHours) {
      enqueueSnackbar(t('Start hours is required.'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },

        TransitionComponent: Zoom
      });

      isError = true;
    }

    if (!inputFields.endHours) {
      enqueueSnackbar(t('End hours is required.'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },

        TransitionComponent: Zoom
      });

      isError = true;
    }

    if (parseFloat(inputFields.startHours) > parseFloat(inputFields.endHours)) {
      enqueueSnackbar(t('The To Hours should be grather then From Hours.'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },

        TransitionComponent: Zoom
      });

      isError = true;
    }

    if (!inputFields.wageRate) {
      enqueueSnackbar(t('Wage rate is required.'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },

        TransitionComponent: Zoom
      });

      isError = true;
    }

    if (wageRates.length === 0 && parseFloat(inputFields.startHours) > 0) {
      enqueueSnackbar(t('The start hours should be start from 0.'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },

        TransitionComponent: Zoom
      });
      isError = true;
    }

    if (programLength < parseFloat(inputFields.endHours)){
      enqueueSnackbar(
        t('The end hours should not be grather then program length.'),
        {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },

          TransitionComponent: Zoom
        }
      );
      isError = true;
    }

    const lastRecord = wageRates.slice(-1)[0];
    if (
      wageRates.length > 0 &&
      parseFloat(lastRecord.wageRate) > parseFloat(inputFields.wageRate)
    ) {
      enqueueSnackbar(
        t('The wage rate should be greater than the previous wage rate.'),
        {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },

          TransitionComponent: Zoom
        }
      );
      isError = true;
    }

    if (!isError) {
      const newRecord = {
        id: '',
        rowNo: wageRates.length + 1,
        startHours: inputFields.startHours,
        endHours: inputFields.endHours,
        wageRate: inputFields.wageRate,
        assignRAPWageScaleGuid: null
      };

      const newModifyWegRate = [...wageRates, newRecord];
      setWageRates(newModifyWegRate);
      updatedWageRates(newModifyWegRate);

      inputFields.startHours = parseInt(inputFields.endHours) + 1;
      inputFields.isStartHoursReadonly = true;
      inputFields.endHours = '';
      inputFields.wageRate = '';
    }
  };

  useEffect(() => {
    if (assignRAPWageScaleId) {
      fetchAllAssignRAPWageScaleDetail(
        assignRAPWageScaleId.assignRAPWageScaleId
      );
    }
  }, []);

  const handleChange = (e) => {
    console.log(e.target.name);
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleDeleteCompleted = async (assignRAPWageScaleDetailId, rowNo) => {
    let filterdWageRates = wageRates.filter((item) => item.rowNo !== rowNo);
    setWageRates(filterdWageRates);
    const lastRecord = filterdWageRates.slice(-1)[0];
    if (lastRecord) {
      inputFields.startHours = parseInt(lastRecord.endHours) + 1;
    } else {
      inputFields.startHours = '0';
    }

    if (assignRAPWageScaleDetailId) {
      await deleteAssignRAPWageScaleDetail(assignRAPWageScaleDetailId)
        .then((res) => {
          if (res) {
            enqueueSnackbar(t('Record has been deleted successfully'), {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },

              TransitionComponent: Zoom
            });
          }
        })
        .catch((e) => console.log(e));
    }
  };

  const fetchAllAssignRAPWageScaleDetail = async (assignRAPWageScaleId) => {
    await getAllAssignRAPWageScaleDetail(assignRAPWageScaleId)
      .then((res) => {
        if (res.data) {
          let rowNo = 1;
          res.data.data.forEach((item) => {
            const newModifyWegRate = {
              id: item.assignRAPWageScaleDetailId,
              rowNo: rowNo,
              startHours: item.startHours,
              endHours: item.endHours,
              wageRate: item.wageRate,
              assignRAPWageScaleGuid: item.assignRAPWageScaleGuid
            };

            wageRates.push(newModifyWegRate);

            setWageRates(wageRates);
            updatedWageRates(wageRates);

            inputFields.startHours = parseInt(newModifyWegRate.endHours) + 1;
            inputFields.isStartHoursReadonly = true; 

            rowNo += 1;
          });
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <form autoComplete="off">
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          display="flex"
          alignItems="center"
        >
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              name="startHours"
              helperText={errors.startHours}
              error={Boolean(errors.startHours)}
              value={inputFields['startHours']}
              onChange={handleChange}
              variant="outlined"
              label={t('From Hours')}
              placeholder={t('From Hours')}
              type="number"
              InputProps={{ readOnly: Boolean(inputFields['isStartHoursReadonly']) }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              name="endHours"
              helperText={errors.endHours}
              error={Boolean(errors.endHours)}
              value={inputFields['endHours']}
              onChange={handleChange}
              variant="outlined"
              label={t('To Hours')}
              placeholder={t('To Hours')}
              type="number"
             
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              name="wageRate"
              helperText={errors.wageRate}
              error={Boolean(errors.wageRate)}
              value={inputFields['wageRate']}
              onChange={handleChange}
              variant="outlined"
              label={t('Wage Rate')}
              placeholder={t('Wage Rate')}
              type="number"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              disableElevation
              disabled={isSubmit}
              type="button"
              variant="contained"
              onClick={saveWageRateDetail}
              color="primary"
            >
              <AddIcon />
            </Button>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper sx={{ py: 2, px: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Start Hours</TableCell>
                      <TableCell>End Hours</TableCell>
                      <TableCell>Wage Rate</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wageRates.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}
                      >
                        {index === (wageRates?.length ?? 0) - 1 ? (
                          <TableCell
                            sx={{ color: 'blue', cursor: 'pointer' }}
                            // onClick={() => onEdit(row.rapWageRateId)}
                          >
                            {row.startHours}
                          </TableCell>
                        ) : (
                          <TableCell>{row.startHours}</TableCell>
                        )}

                        <TableCell>{row.endHours}</TableCell>
                        <TableCell>${parseFloat(row.wageRate)?.toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton
                            disabled={index !== (wageRates?.length ?? 0) - 1}
                            onClick={() =>
                              handleDeleteCompleted(row.id, row.rowNo)
                            }
                            color="error"
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default WageRate;
