import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { fetchFavorites, toggleFavorite, getCatigories, getBlogs } from "../Services/API";
import GetAnswerFromArticle from "./GetAnswerFromArticle";
import { useStateContext } from "../contexts/ContextProvider";

export default function BlogDetails() {
  const { id } = useParams(); // Blog ID
  const [blog, setBlog] = useState(null); // Blog details
  const [comments, setComments] = useState([]); // Blog comments
  const [newComment, setNewComment] = useState(""); // New comment input
  const [name, setName] = useState(""); // User's name for the comment
  const [email, setEmail] = useState(""); // Optional email
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const [isFavorite, setIsFavorite] = useState(false); // Track favorite status
  const [categories, setCategories] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]); // Blogs filtered by category
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category for filtering
  const { userToken, setUserToken , currentUser } = useStateContext(); 

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const filters = { categoryId: selectedCategory };
        const fetchedBlogs = await getBlogs(filters);
        setBlogs(fetchedBlogs || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedCategory]);



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCatigories();
        setCategories(categories);
        setError(null);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Cannot fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/blogs/${id}/comments`);
        setComments(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBlogDetails();
    fetchComments();
  }, [id]);

  useEffect(() => {
  
    const fetchFavoriteStatus = async () => {
      try {
        
        const favorites = await fetchFavorites(currentUser.id);
        setIsFavorite(favorites.has(parseInt(id)));
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [id]);

  const fetchFilteredBlogs = async () => {
    if (selectedCategory) {
      try {
        const response = await axios.get(`http://localhost:8000/api/blogs?category=${selectedCategory}`);
        setFilteredBlogs(response.data);
      } catch (error) {
        console.error("Error fetching filtered blogs:", error);
      }
    } else {
      setFilteredBlogs([]);
    }
  };

  useEffect(() => {
    fetchFilteredBlogs();
  }, [selectedCategory]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill in both your comment.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    if (!currentUser.id) {
      Swal.fire({
        title: 'Error',
        text: 'You must be logged in to comment.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
  
  
    const payload = { comment: newComment, userid: currentUser.id };

    setIsSubmitting(true); 
  
    axios
      .post(`http://localhost:8000/api/blogs/${id}/comments`, payload)
      .then((response) => {
        setComments((prev) => [...prev, response.data]);
        setNewComment("");
      })
      .catch((error) => {
        alert("Error submitting comment. Please try again later.");
        console.error("Error submitting comment:", error);
      })
      .finally(() => {
        setIsSubmitting(false); // Re-enable the submit button
      });
  };
  
  const handleToggleFavorite = async () => {
    try {
      const userId = currentUser.id
      await toggleFavorite(userId, parseInt(id), isFavorite);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      alert("Failed to update favorite status. Please try again.");
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  if (!blog) {
    return <div className="container">Loading...</div>;
  }

  return (
    <section className="blog-post-area section-margin">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="main_blog_details">
            <img
  className="img-fluid"
  style={{
    width: "750px",
    height: "500px",
    objectFit: "cover",
  }}
  src={blog.image}
  alt={blog.title}
/>

              <h4>{blog.title}</h4>
              <div className="user_details">
                <div className="float-left">{blog.category.name}</div>
                <div className="float-right mt-sm-0 mt-3">
                  <div className="media">
                    <div className="media-body">
                      <h5>{blog.user ? blog.user.name : "Unknown"}</h5>
                      <p>{new Date(blog.created_at).toLocaleString()}</p>
                    </div>
                    <div className="d-flex">
                      <i
                        className={`fa fa-heart`}
                        style={{
                          color: isFavorite ? "red" : "white",
                          cursor: "pointer",
                          marginLeft: "10px",
                          fontSize: "34px",
                          position: "absolute",
                          top: "30px",
                          right: "30px",
                          zIndex: 3,
                          textShadow: "#000 1px 1px 4px",
                        }}
                        onClick={handleToggleFavorite}
                      />
                      <img width={42} height={42} style={{borderRadius:50 }} src="/assets/img/user.jpg" alt="user" />
                    </div>
                  </div>
                </div>
              </div>
              <p style={{width:740}}>{blog.article}</p>

              {/* {isSummary && <div style={{ marginTop: "20px" }}><BlogSummarizer blogarticle={blog.article} /></div>} */}
              <GetAnswerFromArticle article={blog.article} />
            </div>

            <div className="comment-form mb-4 mt-3">
              <h4 className="mt-3">Leave a Comment</h4>
              <form onSubmit={handleCommentSubmit}>
                {/* <input type="text" className="form-control" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" className="form-control mt-2" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} /> */}
                <textarea className="form-control mt-2" rows="4" placeholder="Your Comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} required></textarea>
                <button type="submit" className="btn btn-primary mt-4 mb-4" >Submit</button>
              </form>
            </div>

            <div className="comments-area mt-4">
               <h4>{comments.length} Comments</h4>
                {comments.length === 0 ? ( <p>No comments yet. Be the first to comment!</p> ) :
                comments.map((comment) => (
                  <div className="comment-list" key={comment.id}>
                    <div className="single-comment justify-content-between" style={{ borderBottom: '1px solid #ced4da', padding: '10px 0' }}>
                      <div className="user" style={{ flex: '0 0 auto', marginRight: '15px' }}>
                        <h6 style={{ fontWeight: 'bold', color: '#007BFF' }}>
                          {comment.user?.name || "Anonymous"}
                        </h6>
                        <p style={{ fontSize: '12px', color: '#6c757d' }}>
                          {comment.created_at ? new Date(comment.created_at).toLocaleString() : "Unknown date"}
                        </p>
                      </div>
                      <div className="desc" style={{ flex: '1 1 auto' }}>
                        <p style={{ fontSize: '16px', color: '#495057' }}>{comment.comment || "No comment"}</p>
                      </div>
                    </div>
                  </div>
                ))};
                 </div>
          </div>

       
     
            <div className="col-lg-4 sidebar-widgets" style={{ position: 'relative' }}>
            <div className="widget-wrap" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)' ,position: 'sticky', left: '0', top: '0'  }}>
            <div className="single-sidebar-widget popular-post-widget">
            <h4 className="single-sidebar-widget__title" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e2229', borderBottom: '2px solid #007BFF', paddingBottom: '10px' }}>
                  Popular Posts
                </h4>
  <div className="popular-post-list">
  {loading ? <p>Loading...</p> : (
  blogs[0] && (
    <div className="single-post-list single-post-wrap style-white">
      <div className="thumb">
        
        <img className="card-img rounded-0" width={250} height={150} src={blogs[0].image} alt="" />
        <a className="tag-base tag-light-green" href="#">
                    {blogs[0].category.name}
                  </a>
        <ul className="thumb-info " style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
          <li>
          <li className='text-truncate' >
          <Link to={`/blog/${blogs[0].id}`} style={{color:'white'}}>
          {blogs[0].title || ""}
        </Link>
          </li>
          </li>
        </ul>
      </div>
   
    </div>
  )
)}

{loading ? <p>Loading...</p> : (
  blogs[1] && (
    <div className="single-post-list single-post-wrap style-white">
      <div className="thumb">
        <img className="card-img rounded-0" width={250} height={150} src={blogs[1].image} alt="" />
        <a className="tag-base tag-red" href="#">
                    {blogs[1].category.name}
                  </a>
        <ul className="thumb-info" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
          <li>
          <li className='text-truncate'>
          <Link to={`/blog/${blogs[1].id}`} style={{color:'white'}}>
          {blogs[1].title || ""}
        </Link>
          </li>
          </li>
        </ul>
      </div>
    
    </div>
  )
)}
      {loading ? <p>Loading...</p> : (
  blogs[2] && (
    <div className="single-post-list single-post-wrap style-white">
      <div className="thumb">
        <img className="card-img rounded-0" width={250} height={150} src={blogs[2].image} alt="" />
        <a className="tag-base tag-purple" href="#">
                    {blogs[2].category.name}
                  </a>
        <ul className="thumb-info" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
          <li>
          <li className='text-truncate'>
          <Link to={`/blog/${blogs[2].id}`} style={{color:'white'}}>
          {blogs[2].title || ""}
        </Link>
          </li>
          </li>
        </ul>
      </div>

    </div>
  )
)}
  {loading ? <p>Loading...</p> : (
  blogs[3] && (
    <div className="single-post-list single-post-wrap style-white">
      <div className="thumb">
      {/* <ul className="" style={{top:0 }}>
        <li >  <a className="tag-base tag-blue" href="#">
                    {blogs[3].category.name}
                  </a></li>
      </ul> */}
        <img className="card-img rounded-0" width={250} height={150} src={blogs[3].image} alt="" />
        <a className="tag-base tag-green" href="#">
                    {blogs[3].category.name}
                  </a>
        <ul className="thumb-info" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
          <li className='text-truncate'>
          <Link to={`/blog/${blogs[3].id}`} style={{color:'white'}}>
          {blogs[3].title || ""}
        </Link>
          </li>
        </ul>
      </div>
     
    </div>
  )
)}
  </div>
</div>

            </div>
          </div>
          </div>
          
        </div>
     
    </section>
  );
}
