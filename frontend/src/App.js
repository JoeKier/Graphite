import React, { useEffect, useState } from "react";
import axios from "axios";
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
          border: "1px solid #ccc",
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

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/processed_data/")
      .then((response) => {
        console.log("Fetched Data:", response.data);
        const { stress, sleep, occurrences } = response.data.data.sleep_stress;

        const formattedData = stress.map((stressLevel, index) => ({
          stress: stressLevel,
          sleep: sleep[index],
          occurrences: occurrences[index],
        }));
        console.log("Formatted Data for Chart:", formattedData);

        setChartData(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Correlation between Sleep Duration and Stress Levels
      </h2>
      <div
        style={{
          width: "80vw", // Control width
          height: "60vh", // Control height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto", // Ensure centering
          backgroundColor: "#f9f9f9", // Just for visualization
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
            <XAxis dataKey="stress" type="category">
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
                const minColor = [50, 50, 150]; // Dark blue
                const maxColor = [180, 180, 255]; // Bright blue
                const factor = Math.min(entry.occurrences / 10, 1); // Scale between 0 and 1

                const interpolatedColor = minColor.map((min, i) =>
                  Math.round(min + factor * (maxColor[i] - min))
                );

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgb(${interpolatedColor.join(",")})`} // No transparency
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 

export default App;
