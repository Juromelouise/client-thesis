import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FiAlertCircle, FiCalendar, FiUser } from "react-icons/fi";
import apiClient from "../../../utils/apiClient";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A4DE6C", "#D0ED57", "#8884D8", "#82CA9D"
];

export default function Charts() {
  const [totalReports, setTotalReports] = useState(0);
  const [topReporters, setTopReporters] = useState([]);
  const [activeMonths, setActiveMonths] = useState(0);
  const [monthlyViolations, setMonthlyViolations] = useState([]);
  const [timeOfDayData, setTimeOfDayData] = useState([]);
  const [reportTypeData, setReportTypeData] = useState([]);

  useEffect(() => {
    apiClient.get("/chart/admin/reports/chart/top-reporter")
      .then(res => {
        console.log("Top Reporters:", res.data);
        setTopReporters(res.data || []);
      });

    apiClient.get("/chart/admin/reports/chart/monthly/violations")
      .then(res => {
        const months = [
          "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const chartData = res.data.map((item) => {
          const obj = { month: months[item._id] };
          item.statuses.forEach(s => {
            obj[s.status] = s.count;
          });
          return obj;
        });
        setMonthlyViolations(chartData);

        // Calculate active months
        setActiveMonths(chartData.length);

        // Calculate total reports
        let total = 0;
        chartData.forEach(row => {
          Object.keys(row).forEach(key => {
            if (key !== "month") total += row[key];
          });
        });
        setTotalReports(total);
      });

    // Fetch time of day data
    apiClient.get("/chart/admin/reports/chart/time-of-day")
      .then(res => {
        setTimeOfDayData(res.data);
      });

    // Fetch report type data
    apiClient.get("/chart/admin/reports/chart/report-types")
      .then(res => {
        setReportTypeData(res.data);
      });
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Reports</h3>
              <p className="text-3xl font-bold mt-1">{totalReports}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <FiAlertCircle className="text-indigo-600 text-xl" />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500">Top Reporters</h4>
            <p className="text-xl font-semibold mt-1">{topReporters.length}</p>
          </div>
        </Card>

        <Card className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Monthly Activity</h3>
              <p className="text-3xl font-bold mt-1">{activeMonths} months</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <FiCalendar className="text-amber-600 text-xl" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Reports by Time of Day</h3>
          <div className="h-96"> {/* Increased height to accommodate more time slots */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timeOfDayData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => [`${value} reports`, 'Count']} />
                <Legend />
                <Bar dataKey="value" name="Reports" fill="#8884d8">
                  {timeOfDayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Report Types</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} reports`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Top Reporters</h3>
          <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
            {totalReports} total
          </div>
        </div>
        <div className="space-y-4">
          {topReporters.map((reporter, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <FiUser className="text-indigo-600" />
                </div>
                <span className="font-medium text-gray-800">{reporter.name}</span>
              </div>
              <span className="font-semibold text-gray-900">{reporter.count}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Violations</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyViolations}>
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Legend />
              {/* Dynamically render bars for each status */}
              {monthlyViolations.length > 0 &&
                Object.keys(monthlyViolations[0])
                  .filter(key => key !== "month")
                  .map((status, idx) => (
                    <Bar
                      key={status}
                      dataKey={status}
                      fill={["#10B981", "#F59E0B", "#EF4444", "#6366F1"][idx % 4]}
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    />
                  ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}