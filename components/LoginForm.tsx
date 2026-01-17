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

const loginIdentifierSchema = z.object({
  emailOrPhone: z
    .string()
    .min(3, "required")
    .refine((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{9,15}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }, { message: "invalid phone number lub email" }),
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

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm<StepOneData>({ resolver: zodResolver(loginIdentifierSchema) });

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
  } = useForm<StepTwoData>({ resolver: zodResolver(loginPasswordSchema) });

  const inputClass = (hasError: boolean) =>
    `border ${hasError ? "border-[#F87171]" : "border-[#383B42]"} rounded-[6px] px-[14px] py-[16px] w-full`;

  const onSubmitStep1 = (data: StepOneData) => {
    setIdentifier(data.emailOrPhone);
    setStep(2);
  };

  const onSubmitStep2 = async (data: StepTwoData) => {
    if (!identifier) return;

    setLoginError(null);

    const result = await signIn("credentials", {
      redirect: false,
      identifier,
      password: data.password,
    });

    if (result?.error) {
      setLoginError("Wrong password or login");
    } else {
      const res = await fetch("/api/auth/session");
      const sessionData = await res.json();

      if (sessionData?.user) {
        Cookies.set("user", JSON.stringify(sessionData.user));
        setUser(sessionData.user);
      }

      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-black pt-30 pb-30 gap-8">
      <RegisterLogo />

      <div className="w-full max-w-[480px] px-4 gap-6">
        {step === 1 && (
          <form
            onSubmit={handleSubmitStep1(onSubmitStep1)}
            className="bg-gray-200 dark:bg-[#262626] p-6 space-y-4 border rounded-[6px]"
          >
            <h1 className="text-[24px] font-medium">Sign In</h1>
            <SecondDivider />

            <input
              {...registerStep1("emailOrPhone")}
              placeholder="Email or phone"
              className={inputClass(!!errorsStep1.emailOrPhone)}
            />

            <button
              type="submit"
              className="w-full h-[54px] bg-orange-500 text-black rounded-[6px]"
            >
              Continue
            </button>

            <p className="text-sm">
              Don't have account?{" "}
              <Link href="/register"><b>Register</b></Link>
            </p>
          </form>
        )}

        {step === 2 && identifier && (
          <form
            onSubmit={handleSubmitStep2(onSubmitStep2)}
            className="bg-gray-200 dark:bg-[#262626] p-6 space-y-4 border rounded-[6px]"
          >
            <h1 className="text-[24px] font-medium">Enter Password</h1>
            <SecondDivider />

            <input
              {...registerStep2("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={inputClass(!!errorsStep2.password || !!loginError)}
            />

            {loginError && <p className="text-red-500">{loginError}</p>}

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
