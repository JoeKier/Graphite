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
        width: "80%",
        height: "400px",
        textAlign: "center",
        marginTop: "50px",
        marginLeft: "100px",
      }}
    >
      <h2>Correlation between Sleep Duration and Stress Levels</h2>
      <ResponsiveContainer width="60%" height="100%">
        <BarChart data={chartData} layout="horizontal">
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
          <Tooltip />
          <Bar dataKey="sleep" barSize={40} name="Sleep Duration" fill="blue">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`rgba(136, 132, 216, ${Math.min(
                  entry.occurrences / 10, 1
                )})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default App;
