export const getCircularReplacer = () => {
  // Contains visited value. WeakSet cause it won't be collected by GC.
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
