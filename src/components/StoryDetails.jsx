import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const StoryDetails = ({ stories, isAuthorized, setStories }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const story = stories.find(s => s.id === parseInt(id));
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Update edit state when story changes
  useEffect(() => {
    if (story) {
      setEditTitle(story.title);
      setEditContent(story.content);
    }
  }, [story]);

  const handleEdit = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('stories')
        .update({ title: editTitle, content: editContent })
        .eq('id', story.id)
        .select();

      if (error) {
        alert('Error updating story');
      } else {
        // Update the stories state instead of reloading
        setStories(prevStories => 
          prevStories.map(s => 
            s.id === story.id ? { ...s, title: editTitle, content: editContent } : s
          )
        );
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating story');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        const { error } = await supabase
          .from('stories')
          .delete()
          .eq('id', story.id);

        if (error) {
          console.error('Delete error:', error);
          alert('Error deleting story');
        } else {
          // Update local state first
          setStories(prevStories => prevStories.filter(s => s.id !== story.id));
          // Then navigate
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting story');
      }
    }
  };

  const formatContent = (content) => {
    return content.split(/\n{2,}|\n/).map((paragraph, index) => (
      <p key={index} className="story-paragraph">
        {paragraph}
      </p>
    ));
  };

  if (!story) {
    return (
      <div className="story-details">
        <p>Story not found</p>
        <div className="back-link-container">
          <Link to="/" className="back-link">Back to stories</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="story-details">
      {isEditing ? (
        <form onSubmit={handleEdit} className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-title"
            required
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="edit-content"
            required
          />
          <div className="edit-buttons">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{story.title}</h1>
          <div className="story-content">
            {formatContent(story.content)}
          </div>
          {isAuthorized && (
            <div className="story-actions">
              <button onClick={() => setIsEditing(true)} className="edit-button">
                Edit Story
              </button>
              <button onClick={handleDelete} className="delete-button">
                Delete Story
              </button>
            </div>
          )}
        </>
      )}
      <div className="back-link-container">
        <Link to="/" className="back-link">Back to stories</Link>
      </div>
    </div>
  );
};

export default StoryDetails; 