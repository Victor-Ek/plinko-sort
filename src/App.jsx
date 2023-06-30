import "./App.css";

import React, { Fragment, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { Physics, useBox, useSphere, useCylinder } from "@react-three/cannon";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";

// add names here that should compete against eachother
const names = ["Mikl", "Victor", "aioli", "NIls", "MOa", "Alipanter", "Emma"];

/**
 * resultat
 * 1st: aioli
 * 2nd: NIls
 * 3:Rd: MOa
 * 4fthth: Victor
 * 5Ltjht: Alipanter
 * 6: Mkl
 * 7: Emma
 */
const pegs = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12];
const rows = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

function Peg(props) {
  const [ref] = useCylinder(() => ({
    ...props,
    collisionResponse: 0.1,
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <cylinderBufferGeometry {...props} castShadow receiveShadow />
      <meshBasicMaterial />
    </mesh>
  );
}

function Floor(props) {
  const [ref] = useBox(() => ({ ...props }));
  return (
    <mesh ref={ref} name="floor" receiveShadow>
      <boxBufferGeometry {...props} castShadow receiveShadow />
      <meshNormalMaterial />
    </mesh>
  );
}

function Sphere(props) {
  const [ref] = useSphere(() => ({
    mass: 1,
    position: [20, 35, 0],
    ...props,
  }));
  return (
    <mesh ref={ref} name={props.name} castShadow receiveShadow>
      <sphereBufferGeometry {...props}></sphereBufferGeometry>
      <meshStandardMaterial
        color={
          CSS_COLOR_NAMES[
            Math.floor(Math.random() * CSS_COLOR_NAMES.length - 1)
          ]
        }
      />
      <Html>
        <span>{props.name}</span>
      </Html>
    </mesh>
  );
}

function Wall(props) {
  const [ref] = useBox(() => ({ ...props }));
  return (
    <mesh ref={ref} name="floor" castShadow receiveShadow>
      <boxBufferGeometry {...props} castShadow receiveShadow />
      <meshNormalMaterial />
    </mesh>
  );
}

const ranomizedNames = shuffle(names);

const SpawnPlayers = React.memo(({ players }) => {
  const offsetX = players.length * 5;
  return shuffle(players).map((player, i) => (
    <Sphere
      name={player}
      args={[2, 32]}
      position={[i * 10 - offsetX, 200, 0]}
    />
  ));
});

function App() {
  const [winner, setWinner] = useState("");
  const [gravity, setGravity] = useState(0);
  const [newPlayer, setNewPlayer] = useState("");
  const [players, setPlayers] = useState([]);

  const handleReset = () => {
    setPlayers((prev) => prev.filter((player) => player !== winner));
    setWinner("");
  };

  return (
    <Canvas shadows>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 400]}
        rotation={[0, 0, 0]}
      />
      <OrbitControls />
      <ambientLight intensity={0.1} />
      <directionalLight castShadow position={[2.5, 8, 5]} intensity={1} />

      <Html>
        <div style={{ backgroundColor: "hotpink" }}>
          <h1>{winner}</h1>
        </div>
      </Html>

      <Html position={[40, 250, 0]}>
        <input onChange={(e) => setNewPlayer(e.target.value)} type="text" />
        <button
          type="button"
          onClick={() => setPlayers((prev) => [...prev, newPlayer])}
        >
          Add player
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="0"
          onChange={(e) => setGravity(-e.target.value)}
        />
      </Html>

      <Physics gravity={[0, gravity, 0]}>
        <GeneratePegs />
        <SpawnPlayers players={players} />
        <Floor
          args={[130, 5, 100]}
          position={[0, -50, 0]}
          onCollide={(e) =>
            setWinner((prev) =>
              prev.includes(e.body.name) ? prev : [...prev, e.body.name]
            )
          }
        />
        {/* TODO: add invisible walls so that no one cheats! */}
        {/* Right side walls */}
        <Wall
          position={[95, 0, 0]}
          rotation={[0, 0, Math.PI / 6]}
          args={[80, 4, 60]}
        />
        <Wall
          position={[95, 40, 0]}
          rotation={[0, 0, Math.PI / 6]}
          args={[80, 4, 60]}
        />
        <Wall
          position={[95, 80, 0]}
          rotation={[0, 0, Math.PI / 6]}
          args={[80, 4, 60]}
        />
        <Wall
          position={[95, 120, 0]}
          rotation={[0, 0, Math.PI / 6]}
          args={[80, 4, 60]}
        />
        <Wall
          position={[95, 160, 0]}
          rotation={[0, 0, Math.PI / 6]}
          args={[80, 4, 60]}
        />
        <Wall
          position={[95, 200, 0]}
          rotation={[0, 0, Math.PI / 6]}
          args={[80, 4, 60]}
        />

        {/* Left side walls */}
        <Wall
          position={[-95, 0, 0]}
          rotation={[0, 0, -Math.PI / 6]}
          args={[80, 4, 60]}
        />
        <Wall
          position={[-95, 40, 0]}
          rotation={[0, 0, -Math.PI / 6]}
          args={[80, 4, 60]}
        />
        <Wall
          position={[-95, 80, 0]}
          rotation={[0, 0, -Math.PI / 6]}
          args={[80, 4, 60]}
        />
        <Wall
          position={[-95, 120, 0]}
          rotation={[0, 0, -Math.PI / 6]}
          args={[80, 4, 60]}
        />
        <Wall
          position={[-95, 160, 0]}
          rotation={[0, 0, -Math.PI / 6]}
          args={[80, 4, 60]}
        />
        <Wall
          position={[-95, 200, 0]}
          rotation={[0, 0, -Math.PI / 6]}
          args={[80, 4, 60]}
        />
      </Physics>
    </Canvas>
  );
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const thiccnessess = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5];
const ranomizedThiccnessess = shuffle(thiccnessess);
function GeneratePegs() {
  return (
    <Fragment>
      {rows.map((row, y) => {
        return (
          <Fragment key={"row" + y}>
            {pegs.map((peg, x) => {
              const offsetX = y % 2 === 0 ? 2.5 : -2.5;
              const offsetXtra = (pegs.length * 9) / 2;
              const thiccnessIndex = Math.floor(
                Math.random() * thiccnessess.length - 1
              );
              return (
                <Peg
                  key={"peg" + x}
                  args={[
                    thiccnessess[thiccnessIndex],
                    ranomizedThiccnessess[thiccnessIndex],
                    10,
                    42,
                  ]}
                  rotation={[0, -Math.PI / 2, -Math.PI / 2]}
                  position={[x * 10 + offsetX - offsetXtra, y * 10, 0]}
                />
              );
            })}
          </Fragment>
        );
      })}
    </Fragment>
  );
}

export default App;

const CSS_COLOR_NAMES = [
  "AliceBlue",
  "AntiqueWhite",
  "Aqua",
  "Aquamarine",
  "Azure",
  "Beige",
  "Bisque",
  "Black",
  "BlanchedAlmond",
  "Blue",
  "BlueViolet",
  "Brown",
  "BurlyWood",
  "CadetBlue",
  "Chartreuse",
  "Chocolate",
  "Coral",
  "CornflowerBlue",
  "Cornsilk",
  "Crimson",
  "Cyan",
  "DarkBlue",
  "DarkCyan",
  "DarkGoldenRod",
  "DarkGray",
  "DarkGrey",
  "DarkGreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkSlateGrey",
  "DarkTurquoise",
  "DarkViolet",
  "DeepPink",
  "DeepSkyBlue",
  "DimGray",
  "DimGrey",
  "DodgerBlue",
  "FireBrick",
  "FloralWhite",
  "ForestGreen",
  "Fuchsia",
  "Gainsboro",
  "GhostWhite",
  "Gold",
  "GoldenRod",
  "Gray",
  "Grey",
  "Green",
  "GreenYellow",
  "HoneyDew",
  "HotPink",
  "IndianRed",
  "Indigo",
  "Ivory",
  "Khaki",
  "Lavender",
  "LavenderBlush",
  "LawnGreen",
  "LemonChiffon",
  "LightBlue",
  "LightCoral",
  "LightCyan",
  "LightGoldenRodYellow",
  "LightGray",
  "LightGrey",
  "LightGreen",
  "LightPink",
  "LightSalmon",
  "LightSeaGreen",
  "LightSkyBlue",
  "LightSlateGray",
  "LightSlateGrey",
  "LightSteelBlue",
  "LightYellow",
  "Lime",
  "LimeGreen",
  "Linen",
  "Magenta",
  "Maroon",
  "MediumAquaMarine",
  "MediumBlue",
  "MediumOrchid",
  "MediumPurple",
  "MediumSeaGreen",
  "MediumSlateBlue",
  "MediumSpringGreen",
  "MediumTurquoise",
  "MediumVioletRed",
  "MidnightBlue",
  "MintCream",
  "MistyRose",
  "Moccasin",
  "NavajoWhite",
  "Navy",
  "OldLace",
  "Olive",
  "OliveDrab",
  "Orange",
  "OrangeRed",
  "Orchid",
  "PaleGoldenRod",
  "PaleGreen",
  "PaleTurquoise",
  "PaleVioletRed",
  "PapayaWhip",
  "PeachPuff",
  "Peru",
  "Pink",
  "Plum",
  "PowderBlue",
  "Purple",
  "RebeccaPurple",
  "Red",
  "RosyBrown",
  "RoyalBlue",
  "SaddleBrown",
  "Salmon",
  "SandyBrown",
  "SeaGreen",
  "SeaShell",
  "Sienna",
  "Silver",
  "SkyBlue",
  "SlateBlue",
  "SlateGray",
  "SlateGrey",
  "Snow",
  "SpringGreen",
  "SteelBlue",
  "Tan",
  "Teal",
  "Thistle",
  "Tomato",
  "Turquoise",
  "Violet",
  "Wheat",
  "White",
  "WhiteSmoke",
  "Yellow",
  "YellowGreen",
];
