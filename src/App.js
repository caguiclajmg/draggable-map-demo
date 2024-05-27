import logo from "./logo.svg";
import "./App.css";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { useState } from "react";

// add your objects here
const elements = [
  {
    name: "Japan",
    position: { x: 200, y: 200 },
    shape: {
      scale: 2,
      points: [
        [0, 50],
        [0, 25],
        [25, 25],
        [25, 0],
        [50, 0],
        [50, 50],
        [0, 50],
      ],
    },
  },
  {
    name: "USA",
    position: { x: 500, y: 400 },
    shape: {
      scale: 100,
      points: [
        [0, 1],
        [0.5, 0.5],
        [0.25, 0.5],
        [0.1, 0],
        [1, 0.3],
        [1, 0.4],
        [0.5, 0.8],
        [0.5, 1],
      ],
    },
  },
];

const Polygon = ({
  points,
  style,
  innerStyle,
  scale = 1,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const minX = Math.min(...points.map((pair) => pair[0])) * scale;
  const maxX = Math.max(...points.map((pair) => pair[0])) * scale;
  const minY = Math.min(...points.map((pair) => pair[1])) * scale;
  const maxY = Math.max(...points.map((pair) => pair[1])) * scale;

  return (
    <svg
      xmlns="http://wwww.w3.org/2000/svg"
      viewBox={`${minX} ${minY} ${maxX} ${maxY}`}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      width={maxX - minX}
      height={maxY - minY}
    >
      <g transform={`scale(${scale} ${scale})`}>
        <polygon
          points={points.map((pair) => pair.join(",")).join(" ")}
          style={innerStyle}
        />
      </g>
    </svg>
  );
};

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools">
      <button onClick={() => zoomIn()}>+</button>
      <button onClick={() => zoomOut()}>-</button>
      <button onClick={() => resetTransform()}>x</button>
    </div>
  );
};

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  return (
    <div className="App">
      <TransformWrapper initialScale={1}>
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <Controls />
            <TransformComponent>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0 }}>
                  {elements.map((element) => (
                    <Polygon
                      points={element.shape.points}
                      scale={element.shape.scale}
                      style={{
                        position: "absolute",
                        left: element.position.x,
                        top: element.position.y,
                      }}
                      innerStyle={{
                        fill: selectedCountry === element ? "#f00" : null,
                        ...(hoveredCountry === element && { fill: "#0f0" }),
                      }}
                      onClick={() => setSelectedCountry(element)}
                      onMouseEnter={() => setHoveredCountry(element)}
                      onMouseLeave={() => setHoveredCountry(null)}
                    />
                  ))}
                </div>
                <div>
                  <img src="map.png" alt="map" />
                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      <h1>Selected country is: {selectedCountry?.name || "none"}</h1>
      <h2>
        Its position is:{" "}
        {selectedCountry
          ? `${selectedCountry.position.x} ${selectedCountry.position.y}`
          : "unknown"}
      </h2>
      <h2>Hovered country is: {hoveredCountry?.name || "none"}</h2>
    </div>
  );
}

export default App;
