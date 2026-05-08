"use client"

import { useState } from "react"

import { MemorialSpace } from "@/components/memorial/memorial-space"
import { PetProfileBar } from "@/components/memorial/pet-profile-bar"
import type { Message, MemorialsResponse } from "@/types/memorial"

interface MemorialViewProps {
  memorials: MemorialsResponse
  messages: Record<string, Message[]>
}

export function MemorialView({ memorials, messages }: MemorialViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    memorials?.[0]?.id ?? null
  )

  const selectedMemorial =
    memorials?.find((m) => m.id === selectedId) ?? null

  const selectedMessages = selectedId ? (messages[selectedId] ?? []) : []

  return (
    <div>
      <PetProfileBar
        memorials={memorials}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <MemorialSpace key={selectedId} memorial={selectedMemorial} messages={selectedMessages} />
    </div>
  )
}
