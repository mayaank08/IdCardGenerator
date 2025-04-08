import { StudentData } from "./types";

const STORAGE_KEY = "unity_saved_id_cards";

export function getSavedCards(): StudentData[] {
  try {
    const savedCardsJson = localStorage.getItem(STORAGE_KEY);
    if (!savedCardsJson) return [];
    
    const savedCards = JSON.parse(savedCardsJson);
    return Array.isArray(savedCards) ? savedCards : [];
  } catch (error) {
    console.error("Error retrieving saved cards:", error);
    return [];
  }
}

export function saveCard(card: StudentData): void {
  try {
    const savedCards = getSavedCards();
    
    // Check if card with same roll number already exists
    const existingCardIndex = savedCards.findIndex(c => c.rollNumber === card.rollNumber);
    
    if (existingCardIndex !== -1) {
      // Replace existing card
      savedCards[existingCardIndex] = card;
    } else {
      // Add new card
      savedCards.push(card);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCards));
  } catch (error) {
    console.error("Error saving card:", error);
  }
}

export function deleteCard(card: StudentData): void {
  try {
    const savedCards = getSavedCards();
    const filteredCards = savedCards.filter(c => 
      c.rollNumber !== card.rollNumber || c.createdAt !== card.createdAt
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCards));
  } catch (error) {
    console.error("Error deleting card:", error);
  }
}
