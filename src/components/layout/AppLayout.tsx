import { Toaster } from "@/components/ui/sonner"

interface AppLayoutProps {
  children: React.ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <main>{children}</main>
      <Toaster />
    </div>
  )
}

export default AppLayout