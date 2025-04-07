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
import EditRecordPage from './EditRecordPage';
import EditCatPage from './EditCatPage';


function App() {
  const historyRef = React.useRef(null);
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} /> 
          <Route path='/cats' element={<CatListPage />} />
          <Route path='/add-cat' element={<AddCatPage />} />
          <Route path='/cats/:id' element={<CatDetailsPage />} />
          <Route path='/cats/:id/add-record' element={<AddRecordForCatPage />} />
          <Route path='/records/:recordId/edit' element={<EditRecordPage />} />
          <Route path='/cats/:id/edit' element={<EditCatPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
