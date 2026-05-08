"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { MemorialProfile } from "@/types/memorial"

interface PetProfileBarProps {
  memorials: MemorialProfile[] | null
  selectedId: string | null
  onSelect: (id: string) => void
}

export function PetProfileBar({ memorials, selectedId, onSelect }: PetProfileBarProps) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto border-b bg-background px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {memorials?.map((memorial) => {
        const isSelected = memorial.id === selectedId
        return (
          <button
            key={memorial.id}
            onClick={() => onSelect(memorial.id)}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <Avatar
              className={cn(
                "size-16 transition-all",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <AvatarImage src={memorial.imageUrl} alt={memorial.petName} />
              <AvatarFallback className="text-base">
                {memorial.petName[0]}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "text-xs transition-colors",
                isSelected ? "font-medium text-primary" : "text-muted-foreground"
              )}
            >
              {memorial.petName}
            </span>
          </button>
        )
      })}

      <Link
        href="/memorial/create"
        className="flex shrink-0 flex-col items-center gap-1.5"
      >
        <div className="flex size-16 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40">
          <Plus className="size-5 text-muted-foreground/60" />
        </div>
        <span className="text-xs text-muted-foreground">추가</span>
      </Link>
    </div>
  )
}
