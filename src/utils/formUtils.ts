export function getIcon(iconName?: string) {
  switch (iconName) {
    case "users":
      return "👥";
    case "mic":
      return "🎤";
    case "book-open":
      return "📖";
    case "calendar":
      return "📅";
    default:
      return "🎫";
  }
}

export function getColorBg(color?: string) {
  const colors: Record<string, string> = {
    orange: "#ffedd5",
    purple: "#eeecfe",
    blue: "#eff6ff",
    green: "#ecfccb",
    red: "#fee2e2",
  };
  return colors[color || "orange"];
}

export function getColorText(color?: string) {
  const colors: Record<string, string> = {
    orange: "#9a3412",
    purple: "#5b21b6",
    blue: "#1e40af",
    green: "#166534",
    red: "#b91c1c",
  };
  return colors[color || "orange"];
}
