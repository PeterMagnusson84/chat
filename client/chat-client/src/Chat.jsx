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
  const [selectedRoom, setSelectedRoom] = useState('');

  //Create endpoint for rooms
  const [rooms] = useState([
    { id: '6738d69484901ad4464b83fa', name: 'Room 1' },
    { id: '6738de2a84901ad4464b840a', name: 'Room 2' }
  ]);

  useEffect(() => {
    // Load messages from the server
    socket.on('init', (messages) => {
      // Ensure each message has a timestamp
      const updatedMessages = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp || new Date().toISOString()
      }));
      setMessages(updatedMessages);
    });

    // Listen for incoming messages
    socket.on('chat message', (msg) => {
      // Ensure the new message has a timestamp
      const updatedMsg = {
        ...msg,
        timestamp: msg.timestamp || new Date().toISOString()
      };
      setMessages((prevMessages) => [...prevMessages, updatedMsg]);
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
      socket.off('init');
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

  const handleRoomSelect = (event) => {
    setSelectedRoom(event.target.value);
  };

  const connectUser = (e) => {
    e.preventDefault();
    if (username.trim() && selectedRoom) {
      setIsConnected(true);
      socket.connect();
      socket.emit('join room', selectedRoom); // Emit an event to join the room
    };
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', {
        username: username,
        text: message,
        room: selectedRoom, // Include the room ID
      });
      setMessage('');
    }
  };

  const disconnectUser = () => {
    setIsConnected(false);
    setUsername('');
    socket.disconnect(); // Properly disconnect the client
  };

  console.log("messages", messages);
  console.log("selectedRoom", selectedRoom);

  return (
    <div>
      {!isConnected ? (
        <div>
          <UsernameForm username={username} setUsername={setUsername} connectUser={connectUser} />
          <select id="room-select" value={selectedRoom} onChange={handleRoomSelect}>
            <option value="">--Please choose a room--</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
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
