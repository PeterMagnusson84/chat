import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UsernameForm from './components/UsernameForm';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';

const socket = io('http://localhost:4000', {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
}); // connect to the server

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Load messages from local storage
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    // Listen for incoming messages
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, {
          text: msg.text,
          username: msg.username,
          timestamp: new Date().toISOString()
        }];
        // Save messages to local storage
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    // Listen for disconnection event
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Listen for reconnect event
    socket.on('reconnect', (attemptNumber) => {
      console.log('reconnect to server, attempt:', attemptNumber);
    });

    // Listen for reconnect attempt event
    socket.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect...');
    });

    // Add additional logging for debugging
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('connect_error', (error) => {
      console.log('Connection error:', error);
    });

    socket.on('reconnect_error', (error) => {
      console.log('Reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.log('Reconnection failed');
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('chat message');
      socket.off('disconnect');
      socket.off('reconnect');
      socket.off('reconnect_attempt');
      socket.off('connect');
      socket.off('connect_error');
      socket.off('reconnect_error');
      socket.off('reconnect_failed');
    };
  }, []);

  const connectUser = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsConnected(true);
      socket.connect();
    };
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', {
        username: username,
        text: message
      });
      setMessage('');
    }
  };

  const disconnectUser = () => {
    setIsConnected(false);
    setUsername('');
    // setMessages([]);
    socket.disconnect(); // Properly disconnect the client
  };

  console.log("messages", messages);

  return (
    <div>
      {!isConnected ? (
        <UsernameForm username={username} setUsername={setUsername} connectUser={connectUser} />
      ) : (
        <div>
          <MessageList messages={messages} />
          <MessageForm message={message} setMessage={setMessage} sendMessage={sendMessage} />
          <div><button onClick={disconnectUser}>Log out</button></div>
        </div>
      )}
    </div>
  );
};

export default Chat;
