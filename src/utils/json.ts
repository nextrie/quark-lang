// Function to remove circular references in object
export const getCircularReplacer = () => {
  // Contains visited value
  const seen = new WeakSet();
  return (key: string, value: string) => {
    // Checking if value is an object
    if (typeof value === 'object' && value !== null) {
      // Checking if value has been already visited
      if (seen.has(value)) {
        // Returning nothing
        return;
      }
      // Adding value to seen
      seen.add(value);
    }
    // Returning default value
    return value;
  };
};