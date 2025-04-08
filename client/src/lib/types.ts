export type CardTemplate = "template1" | "template2" | "template3";

export interface StudentData {
  name: string;
  rollNumber: string;
  classDivision: string;
  allergies?: string[];
  photo?: string;
  rackNumber: string;
  busRoute: string;
  createdAt: string;
}
