export const getVelocity = points => {
  return points < 3000
    ? 1
    : points < 7000
      ? 2
      : points < 12000
        ? 3
        : 4
}
