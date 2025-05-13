"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import { useSupabase } from "@/infra/supabase/provider"
import { profileSchema, type ProfileFormValues } from "@/schema/zod-schemas"

export default function EditProfilePage() {
  const { user, loading } = useAuth()
  const { updateProfile, uploadAvatar, isLoading } = useProfile()
  const { supabase } = useSupabase()
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      school: "",
      subject: "",
      bio: "",
      avatarUrl: "",
    },
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/sign-in")
      return
    }

    const fetchProfile = async () => {
      if (!user) return

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (data) {
        form.reset({
          fullName: data.full_name || "",
          school: data.school || "",
          subject: data.subject || "",
          bio: data.bio || "",
          avatarUrl: data.avatar_url || "",
        })
        setAvatarUrl(data.avatar_url)
      }
    }

    fetchProfile()
  }, [user, loading, router, supabase, form])

  const onSubmit = async (values: ProfileFormValues) => {
    await updateProfile(values)
    router.push(`/profile/${user?.id}`)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await uploadAvatar(file)
    if (url) {
      setAvatarUrl(url)
      form.setValue("avatarUrl", url)
    }
  }

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold">프로필 수정</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl || ""} alt={form.getValues("fullName")} />
                  <AvatarFallback>{form.getValues("fullName")?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>

                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Button type="button" variant="outline" asChild>
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      프로필 이미지 변경
                    </label>
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="이름을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>학교</FormLabel>
                    <FormControl>
                      <Input placeholder="학교 이름을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>과목</FormLabel>
                    <FormControl>
                      <Input placeholder="담당 과목을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>자기소개</FormLabel>
                    <FormControl>
                      <Textarea placeholder="자기소개를 입력하세요" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormDescription>500자 이내로 작성해주세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  취소
                </Button>
                <Button type="submit" disabled={isLoading}>
                  저장하기
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  )
}
