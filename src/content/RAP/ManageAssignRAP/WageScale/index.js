import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  Zoom,
  Tooltip,
  Button,
  Stack,
  Divider,
  Card
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DataTable from 'src/components/Table/Table';
import useRefMounted from 'src/hooks/useRefMounted';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddAssignRAPWage from './Add';
import Text from 'src/components/Text';
import {
  getAllAssignRAPWageScale,
  deleteAssignRAPWageScale
} from 'src/api/rap';

const WageScale = ({ assignRAPInfoGuid }) => {
  const [addJobTitleForm, setAddJobTitleForm] = useState(false);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [loading, setLoding] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [assignRAPWageScaleId, setAssignRAPWageScaleId] = useState('');
  const location = useLocation();
  const isMountedRef = useRefMounted();

  const fetchAllAssignRAPWageScale = useCallback(async () => {
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    debugger;
    await getAllAssignRAPWageScale(obj, assignRAPInfoGuid)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
        } else {
          console.log(res.data.data);
          setTotalRecords(res.data.totalRecords);
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoding(false);
      });
  }, [isMountedRef, page, limit, query]);

  useEffect(() => {
    setLoding(true);
    fetchAllAssignRAPWageScale();
  }, [getAllAssignRAPWageScale, page, limit, query, location.pathname]);

  const handleQueryChange = async (event) => {
    event.persist();
    setQuery(event.target.value);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: event.target.value
    };
    await getAllAssignRAPWageScale(obj)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
        } else {
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log(e));
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };
  const handleConfirmDelete = (params) => {
    setAssignRAPWageScaleId([
      {
        assignRAPWageScaleId: params?.row?.assignRAPWageScaleId
      }
    ]);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    debugger;
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteAssignRAPWageScale(selectedIds)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            setSelectedIds([]);
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
        .catch((e) => console.log(e))
        .finally(() => setDeleteLoading(false));
    } else {
      console.log(assignRAPWageScaleId);
      await deleteAssignRAPWageScale(assignRAPWageScaleId)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
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
        .catch((e) => console.log(e))
        .finally(() => setDeleteLoading(false));
    }
    fetchAllAssignRAPWageScale();
  };

  const handleSelectionChange = (selection) => {
    const selectedAssignRAPWageScaleId = selection.map((selectedIndex) => {
      return users[selectedIndex]?.assignRAPWageScaleId;
    });
    let tempArr = [];
    selectedAssignRAPWageScaleId.forEach((e) => {
      tempArr.push({
        assignRAPWageScaleId: e
      });
    });
    setSelectedIds(tempArr);
  };
  const handleAddForm = () => {
    fetchAllAssignRAPWageScale();
    setAddJobTitleForm(false);
  };
  const handleEditJobTitle = (params) => {
    setAssignRAPWageScaleId([{ assignRAPWageScaleId: params }]);
    setAddJobTitleForm(true);
  };

  const columns = [
    {
      field: 'wageScaleTitle',
      headerName: t('Wage Scale Title'),
      flex: 2,
      minWidth: 300,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box
          component={RouterLink}
          onClick={() => handleEditJobTitle(params.row.assignRAPWageScaleId)}
          to=""
        >
          <Text color="darkblue">{params.row.wageScaleTitle}</Text>
        </Box>
      )
    },
    {
      field: 'state',
      headerName: t('State'),
      flex: 2,
      minWidth: 100,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'assignRAPWageScaleId',
      headerName: 'Actions',
      flex: 1,
      minWidth: 100,
      disableColumnMenu: true,
      hideSortIcons: true,
      sortingOrder: false,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Tooltip title={t('Delete')} arrow>
            <IconButton
              onClick={() => handleConfirmDelete(params)}
              color="error"
            >
              <DeleteTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <>
      {addJobTitleForm ? (
        <AddAssignRAPWage
          assignRAPWageScaleId={assignRAPWageScaleId[0]}
          id={assignRAPInfoGuid}
          onClick={handleAddForm}
          onCancelProjectJobTitleForm={() => setAddJobTitleForm(false)}
        />
      ) : (
        <>
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
                  Wage Scale
                </Typography>
                <Button
                  sx={{
                    mt: { xs: 2, sm: 0 }
                  }}
                  onClick={() => {
                    setAssignRAPWageScaleId([]);
                    setAddJobTitleForm(true);
                  }}
                  variant="contained"
                  startIcon={<AddTwoToneIcon fontSize="small" />}
                >
                  Add Wage Scale
                </Button>
              </Stack>
            </Box>
            <Divider />
            <DataTable
              data={users}
              columns={columns}
              page={page}
              limit={limit}
              query={query}
              loading={loading}
              onQueryChange={handleQueryChange}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              deleteLoading={deleteLoading}
              openConfirmDelete={openConfirmDelete}
              closeConfirmDelete={closeConfirmDelete}
              handleDeleteCompleted={handleDeleteCompleted}
              onRowSelectionModelChange={handleSelectionChange}
              handleDeleteSelected={() => setOpenConfirmDelete(true)}
              selectionModel={selectedIds}
              totalRecords={totalRecords}
            />
          </Card>
        </>
      )}
    </>
  );
};

export default WageScale;
