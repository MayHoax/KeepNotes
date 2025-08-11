import { useState } from "react";

export function AuthForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form onSubmit={(e) => onSubmit(e, form)} className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">
        {form.remember ? "Welcome back" : "Create an account"}
      </h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <label className="flex items-center text-sm">
        <input
          type="checkbox"
          name="remember"
          checked={form.remember}
          onChange={handleChange}
          className="mr-2"
        />
        Remember me
      </label>
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 bg-blue-600 text-white rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Please wait..." : "Submit"}
      </button>
    </form>
  );
}
