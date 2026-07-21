import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import { useRef } from "react";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const passwordInput = useRef(null);

  const validateEmail = (email) => {
    const re = /^\w+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
    return re.test(email);
  };
  const checkPasswordStrength = (password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?`~]/.test(
      password
    );
    const length = password.length;
    let strength = 0;
    if (hasLowercase) strength++;
    if (hasUppercase) strength++;
    if (hasNumber) strength++;
    if (hasSpecialChar) strength++;
    if (length >= 8) strength++;

    switch (strength) {
      case 1:
        setPasswordStrength("Weak");
        break;
      case 2:
        setPasswordStrength("Medium");
        break;
      case 3:
      case 4:
        setPasswordStrength("Strong");
        break;
      case 5:
        setPasswordStrength("Very Strong");
        break;
      default:
        setPasswordStrength(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!value) {
      setErr("Please fill in all required fields.");
      return; 
    }

    if (name === "email" && !validateEmail(value)) {
      setErr("Please enter a valid email address.");
      return;
    }
    if (name === "password") {
      checkPasswordStrength(value); 
    }

    setInputs((prev) => ({ ...prev, [name]: value }));
    setErr(null);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!inputs.username || !inputs.email || !inputs.password || !inputs.name) {
      setErr("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(inputs.email)) {
      setErr("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      setSuccess("Registration successful!"); 
    } catch (err) {
      setErr(err.response.data);
      setSuccess(null); 
    } finally {
      setPasswordStrength(null);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Biker Club</h1>
          <p>
          Welcome to the hub of moto emotions! Register now and gain access to the largest 
          community of motorcycle enthusiasts. Discover the best motorcycle routes, meet new 
          friends, and share your adventures!
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Email (Required)" 
              name="email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              required
              ref={passwordInput}
            />
            {passwordStrength &&
              document.activeElement === passwordInput.current && (
                <div className="password-strength">
                  Password Strength: {passwordStrength}
                </div>
              )}
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
              required
            />
            {err && <div className="error">{err}</div>}
            {success && <div className="success">{success}</div>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
