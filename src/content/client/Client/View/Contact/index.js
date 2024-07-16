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
  deleteContact,
  getAllContact,
  getAllContactType
} from 'src/api/client/client/contact';
import { useTranslation } from 'react-i18next';
import AddContact from 'src/content/client/Client/View/Contact/Add';

const Contact = ({ clientId }) => {
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
  const [clientContactId, setClientContactId] = useState('');
  const [addContactForm, setAddContactForm] = useState(false);
  const [contactType, setContactType] = useState([]);
  const location = useLocation();
  const isMountedRef = useRefMounted();

  const fetchAllContact = useCallback(async () => {
    setLoding(true);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllContact(obj, clientId)
      .then((res) => {
        if (res.data.data == null) {
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

  useEffect(() => {
    fetchAllContact();
  }, [getAllContact, page, limit, query, location.pathname]);

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
      await deleteContact(selectedIds)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllContact();
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
      await deleteContact(clientContactId)
        .then((res) => {
          if (res) {
            setOpenConfirmDelete(false);
            fetchAllContact();
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
      return users[selectedIndex]?.clientContactId;
    });
    let tempArr = [];
    selectedContactId.forEach((e) => {
      tempArr.push({
        clientContactId: e
      });
    });
    setSelectedIds(tempArr);
  };

  const handleConfirmDelete = (params) => {
    setClientContactId([{ clientContactId: params?.row?.clientContactId }]);
    setOpenConfirmDelete(true);
  };

  const handleEditContact = (params) => {
    setClientContactId([{ clientContactId: params?.row?.clientContactId }]);
    setAddContactForm(true);
  };

  const handleAddForm = () => {
    fetchAllContact();
    setAddContactForm(false);
  };

  useEffect(() => {
    fetchAllContactType();
  }, []);

  const fetchAllContactType = async () => {
    let obj = {
      pageIndex: 1,
      pageSize: 100,
      orderByAscending: true,
      searchString: ''
    };
    let temp = [];
    await getAllContactType(obj)
      .then((res) => {
        if (res) {
          res?.data?.data?.forEach((e) => {
            temp.push({
              label: e.contactType,
              value: e.contactTypeId
            });
          });
          setContactType(temp);
        }
      })
      .catch((e) => console.log(e));
  };

  const columns = [
    {
      field: `firstName`,
      headerName: t('Name'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Typography
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={() => handleEditContact(params)}
        >
          {params.row.firstName} {params.row.lastName}
        </Typography>
      )
    },

    {
      field: 'email',
      headerName: t('Email'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },

    {
      field: 'cellPhone',
      headerName: t('Contact Number'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Typography>
          {params.row.cellPhone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
        </Typography>
      )
    },

    {
      field: 'officePhone',
      headerName: t('Office Phone'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Typography>
          {params.row.officePhone.replace(
            /(\d{3})(\d{3})(\d{4})/,
            '($1) $2-$3'
          )}
        </Typography>
      )
    },

    {
      field: 'jobTitle',
      headerName: t('Job Title'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },

    {
      field: 'clientContactId',
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
      {addContactForm ? (
        <AddContact
          clientContactId={clientContactId[0]}
          id={clientId}
          contactType={contactType}
          onClick={handleAddForm}
          onCancelContactForm={() => setAddContactForm(false)}
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
                Contacts
              </Typography>
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => {
                  setClientContactId([]);
                  setAddContactForm(true);
                }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
              >
                Add Contact
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
              'firstName',
              'email',
              'cellPhone',
              'officePhone',
              'jobTitle'
            ]}
          />
        </Paper>
      )}
    </>
  );
};

export default Contact;
