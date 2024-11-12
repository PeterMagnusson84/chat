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
  const [room, setRoom] = useState(''); // Add room state
  const [rooms, setRooms] = useState(new Set(JSON.parse(localStorage.getItem('rooms')) || [])); // Add rooms state

  useEffect(() => {
    // Listen for incoming messages
    const handleMessage = (msg) => {
      console.log("Received message:", msg);
      if (!msg.timestamp) {
        msg.timestamp = new Date().toISOString(); // Ensure timestamp is added if missing
      }
      setMessages((prevMessages) => {
        const roomMessages = prevMessages[msg.room] || [];
        // Check if the message already exists
        if (roomMessages.some((m) => m.id === msg.id)) {
          return prevMessages;
        }
        const updatedMessages = {
          ...prevMessages,
          [msg.room]: [...roomMessages, msg]
        };
        // Save messages to local storage
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    };

    socket.on('chat message', handleMessage);

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
      socket.off('chat message', handleMessage);
      socket.off('disconnect');
      socket.off('reconnect');
      socket.off('reconnect_attempt');
      socket.off('connect');
      socket.off('connect_error');
      socket.off('reconnect_error');
      socket.off('reconnect_failed');
    };
  }, []);

  useEffect(() => {
    // Save rooms to localStorage whenever rooms state changes
    localStorage.setItem('rooms', JSON.stringify(Array.from(rooms)));
  }, [rooms]);

  const connectUser = (e) => {
    e.preventDefault();
    if (username.trim() && room.trim()) {
      setIsConnected(true);
      socket.emit('join room', room); // Join the selected room
      socket.connect();
      setRooms((prevRooms) => new Set(prevRooms).add(room)); // Add room to rooms state
      // Load messages for the selected room
      const savedMessages = JSON.parse(localStorage.getItem('messages')) || {};
      console.log("Loaded messages from localStorage:", savedMessages);
      setMessages(savedMessages);
    };
  };

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("sendMessage called"); // Add this line to check if the function is called twice
    if (message.trim()) {
      const msg = {
        id: Date.now(), // Add a unique identifier
        room: room, // Include room information
        username: username,
        text: message,
        timestamp: new Date().toISOString() // Add timestamp
      }
      console.log("Message to send:", msg);
      socket.emit('chat message', msg); // Send the message to the server
      setMessage('');
      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages, [room]: [...(prevMessages[room] || []), msg ]};
        // Save messages to local storage
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    }
  };

  const disconnectUser = () => {
    setIsConnected(false);
    setUsername('');
    socket.disconnect(); // Properly disconnect the client
  };

  return (
    <div>
      {!isConnected ? (
        <div>
          <UsernameForm username={username} setUsername={setUsername} connectUser={connectUser} />
          <input
            type="text"
            placeholder="Create room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="" disabled>Select a room</option>
          {[...rooms].map((roomName) => (
            <option key={roomName} value={roomName}>
            {roomName}
            </option>
          ))}
          </select>
        </div>
      ) : (
        <div>
          <MessageList messages={messages [room] || []} />
          <MessageForm message={message} setMessage={setMessage} sendMessage={sendMessage} />
          <div><button onClick={disconnectUser}>Log out</button></div>
        </div>
      )}
    </div>
  );
};

export default Chat;
