import React, { useEffect, useState } from 'react';
import { Card, CardContent, Box, Typography, Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Input, IconButton, Button } from '@mui/material';
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

    const getDiscounts = () => {
        http.get('/discounts').then((res) => {
            setAssignmentList(res.data);
        });
    };

    useEffect(() => {
        getDiscounts();
    }, []);

    return (
        <Box>
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Discounts view
            </Typography>
            <Grid container spacing={2}>
            {assignmentList.map((discounts) => (
            <Grid item xs={12} md={6} lg={4} key={discounts.id}>
                <Card>
                
                
                    <CardContent>
                        {'Discount '+ discounts.id}
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            {'$'+discounts.discount+' OFF'}
                        </Typography>
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                            {'End Date: '+discounts.enddate}
                        </Typography>
                    </CardContent>
                  
                    
                </Card>
            </Grid>
            ))}
            </Grid>
        </Box>
    );
}

export default Discounts;