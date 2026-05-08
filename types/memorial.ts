export interface MemorialProfile {
  id: string
  petName: string
  deathDate: string // "YYYY-MM-DD"
  imageUrl: string
  isPublic: boolean
}

export type MemorialsResponse = MemorialProfile[] | null

export interface Message {
  id: string
  senderName: string
  content: string
  sentAt: string // ISO 8601
}
