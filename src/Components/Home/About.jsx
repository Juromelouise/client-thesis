function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              About <span className="text-indigo-600">BoVo</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Empowering communities to create safer, more organized streets through technology
            </p>
          </div>
          <div className="w-24 h-1.5 bg-indigo-500 mx-auto rounded-full" />
          <div className="pt-4">
            <a
              href="/Bovo_App.apk"
              download
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Download App
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To empower communities and authorities by providing an accessible, transparent, and intelligent platform for reporting and managing road and street violations, fostering safer and more organized public spaces for everyone.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  To become the leading digital solution for urban road management, where technology and community collaboration create streets that are safe, orderly, and responsive to the needs of all.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What is BoVo Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">What is BoVo?</h2>
            <div className="space-y-5 text-gray-600">
              <p className="leading-relaxed">
                BoVo is a comprehensive platform designed to improve road and street spaces by enabling users to report illegal parking, obstructions, and other violations. The system leverages semantic analysis to classify reports, streamlining the process for both citizens and authorities.
              </p>
              <p className="leading-relaxed">
                Users can submit reports with images and locations, while administrators can review, manage, and resolve these reports. The platform also features user management, announcements, analytics, and a newsfeed for transparency and community engagement.
              </p>
              <p className="leading-relaxed">
                BoVo is accessible via web and mobile applications, making it easy for everyone to contribute to safer and more organized streets.
              </p>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-5">Key Features</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Real-time violation reporting",
                "AI-powered semantic analysis",
                "Multi-platform accessibility",
                "Transparent community engagement",
                "Comprehensive analytics dashboard",
                "User-friendly interface"
              ].map((feature, index) => (
                <div key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PDF Viewer Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Traffic Ordinance</h3>
          <p className="text-gray-600">Learn more about our local traffic regulations and policies:</p>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <iframe
              src="/Traffic_Code_Ordinance.pdf"
              width="100%"
              height="600px"
              className="border-0"
              title="Barangay Traffic Ordinance PDF"
            >
              <p className="text-gray-600 p-4">
                Your browser does not support PDFs.
                <a
                  href="/Traffic_Code_Ordinance.pdf"
                  className="text-indigo-600 hover:underline ml-1"
                >
                  Download the PDF instead.
                </a>
              </p>
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;