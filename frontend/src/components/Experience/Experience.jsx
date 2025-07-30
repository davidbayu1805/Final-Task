import React from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";

const WorkExperience = () => {
  const { darkMode } = useDarkMode();

  return (
    <div id="experience"
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-3 py-20 -mt-2">
        <div className="max-w-full mx-auto pt-3 mb-16">
          <h1 className="px-4 text-4xl lg:text-5xl font-bold mb-4 text-start lg:text-left">
            Work Experiences
          </h1>
        </div>

        <div className="px-4 max-w-full mx-auto space-y-10">
          <div
            className={`p-8 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
              <div className="md:-mt-[0px]">
                <img
                  className="w-16 h-16 rounded-lg object-contain bg-white flex-shrink-0"
                  src="/src/assets/dumbways.png"
                  alt="DumbWays Logo"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      Full Stack Web Developer
                    </h2>
                    <h3 className="text-xl text-green-400">
                      DumbWays Indonesia
                    </h3>
                  </div>
                  <div className="text-sm text-gray-400">
                    July 2025 – Present
                  </div>
                </div>

                <ul className="space-y-3 mt-4">
                  {[
                    "Students in Full Stack Development bootcamp",
                    "Studies JavaScript, React, Node.js, and related technologies",
                    "Code reviews and technical",
                    "Developing curriculum and learning materials",
                  ].map((item, index) => (
                    <li key={index} className="relative pl-4">
                      <div
                        className={`absolute left-0 top-2 w-2 h-2 rounded-full ${
                          darkMode ? "bg-gray-400" : "bg-gray-600"
                        }`}
                      ></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 px-4 py-2 text-sm mt-2 font-medium">
                  {["react", "express", "node.js", "psql", "tailwind"].map(
                    (item, index) => (
                      <div
                        key={index}
                        className={`rounded-full px-3 py-1 ${
                          darkMode
                            ? "bg-gray-700 text-gray-400"
                            : "bg-none text-gray-600"
                        }`}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-8 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
              <div className="md:-mt-[0px]">
                <img
                  className="w-16 h-16 rounded-lg object-contain bg-white flex-shrink-0"
                  src="/src/assets/zona.jpeg"
                  alt="Zona Media Logo"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      Full Stack Web Developer
                    </h2>
                    <h3 className="text-xl text-green-400">Zona Media Indonesia</h3>
                  </div>
                  <div className="text-sm text-gray-400">November 2024 – March 2025</div>
                </div>

                <ul className="space-y-3 mt-4">
                  {[
                    "Migrate from Laravel 5 to Laravel 11",
                    "Create new feature",
                    "QA",
                    "Developing clean code",
                  ].map((item, index) => (
                    <li key={index} className="relative pl-4">
                      <div
                        className={`absolute left-0 top-2 w-2 h-2 rounded-full ${
                          darkMode ? "bg-gray-400" : "bg-gray-600"
                        }`}
                      ></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 px-4 py-2 text-sm mt-2 font-medium">
                  {["JS", "TS", "PHP", "MYSQL", "CSS", "Bootstrap", "Laravel"].map(
                    (item, index) => (
                      <div
                        key={index}
                        className={`rounded-full px-3 py-1 ${
                          darkMode
                            ? "bg-gray-700 text-gray-400"
                            : "bg-none text-gray-600"
                        }`}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;