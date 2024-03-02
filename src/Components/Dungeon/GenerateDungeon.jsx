import React, { useState, useEffect } from "react";
import "./Dungeon.css";

const initialDungeonSize = { width: 10, height: 10 };

const generateDungeon = (size) => {
    const tiles = [];

    for (let y = 0; y < size.height; y++) {
        const row = [];
        for (let x = 0; x < size.width; x++) {
            // Example tile setup, customize as needed
            const floorOrWall = (Math.random() > 0.85 || (x === 0 || y === 0 || x === size.width-1 || y === size.height-1))? "wall" : "floor";
            row.push({
                revealed: false, // Initially, no tiles are revealed
                type: floorOrWall, // Randomly assign type for simplicity
                content: null, // Initially, tiles don't contain anything
            });

        }
        tiles.push(row);
    }
    // Optionally set the player's starting position and reveal surrounding tiles here

    return tiles;
};

const Dungeon = () => {
    const [tiles, setTiles] = useState([]);

    useEffect(() => {
        // Generate the initial dungeon layout when the component mounts
        setTiles(generateDungeon(initialDungeonSize));
    }, []);

    // Function to handle revealing tiles, updating their 'revealed' property
    const revealTile = (x, y) => {
        setTiles((prevTiles) => {
            const newTiles = [...prevTiles];
            if (newTiles[y] && newTiles[y][x]) {
                newTiles[y][x] = { ...newTiles[y][x], revealed: true };
            }
            return newTiles;
        });
    };

    // Render the dungeon (simplified for this example)
    return (
        <div className="dungeon-container">
            {tiles.map((row, y) => (
                <div key={y} style={{ display: "flex" }}>
                    {row.map((tile, x) => (
                        <div
                            key={x}
                            style={{
                                width: "40px",
                                height: "40px",
                                border: "1px solid black",
                                backgroundColor: tile.revealed
                                    ? tile.type === "wall"
                                        ? "grey"
                                        : "white"
                                    : "black",
                            }}
                            onClick={() => revealTile(x, y)} // Example interaction to reveal tiles
                        >
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Dungeon;
