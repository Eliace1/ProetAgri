import Products from "@/components/products";
import { getUser } from "../lib/auth";
import axios from "axios";
const ORDERS_KEY = "farmlink_orders";

function loasd() {
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

export async function listMyOrders() { 
  try{
    const res = await axios.get("http://localhost:8000/api/commandes", {
      headers: {
        Authorization:`Bearer ${localStorage.getItem("farmlink_token")}`,
          "Content-Type": "application/json",
      },
    });
    return res.data.commandesUsers;

  }catch(err){
    console.log("Erreur listMyOrders:", err.response?.data || err.message);
    return [];
  }
}

export function lisstMyOrders() {
  const user = getUser();
  const key = buyerKey(user);
  return load().filter(o => o.buyerKey === key);
}

export async function addOrder(order) {
  try{
     console.log(order)
    const res = await axios.post("http://localhost:8000/api/createCommande",
      {
        delivery_address: order.info.address,
        total_amount: order.total,
        payment_method: order.method,
        products: order.items.map((it)=>({
          product_id: it.id,
          quantite: it.qy || 1,
        })),
      },
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("farmlink_token")}`,
          "Content-Type": "application/json",
        },
      }
    );
  return res.data;
 }catch(err){
    console.error("Erreur addOrder:", err.response?.data || err.message);
 }
}
export function adddOrder(order) {
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
