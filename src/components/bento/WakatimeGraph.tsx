'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import {
  SiAstro,
  SiC,
  SiCplusplus,
  SiCss3,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiKotlin,
  SiLatex,
  SiMarkdown,
  SiMdx,
  SiPython,
  SiRust,
  SiSharp,
  SiTypescript,
  SiYaml,
} from 'react-icons/si'
import { type IconType } from 'react-icons/lib'
import { useWakatime } from '@/lib/swr'
import { BENTO } from '@/consts'
import { FaJava } from 'react-icons/fa'

// This code based on the original code from https://github.com/Snow0406/hyuki.dev/blob/main/src/components/bento/WakatimeGraph.tsx
// Copyright (c) 2024 Snow0406

const getLanguageIcon = (name: string) => {
  const lowercaseName = name.toLowerCase()
  const Icon = languageIcons[lowercaseName]

  if (Icon) {
    return <Icon size={15} style={{ color: 'var(--foreground)' }} />
  }

  return (
    <span className="text-foreground text-xs font-medium">
      {name.slice(0, 1)}
    </span>
  )
}

const languageIcons: { [key: string]: IconType } = {
  astro: SiAstro,
  html: SiHtml5,
  css: SiCss3,
  javascript: SiJavascript,
  kotlin: SiKotlin,
  java: FaJava,
  python: SiPython,
  c: SiC,
  'c++': SiCplusplus,
  typescript: SiTypescript,
  markdown: SiMarkdown,
  mdx: SiMdx,
  json: SiJson,
  yaml: SiYaml,
  tex: SiLatex,
  rust: SiRust,
  'c#': SiSharp,
  'git config': SiGit,
  'git attributes': SiGit,
  'Git Revision List': SiGit,
}

const colors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
]

const chartConfig = {
  hours: {
    label: 'Hours',
    color: 'hsl(var(--primary))',
  },
  label: {
    color: 'hsl(var(--muted-foreground))',
  },
  ...colors.reduce(
    (acc, color, index) => ({
      ...acc,
      [`language${index}`]: { label: `Language ${index + 1}`, color },
    }),
    {},
  ),
} satisfies ChartConfig

const WakatimeGraph = () => {
  const {
    data: languages,
    isLoading,
    error,
  } = useWakatime(BENTO.WAKATIME_SHARE_KEY, colors)

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <title>{payload.value}</title>
        <foreignObject width={16} height={16} x={-26} y={-8}>
          <div
            className="flex items-center justify-center"
            title={payload.value}
          >
            {getLanguageIcon(payload.value.toLowerCase())}
          </div>
        </foreignObject>
      </g>
    )
  }

  if (isLoading || error)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4">
        <div className="w-full space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 flex-shrink-0 rounded-sm" />
              <Skeleton
                className="h-[18px] rounded-md"
                style={{ width: `${Math.random() * 60 + 40}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    )

  return (
    <ChartContainer
      config={chartConfig}
      className="flex h-full w-full flex-col items-center justify-center"
    >
      <BarChart
        accessibilityLayer
        data={languages}
        layout="vertical"
        margin={{ left: -5, right: 20, top: 5, bottom: 5 }}
        width={500}
        height={300}
        barSize={18}
        className="pr-2 pl-3"
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          width={50}
          tick={<CustomYAxisTick />}
        />
        <XAxis type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="hours" fill="var(--color-hours)" radius={[6, 6, 6, 6]}>
          <LabelList
            dataKey="hours"
            position="right"
            formatter={(value: number) => `${Math.round(value)}h`}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export default WakatimeGraph
