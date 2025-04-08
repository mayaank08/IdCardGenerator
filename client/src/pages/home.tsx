import { useState } from "react";
import StudentForm from "@/components/student-form";
import IDCardPreview from "@/components/id-card-preview";
import SavedCardsModal from "@/components/saved-cards-modal";
import { StudentData, CardTemplate } from "@/lib/types";
import { getSavedCards } from "@/lib/storage";

export default function Home() {
  const [formData, setFormData] = useState<StudentData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>("template1");
  const [showSavedCardsModal, setShowSavedCardsModal] = useState(false);
  const [refreshSavedCards, setRefreshSavedCards] = useState(0);

  // Force re-fetch of saved cards when a new card is saved
  const handleCardSaved = () => {
    setRefreshSavedCards(prev => prev + 1);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-primary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text-primary">Unity Student ID Generator</h1>
              <p className="text-gray-500 text-sm mt-1">Create beautiful, custom ID cards in seconds</p>
            </div>
            <button 
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary to-purple-500 hover:from-primary-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={() => setShowSavedCardsModal(true)}
            >
              <i className="ri-history-line mr-2"></i>
              View Saved Cards
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-1/2">
            <StudentForm 
              onSubmit={setFormData} 
              selectedTemplate={selectedTemplate} 
              onTemplateChange={setSelectedTemplate}
              onCardSaved={handleCardSaved}
            />
          </div>
          
          {/* ID Card Preview Section */}
          <div className="w-full lg:w-1/2">
            <IDCardPreview 
              studentData={formData} 
              template={selectedTemplate}
              onCardSaved={handleCardSaved}
            />
          </div>
        </div>
        
        {/* Colorful Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center mb-3">
              <i className="ri-shield-check-line text-2xl mr-2 opacity-80"></i>
              <h3 className="text-xl font-bold">Secure Identification</h3>
            </div>
            <p className="opacity-90">Integrated QR codes allow for secure, instant verification of student information.</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center mb-3">
              <i className="ri-paint-brush-line text-2xl mr-2 opacity-80"></i>
              <h3 className="text-xl font-bold">Custom Templates</h3>
            </div>
            <p className="opacity-90">Choose from multiple stunning designs to match your school's branding and style.</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center mb-3">
              <i className="ri-database-2-line text-2xl mr-2 opacity-80"></i>
              <h3 className="text-xl font-bold">Easy Management</h3>
            </div>
            <p className="opacity-90">Save generated ID cards for future reference and easy access whenever you need them.</p>
          </div>
        </div>
      </main>

      {/* Saved Cards Modal */}
      {showSavedCardsModal && (
        <SavedCardsModal 
          onClose={() => setShowSavedCardsModal(false)} 
          refreshTrigger={refreshSavedCards}
        />
      )}
    </div>
  );
}
