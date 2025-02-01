import { Link } from 'react-router-dom';

const StoryList = ({ stories, searchTerm, setSearchTerm, isAuthorized, sortOrder, onSort }) => {
  // Filter stories based on search term
  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="story-list-container">
      <div className="story-controls">
        <input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={sortOrder}
          onChange={(e) => onSort(e.target.value)}
          className="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
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
    </div>
  );
};

export default StoryList;
