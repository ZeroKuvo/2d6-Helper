// Utility functions for dice rolling
export type DiceRoll = {
  value: number;
  isMax?: boolean;
  isMin?: boolean;
};

export type DiceRollResult = {
  rolls: DiceRoll[];
  total: number;
  isDouble: boolean;
  isPrimeAttack: boolean;
};

// Roll a single d6
export const rollD6 = (): DiceRoll => {
  const value = Math.floor(Math.random() * 6) + 1;
  return {
    value,
    isMax: value === 6,
    isMin: value === 1,
  };
};

// Roll multiple d6
export const rollDice = (count: number): DiceRollResult => {
  if (count < 1) count = 1;
  
  const rolls: DiceRoll[] = [];
  let total = 0;
  
  for (let i = 0; i < count; i++) {
    const roll = rollD6();
    rolls.push(roll);
    total += roll.value;
  }
  
  // Check for doubles (all dice show the same value)
  const isDouble = rolls.length > 1 && rolls.every(roll => roll.value === rolls[0].value);
  const isPrimeAttack = isDouble && rolls[0].value === 6;
  
  return {
    rolls,
    total,
    isDouble,
    isPrimeAttack,
  };
};

// Roll 2d6 with optional re-roll on doubles
export const roll2d6 = (reRollOnDouble: boolean = false): DiceRollResult & { reRolled?: boolean } => {
  const firstRoll = rollDice(2);
  
  if (reRollOnDouble && firstRoll.isDouble) {
    const secondRoll = rollDice(2);
    return {
      ...secondRoll,
      reRolled: true,
      originalRoll: firstRoll,
    };
  }
  
  return firstRoll;
};

// Parse a dice formula like "2d6+3" or "1d6-1"
export const parseDiceFormula = (formula: string): { count: number; modifier: number } => {
  const match = formula.match(/^(\d*)d(\d+)([+-]\d+)?/i);
  
  if (!match) {
    return { count: 1, modifier: 0 };
  }
  
  const [, countStr, , modifierStr] = match;
  const count = countStr ? parseInt(countStr, 10) : 1;
  const modifier = modifierStr ? parseInt(modifierStr, 10) : 0;
  
  return { count, modifier };
};

// Calculate damage based on a formula
export const calculateDamage = (formula: string, baseShift: number = 0, fatigueShift: number = 0): {
  rolls: number[];
  baseTotal: number;
  finalTotal: number;
  formula: string;
} => {
  const { count, modifier } = parseDiceFormula(formula);
  const { rolls, total: baseTotal } = rollDice(count);
  const finalTotal = Math.max(1, baseTotal + modifier + baseShift + fatigueShift);
  
  return {
    rolls: rolls.map(roll => roll.value),
    baseTotal: baseTotal + modifier,
    finalTotal,
    formula: `${count}d6${modifier >= 0 ? '+' + modifier : modifier}`,
  };
};
