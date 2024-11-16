import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UsernameForm from './components/UsernameForm';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';

const socket = io('http://localhost:4000', {
  reconnection: true,
  reconnectionAttempts: Infinity
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
      setMessages(messages);
    });

    // Listen for incoming messages
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for disconnection event
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('init');
      socket.off('chat message');
      socket.off('disconnect');
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
        timestamp: new Date().toISOString(),
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
