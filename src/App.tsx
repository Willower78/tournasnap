import React, { useState } from 'react';
import { 
  Trophy, Zap, Shield, Check, CreditCard, 
  ArrowRight, Sparkles, Smartphone, RefreshCw, Plus, Calendar, Users, Activity
} from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  type: 'small' | 'big' | 'league';
  price: string;
  date: string;
  teamsCount: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'register' | 'checkout' | 'dashboard' | 'create' | 'manage'>('landing');
  const [userRole, setUserRole] = useState<'organizer' | 'player'>('organizer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Creation & Checkout state
  const [tournaments, setTournaments] = useState<Tournament[]>([
    { id: '1', name: 'Summer Cup 2026', type: 'small', price: '5 €', date: '2026-08-18', teamsCount: 4 }
  ]);
  const [pendingTournament, setPendingTournament] = useState<{ name: string; type: 'small' | 'big' | 'league'; price: string; costNum: number } | null>(null);
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Form inputs for new tournament
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'small' | 'big' | 'league'>('small');

  const handleRegisterOrLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('dashboard');
  };

  const handleInitiateCreation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let price = '5 €';
    if (newType === 'big') {
      price = '10 €';
    } else if (newType === 'league') {
      price = '19 €';
    }

    setPendingTournament({ name: newTitle, type: newType, price, costNum: 0 });
    setCurrentView('checkout');
  };

  const simulatePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        if (pendingTournament) {
          const newT: Tournament = {
            id: Date.now().toString(),
            name: pendingTournament.name,
            type: pendingTournament.type,
            price: pendingTournament.price,
            date: new Date().toLocaleDateString(),
            teamsCount: 0
          };
          setTournaments(prev => [...prev, newT]);
          setActiveTournament(newT);
        }
        setPendingTournament(null);
        setPaymentStatus('idle');
        setNewTitle('');
        setCurrentView('manage');
      }, 1200);
    }, 1000);
  };

  const handleOpenManage = (t: Tournament) => {
    setActiveTournament(t);
    setCurrentView('manage');
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col selection:bg-indigo-500/30">
      {/* Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 px-6 sm:px-12 flex items-center justify-between backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">TournaSnap</span>
        </div>

        <div className="flex items-center gap-4">
          {currentView === 'landing' && (
            <>
              <button 
                onClick={() => setCurrentView('register')}
                className="text-xs text-slate-300 hover:text-white font-medium transition"
              >
                Sign In (Free)
              </button>
              <button 
                onClick={() => { setUserRole('organizer'); setCurrentView('register'); }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30 active:scale-95"
              >
                Get Started Free
              </button>
            </>
          )}
          {currentView !== 'landing' && (
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Back to Dashboard
            </button>
          )}
        </div>
      </header>

      {/* 1. LANDING PAGE */}
      {currentView === 'landing' && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 space-y-20">
          <section className="text-center space-y-6 pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Free account login • Pay only when you create
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Streamline your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">leagues and tournaments</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              TournaSnap gives organizers lightning-fast tools for standings, schedules, and automated match generation. Logging in and managing your account is completely free!
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setCurrentView('register')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm px-8 py-4 rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition active:scale-95"
              >
                <span>Create free account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Pricing Section */}
          <div className="space-y-6 pt-6">
            <h2 className="text-center text-xl font-black text-white">Simple Pay-Per-Creation Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Small Tournament</div>
                <div className="text-3xl font-black text-white">5 €</div>
                <p className="text-xs text-slate-400">Perfect for local cups, single brackets, and weekend events.</p>
                <button onClick={() => setCurrentView('register')} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-xs font-bold transition">Get Started</button>
              </div>

              <div className="bg-indigo-950/40 border-2 border-indigo-500/50 p-6 rounded-3xl space-y-4 relative shadow-xl">
                <div className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">Popular</div>
                <div className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Big Tournament</div>
                <div className="text-3xl font-black text-white">10 €</div>
                <p className="text-xs text-slate-400">For larger multi-group tournaments with advanced bracket seeding.</p>
                <button onClick={() => setCurrentView('register')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold transition">Get Started</button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="text-sm font-bold text-purple-400 uppercase tracking-wider">Full League</div>
                <div className="text-3xl font-black text-white">19 €</div>
                <p className="text-xs text-slate-400">Complete season management with live tables, fixtures, and statistics.</p>
                <button onClick={() => setCurrentView('register')} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-xs font-bold transition">Get Started</button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 2. REGISTRATION / LOGIN FLOW (FREE) */}
      {currentView === 'register' && (
        <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-black text-white">Sign In or Create Free Account</h2>
              <p className="text-xs text-slate-400">Access your dashboard for free. You only pay when launching a paid event.</p>
            </div>

            <form onSubmit={handleRegisterOrLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-2xl text-xs transition shadow-lg shadow-indigo-600/30 mt-4"
              >
                Enter Dashboard (Free)
              </button>
            </form>
          </div>
        </main>
      )}

      {/* 3. CREATE TOURNAMENT FORM */}
      {currentView === 'create' && (
        <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-black text-white">Launch New Event</h2>
              <p className="text-xs text-slate-400">Select format and configure your pricing tier</p>
            </div>

            <form onSubmit={handleInitiateCreation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">Event / League Name</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Summer Cup 2026" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">Select Category & Price</label>
                <div className="grid grid-cols-3 gap-2">
                  <div 
                    onClick={() => setNewType('small')}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition ${newType === 'small' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'}`}
                  >
                    <div className="text-xs font-bold text-white">Small</div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-1">5 €</div>
                  </div>
                  <div 
                    onClick={() => setNewType('big')}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition ${newType === 'big' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'}`}
                  >
                    <div className="text-xs font-bold text-white">Big</div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-1">10 €</div>
                  </div>
                  <div 
                    onClick={() => setNewType('league')}
                    className={`p-3 rounded-2xl border text-center cursor-pointer transition ${newType === 'league' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'}`}
                  >
                    <div className="text-xs font-bold text-white">League</div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-1">19 €</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setCurrentView('dashboard')}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-2xl text-xs transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-2xl text-xs transition shadow-lg shadow-indigo-600/30"
                >
                  Continue to Pay
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {/* 4. SIMULATED CHECKOUT FOR CREATION */}
      {currentView === 'checkout' && pendingTournament && (
        <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-black text-white">Event Checkout</h2>
              <p className="text-xs text-slate-400">Secure payment simulation</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Event:</span>
                <span className="font-bold text-white">{pendingTournament.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Type:</span>
                <span className="font-bold text-indigo-400 uppercase">{pendingTournament.type}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-black">
                <span className="text-white">Amount due:</span>
                <span className="text-emerald-400">{pendingTournament.price}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-500">Card Number (Sandbox)</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input type="text" readOnly value="4242 •••• •••• 4242" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-300 font-mono" />
                </div>
              </div>
            </div>

            {paymentStatus === 'idle' && (
              <button 
                onClick={simulatePayment}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-2xl text-xs transition shadow-lg shadow-emerald-500/20"
              >
                Pay {pendingTournament.price} & Launch Event
              </button>
            )}

            {paymentStatus === 'processing' && (
              <div className="text-center py-4 space-y-2">
                <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs text-indigo-300">Processing secure transaction...</p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center py-4 space-y-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-emerald-300">Payment approved! Opening setup...</p>
              </div>
            )}
          </div>
        </main>
      )}

      {/* 5. MANAGE TOURNAMENT / LEAGUE VIEW */}
      {currentView === 'manage' && activeTournament && (
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">{activeTournament.name}</h2>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">{activeTournament.type}</span>
              </div>
              <p className="text-xs text-slate-400">Created: {activeTournament.date} • Paid tier: {activeTournament.price}</p>
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-xl transition font-bold"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-slate-400">Teams / Participants</span>
              <div className="text-2xl font-black text-white">{activeTournament.teamsCount} Teams</div>
              <button 
                onClick={() => {
                  setTournaments(tournaments.map(t => t.id === activeTournament.id ? { ...t, teamsCount: t.teamsCount + 1 } : t));
                  setActiveTournament({ ...activeTournament, teamsCount: activeTournament.teamsCount + 1 });
                }}
                className="text-xs text-indigo-400 font-bold hover:underline pt-2 block"
              >
                + Add simulated team
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-slate-400">Tournament Status</span>
              <div className="text-2xl font-black text-emerald-400">Active / Live</div>
              <span className="text-[10px] text-slate-500 block">Ready for match schedules</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-slate-400">Share Link</span>
              <div className="text-xs font-mono text-indigo-300 truncate pt-1">tournasnap.app/e/{activeTournament.id}</div>
              <button onClick={() => alert('Link copied to clipboard!')} className="text-xs text-slate-400 hover:text-white pt-2 block underline">Copy public link</button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tournament Management Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">Generate Fixtures / Schedule</div>
                <p className="text-[11px] text-slate-400">Automatically pair up registered teams into a tournament bracket or round-robin table.</p>
                <button onClick={() => alert('Fixtures generated successfully!')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition">Generate Matches</button>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">Live Scoreboard Control</div>
                <p className="text-[11px] text-slate-400">Update scores live as matches are being played out in the venue.</p>
                <button onClick={() => alert('Opening live score control...')} className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition">Open Scorekeeper</button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 6. DASHBOARD */}
      {currentView === 'dashboard' && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-6 gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Organizer Dashboard</h2>
              <p className="text-xs text-slate-400">Logged in freely as: {email || 'organizer@tournasnap.com'}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentView('create')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </button>
              <button 
                onClick={() => setCurrentView('landing')} 
                className="text-xs text-red-400 hover:underline px-2"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-slate-400">Total Tournaments / Leagues</span>
              <div className="text-2xl font-black text-white">{tournaments.length} active</div>
              <button onClick={() => setCurrentView('create')} className="text-xs text-indigo-400 font-bold hover:underline pt-2 block">+ Launch new event</button>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-slate-400">Account Status</span>
              <div className="text-2xl font-black text-emerald-400">Free Tier</div>
              <span className="text-[10px] text-slate-500 block">No monthly fees. Pay per event.</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-slate-400">Quick Pricing</span>
              <div className="text-xs text-slate-300 space-y-1 pt-1 font-mono">
                <div>• Small: 5 €</div>
                <div>• Big: 10 €</div>
                <div>• League: 19 €</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your Active Events</h3>
            {tournaments.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">You haven't created any tournaments or leagues yet.</p>
                <button 
                  onClick={() => setCurrentView('create')}
                  className="bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-600/30 transition"
                >
                  Create your first tournament (Small: 5 €, Big: 10 €, League: 19 €)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tournaments.map(t => (
                  <div key={t.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{t.name}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">{t.type}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Created: {t.date} • Paid: {t.price} • Teams: {t.teamsCount}</p>
                    </div>
                    <button 
                      onClick={() => handleOpenManage(t)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-xl font-bold transition shadow"
                    >
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
