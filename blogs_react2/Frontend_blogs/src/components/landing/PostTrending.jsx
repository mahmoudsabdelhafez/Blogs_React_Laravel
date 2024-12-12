import React from "react";
import { Link } from "react-router-dom";

export default function PostTrending({ trends, latest,  data, favorites, toggleFavorite }) {

  const trendings = trends.map(function (trend) {
    return (
      <div className="col-lg-3 col-sm-6" key={trend.id}>
        <div className="single-post-wrap">
          <div className="thumb">
            <img src={trend.image} alt="img" style={{height: "245px", width: "100%"}}/>
            <i
            className={`fa fa-heart`}
            style={{
              color: favorites.has(trend.id) ? "red" : "white",
              cursor: "pointer",
              marginLeft: "10px",
              fontSize: "24px",
              position: "absolute",
              top:"20px",
              right:"10px",
              textShadow: "#000 1px 1px 4px"

            }}
            onClick={() => toggleFavorite(trend.id)}
          />
            <a className="tag-base tag-light-green">{trend.category.name}</a>
          </div>
          <div className="details">
            <div className="post-meta-single mb-3">
              <ul>
                <li>
                  <i className="fa fa-clock-o" />
                  {new Date(trend.created_at).toLocaleDateString()}
                </li>
              </ul>
            </div>
            <h6>
              <Link to={`/blog/${trend.id}`}>
              <a
    href="#"
    className="text-truncate"
    style={{
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "block",
    }}
  >
    {trend.title}
  </a>


              </Link>
            </h6>
            <p    style={{
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "block",
    }}>{trend.short_description}</p>
          </div>
        </div>
      </div>
    );
  });



  const latests = latest.map(function (blog) {
    return (
      <div className="single-post-list-wrap" key={blog.id}>
      <div className="media">
        <div className="media-left">
          <img src="/assets/img/post/list/1.png" alt="img" />
        </div>
        <div className="media-body">
          <div className="details">
            <div className="post-meta-single">
              <ul>
                <li>
                  <i className="fa fa-clock-o" />
                  {blog.created_at}
                </li>
              </ul>
            </div>
            <h6 className="title">
              
              <a href="#">
                <Link to={`/blog/${blog.id}`}>
                <a href="#" className="text-truncate" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
  {blog.title}
</a>

                </Link>
              </a>
            </h6>
          </div>
        </div>
      </div>
    </div>
    );
  });



  return (
    <div className="tranding-area pd-top-75 pd-bottom-50">
      <div className="container">
        <div className="section-title">
          <div className="row">
            <div className="col-md-3 mb-2 mb-md-0">
              <h6 className="title">Trending Articles</h6>
            </div>
          </div>
        </div>
        <div className="tab-content" id="enx1-content">
          <div
            className="tab-pane fade show active"
            id="enx1-tabs-1"
            role="tabpanel"
          >
            <div className="row">
              {trendings}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
