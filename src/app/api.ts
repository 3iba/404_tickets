const defaultApiBase = `${window.location.protocol}//${window.location.hostname}:8000/api`;
const API_BASE = import.meta.env.VITE_API_BASE_URL || defaultApiBase;
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");
const TOKEN_KEY = "ticketing_auth_token";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type EventDto = {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  venue: string;
  city: string;
  startAt: string;
  price: number;
  currency: string;
  paymentDetails?: string;
  posterUrl?: string;
  status: "ACTIVE" | "ANNOUNCED" | "SOLD_OUT" | "HIDDEN";
};

export type TicketDto = {
  ticketCode: string;
  orderCode: string;
  eventId: number;
  eventTitle: string;
  firstName: string;
  lastName: string;
  telegramId?: number;
  username?: string;
  status: string;
  checkedInAt?: string;
  createdAt: string;
};

export type OrderDto = {
  orderCode: string;
  event: EventDto;
  customerFirstName: string;
  customerLastName: string;
  customerEmail?: string;
  customerPhone?: string;
  telegramId?: number;
  telegramUsername?: string;
  ticketCount: number;
  totalAmount: number;
  status: string;
  paymentComment?: string;
  createdAt: string;
  tickets: TicketDto[];
};

export type UserDto = {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  telegramId?: number;
  telegramUsername?: string;
  role: "USER" | "ADMIN";
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(response.status, text || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

async function upload<T>(path: string, file: File): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": file.type,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: file,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(response.status, text || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  tokenKey: TOKEN_KEY,
  getToken: () => localStorage.getItem(TOKEN_KEY),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  events: () => request<EventDto[]>("/events"),
  createOrder: (payload: {
    eventId: number;
    quantity: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    telegramUsername?: string;
  }) => request<OrderDto>("/orders", { method: "POST", body: JSON.stringify(payload) }),
  markPaid: (orderCode: string, comment: string) =>
    request<OrderDto>(`/orders/${orderCode}/paid`, { method: "POST", body: JSON.stringify({ comment }) }),
  login: async (email: string, password: string) => {
    const result = await request<{ token: string; user: UserDto }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, result.token);
    return result;
  },
  register: async (email: string, password: string, fullName: string, phone?: string) => {
    const result = await request<{ token: string; user: UserDto }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName, phone }),
    });
    localStorage.setItem(TOKEN_KEY, result.token);
    return result;
  },
  me: () => request<UserDto>("/auth/me"),
  myOrders: () => request<OrderDto[]>("/me/orders"),
  adminEvents: () => request<EventDto[]>("/admin/events"),
  saveEvent: (payload: Partial<EventDto> & { title: string; venue: string; city: string; startAt: string; price: number }) =>
    request<EventDto>("/admin/events", { method: "POST", body: JSON.stringify(payload) }),
  updateEvent: (id: number, payload: Partial<EventDto> & { title: string; venue: string; city: string; startAt: string; price: number }) =>
    request<EventDto>(`/admin/events/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  uploadPoster: async (file: File) => {
    const result = await upload<{ posterUrl: string }>("/admin/uploads/poster", file);
    return {
      posterUrl: result.posterUrl.startsWith("/") ? `${API_ORIGIN}${result.posterUrl}` : result.posterUrl,
    };
  },
  adminOrders: () => request<OrderDto[]>("/admin/orders"),
  confirmOrder: (orderCode: string) => request<OrderDto>(`/admin/orders/${orderCode}/confirm`, { method: "PATCH" }),
  cancelOrder: (orderCode: string) => request<OrderDto>(`/admin/orders/${orderCode}/cancel`, { method: "PATCH" }),
  checkIn: (ticketCode: string) => request<TicketDto>(`/admin/tickets/${ticketCode}/check-in`, { method: "POST" }),
};
