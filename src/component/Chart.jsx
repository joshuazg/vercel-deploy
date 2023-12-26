import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import "../css/chart.css"

export const PieChart = ({ chartData }) => {
    return (
        <div className="chart-container">
            <h2 className="chart-title">Pie Chart</h2>
            <Pie
                className="chart-content"
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Users Gained between 2016-2020"
                        }
                    }
                }}
            />
        </div>
    );
}

export const BarChart = ({ chartData }) => {
    return (
        <div className="chart-container">
            <h2 className="chart-title">Bar Chart</h2>
            <Bar
                className="chart-content"
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Users Gained between 2016-2020"
                        },
                        legend: {
                            display: false
                        }
                    }
                }}
            />
        </div>
    );
};

export const LineChart = ({ chartData }) => {
    return (
        <div className="chart-container">
            <h2 className="chart-title">Line Chart</h2>
            <Line
                className="chart-content"
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Quantity 2016-2020"
                        },
                        legend: {
                            display: false
                        }
                    }
                }}
            />
        </div>
    );
}