/**
 * Format a price in cents (bigint) to a human-readable string like "$34.99"
 */
export function formatPrice(cents: bigint | number): string {
  const num = typeof cents === "bigint" ? Number(cents) : cents;
  return `$${(num / 100).toFixed(2)}`;
}
