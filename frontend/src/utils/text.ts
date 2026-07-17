export const cleanSubtitle = (name: string, desc?: string): string => {
  if (!desc) return '';
  const normalizedDesc = desc.trim();
  const lowerDesc = normalizedDesc.toLowerCase();
  const lowerName = name.toLowerCase();

  if (lowerDesc.startsWith(lowerName)) {
    const afterName = normalizedDesc.slice(name.length).trim();
    const match = afterName.match(/^([–—\-|:])\s*(.*)/);
    if (match) {
      return match[2].trim();
    }
  }
  return normalizedDesc;
};
