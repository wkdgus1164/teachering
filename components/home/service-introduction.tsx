"use client"

import type React from "react"
import Link from "next/link"
import { ArrowRight, Users, BookOpen, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ServiceIntroduction() {
  return (
    <section className="relative h-[600px] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/abstract-geometric-flow.png')] bg-repeat opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between py-12 relative z-10">
        {/* Text content */}
        <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="block">한국 교사들을 위한</span>
            <span className="block text-primary">교육 커뮤니티</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
            지식을 공유하고, 경험을 나누고, 함께 성장하는 교사들의 온라인 공간
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" asChild>
              <Link href="/register">
                시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">로그인</Link>
            </Button>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -z-10 blur-3xl"></div>
            <div className="bg-background/80 backdrop-blur-sm rounded-xl shadow-xl p-6 border">
              <div className="grid gap-6">
                <FeatureCard
                  icon={<Users className="h-8 w-8 text-primary" />}
                  title="교사 커뮤니티"
                  description="전국의 교사들과 연결하여 네트워크를 형성하고 협력할 수 있습니다."
                />
                <FeatureCard
                  icon={<BookOpen className="h-8 w-8 text-primary" />}
                  title="교육 자료 공유"
                  description="수업 자료, 교육 방법, 학습 계획 등을 공유하고 다운로드할 수 있습니다."
                />
                <FeatureCard
                  icon={<MessageSquare className="h-8 w-8 text-primary" />}
                  title="전문적 토론"
                  description="교육 이슈와 교수법에 대한 전문적인 토론에 참여할 수 있습니다."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-[70px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.2,141.14c62.5,0,125.91-16.77,186.52-32.86Z"
            className="fill-background"
          ></path>
        </svg>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="shrink-0 rounded-lg p-1">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  )
}
