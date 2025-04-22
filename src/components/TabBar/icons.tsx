import React from 'react';
import { AntDesign, Feather } from "@expo/vector-icons";

interface IconProps {
  color: string;
  size?: number;
}

// Define the object structure with proper typing
export const icons: Record<string, (props: IconProps) => JSX.Element> = {
  index: (props: IconProps) => <Feather name="camera" size={30} {...props} />,
  explore: (props: IconProps) => <Feather name="compass" size={30} {...props} />,
  profile: (props: IconProps) => <AntDesign name="user" size={30} {...props} />,
};