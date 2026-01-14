"use client";

import { useState } from "react";

type Address = {
  id: number;
  completeAdress: string;
  country: string;
  province?: string;
  city?: string;
  postalCode?: string;
  isDefault?: boolean;
};

type Props = {
  addresses: Address[];
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number) => void;
  onAddAddress: (data: Omit<Address, "id">) => Promise<void>;
};

export default function AddressSelector({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  onAddAddress,
}: Props) {
  const [tab, setTab] = useState<"existing" | "new">("existing");
  const [form, setForm] = useState({
    country: "",
    province: "",
    city: "",
    postalCode: "",
    completeAdress: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await onAddAddress(form);
    setLoading(false);
    setForm({
      country: "",
      province: "",
      city: "",
      postalCode: "",
      completeAdress: "",
      isDefault: false,
    });
    setTab("existing");
  };

  return (
    <div className="rounded-[6px] bg-white text-black dark:bg-[#262626] dark:text-[#FCFCFC]">
      {/* Tabs */}
      <div className="flex border-btext-[18px] font-semibold border-black dark:border-[#383B42]">
        {["existing", "new"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`w-1/2 pt-2 pb-4 text-[18px] font-semibold 
              ${
                tab === t
                  ? "text-[#F19145] border-b-2 border-[#F19145]"
                  : "text-black dark:text-[#B0B0B0] border-b-1 border-[#383B42]"
              }`}
          >
            {t === "existing" ? "Existing Address" : "New Address"}
          </button>
        ))}
      </div>

      <div className="p-0">
        {/* EXISTING */}
        {tab === "existing" && (
          <div className="flex flex-col gap-8">
            {addresses.length === 0 && (
              <p>No saved addresses</p>
            )}

            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddressId(addr.id)}
                className={`border rounded p-4 cursor-pointer transition
                  ${
                    selectedAddressId === addr.id
                      ? "border-[#F19145] bg-[#F19145]/10"
                      : "border-black dark:border-[#383B42]"
                  }`}
              >
                <div className="flex items-center justify-start gap-2 mb-4">
                  <p className="text-[16px] font-medium">Address</p>
                  {addr.isDefault && (
                    <span className="text-[14px] px-[6px] py-1 rounded-[6px] bg-[#F19145] text-[#FDEDD7]">
                      Main address
                    </span>
                  )}
                </div>

                <p className="mb-3 mt-2 text-[18px] ">{addr.completeAdress}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[16px] font-medium">
                  <div className="flex flex-col gap-1">
                    <p className="text-[16px] text-black dark:text-[#E7E7E7]">Country</p>
                    <span className="text-[18px]  text-black dark:text-[#FCFCFC] ">{addr.country}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[16px] text-black dark:text-[#E7E7E7]">Province</p>
                    <span className="text-[18px]  text-black dark:text-[#FCFCFC] ">{addr.province || "-"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[16px] text-black dark:text-[#E7E7E7]" >City</p>
                    <span className="text-[18px]  text-black dark:text-[#FCFCFC] ">{addr.city || "-"}</span>
                  </div>
                  <div className="flex flex-col gap-1" >
                    <p className="text-[16px] text-black dark:text-[#E7E7E7]">Postal</p>
                    <span className="text-[18px]  text-black dark:text-[#FCFCFC] ">{addr.postalCode || "-"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NEW */}
        {tab === "new" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["country", "province", "city", "postalCode"].map((k) => (
                <input
                  key={k}
                  placeholder={k}
                  className="p-3 rounded-[6px] border-[1px] border-black dark:border-[#616674] bg-white dark:bg-[#262626]"
                  value={(form as any)[k]}
                  onChange={(e) =>
                    setForm({ ...form, [k]: e.target.value })
                  }
                />
              ))}
            </div>

            <textarea
              placeholder="input Complete address"
              className="w-full h-28 p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent"
              value={form.completeAdress}
              onChange={(e) =>
                setForm({ ...form, completeAdress: e.target.value })
              }
            />

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({ ...form, isDefault: e.target.checked })
                }
                className="accent-[#F19145] rounded-[6px] w-[26px] h-[26px]"
              />
              <span>Make it the main address</span>
            </label>

            <button
              disabled={loading}
              onClick={submit}
              className="w-full bg-[#F19145] text-black py-3 rounded font-medium "
            >
              {loading ? "Saving..." : "Save address"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
