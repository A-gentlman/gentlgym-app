export interface UserProfile {
  id: string;
  full_name?: string;
  age?: number;
  gender?: string;
  height?: string;
  weight?: string;
  primary_goal?: string;
  activity_level?: string;
  training_experience?: string;
  daily_calorie_goal?: number;
  daily_protein_goal?: number;
  daily_water_goal?: number;
  completed_onboarding: boolean;
  created_at: string;
  updated_at: string;
}
