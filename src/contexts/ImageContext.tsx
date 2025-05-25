import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Status } from '../components/modal/StatusModal';

interface ImageContextType {
  capturedImage: string | null;
  selectedStatus: Status | null;
  selectedHashtag: string | null;
  setSelectedHashtag: (hashtag: string | null) => void;
  setSelectedStatus: (status: Status | null) => void;
  setCapturedImage: (uri: string | null) => void;
  clearAll: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

  const clearAll = () => {
    setCapturedImage(null);
    setSelectedStatus(null);
    setSelectedHashtag(null);
  }
  return (
    <ImageContext.Provider value=
      {{ capturedImage, 
      setCapturedImage,
      selectedStatus,
      setSelectedStatus,
      selectedHashtag,
      setSelectedHashtag,
      clearAll }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};