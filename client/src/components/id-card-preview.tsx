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
  
  const captureRef3 = useRef<HTMLDivElement>(null);
  
  const handleDownloadCard = async () => {
    if (!studentData) return;
    
    try {
      let captureRef;
      
      if (template === "template1") {
        captureRef = captureRef1;
      } else if (template === "template2") {
        captureRef = captureRef2;
      } else {
        captureRef = captureRef3;
      }
      
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
    <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg transition-colors duration-200">
      <CardContent className="p-6">
        <h2 className="text-xl font-display font-semibold mb-4 dark:text-white transition-colors duration-200">ID Card Preview</h2>
        
        {/* Template 1: Blue Gradient Design */}
        <div
          id="idCardTemplate1"
          className={`card-template-1 mx-auto max-w-sm rounded-lg overflow-hidden shadow-xl ${
            template !== "template1" ? "hidden" : ""
          }`}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div id="captureArea1" className="relative" ref={captureRef1}>
            {/* Card Header */}
            <div className="card-gradient-3 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Unity School</h3>
                  <p className="text-xs opacity-90">Student Identification Card</p>
                </div>
                <div className="w-14 h-14">
                  {/* Logo Placeholder */}
                  <div className="bg-white rounded-full w-full h-full flex items-center justify-center shadow-md border-2 border-white/30">
                    <span className="bg-gradient-to-br from-blue-500 to-indigo-600 bg-clip-text text-transparent font-bold text-sm">UNITY</span>
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
        
        {/* Template 2: Purple Gradient Design */}
        <div
          id="idCardTemplate2"
          className={`card-template-2 mx-auto max-w-sm rounded-lg overflow-hidden shadow-xl ${
            template !== "template2" ? "hidden" : ""
          }`}
          style={{
            color: "white",
            border: "1px solid #6366f1",
          }}
        >
          <div id="captureArea2" className="relative card-gradient-1" ref={captureRef2}>
            {/* Card Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/20">
              <div>
                <h3 className="text-xl font-bold font-display tracking-wide">Unity School</h3>
                <div className="flex items-center mt-1">
                  <div className="h-1 w-8 bg-white/60 rounded-full mr-1"></div>
                  <div className="h-1 w-1 bg-white/60 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white rounded-full p-1.5 w-10 h-10 flex items-center justify-center shadow-lg">
                <span className="bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold text-sm">U</span>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="px-6 py-4">
              <div className="text-center mb-3">
                {/* Student Photo */}
                <div className="w-28 h-28 mx-auto bg-white rounded-full border-4 border-pink-400/50 overflow-hidden shadow-xl flex items-center justify-center">
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
                <h4 className="font-bold text-xl mt-3 text-white">
                  {studentData?.name || "Student Name"}
                </h4>
                <div className="text-white/80 text-sm">
                  <span>{studentData?.rollNumber || "---"}</span>
                  <span className="px-2 opacity-50">•</span>
                  <span>{studentData?.classDivision || "---"}</span>
                </div>
              </div>
              
              {/* Student Details */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4 border border-white/10 shadow-inner">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-white/70 text-xs uppercase tracking-wider">Rack Number</p>
                    <p className="font-medium text-white">{studentData?.rackNumber || "---"}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs uppercase tracking-wider">Bus Route</p>
                    <p className="font-medium text-white">{studentData?.busRoute || "---"}</p>
                  </div>
                </div>
                
                {/* Allergies Section (conditionally shown) */}
                {studentData?.allergies && studentData.allergies.length > 0 && (
                  <div className="mt-3 border-t border-white/20 pt-3">
                    <p className="text-white/70 text-xs uppercase tracking-wider mb-1.5">Allergies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {studentData.allergies.map((allergy) => (
                        <span 
                          key={allergy}
                          className="px-2.5 py-1 bg-pink-500/40 text-white rounded-full text-xs font-medium flex items-center shadow-sm"
                        >
                          <i className="ri-alert-line mr-1.5"></i>
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* QR Code Section */}
              <div className="mt-6 flex justify-center">
                <div className="p-1.5 bg-white rounded-lg w-28 h-28 flex items-center justify-center shadow-lg border border-pink-400/30">
                  {studentData ? (
                    <QRCodeSVG 
                      value={JSON.stringify(studentData)} 
                      size={98} 
                      level="M"
                      bgColor="#FFFFFF"
                      fgColor="#5D23B8"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100"></div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Card Footer */}
            <div className="border-t border-white/20 px-6 py-3 text-center text-xs">
              <p className="text-white/80">ID must be displayed at all times on campus</p>
              <p className="font-semibold mt-1 text-white">
                <span className="opacity-80">Unity School</span> 
                <span className="mx-2 opacity-50">•</span> 
                <span className="bg-gradient-to-r from-pink-300 to-purple-200 text-transparent bg-clip-text">Academic Year 2023-24</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Template 3: Green Gradient Design */}
        <div
          id="idCardTemplate3"
          className={`card-template-3 mx-auto max-w-sm rounded-lg overflow-hidden shadow-xl ${
            template !== "template3" ? "hidden" : ""
          }`}
          style={{
            color: "white",
            border: "1px solid #10b981",
          }}
        >
          <div id="captureArea3" className="relative card-gradient-4" ref={captureRef3}>
            {/* Card Header */}
            <div className="flex justify-between items-center px-6 py-4">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full border border-white/20">
                <h3 className="text-lg font-bold">UNITY SCHOOL</h3>
              </div>
              <div className="bg-white rounded-md p-1 w-12 h-12 flex items-center justify-center shadow-lg">
                <span className="bg-gradient-to-br from-green-500 to-blue-500 bg-clip-text text-transparent font-bold text-lg">U</span>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="px-6 py-4">
              <div className="flex">
                {/* Student Photo */}
                <div className="w-28 h-28 bg-white rounded-lg overflow-hidden shadow-lg border-2 border-teal-400/30 flex items-center justify-center">
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
                <div className="flex-1 ml-4">
                  <h4 className="font-bold text-xl text-white">
                    {studentData?.name || "Student Name"}
                  </h4>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-2 border border-white/10">
                    <div className="text-sm space-y-1.5">
                      <p className="flex items-center">
                        <span className="text-white/70 w-20 text-xs uppercase">Roll No:</span>
                        <span className="font-medium text-white">{studentData?.rollNumber || "---"}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="text-white/70 w-20 text-xs uppercase">Class:</span>
                        <span className="font-medium text-white">{studentData?.classDivision || "---"}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="text-white/70 w-20 text-xs uppercase">Rack No:</span>
                        <span className="font-medium text-white">{studentData?.rackNumber || "---"}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="text-white/70 w-20 text-xs uppercase">Bus Route:</span>
                        <span className="font-medium text-white">{studentData?.busRoute || "---"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Allergies Section (conditionally shown) */}
              {studentData?.allergies && studentData.allergies.length > 0 && (
                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <h5 className="text-xs font-semibold text-white/90 uppercase tracking-wider flex items-center">
                    <i className="ri-alert-line mr-1.5 text-yellow-300"></i>
                    Health Information
                  </h5>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {studentData.allergies.map((allergy) => (
                      <span 
                        key={allergy}
                        className="px-2.5 py-1 bg-teal-500/30 text-white rounded-md text-xs font-medium"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* QR Code Section */}
              <div className="mt-4 flex justify-center">
                <div className="p-2 bg-white rounded-md w-32 h-32 flex items-center justify-center shadow-lg border border-teal-400/30">
                  {studentData ? (
                    <QRCodeSVG 
                      value={JSON.stringify(studentData)} 
                      size={112} 
                      level="M"
                      bgColor="#FFFFFF"
                      fgColor="#0D9488"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100"></div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Card Footer */}
            <div className="px-6 py-3 text-center text-xs bg-white/5 backdrop-blur-sm border-t border-white/10">
              <p className="font-medium text-white/90">ID must be displayed at all times on campus</p>
              <p className="font-semibold mt-1">
                <span className="text-teal-300">Unity School</span> 
                <span className="mx-2 text-white/50">|</span> 
                <span className="text-white/80">Academic Year 2023-24</span>
              </p>
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
