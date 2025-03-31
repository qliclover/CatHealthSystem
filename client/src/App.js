import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// register 
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import CatListPage from './CatListPage';
import AddCatPage from './AddCatPage';
import CatDetailsPage from './CatDetailsPage';
import AddRecordForCatPage from './AddRecordForCatPage';


function App() {
  const historyRef = React.useRef(null);
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route path='/' element={<RegisterPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} /> 
          <Route path='/cats' element={<CatListPage />} />
          <Route path='/add-cat' element={<AddCatPage />} />
          <Route path='/cats/:id' element={<CatDetailsPage />} />
          <Route path='/cats/:id/add-record' element={<AddRecordForCatPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
