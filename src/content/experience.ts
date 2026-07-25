import type { ExperienceGroup } from "@/content/schema";

/**
 * THREE discrete Discovery Partners Institute roles with exact LinkedIn
 * dates, per CONFLICT 1's resolution. The resume's merged Jun 2022 to Aug
 * 2024 span is deliberately NOT used anywhere.
 */
export const experience: ExperienceGroup[] = [
  {
    organization: "Discovery Partners Institute (University of Illinois System)",
    program: "Digital Scholars",
    location: "Chicago, IL",
    combinedSummary:
      "Selected three times across two years for the University of Illinois System's competitive Digital Scholars program, training in iOS development and applied data science, and teaching Swift to 100+ middle-school students across all cohorts.",
    roles: [
      {
        organization: "Discovery Partners Institute (University of Illinois System)",
        program: "Digital Scholars",
        title: "Student Intern",
        location: "Chicago, IL",
        startDate: "2023-06",
        endDate: "2023-08",
        description:
          "Worked across the data science track (data gathering, preparation, visualization, and machine learning), applying each on real projects rather than exercises, with an emphasis on ethical and responsible data practice.",
        skills: ["Python", "Data analysis", "Data visualization", "Machine learning"],
      },
      {
        organization: "Discovery Partners Institute (University of Illinois System)",
        program: "Digital Scholars",
        title: "Youth Mentor",
        location: "Chicago, IL",
        startDate: "2023-01",
        endDate: "2023-05",
        description:
          "Mentored a cohort of 25 middle-school students from zero programming experience to a working iOS app of their own. Teaching Swift and Python fundamentals to beginners forced a clarity in how I explain technical ideas that I've relied on ever since.",
        skills: ["Swift", "Python", "Mentorship", "Technical communication"],
      },
      {
        organization: "Discovery Partners Institute (University of Illinois System)",
        program: "Digital Scholars",
        title: "Summer Intern",
        location: "Chicago, IL",
        startDate: "2022-06",
        endDate: "2022-07",
        description:
          "First exposure to iOS development: Swift fundamentals and building user-facing applications end to end. This is where the mobile work started.",
        skills: ["Swift", "iOS development"],
      },
    ],
  },
];
