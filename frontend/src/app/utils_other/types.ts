import { Dayjs } from "dayjs";

export interface DimensionContextType {
  isLandscape: boolean;
  plus500h: boolean;
  plus768h: boolean;
  plus1080h: boolean;
  plus375: boolean;
  plus425: boolean;
  plus550: boolean;
  plus768: boolean;
  plus1024: boolean;
  plus1440: boolean;
}
export interface UserContextType {
  theme: "light" | "dark";
}

export interface AuthResponse {
  detail: string;
}
export interface ServerResponse {
  status: number;
  message: string;
}

// # ---------------------------- Login, Register, Auth ----------------------------#
export interface LoginGet {
  username: string;
  password: string;
}
export interface LoginResponse {
  access_token: string,
  token_type: string
}
export interface RegisterGet {
  username: string;
  email: string;
  password: string;
}

export interface ChangePasswordGet {
  new_password: string;
  old_password: string;
}
export interface Token {
  access_token: string;
  token_type: string;
}

// # ---------------------------- User ----------------------------#
export interface User {
  id: number;
  username: string;
  email: string;  
  updated_at: string;
  created_at: string;
}
export interface UserTasks extends User {
  tasks: Task[];
}
export interface UsersGet {
  type: "default" | "user_tasks";
}

// # ---------------------------- Tasks ----------------------------#
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  due_date: string | null;
  owner_id: number;
  updated_at: string;
  created_at: string;
}

export interface TasksIdCreate {
  title: string;
  description: string;
  completed: boolean;
  due_date: string | null;
}
export interface TasksIdGet {
  id: number;
}
export interface TasksIdUpdate extends TasksIdCreate {
  id: number;
}

export interface TasksGet {
  page: number;
  page_size: number;
  sort_by: "title" | "due_date" | "completed" | "created_at" | "updated_at";
  sort_type: "asc" | "desc";
}
export interface TasksIn {
  total: number;
  data: Task[];
}

// # ---------------------------- Contact Form ----------------------------#
export interface ContactFormGet {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactValues {
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
}
export interface ContactErrors {
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  global: string | null;
}

// # ---------------------------- Register Form ----------------------------#

export interface RegisterValues {
  username: string | null;
  email: string | null;
  password: string | null;
  confirm_password: string | null;
}

export interface RegisterErrors {
  username: string | null;
  email: string | null;
  password: string | null;
  confirm_password: string | null;
  global: string | null;
}

// # ---------------------------- Login Form ----------------------------#
export interface LoginValues {
  username: string | null;
  password: string | null;
}
export interface LoginErrors {
  username: string | null;
  password: string | null;
  global: string | null; 
}

// # ---------------------------- Task Create Form ----------------------------#
export interface TaskCreateValues {
  title: string | null;
  description: string | null;
  completed: boolean;
  due_date: string | null;
}
export interface TaskCreateErrors {
  title: string | null;
  description: string | null;
  completed: string | null;
  due_date: string | null;
  global: string | null;
}

// # ---------------------------- Task Update Form ----------------------------#
export interface TaskUpdateValues {
  title: string;
  description: string;
  completed: boolean;
  due_date: Dayjs | null;
}
export interface TaskUpdateErrors {
  title: string | null;
  description: string | null;
  completed: string | null;
  due_date: string | null;
  global: string | null;
}
