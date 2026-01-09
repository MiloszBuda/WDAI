export const getCachedRating = (productId: number) => {
  const raw = localStorage.getItem(`reviews:avg:${productId}`);
  return raw ? JSON.parse(raw) : null;
};

export const setCachedRating = (
  productId: number,
  data: { averageRating: number; count: number }
) => {
  localStorage.setItem(`reviews:avg:${productId}`, JSON.stringify(data));
};

export const clearCachedRating = (productId: number) => {
  localStorage.removeItem(`reviews:avg:${productId}`);
};
