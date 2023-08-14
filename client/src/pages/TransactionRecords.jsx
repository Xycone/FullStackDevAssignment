
import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Input, IconButton, Button, Container } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';


function TransactionRecords() {
    const [transactionList, setTransactionList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getTransactions = () => {
        http.get('/transactionrecord').then((res) => {
            setTransactionList(res.data);
        });
    };

    const searchTransactions = () => {
        http.get(`/transactionrecord?search=${search}`).then((res) => {
            setTransactionList(res.data);
        });
    };

    useEffect(() => {
        getTransactions();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchTransactions();
        }
    };

    const onClickSearch = () => {
        searchTransactions();
    }

    const onClickClear = () => {
        setSearch('');
        getTransactions();
    };

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
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Booking Date (start)</TableCell>
                                    <TableCell align="center">Booking Date (end)</TableCell>
                                    <TableCell align="center">Payment Made</TableCell>
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