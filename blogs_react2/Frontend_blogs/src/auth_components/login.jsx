import { useState } from "react";
import axiosClient from "../axios";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { setCurrentUser, setUserToken } = useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ __html: "" });
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault();
    setError({ __html: "" });

    axiosClient
      .post("/login", { email, password })
      .then(({ data }) => {
        setCurrentUser(data.user);
        setUserToken(data.token);
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.data.error) {
            setError({ __html: error.response.data.error });
          } else if (error.response.data.message) {
            const finalErrors = Object.values(error.response.data.message).reduce(
              (accum, next) => [...accum, ...next],
              []
            );
            setError({ __html: finalErrors.join("<br>") });
          }
        }
        console.error(error);
      });
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-1000 "
      style={{ backgroundColor: "#e9ecef" , marginTop:"100px" , padding:"30px" }}
    >
      <div
        className="card border-0 shadow"
        style={{
          width: "400px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          className="card-header text-center"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "20px 0",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Welcome Back
        </div>
        <div className="card-body p-4">
          <h5
            className="text-center mb-4"
            style={{
              fontWeight: "600",
              color: "#343a40",
            }}
          >
            Login to Your Account
          </h5>
          {error.__html && (
            <div
              className="alert alert-danger text-center"
              dangerouslySetInnerHTML={error}
              style={{ marginBottom: "20px" }}
            ></div>
          )}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label
                htmlFor="email-address"
                className="form-label"
                style={{ fontWeight: "500", color: "#495057" }}
              >
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
                style={{
                  borderRadius: "8px",
                  padding: "10px",
                  borderColor: "#ced4da",
                }}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="password"
                className="form-label"
                style={{ fontWeight: "500", color: "#495057" }}
              >
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
                style={{
                  borderRadius: "8px",
                  padding: "10px",
                  borderColor: "#ced4da",
                }}
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="form-check-input"
                />
                <label
                  htmlFor="remember-me"
                  className="form-check-label"
                  style={{ fontWeight: "500", color: "#495057" }}
                >
                  Remember me
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                backgroundColor: "#007bff",
                borderColor: "#007bff",
                borderRadius: "8px",
                fontWeight: "600",
                padding: "10px",
              }}
            >
              Login
            </button>
          </form>
          <p
            className="text-center mt-4 mb-0"
            style={{
              fontSize: "14px",
              color: "#6c757d",
            }}
          >
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#007bff", fontWeight: "500" }}>
              Sign up here
            </Link>
          </p>
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
        </div>
      </div>
    </div>
  );
}
