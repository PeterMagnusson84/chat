// Chat.js
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000', {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
}); // connect to the server

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
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

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', message); // send the message
      setMessage(''); // clear the input
    }
  };

  console.log("message", messages);

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
