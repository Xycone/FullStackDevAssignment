import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Input, IconButton, Button } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Delete, Preview } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';


function Discounts() {
  const navigate = useNavigate();
  const [assignmentList, setAssignmentList] = useState([]);
  const [search, setSearch] = useState('');

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getDiscounts = () => {
    http.get('/discounts').then((res) => {
      setAssignmentList(res.data);
    });
  };

  const searchDiscounts = () => {
    http.get(`/discounts?search=${search}`).then((res) => {
      setAssignmentList(res.data);
    });
  };

  useEffect(() => {
    getDiscounts();
  }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchDiscounts();
    }
  };

  const onClickSearch = () => {
    searchDiscounts();
  }

  const onClickClear = () => {
    setSearch('');
    getDiscounts();
  };

  const deleteDiscounts = (id) => {
    http.delete(`/discounts/${id}`).then((res) => {
      console.log(res.data);
      navigate(0);
    });
  }

  const [open, setOpen] = useState(false);
  const [listing_id, setId] = useState(0);
  const handleOpen = (id) => {
    setId(id)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Discounts
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 7 }}>
        <Input value={search} placeholder="Search for discount" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />
        <Link to="/adddiscount" style={{ textDecoration: 'none' }}>
          <Button variant='contained'>
            Add Discount
          </Button>
        </Link>
      </Box>

      <Grid container spacing={2}>
        <TableContainer component={Paper}>
          <Table aria-label='car table'>
            <TableHead>
              <TableRow>
                <TableCell align="center">Id</TableCell>
                <TableCell align="center">Discount</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center">Discount Type</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center">End Date</TableCell>
                <TableCell align="center">Added On</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignmentList.map((discounts) => (
                <TableRow key={discounts.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">{discounts.id}</TableCell>
                  <TableCell align="center">{discounts.discount}</TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">{discounts.disctype}</TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">{discounts.enddate}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}
                      color="text.secondary">
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>
                        {dayjs(discounts.createdAt).format(global.datetimeFormat)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Link to={`/editdiscount/${discounts.id}`}>
                      <IconButton color="primary" sx={{ padding: '4px' }}>
                        <Edit />
                      </IconButton>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" sx={{ padding: '4px' }} onClick={() => handleOpen(discounts.id)}>
                      <Delete />
                    </IconButton>
                    <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>
                        Delete Discount
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to delete discount?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button variant="contained" color="inherit"
                          onClick={handleClose}>
                          Cancel
                        </Button>
                        <Button variant="contained" color="error"
                          onClick={() => deleteDiscounts(listing_id)}>
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Link to={`/discounts/${discounts.id}`}>
                      <IconButton color="primary" sx={{ padding: '4px' }}>
                        <Preview />
                      </IconButton>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Box>
  );
}

export default Discounts;