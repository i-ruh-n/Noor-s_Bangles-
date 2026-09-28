/**
 * Noor's Handmade Bangles - i18n Translation Dictionary (English & Bangla)
 */

import { CONFIG } from './config.js';

const translations = {
  en: {
    // Header & Nav
    home: "Home",
    shop: "Shop",
    categories: "Categories",
    about: "About Us",
    contact: "Contact Us",
    track_order: "Track Order",
    custom_order: "Custom Order",
    faq: "FAQ",
    size_guide: "Size Guide",
    policy: "Delivery & Return Policy",
    admin: "Admin Panel",
    cart: "Cart",
    wishlist: "Wishlist",
    
    // Announcement Bar
    announcement_text: "✨ Special Offer: Free delivery on orders over ৳2000! Express delivery across Bangladesh.",
    
    // Hero Banner
    hero_title: "Exquisite Handmade Bangles Crafted with Love",
    hero_subtitle: "Elevate your elegance with our traditional & modern artisanal bangle collections.",
    shop_now: "Shop Collection",
    custom_request: "Request Custom Design",
    
    // Product & Shop
    featured_products: "Featured Collection",
    new_arrivals: "New Arrivals",
    sale_items: "Special Offers & Sales",
    all_products: "All Products",
    search_placeholder: "Search bangles by name, material, color...",
    filter_by: "Filters",
    category: "Category",
    size: "Size",
    color: "Color",
    material: "Material",
    price_range: "Price Range",
    sort_by: "Sort By",
    sort_newest: "Newest Arrivals",
    sort_price_low: "Price: Low to High",
    sort_price_high: "Price: High to Low",
    sort_discount: "Highest Discount",
    in_stock: "In Stock",
    out_of_stock: "Sold Out",
    add_to_cart: "Add to Cart",
    buy_now: "Buy Now",
    view_details: "View Details",
    size_guide_link: "Find Your Bangle Size",
    share: "Share",
    related_products: "You May Also Like",
    customer_reviews: "Customer Reviews",
    write_review: "Write a Review",
    rating: "Rating",
    submit_review: "Submit Review",
    review_success: "Thank you! Your review has been submitted for moderation.",
    
    // Cart & Checkout
    shopping_cart: "Shopping Cart",
    cart_empty: "Your cart is empty.",
    quantity: "Quantity",
    subtotal: "Subtotal",
    delivery_area: "Delivery Area",
    dhaka_inside: "Inside Dhaka (৳70)",
    dhaka_outside: "Outside Dhaka (৳140)",
    discount_code: "Promo / Discount Code",
    apply_code: "Apply",
    total: "Total Amount",
    proceed_checkout: "Proceed to Checkout",
    checkout_title: "Order Checkout",
    customer_name: "Full Name",
    phone_number: "Phone Number (11 digits)",
    delivery_address: "Full Delivery Address",
    order_note: "Order Notes (optional)",
    payment_method: "Payment Method",
    cod: "Cash on Delivery",
    bkash: "bKash (Send Money / Payment)",
    nagad: "Nagad (Send Money / Payment)",
    trx_id_placeholder: "Enter bKash/Nagad Transaction ID (TrxID)",
    payment_instruction: "Please send payment to our official number and paste the Transaction ID below.",
    place_order: "Place Order via WhatsApp",
    order_success_title: "Order Placed Successfully!",
    order_number_label: "Your Order Number:",
    save_order_num_msg: "Please save this order number and your phone number to track your delivery status.",
    
    // Order Tracking
    track_order_title: "Track Your Order Status",
    enter_order_num: "Order Number (e.g. NOR-1001)",
    enter_phone: "Phone Number",
    track_button: "Check Status",
    order_status: "Order Status",
    status_pending: "Pending Confirmation",
    status_confirmed: "Order Confirmed",
    status_packed: "Packed & Ready",
    status_shipped: "Shipped / On The Way",
    status_delivered: "Delivered",
    status_cancelled: "Cancelled",
    tracking_notes: "Delivery Updates",
    
    // Custom Order
    custom_title: "Request a Custom Handmade Bangle Set",
    custom_desc: "Have a specific design, wedding theme, or color matching in mind? Tell us what you need!",
    design_desc: "Describe your desired design & requirements",
    wrist_size: "Wrist / Bangle Size",
    submit_custom: "Send Custom Request",
    
    // Footer & Meta
    footer_tagline: "Handcrafted with passion in Bangladesh. Premium quality bangles delivered right to your doorstep.",
    quick_links: "Quick Links",
    customer_service: "Customer Care",
    follow_us: "Follow Us on Facebook",
    copyright: `© ${new Date().getFullYear()} ${CONFIG.SHOP_NAME}. All Rights Reserved.`
  },
  bn: {
    // Header & Nav
    home: "হোম",
    shop: "শপ",
    categories: "ক্যাটাগরি",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    track_order: "অর্ডার ট্র্যাকিং",
    custom_order: "কাস্টম অর্ডার",
    faq: "প্রশ্নোত্তর",
    size_guide: "সাইজ গাইড",
    policy: "ডেলিভারি ও রিটার্ন পলিসি",
    admin: "এডমিন প্যানেল",
    cart: "কার্ট",
    wishlist: "উইশলিস্ট",
    
    // Announcement Bar
    announcement_text: "✨ বিশেষ অফার: ৳২০০০ টাকার বেশি অর্ডারে ফ্রী ডেলিভারি! সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    
    // Hero Banner
    hero_title: "ভালোবাসায় তৈরি রেশমি ও রাজকীয় হাতের চুরি",
    hero_subtitle: "আমাদের ঐতিহ্যবাহী ও আধুনিক হস্তশিল্প রেশমি চুরি কালেকশন দিয়ে নিজের সৌন্দর্য বাড়ান।",
    shop_now: "কালেকশন দেখুন",
    custom_request: "কাস্টম ডিজাইনের অনুরোধ",
    
    // Product & Shop
    featured_products: "স্পেশাল কালেকশন",
    new_arrivals: "নতুন ডিজাইন",
    sale_items: "ধামাকা ডিসকাউন্ট অফার",
    all_products: "সকল চুরি কালেকশন",
    search_placeholder: "নাম, উপাদান, কালার দিয়ে চুরি খুঁজুন...",
    filter_by: "ফিল্টার",
    category: "ক্যাটাগরি",
    size: "সাইজ",
    color: "রং",
    material: "উপাদান",
    price_range: "মূল্যের তারতম্য",
    sort_by: "ক্রমানুসারে সাজান",
    sort_newest: "সর্বশেষ নতুন",
    sort_price_low: "দাম: কম থেকে বেশি",
    sort_price_high: "দাম: বেশি থেকে কম",
    sort_discount: "সর্বোচ্চ ছাড়",
    in_stock: "স্টকে আছে",
    out_of_stock: "স্টক শেষ",
    add_to_cart: "কার্টে যোগ করুন",
    buy_now: "সরাসরি অর্ডার করুন",
    view_details: "বিস্তারিত দেখুন",
    size_guide_link: "আপনার চুরির সাইজ জেনে নিন",
    share: "শেয়ার করুন",
    related_products: "আরও পছন্দ হতে পারে",
    customer_reviews: "গ্রাহকদের মতামত",
    write_review: "মতামত দিন",
    rating: "রেটিং",
    submit_review: "রিভিউ জমা দিন",
    review_success: "ধন্যবাদ! আপনার মতামতটি জমা নেওয়া হয়েছে।",
    
    // Cart & Checkout
    shopping_cart: "আপনার শপিং কার্ট",
    cart_empty: "আপনার কার্ট খালি রয়েছে।",
    quantity: "পরিমাণ",
    subtotal: "সাবটোটাল",
    delivery_area: "ডেলিভারি এরিয়া",
    dhaka_inside: "ঢাকার ভেতরে (৳৭০)",
    dhaka_outside: "ঢাকার বাইরে (৳১৪০)",
    discount_code: "ডিসকাউন্ট কোড",
    apply_code: "প্রয়োগ করুন",
    total: "সর্বমোট দাম",
    proceed_checkout: "অর্ডার সম্পন্ন করুন",
    checkout_title: "অর্ডার ফর্ম",
    customer_name: "আপনার পুরো নাম",
    phone_number: "মোবাইল নম্বর (১১ ডিজিট)",
    delivery_address: "সম্পূর্ণ ডেলিভারি ঠিকানা",
    order_note: "বিশেষ নির্দেশিকা (ঐচ্ছিক)",
    payment_method: "পেমেন্ট পদ্ধতি",
    cod: "ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা দিন)",
    bkash: "বিকাশ (সেন্ড মানি / পেমেন্ট)",
    nagad: "নগদ (সেন্ড মানি / পেমেন্ট)",
    trx_id_placeholder: "বিকাশ/নগদ ট্রানজেকশন আইডি (TrxID) লিখুন",
    payment_instruction: "দয়া করে আমাদের নম্বরে টাকা পাঠিয়ে নিচে TrxID টি প্রদান করুন।",
    place_order: "হোয়াটসঅ্যাপে অর্ডার কনফার্ম করুন",
    order_success_title: "অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!",
    order_number_label: "আপনার অর্ডার নম্বর:",
    save_order_num_msg: "ডেলিভারি স্ট্যাটাস চেক করতে আপনার অর্ডার নম্বর ও মোবাইল নম্বরটি সংরক্ষণ করুন।",
    
    // Order Tracking
    track_order_title: "আপনার অর্ডারের অবস্থান জানুন",
    enter_order_num: "অর্ডার নম্বর (যেমন: NOR-1001)",
    enter_phone: "মোবাইল নম্বর",
    track_button: "স্ট্যাটাস দেখুন",
    order_status: "অর্ডার স্ট্যাটাস",
    status_pending: "অপেক্ষমান (Pending)",
    status_confirmed: "অর্ডার কনফার্মড",
    status_packed: "প্যাকিং সম্পন্ন",
    status_shipped: "কুরিয়ারে পাঠানো হয়েছে",
    status_delivered: "ডেলিভারি সম্পন্ন",
    status_cancelled: "বাতিল করা হয়েছে",
    tracking_notes: "ডেলিভারি আপডেট",
    
    // Custom Order
    custom_title: "পছন্দের কাস্টম চুরির অর্ডারের আবেদন",
    custom_desc: "আপনার বিয়ের পোশাক বা বিশেষ কোনো কালার ম্যাচিং চুরি দরকার? আমাদের জানান!",
    design_desc: "ডিজাইন ও বিস্তারিত তথ্য লিখুন",
    wrist_size: "হাতের সাইজ / চুরির সাইজ",
    submit_custom: "কাস্টম রিকোয়েস্ট পাঠান",
    
    // Footer & Meta
    footer_tagline: "হাতে বোনা পরম মমতায় তৈরি বাংলাদেশের প্রিমিয়াম কোয়ালিটি রেশমি ও মেটাল গহনা।",
    quick_links: "দ্রুত লিঙ্ক",
    customer_service: "গ্রাহক সেবা",
    follow_us: "ফেসবুকে আমরা",
    copyright: `© ${new Date().getFullYear()} ${CONFIG.SHOP_NAME}। সর্বস্বত্ব সংরক্ষিত।`
  }
};

let currentLang = localStorage.getItem(CONFIG.LANG_STORAGE_KEY) || 'en';

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem(CONFIG.LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    return true;
  }
  return false;
}

export function t(key) {
  const dict = translations[currentLang] || translations.en;
  return dict[key] || translations.en[key] || key;
}
