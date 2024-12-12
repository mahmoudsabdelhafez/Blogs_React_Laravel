import React from "react";
import { Link } from "react-router-dom";

export default function BannerArea({ data, favorites, toggleFavorite }) {
  const bannerBlogs = data.map((blog) => (
    <div className="row" key={blog.id}>
      <div className="col-lg-6">
        <div className="thumb after-left-top">
          <img  className="main-img"
            src={blog.image}
            alt="img"
            style={{
              height: "400px",
              width: "900px",
              transform: "translate(20px, 20px)",
              position: "relative",
              borderRadius: "8px",
            }}
          />
          <i
            className={`fa fa-heart`}
            style={{
              color: favorites.has(blog.id) ? "red" : "white",
              cursor: "pointer",
              marginLeft: "10px",
              fontSize: "24px",
              position: "absolute",
              top: "40px",
              right: "20px",
              zIndex: 3,
              textShadow: "#000 1px 1px 4px",
            }}
            onClick={() => toggleFavorite(blog.id)}
          />
        </div>
      </div>
      <div className="col-lg-6 align-self-center">
        <div className="banner-details mt-4 mt-lg-0">
          <div className="post-meta-single">
            <ul>
              <li>
                <a className="tag-base"
                  style={{
                    fontSize:14,
                    backgroundColor: "#ffbe00",
                    borderRadius: "4px",
                    color: "black",
                  }}
                >
                  {blog.category.name}
                </a>
              </li>
              <li className="date">
                <i className="fa fa-clock-o" />
                {new Date(blog.created_at).toLocaleDateString()}
              </li>
            </ul>
          </div>
          <h2>{blog.title}</h2>
          <p>{blog.short_description}</p>
          <Link to={`/blog/${blog.id}`} className="btn btn-base">
            Read More
          </Link>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="banner-area banner-inner-1 bg-black" id="banner">
      <div className="banner-inner pt-5">
        <div className="container">{bannerBlogs[0]}</div>
      </div>
      <div className="container">
        <div className="row">
          {data.slice(1, 5).map((blog) => (
            <div className="col-lg-3 col-sm-6" key={blog.id}>
              <div className="single-post-wrap style-white">
                <div className="thumb">
                  <img
                    src={blog.image}
                    alt="img"
                    style={{ height: "200px", width: "450px" }}
                  />
                  <i
                    className={`fa fa-heart`}
                    style={{
                      color: favorites.has(blog.id) ? "red" : "white",
                      cursor: "pointer",
                      marginLeft: "10px",
                      fontSize: "24px",
                      position: "absolute",
                      top: "20px",
                      right: "10px",
                      zIndex: 3,
                      textShadow: "#000 1px 1px 4px",
                    }}
                    onClick={() => toggleFavorite(blog.id)}
                  />
                  <a className="tag-base" href="#" style={{
                    backgroundColor: "#ffbe00",
                    borderRadius: "4px",
                  }}>
                    {blog.category.name}
                  </a>
                </div>
                <div className="details">
                  <h6 className="title">
                    <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                  </h6>
                  <div className="post-meta-single mt-3">
                    <ul>
                      <li>
                        <i className="fa fa-clock-o" />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
