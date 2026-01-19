import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://notexia.com'

  const routes = [
    '',
    '/login',
    '/register',
    '/docs',
    '/terms',
    '/privacy',
    '/dashboard',
    '/dashboard/notes',
    '/dashboard/doubts',
    '/dashboard/forums',
    '/dashboard/blogs',
    '/dashboard/leaderboard',
    '/dashboard/bookmarks',
    '/dashboard/profile',
    '/dashboard/settings',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route.startsWith('/dashboard') ? 0.8 : 0.6,
  }))
}
