import { Avatar, Card, Button } from "@heroui/react";
import React, { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [totalReports, setTotalReports] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await apiClient.get("/user/profile");
        setUser(data.user);
        setTotalReports(data.data ?? 0); // data.data is total reports + obstructions
        setTotalPosts(data.data2 ?? 0); // data.data2 is total posts
        setRecentReports(data.report ?? []);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pt-0">
      {/* Banner */}
      <div className="h-40 w-full bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {/* Avatar overlaps banner */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-24 z-10">
          <Avatar
            src={user?.avatar?.url || "https://i.pravatar.cc/150?img=3"}
            size="2xl"
            bordered
            color="primary"
            className="ring-4 ring-white shadow-lg"
            style={{ width: 128, height: 128, fontSize: 48 }} // <-- Add this line
          />
        </div>
      </div>
      <div className="max-w-3xl mx-auto p-4 mt-20">
        {/* Profile Info */}
        <Card className="shadow-lg rounded-lg p-6 mb-8 bg-white text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
          </h1>
          <p className="text-gray-600">{user?.email || ""}</p>
          <p className="text-gray-400 text-xs mt-1">
            Member since{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : ""}
          </p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">
            {user?.role ?? "User"}
          </span>
          <div className="mt-4">
            <Button auto flat color="primary">
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-blue-50 text-center py-4">
            <div className="text-3xl font-bold text-blue-600">
              {totalReports}
            </div>
            <div className="text-gray-500 text-sm">Total Reports</div>
          </Card>
          <Card className="bg-green-50 text-center py-4">
            <div className="text-3xl font-bold text-green-600">
              {totalPosts}
            </div>
            <div className="text-gray-500 text-sm">Posts</div>
          </Card>
          <Card className="bg-purple-50 text-center py-4">
            <div className="text-3xl font-bold text-purple-600 capitalize">
              {user?.role ?? "User"}
            </div>
            <div className="text-gray-500 text-sm">Role</div>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="shadow rounded-lg p-4 bg-white">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Recent Reports
          </h2>
          {recentReports.length === 0 ? (
            <div className="text-gray-400 text-center">No recent reports.</div>
          ) : (
            <ul className="divide-y">
              {recentReports.slice(0, 5).map((report) => (
                <li key={report._id} className="py-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <span className="font-medium text-gray-800">
                      {report.location || "Untitled Report"}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 md:mt-0">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleString()
                        : ""}
                    </span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    {report.original?.slice(0, 60)}
                    {report.original && report.original.length > 60
                      ? "..."
                      : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
