type CollectionPosition = {
  scrollY: number;
  stageIndex: number;
  railSnap: number;
  source: "stage" | "rail";
  edition: string;
};

const positions = new Map<string, CollectionPosition>();

export function rememberCollection(entry: string, position: CollectionPosition) {
  positions.set(entry, position);
  if (positions.size > 20) positions.delete(positions.keys().next().value);
}

export function collectionPosition(entry?: string) {
  return entry ? positions.get(entry) : undefined;
}
