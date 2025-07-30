import { useEffect, useState } from "react";
import { Card, Button, Spinner, Divider, Textarea } from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../utils/apiClient";
import { PDFDownloadLink } from "@react-pdf/renderer";
import NoticeLetterTemplate from "../../../utils/NoticeLetterTemplate";
import { toast } from "react-toastify";

function ViewPlateNumber() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [noticeNumber, setNoticeNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const [violations, setViolations] = useState("");
  const [buttonOpacity, setButtonOpacity] = useState({});

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/plate/admin/platenumbers/${id}`);
        console.log(data.data);
        setReport(data.data);
        setNoticeNumber(data.data.noticeNumber || 0);
        setViolations(
          data.data.violations.map((v) => v.types.join(", ")).join("\n")
        );

        // Load button opacity state from cache
        const storedButtonOpacity =
          JSON.parse(sessionStorage.getItem("buttonOpacity")) || {};
        setButtonOpacity(storedButtonOpacity);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const updateNoticeNumber = async () => {
    try {
      const { data } = await apiClient.get(
        `/plate/admin/platenumbers/update-notice-number/${id}`
      );
      setNoticeNumber(data.report.noticeNumber);
      console.log("Notice number updated:", data.report.noticeNumber);
      toast.success("Download notice number updated successfully.");
    } catch (error) {
      console.error("Error updating notice number:", error);
      toast.error("Failed to update notice number.");
    }
  };

  const handleButtonClick = (reportId) => {
    const newButtonOpacity = {
      ...buttonOpacity,
      [reportId]: 0.5,
    };
    setButtonOpacity(newButtonOpacity);
    sessionStorage.setItem("buttonOpacity", JSON.stringify(newButtonOpacity));
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

  const getButtonClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-500 text-white";
      case "Approved":
        return "bg-green-500 text-white";
      case "Disapproved":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
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
                  key={v.id}
                  onPress={() => {
                    handleButtonClick(v.id);
                    navigate(`/single/report/${v.id}`);
                  }}
                  className={`mr-2 mb-2 ${getButtonClass(v.status)}`}
                  style={{ opacity: buttonOpacity[v.id] || 1 }}
                >
                  {v.id}
                </Button>
              ))}
            </div>
          </div>

          {/* Redesigned Offense and Fine Section */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-base text-gray-600 font-medium">
                Number of Offense:
              </span>
              <span className="font-semibold text-red-600 text-lg">
                {report?.offense?.offense ? report.offense.offense : "None"}
              </span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-base text-gray-600 font-medium">Fine:</span>
              <span className="font-semibold text-green-600 text-lg">
                {report?.offense?.fine ? "₱" + report.offense.fine : "None"}
              </span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-base text-gray-600 font-medium">
                Notice Letter Download:
              </span>
              <span className="font-semibold text-blue-600 text-lg">
                {noticeNumber}
              </span>
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

          <div className="mt-6">
            <PDFDownloadLink
              document={
                <NoticeLetterTemplate
                  date={
                    report?.createdAt
                      ? new Date(report.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No Date"
                  }
                  noticeNumber={
                    report?.noticeNumber
                      ? `${new Date(report.createdAt).getFullYear()}-${
                          report.noticeNumber + 1
                        }`
                      : "N/A"
                  }
                  plateNumber={report?.plateNumber || "No Plate Number"}
                  location={
                    report?.violations?.[0]?.exactLocation ||
                    report?.reportDetails?.[0]?.location ||
                    "Unknown Location"
                  }
                  violationDateTime={
                    report?.createdAt
                      ? new Date(report.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No Date/Time"
                  }
                />
              }
              fileName={`Notice Letter ${report?.plateNumber || "Unknown"}.pdf`}
            >
              {({ loading, error }) => (
                <Button
                  mode="contained"
                  style={{
                    backgroundColor: loading ? "#cccccc" : "#f44336",
                    marginTop: 10,
                  }}
                  disabled={loading || error}
                  onPress={updateNoticeNumber}
                  labelStyle={{ color: "white" }}
                >
                  {error
                    ? "Error generating PDF"
                    : loading
                    ? "Generating PDF..."
                    : "Download Parking Notice"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ViewPlateNumber;
