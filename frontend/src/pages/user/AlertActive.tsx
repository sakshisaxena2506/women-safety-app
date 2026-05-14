import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Phone, MapPin, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import LiveMap from '../../components/LiveMap';

export default function AlertActive() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({
  latitude: 28.6139,
  longitude: 77.2090,
  }); 

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
}, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

   const cancelAlert = async () => {
  setLoading(true);

  try {
    if (!user) return;

    const { data, error } = await supabase
      .from('sos_alerts')
      .update({
        status: 'cancelled'
      })
      .eq('user_id', user.id)
      .eq('status', 'active')
      .select();

    console.log(data);

    if (error) {
      console.error(error);
      throw error;
    }

    toast.success('Alert cancelled successfully!');
    setShowCancelModal(false);

    navigate('/user/dashboard');

  } catch (err) {
    console.error(err);
    toast.error('Failed to cancel alert');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-800 to-red-900 flex flex-col items-center justify-center p-6 text-white">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black mb-1">🚨 SOS Active</h1>
        <p className="text-red-200 text-sm">Alert sent — help is on the way</p>
      </div>

      {/* Timer */}
      <div className="bg-white/10 backdrop-blur rounded-3xl px-10 py-6 text-center mb-8 border border-white/20">
        <p className="text-red-200 text-xs font-semibold uppercase tracking-widest mb-2">Time Elapsed</p>
        <p className="text-5xl font-black tabular-nums">{formatTime(elapsed)}</p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8">
        {[
          { icon: Shield, label: 'Alert Sent', done: true },
          { icon: MapPin, label: 'Location Shared', done: true },
          { icon: Phone, label: 'Contacts Notified', done: true },
        ].map(({ icon: Icon, label, done }) => (
          <div key={label} className="bg-white/10 rounded-2xl p-3 text-center border border-white/20">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${done ? 'bg-green-500' : 'bg-white/20'}`}>
              {done ? <CheckCircle className="w-4 h-4 text-white" /> : <Icon className="w-4 h-4 text-white/60" />}
            </div>
            <p className="text-xs font-semibold text-white/80 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick call buttons */}
      <div className="w-full max-w-sm space-y-2 mb-8">
        <p className="text-red-200 text-xs font-semibold uppercase tracking-widest text-center mb-3">Quick Dial</p>
        {[
          { label: 'Police', number: '100', color: 'bg-blue-600 hover:bg-blue-700' },
          { label: 'Women Helpline', number: '1091', color: 'bg-pink-600 hover:bg-pink-700' },
          { label: 'Ambulance', number: '108', color: 'bg-green-600 hover:bg-green-700' },
        ].map(({ label, number, color }) => (
          <a
            key={number}
            href={`tel:${number}`}
            className={`flex items-center justify-between w-full px-5 py-3 rounded-2xl text-white font-semibold transition-all ${color}`}
          >
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> {label}
            </span>
            <span className="font-black">{number}</span>
          </a>
        ))}
      </div>
      <div className="w-full max-w-2xl mb-8 rounded-2xl overflow-hidden">
      <LiveMap
       latitude={location.latitude}
       longitude={location.longitude}
       />
     </div>

      <button
        onClick={() => setShowCancelModal(true)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-2xl transition-all"
      >
        <X className="w-4 h-4" />
        Cancel Alert
      </button>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Are you safe?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Only cancel this alert if you are no longer in danger.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                No, Keep Alert
              </button>
              <button
                onClick={cancelAlert}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Cancelling...
                  </span>
                ) : "Yes, I'm Safe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
