import type { Education } from "@/content/schema";

/** SDSU appears exactly ONCE (CONFLICT 5) with "Expected May 2028" (CONFLICT 4). */
export const education: Education[] = [
  {
    school: "San Diego State University",
    location: "San Diego, CA",
    credential: "B.S. Computer Science",
    detail: "GPA 3.85 / 4.0",
    startDate: "2024-08",
    endDate: "2028-05",
    endLabel: "Expected May 2028",
    coursework: [
      "Data Structures",
      "Computer Organization & Assembly",
      "Discrete Mathematics",
      "Algorithms",
    ],
  },
  {
    school: "Lane Technical College Prep High School",
    location: "Chicago, IL",
    credential: "High School Diploma, Computer Science",
    startDate: "2020-08",
    endDate: "2024-06",
    coursework: [],
  },
];
