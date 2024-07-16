import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  Zoom,
  Tooltip,
  IconButton,
  Divider
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DataTable from 'src/components/Table/Table';
import useRefMounted from 'src/hooks/useRefMounted';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  deleteClientSocialMedia,
  getAllClientSocialMedia,
  getAllSocialMediaType
} from 'src/api/client/client/socialMedia';
import { useTranslation } from 'react-i18next';
import AddSocialMedia from 'src/content/client/Client/View/SocialMedia/Add';

const SocialMedia = ({ clientId }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [loading, setLoding] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [totalRecords, setTotalRecords] = useState();
  const [selectedIds, setSelectedIds] = useState([]);
  const [clientSocialMediaId, setClientSocialMediaId] = useState('');
  const [addSocialMediaForm, setSocialMediaForm] = useState(false);
  const [socialMediaType, setSocialMediaType] = useState([]);
  const location = useLocation();
  const isMountedRef = useRefMounted();

  const fetchAllClientSocialMedia = useCallback(async () => {
    setLoding(true);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllClientSocialMedia(obj, clientId)
      .then((res) => {
        if (res?.data?.data == null) {
          setLoding(false);
          setUsers([]);
        } else {
          setTotalRecords(res?.data?.totalRecords);
          setUsers(res?.data?.data);

          setLoding(false);
        }
      })
      .catch((e) => console.log(e));
  }, [isMountedRef, page, limit, query]);

  const fetchAllSocialMediaType = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    let temp = [];
    await getAllSocialMediaType(obj)
      .then((res) => {
        if (res) {
          res?.data?.data?.forEach((e) => {
            temp.push({
              label: e.name,
              value: e.socialMediaId
            });
          });
          setSocialMediaType(temp);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchAllClientSocialMedia();
    fetchAllSocialMediaType();
  }, [getAllClientSocialMedia, page, limit, query, location.pathname]);

  const handleQueryChange = async (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    setDeleteLoading(true);
    if (selectedIds.length > 0) {
      await deleteClientSocialMedia(selectedIds)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllClientSocialMedia();
            setSelectedIds([]);
            enqueueSnackbar(t('Record Deleted Successfully'), {
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
      await deleteClientSocialMedia(clientSocialMediaId)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllClientSocialMedia();
            setSelectedIds([]);
            enqueueSnackbar(t('Record Deleted Successfully'), {
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
    const selectedContactId = selection.map((selectedIndex) => {
      return users[selectedIndex]?.clientSocialMediaId;
    });
    let tempArr = [];
    selectedContactId.forEach((e) => {
      tempArr.push({
        clientSocialMediaId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const handleConfirmDelete = (params) => {
    setClientSocialMediaId([
      { clientSocialMediaId: params?.row?.clientSocialMediaId }
    ]);
    setOpenConfirmDelete(true);
  };

  const handleClientSocialMedia = (params) => {
    setClientSocialMediaId([
      { clientSocialMediaId: params?.row?.clientSocialMediaId }
    ]);
    setSocialMediaForm(true);
  };

  const handleSocialMedia = () => {
    fetchAllClientSocialMedia();
    setSocialMediaForm(false);
  };

  const columns = [
    {
      field: `socialMediaName`,
      headerName: t('Social Media'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Typography
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={() => handleClientSocialMedia(params)}
        >
          {params.row.socialMediaName}
        </Typography>
      )
    },

    {
      field: 'link',
      headerName: t('Link'),
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },

    {
      field: 'clientSocialMediaId',
      headerName: 'Actions',
      flex: 1,
      disableColumnMenu: true,
      hideSortIcons: true,
      sortingOrder: false,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box
          sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}
        >
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
      {addSocialMediaForm ? (
        <AddSocialMedia
          clientSocialMediaId={clientSocialMediaId[0]}
          id={clientId}
          socialMediaType={socialMediaType}
          onClick={handleSocialMedia}
          onCancelSocialMediaForm={() => setSocialMediaForm(false)}
        />
      ) : (
        <Paper>
          <Box p={2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                textTransform="uppercase"
                variant="h4"
                fontWeight="700"
              >
                Social Media
              </Typography>
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => {
                  setClientSocialMediaId([]);
                  setSocialMediaForm(true);
                }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
              >
                Add Social Media
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
            exportFields={['socialMediaName', 'link']}
          />
        </Paper>
      )}
    </>
  );
};

export default SocialMedia;
