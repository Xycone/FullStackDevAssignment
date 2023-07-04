import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton } from '@mui/material';
import http from '../http';
import { Search, Clear } from '@mui/icons-material';
import global from '../global';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';

function ViewCarListings() {
    const navigate = useNavigate();
    const [assignmentList, setAssignmentList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getCars = () => {
        http.get('/cars').then((res) => {
            setAssignmentList(res.data);
        });
    };

    const searchCars = () => {
        http.get(`/cars?search=${search}`).then((res) => {
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
            </Box>
            <Grid container spacing={2}>
                {
                    assignmentList.map((cars, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={cars.id}>
                                <Card>
                                    {
                                        cars.imageFile && (
                                            <AspectRatio>
                                                <Box component="img" src={`${import.meta.env.VITE_FILE_BASE_URL}${cars.imageFile}`} alt="cars">
                                                </Box>
                                            </AspectRatio>
                                        )
                                    }
                                    <CardContent>
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            {cars.make} {cars.model}
                                        </Typography>
                                        <Typography variant="h6" sx={{ whiteSpace: 'pre-wrap'}}>
                                            S${cars.price}/day
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}
export default ViewCarListings