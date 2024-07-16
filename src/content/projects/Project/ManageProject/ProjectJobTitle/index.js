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
import {
  getAllProjectJobTitles,
  deleteProjectJobTitle
} from 'src/api/projects/ProjectJobTitle';
import AddProjectJobTitle from './Add';
import Text from 'src/components/Text';

const ProjectJobTitle = ({ projectId }) => {
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
  const [projectJobTitleId, setProjectJobTitleId] = useState('');
  const location = useLocation();
  const isMountedRef = useRefMounted();

  const getProjectJobTitles = useCallback(() => {
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    getAllProjectJobTitles(obj, projectId)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
        } else {
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
    getProjectJobTitles();
  }, [getAllProjectJobTitles, page, limit, query, location.pathname]);

  const handleQueryChange = async (event) => {
    event.persist();
    setQuery(event.target.value);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: event.target.value
    };
    getAllProjectJobTitles(obj)
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
    setProjectJobTitleId([
      { projectJobTitleId: params?.row?.projectJobTitleId }
    ]);
    setOpenConfirmDelete(true);
    console.log(projectJobTitleId);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    console.log(selectedIds.length);
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteProjectJobTitle(selectedIds)
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
      console.log(projectJobTitleId);
      await deleteProjectJobTitle(projectJobTitleId)
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
    getProjectJobTitles();
  };

  const handleSelectionChange = (selection) => {
    const selectedProjectJobTitleIds = selection.map((selectedIndex) => {
      return users[selectedIndex]?.projectJobTitleId;
    });
    let tempArr = [];
    selectedProjectJobTitleIds.forEach((e) => {
      tempArr.push({
        projectJobTitleId: e
      });
    });
    setSelectedIds(tempArr);
  };
  const handleAddForm = () => {
    getProjectJobTitles();
    setAddJobTitleForm(false);
  };
  const handleEditJobTitle = (params) => {
    setProjectJobTitleId([{ projectJobTitleId: params }]);
    setAddJobTitleForm(true);
  };

  const columns = [
    {
      field: 'jobTitle',
      headerName: t('Job Title'),
      flex: 2,
      minWidth: 300,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box
          component={RouterLink}
          onClick={() => handleEditJobTitle(params.row.projectJobTitleId)}
          to=""
        >
          <Text color="darkblue">{params.row.isExternalJobTitle === true ? params.row.externalJobTitle : params.row.jobTitle}</Text>
        </Box>
      )
    },
    {
      field: 'onetCode',
      headerName: t('ONET Code'),
      flex: 2,
      minWidth: 100,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'numberOfPositions',
      headerName: t('Number Of Positions'),
      flex: 2,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'wageRate',
      headerName: t('PW Wage Rate'),
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Text>
            {' '}
            $
            {(params.row.wageRate == null ? 0 : params.row.wageRate).toFixed(2)}
          </Text>
        </Box>
      )
    },
    {
      field: 'fringe',
      headerName: t('PW Fringe'),
      flex: 2,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Text> ${params.row.fringe == null ? 0 : params.row.fringe}</Text>
        </Box>
      )
    },
    {
      field: 'pwTotalHourlyComp',
      headerName: t('PW Total Hourly Comp'),
      flex: 2,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Text> ${params.row.pwTotalHourlyComp}</Text>
        </Box>
      )
    },
    {
      field: 'marketRate',
      headerName: t('Market Rate'),
      flex: 2,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Text>
            {' '}
            $
            {(params.row.marketRate == null
              ? 0
              : params.row.marketRate
            ).toFixed(2)}
          </Text>
        </Box>
      )
    },
    {
      field: 'compliant',
      headerName: t('Compliant'),
      flex: 2,
      minWidth: 100,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'pwAiConfidenceMatchScore',
      headerName: t('PW AI % Confidence Match Score'),
      flex: 2,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'actualTotalHourlyComp',
      headerName: t('Actual Total Hourly Comp'),
      flex: 2,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box>
          <Text>
            {' '}
            $
            {(
              params.row.wageRate +
              parseFloat(params.row.fringe === '' ? 0 : params.row.fringe)
            ).toFixed(2)}
          </Text>
        </Box>
      )
    },
    {
      field: 'projectJobTitleId',
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
        <AddProjectJobTitle
          projectJobTitleId={projectJobTitleId[0]}
          id={projectId}
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
                  Job Detail
                </Typography>
                <Button
                  sx={{
                    mt: { xs: 2, sm: 0 }
                  }}
                  onClick={() => {
                    setProjectJobTitleId([]);
                    setAddJobTitleForm(true);
                  }}
                  variant="contained"
                  startIcon={<AddTwoToneIcon fontSize="small" />}
                >
                  Add Job Detail
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
              exportFields={[
                'jobTitle',
                'onetCode',
                'numberOfPositions',
                'wageRate',
                'fringe',
                'pwTotalHourlyComp',
                'marketRate',
                'compliant',
                'pwAiConfidenceMatchScore',
                'actualTotalHourlyComp'
              ]}
            />
          </Card>
        </>
      )}
    </>
  );
};

export default ProjectJobTitle;
