"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Loader2 } from "lucide-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user && pathname !== "/auth") {
        setAuthenticated(false);
        router.push("/auth");
      } else if (user) {
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        if (pathname !== "/auth") router.push("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  // If we are on the auth page, don't show the layout
  if (pathname === "/auth") {
    return <>{children}</>;
  }

  // Otherwise, show the full dashboard layout (only if authenticated)
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Header />
        
        {/* Universal Background Art */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-rose-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 z-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
