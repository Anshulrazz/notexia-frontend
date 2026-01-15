export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Economics',
  'Psychology',
  'Other',
]

export const FORUM_CATEGORIES = [
  'General Discussion',
  'Study Groups',
  'Career Advice',
  'Campus Life',
  'Tech Talk',
  'Research',
  'Events',
  'Other',
]

export const REPORT_REASONS = [
  'Spam or misleading',
  'Inappropriate content',
  'Harassment or bullying',
  'Copyright violation',
  'False information',
  'Other',
]

export const FILE_TYPES = {
  ALLOWED_NOTE_TYPES: ['.pdf', '.zip', '.doc', '.docx', '.ppt', '.pptx'],
  ALLOWED_IMAGE_TYPES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
}
