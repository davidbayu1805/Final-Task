import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";
import ProjectService from "../services/projectServices.js";
import AuthService from "../services/authService.js";
import { useDarkMode } from "../contexts/DarkModeContext.jsx";

const techIcons = {
  "React Js": "ri-reactjs-line",
  "Next Js": "ri-nextjs-line",
  "Node Js": "ri-nodejs-line",
  "Java Script":"ri-javascript-line",
  TypeScript: "ri-code-s-slash-line",
  PHP: "ri-php-line",
  Kotlin: "ri-android-line",
  Laravel: "ri-flask-line",
  Tailwind: "ri-palette-line",
  Python: "ri-python-line",
  Express: "ri-javascript-line",
  pgsql: "ri-database-2-line",
  mysql: "ri-database-line",
  mongodb: "ri-database-line",
  css: "ri-css3-line",
  bootstrap: "ri-bootstrap-line",
};

const MyProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    project_name: "",
    description: "",
    technologies: [],
    github_link: "",
    demo_link: "",
    image: null,
  });
  const [currentUser, setCurrentUser] = useState(null);
  const { darkMode } = useDarkMode();

  const fileInputRef = useRef(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please login to access My Projects",
        confirmButtonText: "Go to Login",
        background: darkMode ? "#1f2937" : "#fff",
        color: darkMode ? "#fff" : "#000",
      }).then(() => {
        window.location.href = "/login";
      });
      return;
    }

    setCurrentUser(user);
    loadProjects();
  }, [darkMode]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await ProjectService.getAllProjects();
      if (response.success) {
        const transformedProjects = response.data.map((project) => ({
          ...project,
          name: project.project_name,
          imagePreview: project.image || null,
          year: new Date(project.created_at).getFullYear(),
        }));
        setProjects(transformedProjects);
      }
    } catch (error) {
      if (error.message.includes("Session expired")) {
        handleSessionExpired();
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load projects: " + error.message,
        background: darkMode ? "#1f2937" : "#fff",
        color: darkMode ? "#fff" : "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSessionExpired = () => {
    AuthService.logout();
    Swal.fire({
      icon: "warning",
      title: "Session Expired",
      text: "Your session has expired. Please login again.",
      confirmButtonText: "Login",
      background: darkMode ? "#1f2937" : "#fff",
      color: darkMode ? "#fff" : "#000",
    }).then(() => {
      window.location.href = "/login";
    });
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        technologies: checked
          ? [...prev.technologies, value]
          : prev.technologies.filter((t) => t !== value),
      }));
    } else if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        try {
          if (!file.type.match("image.*")) {
            throw new Error("Only image files are allowed (JPEG, PNG, etc.)");
          }

          if (file.size > 2 * 1024 * 1024) {
            throw new Error("File size must be less than 2MB");
          }

          const base64 = await ProjectService.fileToBase64(file);
          setForm((prev) => ({
            ...prev,
            image: base64,
          }));
        } catch (error) {
          console.error("Error processing file:", error);
          Swal.fire({
            icon: "error",
            title: "Upload Error",
            text: error.message,
            background: darkMode ? "#1f2937" : "#fff",
            color: darkMode ? "#fff" : "#000",
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.project_name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Project name is required!",
        background: darkMode ? "#1f2937" : "#fff",
        color: darkMode ? "#fff" : "#000",
      });
      return;
    }

    try {
      setLoading(true);

      const projectData = {
        project_name: form.project_name,
        description: form.description || null,
        technologies: form.technologies,
        github_link: form.github_link || null,
        demo_link: form.demo_link || null,
        image: form.image,
        user_id: currentUser.id,
      };

      const response = await ProjectService.createProject(projectData);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Project created successfully!",
          timer: 1500,
          showConfirmButton: false,
          background: darkMode ? "#1f2937" : "#fff",
          color: darkMode ? "#fff" : "#000",
        });

        setForm({
          project_name: "",
          description: "",
          technologies: [],
          github_link: "",
          demo_link: "",
          image: null,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        await loadProjects();
      }
    } catch (error) {
      if (error.message.includes("Session expired")) {
        handleSessionExpired();
        return;
      }
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "Failed to create project: " +
          (error.response?.data?.message || error.message || "Unknown error"),
        background: darkMode ? "#1f2937" : "#fff",
        color: darkMode ? "#fff" : "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const project = projects[index];

    Swal.fire({
      title: "Edit Project",
      width: "42rem",
      html: `
      <div class="grid gap-4 text-left text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}">
        <div>
          <label class="block mb-2 font-semibold" for="swal-name">Project Name *</label>
          <input id="swal-name" type="text" value="${
            project.name || ""
          }" placeholder="Project Name"
            class="swal2-input ${
              darkMode ? "bg-gray-700 text-white" : "bg-white"
            } rounded-lg px-4 py-2 shadow-none !w-full ml-auto" style="margin-left:0px; box-shadow:none;"/>
        </div>

        <div>
          <label class="block mb-2 font-semibold" for="swal-github">GitHub Link (optional)</label>
          <input id="swal-github" type="url" value="${
            project.github_link || ""
          }" placeholder="Leave empty if private"
            class="swal2-input ${
              darkMode ? "bg-gray-700 text-white" : "bg-white"
            } rounded-lg px-4 py-2 shadow-none !w-full ml-auto" style="margin-left:0px; box-shadow:none;"/>
        </div>

        <div>
          <label class="block mb-2 font-semibold" for="swal-demo">Demo Link (optional)</label>
          <input id="swal-demo" type="url" value="${
            project.demo_link || ""
          }" placeholder="Leave empty if not deployed"
            class="swal2-input ${
              darkMode ? "bg-gray-700 text-white" : "bg-white"
            } rounded-lg px-4 py-2 shadow-none !w-full ml-auto" style="margin-left:0px; box-shadow:none;"/>
        </div>

        <div>
          <label class="block mb-2 font-semibold" for="swal-desc">Description</label>
          <textarea id="swal-desc" rows="4" placeholder="Description"
            class="swal2-textarea ${
              darkMode ? "bg-gray-700 text-white" : "bg-white"
            } rounded-lg px-4 py-2 shadow-none !w-full resize-none ml-auto" style="margin-left:0px; box-shadow:none;">${
              project.description || ""
            }</textarea>
        </div>

        <div>
          <label class="block mb-2 font-semibold">Technologies</label>
          <div class="grid grid-cols-2 gap-2">
            ${Object.keys(techIcons)
              .map(
                (tech) => `
                <label class="flex items-center ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }">
                  <input type="checkbox" class="swal-tech mr-2" value="${tech}" 
                    ${
                      (project.technologies || []).includes(tech)
                        ? "checked"
                        : ""
                    } />
                  ${tech}
                </label>
              `
              )
              .join("")}
          </div>
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      customClass: {
        confirmButton: `${
          darkMode ? "bg-gray-600 hover:bg-gray-700" : "bg-black hover:bg-gray-800"
        } text-white rounded-full px-6 py-2`,
        cancelButton: `${
          darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
        } text-black rounded-full px-6 py-2 ml-2`,
      },
      background: darkMode ? "#1f2937" : "#fff",
      color: darkMode ? "#fff" : "#000",
      preConfirm: async () => {
        try {
          const projectName = document.getElementById("swal-name").value.trim();
          const githubLink = document.getElementById("swal-github").value;
          const demoLink = document.getElementById("swal-demo").value;
          const description = document.getElementById("swal-desc").value.trim();

          const checkedTechs = Array.from(
            document.querySelectorAll(".swal-tech:checked")
          ).map((el) => el.value);

          if (!projectName) {
            Swal.showValidationMessage("Project name is required");
            return false;
          }

          const updatedData = {
            project_name: projectName,
            github_link: githubLink || null,
            demo_link: demoLink || null,
            description: description || null,
            technologies: checkedTechs,
            image: project.image || null,
          };

          const response = await ProjectService.updateProject(
            project.id,
            updatedData
          );

          if (response.success) {
            return true;
          } else {
            throw new Error(response.message || "Update failed");
          }
        } catch (error) {
          console.error("Update error:", error);
          Swal.showValidationMessage(`Update failed: ${error.message}`);
          return false;
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Project updated successfully!",
          timer: 1500,
          showConfirmButton: false,
          background: darkMode ? "#1f2937" : "#fff",
          color: darkMode ? "#fff" : "#000",
        });
        await loadProjects();
      }
    });
  };

  const handleDelete = (index) => {
    const project = projects[index];

    Swal.fire({
      title: "Are you sure?",
      text: "This project will be deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: darkMode ? "#4b5563" : "#9ca3af",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: darkMode ? "#1f2937" : "#fff",
      color: darkMode ? "#fff" : "#000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const response = await ProjectService.deleteProject(project.id);

          if (response.success) {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Project has been deleted",
              timer: 1500,
              showConfirmButton: false,
              background: darkMode ? "#1f2937" : "#fff",
              color: darkMode ? "#fff" : "#000",
            });
            await loadProjects();
          }
        } catch (error) {
          if (error.message.includes("Session expired")) {
            handleSessionExpired();
            return;
          }
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete project: " + error.message,
            background: darkMode ? "#1f2937" : "#fff",
            color: darkMode ? "#fff" : "#000",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleCardClick = (project) => {
    Swal.fire({
      title: `<strong style="font-size: 20px; color: ${
        darkMode ? "#fff" : "#000"
      }">${project.name}</strong>`,
      html: `
      <div class="swal-flex-container" style="display: flex; gap: 16px; align-items: flex-start;">
        ${
          project.imagePreview
            ? `
          <img 
            src="${project.imagePreview}" 
            class="swal-flex-image"
            style="width: 250px; height: auto; border-radius: 8px; object-fit: cover; margin-top: 4px;"
          />
        `
            : `<div class="swal-flex-image" style="width: 250px; height: 150px; background-color: ${
                darkMode ? "#374151" : "#f0f0f0"
              }; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: ${
                darkMode ? "#9ca3af" : "#666"
              };">No Image</div>`
        }
        
        <div class="swal-flex-content" style="text-align: left; font-size: 10px; padding-top: 4px; flex: 1; margin-left: 8px; color: ${
          darkMode ? "#d1d5db" : "#374151"
        }">
          <div style="margin-bottom: 10px;">
            ${
              project.github_link
                ? `
              <a href="${project.github_link}" target="_blank" style="display: flex; align-items: center; gap: 6px; color: ${
                  darkMode ? "#60a5fa" : "#0366d6"
                }; text-decoration: none;">
                <i class="ri-github-fill"></i> GitHub Repository
              </a>
            `
                : `
              <div style="display: flex; align-items: center; gap: 6px; color: ${
                darkMode ? "#9ca3af" : "#666"
              };">
                <i class="ri-github-fill"></i> Private Repository
              </div>
            `
            }
            ${
              project.demo_link
                ? `
              <a href="${project.demo_link}" target="_blank" style="display: flex; align-items: center; gap: 6px; color: ${
                  darkMode ? "#60a5fa" : "#0366d6"
                }; text-decoration: none; margin-top: 6px;">
                <i class="ri-external-link-line"></i> Live Demo
              </a>
            `
                : `
              <div style="display: flex; align-items: center; gap: 6px; color: ${
                darkMode ? "#9ca3af" : "#666"
              }; margin-top: 6px;">
                <i class="ri-external-link-line"></i> Not Deployed
              </div>
            `
            }
          </div>
          <p style="margin-bottom: 6px; font-weight: 600;">Technologies</p>
          <div style="display: flex; flex-wrap: wrap; column-gap: 20px; row-gap: 8px;">
            ${(project.technologies || [])
              .map(
                (tech) => `
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; min-height: 24px; color: ${
                    darkMode ? "#d1d5db" : "#374151"
                  }">
                      <i class="${
                        techIcons[tech] || "ri-code-line"
                      }" style="font-size: 14px;"></i> ${tech}
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      </div>

      <div style="margin-top: 20px; max-height: 200px; overflow-y: auto; text-align: justify; font-size: 14px; color: ${
        darkMode ? "#d1d5db" : "#374151"
      }">
        ${project.description || "No description available."}
      </div>
    `,
      customClass: {
        popup: `rounded-lg text-left ${darkMode ? "bg-gray-800" : "bg-white"}`,
      },
      showConfirmButton: false,
      showCloseButton: true,
      closeButtonHtml: `<i class="ri-close-line" style="color: ${
        darkMode ? "#fff" : "#000"
      }"></i>`,
      background: darkMode ? "#1f2937" : "#fff",
      focusConfirm: false,
    });
  };

  if (loading && projects.length === 0) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}>
        <div className={`text-xl flex items-center ${
          darkMode ? "text-white" : "text-black"
        }`}>
          <i className="ri-loader-4-line animate-spin mr-2"></i>
          Loading...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}>
        <div className={`text-xl ${
          darkMode ? "text-white" : "text-black"
        }`}>Redirecting to login...</div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen px-4 sm:px-8 md:px-12 overflow-x-hidden ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}>
        <h2 className={`text-2xl sm:text-3xl mt-24 font-bold text-center mb-6 sm:mb-8 ${
          darkMode ? "text-white" : "text-black"
        }`}>
          ADD MY PROJECT
        </h2>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto grid gap-4">
          <div>
            <label
              className={`block mb-2 font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="project_name"
            >
              Project Name *
            </label>
            <input
              id="project_name"
              name="project_name"
              type="text"
              placeholder="Project Name"
              value={form.project_name}
              onChange={handleChange}
              className={`rounded-lg px-4 py-2 shadow w-full ${
                darkMode ? "bg-gray-700 text-white" : "bg-white"
              }`}
              required
            />
          </div>

          <div>
            <label
              className={`block mb-2 font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="github_link"
            >
              GitHub Link (optional)
            </label>
            <input
              id="github_link"
              name="github_link"
              type="url"
              placeholder="Leave empty if project is private"
              value={form.github_link}
              onChange={handleChange}
              className={`rounded-lg px-4 py-2 shadow w-full ${
                darkMode ? "bg-gray-700 text-white" : "bg-white"
              }`}
            />
            <p className={`text-xs mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Leave blank if repository is private
            </p>
          </div>

          <div>
            <label
              className={`block mb-2 font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="demo_link"
            >
              Demo Link (optional)
            </label>
            <input
              id="demo_link"
              name="demo_link"
              type="url"
              placeholder="Leave empty if not deployed yet"
              value={form.demo_link}
              onChange={handleChange}
              className={`rounded-lg px-4 py-2 shadow w-full ${
                darkMode ? "bg-gray-700 text-white" : "bg-white"
              }`}
            />
            <p className={`text-xs mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Leave blank if project isn't deployed
            </p>
          </div>

          <div>
            <label
              className={`block mb-2 font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className={`rounded-lg px-4 py-2 shadow resize-none w-full ${
                darkMode ? "bg-gray-700 text-white" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className={`block mb-2 font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Technologies
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Object.keys(techIcons).map((tech) => (
                <label key={tech} className={`flex items-center ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <input
                    type="checkbox"
                    value={tech}
                    checked={form.technologies.includes(tech)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {tech}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={`block mb-2 font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Upload Image
            </label>
            <div
              className={`flex justify-between items-center px-4 py-2 rounded-md shadow-md cursor-pointer ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
              onClick={() => fileInputRef.current.click()}
            >
              <span className={`px-3 py-1 rounded text-sm truncate max-w-[70%] ${
                darkMode ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-800"
              }`}>
                {form.image ? "Image selected" : "Click to upload image"}
              </span>
              <i className={`ri-image-add-line text-xl ml-4 ${
                darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"
              } transition`} />
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              ref={fileInputRef}
              className="hidden"
            />
            {form.image && (
              <div className={`mt-2 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                <i className="ri-check-line text-green-500 mr-1"></i>
                Image ready to upload (max 2MB)
              </div>
            )}
          </div>

          <div className="flex justify-end mb-10">
            <button
              type="submit"
              disabled={loading}
              className={`rounded-full px-6 py-2 transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              } ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-black text-white"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className={`w-full pt-5 pb-12 px-2 sm:px-4 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}>
        <h3 className={`text-2xl font-semibold mb-6 text-center ${
          darkMode ? "text-white" : "text-black"
        }`}>MY PROJECT</h3>
        {projects.length === 0 ? (
          <div className={`text-center ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            No projects found. Create your first project above!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 justify-items-center">
            {projects.map((p, idx) => (
              <div
                key={p.id || idx}
                className={`rounded-xl shadow-md p-4 w-full max-w-xs cursor-pointer hover:shadow-xl transition duration-300 ${
                  darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white"
                }`}
                onClick={() => handleCardClick(p)}
              >
                {p.imagePreview && (
                  <img
                    src={p.imagePreview}
                    alt="project"
                    className="w-full aspect-[4/3] object-cover rounded-lg mb-3"
                  />
                )}
                <h4 className={`font-bold text-sm sm:text-base ${
                  darkMode ? "text-white" : "text-black"
                }`}>
                  {p.name}
                </h4>
                <div className="flex gap-2 mt-2">
                  {p.github_link ? (
                    <a
                      href={p.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs hover:underline ${
                        darkMode ? "text-blue-400" : "text-blue-500"
                      }`}
                    >
                      <i className="ri-github-fill mr-1"></i> GitHub
                    </a>
                  ) : (
                    <span className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      <i className="ri-github-fill mr-1"></i> Private
                    </span>
                  )}
                  {p.demo_link ? (
                    <a
                      href={p.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs hover:underline ${
                        darkMode ? "text-blue-400" : "text-blue-500"
                      }`}
                    >
                      <i className="ri-external-link-line mr-1"></i> Demo
                    </a>
                  ) : (
                    <span className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      <i className="ri-external-link-line mr-1"></i> Not Deployed
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-2 line-clamp-3 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  {p.description}
                </p>

                <div className={`flex gap-3 text-xl mt-3 ${
                  darkMode ? "text-gray-300" : "text-black"
                }`}>
                  {(p.technologies || []).slice(0, 3).map((tech, techIdx) => (
                    <i
                      key={techIdx}
                      className={techIcons[tech] || "ri-code-line"}
                    />
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-[5px] mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(idx);
                    }}
                    disabled={loading}
                    className={`text-sm px-4 py-1 rounded w-full sm:w-1/2 disabled:opacity-50 ${
                      darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(idx);
                    }}
                    disabled={loading}
                    className={`text-sm px-4 py-1 rounded w-full sm:w-1/2 disabled:opacity-50 ${
                      darkMode
                        ? "bg-red-700 text-white hover:bg-red-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyProject;