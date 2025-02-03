import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Spacer,
} from "@heroui/react";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import apiClient from "../../utils/apiClient";
import { RxAvatar } from "react-icons/rx";

const ReportCard = ({ createdAt, location, images, description }) => {
  return (
    <Card className="shadow-lg rounded-lg mb-8 bg-white border border-gray-200">
      <CardBody>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          {/* Left Section: User Info */}
          <div className="flex items-center w-1/2">
            {/* <Avatar
              src="https://i.pravatar.cc/150?img=3"
              size="lg"
              bordered
              color="primary"
              className="mr-4"
            /> */}
            <RxAvatar className="mr-4" size={40} />
            <div>
              <h3 className="text-lg font-bold text-gray-800">Anonymous</h3>
              <p className="text-sm text-gray-600">{new Date(createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {/* Right Section: Location */}
          <div className="text-right w-1/2">
            <p className="text-sm text-gray-600">{location}</p>
          </div>
        </div>

        {/* Image Boxes */}
        <div className="flex justify-between mb-4 relative">
          {images.slice(0, 2).map((image, index) => (
            <div key={index} className="relative w-1/2 h-48 mx-1">
              <img
                src={image.url}
                alt={`Report Image ${index + 1}`}
                className={`w-full h-full object-cover rounded-lg ${index === 1 && images.length > 2 ? 'opacity-50' : ''}`}
              />
              {index === 1 && images.length > 2 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <p className="text-white text-lg font-bold">+{images.length - 2}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Description Box */}
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
          <p className="text-sm text-gray-800">{description}</p>
        </div>
      </CardBody>
    </Card>
  );
};

const FYP = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/report/fetch/all/reports?page=${page}&limit=10`);
      setData(prevData => [...prevData, ...response.data.data]);
      setLoading(false);
    } catch (error) {
      alert("Failed to fetch reports. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page]);

  const handleScroll = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  useBottomScrollListener(handleScroll);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((item) => (
          <ReportCard
            key={item._id}
            createdAt={item.createdAt}
            location={item.location}
            images={item.images}
            description={item.description}
          />
        ))}
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
    </div>
  );
};

export default FYP;