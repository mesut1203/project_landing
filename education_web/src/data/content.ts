export interface LinkContent {
  label: string
  href: string
  ariaLabel?: string
}
export interface ImageContent {
  src: string
  alt: string
  width: number
  height: number
  position?: string
}
export interface NavbarContent {
  brand: string
  homeLabel: string
  navigationLabel: string
  mobileNavigationLabel: string
  openMenuLabel: string
  closeMenuLabel: string
  links: LinkContent[]
  cta: LinkContent
}
export interface HeroContent {
  eyebrow: string
  heading: string
  headingLines: string[]
  description: string
  primaryCta: LinkContent
  secondaryCta: LinkContent
  image: ImageContent
  imageCaption: string
  note: string
  features: string[]
}
export interface PathContent {
  id: string
  title: string
  description: string
  label: string
  action: string
  image: ImageContent
  topics: string[]
  goal: string
}
export interface LearningPathsContent {
  eyebrow: string
  heading: string
  description: string
  items: PathContent[]
}
export interface StepContent {
  label: string
  title: string
  description: string
}
export interface HowItWorksContent {
  eyebrow: string
  heading: string
  description: string
  steps: StepContent[]
  media: ImageContent
  journeyLabel: string
  cta: LinkContent
}
export interface CommunityContent {
  eyebrow: string
  heading: string
  description: string
  image: ImageContent
  points: { title: string; description: string }[]
  cta: LinkContent
  imageCaption: string
}
export interface SelectOption {
  value: string
  label: string
}
export interface FormValues {
  goal: string
  level: string
  email: string
}
export interface SignupContent {
  eyebrow: string
  heading: string
  description: string
  button: string
  note: string
  requiredLabel: string
  privacyNote: string
  previewTitle: string
  previewDescription: string
  editLabel: string
  successAnnouncement: string
  fields: {
    goal: { label: string; placeholder: string; options: SelectOption[]; error: string }
    level: { label: string; placeholder: string; options: SelectOption[]; error: string }
    email: { label: string; placeholder: string; error: string; hint: string }
  }
  plan: { beginner: string[]; some: string[]; confident: string[] }
}
export interface FooterContent {
  brand: string
  description: string
  copyright: string
  links: LinkContent[]
  navigationLabel: string
  topLabel: string
  note: string
}
export interface SiteContent {
  meta: { title: string; description: string }
  skipLink: string
  navbar: NavbarContent
  hero: HeroContent
  paths: LearningPathsContent
  howItWorks: HowItWorksContent
  community: CommunityContent
  signup: SignupContent
  footer: FooterContent
}

export const content: SiteContent = {
  meta: {
    title: 'Learn Forward | Learn with momentum.',
    description:
      'Short lessons, practical projects, and a clearer path forward. Explore technology, languages, and creative skills with Learn Forward.',
  },
  skipLink: 'Skip to main content',
  navbar: {
    brand: 'learn forward.',
    homeLabel: 'Learn Forward home',
    navigationLabel: 'Main navigation',
    mobileNavigationLabel: 'Mobile navigation',
    openMenuLabel: 'Open navigation menu',
    closeMenuLabel: 'Close navigation menu',
    links: [
      { label: 'Courses', href: '#courses' },
      { label: 'Learning paths', href: '#learning-paths' },
      { label: 'Community', href: '#community' },
    ],
    cta: { label: 'Start learning', href: '#signup' },
  },
  hero: {
    eyebrow: 'FOR THE EVER-CURIOUS',
    heading: 'Learn with momentum.',
    headingLines: ['Learn with', 'momentum.'],
    description: 'Short lessons, practical projects, and a clearer path forward.',
    primaryCta: { label: 'Explore courses', href: '#courses' },
    secondaryCta: { label: 'How it works', href: '#how-it-works' },
    image: {
      src: '/images/curiosity-library.webp',
      alt: 'A learner making notes beside a laptop in a warm sunlit library',
      width: 960,
      height: 1100,
      position: '58% center',
    },
    imageCaption: 'Good things begin with a little curiosity.',
    note: 'Your pace. Your possibilities.',
    features: ['Learn in small steps', 'Put ideas into practice', 'Build your own path'],
  },
  paths: {
    eyebrow: 'FIND YOUR DIRECTION',
    heading: 'A path for your curiosity.',
    description: 'Follow an interest. Find a new skill. See where it takes you.',
    items: [
      {
        id: 'technology',
        title: 'Technology',
        label: 'BUILD WHAT’S NEXT',
        description:
          'Turn “what if” into something that works. Explore code, digital tools, and the thinking behind them.',
        action: 'Explore technology',
        goal: 'technology',
        topics: ['Web development', 'Digital skills', 'Problem solving'],
        image: {
          src: '/images/code-workshop.webp',
          alt: 'Hands working with a code editor at an oak library desk',
          width: 1000,
          height: 640,
        },
      },
      {
        id: 'languages',
        title: 'Languages',
        label: 'OPEN A CONVERSATION',
        description: 'Find the words to connect with a wider world.',
        action: 'Explore languages',
        goal: 'languages',
        topics: ['Everyday English', 'Communication'],
        image: {
          src: '/images/language-conversation.webp',
          alt: 'Two adult learners practicing conversation with language cards in a bright studio',
          width: 1448,
          height: 1086,
        },
      },
      {
        id: 'creative',
        title: 'Creative skills',
        label: 'MAKE SOMETHING YOURS',
        description: 'Give your ideas a voice, a shape, and a place to grow.',
        action: 'Explore creative skills',
        goal: 'creative',
        topics: ['Visual design', 'Creative writing'],
        image: {
          src: '/images/creative-practice.webp',
          alt: 'A hand sketching shapes beside paint swatches and a laptop',
          width: 720,
          height: 800,
        },
      },
    ],
  },
  howItWorks: {
    eyebrow: 'THE LEARNING JOURNEY',
    heading: 'Learn. Practice. Grow.',
    description:
      'A little space for curiosity. A new way to see the world. Move through it, one step at a time.',
    journeyLabel: 'From a little curiosity to what comes next.',
    cta: { label: 'Continue to community', href: '#community' },
    media: {
      src: 'images/learning-plan.webp',
      alt: 'Hands arranging study cards beside a cobalt notebook and laptop on a bright birch desk',
      width: 1448,
      height: 1086,
    },
    steps: [
      {
        label: 'Learn',
        title: 'Make room for curiosity.',
        description:
          'An open notebook. A little time. Start with something you’ve always wanted to understand.',
      },
      {
        label: 'Practice',
        title: 'Bring your ideas to life.',
        description:
          'Connect the dots. Try, question, and make something that turns a new idea into your own understanding.',
      },
      {
        label: 'Grow',
        title: 'Go further, together.',
        description:
          'Share a fresh perspective. Learn from the people around you. Find the confidence to take your next step.',
      },
    ],
  },
  community: {
    eyebrow: 'LEARNING IS A SHARED ADVENTURE',
    heading: 'Better together.',
    description:
      'A fresh perspective can change everything. Make space for conversations, shared ideas, and learning from each other.',
    image: {
      src: '/images/shared-learning.webp',
      alt: 'A group of students sharing ideas around a laptop in a sunlit library',
      width: 1100,
      height: 850,
    },
    imageCaption: 'Different perspectives. A shared sense of possibility.',
    points: [
      {
        title: 'Share the work in progress.',
        description:
          'Bring your questions and unfinished ideas. That’s where the best conversations begin.',
      },
      {
        title: 'Give feedback. Find perspective.',
        description:
          'Build on each other’s thinking and take something useful into your next project.',
      },
    ],
    cta: { label: 'Find your starting point', href: '#signup' },
  },
  signup: {
    eyebrow: 'LET’S TAKE THAT FIRST STEP',
    heading: 'Your next lesson starts here.',
    description: 'Tell us what you’re curious about. Give your next chapter a little direction.',
    button: 'Create your learning plan',
    note: 'Demo form. Connect a service to receive submissions.',
    requiredLabel: 'All fields are required.',
    privacyNote: 'This demo stays in your browser. Nothing is sent or stored.',
    previewTitle: 'A little direction for your next chapter.',
    previewDescription:
      'Here’s a sample starting plan for your interests. You can change your choices at any time.',
    editLabel: 'Edit my choices',
    successAnnouncement: 'Your demo learning plan is ready. No information was sent or stored.',
    fields: {
      goal: {
        label: 'Learning goal',
        placeholder: 'What would you like to explore?',
        error: 'Choose a learning goal to build your plan.',
        options: [
          { value: 'technology', label: 'Build my technology skills' },
          { value: 'languages', label: 'Learn a new language' },
          { value: 'creative', label: 'Explore my creative side' },
        ],
      },
      level: {
        label: 'Experience level',
        placeholder: 'Choose your starting point',
        error: 'Choose your current experience level.',
        options: [
          { value: 'beginner', label: 'I’m starting fresh' },
          { value: 'some', label: 'I know a little' },
          { value: 'confident', label: 'I’m ready for a new challenge' },
        ],
      },
      email: {
        label: 'Email',
        placeholder: 'you@example.com',
        error: 'Enter a valid email address, such as you@example.com.',
        hint: 'Used only to demonstrate this form. No emails will be sent.',
      },
    },
    plan: {
      beginner: [
        'Start with the fundamentals of your chosen subject.',
        'Try a short exercise and make notes on what you discover.',
        'Build a small project that puts your new knowledge to work.',
      ],
      some: [
        'Revisit the ideas you want to understand more clearly.',
        'Choose a practical project just outside your comfort zone.',
        'Ask someone to review your work, then improve one thing.',
      ],
      confident: [
        'Choose a new challenge within your area of interest.',
        'Create an original project with a clear goal and constraints.',
        'Reflect on the result and share what you learned with a peer.',
      ],
    },
  },
  footer: {
    brand: 'learn forward.',
    description: 'Stay curious. Keep moving.',
    copyright: 'Learn Forward. A concept for curious minds.',
    links: [
      { label: 'Courses', href: '#courses' },
      { label: 'Learning paths', href: '#learning-paths' },
      { label: 'Community', href: '#community' },
    ],
    navigationLabel: 'Footer navigation',
    topLabel: 'Back to top',
    note: 'An independent education platform concept.',
  },
}
