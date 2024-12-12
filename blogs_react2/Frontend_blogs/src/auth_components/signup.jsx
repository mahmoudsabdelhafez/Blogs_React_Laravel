import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosClient from '../axios.js';
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Signup() {
  const { setCurrentUser, setUserToken } = useStateContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState({ __html: "" });
  const navigate = useNavigate(); // Initialize navigate

  const onSubmit = (ev) => {
    ev.preventDefault();
    setError({ __html: "" }); // Clear previous errors
  
    axiosClient
      .post("/signup", {
        name: fullName,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      .then(({ data }) => {
        setCurrentUser(data.user); // Store user data
        setUserToken(data.token); // Store authentication token
        navigate("/login"); // Redirect to the homepage
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            // Validation errors
            const validationErrors = Object.values(error.response.data.errors || {}).reduce(
              (accum, next) => [...accum, ...next],
              []
            );
            setError({ __html: validationErrors.join("<br>") });
          } else if (error.response.status === 500) {
            // General server error
            setError({ __html: error.response.data.error || "Internal Server Error. Please try again later." });
          } else {
            setError({ __html: error.response.data.error || "Something went wrong. Please try again." });
          }
        } else {
          setError({ __html: "Unable to connect to the server. Please check your network." });
        }
        console.error(error);
      });
  };
  

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg border-0" style={{ width: "400px" }}>
        <div className="card-body p-4">
          <h2 className="text-center fs-4 fw-bold text-dark">Signup for NextPage</h2>
          <p className="text-center fs-6 text-muted">
            Or{" "}
            <Link
              to="/login"
              className="fw-medium text-primary text-decoration-none"
            >
              Login with your account
            </Link>
          </p>

          {error.__html && (
            <div
              className="alert alert-danger text-center"
              dangerouslySetInnerHTML={error}
            ></div>
          )}

          <form onSubmit={onSubmit} className="mt-4">
            {/* Full Name Field */}
            <div className="mb-3">
              <label htmlFor="full-name" className="form-label">
                Full Name
              </label>
              <input
                id="full-name"
                name="name"
                type="text"
                required
                value={fullName}
                onChange={(ev) => setFullName(ev.target.value)}
                className="form-control"
               
              />
            </div>

     
            {/* Email Address Field */}
            <div className="mb-3">
              <label htmlFor="email-address" className="form-label">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className="form-control"
              
              />
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="form-control"
               
              />
            </div>

            {/* Password Confirmation Field */}
            <div className="mb-3">
              <label htmlFor="password-confirmation" className="form-label">
                Password Confirmation
              </label>
              <input
                id="password-confirmation"
                name="password_confirmation"
                type="password"
                required
                value={passwordConfirmation}
                onChange={(ev) => setPasswordConfirmation(ev.target.value)}
                className="form-control"
             
              />
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
              >
                Signup
              </button>
            </div>
            <p
            className="text-center mt-4 mb-0"
            style={{
              fontSize: "14px",
              color: "#6c757d",
              textAlign:"center"
            }}
          >
            {" "}
            <Link to="/" style={{ color: "#007bff", fontWeight: "500" }}>
             Back to home
            </Link>
          </p>
          </form>
        </div>
      </div>
    </div>
  );
}
