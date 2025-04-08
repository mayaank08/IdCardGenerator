import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentData, CardTemplate } from "@/lib/types";

const allergyOptions = ["Nuts", "Dairy", "Seafood", "Eggs"];

const classOptions = [
  "Class 1-A", "Class 1-B", 
  "Class 2-A", "Class 2-B",
  "Class 3-A", "Class 3-B"
];

const busRouteOptions = [
  "Route 1", "Route 2", "Route 3", "Route 4", "Route 5"
];

const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  classDivision: z.string().min(1, "Class & Division is required"),
  allergies: z.array(z.string()).optional(),
  photo: z.string().optional(),
  rackNumber: z.string().min(1, "Rack number is required"),
  busRoute: z.string().min(1, "Bus route is required"),
});

interface StudentFormProps {
  onSubmit: (data: StudentData) => void;
  selectedTemplate: CardTemplate;
  onTemplateChange: (template: CardTemplate) => void;
  onCardSaved: () => void;
}

export default function StudentForm({ 
  onSubmit, 
  selectedTemplate, 
  onTemplateChange,
  onCardSaved
}: StudentFormProps) {
  const { toast } = useToast();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Omit<StudentData, "createdAt">>({
    name: "",
    rollNumber: "",
    classDivision: "",
    allergies: [],
    photo: "",
    rackNumber: "",
    busRoute: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allergies: checked 
        ? [...(prev.allergies || []), allergy]
        : (prev.allergies || []).filter(a => a !== allergy)
    }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Photo must be less than 2MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const photoData = event.target.result as string;
          setPhotoPreview(photoData);
          setFormData(prev => ({ ...prev, photo: photoData }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setFormData(prev => ({ ...prev, photo: "" }));
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    try {
      studentSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setErrors(errorMap);
      }
      return false;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const completeData: StudentData = {
        ...formData,
        createdAt: new Date().toISOString(),
      };
      
      onSubmit(completeData);
      
      toast({
        title: "Success!",
        description: "Student ID Card has been generated",
      });
    } else {
      toast({
        title: "Form validation failed",
        description: "Please check the form for errors",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg transition-colors duration-200">
      <CardContent className="p-6">
        <h2 className="text-xl font-display font-semibold mb-4 dark:text-white transition-colors duration-200">Student Information</h2>
        <form onSubmit={handleSubmit}>
          {/* Student Name */}
          <div className="mb-4">
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. Jane Doe"
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          {/* Roll Number */}
          <div className="mb-4">
            <Label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Roll Number
            </Label>
            <Input
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. U2022001"
              required
            />
            {errors.rollNumber && <p className="text-red-500 text-xs mt-1">{errors.rollNumber}</p>}
          </div>
          
          {/* Class & Division */}
          <div className="mb-4">
            <Label htmlFor="classDivision" className="block text-sm font-medium text-gray-700 mb-1">
              Class & Division
            </Label>
            <Select
              value={formData.classDivision}
              onValueChange={(value) => handleSelectChange("classDivision", value)}
            >
              <SelectTrigger id="classDivision" className="w-full">
                <SelectValue placeholder="Select Class & Division" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.classDivision && <p className="text-red-500 text-xs mt-1">{errors.classDivision}</p>}
          </div>
          
          {/* Allergies */}
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Allergies
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {allergyOptions.map((allergy) => (
                <div key={allergy} className="flex items-center">
                  <Checkbox
                    id={`allergy-${allergy.toLowerCase()}`}
                    checked={(formData.allergies || []).includes(allergy)}
                    onCheckedChange={(checked) => 
                      handleAllergyChange(allergy, checked as boolean)
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <Label
                    htmlFor={`allergy-${allergy.toLowerCase()}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {allergy}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Photo Upload */}
          <div className="mb-4">
            <Label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              Photo Upload
            </Label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <i className="ri-image-add-line text-3xl text-gray-400"></i>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="photo" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          id="photo"
                          name="photo"
                          type="file"
                          ref={photoInputRef}
                          className="sr-only"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                  </div>
                </div>
              </div>
              
              {/* Photo Preview */}
              {photoPreview && (
                <div className="w-32 h-32 relative overflow-hidden rounded-md border border-gray-300 bg-gray-100">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-gray-500 hover:text-gray-700"
                    onClick={handleRemovePhoto}
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Rack Number */}
          <div className="mb-4">
            <Label htmlFor="rackNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Rack Number
            </Label>
            <Input
              id="rackNumber"
              name="rackNumber"
              value={formData.rackNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. R-42"
              required
            />
            {errors.rackNumber && <p className="text-red-500 text-xs mt-1">{errors.rackNumber}</p>}
          </div>
          
          {/* Bus Route Number */}
          <div className="mb-4">
            <Label htmlFor="busRoute" className="block text-sm font-medium text-gray-700 mb-1">
              Bus Route Number
            </Label>
            <Select
              value={formData.busRoute}
              onValueChange={(value) => handleSelectChange("busRoute", value)}
            >
              <SelectTrigger id="busRoute" className="w-full">
                <SelectValue placeholder="Select Bus Route" />
              </SelectTrigger>
              <SelectContent>
                {busRouteOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.busRoute && <p className="text-red-500 text-xs mt-1">{errors.busRoute}</p>}
          </div>
          
          {/* Template Selector */}
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
              ID Card Template
            </Label>
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <input
                  type="radio"
                  name="template"
                  id="template1"
                  value="template1"
                  className="sr-only peer"
                  checked={selectedTemplate === "template1"}
                  onChange={() => onTemplateChange("template1")}
                />
                <label
                  htmlFor="template1"
                  className="flex flex-col items-center p-2 text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:text-primary-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow"
                >
                  <span className="w-20 h-12 rounded card-gradient-3 border border-gray-200 dark:border-gray-700 mb-1 shadow-inner"></span>
                  <span className="text-xs font-medium">Blue Gradient</span>
                </label>
                {selectedTemplate === "template1" && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-xs"></i>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <input
                  type="radio"
                  name="template"
                  id="template2"
                  value="template2"
                  className="sr-only peer"
                  checked={selectedTemplate === "template2"}
                  onChange={() => onTemplateChange("template2")}
                />
                <label
                  htmlFor="template2"
                  className="flex flex-col items-center p-2 text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:text-primary-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow"
                >
                  <span className="w-20 h-12 rounded card-gradient-1 border border-gray-200 dark:border-gray-700 mb-1 shadow-inner"></span>
                  <span className="text-xs font-medium">Purple Gradient</span>
                </label>
                {selectedTemplate === "template2" && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-xs"></i>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <input
                  type="radio"
                  name="template"
                  id="template3"
                  value="template3"
                  className="sr-only peer"
                  checked={selectedTemplate === "template3"}
                  onChange={() => onTemplateChange("template3")}
                />
                <label
                  htmlFor="template3"
                  className="flex flex-col items-center p-2 text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:text-primary-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow"
                >
                  <span className="w-20 h-12 rounded card-gradient-4 border border-gray-200 dark:border-gray-700 mb-1 shadow-inner"></span>
                  <span className="text-xs font-medium">Green Gradient</span>
                </label>
                {selectedTemplate === "template3" && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-xs"></i>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <i className="ri-check-line mr-2"></i>
              Generate ID Card
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
