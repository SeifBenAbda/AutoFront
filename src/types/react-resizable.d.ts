// src/types/react-resizable.d.ts
declare module 'react-resizable' {
    import * as React from 'react';
  
    export interface ResizeCallbackData {
      width: number;
      height: number;
      node: HTMLElement;
    }
  
    export interface ResizableProps {
      width: number;
      height: number;
      axis?: 'x' | 'y' | 'both';
      onResize?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
      onResizeStop?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
      onResizeStart?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    }
  
    export const Resizable: React.FC<ResizableProps>;
  }
  