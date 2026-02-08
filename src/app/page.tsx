"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d14]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d14] px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-4">
          Study <span className="text-[#38bdf8]">Habits</span>
        </h1>
        <p className="text-xl text-gray-400 mb-2">
          One skill at a time. One habit that sticks.
        </p>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          AI-guided system that helps you build real study skills through a
          structured 3-week cycle. No streaks. No points. Just progress.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button className="bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-black font-semibold px-8 py-6 text-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="border-[#2a2a3a] text-gray-300 hover:bg-[#1a1a26] px-8 py-6 text-lg"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
