import type { IconMap, SocialLink, Site, Bento } from '@/types'

export const BENTO: Bento = {
  DISCORD_USER_ID: '967304143981117450',
  GITHUB_USER_NAME: 'bmcyver',
  WAKATIME_SHARE_KEY: '@bmcyver/775ddebe-8bc5-4ca1-b7ff-fa55255557c0.json', // last 1 year
}

export const SITE: Site = {
  title: 'bmcyver',
  description: "bmcyver's blog - A place to share my thoughts and ideas",
  href: 'https://blog.bmcyver.dev',
  author: 'bmcyver',
  locale: 'ko-KR',
  postsPerPage: 5,
  featuredPostCount: 3, // will be removed
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/about',
    label: 'about',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/bmcyver',
    label: 'GitHub',
  },
  // {
  //   href: 'https://twitter.com/bmcyver',
  //   label: 'Twitter',
  // },
  {
    href: 'mailto:me@bmcyver.dev',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
