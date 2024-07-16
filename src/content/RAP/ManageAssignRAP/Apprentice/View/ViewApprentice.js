import { Box, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { getEmployeeCourse } from 'src/api/rap';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import DataTable from 'src/components/Table/Table';

const ViewApprentice = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAllEmployeeCourse();
    }
  }, [id]);

  const fetchAllEmployeeCourse = () => {
    setLoading(true);
    getEmployeeCourse(id)
      .then((res) => {
        if (res) {
          console.log('=>', res);
          setLoading(false);
          setTotalRecords(res.data.length);
          setData(res.data.data);
        }
      })
      .catch((e) => console.log(e));
  };

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

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      renderHeader: (params) => (
        <Typography variant="h5">{params.colDef.headerName}</Typography>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Assigned RAP management</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          Component={Paper}
          heading={t('My Course')}
          description={''}
        />
      </PageTitleWrapper>
      <Box>
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
      </Box>
    </>
  );
};

export default ViewApprentice;
