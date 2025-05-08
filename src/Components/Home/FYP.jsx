import React, { useState, useEffect, useCallback } from "react";
import { Card, CardBody, Avatar } from "@heroui/react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import apiClient from "../../utils/apiClient";
import { RxAvatar } from "react-icons/rx";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { getUser } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const ReportCard = ({
  createdAt,
  location,
  images,
  description,
  reporter,
  avatar,
  id,
  navigate,
}) => {
  return (
    <Card className="shadow-lg rounded-lg mb-8 bg-white border border-gray-200 transition-transform duration-300 hover:scale-105">
      <CardBody>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4"   onClick={()=>{navigate(`/report/${id}`)}}>
          {/* Left Section: User Info */}
          {getUser() && getUser().role === "admin" ? (
            <div className="flex items-center w-1/2">
              <Avatar className="mr-4" src={avatar}></Avatar>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{reporter}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center w-1/2">
              <RxAvatar className="mr-4" size={40} />
              <div>
                <h3 className="text-lg font-bold text-gray-800">Anonymous</h3>
                <p className="text-sm text-gray-600">
                  {new Date(createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Right Section: Location */}
          <div className="text-right w-1/2">
            <p className="text-sm text-gray-600">{location}</p>
          </div>
        </div>

        {/* Image Boxes */}
        <PhotoProvider>
          <div className="flex justify-between mb-4 relative">
            {images.map((image, index) => (
              <PhotoView key={index} src={image.url}>
                {index < 2 ? (
                  <div className="relative w-1/2 h-48 mx-1">
                    <img
                      src={image.url}
                      alt={`Report Image ${index + 1}`}
                      className={`w-full h-full object-cover rounded-lg cursor-pointer ${
                        index === 1 && images.length > 2 ? "opacity-50" : ""
                      }`}
                    />
                    {index === 1 && images.length > 2 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <p className="text-white text-lg font-bold">
                          +{images.length - 2}
                        </p>
                      </div>
                    )}
                  </div>
                ) : null}
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>

        {/* Description Box */}
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300" onClick={()=>{navigate(`/report/${id}`)}}>
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
  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/report/fetch/all/reports?page=${page}&limit=10`
      );
      setData((prevData) => [...prevData, ...response.data.data]);
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
    setPage((prevPage) => prevPage + 1);
  }, []);

  useBottomScrollListener(handleScroll);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((item) => (
          <ReportCard
            key={item._id}
            id={item._id}
            createdAt={item.createdAt}
            location={item.location}
            images={item.images}
            description={item.description}
            reporter={`${item.reporter.firstName} ${item.reporter.lastName}`}
            avatar={item.reporter.avatar.url}
            navigate={navigate}
          />
        ))}
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
    </div>
  );
};

export default FYP;
