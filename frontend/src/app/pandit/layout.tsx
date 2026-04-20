import PanditSidebar from '@/components/pandit/PanditSidebar'

export default function PanditLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <PanditSidebar />
      <main className="flex-1 ml-0 md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
