import React, { useContext, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Helmet } from "react-helmet";
import axios from 'axios';


export default function Header() {
  const { userToken, setUserToken , currentUser  , setCurrentUser} = useStateContext(); 

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const logout = () => {
    setCurrentUser({ id: null, name: '', email: '' });
    setUserToken(null); 
  };

  const currentPath = location.pathname;

  const getPageTitle = () => {
    switch (true) {
      case currentPath === "/":
        return "Home";
      case currentPath === "/favorite":
        return "Favorites";
      case currentPath === "/articles":
        return "Articles";
      case currentPath === "/user":
        return "User Dashboard";
      case currentPath === "/contact":
        return "Contact";
      case currentPath === "/about":
        return "About Us";
      case currentPath.startsWith("/blog"):
        return "Articles";
      default:
        return "Page Not Found";
    }
  };
  

  // Function to handle input change and fetch results
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/search?query=${query}`
        );
        setSearchResults(response.data || []);
        console.log(response.data);
        setShowResults(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        setShowResults(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

  };

  // Function to hide search results when clicking outside or clearing input
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <>
 <Helmet>
        <title>{getPageTitle()}</title>
      </Helmet>
      {/* search popup start */}
      <div className="td-search-popup" id="td-search-popup">
        <form action="index.html" className="search-form">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search....."
            />
          </div>


          <button type="submit" className="submit-btn">
            <i className="fa fa-search" />
          </button>
        </form>
      </div>
      {/* search popup end */}
      <div className="body-overlay" id="body-overlay" />

      <Helmet>
        <title>{getPageTitle()}</title>
      </Helmet>

      {/* header start */}
      <div className="navbar-area">
        {/* navbar start */}
        <nav className="navbar navbar-expand-lg">
          <div className="container nav-container">
            <div className="responsive-mobile-menu">
            <div className="col-xl-6 col-lg-5 align-self-center">

  <div className="logo text-md-left text-center d-none d-lg-block">
    <a className="main-logo" href="index.html">
      <img src="/assets/img/logo.png" alt="Main Logo" />
    </a>
  </div>
</div>

<div className="logo d-lg-none text-center">
  <a className="main-logo" href="index.html">
    <img src="/assets/img/logo.png" alt="Responsive Logo" />
  </a>
</div>

              <button
                className="menu toggle-btn d-block d-lg-none"
                data-target="#nextpage_main_menu"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="icon-left" />
                <span className="icon-right" />
              </button>
            </div>
            <div className="nav-right-part nav-right-part-mobile">
              <a className="search header-search" href="#">
                <i className="fa fa-search" />
              </a>
            </div>
            <div className="collapse navbar-collapse" id="nextpage_main_menu">
              <ul className="navbar-nav menu-open">
                <li className="current-menu-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="current-menu-item">
                  <Link to="/articles">Articles</Link>
                </li>
                <li className="current-menu-item">
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li className="current-menu-item">
                  <Link to="/about">
                    About us
                  </Link>
                </li>

                {/* Conditionally render buttons based on userToken */}
   
              </ul>
            </div>
            <div className="nav-right-part nav-right-part-desktop mx-3" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="menu-search-inner ">
                <input
                  type="text"
                  placeholder="Search For"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowResults(true)}
                />
                <button type="submit" className="submit-btn">
                  <i className="fa fa-search" />
                </button>
                {showResults && (
                  <div
                    className="search-results"
                    style={{
                      position: "absolute",
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      maxWidth: "inherit",
                      maxHeight: "200px",
                      overflowY: "auto",
                      zIndex: 10,
                    }}
                  >
                    {searchQuery.length > 0 ? ( // Check if the user has typed at least one character
                      searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                          <div
                            key={index}
                            className="search-result-item"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "10px",
                              borderBottom: "1px solid #eee",
                              cursor: "pointer",
                            }}
                            onClick={clearSearch}
                          >
                            {/* Display Image */}
                            {result.image && (
                              <a href={`/blog/${result.id}`}>
                                <img
                                  src={result.image}
                                  alt={result.title || "No title"}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    marginRight: "10px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                  }}
                                />
                              </a>
                            )}
                            {/* Display Title */}
                            <a href={`/blog/${result.id}`}>
                              <span>{result.title || "No title"}</span>
                            </a>
                          </div>
                        ))
                      ) : (
                        <div className="search-no-results" style={{ padding: "10px" }}>
                          No results found.
                        </div>
                      )
                    ) : null /* Do not show anything if query is empty */}
                  </div>
                )}
              </div>
           
            </div>
            <ul className="navbar-nav menu-open">
              {!userToken ? (
                  <>
                    <li className="current-menu-item mx-3">
                      <Link to="/login"   style={{
    all: "unset", // Resets all default styles
    cursor: "pointer",
    color:'white' ,
    textDecoration: "none", // Ensures it still looks clickable
  }}>Login</Link>
                    </li>
                   
                  </>
                ) : (
                  <>
                 
                  <li className="current-menu-item">
  <Link to="/favorite">
    <i className="fa fa-heart" style={{ marginRight: "8px"  , color:"white"}}></i> 
  
  </Link>

  <Link to="/user">
    <i className="fa fa-user" style={{ marginRight: "8px"  , color:'white'}}></i> 

  </Link>
</li>
<li className="current-menu-item mx-3">
<button
  onClick={logout}
  style={{
    all: "unset", // Resets all default styles
    cursor: "pointer",
    color:'white' ,
    textDecoration: "none", // Ensures it still looks clickable
  }}
>
  Logout
</button>

                  </li>

                
                  </>
                )}
                  </ul>
          </div>
        </nav>
      </div>
       {location.pathname !== "/" && (
        <div
          className="breadcrumb-section"
          style={{ backgroundColor: "#E6F2FD", height: "100px" }}
        >
          <div className="container">
            <div className="breadcrumb-content">
              <h2>{getPageTitle()}</h2> {/* Dynamic title here */}
              <ul className="breadcrumb-list">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>{getPageTitle()}</li> {/* Display dynamic page title */}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
