import { Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

interface ConfirmButtonProps {
  buttonActive: boolean;
  setIsConfirmButtonPressed: (isPressed: boolean) => void;
  arrow?: boolean;
}

export default function ConfirmButton({ buttonActive, setIsConfirmButtonPressed, arrow = true }: ConfirmButtonProps) {

  const currentStyle = buttonActive
    ? activeStyle.active
    : activeStyle.inactive;
  
  const handlePress = () => {
    console.log("Confirm button pressed");
    setIsConfirmButtonPressed(true);
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: currentStyle.backgroundColor }]}
      onPress={handlePress}
      disabled={!buttonActive}
    >
      <Text style={[styles.text, { color: currentStyle.textColor }]}>
        Tiếp tục
      </Text>
      {arrow && (
        <svg
          width="24"
          height="18"
          viewBox="0 0 24 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.4964 10.0629C24.1661 9.47695 24.1661 8.52539 23.4964 7.93945L14.925 0.439453C14.2554 -0.146484 13.1679 -0.146484 12.4982 0.439453C11.8286 1.02539 11.8286 1.97695 12.4982 2.56289L18.15 7.50352H1.71429C0.766071 7.50352 0 8.17383 0 9.00352C0 9.8332 0.766071 10.5035 1.71429 10.5035H18.1446L12.5036 15.4441C11.8339 16.0301 11.8339 16.9816 12.5036 17.5676C13.1732 18.1535 14.2607 18.1535 14.9304 17.5676L23.5018 10.0676L23.4964 10.0629Z"
          fill="#848080"
          />
        </svg>
      )}
    </TouchableOpacity>
  );
}

const activeStyle = {
  active: {
    backgroundColor: "#FFC877",
    textColor: "#000000",
  },
  inactive: {
    backgroundColor: "#454343",
    textColor: "#848080",
  },
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 99,
    height: 60,
    width: 360,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 24,
    height: 24,
  },
});
