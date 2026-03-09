export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  posted: string;
  description: string;
  requirements: string[];
  applicants: number;
}
