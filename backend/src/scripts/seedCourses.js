const prisma = require("../prisma/client");

const courses = [
  {
    courseCode: "CSE101",
    name: "B.Tech Computer Science and Engineering",
    department: "Computer Science",
    degree: "B.Tech",
    description:
      "A comprehensive program covering programming, data structures, algorithms, databases, AI, and software engineering.",
    durationYears: 4,
    seatsAvailable: 120,
    tuitionFee: 180000,
    isActive: true,
  },
  {
    courseCode: "CSE102",
    name: "B.Tech Artificial Intelligence and Machine Learning",
    department: "Computer Science",
    degree: "B.Tech",
    description:
      "Focuses on artificial intelligence, machine learning, deep learning, data science, and intelligent systems.",
    durationYears: 4,
    seatsAvailable: 60,
    tuitionFee: 200000,
    isActive: true,
  },
  {
    courseCode: "CSE103",
    name: "B.Tech Cyber Security",
    department: "Computer Science",
    degree: "B.Tech",
    description:
      "Learn network security, ethical hacking, cryptography, digital forensics, and secure software development.",
    durationYears: 4,
    seatsAvailable: 60,
    tuitionFee: 190000,
    isActive: true,
  },
  {
    courseCode: "ECE101",
    name: "B.Tech Electronics and Communication Engineering",
    department: "Electronics",
    degree: "B.Tech",
    description:
      "Study electronic circuits, communication systems, embedded systems, signal processing, and hardware design.",
    durationYears: 4,
    seatsAvailable: 90,
    tuitionFee: 160000,
    isActive: true,
  },
  {
    courseCode: "MBA101",
    name: "Master of Business Administration",
    department: "Management",
    degree: "MBA",
    description:
      "Develop leadership, finance, marketing, business strategy, operations, and management skills.",
    durationYears: 2,
    seatsAvailable: 80,
    tuitionFee: 250000,
    isActive: true,
  },
  {
    courseCode: "MCA101",
    name: "Master of Computer Applications",
    department: "Computer Science",
    degree: "MCA",
    description:
      "Advanced postgraduate study in software development, databases, cloud computing, and application engineering.",
    durationYears: 2,
    seatsAvailable: 60,
    tuitionFee: 140000,
    isActive: true,
  },
  {
    courseCode: "BSC101",
    name: "B.Sc Computer Science",
    department: "Science",
    degree: "B.Sc",
    description:
      "Build foundations in computer science, programming, mathematics, databases, and computing technologies.",
    durationYears: 3,
    seatsAvailable: 100,
    tuitionFee: 80000,
    isActive: true,
  },
  {
    courseCode: "BCA101",
    name: "Bachelor of Computer Applications",
    department: "Computer Science",
    degree: "BCA",
    description:
      "An undergraduate program focused on computer applications, software development, web technologies, and IT.",
    durationYears: 3,
    seatsAvailable: 100,
    tuitionFee: 95000,
    isActive: true,
  },
];

const seedCourses = async () => {
  try {
    console.log("Starting course seeding...");

    for (const course of courses) {
      await prisma.course.upsert({
        where: {
          courseCode: course.courseCode,
        },
        update: course,
        create: course,
      });

      console.log(`Seeded: ${course.name}`);
    }

    console.log("\nCourse seeding completed successfully!");
    console.log(`Total courses processed: ${courses.length}`);
  } catch (error) {
    console.error("Course seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedCourses();