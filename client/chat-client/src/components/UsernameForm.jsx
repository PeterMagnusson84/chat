import { UsernameFormProps } from '../interfaces/UsernameFormProps';

const UsernameForm = ({ username, setUsername, connectUser }) => {
  return (
    <form onSubmit={connectUser}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username..."
      />
      <button type="submit">Connect</button>
    </form>
  );
};

UsernameForm.propTypes = UsernameFormProps;

export default UsernameForm;
