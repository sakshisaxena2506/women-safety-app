 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function AlertActive() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // 🚨 CANCEL ALERT (FINAL FIXED)
  const cancelAlert = async () => {
    setLoading(true);

    try {
      // ✅ 1. Backend call
      const res = await fetch(" https://women-safety-app-5cw6.onrender.com/api/alerts/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      console.log("Cancel Response:", data);

      // ❗ Check response
      if (!res.ok) {
        throw new Error(data.message || "Cancel failed");
      }

      // ✅ 2. Supabase update (optional but correct)
      if (user) {
        const { error } = await supabase
          .from('sos_alerts')
          .update({
            status: 'cancelled',
            resolved_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (error) {
          console.log("Supabase error:", error.message);
        }
      }

      // ✅ 3. UI update
      toast.success("✅ Alert Cancelled");
      setShowCancelModal(false);

      // 🔥 IMPORTANT FIX
      navigate("/");   // ya "/user/dashboard"

    } catch (err) {
      console.error(err);
      toast.error("❌ Error cancelling alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-800 flex flex-col items-center justify-center text-white gap-6">

      <h1 className="text-3xl font-bold">🚨 SOS Active</h1>
      <p className="text-lg">Time: {formatTime(elapsed)}</p>

      <button
        onClick={() => setShowCancelModal(true)}
        className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold"
      >
        Cancel Alert
      </button>

      {/* 🔥 MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-xl text-center">

            <h2 className="text-xl font-bold mb-4">Are you safe?</h2>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowCancelModal(false)}
                className="border px-4 py-2 rounded"
              >
                No
              </button>

              <button
                onClick={cancelAlert}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}