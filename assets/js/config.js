/**
 * Noor's Handmade Bangles - Application Configuration
 * To connect Supabase: replace the SUPABASE_URL and SUPABASE_ANON_KEY values
 * with the ones from your Supabase project Settings > API page.
 */

export const CONFIG = {
  // Shop Details
  SHOP_NAME: "Noor's",
  SHOP_TAGLINE: "Handcrafted Luxury Bangles & Jewelry",
  CURRENCY: "৳",
  CURRENCY_CODE: "BDT",

  // Contact & Social
  WHATSAPP_NUMBER: "+8801914-992749",
  WHATSAPP_RAW: "8801914992749",
  BKASH_NUMBER: "01719970286",
  NAGAD_NUMBER: "01719970286",
  FACEBOOK_URL: "https://www.facebook.com/profile.php?id=61579870612718",

  // Delivery Fees (BDT)
  DELIVERY_DHAKA: 70,
  DELIVERY_OUTSIDE_DHAKA: 140,

  // localStorage Keys
  CART_STORAGE_KEY: "noors_cart_v1",
  WISHLIST_STORAGE_KEY: "noors_wishlist_v1",
  LANG_STORAGE_KEY: "noors_lang_v1",
  THEME_STORAGE_KEY: "noors_theme_v1",
  ADMIN_SESSION_KEY: "noors_admin_session_v1",

  // Supabase Configuration — paste your real project URL & anon key here:
  SUPABASE_URL: "https://xyzcompany.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key",

  // When true, the shop works fully on mock data (no Supabase needed for testing)
  ENABLE_MOCK_FALLBACK: true
};
