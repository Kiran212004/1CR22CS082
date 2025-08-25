import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import StatsPage from './StatsPage';
import { AppBar, Toolbar, Button, Box } from '@mui/material';

const Router: React.FC = () => (
  <BrowserRouter>
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/stats">Stats</Button>
        </Box>
      </Toolbar>
    </AppBar>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/stats" element={<StatsPage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
