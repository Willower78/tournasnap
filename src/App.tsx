import React, { useState, useMemo, useEffect } from 'react';
import { 
  Zap, Trophy, Calendar, Clock, MapPin, Edit3, AlertTriangle, CheckCircle, 
  Share2, Printer, Globe, Shield, RefreshCw, Plus, Users, Trash2, 
  ArrowRight, Play, Eye, Sparkles, Check, DollarSign, Copy, ChevronDown, Layers
} from 'lucide-react';

type Lang = 'sv' | 'en' | 'de' | 'es' | 'fr' | 'it' | 'nl' | 'da';
type Mode = 'cup' | 'league';
type SportCategory = 'racket' | 'team' | 'precision';

interface I18nDict {
  name: string;
  flag: string;
  currency: string;
  priceSmallVal: number;
  priceMedVal: number;
  priceLeagueVal: number;
  priceSmall: string;
  priceMed: string;
  priceLeague: string;
  tabSetup: string;
  tabBracket: string;
  tabLeague: string;
  tabLive: string;
  tabPrint: string;
  tabPro: string;
  addTeam: string;
  newDiv: string;
  generate: string;
  reschedule: string;
  newDate: string;
  newTime: string;
  conflict: string;
  save: string;
  cancel: string;
  doubleRound: string;
  doubleRoundDesc: string;
  tableRank: string;
  tableTeam: string;
  tableP: string;
  tableW: string;
  tableD: string;
  tableL: string;
  tableDiff: string;
  tablePts: string;
  champ: string;
  proPass: string;
  proDesc: string;
  payBtn: string;
}

const DICTS: Record<Lang, I18nDict> = {
  sv: {
    name: "Svenska",
    flag: "🇸🇪",
    currency: "SEK",
    priceSmallVal: 5,
    priceMedVal: 10,
    priceLeagueVal: 29,
    priceSmall: "5 kr",
    priceMed: "10 kr",
    priceLeague: "29 kr",
    tabSetup: "1. Roster & Regler",
    tabBracket: "2. Slutspelsträd",
    tabLeague: "2. Serietabell",
    tabLive: "3. Live Mobilvy",
    tabPrint: "4. A4 Utskrift",
    tabPro: "5. Pro Kassa",
    addTeam: "Lägg till",
    newDiv: "Ny Division",
    generate: "Generera Spelschema",
    reschedule: "Flytta matchdag & tid",
    newDate: "Nytt Datum",
    newTime: "Ny Starttid",
    conflict: "Krock! Laget eller planen är redan uppbokad vid denna tidpunkt.",
    save: "Spara ändring",
    cancel: "Avbryt",
    doubleRound: "Dubbelmöten (Hemma / Borta)",
    doubleRoundDesc: "Skapar returmatcher automatiskt",
    tableRank: "#",
    tableTeam: "Lag / Deltagare",
    tableP: "S",
    tableW: "V",
    tableD: "O",
    tableL: "F",
    tableDiff: "+/-",
    tablePts: "P",
    champ: "MÄSTARE",
    proPass: "TournaSnap Pro Pass",
    proDesc: "Lås upp obegränsad live-delning, automatisk tabellberäkning och A4-export.",
    payBtn: "Betala säkert med Stripe"
  },
  en: {
    name: "English",
    flag: "🇬🇧",
    currency: "USD",
    priceSmallVal: 1,
    priceMedVal: 2,
    priceLeagueVal: 4,
    priceSmall: "$0.99",
    priceMed: "$1.99",
    priceLeague: "$3.99",
    tabSetup: "1. Roster & Rules",
    tabBracket: "2. Bracket Tree",
    tabLeague: "2. League Table",
    tabLive: "3. Live Mobile View",
    tabPrint: "4. A4 Printout",
    tabPro: "5. Pro Checkout",
    addTeam: "Add",
    newDiv: "New Division",
    generate: "Generate Fixtures",
    reschedule: "Reschedule Match",
    newDate: "New Date",
    newTime: "Kickoff Time",
    conflict: "Conflict! Team or court is already booked at this time slot.",
    save: "Save Changes",
    cancel: "Cancel",
    doubleRound: "Double Round-Robin (Home / Away)",
    doubleRoundDesc: "Generates return fixtures automatically",
    tableRank: "#",
    tableTeam: "Team / Participant",
    tableP: "P",
    tableW: "W",
    tableD: "D",
    tableL: "L",
    tableDiff: "+/-",
    tablePts: "Pts",
    champ: "CHAMPION",
    proPass: "TournaSnap Pro Pass",
    proDesc: "Unlock instant live spectator link, full standings automation and A4 prints.",
    payBtn: "Pay Securely with Stripe"
  },
  de: {
    name: "Deutsch",
    flag: "🇩🇪",
    currency: "EUR",
    priceSmallVal: 1,
    priceMedVal: 2,
    priceLeagueVal: 3,
    priceSmall: "0,99 €",
    priceMed: "1,99 €",
    priceLeague: "3,49 €",
    tabSetup: "1. Teams & Regeln",
    tabBracket: "2. Turnierbaum",
    tabLeague: "2. Ligatabelle",
    tabLive: "3. Live-Zuschauer",
    tabPrint: "4. A4 Druck",
    tabPro: "5. Pro Kasse",
    addTeam: "Hinzufügen",
    newDiv: "Neue Division",
    generate: "Spielplan erstellen",
    reschedule: "Spiel verlegen",
    newDate: "Neues Datum",
    newTime: "Neue Uhrzeit",
    conflict: "Konflikt! Platz oder Team ist zu dieser Zeit bereits belegt.",
    save: "Speichern",
    cancel: "Abbrechen",
    doubleRound: "Hin- und Rückrunde",
    doubleRoundDesc: "Erstellt Rückspiele automatisch",
    tableRank: "#",
    tableTeam: "Mannschaft",
    tableP: "Sp",
    tableW: "S",
    tableD: "U",
    tableL: "N",
    tableDiff: "+/-",
    tablePts: "Pkt",
    champ: "MEISTER",
    proPass: "TournaSnap Pro Pass",
    proDesc: "Live-Freigabelink, Tabellen-Automatik und A4-Druck freischalten.",
    payBtn: "Sicher mit Stripe bezahlen"
  },
  es: {
    name: "Español",
    flag: "🇪🇸",
    currency: "EUR",
    priceSmallVal: 1,
    priceMedVal: 2,
    priceLeagueVal: 3,
    priceSmall: "0,99 €",
    priceMed: "1,99 €",
    priceLeague: "3,49 €",
    tabSetup: "1. Equipos y Reglas",
    tabBracket: "2. Cuadro Eliminatorio",
    tabLeague: "2. Clasificación",
    tabLive: "3. Público en Vivo",
    tabPrint: "4. Imprimir A4",
    tabPro: "5. Pago Pro",
    addTeam: "Añadir",
    newDiv: "Nueva División",
    generate: "Generar Calendario",
    reschedule: "Reprogramar Partido",
    newDate: "Nueva Fecha",
    newTime: "Nueva Hora",
    conflict: "¡Conflicto! Equipo o pista ocupado en ese horario.",
    save: "Guardar",
    cancel: "Cancelar",
    doubleRound: "Ida y Vuelta",
    doubleRoundDesc: "Crea partidos de revancha automáticamente",
    tableRank: "#",
    tableTeam: "Equipo",
    tableP: "PJ",
    tableW: "PG",
    tableD: "PE",
    tableL: "PP",
    tableDiff: "DG",
    tablePts: "Pts",
    champ: "CAMPEÓN",
    proPass: "TournaSnap Pro Pass",
    proDesc: "Desbloquea vista móvil en vivo, cálculo automático y exportación A4.",
    payBtn: "Pagar con Stripe"
  },
  fr: {
    name: "Français",
    flag: "🇫🇷",
    currency: "EUR",
    priceSmallVal: 1,
    priceMedVal: 2,
    priceLeagueVal: 3,
    priceSmall: "0,99 €",
    priceMed: "1,99 €",
    priceLeague: "3,49 €",
    tabSetup: "1. Équipes & Règles",
    tabBracket: "2. Tableau Final",
    tabLeague: "2. Classement",
    tabLive: "3. Vue Direct Mobile",
    tabPrint: "4. Imprimer A4",
    tabPro: "5. Caisse Pro",
    addTeam: "Ajouter",
    newDiv: "Nouvelle Division",
    generate: "Générer Calendrier",
    reschedule: "Reprogrammer",
    newDate: "Nouvelle Date",
    newTime: "Nouvel Horaire",
    conflict: "Conflit ! Équipe ou terrain déjà occupé sur ce créneau.",
    save: "Enregistrer",
    cancel: "Annuler",
    doubleRound: "Matchs Aller / Retour",
    doubleRoundDesc: "Génère les matchs retours automatiquement",
    tableRank: "#",
    tableTeam: "Équipe",
    tableP: "J",
    tableW: "G",
    tableD: "N",
    tableL: "P",
    tableDiff: "+/-",
    tablePts: "Pts",
    champ: "CHAMPION",
    proPass: "TournaSnap Pro Pass",
    proDesc: "Débloquez le partage en direct, classement automatisé et PDF A4.",
    payBtn: "Payer avec Stripe"
  },
  it: {
    name: "Italiano",
    flag: "🇮🇹",
    currency: "EUR",
    priceSmallVal: 1,
    priceMedVal: 2,
    priceLeagueVal: 3,
    priceSmall: "0,99 €",
    priceMed: "1,99 €",
    priceLeague: "3,49 €",
    tabSetup: "1. Squadre & Regole",
    tabBracket: "2. Tabellone",
    tabLeague: "2. Classifica",
    tabLive: "3. Vista Live Mobile",
    tabPrint: "4. Stampa A4",
    tabPro: "5. Cassa Pro",
    addTeam: "Aggiungi",
    newDiv: "Nuova Divisione",
    generate: "Genera Calendario",
    reschedule: "Sposta Partita",
    newDate: "Nuova Data",
    newTime: "Nuovo Orario",
    conflict: "Conflitto! Campo o squadra già occupati in questo slot.",
    save: "Salva",
    cancel: "Annulla",
    doubleRound: "Andata e Ritorno",
    doubleRoundDesc: "Genera partite di ritorno in automatico",
    tableRank: "#",
    tableTeam: "Squadra",
    tableP: "G",
    tableW: "V",
    tableD: "P",
    tableL: "S",
    tableDiff: "DR",
    tablePts: "Pt",
    champ: "CAMPIONE",
    proPass: "TournaSnap Pro Pass",
    proDesc: "Sblocca link spettatori dal vivo, calcolo classifica e stampe A4.",
    payBtn: "Paga con Stripe"
  },
  nl: {
    name: "Nederlands",
    flag: "🇳🇱",
    currency: "EUR",
    priceSmallVal: 1,
    priceMedVal: 2,
    priceLeagueVal: 3,
    priceSmall: "0,99 €",
    priceMed: "1,99 €",
    priceLeague: "3,49 €",
    tabSetup: "1. Teams & Regels",
    tabBracket: "2. Toernooischema",
    tabLeague: "2. Stand & Schema",
    tabLive: "3. Live Toeschouwers",
    tabPrint: "4. A4 Afdrukken",
    tabPro: "5. Pro Kassa",
    addTeam: "Toevoegen",
    newDiv: "Nieuwe Divisie",
    generate: "Speelschema Maken",
    reschedule: "Wedstrijd Verplaatsen",
    newDate: "Nieuwe Datum",
    newTime: "Nieuwe Tijd",
    conflict: "Conflict! Team of baan is al geboekt op dit tijdstip.",
    save: "Opslaan",
    cancel: "Annuleren",
    doubleRound: "Heen- en Terugronde",
    doubleRoundDesc: "Maakt automatisch returnwedstrijden aan",
    tableRank: "#",
    tableTeam: "Team / Deelnemer",
    tableP: "G",
    tableW: "W",
    tableD: "G",
    tableL: "V",
    tableDiff: "+/-",
    tablePts: "Pnt",
    champ: "KAMPIOEN",
    proPass: "TournaSnap Pro Pass",
    proDesc: "Ontgrendel live spectator link, geautomatiseerde ranglijst en A4 prints.",
    payBtn: "Veilig betalen met Stripe"
  },
  da: {
    name: "Dansk",
    flag: "🇩🇰",
    currency: "DKK",
    priceSmallVal: 5,
    priceMedVal: 10,
    priceLeagueVal: 25,
    priceSmall: "5 kr.",
    priceMed: "10 kr.",
    priceLeague: "25 kr.",
    tabSetup: "1. Hold & Regler",
    tabBracket: "2. Slutspilstræ",
    tabLeague: "2. Stilling & Kampe",
    tabLive: "3. Live Mobilvisning",
    tabPrint: "4. A4 Udskrift",
    tabPro: "5. Pro Kasse",
    addTeam: "Tilføj",
    newDiv: "Ny Division",
    generate: "Generer Kampprogram",
    reschedule: "Flyt Kamp",
    newDate: "Ny Dato",
    newTime: "Nyt Tidspunkt",
    conflict: "Konflikt! Hold eller bane er optaget på dette tidspunkt.",
    save: "Gem ændring",
    cancel: "Annuller",
    doubleRound: "Dobbeltrunde (Hjemme / Ude)",
    doubleRoundDesc: "Opretter returkampe automatisk",
    tableRank: "#",
    tableTeam: "Hold",
    tableP: "K",
    tableW: "V",
    tableD: "U",
    tableL: "T",
    tableDiff: "+/-",
    tablePts: "P",
    champ: "MESTER",
    proPass: "TournaSnap Pro Pass",
    proDesc: "Lås op for live-deling, automatisk stilling og A4-udskrifter.",
    payBtn: "Betal med Stripe"
  }
};

interface SportConfig {
  id: string;
  name: string;
  category: SportCategory;
  icon: string;
  courtLabel: string;
  defaultTime: number;
  scoreUnit: string;
  badgeColor: string;
  presets: string[];
}

const ALL_SPORTS: Record<string, SportConfig> = {
  padel: {
    id: 'padel',
    name: 'Padel',
    category: 'racket',
    icon: '🎾',
    courtLabel: 'Bana',
    defaultTime: 45,
    scoreUnit: 'Set',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    presets: ["Stockholm Smash", "Västerås Padel", "Malmö Wizards", "Göteborg Volley", "Uppsala Dropshot", "Örebro Kings"]
  },
  tennis: {
    id: 'tennis',
    name: 'Tennis',
    category: 'racket',
    icon: '🎾',
    courtLabel: 'Bana',
    defaultTime: 60,
    scoreUnit: 'Set / Games',
    badgeColor: 'text-lime-400 border-lime-500/30 bg-lime-500/10',
    presets: ["Carlos Alcaraz", "Jannik Sinner", "Novak Djokovic", "Daniil Medvedev", "Alexander Zverev", "Casper Ruud"]
  },
  pickleball: {
    id: 'pickleball',
    name: 'Pickleball',
    category: 'racket',
    icon: '🥒',
    courtLabel: 'Court',
    defaultTime: 25,
    scoreUnit: 'Poäng (11)',
    badgeColor: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
    presets: ["Ben Johns", "Federico Staksrud", "Tyson McGuffin", "Dylan Frazier", "Anna Leigh Waters", "Catherine Parenteau"]
  },
  tabletennis: {
    id: 'tabletennis',
    name: 'Bordtennis / Pingis',
    category: 'racket',
    icon: '🏓',
    courtLabel: 'Bord',
    defaultTime: 20,
    scoreUnit: 'Set (11)',
    badgeColor: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    presets: ["Truls Möregårdh", "Fan Zhendong", "Wang Chuqin", "Hugo Calderano", "Felix Lebrun", "Anton Källberg"]
  },
  badminton: {
    id: 'badminton',
    name: 'Badminton',
    category: 'racket',
    icon: '🏸',
    courtLabel: 'Bana',
    defaultTime: 30,
    scoreUnit: 'Set (21)',
    badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
    presets: ["Viktor Axelsen", "Shi Yuqi", "Jonatan Christie", "Anders Antonsen", "Kodai Naraoka", "Li Shifeng"]
  },
  football: {
    id: 'football',
    name: 'Fotboll / Futsal',
    category: 'team',
    icon: '⚽',
    courtLabel: 'Plan',
    defaultTime: 35,
    scoreUnit: 'Mål',
    badgeColor: 'text-green-400 border-green-500/30 bg-green-500/10',
    presets: ["Nybro IF", "Kalmar FF", "Oskarshamns AIK", "Växjö DFF", "Karlskrona FK", "Ronneby BK"]
  },
  basketball: {
    id: 'basketball',
    name: 'Basket (5v5 / 3x3)',
    category: 'team',
    icon: '🏀',
    courtLabel: 'Plan',
    defaultTime: 30,
    scoreUnit: 'Poäng',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    presets: ["Boston Celtics", "LA Lakers", "Golden State", "Denver Nuggets", "Dallas Mavericks", "Miami Heat"]
  },
  hockey: {
    id: 'hockey',
    name: 'Ishockey / Rink',
    category: 'team',
    icon: '🏒',
    courtLabel: 'Rink',
    defaultTime: 40,
    scoreUnit: 'Mål',
    badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    presets: ["Nybro Vikings", "Kalmar HC", "Tingsryds AIF", "IK Oskarshamn", "Växjö Lakers", "HV71"]
  },
  floorball: {
    id: 'floorball',
    name: 'Innebandy',
    category: 'team',
    icon: '🏑',
    courtLabel: 'Hall / Plan',
    defaultTime: 30,
    scoreUnit: 'Mål',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    presets: ["Storvreta IBK", "IBF Falun", "Pixbo IBK", "Växjö Vipers", "Kalmarsund", "Mullsjö AIS"]
  },
  volleyball: {
    id: 'volleyball',
    name: 'Volleyboll / Beach',
    category: 'team',
    icon: '🏐',
    courtLabel: 'Bana',
    defaultTime: 35,
    scoreUnit: 'Set (25)',
    badgeColor: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    presets: ["Åhman / Hellvig", "Mol / Sørum", "Perusic / Schweiner", "Boermans / de Groot", "Ehlers / Wickler", "Evandro / Arthur"]
  },
  handball: {
    id: 'handball',
    name: 'Handboll',
    category: 'team',
    icon: '🤾',
    courtLabel: 'Hall / Plan',
    defaultTime: 35,
    scoreUnit: 'Mål',
    badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    presets: ["IK Sävehof", "Ystads IF", "IFK Kristianstad", "Alingsås HK", "Hammarby IF", "IFK Skövde"]
  },
  darts: {
    id: 'darts',
    name: 'Darts',
    category: 'precision',
    icon: '🎯',
    courtLabel: 'Tavla',
    defaultTime: 25,
    scoreUnit: 'Legs',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    presets: ["Luke Humphries", "M. van Gerwen", "Luke Littler", "Gerwyn Price", "Gary Anderson", "Michael Smith"]
  },
  discgolf: {
    id: 'discgolf',
    name: 'Discgolf',
    category: 'precision',
    icon: '🥏',
    courtLabel: 'Hål / Grupp',
    defaultTime: 60,
    scoreUnit: 'Kast (+/-)',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    presets: ["Paul McBeth", "Ricky Wysocki", "Gannon Buhr", "Calvin Heimburg", "Eagle McMahon", "Simon Lizotte"]
  },
  chess: {
    id: 'chess',
    name: 'Schack',
    category: 'precision',
    icon: '♟️',
    courtLabel: 'Bord',
    defaultTime: 20,
    scoreUnit: 'Partier',
    badgeColor: 'text-stone-300 border-stone-500/30 bg-stone-500/10',
    presets: ["Magnus Carlsen", "Hikaru Nakamura", "Fabiano Caruana", "Gukesh D", "Nodirbek Abdusattorov", "Alireza Firouzja"]
  },
  esports: {
    id: 'esports',
    name: 'E-Sport / Gaming',
    category: 'precision',
    icon: '🎮',
    courtLabel: 'Server / Lobby',
    defaultTime: 35,
    scoreUnit: 'Kartor',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    presets: ["Ninjas in Pyjamas", "Fnatic", "FaZe Clan", "Natus Vincere", "Astralis", "Team Liquid"]
  }
};

interface Match {
  id: string;
  round: string;
  division?: string;
  p1: string;
  p2: string;
  s1: number;
  s2: number;
  winner?: string;
  date: string;
  time: string;
  court: string;
  isRescheduled?: boolean;
}

export default function App() {
  const [lang, setLang] = useState<Lang>('sv');
  const d = DICTS[lang];

  const [formatMode, setFormatMode] = useState<Mode>('league');
  const [selectedSport, setSelectedSport] = useState<string>('football');
  const currentSport = ALL_SPORTS[selectedSport] || ALL_SPORTS.football;

  const [activeTab, setActiveTab] = useState<'setup' | 'view' | 'live' | 'print' | 'pro'>('setup');

  const [divisions, setDivisions] = useState<string[]>(["Division 1", "Division 2"]);
  const [activeDivision, setActiveDivision] = useState<string>("Division 1");
  const [isDoubleRound, setIsDoubleRound] = useState(false);

  const [teamsByDiv, setTeamsByDiv] = useState<Record<string, string[]>>({
    "Division 1": currentSport.presets.slice(0, 4),
    "Division 2": currentSport.presets.slice(4, 6).concat(["Lag Alpha", "Lag Beta"])
  });
  const [newTeamInput, setNewTeamInput] = useState('');

  const [startDate, setStartDate] = useState('2026-09-05');
  const [startTime, setStartTime] = useState('10:00');
  const [numCourts, setNumCourts] = useState(2);
  const [matchInterval, setMatchInterval] = useState(currentSport.defaultTime);

  const [matches, setMatches] = useState<Match[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editCourt, setEditCourt] = useState('');
  const [isPro, setIsPro] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const activeTeams = teamsByDiv[activeDivision] || [];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Check URL params for Stripe return status
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment') === 'success') {
      setIsPro(true);
      showToast('🎉 Betalning genomförd! TournaSnap Pro är aktiverat.');
    } else if (query.get('payment') === 'cancelled') {
      showToast('Betalningen avbröts.');
    }
  }, []);

  // Real Stripe Checkout Trigger
  const handleStripeCheckout = async (planName: string, basePriceVal: number) => {
    setIsCheckingOut(true);
    showToast('Laddar säker Stripe Checkout...');

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: `${currentSport.name} (${planName})`,
          amount: basePriceVal,
          currency: d.currency,
          returnUrl: window.location.origin,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback for local testing if API endpoint isn't deployed yet
        console.warn('API Error, activating mock pro mode:', data.error);
        setIsPro(true);
        showToast('🚀 Pro aktiverat (lokalt testläge)!');
        setActiveTab('view');
      }
    } catch (err) {
      console.warn('Backend endpoint unreachable, activating mock mode for preview.');
      setIsPro(true);
      showToast('🚀 Pro aktiverat (lokalt testläge)!');
      setActiveTab('view');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSportChange = (sportKey: string) => {
    setSelectedSport(sportKey);
    const s = ALL_SPORTS[sportKey];
    setTeamsByDiv({
      "Division 1": s.presets.slice(0, 4),
      "Division 2": s.presets.slice(4, 6).concat(["Lag 1", "Lag 2"])
    });
    setMatchInterval(s.defaultTime);
    showToast(`${s.name} aktiverad!`);
  };

  const handleAddTeam = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const t = newTeamInput.trim();
    if (!t) return;
    if (activeTeams.includes(t)) {
      showToast('⚠️ Finns redan i divisionen');
      return;
    }
    setTeamsByDiv(prev => ({
      ...prev,
      [activeDivision]: [...(prev[activeDivision] || []), t]
    }));
    setNewTeamInput('');
  };

  const handleRemoveTeam = (teamName: string) => {
    setTeamsByDiv(prev => ({
      ...prev,
      [activeDivision]: prev[activeDivision].filter(t => t !== teamName)
    }));
  };

  const addDivision = () => {
    const nextNum = divisions.length + 1;
    const newDivName = `Division ${nextNum}`;
    setDivisions(prev => [...prev, newDivName]);
    setTeamsByDiv(prev => ({
      ...prev,
      [newDivName]: [`Lag A (${newDivName})`, `Lag B (${newDivName})`, `Lag C (${newDivName})`, `Lag D (${newDivName})`]
    }));
    setActiveDivision(newDivName);
    showToast(`➕ ${newDivName} skapad!`);
  };

  // Match Generator
  const generateEngine = () => {
    const courts = Array.from({ length: numCourts }, (_, i) => `${currentSport.courtLabel} ${i + 1}`);
    const [startH, startM] = startTime.split(':').map(Number);
    let curMinutes = (startH || 10) * 60 + (startM || 0);

    const generated: Match[] = [];

    if (formatMode === 'cup') {
      const list = activeTeams;
      if (list.length < 4) {
        showToast('⚠️ Minst 4 lag behövs för en cup');
        return;
      }
      const qfCount = list.length >= 8 ? 4 : 2;
      for (let i = 0; i < qfCount; i++) {
        const court = courts[i % numCourts];
        if (i > 0 && i % numCourts === 0) curMinutes += matchInterval;
        const hrs = String(Math.floor(curMinutes / 60)).padStart(2, '0');
        const mins = String(curMinutes % 60).padStart(2, '0');

        generated.push({
          id: `QF-${i + 1}`,
          round: 'QF',
          division: activeDivision,
          p1: list[i * 2] || `Lag ${i * 2 + 1}`,
          p2: list[i * 2 + 1] || `Lag ${i * 2 + 2}`,
          s1: 0,
          s2: 0,
          date: startDate,
          time: `${hrs}:${mins}`,
          court
        });
      }

      curMinutes += matchInterval + 15;
      for (let i = 0; i < 2; i++) {
        const court = courts[i % numCourts];
        const hrs = String(Math.floor(curMinutes / 60)).padStart(2, '0');
        const mins = String(curMinutes % 60).padStart(2, '0');
        generated.push({
          id: `SF-${i + 1}`,
          round: 'SF',
          division: activeDivision,
          p1: `Vinnare QF-${i * 2 + 1}`,
          p2: `Vinnare QF-${i * 2 + 2}`,
          s1: 0,
          s2: 0,
          date: startDate,
          time: `${hrs}:${mins}`,
          court
        });
      }

      curMinutes += matchInterval + 20;
      const hrs = String(Math.floor(curMinutes / 60)).padStart(2, '0');
      const mins = String(curMinutes % 60).padStart(2, '0');
      generated.push({
        id: 'F-1',
        round: 'F',
        division: activeDivision,
        p1: 'Vinnare SF-1',
        p2: 'Vinnare SF-2',
        s1: 0,
        s2: 0,
        date: startDate,
        time: `${hrs}:${mins}`,
        court: `${currentSport.courtLabel} 1 (Final)`
      });

    } else {
      let matchIdx = 1;
      divisions.forEach((divName) => {
        const dTeams = teamsByDiv[divName] || [];
        if (dTeams.length >= 2) {
          for (let i = 0; i < dTeams.length; i++) {
            for (let j = i + 1; j < dTeams.length; j++) {
              const court = courts[matchIdx % numCourts];
              if (matchIdx % numCourts === 0) curMinutes += matchInterval;
              const hrs = String(Math.floor(curMinutes / 60)).padStart(2, '0');
              const mins = String(curMinutes % 60).padStart(2, '0');

              generated.push({
                id: `M-${divName.replace(/\s+/g, '')}-${matchIdx}`,
                round: `Omgång ${Math.ceil(matchIdx / 2)}`,
                division: divName,
                p1: dTeams[i],
                p2: dTeams[j],
                s1: 0,
                s2: 0,
                date: startDate,
                time: `${hrs}:${mins}`,
                court
              });
              matchIdx++;
            }
          }

          if (isDoubleRound) {
            for (let i = 0; i < dTeams.length; i++) {
              for (let j = i + 1; j < dTeams.length; j++) {
                const court = courts[matchIdx % numCourts];
                if (matchIdx % numCourts === 0) curMinutes += matchInterval;
                const hrs = String(Math.floor(curMinutes / 60)).padStart(2, '0');
                const mins = String(curMinutes % 60).padStart(2, '0');

                generated.push({
                  id: `M-${divName.replace(/\s+/g, '')}-${matchIdx}`,
                  round: `Retur`,
                  division: divName,
                  p1: dTeams[j],
                  p2: dTeams[i],
                  s1: 0,
                  s2: 0,
                  date: startDate,
                  time: `${hrs}:${mins}`,
                  court
                });
                matchIdx++;
              }
            }
          }
        }
      });
    }

    setMatches(generated);
    setActiveTab('view');
    showToast(`⚡ ${d.generate}!`);
  };

  const handleScoreChange = (id: string, s1: number, s2: number) => {
    setMatches(prev => {
      const updated = prev.map(m => {
        if (m.id === id) {
          const winner = s1 > s2 ? m.p1 : s2 > s1 ? m.p2 : undefined;
          return { ...m, s1, s2, winner };
        }
        return m;
      });

      if (formatMode === 'cup') {
        const qf1 = updated.find(m => m.id === 'QF-1');
        const qf2 = updated.find(m => m.id === 'QF-2');
        const qf3 = updated.find(m => m.id === 'QF-3');
        const qf4 = updated.find(m => m.id === 'QF-4');
        const sf1 = updated.find(m => m.id === 'SF-1');
        const sf2 = updated.find(m => m.id === 'SF-2');

        return updated.map(m => {
          if (m.id === 'SF-1') {
            return { ...m, p1: qf1?.winner || 'Vinnare QF-1', p2: qf2?.winner || 'Vinnare QF-2' };
          }
          if (m.id === 'SF-2') {
            return { ...m, p1: qf3?.winner || 'Vinnare QF-3', p2: qf4?.winner || 'Vinnare QF-4' };
          }
          if (m.id === 'F-1') {
            return { ...m, p1: sf1?.winner || 'Vinnare SF-1', p2: sf2?.winner || 'Vinnare SF-2' };
          }
          return m;
        });
      }

      return updated;
    });
  };

  const currentStandings = useMemo(() => {
    const table: Record<string, { mp: number; w: number; d: number; l: number; diff: number; pts: number }> = {};
    activeTeams.forEach(t => {
      table[t] = { mp: 0, w: 0, d: 0, l: 0, diff: 0, pts: 0 };
    });

    matches.filter(m => m.division === activeDivision).forEach(m => {
      if ((m.s1 > 0 || m.s2 > 0) && table[m.p1] && table[m.p2]) {
        table[m.p1].mp += 1;
        table[m.p2].mp += 1;
        table[m.p1].diff += (m.s1 - m.s2);
        table[m.p2].diff += (m.s2 - m.s1);

        if (m.s1 > m.s2) {
          table[m.p1].w += 1;
          table[m.p1].pts += 3;
          table[m.p2].l += 1;
        } else if (m.s2 > m.s1) {
          table[m.p2].w += 1;
          table[m.p2].pts += 3;
          table[m.p1].l += 1;
        } else {
          table[m.p1].d += 1;
          table[m.p2].d += 1;
          table[m.p1].pts += 1;
          table[m.p2].pts += 1;
        }
      }
    });

    return Object.entries(table)
      .map(([name, stat]) => ({ name, ...stat }))
      .sort((a, b) => b.pts - a.pts || b.diff - a.diff);
  }, [activeTeams, matches, activeDivision]);

  const openReschedule = (m: Match) => {
    setEditingMatch(m);
    setEditDate(m.date);
    setEditTime(m.time);
    setEditCourt(m.court);
  };

  const hasConflict = useMemo(() => {
    if (!editingMatch) return false;
    return matches.some(m => 
      m.id !== editingMatch.id &&
      m.date === editDate &&
      m.time === editTime &&
      (m.court === editCourt || m.p1 === editingMatch.p1 || m.p2 === editingMatch.p2)
    );
  }, [editingMatch, editDate, editTime, editCourt, matches]);

  const saveReschedule = () => {
    if (!editingMatch) return;
    setMatches(prev => prev.map(m => m.id === editingMatch.id ? { ...m, date: editDate, time: editTime, court: editCourt, isRescheduled: true } : m));
    setEditingMatch(null);
    showToast('✅ Matchtiden uppdaterad!');
  };

  useEffect(() => {
    generateEngine();
  }, [selectedSport, formatMode]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans flex flex-col selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/90 px-4 sm:px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Zap className="w-5 h-5 fill-emerald-400" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
              <span>TournaSnap</span>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border rounded-full ${currentSport.badgeColor}`}>
                {currentSport.name}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Instant Brackets & Leagues • tournasnap.com</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sports Dropdown */}
          <div className="relative">
            <select
              value={selectedSport}
              onChange={(e) => handleSportChange(e.target.value)}
              className="bg-slate-900 border border-slate-700 hover:border-slate-500 text-white text-xs font-bold py-1.5 pl-2.5 pr-7 rounded-xl appearance-none cursor-pointer focus:outline-none focus:border-emerald-500 shadow-lg"
            >
              <optgroup label="🎾 Racketsport">
                <option value="padel">🎾 Padel</option>
                <option value="tennis">🎾 Tennis</option>
                <option value="pickleball">🥒 Pickleball</option>
                <option value="tabletennis">🏓 Bordtennis / Pingis</option>
                <option value="badminton">🏸 Badminton</option>
              </optgroup>
              <optgroup label="⚽ Lagsport & Boll">
                <option value="football">⚽ Fotboll / Futsal</option>
                <option value="basketball">🏀 Basket (5v5 / 3x3)</option>
                <option value="hockey">🏒 Ishockey / Rink</option>
                <option value="floorball">🏑 Innebandy</option>
                <option value="volleyball">🏐 Volleyboll / Beach</option>
                <option value="handball">🤾 Handboll</option>
              </optgroup>
              <optgroup label="🎯 Precision & Individuellt">
                <option value="darts">🎯 Darts</option>
                <option value="discgolf">🥏 Discgolf</option>
                <option value="chess">♟️ Schack</option>
                <option value="esports">🎮 E-Sport / Gaming</option>
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Languages */}
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => { setLang(e.target.value as Lang); showToast(`Språk: ${DICTS[e.target.value as Lang].name}`); }}
              className="bg-slate-900 border border-slate-700 hover:border-slate-600 text-white text-xs font-bold py-1.5 pl-2.5 pr-7 rounded-xl appearance-none cursor-pointer focus:outline-none focus:border-emerald-500"
            >
              {(Object.keys(DICTS) as Lang[]).map(l => (
                <option key={l} value={l}>
                  {DICTS[l].flag} {DICTS[l].name}
                </option>
              ))}
            </select>
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Mode Pill */}
          <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-0.5">
            <button
              onClick={() => setFormatMode('cup')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                formatMode === 'cup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cup</span>
            </button>
            <button
              onClick={() => setFormatMode('league')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                formatMode === 'league' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Liga</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab('pro')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition shadow-lg ${
              isPro ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isPro ? "PRO AKTIV" : `+ PRO (${formatMode === 'league' ? d.priceLeague : d.priceSmall})`}</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl w-full mx-auto px-4 pt-4 flex gap-2">
        {[
          { id: 'setup', label: d.tabSetup, icon: Users },
          { id: 'view', label: formatMode === 'cup' ? d.tabBracket : d.tabLeague, icon: formatMode === 'cup' ? Trophy : Layers },
          { id: 'live', label: d.tabLive, icon: Eye },
          { id: 'print', label: d.tabPrint, icon: Printer },
          { id: 'pro', label: d.tabPro, icon: DollarSign },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-slate-100 text-slate-950 shadow-lg' 
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main View */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">

        {/* 1. SETUP TAB */}
        {activeTab === 'setup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl">
            
            {/* Left: Divisions & Teams */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{currentSport.icon}</span>
                  <div>
                    <h2 className="text-sm font-bold text-white">{currentSport.name} ({activeTeams.length})</h2>
                    <p className="text-[11px] text-slate-400">{d.tableTeam}</p>
                  </div>
                </div>
                {formatMode === 'league' && (
                  <button 
                    onClick={addDivision}
                    className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{d.newDiv}</span>
                  </button>
                )}
              </div>

              {formatMode === 'league' && (
                <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {divisions.map(divName => (
                    <button
                      key={divName}
                      onClick={() => setActiveDivision(divName)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition flex-1 text-center ${
                        activeDivision === divName ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {divName} ({teamsByDiv[divName]?.length || 0})
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleAddTeam} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`${d.addTeam}...`}
                  value={newTeamInput}
                  onChange={(e) => setNewTeamInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{d.addTeam}</span>
                </button>
              </form>

              <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                {activeTeams.map((t, idx) => (
                  <div key={t + idx} className="flex items-center justify-between bg-slate-950 border border-slate-800/80 px-3 py-2 rounded-xl text-xs group">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="font-mono text-slate-500 text-[11px]">#{idx + 1}</span>
                      <span className="font-medium">{t}</span>
                    </span>
                    <button
                      onClick={() => handleRemoveTeam(t)}
                      className="text-slate-500 hover:text-red-400 p-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Settings */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>{d.newDate} & {d.newTime}</span>
                  </h2>
                  <span className="text-xs font-mono text-emerald-400">{currentSport.scoreUnit}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">{d.newDate}</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">{d.newTime}</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">{currentSport.courtLabel}</label>
                    <select
                      value={numCourts}
                      onChange={(e) => setNumCourts(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                    >
                      <option value={1}>1 {currentSport.courtLabel}</option>
                      <option value={2}>2 {currentSport.courtLabel}</option>
                      <option value={4}>4 {currentSport.courtLabel}</option>
                      <option value={8}>8 {currentSport.courtLabel}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Intervall (min)</label>
                    <select
                      value={matchInterval}
                      onChange={(e) => setMatchInterval(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                    >
                      <option value={15}>15 min</option>
                      <option value={20}>20 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>60 min</option>
                    </select>
                  </div>
                </div>

                {formatMode === 'league' && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{d.doubleRound}</span>
                      <span className="text-slate-400 text-[11px]">{d.doubleRoundDesc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isDoubleRound}
                      onChange={(e) => setIsDoubleRound(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={generateEngine}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition shadow-xl shadow-emerald-500/20 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{d.generate}</span>
              </button>
            </div>

          </div>
        )}

        {/* 2. VIEW TAB */}
        {activeTab === 'view' && (
          <div className="space-y-6">
            {formatMode === 'league' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <div className="flex gap-2">
                    {divisions.map(divName => (
                      <button
                        key={divName}
                        onClick={() => setActiveDivision(divName)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                          activeDivision === divName ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white bg-slate-950'
                        }`}
                      >
                        {divName}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    {matches.filter(m => m.division === activeDivision).length} Matcher
                  </span>
                </div>

                {/* Standings */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>{activeDivision} – {d.tabLeague}</span>
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                        <tr>
                          <th className="p-3">{d.tableRank}</th>
                          <th className="p-3">{d.tableTeam}</th>
                          <th className="p-3 text-center">{d.tableP}</th>
                          <th className="p-3 text-center">{d.tableW}</th>
                          <th className="p-3 text-center">{d.tableD}</th>
                          <th className="p-3 text-center">{d.tableL}</th>
                          <th className="p-3 text-center">{d.tableDiff}</th>
                          <th className="p-3 text-center font-bold text-emerald-400">{d.tablePts}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {currentStandings.map((t, idx) => (
                          <tr key={t.name} className="hover:bg-slate-800/30 transition">
                            <td className="p-3 text-slate-500 font-bold">{idx + 1}</td>
                            <td className="p-3 font-sans font-semibold text-slate-200">{t.name}</td>
                            <td className="p-3 text-center">{t.mp}</td>
                            <td className="p-3 text-center text-emerald-400">{t.w}</td>
                            <td className="p-3 text-center text-slate-400">{t.d}</td>
                            <td className="p-3 text-center text-red-400">{t.l}</td>
                            <td className="p-3 text-center">{t.diff > 0 ? `+${t.diff}` : t.diff}</td>
                            <td className="p-3 text-center font-black text-emerald-400">{t.pts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Match Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matches.filter(m => m.division === activeDivision).map(m => (
                    <div key={m.id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between text-xs hover:border-slate-700 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span className="text-indigo-400 font-bold">{m.time}</span>
                          <span>•</span>
                          <span>{m.court}</span>
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{m.round}</span>
                          {m.isRescheduled && <span className="text-amber-400">⚠️</span>}
                        </div>
                        <div className="font-semibold text-slate-200">
                          {m.p1} <span className="text-slate-500 font-normal">vs</span> {m.p2}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={m.s1}
                          onChange={(e) => handleScoreChange(m.id, parseInt(e.target.value) || 0, m.s2)}
                          className="w-10 bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center font-mono focus:border-emerald-500 focus:outline-none"
                        />
                        <span className="text-slate-600">-</span>
                        <input
                          type="number"
                          value={m.s2}
                          onChange={(e) => handleScoreChange(m.id, m.s1, parseInt(e.target.value) || 0)}
                          className="w-10 bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center font-mono focus:border-emerald-500 focus:outline-none"
                        />
                        <button onClick={() => openReschedule(m)} className="p-1 hover:text-emerald-400 text-slate-500 ml-1" title={d.reschedule}>
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              /* Cup Bracket */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Kvartsfinaler
                  </span>
                  {matches.filter(m => m.round === 'QF').map(m => (
                    <div key={m.id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-indigo-400 font-bold">{m.time}</span>
                        <span>{m.court}</span>
                        <button onClick={() => openReschedule(m)} className="text-slate-500 hover:text-emerald-400">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className={`truncate ${m.winner === m.p1 ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>{m.p1}</span>
                        <input
                          type="number"
                          value={m.s1}
                          onChange={(e) => handleScoreChange(m.id, parseInt(e.target.value) || 0, m.s2)}
                          className="w-10 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-center font-mono"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className={`truncate ${m.winner === m.p2 ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>{m.p2}</span>
                        <input
                          type="number"
                          value={m.s2}
                          onChange={(e) => handleScoreChange(m.id, m.s1, parseInt(e.target.value) || 0)}
                          className="w-10 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-center font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Semifinaler
                  </span>
                  {matches.filter(m => m.round === 'SF').map(m => (
                    <div key={m.id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-cyan-400 font-bold">{m.time}</span>
                        <span>{m.court}</span>
                        <button onClick={() => openReschedule(m)} className="text-slate-500 hover:text-emerald-400">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className={`truncate ${m.winner === m.p1 ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>{m.p1}</span>
                        <input
                          type="number"
                          value={m.s1}
                          onChange={(e) => handleScoreChange(m.id, parseInt(e.target.value) || 0, m.s2)}
                          className="w-10 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-center font-mono"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className={`truncate ${m.winner === m.p2 ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>{m.p2}</span>
                        <input
                          type="number"
                          value={m.s2}
                          onChange={(e) => handleScoreChange(m.id, m.s1, parseInt(e.target.value) || 0)}
                          className="w-10 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-center font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    Grand Final
                  </span>
                  {matches.filter(m => m.round === 'F').map(m => (
                    <div key={m.id} className="bg-slate-900 border-2 border-amber-500/40 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-amber-300">
                        <span className="font-bold">{m.time}</span>
                        <span className="bg-amber-500/20 px-2 py-0.5 rounded font-bold">{m.court}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{m.p1}</span>
                        <input
                          type="number"
                          value={m.s1}
                          onChange={(e) => handleScoreChange(m.id, parseInt(e.target.value) || 0, m.s2)}
                          className="w-10 bg-slate-950 border border-amber-500/40 rounded px-1.5 py-1 text-center font-mono font-bold"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{m.p2}</span>
                        <input
                          type="number"
                          value={m.s2}
                          onChange={(e) => handleScoreChange(m.id, m.s1, parseInt(e.target.value) || 0)}
                          className="w-10 bg-slate-950 border border-amber-500/40 rounded px-1.5 py-1 text-center font-mono font-bold"
                        />
                      </div>
                      {m.winner && (
                        <div className="bg-amber-500/20 border border-amber-500/40 p-2.5 rounded-xl text-center text-xs font-black text-amber-300">
                          🏆 {d.champ}: {m.winner}!
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. LIVE TAB */}
        {activeTab === 'live' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-md mx-auto space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
              <Share2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white">{d.tabLive}</h2>
            <p className="text-xs text-slate-400">{d.proDesc}</p>
            <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl">
              <div className="w-36 h-36 bg-slate-950 flex flex-col items-center justify-center text-white text-[11px] font-mono rounded-xl p-2 text-center">
                <span className="text-3xl mb-1">{currentSport.icon}</span>
                <span>TOURNA-SNAP</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-mono text-emerald-400">
              <span className="truncate flex-1">https://tournasnap.com/live/snap-8831</span>
              <button 
                onClick={() => showToast('📋 Länk kopierad!')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 4. PRINT TAB */}
        {activeTab === 'print' && (
          <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-2xl mx-auto space-y-6 shadow-2xl">
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight">{currentSport.name}</h1>
                <p className="text-xs text-slate-600">Powered by <strong>TournaSnap.com</strong> • {startDate}</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <Printer className="w-3.5 h-3.5" /> {d.tabPrint}
              </button>
            </div>
            <table className="w-full text-xs text-left">
              <thead className="border-b border-slate-300 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2">{d.newTime}</th>
                  <th className="py-2">{currentSport.courtLabel}</th>
                  <th className="py-2">Match</th>
                  <th className="py-2 text-right">{currentSport.scoreUnit}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {matches.filter(m => formatMode === 'cup' || m.division === activeDivision).map(m => (
                  <tr key={m.id}>
                    <td className="py-2.5 font-bold">{m.time}</td>
                    <td className="py-2.5 text-slate-600">{m.court}</td>
                    <td className="py-2.5 font-sans font-semibold">{m.p1} vs {m.p2}</td>
                    <td className="py-2.5 text-right font-bold">{m.s1} - {m.s2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. PRO PASS STRIPE CHECKOUT */}
        {activeTab === 'pro' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{d.proPass}</h2>
              <p className="text-xs text-slate-400 mt-1">{d.proDesc}</p>
            </div>

            <div className="space-y-2.5 text-xs text-left">
              {formatMode === 'cup' ? (
                <>
                  <div 
                    onClick={() => handleStripeCheckout('Liten Cup', d.priceSmallVal)}
                    className="p-3.5 bg-slate-950 border border-emerald-500/30 hover:border-emerald-400 rounded-2xl flex justify-between items-center text-emerald-300 cursor-pointer transition"
                  >
                    <span className="font-medium">Liten Cup (&le; 8 lag)</span>
                    <span className="font-bold font-mono">{d.priceSmall}</span>
                  </div>
                  <div 
                    onClick={() => handleStripeCheckout('Medel Cup', d.priceMedVal)}
                    className="p-3.5 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-2xl flex justify-between items-center text-slate-300 cursor-pointer transition"
                  >
                    <span className="font-medium">Medel Cup (9-16 lag)</span>
                    <span className="font-bold font-mono">{d.priceMed}</span>
                  </div>
                </>
              ) : (
                <div 
                  onClick={() => handleStripeCheckout(`Seriespel (${divisions.length} div)`, d.priceLeagueVal * divisions.length)}
                  className="p-3.5 bg-slate-950 border border-emerald-500/30 hover:border-emerald-400 rounded-2xl flex justify-between items-center text-emerald-300 font-bold cursor-pointer transition"
                >
                  <span className="font-medium">Seriespel ({divisions.length} divisioner)</span>
                  <span className="font-mono">{divisions.length * d.priceLeagueVal} {d.currency}</span>
                </div>
              )}
            </div>

            <button
              disabled={isCheckingOut}
              onClick={() => handleStripeCheckout(
                formatMode === 'cup' ? 'Cup Pass' : `Seriespel (${divisions.length} div)`,
                formatMode === 'cup' ? d.priceSmallVal : d.priceLeagueVal * divisions.length
              )}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{isCheckingOut ? 'Laddar Stripe...' : d.payBtn}</span>
            </button>
          </div>
        )}

      </main>

      {/* RESCHEDULE MODAL */}
      {editingMatch && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span>{d.reschedule}</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">{editingMatch.id}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">{d.newDate}</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{d.newTime}</label>
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{currentSport.courtLabel}</label>
                <select
                  value={editCourt}
                  onChange={(e) => setEditCourt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value={`${currentSport.courtLabel} 1`}>{currentSport.courtLabel} 1</option>
                  <option value={`${currentSport.courtLabel} 2`}>{currentSport.courtLabel} 2</option>
                  <option value={`${currentSport.courtLabel} 3`}>{currentSport.courtLabel} 3</option>
                </select>
              </div>

              {hasConflict && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-start gap-2 text-amber-300 text-xs">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{d.conflict}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditingMatch(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
              >
                {d.cancel}
              </button>
              <button
                onClick={saveReschedule}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold"
              >
                {d.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
