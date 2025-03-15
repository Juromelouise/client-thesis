import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spinner,
  Divider,
  Textarea,
  Pagination,
  PaginationItem,
  PaginationCursor,
} from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../utils/apiClient";

function ViewPlateNumber() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [violations, setViolations] = useState("");
  const [buttonTextColor, setButtonTextColor] = useState({});

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/plate/admin/platenumbers/${id}`);
        console.log(data.data);
        setReport(data.data);
        setViolations(
          data.data.violations.map((v) => v.types.join(", ")).join("\n")
        );
        setTotalPages(data.totalPages);

        // Load button text color state from cache
        const storedButtonTextColor =
          JSON.parse(sessionStorage.getItem("buttonTextColor")) || {};
        setButtonTextColor(storedButtonTextColor);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleButtonClick = (reportId) => {
    const newButtonTextColor = {
      ...buttonTextColor,
      [reportId]: "text-red-500",
    };
    setButtonTextColor(newButtonTextColor);
    sessionStorage.setItem(
      "buttonTextColor",
      JSON.stringify(newButtonTextColor)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-lg font-semibold">
          Report not found.
        </div>
      </div>
    );
  }

  const handleViolationChange = (value) => {
    setViolations(value);
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">Plate Number Details</h2>
          <Button
            className="transition-colors duration-300 bg-blue-500 hover:bg-blue-600 text-white"
            onPress={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
        <Divider className="my-4" />
        <div className="mt-4">
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Plate Number:</p>
            <p className="text-gray-700">{report.plateNumber}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Number of Reports:</p>
            <p className="text-gray-700">{report.count}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Reports:</p>
            <div className="flex flex-wrap">
              {report.violations.map((v) => (
                <Button
                  key={v.report._id}
                  onPress={() => {
                    handleButtonClick(v.report._id);
                    navigate(`/single/report/${v.report._id}`);
                  }}
                  className={`mr-2 mb-2 ${
                    buttonTextColor[v.report._id] || "text-black"
                  }`}
                >
                  {v.report._id}
                </Button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Violations:</p>
            <div className="flex flex-wrap items-center">
              <Textarea
                isDisabled={true}
                value={violations}
                onChange={(e) => handleViolationChange(e.target.value)}
                className="mr-2 mb-2 text-sm py-1 px-2 w-full"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ViewPlateNumber;
