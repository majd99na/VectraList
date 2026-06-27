import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDataApi } from "../Contexts/DataAPI";

const SignIn = () => {
  const { logIn } = useDataApi();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically handle authentication
      console.log("Sign in attempt:", formData);
      try {
        await logIn(formData);
      } catch (error) {
        console.log(error);

        if (error.includes("password"))
          setErrors((prev) => ({ ...prev, password: error }));
        else setErrors((prev) => ({ ...prev, email: error }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="custom-auth-page">
      <div className="custom-auth-container">
        <div className="custom-auth-card">
          <div className="custom-auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue managing your todos</p>
          </div>

          <form onSubmit={handleSubmit} className="custom-auth-form">
            <div className="custom-form-group">
              <label htmlFor="email">Email Address</label>
              <div className="custom-input-wrapper">
                <FaEnvelope className="custom-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={errors.email ? "error" : ""}
                />
              </div>
              {errors.email && (
                <span className="custom-error-message">{errors.email}</span>
              )}
            </div>

            <div className="custom-form-group">
              <label htmlFor="password">Password</label>
              <div className="custom-input-wrapper">
                <FaLock className="custom-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="custom-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <span className="custom-error-message">{errors.password}</span>
              )}
            </div>

            <div className="custom-form-options">
              <label className="custom-remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="custom-forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="custom-btn custom-btn-primary custom-btn-full"
            >
              Sign In
            </button>
          </form>

          <div className="custom-auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="custom-auth-link">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
