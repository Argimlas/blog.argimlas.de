export function readingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/);

  return words.length / wordsPerMinute;
}
