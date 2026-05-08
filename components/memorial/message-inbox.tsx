"use client"

import { MailOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Message } from "@/types/memorial"

interface MessageInboxProps {
  messages: Message[]
}

function formatSentAt(iso: string) {
  const date = new Date(iso)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours().toString().padStart(2, "0")
  const min = date.getMinutes().toString().padStart(2, "0")
  return `${year}.${month}.${day} ${hour}:${min}`
}

export function MessageInbox({ messages }: MessageInboxProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <MailOpen className="size-5" />
        <span className="text-sm">아직 받은 쪽지가 없어요</span>
      </div>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full size-12">
          <MailOpen className="size-5" />
          <span className="sr-only">받은 쪽지함</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="data-[side=bottom]:left-1/2 data-[side=bottom]:right-auto data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:w-full data-[side=bottom]:max-w-150 max-h-[70dvh] rounded-t-2xl px-0 pb-0">
        <SheetHeader className="px-5 pb-2">
          <SheetTitle>받은 쪽지함</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full px-5 pb-8">
          <ul className="flex flex-col divide-y">
            {messages.map((msg) => (
              <li key={msg.id} className="py-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{msg.senderName}</span>
                  <span className="text-xs text-muted-foreground">{formatSentAt(msg.sentAt)}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{msg.content}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
