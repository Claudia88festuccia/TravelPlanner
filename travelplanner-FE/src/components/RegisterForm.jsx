import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registrazione fallita");
      }

      const data = await res.json();
      alert("Registrazione avvenuta con successo!");

      
      navigate("/login");
    } catch (err) {
      console.error("Errore registrazione:", err);
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Registrati</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nome"
          className="form-control mb-2"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-2"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-success">
          Crea Account
        </button>
        {error && <div className="text-danger mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default RegisterForm;


