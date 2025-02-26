import React, { useEffect, useState, useMemo } from "react";
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";
import { PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const violationsList = [
  { value: "driveway", label: "Blocking Driveway" },
  { value: "no parking zone", label: "No Parking Zone" },
  { value: "fire hydrant", label: "Fire Hydrant Parking" },
  { value: "sidewalk", label: "Sidewalk Parking" },
  { value: "crosswalk", label: "Crosswalk Obstruction" },
  { value: "loading zone", label: "Loading Zone Violation" },
  { value: "bus stop", label: "Blocking Bus Stop" },
  { value: "handicapped spot", label: "Unauthorized Parking in Handicapped Spot" },
  { value: "intersection", label: "Parking Near Intersection" },
  { value: "railroad crossing", label: "Parking Near Railroad Crossing" },
  { value: "curb", label: "Parking Too Close to Curb" },
  { value: "towed area", label: "Parking in Towed Area" },
  { value: "vehicle obstruction", label: "Obstructing Other Vehicles" },
  { value: "street corner", label: "Parking at Street Corner" },
  { value: "emergency lane", label: "Parking in Emergency Lane" },
  { value: "bicycle lane", label: "Blocking Bicycle Lane" },
];

function ViewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [statusChangeCount, setStatusChangeCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isReasonModalOpen,
    onOpen: onReasonModalOpen,
    onClose: onReasonModalClose,
  } = useDisclosure();
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [violations, setViolations] = useState([]);
  const [selectedViolations, setSelectedViolations] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await apiClient.get(`/report/admin/report/${id}`);
        setReport(data.report);
        setStatus(data.report.status);
        setStatusChangeCount(data.report.editableStatus);

        // Fetch the violation of that specific report
        const violation = data.report.plateNumber.violations.find(
          (v) => v.report._id.toString() === id
        );
        if (violation) {
          setViolations(violation.types);
          setSelectedViolations(
            violation.types.map((type) =>
              // console.log(type)
              violationsList.find((v) => v.label === type)
            )
          );
        }
        
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);
  const handleStatusChange = async (newStatus, reason) => {
    try {
      const { data } = await apiClient.put(
        `/report/admin/report/status/${id}`,
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
    onReasonModalOpen();
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
      const updatedViolations = selectedViolations.map((v) => v.label);
      console.log(updatedViolations);
      const { data } = await apiClient.put(
        `/plate/admin/report/violations/${report._id}`,
        {
          violations: updatedViolations,
        }
      );
      console.log(data)
      // setViolations(data.report.violations.join("\n"));
      toast.success("Violations updated successfully!");
    } catch (error) {
      console.error("Error updating violations:", error);
      toast.error("Failed to update violations.");
    }
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            <p className="text-lg font-bold mb-1">Plate Number:</p>
            <p className="text-gray-700">
              <Button
                key={report.plateNumber?._id}
                onPress={() => {
                  navigate(`/single/plate/${report.plateNumber?._id}`);
                }}
              >
                {report.plateNumber?.plateNumber}
              </Button>
            </p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">
              Number of Report on Plate Number:
            </p>
            <p className="text-gray-700">{report.plateNumber?.count}</p>
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
              />
              {status && status === "Resolved" ? (
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
            <p className="text-gray-700">{formatDate(report.createdAt)}</p>
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
                      alt={`Confirmation Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                  </PhotoView>
                ))}
              </div>
            </div>
          )}
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Reporter:</p>
            <p className="text-gray-700">
              {report.reporter?.firstName} {report.reporter?.lastName}
            </p>
            <p className="text-gray-700">{report.reporter?.email}</p>
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

export default ViewReport;