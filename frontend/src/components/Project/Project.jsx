import React, { useState, useEffect } from 'react';
import ProjectService from '../../services/projectServices';
import { useDarkMode } from '../../contexts/DarkModeContext';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await ProjectService.getAllProjects();
        if (response.success) {
          const transformedProjects = response.data.map(project => ({
            ...project,
            name: project.project_name,
            description: project.description,
            technologies: project.technologies || [],
            github_link: project.github_link,
            demo_link: project.demo_link,
            image: project.image || null
          }));
          setProjects(transformedProjects);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`text-xl flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <i className="ri-loader-4-line animate-spin mr-2"></i>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full pt-8 pb-16 px-4 sm:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <h3 className={`text-3xl font-bold mb-12 text-start ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          My Project:
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Bagian Gambar tanpa gap atas/bawah */}
              <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-auto max-h-64 object-contain mx-auto block"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = darkMode 
                        ? 'https://via.placeholder.com/600x300/1F2937/FFFFFF?text=No+Image' 
                        : 'https://via.placeholder.com/600x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className={`w-full h-64 flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No Image Available
                    </span>
                  </div>
                )}
              </div>
              <h4 className={`font-bold text-sm mt-4 ml-6 sm:text-base ${
                  darkMode ? "text-white" : "text-black"
                }`}>
                  {project.name}
                </h4>
              
              <div className="p-6">
                <p className={`text-base mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {project.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex} 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-200' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <i className={`ri-github-fill text-base mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                    <span className="text-sm">
                      {project.github_link ? (
                        <a 
                          href={project.github_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} font-medium transition-colors`}
                        >
                          Repository
                        </a>
                      ) : (
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Private</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <i className={`ri-external-link-line text-base mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                    <span className="text-sm">
                      {project.demo_link ? (
                        <a 
                          href={project.demo_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} font-medium transition-colors`}
                        >
                          Live Demo
                        </a>
                      ) : (
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Not Deployed</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Project;