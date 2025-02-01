import { FaTimes } from 'react-icons/fa';

const AddStoryModal = ({ isOpen, onClose, newTitle, setNewTitle, newContent, setNewContent, addStory }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addStory(e);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Add New Story</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Story title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Story content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            required
          />
          <button type="submit">Add Story</button>
        </form>
      </div>
    </div>
  );
};

export default AddStoryModal;