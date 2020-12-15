export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: string) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};