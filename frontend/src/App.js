import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './hooks/useAuth';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      {user && <Navbar />}
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/transactions" element={user ? <Transactions /> : <Navigate to="/login" />} />
          <Route path="/budgets" element={user ? <Budgets /> : <Navigate to="/login" />} />
          <Route path="/categories" element={user ? <Categories /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
