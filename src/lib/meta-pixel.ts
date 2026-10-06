"use client";

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

// 1. Standard PageView Trigger
export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

// 2. Custom or Standard Event Trigger
export const event = (name: string, options: Record<string, unknown> = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", name, options);
  }
};

// 3. ViewContent Event (Triggered on Product Detail Page load)
export const trackViewContent = (product: {
  id: string;
  name: string;
  category?: string;
  price: number;
}) => {
  event("ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category || "General",
    content_type: "product",
    currency: "INR",
    value: product.price,
  });
};

// 4. AddToCart Event (Triggered when item added to cart)
export const trackAddToCart = (item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  event("AddToCart", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    currency: "INR",
    value: item.price * item.quantity,
    num_items: item.quantity,
  });
};

// 5. InitiateCheckout Event (Triggered when user enters checkout)
export const trackInitiateCheckout = (data: {
  num_items: number;
  value: number;
  content_ids?: string[];
}) => {
  event("InitiateCheckout", {
    content_ids: data.content_ids || [],
    content_type: "product",
    num_items: data.num_items,
    currency: "INR",
    value: data.value,
  });
};

// 6. Purchase Event (Triggered on Order Confirmation Page)
export const trackPurchase = (order: {
  orderId: string;
  value: number;
  content_ids?: string[];
}) => {
  event("Purchase", {
    content_ids: order.content_ids || [],
    content_type: "product",
    currency: "INR",
    value: order.value,
    order_id: order.orderId,
  });
};

// 7. Search Event (Triggered on product search)
export const trackSearch = (searchQuery: string) => {
  event("Search", {
    search_string: searchQuery,
  });
};

// 8. AddToWishlist Event (Triggered on bookmarking)
export const trackAddToWishlist = (product: {
  id: string;
  name: string;
  price: number;
}) => {
  event("AddToWishlist", {
    content_ids: [product.id],
    content_name: product.name,
    currency: "INR",
    value: product.price,
  });
};
