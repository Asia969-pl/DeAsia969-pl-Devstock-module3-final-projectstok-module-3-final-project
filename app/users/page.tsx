"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../components/context/UserContext";
import Cookies from "js-cookie";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import NotifIcon from "@/components/NotifIcon";

type ProductItem = {
  id: number;
  name: string;
  price: number;
};

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: ProductItem;
};

type Order = {
  id: number;
  createdAt: string;
  items: OrderItem[];
};

type UserWithOrders = {
  id: number;
  name: string;
  email: string;
  picture: string;
  orders: Order[];
};

export default function UsersPage() {
  const { setUser } = useUser();
  const [user, setLocalUser] = useState<UserWithOrders | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (!userCookie) return setLoading(false);

    try {
      const parsed = JSON.parse(userCookie);
      if (!parsed?.id) return setLoading(false);

      fetch(`/api/users/${parsed.id}`)
        .then((r) => r.json())
        .then(setLocalUser)
        .finally(() => setLoading(false));
    } catch {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    Cookies.remove("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Ładowanie danych użytkownika...
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p>You are not logged in</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Log in
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black">
      <Header />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Profile" }]} />

      <div className="max-w-[1820px] mx-auto px-4 md:px-10 py-10">
        <div className="flex flex-col md:flex-row gap-11">

          {/* USER CARD */}
          <div className="bg-white dark:bg-[#262626] border border-black dark:border-[#383B42] rounded-[6px] w-full max-w-[320px] md:w-[320px] h-auto md:h-[194px] p-6 text-black dark:text-[#FCFCFC] flex-shrink-0 self-start">
  <div className="flex items-center gap-4 mb-4 flex-wrap md:flex-nowrap">
    <div className="relative w-24 h-24 min-w-[96px] min-h-[96px] rounded-full overflow-hidden flex-shrink-0">
      <Image
        src={user.picture}
        alt="User avatar"
        fill
        className="object-cover"
        sizes="96px"
      />
    </div>

    <div className="flex flex-col">
      <span className="font-medium text-[16px]">{user.name}</span>
      <span className="text-[14px]">{user.email}</span>
    </div>
  </div>

  <div className="w-full h-px bg-[#383B42] mb-4" />

  <button onClick={handleLogout} className="text-sm font-medium">
    Logout
  </button>
</div>



          {/* ORDERS */}
          <div className="flex-1">
            <h2 className="text-[16px] font-semibold mb-2 text-[#F29145]">
              Transactions
            </h2>
            <div className="w-1/2 bg-[#F29145] h-[6px] mb-6"></div>

            {user.orders.length === 0 ? (
              <p>You dont have any orders.</p>
            ) : (
              user.orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-black dark:border-[#262626] dark:bg-[#3f3b42] rounded-[6px] mb-4 shadow-sm"
                >
                  <div className="flex gap-4 p-4">
                    <NotifIcon />
                    <div>
                      <span className="text-[14px] text-black dark:text-[#E7E7E7]">
                        {formatDate(order.createdAt)}
                      </span>
                      <h3 className="font-medium text-[18px] mt-2 mb-1">
                        Your order nr INV/2028421205/TSR/3385B{order.id}
                      </h3>

                      <ul className="mt-2 space-y-1">
                        {order.items.map((item) => (
                          <li key={item.id} className="text-sm">
                            • {item.product.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
