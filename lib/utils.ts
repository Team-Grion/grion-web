import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, ".")
}

export function formatDateRange(birthDate: string, deathDate: string): string {
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
