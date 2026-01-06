"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Building2, LogOut, User } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Verificación adicional de sesión (complementa al middleware)
  useEffect(() => {
    if (!isPending && !session) {
      console.log("No session found in admin layout, redirecting to login");
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  // Mostrar indicador de carga mientras se verifica la sesión
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="size-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión, no renderizar nada (el useEffect redirigirá)
  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <Building2 className="size-6" />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Buildings Admin</span>
              <span className="text-xs text-sidebar-foreground/70">Dashboard</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin">
                      <Home />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/buildings">
                      <Building2 />
                      <span>Buildings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          {!isPending && session?.user && (
            <div className="p-2 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="size-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{session.user.name || session.user.email}</span>
                  <span className="text-xs text-sidebar-foreground/70">{session.user.email}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
          <div className="p-2 text-xs text-sidebar-foreground/70">
            © 2026 Buildings App
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg font-semibold">Real Estate CMS</h1>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
