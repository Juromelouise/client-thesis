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
} from "@heroui/react";
import apiClient from "../../../utils/apiClient";
import { useNavigate } from "react-router-dom";

const ObstructionList = ({ filterStatus }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const getData = async () => {
    const { data } = await apiClient.get(`/report/admin/obstruction`);
    setData(data.obstructions);
    // console.log(data.obstructions);
  };

  useEffect(() => {
    getData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredData = filterStatus
    ? data.filter((report) => report.status === filterStatus)
    : data;

  return (
    <div className="p-2">
      <Card className="shadow-lg">
        <h3 className="text-2xl font-semibold mb-5 text-center">
          {" "}
          Obstruction Reports
        </h3>
        <Table
          selectionMode="single"
          aria-label="Example table with dynamic content"
          className="w-full"
        >
          <TableHeader>
            <TableColumn className="text-center w-1/12">ID</TableColumn>
            <TableColumn className="text-center w-3/12">Location</TableColumn>
            <TableColumn className="text-center w-3/12">Violations</TableColumn>
            <TableColumn className="text-center w-2/12">Date</TableColumn>
            <TableColumn className="text-center w-3/12">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredData.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="text-center">{report?._id}</TableCell>
                <TableCell className="text-center">
                  {report?.location}
                </TableCell>
                <TableCell className="text-center">
                  {report?.violations?.join(", ")}
                </TableCell>
                <TableCell className="text-center">
                  {formatDate(report?.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  <Button auto flat color="primary" className="mr-2" onPress={() => navigate(`/single/obstruction/${report._id}`)}>
                    View
                  </Button>
                  {/* <Button auto flat color="error">
                    Delete
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ObstructionList;
