import { useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, X, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ==================== TYPES ====================

export interface AppShellMenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Navigation path/route */
  to: string;
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Display label */
  label: string;
  /** Permission check (optional) - return true to show item */
  permission?: () => boolean;
  /** Whether this route requires exact match */
  exact?: boolean;
  /** Custom active check (optional) */
  isActive?: (pathname: string) => boolean;
}

export interface AppShellProps {
  /** Menu items for sidebar navigation */
  menuItems: AppShellMenuItem[];
  /** Header/toolbar content (custom components) */
  headerContent?: ReactNode;
  /** Brand logo component */
  logo?: ReactNode;
  /** Brand name */
  brandName?: string;
  /** Page content */
  children: ReactNode;
  /** Loading indicator (optional) */
  loadingBar?: ReactNode;
  /** Collapsed state of sidebar (controlled) */
  collapsed?: boolean;
  /** Callback when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Additional className for main content area */
  contentClassName?: string;
  /** Enable page transition animation */
  enableTransitions?: boolean;
  /** Transition animation config */
  transitionConfig?: {
    initial?: object;
    animate?: object;
    transition?: object;
  };
  /** Custom navigation handler (for items that need special behavior) */
  onNavigate?: (item: AppShellMenuItem) => void;
  /** Callback when sidebar closes (mobile) */
  onMobileClose?: () => void;
  /** Show collapse button in sidebar */
  showCollapseButton?: boolean;
  /** Custom render for menu item */
  renderMenuItem?: (item: AppShellMenuItem, isActive: boolean, collapsed: boolean) => ReactNode;
}

// ==================== HOOKS ====================

/** Hook to detect large screen (matches Tailwind's lg breakpoint: 1024px) */
function useIsLarge() {
  const [isLarge, setIsLarge] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width:1024px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width:1024px)');
    const handler = (ev: MediaQueryListEvent | MediaQueryList) => setIsLarge(ev.matches);
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler as any);
    } else {
      // @ts-ignore - fallback for older browsers
      mq.addListener(handler);
    }
    return () => {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', handler as any);
      } else {
        // @ts-ignore
        mq.removeListener(handler);
      }
    };
  }, []);

  return isLarge;
}

// ==================== MAIN COMPONENT ====================

export function AppShell({
  menuItems,
  headerContent,
  logo,
  brandName = 'App',
  children,
  loadingBar,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  contentClassName,
  enableTransitions = true,
  transitionConfig = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  onNavigate,
  onMobileClose,
  showCollapseButton = true,
  renderMenuItem,
}: AppShellProps) {
  const location = useLocation();
  const isLarge = useIsLarge();

  // Internal state for collapse (if not controlled)
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('app-shell-sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use controlled or internal state
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const setCollapsed = (value: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(value);
    } else {
      setInternalCollapsed(value);
      localStorage.setItem('app-shell-sidebar-collapsed', JSON.stringify(value));
    }
  };

  // Handle sidebar toggle
  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Handle mobile menu toggle
  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle mobile menu close
  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
    onMobileClose?.();
  };

  // ESC key handler and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        handleCloseMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Lock body scroll on mobile when menu is open
    if (mobileMenuOpen && !isLarge) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, isLarge]);

  // Animate sidebar position based on screen size
  const animateX: number | string = isLarge ? 0 : (mobileMenuOpen ? 0 : '-100%');

  return (
    <div className="relative min-h-screen bg-background">
      {/* Loading Bar */}
      {loadingBar}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: animateX }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen border-r bg-card',
          'transition-transform duration-300 ease-out',
          'lg:translate-x-0 lg:transition-[width] lg:duration-200',
          collapsed ? 'w-16' : 'w-64'
        )}
        aria-label="Main navigation"
      >
        {/* Pass all props to AppShellSidebar sub-component */}
        <AppShellSidebar
          menuItems={menuItems}
          collapsed={collapsed}
          logo={logo}
          brandName={brandName}
          onToggleSidebar={handleToggleSidebar}
          onCloseMobileMenu={handleCloseMobileMenu}
          showCollapseButton={showCollapseButton}
          renderMenuItem={renderMenuItem}
          onNavigate={onNavigate}
          location={location}
        />
      </motion.aside>

      {/* Main Content Area */}
      <div
        className={cn(
          'min-h-screen',
          'transition-[margin] duration-200 ease-out',
          'lg:ml-16',
          !collapsed && 'lg:ml-64'
        )}
      >
        {/* Header */}
        <AppShellHeader
          onMobileMenuToggle={handleToggleMobileMenu}
          collapsed={collapsed}
          headerContent={headerContent}
        />

        {/* Page Content */}
        <main className={cn(
          'min-h-screen pt-[5rem] px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8 overflow-y-auto',
          contentClassName
        )}>
          {enableTransitions ? (
            <motion.div
              key={location.pathname}
              initial={transitionConfig.initial as any}
              animate={transitionConfig.animate as any}
              transition={transitionConfig.transition as any}
            >
              {children}
            </motion.div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Mobile Overlay Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={handleCloseMobileMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

interface AppShellSidebarProps {
  menuItems: AppShellMenuItem[];
  collapsed: boolean;
  logo?: ReactNode;
  brandName: string;
  onToggleSidebar: () => void;
  onCloseMobileMenu: () => void;
  showCollapseButton: boolean;
  renderMenuItem?: AppShellProps['renderMenuItem'];
  onNavigate?: AppShellProps['onNavigate'];
  location: ReturnType<typeof useLocation>;
}

function AppShellSidebar({
  menuItems,
  collapsed,
  logo,
  brandName,
  onToggleSidebar,
  onCloseMobileMenu,
  showCollapseButton,
  renderMenuItem,
  onNavigate,
  location,
}: AppShellSidebarProps) {

  return (
    <div className="flex h-full flex-col">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3 min-w-0">
          {logo && <div className="flex-shrink-0">{logo}</div>}
          {!collapsed && (
            <span className="text-lg font-semibold truncate overflow-hidden">
              {brandName}
            </span>
          )}
        </div>
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCloseMobileMenu}
          className="lg:hidden flex-shrink-0"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto overscroll-contain">
        {menuItems.map((item) => {
          // Check permission
          if (item.permission && !item.permission()) {
            return null;
          }

          // Determine if active
          const pathBase = location.pathname.replace(/^\//, '').split('/')[0];
          const isActive = item.isActive
            ? item.isActive(location.pathname)
            : item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to) || pathBase === item.to.replace(/^\//, '');

          // Custom render or default
          if (renderMenuItem) {
            return renderMenuItem(item, isActive, collapsed);
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                onCloseMobileMenu();
                onNavigate?.(item);
              }}
              className={cn(
                'w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'min-h-[44px]',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="truncate overflow-hidden">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Button (Desktop Only) */}
      {showCollapseButton && (
        <div className="p-3 hidden lg:block">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="w-full justify-center min-h-[44px]"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-2 overflow-hidden">Collapse</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

interface AppShellHeaderProps {
  onMobileMenuToggle: () => void;
  collapsed: boolean;
  headerContent?: ReactNode;
}

function AppShellHeader({
  onMobileMenuToggle,
  collapsed,
  headerContent,
}: AppShellHeaderProps) {

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6',
        'transition-[left] duration-200 ease-out',
        'left-0 lg:left-16',
        !collapsed && 'lg:left-64'
      )}
    >
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMobileMenuToggle}
        className="lg:hidden flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Custom Header Content */}
      <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
        {headerContent}
      </div>
    </header>
  );
}
