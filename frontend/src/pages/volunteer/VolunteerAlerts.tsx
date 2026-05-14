const { data } = await supabase
  .from('sos_alerts')
  .select('*')
  .eq('status', 'active');
  const acceptAlert = async (id: string) => {
  await supabase
    .from('sos_alerts')
    .update({
      status: 'responding',
      responder_id: user.id,
    })
    .eq('id', id);
};
const resolveAlert = async (id: string) => {
  await supabase
    .from('sos_alerts')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id);
};
useEffect(() => {
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
await supabase
  .from('profiles')
  .update({ is_verified: true })
  .eq('id', volunteerId);