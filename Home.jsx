import React from 'react';
import { Link } from '@tanstack/router';

export default function Home() {
  return (
    <div>
      <h1>Task Management App</h1>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/tasks">Tasks</Link>
      </nav>
    </div>
  );
}
