/**
 * Noor's Handmade Bangles - Supabase Client & Data Layer
 * Handles Supabase SDK initialization with built-in Mock Data Fallback for smooth offline/local testing.
 */

import { CONFIG } from './config.js';
import { generateBangleSVG } from './utils.js';

let supabase = null;

// Initial Mock Data Store for fallback
const mockCategories = [
  { id: 'cat-1', name: 'Silk Thread', slug: 'silk-thread', sort_order: 1 },
  { id: 'cat-2', name: 'Bridal & Kundan', slug: 'bridal-kundan', sort_order: 2 },
  { id: 'cat-3', name: 'Metal & Brass', slug: 'metal-brass', sort_order: 3 },
  { id: 'cat-4', name: 'Glass Churi', slug: 'glass-churi', sort_order: 4 },
  { id: 'cat-5', name: 'Terracotta & Artisan', slug: 'terracotta-artisan', sort_order: 5 }
];

const mockProducts = [
  {
    id: 'prod-1',
    name: 'Reshmi Silk Thread Bangle Set (Maroon & Gold)',
    slug: 'reshmi-silk-thread-maroon-gold',
    description: 'Handcrafted premium silk thread bangles wrapped over high-durability acrylic base. Embellished with stone chain and zardosi work. Ideal for weddings and festivals.',
    category_id: 'cat-1',
    price: 650,
    old_price: 850,
    stock: 15,
    sizes: ['2.4', '2.6', '2.8'],
    colors: ['Maroon', 'Gold'],
    materials: ['Silk Thread', 'Stone Chain'],
    images: [
      generateBangleSVG('Reshmi Silk Thread Set', '#800000', '#D4AF37'),
      generateBangleSVG('Detail View - Maroon', '#A44321', '#E5C158')
    ],
    is_featured: true,
    is_new: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Royal Kundan Bridal Chura Set',
    slug: 'royal-kundan-bridal-chura',
    description: 'Luxurious bridal chura set featuring authentic Kundan stones, pearls, and red acrylic bangles. Hand-set by master craftsmen.',
    category_id: 'cat-2',
    price: 1850,
    old_price: 2200,
    stock: 8,
    sizes: ['2.4', '2.6'],
    colors: ['Crimson Red', 'Pearl White'],
    materials: ['Kundan', 'Faux Pearl', 'Acrylic'],
    images: [
      generateBangleSVG('Royal Kundan Bridal', '#B80000', '#FDF8E7'),
      generateBangleSVG('Kundan Detail', '#C85A32', '#D4AF37')
    ],
    is_featured: true,
    is_new: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Antique Brass Kada Bangle (Pair)',
    slug: 'antique-brass-kada-pair',
    description: 'Vintage finish brass kada with floral embossing and screw opening for perfect fit. Water-resistant and tarnish-protected coating.',
    category_id: 'cat-3',
    price: 950,
    old_price: 1100,
    stock: 20,
    sizes: ['2.4', '2.6', '2.8', '2.10'],
    colors: ['Antique Gold', 'Bronze'],
    materials: ['Brass', 'Antique Plating'],
    images: [
      generateBangleSVG('Antique Brass Kada', '#B8860B', '#8B4513')
    ],
    is_featured: true,
    is_new: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Traditional Glass Reshmi Churi (24 Pcs Combo)',
    slug: 'traditional-glass-reshmi-churi-24pcs',
    description: 'Authentic Firozabad glass churi set with sparkling glitter finish. Perfect melodic ring sound when worn together.',
    category_id: 'cat-4',
    price: 380,
    old_price: 450,
    stock: 30,
    sizes: ['2.2', '2.4', '2.6'],
    colors: ['Emerald Green', 'Royal Blue', 'Ruby Red'],
    materials: ['Glass', 'Glitter Coating'],
    images: [
      generateBangleSVG('Traditional Glass Churi', '#006400', '#4169E1')
    ],
    is_featured: false,
    is_new: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Meenakari Floral Hand-Painted Bangle Set',
    slug: 'meenakari-floral-bangle-set',
    description: 'Exquisite Meenakari enamel artwork handcrafted on durable metal core. Vibrant peacock and lotus motifs.',
    category_id: 'cat-2',
    price: 1200,
    old_price: 1500,
    stock: 12,
    sizes: ['2.4', '2.6', '2.8'],
    colors: ['Multicolor', 'Turquoise'],
    materials: ['Enamel Meenakari', 'Copper Alloy'],
    images: [
      generateBangleSVG('Meenakari Floral Set', '#008080', '#FFD700')
    ],
    is_featured: true,
    is_new: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Terracotta Artisan Hand-Carved Bangle',
    slug: 'terracotta-artisan-hand-carved-bangle',
    description: 'Eco-friendly baked clay bangle painted with natural acrylic colors and sealed with waterproof protective varnish.',
    category_id: 'cat-5',
    price: 550,
    old_price: 700,
    stock: 10,
    sizes: ['2.4', '2.6'],
    colors: ['Terracotta Orange', 'Black Gold'],
    materials: ['Terracotta Clay', 'Acrylic Paint'],
    images: [
      generateBangleSVG('Terracotta Artisan', '#C85A32', '#2C2523')
    ],
    is_featured: false,
    is_new: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Velvet Metal Bangle Mix (48 Pcs Box)',
    slug: 'velvet-metal-bangle-mix-48pcs',
    description: 'Soft velvet touch bangles with gold metal spacer bangles. Comfortable for all-day wear.',
    category_id: 'cat-1',
    price: 890,
    old_price: 1150,
    stock: 25,
    sizes: ['2.4', '2.6', '2.8'],
    colors: ['Deep Purple', 'Rose Pink', 'Gold'],
    materials: ['Velvet Flocked Metal', 'Gold Plated Alloys'],
    images: [
      generateBangleSVG('Velvet Metal Mix Box', '#8A2BE2', '#FF69B4')
    ],
    is_featured: false,
    is_new: true,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Royal Pearl Studded Kada Set',
    slug: 'royal-pearl-studded-kada-set',
    description: 'Double kada set lined with freshwater-style lustrous imitation pearls and zircon crystal accents.',
    category_id: 'cat-2',
    price: 1450,
    old_price: 1750,
    stock: 5,
    sizes: ['2.6', '2.8'],
    colors: ['Ivory Pearl', 'Gold'],
    materials: ['Faux Pearl', 'Zircon', 'Brass'],
    images: [
      generateBangleSVG('Royal Pearl Studded Kada', '#FFFFF0', '#D4AF37')
    ],
    is_featured: true,
    is_new: false,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const mockReviews = [
  {
    id: 'rev-1',
    product_id: 'prod-1',
    customer_name: 'Nusrat Jahan',
    rating: 5,
    comment: 'The maroon silk thread bangles are absolutely gorgeous! Finished so neatly. Delivered in Dhaka within 2 days.',
    is_approved: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'rev-2',
    product_id: 'prod-2',
    customer_name: 'Sadia Islam',
    rating: 5,
    comment: 'Ordered this Kundan Chura set for my wedding Gaye Holud. Everyone loved it!',
    is_approved: true,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

const mockDiscountCodes = [
  { code: 'NOOR10', type: 'percentage', value: 10, min_order_amount: 500, usage_limit: 100, used_count: 12, is_active: true },
  { code: 'EID200', type: 'fixed', value: 200, min_order_amount: 1500, usage_limit: 50, used_count: 5, is_active: true }
];

let mockOrders = JSON.parse(localStorage.getItem('noors_mock_orders') || '[]');

export async function initSupabaseClient() {
  if (window.supabase) {
    try {
      if (CONFIG.SUPABASE_URL && !CONFIG.SUPABASE_URL.includes('xyzcompany')) {
        supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        console.log("Supabase Client initialized connected to project.");
        return supabase;
      }
    } catch (e) {
      console.warn("Supabase init error, falling back to Mock Data layer:", e);
    }
  }
  console.log("Using Mock Local Database layer for Noor's Shop.");
  return null;
}

export function getSupabase() {
  return supabase;
}

// Data Access Layer API (Seamlessly handles both Supabase & Fallback Mock)
export const DataService = {
  // Categories
  async getCategories() {
    if (supabase) {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length) return data;
    }
    return mockCategories;
  },

  // Products
  async getProducts(filters = {}) {
    if (supabase) {
      let query = supabase.from('products').select('*').eq('is_active', true);
      if (filters.category_id) query = query.eq('category_id', filters.category_id);
      if (filters.is_featured) query = query.eq('is_featured', true);
      if (filters.is_new) query = query.eq('is_new', true);
      const { data, error } = await query;
      if (!error && data && data.length) return data;
    }

    let list = [...mockProducts];
    if (filters.category_id) list = list.filter(p => p.category_id === filters.category_id);
    if (filters.is_featured) list = list.filter(p => p.is_featured);
    if (filters.is_new) list = list.filter(p => p.is_new);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return list;
  },

  async getProductById(id) {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
    return mockProducts.find(p => p.id === id) || null;
  },

  // Create Order
  async createOrder(orderPayload, items) {
    const orderNumber = 'NOR-' + Math.floor(100000 + Math.random() * 900000);
    const fullOrder = {
      id: 'ord-' + Date.now(),
      order_number: orderNumber,
      ...orderPayload,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data: ordData, error: ordErr } = await supabase.from('orders').insert([fullOrder]).select().single();
        if (!ordErr && ordData) {
          const itemPayloads = items.map(it => ({
            order_id: ordData.id,
            product_id: it.id,
            product_name: it.name,
            price: it.price,
            quantity: it.quantity,
            selected_size: it.selectedSize || '',
            selected_color: it.selectedColor || '',
            total: it.price * it.quantity
          }));
          await supabase.from('order_items').insert(itemPayloads);
          return ordData;
        }
      } catch (e) {
        console.warn("Supabase order insert error, using local fallback:", e);
      }
    }

    // Mock Fallback save
    fullOrder.items = items;
    mockOrders.unshift(fullOrder);
    localStorage.setItem('noors_mock_orders', JSON.stringify(mockOrders));
    return fullOrder;
  },

  // Order Tracking (Order # + Phone #)
  async trackOrder(orderNumber, phone) {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    if (supabase) {
      try {
        const { data, error } = await supabase.rpc('track_order', {
          p_order_number: cleanNum,
          p_phone: cleanPhone
        });
        if (!error && data && data.length) return data[0];
      } catch (e) {
        console.warn("RPC track_order error, falling back:", e);
      }
    }

    // Fallback Mock lookup
    const found = mockOrders.find(o => 
      o.order_number.toUpperCase() === cleanNum && 
      o.customer_phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-8))
    );
    return found || null;
  },

  // Discount Codes
  async validateDiscountCode(code, subtotal) {
    const cleanCode = code.trim().toUpperCase();
    if (supabase) {
      const { data, error } = await supabase.from('discount_codes').select('*').eq('code', cleanCode).eq('is_active', true).single();
      if (!error && data) {
        if (subtotal < data.min_order_amount) {
          return { valid: false, message: `Minimum order amount for code ${cleanCode} is ৳${data.min_order_amount}` };
        }
        const discountVal = data.type === 'percentage' ? (subtotal * data.value) / 100 : data.value;
        return { valid: true, discountAmount: discountVal, code: cleanCode };
      }
    }

    // Fallback lookup
    const found = mockDiscountCodes.find(d => d.code === cleanCode && d.is_active);
    if (!found) return { valid: false, message: 'Invalid or expired discount code.' };
    if (subtotal < found.min_order_amount) {
      return { valid: false, message: `Minimum order amount for this coupon is ৳${found.min_order_amount}` };
    }
    const discountVal = found.type === 'percentage' ? (subtotal * found.value) / 100 : found.value;
    return { valid: true, discountAmount: discountVal, code: cleanCode };
  },

  // Reviews
  async getReviewsForProduct(productId) {
    if (supabase) {
      const { data, error } = await supabase.from('reviews').select('*').eq('product_id', productId).eq('is_approved', true).order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return mockReviews.filter(r => r.product_id === productId && r.is_approved);
  },

  async addReview(reviewPayload) {
    const newRev = {
      id: 'rev-' + Date.now(),
      ...reviewPayload,
      is_approved: false,
      created_at: new Date().toISOString()
    };
    if (supabase) {
      await supabase.from('reviews').insert([newRev]);
    } else {
      mockReviews.unshift(newRev);
    }
    return newRev;
  }
};
