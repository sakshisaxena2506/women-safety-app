
import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { UserRole } from "../lib/supabase";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user" as UserRole,
  });

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 BACKEND CONNECT FUNCTION
  const sendAlert = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Sakshi",
          location: "Bhopal",
          message: "Emergency help needed",
        }),
      });

      const data = await res.json();
      console.log("Response:", data);

      alert("🚨 Alert Sent Successfully!");
    } catch (error) {
      console.error(error);
      alert("Error sending alert");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

      if (authError) throw authError;

      if (data.user) {
        toast.success("Welcome back!");
        navigate("/user/dashboard");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-2xl">
              SafeGuard
            </span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">
            Welcome back
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full p-3 border rounded-xl"
            />

            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-3"
              >
                {showPw ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* 🔥 EMERGENCY BUTTON */}
          <button
            type="button"
            onClick={sendAlert}
            className="w-full mt-4 bg-black text-white py-3 rounded-xl"
          >
            🚨 Send Emergency Alert
          </button>

          <p className="text-center mt-4">
            <Link to="/register" className="text-red-600">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
