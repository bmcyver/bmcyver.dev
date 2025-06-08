export type Site = {
  title: string
  description: string
  href: string
  author: string
  locale: string
  postsPerPage: number
}

export type SocialLink = {
  href: string
  label: string
}

export type IconMap = {
  [key: string]: string
}

export type Bento = {
  DISCORD_USER_ID: string
  GITHUB_USER_NAME: string
  WAKATIME_SHARE_KEY: string
}
