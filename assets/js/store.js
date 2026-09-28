/**
 * Noor's Handmade Bangles - Reactive Application Store & State Management
 */

import { CONFIG } from './config.js';
import { getLang, setLang } from './i18n.js';

class Store {
  constructor() {
    this.listeners = new Set();
    
    // Load persisted cart
    try {
      this.cart = JSON.parse(localStorage.getItem(CONFIG.CART_STORAGE_KEY)) || [];
    } catch (e) {
      this.cart = [];
    }
    
    // Load persisted wishlist
    try {
      this.wishlist = JSON.parse(localStorage.getItem(CONFIG.WISHLIST_STORAGE_KEY)) || [];
    } catch (e) {
      this.wishlist = [];
    }

    this.lang = getLang();
    this.currentView = 'home';
    this.viewParams = {};
    this.adminSession = JSON.parse(localStorage.getItem(CONFIG.ADMIN_SESSION_KEY) || 'null');
    this.selectedDeliveryFee = CONFIG.DELIVERY_DHAKA;
    this.appliedDiscount = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }

  // Cart Operations
  addToCart(product, quantity = 1, selectedSize = '', selectedColor = '') {
    const existingIndex = this.cart.findIndex(
      item => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images && product.images.length ? product.images[0] : '',
        selectedSize: selectedSize || (product.sizes ? product.sizes[0] : ''),
        selectedColor: selectedColor || (product.colors ? product.colors[0] : ''),
        quantity: quantity
      });
    }

    this.saveCart();
  }

  updateCartQuantity(index, quantity) {
    if (index >= 0 && index < this.cart.length) {
      if (quantity <= 0) {
        this.cart.splice(index, 1);
      } else {
        this.cart[index].quantity = quantity;
      }
      this.saveCart();
    }
  }

  removeFromCart(index) {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1);
      this.saveCart();
    }
  }

  clearCart() {
    this.cart = [];
    this.appliedDiscount = null;
    this.saveCart();
  }

  saveCart() {
    localStorage.setItem(CONFIG.CART_STORAGE_KEY, JSON.stringify(this.cart));
    this.notify();
  }

  getCartSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartTotal() {
    const subtotal = this.getCartSubtotal();
    const discount = this.appliedDiscount ? this.appliedDiscount.discountAmount : 0;
    const total = Math.max(0, subtotal - discount) + this.selectedDeliveryFee;
    return total;
  }

  // Wishlist Operations
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(productId);
    }
    localStorage.setItem(CONFIG.WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));
    this.notify();
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  // Language Toggle
  toggleLanguage() {
    const newLang = this.lang === 'en' ? 'bn' : 'en';
    if (setLang(newLang)) {
      this.lang = newLang;
      this.notify();
    }
  }

  // Admin Session
  setAdminSession(session) {
    this.adminSession = session;
    if (session) {
      localStorage.setItem(CONFIG.ADMIN_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(CONFIG.ADMIN_SESSION_KEY);
    }
    this.notify();
  }
}

export const store = new Store();
