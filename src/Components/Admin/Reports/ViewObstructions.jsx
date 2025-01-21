import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Divider, Badge } from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../../utils/apiClient";

function ViewObstruction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await apiClient.get(`/report/admin/obstruction/${id}`);
        setReport(data.data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-lg font-semibold">
          Report not found.
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 mt-14">
      <Card className="shadow-lg max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">Report Details</h2>
          <Button flat color="primary" onPress={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
        <Divider className="my-4" />
        <div className="mt-4">
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Report ID:</p>
            <p className="text-gray-700">{report._id}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Violations:</p>
            <div className="flex flex-wrap">
              {report.violations.map((violation, index) => (
                <Badge
                  key={index}
                  color="warning"
                  className="mr-2 mb-2 text-sm py-1 px-2"
                >
                  {violation}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Date Reported:</p>
            <p className="text-gray-700">{formatDate(report.createdAt)}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Description:</p>
            <p className="text-gray-700">{report.description}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Images:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {report.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Report Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
          <div className="mb-6">
            <p className="text-lg font-bold mb-1">Reporter:</p>
            <p className="text-gray-700">{report.reporter?.firstName} {report.reporter?.lastName}</p>
            <p className="text-gray-700">{report.reporter?.email}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ViewObstruction;