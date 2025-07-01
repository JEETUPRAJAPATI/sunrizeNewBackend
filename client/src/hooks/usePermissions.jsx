import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user } = useAuth();

  // Check if user has access to a specific module
  const hasModuleAccess = (moduleName) => {
    if (!user || !user.permissions) return false;
    
    // Super User has access to everything
    if (user.role === 'Super User') return true;
    
    const normalizedModuleName = moduleName?.toLowerCase();
    return user.permissions.modules?.some(module => 
      module.name === normalizedModuleName && module.dashboard
    );
  };

  // Check if user has specific feature access with action
  const hasFeatureAccess = (moduleName, featureKey, action = 'view') => {
    if (!user || !user.permissions) return false;
    
    // Super User has access to everything
    if (user.role === 'Super User') return true;
    
    const normalizedModuleName = moduleName?.toLowerCase();
    const userModule = user.permissions.modules?.find(module => 
      module.name === normalizedModuleName
    );
    
    if (!userModule) return false;
    
    const feature = userModule.features?.find(f => f.key === featureKey);
    if (!feature) return false;
    
    return feature[action] || false;
  };

  // Get all accessible modules for sidebar rendering
  const getAccessibleModules = () => {
    if (!user || !user.permissions) return [];
    
    // Super User gets all modules
    if (user.role === 'Super User') {
      return [
        'dashboard', 'orders', 'manufacturing', 'dispatches', 
        'sales', 'accounts', 'inventory', 'customers', 
        'suppliers', 'purchases'
      ];
    }
    
    return user.permissions.modules
      ?.filter(module => module.dashboard)
      ?.map(module => module.name) || [];
  };

  // Get submodules/features for a specific module
  const getModuleFeatures = (moduleName) => {
    if (!user || !user.permissions) return [];
    
    const normalizedModuleName = moduleName?.toLowerCase();
    const userModule = user.permissions.modules?.find(module => 
      module.name === normalizedModuleName
    );
    
    return userModule?.features || [];
  };

  // Check specific action permission
  const canPerformAction = (moduleName, featureKey, action) => {
    return hasFeatureAccess(moduleName, featureKey, action);
  };

  // Check if user can manage users (for backwards compatibility)
  const canManageUsers = () => {
    return user && ['Super User', 'Unit Head'].includes(user.role);
  };

  // Check if user can access settings (for backwards compatibility)
  const canAccessSettings = () => {
    return user && user.role === 'Super User';
  };

  // Check if user can access all units
  const canAccessAllUnits = () => {
    if (!user || !user.permissions) return false;
    return user.role === 'Super User' || user.permissions.canAccessAllUnits;
  };

  // Get user's permission role
  const getPermissionRole = () => {
    return user?.permissions?.role || user?.role?.toLowerCase().replace(' ', '_');
  };

  return {
    hasModuleAccess,
    hasFeatureAccess,
    getAccessibleModules,
    getModuleFeatures,
    canPerformAction,
    canManageUsers,
    canAccessSettings,
    canAccessAllUnits,
    getPermissionRole,
    // Legacy support
    hasPermission: hasFeatureAccess,
    getUserModules: getAccessibleModules
  };
};