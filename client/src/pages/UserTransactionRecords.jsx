
import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Input, IconButton, Button, Container } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';


function TransactionRecords() {
    const [user, setUser] = useState(null);
    const [transactionList, setTransactionList] = useState([]);
    const [search, setSearch] = useState('');

    const getTransactions = () => {
        http.get(`/transactionrecord/user/${user.id}`).then((res) => {
            setTransactionList(res.data);
        });
    };
    
    useEffect(() => {
        getTransactions();
        if (localStorage.getItem("accessToken")) {
            http.get("/user/auth").then((res) => {
              const user = res.data.user;
              if (user) {
                setUser(user);}
                });
              }
            });
          }
    }, []);

    return (
        <Container>
            <Box>
                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                    Transaction Records
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 7 }}>
                    <Input value={search} placeholder="Search by car location" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
                    <IconButton color="primary" onClick={onClickSearch}>
                        <Search />
                    </IconButton>
                    <IconButton color="primary" onClick={onClickClear}>
                        <Clear />
                    </IconButton>
                </Box>

                <Grid container spacing={2}>
                    <TableContainer component={Paper}>
                        <Table aria-label='transaction records'>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Car ID</TableCell>
                                    <TableCell align="center">Transaction Amt</TableCell>
                                    <TableCell align="center">Item</TableCell>
                                    <TableCell align="center">Booking Date (start)</TableCell>
                                    <TableCell align="center">Booking Date (end)</TableCell>
                                    <TableCell align="center">Payment By</TableCell>
                                    <TableCell align="center">Payment Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactionList.map((transaction, i) => (
                                    <TableRow key={transaction.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="center">{transaction.carId}</TableCell>
                                        <TableCell align="center">{transaction.productPrice}</TableCell>
                                        <TableCell align="center">{transaction.productName}</TableCell>
                                        <TableCell align="center">{dayjs(transaction.startDate).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell align="center">{dayjs(transaction.endDate).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell align="center">{transaction.userId}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}
                                                color="text.secondary">
                                                <AccessTime sx={{ mr: 1 }} />
                                                <Typography>
                                                    {dayjs(transaction.createdAt).format(global.datetimeFormat)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Box>
        </Container>
    );
}
export default TransactionRecords