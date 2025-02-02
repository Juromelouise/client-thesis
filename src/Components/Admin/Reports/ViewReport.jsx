import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spinner,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";

function ViewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [statusChangeCount, setStatusChangeCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newStatus, setNewStatus] = useState("");
  const [violations, setViolations] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await apiClient.get(`/report/admin/report/${id}`);
        setReport(data.report);
        setStatus(data.report.status);
        setStatusChangeCount(data.report.editableStatus);
        setViolations(data.report.plateNumber.violations.join("\n"));
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

  const handleStatusChange = async (newStatus) => {
    try {
      const { data } = await apiClient.put(
        `/report/admin/report/status/${id}`,
        {
          status: newStatus,
        }
      );
      setReport(data.report);
      setStatus(data.report.status);
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
    onOpen();
  };

  const confirmStatusChange = () => {
    handleStatusChange(newStatus);
    onClose();
  };

  const handleViolationChange = (value) => {
    setViolations(value);
  };

  const editViolations = () => {
    if (!isDisabled) {
      saveViolations();
    }
    setIsDisabled(!isDisabled);
  };

  const saveViolations = async () => {
    try {
      const updatedViolations = violations.split("\n");
      const { data } = await apiClient.put(
        `/plate/admin/report/violations/${report.plateNumber._id}`,
        {
          violations: updatedViolations,
        }
      );
        
      setViolations(data.report.violations.join("\n"));
      toast.success("Violations updated successfully!");
    } catch (error) {
      console.error("Error updating violations:", error);
      toast.error("Failed to update violations.");
    }
  };

  return (
    <div className="p-6 mt-14">
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
            <p className="text-lg font-bold mb-1">Plate Number:</p>
            <p className="text-gray-700">{report.plateNumber.plateNumber}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Violations:</p>
            <div className="flex flex-wrap items-center">
              <Textarea
                isDisabled={isDisabled}
                value={violations}
                onChange={(e) => handleViolationChange(e.target.value)}
                className="mr-2 mb-2 text-sm py-1 px-2 w-full"
              />
              <Button
                className="ml-4 bg-blue-500 hover:bg-blue-600 text-white"
                onPress={editViolations}
              >
                {isDisabled ? "Edit Violations" : "Save Violations"}
              </Button>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Date Reported:</p>
            <p className="text-gray-700">{formatDate(report.createdAt)}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Description:</p>
            <p className="text-gray-700">{report.description}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Images:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {report.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Report Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Reporter:</p>
            <p className="text-gray-700">
              {report.reporter?.firstName} {report.reporter?.lastName}
            </p>
            <p className="text-gray-700">{report.reporter?.email}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Status Change Count:</p>
            <p className="text-gray-700">{statusChangeCount}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Status:</p>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg transition-colors duration-300 hover:from-pink-600 hover:to-yellow-600"
                  radius="full"
                >
                  {status}
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {status && status === "Pending" && (
                  <>
                    <DropdownItem
                      onPress={() => handleStatusChangeClick("Approved")}
                    >
                      Approved
                    </DropdownItem>
                    <DropdownItem
                      onPress={() => handleStatusChangeClick("Disapproved")}
                    >
                      Disapproved
                    </DropdownItem>
                  </>
                )}
                {status && status === "Approved" && (
                  <>
                    <DropdownItem
                      onPress={() => handleStatusChangeClick("Pending")}
                    >
                      Pending
                    </DropdownItem>
                    <DropdownItem
                      onPress={() => handleStatusChangeClick("Disapproved")}
                    >
                      Disapproved
                    </DropdownItem>
                  </>
                )}
                {status && status === "Disapproved" && (
                  <>
                    <DropdownItem
                      onPress={() => handleStatusChangeClick("Pending")}
                    >
                      Pending
                    </DropdownItem>
                    <DropdownItem
                      onPress={() => handleStatusChangeClick("Approved")}
                    >
                      Approved
                    </DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Confirm Status Change</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to change the status to{" "}
              <strong>{newStatus}</strong>?
            </p>
            <p>
              You have <strong>{3 - statusChangeCount}</strong> remaining status
              changes.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-2"
              onPress={confirmStatusChange}
              color="primary"
            >
              Yes
            </Button>
            <Button onPress={onClose} variant="light">
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ViewReport;