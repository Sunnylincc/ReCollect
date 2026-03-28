import React from 'react';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

interface ExitButtonProps {
  onExit: () => void;
  isDemoMode?: boolean;
}

export function ExitButton({ onExit, isDemoMode = false }: ExitButtonProps) {
  return (
    <Button
      onClick={onExit}
      variant="outline"
      className="fixed top-4 right-4 z-50 flex items-center gap-2 border border-[#d3e5f1] text-[#434654] hover:bg-[#e8f6ff] hover:text-[#003194] px-3 md:px-4 py-2 rounded-full shadow-sm bg-white text-sm font-semibold"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">{isDemoMode ? 'Exit to Login' : 'Sign Out'}</span>
      <span className="sm:hidden">Exit</span>
    </Button>
  );
}
