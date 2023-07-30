import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Input, IconButton, Button } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Delete, AddCircle } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';


function AllFeedback() {
    const navigate = useNavigate();
    const [feedbackList, setFeedbackList] = useState([]);
    const [search, setSearch] = useState('');
    // const { user } = useContext(UserContext);
    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getFeedback = () => {
        http.get('/feedback').then((res) => {
            setFeedbackList(res.data);
        });
    };
    const searchFeedback = () => {
        http.get(`/feedback?search=${search}`).then((res) => {
            setFeedbackList(res.data);
        });
    };
    useEffect(() => {
        getFeedback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchFeedback();
        }
    };
    const onClickSearch = () => {
        searchFeedback();
    }
    const onClickClear = () => {
        setSearch('');
        getFeedback();
    };
    const deleteFeedback = (id) => {
      http.delete(`/feedback/${id}`).then((res) => {
        console.log(res.data);
        navigate(0);
      });
    };
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [listing_id, setId] = useState(0);
    const handleOpen = (id) => {
        setId(id)
        setOpen(true);
      };
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen1 = (id) => {
      setId(id)
      setOpen1(true);
    };
  const handleClose1 = () => {
      setOpen1(false);
  };
  const editFeedback = (id, feedback) => {
    http.put(`/feedback/${id}`, feedback).then((res) => {
      console.log(res.data);
      navigate(0);
    });
  };
    useEffect(() => {
        http.get('/feedback').then((res) => {
            console.log(res.data);
            setFeedbackList(res.data);
        });
    }, []);
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Feedback
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
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
                {/* {
                    user && (
                        <Link to="/addfeedback" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                } */}
            </Box>
            <Grid container spacing={2}>
        <TableContainer component={Paper}>
          <Table aria-label='feedback table'>
            <TableHead>
              <TableRow>
                <TableCell align="center">Id</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Responded</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbackList.map((feedback) => (
                <TableRow key={feedback.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">{feedback.id}</TableCell>
                  <TableCell align="center">{feedback.rating}</TableCell>
                  <TableCell align="center">{feedback.description}</TableCell>
                  <TableCell align="center">{feedback.responded.toString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}
                      color="text.secondary">
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>
                        {dayjs(feedback.createdAt).format(global.datetimeFormat)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                  <IconButton color="primary" sx={{ padding: '4px' }} onClick={() => handleOpen(feedback.id)}>
                      <Edit />
                    </IconButton>
                    <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>
                        Send an email response
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to send an email response?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button variant="contained" color="inherit"
                          onClick={handleClose}>
                          Cancel
                        </Button>
                        <Button variant="contained" color="error"
                          onClick={() => editFeedback(listing_id, {"rating": listing_id.rating, "description": listing_id.description,"responded": true})}>
                          Send
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" sx={{ padding: '4px' }} onClick={() => handleOpen1(feedback.id)}>
                      <Delete />
                    </IconButton>
                    <Dialog open={open1} onClose={handleClose1}>
                      <DialogTitle>
                        Delete Listing
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to delete the feedback?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button variant="contained" color="inherit"
                          onClick={handleClose1}>
                          Cancel
                        </Button>
                        <Button variant="contained" color="error"
                          onClick={() => deleteFeedback(listing_id)}>
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
    )
}

export default AllFeedback