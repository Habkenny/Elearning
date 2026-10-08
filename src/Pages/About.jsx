import Navbar from "../Components/Navbar";
import "../styles/About.css";

function About() {
  return (
    <div className="about-page">
      <Navbar/>
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-label">WELCOME TO E-LEARN</span>

          <h1>
            Learning made
            <br />
            <span>simpler.</span> Smarter.
          </h1>

          <p>
            E-Learn is a digital learning platform designed to make course
            materials easier to access, organize, and manage — giving students
            a more convenient way to learn.
          </p>
        </div>
      </section>


      {/* INTRO */}
      <section className="about-intro">
        <span className="about-intro-small">
          ABOUT THE PLATFORM
        </span>

        <h2>
          One place for your courses, materials, and learning progress.
        </h2>

        <p>
          The E-Learning and Course Material Management System provides a
          centralized digital environment where students can explore their
          courses, access learning materials, and keep track of their academic
          progress.
        </p>
      </section>


      {/* WHY E-LEARN */}
      <section className="about-why">
        <div className="about-why-content">
          <span className="about-intro-small">
            WHY E-LEARN?
          </span>

          <h2>
            Designed to make the learning experience less stressful.
          </h2>

          <p>
            Finding course materials, keeping them organized, and knowing how
            much of your learning has been completed can become difficult when
            everything is scattered.
          </p>

          <p>
            E-Learn brings these activities together in one organized platform,
            allowing students to focus more on learning and less on searching
            for resources.
          </p>
        </div>

        <div className="about-why-box">
          <div>
            <strong>01</strong>
            <span>Access</span>
            <p>Find your learning materials in one place.</p>
          </div>

          <div>
            <strong>02</strong>
            <span>Learn</span>
            <p>Study your course materials whenever you need them.</p>
          </div>

          <div>
            <strong>03</strong>
            <span>Track</span>
            <p>Keep up with your learning and completed materials.</p>
          </div>
        </div>
      </section>


      {/* FEATURES */}
      <section className="about-features-section">
        <div className="about-heading">
          <span className="about-intro-small">
            EVERYTHING IN ONE PLACE
          </span>

          <h2>Built around the way students learn.</h2>

          <p>
            Simple tools that make accessing and managing learning resources
            easier.
          </p>
        </div>

        <div className="about-feature-grid">

          <div className="about-feature-card">
            <div className="about-feature-icon">01</div>

            <h3>Course Access</h3>

            <p>
              Browse available courses and easily find the subjects you are
              currently learning.
            </p>
          </div>


          <div className="about-feature-card">
            <div className="about-feature-icon">02</div>

            <h3>Learning Materials</h3>

            <p>
              Access organized course materials without having to search through
              different platforms.
            </p>
          </div>


          <div className="about-feature-card">
            <div className="about-feature-icon">03</div>

            <h3>Progress Tracking</h3>

            <p>
              Monitor completed learning materials and keep track of your
              learning progress.
            </p>
          </div>


          <div className="about-feature-card">
            <div className="about-feature-icon">04</div>

            <h3>Student Dashboard</h3>

            <p>
              Get a simple overview of courses, progress, materials, and recent
              learning activities.
            </p>
          </div>


          <div className="about-feature-card">
            <div className="about-feature-icon">05</div>

            <h3>Course Management</h3>

            <p>
              Administrators can create, edit, organize, and manage courses
              through the administrative dashboard.
            </p>
          </div>


          <div className="about-feature-card">
            <div className="about-feature-icon">06</div>

            <h3>Material Management</h3>

            <p>
              Administrators can manage learning resources and keep course
              materials organized.
            </p>
          </div>

        </div>
      </section>


      {/* LEARNING JOURNEY */}
      <section className="about-flow">

        <div className="about-flow-container">

          <div className="about-flow-heading">
            <span>THE LEARNING JOURNEY</span>

            <h2>
              From signing in to staying on track.
            </h2>

            <p>
              E-Learn keeps the learning process straightforward from the
              moment a student enters the platform.
            </p>
          </div>


          <div className="about-flow-grid">

            <div className="about-flow-card">
              <span className="about-flow-number">01</span>

              <h3>Sign In</h3>

              <p>
                Access your account and enter your personal learning space.
              </p>
            </div>


            <div className="about-flow-card">
              <span className="about-flow-number">02</span>

              <h3>Explore</h3>

              <p>
                Browse your available courses and discover their materials.
              </p>
            </div>


            <div className="about-flow-card">
              <span className="about-flow-number">03</span>

              <h3>Learn</h3>

              <p>
                Open your materials and study them directly through the
                platform.
              </p>
            </div>


            <div className="about-flow-card">
              <span className="about-flow-number">04</span>

              <h3>Track</h3>

              <p>
                Mark completed materials and monitor your learning progress.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* USERS */}
      <section className="about-users">

        <div className="about-users-heading">

          <span className="about-intro-small">
            MADE FOR TWO SIDES OF LEARNING
          </span>

          <h2>Students learn. Administrators manage.</h2>

          <p>
            Each side of the platform has the tools needed to make the system
            work smoothly.
          </p>

        </div>


        <div className="about-user-grid">

          <div className="about-user-card">

            <span className="about-user-tag">FOR STUDENTS</span>

            <h3>
              Your learning space.
            </h3>

            <p>
              Students can access courses, explore materials, view learning
              resources, track completed materials, and manage their personal
              learning activities from one dashboard.
            </p>

          </div>


          <div className="about-user-card">

            <span className="about-user-tag">FOR ADMINISTRATORS</span>

            <h3>
              Your management space.
            </h3>

            <p>
              Administrators can manage courses, learning materials, student
              information, and other important aspects of the platform through
              a dedicated dashboard.
            </p>

          </div>

        </div>

      </section>


      {/* FINAL */}
      <section className="about-final">

        <span>THE IDEA BEHIND E-LEARN</span>

        <h2>
          Better access to learning.
          <br />
          Better way to stay organized.
        </h2>

        <p>
          E-Learn was created with one simple goal: to bring learning resources
          together in a platform that is accessible, organized, and easy to
          use.
        </p>

      </section>

    </div>
  );
}

export default About;