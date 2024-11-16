import { MessageListProps } from '../PropTypes/MessageListProps';
import '../styles/messageListStyle.css';

const MessageList = ({ messages }) => {
  return (
    <ul className="message-list">
      {messages.map((msg, index) => (
        <li key={index} className='message-item'>
          <div className='message-user-time'>
            <span>{msg.username}</span>
            <span className='message-timestamp'>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className='message-text'>
            <span>{msg.text}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
MessageList.propTypes = MessageListProps;

export default MessageList;
