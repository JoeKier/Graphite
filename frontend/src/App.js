import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Label,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "10px",
          border: "2px solid #ccc",
          borderRadius: "5px",
          textAlign: "left",
        }}
      >
        <p>
          <strong>Stress Level:</strong> {payload[0].payload.stress}
        </p>
        <p>
          <strong>Sleep Duration:</strong> {payload[0].payload.sleep} hours
        </p>
        <p>
          <strong>Occurrences:</strong> {payload[0].payload.occurrences}
        </p>
      </div>
    );
  }
  return null;
};

const App = () => {
  const [chartData, setChartData] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  


  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/processed_data/")
      .then((response) => {
        console.log("Fetched Data:", response.data);
        const { stress, sleep, occurrences } = response.data.data.sleep_stress;

        // Group data by stress level
        const groupedData = {};

        stress.forEach((stressLevel, index) => {
          if (!groupedData[stressLevel]) {
            groupedData[stressLevel] = [];
          }
          groupedData[stressLevel].push({
            stress: stressLevel,
            sleep: sleep[index],
            occurrences: occurrences[index],
          });
        });

        // Flatten grouped data into array
        const formattedData = Object.values(groupedData).flat();
        console.log("Formatted Data for Grouped Histogram:", formattedData);

        setChartData(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Function to determine color based on stress level
  const getBaseColor = (stressLevel) => {
    if (stressLevel <= 3) return [0, 200, 255]; // Blue  [0, 105, 205]
    if (stressLevel <= 4) return [0, 155, 255]; // Green [100, 205, 0]
    if (stressLevel <= 5) return [0, 95, 255]; // Yellow [255, 205, 50]
    if (stressLevel <= 6) return [0, 55, 255]; // Orange [230, 125, 50]
    if (stressLevel <= 7) return [0, 35, 200]; // Red [210, 50, 50]
    return [0, 5, 155]; // Purple  [205, 0, 105]
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Centers vertically
        alignItems: "center", // Centers horizontally
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        textAlign: "center", // Ensures text is centered
        backgroundColor: "#94AFC6",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          backgroundColor: "#ECF1F3",
          padding: "10px",
          borderRadius: "5px",
          fontFamily: "'Helvetica', sans-serif",
          color: "#1E466E"
        }}
      >
        Correlation between Sleep Duration and Stress Levels
      </h2>
      <div
        style={{
          width: "80vw",
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto", // Ensure centering
          backgroundColor: "#ECF1F3",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="stress"
              type="category"
              tickFormatter={(value, index) => {
                // Only display the label for the first occurrence of each stress level
                return index === 0 || chartData[index - 1].stress !== value
                  ? value
                  : "";
              }}
            >
              <Label value="Stress Level" position="bottom" />
            </XAxis>
            <YAxis dataKey="sleep" type="number">
              <Label
                value="Sleep Duration [hours]"
                position="left"
                angle={-90}
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sleep" barSize={40} name="Sleep Duration" fill="blue">
              {chartData.map((entry, index) => {
                const baseColor = getBaseColor(entry.stress);
                const brightnessFactor = Math.min(entry.occurrences / 20, 1);
                const adjustedColor = baseColor.map((color) =>
                  Math.round(color + (255 - color) * (1 - Math.max(brightnessFactor, 0.25)))
                );
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgb(${adjustedColor.join(",")})`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button
        onClick={() => setShowInfo((prev) => !prev)}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span>{showInfo ? "Hide Info" : "Show Info"}</span>
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: showInfo ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: "inline-block" }}
        >
          ℹ️
        </motion.span>
      </button>

      <AnimatePresence>
        {showInfo && (
          <motion.div
          key="info-box"
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            overflow: "hidden",
            marginTop: "10px",
            width: "80%",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            color: "#333",
            textAlign: "left",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p>
              <strong>Data Source:</strong> Laksika Tharmalingam 'Sleep Health and Lifestyle Dataset', Kaggle.com
            </p>
            <p>
              <strong>Insight:</strong> Each bar shows the sleep duration for a given stress level.
              The color hue corresponds to the stress level, while its brightness scales with observation frequency.

              It is noticeable how higher stress levels correspond to shorter sleep.
              Not resting adequately may push us further on edge,
              while anxiety also makes it harder to fall asleep.
              Truly a vicious circle.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
