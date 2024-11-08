import { MessageListProps } from '../interfaces/MessageListProps';


const MessageList = ({ messages }) => {
  return (
    <ul>
      {messages.map((msg, index) => (
        <li key={index}>{msg}</li>
      ))}
    </ul>
  );
};
MessageList.propTypes = MessageListProps;

export default MessageList;
