export type Profile = {
  id: string
  nickname: string
  created_at: string
  updated_at: string
}

export type Portfolio = {
  id: string
  title: string
  description: string
  tech_stack: string[]
  project_url: string | null
  github_url: string | null
  thumbnail_emoji: string
  user_id: string
  nickname: string
  created_at: string
  updated_at: string
}

export type CreatePortfolioInput = {
  title: string
  description: string
  tech_stack: string[]
  project_url?: string
  github_url?: string
  thumbnail_emoji: string
}
