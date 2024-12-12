import { useState, useEffect } from "react";
import { getCatigories, updateBlog } from "../../Services/Api";
import { useStateContext } from "../../contexts/ContextProvider";

export default function EditBlog({ setIsBlogEdit, selectedBlog }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const [blogDetails, setBlogDetails] = useState({
    id: selectedBlog?.id || "",
    title: selectedBlog?.title || "",
    article: selectedBlog?.article || "",
    category_id: selectedBlog?.category_id || "",
    image: selectedBlog?.image || "", // It will now be a URL
  });

  const [categories, setCategories] = useState([]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      // Instead of handling file upload, we'll set the image URL here
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setBlogDetails((prev) => ({
          ...prev,
          image: event.target.result, // Store the image URL
        }));
      };
      reader.readAsDataURL(file); // Convert file to URL for preview
    }
  };



  const handelEdit = async (e) => {
    e.preventDefault();
  

    try {
      const response = await updateBlog(blogDetails.id, blogDetails); // Make sure the API expects FormData
      if (response) {
        setIsBlogEdit(false);
        setSuccess("Updated successfully");
        setError(null);
      }
    } catch (err) {
      console.error("Error while updating the blog:", err);  // Log error for debugging
      setError(err.message || "Something went wrong");
      setSuccess(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="col-md-10 mx-auto">
        <div className="bg-white shadow rounded overflow-hidden">
          {/* Form to edit a blog */}
          <div className="px-4 py-3">
            <h5 className="mb-4">Edit Blog</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form encType="multipart/form-data" onSubmit={handelEdit}>
              {/* Title */}
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  value={blogDetails.title} // Pre-filled value
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Article Content */}
              <div className="form-group">
                <label htmlFor="article">Article</label>
                <textarea
                  id="article"
                  name="article"
                  className="form-control"
                  value={blogDetails.article} // Pre-filled value
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category_id">Category</label>
                <select
                  id="category_id"
                  name="category_id"
                  className="form-control"
                  value={blogDetails.category_id} // Pre-filled value
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

              {/* Image URL or File Upload */}
              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  className="form-control"
                  value={blogDetails.image} // Pre-filled value
                  onChange={handleInputChange} // Handle URL input change
                  placeholder="Enter image URL"
                />
                {blogDetails.image && (
                  <div className="mt-2">
                    <img
                      src={blogDetails.image} // Display image preview from URL
                      alt="Blog"
                      className="img-thumbnail"
                      style={{ maxWidth: "200px", height: "auto" }}
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary">
                Update Blog
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
