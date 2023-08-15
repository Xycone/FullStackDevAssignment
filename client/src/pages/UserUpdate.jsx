import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import http from "../http";
import {
  Grid,
  Container,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AspectRatio from "@mui/joy/AspectRatio";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageFile, setImageFile] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  useEffect(() => {
    http.get(`/user/${id}`).then((res) => {
      setUser(res.data);
    });
  }, []);
  const formik = useFormik({
    initialValues: user,
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .trim()
        .matches(/^[a-z ,.'-]+$/i, "Invalid name")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters")
        .required("Name is required"),
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
    }),
    onSubmit: (data) => {
      data.name = data.name.trim();
      data.email = data.email.trim();
      data.filename = imageFile;
      http.put(`/user/update/${id}`, data).then((res) => {
        console.log(res.data);
        navigate("/userprofile");
      });
    },
  });
  const deleteUser = () => {
    http.delete(`/user/${id}`).then((res) => {
      console.log(res.data);
      navigate("/");
    });
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }

      let formData = new FormData();
      formData.append("file", file);
      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };
  return (
    <Container>
      <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
          Update User
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            autoComplete="off"
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            autoComplete="off"
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Grid item xs={12} md={6} lg={4}>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button variant="contained" component="label">
                Upload Image
                <input
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={onFileChange}
                />
              </Button>
              {imageFile && (
                <JoyCssVarsProvider>
                  <AspectRatio sx={{ width: "150px", height: "150px" }}>
                    <Box
                      component="div"
                      alt="Profile Picture"
                      sx={{
                        width: "100%", // Set width to 100% to stretch the image to the container width
                        height: "100%", // Set height to 100% to stretch the image to the container height
                        overflow: "hidden",
                        backgroundColor: 'white',
                      }}
                    >
                      <Box
                        component="img"
                        alt="Profile Picture"
                        src={`${
                          import.meta.env.VITE_FILE_BASE_URL
                        }${imageFile}`}
                        style={{
                          width: "auto", // Let the width adjust to maintain the aspect ratio
                          height: "100%", // Stretch the image to cover the entire container height
                          objectFit: "cover", // Maintain aspect ratio and cover the container
                          transform: "translateX(-25%)", // Shift the image to crop the left portion
                        }}
                      />
                    </Box>
                  </AspectRatio>
                </JoyCssVarsProvider>
              )}
            </Box>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Update
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              color="error"
              onClick={handleOpen}
            >
              Delete
            </Button>
          </Box>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Tutorial</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={deleteUser}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
export default UpdateUser;
