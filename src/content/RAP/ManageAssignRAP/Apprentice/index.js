import React, { useCallback, useEffect, useState } from 'react';
import { Box, Paper, Stack, Typography, Divider } from '@mui/material';
// import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DataTable from 'src/components/Table/Table';
import { useTranslation } from 'react-i18next';
import AddApprentice from './AddApprentice';
import { getAllApprentice } from 'src/api/rap';
import { formatDate } from 'src/utils/utils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';

const Apprentice = ({ assignRAPInfoGuid }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [loading, setLoding] = useState(false);
  const [totalRecords, setTotalRecords] = useState();
  const [clientContactId] = useState('');
  const [addContactForm, setAddContactForm] = useState(false);
  // const location = useLocation();

  useEffect(() => {
    fetchAllApprentice();
  }, []);

  const fetchAllApprentice = useCallback(async () => {
    setLoding(true);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: false,
      searchString: query
    };
    await getAllApprentice(obj, assignRAPInfoGuid)
      .then((res) => {
        if (res.data.data == null) {
          setData([]);
        } else {
          let data = res.data.data;
          data.map((item, index) =>
            item.dateApprenticeshipBegins
              ? (data[index].dateApprenticeshipBegins = formatDate(
                  new Date(item.dateApprenticeshipBegins)
                ))
              : null
          );
          setTotalRecords(res.data.totalRecords);
          setData(data);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoding(false);
      });
  }, []);

  console.log('==>data', data);

  const columns = [
    {
      field: `firstName`,
      headerName: t('Employee Name'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Typography>
          {params.row.firstName} {params.row.lastName}
        </Typography>
      )
    },
    {
      field: 'dateApprenticeshipBegins',
      headerName: t('Start Date'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'otjHours',
      headerName: t('OTJ Hours'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'rtiHours',
      headerName: t('RTI Hours'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'rapInfoId',
      headerName: t('View'),
      flex: 1,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Link to={`/RAP/RAP/view/${params.row.employeeId}`}>
          <VisibilityIcon />
        </Link>
      )
    }
  ];

  const handleAddForm = () => {
    fetchAllApprentice();
    setAddContactForm(false);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const handleQueryChange = async (event) => {
    event.persist();
    setQuery(event.target.value);
    let obj = {
      pageIndex: page + 1,
      pageSize: limit,
      orderByAscending: true,
      searchString: event.target.value
    };
    await getAllApprentice(obj)
      .then((res) => {
        if (res.data.data == null) {
          setData([]);
        } else {
          setData(res.data.data);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      {addContactForm ? (
        <AddApprentice
          clientContactId={clientContactId[0]}
          id={assignRAPInfoGuid}
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
                Apprentices
              </Typography>
              {/* <Button
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
                Add Apprentice
              </Button> */}
            </Stack>
          </Box>
          <Divider />
          <DataTable
            data={data}
            columns={columns}
            page={page}
            limit={limit}
            query={query}
            loading={loading}
            onQueryChange={handleQueryChange}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            totalRecords={totalRecords}
          />
        </Paper>
      )}
    </>
  );
};

export default Apprentice;
