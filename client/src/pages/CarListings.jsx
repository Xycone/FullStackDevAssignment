import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Input, IconButton, Button } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Delete, AddCircle } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';


function CarListings() {
  const navigate = useNavigate();
  const [assignmentList, setAssignmentList] = useState([]);
  const [search, setSearch] = useState('');

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getCars = () => {
    http.get('/assignment').then((res) => {
      setAssignmentList(res.data);
    });
  };

  const searchCars = () => {
    http.get(`/assignment?search=${search}`).then((res) => {
      setAssignmentList(res.data);
    });
  };

  useEffect(() => {
    getCars();
  }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchCars();
    }
  };

  const onClickSearch = () => {
    searchCars();
  }

  const onClickClear = () => {
    setSearch('');
    getCars();
  };

  const deleteCars = (id) => {
    http.delete(`/assignment/${id}`).then((res) => {
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
        Car Listings
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 7 }}>
        <Input value={search} placeholder="Search for car" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />
        <Link to="/addcars" style={{ textDecoration: 'none' }}>
          <IconButton color="primary" sx={{ padding: '4px' }}>
            <AddCircle />
          </IconButton>
        </Link>
      </Box>

      <Grid container spacing={2}>
        <TableContainer component={Paper}>
          <Table aria-label='car table'>
            <TableHead>
              <TableRow>
                <TableCell align="center">Id</TableCell>
                <TableCell align="center">Make</TableCell>
                <TableCell align="center">Model</TableCell>
                <TableCell align="center">Range</TableCell>
                <TableCell align="center">Price/day</TableCell>
                <TableCell align="center">Rental Status</TableCell>
                <TableCell align="center">Added On</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignmentList.map((cars) => (
                <TableRow key={cars.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">{cars.id}</TableCell>
                  <TableCell align="center">{cars.make}</TableCell>
                  <TableCell align="center">{cars.model}</TableCell>
                  <TableCell align="center">{cars.range}</TableCell>
                  <TableCell align="center">{cars.price}</TableCell>
                  <TableCell align="center">{cars.status.toString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}
                      color="text.secondary">
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>
                        {dayjs(cars.createdAt).format(global.datetimeFormat)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Link to={`/editcars/${cars.id}`}>
                      <IconButton color="primary" sx={{ padding: '4px' }}>
                        <Edit />
                      </IconButton>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" sx={{ padding: '4px' }} onClick={() => handleOpen(cars.id)}>
                      <Delete />
                    </IconButton>
                    <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>
                        Delete Listing
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to delete this listing?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button variant="contained" color="inherit"
                          onClick={handleClose}>
                          Cancel
                        </Button>
                        <Button variant="contained" color="error"
                          onClick={() => deleteCars(listing_id)}>
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
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

export default CarListings;