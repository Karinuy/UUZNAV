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
  children?: MenuItem[]
}

export interface NavSubGroup {
  label: string
  key: string
  links: NavLink[]
}

export interface NavGroup {
  label: string
  key: string
  subs: NavSubGroup[]
}
