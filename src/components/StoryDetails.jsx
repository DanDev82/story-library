import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FaPencilAlt, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';  // Add FaArrowLeft

const StoryDetails = ({ stories, isAuthorized, handleDelete, onEdit, user }) => {
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

  const formatContent = (content) => {
    if (!content) return null;
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
        <Link to="/" className="back-button">
          <FaArrowLeft />
        </Link>
      </div>
    );
  }

  const onEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await onEdit(story.id, editTitle, editContent);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating story:', error);
      alert('Error updating story');
    }
  };

  return (
    <div className="story-details">
      {console.log('Auth Debug:', { 
        userExists: !!user, 
        userEmail: user?.email,
        isAuthorized: isAuthorized,
        authorizedEmail: import.meta.env.VITE_AUTHORIZED_EMAIL 
      })}
      {isEditing ? (
        <form onSubmit={onEditSubmit} className="edit-form">  {/* Make sure this matches */}
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
          <h1>{story.title}</h1>
          <div className="story-content">
            {formatContent(story.content)}
          </div>
          {user && isAuthorized && (
            <div className="story-actions">
              <button 
                className="edit-button" 
                onClick={() => setIsEditing(true)}
                aria-label="Edit story"
              >
                <FaPencilAlt />
              </button>
              <button 
                className="delete-button" 
                onClick={() => handleDelete(story.id)}
                aria-label="Delete story"
              >
                <FaTrashAlt />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StoryDetails;