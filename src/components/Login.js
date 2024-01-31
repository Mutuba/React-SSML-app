import React, { useState, useEffect } from "react";

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Simulate a successful login

    setIsLoggedIn(true);
  }, []);

  return (
    <div>{isLoggedIn ? <p>Welcome, User!</p> : <p>Please log in.</p>}</div>
  );
}

export default Login;
