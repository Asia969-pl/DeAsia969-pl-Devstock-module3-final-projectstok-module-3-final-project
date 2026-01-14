"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../library/register.schema";
import RegisterLogo from "./RegisterLogo";
import SecondDivider from "./SecondDivider";
import EyeIcon from "./EyeIcon";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreements: true },
  });

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.number,
          country: formData.country,
        }),
      });

      const data = await response.json();
      if (!response.ok) return console.error(data?.message);
      router.push("/success");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-black pt-30 pb-30 gap-8">
      <RegisterLogo />

      <div className="w-full max-w-[480px] px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-200 dark:text-[#FcFCFC] dark:bg-[#262626] p-6 space-y-4 border border-[#383B42] rounded-[8px]"
        >
          <h1 className="text-[24px] font-medium">Create Account</h1>
          <SecondDivider />

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Email</label>
            <input
              {...register("email")}
              className={`border rounded-[6px] px-[14px] py-[16px] ${
                errors.email ? "border-[#F87171]" : "border-[#383B42]"
              }`}
              placeholder="Your Email"
            />
            {errors.email && <p className="text-[#F87171] text-[14px]">{errors.email.message}</p>}
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Name</label>
            <input
              {...register("name")}
              className={`border rounded-[6px] px-[14px] py-[16px] ${
                errors.name ? "border-[#F87171]" : "border-[#383B42]"
              }`}
              placeholder="Name"
            />
            {errors.name && <p className="text-[#F87171] text-[14px]">{errors.name.message}</p>}
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Mobile Number</label>
            <input
              {...register("number")}
              className={`border rounded-[6px] px-[14px] py-[16px] ${
                errors.number ? "border-[#F87171]" : "border-[#383B42]"
              }`}
              placeholder="+(Code country) 10 digit mobile number" 
            />
            {errors.number && <p className="text-[#F87171] text-[14px]">{errors.number.message}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Password</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={`border rounded-[6px] px-[14px] py-[16px] w-full pr-12 ${
                  errors.password ? "border-[#F87171]" : "border-[#383B42]"
                }`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <EyeIcon />
              </button>
            </div>
            {!watch("password") && !errors.password && (
              <p className="text-sm">
                Password must be at least 8 characters and include 1 uppercase, 1 lowercase, and 1 number.
              </p>
            )}
            {errors.password && <p className="text-[#F87171] text-[14px]">{errors.password.message}</p>}
          </div>

          {/* Confirm */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Confirm Password</label>
            <div className="relative">
              <input
                {...register("passwordConfirmed")}
                type={showConfirmPassword ? "text" : "password"}
                className={`border rounded-[6px] px-[14px] py-[16px] w-full pr-12 ${
                  errors.passwordConfirmed ? "border-[#F87171]" : "border-[#383B42]"
                }`}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <EyeIcon />
              </button>
            </div>
            {errors.passwordConfirmed && (
              <p className="text-[#F87171] text-[14px]">{errors.passwordConfirmed.message}</p>
            )}
          </div>

          {/* Country */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Country</label>
            <select
              {...register("country")}
              className={`border rounded-[6px] px-[14px] py-[16px] ${
                errors.country ? "border-[#F87171]" : "border-[#383B42]"
              }`}
            >
              <option value="indonesia">Indonesia</option>
              <option value="poland">Poland</option>
              <option value="germany">Germany</option>
            </select>
            {errors.country && <p className="text-[#F87171] text-[14px]">{errors.country.message}</p>}
          </div>

          {/* Agreements */}
          <div className="flex gap-4 items-start">
            <input {...register("agreements")} type="checkbox" className="w-5 h-5 mt-1" />
            <p className="text-sm">
              By creating an account you agree to the{" "}
              <span className="text-orange-500">Conditions of Use</span> and{" "}
              <span className="text-orange-500">Privacy Notice</span>.
            </p>
          </div>
          {errors.agreements && <p className="text-red-500 text-sm">{errors.agreements.message}</p>}

          <button className="w-full h-[54px] bg-orange-500 text-black rounded-[6px]">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
