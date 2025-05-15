import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Filter } from "bad-words";
import badWords from "filipino-badwords-list";
import { filterText } from "../../utils/filterText";

function SpecificReport() {
  const filter = new Filter({ list: badWords.array });
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await apiClient.get(`/report/admin/report/${id}`);
        setReport(response.data.report);
        setComments(response.data.report.comment || []);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleAddComment = async () => {
    try {
      const response = await apiClient.post(`/comment/${id}/comment`, {
        text: newComment,
      });
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const addEmoji = (emoji) => {
    setNewComment((prev) => prev + emoji.native);
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  if (!report) {
    return (
      <div className="text-center text-red-500 mt-10">
        Error: Report not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Details */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {report.original}
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            <span className="font-semibold">Location:</span> {report.location}
          </p>

          {/* Images with PhotoView */}
          <PhotoProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.images?.map((image, index) => (
                <PhotoView key={index} src={image.url}>
                  <img
                    src={image.url}
                    alt={`Report Image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
                  />
                </PhotoView>
              ))}
            </div>
          </PhotoProvider>
        </div>

        {/* Comments Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Comments</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-3 bg-gray-100 border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {comment.user?.firstName + " " + comment.user?.lastName ||
                        "Anonymous"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: filterText(comment?.content),
                    }}
                  ></p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No comments yet.</p>
            )}
          </div>

          {/* Add Comment Section */}
          <div className="mt-4 relative">
            <div className="relative">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows="3"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button
                className="absolute top-2 right-2 px-2 py-1 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-300"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                😊
              </button>
            </div>
            {showEmojiPicker && (
              <div className="absolute z-10 mt-2">
                <Picker data={data} onEmojiSelect={addEmoji} />
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
              onClick={handleAddComment}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecificReport;
