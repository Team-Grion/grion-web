"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth/auth-client"

export default function SettingsPage() {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push("/login")
  }

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold">설정</h1>
      <Button variant="destructive" className="w-full" onClick={handleSignOut}>
        로그아웃
      </Button>
    </div>
  )
}
