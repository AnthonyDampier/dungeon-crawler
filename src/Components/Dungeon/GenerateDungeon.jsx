import React, { useState, useEffect } from "react";
import "./Dungeon.css";

const initialDungeonSize = { width: 20, height: 20 };

const generateDungeon = (size, playerPosition, player) => {
    const tiles = [];

    for (let y = 0; y < size.height; y++) {
        const row = [];
        for (let x = 0; x < size.width; x++) {
            // Example tile setup, customize as needed
            const floorOrWall = Math.random() > 0.85 || x === 0 || y === 0 || x === size.width - 1 || y === size.height - 1 ? "wall" : "floor";
            row.push({
                revealed: (playerPosition.x === x && playerPosition.y === y ? true : false), // Reveal the player's starting position
                type: floorOrWall, // Randomly assign type for simplicity
                content: {treasure: null, enemy: null, player: (playerPosition.x === x && playerPosition.y === y ? true : false)}, // Initially, tiles don't contain anything
                active: false, // Initially, tiles are not active
            });
        }
        tiles.push(row);
    }
    // Optionally set the player's starting position and reveal surrounding tiles here

    return tiles;
};

function updateDungeon(tiles, player) {
    console.log('Updating dungeon');
    const newTiles = [...tiles];
    for (let i = 0; i < newTiles.length; i++) {
        for (let j = 0; j < newTiles[i].length; j++) {
            newTiles[i][j] = { ...newTiles[i][j], revealed: false, content: { ...newTiles[i][j].content, player: false } };
        }
    }
    for (let i = -3; i <= 3; i++) {
        for (let j = -3; j <= 3; j++) {
            if (newTiles[player.position.y + i] && newTiles[player.position.y + i][player.position.x + j] && Math.abs(i) + Math.abs(j) <= 1) {
                if (player.position.y + i === player.position.y && player.position.x + j === player.position.x) {
                    newTiles[player.position.y + i][player.position.x + j] = { ...newTiles[player.position.y + i][player.position.x + j], content: { ...newTiles[player.position.y + i][player.position.x + j].content, player: true } };
                } else {
                    newTiles[player.position.y + i][player.position.x + j] = { ...newTiles[player.position.y + i][player.position.x + j], revealed: true };
                }
            } 
        }
    }
    return newTiles;
}

function Dungeon({player, movePlayer}) {
    const [tiles, setTiles] = useState([]);
    const [activeTile, setActiveTile] = useState({x: null, y: null});
    const [playerMoving, setPlayerMoving] = useState(false);

    // Function to handle revealing tiles, updating their 'revealed' property (testing purposes)
    const revealTile = (x, y) => {
        setTiles((prevTiles) => {
            const newTiles = [...prevTiles];
            if (newTiles[y] && newTiles[y][x]) {
                newTiles[y][x] = { ...newTiles[y][x], revealed: true };
            }
            return newTiles;
        });
    };

    const showAvailableMoves = (x, y, player) => {
        const newTiles = [...tiles];
        if(!playerMoving){
            // set any active tiles to inactive
            for (let i = 0; i < newTiles.length; i++) {
                for (let j = 0; j < newTiles[i].length; j++) {
                    newTiles[i][j] = { ...newTiles[i][j], active: false };
                }
            }
            // set the player's position to active
            for (let i = -player.baseMovementSpeed; i <= player.baseMovementSpeed; i++) {
                for (let j = -player.baseMovementSpeed; j <= player.baseMovementSpeed; j++) {
                    if (newTiles[y + i] && newTiles[y + i][x + j] && Math.abs(i) + Math.abs(j) <= player.baseMovementSpeed && newTiles[y + i][x + j].type !== "wall") {
                        newTiles[y + i][x + j] = { ...newTiles[y + i][x + j], active: true };
                    }
                }
            }
            setPlayerMoving(true);
            setTiles(newTiles);
        } else if (playerMoving && tiles[y][x].active){
            
            for (let i = 0; i < newTiles.length; i++) {
                for (let j = 0; j < newTiles[i].length; j++) {
                    newTiles[i][j] = { ...newTiles[i][j], active: false };
                }
            }
            movePlayer(x - player.position.x, y - player.position.y);
            setPlayerMoving(false);
            setTiles(newTiles);
        }

    }

    useEffect(() => {
        console.log('useEffect');
        const revealTilesToPlayer = (x, y) => { 
            setTiles((prevTiles) => {
                const newTiles = [...prevTiles];
                for (let i = -player.vision; i <= player.vision; i++) {
                    for (let j = -player.vision; j <= player.vision; j++) {
                        if (newTiles[y + i] && newTiles[y + i][x + j] && Math.abs(i) + Math.abs(j) <= player.vision + 1) {
                            newTiles[y + i][x + j] = { ...newTiles[y + i][x + j], revealed: true };
                        }
                    }
                }
                return newTiles;
            });
        };

        // Generate the initial dungeon layout when the component mounts
        if (tiles.length === 0){
            setTiles(generateDungeon(initialDungeonSize, player.position));
            revealTilesToPlayer(player.position.x, player.position.y);
        } else {
            console.log('call updateDungeon');
            setTiles(updateDungeon(tiles, player));
            revealTilesToPlayer(player.position.x, player.position.y);
        }

    }, [player, tiles]);

    // Render the dungeon (simplified for this example)
    return (
        <div className="dungeon-container">
            {tiles.map((row, y) => (
                <div key={y} style={{ display: "flex" }}>
                    {row.map((tile, x) => (
                        <div
                            key={x}
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: 
                                !tile.content.player ? 
                                    !tile.active ? 
                                        tile.revealed
                                            ? tile.type === "wall"
                                                    ? "grey"
                                                    : "white"
                                                : "black"
                                            : "red"
                                        : "blue",
                                border: !tile.active ? "1px solid black" : "1px solid red",
                            }} 
                            onClick={() => {
                                setActiveTile({x, y});
                                showAvailableMoves(x, y, player);
                                // movePlayer(x - player.position.x, y - player.position.y, tiles);
                            }}         

                        >
                            <p
                                style={{
                                }}
                            >{tile.content.player? "P" : null}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Dungeon;
