import React, { useState } from "react";
import axios from "axios";

const BlogGenerator = ({ initialSubject = "", onBlogGenerated }) => {
  const [subject, setSubject] = useState(initialSubject);
  const [blog, setBlog] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateBlog = async () => {
    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    setError("");
    setLoading(true);
    setBlog("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/generateBlog", {
        subject: subject,
      });

      const generatedBlog = response.data.blog;
      setBlog(generatedBlog);

      // Trigger the callback to export the generated blog
      if (onBlogGenerated) {
        onBlogGenerated(generatedBlog);
      }
    } catch (err) {
      setError("Failed to generate article. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="subject" style={{ fontWeight: "bold" }}>
          Write a blog about:
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter an article subject..."
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <button
        onClick={handleGenerateBlog}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Article"}
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {blog && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p>{blog}</p>
        </div>
      )}
    </div>
  );
};

export default BlogGenerator;
