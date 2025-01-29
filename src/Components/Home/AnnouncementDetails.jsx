import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Divider } from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";

function AnnouncementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const { data } = await apiClient.get(`/announce/show/${id}`);
        setAnnouncement(data.announcement);
      } catch (error) {
        console.error("Error fetching announcement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-lg font-semibold">
          Announcement not found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-14">
      <Card className="shadow-lg max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">{announcement.title}</h2>
          <Button
            className="transition-colors duration-300 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
        <Divider className="my-4" />
        <div className="mt-4">
          <p className="text-lg text-gray-700">{announcement.description}</p>
        </div>
      </Card>
    </div>
  );
}

export default AnnouncementDetails;