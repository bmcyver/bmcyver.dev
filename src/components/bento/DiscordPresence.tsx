import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, getElapsedTime } from '@/lib/utils'
import AvatarComponent from '@/components/ui/avatar'
import { useLanyard, type LanyardResponse } from '@/lib/swr'
import { BENTO } from '@/consts'

// This code based on the original code from https://github.com/Snow0406/hyuki.dev/blob/main/src/components/bento/DiscordPresence.tsx
// Copyright (c) 2024 Snow0406

const processExternalImageUrl = (imageValue: string): string => {
  const fullPath = imageValue.replace('mp:external/', '')
  const firstSlashIndex = fullPath.indexOf('/')

  if (firstSlashIndex !== -1) {
    const urlPath = fullPath.substring(firstSlashIndex + 1)
    try {
      if (urlPath.startsWith('https/'))
        return 'https://' + decodeURIComponent(urlPath.substring(6))
      if (urlPath.startsWith('http/'))
        return 'http://' + decodeURIComponent(urlPath.substring(5))
    } catch (e) {
      console.error('Error decoding URL:', e)
    }
  }
  return ''
}

const getActivityImageUrl = (
  activity: LanyardResponse['data']['activities'][0],
  imageKey: 'large_image' | 'small_image',
): string => {
  const imageValue = activity.assets?.[imageKey]
  if (!imageValue) return ''

  if (imageValue.startsWith('mp:external/'))
    return processExternalImageUrl(imageValue)
  if (imageValue.startsWith('mp:'))
    return `https://media.discordapp.net/${imageValue.replace('mp:', '')}`
  if (imageValue.startsWith('spotify:'))
    return `https://i.scdn.co/image/${imageValue.replace('spotify:', '')}`

  return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${imageValue}`
}

const useElapsedTime = (startTimestamp?: number) => {
  const [elapsedTime, setElapsedTime] = useState('')

  useEffect(() => {
    if (!startTimestamp) return

    const updateElapsedTime = () =>
      setElapsedTime(getElapsedTime(startTimestamp))
    updateElapsedTime()

    const intervalId = setInterval(updateElapsedTime, 1000)
    return () => clearInterval(intervalId)
  }, [startTimestamp])

  return elapsedTime
}

const StatusIndicator = ({
  status,
}: {
  status: LanyardResponse['data']['discord_status']
}) => (
  <div
    className={cn(
      'border-background absolute right-0 bottom-0 size-6 rounded-full border-4 md:size-5 md:border-3',
      {
        'flex items-center justify-center bg-green-500': status === 'online',
        'bg-amber-400': status === 'idle',
        'bg-destructive flex items-center justify-center': status === 'dnd',
        'bg-muted-foreground flex items-center justify-center':
          status === 'offline',
      },
    )}
    role="status"
    aria-label={`Discord status: ${status}`}
  >
    <div
      className={cn(
        'bg-background',
        status === 'idle' && 'size-[10px] rounded-full md:size-[8px]',
        status === 'dnd' &&
          'h-[4px] w-[11px] rounded-full md:h-[3px] md:w-[9px]',
        status === 'offline' && 'size-2 rounded-full md:size-[6px]',
      )}
    />
  </div>
)

const ActivityDisplay = ({
  activity,
}: {
  activity: LanyardResponse['data']['activities'][0]
}) => {
  const elapsedTime = useElapsedTime(activity.timestamps?.start)

  return (
    <div className="flex w-full flex-col gap-y-2 overflow-hidden">
      {activity.name && (
        <div className="text-muted-foreground w-full truncate text-[10px] leading-tight font-medium opacity-70 md:text-[9px]">
          {(() => {
            switch (activity.type) {
              case 0:
                return `Playing ${activity.name}`
              case 1:
                return `Streaming ${activity.name}`
              case 2:
                return `Listening to ${activity.name}`
              case 3:
                return `Watching ${activity.name}`
              case 4:
                return `Competing in ${activity.name}`
              default:
                return activity.name
            }
          })()}
        </div>
      )}

      <div className="flex w-full items-start gap-x-3 pt-1 md:gap-x-2.5">
        <div
          className={cn(
            'relative -mt-2 aspect-square h-12 w-12 flex-shrink-0 rounded-lg bg-cover bg-center bg-no-repeat md:h-10 md:w-10',
            !activity.assets?.large_image && 'bg-secondary/40',
          )}
          style={{
            backgroundImage: activity.assets?.large_image
              ? `url('${getActivityImageUrl(activity, 'large_image')}')`
              : 'none',
          }}
          aria-label={
            activity.name ? `${activity.name} image` : 'Activity image'
          }
        >
          {activity.assets?.small_image && (
            <img
              src={getActivityImageUrl(activity, 'small_image')}
              alt={`${activity.name || 'Activity'} icon`}
              width={20}
              height={20}
              className="md:width-[16px] md:height-[16px] absolute -right-1 -bottom-1 rounded-full shadow-sm md:-right-[2px] md:-bottom-[2px]"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-y-0.5 overflow-hidden">
          <div className="text-primary truncate text-[13px] leading-tight font-medium md:text-[12px]">
            {activity.details || activity.name || 'Unknown Activity'}
          </div>

          {activity.state && (
            <div className="text-muted-foreground truncate text-[11px] leading-tight opacity-75 md:text-[10px]">
              {activity.state}
            </div>
          )}

          {elapsedTime && (
            <div className="text-muted-foreground truncate font-mono text-[10px] leading-tight opacity-60 md:text-[9px]">
              {elapsedTime}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const DiscordPresence = () => {
  const { data: lanyard, isLoading } = useLanyard(BENTO.DISCORD_USER_ID)

  if (isLoading) {
    return (
      <div
        className="relative overflow-hidden md:aspect-square"
        aria-label="Loading Discord status"
      >
        <div className="grid size-full grid-rows-4">
          <Skeleton className="bg-secondary/50" />
          <div className="row-span-3 flex flex-col gap-3 p-3 md:gap-2 md:p-2">
            <div className="flex justify-between gap-x-1">
              <Skeleton className="-mt-[3rem] aspect-square size-20 rounded-full" />
              <Skeleton className="h-6 w-[118px] rounded-xl md:h-5 md:w-[100px]" />
            </div>
            <Skeleton className="flex h-[62px] flex-col gap-y-1 rounded-xl p-3 md:h-[54px] md:gap-y-0.5 md:p-2" />
            <Skeleton className="flex grow rounded-xl p-2 md:p-1.5" />
          </div>
        </div>
      </div>
    )
  }

  if (!lanyard?.data) return null

  const status = lanyard.data.discord_status
  const activeActivity = lanyard.data.activities.find(
    (activity) => activity.assets,
  )

  return (
    <div
      className="relative overflow-hidden md:aspect-square"
      aria-label="Current Discord status"
    >
      <div className="grid size-full grid-rows-4">
        <div className="bg-secondary/50"></div>
        <div className="row-span-3 flex flex-col gap-2.5 p-3 md:gap-2 md:p-2">
          <div className="flex justify-between gap-x-1">
            <div className="relative">
              <AvatarComponent
                src="/static/discord_avatar.png"
                alt="Avatar"
                fallback="e"
                className="-mt-[3rem] aspect-square size-20 rounded-full"
              />
              <StatusIndicator status={status} />
            </div>
          </div>

          <div className="bg-secondary/50 flex flex-col gap-y-1 rounded-xl p-2.5 md:p-2">
            <span className="text-base leading-none md:text-sm">bmcyver</span>
            <span className="text-muted-foreground text-xs leading-none md:text-[10px]">
              @bmcyver
            </span>
          </div>

          <div className="bg-secondary/50 flex grow rounded-xl px-2.5 py-2 md:px-2 md:py-1.5">
            {activeActivity ? (
              <ActivityDisplay activity={activeActivity} />
            ) : (
              <div className="flex size-full min-h-[60px] flex-col items-center justify-center gap-1 md:gap-0.5">
                <div className="text-muted-foreground text-[10px] md:text-[8px]">
                  No activities
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscordPresence
