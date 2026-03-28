import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    // titre onglet
    document.title = `${title} | Groupe l'Atelier`;
  }, [title]);
}