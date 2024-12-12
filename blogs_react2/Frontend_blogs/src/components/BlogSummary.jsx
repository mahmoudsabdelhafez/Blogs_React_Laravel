import React, { useState } from "react";
import axios from "axios";

const BlogSummarizer = ({ blogarticle = "" }) => {
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const queryHuggingFace = async () => {
    const apiUrl = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
    const apiKey = "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"; // Replace with a secured method for storing keys.

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        apiUrl,
        { inputs: blogarticle },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOutputText(response.data[0]?.summary_text || "No summary found.");
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", marginTop: "10px" }}>
<button
  onClick={queryHuggingFace}
  disabled={loading}
  style={{
    backgroundColor: loading ? "#cccccc" : "#007BFF", // Gray when loading, blue otherwise
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: "16px",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  }}
>
  {loading ? "Summarizing..." : "Generate Summary"}
</button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {outputText && (
        <div style={{ marginTop: "20px" }}>
          <h3>Summary:</h3>
          <p>{outputText}</p>
        </div>
      )}
    </div>
  );
};

export default BlogSummarizer;
