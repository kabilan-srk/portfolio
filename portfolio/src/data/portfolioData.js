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
    tiers: [
      { id: "daily", label: "DAILY", items: ["GCP", "CLOUD LOGGING", "CLOUD MONITORING", "IAM"] },
      { id: "work", label: "USED AT WORK", items: ["JENKINS", "RUNDECK", "ATLANTIS", "HELM", "KUBERNETES", "SNOWFLAKE", "MONGODB ATLAS", "MAKE"] },
      { id: "learning", label: "LEARNING", items: ["TERRAFORM", "DOCKER", "PYTHON", "BASH", "JAVASCRIPT", "GITHUB ACTIONS"] }
    ]
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
