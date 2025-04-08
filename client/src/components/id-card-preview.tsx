import { useRef, useState, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { StudentData, CardTemplate } from "@/lib/types";
import { saveCard } from "@/lib/storage";

interface IDCardPreviewProps {
  studentData: StudentData | null;
  template: CardTemplate;
  onCardSaved: () => void;
}

export default function IDCardPreview({ studentData, template, onCardSaved }: IDCardPreviewProps) {
  const { toast } = useToast();
  const captureRef1 = useRef<HTMLDivElement>(null);
  const captureRef2 = useRef<HTMLDivElement>(null);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  
  useEffect(() => {
    // Show download button when student data is available
    if (studentData) {
      setShowDownloadButton(true);
      
      // Automatically save the card to localStorage
      saveCard(studentData);
      onCardSaved();
    }
  }, [studentData, onCardSaved]);
  
  const handleDownloadCard = async () => {
    if (!studentData) return;
    
    try {
      const captureRef = template === "template1" ? captureRef1 : captureRef2;
      if (!captureRef.current) return;
      
      const dataUrl = await htmlToImage.toPng(captureRef.current, {
        quality: 1.0,
        pixelRatio: 2
      });
      
      // Create download link
      const link = document.createElement("a");
      link.download = `unity-id-${studentData.name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Success!",
        description: "ID Card downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to download ID card",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="bg-white shadow-md rounded-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-display font-semibold mb-4">ID Card Preview</h2>
        
        {/* Template 1: Classic Design */}
        <div
          id="idCardTemplate1"
          className={`card-template-1 mx-auto max-w-sm rounded-lg overflow-hidden shadow-lg ${
            template !== "template1" ? "hidden" : ""
          }`}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div id="captureArea1" className="relative" ref={captureRef1}>
            {/* Card Header */}
            <div className="bg-primary-500 px-6 py-3 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Unity School</h3>
                  <p className="text-xs">Student Identification Card</p>
                </div>
                <div className="w-12 h-12">
                  {/* Logo Placeholder */}
                  <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
                    <span className="text-primary-500 font-bold text-xs">UNITY</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="px-6 py-4">
              <div className="flex">
                {/* Student Photo */}
                <div className="w-24 h-32 bg-gray-100 border border-gray-200 mr-4 flex items-center justify-center">
                  {studentData?.photo ? (
                    <img 
                      src={studentData.photo} 
                      alt="Student" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <i className="ri-user-3-line text-3xl text-gray-400"></i>
                  )}
                </div>
                
                {/* Student Details */}
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800">
                    {studentData?.name || "Student Name"}
                  </h4>
                  <div className="text-sm space-y-1 mt-1">
                    <p className="flex items-center">
                      <span className="text-gray-500 w-24">Roll Number:</span>
                      <span className="font-medium">{studentData?.rollNumber || "---"}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-500 w-24">Class & Div:</span>
                      <span className="font-medium">{studentData?.classDivision || "---"}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-500 w-24">Rack Number:</span>
                      <span className="font-medium">{studentData?.rackNumber || "---"}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-500 w-24">Bus Route:</span>
                      <span className="font-medium">{studentData?.busRoute || "---"}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Allergies Section (conditionally shown) */}
              {studentData?.allergies && studentData.allergies.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <h5 className="text-sm font-semibold text-gray-700 flex items-center">
                    <i className="ri-alert-line mr-1 text-secondary-600"></i>
                    Allergies
                  </h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {studentData.allergies.map((allergy) => (
                      <span 
                        key={allergy} 
                        className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* QR Code Section */}
              <div className="mt-4 flex justify-center">
                <div className="p-2 border border-gray-200 rounded-md w-24 h-24 bg-white flex items-center justify-center">
                  {studentData ? (
                    <QRCodeSVG 
                      value={JSON.stringify(studentData)} 
                      size={88} 
                      level="M"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100"></div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Card Footer */}
            <div className="bg-gray-50 px-6 py-2 text-center text-xs text-gray-500">
              <p>This card must be carried at all times while on campus.</p>
              <p className="font-semibold mt-1">Unity School, Academic Year 2023-24</p>
            </div>
          </div>
        </div>
        
        {/* Template 2: Modern Design */}
        <div
          id="idCardTemplate2"
          className={`card-template-2 mx-auto max-w-sm rounded-lg overflow-hidden shadow-lg ${
            template !== "template2" ? "hidden" : ""
          }`}
          style={{
            background: "linear-gradient(135deg, #3949AB 0%, #232C67 100%)",
            color: "white",
            border: "1px solid #3949AB",
          }}
        >
          <div id="captureArea2" className="relative" ref={captureRef2}>
            {/* Card Header */}
            <div className="flex justify-between items-center px-6 py-3 border-b border-primary-400">
              <h3 className="text-lg font-bold font-display">Unity School</h3>
              <div className="bg-white rounded-full p-1 w-8 h-8 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xs">U</span>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="px-6 py-4">
              <div className="text-center mb-3">
                {/* Student Photo */}
                <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-white overflow-hidden shadow-md flex items-center justify-center">
                  {studentData?.photo ? (
                    <img 
                      src={studentData.photo} 
                      alt="Student" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <i className="ri-user-3-line text-3xl text-gray-400"></i>
                  )}
                </div>
                <h4 className="font-bold text-xl mt-2">
                  {studentData?.name || "Student Name"}
                </h4>
                <div className="text-primary-200 text-sm">
                  <span>{studentData?.rollNumber || "---"}</span> • 
                  <span>{studentData?.classDivision || "---"}</span>
                </div>
              </div>
              
              {/* Student Details */}
              <div className="bg-primary-600/50 rounded-lg p-3 mt-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-primary-200">Rack Number</p>
                    <p className="font-medium">{studentData?.rackNumber || "---"}</p>
                  </div>
                  <div>
                    <p className="text-primary-200">Bus Route</p>
                    <p className="font-medium">{studentData?.busRoute || "---"}</p>
                  </div>
                </div>
                
                {/* Allergies Section (conditionally shown) */}
                {studentData?.allergies && studentData.allergies.length > 0 && (
                  <div className="mt-3 border-t border-primary-400 pt-2">
                    <p className="text-primary-200">Allergies</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {studentData.allergies.map((allergy) => (
                        <span 
                          key={allergy}
                          className="px-2 py-1 bg-white/10 text-white rounded text-xs flex items-center"
                        >
                          <i className="ri-alert-line mr-1 text-secondary-300"></i>
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* QR Code Section */}
              <div className="mt-4 flex justify-center">
                <div className="p-2 bg-white rounded-md w-24 h-24 flex items-center justify-center">
                  {studentData ? (
                    <QRCodeSVG 
                      value={JSON.stringify(studentData)} 
                      size={88} 
                      level="M"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100"></div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Card Footer */}
            <div className="border-t border-primary-400 px-6 py-2 text-center text-xs text-primary-200">
              <p>ID must be displayed at all times on campus</p>
              <p className="font-semibold mt-1">Academic Year 2023-24</p>
            </div>
          </div>
        </div>
        
        {/* Download Button */}
        {showDownloadButton && (
          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              onClick={handleDownloadCard}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
            >
              <i className="ri-download-2-line mr-2"></i>
              Download ID Card
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
