import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(name, email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    // success: redirect or show toast
    window.location.href = "/";
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Account</h1>
      {error && (
        <div className="mb-4 p-2 text-sm text-red-800 bg-red-100 rounded">
          {error}
        </div>
      )}
      <form onSubmit={submit} className="flex flex-col gap-4">
        {/* inputs */}
        <button className="bg-blue-600 text-white p-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}
