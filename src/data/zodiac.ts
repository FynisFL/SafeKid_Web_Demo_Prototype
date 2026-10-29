import rat from "@/assets/safekid/editions/rat.webp";
import buffalo from "@/assets/safekid/editions/buffalo.webp";
import tiger from "@/assets/safekid/editions/tiger.webp";
import cat from "@/assets/safekid/editions/cat.webp";
import dragon from "@/assets/safekid/editions/dragon.webp";
import snake from "@/assets/safekid/editions/snake.webp";
import horse from "@/assets/safekid/editions/horse.webp";
import sheep from "@/assets/safekid/editions/sheep.webp";
import monkey from "@/assets/safekid/editions/monkey.webp";
import rooster from "@/assets/safekid/editions/rooster.webp";
import dog from "@/assets/safekid/editions/dog.webp";
import pig from "@/assets/safekid/editions/pig.webp";

export type ZodiacProduct = {
  id: string;
  animal: string;
  label: string;
  detailTitle: string;
  image: string;
};

/**
 * The Vietnamese Zodiac orders the Cat in place of the Rabbit, which is why the
 * fourth edition is "Kitty" rather than a rabbit. Labels follow the source design.
 */
export const zodiacProducts: ZodiacProduct[] = [
  { id: "rat", animal: "Tý", label: "Mouse", detailTitle: "Mouse Edition", image: rat },
  { id: "buffalo", animal: "Sửu", label: "Buffalo", detailTitle: "Buffalo Edition", image: buffalo },
  { id: "tiger", animal: "Dần", label: "Tiger", detailTitle: "Tiger Edition", image: tiger },
  { id: "cat", animal: "Mão", label: "Kitty", detailTitle: "Kitty Edition", image: cat },
  { id: "dragon", animal: "Thìn", label: "Dragon", detailTitle: "Dragon Edition", image: dragon },
  { id: "snake", animal: "Tỵ", label: "Snake", detailTitle: "Snake Edition", image: snake },
  { id: "horse", animal: "Ngọ", label: "Pony", detailTitle: "Pony Edition", image: horse },
  { id: "sheep", animal: "Mùi", label: "Sheep", detailTitle: "Sheep Edition", image: sheep },
  { id: "monkey", animal: "Thân", label: "Monkey", detailTitle: "Monkey Edition", image: monkey },
  { id: "rooster", animal: "Dậu", label: "Chick", detailTitle: "Chick Edition", image: rooster },
  { id: "dog", animal: "Tuất", label: "Puppy", detailTitle: "Puppy Edition", image: dog },
  { id: "pig", animal: "Hợi", label: "Piggy", detailTitle: "Piggy Edition", image: pig },
];

/** Concept capabilities from the source design. None of these are live services. */
export const conceptCapabilities = [
  "Real-time GPS tracking",
  "Two-way calling",
  "One-touch SOS button",
  "Safe zone alerts",
  "Habit & reward system",
  "Long battery life",
];

export const conceptNote =
  "SafeKid is presented on this site as a product concept. No watch, account, pairing, location or emergency service is connected.";

export const sosDisclosure = "Local simulation only. No emergency alert is sent.";
