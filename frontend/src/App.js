import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const App = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/processed_data/")
            .then(response => {
                console.log("Fetched Data:", response.data);
                const { stress, sleep, occurrences } = response.data.data.sleep_stress;
                
                const formattedData = stress.map((stressLevel, index) => ({
                    stress: stressLevel,
                    sleep: sleep[index],
                    occurrences: occurrences[index]
                }));
                console.log("Formatted Data for Chart:", formattedData);

                setChartData(formattedData);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div style={{ width: "100%", height: "500px", textAlign: "center", marginTop: "50px" }}>
            <h2>Correlation between Sleep Duration and Stress Levels</h2>
            <ResponsiveContainer width="80%" height="100%">
                <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stress" type="category" />
                    <Tooltip />
                    <Bar 
                        dataKey="sleep" 
                        fill="#8884d8" 
                        barSize={40} 
                        name="Sleep Duration"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default App;
