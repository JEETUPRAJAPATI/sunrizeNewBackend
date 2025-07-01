import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  LayoutDashboard,
  ShoppingCart,
  Cog,
  Truck,
  TrendingUp,
  Calculator,
  Package,
  Users,
  Handshake,
  Receipt,
  Settings,
  LogOut,
  Factory,
  Shield,
  Building2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    module: 'dashboard'
  },
  {
    label: 'Orders',
    path: '/orders',
    icon: ShoppingCart,
    module: 'orders'
  },
  {
    label: 'Manufacturing',
    path: '/manufacturing',
    icon: Cog,
    module: 'manufacturing'
  },
  {
    label: 'Dispatches',
    path: '/dispatches',
    icon: Truck,
    module: 'dispatches',
    submodules: [
      { label: 'Dispatch Notes', path: '/dispatches/notes', feature: 'dispatchNotes' },
      { label: 'Proof of Delivery', path: '/dispatches/delivery', feature: 'proofOfDelivery' }
    ]
  },
  {
    label: 'Sales',
    path: '/sales',
    icon: TrendingUp,
    module: 'sales',
    submodules: [
      { label: 'My Indent', path: '/sales/indent', feature: 'myIndent' },
      { label: 'My Customers', path: '/sales/customers', feature: 'myCustomers' },
      { label: 'My Deliveries', path: '/sales/deliveries', feature: 'myDeliveries' },
      { label: 'My Invoices', path: '/sales/invoices', feature: 'myInvoices' },
      { label: 'My Ledger', path: '/sales/ledger', feature: 'myLedger' }
    ]
  },
  {
    label: 'Accounts',
    path: '/accounts',
    icon: Calculator,
    module: 'accounts',
    submodules: [
      { label: 'Payment Register', path: '/accounts/payments', feature: 'paymentRegister' },
      { label: 'Credit Notes', path: '/accounts/credits', feature: 'creditNotes' },
      { label: 'Ledger Report', path: '/accounts/ledger', feature: 'ledgerReport' }
    ]
  },
  {
    label: 'Inventory',
    path: '/inventory',
    icon: Package,
    module: 'inventory'
  },
  {
    label: 'Customers',
    path: '/customers',
    icon: Users,
    module: 'customers'
  },
  {
    label: 'Suppliers',
    path: '/suppliers',
    icon: Handshake,
    module: 'suppliers'
  },
  {
    label: 'Companies',
    path: '/companies',
    icon: Building2,
    module: 'companies'
  },
  {
    label: 'Purchases',
    path: '/purchases',
    icon: Receipt,
    module: 'purchases'
  }
];

// Profile menu item (always available)
const profileMenuItem = {
  label: 'Profile',
  path: '/profile',
  icon: Shield,
  module: null // Always accessible
};

export default function Sidebar({ isOpen, onClose }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { hasModuleAccess, hasFeatureAccess } = usePermissions();
  const [expandedModules, setExpandedModules] = useState({});

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const toggleModule = (moduleName) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }));
  };

  const filteredMenuItems = menuItems.filter(item => hasModuleAccess(item.module));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-xl border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo and Company Name */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200">
                  <Factory className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ManuERP
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise Suite</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full w-8 h-8"
              onClick={onClose}
            >
              ×
            </Button>
          </div>



          {/* Navigation Menu */}
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path || 
                  (item.path === '/dashboard' && location === '/');
                const hasSubmodules = item.submodules && item.submodules.length > 0;
                const isExpanded = expandedModules[item.module];
                const hasAccessibleSubmodules = hasSubmodules && 
                  item.submodules.some(sub => hasFeatureAccess(item.module, sub.feature, 'view'));
                
                return (
                  <div key={item.path} className="space-y-1">
                    {/* Main Module Button */}
                    <div className="flex items-center">
                      <Link href={item.path} className="flex-1">
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start h-12 px-4 transition-all duration-200 group relative overflow-hidden",
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                              : "text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-slate-900 dark:hover:text-slate-100"
                          )}
                          onClick={onClose}
                        >
                          <Icon className={cn(
                            "w-5 h-5 mr-3 transition-all duration-200",
                            isActive ? "drop-shadow-sm" : "group-hover:scale-110"
                          )} />
                          <span className="font-medium">{item.label}</span>
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
                          )}
                        </Button>
                      </Link>
                      
                      {/* Expand/Collapse Button for Submodules */}
                      {hasAccessibleSubmodules && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 ml-1"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleModule(item.module);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Submodules */}
                    {hasAccessibleSubmodules && isExpanded && (
                      <div className="ml-8 space-y-1">
                        {item.submodules
                          .filter(sub => hasFeatureAccess(item.module, sub.feature, 'view'))
                          .map((submodule) => {
                            const isSubActive = location === submodule.path;
                            return (
                              <Link key={submodule.path} href={submodule.path}>
                                <Button
                                  variant={isSubActive ? "default" : "ghost"}
                                  size="sm"
                                  className={cn(
                                    "w-full justify-start h-9 px-3 transition-all duration-200",
                                    isSubActive
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  )}
                                  onClick={onClose}
                                >
                                  <span className="text-sm">{submodule.label}</span>
                                </Button>
                              </Link>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Profile - Always available */}
              <Separator className="my-4" />
              <Link href="/profile">
                <Button
                  variant={location === '/profile' ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 px-4 transition-all duration-200 group relative overflow-hidden",
                    location === '/profile'
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      : "text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                  onClick={onClose}
                >
                  <Shield className={cn(
                    "w-5 h-5 mr-3 transition-all duration-200",
                    location === '/profile' ? "drop-shadow-sm" : "group-hover:scale-110"
                  )} />
                  <span className="font-medium">Profile</span>
                  {location === '/profile' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
                  )}
                </Button>
              </Link>

              {/* Super User Only Items */}
              {user?.role === 'Super User' && (
                <>
                  <Link href="/role-permission-management">
                    <Button
                      variant={location === '/role-permission-management' ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start h-12 px-4 transition-all duration-200 group relative overflow-hidden",
                        location === '/role-permission-management'
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                          : "text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-slate-900 dark:hover:text-slate-100"
                      )}
                      onClick={onClose}
                    >
                      <Shield className={cn(
                        "w-5 h-5 mr-3 transition-all duration-200",
                        location === '/role-permission-management' ? "drop-shadow-sm" : "group-hover:scale-110"
                      )} />
                      <span className="font-medium">Role & Permission Management</span>
                      {location === '/role-permission-management' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
                      )}
                    </Button>
                  </Link>
                  
                  {hasModuleAccess('Settings') && (
                    <Link href="/settings">
                      <Button
                        variant={location === '/settings' ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start h-10 px-4",
                          location === '/settings'
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                        onClick={onClose}
                      >
                        <Settings className="w-5 h-5 mr-3" />
                        <span>Settings</span>
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </nav>
          </ScrollArea>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors duration-200"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
