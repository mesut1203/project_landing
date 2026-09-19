export interface LinkContent {
  label: string
  href: string
}

export interface ResponsiveImage {
  desktop: string
  mobile: string
  alt: string
}

export interface SceneContent {
  id: string
  label: string
  title: string
  description: string
  start: number
  end: number
  image: ResponsiveImage
}

export interface ResidenceContent {
  id: string
  title: string
  description: string
  image: ResponsiveImage
}

export interface AmenityContent {
  id: string
  title: string
  description: string
  image: ResponsiveImage
}

export interface Content {
  brand: { name: string; wordmark: string; descriptor: string; homeLabel: string }
  meta: { title: string; description: string; icon: string }
  navigation: { label: string; links: LinkContent[]; cta: LinkContent; open: string; close: string; menuTitle: string }
  actions: { viewing: LinkContent; skipContent: string; skipIntro: string; skipStory: LinkContent; backTop: LinkContent }
  intro: { title: string; loading: string; desktopVideo: string; mobileVideo: string | null; timeoutMs: number; fadeMs: number }
  story: { title: string; loading: string; staticLabel: string; navigationLabel: string; desktopVideo: string; duration: number; heightVh: number; timeoutMs: number; scenes: SceneContent[] }
  residences: { title: string; description: string; linkLabel: string; items: ResidenceContent[] }
  architecture: { title: string; description: string; image: ResponsiveImage; details: { title: string; description: string }[] }
  amenities: { title: string; description: string; items: AmenityContent[] }
  visit: { eyebrow: string; title: string; description: string; name: string; email: string; date: string; namePlaceholder: string; emailPlaceholder: string; note: string; privacy: string; success: string; invalidName: string }
  footer: { statement: string; copyright: string; disclosure: string; navigationLabel: string }
}
