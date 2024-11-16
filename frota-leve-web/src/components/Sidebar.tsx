"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Car, Flag, LogOut, User, Users } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { destroyCookie } from 'nookies'

export default function SideBar() {
  const pathname = usePathname();

  const { user } = useContext(AuthContext);
  const router = useRouter();

  function handleLogOut() {
    destroyCookie(undefined, 'token')
    router.push('/login')
  }

  return (
    <div className="flex h-screen w-64 flex-col fixed left-0 top-0 bg-zinc-950 text-zinc-50">
      <div className="flex h-14 items-center border-b border-zinc-800 px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-yellow-400">Admin</span> Dashboard
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <div className="space-y-1">
          {[
            { name: "Corridas", href: "/home", icon: Flag },
            { name: "Veículos", href: "/home/cars", icon: Car },
            { name: "Funcionários", href: "/home/employees", icon: Users },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.name}
                variant="ghost"
                asChild
                className={cn(
                  "group w-full justify-start gap-2 transition-colors duration-200 hover:bg-yellow-400/10 hover:text-yellow-400",
                  "relative overflow-hidden",
                  "after:absolute after:inset-0 after:origin-left after:bg-yellow-400/5 after:opacity-0 after:transition-all after:duration-300",
                  "hover:after:opacity-100",
                  isActive && "bg-yellow-400/10 text-yellow-400"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>
      <div className="border-t border-zinc-800 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400/10">
                <User className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-start text-zinc-400">{user?.businessName}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-zinc-900 bg-zinc-900 text-white">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800"/>
            <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer hover:bg-zinc-800">
              <LogOut/>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
