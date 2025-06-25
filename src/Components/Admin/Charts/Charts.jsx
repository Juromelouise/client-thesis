import React from "react";
import { Card } from "@heroui/react";
import apiClient from "../../../utils/apiClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

const getMonthName = (monthNum) => {
  if (!monthNum) return "";
  const date = new Date();
  date.setMonth(monthNum - 1);
  return date.toLocaleString("default", { month: "long" });
};

export default function Charts() {
  const [topReporter, setTopReporter] = React.useState([]);
  const [monthlyViolations, setMonthlyViolations] = React.useState([]);

  const fetchData = async () => {
    try {
      const response = await apiClient.get("/chart/admin/reports/chart/monthly/violations");
      const response1 = await apiClient.get("/chart/admin/reports/chart/top-reporter");
      setMonthlyViolations(Array.isArray(response.data) ? response.data : []);
      setTopReporter(Array.isArray(response1.data) ? response1.data : []);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setMonthlyViolations([]);
      setTopReporter([]);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Prepare data for BarChart (Monthly Violations)
  const barData = monthlyViolations.map((month) => {
    const entry = { month: typeof month._id === "number" ? getMonthName(month._id) : month._id };
    month.statuses.forEach((status) => {
      entry[status.status] = status.count;
    });
    return entry;
  });

  // Prepare data for PieChart (Top Reporters)
  const pieData = topReporter.map((reporter) => ({
    name: reporter.name,
    value: reporter.count,
  }));

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Reporters Pie Chart */}
        <Card className="bg-white/90 dark:bg-default-900 rounded-2xl shadow-xl p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow">
          <h3 className="text-2xl font-bold mb-6 text-primary-700 tracking-tight">Top Reporters</h3>
          {pieData.length > 0 ? (
            <div className="flex flex-col items-center justify-center gap-6">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <ul className="w-full mt-2 divide-y divide-default-200 bg-default-50 rounded-lg shadow-inner">
                {pieData.map((reporter, idx) => (
                  <li key={idx} className="flex justify-between py-2 px-4 items-center">
                    <span className="font-medium text-default-700">{reporter.name}</span>
                    <span className="font-mono text-default-500">{reporter.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 text-center text-default-500">No data available</div>
          )}
        </Card>

        {/* Monthly Violations Bar Chart */}
        <Card className="bg-white/90 dark:bg-default-900 rounded-2xl shadow-xl p-8 flex flex-col justify-between hover:shadow-2xl transition-shadow">
          <h3 className="text-2xl font-bold mb-6 text-primary-700 tracking-tight">Monthly Violations by Status</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} barGap={12}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 15, fill: "#555" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 15, fill: "#555" }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                {monthlyViolations[0]?.statuses.map((status, idx) => (
                  <Bar
                    key={status.status}
                    dataKey={status.status}
                    fill={COLORS[idx % COLORS.length]}
                    name={status.status}
                    radius={[8, 8, 0, 0]}
                    barSize={36}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="p-4 text-center text-default-500">No data available</div>
          )}
        </Card>
      </div>
    </div>
  );
}