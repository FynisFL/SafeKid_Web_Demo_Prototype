type CollectionVisit = {
  index: number;
  scrollY?: number;
  stageOwnsTransition: boolean;
};

// React Router gives each history entry a key. Keep the selected edition and
// transition source available when the collection route remounts on Back.
const visits = new Map<string, CollectionVisit>();

export function collectionVisit(key: string, pathname: string): CollectionVisit {
  const id = key + pathname;
  const existing = visits.get(id);
  if (existing) return existing;

  const visit = { index: 0, stageOwnsTransition: false };
  visits.set(id, visit);
  return visit;
}
