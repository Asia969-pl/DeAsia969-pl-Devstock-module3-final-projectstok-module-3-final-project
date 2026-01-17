"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RegisterLogo from "./RegisterLogo";
import SecondDivider from "./SecondDivider";
import EyeIcon from "./EyeIcon";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useUser } from "../components/context/UserContext";

/* ================= SCHEMAS ================= */

const loginIdentifierSchema = z.object({
  emailOrPhone: z
    .string()
    .min(3, "required")
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{9,15}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      { message: "invalid phone number lub email" }
    ),
});

const loginPasswordSchema = z.object({
  password: z.string().min(1, "required"),
});

type StepOneData = z.infer<typeof loginIdentifierSchema>;
type StepTwoData = z.infer<typeof loginPasswordSchema>;

export default function LoginForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const router = useRouter();
  const { setUser } = useUser();

  /* ================= FORMS ================= */

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm<StepOneData>({
    resolver: zodResolver(loginIdentifierSchema),
  });

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
  } = useForm<StepTwoData>({
    resolver: zodResolver(loginPasswordSchema),
  });

  const inputClass = (hasError: boolean) =>
    `border ${hasError ? "border-[#F87171]" : "border-[#383B42]"} rounded-[6px] px-[14px] py-[16px] w-full`;

  /* ================= HANDLERS ================= */

  const onSubmitStep1 = (data: StepOneData) => {
    console.log("🟢 STEP 1 SUBMIT", data);
    setIdentifier(data.emailOrPhone);
    setStep(2);
  };

  const onSubmitStep2 = async (data: StepTwoData) => {
    console.log("🟢 STEP 2 SUBMIT");
    console.log("identifier:", identifier);
    console.log("password:", data.password);

    if (!identifier) {
      console.warn("⛔ identifier is missing");
      return;
    }

    setLoginError(null);

    console.log("🟡 calling signIn(credentials)");

    const result = await signIn("credentials", {
      redirect: false,
      identifier,
      password: data.password,
    });

    console.log("🟡 signIn result:", result);

    if (result?.error) {
      console.error("🔴 LOGIN ERROR:", result.error);
      setLoginError("Wrong Password or Login");
      return;
    }

    console.log("🟢 LOGIN OK – fetching session");

    const res = await fetch("/api/auth/session");
    const sessionData = await res.json();

    console.log("🟢 session data:", sessionData);

    if (sessionData?.user) {
      Cookies.set("user", JSON.stringify(sessionData.user));
      setUser(sessionData.user);
    }

    router.push("/");
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-black pt-30 pb-30 gap-8">
      <RegisterLogo />

      <div className="w-full max-w-[480px] px-4 gap-6">
        {step === 1 && (
          <form
            className="bg-gray-200 dark:text-[#FcFCFC] dark:bg-[#262626] p-6 space-y-4 gap-8 border border-[#383B42] rounded-[6px]"
            onSubmit={handleSubmitStep1(onSubmitStep1)}
          >
            <h1 className="text-[24px] font-medium">Sign In</h1>
            <SecondDivider />

            <div className="flex flex-col gap-4 pt-8">
              <label className="font-medium">Email or mobile phone number</label>
              <input
                {...registerStep1("emailOrPhone")}
                placeholder="Email or Mobile phone number"
                className={inputClass(!!errorsStep1.emailOrPhone)}
              />

              {errorsStep1.emailOrPhone && (
                <p className="text-red-500 text-[14px]">
                  {errorsStep1.emailOrPhone.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-[54px] bg-orange-500 text-black rounded-[6px]"
            >
              Continue
            </button>

            <p className="pt-3 text-black dark:text-[#FCFCFC] text-[14px]">
              Don't have account{" "}
              <Link href="/register">
                <span className="font-semibold">Register</span>
              </Link>
            </p>
          </form>
        )}

        {step === 2 && identifier && (
          <form
            className="bg-gray-200 dark:text-[#FcFCFC] dark:bg-[#262626] p-6 space-y-4 gap-8 border border-[#383B42] rounded-[6px]"
            onSubmit={handleSubmitStep2(onSubmitStep2)}
          >
            <h1 className="text-[24px] font-medium">Enter Password</h1>
            <SecondDivider />

            <div className="flex flex-col gap-4 pt-8 relative">
              <label className="font-medium">Password</label>
              <input
                {...registerStep2("password")}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className={inputClass(
                  !!errorsStep2.password || !!loginError
                )}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-23"
              >
                <EyeIcon />
              </button>

              {errorsStep2.password && (
                <p className="text-red-500 text-[14px]">
                  {errorsStep2.password.message}
                </p>
              )}

              {loginError && (
                <p className="text-red-500 text-[14px]">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-[54px] bg-orange-500 text-black rounded-[6px]"
            >
              Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
