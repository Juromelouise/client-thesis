import { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  TableBody,
  TableHeader,
  TableCell,
  TableRow,
  TableColumn,
  Tooltip,
  Button,
  Select,
  SelectItem,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DatePicker,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import banIcon from "@iconify-icons/fa-solid/ban";
import restoreIcon from "@iconify-icons/fa-solid/undo";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";

const BAN_REASONS = [
  "Submitting false or misleading reports",
  "Using inappropriate or offensive language in comments",
  "Violating terms and agreements",
  "Spam or irrelevant content",
];

const BAN_DURATIONS = [
  { label: "1 day", value: 1 },
  { label: "3 days", value: 3 },
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "Other (pick date)", value: "other" },
];

function Userlist() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [banUserId, setBanUserId] = useState(null);
  const [roleUserId, setRoleUserId] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("");
  const [banCustomDate, setBanCustomDate] = useState(null);
  const [banAttachment, setBanAttachment] = useState(null);
  const [selectedRole, setSelectedRole] = useState(""); // Add this
  const [currentUserRole, setCurrentUserRole] = useState(""); // Add this

  function getRoleOptions(currentRole) {
    switch (currentRole) {
      case "user":
        return ["admin", "superadmin"];
      case "admin":
        return ["user", "superadmin"];
      case "superadmin":
        return ["admin", "user"];
      default:
        return [];
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/user/all-users");
      setUsers(response.data.users);
      console.log("Users fetched successfully:", response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const openBanModal = (userId) => {
    setBanUserId(userId);
    setBanReason("");
    setBanDuration("");
    setBanCustomDate(null);
    setBanAttachment(null);
    setBanModalOpen(true);
  };

  const closeBanModal = () => {
    setBanModalOpen(false);
  };

  const openRoleModal = (userId) => {
    setRoleUserId(userId);
    const user = users.find((u) => u._id === userId);
    setCurrentUserRole(user?.role || "");
    setSelectedRole(""); // Reset selected role
    setRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setRoleModalOpen(false);
  };

  const handleBanSubmit = async (e) => {
    e.preventDefault();
    console.log("Ban user ID:", banReason);
    if (
      !banReason ||
      !banDuration ||
      (banDuration === "other" && !banCustomDate)
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("reason", banReason);
    if (banDuration === "other") {
      const jsDate = banCustomDate
        ? new Date(
            banCustomDate.year,
            banCustomDate.month - 1,
            banCustomDate.day
          )
        : null;
      formData.append("endDate", jsDate ? jsDate.toISOString() : "");
    } else {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + Number(banDuration));
      formData.append("endDate", endDate.toISOString());
    }
    if (banAttachment) {
      formData.append("attachment", banAttachment);
    }
    try {
      await apiClient.put(`/user/ban-user/${banUserId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchUsers();
      toast.success("User banned successfully");
      closeBanModal();
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Error banning user");
    }
  };

  const unbanUser = async (userId) => {
    try {
      await apiClient.put(`/user/unban-user/${userId}`);
      fetchUsers();
      toast.success("User unbanned successfully");
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error("Error unbanning user");
    }
  };

  const handleRoleChangeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error("Please select a new role.");
      return;
    }
    try {
      await apiClient.put(`/user/change-role/${roleUserId}`, {
        role: selectedRole,
      });
      fetchUsers();
      toast.success("User role updated successfully");
      closeRoleModal();
    } catch (error) {
      console.error("Error changing user role:", error);
      toast.error("Error changing user role");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const ITEMS_PER_PAGE = 4;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  return (
    <div>
      <Table
        aria-label="User List"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
      >
        <TableHeader>
          <TableColumn style={{ textAlign: "center" }}>Name</TableColumn>
          <TableColumn style={{ textAlign: "center" }}>Email</TableColumn>
          <TableColumn style={{ textAlign: "center" }}>
            Phone Number
          </TableColumn>
          <TableColumn style={{ textAlign: "center" }}>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user._id}>
              {!user.lastName ? (
                <TableCell style={{ textAlign: "center" }}>
                  {user.firstName}
                </TableCell>
              ) : (
                <TableCell style={{ textAlign: "center" }}>
                  {user.firstName + " " + user.lastName}
                </TableCell>
              )}
              <TableCell style={{ textAlign: "center" }}>
                {user.email}
              </TableCell>
              {!user.phoneNumber ? (
                <TableCell style={{ textAlign: "center" }}>None</TableCell>
              ) : (
                <TableCell style={{ textAlign: "center" }}>
                  {user.phoneNumber}
                </TableCell>
              )}
              <TableCell>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {user.deleted === false ? (
                    <>
                      <Tooltip content="Change user roles" placement="top">
                        <span>
                          <Icon
                            icon="oui:app-users-roles"
                            width="20"
                            height="20"
                            style={{ color: "gray", cursor: "pointer" }}
                            title="Change user roles"
                            onClick={() => openRoleModal(user._id)}
                          />
                        </span>
                      </Tooltip>
                      <Tooltip content="Ban user" placement="top">
                        <span>
                          <Icon
                            icon={banIcon}
                            style={{ color: "red", cursor: "pointer" }}
                            title="Ban user"
                            onClick={() => openBanModal(user._id)}
                          />
                        </span>
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip content="Restore User" placement="top">
                      <span>
                        <Icon
                          icon={restoreIcon}
                          style={{ color: "green", cursor: "pointer" }}
                          title="Restore User"
                          onClick={() => unbanUser(user._id)}
                        />
                      </span>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Ban Modal */}
      <Modal
        isOpen={banModalOpen}
        onClose={closeBanModal}
        size="md"
        placement="center"
        backdrop="opaque"
      >
        <ModalContent>
          <form onSubmit={handleBanSubmit}>
            <ModalHeader>
              <h2 className="text-lg font-bold">Ban User</h2>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Select
                  label="Reason for banning"
                  isRequired
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Select reason"
                >
                  {BAN_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Ban duration"
                  isRequired
                  value={banDuration}
                  onChange={(e) => setBanDuration(e.target.value)}
                  placeholder="Select duration"
                >
                  {BAN_DURATIONS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </Select>
                {banDuration === "other" && (
                  <DatePicker
                    label="Custom end date"
                    isRequired
                    value={banCustomDate}
                    onChange={setBanCustomDate}
                    placeholder="mm/dd/yyyy"
                    labelPlacement="outside"
                  />
                )}
                <Input
                  label="Attachment (optional)"
                  type="file"
                  onChange={(e) => setBanAttachment(e.target.files[0])}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onClick={closeBanModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Ban User
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Change User Role Modal */}
      <Modal
        isOpen={roleModalOpen}
        onClose={closeRoleModal}
        size="md"
        placement="center"
        backdrop="opaque"
      >
        <ModalContent>
          <form onSubmit={handleRoleChangeSubmit}>
            <ModalHeader>
              <h2 className="text-lg font-bold">Change User Role</h2>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Select
                  label="Change Role"
                  isRequired
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  placeholder="Select new role"
                >
                  {getRoleOptions(currentUserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onClick={closeRoleModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Change Role
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <Pagination
          total={Math.ceil(users.length / ITEMS_PER_PAGE)}
          initialPage={1}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default Userlist;
