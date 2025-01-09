import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import StoryList from './components/StoryList';
import StoryDetails from './components/StoryDetails';
import DarkModeToggle from './components/DarkModeToggle';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import './styles/stories.css';
import LogoutButton from './components/LogoutButton';

const AUTHORIZED_EMAIL = 'ifdanthencool@gmail.com'; // Fixed the email address

const App = () => {
  const [stories, setStories] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  // Handle auth state
  useEffect(() => {
    // Set up initial auth state
    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth error:', error);
      }
    };

    initAuth();
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

  // Fetch stories from Supabase
  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase.from('stories').select('*');
      if (error) {
        console.error('Error fetching stories:', error);
      } else {
        setStories(data);
      }
    };

    fetchStories();
  }, []);

  // Add a new story
  const addStory = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    if (!newTitle || !newContent) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('stories')
        .insert([{ title: newTitle, content: newContent }])
        .select(); // Add this to get the inserted data back

      if (error) {
        console.error('Error adding story:', error);
        alert('Error adding story');
      } else {
        // Add the new story to the list
        setStories(prevStories => [...prevStories, ...data]);
        // Clear the form
        setNewTitle('');
        setNewContent('');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding story');
    }
  };

  const isAuthorized = user?.email === AUTHORIZED_EMAIL;
  console.log('Is authorized:', isAuthorized, 'User email:', user?.email); // Debug log

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      {user && <LogoutButton />}
      <Routes>
        <Route 
          path="/" 
          element={
            <StoryList 
              stories={stories}
              addStory={addStory}
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              newContent={newContent}
              setNewContent={setNewContent}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isAuthorized={isAuthorized}
            />
          } 
        />
        <Route 
          path="/story/:id" 
          element={
            <StoryDetails 
              stories={stories} 
              isAuthorized={isAuthorized} 
              setStories={setStories} 
            />
          } 
        />
      </Routes>
      {!user && <Login />}
    </div>
  );
};

export default App;