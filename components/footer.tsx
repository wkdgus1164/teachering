import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Teachering</h3>
            <p className="text-sm text-muted-foreground">한국 공교육 교사들을 위한 커뮤니티 플랫폼</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">링크</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground">
                    홈
                  </Link>
                </li>
                <li>
                  <Link href="/board" className="text-muted-foreground hover:text-foreground">
                    게시판
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">계정</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/auth/sign-in" className="text-muted-foreground hover:text-foreground">
                    로그인
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="text-muted-foreground hover:text-foreground">
                    회원가입
                  </Link>
                </li>
                <li>
                  <Link href="/profile/edit" className="text-muted-foreground hover:text-foreground">
                    계정 설정
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">문의</h4>
            <p className="text-sm text-muted-foreground">문의사항이 있으시면 아래 이메일로 연락주세요.</p>
            <p className="text-sm text-muted-foreground">contact@teachering.kr</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Teachering. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
