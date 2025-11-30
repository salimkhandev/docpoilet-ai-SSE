import React from 'react';

interface HeaderComponentProps {
  isConnected: boolean;
  isLoading: boolean;
}

const HeaderComponent = React.memo(({ isConnected, isLoading }: HeaderComponentProps) => {
  return (
    <div className="border-b border-gray-800 bg-gray-900 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
            AI
          </div>
          <div>
            <h1 className="text-gray-100 font-medium text-sm">Docpilot AI</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span>{isLoading ? 'Thinking...' : 'Online'}</span>
        </div>
      </div>
    </div>
  );
});

HeaderComponent.displayName = 'HeaderComponent';

export default HeaderComponent;
