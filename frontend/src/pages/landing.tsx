 import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [alertActive, setAlertActive] = useState(false);

  // 🚨 SEND ALERT
  const sendAlert = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: "Emergency User",
          location: "Bhopal",
          message: "🚨 SOS Alert!"
        })
      });

      const data = await res.json();
      console.log("Send Alert Response:", data);

      // ✅ IMPORTANT CHECK
      if (!res.ok) {
        throw new Error(data.message || "Failed to send alert");
      }

      setAlertActive(true);
      alert("🚨 Emergency Alert Sent!");

    } catch (err) {
      console.error("Send Error:", err);
      alert("❌ Error sending alert");
    } finally {
      setLoading(false);
    }
  };

  // ❌ CANCEL ALERT
  const cancelAlert = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/alerts/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      console.log("Cancel Alert Response:", data);

      // ✅ IMPORTANT CHECK
      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel alert");
      }

      setAlertActive(false);
      alert("✅ Alert Cancelled");

    } catch (err) {
      console.error("Cancel Error:", err);
      alert("❌ Error cancelling alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-red-50 gap-6">

      <h1 className="text-3xl font-bold">
        Women Safety App 🚨
      </h1>

      {/* 🚨 SEND BUTTON */}
      {!alertActive && (
        <button
          onClick={sendAlert}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-red-700 disabled:bg-red-300"
        >
          {loading ? "Sending..." : "🚨 Send Emergency Alert"}
        </button>
      )}

      {/* ❌ CANCEL BUTTON */}
      {alertActive && (
        <button
          onClick={cancelAlert}
          disabled={loading}
          className="bg-black text-white px-6 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Cancelling..." : "❌ Cancel Alert"}
        </button>
      )}

      {/* 🔗 LOGIN */}
      <button
        onClick={() => navigate("/login")}
        className="text-blue-600 underline"
      >
        Go to Login
      </button>

    </div>
  );
}