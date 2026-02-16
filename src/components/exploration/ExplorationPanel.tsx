import React from 'react';
import { useApp } from '../../contexts/AppContext';

const ExplorationPanel: React.FC = () => {
  const {
    roomResult,
    exitResult,
    blockedExitResult,
    generateRoom,
    generateExits,
    checkBlockedExit,
    rollDice,
  } = useApp();

  const [diceCount, setDiceCount] = React.useState<number>(2);
  const [diceResult, setDiceResult] = React.useState<{ rolls: number[]; total: number } | null>(null);

  const handleDiceRoll = () => {
    const result = rollDice(diceCount);
    setDiceResult(result);
  };

  return (
    <div className="space-y-6">
      {/* Room Generator */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-dungeon-accent">Room Generator</h2>
        <button
          onClick={generateRoom}
          className="btn btn-primary w-full mb-4"
        >
          Generate Room
        </button>
        
        {roomResult && (
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Result:</h3>
            <div className="flex items-center space-x-4">
              <div className="dice">{roomResult.primaryDie}</div>
              <div className="dice">{roomResult.secondaryDie}</div>
              {roomResult.reRolled && (
                <div className="text-sm text-dungeon-light/70">
                  (Original: {roomResult.originalPrimary}, {roomResult.originalSecondary})
                </div>
              )}
            </div>
            {roomResult.isDouble && (
              <div className="mt-2 text-dungeon-accent font-medium">
                Double! {roomResult.reRolled ? 'Re-rolled once.' : 'Click to re-roll.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exit Generator */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-dungeon-accent">Exit Generator</h2>
        <button
          onClick={generateExits}
          className="btn btn-primary w-full mb-4"
        >
          Generate Exits
        </button>
        
        {exitResult !== null && (
          <div className="mt-2">
            <h3 className="font-semibold">Number of Exits: {exitResult}</h3>
          </div>
        )}
      </div>

      {/* Blocked Exit Check */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-dungeon-accent">Blocked Exit Check</h2>
        <button
          onClick={checkBlockedExit}
          className="btn btn-primary w-full mb-4"
        >
          Check Blocked Exit
        </button>
        
        {blockedExitResult && (
          <div className="mt-2 p-3 bg-dungeon-darker rounded-md">
            <h3 className="font-semibold">Result:</h3>
            <p className="mt-1">{blockedExitResult}</p>
          </div>
        )}
      </div>

      {/* General Dice Roller */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-dungeon-accent">Dice Roller</h2>
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="diceCount" className="label">Number of d6:</label>
            <input
              id="diceCount"
              type="number"
              min="1"
              max="10"
              value={diceCount}
              onChange={(e) => setDiceCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="input"
            />
          </div>
          
          <button
            onClick={handleDiceRoll}
            className="btn btn-primary w-full"
          >
            Roll {diceCount}d6
          </button>
          
          {diceResult && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Result:</h3>
              <div className="flex flex-wrap gap-2">
                {diceResult.rolls.map((roll, index) => (
                  <div key={index} className="dice">
                    {roll}
                  </div>
                ))}
              </div>
              <div className="mt-2 font-medium">
                Total: <span className="text-dungeon-accent">{diceResult.total}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorationPanel;
