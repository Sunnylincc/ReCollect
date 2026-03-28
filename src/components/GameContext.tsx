import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { getUserSettings, updateUserSettings, getGameHistory, saveGameResult } from '../utils/supabase/client';
import { ITEM_NAMES, getItemImage } from '../utils/itemImages';

export interface GroceryItem {
  id: string;
  name: string;
  image: string;
}

export interface GameSettings {
  listLength: number;
  memorizationTime: number;
  timerEnabled: boolean;
  timerMinutes: number;
  hintsEnabled: boolean;
  maxHints: number;
}

export interface GameStats {
  accuracy: number;
  timeTaken: number;
  hintsUsed: number;
  itemsCorrect: number;
  itemsTotal: number;
}

export interface GameState {
  currentPage: 'home' | 'list' | 'intro' | 'game' | 'results' | 'stats';
  settings: GameSettings;
  shoppingList: GroceryItem[];
  availableItems: GroceryItem[];
  selectedItems: GroceryItem[];
  gameStats: GameStats;
  gameHistory: GameStats[];
  hintsUsed: number;
  timeStarted: number | null;
  lastHintTime: number;
}

type GameAction =
  | { type: 'SET_PAGE'; page: GameState['currentPage'] }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'START_GAME' }
  | { type: 'SELECT_ITEM'; item: GroceryItem }
  | { type: 'DESELECT_ITEM'; itemId: string }
  | { type: 'USE_HINT' }
  | { type: 'FINISH_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'SAVE_GAME_RESULT' }
  | { type: 'LOAD_SETTINGS'; settings: GameSettings }
  | { type: 'LOAD_HISTORY'; history: GameStats[] };


// Item pool — exactly the 26 approved items, images from local assets.
const GROCERY_ITEMS: GroceryItem[] = ITEM_NAMES.map((name, index) => ({
  id: String(index + 1),
  name,
  image: getItemImage(name) ?? '',
}));

const initialState: GameState = {
  currentPage: 'home',
  settings: {
    listLength: 5,
    memorizationTime: 90,
    timerEnabled: true,
    timerMinutes: 3,
    hintsEnabled: true,
    maxHints: 2,
  },
  shoppingList: [],
  availableItems: GROCERY_ITEMS,
  selectedItems: [],
  gameStats: {
    accuracy: 0,
    timeTaken: 0,
    hintsUsed: 0,
    itemsCorrect: 0,
    itemsTotal: 0,
  },
  gameHistory: [],
  hintsUsed: 0,
  timeStarted: null,
  lastHintTime: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.page };
    
    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.settings };
      return { ...state, settings: newSettings };
    
    case 'START_GAME':
      const shuffledItems = [...GROCERY_ITEMS].sort(() => Math.random() - 0.5);
      const shoppingList = shuffledItems.slice(0, state.settings.listLength);
      
      // Calculate total items to display based on list length
      // Lists of 1-5 items: 20 total items
      // Lists of 6-8 items: 22 total items  
      // Lists of 9-10 items: 24 total items
      let totalItemsToDisplay: number;
      if (state.settings.listLength <= 5) {
        totalItemsToDisplay = 20;
      } else if (state.settings.listLength <= 8) {
        totalItemsToDisplay = 22;
      } else {
        totalItemsToDisplay = 24;
      }
      
      // Ensure all shopping list items are included in available items
      const otherItems = GROCERY_ITEMS.filter(item => 
        !shoppingList.find(listItem => listItem.id === item.id)
      );
      const shuffledOtherItems = otherItems.sort(() => Math.random() - 0.5);
      
      // Calculate distraction items (total - shopping list items)
      const distractionCount = totalItemsToDisplay - shoppingList.length;
      const availableItems = [
        ...shoppingList,
        ...shuffledOtherItems.slice(0, distractionCount)
      ].sort(() => Math.random() - 0.5);
      
      return {
        ...state,
        shoppingList,
        availableItems,
        selectedItems: [],
        hintsUsed: 0,
        timeStarted: Date.now(),
        currentPage: 'list',
      };
    
    case 'SELECT_ITEM':
      if (state.selectedItems.find(item => item.id === action.item.id)) {
        return state;
      }
      return {
        ...state,
        selectedItems: [...state.selectedItems, action.item],
      };
    
    case 'DESELECT_ITEM':
      return {
        ...state,
        selectedItems: state.selectedItems.filter(item => item.id !== action.itemId),
      };
    
    case 'USE_HINT':
      if (state.hintsUsed >= state.settings.maxHints || Date.now() - state.lastHintTime < 5000) {
        return state;
      }
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        lastHintTime: Date.now(),
      };
    
    case 'FINISH_GAME':
      const timeTaken = state.timeStarted ? (Date.now() - state.timeStarted) / 1000 : 0;
      const itemsCorrect = state.selectedItems.filter(selected => 
        state.shoppingList.find(required => required.id === selected.id)
      ).length;
      const accuracy = (itemsCorrect / state.shoppingList.length) * 100;
      
      const gameStats: GameStats = {
        accuracy: Math.round(accuracy),
        timeTaken: Math.round(timeTaken),
        hintsUsed: state.hintsUsed,
        itemsCorrect,
        itemsTotal: state.shoppingList.length,
      };
      
      return {
        ...state,
        gameStats,
        currentPage: 'results',
      };
    
    case 'SAVE_GAME_RESULT':
      const newHistory = [...state.gameHistory, state.gameStats];
      return {
        ...state,
        gameHistory: newHistory,
        currentPage: 'stats',
      };
    
    case 'LOAD_SETTINGS':
      return { ...state, settings: action.settings };
    
    case 'LOAD_HISTORY':
      return { ...state, gameHistory: action.history };
    
    case 'RESET_GAME':
      return {
        ...initialState,
        settings: state.settings,
        gameHistory: state.gameHistory,
      };
    
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  isLoading: boolean;
  loadUserData: () => Promise<void>;
  isDemoMode: boolean;
} | null>(null);

interface GameProviderProps {
  children: ReactNode;
  isDemoMode?: boolean;
}

export function GameProvider({ children, isDemoMode = false }: GameProviderProps) {
  const [state, baseDispatch] = useReducer(gameReducer, initialState);
  const [isLoading, setIsLoading] = useState(!isDemoMode); // Don't show loading in demo mode

  // Wrap dispatch to add Supabase save side effects (only when not in demo mode)
  const dispatch: React.Dispatch<GameAction> = (action) => {
    baseDispatch(action);

    if (isDemoMode) {
      return; // Skip all Supabase calls in demo mode
    }

    // Handle Supabase sync after state updates
    if (action.type === 'UPDATE_SETTINGS') {
      const newSettings = { ...state.settings, ...action.settings };
      updateUserSettings(newSettings).catch(err => {
        console.error('Failed to update settings:', err);
      });
    } else if (action.type === 'SAVE_GAME_RESULT') {
      saveGameResult(state.gameStats).catch(err => {
        console.error('Failed to save game result:', err);
      });
    }
  };

  // Function to load user data from Supabase
  const loadUserData = async () => {
    if (isDemoMode) {
      setIsLoading(false);
      return; // Skip loading in demo mode
    }

    setIsLoading(true);
    try {
      // Load settings
      const { settings } = await getUserSettings();
      if (settings) {
        baseDispatch({ type: 'LOAD_SETTINGS', settings });
      }

      // Load game history
      const { games } = await getGameHistory();
      if (games) {
        baseDispatch({ type: 'LOAD_HISTORY', history: games });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GameContext.Provider value={{ state, dispatch, isLoading, loadUserData, isDemoMode }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export { GROCERY_ITEMS };