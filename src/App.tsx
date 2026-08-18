import React, { useState } from 'react';
import { 
  Trophy, Users, Zap, Shield, Check, CreditCard, 
  ArrowRight, Sparkles, Calendar, Activity, Lock, Smartphone, Globe
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'register' | 'checkout' | 'dashboard'>('landing');
  const [userRole, setUserRole] = useState<'organizer' | 'player'>('organizer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>('pro');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('checkout');
  };

  const simulatePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        setCurrentView('dashboard');
        setPaymentStatus('idle');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 font-sans flex flex-col selection:bg-indigo-500/30">
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
                Logga in
              </button>
              <button 
                onClick={() => { setUserRole('organizer'); setCurrentView('register'); }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30 active:scale-95"
              >
                Kom igång gratis
              </button>
            </>
          )}
          {currentView !== 'landing' && (
            <button 
              onClick={() => setCurrentView('landing')}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Tillbaka till start
            </button>
          )}
        </div>
      </header>

      {/* 1. LANDNINGSSIDA */}
      {currentView === 'landing' && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 space-y-20">
          <section className="text-center space-y-6 pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Ersätt röriga Excel-ark och gruppchatter
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Strömlinjeforma dina <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">ligor och turneringar</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              TournaSnap ger arrangörer blixtsnabba verktyg för ställningar, spelscheman och automatiserad matchgenerering, medan spelare får allt direkt i mobilen.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setCurrentView('register')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm px-8 py-4 rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition active:scale-95"
              >
                <span>Skapa turnering nu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Automatiska spelscheman</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Generera tabeller, slutspelsträd och matchtider på ett klick utan manuellt krångel.</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Live-rapportering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Spelare och supportrar kan följa resultat, poängtabeller och nästa match i realtid.</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Smidiga anmälningar</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Samla in laguppställningar och hantera betalningar direkt i plattformen.</p>
            </div>
          </div>
        </main>
      )}

      {/* 2. REGISTRERINGSFLÖDE */}
      {currentView === 'register' && (
        <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-black text-white">Skapa ditt TournaSnap-konto</h2>
              <p className="text-xs text-slate-400">Kom igång på under en minut</p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button 
                type="button"
                onClick={() => setUserRole('organizer')}
                className={`py-2 text-xs font-bold rounded-xl transition ${userRole === 'organizer' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
              >
                Arrangör
              </button>
              <button 
                type="button"
                onClick={() => setUserRole('player')}
                className={`py-2 text-xs font-bold rounded-xl transition ${userRole === 'player' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
              >
                Spelare / Lag
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">E-postadress</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="namn@exempel.se" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">Lösenord</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {userRole === 'organizer' && (
                <div className="space-y-3 pt-2">
                  <label className="text-[11px] font-bold text-slate-300">Välj licensnivå</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      onClick={() => setSelectedPlan('pro')}
                      className={`p-3 rounded-2xl border cursor-pointer transition ${selectedPlan === 'pro' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'}`}
                    >
                      <div className="text-xs font-bold text-white">Pro Pass</div>
                      <div className="text-[10px] text-indigo-400 font-mono mt-1">199 kr / mån</div>
                    </div>
                    <div 
                      onClick={() => setSelectedPlan('enterprise')}
                      className={`p-3 rounded-2xl border cursor-pointer transition ${selectedPlan === 'enterprise' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'}`}
                    >
                      <div className="text-xs font-bold text-white">Förening</div>
                      <div className="text-[10px] text-indigo-400 font-mono mt-1">499 kr / mån</div>
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-2xl text-xs transition shadow-lg shadow-indigo-600/30 mt-4"
              >
                Fortsätt till betalning
              </button>
            </form>
          </div>
        </main>
      )}

      {/* 3. SIMULERAD BETALNING (CHECKOUT) */}
      {currentView === 'checkout' && (
        <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-black text-white">Simulerad Betalning</h2>
              <p className="text-xs text-slate-400">Testa köpflödet säkert i sandlådan</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Vald plan:</span>
                <span className="font-bold text-white uppercase">{selectedPlan} Licens</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Moms (25%):</span>
                <span className="text-white">Inkluderat</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-black">
                <span className="text-white">Att betala idag:</span>
                <span className="text-emerald-400">{selectedPlan === 'pro' ? '199 kr' : '499 kr'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-500">Kortnummer (Simulerat)</label>
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
                Godkänn simulerat köp
              </button>
            )}

            {paymentStatus === 'processing' && (
              <div className="text-center py-4 space-y-2">
                <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs text-indigo-300">Behandlar säker betalning...</p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center py-4 space-y-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-emerald-300">Betalning slutförd! Skapar konto...</p>
              </div>
            )}
          </div>
        </main>
      )}

      {/* 4. DASHBOARD (EFTER INLOGGNING) */}
      {currentView === 'dashboard' && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-xl font-black text-white">Välkommen till TournaSnap Dashboard</h2>
              <p className="text-xs text-slate-400">Inloggad som: {email}</p>
            </div>
            <button 
              onClick={() => setCurrentView('landing')} 
              className="text-xs text-red-400 hover:underline"
            >
              Logga ut
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-slate-400">Aktiva turneringar</span>
              <div className="text-2xl font-black text-white">0 st</div>
              <button className="text-xs text-indigo-400 font-bold hover:underline pt-2 block">+ Skapa ny turnering</button>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-slate-400">Anmälda lag</span>
              <div className="text-2xl font-black text-white">0 lag</div>
              <span className="text-[10px] text-slate-500 block">Väntar på första anmälan</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
              <span className="text-xs text-slate-400">Licensstatus</span>
              <div className="text-2xl font-black text-emerald-400 uppercase">Aktiv (Pro)</div>
              <span className="text-[10px] text-slate-500 block">Nästa förnyelse om 30 dagar</span>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
