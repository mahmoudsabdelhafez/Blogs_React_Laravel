import React from "react";
import { Link } from "react-router-dom";

export default function PostGrid({ grid, favorites, toggleFavorite}) {
  const gridBlogs = grid.map(function (blog) {
    return (
      <div className="col-lg-3 col-sm-6" key={blog.id}>
        
      <div className="single-post-wrap style-overlay">
      
        <div className="thumb">
          <img src={blog.image} alt="img" style={{height: "266px", width: "100%"}}
          className="img-fluid"/>
          <i
                    className={`fa fa-heart`}
                    style={{
                      color: favorites.has(blog.id) ? "red" : "white",
                      cursor: "pointer",
                      marginLeft: "10px",
                      fontSize: "24px",
                      position: "absolute",
                      top:"20px",
                      right:"10px",
                      zIndex:3,
                      textShadow: "#000 1px 1px 4px"

                    }}
                    onClick={() => toggleFavorite(blog.id)}
                  />
          <a className="tag-base tag-purple" href="#">{blog.category.name}</a>
        </div>
        <div className="details">
          <div className="post-meta-single">
            <p>
              <i className="fa fa-clock-o" />
              {new Date(blog.created_at).toLocaleDateString()}            </p>
          </div>
          <h6 className="title">
            <Link to={`/blog/${blog.id}`}>
              <a href="#">{blog.title}</a>
            </Link>
          </h6>
        </div>
      </div>
    </div>
    );
  });

  return (
    <div className="pd-top-80 pd-bottom-50" id="grid">
      
      <div className="container">
      <div className="col-md-3 mb-4 mb-md-0">
              <h5 className="title">Latest Articles</h5>
            </div>
        <div className="row mt-3">{gridBlogs}</div>
      </div>
    </div>
  );
}
