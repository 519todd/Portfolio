import TopNav from '@/components/TopNav'
import CaseSidebar from '@/components/CaseSidebar'

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <TopNav />
      <CaseSidebar />
      {/* pt-11 = TopNav height (h-11 = 44px). lg:pl-[140px] = sidebar width */}
      <div className="pt-11 lg:pl-[140px]">
        {children}
      </div>
    </div>
  )
}
