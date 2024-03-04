import React, { useState, useEffect } from "react";
import "./Dungeon.css";

const initialDungeonSize = { width: 20, height: 20 };

const generateDungeon = (size, playerPosition) => {
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

function Dungeon({playerState, movePlayer}) {
    const [tiles, setTiles] = useState([]);
    const [activeTile, setActiveTile] = useState({x: null, y: null});
    const [player, setPlayer] = useState(playerState);



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



    const selectPlayer = (x, y) => {
        console.log("Player selected at: ", x, y);
        console.log("Player position: ", playerState.position);
        console.log("Active tile: ", activeTile);
        // activate tile player is one and deactivate the rest, if present
        if (activeTile.x === null && activeTile.y === null && playerState.position.x === x && playerState.position.y === y) {
            setTiles((prevTiles) => {
                const newTiles = [...prevTiles];
                for (let i = 0; i < newTiles.length; i++) {
                    for (let j = 0; j < newTiles[i].length; j++) {
                        newTiles[i][j] = { ...newTiles[i][j], active: false };
                    }
                }
                newTiles[y][x] = { ...newTiles[y][x], active: true };
                return newTiles;
            });
            setActiveTile({x: x, y: y});
        } else if (activeTile.x === x || activeTile.y === y) {
            setTiles((prevTiles) => {
                const newTiles = [...prevTiles];
                for (let i = 0; i < newTiles.length; i++) {
                    for (let j = 0; j < newTiles[i].length; j++) {
                        newTiles[i][j] = { ...newTiles[i][j], active: false };
                    }
                }
                newTiles[y][x] = { ...newTiles[y][x], active: false };
                return newTiles;
            });
            setActiveTile({x: null, y: null});
        } else if ((activeTile.x !== x || activeTile.y !== y) && playerState.position.x !== x && playerState.position.y !== y) {
            // move player
            movePlayer(x - playerState.position.x, y - playerState.position.y);
            // setTiles((prevTiles) => {
            //     const newTiles = [...prevTiles];
            //     for (let i = 0; i < newTiles.length; i++) {
            //         for (let j = 0; j < newTiles[i].length; j++) {
            //             newTiles[i][j] = { ...newTiles[i][j], active: false };
            //         }
            //     }
            //     newTiles[y][x] = { ...newTiles[y][x], active: true };
            //     return newTiles;
            // });
            setActiveTile({x: x, y: y});
            console.log('Attempt to move player');
        }
    }

    useEffect(() => {
        const revealTilesToPlayer = (x, y) => { 
            setTiles((prevTiles) => {
                const newTiles = [...prevTiles];
                for (let i = -playerState.vision; i <= playerState.vision; i++) {
                    for (let j = -playerState.vision; j <= playerState.vision; j++) {
                        if (newTiles[y + i] && newTiles[y + i][x + j] && Math.abs(i) + Math.abs(j) <= playerState.vision + 1) {
                            newTiles[y + i][x + j] = { ...newTiles[y + i][x + j], revealed: true };
                        }
                    }
                }
                return newTiles;
            });
        };

        // Generate the initial dungeon layout when the component mounts
        if (tiles.length === 0) {
            setTiles(generateDungeon(initialDungeonSize, playerState.position));
            revealTilesToPlayer(playerState.position.x, playerState.position.y);
        }

    }, [playerState.position, activeTile.y, activeTile.x, tiles.length, playerState.vision, playerState.position.x, playerState.position.y, playerState]);

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
                                backgroundColor: !tile.active ? tile.revealed
                                    ? tile.type === "wall"
                                        ? "grey"
                                        : "white"
                                    : "black"
                                    : "red",
                                border: !tile.active ? "1px solid black" : "1px solid red",

                            }}
                            // onClick={() => revealTile(x, y)} // Example interaction to reveal tiles
                            onClick={() => selectPlayer(x, y)} // Example interaction to reveal tiles                           

                        >
                            <p
                                style={{
                                    visibility: tile.revealed ? "visible" : "hidden",
                                    margin: 0,
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
