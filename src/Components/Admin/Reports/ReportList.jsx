import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Card,
  Button,
  Spinner,
  Pagination,
  PaginationItem,
  PaginationCursor,
} from "@heroui/react";
import apiClient from "../../../utils/apiClient";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ReportList = ({ filterStatus }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [data, setData] = useState([]);
  const itemsPerPage = 10;

  const fetchReports = async (page) => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/report/admin/report`, {
        params: { page, limit: itemsPerPage, filterStatus },
      });
      setIsLoading(false);
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage, filterStatus]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    filteringData();
  }, [data]);

  const filteringData = () => {
    try {
      const a = filterStatus
        ? data.filter((item) => item.status === filterStatus)
        : data;
      setPaginatedData(a);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  return (
    <div className="p-2">
      <Card className="shadow-lg">
        <h3 className="text-2xl font-semibold mb-5 text-center">
          Illegal Parking Reports
        </h3>
        <Table
          selectionMode="single"
          aria-label="Example table with dynamic content"
          className="w-full"
        >
          <TableHeader>
            <TableColumn key="location" className="text-center w-1/12">
              Location
            </TableColumn>
            <TableColumn key="plateNumber" className="text-center w-3/12">
              Plate Number
            </TableColumn>
            <TableColumn key="types" className="text-center w-3/12">
              Violations
            </TableColumn>
            <TableColumn key="createdAt" className="text-center w-2/12">
              Date
            </TableColumn>
            <TableColumn className="text-center w-3/12">Actions</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            items={paginatedData}
            loadingContent={<Spinner label="Loading..." />}
            getKey={(item) => item._id}
          >
            {(item) => (
              <TableRow key={item._id}>
                <TableCell className="text-center">{item.location}</TableCell>
                <TableCell className="text-center">
                  {item.plateNumber}
                </TableCell>
                <TableCell className="text-center">
                  {item.types.join(", ")}
                </TableCell>
                <TableCell className="text-center">
                  {formatDate(item.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    auto
                    flat
                    color="primary"
                    className="mr-2"
                    onPress={() => navigate(`/single/report/${item._id}`)}
                  >
                    View
                  </Button>
                  {/* <Button auto flat color="error">
                    Delete
                  </Button> */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-center mt-4">
          <Pagination
            total={totalPages}
            initialPage={currentPage}
            onChange={(page) => setCurrentPage(page)}
            className="pagination"
          >
            <PaginationItem key="prev" as="button">
              Previous
            </PaginationItem>
            <PaginationCursor />
            <PaginationItem key="next" as="button">
              Next
            </PaginationItem>
          </Pagination>
        </div>
      </Card>
    </div>
  );
};
ReportList.propTypes = {
  filterStatus: PropTypes.string,
};

export default ReportList;
