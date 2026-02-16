import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { DiceRollResult } from '../utils/dice';

type Attack = {
  id: string;
  name: string;
  requiredPrimary: number;
  requiredSecondary: number;
  damageFormula: string;
};

type CombatState = {
  playerHP: number;
  maxPlayerHP: number;
  playerBaseShift: number;
  enemyBaseShift: number;
  currentXP: number;
  round: number;
  fatigueShift: number;
  playerRoll: DiceRollResult | null;
  enemyRoll: DiceRollResult | null;
  attacks: Attack[];
  isCombatActive: boolean;
};

type AppContextType = {
  // Combat state
  combat: CombatState;
  startCombat: () => void;
  nextRound: () => void;
  resetCombat: () => void;
  rollCombat: () => void;
  applyEnemyDamage: (damage: number) => void;
  addAttack: (attack: Omit<Attack, 'id'>) => void;
  removeAttack: (id: string) => void;
  updateCombatState: (updates: Partial<CombatState>) => void;
  
  // Exploration state
  roomResult: {
    primaryDie: number;
    secondaryDie: number;
    isDouble: boolean;
    reRolled: boolean;
    originalPrimary?: number;
    originalSecondary?: number;
  } | null;
  exitResult: number | null;
  blockedExitResult: string | null;
  generateRoom: () => void;
  generateExits: () => void;
  checkBlockedExit: () => void;
  rollDice: (count: number) => { rolls: number[]; total: number };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_COMBAT_STATE: CombatState = {
  playerHP: 10,
  maxPlayerHP: 10,
  playerBaseShift: 0,
  enemyBaseShift: 0,
  currentXP: 0,
  round: 1,
  fatigueShift: 0,
  playerRoll: null,
  enemyRoll: null,
  attacks: [],
  isCombatActive: false,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [combat, setCombat] = useState<CombatState>(() => {
    const saved = localStorage.getItem('combatState');
    return saved ? JSON.parse(saved) : DEFAULT_COMBAT_STATE;
  });
  
  const [roomResult, setRoomResult] = useState<AppContextType['roomResult']>(null);
  const [exitResult, setExitResult] = useState<number | null>(null);
  const [blockedExitResult, setBlockedExitResult] = useState<string | null>(null);
  
  // Save combat state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('combatState', JSON.stringify(combat));
  }, [combat]);
  
  // Roll a single d6
  const rollD6 = (): number => Math.floor(Math.random() * 6) + 1;
  
  // Roll multiple d6
  const rollDice = (count: number): { rolls: number[]; total: number } => {
    if (count < 1) count = 1;
    const rolls = Array.from({ length: count }, () => rollD6());
    const total = rolls.reduce((sum, value) => sum + value, 0);
    return { rolls, total };
  };
  
  // Combat actions
  const startCombat = () => {
    setCombat(prev => ({
      ...prev,
      isCombatActive: true,
      round: 1,
      fatigueShift: 0,
      playerRoll: null,
      enemyRoll: null,
    }));
  };
  
  const nextRound = () => {
    setCombat(prev => {
      const newRound = prev.round + 1;
      let newFatigue = 0;
      
      if (newRound >= 6) {
        newFatigue = 3;
      } else if (newRound === 5) {
        newFatigue = 2;
      } else if (newRound === 4) {
        newFatigue = 1;
      }
      
      return {
        ...prev,
        round: newRound,
        fatigueShift: newFatigue,
        playerRoll: null,
        enemyRoll: null,
      };
    });
  };
  
  const resetCombat = () => {
    setCombat(DEFAULT_COMBAT_STATE);
  };
  
  const rollCombat = () => {
    const playerRoll = roll2d6();
    const enemyRoll = roll2d6();
    
    setCombat(prev => ({
      ...prev,
      playerRoll,
      enemyRoll,
    }));
  };
  
  const applyEnemyDamage = (damage: number) => {
    setCombat(prev => ({
      ...prev,
      playerHP: Math.max(0, prev.playerHP - damage),
    }));
  };
  
  const addAttack = (attack: Omit<Attack, 'id'>) => {
    if (combat.attacks.length >= 3) return;
    
    const newAttack: Attack = {
      ...attack,
      id: Date.now().toString(),
    };
    
    setCombat(prev => ({
      ...prev,
      attacks: [...prev.attacks, newAttack],
    }));
  };
  
  const removeAttack = (id: string) => {
    setCombat(prev => ({
      ...prev,
      attacks: prev.attacks.filter(attack => attack.id !== id),
    }));
  };
  
  const updateCombatState = (updates: Partial<CombatState>) => {
    setCombat(prev => ({
      ...prev,
      ...updates,
    }));
  };
  
  // Exploration actions
  const generateRoom = () => {
    const primaryDie = rollD6();
    const secondaryDie = rollD6();
    const isDouble = primaryDie === secondaryDie;
    
    if (isDouble) {
      const newPrimary = rollD6();
      const newSecondary = rollD6();
      
      setRoomResult({
        primaryDie: newPrimary,
        secondaryDie: newSecondary,
        isDouble: true,
        reRolled: true,
        originalPrimary: primaryDie,
        originalSecondary: secondaryDie,
      });
    } else {
      setRoomResult({
        primaryDie,
        secondaryDie,
        isDouble: false,
        reRolled: false,
      });
    }
  };
  
  const generateExits = () => {
    const roll = rollD6();
    let exits = 0;
    
    if (roll >= 2 && roll <= 3) {
      exits = 1;
    } else if (roll >= 4 && roll <= 5) {
      exits = 2;
    } else if (roll === 6) {
      exits = 3;
    }
    
    setExitResult(exits);
  };
  
  const checkBlockedExit = () => {
    const roll = rollD6();
    let result = '';
    
    if (roll <= 3) {
      result = 'Not blocked';
    } else if (roll === 4) {
      result = 'Metal doors blocked';
    } else if (roll === 5) {
      result = 'Reinforced doors blocked';
    } else {
      result = 'All door types blocked';
    }
    
    setBlockedExitResult(result);
  };
  
  // Helper function to roll 2d6 with optional re-roll on doubles
  const roll2d6 = () => {
    const firstDie = rollD6();
    const secondDie = rollD6();
    const isDouble = firstDie === secondDie;
    
    return {
      rolls: [
        { value: firstDie, isMax: firstDie === 6, isMin: firstDie === 1 },
        { value: secondDie, isMax: secondDie === 6, isMin: secondDie === 1 },
      ],
      total: firstDie + secondDie,
      isDouble,
      isPrimeAttack: isDouble && firstDie === 6,
    };
  };
  
  return (
    <AppContext.Provider
      value={{
        // Combat
        combat,
        startCombat,
        nextRound,
        resetCombat,
        rollCombat,
        applyEnemyDamage,
        addAttack,
        removeAttack,
        updateCombatState,
        
        // Exploration
        roomResult,
        exitResult,
        blockedExitResult,
        generateRoom,
        generateExits,
        checkBlockedExit,
        
        // General
        rollDice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
