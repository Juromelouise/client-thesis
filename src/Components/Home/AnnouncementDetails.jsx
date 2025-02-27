import { useEffect, useState } from "react";
import { Card, Button, Spinner, Divider } from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import { PhotoView } from "react-photo-view";

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
    <div className="p-6">
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
        {announcement.picture && announcement.picture.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Images</h3>
      
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {announcement.picture.map((image, index) => (
                  <PhotoView key={index} src={image.url}>
                    <img
                      src={image.url}
                      alt={`Announcement Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                  </PhotoView>
                ))}
              </div>
          
          </div>
        )}
      </Card>
    </div>
  );
}

export default AnnouncementDetails;