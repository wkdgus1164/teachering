import { AuthForm } from "@/components/auth/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>소셜 계정으로 가입하여 교사 커뮤니티에 참여하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm isSignUp />
        </CardContent>
      </Card>
    </div>
  )
}
