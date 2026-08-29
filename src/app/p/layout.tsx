// @ts-nocheck
import type { ReactNode } from "react"

export default function SocialLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}