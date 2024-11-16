import PropTypes from 'prop-types';

export const RoomSelectProps = {
  selectedRoom: PropTypes.string.isRequired,
  handleRoomSelect: PropTypes.func.isRequired,
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};