import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const mutation = useMutation({
    mutationFn: async (data) => {
      console.log("Inside mutationFn with data:", data);
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, password}),
      });
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    },
    onSuccess: () => {
      window.location.href = '/login';
    },
    onError: (error) => {
      console.log("Mutation error:", error);
    },
  });
  

  const handleSubmit = e => {
    e.preventDefault();
    console.log("Submitting form with email:", email, "password:", password);
    mutation.mutate({ email, password });
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      {mutation.isError && <div>Error during registration.</div>}
      {mutation.isSuccess && <div>Registered successfully!</div>}
    </div>
  );
}
