import { messageFormProps } from '../PropTypes/messageFormProps';
import '../styles/messageFormStyle.css';

const MessageForm = ({ message, setMessage, sendMessage }) => {
  return (
    <form onSubmit={sendMessage} >
      <div className="chat-container">
        <div className="chat-input-wrapper">
          <div className="chat-input-group">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
          </div>
        </div>
        <button type="submit" className="send-button">
          <span className="send-button-text">Send</span>
        </button>
      </div>
    </form>
  );
};

MessageForm.propTypes = messageFormProps;

export default MessageForm;
