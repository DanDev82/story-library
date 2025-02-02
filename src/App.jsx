import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import StoryList from './components/StoryList';
import StoryDetails from './components/StoryDetails';
import DarkModeToggle from './components/DarkModeToggle';
import Login from './components/Login';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import AddStoryModal from './components/AddStoryModal';
import './index.css';
import './styles/stories.css';
import LogoutButton from './components/LogoutButton';

const AUTHORIZED_EMAIL = import.meta.env.VITE_AUTHORIZED_EMAIL;

const App = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        // Remove console.error
        alert('Error fetching stories');
      } else {
        setStories(data || []);
      }
    } catch (error) {
      // Remove console.error
      alert('Error fetching stories');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        console.log('Auth Check:', {
          userEmail: currentUser?.email,
          authorizedEmail: AUTHORIZED_EMAIL,
          match: currentUser?.email === AUTHORIZED_EMAIL
        });
        setIsAuthorized(currentUser?.email === AUTHORIZED_EMAIL);
  
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          const user = session?.user ?? null;
          setUser(user);
          setIsAuthorized(user?.email === AUTHORIZED_EMAIL);
        });
  
        return () => subscription.unsubscribe();
      } catch (error) {
        alert('Auth error');
      }
    };

    initAuth();
    fetchStories();
  }, []);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const handleDelete = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        const { error } = await supabase
          .from('stories')
          .delete()
          .eq('id', storyId);

        if (error) {
          // Remove console.error
          alert('Error deleting story');
        } else {
          await fetchStories();
          navigate('/', { replace: true });
        }
      } catch (error) {
        // Remove console.error
        alert('Error deleting story');
      }
    }
  };

  const handleEdit = async (storyId, editedTitle, editedContent) => {
    try {
      const numericId = parseInt(storyId, 10);
      const { error } = await supabase
        .from('stories')
        .update([{
          id: numericId,
          title: editedTitle,
          content: editedContent
        }])
        .eq('id', numericId);
  
      if (error) throw error;
  
      setStories(prevStories =>
        prevStories.map(story =>
          story.id === numericId
            ? { ...story, title: editedTitle, content: editedContent }
            : story
        )
      );
  
      return true;
    } catch (error) {
      // Remove console.error
      alert('Error updating story');
      return false;
    }
  };

  const handleSort = (order) => {
    setSortOrder(order);
    const sortedStories = [...stories].sort((a, b) => {
      if (order === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
    setStories(sortedStories);
  };

  const addStory = async (e) => {
    e.preventDefault();
    
    if (!newTitle || !newContent) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      const { error } = await supabase
        .from('stories')
        .insert([{ title: newTitle, content: newContent }])
        .select();

      if (error) {
        throw error;
      }

      await fetchStories();
      setNewTitle('');
      setNewContent('');
      setIsModalOpen(false);
    } catch (error) {
      // Remove console.error
      alert('Error adding story');
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header-controls">
        <div className="left-controls">
          <Routes>
            <Route path="/story/:id" element={
              <Link to="/" className="back-button">
                <FaArrowLeft />
              </Link>
            } />
          </Routes>
        </div>
        <div className="right-controls">
          {user && isAuthorized && (
            <button className="add-button" onClick={() => setIsModalOpen(true)}>
              <FaPlus />
            </button>
          )}
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          {user && <LogoutButton />}
        </div>
      </div>
      
      {!user ? (
        <Login />
      ) : (
        <>
          <AddStoryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newContent={newContent}
            setNewContent={setNewContent}
            addStory={addStory}
          />
          
          <Routes>
            <Route 
              path="/" 
              element={
                <StoryList 
                  stories={stories}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  isAuthorized={isAuthorized}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              } 
            />
            <Route 
              path="/story/:id" 
              element={
                <StoryDetails 
                  stories={stories} 
                  isAuthorized={isAuthorized}
                  user={user}
                  handleDelete={handleDelete}
                  onEdit={handleEdit}
                />
              } 
            />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;