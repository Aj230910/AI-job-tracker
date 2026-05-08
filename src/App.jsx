import { useEffect, useState } from "react";
import axios from "axios";

export default function AIJobTrackerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] =
    useState("All");

  const [roleFilter, setRoleFilter] =
    useState("All");

  // SAVED JOBS

  const [savedJobs, setSavedJobs] =
    useState(() => {
      const stored =
        localStorage.getItem("savedJobs");

      return stored ? JSON.parse(stored) : [];
    });

  // JOB STATUS

  const [jobStatuses, setJobStatuses] =
    useState(() => {
      const stored =
        localStorage.getItem("jobStatuses");

      return stored ? JSON.parse(stored) : {};
    });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [search, locationFilter, roleFilter, jobs]);

  // SAVE TO LOCAL STORAGE

  useEffect(() => {
    localStorage.setItem(
      "savedJobs",
      JSON.stringify(savedJobs)
    );
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem(
      "jobStatuses",
      JSON.stringify(jobStatuses)
    );
  }, [jobStatuses]);

  // FETCH JOBS

  const fetchJobs = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "https://opensheet.elk.sh/1Wn5ad9G0JTLdpJ4CigAJEaD46iWBXXKp9M7iL9IDvKw/Sheet1"
      );

      const cleanedJobs = response.data.filter(
        (job) =>
          job["Job Title"] && job["Company"]
      );

      setJobs(cleanedJobs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // FILTER JOBS

  const filterJobs = () => {
    let updated = [...jobs];

    // SEARCH

    if (search) {
      updated = updated.filter(
        (job) =>
          job["Job Title"]
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          job["Company"]
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    // LOCATION FILTER

    if (locationFilter !== "All") {
      updated = updated.filter((job) =>
        job["Location"]?.includes(locationFilter)
      );
    }

    // ROLE FILTER

    if (roleFilter !== "All") {
      updated = updated.filter((job) => {
        const role =
          job["Job Title"]?.toLowerCase() || "";

        if (
          roleFilter === "Python Developer" &&
          role.includes("python")
        ) {
          return true;
        }

        if (
          roleFilter === "React Developer" &&
          role.includes("react")
        ) {
          return true;
        }

        if (
          roleFilter === "ML Engineer" &&
          (role.includes("machine learning") ||
            role.includes("ml"))
        ) {
          return true;
        }

        if (
          roleFilter === "Data Analyst" &&
          role.includes("data")
        ) {
          return true;
        }

        if (
          roleFilter === "Java Developer" &&
          role.includes("java")
        ) {
          return true;
        }

        if (
          roleFilter ===
            "Frontend Developer" &&
          role.includes("frontend")
        ) {
          return true;
        }

        if (
          roleFilter ===
            "Backend Developer" &&
          role.includes("backend")
        ) {
          return true;
        }

        if (
          roleFilter ===
            "Full Stack Developer" &&
          role.includes("full stack")
        ) {
          return true;
        }

        return false;
      });
    }

    setFilteredJobs(updated);
  };

  // SAVE JOB

  const handleSaveJob = (job) => {
    const exists = savedJobs.find(
      (item) =>
        item["Job Title"] ===
          job["Job Title"] &&
        item["Company"] === job["Company"]
    );

    if (exists) {
      alert("Job already saved 😄");
      return;
    }

    setSavedJobs([...savedJobs, job]);
  };

  // UPDATE STATUS

  const updateJobStatus = (
    job,
    status
  ) => {
    const key = `${job["Job Title"]}-${job["Company"]}`;

    setJobStatuses({
      ...jobStatuses,
      [key]: status,
    });
  };

  // GET STATUS

  const getJobStatus = (job) => {
    const key = `${job["Job Title"]}-${job["Company"]}`;

    return jobStatuses[key] || "Pending";
  };

  // MATCH

  const getMatchValue = (job) =>
    parseInt(job["Match"] || 80);

  const getMatchStyle = (val) => {
    if (val >= 80) {
      return {
        background: "#DCFCE7",
        color: "#166534",
      };
    }

    if (val >= 60) {
      return {
        background: "#FEF3C7",
        color: "#92400E",
      };
    }

    return {
      background: "#FEE2E2",
      color: "#991B1B",
    };
  };

  // STATS

  const totalJobs = filteredJobs.length;

  const highMatchCount = filteredJobs.filter(
    (job) => getMatchValue(job) >= 80
  ).length;

  const appliedCount = Object.values(
    jobStatuses
  ).filter(
    (status) => status === "Applied"
  ).length;

  const locations = [
    "All",
    ...new Set(
      jobs
        .map((job) => job["Location"])
        .filter(Boolean)
    ),
  ];

  // GROUP JOBS

  const groupedJobs = filteredJobs.reduce(
    (acc, job) => {
      const role =
        job["Job Title"] || "Other Jobs";

      let category = "Other Jobs";

      if (
        role.toLowerCase().includes("python")
      ) {
        category = "Python Developer";
      } else if (
        role.toLowerCase().includes("react")
      ) {
        category = "React Developer";
      } else if (
        role
          .toLowerCase()
          .includes("machine learning") ||
        role.toLowerCase().includes("ml")
      ) {
        category = "ML Engineer";
      } else if (
        role.toLowerCase().includes("data")
      ) {
        category = "Data Analyst";
      } else if (
        role.toLowerCase().includes("java")
      ) {
        category = "Java Developer";
      } else if (
        role
          .toLowerCase()
          .includes("frontend")
      ) {
        category = "Frontend Developer";
      } else if (
        role
          .toLowerCase()
          .includes("backend")
      ) {
        category = "Backend Developer";
      } else if (
        role
          .toLowerCase()
          .includes("full stack")
      ) {
        category = "Full Stack Developer";
      }

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(job);

      return acc;
    },
    {}
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right,#F8FAFC,#EEF2FF)",
        fontFamily: "Inter, sans-serif",
        color: "#111827",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #E5E7EB",
          padding: "20px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 900,
            }}
          >
            👨🏻‍💻  AI Job Tracker
          </h1>

          <p
            style={{
              color: "#6B7280",
            }}
          >
            Smart AI-powered dashboard
          </p>
        </div>

        <button
          onClick={fetchJobs}
          style={{
            background:
              "linear-gradient(135deg,#2563EB,#4F46E5)",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: "14px 22px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ↻ Refresh Jobs
        </button>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          padding: 30,
        }}
      >
        {[
          {
            label: "Total Jobs",
            value: totalJobs,
            color: "#111827",
          },
          {
            label: "High Match",
            value: highMatchCount,
            color: "#16A34A",
          },
          {
            label: "Applied",
            value: appliedCount,
            color: "#2563EB",
          },
          {
            label: "Saved Jobs",
            value: savedJobs.length,
            color: "#DC2626",
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 24,
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <p>{item.label}</p>

            <h2
              style={{
                color: item.color,
                fontSize: 38,
              }}
            >
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* FILTERS */}

      <div
        style={{
          margin: "0 30px 40px",
          background: "#fff",
          borderRadius: 24,
          padding: 22,
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search jobs..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            flex: 1,
            minWidth: 250,
            padding: 16,
            borderRadius: 14,
            border: "1px solid #D1D5DB",
          }}
        />

        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
          style={{
            padding: 16,
            borderRadius: 14,
          }}
        >
          <option>All</option>
          <option>Python Developer</option>
          <option>React Developer</option>
          <option>ML Engineer</option>
          <option>Data Analyst</option>
          <option>Java Developer</option>
          <option>
            Frontend Developer
          </option>
          <option>
            Backend Developer
          </option>
          <option>
            Full Stack Developer
          </option>
        </select>

        <select
          value={locationFilter}
          onChange={(e) =>
            setLocationFilter(e.target.value)
          }
          style={{
            padding: 16,
            borderRadius: 14,
          }}
        >
          {locations.map((loc, idx) => (
            <option key={idx}>{loc}</option>
          ))}
        </select>
      </div>

      {/* SAVED JOBS */}

      {savedJobs.length > 0 && (
        <div style={{ padding: "0 30px 40px" }}>
          <h2> Saved Jobs</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(320px,1fr))",
              gap: 20,
            }}
          >
            {savedJobs.map((job, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  padding: 22,
                }}
              >
                <h3>
                  {job["Job Title"]}
                </h3>

                <p>
                  🏢 {job["Company"]}
                </p>

                <p>
                  📍 {job["Location"]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JOBS */}

      <div style={{ padding: "0 30px 50px" }}>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 100,
            }}
          >
            Loading jobs...
          </div>
        ) : (
          Object.keys(groupedJobs).map(
            (category, catIndex) => (
              <div
                key={catIndex}
                style={{
                  marginBottom: 50,
                }}
              >
                <h2>
                   {category}
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill,minmax(370px,1fr))",
                    gap: 24,
                  }}
                >
                  {groupedJobs[category].map(
                    (job, index) => {
                      const match =
                        getMatchValue(job);

                      const badge =
                        getMatchStyle(match);

                      return (
                        <div
                          key={index}
                          style={{
                            background:
                              "#fff",
                            borderRadius: 28,
                            padding: 24,
                            boxShadow:
                              "0 15px 35px rgba(0,0,0,0.06)",
                          }}
                        >
                          {/* TOP */}

                          <div
                            style={{
                              display: "flex",
                              justifyContent:
                                "space-between",
                            }}
                          >
                            <div>
                              <h2>
                                {
                                  job[
                                    "Job Title"
                                  ]
                                }
                              </h2>

                              <p>
                                🏢{" "}
                                {
                                  job[
                                    "Company"
                                  ]
                                }
                              </p>

                              <p>
                                📍{" "}
                                {
                                  job[
                                    "Location"
                                  ]
                                }
                              </p>
                            </div>

                            <div
                              style={{
                                ...badge,
                                padding:
                                  "10px 14px",
                                borderRadius: 14,
                                fontWeight: 700,
                              }}
                            >
                              {match}% Match
                            </div>
                          </div>

                          {/* SALARY */}

                          <div
                            style={{
                              marginTop: 24,
                              background:
                                "#F9FAFB",
                              borderRadius: 18,
                              padding: 16,
                              display: "flex",
                              justifyContent:
                                "space-between",
                            }}
                          >
                            <span>
                              💰 Salary
                            </span>

                            <span>
                              {job[
                                "Salary"
                              ] ||
                                "Not Mentioned"}
                            </span>
                          </div>

                          {/* STATUS */}

                          <div
                            style={{
                              marginTop: 18,
                              display: "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 700,
                                color:
                                  getJobStatus(
                                    job
                                  ) ===
                                  "Applied"
                                    ? "#16A34A"
                                    : getJobStatus(
                                          job
                                        ) ===
                                      "Rejected"
                                    ? "#DC2626"
                                    : "#CA8A04",
                              }}
                            >
                              ●{" "}
                              {getJobStatus(
                                job
                              )}
                            </span>

                            <div
                              style={{
                                display:
                                  "flex",
                                gap: 10,
                              }}
                            >
                              <button
                                onClick={() =>
                                  updateJobStatus(
                                    job,
                                    "Applied"
                                  )
                                }
                                style={{
                                  border:
                                    "none",
                                  background:
                                    "#DCFCE7",
                                  color:
                                    "#166534",
                                  padding:
                                    "8px 12px",
                                  borderRadius: 10,
                                  cursor:
                                    "pointer",
                                }}
                              >
                                Applied
                              </button>

                              <button
                                onClick={() =>
                                  updateJobStatus(
                                    job,
                                    "Rejected"
                                  )
                                }
                                style={{
                                  border:
                                    "none",
                                  background:
                                    "#FEE2E2",
                                  color:
                                    "#991B1B",
                                  padding:
                                    "8px 12px",
                                  borderRadius: 10,
                                  cursor:
                                    "pointer",
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          </div>

                          {/* BUTTONS */}

                          <div
                            style={{
                              display: "flex",
                              gap: 14,
                              marginTop: 24,
                            }}
                          >
                            <a
                              href={
                                job[
                                  "Apply Link"
                                ]
                                  ? job[
                                      "Apply Link"
                                    ]?.startsWith(
                                      "http"
                                    )
                                    ? job[
                                        "Apply Link"
                                      ]
                                    : `https://${job["Apply Link"]}`
                                  : "#"
                              }
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                flex: 1,
                                textAlign:
                                  "center",
                                background:
                                  "linear-gradient(135deg,#2563EB,#4F46E5)",
                                color:
                                  "#ffffff",
                                padding:
                                  "15px",
                                borderRadius: 16,
                                textDecoration:
                                  "none",
                                fontWeight: 700,
                                opacity:
                                  job[
                                    "Apply Link"
                                  ]
                                    ? 1
                                    : 0.5,
                                pointerEvents:
                                  job[
                                    "Apply Link"
                                  ]
                                    ? "auto"
                                    : "none",
                              }}
                            >
                              🔗 Apply Now
                            </a>

                            <button
                              onClick={() =>
                                handleSaveJob(
                                  job
                                )
                              }
                              style={{
                                flex: 1,
                                background:
                                  "#16A34A",
                                color:
                                  "#ffffff",
                                border:
                                  "none",
                                borderRadius: 16,
                                fontWeight: 700,
                                cursor:
                                  "pointer",
                              }}
                            >
                               Save
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}