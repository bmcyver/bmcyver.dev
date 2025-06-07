import { FaSpotify } from 'react-icons/fa'
import { Skeleton } from '@/components/ui/skeleton'
import { MoveUpRight } from 'lucide-react'
import { useLanyard } from '@/lib/swr'
import { BENTO } from '@/consts'

// This code based on the original code from https://github.com/jktrn/enscribe.dev/blob/main/src/components/bento/SpotifyPresence.tsx
// Copyright (c) 2024 jktrn

const SpotifyPresence = () => {
  const { data: lanyard, isLoading } = useLanyard(BENTO.DISCORD_USER_ID)

  if (isLoading || !lanyard) {
    return (
      <div className="relative flex h-full w-full flex-col justify-between rounded-3xl p-5">
        <Skeleton className="mb-1 h-[65%] w-[55%] rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col justify-end overflow-hidden">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="text-primary absolute top-0 right-0 m-3">
          <FaSpotify size={56} />
        </div>
        <Skeleton className="absolute right-0 bottom-0 m-3 h-10 w-10 rounded-full" />
      </div>
    )
  }

  if (!lanyard.data.spotify) {
    return (
      <div className="relative flex h-full w-full flex-col justify-between rounded-3xl p-5">
        <Skeleton className="mb-1 h-[65%] w-[55%] rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col justify-end overflow-hidden">
          <div className="flex flex-col gap-2">
            <span className="text-md mb-2 truncate leading-none font-bold">
              Not Listening
            </span>
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="text-primary absolute top-0 right-0 m-3">
          <FaSpotify size={56} />
        </div>
        <Skeleton className="absolute right-0 bottom-0 m-3 h-10 w-10 rounded-full" />
      </div>
    )
  }

  const { song, artist, album_art_url, track_id } = lanyard.data.spotify!

  return (
    <>
      <div className="relative flex h-full w-full flex-col justify-between p-5">
        <img
          src={album_art_url}
          alt="Album art"
          width={100}
          height={100}
          className="border-border mb-1 w-[55%] rounded-xl border"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-end overflow-hidden">
          <div className="flex flex-col">
            <span className="text-md mb-2 truncate leading-none font-bold">
              {song}
            </span>
            <span className="text-muted-foreground w-[85%] truncate text-xs">
              by{' '}
              <span className="text-secondary-foreground font-semibold">
                {artist}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="text-primary absolute top-0 right-0 m-3">
        <FaSpotify size={56} />
      </div>
      <a
        href={`https://open.spotify.com/track/${track_id}`}
        aria-label="View on Spotify"
        title="View on Spotify"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-secondary/50 text-primary hover:ring-primary absolute right-0 bottom-0 m-3 hidden w-fit items-end rounded-full border p-3 transition-all duration-300 group-hover:flex hover:rotate-12 hover:ring-1"
      >
        <MoveUpRight size={16} />
      </a>
    </>
  )
}

export default SpotifyPresence
