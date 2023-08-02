import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Input, IconButton, Button, Container } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Delete, AddCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';


function ReportD() {
  const navigate = useNavigate();
  const [reportList, setReportList] = useState([]);
  const [search, setSearch] = useState('');
  // const { user } = useContext(UserContext);
  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getReport = () => {
    http.get('/report').then((res) => {
      setReportList(res.data);
    });
  };
  const searchReport = () => {
    http.get(`/report?search=${search}`).then((res) => {
      setReportList(res.data);
    });
  };
  useEffect(() => {
    getReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchReport();
    }
  };
  const onClickSearch = () => {
    searchReport();
  }
  const onClickClear = () => {
    setSearch('');
    getReport();
  };
  const [open1, setOpen1] = useState(false);
  const [listing_id, setId] = useState(0);
  const handleOpen1 = (id) => {
    setId(id)
    setOpen1(true);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  useEffect(() => {
    http.get('/report').then((res) => {
      console.log(res.data);
      setReportList(res.data);
    });
  }, []);
  return (
    <Container>
      <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
          Reports
        </Typography>

        <Box sx={{ display: 'flex', alignProduct: 'center', mb: 2 }}>
          <Input value={search} placeholder="Search"
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown} />
          <IconButton color="primary"
            onClick={onClickSearch}>
            <Search />
          </IconButton>
          <IconButton color="primary"
            onClick={onClickClear}>
            <Clear />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {/* {
                    user && (
                        <Link to="/addreport" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                } */}
        </Box>
        <Grid container spacing={2}>
          <TableContainer component={Paper}>
            <Table aria-label='report table'>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Revenue</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportList.map((report) => (
                  <TableRow key={report.date} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">{report.date}</TableCell>
                    <TableCell align="center">{report.revenue}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Link to={`/payment/${report.date}`}>
                        <VisibilityIcon />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Box>
    </Container>
  )
}

export default ReportD