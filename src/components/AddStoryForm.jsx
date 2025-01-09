import { useState } from "react";
import { supabase } from "../supabaseClient"; // Ensure this is correctly imported

const AddStoryForm = ({ setStories }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Both title and content are required!");
      return;
    }

    try {
      // Optimistically update the stories list
      const newStory = { title, content };
      setStories(prevStories => [...prevStories, newStory]);

      // Insert the story into the 'stories' table in Supabase
      const { data, error } = await supabase
        .from("stories")
        .insert([newStory]);

      if (error) {
        // Log the error message and details for debugging
        console.error("Error inserting story:", error.message);
        console.error("Supabase error details:", error);
        alert("There was an error adding your story.");
      } else {
        // Clear the form fields after successful insertion
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Error adding story:", error);
      alert("There was an error submitting your story.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Add a New Story</h2>
      <div>
        <label className="block text-lg font-medium" htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-lg font-medium" htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <button className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600" type="submit">Add Story</button>
    </form>
  );
};

export default AddStoryForm;
