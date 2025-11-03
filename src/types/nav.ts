export interface NavLink {
  title: string
  description: string
  icon: string
  url: string
  category: string
}

export interface NavData {
  navLinks: NavLink[]
}

export interface MenuItem {
  label: string
  key: string
}

