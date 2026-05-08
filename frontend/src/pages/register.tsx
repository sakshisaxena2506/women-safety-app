import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserRole } from '../lib/supabase';
import toast from 'react-hot-toast';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  skills: string;
  areaOfOperation: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    role: 'user', skills: '', areaOfOperation: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Registration failed');

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: form.fullName,
        phone: form.phone,
        role: form.role,
      });
      if (profileError) throw profileError;

      // Create volunteer profile if needed
      if (form.role === 'volunteer') {
        await supabase.from('volunteer_profiles').insert({
          id: data.user.id,
          skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
          area_of_operation: form.areaOfOperation,
        });
      }

      toast.success('Account created successfully!');
      const redirectMap: Record<UserRole, string> = {
        user: '/user/dashboard',
        volunteer: '/volunteer/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(redirectMap[form.role]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-2xl">SafeGuard</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join the safety network today — it's free</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-red-50 border border-red-50 p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">I am registering as</label>
              <div className="grid grid-cols-3 gap-2">
                {(['user', 'volunteer', 'admin'] as UserRole[]).map(r => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm(f => ({ ...f, role: r }))}
                    className={`py-2.5 rounded-xl text-sm font-semibold capitalize transition-all border-2 ${
                      form.role === r
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-red-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text" required value={form.fullName} onChange={set('fullName')}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email" required value={form.email} onChange={set('email')}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel" required value={form.phone} onChange={set('phone')}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} required value={form.password} onChange={set('password')}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password" required value={form.confirmPassword} onChange={set('confirmPassword')}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Volunteer-specific fields */}
            {form.role === 'volunteer' && (
              <div className="space-y-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-sm font-bold text-red-700">Volunteer Information</p>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Skills (comma-separated)</label>
                  <input
                    type="text" value={form.skills} onChange={set('skills')}
                    placeholder="First Aid, Self-Defense, Counseling"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Area of Operation</label>
                  <input
                    type="text" value={form.areaOfOperation} onChange={set('areaOfOperation')}
                    placeholder="e.g., Bandra West, Mumbai"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all text-sm bg-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
