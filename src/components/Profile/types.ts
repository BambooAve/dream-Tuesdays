export interface Profile {
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  gender: string | null;
  city: string | null;
  motivation: string | null;
  avatar_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  type: string;
  color: string | null;
  icon: string | null;
}

export interface Goal {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  priority: number | null;
  status: string;
}