import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";

const Index = () => {
  const features = [
    {
      icon: <FaCheckCircle className="feature-icon" />,
      title: "Track Tasks Easily",
      description:
        "Create, organize, and complete your todos with an intuitive interface designed for productivity.",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: <FaClock className="feature-icon" />,
      title: "Never Miss Deadlines",
      description:
        "Set due dates and priorities to stay on top of your most important tasks.",
      color: "from-pink-500 to-orange-500",
    },
    {
      icon: <FaUsers className="feature-icon" />,
      title: "Collaborate Seamlessly",
      description:
        "Share todos with team members and track everyone's progress in real-time.",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <FaChartLine className="feature-icon" />,
      title: "Analyze Your Progress",
      description:
        "Get insights into your productivity patterns with beautiful analytics.",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="custom-landing-page">
      {/* Hero Section */}
      <section className="custom-hero-section">
        <div className="custom-hero-content">
          <h1 className="custom-hero-title">
            Manage Your <span className="custom-gradient-text">Todos</span> Like
            Never Before
          </h1>
          <p className="custom-hero-subtitle">
            The ultimate task management app to organize your life, boost
            productivity, and achieve your goals.
          </p>
          <div className="custom-hero-buttons">
            <Link to="/signup" className="custom-btn custom-btn-primary">
              Get Started Free <FaArrowRight />
            </Link>
            <Link to="/signin" className="custom-btn custom-btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
        <div className="custom-hero-visual">
          <div className="custom-floating-card custom-card-1">
            <span className="custom-status-dot completed"></span>
            <span>Complete project proposal</span>
          </div>
          <div className="custom-floating-card custom-card-2">
            <span className="custom-status-dot in-progress"></span>
            <span>Review team submissions</span>
          </div>
          <div className="custom-floating-card custom-card-3">
            <span className="custom-status-dot pending"></span>
            <span>Schedule client call</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="custom-features-section">
        <h2 className="custom-section-title">Why Choose TodoApp?</h2>
        <div className="custom-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="custom-feature-card">
              <div
                className={`custom-feature-icon-wrapper bg-gradient-to-r ${feature.color}`}
              >
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="custom-cta-section">
        <div className="custom-cta-content">
          <h2>Ready to Get Organized?</h2>
          <p>
            Join thousands of users who have transformed their productivity with
            TodoApp.
          </p>
          <Link
            to="/signup"
            className="custom-btn custom-btn-primary custom-btn-large"
          >
            Start Your Free Trial <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="custom-footer">
        <p>
          &copy; 2026 TodoApp. All rights reserved. Built with ❤️ for
          productivity.
        </p>
      </footer>
    </div>
  );
};

export default Index;
