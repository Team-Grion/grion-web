import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, ".")
}

/** 태어난 날/보낸 날은 선택 입력이라 한쪽만 있거나 둘 다 없을 수 있다. */
export function formatDateRange(
  birthDate: string | null | undefined,
  deathDate: string | null | undefined,
): string {
  if (!birthDate && !deathDate) return ''
  if (!birthDate) return formatDate(deathDate!)
  if (!deathDate) return formatDate(birthDate)
  return `${formatDate(birthDate)} ~ ${formatDate(deathDate)}`
}

export function formatSentAt(iso: string): string {
  const date = new Date(iso)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours().toString().padStart(2, "0")
  const min = date.getMinutes().toString().padStart(2, "0")
  return `${year}.${month}.${day} ${hour}:${min}`
}
