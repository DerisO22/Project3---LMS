import { useState } from "react";
import "../App.css";

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });

    if (res.ok) onLogin();
    else alert("Invalid credentials");
  };

  return (
    <>
      <div className="notLoggedInContainer">
        <div className="header1">You're Not Logged in!</div>
        <div className="header2">Log in to Manage Courses</div>

        <form className="loginForm" onSubmit={handleSubmit}>
          <input
            className="formInput"
            placeholder="User ID"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            className="formInput"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="loginButton" id="loginButton" type="submit">
            Login
          </button>
        </form>
      </div>
    </>
  );
}
