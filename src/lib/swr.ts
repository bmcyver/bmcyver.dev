import useSWR from 'swr'

interface LanyardActivity {
  type: number
  timestamps?: {
    start: number
    end?: number
  }
  sync_id?: string
  state?: string
  session_id?: string
  party?: {
    id: string
  }
  name: string
  id: string
  flags?: number
  details?: string
  created_at: number
  assets?: {
    small_text?: string
    small_image?: string
    large_text?: string
    large_image: string
  }
  application_id?: string
}

interface LanyardSpotifyData {
  track_id: string
  timestamps: {
    start: number
    end: number
  }
  song: string
  artist: string
  album_art_url: string
  album: string
}

interface LanyardDiscordUser {
  username: string
  public_flags: number
  id: string
  discriminator: string
  avatar: string
}

export interface LanyardResponse {
  success: boolean
  data: {
    active_on_discord_mobile: boolean
    active_on_discord_desktop: boolean
    listening_to_spotify: boolean
    kv: {
      location: string
    }
    spotify?: LanyardSpotifyData
    discord_user: LanyardDiscordUser
    discord_status: 'online' | 'idle' | 'dnd' | 'offline'
    activities: LanyardActivity[]
  }
  error?: {
    code: string
    message: string
  }
}

export const useLanyard = (USER_ID: string) => {
  return useSWR<LanyardResponse>(`lanyard-${USER_ID}`, async () => {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`)

    const data = (await res.json()) as LanyardResponse

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data
  })
}

interface GithubContributionsActivity {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface GithubContributionsResponse {
  total: {
    [year: number]: number
    [year: string]: number
  }
  contributions: Array<GithubContributionsActivity>
  error?: string
}

export const useGithubContributions = (username: string) => {
  return useSWR<GithubContributionsResponse>(
    `github-contributions-${username}`,
    async () => {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      )

      const data = (await res.json()) as GithubContributionsResponse
      if (!res.ok) {
        throw new Error(
          `Fetching GitHub contribution data for "${username}" failed: ${data.error}`,
        )
      }

      return data
    },
  )
}

export interface WakatimeLanguage {
  name: string
  hours: number
  fill: string
}

export const useWakatime = (id: string, colors: Array<string>) => {
  return useSWR<WakatimeLanguage[]>(`wakatime-${id}`, async () => {
    const res = await fetch(`https://wakatime.com/share/${id}`)

    if (!res.ok) {
      throw new Error('Failed to fetch Wakatime data')
    }

    const data = (await res.json()).data as WakatimeLanguage[]

    return data
      .map((lang: { name: string; hours: number }, index: number) => ({
        name: lang.name,
        hours: Number(lang.hours.toFixed(2)),
        fill: colors[index % colors.length],
      }))
      .slice(0, 7)
  })
}
