import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState, useEffect } from "react";
import { PieChart, BarChart, LineChart } from "../../component/Chart";
import { supabase } from "../../supabaseClient";
import "../../css/chart.css"

Chart.register(CategoryScale);

export default function App() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Users Gained ",
        data: [],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    // Fetch data from Supabase
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("inventory")
          .select("name, quantity, status")

        if (error) {
          console.error("Error fetching data:", error.message);
          return;
        }
        
        // Process the data to update chartData
        const labels = data.map((item) => item.name);
        const quantities = data.map((item) => item.quantity);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Quantity",
              data: quantities,
              backgroundColor: data.map((item) =>
                item.status === "In Stock" ? "green" : "red"
              ),
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="chart">
      <div className="chart-display">
        <PieChart chartData={chartData} className="chart-component" />
        <BarChart chartData={chartData} className="chart-component" />
        <LineChart chartData={chartData} className="chart-component" />
      </div>
    </div>
  );
}
