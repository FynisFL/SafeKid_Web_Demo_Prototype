import { Activity, BellRing, MapPin } from "lucide-react";

export const travelDuration = 0.94;
export const signalStart = (intro: boolean) => intro ? 0.72 : 0.18;
export const signalArrival = (intro: boolean) => signalStart(intro) + travelDuration;

export const scenes = [
  {
    id: "zone",
    label: "Safe Zones",
    icon: MapPin,
    title: "Arrived at school",
    description: "See how the app displays an event when a location enters a safe zone.",
    accent: "#008789",
  },
  {
    id: "sos",
    label: "SOS Demo",
    icon: BellRing,
    title: "SOS recorded",
    description: "Preview an SOS event card. The test app records events locally.",
    accent: "#dc5748",
  },
  {
    id: "habits",
    label: "Habits",
    icon: Activity,
    title: "Task completed",
    description: "See how the app marks a task complete and awards points.",
    accent: "#a16b00",
  },
] as const;

export type Scene = (typeof scenes)[number];
