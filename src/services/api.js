// ── AI Personality Analysis ───────────────────────────────────────────────
export async function analyzePersonality(answers) {
  // Return mock data directly as all AI processing runs client-side / mock fallback
  return getMockPersonality();
}

// ── AI Job Matching ───────────────────────────────────────────────────────
export async function matchJobs(personality) {
  return getMockJobs();
}

// ── AI Roadmap Generation ─────────────────────────────────────────────────
export async function generateRoadmap(personality, selectedJob) {
  return getMockRoadmap();
}

// ── Mock Data (development fallback) ──────────────────────────────────────
function getMockPersonality() {
  return {
    type: "The Strategic Innovator",
    strengths: [
      "Analytical thinking with creative problem-solving",
      "Strong ability to see the big picture",
      "Natural leadership under pressure",
      "Quick adaptation to new technologies",
    ],
    weaknesses: [
      "May overthink simple decisions",
      "Can be impatient with slower processes",
      "Sometimes neglects routine tasks for innovation",
    ],
    workStyle:
      "You thrive in dynamic environments where you can combine strategic thinking with hands-on problem solving. You prefer autonomy but collaborate well when the stakes are high.",
    traits: {
      analytical: 85,
      creative: 78,
      leadership: 72,
      communication: 68,
      technical: 90,
      adaptability: 82,
    },
  };
}

function getMockJobs() {
  return {
    jobs: [
      {
        title: "AI/ML Engineer",
        match: 95,
        salary: "$130k – $200k",
        description:
          "Design and deploy machine learning models that power intelligent systems.",
        skills: ["Python", "TensorFlow", "MLOps", "Data Pipelines"],
        growth: "Very High",
      },
      {
        title: "Full-Stack Product Engineer",
        match: 88,
        salary: "$120k – $180k",
        description:
          "Build end-to-end products from database to pixel-perfect UI with a product mindset.",
        skills: ["React", "Node.js", "PostgreSQL", "System Design"],
        growth: "High",
      },
      {
        title: "Solutions Architect",
        match: 82,
        salary: "$140k – $220k",
        description:
          "Design scalable cloud architectures for enterprise clients and lead technical strategy.",
        skills: ["AWS/GCP", "Microservices", "Kubernetes", "IaC"],
        growth: "High",
      },
      {
        title: "Data Engineering Lead",
        match: 76,
        salary: "$125k – $190k",
        description:
          "Build robust data pipelines and analytics infrastructure at scale.",
        skills: ["Spark", "Airflow", "dbt", "Data Modeling"],
        growth: "High",
      },
      {
        title: "Developer Experience Engineer",
        match: 71,
        salary: "$110k – $170k",
        description:
          "Improve developer productivity by building internal tools, CLIs, and platform abstractions.",
        skills: ["Go/Rust", "CI/CD", "API Design", "Documentation"],
        growth: "Emerging",
      },
    ],
  };
}

function getMockRoadmap() {
  return {
    timeline: "6 months",
    phases: [
      {
        week: "1–2",
        title: "Foundations",
        tasks: [
          "Complete Python advanced course",
          "Set up ML development environment",
          "Study linear algebra & statistics refresher",
        ],
      },
      {
        week: "3–6",
        title: "Core ML Skills",
        tasks: [
          "Complete Andrew Ng's ML Specialization",
          "Build 3 supervised learning projects",
          "Learn scikit-learn and pandas deeply",
        ],
      },
      {
        week: "7–12",
        title: "Deep Learning",
        tasks: [
          "Master TensorFlow/PyTorch fundamentals",
          "Build a CNN image classifier",
          "Implement an NLP sentiment analyzer",
          "Study transformer architecture",
        ],
      },
      {
        week: "13–18",
        title: "MLOps & Production",
        tasks: [
          "Learn Docker & Kubernetes for ML",
          "Build an end-to-end ML pipeline",
          "Deploy a model to cloud (GCP/AWS)",
          "Implement monitoring and A/B testing",
        ],
      },
      {
        week: "19–24",
        title: "Portfolio & Job Prep",
        tasks: [
          "Build 2 portfolio-worthy projects",
          "Contribute to open-source ML project",
          "Practice system design interviews",
          "Apply to 20+ positions",
        ],
      },
    ],
  };
}
