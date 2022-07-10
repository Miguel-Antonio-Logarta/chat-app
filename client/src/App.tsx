import React, { useEffect } from 'react';
import './App.css';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from './routes/NotFound';
import AuthProvider from './components/AuthContext';
import ChatRoom from './routes/ChatRoom';
import SocketProvider from './components/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
// import WSProvider from './components/WSContext';

function App() {
  return (
      <AuthProvider>
        <SocketProvider>
          {/* <WSProvider> */}
            <div className="App">
              <Routes>
                <Route index element={<Navigate to="home" />} />
                <Route path="login" element={<Login />} />
                <Route path="signUp" element={<SignUp />} />
                <Route path="home" element={
                  <ProtectedRoute>
                    <ChatRoom />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound  />} />
              </Routes>
            </div>
          {/* </WSProvider> */}
        </SocketProvider>
      </AuthProvider>
  );
}

export default App;
