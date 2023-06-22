import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link }
from 'react-router-dom';

import CarListings from './pages/CarListings';
import AddCarListings from './pages/AddCarListings';
import EditCarListings from './pages/EditCarListings';

function App() {
  return (
    <Router>
      <AppBar position="static" className='AppBar'>
        <Container>
          <Toolbar disableGutters={true}>
            <Link to="/">
              <Typography variant="h6" component="div">
                Learning
              </Typography>
            </Link>
            <Link to="/cars" >
              <Typography>
                Car Listings
              </Typography>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Routes>
          <Route path={"/cars"} element={<CarListings />} />
          <Route path={"/addcars"} element={<AddCarListings /> }/>
          <Route path={"/editcars/:id"} element={<EditCarListings />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;