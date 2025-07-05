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
        setTotalReports(data.data ?? 0);
        setTotalPosts(data.data2 ?? 0);
        setRecentReports(data.report ?? []);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Animated Gradient */}
      <div className="relative h-60 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 animate-gradient-x">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 backdrop-blur-sm"></div>
          <div className="absolute -bottom-32 -right-24 w-80 h-80 rounded-full bg-white/5 backdrop-blur-sm"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
        </div>
        
        {/* Avatar with Glow Effect */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 z-10">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-indigo-400 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
            <Avatar
              src={user?.avatar?.url || "https://i.pravatar.cc/150?img=3"}
              size="2xl"
              bordered
              color="primary"
              className="relative ring-4 ring-white shadow-2xl transition-all duration-300 group-hover:ring-indigo-300 group-hover:scale-105"
              style={{ width: 128, height: 128, fontSize: 48 }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-24">
        {/* Profile Header with Glassmorphism Card */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-12 border border-white/20 text-center">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 to-white/30 -z-10"></div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{user?.email || ""}</p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium shadow-sm">
              {user?.role ?? "User"}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
            </span>
          </div>
          
          <Button 
            auto 
            color="primary" 
            className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 px-6 py-3"
          >
            Edit Profile
          </Button>
        </div>

        {/* Stats Cards with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-100 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider">Total Reports</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalReports}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-100 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider">Total Posts</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{totalPosts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-100 hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider">Account Role</p>
                <p className="text-3xl font-bold text-gray-800 mt-1 capitalize">{user?.role ?? "User"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Recent Reports
            </h2>
          </div>
          
          {recentReports.length === 0 ? (
            <div className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-500 mb-1">No reports yet</h3>
                <p className="text-gray-400 text-sm">Your submitted reports will appear here</p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentReports.slice(0, 5).map((report) => (
                <li key={report._id} className="hover:bg-gray-50/80 transition-colors duration-200">
                  <div className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <p className="text-sm font-semibold text-indigo-600 truncate">
                            {report.location || "Untitled Report"}
                          </p>
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                            {report.status || "Submitted"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {report.original}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                          {report.createdAt ? new Date(report.createdAt).toLocaleString() : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          {recentReports.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 text-right border-t border-gray-100">
              <Button 
                light 
                color="primary" 
                className="text-sm font-medium hover:underline"
              >
                View all reports
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}