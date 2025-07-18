import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spinner,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";
import { PhotoView } from "react-photo-view";
import PropTypes from "prop-types";

const PDFExportButton = ({ report }) => {
  const [pdfComponents, setPdfComponents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPdfComponents = async () => {
      try {
        const [rendererModule, generatorModule] = await Promise.all([
          import("@react-pdf/renderer"),
          import("../../../utils/PDFObstruction"),
        ]);

        setPdfComponents({
          PDFDownloadLink: rendererModule.PDFDownloadLink,
          PDRObstructionPDFGenerator: generatorModule.default,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load PDF components:", err);
        setError("Failed to load PDF tools");
        setLoading(false);
      }
    };

    loadPdfComponents();
  }, []);

  if (loading) {
    return (
      <Button isDisabled className="bg-gray-500 text-white">
        Loading PDF tools...
      </Button>
    );
  }

  if (error) {
    return (
      <Button isDisabled className="bg-red-500 text-white">
        {error}
      </Button>
    );
  }

  if (!pdfComponents) {
    return null;
  }

  const { PDFDownloadLink, PDRObstructionPDFGenerator } = pdfComponents;

  return (
    <PDFDownloadLink
      document={<PDRObstructionPDFGenerator report={report} />}
      fileName={`obstruction_report_${report._id}.pdf`}
    >
      {({ loading: pdfLoading, error: pdfError }) => (
        <Button
          className={`${
            pdfError
              ? "bg-red-500 hover:bg-red-600"
              : pdfLoading
              ? "bg-gray-500"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white`}
          isDisabled={pdfLoading || pdfError}
        >
          {pdfError
            ? "PDF Error"
            : pdfLoading
            ? "Generating..."
            : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

PDFExportButton.propTypes = {
  report: PropTypes.object.isRequired,
};

const violationsList = [
  { value: "Overnight Parking", label: "Overnight Parking" },
  { value: "Hazard Parking", label: "Hazard Parking" },
  { value: "Illegal Parking", label: "Illegal Parking" },
  { value: "Towing Zone", label: "Towing Zone" },
  { value: "Loading and Unloading", label: "Loading and Unloading" },
  { value: "Illegal Sidewalk Use", label: "Illegal Sidewalk Use" },
];

function ViewObstruction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [statusChangeCount, setStatusChangeCount] = useState(0);
  const {
    isOpen: isReasonModalOpen,
    onOpen: onReasonModalOpen,
    onClose: onReasonModalClose,
  } = useDisclosure();
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState(null);
  const [selectedViolations, setSelectedViolations] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/report/admin/obstruction/${id}`);
        setReport(data.data);
        setStatus(data.data.status);
        setStatusChangeCount(data.data.editableStatus);
        setSelectedViolations(
          Array.isArray(data.data.violations)
            ? data.data.violations
                .map((type) =>
                  violationsList.find((violation) => violation.label === type)
                )
                .filter(Boolean)
            : []
        );
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusChange = async (newStatus, reason) => {
    try {
      const { data } = await apiClient.put(
        `/report/admin/obstruction/status/${id}`,
        {
          status: newStatus,
          reason: reason,
        }
      );
      setReport(data.report);
      setStatus(data.report.status);
      setReason("");
      setStatusChangeCount(data.report.editableStatus);
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating report status:", error);
      if (error.response && error.response.data.message) {
        toast.warning(error.response.data.message);
      }
    }
  };

  const handleStatusChangeClick = (newStatus) => {
    setNewStatus(newStatus);
    if (status === "Ongoing Investigation") {
      onReasonModalOpen();
    } else {
      handleStatusChange(newStatus, reason);
    }
  };

  const confirmStatusChange = () => {
    handleStatusChange(newStatus, reason);
    onReasonModalClose();
  };

  const editViolations = () => {
    saveViolations();
  };

  const saveViolations = async () => {
    try {
      setLoading(true);
      const updatedViolations = selectedViolations.map((v) => v.label);
      const { data } = await apiClient.put(
        `/report/admin/obstruction/violations/${report._id}`,
        {
          violations: updatedViolations,
        }
      );
      setLoading(false);
      toast.success("Violations updated successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error updating violations:", error);
      toast.error("Failed to update violations.");
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">Report Details</h2>
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
            <p className="text-lg font-bold mb-1">Report ID:</p>
            <p className="text-gray-700">{report._id}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Violations:</p>
            <div className="flex flex-wrap items-center">
              <Select
                isMulti
                options={violationsList}
                value={selectedViolations}
                onChange={setSelectedViolations}
                className="w-full max-w-md"
                classNamePrefix="react-select"
                isDisabled={
                  status === "Resolved" ||
                  status === "Approved" ||
                  status === "Disapproved"
                }
              />
              {(status && status === "Resolved") ||
              status === "Approved" ||
              status === "Disapproved" ? (
                <></>
              ) : (
                <Button
                  className="ml-4 bg-blue-500 hover:bg-blue-600 text-white"
                  onPress={editViolations}
                >
                  Save Violations
                </Button>
              )}
            </div>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Date Reported:</p>
            <p className="text-gray-700">
              {formatDate(report.createdAt)}{" "}
              {new Date(report.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Description:</p>
            <p className="text-gray-700">{report.original}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Images:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {report.images.map((image, index) => (
                <PhotoView key={index} src={image.url}>
                  <img
                    src={image.url}
                    alt={`Report Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                  />
                </PhotoView>
              ))}
            </div>
          </div>
          {status === "Resolved" && report.confirmationImages && (
            <div className="mb-6">
              <p className="text-lg font-bold mb-1">Confirmation Images:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {report.confirmationImages.map((image, index) => (
                  <PhotoView key={index} src={image.url}>
                    <img
                      src={image.url}
                      alt={`Report Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                  </PhotoView>
                ))}
              </div>
            </div>
          )}
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Reporter:</p>
            <div className="text-gray-700">
              <p className="mb-1">
                <span className="font-semibold">Name:</span>{" "}
                {report.reporter?.firstName} {report.reporter?.lastName}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Email:</span>{" "}
                {report.reporter?.email}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Phone Number:</span>{" "}
                {report.reporter?.phoneNumber}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Address:</span>{" "}
                {report.reporter?.address}
              </p>
            </div>
          </div>
          <div className="mb-6">
            <p
              className={`text-lg font-bold mb-1 ${
                status === "Approved" ? "" : "text-black-500"
              }`}
            >
              Status:{" "}
              <span
                className={
                  status === "Approved" ? "text-green-500" : "text-black-500"
                }
              >
                {status}
              </span>
            </p>
            <div className="flex space-x-2">
              {status === "Pending" && (
                <Button
                  className="bg-green-500 text-white shadow-lg transition-colors duration-300 hover:bg-green-600"
                  radius="full"
                  onPress={() =>
                    handleStatusChangeClick("Reviewed for Proper Action")
                  }
                >
                  Reviewed for Proper Action
                </Button>
              )}
              {status === "Reviewed for Proper Action" && (
                <Button
                  className="bg-green-500 text-white shadow-lg transition-colors duration-300 hover:bg-green-600"
                  radius="full"
                  onPress={() =>
                    handleStatusChangeClick("Ongoing Investigation")
                  }
                >
                  Ongoing Investigation
                </Button>
              )}
              {status === "Ongoing Investigation" && (
                <Button
                  className="bg-green-500 text-white shadow-lg transition-colors duration-300 hover:bg-green-600"
                  radius="full"
                  onPress={() => handleStatusChangeClick("Approved")}
                >
                  Approve
                </Button>
              )}
              {status === "Ongoing Investigation" && (
                <Button
                  className="bg-red-500 text-white shadow-lg transition-colors duration-300 hover:bg-red-600"
                  radius="full"
                  onPress={() => handleStatusChangeClick("Declined")}
                >
                  Decline
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          {report && <PDFExportButton report={report} />}
        </div>
      </Card>

      {/* Confirm Status Change Modal */}
      <Modal isOpen={isReasonModalOpen} onClose={onReasonModalClose}>
        <ModalContent>
          <ModalHeader>Reason for Status Change</ModalHeader>
          <ModalBody>
            <textarea
              className="w-full p-2 border rounded"
              rows="5"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for changing the status"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-2"
              onPress={confirmStatusChange}
              color="primary"
            >
              Submit
            </Button>
            <Button onPress={onReasonModalClose} variant="light">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ViewObstruction;
