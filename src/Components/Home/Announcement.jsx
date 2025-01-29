import { Card, Button } from "@heroui/react";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";

const AnnouncementPage = forwardRef(function AnnouncementPage(props, ref) {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();

  const fetchAnnouncements = async () => {
    try {
      const response = await apiClient.get(`/announce/show`);
      console.log(response.data.announcement);
      setAnnouncements(response.data.announcement);
    } catch (error) {
      console.log(error);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchAnnouncements,
  }));

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-6">Announcements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {announcements.map((announcement, index) => (
          <Card
            key={index}
            className="p-6 bg-gray-200 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {announcement.title}
              </h3>
              <p className="text-gray-700 line-clamp-2">{announcement.description}</p>
            </div>
            <Button
              className="mt-4 bg-purple-500 text-white transition-colors duration-300 hover:bg-purple-600"
              onClick={() => navigate(`/announcement/${announcement._id}`)}
            >
              See more
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default AnnouncementPage;