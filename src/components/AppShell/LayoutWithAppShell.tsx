import { AppShell, AppShellMenuItem } from './AppShell';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  LayoutGrid,
  User,
  LogOut,
  Settings as SettingsIcon,
  Code,
} from 'lucide-react';
import { useLayoutContext } from '../../contexts/LayoutContext';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LoadingBar } from '../LoadingBar';
import { useAuth } from '@/contexts/AuthContext';

/**
 * LayoutWithAppShell - Generic layout component using AppShell
 * 
 * This is a template layout that can be customized for different applications.
 * Modify the menu items, branding, and navigation logic as needed for your project.
 */
export function LayoutWithAppShell() {
  const { can, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { activePage } = useLayoutContext();

  const path = location.pathname || '';

  // Define menu items - customize these for your application
  const menuItems: AppShellMenuItem[] = [
    {
      id: 'dashboard',
      to: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      permission: () => can('dashboard.view'),
    },
    // Add more menu items here as needed for your application
    // Example:
    // {
    //   id: 'users',
    //   to: '/users',
    //   icon: Users,
    //   label: 'Users',
    //   permission: () => can('users.view'),
    // },
    {
      id: 'settings',
      to: '/settings',
      icon: Settings,
      label: 'Settings',
      permission: () => true, // Always visible
      exact: true,
    },
    {
      id: 'support',
      to: '/support',
      icon: HelpCircle,
      label: 'Support',
      permission: () => true, // Always visible
      exact: true,
    },
  ];

  const getPageTitle = () => {
    if (activePage) return activePage;
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/support')) return 'Support';
    if (path.startsWith('/dashboard')) return 'Dashboard';
    return 'Application';
  };

  // Navigation handler - customize if you need special routing logic
  const handleNavigate = (item: AppShellMenuItem) => {
    navigate(item.to);
  };

  // Active menu item detection
  const isMenuItemActive = (item: AppShellMenuItem, pathname: string) => {
    const pathBase = pathname.replace(/^\//, '').split('/')[0];
    const itemBase = item.to.replace(/^\//, '');
    
    if (item.exact) {
      return pathname === item.to;
    }
    
    return pathname.startsWith(item.to) || pathBase === itemBase;
  };

  // Header content
  const headerContent = (
    <>
      <div className="flex-1 items-center gap-2 min-w-0">
        <h1 className="text-lg font-semibold truncate">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-w-[calc(100vw-2rem)]">
            <DropdownMenuLabel>
              <div className="min-w-0">
                <div className="font-medium truncate">{user?.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                <Badge variant="outline" className="mt-1 text-xs">
                  {user?.role}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/account/profile" className="flex items-center">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/account/inspector" className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Session Inspector
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  return (
    <AppShell
      menuItems={menuItems}
      headerContent={headerContent}
      logo={<LayoutGrid className="h-6 w-6 text-primary" />}
      brandName="App Template" // Customize your brand name here
      loadingBar={<LoadingBar />}
      onNavigate={handleNavigate}
      renderMenuItem={(item, _isActive, collapsed) => {
        // Custom active detection
        const active = isMenuItemActive(item, location.pathname);
        
        return (
          <button
            key={item.id}
            onClick={() => handleNavigate(item)}
            className={`
              w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors
              hover:bg-accent hover:text-accent-foreground
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              min-h-[44px]
              ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}
            `}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && (
              <span className="truncate overflow-hidden">{item.label}</span>
            )}
          </button>
        );
      }}
    >
      <Outlet />
    </AppShell>
  );
}
