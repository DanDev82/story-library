import React from 'react';
import { supabase } from '../supabaseClient';

const LogoutButton = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    // Clear local storage
    localStorage.removeItem('supabase.auth.token');
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default LogoutButton; 