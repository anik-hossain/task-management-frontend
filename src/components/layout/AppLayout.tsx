interface AppLayoutProps {
  children: React.ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <div>header</div>
      <main>{children}</main>
    </div>
  )
}

export default AppLayout