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

const PlateNumberList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);
  const itemsPerPage = 10;

  const fetchPlateNumbers = async (page) => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/plate/admin/platenumbers`, {
        params: { page, limit: itemsPerPage },
      });
      setIsLoading(false);
      setData(res.data.data);
      console.log(res.data.totalPages);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlateNumbers(currentPage);
  }, [currentPage]);

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
            <TableColumn key="plateNumber" className="text-center w-3/12">
              Plate Number
            </TableColumn>
            <TableColumn key="violations" className="text-center w-3/12">
              Violations
            </TableColumn>
            <TableColumn key="count" className="text-center w-2/12">
              Count
            </TableColumn>
            <TableColumn className="text-center w-3/12">Actions</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            items={data}
            loadingContent={<Spinner label="Loading..." />}
          >
            {(item) => (
              <TableRow key={item._id}>
                <TableCell className="text-center">{item?.plateNumber}</TableCell>
                <TableCell className="text-center">
                  {item?.violations.map(violation => violation.types.join(", ")).join(", ")}
                </TableCell>
                <TableCell className="text-center">
                  {item?.count}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    auto
                    flat
                    color="primary"
                    className="mr-2"
                    onPress={() => navigate(`/single/plate/${item._id}`)}
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

export default PlateNumberList;