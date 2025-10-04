import { getUser } from "../lib/auth";

const ORDERS_KEY = "farmlink_orders";

function load() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(list) {
  try { localStorage.setItem(ORDERS_KEY, JSON.stringify(list)); } catch {}
}

function buyerKey(u) {
  if (!u) return "anon";
  return u.id || u.email || u.name || "anon";
}

export function listMyOrders() {
  const user = getUser();
  const key = buyerKey(user);
  return load().filter(o => o.buyerKey === key);
}

export function addOrder(order) {
  const user = getUser();
  const list = load();
  const id = Date.now().toString();
  const o = {
    id,
    buyerKey: buyerKey(user),
    buyerName: user?.name || "Client",
    status: order?.status || "En attente", // états gérés ensuite par l'agriculteur
    total: Number(order?.total || 0),
    items: Array.isArray(order?.items) ? order.items : [],
    createdAt: new Date().toISOString(),
  };
  list.push(o);
  save(list);
  return o;
}

export function cancelOrder(id) {
  const list = load();
  const idx = list.findIndex(o => o.id === id);
  if (idx >= 0) {
    // Annulation côté acheteur autorisée seulement si la commande est encore en attente
    const current = list[idx];
    if (current.status !== "En attente") return current;
    list[idx] = { ...current, status: "Annulée" };
    save(list);
    return list[idx];
  }
  return null;
}

// Préparation pour futur workflow agriculteur (non utilisé côté acheteur)
export const ORDER_STATUS = {
  PENDING: "En attente",
  PROCESSING: "En préparation",
  DELIVERED: "Livrée",
  CANCELED: "Annulée",
};

export function updateOrderStatus(id, status) {
  const allowed = new Set(Object.values(ORDER_STATUS));
  if (!allowed.has(status)) return null;
  const list = load();
  const idx = list.findIndex(o => o.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], status };
    save(list);
    return list[idx];
  }
  return null;
}
