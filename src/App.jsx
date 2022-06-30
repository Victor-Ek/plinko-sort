import "./App.css";

import React, { Fragment, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { Physics, useBox, useSphere, useCylinder } from "@react-three/cannon";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";

// add names here that should compete against eachother
const names = [];
const pegs = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12];
const rows = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

function Peg(props) {
  const [ref] = useCylinder(() => ({ ...props }));
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <cylinderBufferGeometry {...props} castShadow receiveShadow />
      <meshNormalMaterial />
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

function SpawnPlayers() {
  const offsetX = 40;
  return ranomizedNames.map((player, i) => (
    <Sphere
      name={player}
      args={[2, 32]}
      position={[i * 10 - offsetX, 200, 0]}
    />
  ));
}

function App() {
  const [winner, setWinner] = useState("");
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

      <Physics gravity={[0, -10, 0]}>
        <GeneratePegs />
        <SpawnPlayers />
        <Floor
          args={[130, 5, 100]}
          position={[0, -50, 0]}
          onCollide={(e) =>
            setWinner((prev) => (prev === "" ? e.body.name : prev))
          }
        />
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
              return (
                <Peg
                  key={"peg" + x}
                  args={[
                    ranomizedThiccnessess[x + (y % thiccnessess.length)],
                    ranomizedThiccnessess[x + (y % thiccnessess.length)],
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
