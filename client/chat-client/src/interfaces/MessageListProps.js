import PropTypes from 'prop-types';

export const MessageListProps = {
  messages: PropTypes.arrayOf(PropTypes.string).isRequired,
};
