import { messageFormProps } from '../interfaces/messageFormProps';

const MessageForm = ({ message, setMessage, sendMessage }) => {
  return (
    <form onSubmit={sendMessage}>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

MessageForm.propTypes = messageFormProps;

export default MessageForm;
