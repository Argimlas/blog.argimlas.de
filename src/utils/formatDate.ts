export function formatLabeledDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
  });
}

export function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
