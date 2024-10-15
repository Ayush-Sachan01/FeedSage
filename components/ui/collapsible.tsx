import React, { useState, useContext, createContext } from 'react';

interface CollapsibleContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CollapsibleContext = createContext<CollapsibleContextType | undefined>(undefined);

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const Collapsible: React.FC<CollapsibleProps> = ({ 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange, 
  children, 
  className 
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange: onOpenChange || (() => {}) }}>
      <div className={className}>{children}</div>
    </CollapsibleContext.Provider>
  );
};

interface CollapsibleTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({ asChild, children }) => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('CollapsibleTrigger must be used within a Collapsible');
  }

  const { open, onOpenChange } = context;

  const handleClick = () => {
    onOpenChange(!open);
  };

  if (asChild) {
    return React.cloneElement(React.Children.only(children) as React.ReactElement, {
      onClick: handleClick,
    });
  }

  return <div onClick={handleClick}>{children}</div>;
};

interface CollapsibleContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CollapsibleContent: React.FC<CollapsibleContentProps> = ({ className, children }) => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('CollapsibleContent must be used within a Collapsible');
  }

  const { open } = context;

  if (!open) {
    return null;
  }

  return <div className={className}>{children}</div>;
};