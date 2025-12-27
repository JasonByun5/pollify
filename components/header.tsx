import { AuthButton } from "@/components/auth/auth-button";
import { Suspense } from "react";

export function Header() {
  return (
    <header className="w-full border-b border-b-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="w-full flex justify-between items-center p-3 px-5 max-w-7xl mx-auto">
        <div className="font-semibold text-lg">Your App Name</div>
        <Suspense>
          <AuthButton />
        </Suspense>
      </nav>
    </header>
  );
}