import PropTypes from 'prop-types';

export const UsernameFormProps = {
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  connectUser: PropTypes.func.isRequired,
};