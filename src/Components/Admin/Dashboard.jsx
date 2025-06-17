import { useState, useRef } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { HiChevronDown } from "react-icons/hi";
import ReportList from "./Reports/ReportList";
import ObstructionList from "./Reports/ObstructionList";
import HeatMap from "./Maps/HeatMap";
import AnnouncementPage from "../Home/Announcement";
import apiClient from "../../utils/apiClient";
import Charts from "./Charts/Charts";
import PlateNumberList from "./Reports/PlateNumberList";
import StreetLegends from "./Maps/StreetLegends";
import Userlist from "./User/Userlist";
import { getUser } from "../../utils/helpers";

const Dashboard = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [activePage, setActivePage] = useState("Charts");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Pending");
  const announcementPageRef = useRef(null);

  const renderContent = () => {
    switch (activePage) {
      case "Charts":
        return <Charts />;
      case "Illegal parking":
        return <ReportList filterStatus={filterStatus} />;
      case "Complaints":
        return <ObstructionList filterStatus={filterStatus} />;
      case "Plate Number":
        return <PlateNumberList />;
      case "Heatmap":
        return <HeatMap />;
      case "Announcement":
        return <AnnouncementPage ref={announcementPageRef} />;
      case "StreetLegends":
        return <StreetLegends />;
      case "Userlist":
        return <Userlist />;
      default:
        return <div>Select a page</div>;
    }
  };

  const AnnouncementModal = () => (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      onOpenChange={onOpenChange}
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Announcement
            </ModalHeader>
            <ModalBody>
              <Input
                label="Title"
                variant="underlined"
                isRequired
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <Textarea
                label="Description"
                variant="underlined"
                isRequired
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className="mt-4"
              />
              <Input
                type="file"
                label="Images"
                variant="underlined"
                multiple
                accept="image/*"
                onChange={(e) => {
                  setImages(Array.from(e.target.files));
                }}
                className="mt-4"
              />
            </ModalBody>
            <ModalFooter>
              <Button auto flat color="error" onPress={onClose}>
                Close
              </Button>
              <Button onPress={createAnnouncement}>Create</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  const createAnnouncement = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      images.forEach((image) => {
        formData.append(`images`, image);
      });

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await apiClient.post(`/announce/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      onClose();
      setTitle("");
      setDescription("");
      setImages([]);
      if (announcementPageRef.current) {
        announcementPageRef.current.fetchAnnouncements();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <Button
          className={`mb-2 ${
            activePage === "Charts"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onPress={() => setActivePage("Charts")}
        >
          Charts
        </Button>
        <Button
          className={`mb-2 ${
            activePage === "Illegal parking"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onPress={() => setActivePage("Illegal parking")}
        >
          Illegal parking
        </Button>
        <Button
          className={`mb-2 ${
            activePage === "Complaints"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onPress={() => setActivePage("Complaints")}
        >
          Complaints
        </Button>
        <Button
          className={`mb-2 ${
            activePage === "Plate Number"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onPress={() => setActivePage("Plate Number")}
        >
          Plate Number
        </Button>
        <Button
          className={`mb-2 ${
            activePage === "Heatmap"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onPress={() => setActivePage("Heatmap")}
        >
          Heatmap
        </Button>
        <Button
          className={`mb-2 ${
            activePage === "StreetLegends"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onPress={() => setActivePage("StreetLegends")}
        >
          Streets
        </Button>
        <Button
          className={`mb-2 ${
            activePage === "Announcement"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onPress={() => setActivePage("Announcement")}
        >
          Announcement
        </Button>
        {getUser() && getUser().role === "superadmin" && (
          <Button
            className={`mb-2 ${
              activePage === "Userlist"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onPress={() => setActivePage("Userlist")}
          >
            User Management
          </Button>
        )}
      </div>
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{activePage}</h2>
          {(activePage === "Illegal parking" ||
            activePage === "Complaints") && (
            <Dropdown>
              <DropdownTrigger>
                <Button className="flex items-center gap-2 bg-gray-200 text-gray-700 transition-colors duration-300 hover:bg-gray-300">
                  {filterStatus}
                  <HiChevronDown className="transition-transform duration-300 transform" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => setFilterStatus("Pending")}>
                  Pending
                </DropdownItem>
                <DropdownItem onClick={() => setFilterStatus("Reviewed for Proper Action")}>
                  Reviewed for Proper Action
                </DropdownItem>
                <DropdownItem onClick={() => setFilterStatus("Ongoing Investigation")}>
                  Ongoing Investigation
                </DropdownItem>
                <DropdownItem onClick={() => setFilterStatus("Approved")}>
                  Approved
                </DropdownItem>
                <DropdownItem onClick={() => setFilterStatus("Declined")}>
                  Declined
                </DropdownItem>
                <DropdownItem onClick={() => setFilterStatus("Resolved")}>
                  Resolved
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          {activePage === "Announcement" && (
            <Button
              className="bg-blue-500 text-white transition-colors duration-300 hover:bg-blue-600"
              onClick={onOpen}
            >
              New Announcement
            </Button>
          )}
        </div>
        <div className="border-t border-gray-200 pt-4">{renderContent()}</div>
      </div>
      {AnnouncementModal()}
    </div>
  );
};

export default Dashboard;
