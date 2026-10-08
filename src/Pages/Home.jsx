import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "../styles/Home.css";

function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // Logged-out visitors just see the login prompt

    fetch("http://localhost:5000/api/courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCourses((data.courses || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />

      <main className="home">
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-content">
            <p className="hero-tag">YOUR DIGITAL LEARNING PLATFORM</p>

            <h1>
              Learn Without
              <span> Limits.</span>
            </h1>

            <p className="hero-description">
              Access your courses, lecture materials and learning resources from
              one simple and convenient platform.
            </p>

            <div className="hero-buttons">
              <Link to="/register">
                <button className="primary-btn">Get Started</button>
              </Link>
              <Link to="/courses">
                <button className="secondary-btn">Explore Courses</button>
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong>PDF & DOC</strong>
                <span>Course Files</span>
              </div>

              <div>
                <strong>Any Device</strong>
                <span>Phone or Computer</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Access</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="learning-card main-card">
              <div className="card-icon">📚</div>

              <p>Start Learning</p>

              <h3>Your Courses, One Place</h3>

              <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                Register to browse courses and download materials anytime.
              </p>
            </div>

            <div className="floating-card">
              <span>🎓</span>
              <div>
                <strong>Join E-Learn!</strong>
                <small>Free student accounts.</small>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <div className="section-heading">
            <p>WHY E-LEARN?</p>
            <h2>Everything you need to learn better.</h2>
            <span>
              A simple platform designed to make accessing educational resources
              easier for students.
            </span>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Course Materials</h3>
              <p>
                Access lecture notes, documents and other learning materials in
                one organized place.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Learn Anywhere</h3>
              <p>
                Access your learning resources conveniently from your computer
                or mobile device.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Easy Access</h3>
              <p>
                Find the materials you need quickly without searching through
                different platforms.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Student Focused</h3>
              <p>
                A simple and intuitive learning environment created with
                students in mind.
              </p>
            </div>
          </div>
        </section>

        {/* COURSES SECTION */}
        <section className="courses-section">
          <div className="section-heading courses-heading">
            <div>
              <p>EXPLORE COURSES</p>
              <h2>Available courses</h2>
            </div>

            <Link to="/courses">
              <button className="view-all-btn">View all courses →</button>
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="course-grid">
              {courses.map((course) => (
                <div className="course-card" key={course._id}>
                  <div className="course-image web-bg">
                    <span>
                      {course.code
                        .split(" ")
                        .map((w) => w.charAt(0))
                        .join("")
                        .slice(0, 3)
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className="course-content">
                    <span className="course-category">
                      {course.category || "Course"}
                    </span>
                    <h3>{course.title}</h3>
                    <p>Instructor: {course.instructor || "—"}</p>

                    <div className="course-footer">
                      <span>📖 {course.code}</span>
                      <Link
                        to={`/course-details/${encodeURIComponent(
                          `${course.title}|${course.code}`,
                        )}`}
                      >
                        <button>View →</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", padding: "2rem" }}>
              <Link to="/login">Log in</Link> to see the available courses.
            </p>
          )}
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section">
          <div className="section-heading">
            <p>HOW IT WORKS</p>
            <h2>Start learning in three simple steps.</h2>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <h3>Create an account</h3>
              <p>Register on the platform using your basic information.</p>
            </div>

            <div className="step">
              <div className="step-number">02</div>
              <h3>Choose your course</h3>
              <p>
                Browse available courses and select the one you want to study.
              </p>
            </div>

            <div className="step">
              <div className="step-number">03</div>
              <h3>Access materials</h3>
              <p>View and download course materials whenever you need them.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div>
            <p>READY TO START?</p>
            <h2>Your learning journey starts here.</h2>
            <span>
              Access your courses and learning materials from one platform.
            </span>
          </div>

          <Link to="/register">
            <button>Get Started →</button>
          </Link>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <h3>E-Learn</h3>
          <p>Making learning resources easier to access, manage and share.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <a href="/">Home</a>
            <a href="/courses">Courses</a>
            <a href="/about">About</a>
          </div>

          <div>
            <h4>Account</h4>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 E-Learn. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}

export default Home;