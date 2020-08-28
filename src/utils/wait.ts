/**
 * Waits the specified milliseconds and resolves
 */
export const wait = async (milliseconds: number) =>
  new Promise<void>(resolve => setTimeout(resolve, milliseconds));
