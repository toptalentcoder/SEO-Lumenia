export function countWordsPerPage(contents: (string | null | undefined)[]): number[] {
    return contents.map(content => {
      if (!content) return 0;
      const words = content.split(/\s+/).filter(Boolean); // removes empty strings
      return words.length;
    });
  }
  