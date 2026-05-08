import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface SOSButtonProps {
  onConfirm: () => void;
}

export default function SOSButton({ onConfirm }: SOSButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!showModal) {
      setCountdown(3);
      return;
    }
    if (countdown === 0) {
      setShowModal(false);
      onConfirm();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showModal, countdown, onConfirm]);

  return (
<>
      {/* SOS Button */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Outer pulse rings */}
          <span className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping" />
          <span className="absolute -inset-3 rounded-full bg-red-400 opacity-20 animate-ping" style={{ animationDelay: '0.3s' }} />
          <span className="absolute -inset-6 rounded-full bg-red-300 opacity-10 animate-ping" style={{ animationDelay: '0.6s' }} />

          <button
            onClick={() => setShowModal(true)}
            className="relative w-40 h-40 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white font-black text-3xl
              shadow-[0_0_40px_rgba(220,38,38,0.7)] hover:shadow-[0_0_60px_rgba(220,38,38,0.9)]
              hover:scale-105 active:scale-95 transition-all duration-200 flex flex-col items-center justify-center gap-1
              border-4 border-red-400"
            aria-label="Trigger SOS alert"
          >
            <AlertTriangle className="w-10 h-10" />
            <span className="text-2xl font-black tracking-widest">SOS</span>
          </button>
        </div>
        <p className="text-sm text-gray-500 font-medium">Press and hold for emergency</p>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send SOS Alert?</h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              This will immediately notify nearby volunteers and your emergency contacts with your location.
            </p>

            {/* Countdown circle */}
            <div className="w-20 h-20 rounded-full border-4 border-red-200 flex items-center justify-center mx-auto mb-6 relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40" cy="40" r="36"
                  stroke="#DC2626" strokeWidth="4" fill="none"
                  strokeDasharray={`${(3 - countdown) / 3 * 226} 226`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="text-3xl font-black text-red-600">{countdown}</span>
            </div>

            <p className="text-sm text-red-500 font-medium mb-6">Auto-confirming in {countdown}s...</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowModal(false); onConfirm(); }}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
