import { MainLayout } from "@/components/layouts/main-layout"
import { Feed } from "@/components/feed/feed"
import { WelcomeBanner } from "@/components/welcome-banner"

export default function HomePage() {
  return (
    <MainLayout>
      <WelcomeBanner />
      <Feed />
    </MainLayout>
  )
}
