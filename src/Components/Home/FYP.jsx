import React, { useState, useEffect, useCallback } from "react";
import { HiOutlineChatAlt2 } from "react-icons/hi";
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
  // ...inside ReportCard, update renderImages()...
  const renderImages = () => {
    if (!images || images.length === 0) return null;
    if (images.length === 1) {
      return (
        <PhotoProvider>
          <div className="w-full flex justify-center px-0 pb-4 pt-2">
            <PhotoView src={images[0].url}>
              <img
                src={images[0].url}
                alt="Report"
                className="rounded-lg object-cover w-full max-h-96 p-4"
                style={{ maxHeight: 384 }}
              />
            </PhotoView>
          </div>
        </PhotoProvider>
      );
    }
    if (images.length === 2) {
      return (
        <PhotoProvider>
          <div className="flex gap-3 px-2 pb-4 pt-2">
            {images.slice(0, 2).map((img, idx) => (
              <PhotoView key={idx} src={img.url}>
                <img
                  src={img.url}
                  alt={`Report ${idx + 1}`}
                  className="rounded-lg object-cover w-1/2 h-64 p-2"
                  style={{ maxHeight: 256 }}
                />
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>
      );
    }
    if (images.length === 3) {
      return (
        <PhotoProvider>
          <div className="flex gap-3 px-2 pb-4 pt-2">
            <PhotoView src={images[0].url}>
              <img
                src={images[0].url}
                alt="Report 1"
                className="rounded-lg object-cover w-2/3 h-64 p-2"
                style={{ maxHeight: 256 }}
              />
            </PhotoView>
            <div className="flex flex-col gap-3 w-1/3">
              <PhotoView src={images[1].url}>
                <img
                  src={images[1].url}
                  alt="Report 2"
                  className="rounded-lg object-cover w-full h-32 p-2"
                  style={{ maxHeight: 128 }}
                />
              </PhotoView>
              <PhotoView src={images[2].url}>
                <img
                  src={images[2].url}
                  alt="Report 3"
                  className="rounded-lg object-cover w-full h-32 p-2"
                  style={{ maxHeight: 128 }}
                />
              </PhotoView>
            </div>
          </div>
        </PhotoProvider>
      );
    }
    // 4 or more images
    return (
      <PhotoProvider>
        <div className="grid grid-cols-2 gap-3 px-2 pb-4 pt-2">
          {images.slice(0, 4).map((img, idx) => (
            <PhotoView key={idx} src={img.url}>
              <img
                src={img.url}
                alt={`Report ${idx + 1}`}
                className="rounded-lg object-cover w-full h-40 p-2"
                style={{ maxHeight: 160 }}
              />
            </PhotoView>
          ))}
          {images.length > 4 && (
            <div className="flex items-center justify-center w-full h-40 bg-gray-200 rounded-lg text-lg font-bold text-gray-600 col-span-2">
              +{images.length - 4} more
            </div>
          )}
        </div>
      </PhotoProvider>
    );
  };
  // ...rest of the file unchanged...

  return (
    <Card className="shadow-md rounded-xl mb-6 bg-white border border-gray-200 max-w-full md:max-w-2xl mx-auto">
      <CardBody className="p-0">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            {getUser() && getUser().role === "admin" || getUser().role === "superadmin"? (
              <>
                <Avatar className="w-11 h-11" src={avatar} />
                <div>
                  <div className="font-semibold text-gray-900 leading-tight">
                    {reporter}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(createdAt).toLocaleString()}
                  </div>
                </div>
              </>
            ) : (
              <>
                <RxAvatar className="w-11 h-11 text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-900 leading-tight">
                    Anonymous
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(createdAt).toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>
          <span className="text-xs text-gray-400">{location}</span>
        </div>
        {description && (
          <div className="px-4 pb-2">
            <p className="text-gray-800 text-base">{description}</p>
          </div>
        )}
        {renderImages()}
        <div className="px-4 pb-4">
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition flex items-center gap-2"
            onClick={() => navigate(`/report/${id}`)}
            type="button"
          >
            <HiOutlineChatAlt2 className="text-xl" />
            Comment
          </button>
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
    // eslint-disable-next-line
  }, [page]);

  const handleScroll = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  useBottomScrollListener(handleScroll);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-full md:max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Reports Feed</h1>
        </div>
        {data.map((item) => (
          <ReportCard
            key={item._id}
            id={item._id}
            createdAt={item.createdAt}
            location={item.location}
            images={item.images}
            description={item.original}
            reporter={`${item.reporter.firstName} ${item.reporter.lastName}`}
            avatar={item.reporter.avatar.url}
            navigate={navigate}
          />
        ))}
        {loading && <p className="text-center mt-4">Loading...</p>}
      </div>
    </div>
  );
};

export default FYP;
