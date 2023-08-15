import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Input, IconButton, Button, Container } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Delete, AddCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';


function Payment() {
  const navigate = useNavigate();
  const [paymentList, setPaymentList] = useState([]);
  const [search, setSearch] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  // const { user } = useContext(UserContext);
  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const calculateTotalAmount = () => {
    const total = paymentList.reduce((sum, payment) => sum + parseFloat(payment.total), 0);
    setTotalAmount(total);
  };
  const getPayment = () => {
    http.get('/payment').then((res) => {
      setPaymentList(res.data);
    });
  };
  const searchPayment = () => {
    http.get(`/payment?search=${search}`).then((res) => {
      setPaymentList(res.data);
    });
  };
  useEffect(() => {
    getPayment();
    calculateTotalAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    calculateTotalAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentList]);
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchPayment();
    }
  };
  const onClickSearch = () => {
    searchPayment();
  }
  const onClickClear = () => {
    setSearch('');
    getPayment();
  };
  const deletePayment = (id) => {
    http.delete(`/payment/${id}`).then((res) => {
      console.log(res.data);
      navigate(0);
    });
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
    http.get('/payment').then((res) => {
      console.log(res.data);
      setPaymentList(res.data);
    });
  }, []);
  return (
    <Container>
      <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
          Payment Records
        </Typography>

        <Box sx={{ display: 'flex', alignProduct: 'center', mb: 2 }}>
          <Input value={search} placeholder="DD/MM/YYYY"
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
          <Typography variant="h5" sx={{ my: 2 }}>
          Total Revenue = ${totalAmount}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <TableContainer component={Paper}>
            <Table aria-label='payment table'>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Car Id</TableCell>
                  <TableCell align="center">Car Name</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentList.map((payment) => (
                  <TableRow key={payment.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">{payment.carId}</TableCell>
                    <TableCell align="center">{payment.carname}</TableCell>
                    <TableCell align="center">${payment.total}</TableCell>
                    <TableCell align="center">{payment.date}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <IconButton color="primary" sx={{ padding: '4px' }} onClick={() => handleOpen1(payment.id)}>
                        <Delete />
                      </IconButton>
                      <Dialog open={open1} onClose={handleClose1}>
                        <DialogTitle>
                          Delete Listing
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete the payment?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button variant="contained" color="inherit"
                            onClick={handleClose1}>
                            Cancel
                          </Button>
                          <Button variant="contained" color="error"
                            onClick={() => deletePayment(listing_id)}>
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
    </Container>
  )
}

export default Payment