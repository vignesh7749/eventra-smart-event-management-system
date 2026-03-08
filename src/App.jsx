import { useState, useEffect } from "react";

const NAV_LINKS = ["Home", "Campus Events", "Founders Day", "Campus Map", "Upcoming Events", "Leaderboard", "Live Stream", "Gallery"];

const EVENTS = [
  { id: 1, title: "Tech Summit 2026", date: "Mar 15, 2026", location: "Auditorium A", club: "IEEE Club", color: "#6366f1", emoji: "💻" },
  { id: 2, title: "Cultural Fiesta", date: "Mar 22, 2026", location: "Open Ground", club: "Cultural Society", color: "#ec4899", emoji: "🎭" },
  { id: 3, title: "Hackathon 48H", date: "Apr 5, 2026", location: "Lab Block", club: "Coding Club", color: "#22c55e", emoji: "🚀" },
  { id: 4, title: "Sports Meet 2026", date: "Apr 12, 2026", location: "Sports Arena", club: "Sports Council", color: "#f59e0b", emoji: "🏆" },
  { id: 5, title: "Photography Walk", date: "Apr 18, 2026", location: "Campus Wide", club: "Photo Club", color: "#06b6d4", emoji: "📸" },
  { id: 6, title: "Music Night", date: "Apr 25, 2026", location: "Amphitheatre", club: "Music Society", color: "#a855f7", emoji: "🎵" },
];

const UPCOMING = [
  { title: "AI Workshop", date: "Mar 10", emoji: "🤖", color: "#6366f1" },
  { title: "Design Sprint", date: "Mar 12", emoji: "🎨", color: "#ec4899" },
  { title: "Debate League", date: "Mar 14", emoji: "🗣️", color: "#22c55e" },
  { title: "Film Festival", date: "Mar 16", emoji: "🎬", color: "#f59e0b" },
  { title: "Yoga Camp", date: "Mar 18", emoji: "🧘", color: "#06b6d4" },
];

const STUDENTS = [
  { rank: 1, name: "Aisha Rahman", events: 24, points: 2840, medal: "🥇" },
  { rank: 2, name: "Rahul Verma", events: 21, points: 2510, medal: "🥈" },
  { rank: 3, name: "Priya Nair", events: 19, points: 2290, medal: "🥉" },
  { rank: 4, name: "Dev Sharma", events: 17, points: 1980, medal: "" },
  { rank: 5, name: "Tanya Gupta", events: 15, points: 1750, medal: "" },
];

const CLUBS = [
  { rank: 1, name: "IEEE Club", hosted: 18, score: 9400, medal: "🥇" },
  { rank: 2, name: "Cultural Society", hosted: 15, score: 8200, medal: "🥈" },
  { rank: 3, name: "Coding Club", hosted: 14, score: 7850, medal: "🥉" },
  { rank: 4, name: "Sports Council", hosted: 12, score: 6900, medal: "" },
  { rank: 5, name: "Photo Club", hosted: 10, score: 5600, medal: "" },
];

const MAP_LOCATIONS = [
  { id: 1, name: "Main Auditorium", x: 42, y: 28, color: "#6366f1" },
  { id: 2, name: "Sports Arena", x: 72, y: 55, color: "#22c55e" },
  { id: 3, name: "Lab Block", x: 25, y: 62, color: "#f59e0b" },
  { id: 4, name: "Amphitheatre", x: 60, y: 75, color: "#ec4899" },
  { id: 5, name: "Open Ground", x: 48, y: 50, color: "#06b6d4" },
];

export default function App() {
  const [activePage, setActivePage] = useState("Home");
  const [activePin, setActivePin] = useState(null);
  const [formData, setFormData] = useState({ title: "", desc: "", category: "", date: "", location: "", max: "" });
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState(null); // { name, email, role: "student"|"admin" }
  const [showLogin, setShowLogin] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [regModal, setRegModal] = useState(null);
  const [showPropose, setShowPropose] = useState(false);
  const [proposedEvents, setProposedEvents] = useState([
    { id: "prop_1", title: "Robotics Showcase", desc: "Annual robotics competition featuring student-built bots.", category: "Technical", date: "2026-05-10", location: "Lab Block B", max: "150", club: "Robotics Club", emoji: "🤖", color: "#06b6d4", status: "pending", proposedBy: "ravi@college.edu" },
    { id: "prop_2", title: "Open Mic Night", desc: "An evening of poetry, stand-up and spoken word.", category: "Cultural", date: "2026-05-18", location: "Amphitheatre", max: "300", club: "Literary Club", emoji: "🎤", color: "#a855f7", status: "pending", proposedBy: "meera@college.edu" },
    { id: "prop_3", title: "Eco-Campus Drive", desc: "Campus-wide sustainability and tree-planting drive.", category: "Social", date: "2026-05-22", location: "Open Ground", max: "500", club: "Eco Club", emoji: "🌱", color: "#22c55e", status: "pending", proposedBy: "arjun@college.edu" },
  ]);
  const [liveEvents, setLiveEvents] = useState([...EVENTS]); // admin can edit these
  const [photoSubmissions, setPhotoSubmissions] = useState([
    { id: "ps_1", emoji: "🎓", title: "Convocation 2025", caption: "Proud moment for our batch!", category: "Academic", submittedBy: "priya@college.edu", submittedAt: "Mar 1, 2026", color: "#f59e0b", status: "pending" },
    { id: "ps_2", emoji: "🏆", title: "Sports Day Victory", caption: "Our team won gold!", category: "Sports", submittedBy: "rahul@college.edu", submittedAt: "Mar 3, 2026", color: "#22c55e", status: "pending" },
  ]);

  const submitPhoto = (photo) => {
    setPhotoSubmissions(p => [...p, { ...photo, id: `ps_${Date.now()}`, status: "pending" }]);
  };
  const approvePhoto = (id) => setPhotoSubmissions(p => p.map(x => x.id === id ? { ...x, status: "approved" } : x));
  const rejectPhoto = (id) => setPhotoSubmissions(p => p.map(x => x.id === id ? { ...x, status: "rejected" } : x));

  const handleSubmit = () => {
    if (formData.title && formData.date) { setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); }
  };

  const openReg = (event) => {
    if (!user) { setShowLogin(true); return; }
    setRegModal(event);
  };

  const confirmReg = (eventId) => {
    setRegisteredEvents(p => ({ ...p, [eventId]: true }));
    setRegModal(null);
  };

  const proposeEvent = (data) => {
    const newEvent = { ...data, id: `prop_${Date.now()}`, status: "pending", proposedBy: user?.email || "student@college.edu" };
    setProposedEvents(p => [...p, newEvent]);
    setShowPropose(false);
  };

  const acceptProposal = (id) => {
    const prop = proposedEvents.find(p => p.id === id);
    if (prop) {
      const accepted = { ...prop, id: Date.now(), date: prop.date, status: "accepted" };
      setLiveEvents(p => [...p, accepted]);
      setProposedEvents(p => p.map(e => e.id === id ? { ...e, status: "accepted" } : e));
    }
  };

  const rejectProposal = (id) => {
    setProposedEvents(p => p.map(e => e.id === id ? { ...e, status: "rejected" } : e));
  };

  const updateEvent = (updatedEvent) => {
    setLiveEvents(p => p.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = (id) => {
    setLiveEvents(p => p.filter(e => e.id !== id));
  };

  const addEvent = (ev) => setLiveEvents(p => [...p, ev]);

  // Admin portal — full-screen takeover
  if (user?.role === "admin") {
    return <AdminPortal user={user} setUser={setUser} proposedEvents={proposedEvents} liveEvents={liveEvents}
      acceptProposal={acceptProposal} rejectProposal={rejectProposal} updateEvent={updateEvent} deleteEvent={deleteEvent} addEvent={addEvent}
      photoSubmissions={photoSubmissions} approvePhoto={approvePhoto} rejectPhoto={rejectPhoto} />;
  }

  return (
    <div style={{ fontFamily: "'Outfit', 'Syne', sans-serif", background: "#080c14", minHeight: "100vh", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0d1117; } ::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 3px; }
        .nav-link { cursor: pointer; padding: 8px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #94a3b8; transition: all 0.2s; }
        .nav-link:hover { color: #e2e8f0; background: rgba(99,102,241,0.15); }
        .nav-link.active { color: #fff; background: rgba(99,102,241,0.25); }
        .event-card { background: #0f1623; border: 1px solid #1e2a3a; border-radius: 16px; overflow: hidden; transition: all 0.3s; cursor: pointer; }
        .event-card:hover { transform: translateY(-4px); border-color: #4f46e5; box-shadow: 0 20px 40px rgba(79,70,229,0.2); }
        .btn-primary { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; border: none; padding: 10px 22px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.2s; font-family: inherit; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(79,70,229,0.4); }
        .btn-outline { background: transparent; color: #a5b4fc; border: 1px solid #3730a3; padding: 10px 22px; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.2s; font-family: inherit; }
        .btn-outline:hover { background: rgba(79,70,229,0.1); border-color: #6366f1; }
        .input-dark { background: #0f1623; border: 1px solid #1e2a3a; color: #e2e8f0; padding: 12px 16px; border-radius: 10px; font-size: 14px; width: 100%; font-family: inherit; transition: border-color 0.2s; outline: none; }
        .input-dark:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
        .section-title { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #e2e8f0 0%, #818cf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .glow-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        .upcoming-card { background: #0f1623; border: 1px solid #1e2a3a; border-radius: 14px; padding: 20px; min-width: 160px; text-align: center; transition: all 0.3s; cursor: pointer; }
        .upcoming-card:hover { transform: translateY(-3px); border-color: #4f46e5; }
        .rank-row { background: #0f1623; border: 1px solid #1e2a3a; border-radius: 12px; padding: 14px 20px; display: flex; align-items: center; gap: 16px; transition: all 0.2s; }
        .rank-row:hover { border-color: #374151; }
        .rank-row.top { border-color: rgba(99,102,241,0.4); background: linear-gradient(135deg, rgba(79,70,229,0.08) 0%, #0f1623 100%); }
        .map-pin { position: absolute; width: 14px; height: 14px; border-radius: 50%; cursor: pointer; transform: translate(-50%,-50%); transition: all 0.2s; border: 2px solid rgba(255,255,255,0.3); }
        .map-pin:hover { transform: translate(-50%,-50%) scale(1.5); }
        .map-pin.active { transform: translate(-50%,-50%) scale(1.8); border-color: white; }
        .hero-bg { background: radial-gradient(ellipse at 20% 50%, rgba(79,70,229,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.1) 0%, transparent 50%), #080c14; }
        .founders-card { background: linear-gradient(135deg, #0d1117 0%, #12182b 50%, #0d1117 100%); border: 1px solid rgba(99,102,241,0.3); border-radius: 20px; position: relative; overflow: hidden; }
        .founders-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #4f46e5, #7c3aed, transparent); }
        textarea.input-dark { resize: vertical; min-height: 100px; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; }
        .modal-box { background: #0f1623; border: 1px solid #1e2a3a; border-radius: 20px; padding: 40px; width: 400px; position: relative; }
        .live-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 700; color: #f87171; letter-spacing: 0.05em; }
        @keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .live-dot { width: 7px; height: 7px; border-radius: 50%; background: #ef4444; animation: livepulse 1.2s infinite; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#4f46e5,#7c3aed); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; color: white; cursor: pointer; border: 2px solid #3730a3; }
        .stream-card { background: #0f1623; border: 1px solid #1e2a3a; border-radius: 16px; overflow: hidden; transition: all 0.3s; cursor: pointer; }
        .stream-card:hover { transform: translateY(-3px); border-color: #ef4444; box-shadow: 0 16px 40px rgba(239,68,68,0.15); }
        .gallery-item { position: relative; overflow: hidden; border-radius: 14px; cursor: pointer; background: #0f1623; border: 1px solid #1e2a3a; transition: all 0.35s; }
        .gallery-item:hover { transform: scale(1.02); border-color: #4f46e5; box-shadow: 0 20px 50px rgba(79,70,229,0.25); }
        .gallery-item:hover .gallery-overlay { opacity: 1; }
        .gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,12,20,0.92) 0%, rgba(8,12,20,0.3) 50%, transparent 100%); opacity: 0; transition: opacity 0.3s; display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; }
        .lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.92); backdrop-filter: blur(16px); z-index: 300; display: flex; align-items: center; justify-content: center; }
        .filter-btn { padding: 8px 18px; border-radius: 20px; border: 1px solid #1e2a3a; background: transparent; color: #64748b; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .filter-btn.active { background: rgba(79,70,229,0.2); border-color: #4f46e5; color: #a5b4fc; }
        .filter-btn:hover { border-color: #374151; color: #94a3b8; }

        /* ── RESPONSIVE ── */
        .page-pad { padding: 60px 80px; }
        .hero-section { padding: 100px 80px 80px; display: flex; align-items: center; gap: 60px; }
        .hero-title { font-size: 56px; }
        .hero-mock { display: flex; }
        .events-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        .upcoming-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
        .founders-inner { display: flex; gap: 60px; align-items: center; }
        .founders-pad { padding: 56px 60px; }
        .founders-title { font-size: 48px; }
        .gallery-cols { columns: 3 280px; column-gap: 20px; }
        .nav-links-row { display: flex; gap: 2px; flex: 1; }
        .nav-hamburger { display: none; background: none; border: none; color: #e2e8f0; cursor: pointer; padding: 8px; font-size: 22px; }
        .nav-mobile-drawer { display: none; position: fixed; inset: 0; top: 64px; background: rgba(8,12,20,0.97); backdrop-filter: blur(20px); z-index: 99; flex-direction: column; padding: 24px 20px; gap: 8px; overflow-y: auto; }
        .nav-mobile-drawer.open { display: flex; }
        .bottom-nav { display: none; }

        @media (max-width: 1024px) {
          .page-pad { padding: 48px 40px 80px; }
          .hero-section { padding: 80px 40px 60px; gap: 40px; }
          .hero-title { font-size: 44px; }
          .events-grid { grid-template-columns: repeat(2,1fr); }
          .upcoming-grid { grid-template-columns: repeat(2,1fr); }
          .founders-inner { gap: 36px; }
          .gallery-cols { columns: 2 200px; }
        }

        @media (max-width: 768px) {
          .page-pad { padding: 24px 16px 90px; }
          .hero-section { padding: 32px 16px 40px; flex-direction: column !important; gap: 28px; }
          .hero-title { font-size: 30px; }
          .hero-mock { display: none !important; }
          .events-grid { grid-template-columns: 1fr !important; gap: 14px; }
          .upcoming-grid { grid-template-columns: repeat(2,1fr) !important; gap: 12px; }
          .founders-inner { flex-direction: column !important; gap: 20px; }
          .founders-pad { padding: 24px 18px !important; }
          .founders-title { font-size: 28px !important; }
          .gallery-cols { columns: 2 130px !important; column-gap: 10px; }
          .section-title { font-size: 22px !important; }
          .nav-links-row { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .bottom-nav { display: flex !important; }
          .modal-box { width: 95vw !important; padding: 24px 18px !important; border-radius: 20px 20px 0 0 !important; }
          .modal-overlay { align-items: flex-end !important; }
          .rank-row { padding: 10px 12px; gap: 10px; }
          .filter-btn { padding: 6px 12px; font-size: 12px; }
        }

        @media (max-width: 480px) {
          .page-pad { padding: 16px 12px 90px; }
          .gallery-cols { columns: 2 100px !important; column-gap: 8px; }
        }
      `}</style>

      {/* LOGIN MODAL */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={(u) => { setUser(u); setShowLogin(false); }} />}

      {/* REGISTRATION MODAL */}
      {regModal && <RegModal event={regModal} user={user} onClose={() => setRegModal(null)} onConfirm={confirmReg} />}

      {/* PROPOSE EVENT MODAL */}
      {showPropose && <ProposeEventModal user={user} onClose={() => setShowPropose(false)} onSubmit={proposeEvent} />}

      {/* NAVBAR */}
      <MobileNav activePage={activePage} setActivePage={setActivePage} user={user} setUser={setUser} setShowLogin={setShowLogin} setShowPropose={setShowPropose} />

      {/* PAGES */}
      {activePage === "Home" && <HomePage setActivePage={setActivePage} events={liveEvents} upcoming={UPCOMING} openReg={openReg} registeredEvents={registeredEvents} />}
      {activePage === "Campus Events" && <CampusEventsPage events={liveEvents} openReg={openReg} registeredEvents={registeredEvents} />}
      {activePage === "Founders Day" && <FoundersDayPage openReg={openReg} registeredEvents={registeredEvents} />}
      {activePage === "Campus Map" && <CampusMapPage locations={MAP_LOCATIONS} activePin={activePin} setActivePin={setActivePin} />}
      {activePage === "Upcoming Events" && <UpcomingEventsPage upcoming={UPCOMING} openReg={openReg} registeredEvents={registeredEvents} />}
      {activePage === "Leaderboard" && <LeaderboardPage students={STUDENTS} clubs={CLUBS} />}
      {activePage === "Live Stream" && <LiveStreamPage />}
      {activePage === "Gallery" && <GalleryPage user={user} onLoginRequired={() => setShowLogin(true)} submitPhoto={submitPhoto} photoSubmissions={photoSubmissions} />}
    </div>
  );
}

// ─────────────────────────────────────────────
//  MOBILE-RESPONSIVE NAVBAR
// ─────────────────────────────────────────────
const BOTTOM_NAV = [
  { key: "Home",           icon: "🏠" },
  { key: "Campus Events",  icon: "📋" },
  { key: "Upcoming Events",icon: "⏳" },
  { key: "Gallery",        icon: "🖼️" },
  { key: "Leaderboard",    icon: "🏆" },
];

function MobileNav({ activePage, setActivePage, user, setUser, setShowLogin, setShowPropose }) {
  const [open, setOpen] = useState(false);

  const go = (page) => { setActivePage(page); setOpen(false); };

  return (
    <>
      {/* Top bar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,12,20,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid #1e2a3a", padding: "0 20px", display: "flex", alignItems: "center", height: 64, gap: 12 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⚡</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 19, background: "linear-gradient(135deg,#818cf8,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EVENTRA</span>
        </div>

        {/* Desktop nav links */}
        <div className="nav-links-row">
          {NAV_LINKS.map(l => (
            <span key={l} className={`nav-link ${activePage === l ? "active" : ""}`} onClick={() => go(l)}
              style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              {l === "Live Stream" ? (<><span className="live-dot" />{l}</>) : l}
            </span>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="nav-links-row" style={{ flex: "0 0 auto", gap: 10 }}>
          <button className="btn-outline" style={{ fontSize: 13, padding: "8px 14px" }} onClick={() => { if (!user) setShowLogin(true); else setShowPropose(true); }}>💡 Propose</button>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setUser(null)}>
              <div className="avatar">{user.name[0].toUpperCase()}</div>
              <div style={{ fontSize: 12 }}>
                <div style={{ color: "#e2e8f0", fontWeight: 600 }}>{user.name}</div>
                <div style={{ color: "#475569", fontSize: 10 }}>Tap to logout</div>
              </div>
            </div>
          ) : (
            <button className="btn-outline" onClick={() => setShowLogin(true)}>Login</button>
          )}
        </div>

        {/* Mobile right side */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {user ? (
            <div className="avatar nav-hamburger" onClick={() => setUser(null)}>{user.name[0].toUpperCase()}</div>
          ) : (
            <button className="btn-primary nav-hamburger" style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => setShowLogin(true)}>Login</button>
          )}
          <button className="nav-hamburger" onClick={() => setOpen(p => !p)} style={{ fontSize: 24, lineHeight: 1 }}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-mobile-drawer ${open ? "open" : ""}`}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.1em", padding: "4px 8px", marginBottom: 4 }}>NAVIGATION</div>
        {NAV_LINKS.map(l => (
          <div key={l} onClick={() => go(l)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 12, cursor: "pointer", background: activePage === l ? "rgba(99,102,241,0.2)" : "transparent", border: `1px solid ${activePage === l ? "rgba(99,102,241,0.4)" : "transparent"}`, color: activePage === l ? "#a5b4fc" : "#94a3b8", fontWeight: activePage === l ? 700 : 500, fontSize: 15, transition: "all 0.15s" }}>
            <span>{l === "Live Stream" ? "🔴" : l === "Home" ? "🏠" : l === "Campus Events" ? "📋" : l === "Founders Day" ? "🎓" : l === "Campus Map" ? "🗺️" : l === "Upcoming Events" ? "⏳" : l === "Leaderboard" ? "🏆" : l === "Gallery" ? "🖼️" : "📺"}</span>
            {l}
            {l === "Live Stream" && <span className="live-dot" style={{ marginLeft: "auto" }} />}
          </div>
        ))}
        <div style={{ height: 1, background: "#1e2a3a", margin: "12px 0" }} />
        <div onClick={() => { if (!user) setShowLogin(true); else setShowPropose(true); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 12, cursor: "pointer", color: "#22c55e", fontWeight: 600, fontSize: 15 }}>💡 Propose an Event</div>
        {user && <div onClick={() => { setUser(null); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 12, cursor: "pointer", color: "#f87171", fontWeight: 600, fontSize: 15 }}>← Logout ({user.name})</div>}
      </div>

      {/* Bottom nav (mobile only) */}
      <nav className="bottom-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(8,12,20,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid #1e2a3a", height: 64, alignItems: "center", justifyContent: "space-around", padding: "0 4px" }}>
        {BOTTOM_NAV.map(n => (
          <div key={n.key} onClick={() => setActivePage(n.key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 10px", borderRadius: 10, cursor: "pointer", flex: 1, transition: "all 0.2s", background: activePage === n.key ? "rgba(99,102,241,0.15)" : "transparent" }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: activePage === n.key ? "#a5b4fc" : "#475569", whiteSpace: "nowrap" }}>{n.key.split(" ")[0]}</span>
          </div>
        ))}
      </nav>
    </>
  );
}

function LiveEventWidget() {
  const EVENTS_FEED = [
    { emoji: "🚀", title: "Hackathon 48H", sub: "Coding Club · Lab Block", color: "#22c55e", live: true, attendees: 142, capacity: 200 },
    { emoji: "💻", title: "Tech Summit 2026", sub: "IEEE Club · Auditorium A", color: "#6366f1", live: false, daysLeft: 7 },
    { emoji: "🎭", title: "Cultural Fiesta", sub: "Cultural Society · Open Ground", color: "#ec4899", live: false, daysLeft: 14 },
  ];
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(p => (p + 1) % EVENTS_FEED.length), 4000);
    return () => clearInterval(id);
  }, []);

  const current = EVENTS_FEED[tick];
  const pct = current.live ? Math.round((current.attendees / current.capacity) * 100) : null;

  return (
    <div style={{ marginTop: 40, maxWidth: 400 }}>
      {/* Label + dots row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        {current.live
          ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 20, padding: "3px 11px", fontSize: 11, fontWeight: 800, color: "#f87171", letterSpacing: "0.08em" }}><span className="live-dot" />LIVE NOW</span>
          : <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "3px 11px", fontSize: 11, fontWeight: 800, color: "#a5b4fc", letterSpacing: "0.08em" }}>⏳ UP NEXT</span>
        }
        <div style={{ display: "flex", gap: 5, marginLeft: "auto" }}>
          {EVENTS_FEED.map((_, i) => (
            <div key={i} onClick={() => setTick(i)} style={{ width: i === tick ? 18 : 6, height: 6, borderRadius: 3, background: i === tick ? current.color : "#1e2a3a", transition: "all 0.4s", cursor: "pointer" }} />
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={{
        background: `linear-gradient(135deg, ${current.color}12 0%, #0a0e18 70%)`,
        border: `1px solid ${current.color}40`,
        borderRadius: 18,
        padding: "22px 24px",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 8px 32px ${current.color}18`,
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: current.color, opacity: 0.08, filter: "blur(30px)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, position: "relative", zIndex: 1 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `${current.color}22`, border: `1px solid ${current.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
            {current.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{current.title}</div>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: current.live ? 14 : 10 }}>{current.sub}</div>
            {current.live ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                  <span style={{ color: "#94a3b8", fontWeight: 600 }}>{current.attendees} attending</span>
                  <span style={{ color: current.color, fontWeight: 700 }}>{pct}% full</span>
                </div>
                <div style={{ height: 5, background: "#1e2a3a", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${current.color}99, ${current.color})`, borderRadius: 10 }} />
                </div>
              </>
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${current.color}14`, border: `1px solid ${current.color}33`, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: current.color }}>
                📅 In {current.daysLeft} days
              </div>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${current.color}88, transparent)` }} />
      </div>
    </div>
  );
}

function HomePage({ setActivePage, events, upcoming, openReg, registeredEvents }) {
  return (
    <div>
      {/* HERO */}
      <section className="hero-bg hero-section">
        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 24, fontSize: 13, color: "#a5b4fc" }}>
            <span className="glow-dot" style={{ background: "#22c55e" }}></span>
            200+ Events This Semester
          </div>
          <h1 className="hero-title" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: "#f1f5f9" }}>
            Discover, Register,<br />
            <span style={{ background: "linear-gradient(135deg,#818cf8,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>& Experience</span><br />
            Campus Events
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
            A smart platform for students to explore campus activities, register for events, and stay connected with college life.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ padding: "13px 24px", fontSize: 15 }} onClick={() => setActivePage("Campus Events")}>Explore Events →</button>
            <button className="btn-outline" style={{ padding: "13px 24px", fontSize: 15 }} onClick={() => setActivePage("Campus Map")}>View Campus Map</button>
          </div>
          {/* LIVE / NEXT EVENT WIDGET */}
          <LiveEventWidget />
        </div>
        <div className="hero-mock" style={{ flex: 1, justifyContent: "center" }}>
          <div style={{ position: "relative", width: 380, height: 320 }}>
            <div style={{ background: "#0f1623", border: "1px solid #1e2a3a", borderRadius: 20, padding: 24, boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16, fontWeight: 600 }}>UPCOMING EVENTS</div>
              {[
                { emoji: "💻", title: "Tech Summit", date: "Mar 15", color: "#6366f1" },
                { emoji: "🎭", title: "Cultural Fiesta", date: "Mar 22", color: "#ec4899" },
                { emoji: "🚀", title: "Hackathon 48H", date: "Apr 5", color: "#22c55e" },
              ].map((e, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 2 ? "1px solid #1e2a3a" : "none" }}>
                  <div style={{ width: 40, height: 40, background: `${e.color}22`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{e.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{e.date}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }}></div>
                </div>
              ))}
              <div style={{ marginTop: 16, background: "rgba(99,102,241,0.1)", borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>📊</span>
                <div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Your Attendance Score</div>
                  <div style={{ fontWeight: 700, color: "#818cf8" }}>1,840 pts  •  Rank #12</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAMPUS EVENTS PREVIEW */}
      <section className="page-pad">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="section-title">Campus Events</div>
            <div style={{ color: "#475569", marginTop: 6 }}>Browse all upcoming campus activities</div>
          </div>
          <button className="btn-outline" onClick={() => setActivePage("Campus Events")}>View All →</button>
        </div>
        <div className="events-grid">
          {events.slice(0, 3).map(e => <EventCard key={e.id} event={e} openReg={openReg} registeredEvents={registeredEvents} />)}
        </div>
      </section>

      {/* UPCOMING SCROLL */}
      <section style={{ paddingBottom: 60 }} className="page-pad" >
        <div className="section-title" style={{ marginBottom: 20 }}>Upcoming This Week</div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
          {upcoming.map((u, i) => (
            <div key={i} className="upcoming-card" style={{ minWidth: 140 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{u.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{u.title}</div>
              <div style={{ fontSize: 12, color: u.color, fontWeight: 600 }}>{u.date}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function EventCard({ event, openReg, registeredEvents = {} }) {
  const isReg = registeredEvents[event.id];
  return (
    <div className="event-card">
      <div style={{ height: 140, background: `linear-gradient(135deg, ${event.color}33 0%, ${event.color}11 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, position: "relative" }}>
        {event.emoji}
        <div style={{ position: "absolute", top: 12, right: 12, background: `${event.color}33`, border: `1px solid ${event.color}66`, borderRadius: 6, padding: "3px 10px", fontSize: 12, color: event.color, fontWeight: 600 }}>{event.club}</div>
        {isReg && <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.5)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "#22c55e", fontWeight: 700 }}>✓ Registered</div>}
      </div>
      <div style={{ padding: 20 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>{event.title}</h3>
        <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#475569", marginBottom: 16 }}>
          <span>📅 {event.date}</span>
          <span>📍 {event.location}</span>
        </div>
        {isReg ? (
          <div style={{ width: "100%", padding: "10px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, color: "#22c55e", fontWeight: 700, fontSize: 14, textAlign: "center" }}>✓ You're Registered!</div>
        ) : (
          <button className="btn-primary" style={{ width: "100%", padding: "10px" }} onClick={() => openReg && openReg(event)}>Register Now</button>
        )}
      </div>
    </div>
  );
}

function CampusEventsPage({ events, openReg, registeredEvents }) {
  const [search, setSearch] = useState("");
  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="page-pad" style={{}}>
      <div className="section-title" style={{ marginBottom: 8 }}>Campus Events</div>
      <p style={{ color: "#475569", marginBottom: 32 }}>All events happening across campus this semester</p>
      <input className="input-dark" placeholder="🔍  Search events..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 400, marginBottom: 40 }} />
      <div className="events-grid" style={{}}>
        {filtered.map(e => <EventCard key={e.id} event={e} openReg={openReg} registeredEvents={registeredEvents} />)}
      </div>
      {filtered.length === 0 && <div style={{ textAlign: "center", color: "#475569", padding: "60px 0" }}>No events found for "{search}"</div>}
    </div>
  );
}

function FoundersDayPage({ openReg, registeredEvents }) {
  const foundersEvent = { id: "founders2026", title: "Founders Day 2026", date: "April 30, 2026", location: "Main Campus", club: "Student Council", color: "#f59e0b", emoji: "🎓" };
  const subEvents = [
    { time: "9:00 AM", name: "Inaugural Ceremony", venue: "Main Auditorium", emoji: "🎓" },
    { time: "11:00 AM", name: "Cultural Performances", venue: "Open Stage", emoji: "🎭" },
    { time: "2:00 PM", name: "Tech Exhibition", venue: "Lab Block", emoji: "💡" },
    { time: "4:00 PM", name: "Sports Finals", venue: "Sports Arena", emoji: "🏆" },
    { time: "7:00 PM", name: "Grand Gala Night", venue: "Amphitheatre", emoji: "✨" },
  ];

  const GALLERY_ITEMS = [
    { id: 1, emoji: "🎓", label: "Inaugural Address", year: "2025", category: "Ceremony", accent: "#f59e0b", bg: "linear-gradient(135deg,#1a1200 0%,#2d1f00 50%,#1a1200 100%)", wide: true },
    { id: 2, emoji: "🎭", label: "Cultural Night", year: "2025", category: "Cultural", accent: "#ec4899", bg: "linear-gradient(135deg,#1a0012 0%,#2d0020 50%,#1a0012 100%)" },
    { id: 3, emoji: "🏆", label: "Sports Finals", year: "2025", category: "Sports", accent: "#22c55e", bg: "linear-gradient(135deg,#001a08 0%,#002d10 50%,#001a08 100%)" },
    { id: 4, emoji: "💡", label: "Tech Exhibition", year: "2024", category: "Tech", accent: "#6366f1", bg: "linear-gradient(135deg,#06001a 0%,#0d002d 50%,#06001a 100%)", wide: true },
    { id: 5, emoji: "✨", label: "Gala Night", year: "2024", category: "Cultural", accent: "#a855f7", bg: "linear-gradient(135deg,#0d0018 0%,#1a0030 50%,#0d0018 100%)" },
    { id: 6, emoji: "🎨", label: "Art Showcase", year: "2024", category: "Cultural", accent: "#06b6d4", bg: "linear-gradient(135deg,#00101a 0%,#001a2d 50%,#00101a 100%)" },
    { id: 7, emoji: "🤝", label: "Alumni Meet", year: "2023", category: "Ceremony", accent: "#f97316", bg: "linear-gradient(135deg,#1a0800 0%,#2d1000 50%,#1a0800 100%)" },
    { id: 8, emoji: "🎵", label: "Music Evening", year: "2023", category: "Cultural", accent: "#ec4899", bg: "linear-gradient(135deg,#1a0010 0%,#2d001c 50%,#1a0010 100%)" },
    { id: 9, emoji: "🧪", label: "Science Fair", year: "2023", category: "Tech", accent: "#22c55e", bg: "linear-gradient(135deg,#001a0c 0%,#002d16 50%,#001a0c 100%)" },
  ];

  const CATS = ["All", "Ceremony", "Cultural", "Sports", "Tech"];
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeFilter === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.category === activeFilter);

  return (
    <div className="page-pad" style={{}}>
      {/* HERO CARD */}
      <div className="founders-card founders-pad" style={{ marginBottom: 48 }}>
        <div className="founders-inner" style={{}}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "5px 14px", marginBottom: 20, fontSize: 13, color: "#a5b4fc" }}>
              🌟 Featured Event
            </div>
            <h1 className="founders-title" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#f1f5f9", marginBottom: 8, lineHeight: 1.1 }}>Founders Day<br /><span style={{ color: "#818cf8" }}>2026</span></h1>
            <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>Celebrating 50 years of excellence. Join us for a grand day of cultural showcases, tech exhibitions, and awards as we honor our institution's legacy.</p>
            <div style={{ display: "flex", gap: 20, marginBottom: 32, fontSize: 14, color: "#94a3b8" }}>
              <span>📅 April 30, 2026</span>
              <span>📍 Main Campus</span>
              <span>👥 5000+ Expected</span>
            </div>
            {registeredEvents && registeredEvents[foundersEvent.id] ? (
              <div style={{ display: "inline-block", padding: "14px 28px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, color: "#22c55e", fontWeight: 700, fontSize: 15 }}>✓ You're Registered!</div>
            ) : (
              <button className="btn-primary" style={{ padding: "14px 28px", fontSize: 15 }} onClick={() => openReg && openReg(foundersEvent)}>Register for All Events</button>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", letterSpacing: "0.1em", marginBottom: 20 }}>EVENT SCHEDULE</div>
              {subEvents.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: i < subEvents.length - 1 ? 18 : 0, marginBottom: i < subEvents.length - 1 ? 18 : 0, borderBottom: i < subEvents.length - 1 ? "1px solid #1e2a3a" : "none" }}>
                  <span style={{ fontSize: 22 }}>{s.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{s.time} · {s.venue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <div className="section-title" style={{ fontSize: 28 }}>Founders Day Gallery</div>
            <div style={{ color: "#475569", marginTop: 6, fontSize: 14 }}>Memories from previous celebrations</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {CATS.map(c => (
              <button key={c} className={`filter-btn ${activeFilter === c ? "active" : ""}`} onClick={() => setActiveFilter(c)}>{c}</button>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 120, marginBottom: 20, filter: "drop-shadow(0 0 40px rgba(255,255,255,0.1))" }}>{lightbox.emoji}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>{lightbox.label}</div>
              <div style={{ display: "inline-flex", gap: 12, alignItems: "center" }}>
                <span style={{ padding: "4px 14px", borderRadius: 20, background: `${lightbox.accent}22`, border: `1px solid ${lightbox.accent}55`, color: lightbox.accent, fontSize: 13, fontWeight: 600 }}>{lightbox.category}</span>
                <span style={{ color: "#475569", fontSize: 14 }}>Founders Day {lightbox.year}</span>
              </div>
              <div style={{ marginTop: 28, fontSize: 13, color: "#334155" }}>Click anywhere to close</div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="events-grid" style={{ gap: 16 }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              className="gallery-item"
              style={{
                background: item.bg,
                border: `1px solid ${item.accent}22`,
                gridColumn: item.wide ? "span 2" : "span 1",
                minHeight: item.wide ? 220 : 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                position: "relative",
                overflow: "hidden",
              }}
              onClick={() => setLightbox(item)}
            >
              {/* Glow orb */}
              <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: item.accent, opacity: 0.08, filter: "blur(40px)", pointerEvents: "none" }} />
              <div style={{ fontSize: item.wide ? 56 : 44, position: "relative", zIndex: 1 }}>{item.emoji}</div>
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>Founders Day {item.year}</div>
              </div>
              {/* Hover overlay */}
              <div className="gallery-overlay">
                <span style={{ padding: "4px 12px", borderRadius: 20, background: `${item.accent}33`, border: `1px solid ${item.accent}66`, color: item.accent, fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 6 }}>{item.category}</span>
                <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Click to expand ↗</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CampusMapPage({ locations, activePin, setActivePin }) {
  const active = locations.find(l => l.id === activePin);
  return (
    <div className="page-pad" style={{}}>
      <div className="section-title" style={{ marginBottom: 8 }}>Campus Map</div>
      <p style={{ color: "#475569", marginBottom: 32 }}>Click a marker to see event details at that location</p>
      <div style={{ display: "flex", gap: 32 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ background: "#0f1623", border: "1px solid #1e2a3a", borderRadius: 20, padding: 20, aspectRatio: "4/3", position: "relative", overflow: "hidden" }}>
            {/* Grid lines */}
            {[20, 40, 60, 80].map(p => (
              <div key={p} style={{ position: "absolute", left: 0, right: 0, top: `${p}%`, borderTop: "1px solid #1e2a3a" }}></div>
            ))}
            {[25, 50, 75].map(p => (
              <div key={p} style={{ position: "absolute", top: 0, bottom: 0, left: `${p}%`, borderLeft: "1px solid #1e2a3a" }}></div>
            ))}
            {/* Campus areas */}
            <div style={{ position: "absolute", left: "20%", top: "15%", width: "35%", height: "25%", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#475569" }}>Academic Block</div>
            <div style={{ position: "absolute", left: "60%", top: "40%", width: "28%", height: "22%", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#475569" }}>Sports Zone</div>
            <div style={{ position: "absolute", left: "10%", top: "50%", width: "25%", height: "22%", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#475569" }}>Tech Labs</div>
            {/* Pins */}
            {locations.map(loc => (
              <div
                key={loc.id}
                className={`map-pin ${activePin === loc.id ? "active" : ""}`}
                style={{ left: `${loc.x}%`, top: `${loc.y}%`, background: loc.color, boxShadow: `0 0 ${activePin === loc.id ? 20 : 8}px ${loc.color}` }}
                onClick={() => setActivePin(activePin === loc.id ? null : loc.id)}
              ></div>
            ))}
          </div>
        </div>
        <div style={{ width: 280 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 16, letterSpacing: "0.05em" }}>LOCATIONS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {locations.map(loc => (
              <div key={loc.id} onClick={() => setActivePin(activePin === loc.id ? null : loc.id)}
                style={{ background: activePin === loc.id ? `${loc.color}22` : "#0f1623", border: `1px solid ${activePin === loc.id ? loc.color : "#1e2a3a"}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: loc.color, boxShadow: `0 0 8px ${loc.color}` }}></div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{loc.name}</span>
                </div>
                {activePin === loc.id && <div style={{ marginTop: 10, fontSize: 13, color: "#64748b" }}>📅 Next event: Mar 15, 2026<br />👥 Capacity: 500 students</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UpcomingEventsPage({ upcoming, openReg, registeredEvents }) {
  const allUpcoming = [
    { id: "upcoming_0", title: "AI Workshop",    date: "Mar 10", fullDate: "Mon, Mar 10", emoji: "🤖", color: "#6366f1", category: "Technical", location: "Lab Block A",    club: "AI Society",      spots: 60  },
    { id: "upcoming_1", title: "Design Sprint",  date: "Mar 12", fullDate: "Wed, Mar 12", emoji: "🎨", color: "#ec4899", category: "Creative",  location: "Design Studio", club: "Design Club",     spots: 40  },
    { id: "upcoming_2", title: "Debate League",  date: "Mar 14", fullDate: "Fri, Mar 14", emoji: "🗣️", color: "#22c55e", category: "Academic",  location: "Seminar Hall",  club: "Debate Society",  spots: 80  },
    { id: "upcoming_3", title: "Film Festival",  date: "Mar 16", fullDate: "Sun, Mar 16", emoji: "🎬", color: "#f59e0b", category: "Cultural",  location: "Amphitheatre",  club: "Film Club",       spots: 200 },
    { id: "upcoming_4", title: "Yoga Camp",      date: "Mar 18", fullDate: "Tue, Mar 18", emoji: "🧘", color: "#06b6d4", category: "Wellness",  location: "Open Ground",   club: "Wellness Club",   spots: 100 },
    { id: "upcoming_5", title: "Quiz Bowl",      date: "Mar 20", fullDate: "Thu, Mar 20", emoji: "🧠", color: "#a855f7", category: "Academic",  location: "Auditorium B",  club: "Quiz Club",       spots: 120 },
    { id: "upcoming_6", title: "Art Exhibition", date: "Mar 22", fullDate: "Sat, Mar 22", emoji: "🖼️", color: "#f97316", category: "Creative",  location: "Gallery Hall",  club: "Art Society",     spots: 150 },
    { id: "upcoming_7", title: "Startup Pitch",  date: "Mar 24", fullDate: "Mon, Mar 24", emoji: "💼", color: "#22c55e", category: "Technical", location: "Innovation Hub", club: "E-Cell",          spots: 75  },
  ];

  const CATS = ["All", "Technical", "Cultural", "Academic", "Creative", "Wellness"];
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = activeFilter === "All" ? allUpcoming : allUpcoming.filter(u => u.category === activeFilter);
  const featured = allUpcoming[0];

  return (
    <div className="page-pad" style={{ minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 14, fontSize: 13, color: "#a5b4fc" }}>
            <span className="glow-dot" style={{ background: "#22c55e" }}></span> {allUpcoming.length} events this month
          </div>
          <div className="section-title">Upcoming Events</div>
          <p style={{ color: "#475569", marginTop: 6, fontSize: 15 }}>Register early to secure your spot</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATS.map(c => (
            <button key={c} className={`filter-btn ${activeFilter === c ? "active" : ""}`} onClick={() => setActiveFilter(c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* ── FEATURED SPOTLIGHT (only shown on All) ── */}
      {activeFilter === "All" && (
        <div style={{ background: `linear-gradient(135deg, ${featured.color}18 0%, #0f1623 60%)`, border: `1px solid ${featured.color}33`, borderRadius: 20, padding: "24px 28px", marginBottom: 32, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -40, top: -40, width: 220, height: 220, borderRadius: "50%", background: featured.color, opacity: 0.05, filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ fontSize: 64 }}>{featured.emoji}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${featured.color}22`, border: `1px solid ${featured.color}44`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, color: featured.color, marginBottom: 10 }}>⭐ NEXT UP · {featured.fullDate}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>{featured.title}</div>
            <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#64748b", marginBottom: 16, flexWrap: "wrap" }}>
              <span>📍 {featured.location}</span>
              <span>🏛️ {featured.club}</span>
              <span>👥 {featured.spots} spots</span>
            </div>
            {registeredEvents?.[featured.id]
              ? <div style={{ display:"inline-block", padding:"9px 20px", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:10, color:"#22c55e", fontWeight:700, fontSize:14 }}>✓ Registered</div>
              : <button className="btn-primary" style={{ padding:"10px 24px", fontSize:14 }} onClick={()=>openReg&&openReg({...featured})}>Register Now →</button>
            }
          </div>
        </div>
      )}

      {/* ── GRID ── */}
      <div className="upcoming-grid" style={{}}>
        {filtered.map((u) => {
          const isReg = registeredEvents?.[u.id];
          return (
            <div key={u.id} style={{
              background: "#0f1623",
              border: `1px solid #1e2a3a`,
              borderRadius: 18,
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = u.color; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${u.color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2a3a"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* top glow */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${u.color}88, transparent)`, borderRadius: "18px 18px 0 0" }} />
              {/* category pill */}
              <div style={{ display: "inline-flex", alignSelf: "flex-start", padding: "3px 10px", borderRadius: 20, background: `${u.color}18`, border: `1px solid ${u.color}44`, fontSize: 11, fontWeight: 700, color: u.color, marginBottom: 18, letterSpacing: "0.05em" }}>{u.category}</div>
              {/* emoji */}
              <div style={{ fontSize: 44, marginBottom: 14 }}>{u.emoji}</div>
              {/* title */}
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 6, lineHeight: 1.3 }}>{u.title}</div>
              {/* meta */}
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>📅 {u.fullDate}</div>
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>📍 {u.location}</div>
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 20 }}>👥 {u.spots} spots available</div>
              {/* cta */}
              {isReg
                ? <div style={{ marginTop: "auto", padding: "9px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 10, color: "#22c55e", fontWeight: 700, fontSize: 13, textAlign: "center" }}>✓ Registered</div>
                : <button className="btn-primary" style={{ marginTop: "auto", width: "100%", padding: "9px", fontSize: 13 }} onClick={() => openReg && openReg({ ...u })}>Register</button>
              }
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#334155" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No events in this category</div>
        </div>
      )}
    </div>
  );
}

function LeaderboardPage({ students, clubs }) {
  const [tab, setTab] = useState("students");
  return (
    <div className="page-pad" style={{}}>
      <div className="section-title" style={{ marginBottom: 8 }}>Leaderboard</div>
      <p style={{ color: "#475569", marginBottom: 32 }}>Most active students and clubs this semester</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
        {[["students", "👤 Students"], ["clubs", "🏛️ Clubs"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: "10px 24px", borderRadius: 10, border: tab === key ? "1px solid #4f46e5" : "1px solid #1e2a3a", background: tab === key ? "rgba(79,70,229,0.2)" : "#0f1623", color: tab === key ? "#a5b4fc" : "#64748b", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}>{label}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 700 }}>
        {tab === "students" && <>
          <div style={{ display: "flex", gap: 16, padding: "8px 20px", fontSize: 12, color: "#475569", fontWeight: 600, letterSpacing: "0.05em" }}>
            <span style={{ width: 40 }}>RANK</span><span style={{ flex: 1 }}>STUDENT</span><span style={{ width: 80, textAlign: "right" }}>EVENTS</span><span style={{ width: 80, textAlign: "right" }}>POINTS</span>
          </div>
          {students.map(s => (
            <div key={s.rank} className={`rank-row ${s.rank <= 3 ? "top" : ""}`}>
              <div style={{ width: 40, fontWeight: 700, fontSize: 18 }}>{s.medal || `#${s.rank}`}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#e2e8f0" }}>{s.name}</div>
              </div>
              <div style={{ width: 80, textAlign: "right", fontSize: 14, color: "#64748b" }}>{s.events} events</div>
              <div style={{ width: 80, textAlign: "right", fontWeight: 700, color: "#818cf8", fontSize: 15 }}>{s.points.toLocaleString()}</div>
            </div>
          ))}
        </>}
        {tab === "clubs" && <>
          <div style={{ display: "flex", gap: 16, padding: "8px 20px", fontSize: 12, color: "#475569", fontWeight: 600, letterSpacing: "0.05em" }}>
            <span style={{ width: 40 }}>RANK</span><span style={{ flex: 1 }}>CLUB</span><span style={{ width: 80, textAlign: "right" }}>HOSTED</span><span style={{ width: 80, textAlign: "right" }}>SCORE</span>
          </div>
          {clubs.map(c => (
            <div key={c.rank} className={`rank-row ${c.rank <= 3 ? "top" : ""}`}>
              <div style={{ width: 40, fontWeight: 700, fontSize: 18 }}>{c.medal || `#${c.rank}`}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#e2e8f0" }}>{c.name}</div>
              </div>
              <div style={{ width: 80, textAlign: "right", fontSize: 14, color: "#64748b" }}>{c.hosted} events</div>
              <div style={{ width: 80, textAlign: "right", fontWeight: 700, color: "#22c55e", fontSize: 15 }}>{c.score.toLocaleString()}</div>
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}

function CreateEventPage({ formData, setFormData, submitted, handleSubmit }) {
  const update = (key, val) => setFormData(p => ({ ...p, [key]: val }));
  return (
    <div className="page-pad" style={{}}>
      <div className="section-title" style={{ marginBottom: 8 }}>Create Event</div>
      <p style={{ color: "#475569", marginBottom: 40 }}>Fill out the form below to publish a new campus event</p>
      <div style={{ maxWidth: 720, background: "#0f1623", border: "1px solid #1e2a3a", borderRadius: 20, padding: 40 }}>
        {submitted && (
          <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "14px 20px", marginBottom: 28, color: "#22c55e", fontWeight: 600, fontSize: 14 }}>
            ✅ Event created successfully! It will appear on the campus board shortly.
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>EVENT TITLE *</label>
            <input className="input-dark" placeholder="e.g. Annual Tech Symposium 2026" value={formData.title} onChange={e => update("title", e.target.value)} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>DESCRIPTION</label>
            <textarea className="input-dark" placeholder="Describe your event..." value={formData.desc} onChange={e => update("desc", e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>CATEGORY</label>
            <select className="input-dark" value={formData.category} onChange={e => update("category", e.target.value)}>
              <option value="">Select category</option>
              {["Technical", "Cultural", "Sports", "Academic", "Social", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>DATE & TIME *</label>
            <input type="datetime-local" className="input-dark" value={formData.date} onChange={e => update("date", e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>LOCATION</label>
            <input className="input-dark" placeholder="e.g. Main Auditorium" value={formData.location} onChange={e => update("location", e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>MAX PARTICIPANTS</label>
            <input type="number" className="input-dark" placeholder="e.g. 200" value={formData.max} onChange={e => update("max", e.target.value)} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>UPLOAD BANNER</label>
            <div style={{ border: "2px dashed #1e2a3a", borderRadius: 12, padding: "30px 20px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.target.style.borderColor = "#4f46e5"} onMouseLeave={e => e.target.style.borderColor = "#1e2a3a"}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
              <div style={{ fontSize: 14, color: "#475569" }}>Drag & drop or <span style={{ color: "#818cf8", cursor: "pointer" }}>browse files</span></div>
              <div style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>PNG, JPG, WEBP up to 5MB</div>
            </div>
          </div>
        </div>
        <button className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 15 }} onClick={handleSubmit}>
          ⚡ Publish Event
        </button>
      </div>
    </div>
  );
}

function RegModal({ event, user, onClose, onConfirm }) {
  const [step, setStep] = useState(1); // 1 = details, 2 = success
  const [form, setForm] = useState({ name: user?.name || "", phone: "", dept: "", year: "" });
  const [error, setError] = useState("");
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleConfirm = () => {
    if (!form.name || !form.phone || !form.dept || !form.year) { setError("Please fill in all fields."); return; }
    setStep(2);
    setTimeout(() => { onConfirm(event.id); }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 460 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${event.color}, transparent)`, borderRadius: "20px 20px 0 0" }}></div>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 20 }}>✕</button>

        {step === 1 ? (
          <>
            {/* Event preview */}
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 28, padding: 16, background: `${event.color}11`, border: `1px solid ${event.color}33`, borderRadius: 14 }}>
              <div style={{ fontSize: 40 }}>{event.emoji}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#f1f5f9", marginBottom: 4 }}>{event.title}</div>
                <div style={{ fontSize: 13, color: "#475569" }}>📅 {event.date} &nbsp;·&nbsp; 📍 {event.location}</div>
              </div>
            </div>

            <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 20 }}>Complete Registration</div>

            {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 }}>{error}</div>}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>FULL NAME</label>
                <input className="input-dark" placeholder="Your full name" value={form.name} onChange={e => update("name", e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>PHONE NUMBER</label>
                <input className="input-dark" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => update("phone", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>DEPARTMENT</label>
                  <select className="input-dark" value={form.dept} onChange={e => update("dept", e.target.value)}>
                    <option value="">Select dept</option>
                    {["CSE", "ECE", "ME", "CE", "EEE", "IT", "MBA", "Other"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>YEAR</label>
                  <select className="input-dark" value={form.year} onChange={e => update("year", e.target.value)}>
                    <option value="">Year</option>
                    {["1st Year", "2nd Year", "3rd Year", "4th Year", "PG"].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-primary" style={{ padding: "13px", fontSize: 15, marginTop: 4 }} onClick={handleConfirm}>
                Confirm Registration →
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#334155" }}>
              You'll receive a confirmation on your registered email.
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#f1f5f9", marginBottom: 10 }}>You're In!</div>
            <div style={{ fontSize: 15, color: "#64748b", marginBottom: 24 }}>
              Successfully registered for<br />
              <span style={{ color: event.color, fontWeight: 700 }}>{event.title}</span>
            </div>
            <div style={{ background: `${event.color}11`, border: `1px solid ${event.color}33`, borderRadius: 14, padding: 18, marginBottom: 24, display: "inline-block" }}>
              <div style={{ fontSize: 13, color: "#475569", marginBottom: 4 }}>Registered as</div>
              <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 16 }}>{form.name}</div>
              <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{form.dept} · {form.year}</div>
            </div>
            <div style={{ fontSize: 13, color: "#475569" }}>Closing automatically…</div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoginModal({ onClose, onLogin }) {
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ name: "", email: "", password: "", roll: "" });
  const [error, setError] = useState("");
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const ADMIN_CREDS = { email: "admin@eventra.edu", password: "admin123" };

  const handleLogin = () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (role === "admin") {
      if (form.email !== ADMIN_CREDS.email || form.password !== ADMIN_CREDS.password) {
        setError("Invalid admin credentials."); return;
      }
      onLogin({ name: "Admin", email: form.email, role: "admin" });
    } else {
      onLogin({ name: form.email.split("@")[0], email: form.email, role: "student" });
    }
  };
  const handleSignup = () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    onLogin({ name: form.name, email: form.email, role: "student" });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 440 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #4f46e5, #7c3aed, transparent)", borderRadius: "20px 20px 0 0" }}></div>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, background: "linear-gradient(135deg,#818cf8,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EVENTRA</span>
        </div>

        {/* Role toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["student", "🎓 Student Portal"], ["admin", "🛡️ Admin Portal"]].map(([r, label]) => (
            <button key={r} onClick={() => { setRole(r); setError(""); setTab("login"); }}
              style={{ flex: 1, padding: "10px", border: role === r ? `1px solid ${r === "admin" ? "#f59e0b" : "#4f46e5"}` : "1px solid #1e2a3a", borderRadius: 10, background: role === r ? (r === "admin" ? "rgba(245,158,11,0.12)" : "rgba(79,70,229,0.15)") : "#080c14", color: role === r ? (r === "admin" ? "#fbbf24" : "#a5b4fc") : "#475569", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13, transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {role === "admin" && (
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#92400e" }}>
            <span style={{ color: "#fbbf24", fontWeight: 700 }}>Demo credentials: </span>
            <span style={{ color: "#d97706" }}>admin@eventra.edu / admin123</span>
          </div>
        )}

        {/* Login / Signup tabs (student only) */}
        {role === "student" && (
          <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#080c14", borderRadius: 10, padding: 4 }}>
            {[["login", "Login"], ["signup", "Sign Up"]].map(([key, label]) => (
              <button key={key} onClick={() => { setTab(key); setError(""); }}
                style={{ flex: 1, padding: "9px", border: "none", borderRadius: 8, background: tab === key ? "#1e2a3a" : "transparent", color: tab === key ? "#e2e8f0" : "#475569", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {role === "student" && tab === "signup" && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>FULL NAME</label>
              <input className="input-dark" placeholder="Your full name" value={form.name} onChange={e => update("name", e.target.value)} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>{role === "admin" ? "ADMIN EMAIL" : "COLLEGE EMAIL"}</label>
            <input className="input-dark" placeholder={role === "admin" ? "admin@eventra.edu" : "student@college.edu"} value={form.email} onChange={e => update("email", e.target.value)} />
          </div>
          {role === "student" && tab === "signup" && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>ROLL NUMBER</label>
              <input className="input-dark" placeholder="e.g. 22CS1001" value={form.roll} onChange={e => update("roll", e.target.value)} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input type="password" className="input-dark" placeholder="••••••••" value={form.password} onChange={e => update("password", e.target.value)} />
          </div>
          <button className="btn-primary" style={{ padding: "13px", fontSize: 15, marginTop: 4, background: role === "admin" ? "linear-gradient(135deg,#d97706,#b45309)" : undefined }}
            onClick={role === "student" && tab === "signup" ? handleSignup : handleLogin}>
            {role === "admin" ? "🛡️ Enter Admin Portal" : tab === "login" ? "Login to EVENTRA" : "Create Account"}
          </button>
        </div>

        {role === "student" && (
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#334155" }}>
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: "#818cf8", cursor: "pointer" }} onClick={() => { setTab(tab === "login" ? "signup" : "login"); setError(""); }}>
              {tab === "login" ? "Sign Up" : "Login"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const STREAMS = [
  { id: 1, title: "Tech Summit 2026 — Opening Keynote", viewers: 1842, live: true, emoji: "💻", color: "#6366f1", host: "IEEE Club", started: "2h ago" },
  { id: 2, title: "Hackathon 48H — Project Presentations", viewers: 934, live: true, emoji: "🚀", color: "#22c55e", host: "Coding Club", started: "45m ago" },
  { id: 3, title: "Cultural Fiesta — Dance Finale", viewers: 2301, live: true, emoji: "🎭", color: "#ec4899", host: "Cultural Society", started: "1h ago" },
  { id: 4, title: "AI Workshop — Replay", viewers: 0, live: false, emoji: "🤖", color: "#a855f7", host: "AI Club", started: "Yesterday" },
  { id: 5, title: "Founders Day 2025 — Full Event", viewers: 0, live: false, emoji: "🎓", color: "#f59e0b", host: "Student Council", started: "2 weeks ago" },
];

function LiveStreamPage() {
  const [active, setActive] = useState(STREAMS[0]);
  const [chatMsg, setChatMsg] = useState("");
  const [chatLog, setChatLog] = useState([
    { user: "Rahul V", msg: "This is amazing! 🔥", time: "2:14 PM" },
    { user: "Priya N", msg: "Can't believe I'm watching this live", time: "2:15 PM" },
    { user: "Dev S", msg: "Go team EVENTRA!", time: "2:15 PM" },
    { user: "Aisha R", msg: "Best event of the year 🎉", time: "2:16 PM" },
  ]);

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChatLog(p => [...p, { user: "You", msg: chatMsg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setChatMsg("");
  };

  return (
    <div className="page-pad" style={{}}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div className="section-title">Live Stream</div>
        <div className="live-badge"><span className="live-dot"></span>3 LIVE NOW</div>
      </div>

      <div style={{ display: "flex", gap: 28 }}>
        {/* Main Player */}
        <div style={{ flex: 1 }}>
          {/* Video Area */}
          <div style={{ background: "#080c14", border: `1px solid ${active.live ? "#ef4444" : "#1e2a3a"}`, borderRadius: 16, aspectRatio: "16/9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", marginBottom: 16 }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${active.color}18 0%, transparent 70%)` }}></div>
            <div style={{ fontSize: 72, marginBottom: 16, position: "relative" }}>{active.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", position: "relative", textAlign: "center", maxWidth: 360 }}>{active.title}</div>
            {active.live && (
              <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 10 }}>
                <div className="live-badge"><span className="live-dot"></span>LIVE</div>
                <div style={{ background: "rgba(0,0,0,0.6)", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#94a3b8" }}>👁 {active.viewers.toLocaleString()} watching</div>
              </div>
            )}
            {!active.live && (
              <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.6)", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#64748b" }}>📼 Recorded · {active.started}</div>
            )}
            <div style={{ position: "absolute", bottom: 14, right: 14, display: "flex", gap: 8 }}>
              {["⛶", "🔊", "⚙"].map(icon => (
                <div key={icon} style={{ width: 32, height: 32, background: "rgba(0,0,0,0.6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>{icon}</div>
              ))}
            </div>
          </div>

          {/* Stream Info */}
          <div style={{ background: "#0f1623", border: "1px solid #1e2a3a", borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{active.title}</h2>
                <div style={{ fontSize: 14, color: "#475569" }}>Hosted by <span style={{ color: active.color }}>{active.host}</span> · {active.started}</div>
              </div>
              <button className="btn-primary" style={{ padding: "8px 18px" }}>🔔 Notify Me</button>
            </div>
          </div>

          {/* More Streams */}
          <div style={{ fontSize: 14, fontWeight: 700, color: "#64748b", letterSpacing: "0.05em", marginBottom: 14 }}>MORE STREAMS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {STREAMS.filter(s => s.id !== active.id).map(s => (
              <div key={s.id} className="stream-card" onClick={() => setActive(s)} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16 }}>
                <div style={{ width: 60, height: 44, background: `${s.color}22`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{s.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{s.host} · {s.started}</div>
                </div>
                {s.live ? <div className="live-badge" style={{ fontSize: 11, padding: "3px 8px" }}><span className="live-dot"></span>LIVE</div>
                  : <div style={{ fontSize: 12, color: "#334155" }}>Recorded</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Live Chat */}
        <div style={{ width: 320, background: "#0f1623", border: "1px solid #1e2a3a", borderRadius: 16, display: "flex", flexDirection: "column", height: "fit-content" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e2a3a", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>Live Chat</span>
            {active.live && <div className="live-badge" style={{ fontSize: 11, padding: "2px 8px" }}><span className="live-dot"></span>LIVE</div>}
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, height: 360, overflowY: "auto" }}>
            {chatLog.map((c, i) => (
              <div key={i}>
                <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.user === "You" ? "#818cf8" : "#a5b4fc" }}>{c.user}</span>
                  <span style={{ fontSize: 11, color: "#334155" }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{c.msg}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 14, borderTop: "1px solid #1e2a3a", display: "flex", gap: 8 }}>
            <input className="input-dark" placeholder="Say something..." value={chatMsg} onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendChat()} style={{ flex: 1, padding: "10px 14px", fontSize: 13 }} />
            <button className="btn-primary" style={{ padding: "10px 14px" }} onClick={sendChat}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const GALLERY_ITEMS = [
  { id: 1,  title: "Tech Summit — Keynote Stage",       club: "IEEE Club",        category: "Technical",  emoji: "💻", color: "#6366f1", span: "wide",  aspect: "2/1"   },
  { id: 2,  title: "Cultural Dance Finals",             club: "Cultural Society", category: "Cultural",   emoji: "🎭", color: "#ec4899", span: "normal",aspect: "3/4"   },
  { id: 3,  title: "Hackathon Award Ceremony",          club: "Coding Club",      category: "Technical",  emoji: "🚀", color: "#22c55e", span: "normal",aspect: "3/4"   },
  { id: 4,  title: "Founders Day 2025 Grand Finale",    club: "Student Council",  category: "Founders",   emoji: "🎓", color: "#f59e0b", span: "tall",  aspect: "3/4"   },
  { id: 5,  title: "Photography Club Exhibition",       club: "Photo Club",       category: "Arts",       emoji: "📸", color: "#06b6d4", span: "normal",aspect: "4/3"   },
  { id: 6,  title: "Music Night Under the Stars",       club: "Music Society",    category: "Cultural",   emoji: "🎵", color: "#a855f7", span: "wide",  aspect: "2/1"   },
  { id: 7,  title: "Sports Day — 100m Sprint",          club: "Sports Council",   category: "Sports",     emoji: "🏃", color: "#f97316", span: "normal",aspect: "4/3"   },
  { id: 8,  title: "AI Workshop Highlights",            club: "AI Club",          category: "Technical",  emoji: "🤖", color: "#818cf8", span: "normal",aspect: "4/3"   },
  { id: 9,  title: "Campus Art Wall Mural",             club: "Art Society",      category: "Arts",       emoji: "🎨", color: "#ec4899", span: "wide",  aspect: "16/7"  },
  { id: 10, title: "Debate Championship Finals",        club: "Debate Club",      category: "Academic",   emoji: "🗣️", color: "#22c55e", span: "normal",aspect: "4/3"   },
  { id: 11, title: "Cricket League Trophy Ceremony",    club: "Sports Council",   category: "Sports",     emoji: "🏏", color: "#f59e0b", span: "normal",aspect: "3/4"   },
  { id: 12, title: "Startup Pitch Night",               club: "E-Cell",           category: "Technical",  emoji: "💡", color: "#06b6d4", span: "normal",aspect: "4/3"   },
];

const CATEGORIES = ["All", "Technical", "Cultural", "Sports", "Arts", "Academic", "Founders"];

function GalleryPage({ user, onLoginRequired, submitPhoto, photoSubmissions }) {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  // Approved user-submitted photos merged into gallery
  const approvedSubmissions = (photoSubmissions || [])
    .filter(p => p.status === "approved")
    .map(p => ({ ...p, id: `approved_${p.id}`, club: p.submittedBy, aspect: "4/3", span: "normal" }));

  const allItems = [...GALLERY_ITEMS, ...approvedSubmissions];

  const filtered = allItems.filter(item =>
    (filter === "All" || item.category === filter) &&
    (item.title.toLowerCase().includes(search.toLowerCase()) || item.club.toLowerCase().includes(search.toLowerCase()))
  );

  const currentIndex = lightbox ? filtered.findIndex(i => i.id === lightbox.id) : -1;
  const goPrev = () => { if (currentIndex > 0) setLightbox(filtered[currentIndex - 1]); };
  const goNext = () => { if (currentIndex < filtered.length - 1) setLightbox(filtered[currentIndex + 1]); };

  const pendingOwn = user ? (photoSubmissions || []).filter(p => p.submittedBy === user.email) : [];

  return (
    <div className="page-pad" style={{}}>

      {/* UPLOAD MODAL */}
      {showUpload && (
        <UploadPhotoModal
          user={user}
          onClose={() => { setShowUpload(false); setUploadDone(false); }}
          onSubmit={(photo) => {
            submitPhoto({ ...photo, submittedBy: user.email, submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) });
            setUploadDone(true);
          }}
          done={uploadDone}
        />
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={e => e.target === e.currentTarget && setLightbox(null)}>
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 24, right: 28, background: "rgba(255,255,255,0.08)", border: "1px solid #1e2a3a", borderRadius: 10, color: "#e2e8f0", cursor: "pointer", fontSize: 18, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          {currentIndex > 0 && (
            <button onClick={goPrev} style={{ position: "absolute", left: 28, background: "rgba(255,255,255,0.08)", border: "1px solid #1e2a3a", borderRadius: 12, color: "#e2e8f0", cursor: "pointer", fontSize: 22, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          )}
          {currentIndex < filtered.length - 1 && (
            <button onClick={goNext} style={{ position: "absolute", right: 28, background: "rgba(255,255,255,0.08)", border: "1px solid #1e2a3a", borderRadius: 12, color: "#e2e8f0", cursor: "pointer", fontSize: 22, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          )}
          <div style={{ background: "#0f1623", border: "1px solid #1e2a3a", borderRadius: 20, overflow: "hidden", maxWidth: 700, width: "90%", position: "relative" }}>
            <div style={{ background: `linear-gradient(135deg, ${lightbox.color}33 0%, ${lightbox.color}11 50%, #080c14 100%)`, height: 360, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110, position: "relative" }}>
              {lightbox.emoji}
              <div style={{ position: "absolute", top: 14, left: 14, background: `${lightbox.color}33`, border: `1px solid ${lightbox.color}66`, borderRadius: 20, padding: "5px 14px", fontSize: 12, color: lightbox.color, fontWeight: 700 }}>{lightbox.category}</div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(transparent, #0f1623)" }}></div>
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{lightbox.title}</h2>
              <div style={{ fontSize: 14, color: "#475569", marginBottom: 16 }}>📌 {lightbox.club}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-primary" style={{ flex: 1, padding: "10px" }}>⬇ Download</button>
                <button className="btn-outline" style={{ flex: 1, padding: "10px" }}>🔗 Share</button>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 16, right: 20, fontSize: 13, color: "#334155" }}>{currentIndex + 1} / {filtered.length}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div className="section-title" style={{ marginBottom: 6 }}>Event Gallery</div>
          <p style={{ color: "#475569", fontSize: 14 }}>{filtered.length} photos from across campus events</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input className="input-dark" placeholder="🔍  Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 180 }} />
          {user ? (
            <button className="btn-primary" style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", fontSize: 13 }} onClick={() => { setUploadDone(false); setShowUpload(true); }}>
              <span>📷</span> Upload
            </button>
          ) : (
            <button className="btn-outline" style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", fontSize: 13 }} onClick={onLoginRequired}>
              <span>📷</span> Upload
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`filter-btn ${filter === cat ? "active" : ""}`} onClick={() => setFilter(cat)}>
            {cat === "All" ? "✦ All" : cat}
          </button>
        ))}
      </div>

      {/* My Submissions status strip (logged-in students) */}
      {user && pendingOwn.length > 0 && (
        <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 14, padding: "18px 24px", marginBottom: 36 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#818cf8", marginBottom: 12, letterSpacing: "0.05em" }}>📬 MY SUBMISSIONS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pendingOwn.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#0a0e18", borderRadius: 10, padding: "10px 14px" }}>
                <span style={{ fontSize: 22 }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{p.submittedAt} · {p.category}</div>
                </div>
                <div style={{
                  padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: p.status === "approved" ? "rgba(34,197,94,0.12)" : p.status === "rejected" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                  border: `1px solid ${p.status === "approved" ? "rgba(34,197,94,0.3)" : p.status === "rejected" ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
                  color: p.status === "approved" ? "#22c55e" : p.status === "rejected" ? "#f87171" : "#fbbf24"
                }}>
                  {p.status === "approved" ? "✓ Published" : p.status === "rejected" ? "✕ Rejected" : "⏳ Pending Review"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Login nudge for guests */}
      {!user && (
        <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 14, padding: "16px 24px", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 24 }}>📷</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Have photos from a campus event?</div>
            <div style={{ fontSize: 13, color: "#475569" }}>Login to submit your photos for gallery inclusion — subject to admin approval.</div>
          </div>
          <button className="btn-primary" style={{ whiteSpace: "nowrap", fontSize: 13 }} onClick={onLoginRequired}>Login to Upload</button>
        </div>
      )}

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: "#475569", padding: "80px 0", fontSize: 16 }}>No photos found.</div>
      ) : (
        <div className="gallery-cols" style={{}}>
          {filtered.map(item => (
            <div key={item.id} className="gallery-item" onClick={() => setLightbox(item)}
              style={{ breakInside: "avoid", marginBottom: 20, display: "block" }}>
              <div style={{
                background: `linear-gradient(145deg, ${item.color}28 0%, ${item.color}0d 40%, #080c14 100%)`,
                aspectRatio: item.aspect,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: item.span === "wide" ? 64 : item.span === "tall" ? 72 : 56,
                position: "relative", minHeight: 140,
              }}>
                {item.emoji}
                <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${item.color}15 1px, transparent 1px)`, backgroundSize: "24px 24px", opacity: 0.6 }}></div>
                {/* Student-submitted badge */}
                {String(item.id).startsWith("approved_") && (
                  <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700, color: "#22c55e" }}>Student Photo</div>
                )}
              </div>
              <div className="gallery-overlay">
                <div style={{ display: "inline-block", background: `${item.color}33`, border: `1px solid ${item.color}55`, borderRadius: 12, padding: "2px 10px", fontSize: 11, color: item.color, fontWeight: 700, marginBottom: 6, width: "fit-content" }}>{item.category}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{item.club}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadPhotoModal({ user, onClose, onSubmit, done }) {
  const EMOJIS = ["📸","🎓","🏆","🎭","💻","🎨","🤝","🎵","🌱","🎬","🧪","🚀","🎤","🏃","🎊"];
  const COLORS = ["#6366f1","#ec4899","#22c55e","#f59e0b","#06b6d4","#a855f7","#f97316","#ef4444"];
  const CATS = ["Technical","Cultural","Sports","Arts","Academic","Founders"];
  const [form, setForm] = useState({ title: "", caption: "", category: "Cultural", emoji: "📸", color: "#6366f1" });
  const [err, setErr] = useState("");
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.title || !form.category) { setErr("Please fill in the title and category."); return; }
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 500, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#6366f1,#ec4899,transparent)", borderRadius: "20px 20px 0 0" }} />
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 20 }}>✕</button>

        {done ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📬</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 10 }}>Photo Submitted!</div>
            <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Your photo is pending admin approval.<br />It'll appear in the gallery once approved.</div>
            <button className="btn-primary" style={{ marginTop: 24, padding: "11px 28px" }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>📷 Submit a Photo</div>
              <div style={{ fontSize: 13, color: "#475569" }}>Your photo will appear in the gallery after admin review.</div>
            </div>

            {/* Emoji preview */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: `${form.color}22`, border: `2px solid ${form.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{form.emoji}</div>
            </div>

            {/* Emoji picker */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.08em" }}>CHOOSE AN EMOJI THUMBNAIL</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {EMOJIS.map(e => (
                  <div key={e} onClick={() => upd("emoji", e)} style={{ width: 36, height: 36, borderRadius: 8, background: form.emoji === e ? `${form.color}33` : "#0f1623", border: `1px solid ${form.emoji === e ? form.color : "#1e2a3a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", transition: "all 0.15s" }}>{e}</div>
                ))}
              </div>
            </div>

            {/* Accent color */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.08em" }}>ACCENT COLOR</label>
              <div style={{ display: "flex", gap: 8 }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => upd("color", c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: form.color === c ? "3px solid white" : "3px solid transparent", transition: "all 0.15s" }} />
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.08em" }}>PHOTO TITLE *</label>
              <input className="input-dark" placeholder="e.g. Hackathon Finals 2026" value={form.title} onChange={e => upd("title", e.target.value)} />
            </div>

            {/* Caption */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6, letterSpacing: "0.08em" }}>CAPTION</label>
              <textarea className="input-dark" placeholder="A short caption for this photo..." value={form.caption} onChange={e => upd("caption", e.target.value)} style={{ minHeight: 70, resize: "vertical" }} />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, letterSpacing: "0.08em" }}>CATEGORY *</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CATS.map(c => (
                  <button key={c} onClick={() => upd("category", c)} style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${form.category === c ? "#6366f1" : "#1e2a3a"}`, background: form.category === c ? "rgba(99,102,241,0.2)" : "transparent", color: form.category === c ? "#a5b4fc" : "#64748b", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, transition: "all 0.2s" }}>{c}</button>
                ))}
              </div>
            </div>

            {err && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 14 }}>{err}</div>}

            <button onClick={handleSubmit} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", border: "none", borderRadius: 12, color: "white", fontFamily: "inherit", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Submit for Review →
            </button>
            <div style={{ textAlign: "center", fontSize: 12, color: "#334155", marginTop: 12 }}>Submitted as <span style={{ color: "#818cf8" }}>{user?.email}</span></div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PROPOSE EVENT MODAL
// ─────────────────────────────────────────────
function ProposeEventModal({ user, onClose, onSubmit }) {
  const EMOJIS = ["💡","🎵","🎭","💻","🏆","📸","🌱","🎤","🤖","🎨","🗣️","🚀","🏃","🎬","🧠"];
  const COLORS = ["#6366f1","#ec4899","#22c55e","#f59e0b","#06b6d4","#a855f7","#f97316","#818cf8"];
  const [form, setForm] = useState({ title:"", desc:"", category:"", date:"", location:"", max:"", club:"", emoji:"💡", color:"#6366f1" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const update = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleSubmit = () => {
    if (!form.title || !form.date || !form.location) { setError("Please fill Title, Date and Location."); return; }
    setDone(true);
    setTimeout(() => { onSubmit(form); }, 1600);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 520, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#22c55e,transparent)", borderRadius:"20px 20px 0 0" }}></div>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:20 }}>✕</button>

        {done ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:64, marginBottom:16 }}>📬</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#f1f5f9", marginBottom:10 }}>Proposal Submitted!</div>
            <div style={{ fontSize:14, color:"#64748b" }}>Your event has been sent to the admin for review.<br />You'll be notified once it's approved.</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:20, fontWeight:800, color:"#f1f5f9", marginBottom:4 }}>💡 Propose an Event</div>
              <div style={{ fontSize:13, color:"#475569" }}>Submit your event idea for admin review and approval.</div>
            </div>

            {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#f87171", marginBottom:16 }}>{error}</div>}

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>EVENT TITLE *</label>
                <input className="input-dark" placeholder="e.g. Annual Robotics Challenge" value={form.title} onChange={e=>update("title",e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>DESCRIPTION</label>
                <textarea className="input-dark" placeholder="What's this event about?" value={form.desc} onChange={e=>update("desc",e.target.value)} style={{ minHeight:80 }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>CATEGORY</label>
                  <select className="input-dark" value={form.category} onChange={e=>update("category",e.target.value)}>
                    <option value="">Select</option>
                    {["Technical","Cultural","Sports","Academic","Social","Other"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>DATE *</label>
                  <input type="date" className="input-dark" value={form.date} onChange={e=>update("date",e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>LOCATION *</label>
                  <input className="input-dark" placeholder="Venue" value={form.location} onChange={e=>update("location",e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>MAX PARTICIPANTS</label>
                  <input type="number" className="input-dark" placeholder="e.g. 200" value={form.max} onChange={e=>update("max",e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>CLUB / ORGANIZING TEAM</label>
                <input className="input-dark" placeholder="e.g. Robotics Club" value={form.club} onChange={e=>update("club",e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:8 }}>PICK ICON</label>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {EMOJIS.map(em=>(
                    <div key={em} onClick={()=>update("emoji",em)} style={{ width:36, height:36, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, cursor:"pointer", background: form.emoji===em?"rgba(99,102,241,0.25)":"#080c14", border: form.emoji===em?"1px solid #4f46e5":"1px solid #1e2a3a", transition:"all 0.15s" }}>{em}</div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:8 }}>ACCENT COLOR</label>
                <div style={{ display:"flex", gap:8 }}>
                  {COLORS.map(c=>(
                    <div key={c} onClick={()=>update("color",c)} style={{ width:28, height:28, borderRadius:"50%", background:c, cursor:"pointer", border: form.color===c?"3px solid white":"3px solid transparent", transition:"all 0.15s" }}></div>
                  ))}
                </div>
              </div>
              <button className="btn-primary" style={{ padding:"13px", fontSize:15, marginTop:4, background:"linear-gradient(135deg,#16a34a,#15803d)" }} onClick={handleSubmit}>
                📬 Submit Proposal
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  ADMIN PORTAL
// ─────────────────────────────────────────────
function AdminPortal({ user, setUser, proposedEvents, liveEvents, acceptProposal, rejectProposal, updateEvent, deleteEvent, addEvent, photoSubmissions, approvePhoto, rejectPhoto }) {
  const [section, setSection] = useState("dashboard");
  const [editEvent, setEditEvent] = useState(null);
  const [createForm, setCreateForm] = useState({ title:"", date:"", location:"", club:"", emoji:"🎉", color:"#6366f1", desc:"" });
  const [createDone, setCreateDone] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const COLORS_ADM = ["#6366f1","#ec4899","#22c55e","#f59e0b","#06b6d4","#a855f7","#ef4444","#f97316"];

  const pending = proposedEvents.filter(p => p.status === "pending");
  const accepted = proposedEvents.filter(p => p.status === "accepted");
  const rejected = proposedEvents.filter(p => p.status === "rejected");

  const pendingPhotos = (photoSubmissions || []).filter(p => p.status === "pending");

  const ADMIN_NAV = [
    { key:"dashboard", icon:"📊", label:"Dashboard" },
    { key:"events", icon:"📋", label:"Manage Events" },
    { key:"create", icon:"➕", label:"Create Event" },
    { key:"proposals", icon:"📬", label:"Proposals", badge: pending.length },
    { key:"photos", icon:"📷", label:"Photo Approvals", badge: pendingPhotos.length },
    { key:"history", icon:"📁", label:"History" },
  ];

  return (
    <div style={{ fontFamily:"'Outfit','Syne',sans-serif", background:"#05080f", minHeight:"100vh", color:"#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-thumb { background:#f59e0b44; border-radius:3px; }
        .adm-nav-item { display:flex; align-items:center; gap:12px; padding:12px 20px; border-radius:12px; cursor:pointer; transition:all 0.2s; font-size:14px; font-weight:600; color:#475569; position:relative; }
        .adm-nav-item:hover { background:rgba(245,158,11,0.08); color:#94a3b8; }
        .adm-nav-item.active { background:rgba(245,158,11,0.15); color:#fbbf24; }
        .adm-card { background:#0a0f1a; border:1px solid #1a2235; border-radius:16px; padding:24px; }
        .adm-btn { padding:9px 18px; border-radius:9px; border:none; font-family:inherit; font-weight:700; font-size:13px; cursor:pointer; transition:all 0.2s; }
        .adm-btn-accept { background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.4); color:#22c55e; }
        .adm-btn-accept:hover { background:rgba(34,197,94,0.25); }
        .adm-btn-reject { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#f87171; }
        .adm-btn-reject:hover { background:rgba(239,68,68,0.2); }
        .adm-btn-edit { background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.3); color:#818cf8; }
        .adm-btn-edit:hover { background:rgba(99,102,241,0.2); }
        .adm-btn-del { background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); color:#f87171; }
        .adm-input { background:#080c14; border:1px solid #1a2235; color:#e2e8f0; padding:10px 14px; border-radius:9px; font-size:13px; width:100%; font-family:inherit; outline:none; }
        .adm-input:focus { border-color:#f59e0b; }
        .stat-card { background:#0a0f1a; border:1px solid #1a2235; border-radius:14px; padding:20px 24px; }
        .adm-layout { display:flex; }
        .adm-sidebar { width:240px; border-right:1px solid #1a2235; padding:24px 16px; display:flex; flex-direction:column; min-height:100vh; position:sticky; top:0; height:100vh; flex-shrink:0; }
        .adm-main { flex:1; padding:36px 48px; overflow-y:auto; }
        .adm-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:36px; }
        .adm-topbar { display:none; }
        @media (max-width:768px) {
          .adm-layout { flex-direction:column; }
          .adm-sidebar { display:none; width:100%; min-height:auto; height:auto; position:relative; border-right:none; border-bottom:1px solid #1a2235; padding:16px; }
          .adm-sidebar.open { display:flex; }
          .adm-main { padding:20px 16px 90px; }
          .adm-stats-grid { grid-template-columns:repeat(2,1fr); gap:12px; }
          .adm-topbar { display:flex; align-items:center; gap:12px; padding:14px 16px; background:#07090f; border-bottom:1px solid #1a2235; position:sticky; top:0; z-index:10; }
        }
      `}</style>

      {/* MOBILE TOPBAR */}
      <div className="adm-topbar">
        <div style={{ display:"flex", alignItems:"center", gap:8, flex:1 }}>
          <div style={{ width:30, height:30, background:"linear-gradient(135deg,#d97706,#b45309)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🛡️</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, color:"#fbbf24" }}>EVENTRA ADMIN</span>
        </div>
        <button onClick={()=>setSidebarOpen(p=>!p)} style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:8, color:"#fbbf24", cursor:"pointer", padding:"7px 12px", fontFamily:"inherit", fontWeight:700, fontSize:13 }}>{sidebarOpen?"✕ Close":"☰ Menu"}</button>
        <button onClick={()=>setUser(null)} style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, color:"#f87171", cursor:"pointer", padding:"7px 12px", fontFamily:"inherit", fontWeight:700, fontSize:13 }}>Logout</button>
      </div>

      {/* LAYOUT */}
      <div className="adm-layout">

      {/* SIDEBAR */}
      <div className={`adm-sidebar${sidebarOpen?" open":""}`}>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 4px", marginBottom:36 }}>
          <div style={{ width:34, height:34, background:"linear-gradient(135deg,#d97706,#b45309)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🛡️</div>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, color:"#fbbf24" }}>EVENTRA</div>
            <div style={{ fontSize:10, color:"#475569", letterSpacing:"0.1em" }}>ADMIN PORTAL</div>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1 }}>
          {ADMIN_NAV.map(n => (
            <div key={n.key} className={`adm-nav-item ${section===n.key?"active":""}`} onClick={()=>setSection(n.key)}>
              <span style={{ fontSize:16 }}>{n.icon}</span>
              <span>{n.label}</span>
              {n.badge > 0 && <div style={{ marginLeft:"auto", background:"#ef4444", borderRadius:20, padding:"1px 8px", fontSize:11, fontWeight:800, color:"white" }}>{n.badge}</div>}
            </div>
          ))}
        </div>

        <div style={{ borderTop:"1px solid #1a2235", paddingTop:16, marginTop:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 4px", marginBottom:12 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#d97706,#b45309)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800 }}>A</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>{user.name}</div>
              <div style={{ fontSize:11, color:"#475569" }}>Administrator</div>
            </div>
          </div>
          <button onClick={()=>setUser(null)} style={{ width:"100%", padding:"9px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:9, color:"#f87171", cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:13 }}>← Logout</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="adm-main">

        {/* ── DASHBOARD ── */}
        {section==="dashboard" && (
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#fbbf24", marginBottom:6 }}>Dashboard</div>
            <div style={{ color:"#475569", marginBottom:32 }}>Welcome back, Admin. Here's today's overview.</div>
            <div className="adm-stats-grid">
              {[
                { label:"Total Events", value: liveEvents.length, icon:"📋", color:"#6366f1" },
                { label:"Pending Proposals", value: pending.length, icon:"📬", color:"#f59e0b" },
                { label:"Accepted Proposals", value: accepted.length, icon:"✅", color:"#22c55e" },
                { label:"Photo Submissions", value: pendingPhotos.length, icon:"📷", color:"#ec4899" },
              ].map(s=>(
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
                  <div style={{ fontSize:13, color:"#475569" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {pending.length > 0 && (
              <div className="adm-card">
                <div style={{ fontWeight:700, color:"#e2e8f0", marginBottom:16, fontSize:15 }}>🔔 Pending Proposals</div>
                {pending.slice(0,3).map(p=>(
                  <div key={p.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:"1px solid #1a2235" }}>
                    <div style={{ fontSize:28 }}>{p.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, color:"#e2e8f0", fontSize:14 }}>{p.title}</div>
                      <div style={{ fontSize:12, color:"#475569" }}>{p.category} · {p.date} · by {p.proposedBy}</div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="adm-btn adm-btn-accept" onClick={()=>acceptProposal(p.id)}>✓ Accept</button>
                      <button className="adm-btn adm-btn-reject" onClick={()=>rejectProposal(p.id)}>✕ Reject</button>
                    </div>
                  </div>
                ))}
                {pending.length > 3 && <div style={{ marginTop:12, fontSize:13, color:"#475569", cursor:"pointer", color:"#818cf8" }} onClick={()=>setSection("proposals")}>View all {pending.length} proposals →</div>}
              </div>
            )}
          </div>
        )}

        {/* ── MANAGE EVENTS ── */}
        {section==="events" && (
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#fbbf24", marginBottom:6 }}>Manage Events</div>
            <div style={{ color:"#475569", marginBottom:28 }}>Edit or remove live events from the platform.</div>

            {editEvent && <EditEventModal event={editEvent} onSave={(updated)=>{ updateEvent(updated); setEditEvent(null); }} onClose={()=>setEditEvent(null)} />}

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {liveEvents.map(ev=>(
                <div key={ev.id} className="adm-card" style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ width:52, height:52, borderRadius:12, background:`${ev.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{ev.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:"#f1f5f9", fontSize:15 }}>{ev.title}</div>
                    <div style={{ fontSize:13, color:"#475569", marginTop:3 }}>📅 {ev.date} &nbsp;·&nbsp; 📍 {ev.location} &nbsp;·&nbsp; 🏛️ {ev.club}</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="adm-btn adm-btn-edit" onClick={()=>setEditEvent(ev)}>✏️ Edit</button>
                    <button className="adm-btn adm-btn-del" onClick={()=>{ if(window.confirm("Delete this event?")) deleteEvent(ev.id); }}>🗑</button>
                  </div>
                </div>
              ))}
              {liveEvents.length === 0 && <div style={{ color:"#475569", textAlign:"center", padding:"40px 0" }}>No events. Accept some proposals or create events.</div>}
            </div>
          </div>
        )}

        {/* ── CREATE EVENT ── */}
        {section==="create" && (
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#fbbf24", marginBottom:6 }}>Create Event</div>
            <div style={{ color:"#475569", marginBottom:28 }}>Directly publish a new event to the platform.</div>
            {createDone && (
              <div style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:12, padding:"14px 20px", marginBottom:24, color:"#22c55e", fontWeight:600, fontSize:14 }}>
                ✅ Event published successfully!
              </div>
            )}
            <div className="adm-card" style={{ maxWidth:580 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:6, letterSpacing:"0.08em" }}>EVENT TITLE</label>
                  <input className="adm-input" placeholder="e.g. Annual Tech Summit" value={createForm.title} onChange={e=>setCreateForm(p=>({...p,title:e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:6, letterSpacing:"0.08em" }}>DESCRIPTION</label>
                  <textarea className="adm-input" placeholder="Short event description..." rows={3} style={{ resize:"vertical" }} value={createForm.desc} onChange={e=>setCreateForm(p=>({...p,desc:e.target.value}))} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:6, letterSpacing:"0.08em" }}>DATE</label>
                    <input className="adm-input" type="date" value={createForm.date} onChange={e=>setCreateForm(p=>({...p,date:e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:6, letterSpacing:"0.08em" }}>LOCATION</label>
                    <input className="adm-input" placeholder="e.g. Auditorium A" value={createForm.location} onChange={e=>setCreateForm(p=>({...p,location:e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:6, letterSpacing:"0.08em" }}>CLUB / ORGANISER</label>
                    <input className="adm-input" placeholder="e.g. IEEE Club" value={createForm.club} onChange={e=>setCreateForm(p=>({...p,club:e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:6, letterSpacing:"0.08em" }}>EMOJI</label>
                    <input className="adm-input" placeholder="🎉" value={createForm.emoji} onChange={e=>setCreateForm(p=>({...p,emoji:e.target.value}))} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:8, letterSpacing:"0.08em" }}>ACCENT COLOR</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {COLORS_ADM.map(c=>(
                      <div key={c} onClick={()=>setCreateForm(p=>({...p,color:c}))} style={{ width:28, height:28, borderRadius:"50%", background:c, cursor:"pointer", border: createForm.color===c?"3px solid white":"3px solid transparent", transition:"all 0.15s" }} />
                    ))}
                  </div>
                </div>
                <button onClick={()=>{
                  if(!createForm.title||!createForm.date) return;
                  const newEv = { id: Date.now(), title: createForm.title, date: createForm.date, location: createForm.location||"TBD", club: createForm.club||"Admin", emoji: createForm.emoji||"🎉", color: createForm.color };
                  addEvent(newEv);
                  setCreateDone(true); setTimeout(()=>setCreateDone(false),3000);
                  setCreateForm({ title:"", date:"", location:"", club:"", emoji:"🎉", color:"#6366f1", desc:"" });
                }} style={{ padding:"13px", background:"linear-gradient(135deg,#d97706,#b45309)", border:"none", borderRadius:10, color:"white", fontFamily:"inherit", fontWeight:700, fontSize:15, cursor:"pointer", marginTop:4 }}>
                  ➕ Publish Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PROPOSALS ── */}
        {section==="proposals" && (
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#fbbf24", marginBottom:6 }}>Event Proposals</div>
            <div style={{ color:"#475569", marginBottom:28 }}>Review and action all submitted proposals.</div>
            {proposedEvents.length === 0 && <div style={{ color:"#475569", textAlign:"center", padding:"60px 0", fontSize:15 }}>No proposals yet.</div>}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {proposedEvents.map(p=>(
                <div key={p.id} className="adm-card" style={{ borderLeft:`3px solid ${p.status==="accepted"?"#22c55e":p.status==="rejected"?"#ef4444":"#f59e0b"}` }}>
                  <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                    <div style={{ fontSize:36 }}>{p.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                        <div style={{ fontWeight:700, fontSize:16, color:"#f1f5f9" }}>{p.title}</div>
                        <div style={{ padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700, background: p.status==="accepted"?"rgba(34,197,94,0.15)":p.status==="rejected"?"rgba(239,68,68,0.1)":"rgba(245,158,11,0.12)", color: p.status==="accepted"?"#22c55e":p.status==="rejected"?"#f87171":"#fbbf24", border: `1px solid ${p.status==="accepted"?"rgba(34,197,94,0.3)":p.status==="rejected"?"rgba(239,68,68,0.3)":"rgba(245,158,11,0.3)"}` }}>
                          {p.status.toUpperCase()}
                        </div>
                      </div>
                      <div style={{ fontSize:13, color:"#475569", marginBottom:8 }}>
                        {p.category} &nbsp;·&nbsp; 📅 {p.date} &nbsp;·&nbsp; 📍 {p.location} &nbsp;·&nbsp; 🏛️ {p.club || "—"}
                      </div>
                      {p.desc && <div style={{ fontSize:13, color:"#64748b", marginBottom:8 }}>{p.desc}</div>}
                      <div style={{ fontSize:12, color:"#334155" }}>Proposed by: <span style={{ color:"#6366f1" }}>{p.proposedBy}</span></div>
                    </div>
                    {p.status==="pending" && (
                      <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                        <button className="adm-btn adm-btn-accept" onClick={()=>acceptProposal(p.id)}>✓ Accept</button>
                        <button className="adm-btn adm-btn-reject" onClick={()=>rejectProposal(p.id)}>✕ Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PHOTO APPROVALS ── */}
        {section==="photos" && (
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#fbbf24", marginBottom:6 }}>Photo Approvals</div>
            <div style={{ color:"#475569", marginBottom:28 }}>Review and publish student-submitted gallery photos.</div>

            {(photoSubmissions||[]).length === 0 && (
              <div style={{ color:"#475569", textAlign:"center", padding:"60px 0", fontSize:15 }}>No photo submissions yet.</div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {(photoSubmissions||[]).map(p => (
                <div key={p.id} className="adm-card" style={{ display:"flex", alignItems:"center", gap:18, borderLeft:`3px solid ${p.status==="approved"?"#22c55e":p.status==="rejected"?"#ef4444":"#f59e0b"}` }}>
                  {/* Thumbnail */}
                  <div style={{ width:64, height:64, borderRadius:14, background:`${p.color}22`, border:`1px solid ${p.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0 }}>{p.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                      <div style={{ fontWeight:700, fontSize:15, color:"#f1f5f9" }}>{p.title}</div>
                      <div style={{ padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700,
                        background: p.status==="approved"?"rgba(34,197,94,0.12)":p.status==="rejected"?"rgba(239,68,68,0.1)":"rgba(245,158,11,0.1)",
                        border:`1px solid ${p.status==="approved"?"rgba(34,197,94,0.3)":p.status==="rejected"?"rgba(239,68,68,0.3)":"rgba(245,158,11,0.3)"}`,
                        color: p.status==="approved"?"#22c55e":p.status==="rejected"?"#f87171":"#fbbf24"
                      }}>{p.status.toUpperCase()}</div>
                    </div>
                    {p.caption && <div style={{ fontSize:13, color:"#64748b", marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>"{p.caption}"</div>}
                    <div style={{ fontSize:12, color:"#334155" }}>
                      <span style={{ color:"#6366f1" }}>{p.submittedBy}</span>
                      <span style={{ margin:"0 8px", color:"#1e2a3a" }}>·</span>
                      {p.category}
                      <span style={{ margin:"0 8px", color:"#1e2a3a" }}>·</span>
                      {p.submittedAt}
                    </div>
                  </div>
                  {p.status==="pending" && (
                    <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                      <button className="adm-btn adm-btn-accept" onClick={()=>approvePhoto(p.id)}>✓ Publish</button>
                      <button className="adm-btn adm-btn-reject" onClick={()=>rejectPhoto(p.id)}>✕ Reject</button>
                    </div>
                  )}
                  {p.status!=="pending" && (
                    <div style={{ fontSize:13, color:"#334155", flexShrink:0 }}>{p.status==="approved"?"Published to gallery":"Rejected"}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {section==="history" && (
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#fbbf24", marginBottom:6 }}>History</div>
            <div style={{ color:"#475569", marginBottom:28 }}>Accepted and rejected proposals.</div>
            {[...accepted, ...rejected].length === 0 && <div style={{ color:"#475569", textAlign:"center", padding:"60px 0" }}>No history yet.</div>}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[...accepted, ...rejected].map(p=>(
                <div key={p.id} className="adm-card" style={{ display:"flex", alignItems:"center", gap:14, opacity: p.status==="rejected" ? 0.6 : 1 }}>
                  <div style={{ fontSize:28 }}>{p.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14, color:"#e2e8f0" }}>{p.title}</div>
                    <div style={{ fontSize:12, color:"#475569" }}>{p.date} · {p.proposedBy}</div>
                  </div>
                  <div style={{ padding:"3px 12px", borderRadius:20, fontSize:12, fontWeight:700, background: p.status==="accepted"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.08)", color: p.status==="accepted"?"#22c55e":"#f87171" }}>
                    {p.status==="accepted"?"✓ Published":"✕ Rejected"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      </div>{/* end adm-layout */}
    </div>
  );
}

function EditEventModal({ event, onSave, onClose }) {
  const [form, setForm] = useState({ ...event });
  const update = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box" style={{ width:480 }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#f59e0b,transparent)", borderRadius:"20px 20px 0 0" }}></div>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:20 }}>✕</button>
        <div style={{ fontSize:18, fontWeight:700, color:"#fbbf24", marginBottom:24 }}>✏️ Edit Event</div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>EVENT TITLE</label>
            <input className="adm-input" value={form.title} onChange={e=>update("title",e.target.value)} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>DATE</label>
              <input className="adm-input" value={form.date} onChange={e=>update("date",e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>LOCATION</label>
              <input className="adm-input" value={form.location} onChange={e=>update("location",e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>CLUB</label>
              <input className="adm-input" value={form.club} onChange={e=>update("club",e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6 }}>EMOJI</label>
              <input className="adm-input" value={form.emoji} onChange={e=>update("emoji",e.target.value)} />
            </div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button onClick={()=>onSave(form)} style={{ flex:1, padding:"12px", background:"linear-gradient(135deg,#d97706,#b45309)", border:"none", borderRadius:10, color:"white", fontFamily:"inherit", fontWeight:700, fontSize:14, cursor:"pointer" }}>Save Changes</button>
            <button onClick={onClose} style={{ padding:"12px 20px", background:"transparent", border:"1px solid #1a2235", borderRadius:10, color:"#64748b", fontFamily:"inherit", fontWeight:600, fontSize:14, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
