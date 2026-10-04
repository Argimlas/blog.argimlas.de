export function readingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/);

  return words.length / wordsPerMinute;
}

export function formatReadingTimeLabel(minutes: number): string {
  return minutes < 1 ? "< 1 min" : Math.ceil(minutes) + " min";
}//        condition ?  if true  :     if false
