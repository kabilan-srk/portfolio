// src/data/portfolioData.js
import profile from '../assets/KabilanSRK_cropped.jpeg'

export const portfolioData = {
  personal: {
    name: "KABILAN SRK",
    title: "ASSOCIATE SITE RELIABILITY ENGINEER",
    intro: "BUILDING RELIABILITY, ONE SERVICE AT A TIME.",
    subIntro: "SRE @ KISSFLOW · LEARNING IN PUBLIC",
    headshot: profile,
    resumeUrl: "https://drive.google.com/file/d/1mIQhm9bQ_tDJTxdiYVqNqkRoznYPznFp/view?usp=sharing"
  },
  experience: [
    {
      category: "ASSOCIATE SITE RELIABILITY ENGINEER",
      organization: "KISSFLOW",
      role: "FULL-TIME",
      duration: "2025 - PRESENT",
      achievements: [
        "LEARNING PRODUCTION SRE WORKFLOWS INCLUDING INCIDENT RESPONSE AND ON-CALL ROTATIONS",
        "EXPLORING GCP INFRASTRUCTURE, KUBERNETES CLUSTER OPERATIONS, AND CONTAINER LIFECYCLE MANAGEMENT",
        "STUDYING MONITORING AND OBSERVABILITY PATTERNS USING CLOUD MONITORING AND CLOUD LOGGING"
      ]
    },
    {
      category: "HEAD - PROJECT MANAGEMENT",
      organization: "LICET - PATTARAI",
      role: "CREW MEMBER",
      duration: "2023 - MAY 2026",
      achievements: [
        "MENTORED A TEAM OF STUDENTS AND SECURED SECOND PLACE IN SOFTWARE CATEGORY",
        "COORDINATED CROSS-FUNCTIONAL TEAMS ACROSS DESIGN, DEVELOPMENT, AND DEPLOYMENT TRACKS"
      ]
    }
  ],
  projects: [
    {
      name: "BUILD SOUND PLUGIN",
      description: "OPEN SOURCE JENKINS PLUGIN THAT PLAYS A SOUND AND OPTIONAL DESKTOP NOTIFICATION IN THE BROWSER OF THE USER WHO STARTED A BUILD WHEN IT FINISHES. OPT-IN PER USER, NO ADMIN CONFIG. HOSTING REQUEST OPEN WITH JENKINS-INFRA.",
      technologies: ["JAVA", "JENKINS", "GITHUB ACTIONS"],
      statusSource: { repo: "jenkins-infra/repository-permissions-updater", issue: 5450 },
      badge: "HOSTING REQUESTED",
      liveLabel: "[HOSTING REQUEST]",
      liveUrl: "https://github.com/jenkins-infra/repository-permissions-updater/issues/5450",
      githubUrl: "https://github.com/kabilan-srk/build-sound-plugin"
    }
  ],
  skills: {
    sre: [
      { name: "LINUX", level: 50 },
      { name: "DOCKER", level: 20 },
      { name: "KUBERNETES", level: 10 },
      { name: "GCP", level: 25 },
      { name: "HELM", level: 10 },
      { name: "TERRAFORM", level: 10 },
      { name: "JENKINS", level: 15 }
    ],
  },
  sreToolkit: {
    infrastructure: ["GCP", "KUBERNETES", "DOCKER", "HELM", "TERRAFORM"],
    observability: ["CLOUD MONITORING", "CLOUD LOGGING"],
    cicd: ["JENKINS", "GITHUB ACTIONS"],
    languages: ["PYTHON", "BASH", "JAVASCRIPT"],
    databases: ["MONGODB ATLAS", "SNOWFLAKE"]
  },
  learning: {
    current: [
      { topic: "KUBERNETES", resource: "OFFICIAL DOCS + KODEKLOUD", status: "in-progress" },
      { topic: "TERRAFORM", resource: "HASHICORP LEARN", status: "in-progress" }
    ],
    planned: [
      { topic: "PROMETHEUS + GRAFANA", resource: "TBD", status: "planned" },
      { topic: "ARGOCD / GITOPS", resource: "TBD", status: "planned" },
      { topic: "SLO ENGINEERING", resource: "GOOGLE SRE BOOK", status: "planned" }
    ],
  }
};
