import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, LogIn, LogOut, Plus, Shield, ShoppingCart, Ticket, User, X } from "lucide-react";
import QRCode from "qrcode";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Gallery } from "./components/Gallery";
import { Footer } from "./components/Footer";
import { api, ApiError, EventDto, OrderDto, TicketDto, UserDto } from "./api";

type Page = "home" | "shop" | "profile";

const statusText: Record<string, string> = {
  ACTIVE: "В ПРОДАЖЕ",
  ANNOUNCED: "АНОНС",
  SOLD_OUT: "SOLD OUT",
  HIDDEN: "СКРЫТО",
  AWAITING_PAYMENT: "ОЖИДАЕТ ОПЛАТУ",
  PENDING_CONFIRMATION: "НА ПРОВЕРКЕ",
  CONFIRMED: "ПОДТВЕРЖДЕНО",
  CANCELLED: "ОТМЕНЕНО",
};

const money = (value: number, currency = "KZT") =>
  new Intl.NumberFormat("ru-KZ", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

const dateTime = (value: string) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function App() {
  const [page, setPage] = useState<Page>(() => (localStorage.getItem("ticketing_last_page") as Page) || "home");
  const [events, setEvents] = useState<EventDto[]>([]);
  const [user, setUser] = useState<UserDto | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [notice, setNotice] = useState("");

  const refreshEvents = async () => {
    try {
      setEvents(await api.events());
    } catch {
      setNotice("Backend пока недоступен: запусти Python backend на localhost:8000.");
    }
  };

  const refreshUser = async () => {
    if (!api.getToken()) {
      setAuthChecked(true);
      return;
    }
    try {
      setUser(await api.me());
    } catch (error) {
      if (error instanceof ApiError && [401, 403].includes(error.status)) {
        api.clearToken();
        setUser(null);
      } else {
        setNotice("Не удалось проверить сессию, но токен сохранен. Проверь backend.");
      }
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    refreshEvents();
    refreshUser();
  }, []);

  const go = (next: Page) => {
    setNotice("");
    setPage(next);
    localStorage.setItem("ticketing_last_page", next);
    if (next === "shop") refreshEvents();
    if (next === "profile") refreshUser();
  };

  return (
    <div className="app-shell">
      <style>{styles}</style>
      <a href="#main" className="skip-link">Пропустить навигацию</a>
      <header className="topbar">
        <button className="brand" onClick={() => go("home")}>404</button>
        <nav aria-label="Главная навигация">
          <button className={page === "shop" ? "active" : ""} aria-current={page === "shop" ? "page" : undefined} onClick={() => go("shop")}><ShoppingCart size={16} /> Билеты</button>
          <button className={page === "profile" ? "active" : ""} aria-current={page === "profile" ? "page" : undefined} onClick={() => go("profile")}><User size={16} /> Профиль</button>
        </nav>
      </header>

      {notice && <div className="notice">{notice}</div>}

      <div id="main" tabIndex={-1}>
        {page === "home" && (
          <>
            <Hero />
            <ShopPreview events={events} onBuy={() => go("shop")} />
            <About />
            <Gallery />
            <Footer />
          </>
        )}
        {page === "shop" && <ShopPage events={events} refreshEvents={refreshEvents} user={user} onHome={() => go("home")} />}
        {page === "profile" && <ProfilePage user={user} authChecked={authChecked} setUser={setUser} refreshPublicEvents={refreshEvents} />}
      </div>
    </div>
  );
}

function ShopPreview({ events, onBuy }: { events: EventDto[]; onBuy: () => void }) {
  return (
    <section className="section">
      <div className="section-head">
        <span>// БЛИЖАЙШИЕ_МЕРОПРИЯТИЯ</span>
        <h2>СОБЫТИЯ</h2>
      </div>
      <div className="event-list">
        {events.slice(0, 3).map((event) => (
          <article className="event-row" key={event.id}>
            <div className="date-tile">
              <b>{new Date(event.startAt).getDate()}</b>
              <small>{new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(new Date(event.startAt))}</small>
            </div>
            <div className="row-main">
              <p>{statusText[event.status] || event.status}</p>
              <h3>{event.title}</h3>
              <span>{event.venue}, {event.city} / {dateTime(event.startAt)}</span>
            </div>
            <button disabled={event.status !== "ACTIVE"} onClick={onBuy}><Ticket size={16} /> {money(event.price, event.currency)}</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ShopPage({ events, refreshEvents, user, onHome }: { events: EventDto[]; refreshEvents: () => Promise<void>; user: UserDto | null; onHome: () => void }) {
  const activeEvents = useMemo(() => events.filter((event) => event.status !== "HIDDEN"), [events]);
  const [selectedId, setSelectedId] = useState<number | "">("");
  const [quantity, setQuantity] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const selectedEvent = activeEvents.find((event) => event.id === selectedId);

  useEffect(() => {
    refreshEvents();
  }, []);

  useEffect(() => {
    if (!selectedId && activeEvents[0]) setSelectedId(activeEvents[0].id);
  }, [activeEvents, selectedId]);

  useEffect(() => {
    if (!user) return;
    const parts = user.fullName.split(" ");
    setFirstName((value) => value || parts[0] || "");
    setLastName((value) => value || parts.slice(1).join(" ") || "");
    setEmail((value) => value || user.email || "");
    setPhone((value) => value || user.phone || "");
    setTelegramUsername((value) => value || user.telegramUsername || "");
  }, [user]);

  const submit = async () => {
    if (!selectedEvent || !firstName.trim() || !lastName.trim()) return;
    setBusy(true);
    try {
      setOrder(await api.createOrder({ eventId: selectedEvent.id, quantity, firstName, lastName, email, phone, telegramUsername }));
    } finally {
      setBusy(false);
    }
  };

  const markPaid = async () => {
    if (!order) return;
    setBusy(true);
    try {
      setOrder(await api.markPaid(order.orderCode, comment));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page">
      <div className="section-head">
        <div className="mobile-nav-row">
          <button className="ghost" onClick={onHome}>
            <ArrowLeft size={16} /> На главную
          </button>
        </div>
        <span>// ONLINE_TICKET_GATE</span>
        <h1>Покупка билета</h1>
      </div>
      <div className="layout">
        <div className="event-grid">
          {activeEvents.map((event) => (
            <button className={`event-card ${selectedId === event.id ? "picked" : ""}`} key={event.id} onClick={() => setSelectedId(event.id)}>
              <span>{statusText[event.status] || event.status}</span>
              <h3>{event.title}</h3>
              <p>{event.subtitle}</p>
              <small>{event.venue}, {event.city}</small>
              <b>{money(event.price, event.currency)}</b>
            </button>
          ))}
        </div>
        <div className="panel sticky-panel">
          {!order ? (
            <>
              <h2>Данные заказа</h2>
              <label>Количество<input type="number" min={1} max={5} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(5, Number(e.target.value))))} /></label>
              <label>Имя<input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></label>
              <label>Фамилия<input value={lastName} onChange={(e) => setLastName(e.target.value)} /></label>
              <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label>Телефон<input value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
              <label>Telegram username<input value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} placeholder="@username" /></label>
              <button className="primary wide" disabled={!selectedEvent || busy || selectedEvent.status !== "ACTIVE"} onClick={submit}>
                <ShoppingCart size={16} /> Создать заказ
              </button>
            </>
          ) : (
            <>
              <h2>Заказ #{order.orderCode}</h2>
              <p className="muted">Статус: {statusText[order.status] || order.status}</p>
              <p className="total">{money(order.totalAmount, order.event.currency)}</p>
              <pre className="payment">{order.event.paymentDetails || "Реквизиты уточнит администратор."}</pre>
              <div className="codes">{order.tickets.map((ticket) => <code key={ticket.ticketCode}>#{ticket.ticketCode}</code>)}</div>
              <label>Комментарий к оплате<textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Например: Kaspi, 19:42, последние цифры 1234" /></label>
              <button className="primary wide" disabled={busy || order.status !== "AWAITING_PAYMENT"} onClick={markPaid}>
                <Check size={16} /> Я оплатил
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function AuthBox({ setUser }: { setUser: (user: UserDto | null) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      const result = mode === "login"
        ? await api.login(email, password)
        : await api.register(email, password, fullName, phone);
      setUser(result.user);
    } catch {
      setError("Не получилось войти. Проверь email, пароль и запущенный backend.");
    }
  };

  return (
    <div className="panel auth-panel">
      <h2>{mode === "login" ? "Вход" : "Регистрация"}</h2>
      {mode === "register" && <label>Имя<input value={fullName} onChange={(e) => setFullName(e.target.value)} /></label>}
      <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Пароль<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {mode === "register" && <label>Телефон<input value={phone} onChange={(e) => setPhone(e.target.value)} /></label>}
      {error && <p className="error">{error}</p>}
      <button className="primary wide" onClick={submit}><LogIn size={16} /> {mode === "login" ? "Войти" : "Создать аккаунт"}</button>
      <button className="ghost wide" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Нужен аккаунт" : "Уже есть аккаунт"}
      </button>
    </div>
  );
}

function TicketQr({ ticket }: { ticket: TicketDto }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const payload = `TICKET:${ticket.ticketCode}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, payload, {
      width: 132,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  }, [payload]);

  return (
    <div className="ticket-qr">
      <canvas ref={canvasRef} aria-label={`QR ${ticket.ticketCode}`} />
      <code>#{ticket.ticketCode}</code>
      <small>{statusText[ticket.status] || ticket.status}</small>
    </div>
  );
}

function ProfilePage({
  user,
  authChecked,
  setUser,
  refreshPublicEvents,
}: {
  user: UserDto | null;
  authChecked: boolean;
  setUser: (user: UserDto | null) => void;
  refreshPublicEvents: () => Promise<void>;
}) {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [tab, setTab] = useState<"orders" | "admin">("orders");

  useEffect(() => {
    if (user) api.myOrders().then(setOrders).catch(() => setOrders([]));
  }, [user]);

  if (!authChecked) {
    return <main className="page"><div className="panel auth-panel"><h2>Проверяю сессию</h2><p className="muted">Если токен сохранен, вход восстановится автоматически.</p></div></main>;
  }

  if (!user) {
    return <main className="page"><AuthBox setUser={setUser} /></main>;
  }

  return (
    <main className="page">
      <div className="profile-head">
        <div className="section-head">
          <span>// USER_NODE</span>
          <h1>{user.fullName}</h1>
        </div>
        <button className="ghost" onClick={() => { api.clearToken(); setUser(null); setOrders([]); }}><LogOut size={16} /> Выйти</button>
      </div>

      {user.role === "ADMIN" && (
        <div className="tabs">
          <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}><Ticket size={16} /> Мои билеты</button>
          <button className={tab === "admin" ? "active" : ""} onClick={() => setTab("admin")}><Shield size={16} /> Управление</button>
        </div>
      )}

      {tab === "orders" && (
        <div className="event-list spaced">
          {orders.length === 0 && <p className="muted">Заказов пока нет.</p>}
          {orders.map((order) => (
            <article className="event-row" key={order.orderCode}>
              <div className="date-tile"><b>{order.ticketCount}</b><small>бил.</small></div>
              <div className="row-main">
                <p>{statusText[order.status] || order.status}</p>
                <h3>{order.event.title}</h3>
                <span>{dateTime(order.createdAt)}</span>
                <div className="ticket-qr-grid">
                  {order.tickets.map((ticket) => <TicketQr key={ticket.ticketCode} ticket={ticket} />)}
                </div>
              </div>
              <strong>{money(order.totalAmount, order.event.currency)}</strong>
            </article>
          ))}
        </div>
      )}

      {tab === "admin" && user.role === "ADMIN" && <AdminPanel refreshPublicEvents={refreshPublicEvents} />}
    </main>
  );
}

function AdminPanel({ refreshPublicEvents }: { refreshPublicEvents: () => Promise<void> }) {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [scanCode, setScanCode] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    venue: "",
    city: "",
    startAt: "2026-06-14T23:00",
    price: 3000,
    currency: "KZT",
    paymentDetails: "",
    description: "",
    status: "ACTIVE",
  });

  const load = async () => {
    setOrders(await api.adminOrders());
    setEvents(await api.adminEvents());
  };

  useEffect(() => {
    load().catch(() => setMessage("Админ-данные недоступны. Проверь backend или токен."));
  }, []);

  const confirm = async (orderCode: string) => {
    await api.confirmOrder(orderCode);
    await load();
  };

  const cancel = async (orderCode: string) => {
    await api.cancelOrder(orderCode);
    await load();
  };

  const saveEvent = async () => {
    await api.saveEvent(form);
    setForm({ ...form, title: "", subtitle: "", description: "" });
    await load();
    await refreshPublicEvents();
  };

  const checkIn = async () => {
    setMessage("");
    try {
      const ticket = await api.checkIn(scanCode);
      setMessage(`Проход отмечен: #${ticket.ticketCode}`);
    } catch {
      setMessage("Билет не найден, не подтвержден или уже прошел.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-grid">
        <div className="panel">
          <h2>Новая афиша</h2>
          <label>Название<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Подзаголовок<input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></label>
          <label>Площадка<input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></label>
          <label>Город<input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label>
          <label>Дата и время<input type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} /></label>
          <label>Цена<input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></label>
          <label>Реквизиты<textarea value={form.paymentDetails} onChange={(e) => setForm({ ...form, paymentDetails: e.target.value })} /></label>
          <button className="primary wide" onClick={saveEvent}><Plus size={16} /> Добавить</button>
        </div>
        <div className="panel">
          <h2>QR / ручная проверка</h2>
          <label>Код билета<input value={scanCode} onChange={(e) => setScanCode(e.target.value)} placeholder="T12345678" /></label>
          <button className="primary wide" onClick={checkIn}><Check size={16} /> Отметить проход</button>
          {message && <p className="muted">{message}</p>}
        </div>
      </div>
      <h2 className="subhead">Заказы</h2>
      <div className="event-list spaced">
        {orders.map((order) => (
          <article className="event-row" key={order.orderCode}>
            <div className="date-tile"><b>{order.ticketCount}</b><small>бил.</small></div>
            <div className="row-main">
              <p>{statusText[order.status] || order.status}</p>
              <h3>#{order.orderCode} / {order.event.title}</h3>
              <span>{order.customerFirstName} {order.customerLastName} / {order.customerPhone || order.customerEmail || order.telegramUsername || "без контакта"}</span>
            </div>
            <div className="row-actions">
              <button aria-label="Подтвердить заказ" onClick={() => confirm(order.orderCode)}><Check size={16} /></button>
              <button aria-label="Отменить заказ" onClick={() => cancel(order.orderCode)}><X size={16} /></button>
            </div>
          </article>
        ))}
      </div>
      <h2 className="subhead">События в базе</h2>
      <div className="event-grid compact-grid">
        {events.map((event) => <div className="event-card readonly" key={event.id}><span>{statusText[event.status]}</span><h3>{event.title}</h3><p>{dateTime(event.startAt)}</p><b>{money(event.price, event.currency)}</b></div>)}
      </div>
    </div>
  );
}

const styles = `
  /* Accessibility: skip link */
  .skip-link { position: absolute; left: -9999px; top: auto; width: 1px; height: 1px; overflow: hidden; }
  .skip-link:focus { position: fixed; left: 16px; top: 12px; width: auto; height: auto; padding: 8px 12px; background: #39ff14; color: #000; z-index: 9999; border-radius: 6px; text-decoration: none; font-weight: 700; }
  * { box-sizing: border-box; }
  html, body, #root { width: 100%; min-height: 100%; overflow-x: hidden; }
  .app-shell { min-height: 100vh; background: #000; color: #fff; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }
  .topbar { position: fixed; top: 0; left: 0; z-index: 80; width: 100%; max-width: 100vw; height: 64px; padding: 0 calc(16px + env(safe-area-inset-right)) 0 calc(16px + env(safe-area-inset-left)); display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,.92); border-bottom: 1px solid rgba(57,255,20,.16); backdrop-filter: blur(14px); overflow: hidden; }
  .brand { flex: 0 0 auto; font-family: 'Unbounded', monospace; font-size: 28px; font-weight: 900; color: #39ff14; background: none; border: 0; cursor: pointer; line-height: 1; min-width: 0; }
  .topbar nav, .tabs { display: flex; gap: 10px; align-items: center; }
  .topbar nav button, .tabs button, .ghost, .row-actions button { min-height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.04); color: rgba(255,255,255,.72); padding: 10px 14px; cursor: pointer; font-family: 'Space Mono', monospace; font-size: 12px; white-space: nowrap; }
  .topbar nav button.active, .topbar nav button:hover, .tabs button.active, .tabs button:hover, .ghost:hover { border-color: #39ff14; color: #39ff14; }
  .mobile-nav-row { margin-bottom: 16px; display: flex; gap: 10px; align-items: center; }
  @media (min-width: 900px) { .mobile-nav-row { display: none; } }
  .notice { position: fixed; top: 76px; left: 50%; transform: translateX(-50%); z-index: 90; width: min(720px, calc(100vw - 32px)); padding: 10px 18px; background: #151515; border: 1px solid #39ff14; color: #39ff14; text-align: center; }
  .page, .section { width: min(1200px, 100%); margin: 0 auto; padding: 112px 24px 72px; }
  .responsive-container { width: min(1200px, 100%); }
  .section { padding-top: 96px; }
  .section-head { margin-bottom: 34px; min-width: 0; }
  .section-head span { font-family: 'Space Mono', monospace; font-size: 11px; color: #39ff14; overflow-wrap: anywhere; }
  .section-head h1, .section-head h2 { margin: 10px 0 0; font-family: 'Unbounded', monospace; font-size: clamp(32px, 6vw, 64px); line-height: 1.05; overflow-wrap: anywhere; }
  .profile-head { display: flex; justify-content: space-between; align-items: start; gap: 16px; }
  .layout, .admin-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(320px, .75fr); gap: 24px; align-items: start; }
  .event-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
  .compact-grid { margin-top: 16px; }
  .event-card { min-height: 210px; text-align: left; padding: 22px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.025); color: #fff; cursor: pointer; display: flex; flex-direction: column; gap: 10px; min-width: 0; width: 100%; }
  .event-card.picked, .event-card:hover { border-color: rgba(57,255,20,.65); background: rgba(57,255,20,.055); }
  .event-card.readonly { cursor: default; }
  .event-card span, .event-row p { margin: 0; color: #39ff14; font-family: 'Space Mono', monospace; font-size: 11px; overflow-wrap: anywhere; }
  .event-card h3, .event-row h3, .panel h2, .subhead { margin: 0; font-family: 'Unbounded', monospace; line-height: 1.2; overflow-wrap: anywhere; }
  .event-card p, .event-card small, .event-row span, .muted { color: rgba(255,255,255,.58); overflow-wrap: anywhere; }
  .event-card b { margin-top: auto; color: #39ff14; font-size: 22px; }
  .event-list { display: flex; flex-direction: column; gap: 2px; }
  .event-list.spaced { margin-top: 18px; gap: 10px; }
  .event-row { display: grid; grid-template-columns: 86px minmax(0, 1fr) auto; gap: 20px; align-items: center; padding: 22px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.025); min-width: 0; }
  .row-main { min-width: 0; }
  .date-tile b { display: block; color: #39ff14; font-size: 30px; font-family: 'Unbounded', monospace; line-height: 1; }
  .event-row small { color: rgba(255,255,255,.48); }
  .event-row button, .primary { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid #39ff14; background: #39ff14; color: #000; padding: 12px 18px; cursor: pointer; font-family: 'Space Mono', monospace; font-weight: 700; white-space: nowrap; }
  .event-row button:disabled, .primary:disabled { opacity: .42; cursor: not-allowed; }
  .panel { border: 1px solid rgba(57,255,20,.25); background: rgba(7,18,10,.78); padding: 24px; min-width: 0; }
  .sticky-panel { position: sticky; top: 84px; }
  .auth-panel { max-width: 460px; margin: 0 auto; }
  .tabs { margin: -12px 0 24px; overflow-x: auto; padding-bottom: 4px; }
  label { display: grid; gap: 7px; margin: 14px 0; color: rgba(255,255,255,.74); font-size: 13px; }
  input, textarea { width: 100%; min-height: 42px; border: 1px solid rgba(255,255,255,.14); background: #050505; color: #fff; padding: 10px 12px; outline: none; font: inherit; font-size: 16px; }
  textarea { min-height: 94px; resize: vertical; }
  input:focus, textarea:focus { border-color: #39ff14; }
  .payment { white-space: pre-wrap; background: #050505; border: 1px dashed rgba(57,255,20,.35); padding: 14px; color: #d7fbe0; overflow-x: auto; }
  .codes { display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0; }
  .codes code { border: 1px solid rgba(57,255,20,.32); color: #39ff14; padding: 7px 9px; overflow-wrap: anywhere; }
  .ticket-qr-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 16px; }
  .ticket-qr { display: grid; justify-items: center; gap: 7px; padding: 12px; border: 1px solid rgba(57,255,20,.24); background: rgba(0,0,0,.38); min-width: 0; }
  .ticket-qr canvas { width: 132px; height: 132px; background: #fff; padding: 6px; display: block; }
  .ticket-qr code { max-width: 100%; color: #39ff14; font-family: 'Space Mono', monospace; font-size: 12px; overflow-wrap: anywhere; }
  .ticket-qr small { text-align: center; font-family: 'Space Mono', monospace; font-size: 10px; color: rgba(255,255,255,.62); overflow-wrap: anywhere; }
  .total { color: #39ff14; font-size: 30px; margin: 12px 0; font-family: 'Unbounded', monospace; }
  .error { color: #ff6b6b; }
  .wide { width: 100%; }
  .row-actions { display: flex; gap: 8px; justify-content: end; }
  .row-actions button { width: 42px; height: 42px; padding: 0; }
  .subhead { margin-top: 34px; }
  @media (max-width: 1180px) {
    .page, .section, .responsive-container { padding-left: 18px !important; padding-right: 18px !important; }
  }
  @media (max-width: 900px) {
    .layout, .admin-grid { grid-template-columns: 1fr; }
    .sticky-panel { position: static; }
    .about-grid { grid-template-columns: 1fr !important; gap: 42px !important; }
    .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 34px !important; }
  }
  @media (max-width: 760px) {
    .app-shell { padding-bottom: calc(76px + env(safe-area-inset-bottom)); }
    .topbar { height: calc(58px + env(safe-area-inset-top)); padding: env(safe-area-inset-top) calc(12px + env(safe-area-inset-right)) 0 calc(12px + env(safe-area-inset-left)); border-bottom-color: rgba(57,255,20,.12); }
    .brand { font-size: 24px; }
    .topbar nav { position: fixed; left: calc(10px + env(safe-area-inset-left)); right: calc(10px + env(safe-area-inset-right)); bottom: calc(10px + env(safe-area-inset-bottom)); z-index: 100; width: auto; max-width: calc(100vw - 20px - env(safe-area-inset-left) - env(safe-area-inset-right)); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 8px; padding: 8px; background: rgba(0,0,0,.94); border: 1px solid rgba(57,255,20,.22); backdrop-filter: blur(14px); overflow: hidden; }
    .topbar nav button { width: 100%; min-width: 0; min-height: 48px; padding: 0 10px; font-size: 11px; }
    .topbar nav button svg { width: 18px; height: 18px; }
    .notice { top: 66px; width: calc(100vw - 20px); padding: 9px 12px; font-size: 13px; }
    .page, .section { padding: 82px 14px 44px; }
    .section { padding-top: 64px; }
    .section-head { margin-bottom: 24px; }
    .section-head h1, .section-head h2 { font-size: clamp(30px, 11vw, 46px); }
    .hero-section { min-height: 100svh !important; align-items: center !important; padding: 84px 0 96px !important; }
    .hero-content { width: 100% !important; padding: 0 16px !important; }
    .hero-eyebrow { font-size: 10px !important; letter-spacing: 2.5px !important; line-height: 1.7 !important; margin-bottom: 18px !important; }
    .hero-actions { display: grid !important; grid-template-columns: 1fr !important; width: min(340px, 100%) !important; margin: 0 auto !important; gap: 10px !important; }
    .hero-actions a { width: 100% !important; padding: 13px 14px !important; text-align: center !important; letter-spacing: 1.2px !important; }
    .hero-code { display: none !important; }
    .about-section, .gallery-section { padding: 64px 0 !important; }
    .about-image-frame { aspect-ratio: 16 / 11 !important; }
    .about-floating-tag { left: 14px !important; right: 14px !important; bottom: 14px !important; padding: 10px 12px !important; }
    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 18px !important; }
    .gallery-grid { grid-template-columns: 1fr 1fr !important; gap: 6px !important; }
    .gallery-item, .gallery-item.wide { grid-column: span 1 !important; aspect-ratio: 1 / 1 !important; }
    .footer-section { padding: 48px 0 28px !important; }
    .footer-grid { grid-template-columns: 1fr !important; gap: 30px !important; margin-bottom: 42px !important; }
    .footer-bottom { display: grid !important; grid-template-columns: 1fr !important; align-items: start !important; }
    .profile-head { display: grid; grid-template-columns: 1fr; gap: 0; }
    .profile-head .ghost { width: 100%; margin-top: -16px; }
    .event-grid { grid-template-columns: 1fr; }
    .event-card { min-height: 152px; padding: 16px; }
    .event-row { grid-template-columns: 56px minmax(0, 1fr); gap: 12px; padding: 14px; align-items: start; }
    .event-row > button, .event-row > strong, .event-row > .row-actions { grid-column: 1 / -1; width: 100%; justify-content: center; }
    .event-row > strong { display: block; text-align: center; padding: 10px 0 0; color: #39ff14; }
    .event-row h3 { font-size: 16px; }
    .ticket-qr-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .ticket-qr { padding: 8px; }
    .ticket-qr canvas { width: min(122px, 100%); height: auto; aspect-ratio: 1; padding: 5px; }
    .date-tile b { font-size: 26px; }
    .panel { padding: 18px; }
    .tabs { gap: 8px; }
    .tabs button { flex: 0 0 auto; }
    .row-actions button { flex: 1; }
    .payment { max-height: 220px; font-size: 13px; }
    .total { font-size: 24px; }
  }
  @media (max-width: 420px) {
    .event-row { grid-template-columns: 1fr; }
    .date-tile { display: flex; align-items: baseline; gap: 8px; }
    .date-tile b { font-size: 24px; }
    .topbar nav button, .ghost, .tabs button { min-height: 44px; }
    .ticket-qr-grid { grid-template-columns: 1fr; }
    .ticket-qr canvas { width: 150px; }
    .gallery-grid { grid-template-columns: 1fr !important; }
    .section-head h1, .section-head h2 { font-size: 30px; }
  }
  @media (max-width: 360px) {
    .topbar { height: calc(54px + env(safe-area-inset-top)); }
    .brand { font-size: 21px; }
    .topbar nav { left: calc(6px + env(safe-area-inset-left)); right: calc(6px + env(safe-area-inset-right)); max-width: calc(100vw - 12px - env(safe-area-inset-left) - env(safe-area-inset-right)); gap: 6px; padding: 6px; }
    .topbar nav button { min-height: 44px; padding: 0 6px; font-size: 10px; gap: 5px; }
  }
`;
