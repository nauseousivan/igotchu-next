// MCNP = Medical Colleges of Northern Philippines (health sciences)
// ISAP = International School of Asia and the Pacific (its twin school)
export const COLLEGES = {
  MCNP: [
    "BS Nursing",
    "BS Pharmacy",
    "BS Midwifery",
    "BS Physical Therapy",
    "BS Medical Laboratory Science",
    "BS Radiologic Technology",
  ],
  ISAP: [
    "BS Criminology",
    "BS Customs Administration",
    "BS Information Technology",
    "BS Business Administration",
    "BS Accountancy",
    "BS Computer Engineering",
    "BS Social Work",
    "BS Tourism Management",
    "BS Hospitality Management",
    "BS Secondary Education",
    "BS Psychology",
    "BS Physical Education",
    "Senior High School",
  ],
};

// autocomplete suggestions for the free-text subject field
export const SUBJECT_SUGGESTIONS = [
  "Anatomy & Physiology", "Microbiology", "Pharmacology", "Fundamentals of Nursing",
  "Maternal & Child Health", "Medical-Surgical Nursing", "Community Health Nursing",
  "Health Assessment", "Nutrition & Diet Therapy", "Biochemistry",
  "Criminal Jurisprudence", "Criminalistics", "Law Enforcement Administration",
  "Tariff & Customs Laws", "Accounting", "Programming", "Data Structures",
  "General Psychology", "Principles of Teaching", "Tourism Marketing",
  "Purposive Communication", "Understanding the Self", "Ethics",
];

export const TAGS = ["1st Sem", "2nd Sem", "Semis", "Intercession", "Prelims", "Midterms", "Finals", "NLE Review"];

export const ALLOWED_EXTENSIONS = ["pdf", "docx", "pptx", "jpg", "jpeg", "png", "zip"];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function collegeForCourse(course) {
  for (const [college, courses] of Object.entries(COLLEGES)) {
    if (courses.includes(course)) return college;
  }
  return null;
}
