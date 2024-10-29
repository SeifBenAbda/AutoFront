import React, { useState, useEffect } from 'react';
import {
  Heart, LayoutGrid, User, Users, FileText, ShoppingCart, Package, Clock,
  BarChart2, Settings, LogOut, Menu, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Button } from "../../@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../@/components/ui/sheet";
import { ScrollArea } from "../../@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../@/components/ui/collapsible";

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  { path: '/main', icon: <LayoutGrid size={20} />, label: 'Dashboard' },
  {
    path: '/users',
    icon: <Users size={20} />,
    label: 'Users',
    subItems: [
      { path: '/users/list', icon: <User size={20} />, label: 'User List' },
      { path: '/users/roles', icon: <Users size={20} />, label: 'User Roles' },
    ],
  },
  {
    path: '/products',
    icon: <Package size={20} />,
    label: 'Products',
    subItems: [
      { path: '/products/list', icon: <Package size={20} />, label: 'Product List' },
      { path: '/products/categories', icon: <FileText size={20} />, label: 'Categories' },
    ],
  },
  { path: '/carTracking', icon: <ShoppingCart size={20} />, label: 'Orders' },
  { path: '/reports', icon: <BarChart2 size={20} />, label: 'Reports' },
];

const NavItem: React.FC<{
  item: NavItem;
  isExpanded: boolean;
  onNavigate: (path: string) => void;
  currentPath: string;
}> = ({ item, isExpanded, onNavigate, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.subItems) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            className={`justify-between ${isExpanded ? 'w-full' : 'px-2'} text-lightWhite`}
          >
            <div className="flex items-center">
              {item.icon}
              {isExpanded && <span className="ml-2">{item.label}</span>}
            </div>
            {isExpanded && (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4">
          {item.subItems.map((subItem) => (
            <NavItem
              key={subItem.path}
              item={subItem}
              isExpanded={isExpanded}
              onNavigate={onNavigate}
              currentPath={currentPath}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      className={`w-full justify-start ${isExpanded ? '' : 'px-2'} ${currentPath === item.path ? "bg-greenOne hover:bg-greenOne" : "text-lightWhite"}`}
      onClick={() => onNavigate(item.path)}
    >
      {item.icon}
      {isExpanded && <span className="ml-2">{item.label}</span>}
    </Button>
  );
};

export const Sidebar: React.FC<{
  onNavigate: (path: string) => void;
  currentPath: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  className?: string;
}> = ({ onNavigate, currentPath, isExpanded, onToggleExpand, className = '' }) => {
  return (
    <div
      className={`bg-highGrey2 border rounded-2xl flex flex-col ${className} ${isExpanded ? 'w-44' : 'w-20'} transition-all duration-300 ml-2`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="self-end m-2 text-lightWhite"
        onClick={onToggleExpand}
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </Button>
      <ScrollArea className="flex-grow">
        <div className="space-y-2 px-3">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isExpanded={isExpanded}
              onNavigate={onNavigate}
              currentPath={currentPath}
            />
          ))}
        </div>
        <div className="mt-4 px-3">
          <Button
            className={`w-full justify-start ${isExpanded ? '' : 'px-2'} text-lightWhite`}
            onClick={() => onNavigate('/settings')}
          >
            <Settings size={20} />
            {isExpanded && <span className="ml-2">Settings</span>}
          </Button>
          <Button
            className={`w-full justify-start mt-2 ${isExpanded ? '' : 'px-2'} text-lightWhite`}
            onClick={() => onNavigate('/logout')}
          >
            <LogOut size={20} />
            {isExpanded && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};


