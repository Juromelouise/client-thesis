import React, { useEffect, useState } from "react";
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

const ObstructionList = ({ filterStatus }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const list = useAsyncList({
    async load({ signal }) {
      const res = await apiClient.get(`/report/admin/report/obstruction`, {
        signal,
      });
      console.log("Obstruction List Data:", res.data.data);
      setIsLoading(false);
      return { items: res.data.data };
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
    list.sort(descriptor);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredData = filterStatus
    ? list.items.filter((report) => report.status === filterStatus)
    : list.items;

  return (
    <div className="p-2">
      <Card className="shadow-lg">
        <h3 className="text-2xl font-semibold mb-5 text-center">
          Obstruction Reports
        </h3>
        <Table
          selectionMode="single"
          aria-label="Example table with dynamic content"
          className="w-full"
          sortDescriptor={list.sortDescriptor}
          onSortChange={handleSortChange}
        >
          <TableHeader>
            <TableColumn
              key="_id"
              allowsSorting
              className="text-center w-1/12"
              onClick={() => list.sort("id")}
            >
              ID
            </TableColumn>
            <TableColumn
              key="location"
              allowsSorting
              className="text-center w-3/12"
            >
              Location
            </TableColumn>
            <TableColumn
              key="violations"
              allowsSorting
              className="text-center w-3/12"
            >
              Violations
            </TableColumn>
            <TableColumn
              key="createdAt"
              allowsSorting
              className="text-center w-2/12"
            >
              Date
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
                <TableCell className="text-center">{item?._id}</TableCell>
                <TableCell className="text-center">{item?.location}</TableCell>
                <TableCell className="text-center">
                  {item?.violations?.join(", ")}
                </TableCell>
                <TableCell className="text-center">
                  {formatDate(item?.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  {!item.plateNumber ? (
                    <>
                      <Button
                        auto
                        flat
                        color="primary"
                        className="mr-2"
                        onPress={() =>
                          navigate(`/single/obstruction/${item._id}`)
                        }
                      >
                        View
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        auto
                        flat
                        color="primary"
                        className="mr-2"
                        onPress={() => navigate(`/single/report/${item._id}`)}
                      >
                        View
                      </Button>
                    </>
                  )}
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

export default ObstructionList;
