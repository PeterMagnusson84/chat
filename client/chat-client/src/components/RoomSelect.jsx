import { RoomSelectProps } from "../PropTypes/RoomSelectProps";

const RoomSelect = ({ selectedRoom, handleRoomSelect, rooms }) => {
  return (
    <select id="room-select" value={selectedRoom} onChange={handleRoomSelect}>
      <option value="">--Please choose a room--</option>
      {rooms.map((room) => (
        <option key={room.id} value={room.id}>
          {room.name}
        </option>
      ))}
    </select>
  );
};

RoomSelect.propTypes = RoomSelectProps;

export default RoomSelect;