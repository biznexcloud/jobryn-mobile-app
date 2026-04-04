import { UserRole } from '../constants/Roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'job_seeker' | 'recruiter';
  avatar?: string;
  headline?: string;
  location?: string;
  connections?: number;
  createdAt?: string;
}

export interface Job {
  id: number;
  company: number;
  company_name: string;
  title: string;
  description: string;
  location: string;
  job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experience_level: 'entry_level' | 'mid_level' | 'senior_level' | 'director' | 'executive';
  payment_type: 'yearly' | 'monthly' | 'hourly' | 'fixed';
  is_onsite: boolean;
  is_remote: boolean;
  salary_min: string | null;
  salary_max: string | null;
  currency: string;
  requirements: string;
  benefits: string;
  application_deadline: string | null;
  created_at: string;
}

export interface Application {
  id: number;
  job: number;
  job_title: string;
  status: 'applied' | 'screening' | 'online_meeting' | 'onsite_meeting' | 'hired' | 'rejected' | 'withdrawn';
  resume: string | null;
  cover_letter: string;
  expected_salary: string | null;
  rejection_reason: string;
  feedback_for_seeker: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  authorId: string;
  author?: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  reposts: number;
  postedAt: string;
}

export interface Message {
  id: string | number;
  senderId: string | number;
  receiverId: string | number;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface Conversation {
  id: string | number;
  participant: User;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Meeting {
  id: number;
  application: number;
  meeting_type: 'online' | 'in_person' | 'phone';
  meeting_type_display?: string;
  scheduled_at: string;
  meeting_link?: string | null;
  location_address?: string | null;
  duration_minutes?: number;
  agenda?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  status_display?: string;
  created_at?: string;
  updated_at?: string;
  // Helpful relational data the frontend might inject or expect
  job_title?: string;
  company_name?: string;
  seeker_name?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'connection' | 'job' | 'application';
  content: string;
  from?: User;
  read: boolean;
  createdAt: string;
}

export interface Analytics {
  totalUsers: number;
  activeJobs: number;
  totalApplications: number;
  conversionRate: string;
  profileViews?: number;
  searchAppearances?: number;
}

export interface RegisterData {
  email: string;
  password?: string;
  role: 'job_seeker' | 'recruiter';
  name?: string;
  company_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh?: string;
  user: User;
}

export interface Education {
  id?: number;
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string | null;
  grade?: string;
  activities_societies?: string;
  gpa_score?: string | null;
  description?: string;
  user?: number;
}

export interface Experience {
  id?: number;
  title: string;
  company_name: string;
  location?: string;
  start_date: string;
  end_date?: string | null;
  is_current?: boolean;
  description?: string;
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  location_type?: 'onsite' | 'hybrid' | 'remote';
  company_logo?: string | null;
  user?: number;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
}

export interface UserSkill {
  id?: number;
  skill: number;
  skill_name?: string;
  proficiency_level?: 'beginner' | 'intermediate' | 'expert' | 'master';
  years_of_experience?: number | null;
  endorsements_count?: number;
  user?: number;
}

export interface Project {
  id?: number;
  name: string;
  description: string;
  url?: string;
  role?: string;
  start_date: string;
  end_date?: string | null;
  repository_url?: string;
  user?: number;
}

export interface Certification {
  id?: number;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date?: string | null;
  credential_id?: string;
  credential_url?: string;
  is_expired?: boolean;
  user?: number;
}





