import { Link } from 'react-router-dom';

const StoryList = ({ 
  stories, 
  addStory, 
  newTitle, 
  setNewTitle, 
  newContent, 
  setNewContent, 
  searchTerm, 
  setSearchTerm,
  isAuthorized 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    addStory(e);
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="stories-list">
        {filteredStories.map(story => (
          <Link to={`/story/${story.id}`} key={story.id}>
            <div className="story-item">
              <h2>{story.title}</h2>
              <p className="story-preview">
                {story.content?.substring(0, 100)}
                {story.content?.length > 100 ? '...' : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {isAuthorized && (
        <div className="add-story-section">
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
      )}
    </div>
  );
};

export default StoryList;
