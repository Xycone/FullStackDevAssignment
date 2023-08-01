import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Input, IconButton, Button } from '@mui/material';
import http from '../http';
import { AccessTime, Search, Clear, Edit, Delete, AddCircle } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

const greyBoxStyle = {
  backgroundColor: "#D2D2D2", // Grey background color
  color: "black", 
};

function UserTable() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState('');

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getUsers = () => {
    http.get('/user').then((res) => {
      setUserList(res.data);
    });
  };

  const searchUser = () => {
    http.get(`/user?search=${search}`).then((res) => {
      setUserList(res.data);
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchUser();
    }
  };

  const onClickSearch = () => {
    searchUser();
  }

  const onClickClear = () => {
    setSearch('');
    getUsers();
  };

  const deleteUser = (id) => {
    const isLoggedUser = id === user.id;
    http.delete(`/user/${id}`).then((res) => {
      console.log(res.data);
      if (isLoggedUser) {
        logout()
      } else {
      navigate(0);
      }
    });
  }

  const [open, setOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(0);
  const handleOpen = (id) => {
    setUserIdToDelete(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        User Table
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 7 }}>
        <Input value={search} placeholder="Search for user" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        <TableContainer component={Paper}>
          <Table aria-label="car table">
            <TableHead>
              <TableRow style={greyBoxStyle}>
                <TableCell align="center">Id</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((users) => (
                <TableRow
                  key={users.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  style={greyBoxStyle}
                >
                  <TableCell align="center">{users.id}</TableCell>
                  <TableCell align="center">{users.name}</TableCell>
                  <TableCell align="center">{users.email}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        justifyContent: "center",
                      }}
                      color="text.secondary"
                    >
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography>
                        {dayjs(users.createdAt).format(global.datetimeFormat)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Link to={`/updateuser/${users.id}`}>
                      <IconButton color="primary" sx={{ padding: "4px" }}>
                        <Edit />
                      </IconButton>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      sx={{ padding: "4px" }}
                      onClick={() => handleOpen(users.id)}
                    >
                      <Delete />
                    </IconButton>
                    <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>Delete User</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to delete this user?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => deleteUser(userIdToDelete)}
                        >
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

export default UserTable;