import React, { useState } from 'react';
import axios from 'axios';

const GetAnswerFromArticle = ({ article: initialArticle = '', question: initialQuestion = '' }) => {
  const [article, setArticle] = useState(initialArticle);
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add a loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true); // Start loading

    try {
      setError('');
      setAnswer(''); // Clear previous answer
      const response = await axios.post('http://127.0.0.1:8000/api/getAnswerFromArticle', {
        article,
        question,
      });
      setAnswer(response.data.answer);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch answer. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleSummarize = async () => {
    setIsLoading(true); // Start loading

    try {
      setError('');
      setAnswer(''); // Clear previous answer
      const response = await axios.post('http://127.0.0.1:8000/api/getAnswerFromArticle', {
        article,
        question: 'summarize', // Sending 'summarize' as the fixed question
      });
      setAnswer(response.data.answer);
    } catch (err) {
      console.error(err);
      setError('Failed to summarize. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      {/* Show Form and Summarize Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleSummarize}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FFC107',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Summarize
        </button>
        <span style={{ fontSize: '16px', color: '#555', margin: '10px' }}>Or</span>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {isFormVisible ? 'Hide' : 'Ask Article'}
        </button>
        <span style={{ fontSize: '14px', color: '#777', fontStyle: 'italic', padding: "10px" }}>Powered by AI</span>
      </div>

      {/* Form Section (Visible when the form button is clicked) */}
      {isFormVisible && (
        <div style={{ marginTop: '20px' }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <input
              id="question"
              type="text"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28A745',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && <div style={{ color: '#007BFF', marginTop: '10px' }}>Loading...</div>}

      {/* Response Section */}
      {(answer || error) && (
        <div style={{ marginTop: '20px' }}>
          {answer && <div style={{ color: 'green' }}><strong>Answer:</strong> {answer}</div>}
          {error && <div style={{ color: 'red' }}><strong>Error:</strong> {error}</div>}
        </div>
      )}
    </div>
  );
};

export default GetAnswerFromArticle;
