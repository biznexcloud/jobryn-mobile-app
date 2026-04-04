export const Roles = {
  JOB_SEEKER: 'jobSeeker',
  JOB_PROVIDER: 'jobProvider',
} as const;

export type UserRole = typeof Roles[keyof typeof Roles];

export const RoleLabels: Record<UserRole, string> = {
  jobSeeker: 'Job Seeker',
  jobProvider: 'Job Provider',
};





