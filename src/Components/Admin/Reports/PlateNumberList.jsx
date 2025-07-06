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
} from "@heroui/react";
import apiClient from "../../../utils/apiClient";
import { useNavigate } from "react-router-dom";

const PlateNumberList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);
  const itemsPerPage = 10;

  const fetchPlateNumbers = async (page) => {
    const isInitialLoad = page === 1;
    if (!isInitialLoad) setIsPageChanging(true);
    
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/plate/admin/platenumbers`, {
        params: { 
          page, 
          limit: itemsPerPage,
          timestamp: Date.now() 
        },
      });
      setData(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
      setIsPageChanging(false);
    }
  };

  useEffect(() => {
    fetchPlateNumbers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <Card className="shadow-lg">
        <div className="p-4">
          <h3 className="text-2xl font-semibold mb-5 text-center">
            Illegal Parking Reports
          </h3>
          
          {/* Loading overlay for page transitions */}
          {(isLoading || isPageChanging) && (
            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-10 rounded-lg">
              <Spinner size="lg" color="primary" />
            </div>
          )}
          
          <Table
            aria-label="Plate numbers table"
            className="w-full relative" // Added relative for positioning
            isStriped
          >
            <TableHeader>
              <TableColumn key="plateNumber" className="text-center w-3/12">
                Plate Number
              </TableColumn>
              <TableColumn key="violations" className="text-center w-3/12">
                Violations
              </TableColumn>
              <TableColumn key="count" className="text-center w-2/12">
                Reports
              </TableColumn>
              <TableColumn className="text-center w-3/12">Actions</TableColumn>
            </TableHeader>
            
            <TableBody
              isLoading={isLoading && currentPage === 1} // Only show loading content on initial load
              items={data}
              loadingContent={
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Spinner size="lg" />
                      <span className="text-gray-600">Loading plate numbers...</span>
                    </div>
                  </TableCell>
                </TableRow>
              }
              emptyContent={
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No plate numbers found
                  </TableCell>
                </TableRow>
              }
            >
              {(item) => (
                <TableRow key={item._id}>
                  <TableCell className="text-center font-medium">
                    {item?.plateNumber || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.violations?.length > 0 ? (
                      <span 
                        className="inline-block max-w-xs truncate" 
                        title={item.violations
                          .flatMap(v => v.types)
                          .join(", ")}
                      >
                        {item.violations
                          .flatMap(v => v.types)
                          .join(", ")}
                      </span>
                    ) : (
                      "No violations"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {item?.count || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      color="primary"
                      className="mr-2"
                      onPress={() => navigate(`/single/plate/${item._id}`)}
                      isDisabled={isPageChanging}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Improved Pagination with loading state */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 px-4 py-2 border-t">
              <div className="text-sm text-gray-600">
                {isPageChanging ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" /> Loading...
                  </span>
                ) : (
                  `Showing page ${currentPage} of ${totalPages}`
                )}
              </div>
              
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                className="gap-1"
                showControls
                showShadow
                radius="full"
                siblings={1}
                boundaries={1}
                isDisabled={isPageChanging}
              />
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  isDisabled={currentPage === 1 || isPageChanging}
                  onPress={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  isDisabled={currentPage === totalPages || isPageChanging}
                  onPress={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PlateNumberList;