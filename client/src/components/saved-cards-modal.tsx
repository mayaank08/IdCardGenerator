import { useEffect, useState } from "react";
import * as htmlToImage from "html-to-image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { StudentData } from "@/lib/types";
import { getSavedCards, deleteCard } from "@/lib/storage";

interface SavedCardsModalProps {
  onClose: () => void;
  refreshTrigger: number;
}

export default function SavedCardsModal({ onClose, refreshTrigger }: SavedCardsModalProps) {
  const { toast } = useToast();
  const [savedCards, setSavedCards] = useState<StudentData[]>([]);
  
  useEffect(() => {
    setSavedCards(getSavedCards());
  }, [refreshTrigger]);
  
  const handleDownloadSavedCard = async (card: StudentData) => {
    try {
      // Create a temporary div to render the card
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      
      // Create the card content - simplified version for download
      tempDiv.innerHTML = `
        <div style="width: 350px; padding: 16px; background: white; color: black; font-family: Arial, sans-serif;">
          <div style="background: #3949AB; color: white; padding: 12px; text-align: center;">
            <h3 style="margin: 0; font-size: 18px;">Unity School ID Card</h3>
          </div>
          <div style="padding: 16px; display: flex;">
            ${card.photo ? `<img src="${card.photo}" alt="Student" style="width: 80px; height: 100px; object-fit: cover; margin-right: 12px;" />` : ''}
            <div>
              <h4 style="margin: 0 0 8px 0; font-size: 18px;">${card.name}</h4>
              <p style="margin: 4px 0; font-size: 14px;">Roll: ${card.rollNumber}</p>
              <p style="margin: 4px 0; font-size: 14px;">Class: ${card.classDivision}</p>
              <p style="margin: 4px 0; font-size: 14px;">Rack: ${card.rackNumber}</p>
              <p style="margin: 4px 0; font-size: 14px;">Bus: ${card.busRoute}</p>
              ${card.allergies && card.allergies.length > 0 
                ? `<p style="margin: 4px 0; font-size: 14px;">Allergies: ${card.allergies.join(', ')}</p>` 
                : ''
              }
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      try {
        const dataUrl = await htmlToImage.toPng(tempDiv, {
          quality: 1.0,
          pixelRatio: 2
        });
        
        // Create download link
        const link = document.createElement("a");
        link.download = `unity-id-${card.name.replace(/\s+/g, "-").toLowerCase()}.png`;
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
      } finally {
        document.body.removeChild(tempDiv);
      }
    } catch (error) {
      console.error("Error generating card:", error);
      toast({
        title: "Error",
        description: "Failed to generate card for download",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteSavedCard = (card: StudentData) => {
    deleteCard(card);
    setSavedCards(getSavedCards());
    toast({
      title: "Card deleted",
      description: `ID card for ${card.name} has been removed`,
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };
  
  return (
    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4">
        <div className="px-4 pt-5 pb-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Saved ID Cards</h3>
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          
          {savedCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCards.map((card, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-primary-500 px-3 py-2 text-white flex justify-between items-center">
                    <h4 className="text-sm font-semibold truncate">{card.name}</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="text-white hover:text-gray-200"
                        onClick={() => handleDownloadSavedCard(card)}
                      >
                        <i className="ri-download-2-line"></i>
                      </button>
                      <button
                        type="button"
                        className="text-white hover:text-gray-200"
                        onClick={() => handleDeleteSavedCard(card)}
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center">
                      {card.photo ? (
                        <div className="w-12 h-12 bg-gray-100 mr-3 flex-shrink-0">
                          <img
                            src={card.photo}
                            alt="Student"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 mr-3 flex-shrink-0 flex items-center justify-center">
                          <i className="ri-user-3-line text-gray-400"></i>
                        </div>
                      )}
                      <div className="text-sm">
                        <p className="font-semibold">{card.rollNumber}</p>
                        <p className="text-gray-600">{card.classDivision}</p>
                        <p className="text-gray-500 text-xs">
                          Created on: {formatDate(card.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="ri-folder-info-line text-4xl text-gray-300"></i>
              <p className="mt-2 text-gray-500">No saved ID cards found</p>
              <p className="text-sm text-gray-400">Generate an ID card to save it for later</p>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <Button
            type="button"
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
