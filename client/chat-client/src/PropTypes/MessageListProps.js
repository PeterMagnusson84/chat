import PropTypes from 'prop-types';

export const MessageListProps = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired
    })
  ).isRequired
};
