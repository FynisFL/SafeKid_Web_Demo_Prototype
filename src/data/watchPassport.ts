/**
 * Watch Passport — local sample data.
 * Everything here is an illustrative concept. No device, backend, certification
 * body or real record exists behind it, and no personal data is collected.
 */

export const DEMO_LABEL = "Interactive Concept Demo";
export const SAMPLE_DEVICE_ID = "SK-CORE-DEMO-0417";

export type LifeId = "life1" | "life2" | "life3" | "end";

export type PassportEvent = {
  id: string;
  /** The first life at which this record appears on the passport. */
  from: LifeId;
  title: string;
  detail: string;
  /** Present only on events that add a Certified Data Wipe record to the passport. */
  wipeLabel?: string;
};

export type LifeStage = {
  id: LifeId;
  index: number;
  tab: string;
  eyebrow: string;
  title: string;
  summary: string;
  status: string;
  condition: { label: string; value: string }[];
  warranty: string;
};

export const LIFE_ORDER: LifeId[] = ["life1", "life2", "life3", "end"];

export const LIFE_STAGES: LifeStage[] = [
  {
    id: "life1",
    index: 1,
    tab: "Life 1",
    eyebrow: "Life 1",
    title: "New device.",
    summary:
      "A Core is issued a Device ID and begins its first chapter with one family, protected as designed.",
    status: "Active · New device",
    condition: [
      { label: "Shell & screen", value: "As issued" },
      { label: "Battery", value: "As issued" },
      { label: "Sensors", value: "As issued" },
      { label: "Software", value: "Factory state" },
    ],
    warranty: "Eligible for review",
  },
  {
    id: "life2",
    index: 2,
    tab: "Life 2",
    eyebrow: "Life 2",
    title: "Certified Refurbished.",
    summary:
      "After trade-in, inspection and a certified data wipe, the same Core is renewed for a second family.",
    status: "Active · Certified Refurbished",
    condition: [
      { label: "Shell & screen", value: "Inspected · Renewed" },
      { label: "Battery", value: "Inspected · Serviced" },
      { label: "Sensors", value: "Inspected · Passed" },
      { label: "Software", value: "Clean install" },
    ],
    warranty: "Eligible for review",
  },
  {
    id: "life3",
    index: 3,
    tab: "Life 3",
    eyebrow: "Life 3",
    title: "Certified Refurbished.",
    summary:
      "A final controlled chapter. The passport shows the same careful steps, recorded once more.",
    status: "Active · Certified Refurbished",
    condition: [
      { label: "Shell & screen", value: "Inspected · Renewed" },
      { label: "Battery", value: "Inspected · Serviced" },
      { label: "Sensors", value: "Inspected · Passed" },
      { label: "Software", value: "Clean install" },
    ],
    warranty: "Eligible for review",
  },
  {
    id: "end",
    index: 4,
    tab: "End of life",
    eyebrow: "End of life",
    title: "Recovery and recycling.",
    summary:
      "When a Core can no longer be renewed, it is retired from service and routed to recovery and recycling.",
    status: "Retired · Recovery & recycling",
    condition: [
      { label: "Shell & screen", value: "Retired from service" },
      { label: "Battery", value: "Routed to recovery" },
      { label: "Sensors", value: "Routed to recovery" },
      { label: "Software", value: "Wiped" },
    ],
    warranty: "Closed",
  },
];

export const PASSPORT_EVENTS: PassportEvent[] = [
  {
    id: "e1",
    from: "life1",
    title: "Core registered",
    detail: "Device ID issued. The lifecycle record begins.",
  },
  {
    id: "e2",
    from: "life1",
    title: "Technical baseline recorded",
    detail: "Starting condition of the Core is noted on the passport.",
  },
  {
    id: "e3",
    from: "life2",
    title: "Trade-in received",
    detail: "The Core returns to SafeKid for assessment.",
  },
  {
    id: "e4",
    from: "life2",
    title: "Inspection completed",
    detail: "Technical condition and any service needs are recorded.",
  },
  {
    id: "e5",
    from: "life2",
    title: "Certified Data Wipe recorded",
    wipeLabel: "Certified Data Wipe recorded",
    detail: "The wipe is logged as a record. The data itself is not kept.",
  },
  {
    id: "e6",
    from: "life2",
    title: "Refurbished and re-activated",
    detail: "Status updated to Certified Refurbished (Life 2).",
  },
  {
    id: "e7",
    from: "life3",
    title: "Second trade-in, inspection and wipe",
    wipeLabel: "Certified Data Wipe recorded (second cycle)",
    detail: "The same controlled steps repeat. A new wipe record is added.",
  },
  {
    id: "e8",
    from: "life3",
    title: "Refurbished and re-activated",
    detail: "Status updated to Certified Refurbished (Life 3).",
  },
  {
    id: "e9",
    from: "end",
    title: "Retired from service",
    wipeLabel: "Final Certified Data Wipe recorded",
    detail: "Final wipe recorded. The Core is routed to recovery and recycling.",
  },
];

/** Passport events visible at a given life. */
export function eventsAt(life: LifeId): PassportEvent[] {
  const index = LIFE_ORDER.indexOf(life);
  return PASSPORT_EVENTS.filter((event) => LIFE_ORDER.indexOf(event.from) <= index);
}

/** Wipe-record events visible at a given life. The count shown is always this list's length. */
export function wipeEventsAt(life: LifeId): PassportEvent[] {
  return eventsAt(life).filter((event) => event.wipeLabel !== undefined);
}

export const WIPE_NOTE =
  "A wipe record says that a wipe happened — not what was on the device.";

export const JOURNEY = [
  {
    id: "tradein",
    title: "Trade-in",
    body: "A family hands the Core back when they are ready to move on.",
  },
  {
    id: "inspection",
    title: "Inspection",
    body: "Technical condition and service needs are checked and recorded.",
  },
  {
    id: "wipe",
    title: "Data wipe",
    body: "A Certified Data Wipe clears the Core and is logged as a record.",
  },
  {
    id: "refurb",
    title: "Refurbishment",
    body: "Parts are serviced or renewed so the Core is ready for another chapter.",
  },
  {
    id: "update",
    title: "Passport update",
    body: "The passport gains a new entry and an updated lifecycle status.",
  },
  {
    id: "reactivate",
    title: "Re-activation",
    body: "The Core begins its next life with a new family.",
  },
] as const;

export const PRIVACY_TRACKS = [
  "Device ID and lifecycle status",
  "Technical condition",
  "Service and repair history",
  "Warranty eligibility",
  "Certified Refurbished status",
  "Certified Data Wipe records",
];

export const PRIVACY_NEVER = [
  "The previous child's name or identity",
  "Messages, calls or location history",
  "Photos, contacts or any private content",
  "Anything about the family that used the Core",
];
