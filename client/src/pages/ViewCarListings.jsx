import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Container } from '@mui/material';
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
    const [carList, setCarList] = useState([]);
    const [search, setSearch] = useState('');
    // used to store listing available car counts


    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getListings = () => {
        http.get('/listings').then((res) => {
            setAssignmentList(res.data);
        });
    };

    const getCars = () => {
        http.get('/cars').then((res) => {
            setCarList(res.data);
        });
    };

    const searchListings = () => {
        http.get(`/listings?search=${search}`).then((res) => {
            setAssignmentList(res.data);
        });
    };

    const [isLoading, setIsLoading] = useState(true); // Add loading state
    useEffect(() => {
        // Fetch data from Listing table
        getListings();
        // Fetch data from Car table
        getCars();
    }, []);

    const [listingCarCounts, setListingCarCounts] = useState({
        available: {},
    });

    useEffect(() => {
        if (carList.length > 0) { // Check if carList has data before calculating counts

            // Calculate the count of available child objects for each Listing in the carList array
            const availableChildCounts = carList.reduce((acc, child) => {
                if (child.serviceStatus === false) { // Assuming "available" is a boolean attribute
                    acc[child.listingId] = (acc[child.listingId] || 0) + 1;
                }
                return acc;
            }, {});

            // Set the calculated counts
            setListingCarCounts({
                available: availableChildCounts,
            });
        } else {
            setListingCarCounts({
                available: {},
            });
        }

        setIsLoading(false); // Data has been loaded, set isLoading to false
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

    return (
        <Container>
            <Box>
                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                    Car Listings
                </Typography>

                <Box sx={{ display: 'flex', alignProduct: 'center', mb: 7 }}>
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
                        assignmentList.map((listings) => {

                            //Get the available car count for the current listing
                            const availableCarCount = listingCarCounts.available[listings.id] || 0;
                            if (availableCarCount > 0) {
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
                            }
                        })
                    }
                </Grid>
            </Box>
        </Container>
    );
}
export default ViewCarListings