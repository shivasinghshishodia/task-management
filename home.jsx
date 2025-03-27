import React from 'react';
import { Link } from 'react-location';


export default function Home() {
  return (
    <div className="container">
      <h1>Task Management App</h1>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/tasks">Tasks</Link>
      </nav>
    </div>
  );
}
