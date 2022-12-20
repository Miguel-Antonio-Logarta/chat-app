import React, { useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import AuthProvider from './context/AuthContext';
import ChatRoom from './pages/ChatRoom';
import ProtectedRoute from './components/ProtectedRoute';
import { ChatAppContextProvider } from './context/ChatAppContext';
import BetterSocketProvider from './context/SocketContext';

function App() {
  return (
      <AuthProvider>
          <BetterSocketProvider>
          <ChatAppContextProvider>
              <div className="App">
                <Routes>
                  <Route index element={<Navigate to="home" />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signUp" element={<SignUp />} />
                  <Route path="home" element={
                    <ProtectedRoute>
                      <ChatRoom />
                    </ProtectedRoute>
                  } >
                  </Route>
                  <Route path="*" element={<NotFound  />} />
                </Routes>
              </div>
          </ChatAppContextProvider>
          </BetterSocketProvider>
      </AuthProvider>
  );
}

export default App;
