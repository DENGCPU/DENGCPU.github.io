export function markdownToSearchText(markdown: string) {
  return (
    markdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]+`/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^#{1,6}\s*/gm, '')
      .replace(/^>\s*/gm, '')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/[*_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}