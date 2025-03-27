import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // React Query mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      console.log('Inside mutationFn with data:', data);
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error('Login failed');
      }
      return res.json();
    },
    onSuccess: () => {
      window.location.href = '/tasks';
    },
    onError: (error) => {
      console.log('Mutation error:', error);
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Attempting login with:', email, password);
    mutation.mutate({ email, password });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {mutation.isError && <div>Error logging in.</div>}
      {mutation.isSuccess && <div>Logged in successfully!</div>}
    </div>
  );
}
