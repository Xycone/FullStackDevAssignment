import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto';
import { CategoryScale } from "chart.js";
import {
  Box,
  Typography,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Input,
  IconButton,
  Button,
  Container,
} from "@mui/material";
import http from "../http";
import {
  AccessTime,
  Search,
  Clear,
  Edit,
  Delete,
  AddCircle,
} from "@mui/icons-material";
import dayjs from "dayjs";
import global from "../global";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

Chart.register(CategoryScale);

function AllFeedback() {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [responded, setResponded] = useState(0);
  const [feedback_id, setId] = useState(0);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [buttonstate, setbutton] = useState(0);
  // const { user } = useContext(UserContext);
  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const searchFeedback = () => {
    http.get(`/feedback?search=${search}&responded=${responded}`).then((res) => {
      setFeedbackList(res.data);
    });
  };
  useEffect(() => {
    searchFeedback(); // Trigger search with the updated responded value
  }, [buttonstate]);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const requests = (userId || []).map((user) => http.get("/user"));

        const responses = await Promise.all(requests);

        const user = responses.map((response) => {
          const userData = response.data;
          return userData.id;
        });

        setUserId(userId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserId();
  }, [userId]);
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchFeedback();
    }
  };
  const onClickSearch = () => {
    searchFeedback();
  };
  const onClickClear = () => {
    setSearch("");
    searchFeedback();
  };
  const deleteFeedback = (id) => {
    http.delete(`/feedback/${id}`).then((res) => {
      console.log(res.data);
      navigate(0);
    });
  };
  const handleOpen = (id) => {
    setId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen1 = (id) => {
    setId(id);
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
  const respondedEdit = () => {
    const buttonchange = buttonstate === 0 ? 1 :0;
    setbutton(buttonchange);
    const newResponded = responded === 0 ? 1 : 0;
    setResponded(newResponded);
  };
  function Item({ fid, isrespond }) {
    if (isrespond == 1) {
      return ;
    }
    return <IconButton
      color="primary"
      sx={{ padding: "4px" }}
      onClick={() => handleOpen(fid)}
    >
      <Edit />

    </IconButton>;
  };
  return (
    <Container>
      <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
          Feedback
        </Typography>
        <Box sx={{ display: 'flex', alignProduct: 'center', mb: 2 }}>
          <Input value={search} placeholder="Search for rating"
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
          <Button onClick={respondedEdit}>
            {buttonstate === 0 ? 'Pending' : 'Responded' }
          </Button>
        </Box>
        <Grid container spacing={2}>
          <TableContainer component={Paper}>
            <Table aria-label="feedback table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Id</TableCell>
                  <TableCell align="center">Rating</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Responded</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Author</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              {feedbackList.map((feedback) => (
                <TableBody key={feedback.id}>
                  <TableRow
                    key={feedback.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{feedback.id}</TableCell>
                    <TableCell align="center">{feedback.rating}</TableCell>
                    <TableCell align="center">{feedback.description}</TableCell>
                    <TableCell align="center">
                      {feedback.responded.toString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignProduct: 'center', mb: 1, justifyContent: 'center' }}
                        color="text.secondary">
                        <Typography>
                          {dayjs(feedback.createdAt).format(
                            'DD/MM/YYYY'
                          )}
                        </Typography>
                      </Box>
                    </TableCell>
                    {/* <TableCell>{userId[index]}</TableCell> */}
                    <TableCell>
                      <Item isrespond={feedback.responded}
                        fid={feedback.id} />
                      <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Send an email response</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to send an email response?
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
                            onClick={() =>
                              editFeedback(feedback_id, {
                                rating: feedback_id.rating,
                                description: feedback_id.description,
                                responded: true,
                              })
                            }
                          >
                            Send
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        sx={{ padding: "4px" }}
                        onClick={() => handleOpen1(feedback.id)}
                      >
                        <Delete />
                      </IconButton>
                      <Dialog open={open1} onClose={handleClose1}>
                        <DialogTitle>Delete Listing</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete the feedback?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            variant="contained"
                            color="inherit"
                            onClick={handleClose1}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteFeedback(feedback_id)}
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </TableContainer>
        </Grid>
      </Box>
    </Container>
  );
}

export default AllFeedback;
