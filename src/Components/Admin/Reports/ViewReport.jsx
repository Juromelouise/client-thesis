import React, { useEffect, useState, useMemo } from "react";
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
} from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";
import { PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const violationsList = [
  { description: "driveway", violation: "Blocking Driveway" },
  { description: "no parking zone", violation: "No Parking Zone" },
  { description: "fire hydrant", violation: "Fire Hydrant Parking" },
  { description: "sidewalk", violation: "Sidewalk Parking" },
  { description: "crosswalk", violation: "Crosswalk Obstruction" },
  { description: "loading zone", violation: "Loading Zone Violation" },
  { description: "bus stop", violation: "Blocking Bus Stop" },
  {
    description: "handicapped spot",
    violation: "Unauthorized Parking in Handicapped Spot",
  },
  { description: "intersection", violation: "Parking Near Intersection" },
  {
    description: "railroad crossing",
    violation: "Parking Near Railroad Crossing",
  },
  { description: "curb", violation: "Parking Too Close to Curb" },
  { description: "towed area", violation: "Parking in Towed Area" },
  {
    description: "vehicle obstruction",
    violation: "Obstructing Other Vehicles",
  },
  { description: "street corner", violation: "Parking at Street Corner" },
  { description: "emergency lane", violation: "Parking in Emergency Lane" },
  { description: "bicycle lane", violation: "Blocking Bicycle Lane" },
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
  const [violations, setViolations] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await apiClient.get(`/report/admin/report/${id}`);
        setReport(data.report);
        setStatus(data.report.status);
        setStatusChangeCount(data.report.editableStatus);
        setViolations(data.report.plateNumber.violations.join("\n"));

        // Set initial selected keys based on the report's violations
        const initialSelectedKeys = new Set(
          data.report.plateNumber.violations.map(
            (violation) =>
              violationsList.find((v) => v.violation === violation)?.description
          )
        );
        setSelectedKeys(initialSelectedKeys);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const selectedValue = useMemo(
    () =>
      Array.from(selectedKeys)
        .map(
          (key) => violationsList.find((v) => v.description === key)?.violation
        )
        .join(", "),
    [selectedKeys]
  );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
      const updatedViolations = Array.from(selectedKeys).map(
        (key) => violationsList.find((v) => v.description === key)?.violation
      );
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
            {/* <p className="text-gray-700">{report.plateNumber?.plateNumber}</p> */}
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
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="capitalize"
                    variant="bordered"
                    style={{ width: "300px", height: "50px" }}
                  >
                    {selectedValue || "Select Violations"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Multiple selection example"
                  closeOnSelect={false}
                  selectedKeys={selectedKeys}
                  selectionMode="multiple"
                  variant="flat"
                  onSelectionChange={setSelectedKeys}
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {violationsList.map((violation) => (
                    <DropdownItem key={violation.description}>
                      {violation.violation}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              {status && status === "Resolved" ? (
                <></>
              ) : (
                <Button
                  className="ml-4 bg-blue-500 hover:bg-blue-600 text-white"
                  onPress={editViolations}
                >
                  {"Save Violations"}
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
