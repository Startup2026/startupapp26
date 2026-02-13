import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateProfileCompletion(profile: any) {
  if (!profile) return 0;
  let score = 0;
  const total = 10;

  // Helper to check if string is non-empty
  const isNotEmpty = (val: any) => typeof val === 'string' && val.trim().length > 0;

  // 1. Name
  if (isNotEmpty(profile.firstName) && isNotEmpty(profile.lastName)) score++;
  
  // 2. Email
  if (isNotEmpty(profile.email)) score++;
  
  // 3. Phone
  if (isNotEmpty(profile.phone)) score++;
  
  // 4. Bio
  if (isNotEmpty(profile.bio)) score++; 
  
  // 5. Education
  const hasEducation = (profile.education && Array.isArray(profile.education) && profile.education.length > 0 && isNotEmpty(profile.education[0].institution)) || isNotEmpty(profile.college);
  if (hasEducation) score++;
  
  // 6. Skills
  const skillsCount = Array.isArray(profile.skills) ? profile.skills.length : 0;
  if (skillsCount >= 1) score++;
  
  // 7. Interests
  const interestsCount = Array.isArray(profile.interests) ? profile.interests.length : 0;
  if (interestsCount >= 1) score++;
  
  // 8. Experience
  if (profile.experience && Array.isArray(profile.experience) && profile.experience.length > 0) score++;
  
  // 9. Links (Social)
  const hasLinks = !!(
    isNotEmpty(profile.githubUrl) || 
    isNotEmpty(profile.linkedinUrl) || 
    isNotEmpty(profile.portfolioUrl) || 
    (profile.links && (
      isNotEmpty(profile.links.github) || 
      isNotEmpty(profile.links.linkedin) || 
      isNotEmpty(profile.links.portfolio)
    ))
  );
  if (hasLinks) score++;
  
  // 10. Photo/Resume
  if (isNotEmpty(profile.profilepic) || isNotEmpty(profile.resumeUrl) || isNotEmpty(profile.resume)) score++;

  return Math.min(100, Math.round((score / total) * 100));
}
