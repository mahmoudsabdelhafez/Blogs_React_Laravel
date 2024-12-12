import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { getBlogs, getCatigories, fetchFavorites, toggleFavorite } from '../Services/Api';
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

export default function FavoritePage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const { userToken, setUserToken , currentUser } = useStateContext();  // Replace with the actual logged-in user ID

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCatigories();
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch blogs based on filters
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const filters = { categoryId: selectedCategory, dateRange };
        const fetchedBlogs = await getBlogs(filters);
        setBlogs(fetchedBlogs || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedCategory, dateRange]);

  // Fetch user's favorite blogs on mount
  useEffect(() => {
    const fetchUserFavorites = async () => {
      try {
        const userFavorites = await fetchFavorites(currentUser.id);
        setFavorites(new Set(userFavorites)); // Ensure it's a Set
      } catch (error) {
        console.error('Error fetching user favorites:', error);
      }
    };
    fetchUserFavorites();
  }, [currentUser.id]);

  // Handle toggling of favorite blogs
  const handleToggleFavorite = async (blogId) => {
    const isFavorite = favorites.has(blogId);
    try {
      await toggleFavorite(currentUser.id, blogId, isFavorite);
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
      console.error('Error toggling favorite:', error);
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = blogs.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(favorites.size / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <section className="blog-post-area section-margin">
      <div className="container">
        <div className="row">
          {/* Main content */}
          <div className="col-lg-8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="row">
                {currentItems.length > 0 ? (
                  currentItems
                    .filter((blog) => favorites.has(blog.id)) 
                    .map((blog) => (
                      <div key={blog.id} className="col-lg-6 col-md-6 col-sm-12 mb-4">
                        <div className="single-post-wrap style-box border rounded-lg overflow-hidden shadow-lg">
                          <div className="thumb">
                            <img
                              className="card-img rounded-0 img-fluid"
                              style={{
                                height: '250px',
                                width: '100%',
                                objectFit: 'cover',
                              }}
                              src={`${blog.image}`}
                              alt={blog.title || 'Blog Thumbnail'}
                            />
                            <i
                              className={`fa fa-heart`}
                              style={{
                                color: favorites.has(blog.id) ? 'red' : 'white',
                                cursor: 'pointer',
                                marginLeft: '10px',
                                fontSize: '24px',
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                zIndex: 3,
                              }}
                              onClick={() => handleToggleFavorite(blog.id)}
                            />
                          </div>

                          <div className="details p-4">
                            <div className="post-meta-single mb-3">
                              <ul className="d-flex list-unstyled">
                                <li className="me-3">
                                  <i className="fa fa-user" />
                                  {blog.user
                                    ? `${blog.user.name}`
                                    : 'Anonymous'}
                                </li>
                                <li className="me-3">
                                  <i className="fa fa-calendar" />
                                  {new Date(blog.created_at).toLocaleDateString()}
                                </li>
                                <li>
                                  <i className="fa fa-comments" />
                                  Comments ({blog.comments ? blog.comments.length : '0'})
                                </li>
                              </ul>
                            </div>
                            <h5
                              className="title mb-3"
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '100%',
                              }}
                            >
                              <Link
                                to={`/blog/${blog.id}`}
                                style={{ color: '#2d3e50', fontWeight: 'bold' }}
                              >
                                {blog.title}
                              </Link>
                            </h5>
                            <p
                              className="mb-3"
                              style={{ fontSize: '0.9rem', color: '#6c757d' }}
                            >
                              {blog.short_description || 'Short description not available.'}
                            </p>
                            <Link to={`/blog/${blog.id}`} className="btn btn-blue me-2">
                              Read More
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No blogs found.</p>
                )}
              </div>
            )}
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
          </div>

          {/* Sidebar */}
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
