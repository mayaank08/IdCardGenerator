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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-display font-bold text-primary-500">Unity Student ID Generator</h1>
            <button 
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setShowSavedCardsModal(true)}
            >
              <i className="ri-history-line mr-2"></i>
              View Saved Cards
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
