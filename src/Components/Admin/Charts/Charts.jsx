import { useEffect, useState, useRef } from "react";
import {
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
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
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFChart from "../../../utils/PDFChart";
import { toPng } from "html-to-image";
import { HiChevronDown } from "react-icons/hi";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A4DE6C",
  "#D0ED57",
  "#8884D8",
  "#82CA9D",
];

const months = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Charts() {
  const [totalReports, setTotalReports] = useState(0);
  const [topReporters, setTopReporters] = useState([]);
  const [activeMonths, setActiveMonths] = useState(0);
  const [monthlyViolations, setMonthlyViolations] = useState([]);
  const [timeOfDayData, setTimeOfDayData] = useState([]);
  const [reportTypeData, setReportTypeData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [quarterlyData, setQuarterlyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [years, setYears] = useState([]);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isQuarterModalOpen, setIsQuarterModalOpen] = useState(false);
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [chartImage, setChartImage] = useState(null);
  const [timePeriod, setTimePeriod] = useState("monthly");
  const chartRef = useRef();

  useEffect(() => {
    apiClient.get("/chart/admin/reports/chart/top-reporter").then((res) => {
      console.log("Top Reporters:", res.data);
      setTopReporters(res.data || []);
    });

    apiClient
      .get("/chart/admin/reports/chart/monthly/violations")
      .then((res) => {
        const months = [
          "",
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const chartData = res.data.map((item) => {
          const obj = { month: months[item._id] };
          item.statuses.forEach((s) => {
            obj[s.status] = s.count;
          });
          return obj;
        });
        setMonthlyViolations(chartData);

        // Calculate active months
        setActiveMonths(chartData.length);

        // Calculate total reports
        let total = 0;
        chartData.forEach((row) => {
          Object.keys(row).forEach((key) => {
            if (key !== "month") total += row[key];
          });
        });
        setTotalReports(total);
      });

    // Fetch time of day data
    apiClient.get("/chart/admin/reports/chart/time-of-day").then((res) => {
      setTimeOfDayData(res.data);
    });

    // Fetch report type data
    apiClient.get("/chart/admin/reports/chart/report-types").then((res) => {
      setReportTypeData(res.data);
    });

    // Fetch report data for PDFs
    apiClient
      .get("/chart/admin/reports/chart/yearly-violations")
      .then((res) => setYearlyData(res.data || []));

    apiClient
      .get("/chart/admin/reports/chart/years")
      .then((res) => setYears(res.data || []));

    apiClient
      .get("/chart/admin/reports/chart/quarterly-violations")
      .then((res) => setQuarterlyData(res.data || []));
  }, []);

  const captureChart = async () => {
    if (chartRef.current) {
      const dataUrl = await toPng(chartRef.current);
      setChartImage(dataUrl);
      return dataUrl;
    }
    return null;
  };

  const handleYearlyDownload = async () => {
    await captureChart();
    setIsYearModalOpen(true);
  };

  const handleQuarterlyDownload = async () => {
    await captureChart();
    setIsQuarterModalOpen(true);
  };

  const handleMonthlyDownload = async () => {
    await captureChart();
    setIsMonthModalOpen(true);
  };

  const YearSelectionModal = () => (
    <Modal isOpen={isYearModalOpen} onClose={() => setIsYearModalOpen(false)}>
      <ModalContent>
        <ModalHeader>Select Year</ModalHeader>
        <ModalBody>
          <Dropdown>
            <DropdownTrigger>
              <Button>{selectedYear}</Button>
            </DropdownTrigger>
            <DropdownMenu>
              {years.map((year) => (
                <DropdownItem key={year} onClick={() => setSelectedYear(year)}>
                  {year}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </ModalBody>
        <ModalFooter>
          <Button onPress={() => setIsYearModalOpen(false)}>Cancel</Button>
          <PDFDownloadLink
            document={
              <PDFChart
                data={yearlyData.filter((item) => item.year === selectedYear)}
                type="yearly"
                chartImage={chartImage}
              />
            }
            fileName={`yearly_report_${selectedYear}.pdf`}
          >
            {({ loading }) => (
              <Button>{loading ? "Generating..." : "Download"}</Button>
            )}
          </PDFDownloadLink>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const QuarterSelectionModal = () => {
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
      const data = quarterlyData.filter((item) => item.year === selectedYear);
      setFilteredData(data);
    }, [selectedYear, quarterlyData]);

    return (
      <Modal
        isOpen={isQuarterModalOpen}
        onClose={() => setIsQuarterModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Select Quarter</ModalHeader>
          <ModalBody>
            <Dropdown>
              <DropdownTrigger>
                <Button>
                  Q{selectedQuarter} {selectedYear}
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {[1, 2, 3, 4].map((quarter) => (
                  <DropdownItem
                    key={quarter}
                    onClick={() => setSelectedQuarter(quarter)}
                  >
                    Q{quarter} {selectedYear}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger>
                <Button>{selectedYear}</Button>
              </DropdownTrigger>
              <DropdownMenu>
                {years.map((year) => (
                  <DropdownItem
                    key={year}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setIsQuarterModalOpen(false)}>Cancel</Button>
            <PDFDownloadLink
              document={
                <PDFChart
                  data={filteredData.filter(
                    (item) => item.quarter === selectedQuarter
                  )}
                  type="quarterly"
                  chartImage={chartImage}
                />
              }
              fileName={`quarterly_report_Q${selectedQuarter}_${selectedYear}.pdf`}
            >
              {({ loading }) => (
                <Button>{loading ? "Generating..." : "Download"}</Button>
              )}
            </PDFDownloadLink>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  // Update your MonthSelectionModal component
  const MonthSelectionModal = () => {
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
      const data = monthlyViolations.map((item) => ({
        month: months.indexOf(item.month),
        year: selectedYear,
        reportCount: Object.values(item).reduce(
          (sum, val) => (typeof val === "number" ? sum + val : sum),
          0
        ),
        obstructionCount: 0, // You'll need to modify your backend to include obstructions
        total: Object.values(item).reduce(
          // Add this line
          (sum, val) => (typeof val === "number" ? sum + val : sum),
          0
        ),
      }));
      setFilteredData(data);
    }, [selectedYear, monthlyViolations]);

    return (
      <Modal
        isOpen={isMonthModalOpen}
        onClose={() => setIsMonthModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Select Month</ModalHeader>
          <ModalBody>
            <Dropdown>
              <DropdownTrigger>
                <Button>
                  {new Date(selectedYear, selectedMonth - 1).toLocaleString(
                    "default",
                    { month: "long" }
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                  <DropdownItem
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                  >
                    {new Date(selectedYear, month - 1).toLocaleString(
                      "default",
                      {
                        month: "long",
                      }
                    )}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger>
                <Button>{selectedYear}</Button>
              </DropdownTrigger>
              <DropdownMenu>
                {years.map((year) => (
                  <DropdownItem
                    key={year}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setIsMonthModalOpen(false)}>Cancel</Button>
            <PDFDownloadLink
              document={
                <PDFChart
                  data={filteredData.filter(
                    (item) => item.month === selectedMonth
                  )}
                  type="monthly"
                  chartImage={chartImage}
                />
              }
              fileName={`monthly_report_${selectedMonth}_${selectedYear}.pdf`}
            >
              {({ loading }) => (
                <Button>{loading ? "Generating..." : "Download"}</Button>
              )}
            </PDFDownloadLink>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  const ReportButtons = () => (
    <div className="flex justify-end mb-4 gap-2">
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        onClick={handleYearlyDownload}
      >
        Yearly Report
      </Button>

      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        onClick={handleQuarterlyDownload}
      >
        Quarterly Report
      </Button>

      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        onClick={handleMonthlyDownload}
      >
        Monthly Report
      </Button>
    </div>
  );

  const getFilteredData = () => {
    switch (timePeriod) {
      case "yearly":
        return yearlyData.map((item) => ({
          name: item.year,
          value: item.total,
        }));
      case "quarterly":
        return quarterlyData
          .filter((item) => item.year === selectedYear)
          .map((item) => ({
            name: `Q${item.quarter}`,
            value: item.total,
          }));
      case "monthly":
      default:
        return monthlyViolations.map((item) => ({
          name: item.month,
          value: Object.values(item).reduce(
            (sum, val) => (typeof val === "number" ? sum + val : sum),
            0
          ),
        }));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <ReportButtons />
      <YearSelectionModal />
      <QuarterSelectionModal />
      <MonthSelectionModal />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Total Reports
              </h3>
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
              <h3 className="text-lg font-semibold text-gray-700">
                Monthly Activity
              </h3>
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
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Reports by Time of Day
          </h3>
          <div className="h-96">
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
                <Tooltip formatter={(value) => [`${value} reports`, "Count"]} />
                <Legend />
                <Bar dataKey="value" name="Reports" fill="#8884d8">
                  {timeOfDayData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Report Types
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} reports`, "Count"]} />
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
            <div
              key={idx}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <FiUser className="text-indigo-600" />
                </div>
                <span className="font-medium text-gray-800">
                  {reporter.name}
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                {reporter.count}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {timePeriod === "yearly"
              ? "Yearly"
              : timePeriod === "quarterly"
              ? "Quarterly"
              : "Monthly"}{" "}
            Violations
          </h3>
          <div className="flex gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button className="flex items-center gap-2 bg-gray-200 text-gray-700">
                  {timePeriod === "yearly"
                    ? "Yearly"
                    : timePeriod === "quarterly"
                    ? "Quarterly"
                    : "Monthly"}
                  <HiChevronDown />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => setTimePeriod("monthly")}>
                  Monthly
                </DropdownItem>
                <DropdownItem onClick={() => setTimePeriod("quarterly")}>
                  Quarterly
                </DropdownItem>
                <DropdownItem onClick={() => setTimePeriod("yearly")}>
                  Yearly
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            {timePeriod === "quarterly" && (
              <Dropdown>
                <DropdownTrigger>
                  <Button className="flex items-center gap-2 bg-gray-200 text-gray-700">
                    {selectedYear}
                    <HiChevronDown />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {years.map((year) => (
                    <DropdownItem
                      key={year}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getFilteredData()}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`${value} violations`, "Count"]}
                labelFormatter={(label) =>
                  timePeriod === "yearly"
                    ? `Year: ${label}`
                    : timePeriod === "quarterly"
                    ? `Quarter: ${label}`
                    : `Month: ${label}`
                }
              />
              <Legend />
              <Bar
                dataKey="value"
                name="Violations"
                fill="#6366F1"
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
