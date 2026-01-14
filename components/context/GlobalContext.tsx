"use client";

import { ReactNode, createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

export interface CartItem {
  cardItemId: number; // ID z API koszyka
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

interface Filters {
  categories: string[];
  price: { min: string; max: string };
}

interface Address {
  id: number;
  country: string;
  province?: string;
  city?: string;
  postalCode?: string;
  completeAdress: string;
  userId: number;
  isDefault: boolean;
}

interface GlobalContextType {
  // --- GLOBAL DATA ---
  categories: any[];
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
  products: any[];
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  brands: any[];
  setBrands: React.Dispatch<React.SetStateAction<any[]>>;
  recomended: any[];
  setRecomended: React.Dispatch<React.SetStateAction<any[]>>;
  productsByCategory: any[];
  setProductsByCategory: React.Dispatch<React.SetStateAction<any[]>>;
  productById: any | null;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  fetchProductsByCategory: (
    limit?: number,
    page?: number,
    sort?: string,
    categoriesForFetch?: string[],
    priceForFetch?: { min: string; max: string }
  ) => Promise<any>;
  getProductById: (id: number) => Promise<any | null>;

  // --- CART ---
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (cardItemId: number) => void;
  clearCart: () => void;
  updateQuantity: (cardItemId: number, quantity: number) => void;

  // --- SELECTED CART ITEMS ---
  selectedCartIds: number[];
  toggleSelectCartItem: (cardItemId: number) => void;
  selectedCartItems: CartItem[];

  // --- ADDRESSES ---
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number) => void;

  // --- EXTRA COSTS ---
  protectionFeeIds: number[];
  toggleProtectionFee: (cardItemId: number) => void;
  shippingCost: number;
  serviceFee: number;

  // --- ORDER ---
  handlePayNow: () => Promise<void>;
}

interface ProviderProps {
  children: ReactNode;
}

/* ================= CONTEXT ================= */

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const GlobalContextProvider = ({ children }: ProviderProps) => {
  const router = useRouter();

  /* ---------- GLOBAL DATA ---------- */
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [recomended, setRecomended] = useState<any[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<any[]>([]);
  const [productById, setProductById] = useState<any | null>(null);
  const [filters, setFilters] = useState<Filters>({ categories: [], price: { min: "", max: "" } });

  /* ---------- CART ---------- */
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCartIds, setSelectedCartIds] = useState<number[]>([]);
  const [protectionFeeIds, setProtectionFeeIds] = useState<number[]>([]);

  /* ---------- ADDRESSES ---------- */
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const shippingCost = 5;
  const serviceFee = 0.5;

  /* ================= HELPERS ================= */

  const getUserIdFromCookies = (): number | null => {
    try {
      const cookie = document.cookie.split("; ").find(row => row.startsWith("user="));
      if (!cookie) return null;
      const value = cookie.split("=")[1];
      const user = JSON.parse(decodeURIComponent(value));
      return user?.id ?? null;
    } catch {
      return null;
    }
  };

  const userId = getUserIdFromCookies();

  /* ================= FETCH BASE DATA ================= */

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cats, prods, brandsRes, recom] = await Promise.all([
          fetch("/api/categories").then(r => r.json()),
          fetch("/api/products").then(r => r.json()),
          fetch("/api/brands").then(r => r.json()),
          fetch("/api/products/recomended").then(r => r.json()),
        ]);
        setCategories(cats);
        setProducts(prods);
        setBrands(brandsRes);
        setRecomended(recom);
      } catch (err) {
        console.error("Fetch base data error:", err);
      }
    };
    fetchAll();
  }, []);

  /* ================= FETCH PRODUCTS ================= */

  const fetchProductsByCategory = useCallback(async (
    limit?: number,
    page?: number,
    sort?: string,
    categoriesForFetch?: string[],
    priceForFetch?: { min: string; max: string }
  ) => {
    const params = new URLSearchParams();
    const cats = categoriesForFetch ?? filters.categories;
    const price = priceForFetch ?? filters.price;
    cats.forEach(c => params.append("category", c));
    if (price.min) params.append("min", price.min);
    if (price.max) params.append("max", price.max);
    if (limit) params.append("limit", String(limit));
    if (page) params.append("page", String(page));
    if (sort) params.append("sort", sort);

    const res = await fetch(`/api/products/by-category?${params.toString()}`);
    const data = await res.json();
    setProductsByCategory(data.data ?? data);
    return data.meta ?? {};
  }, [filters]);

  const getProductById = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProductById(data);
      return data;
    } catch {
      setProductById(null);
      return null;
    }
  }, []);

  /* ================= CART OPERATIONS ================= */

  const fetchCart = useCallback(async () => {
    if (!userId) return;
    const res = await fetch(`/api/card/${userId}`);
    const data = await res.json();
    if (data.cardItems) {
      setCart(data.cardItems.map((i: any) => ({
        cardItemId: i.id,
        product: i.product,
        quantity: i.quantity
      })));
    }
  }, [userId]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product: any, quantity = 1) => {
    if (!userId) return;
    const res = await fetch(`/api/card/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity }),
    });
    const data = await res.json();
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: data.quantity } : i);
      return [...prev, { cardItemId: data.id, product: data.product, quantity: data.quantity }];
    });
  };

  const removeFromCart = async (cardItemId: number) => {
    if (!userId) return;
    await fetch(`/api/card/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardItemId }),
    });
    setCart(prev => prev.filter(i => i.cardItemId !== cardItemId));
    setSelectedCartIds(prev => prev.filter(id => id !== cardItemId));
    setProtectionFeeIds(prev => prev.filter(id => id !== cardItemId));
  };

  const updateQuantity = async (cardItemId: number, quantity: number) => {
    if (!userId || quantity < 1) return;
    await fetch(`/api/card/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardItemId, quantity }),
    });
    setCart(prev => prev.map(i => i.cardItemId === cardItemId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCartIds([]);
    setProtectionFeeIds([]);
  };

  /* ================= SELECTED ITEMS ================= */

  const toggleSelectCartItem = (cardItemId: number) => {
    setSelectedCartIds(prev => prev.includes(cardItemId) ? prev.filter(id => id !== cardItemId) : [...prev, cardItemId]);
  };

  const toggleProtectionFee = (cardItemId: number) => {
    setProtectionFeeIds(prev => prev.includes(cardItemId) ? prev.filter(id => id !== cardItemId) : [...prev, cardItemId]);
  };

  const selectedCartItems = cart.filter(i => selectedCartIds.includes(i.cardItemId));

  /* ================= ADDRESSES ================= */

  useEffect(() => {
    if (!userId) return;
    const fetchAddresses = async () => {
      const res = await fetch(`/api/addresses/${userId}`);
      const data = await res.json();
      setAddresses(data);
      const def = data.find((a: Address) => a.isDefault);
      if (def) setSelectedAddressId(def.id);
    };
    fetchAddresses();
  }, [userId]);

  /* ================= ORDER ================= */

  const handlePayNow = async () => {
    try {
      // 1️⃣ Walidacja
      if (!userId) {
        console.warn("Brak userId (użytkownik niezalogowany)");
        alert("Nie zalogowano użytkownika");
        return;
      }
      if (!selectedAddressId) {
        console.warn("Nie wybrano adresu dostawy");
        alert("Wybierz adres dostawy");
        return;
      }
      if (selectedCartItems.length === 0) {
        console.warn("Koszyk pusty");
        alert("Brak produktów do zamówienia");
        return;
      }
  
      // 2️⃣ Przygotowanie danych zamówienia
      const items = selectedCartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        protectionFee: protectionFeeIds.includes(item.cardItemId) ? 5 : 0,
      }));
  
      const body = {
        addressId: selectedAddressId,
        items,
        shippingCost,
        serviceFee,
      };
  
      console.log("Tworzę zamówienie z danymi:", { userId, body });
  
      // 3️⃣ Wysłanie zamówienia do API
      const res = await fetch(`/api/orders/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      const data = await res.json();
  
      // 4️⃣ Obsługa odpowiedzi
      if (!res.ok) {
        console.error("Błąd API:", data);
        alert(data.message || "Błąd tworzenia zamówienia");
        return;
      }
  
      console.log("Zamówienie utworzone:", data);
      console.log("Redirecting to orderSuccess:", `/ordersuccess/${data.id}`);
  
      // 5️⃣ Usunięcie produktów z koszyka w API
      await Promise.all(
        cart.map(item =>
          fetch(`/api/card/${userId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cardItemId: item.cardItemId }),
          })
        )
      );
  
      console.log("Koszyk wyczyszczony");
  
      // 6️⃣ Wyczyszczenie lokalnego stanu koszyka
      clearCart();
  
      // 7️⃣ Przekierowanie na stronę sukcesu
     router.push(`/ordersuccess/${data.id}`);
    } catch (err: any) {
      console.error("Błąd w handlePayNow:", err);
      alert("Błąd serwera: " + err.message);
    }
  };
  
  /* ================= PROVIDER ================= */

  return (
    <GlobalContext.Provider value={{
      categories, setCategories,
      products, setProducts,
      brands, setBrands,
      recomended, setRecomended,
      productsByCategory, setProductsByCategory,
      productById,
      filters, setFilters,
      fetchProductsByCategory, getProductById,
      cart, addToCart, removeFromCart, clearCart, updateQuantity,
      selectedCartIds, toggleSelectCartItem, selectedCartItems,
      protectionFeeIds, toggleProtectionFee, shippingCost, serviceFee,
      addresses, setAddresses, selectedAddressId, setSelectedAddressId,
      handlePayNow
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
