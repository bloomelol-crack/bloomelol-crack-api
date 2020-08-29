export const getNNumbers = (n: number, current: number, max: number) => {
  const nums = [];
  for (let i = 0; i < n; i += 1) {
    const curr = (current + i) % max;
    nums.push(curr);
  }
  return nums;
};
