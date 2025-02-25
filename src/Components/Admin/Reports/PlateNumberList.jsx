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
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import apiClient from "../../../utils/apiClient";
import { useNavigate } from "react-router-dom";

const PlateNumberList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "ascending",
  });

  const list = useAsyncList({
    async load({ signal }) {
      const res = await apiClient.get(`/plate/admin/platenumbers`, { signal });
      setIsLoading(false);
      return { items: res.data.plateNumbers };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let cmp =
            a[sortDescriptor.column] < b[sortDescriptor.column] ? -1 : 1;
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  useEffect(() => {
    list.reload();
  }, []);

  const handleSortChange = (descriptor) => {
    setSortDescriptor(descriptor);
    list.sort(descriptor);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredData = list.items;

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
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}
        >
          <TableHeader>
            <TableColumn
              key="plateNumber"
              allowsSorting
              className="text-center w-3/12"
            >
              Plate Number
            </TableColumn>
            <TableColumn
              key="violations"
              allowsSorting
              className="text-center w-3/12"
            >
              Violations
            </TableColumn>
            <TableColumn
              key="Count"
              allowsSorting
              className="text-center w-2/12"
            >
              Count
            </TableColumn>
            <TableColumn className="text-center w-3/12">Actions</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            items={filteredData}
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
      </Card>
    </div>
  );
};

export default PlateNumberList;