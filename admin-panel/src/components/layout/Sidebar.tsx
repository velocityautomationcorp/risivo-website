import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  DocumentTextIcon,
  PhotoIcon,
  LanguageIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', to: '/admin', icon: HomeIcon },
  { name: 'Pages', to: '/admin/pages', icon: DocumentTextIcon },
  { name: 'Media', to: '/admin/media', icon: PhotoIcon },
  { name: 'Translations', to: '/admin/translations', icon: LanguageIcon },
  { name: 'Settings', to: '/admin/settings', icon: Cog6ToothIcon },
]

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-gray-900">
      <div className="flex items-center justify-center h-16 bg-gray-800">
        <h1 className="text-white text-xl font-bold">Risivo CMS</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
