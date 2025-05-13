import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/infra/toast-context"
import { ToastContainer } from "@/components/ui/toast-container"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
