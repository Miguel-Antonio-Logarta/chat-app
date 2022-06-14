import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import { Route, Routes, useNavigate } from 'react-router-dom';
import NotFound from './routes/NotFound';
import ChatSelect from './routes/ChatSelect';
import AuthProvider from './components/AuthContext';
import ChatRoom from './routes/ChatRoom';
// import { w3cwebsocket as W3CWebSocket } from "websocket";

// const client = new WebSocket('ws://127.0.0.1:8000/ws');
// export const AuthContext = React.createContext<string | null>(null);

function App() {
  // client.addEventListener('open', (event) => {
  //   client.send()
  // })
  

  // const [user, setUser] = useState<any>({});
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [message, setMessage] = useState("");
  // const [username, setUsername] = useState("");
  // const [messages, setMessages] = useState<string[]>([]);
  // const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setMessage(e.target.value);
  // }

  // const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setUsername(e.target.value);    
  // }

  // const handleLoginSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoggedIn(true);
  //   setUser({
  //     ...user,
  //     username: username
  //   });
  // }

  // const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // Make a request to the web server with the submission. Using the websocket.
  //   client.send(message);
  // }

  // client.onmessage = (message: MessageEvent) => {
  //   // We recieve message as a string
  //   console.log(message);  
  //   // setMessage(message.data);
  //   setMessages(messages.concat(message.data));
  // }
  // const [token, setToken] = useState<string | null>(null);
  // const navigate = useNavigate();
  // const handleLogin = async (tokenData: string) => {
  //   setToken(tokenData);
  //   navigate("/home", {replace: true});
  // }
  // const handleLogOut = () => {
  //   setToken(null);
  // }

  return (
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route index element={<ChatRoom />} />
            <Route path="login" element={<Login />} />
            <Route path="signUp" element={<SignUp />} />
            <Route path="home" element={<ChatSelect />} />
            <Route path="chat" element={<ChatRoom />} />
            <Route path="*" element={<NotFound  />} />
          </Routes>
        </div>
      </AuthProvider>
  );
}

export default App;
