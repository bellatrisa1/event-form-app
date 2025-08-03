export const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return "—";

  // Case 1: Firestore Timestamp { seconds, nanoseconds }
  if (
    typeof timestamp === "object" &&
    "seconds" in timestamp &&
    "nanoseconds" in timestamp
  ) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString("ru-RU");
  }

  // Case 2: Firestore FieldValue (serverTimestamp placeholder)
  if (typeof timestamp === "object" && timestamp?.toDate instanceof Function) {
    return timestamp.toDate().toLocaleDateString("ru-RU");
  }

  // Case 3: ISO String
  if (typeof timestamp === "string") {
    return new Date(timestamp).toLocaleDateString("ru-RU");
  }

  // Fallback
  return "Н/Д";
};
