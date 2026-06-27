import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDataApi } from "../Contexts/DataAPI";

const SignUp = () => {
  const { signUp } = useDataApi();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically handle registration
      try {
        await signUp(formData);
      } catch (error) {
        console.log(error);

        if (error.toLowerCase().includes("username"))
          setErrors({ username: "Username already exists" });
        else if (error.toLowerCase().includes("email"))
          setErrors({ email: "Email already exists" });
        else setErrors({ general: "Registration failed" });
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
            <h1>Create Account</h1>
            <p>Join us and start managing your todos efficiently</p>
          </div>

          <form onSubmit={handleSubmit} className="custom-auth-form">
            <div className="custom-form-group">
              <label htmlFor="name">Full Name</label>
              <div className="custom-input-wrapper">
                <FaUser className="custom-input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={errors.name ? "error" : ""}
                />
              </div>
              {errors.username && (
                <span className="custom-error-message">{errors.username}</span>
              )}
            </div>

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
                  placeholder="Create a password"
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

            <div className="custom-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="custom-input-wrapper">
                <FaLock className="custom-input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? "error" : ""}
                />
                <button
                  type="button"
                  className="custom-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="custom-error-message">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className="custom-form-options">
              <label className="custom-terms-checkbox">
                <input type="checkbox" required />
                <span>
                  I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                  <Link to="/privacy">Privacy Policy</Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="custom-btn custom-btn-primary custom-btn-full"
            >
              Create Account
            </button>
            {errors.general && (
              <span className="custom-error-message">{errors.general}</span>
            )}
          </form>

          <div className="custom-auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/signin" className="custom-auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
