import { FunctionComponent, ReactNode } from "react";

export interface FeatureOption {
  title: string;
  selected: boolean;
  default?: boolean;
}

export interface Feature {
  key: string;
  title: string;
  required: boolean;
  multiple: boolean;
  options: {
    [key: string]: FeatureOption;
  };
}

export interface User {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  subscriptionType?: string;
  email_verified_at?: string;
  photo?: string | null;
  role?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface Session {
  user: User;
  expires: string;
}

export interface Auth {
  user: User | null;
}

// Rest of your types remain the same
export interface File {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: File[] | null;
  content?: string;
  projectType?: string;
}

export interface FileSelectData {
  file: File;
  content: string;
  projectType: string;
}

// Message and prompt types
export interface Message {
  type: "user" | "assistant";
  text: string;
}

export interface Prompt {
  title: string;
  prompt: string;
}

// Framework and database types
export type FrameworkCategory =
  | "fullStack"
  | "frontend"
  | "isomorphic"
  | "mobile"
  | "backend";

export type DatabaseCategory = "pgsql" | "mysql";

// Configuration types
export interface Config {
  default: {
    frontend: string;
    backend: string;
    mobile: string;
    database: string;
  };
  frameworks: {
    [K in FrameworkCategory]: string[];
  };
  databases: string[];
}

// Next.js specific types
export interface PageProps<T = unknown> {
  params: {
    lang: string;
    [key: string]: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}
// API response types
export interface ApiResponse<T = any> {
  status: "success" | "error";
  message: string;
  data?: T;
}

// Component prop types
export interface ComponentBaseProps {
  className?: string;
  children?: ReactNode;
}

// Auth props for components that need auth
export interface AuthProps extends ComponentBaseProps {
  auth: Auth;
}

interface CraftComponent<P = {}> extends FunctionComponent<P> {
  craft?: any; // Define the shape of the craft property if you know it
}
