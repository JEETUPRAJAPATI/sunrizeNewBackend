import React from 'react';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';

// ActionButton component that enforces permission-based access
export const ActionButton = ({ 
  module, 
  feature, 
  action, 
  children, 
  className,
  variant = "default",
  size = "default",
  ...props 
}) => {
  const { canPerformAction } = usePermissions();

  // Check if user has permission for this action
  const hasPermission = canPerformAction(module, feature, action);

  // If no permission, don't render the button
  if (!hasPermission) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  );
};

// Hook for checking permissions in components
export const useActionPermissions = (module, feature) => {
  const { canPerformAction } = usePermissions();

  return {
    canView: canPerformAction(module, feature, 'view'),
    canAdd: canPerformAction(module, feature, 'add'),
    canEdit: canPerformAction(module, feature, 'edit'),
    canDelete: canPerformAction(module, feature, 'delete'),
    canAlter: canPerformAction(module, feature, 'alter')
  };
};