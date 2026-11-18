import { Activity, BellRing, MapPin } from "lucide-react";

export const scenes = [
  {
    id: "zone",
    label: "Vùng an toàn",
    icon: MapPin,
    title: "Đã đến trường",
    description: "Xem cách app hiển thị một sự kiện khi vị trí đi vào vùng đã thiết lập.",
    accent: "#62f2dd",
  },
  {
    id: "sos",
    label: "SOS mô phỏng",
    icon: BellRing,
    title: "Đã ghi nhận SOS",
    description: "Xem minh họa thẻ sự kiện SOS. Bản test ghi nhận sự kiện cục bộ.",
    accent: "#ffac98",
  },
  {
    id: "habits",
    label: "Thói quen",
    icon: Activity,
    title: "Đã hoàn thành nhiệm vụ",
    description: "Xem cách app đánh dấu nhiệm vụ hoàn thành và cộng điểm thưởng.",
    accent: "#fae199",
  },
] as const;

export type Scene = (typeof scenes)[number];
