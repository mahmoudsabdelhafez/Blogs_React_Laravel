import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { getBlogs, getCatigories, fetchFavorites, toggleFavorite } from '../Services/API';
import { Link } from 'react-router-dom';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const userId = localStorage.getItem("USER_ID");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCatigories();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const filters = { category: selectedCategory };
        const fetchedBlogs = await getBlogs(filters);
        setBlogs(fetchedBlogs || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      try {
        const userFavorites = await fetchFavorites(userId);
        setFavorites(new Set(userFavorites));
      } catch (error) {
        console.error("Error fetching user favorites:", error);
      }
    };
    fetchUserFavorites();
  }, [userId]);

  const handleToggleFavorite = async (blogId) => {
    const isFavorite = favorites.has(blogId);
    try {
      await toggleFavorite(userId, blogId, isFavorite);
      setFavorites((prevFavorites) => {
        const updatedFavorites = new Set(prevFavorites);
        if (isFavorite) {
          updatedFavorites.delete(blogId);
        } else {
          updatedFavorites.add(blogId);
        }
        return updatedFavorites;
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = blogs.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(blogs.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (loading) {
    return (
      <div className="preloader" id="preloader">
        <div className="preloader-inner">
          <div className="spinner">
            <div className="dot1"></div>
            <div className="dot2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="blog-post-area section-margin">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <>
            <div className="row">
  {currentItems.map((blog) => (
    <div key={blog.id} className="col-lg-12 col-md-6 col-sm-12 mb-4">
      <div className="single-post-wrap style-box border  overflow-hidden ">
        <div className="thumb position-relative">
          <img
            className="card-img rounded-0 img-fluid"
            style={{
              height: "350px",
              width: "100%",
              objectFit: "cover",
            }}
            src={`${blog.image}`}
            alt={blog.title || "Blog Thumbnail"}
          />
          <i
            className={`fa fa-heart position-absolute`}
            style={{
              color: favorites.has(blog.id) ? "red" : "white",
              cursor: "pointer",
              fontSize: "24px",
              top: "10px",
              right: "10px",
              zIndex: 3,
              textShadow: "#000 1px 1px 4px", 
            }}
            onClick={() => handleToggleFavorite(blog.id)}
          />
        </div>

        <div className="details p-4 ">
          <div className="post-meta-single mb-3 d-flex align-items-left justify-content-start ">
            <div>
            <i className="fa fa-user me-2  " style={{color:'#097BED' , marginRight:6 , marginLeft:2}} />
            <span className="me-3" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" , color:'#696969' , fontSize:14 }}>
              {blog.user ? `${blog.user.name}` : "Anonymous"}
            </span>
            </div>
            <div className='mx-3'>
            <i className="fa fa-calendar me-2 mx-1" style={{color:'#097BED' , marginRight:6 , marginLeft:2}} />
            <span className="me-3" style={{ color:'#696969' , fontSize:14}}>
              {new Date(blog.created_at).toLocaleDateString()}
            </span>
            </div>
            <div className='mx-3'>
            <i className="fa fa-comments me-2 mx-1" style={{color:'#097BED' , marginRight:6 , marginLeft:2}}  />
            <span style={ {color:'#696969' , fontSize:14}}>
              Comments ({blog.comments ? blog.comments.length : "0"})
            </span>
            </div>
          </div>

          <h5 className="title mb-3" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" , textAlign:'left' }}>
            <Link to={`/blog/${blog.id}`} style={{ color: "#2d3e50", fontWeight: "bold" }}>
              {blog.title}
            </Link>
          </h5>

          <p className="mb-3" style={{ fontSize: "0.9rem", color: "#6c757d" ,textAlign:'left' }}>
            {blog.short_description ? blog.short_description : "Short description not available."}
          </p>
<div className='d-flex alignleft mb-3'>
          <Link to={`/blog/${blog.id}`} className="btn btn-blue" >Read More</Link>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination pagination-margin"}
                activeClassName={"active"}
              />
            </>
          </div>
          <div className="col-lg-4 sidebar-widgets" style={{ position: 'relative' }}>
            <div className="widget-wrap" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', position: 'sticky', left: '0', top: '0' }}>
              <div className="single-sidebar-widget post-category-widget" style={{ marginBottom: '30px' }}>
                <h4 className="single-sidebar-widget__title" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e2229', borderBottom: '2px solid #007BFF', paddingBottom: '10px' }}>
                  Category
                </h4>
                <ul className="cat-list mt-20" style={{ listStyle: 'none', padding: 0, color: '#555' }}>
                  <li>
                    <button onClick={() => handleCategoryClick('')} className="d-flex justify-content-between" style={{ textDecoration: 'none', color: '#1e2229', fontWeight: '500', transition: 'color 0.3s', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <p>All Articles</p>
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id} style={{ marginBottom: '10px' }}>
                      <button onClick={() => handleCategoryClick(category.id)} className="d-flex justify-content-between" style={{ textDecoration: 'none', color: '#1e2229', fontWeight: '500', transition: 'color 0.3s', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <p>{category.name}</p>
                        <p>{category.post_count}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
