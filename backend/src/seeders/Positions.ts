export const positionsList = [
    {
        id: 1,
        description: "President",
        parentId: null
    },
    // ===========================================================
    {
        id: 2,
        description: "Vice President for Administration and Finance Affairs",
        // نائب رئيس الجامعة للشؤون الإدارية والمالية
        parentId: 1
    },
    {
        id: 3,
        description: "Vice President for Academic Affairs", //Dr. Saed Mallak
        // نائب رئيس الجامعة للشؤون الاكاديمية
        parentId: 1
    },
    {
        description: "Registration and Admission",
        parentId: 3,
    },
    {
        description: "Deanship of Scientific Research",
        parentId: 3
    },
    {
        description: "Center for Creativity in Education",
        parentId: 3
    },
    {
        description: "Library",
        parentId: 3
    },
    {
        description: "Exams Department",
        parentId: 3
    },
    {
        description: "Library",
        parentId: 3
    },
    // ------------------------- 😎 -------------------------
    {
        description: "Assistant Vice President for Academic Affairs",
        // مساعد نائب رئيس الجامعة للشؤون الاكاديمية
        parentId: 3
    },
    {
        id: 40,
        description: "Deanship of Engineering College",
        parentId: 3, //Vice President for Academic Affairs
    },
    {
        id: 41,
        description: "Deanship of Applied Science College",
        parentId: 3, //Vice President for Academic Affairs
    },
    {
        id: 42,
        description: "Deanship of Economics College",
        parentId: 3, //Vice President for Academic Affairs
    },
    {
        id: 43,
        description: "Assistant Dean of Engineering",
        parentId: 40, //Deanship of Engineering College
    },
    {
        id: 44,
        description: "Department of Computer Systems Engineering",
        parentId: 40,
    },
    {
        id: 45,
        description: "Department of Building Engineering",
        parentId: 40,
    },
    {
        id: 46,
        description: "Department of Electrical Engineering",
        parentId: 40,
    },
    {
        id: 47,
        description: "Department of Mechanical Engineering",
        parentId: 40,
    },
    {
        id: 48,
        description: "Department of Telecom. Engineering",
        parentId: 40,
    },
    // ------------------------- 😎 -------------------------
    {
        description: "Faculty of Graduate Studies", // or Deanship of ...
        parentId: 3
    },
    {
        description: "Languages Center",
        parentId: 3
    },
    {
        id: 14,
        description: "Faculty of Engineering and Technology", // or Deanship of...
        parentId: 3
    },
    {
        description: "Faculty of Arts and Educational Sciences",
        parentId: 3
    },
    {
        description: "Faculty of Applied Sciences",
        parentId: 3
    },
    {
        description: "Faculty of Business and Economics",
        parentId: 3
    },
    {
        description: "Faculty of Agricultural Sciences and Technology",
        parentId: 3
    },
    // ===========================================================
    {
        description: "Assistant Vice President for Administrative & Financial Affairs",
        // مساعد نائب رئيس الجامعة للشؤون الإدارية والمالية
        parentId: 2
    },
    {
        description: "Deanship of Student Affairs",  // عمادة شؤون الطلبة
        parentId: 2, // parent = Head of Unit 
    },
    {
        description: "Department of finance",  //الدائرة المالية
        parentId: 2
    },
    {
        description: "Human Resources Department",
        parentId: 2
    },
    {
        description: "دائرة الديوان",
        parentId: 2
    },
    {
        description: "Standards and Metrology Center",
        parentId: 2
    },
    // ===========================================================
    {
        description: "Computer Systems Engineering",
        parentId: 14
    },
    {
        description: "Telecommunications Engineering",
        parentId: 14
    },
    {
        description: "Electrical Engineering",
        parentId: 14
    },
    {
        description: "Electrical Eng-Industrial Automation",
        parentId: 14
    },
    {
        description: "Mechanical Engineering",
        parentId: 14
    },
    {
        description: "Mechatronics Engineering",
        parentId: 14
    },
    {
        description: "Building Engineering",
        parentId: 14
    },
    {
        description: "Autotronics Engineering",
        parentId: 14
    },
    {
        id: 33,
        description: "Security and guarding department",
        parentId: 19, //Assistant Vice President for Administrative & Financial Affairs
    },
    {
        description: "Guard Division",
        parentId: 33, //Security and guarding department
    },
    {
        description: "Internal Security Devision",
        parentId: 33, //Security and guarding department
    },
];