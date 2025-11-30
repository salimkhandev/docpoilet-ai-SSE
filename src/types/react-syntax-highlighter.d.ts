declare module 'react-syntax-highlighter' {
  import { ComponentType, CSSProperties } from 'react';
  
  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    customStyle?: CSSProperties;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    wrapLongLines?: boolean;
    PreTag?: string | ComponentType<any>;
    children?: string;
  }
  
  export const Prism: ComponentType<SyntaxHighlighterProps>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const vscDarkPlus: any;
}

