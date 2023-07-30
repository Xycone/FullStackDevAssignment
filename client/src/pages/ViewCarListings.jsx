import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton } from '@mui/material';
import http from '../http';
import { Search, Clear } from '@mui/icons-material';
import global from '../global';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import '../css/ViewCarListings.css';

function ViewCarListings() {
    const navigate = useNavigate();
    const [assignmentList, setAssignmentList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getListings = () => {
        http.get('/listings').then((res) => {
            setAssignmentList(res.data);
        });
    };

    const searchListings = () => {
        http.get(`/listings?search=${search}`).then((res) => {
            setAssignmentList(res.data);
        });
    };

    useEffect(() => {
        getListings();
    }, []);

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
            <Grid container spacing={4}>
                {
                    assignmentList.map((listings, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={listings.id}>
                                <Link className="Link" to={`/createbooking/${listings.id}`}>
                                    <Card className="ListingCard">
                                        {
                                            listings.imageFile && (
                                                <JoyCssVarsProvider>
                                                    <AspectRatio>
                                                        <Box component="img" src={`${import.meta.env.VITE_FILE_BASE_URL}${listings.imageFile}`} alt="listings">
                                                        </Box>
                                                    </AspectRatio>
                                                </JoyCssVarsProvider>
                                            )
                                        }
                                        <CardContent>
                                            <Typography variant="h5" textAlign="center" sx={{ mb: 1 }}>
                                                {listings.make} {listings.model}
                                            </Typography>
                                            <Typography variant="h6" textAlign="center" sx={{ whiteSpace: 'pre-wrap' }}>
                                                S${listings.price}/day
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}
export default ViewCarListings