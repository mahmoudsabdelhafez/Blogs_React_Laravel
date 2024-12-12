import React, { useState } from "react";
import axios from "axios";

const ArticleHandler = ({ inputText, onExport }) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProcess = async () => {
    if (!inputText) {
      setError("No input text provided.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await axios.post("http://127.0.0.1:8000/api/handleArticleInput", { input: inputText });
      const output = result.data.output;
      setResponse(output);

      // Export the result using the callback function
      if (onExport) {
        onExport(output);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred while processing the input."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <button
        onClick={handleProcess}
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? "Processing..." : "Generate or Enhance by AI"}
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {/* {response && (
        <div className="mt-3">
          <h5>Generated Result:</h5>
          <p>{response}</p>
        </div>
      )} */}
    </div>
  );
};

export default ArticleHandler;
