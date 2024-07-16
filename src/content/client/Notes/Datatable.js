import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  Slide,
  Stack,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  styled,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
  LicenseInfo
} from '@mui/x-data-grid-pro';
import BulkActions from 'src/content/User/User1/BulkActions';
import useRefMounted from 'src/hooks/useRefMounted';
import {
  getAllClientContractorType,
  deleteClientContractorType
} from 'src/api/settings/clientContractorType';

const DialogWrapper = styled(Dialog)(
  () => `
        .MuiDialog-paper {
          overflow: visible;
        }
  `
);

const ButtonError = styled(Button)(
  ({ theme }) => `
       background: ${theme.colors.error.main};
       color: ${theme.palette.error.contrastText};
  
       &:hover {
          background: ${theme.colors.error.dark};
       }
      `
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const applyPagination = (users, page, limit) => {
  return users?.slice(page * limit, page * limit + limit);
};

const DataTable = () => {
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState(' ');
  const [clientContractTypeId, setClientContractTypeId] = useState('');
  const [loading, setLoding] = useState(false);
  const [checked, setChecked] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isMountedRef = useRefMounted();

  useEffect(() => {
    const isEnable = localStorage.getItem('row');
    if (isEnable !== null) {
      setChecked(isEnable === 'true');
    }
  }, []);

  const getClientContractorType = useCallback(async () => {
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: query
    };
    await getAllClientContractorType(obj)
      .then((res) => {
        console.log(res);
        if (res.data.data == null) {
          setUsers([]);
        } else {
          console.log(res.data.data);
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoding(false);
      });
  }, [isMountedRef]);

  useEffect(() => {
    setLoding(true);
    getClientContractorType();
  }, [getAllClientContractorType]);

  const handleQueryChange = async (event) => {
    event.persist();
    setQuery(event.target.value);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: event.target.value
    };
    await getAllClientContractorType(obj)
      .then((res) => {
        if (res.data.data == null) {
          setUsers([]);
        } else {
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log(e));
  };

  LicenseInfo.setLicenseKey(
    'bb1cfd0d033309691d9356670ea353b2Tz04MDA1MSxFPTE3MzM0NTU5NTIwMDAsUz1wcm8sTE09cGVycGV0dWFsLEtWPTI='
  );

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedUsers = applyPagination(users, page, limit);

  const [toggleView] = useState('table_view');

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (params) => {
    setClientContractTypeId([
      ...clientContractTypeId,
      { clientContractTypeId: params?.row?.clientContractTypeId }
    ]);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteClientContractorType(selectedIds)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            getClientContractorType();
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
      await deleteClientContractorType(clientContractTypeId)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            getClientContractorType();
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
  };

  const handleSelectionChange = (selection) => {
    const selectedContractType = selection.map((selectedIndex) => {
      return paginatedUsers[selectedIndex]?.clientContractTypeId;
    });
    let tempArr = [];
    selectedContractType.forEach((e) => {
      tempArr.push({
        clientContractTypeId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const CustomToolbar = (props) => (
    <Stack direction="row" spacing={1} my={2}>
      <GridToolbarContainer>
        <GridToolbarExport {...props} />
      </GridToolbarContainer>
      <Box>
        {selectedIds?.length > 0 && (
          <BulkActions onClick={() => setOpenConfirmDelete(true)} />
        )}
      </Box>
    </Stack>
  );

  console.log(loading);

  return (
    <>
      {toggleView === 'table_view' && (
        <Card>
          <Box
            flex={1}
            p={2}
            display={{ xs: 'block', md: 'flex' }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              sx={{
                mb: { xs: 2, md: 0 }
              }}
            >
              <TextField
                sx={{
                  m: 0
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleQueryChange}
                placeholder={t('Search here')}
                value={query}
                size="small"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Box>
            <TablePagination
              component="div"
              count={users?.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15]}
            />
          </Box>

          <Divider />
          {loading ? (
            <>
              <CircularProgress
                size="3rem"
                sx={{ display: 'flex', margin: '0 auto', my: 5 }}
              />
            </>
          ) : (
            <>
              {paginatedUsers?.length === 0 ? (
                <>
                  <Typography
                    sx={{
                      py: 5
                    }}
                    variant="h3"
                    fontWeight="normal"
                    color="text.secondary"
                    align="center"
                  >
                    {t(
                      "We couldn't find any users matching your search criteria"
                    )}
                  </Typography>
                </>
              ) : (
                <>
                  <DataGridPro
                    checkboxSelection
                    disableRowSelectionOnClick
                    selectionModel={selectedIds}
                    onRowSelectionModelChange={handleSelectionChange}
                    columns={[
                      {
                        field: 'clientContractType',
                        headerName: t('Client Contract Type'),
                        flex: 6,
                        renderHeader: (params) => (
                          <Typography variant="h5">
                            {params.colDef.headerName}
                          </Typography>
                        )
                      },

                      {
                        field: 'clientContractTypeId',
                        headerName: 'Actions',
                        flex: 1,
                        disableColumnMenu: true,
                        hideSortIcons: true,
                        sortingOrder: false,
                        renderHeader: (params) => (
                          <Typography variant="h5">
                            {params.colDef.headerName}
                          </Typography>
                        ),
                        renderCell: (params) => (
                          <Box>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                component={RouterLink}
                                to={`${location.pathname}/edit/${params.row.clientContractTypeId}`}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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
                    ]}
                    rows={paginatedUsers?.map((user, index) => ({
                      ...user,
                      id: index.toString()
                    }))}
                    loading={loading}
                    pageSize={limit}
                    rowReordering={checked}
                    page={page}
                    onPageChange={(newPage) => handlePageChange(null, newPage)}
                    components={{
                      Toolbar: CustomToolbar
                    }}
                  />
                </>
              )}
            </>
          )}
        </Card>
      )}

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <Typography
            align="center"
            sx={{
              py: 2,
              px: 3
            }}
            variant="h3"
          >
            {t('Are you sure you want to delete this record')}?
          </Typography>

          <Box>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              disabled={deleteLoading}
              startIcon={
                deleteLoading ? <CircularProgress size="1rem" /> : null
              }
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

export default DataTable;
