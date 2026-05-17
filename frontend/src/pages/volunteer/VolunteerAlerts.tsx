import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import LiveMap from '../../components/LiveMap';

export default function VolunteerAlerts() {
  const { user } = useAuth();

  const [alerts, setAlerts] = useState<any[]>([]);

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from('sos_alerts')
      .select('*')
      .eq('status', 'active');

    if (!error && data) {
      setAlerts(data);
    }
  };

  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel('sos-alerts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sos_alerts',
        },
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const acceptAlert = async (id: string) => {
    const { error } = await supabase
      .from('sos_alerts')
      .update({
        status: 'responding',
        responder_id: user?.id,
      })
      .eq('id', id);

    if (!error) {
      toast.success('Alert accepted');
      fetchAlerts();
    }
  };

  const resolveAlert = async (id: string) => {
    const { error } = await supabase
      .from('sos_alerts')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (!error) {
      toast.success('Alert resolved');
      fetchAlerts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-black mb-6">
        Active SOS Alerts
      </h1>

      {alerts.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-500">
            No active emergencies
          </p>
        </div>
      )}

      <div className="space-y-6">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-2xl shadow p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-bold text-lg">
                  Emergency Alert
                </p>

                <p className="text-sm text-gray-500">
                  Status: {alert.status}
                </p>
              </div>

              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                {alert.urgency_level}
              </span>
            </div>

            {alert.latitude && alert.longitude && (
              <div className="mb-4 rounded-xl overflow-hidden">
                <LiveMap
                  latitude={alert.latitude}
                  longitude={alert.longitude}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => acceptAlert(alert.id)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl"
              >
                Accept Alert
              </button>

              <button
                onClick={() => resolveAlert(alert.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}