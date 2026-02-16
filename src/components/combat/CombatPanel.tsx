import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { calculateDamage } from '../../utils/dice';

const CombatPanel: React.FC = () => {
  const {
    combat,
    startCombat,
    nextRound,
    resetCombat,
    rollCombat,
    applyEnemyDamage,
    addAttack,
    removeAttack,
    updateCombatState,
  } = useApp();

  const [newAttack, setNewAttack] = useState<{
    name: string;
    requiredPrimary: number;
    requiredSecondary: number;
    damageFormula: string;
  }>({
    name: '',
    requiredPrimary: 1,
    requiredSecondary: 1,
    damageFormula: '1d6',
  });

  const [damageToApply, setDamageToApply] = useState<number>(0);

  const handleAddAttack = () => {
    if (combat.attacks.length >= 3) return;
    addAttack(newAttack);
    setNewAttack({
      name: '',
      requiredPrimary: 1,
      requiredSecondary: 1,
      damageFormula: '1d6',
    });
  };

  const handleApplyDamage = () => {
    applyEnemyDamage(damageToApply);
    setDamageToApply(0);
  };

  const calculateAttackResult = (attack: any) => {
    if (!combat.playerRoll) return null;

    const [primaryDie, secondaryDie] = combat.playerRoll.rolls;
    const isHit = primaryDie.value === attack.requiredPrimary && 
                 secondaryDie.value === attack.requiredSecondary;
    const isExactStrike = isHit;
    
    const damageResult = calculateDamage(
      attack.damageFormula,
      isExactStrike ? combat.playerBaseShift : 0,
      isExactStrike ? combat.fatigueShift : 0
    );

    return { isHit, isExactStrike, damageResult };
  };

  return (
    <div className="space-y-6">
      {/* Combat Setup */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-dungeon-accent">Combat Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Player HP</label>
            <input
              type="number"
              value={combat.playerHP}
              onChange={(e) => updateCombatState({ playerHP: parseInt(e.target.value) || 0 })}
              className="input"
              min="1"
            />
          </div>
          <div>
            <label className="label">Player Base Shift</label>
            <input
              type="number"
              value={combat.playerBaseShift}
              onChange={(e) => updateCombatState({ playerBaseShift: parseInt(e.target.value) || 0 })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Enemy Base Shift</label>
            <input
              type="number"
              value={combat.enemyBaseShift}
              onChange={(e) => updateCombatState({ enemyBaseShift: parseInt(e.target.value) || 0 })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Current XP</label>
            <input
              type="number"
              value={combat.currentXP}
              onChange={(e) => updateCombatState({ currentXP: parseInt(e.target.value) || 0 })}
              className="input"
              min="0"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={startCombat}
            className="btn btn-primary flex-1"
            disabled={combat.isCombatActive}
          >
            Start Combat
          </button>
          <button
            onClick={resetCombat}
            className="btn btn-secondary"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Attacks */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-dungeon-accent">Attacks</h2>
        
        {/* Attack List */}
        <div className="space-y-4 mb-6">
          {combat.attacks.map((attack) => {
            const result = calculateAttackResult(attack);
            return (
              <div key={attack.id} className="bg-dungeon-darker p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{attack.name}</h3>
                    <p className="text-sm text-dungeon-light/70">
                      Requires: {attack.requiredPrimary}/{attack.requiredSecondary}
                    </p>
                    <p className="text-sm">Damage: {attack.damageFormula}</p>
                    
                    {combat.playerRoll && result && (
                      <div className="mt-2">
                        {result.isHit ? (
                          <div className="text-dungeon-accent font-medium">
                            {result.isExactStrike ? 'Exact Strike! ' : 'Hit! '}
                            Damage: {result.damageResult.finalTotal} 
                            ({result.damageResult.rolls.join(' + ')} 
                            {result.damageResult.baseTotal !== result.damageResult.finalTotal 
                              ? `+ ${result.damageResult.finalTotal - result.damageResult.baseTotal}` 
                              : ''})
                          </div>
                        ) : (
                          <div className="text-dungeon-light/70">Miss</div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeAttack(attack.id)}
                    className="text-dungeon-danger hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Attack Form */}
        {combat.attacks.length < 3 && (
          <div className="space-y-4">
            <h3 className="font-bold">Add New Attack</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Attack Name</label>
                <input
                  type="text"
                  value={newAttack.name}
                  onChange={(e) => setNewAttack({ ...newAttack, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Slash"
                />
              </div>
              <div>
                <label className="label">Required Dice (Primary/Secondary)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newAttack.requiredPrimary}
                    onChange={(e) => setNewAttack({ ...newAttack, requiredPrimary: parseInt(e.target.value) || 1 })}
                    className="input"
                  />
                  <span className="flex items-center">/</span>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newAttack.requiredSecondary}
                    onChange={(e) => setNewAttack({ ...newAttack, requiredSecondary: parseInt(e.target.value) || 1 })}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="label">Damage Formula</label>
                <input
                  type="text"
                  value={newAttack.damageFormula}
                  onChange={(e) => setNewAttack({ ...newAttack, damageFormula: e.target.value })}
                  className="input"
                  placeholder="e.g., 1d6+1"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddAttack}
                  className="btn btn-secondary w-full"
                  disabled={!newAttack.name || !newAttack.damageFormula}
                >
                  Add Attack
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Round Tracker */}
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-dungeon-accent">Round {combat.round}</h2>
            <p className="text-sm text-dungeon-light/70">
              Fatigue Shift: {combat.fatigueShift}
            </p>
          </div>
          <button
            onClick={nextRound}
            className="btn btn-primary"
            disabled={!combat.isCombatActive}
          >
            Next Round
          </button>
        </div>
      </div>

      {/* Combat Roller */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-dungeon-accent">Combat Roll</h2>
        <button
          onClick={rollCombat}
          className="btn btn-primary w-full mb-4"
          disabled={!combat.isCombatActive}
        >
          Roll Combat
        </button>

        {(combat.playerRoll || combat.enemyRoll) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Player Roll */}
            <div className="bg-dungeon-darker p-4 rounded-lg">
              <h3 className="font-bold mb-2">Player</h3>
              {combat.playerRoll && (
                <div>
                  <div className="flex space-x-2 mb-2">
                    {combat.playerRoll.rolls.map((roll, idx) => (
                      <div key={idx} className="dice">
                        {roll.value}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p>Total: {combat.playerRoll.total}</p>
                    {combat.playerRoll.isDouble && (
                      <p className="text-dungeon-accent">
                        {combat.playerRoll.isPrimeAttack ? 'Prime Attack!' : 'Double!'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Enemy Roll */}
            <div className="bg-dungeon-darker p-4 rounded-lg">
              <h3 className="font-bold mb-2">Enemy</h3>
              {combat.enemyRoll && (
                <div>
                  <div className="flex space-x-2 mb-2">
                    {combat.enemyRoll.rolls.map((roll, idx) => (
                      <div key={idx} className="dice">
                        {roll.value}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p>Total: {combat.enemyRoll.total}</p>
                    {combat.enemyRoll.isDouble && (
                      <p className="text-dungeon-accent">
                        {combat.enemyRoll.isPrimeAttack ? 'Prime Attack!' : 'Double!'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Apply Damage */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-dungeon-accent">Apply Enemy Damage</h2>
        <div className="flex space-x-2">
          <input
            type="number"
            min="0"
            value={damageToApply}
            onChange={(e) => setDamageToApply(parseInt(e.target.value) || 0)}
            className="input flex-1"
            placeholder="Damage amount"
          />
          <button
            onClick={handleApplyDamage}
            className="btn btn-danger"
            disabled={!combat.isCombatActive || damageToApply <= 0}
          >
            Apply Damage
          </button>
        </div>
        <div className="mt-2 text-sm text-dungeon-light/70">
          Player HP: {combat.playerHP}/{combat.maxPlayerHP}
        </div>
      </div>
    </div>
  );
};

export default CombatPanel;
