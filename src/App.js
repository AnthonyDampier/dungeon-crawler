import React, { useState, useEffect } from 'react';
import './App.css';
import Dungeon from './Components/Dungeon/GenerateDungeon';

  // Function to move the player
  const initialPlayerState = {
    position: { x: 4, y: 4 },
    maxHeah: 100,
    health: 100,
    inventory: [],
    vision: 3,
    stats: {
      strength: 10,
      agility: 10,
      intelligence: 10,
      perception: 10,
    },
  }
  
  function App() {

    const [playerState, setPlayerState] = useState(initialPlayerState);
  
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

    useEffect(() => {
      console.log("Player state updated: ", playerState);
    }, [playerState]);


  return (
    <div className="App">
      <h1>React App</h1>
      {/* Pass playerState as prop to GenerateDungeon */}
      <Dungeon player={playerState} movePlayer={movePlayer}/>
      {/* Displaying player states */}
      <div>
        {/* Displaying player states */}
        <div>
          <p>Health: {playerState.health}</p>
          <button onClick={() => updateHealth(-10)}>Hurt</button>
          <button onClick={() => updateHealth(10)}>Heal</button>
          <p>Inventory: {JSON.stringify(playerState.inventory)}</p>
          <button onClick={() => updateInventory("add", "sword")}>Add Sword</button>
          <button onClick={() => updateInventory("remove", "sword")}>Remove Sword</button>
          <p>Stats: {JSON.stringify(playerState.stats)}</p>
          <button onClick={() => updateStats("strength", 1)}>Increase Strength</button>
          <button onClick={() => updateStats("agility", 1)}>Increase Agility</button>
          <button onClick={() => updateStats("intelligence", 1)}>Increase Intelligence</button>
          <p>Position: {JSON.stringify(playerState.position)}</p>
          <button onClick={() => movePlayer(1, 0)}>Move Right</button>
          <button onClick={() => movePlayer(-1, 0)}>Move Left</button>
          <button onClick={() => movePlayer(0, 1)}>Move Down</button>
          <button onClick={() => movePlayer(0, -1)}>Move Up</button>
        </div>
      </div>
    </div>
  );
}

export default App;
