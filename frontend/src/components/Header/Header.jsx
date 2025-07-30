import React from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";

const HomePage = () => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-6xl mx-auto pt-6 md:pt-10">
          <div className="flex-shrink-0 mt-10 lg:mt-0">
            <div
              className={`relative w-64 h-64 lg:w-[320px] lg:h-[320px] rounded-xl transform transition duration-500 hover:scale-105 ${
                darkMode
                  ? "shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                  : "shadow-lg"
              }`}
            >
              <img
                src="/src/assets/profil.png"
                alt="David Profile"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left max-w-2xl mt-10 lg:mt-0">
            <h1 className="text-4xl lg:text-6xl font-bold mb-3 lg:mb-4">
              Hi, I'm David 👋
            </h1>
            <h2 className="text-xl lg:text-2xl font-medium mb-4 lg:mb-6 opacity-80">
              Data Scientist & Full-Stack Developer
            </h2>
            <p className="text-base lg:text-lg leading-relaxed mb-6 lg:mb-8 opacity-70">
              I am a Fullstack Web App Developer who builds and deploys web
              applications from the ground up to production. Focused on
              delivering end-to-end solutions, I enjoy transforming ideas into
              fully functional, scalable, and production-ready applications.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 lg:mb-5 opacity-70">
              <i className="ri-map-pin-line text-lg"></i>
              <span>Tuban, East Java, Indonesia</span>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6 lg:mb-8">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Available for new projects</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start">
              <a
                href="tel:+6281229108586"
                className="bg-green-600 hover:bg-green-700 text-white px-6 lg:px-8 py-2 lg:py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="ri-whatsapp-line text-xl"></i>
                Let's Talk
              </a>

              <a
                href="/public/CV.pdf"
                download
                className={`px-6 lg:px-8 py-2 lg:py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  darkMode
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <i className="ri-file-download-line text-lg"></i>
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;