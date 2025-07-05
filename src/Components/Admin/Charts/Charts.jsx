import { Card } from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FiAlertCircle, FiCalendar, FiUser } from "react-icons/fi";

export default function Charts() {
  const totalReports = 5;
  const topReportersCount = 2;
  const activeMonths = 2;
  const topReporters = [
    { name: "Admin admin", count: 3 },
    { name: "Seafood Beef", count: 1 },
    { name: "Wowowin", count: 1 }
  ];
  const monthlyViolations = [
    { month: "Jan", Resolved: 4, Pending: 2 },
    { month: "Feb", Resolved: 3, Pending: 1 }
  ];

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
            <p className="text-xl font-semibold mt-1">{topReportersCount}</p>
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
              <Bar 
                dataKey="Resolved" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Bar 
                dataKey="Pending" 
                fill="#F59E0B" 
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}