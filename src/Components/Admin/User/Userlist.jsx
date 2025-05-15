import { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  TableBody,
  TableHeader,
  TableCell,
  TableRow,
  TableColumn,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import banIcon from "@iconify-icons/fa-solid/ban";
import deleteIcon from "@iconify-icons/fa-solid/trash";
import restoreIcon from "@iconify-icons/fa-solid/undo";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";

function Userlist() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  const banUser = async (userId) => {
    try {
      const response = await apiClient.put(`/user/ban-user/${userId}`);
      console.log("User banned successfully:", response.data.user);
      fetchUsers();
      toast.success("User banned successfully");
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Error banning user");
    }
  };

  const unbanUser = async (userId) => {
    try {
      console.log("Unban user ID:", userId);
      await apiClient.put(`/user/unban-user/${userId}`);
      fetchUsers();
      toast.success("User unbanned successfully");
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error("Error unbanning user");
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
                <TableCell style={{ textAlign: "center" }}>{user.firstName}</TableCell>
              ) : (
                <TableCell style={{ textAlign: "center" }}>{user.firstName + " " + user.lastName}</TableCell>
              )}
              <TableCell style={{ textAlign: "center" }}>{user.email}</TableCell>
              {!user.phoneNumber ? (
                <TableCell style={{ textAlign: "center" }}>None</TableCell>
              ) : (
                <TableCell style={{ textAlign: "center" }}>{user.phoneNumber}</TableCell>
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
                    <Icon
                      icon={banIcon}
                      style={{ color: "red", cursor: "pointer" }}
                      title="Ban User"
                      onClick={() => banUser(user._id)}
                    />
                  ) : (
                    <Icon
                      icon={restoreIcon}
                      style={{ color: "green", cursor: "pointer" }}
                      title="Restore User"
                      onClick={() => unbanUser(user._id)}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Add spacing and align pagination to the right */}
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
