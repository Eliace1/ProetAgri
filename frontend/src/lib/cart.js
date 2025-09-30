const CART_KEY = "farmlink_cart";

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items || []));
  } catch {}
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex((it) => String(it.id) === String(product.id));
  if (idx >= 0) {
    cart[idx].qty = (cart[idx].qty || 1) + qty;
  } else {
    cart.push({ ...product, qty });
  }
  saveCart(cart);
  return cart;
}
