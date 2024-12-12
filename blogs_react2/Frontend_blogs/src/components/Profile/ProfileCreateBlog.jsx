import { useState, useEffect } from "react";
import { getCatigories, createBlog } from "../../Services/Api";
import axios from "axios";

import ArticleHandler from "../ArticleHandler";

import { useStateContext } from "../../contexts/ContextProvider";

export default function ProfileCreateBlog({ setIsCreatingBlog }) {
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    article: "",
    category_id: "",
    image: "",
    short_description: "",
  });
  const { userToken, setUserToken, currentUser } = useStateContext();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [exportedData, setExportedData] = useState("");

  const handleExport = (data) => {
    console.log("Exported Data:", data);
    setExportedData(data);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCatigories();
        setCategories(categories);
        setError(null);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Cannot fetch categories.");
        setSuccess(null);
      }
    };
    fetchCategories();
  }, []);

  // Use exportedData to update blogDetails.article once
  useEffect(() => {
    if (exportedData) {
      setBlogDetails((prev) => ({ ...prev, article: exportedData }));
      setExportedData(""); // Clear exported data after updating
    }
  }, [exportedData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateImage = async () => {
    if (!blogDetails.article) {
      setError("Please write an article before generating an image.");
      return;
    }

    setLoadingImage(true);
    setError(null);

    try {
      const apiUrl = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

      const apiKey = ""; 


      const response = await axios.post(
        apiUrl,
        { inputs: blogDetails.article }, // Pass the article as the prompt
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const imageBlob = new Blob([response.data]);
      const imageUrl = URL.createObjectURL(imageBlob); // Generate a temporary URL for the session
      setBlogDetails((prev) => ({ ...prev, image: imageUrl })); // Set the generated image URL
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", blogDetails.title);
      formData.append("article", blogDetails.article);
      formData.append("category_id", blogDetails.category_id);
      formData.append("short_description", blogDetails.short_description);

      if (blogDetails.image) {
        formData.append("image", blogDetails.image);
      }

      const response = await createBlog(currentUser.id ,formData); 

      if (response) {
        setSuccess("Blog created successfully.");
        setError(null);
        setIsCreatingBlog(false);
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      setError("Error saving the blog. Please check your input.");
      setSuccess(null);
    }
  };

  // Cancel button handler
  const handleCancel = () => {
    setIsCreatingBlog(false); // This will close the blog creation form
  };

  return (
    <div className="container py-5">
      <div className="col-md-10 mx-auto">
        <div className="bg-white shadow rounded overflow-hidden">
          <div className="px-4 py-3">
            <h5 className="mb-4">Create Article</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  value={blogDetails.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="article">Article</label>
                <textarea
                  id="article"
                  name="article"
                  className="form-control"
                  value={blogDetails.article}
                  onChange={handleInputChange}
                  required
                  style={{
                    minHeight: "250px"
                  }}
                />
                <ArticleHandler
                  inputText={blogDetails.article}
                  onExport={handleExport}
                />
              </div>

              <div className="form-group">
                <label htmlFor="short_description">Short Description</label>
                <textarea
                  id="short_description"
                  name="short_description"
                  className="form-control"
                  value={blogDetails.short_description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category_id">Category</label>
                <select
                  id="category_id"
                  name="category_id"
                  className="form-control"
                  value={blogDetails.category_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  className="form-control"
                  value={blogDetails.image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL or use 'Generate Image'"
                />
                {blogDetails.image && (
                  <div className="mt-2">
                    <img
                      src={blogDetails.image}
                      alt="Blog"
                      className="img-thumbnail"
                      style={{ maxWidth: "200px", height: "auto" }}
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn btn-warning mx-2"
                onClick={generateImage}
                disabled={loadingImage}
              >
                {loadingImage ? "Generating Image..." : "Generate Image"}
              </button>

              <button type="submit" className="btn btn-primary">
                Create Blog
              </button>

              <button
                type="button"
                className="btn btn-secondary mx-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
