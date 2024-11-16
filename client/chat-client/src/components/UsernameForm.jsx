import { UsernameFormProps } from '../PropTypes/UsernameFormProps';
import '../styles/userNameForm.css';

const UsernameForm = ({ username, setUsername, connectUser }) => {
  return (
    <form onSubmit={connectUser}>
      <div className="username-container">
        <div className="username-input-wrapper">
          <div className="username-input-group">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              className="username-input"
            />
            <div className='username-connect'>
            <button className='username-connect-button' type="submit">Connect</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

UsernameForm.propTypes = UsernameFormProps;

export default UsernameForm;
