"use client"

import { Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User } from "@/model/user-model"
import authService from "@/infra/auth-service"

interface ConnectedAccountsProps {
  user: User
}

export function ConnectedAccounts({ user }: ConnectedAccountsProps) {
  const currentUser = authService.getUser()
  const isCurrentUser = currentUser?.id === user.id

  const getProviderIcon = (provider: "google" | "github" | "kakao") => {
    switch (provider) {
      case "google":
        return <Mail className="h-4 w-4 mr-2" />
      case "github":
        return <Github className="h-4 w-4 mr-2" />
      case "kakao":
        return <span className="mr-2">K</span>
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Connected Accounts</h2>
      <div className="space-y-2">
        {user.connectedAccounts.map((account) => (
          <div key={account.provider} className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center">
              {getProviderIcon(account.provider)}
              <span className="capitalize">{account.provider}</span>
            </div>
            <div>
              {account.connected ? (
                <span className="text-sm text-green-500 font-medium">Connected</span>
              ) : (
                isCurrentUser && (
                  <Button size="sm" variant="outline">
                    Connect
                  </Button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
