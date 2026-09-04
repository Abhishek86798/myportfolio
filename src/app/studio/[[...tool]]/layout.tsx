export const metadata = {
  title: 'Sanity Studio',
  description: 'Manage your portfolio content',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-[#101112]">
      {children}
    </div>
  )
}
