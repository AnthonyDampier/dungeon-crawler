import React, { useState } from 'react';

export function PlayerState(){
  // Function to move the player
  const movePlayer = (dx, dy) => {
    setPlayerState(prevState => ({
      ...prevState,
      position: {
        x: prevState.position.x + dx,
        y: prevState.position.y + dy,
      },
    }));
  };

  // Function to update health
  const updateHealth = (amount) => {
    setPlayerState(prevState => ({
      ...prevState,
      health: prevState.health + amount,
    }));
  };

  // Function to add item to inventory
  const updateInventory = (action ,item) => {
    if (action === "add"){
      setPlayerState(prevState => ({
        ...prevState,
        inventory: [...prevState.inventory, item],
      }));
    } else if (action === "remove"){
      setPlayerState(prevState => ({
        ...prevState,
        inventory: prevState.inventory.filter((i) => i !== item),
    }));
    } else {
      console.log("Invalid action");
    }
  };

  // Function to update stats
  const updateStats = (statName, value) => {
    setPlayerState(prevState => ({
      ...prevState,
      stats: {
        ...prevState.stats,
        [statName]: prevState.stats[statName] + value,
      },
    }));
  };

  const initialPlayerState = {
    position: { x: 0, y: 0 },
    health: 100,
    inventory: [],
    stats: {
      strength: 10,
      agility: 10,
      intelligence: 10,
    },
    movePlayer: (x, y) => {movePlayer(x, y)},
    updateHealth: (amount) => {updateHealth(amount)},
    updateStats: (statName, value) => {updateStats(statName, value)},
    updateInventory: (action, item) => {updateInventory(action, item)},
  };

  const [playerState, setPlayerState] = useState(initialPlayerState);

  // Example usage within the component
  return playerState;
};
