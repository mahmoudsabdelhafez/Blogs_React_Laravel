import { deleteblog, getBlogsUser, getUserData } from '../../Services/Api';
import { useEffect, useState } from 'react';
import ProfileEdit from './ProfileEdit';
import ProfileCreateBlog from './ProfileCreateBlog';
import EditBlog from './EditBlog';
import { Link } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

export default function ProfileIndex() {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [errorBlog, setErrorBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isBlogEdit, setIsBlogEdit] = useState('');
  const [selectedBlog, setSelectedBlog] = useState('');
  const [showAll, setShowAll] = useState(false);
  const { currentUser } = useStateContext(); 

  // console.log(currentUser);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(currentUser);
        const userdata = await getUserData(currentUser.id);
        setUser(userdata);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to get user');
      }
    };
    fetchUser();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBlogEditClick = (blog) => {
    setSelectedBlog(blog);
    setIsBlogEdit(true);
  };

  const handleCreateClick = () => {
    setIsCreatingBlog(true);
  };

  useEffect(() => {
    const Blogs = async () => {
      try {
        const getblogs = await getBlogsUser(currentUser.id);
        setBlogs(getblogs);
        setErrorBlog(null);
      } catch (err) {
        console.error("Error:", err);
        setErrorBlog("Something went wrong");
      }
    };
    Blogs();
  }, []);

  const toggleShowAll = () => {
    setShowAll(prevShowAll => !prevShowAll);
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const displayedBlogs = showAll ? blogs : blogs.slice(0, 8);

  return (
    <div className="row py-5 px-col-4">
      <div className="col-md-3">
        <div className="shadow rounded o" style={{ padding: '20px', background: '#102950', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', color: '#fff', minHeight: '400px' }}>
          <div className="profile-head text-center" style={{ maxWidth: '100%', padding: '20px' }}>
            <img src="/assets/img/user.jpg" alt="User Avatar" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '3px solid #fff' }} />
            <h4 className="mt-0 mb-0" style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.5rem', margin: '10px 0' }}>
              {user ? user.name : 'Loading...'}
            </h4>
            <p className="small mb-2" style={{ color: '#ffbe00', marginTop: '10px', padding: '0 10px', fontSize: '1rem' ,textAlign:'left' }}>
              <i className="fas fa-envelope mr-2" style={{ color: '#ffbe00' }} />
              {user ? user.email : 'Loading email...'}
            </p>
            <p className="mb-4" style={{ color: 'white', marginBottom: '10px ', padding: '0 10px', fontSize: '1rem' ,textAlign:'left' }}>
              <i className="fas fa-map-marker-alt mr-2" style={{ color: 'white' ,textAlign:'left'}} />
              {user ? user.address : 'Loading address...'}
            </p>
            <br />
          </div>
          <div className="" style={{ marginTop: '20px' }}>
            <p className="" style={{ color: '#ffbe00' , marginTop: '6px' , textAlign:'left' , marginLeft:26 }}>About</p>
            <p className="" style={{ color: '#eee', marginTop: '2px', padding: '0 10px', fontSize: '1rem' ,textAlign:'left'  , marginLeft:26}}>
              {user ? user.about : 'Loading about section...'}
            </p>
          </div>
          <div className="blog-count ml-2" style={{ marginTop: '20px' }}>
            <span className="" style={{ color: '#ffbe00'  , marginLeft:20}}>Blog Count:</span>
            <span className="" style={{ color: '#eee', marginTop: '10px', padding: '0 10px', fontSize: '1.1rem', color: '#ffbe00'  , marginLeft:26}}>
              {user && user.blog_count > 0 ? user.blog_count : 'Loading...'}
            </span>
          </div>
          {/* Edit Profile Button */}
          <div className="text-center mt-3">
            <button onClick={handleEditClick} className="btn btn-warning btn-sm">Edit Your Profile</button>
          </div>
        </div>
      </div>

      <div className="col-md-9">
        <div className="bg-white shadow rounded overflow-hidden">
          <div className="px-4 pt-0 pb-4 cover" style={{ padding: '20px', background: '#f4f6f9', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            {isEditing ? (
              <ProfileEdit user={user} setIsEditing={setIsEditing} />
            ) : (
              <div className="bg-light p-4 d-flex justify-content-center text-center">

              </div>
            )}
          </div>

          <div className="py-4 px-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
            <h5
  className="mb-0"
  style={{
    fontSize: window.innerWidth < 768 ? '16px' : window.innerWidth < 992 ? '18px' : '20px',
  }}
>
  Recent Articles By You
</h5>


              <div>
                <button onClick={handleCreateClick} className="btn btn-outline-primary btn-sm mr-2">Create New Article</button>
                <a href="#" onClick={toggleShowAll} className="btn btn-link text-muted">{showAll ? 'Show Less' : 'Show All'}</a>
              </div>
            </div>
            {isBlogEdit ? (
              <EditBlog setIsBlogEdit={setIsBlogEdit} user={user} selectedBlog={selectedBlog} />
            ) : isCreatingBlog ? (
              <ProfileCreateBlog setIsCreatingBlog={setIsCreatingBlog} user={user} />
            ) : (
              <div className="row">
                {displayedBlogs.map((blog) => (
                  <div key={blog.id} className="col-lg-4 col-md-6 col-sm-12">
                    <div className="single-post-wrap style-box border rounded-lg overflow-hidden shadow-lg mb-4">
                      <div className="thumb">
                        <img className="card-img rounded-0 img-fluid" style={{ height: "180px", width: "100%", objectFit: "cover" }} src={`${blog.image}`} alt={blog.title || "Blog Thumbnail"} />
                      </div>
                      <div className="details p-3">
                        <div className="post-meta-single mb-3">
                          <ul className="list-unstyled">
                            <li><a className="tag-base tag-light-blue" href="#">{blog.category ? blog.category.name : "Uncategorized"}</a></li>
                            <li><i className="fa fa-user"></i> {user.name}</li>
                          </ul>
                        </div>
                        <h6 className="title" style={{ fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" , fontSize: "1rem" }}><Link to={`/blog/${blog.id}`}>{blog.title}</Link></h6>
                        <p style={{ fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                          {blog.short_description ? blog.short_description : "There is no description"}
                        </p>
                        <div className="d-flex">
                          <Link to={`/blog/${blog.id}`} className="btn btn-base mt-3 mx-1 btn-blue px-2">Read More</Link>
                          <button className="btn btn-base mt-3 mx-1 btn-blue px-2" onClick={() => handleBlogEditClick(blog)}>Edit Article</button>
                          <button
  type="button"
  className="btn btn-outline-danger mt-3 px-2"
  onClick={() => {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the blog deletion if confirmed
        deleteblog(blog.id)
          .then(() => {
            Swal.fire('Deleted!', 'Your blog has been deleted.', 'success');
          
          })
          .catch((error) => {
            Swal.fire('Error', 'There was a problem deleting the blog.', 'error');
          });
      }
    });
  }}
>
  Delete
</button>

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
