import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Input, IconButton, Button } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';


function CarListings() {
  const [listingList, setListingList] = useState([]);
  const [carList, setCarList] = useState([]);
  const [listingCarCounts, setListingCarCounts] = useState({});
  const [search, setSearch] = useState('');

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getListings = () => {
    http.get('/listings').then((res) => {
      setListingList(res.data);
    });
  };

  const getCars = () => {
    http.get('/cars').then((res) => {
      setCarList(res.data);
    });
  };

  const searchListings = () => {
    http.get(`/listings?search=${search}`).then((res) => {
      setListingList(res.data);
    });
  };

  const [isLoading, setIsLoading] = useState(true); // Add loading state
  useEffect(() => {
    // Fetch data from Listing table
    getListings();
    // Fetch data from Car table
    getCars();
  }, []);

  useEffect(() => {
    if (carList.length > 0) { // Check if carList has data before calculating counts
      // Calculate the count of all child objects for each Listing in the carList array
      const allChildCounts = carList.reduce((acc, child) => {
        acc[child.listingId] = (acc[child.listingId] || 0) + 1;
        return acc;
      }, {});
    
      // Calculate the count of available child objects for each Listing in the carList array
      const availableChildCounts = carList.reduce((acc, child) => {
        if (child.serviceStatus === false) { // Assuming "available" is a boolean attribute
          acc[child.listingId] = (acc[child.listingId] || 0) + 1;
        }
        return acc;
      }, {});
    
      // Set the calculated counts
      setListingCarCounts({
        all: allChildCounts,
        available: availableChildCounts,
      });

      setIsLoading(false); // Data has been loaded, set isLoading to false
    }
  }, [carList]);

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchListings();
    }
  };

  const onClickSearch = () => {
    searchListings();
  }

  const onClickClear = () => {
    setSearch('');
    getListings();
  };

  const deleteListings = (id) => {
    http.delete(`/listings/${id}`).then((res) => {
      console.log(res.data);
      window.location.reload();
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
        <Input value={search} placeholder="Search for car listing" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />
        <Link to="/addlistings" style={{ textDecoration: 'none' }}>
          <Button variant='contained'>
            Add Listing
          </Button>
        </Link>
      </Box>

      <Grid container spacing={2}>
      {isLoading ? (
          <Typography>Loading...</Typography> // Show loading message if data is not ready
        ) : (
        <TableContainer component={Paper}>
          <Table aria-label='car table'>
            <TableHead>
              <TableRow>
                <TableCell align="center">Listing Id</TableCell>
                <TableCell align="center">Car</TableCell>
                <TableCell align="center">Range</TableCell>
                <TableCell align="center">Price/day</TableCell>
                <TableCell align="center">Available</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Created On</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listingList.map(listings => (
                <TableRow key={listings.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">{listings.id}</TableCell>
                  <TableCell align="center">{listings.make} {listings.model}</TableCell>
                  <TableCell align="center">{listings.range}</TableCell>
                  <TableCell align="center">{listings.price}</TableCell>
                  <TableCell align="center">{listingCarCounts.available[listings.id] || 0}</TableCell>
                  <TableCell align="center">{listingCarCounts.all[listings.id] || 0}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}
                      color="text.secondary">
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>
                        {dayjs(listings.createdAt).format(global.datetimeFormat)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">~ Added By {listings.user.name}</TableCell>
                  <TableCell>
                    <Link to={`/editlistings/${listings.id}`}>
                      <IconButton color="primary" sx={{ padding: '4px' }}>
                        <Edit />
                      </IconButton>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" sx={{ padding: '4px' }} onClick={() => handleOpen(listings.id)}>
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
                          onClick={() => deleteListings(listing_id)}>
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
        )}
      </Grid>
    </Box>
  );
}

export default CarListings;