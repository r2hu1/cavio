"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatInput from "@/modules/ai/views/ui/input";
import { useAuthState } from "@/modules/auth/providers/auth-context";
import { ClockFading, CornerDownLeft } from "lucide-react";
import RecentlyViewed from "./recently-viewed";
import { useEffect } from "react";

export default function HomeView() {
  const getGreetings = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 0 && hours < 12) {
      return "Good morning";
    } else if (hours >= 12 && hours < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };
  const { data: user, error, isPending } = useAuthState();

  return (
    <div>
      <div className="text-center space-y-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium">
          {getGreetings()}{" "}
          <span className="font-bold text-indigo-700">
            {!isPending && user?.user.name}
          </span>
          !
        </h1>
        <p className="text-sm sm:text-lg text-foreground/80">
          Need content? Just ask. From blog posts to research papers, I’m your
          AI writer ready to craft it all.
        </p>
      </div>
      <div className="mt-10">
        <ChatInput />
      </div>
      {/* <div className="w-full max-w-5xl mt-14">
        <RecentlyViewed />
      </div> */}
    </div>
  );
}
