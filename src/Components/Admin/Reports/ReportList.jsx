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

const ReportList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const getData = async () => {
    const { data } = await apiClient.get(`/report/admin/report`);
    setData(data.data);
    console.log(data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            <TableColumn className="text-center w-1/12">ID</TableColumn>
            <TableColumn className="text-center w-3/12">
              Plate Number
            </TableColumn>
            <TableColumn className="text-center w-3/12">Violations</TableColumn>
            <TableColumn className="text-center w-2/12">Date</TableColumn>
            <TableColumn className="text-center w-3/12">Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((report) => (
                <TableRow key={report._id}>
                  <TableCell className="text-center">{report?._id}</TableCell>
                  <TableCell className="text-center">
                    {report?.plateNumber?.plateNumber}
                  </TableCell>
                  <TableCell className="text-center">
                    {report?.plateNumber?.violations.join(", ")}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDate(report.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      auto
                      flat
                      color="primary"
                      className="mr-2"
                      onPress={() => navigate(`/single/report/${report._id}`)}
                    >
                      View
                    </Button>
                    <Button auto flat color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ReportList;
