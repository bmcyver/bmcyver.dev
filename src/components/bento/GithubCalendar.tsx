'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { BENTO } from '@/consts'
import {
  useGithubContributions,
  type GithubContributionsResponse,
} from '@/lib/swr'
import { type FunctionComponent } from 'react'
import Calendar, {
  type Props as ActivityCalendarProps,
} from 'react-activity-calendar'

// Adopted from https://github.com/grubersjoe/react-github-calendar
// Copyright (c) 2019 Jonathan Gruber, MIT License

// This code based on the original code from https://github.com/jktrn/enscribe.dev/blob/main/src/components/bento/GithubCalendar.tsx
// Copyright (c) 2024 jktrn

const CALENDAR_THEME = {
  dark: ['var(--muted)', 'var(--primary)'],
  light: ['var(--muted)', 'var(--primary)'],
}

const CALENDAR_CONFIG = {
  colorScheme: 'dark' as const,
  blockMargin: 5,
  blockRadius: 7,
  maxLevel: 4,
  hideTotalCount: true,
  hideColorLegend: true,
}

const GithubCalendar: FunctionComponent<
  Omit<ActivityCalendarProps, 'data' | 'theme'>
> = ({ ...props }) => {
  const { data, error, isLoading } = useGithubContributions(
    BENTO.GITHUB_USER_NAME,
  )

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-0">
        <p className="text-muted-foreground text-center text-sm">
          Unexpected error occurred while fetching data from GitHub. :/
        </p>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        {/* Desktop skeleton */}
        <div className="hidden md:block">
          <div className="grid grid-cols-19 gap-1">
            {Array.from({ length: 133 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-xl" />
            ))}
          </div>
        </div>
        {/* Mobile skeleton */}
        <div className="block md:hidden">
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 60 }, (_, i) => (
              <Skeleton key={i} className="h-[18px] w-[18px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      {/* desktop */}
      <div
        className="hidden w-full md:flex md:justify-center"
      >
        <Calendar
          data={selectLastNDays(data.contributions, 133)}
          theme={CALENDAR_THEME}
          blockSize={16}
          fontSize={12}
          {...CALENDAR_CONFIG}
          {...props}
        />
      </div>
      {/* mobile */}
      <div
        className="flex w-full justify-center md:hidden"
      >
        <Calendar
          data={selectLastNDays(data.contributions, 60)}
          theme={CALENDAR_THEME}
          blockSize={16}
          {...CALENDAR_CONFIG}
          {...props}
        />
      </div>
    </div>
  )
}

const selectLastNDays = (
  contributions: GithubContributionsResponse['contributions'],
  days: number,
) => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - days)

  return contributions.filter((activity) => {
    const activityDate = new Date(activity.date)
    return activityDate >= startDate && activityDate <= today
  })
}

export default GithubCalendar
