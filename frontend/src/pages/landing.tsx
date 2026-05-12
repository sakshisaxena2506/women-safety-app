import { Link } from 'react-router-dom';
import {
  Shield, Bell, MapPin, Phone, Users, CheckCircle,
  ArrowRight, Heart, Lock, Zap
} from 'lucide-react';

const features = [
  {
    icon: Bell,
    color: 'bg-red-100 text-red-600',
    title: 'One-Tap SOS Alert',
    desc: 'Send an emergency alert to your trusted contacts and nearby volunteers instantly with a single press.',
  },
  {
    icon: MapPin,
    color: 'bg-orange-100 text-orange-600',
    title: 'Live Location Sharing',
    desc: 'Share your real-time location with emergency contacts so help can reach you faster.',
  },
  {
    icon: Users,
    color: 'bg-pink-100 text-pink-600',
    title: 'Volunteer Network',
    desc: 'Connect with a network of trained volunteers in your area who are ready to respond.',
  },
  {
    icon: Phone,
    color: 'bg-blue-100 text-blue-600',
    title: 'Emergency Helplines',
    desc: 'Quick access to Women Helpline (1091), Police (100), and Ambulance (108) at all times.',
  },
  {
    icon: Lock,
    color: 'bg-green-100 text-green-600',
    title: 'Secure & Private',
    desc: 'Your data is protected. Only your trusted contacts can access your location during an alert.',
  },
  {
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-600',
    title: 'Instant Response',
    desc: 'Alerts are dispatched within seconds to ensure the fastest possible response time.',
  },
];

const stats = [
  { value: '10,000+', label: 'Women Protected' },
  { value: '500+', label: 'Volunteers Active' },
  { value: '98%', label: 'Response Rate' },
  { value: '24/7', label: 'Always On' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg">SafeGuard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-pink-50 pt-20 pb-28 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-100 rounded-full opacity-30 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-100 rounded-full opacity-40 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Heart className="w-3.5 h-3.5" />
            Safety First, Always
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
            Your personal safety{' '}
            <span className="text-red-600">guardian</span>,<br className="hidden sm:block" />
            always by your side
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            SafeGuard gives women an instant lifeline — one-tap SOS alerts, real-time
            location sharing, and a community of volunteers ready to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:shadow-red-300 transition-all active:scale-95 text-sm"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border-2 border-gray-200 hover:border-red-200 text-gray-700 font-semibold rounded-2xl transition-all text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-black text-red-600">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Everything you need to stay safe</h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
              Designed for real emergencies — fast, reliable, and simple enough to use under stress.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500 text-sm">Three simple steps to activate your safety network</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up in under a minute and set up your emergency contacts.' },
              { step: '02', title: 'Add trusted contacts', desc: 'Add up to 5 people who will be notified instantly when you need help.' },
              { step: '03', title: 'Press SOS when needed', desc: 'One tap sends your location and alert to contacts and nearby volunteers.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-lg mx-auto mb-5">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-600 to-red-800 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
        <div className="relative max-w-xl mx-auto">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-black mb-4">Your safety matters</h2>
          <p className="text-red-100 text-sm leading-relaxed mb-8">
            Join thousands of women who trust SafeGuard to keep them safe.
            It's free, always on, and takes less than a minute to set up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all active:scale-95 text-sm"
            >
              Get Protected Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/40 text-white font-semibold rounded-2xl hover:border-white/70 transition-all text-sm"
            >
              Sign In
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-red-200 text-xs">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Free forever</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> No credit card needed</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Available 24/7</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">SafeGuard</span>
        </div>
        <p>© {new Date().getFullYear()} SafeGuard. Built to protect every woman, everywhere.</p>
      </footer>
    </div>
  );
}
