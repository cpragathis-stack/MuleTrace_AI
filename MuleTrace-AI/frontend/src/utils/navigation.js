import {
  ArrowLeftRight,
  Bot,
  Briefcase,
  LayoutDashboard,
  Network,
  ShieldAlert,
  Users,
} from 'lucide-react'

export const NAV_SECTIONS = [
  {
    label: 'Investigation',
    items: [
      {
        label: 'Overview',
        to: '/',
        icon: LayoutDashboard,
        end: true,
      },
      {
        label: 'Investigation',
        to: '/investigation',
        icon: Briefcase,
      },
      {
        label: 'Fraud Alerts',
        to: '/alerts',
        icon: ShieldAlert,
      },
      {
        label: 'Transactions',
        to: '/transactions',
        icon: ArrowLeftRight,
      },
      {
        label: 'Accounts',
        to: '/accounts',
        icon: Users,
      },
      {
        label: 'Network Graph',
        to: '/network',
        icon: Network,
      },
    ],
  },
  {
    label: 'Assistance',
    items: [
      {
        label: 'AI Assistant',
        to: '/assistant',
        icon: Bot,
      },
    ],
  },
]

export const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items)
