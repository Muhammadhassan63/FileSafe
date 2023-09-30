// SignIn.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sha512 } from "js-sha512";
import { username,userpassword } from "../credentials/credential";


function SignIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    const hashedName = sha512(name);
    const hashedPassword = sha512(password);


    if (hashedName === username && hashedPassword === userpassword) {
     localStorage.setItem("login", true);
        navigate("/dashboard");
   
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600 text-sm mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-600 text-sm mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
