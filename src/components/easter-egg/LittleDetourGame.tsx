import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, RefreshCw, Volume2, VolumeX, X } from "lucide-react";
import "./LittleDetourGame.css";

type Phase = "intro" | "playing" | "gameover";
type Zone = "alley" | "school" | "field";
type ObstacleKind = "puddle" | "bag" | "fence";

type Obstacle = {
  x: number;
  kind: ObstacleKind;
  width: number;
  height: number;
};

type PaperPlane = {
  x: number;
  y: number;
  bob: number;
};

type PowerUpKind = "doubleJump" | "slowFall" | "slowTime" | "highJump";

type PowerUp = {
  x: number;
  y: number;
  bob: number;
  kind: PowerUpKind;
};

type ActivePowerUp = {
  kind: PowerUpKind;
  secondsLeft: number;
};

type Player = {
  x: number;
  y: number;
  vy: number;
  onGround: boolean;
  frame: number;
  jumpsUsed: number;
};

type World = {
  distance: number;
  elapsed: number;
  speed: number;
  spawnTimer: number;
  planeTimer: number;
  powerUpTimer: number;
  obstacles: Obstacle[];
  planes: PaperPlane[];
  powerUps: PowerUp[];
  collected: number;
  bonusScore: number;
};

const WIDTH = 960;
const HEIGHT = 540;
const GROUND = 430;
const PLAYER_X = 142;
const PLAYER_W = 70;
const PLAYER_H = 88;
const BEST_KEY = "safekid-little-detour-best-v1";
const SCENE_ART: Record<Zone, string> = {
  alley: `${import.meta.env.BASE_URL}game-art/alley.png`,
  school: `${import.meta.env.BASE_URL}game-art/school.svg`,
  field: `${import.meta.env.BASE_URL}game-art/field.svg`,
};
const PLAYER_SPRITE = `${import.meta.env.BASE_URL}game-art/boy-run.svg`;
const POWER_UP_META: Record<PowerUpKind, { symbol: string; label: string; item: string }> = {
  doubleJump: { symbol: "✦", label: "Double jump", item: "Wings" },
  slowFall: { symbol: "❧", label: "Slow fall", item: "Feather" },
  slowTime: { symbol: "⌛", label: "Slow time", item: "Hourglass" },
  highJump: { symbol: "↟", label: "High jump", item: "Spring" },
};

function zoneFor(distance: number): Zone {
  if (distance < 2500) return "alley";
  if (distance < 6100) return "school";
  return "field";
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  ctx.beginPath();
  ctx.arc(0, 12, 20, 0, Math.PI * 2);
  ctx.arc(23, 2, 26, 0, Math.PI * 2);
  ctx.arc(49, 13, 19, 0, Math.PI * 2);
  ctx.rect(-2, 12, 53, 20);
  ctx.fill();
  ctx.restore();
}

function drawHouse(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = "#785f55";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 25);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x + w, y + 25);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#f4dfb8";
  roundedRect(ctx, x + w * 0.13, y + h * 0.34, w * 0.23, h * 0.24, 5);
  ctx.fill();
  roundedRect(ctx, x + w * 0.64, y + h * 0.34, w * 0.23, h * 0.24, 5);
  ctx.fill();

  ctx.fillStyle = "#8c5949";
  roundedRect(ctx, x + w * 0.4, y + h * 0.58, w * 0.22, h * 0.42, 7);
  ctx.fill();
  ctx.restore();
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = "#795947";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-3, -52);
  ctx.stroke();
  ctx.fillStyle = "#72946c";
  ctx.beginPath();
  ctx.arc(-12, -67, 25, 0, Math.PI * 2);
  ctx.arc(12, -79, 27, 0, Math.PI * 2);
  ctx.arc(30, -59, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(56, 91, 63, 0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  distance: number,
  time: number,
  sceneImages: Record<Zone, HTMLImageElement>,
  reduceMotion: boolean,
) {
  const zone = zoneFor(distance);
  const image = sceneImages[zone];

  if (image?.complete && image.naturalWidth > 0) {
    // The three painted scenes share a 16:9 composition. A gentle camera drift
    // gives them depth without repeating a non-seamless illustration.
    const scale = Math.max(WIDTH / image.naturalWidth, HEIGHT / image.naturalHeight) * 1.045;
    const imageWidth = image.naturalWidth * scale;
    const imageHeight = image.naturalHeight * scale;
    const horizontalTravel = Math.max(0, imageWidth - WIDTH);
    const camera = reduceMotion ? 0.5 : 0.5 + Math.sin(distance / 1650) * 0.5;
    const offsetX = horizontalTravel * camera;

    ctx.drawImage(image, -offsetX, (HEIGHT - imageHeight) / 2, imageWidth, imageHeight);

    // A restrained warm glaze keeps the illustrations cohesive with the cream UI.
    ctx.fillStyle = zone === "field"
      ? "rgba(243, 232, 190, 0.045)"
      : "rgba(255, 244, 220, 0.055)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Foreground paper strokes move faster than the painted scenery.
    ctx.save();
    ctx.lineCap = "round";
    for (let i = 0; i < 30; i += 1) {
      const drift = reduceMotion ? 0 : distance * 0.7;
      const x = ((i * 41 - drift) % (WIDTH + 70) + WIDTH + 70) % (WIDTH + 70) - 35;
      const y = GROUND + 18 + (i % 5) * 19;
      ctx.strokeStyle = i % 3 === 0
        ? "rgba(255, 245, 216, 0.28)"
        : "rgba(112, 91, 65, 0.12)";
      ctx.lineWidth = i % 4 === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 5, y - 2, x + 12, y + 1);
      ctx.stroke();
    }
    ctx.restore();
    return zone;
  }

  // Keep the procedural artwork as a resilient fallback if an image cannot load.
  const background = sceneImages.alley;
  const motionDistance = reduceMotion ? 0 : distance;
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, zone === "field" ? "#9bcbd5" : "#acd7e2");
  sky.addColorStop(0.68, "#f5e4c4");
  sky.addColorStop(1, "#f1d7ad");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const cloudOffset = (motionDistance * 0.055) % 1180;
  drawCloud(ctx, 110 - cloudOffset, 92, 0.88);
  drawCloud(ctx, 475 - cloudOffset * 0.72, 145, 0.72);
  drawCloud(ctx, 900 - cloudOffset, 84, 1.02);
  drawCloud(ctx, 1160 - cloudOffset * 0.8, 164, 0.64);

  if (zone === "alley" && background?.complete && background.naturalWidth) {
    // Crop a little wider than the viewport and ease the camera across the painting.
    // The source image is not seamless, so a slow back-and-forth pan avoids a hard tile seam.
    const scale = Math.max(WIDTH / background.naturalWidth, (GROUND + 12) / background.naturalHeight) * 1.12;
    const bw = background.naturalWidth * scale;
    const bh = background.naturalHeight * scale;
    const travel = Math.max(0, bw - WIDTH);
    const offset = travel * (0.5 + 0.5 * Math.sin(motionDistance / 980));
    ctx.drawImage(background, -offset, (GROUND - bh) / 2, bw, bh);
    ctx.fillStyle = "rgba(255, 240, 211, 0.09)";
    ctx.fillRect(0, 0, WIDTH, GROUND);
  } else if (zone === "alley") {
    ctx.fillStyle = "#b7c9ad";
    ctx.beginPath();
    ctx.moveTo(0, 326);
    ctx.quadraticCurveTo(210, 273, 430, 326);
    ctx.quadraticCurveTo(690, 278, WIDTH, 322);
    ctx.lineTo(WIDTH, GROUND);
    ctx.lineTo(0, GROUND);
    ctx.fill();
    const houseOffset = (motionDistance * 0.22) % 920;
    for (let i = 0; i < 5; i += 1) {
      const x = i * 235 - houseOffset;
      drawHouse(ctx, x, 248 + (i % 2) * 17, 150, 182 - (i % 2) * 16, i % 2 ? "#d8bd91" : "#d69e79");
    }
    drawTree(ctx, 160 - ((motionDistance * 0.18) % 1000), 426, 0.9);
    drawTree(ctx, 710 - ((motionDistance * 0.18) % 1000), 426, 0.92);
  } else if (zone === "school") {
    // Soft distant hills and the schoolyard create a genuinely different second chapter.
    ctx.fillStyle = "#b6c9a9";
    ctx.beginPath();
    ctx.moveTo(0, 314);
    ctx.quadraticCurveTo(190, 255, 390, 304);
    ctx.quadraticCurveTo(660, 254, WIDTH, 302);
    ctx.lineTo(WIDTH, GROUND);
    ctx.lineTo(0, GROUND);
    ctx.fill();

    const schoolShift = ((motionDistance - 2500) * 0.16) % 1280;
    for (const schoolX of [420, 1700]) {
      ctx.save();
      ctx.translate(schoolX - schoolShift, 0);
      ctx.fillStyle = "rgba(117, 91, 69, 0.13)";
      ctx.beginPath();
      ctx.ellipse(175, 414, 210, 17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e7c99a";
      ctx.strokeStyle = "#9a775c";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 286);
      ctx.lineTo(42, 233);
      ctx.quadraticCurveTo(172, 207, 306, 233);
      ctx.lineTo(350, 286);
      ctx.lineTo(350, 414);
      ctx.quadraticCurveTo(177, 428, 0, 414);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Loose roof strokes keep the architecture in the same storybook language.
      ctx.strokeStyle = "#aa7658";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(12, 283);
      ctx.quadraticCurveTo(176, 207, 338, 283);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 244, 215, 0.65)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(34, 277);
      ctx.quadraticCurveTo(176, 224, 318, 277);
      ctx.stroke();

      ctx.fillStyle = "#76999a";
      roundedRect(ctx, 140, 290, 70, 124, 34);
      ctx.fill();
      ctx.strokeStyle = "#8f6c54";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#f5e6c6";
      for (let i = 0; i < 4; i += 1) {
        roundedRect(ctx, 28 + i * 79, 305, 45, 55, 7);
        ctx.fill();
        ctx.strokeStyle = "rgba(135, 105, 78, 0.65)";
        ctx.stroke();
        ctx.fillStyle = "#8f9f91";
        ctx.fillRect(49 + i * 79, 305, 2, 55);
        ctx.fillStyle = "#f5e6c6";
      }
      ctx.fillStyle = "#b8795f";
      roundedRect(ctx, 149, 248, 54, 26, 8);
      ctx.fill();
      ctx.fillStyle = "#fff2d8";
      ctx.font = "bold 12px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("SCHOOL", 176, 266);
      ctx.restore();
    }

    // Trees and a low fence move at different speeds for gentle parallax.
    drawTree(ctx, 100 - ((motionDistance * 0.25) % 1120), 425, 1.05);
    drawTree(ctx, 830 - ((motionDistance * 0.25) % 1120), 425, 0.88);
    ctx.strokeStyle = "rgba(139, 111, 78, 0.75)";
    ctx.lineWidth = 5;
    const fenceShift = (motionDistance * 0.31) % 94;
    for (let i = -1; i < 12; i += 1) {
      const x = i * 94 - fenceShift;
      ctx.beginPath();
      ctx.moveTo(x, 404);
      ctx.lineTo(x, 375);
      ctx.moveTo(x + 48, 404);
      ctx.lineTo(x + 48, 375);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, 386);
    ctx.lineTo(WIDTH, 386);
    ctx.moveTo(0, 398);
    ctx.lineTo(WIDTH, 398);
    ctx.stroke();
  } else {
    // Open countryside: layered meadow hills, a distant tree line and a winding path.
    ctx.fillStyle = "#a4c4a0";
    ctx.beginPath();
    ctx.moveTo(0, 322);
    ctx.quadraticCurveTo(180, 270, 370, 320);
    ctx.quadraticCurveTo(650, 247, WIDTH, 317);
    ctx.lineTo(WIDTH, GROUND);
    ctx.lineTo(0, GROUND);
    ctx.fill();

    ctx.fillStyle = "#8eb184";
    ctx.beginPath();
    ctx.moveTo(0, 357);
    ctx.quadraticCurveTo(200, 308, 440, 354);
    ctx.quadraticCurveTo(700, 299, WIDTH, 350);
    ctx.lineTo(WIDTH, GROUND);
    ctx.lineTo(0, GROUND);
    ctx.fill();

    const treeShift = (motionDistance * 0.13) % 1180;
    for (let i = 0; i < 6; i += 1) {
      const x = i * 235 - treeShift;
      drawTree(ctx, x + 80, 395, 0.55 + (i % 2) * 0.13);
    }

    ctx.fillStyle = "#c0c98e";
    ctx.beginPath();
    ctx.moveTo(0, 375);
    ctx.quadraticCurveTo(240, 339, 450, 382);
    ctx.quadraticCurveTo(730, 340, WIDTH, 373);
    ctx.lineTo(WIDTH, GROUND);
    ctx.lineTo(0, GROUND);
    ctx.fill();

    // Flower dots and meadow strokes drift more quickly than the far hills.
    for (let i = 0; i < 34; i += 1) {
      const x = ((i * 47 - motionDistance * 0.34) % (WIDTH + 80) + WIDTH + 80) % (WIDTH + 80) - 40;
      const y = 354 + (i % 5) * 13;
      ctx.fillStyle = i % 3 === 0 ? "#f3d6b1" : i % 3 === 1 ? "#e9e4bb" : "#d69a82";
      ctx.beginPath();
      ctx.arc(x, y, 2.4 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // A softly painted, moving path gives the runner a grounded surface instead of a flat block.
  const ground = ctx.createLinearGradient(0, GROUND, 0, HEIGHT);
  ground.addColorStop(0, zone === "field" ? "#c3ad7e" : "#c7a477");
  ground.addColorStop(1, "#b28d64");
  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.moveTo(0, GROUND - 1);
  ctx.quadraticCurveTo(260, GROUND + 2, 510, GROUND - 1);
  ctx.quadraticCurveTo(760, GROUND + 2, WIDTH, GROUND - 1);
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.lineTo(0, HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#8fa879";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, GROUND - 3);
  ctx.quadraticCurveTo(250, GROUND + 1, 510, GROUND - 3);
  ctx.quadraticCurveTo(760, GROUND + 1, WIDTH, GROUND - 3);
  ctx.stroke();

  // Small, irregular paper-grain marks scroll underfoot.
  ctx.lineCap = "round";
  for (let i = 0; i < 42; i += 1) {
    const x = ((i * 43 - motionDistance * 0.8) % (WIDTH + 60) + WIDTH + 60) % (WIDTH + 60) - 30;
    const y = GROUND + 18 + (i % 6) * 16;
    ctx.strokeStyle = i % 3 === 0 ? "rgba(255, 235, 193, 0.35)" : "rgba(114, 83, 55, 0.17)";
    ctx.lineWidth = i % 4 === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 5, y - 2, x + 12, y + 1);
    ctx.stroke();
  }

  return zone;
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player, time: number, spriteSheet: HTMLImageElement | null, reduceMotion: boolean) {
  const run = reduceMotion ? 0 : Math.sin(time * 12.5);
  const airborne = !player.onGround;
  const x = player.x;
  const y = player.y;
  const swing = airborne ? 4 : run * 8;

  ctx.save();

  // Ground shadow narrows and softens while the child is in the air.
  ctx.fillStyle = "rgba(76, 67, 52, 0.19)";
  ctx.beginPath();
  ctx.ellipse(x + 29, GROUND + 1, airborne ? 15 : 25 - Math.abs(run) * 2, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (spriteSheet?.complete && spriteSheet.naturalWidth > 0) {
    const frameWidth = spriteSheet.naturalWidth / 4;
    const frameIndex = airborne ? 3 : reduceMotion ? 0 : Math.floor(time * 10) % 3;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(
      spriteSheet,
      frameIndex * frameWidth,
      0,
      frameWidth,
      spriteSheet.naturalHeight,
      x - 11,
      y - 5,
      96,
      96,
    );
    ctx.restore();
    return;
  }

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Backpack sits behind the shoulder and bounces with each step.
  ctx.fillStyle = "#bd8060";
  ctx.strokeStyle = "#76584b";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x + 5, y + 38);
  ctx.quadraticCurveTo(x + 1, y + 34, x + 5, y + 31);
  ctx.lineTo(x + 19, y + 34);
  ctx.lineTo(x + 21, y + 59);
  ctx.quadraticCurveTo(x + 8, y + 64, x + 4, y + 55);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 225, 184, 0.75)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 43);
  ctx.quadraticCurveTo(x + 15, y + 46, x + 15, y + 57);
  ctx.stroke();

  // Legs, rolled shorts and rounded shoes.
  ctx.strokeStyle = "#75594d";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x + 24, y + 63);
  ctx.lineTo(x + 19 + swing, y + 78);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 37, y + 62);
  ctx.lineTo(x + 40 - swing, y + 77);
  ctx.stroke();

  ctx.fillStyle = "#594c43";
  ctx.beginPath();
  ctx.ellipse(x + 14 + swing, y + 81, 10, 5, -0.12, 0, Math.PI * 2);
  ctx.ellipse(x + 44 - swing, y + 80, 10, 5, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#e8c9a0";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(x + 9 + swing, y + 82);
  ctx.lineTo(x + 18 + swing, y + 82);
  ctx.moveTo(x + 39 - swing, y + 81);
  ctx.lineTo(x + 48 - swing, y + 81);
  ctx.stroke();

  // Shorts.
  ctx.fillStyle = "#9b7660";
  ctx.strokeStyle = "#76584b";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x + 18, y + 52);
  ctx.quadraticCurveTo(x + 29, y + 57, x + 42, y + 51);
  ctx.lineTo(x + 43, y + 66);
  ctx.quadraticCurveTo(x + 36, y + 70, x + 30, y + 65);
  ctx.quadraticCurveTo(x + 23, y + 70, x + 17, y + 65);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Shirt with a soft collar and small hand-painted folds.
  ctx.fillStyle = "#78a29a";
  ctx.strokeStyle = "#6c594b";
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(x + 17, y + 31);
  ctx.quadraticCurveTo(x + 29, y + 23, x + 41, y + 32);
  ctx.lineTo(x + 43, y + 57);
  ctx.quadraticCurveTo(x + 30, y + 64, x + 15, y + 57);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 240, 205, 0.75)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 25, y + 32);
  ctx.lineTo(x + 30, y + 39);
  ctx.lineTo(x + 35, y + 32);
  ctx.moveTo(x + 20, y + 47);
  ctx.quadraticCurveTo(x + 25, y + 49, x + 26, y + 54);
  ctx.stroke();

  // Arms swing opposite to the legs.
  ctx.strokeStyle = "#e7b789";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(x + 17, y + 37);
  ctx.quadraticCurveTo(x + 9, y + 41, x + 7 - swing * 0.35, y + (airborne ? 31 : 47 + swing * 0.35));
  ctx.moveTo(x + 41, y + 37);
  ctx.quadraticCurveTo(x + 48, y + 41, x + 51 + swing * 0.35, y + (airborne ? 27 : 46 - swing * 0.35));
  ctx.stroke();

  // Face and neck.
  ctx.fillStyle = "#eebd91";
  ctx.strokeStyle = "#76584b";
  ctx.lineWidth = 2.3;
  ctx.beginPath();
  ctx.arc(x + 30, y + 18, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#eebd91";
  roundedRect(ctx, x + 25, y + 29, 10, 9, 3);
  ctx.fill();

  // Tousled hair, with an uneven silhouette rather than a flat semicircle.
  ctx.fillStyle = "#59483f";
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 19);
  ctx.quadraticCurveTo(x + 10, y + 7, x + 22, y + 3);
  ctx.quadraticCurveTo(x + 27, y - 2, x + 34, y + 3);
  ctx.quadraticCurveTo(x + 45, y + 3, x + 46, y + 16);
  ctx.quadraticCurveTo(x + 40, y + 13, x + 37, y + 17);
  ctx.quadraticCurveTo(x + 30, y + 11, x + 22, y + 18);
  ctx.quadraticCurveTo(x + 17, y + 16, x + 14, y + 19);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(228, 190, 145, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 23, y + 7);
  ctx.quadraticCurveTo(x + 31, y + 2, x + 38, y + 8);
  ctx.stroke();

  // One visible eye, tiny nose and a quiet smile.
  ctx.fillStyle = "#51443d";
  ctx.beginPath();
  ctx.arc(x + 36, y + 20, 1.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#a8735d";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(x + 41, y + 24);
  ctx.lineTo(x + 43, y + 25);
  ctx.moveTo(x + 33, y + 29);
  ctx.quadraticCurveTo(x + 37, y + 32, x + 40, y + 28);
  ctx.stroke();

  ctx.restore();
}

function drawPuddle(ctx: CanvasRenderingContext2D, obstacle: Obstacle) {
  ctx.save();
  ctx.fillStyle = "#719eaa";
  ctx.strokeStyle = "#527b85";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(obstacle.x, GROUND - 2);
  ctx.quadraticCurveTo(obstacle.x + 7, GROUND - 20, obstacle.x + obstacle.width * 0.4, GROUND - 13);
  ctx.quadraticCurveTo(obstacle.x + obstacle.width * 0.8, GROUND - 21, obstacle.x + obstacle.width, GROUND - 2);
  ctx.quadraticCurveTo(obstacle.x + obstacle.width * 0.55, GROUND + 7, obstacle.x, GROUND - 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(obstacle.x + 14, GROUND - 7);
  ctx.quadraticCurveTo(obstacle.x + 25, GROUND - 13, obstacle.x + 38, GROUND - 8);
  ctx.stroke();
  ctx.restore();
}

function drawBag(ctx: CanvasRenderingContext2D, obstacle: Obstacle) {
  ctx.save();
  ctx.fillStyle = "#c86e53";
  ctx.strokeStyle = "#76564b";
  ctx.lineWidth = 3;
  roundedRect(ctx, obstacle.x, GROUND - obstacle.height, obstacle.width, obstacle.height, 12);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#f0c18f";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(obstacle.x + obstacle.width / 2, GROUND - obstacle.height + 2, 10, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = "#f5dfba";
  roundedRect(ctx, obstacle.x + 11, GROUND - 27, obstacle.width - 22, 13, 5);
  ctx.fill();
  ctx.restore();
}

function drawFence(ctx: CanvasRenderingContext2D, obstacle: Obstacle) {
  ctx.save();
  ctx.fillStyle = "#d8ad72";
  ctx.strokeStyle = "#805e4a";
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i += 1) {
    const x = obstacle.x + i * 14;
    ctx.beginPath();
    ctx.moveTo(x, GROUND);
    ctx.lineTo(x, GROUND - obstacle.height + (i % 2) * 5);
    ctx.lineTo(x + 7, GROUND - obstacle.height - 10 + (i % 2) * 5);
    ctx.lineTo(x + 14, GROUND - obstacle.height + (i % 2) * 5);
    ctx.lineTo(x + 14, GROUND);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlane(ctx: CanvasRenderingContext2D, plane: PaperPlane, time: number) {
  const bobY = Math.sin(time * 3 + plane.bob) * 6;
  ctx.save();
  ctx.translate(plane.x, plane.y + bobY);
  ctx.rotate(-0.12);
  ctx.fillStyle = "#fff9e9";
  ctx.strokeStyle = "#8d9582";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-19, 1);
  ctx.lineTo(23, -11);
  ctx.lineTo(7, 14);
  ctx.lineTo(1, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#b4b39b";
  ctx.beginPath();
  ctx.moveTo(1, 4);
  ctx.lineTo(23, -11);
  ctx.lineTo(4, 1);
  ctx.stroke();
  ctx.restore();
}

function drawPowerUp(ctx: CanvasRenderingContext2D, powerUp: PowerUp, time: number) {
  const bobY = Math.sin(time * 3.1 + powerUp.bob) * 7;
  const palette: Record<PowerUpKind, { fill: string; stroke: string; glow: string }> = {
    doubleJump: { fill: "#dff1e7", stroke: "#438b7d", glow: "rgba(91, 173, 151, 0.28)" },
    slowFall: { fill: "#e5f0db", stroke: "#71946c", glow: "rgba(137, 177, 123, 0.28)" },
    slowTime: { fill: "#f7e8c5", stroke: "#b48b4d", glow: "rgba(222, 179, 104, 0.3)" },
    highJump: { fill: "#f3dfcf", stroke: "#b8795f", glow: "rgba(204, 134, 102, 0.28)" },
  };
  const colors = palette[powerUp.kind];

  ctx.save();
  ctx.translate(powerUp.x, powerUp.y + bobY);
  ctx.fillStyle = colors.glow;
  ctx.beginPath();
  ctx.arc(0, 0, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff9e9";
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 23, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = colors.fill;
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (powerUp.kind === "doubleJump") {
    // A pair of small wings around a central sparkle.
    ctx.beginPath();
    ctx.moveTo(-4, 1);
    ctx.quadraticCurveTo(-22, -20, -19, -3);
    ctx.quadraticCurveTo(-17, 8, -4, 8);
    ctx.moveTo(4, 1);
    ctx.quadraticCurveTo(22, -20, 19, -3);
    ctx.quadraticCurveTo(17, 8, 4, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#438b7d";
    ctx.beginPath();
    ctx.arc(0, 2, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (powerUp.kind === "slowFall") {
    // A tapered feather with a visible quill.
    ctx.beginPath();
    ctx.moveTo(-12, 12);
    ctx.quadraticCurveTo(-22, -13, 13, -15);
    ctx.quadraticCurveTo(18, 4, -12, 12);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-12, 12);
    ctx.quadraticCurveTo(0, -2, 13, -15);
    ctx.moveTo(-4, 3);
    ctx.lineTo(-10, -3);
    ctx.moveTo(3, -4);
    ctx.lineTo(-2, -10);
    ctx.stroke();
  } else if (powerUp.kind === "slowTime") {
    // Hourglass silhouette.
    ctx.beginPath();
    ctx.moveTo(-11, -14);
    ctx.lineTo(11, -14);
    ctx.quadraticCurveTo(8, -5, 0, 0);
    ctx.quadraticCurveTo(-8, 5, -11, 14);
    ctx.lineTo(11, 14);
    ctx.quadraticCurveTo(8, 5, 0, 0);
    ctx.quadraticCurveTo(-8, -5, -11, -14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-6, -9);
    ctx.lineTo(6, -9);
    ctx.moveTo(-6, 9);
    ctx.lineTo(6, 9);
    ctx.stroke();
  } else {
    // Spring coil.
    ctx.beginPath();
    ctx.moveTo(-11, -14);
    ctx.lineTo(9, -14);
    ctx.lineTo(-8, -5);
    ctx.lineTo(9, 4);
    ctx.lineTo(-8, 13);
    ctx.lineTo(11, 13);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-13, -17);
    ctx.lineTo(13, -17);
    ctx.moveTo(-13, 17);
    ctx.lineTo(13, 17);
    ctx.stroke();
  }

  ctx.restore();
}

function safeReadBest() {
  try {
    const value = Number(window.localStorage.getItem(BEST_KEY) || 0);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  } catch {
    return 0;
  }
}

export function LittleDetourGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const jumpRef = useRef<(() => void) | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastRunDistanceRef = useRef(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [runKey, setRunKey] = useState(0);
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState(0);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const [best, setBest] = useState(safeReadBest);
  const [zone, setZone] = useState<Zone>("alley");
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);
  mutedRef.current = muted;

  const startRun = useCallback(() => {
    setScore(0);
    setCollected(0);
    setActivePowerUps([]);
    setZone("alley");
    setRunKey((value) => value + 1);
    setPhase("playing");
  }, []);

  const jump = useCallback(() => {
    jumpRef.current?.();
  }, []);

  // Unlock/resume Web Audio directly inside the user's click gesture.
  // Creating or resuming AudioContext later from the animation loop can be
  // blocked by browser autoplay policies, leaving the unmuted game silent.
  const toggleMuted = useCallback(() => {
    if (muted) {
      try {
        const AudioContextConstructor = window.AudioContext;
        if (AudioContextConstructor) {
          let context = audioContextRef.current;
          if (!context || context.state === "closed") {
            context = new AudioContextConstructor();
            audioContextRef.current = context;
          }
          if (context.state === "suspended") {
            void context.resume().catch(() => undefined);
          }
        }
      } catch {
        // Audio is optional; the game remains playable if it is unavailable.
      }
      setMuted(false);
    } else {
      setMuted(true);
    }
  }, [muted]);

  useEffect(() => () => {
    const context = audioContextRef.current;
    audioContextRef.current = null;
    if (context && context.state !== "closed") {
      void context.close().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.code === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      const target = event.target;
      if (target instanceof Element && target.closest("button, a, input, textarea, select")) return;

      if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
        event.preventDefault();
        if (phase === "playing") jump();
        else if (phase === "intro" || phase === "gameover") startRun();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump, onClose, phase, startRun]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const sceneImages: Record<Zone, HTMLImageElement> = {
      alley: new Image(),
      school: new Image(),
      field: new Image(),
    };
    const spriteSheet = new Image();
    const reduceMotion = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;

    const beep = (frequency: number, duration: number, shape: OscillatorType = "sine") => {
      if (mutedRef.current || disposed) return;
      try {
        let context = audioContextRef.current;
        if (!context || context.state === "closed") {
          const AudioContextConstructor = window.AudioContext;
          if (!AudioContextConstructor) return;
          context = new AudioContextConstructor();
          audioContextRef.current = context;
        }
        const play = () => {
          if (disposed || mutedRef.current || context.state !== "running") return;
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = shape;
          oscillator.frequency.setValueAtTime(frequency, context.currentTime);
          gain.gain.setValueAtTime(0.0001, context.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.065, context.currentTime + 0.018);
          gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start();
          oscillator.stop(context.currentTime + duration);
        };

        if (context.state === "suspended") {
          void context.resume().then(play).catch(() => undefined);
        } else {
          play();
        }
      } catch {
        // Sound is optional; never interrupt a run when browser audio is unavailable.
      }
    };

    (Object.keys(SCENE_ART) as Zone[]).forEach((zoneKey) => {
      const image = sceneImages[zoneKey];
      image.decoding = "async";
      image.onload = () => {
        if (!disposed && phase !== "playing") drawFrame(0);
      };
      image.src = SCENE_ART[zoneKey];
    });
    spriteSheet.decoding = "async";
    spriteSheet.onload = () => {
      if (!disposed && phase !== "playing") drawFrame(0);
    };
    spriteSheet.src = PLAYER_SPRITE;
    let frame = 0;
    let lastTime = 0;
    let scoreClock = 0;
    let world: World = {
      distance: phase === "gameover" ? lastRunDistanceRef.current : 0,
      elapsed: 0,
      speed: 315,
      spawnTimer: 1.1,
      planeTimer: 0.7,
      powerUpTimer: 3.8,
      obstacles: [],
      planes: [],
      powerUps: [],
      collected: 0,
      bonusScore: 0,
    };
    let lastZone: Zone = "alley";
    const player: Player = {
      x: PLAYER_X,
      y: GROUND - PLAYER_H,
      vy: 0,
      onGround: true,
      frame: 0,
      jumpsUsed: 0,
    };
    const powerUpExpiry: Record<PowerUpKind, number> = {
      doubleJump: 0,
      slowFall: 0,
      slowTime: 0,
      highJump: 0,
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(canvas.width / WIDTH, 0, 0, canvas.height / HEIGHT, 0, 0);
      if (phase !== "playing") {
        drawBackground(ctx, 320, 0, sceneImages, reduceMotion);
        drawPlayer(ctx, player, 0, spriteSheet, reduceMotion);
      }
    };

    const drawFrame = (time: number) => {
      const currentZone = drawBackground(ctx, world.distance, time, sceneImages, reduceMotion);
      if (phase === "playing") {
        for (const plane of world.planes) drawPlane(ctx, plane, time);
        for (const powerUp of world.powerUps) drawPowerUp(ctx, powerUp, time);
        for (const obstacle of world.obstacles) {
          if (obstacle.kind === "puddle") drawPuddle(ctx, obstacle);
          else if (obstacle.kind === "bag") drawBag(ctx, obstacle);
          else drawFence(ctx, obstacle);
        }
        drawPlayer(ctx, player, time, spriteSheet, reduceMotion);
      } else {
        drawPlayer(ctx, player, time, spriteSheet, reduceMotion);
      }
      if (currentZone !== lastZone) {
        lastZone = currentZone;
        setZone(currentZone);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (phase !== "playing") {
      drawFrame(0);
      return () => {
        disposed = true;
        window.removeEventListener("resize", resizeCanvas);
      };
    }

    jumpRef.current = () => {
      const canDoubleJump = world.elapsed < powerUpExpiry.doubleJump && player.jumpsUsed < 2;
      if (player.onGround || canDoubleJump) {
        const isSecondJump = !player.onGround;
        const isHighJump = world.elapsed < powerUpExpiry.highJump;
        player.vy = isHighJump ? -930 : -720;
        player.onGround = false;
        player.jumpsUsed += 1;
        beep(isSecondJump ? 760 : isHighJump ? 660 : 520, 0.13, "triangle");
      }
    };

    const finishRun = () => {
      lastRunDistanceRef.current = world.distance;
      const finalScore = Math.floor(world.distance / 12) + world.collected * 35 + world.bonusScore;
      setScore(finalScore);
      setCollected(world.collected);
      setActivePowerUps([]);
      setBest((previous) => Math.max(previous, finalScore));
      try {
        const storedBest = safeReadBest();
        window.localStorage.setItem(BEST_KEY, String(Math.max(storedBest, finalScore)));
      } catch {
        // Local score storage is optional; the game remains playable without it.
      }
      setPhase("gameover");
    };

    const tick = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      world.elapsed += dt;
      const baseSpeed = Math.min(315 + world.elapsed * 8.5, 610);
      const isSlowTime = world.elapsed < powerUpExpiry.slowTime;
      world.speed = baseSpeed * (isSlowTime ? 0.62 : 1);
      world.distance += world.speed * dt;
      player.frame += dt * 12;
      const isSlowFalling = world.elapsed < powerUpExpiry.slowFall;
      const gravity = isSlowFalling ? 760 : 1900;
      const fallLimit = isSlowFalling ? 420 : 1100;
      player.vy = Math.min(player.vy + gravity * dt, fallLimit);
      player.y += player.vy * dt;

      if (player.y + PLAYER_H >= GROUND) {
        player.y = GROUND - PLAYER_H;
        player.vy = 0;
        player.onGround = true;
        player.jumpsUsed = 0;
      }

      world.spawnTimer -= dt;
      if (world.spawnTimer <= 0) {
        const activeZone = zoneFor(world.distance);
        const kinds: ObstacleKind[] = activeZone === "alley"
          ? ["puddle", "bag"]
          : activeZone === "school"
            ? ["bag", "fence"]
            : ["puddle", "fence"];
        const kind = kinds[Math.floor(Math.random() * kinds.length)];
        const width = kind === "puddle" ? 66 : kind === "bag" ? 43 : 48;
        const height = kind === "puddle" ? 20 : kind === "bag" ? 48 : 53;
        world.obstacles.push({ x: WIDTH + 40, kind, width, height });
        const minimumGap = world.speed > 500 ? 1.12 : 1.0;
        world.spawnTimer = Math.max(minimumGap, 1.58 - world.elapsed * 0.004) + Math.random() * 0.32;
      }

      world.planeTimer -= dt;
      if (world.planeTimer <= 0) {
        world.planes.push({
          x: WIDTH + 30,
          y: 250 + Math.random() * 65,
          bob: Math.random() * Math.PI * 2,
        });
        world.planeTimer = 1.35 + Math.random() * 1.2;
      }

      world.powerUpTimer -= dt;
      if (world.powerUpTimer <= 0) {
        const kinds: PowerUpKind[] = ["doubleJump", "slowFall", "slowTime", "highJump"];
        const kind = kinds[Math.floor(Math.random() * kinds.length)];
        world.powerUps.push({
          x: WIDTH + 38,
          y: GROUND - 105 - Math.random() * 88,
          bob: Math.random() * Math.PI * 2,
          kind,
        });
        world.powerUpTimer = 6.8 + Math.random() * 2.4;
      }

      for (const obstacle of world.obstacles) obstacle.x -= world.speed * dt;
      for (const plane of world.planes) plane.x -= world.speed * dt;
      for (const powerUp of world.powerUps) powerUp.x -= world.speed * dt;
      world.obstacles = world.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -30);
      world.planes = world.planes.filter((plane) => plane.x > -40);
      world.powerUps = world.powerUps.filter((powerUp) => powerUp.x > -45);

      const playerBox = {
        left: player.x + 7,
        right: player.x + PLAYER_W - 5,
        top: player.y + 12,
        bottom: player.y + PLAYER_H - 3,
      };

      for (const obstacle of world.obstacles) {
        const obstacleTop = obstacle.kind === "puddle" ? GROUND - 10 : GROUND - obstacle.height;
        const obstacleBottom = GROUND;
        if (
          playerBox.right > obstacle.x + 7 &&
          playerBox.left < obstacle.x + obstacle.width - 7 &&
          playerBox.bottom > obstacleTop &&
          playerBox.top < obstacleBottom
        ) {
          beep(150, .35, "triangle");
          finishRun();
          return;
        }
      }

      const before = world.planes.length;
      world.planes = world.planes.filter((plane) => {
        const planeBox = { left: plane.x - 14, right: plane.x + 15, top: plane.y - 13, bottom: plane.y + 15 };
        const hit =
          playerBox.right > planeBox.left &&
          playerBox.left < planeBox.right &&
          playerBox.bottom > planeBox.top &&
          playerBox.top < planeBox.bottom;
        if (hit) { world.collected += 1; beep(880, .2, "sine"); }
        return !hit;
      });
      if (before !== world.planes.length) setCollected(world.collected);

      world.powerUps = world.powerUps.filter((powerUp) => {
        const bobY = Math.sin(world.elapsed * 3.1 + powerUp.bob) * 7;
        const itemBox = {
          left: powerUp.x - 21,
          right: powerUp.x + 21,
          top: powerUp.y + bobY - 21,
          bottom: powerUp.y + bobY + 21,
        };
        const hit =
          playerBox.right > itemBox.left &&
          playerBox.left < itemBox.right &&
          playerBox.bottom > itemBox.top &&
          playerBox.top < itemBox.bottom;

        if (hit) {
          powerUpExpiry[powerUp.kind] = world.elapsed + 5;
          world.bonusScore += 50;
          beep(700 + Object.keys(POWER_UP_META).indexOf(powerUp.kind) * 90, 0.24, "sine");
        }
        return !hit;
      });

      scoreClock += dt;
      if (scoreClock > 0.12) {
        scoreClock = 0;
        setScore(Math.floor(world.distance / 12) + world.collected * 35 + world.bonusScore);
        setActivePowerUps(
          (Object.keys(powerUpExpiry) as PowerUpKind[])
            .filter((kind) => powerUpExpiry[kind] > world.elapsed)
            .map((kind) => ({
              kind,
              secondsLeft: powerUpExpiry[kind] - world.elapsed,
            })),
        );
      }

      drawFrame(world.elapsed);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resizeCanvas);
      jumpRef.current = null;
      // The shared AudioContext stays alive between retries and closes on overlay unmount.
    };
    // A new run is intentionally created only when runKey or phase changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, runKey]);

  const zoneLabel =
    zone === "alley" ? "The Little Alley" : zone === "school" ? "After School" : "Somewhere Beyond";

  return createPortal(
    <div className="little-detour" role="dialog" aria-modal="true" aria-label="A Little Detour secret game">
      <div className="little-detour__frame">
        <header className="little-detour__topbar">
          <div className="little-detour__wordmark">
            <span className="little-detour__mark">✳</span>
            <span>
              <strong>A LITTLE DETOUR</strong>
              <small>A small trip back to being little.</small>
            </span>
          </div>
          <div className="little-detour__top-actions">
            <span className="little-detour__best">BEST <b>{best.toLocaleString()}</b></span>
            <button className="little-detour__icon-button" onClick={toggleMuted} aria-label={muted ? "Enable sound" : "Mute sound"} title={muted ? "Enable sound" : "Mute sound"}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
            <button className="little-detour__icon-button" onClick={onClose} aria-label="Close secret game">
              <X size={19} />
            </button>
          </div>
        </header>

        <div className="little-detour__stage-wrap">
          <canvas
            ref={canvasRef}
            className="little-detour__canvas"
            onPointerDown={() => {
              if (phase === "playing") jump();
            }}
            aria-label="A hand-drawn endless runner. Jump over puddles, bags and fences; collect paper planes."
          />
          <div className="little-detour__stage-shade" />

          {phase === "intro" && (
            <div className="little-detour__panel">
              <p className="little-detour__eyebrow">A SECRET PLACE, JUST FOR A WHILE</p>
              <h1>Remember<br /><em>how to play?</em></h1>
              <p className="little-detour__description">
                One little run through the places we used to call our whole world.
              </p>
              <div className="little-detour__item-guide" aria-label="Power-up item guide">
                <span><b>✦ Wings</b><small>Double jump</small></span>
                <span><b>❧ Feather</b><small>Slow fall</small></span>
                <span><b>⌛ Hourglass</b><small>Slow time</small></span>
                <span><b>↟ Spring</b><small>High jump</small></span>
              </div>
              <button className="little-detour__primary" onClick={startRun}>
                Let's go <ArrowUp size={17} />
              </button>
              <span className="little-detour__hint">SPACE / ↑ TO JUMP</span>
            </div>
          )}

          {phase === "gameover" && (
            <div className="little-detour__panel little-detour__panel--result">
              <p className="little-detour__eyebrow">THE DAY ISN'T OVER</p>
              <h2>That was<br /><em>a good run.</em></h2>
              <div className="little-detour__result">
                <span><small>DISTANCE SCORE</small><b>{score.toLocaleString()}</b></span>
                <span><small>PAPER PLANES</small><b>{collected}</b></span>
              </div>
              <p className="little-detour__description">
                Growing up doesn't mean forgetting how to play.
              </p>
              <button className="little-detour__primary" onClick={startRun}>
                Play again <RefreshCw size={16} />
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="little-detour__hud">
              <span className="little-detour__zone" key={zone}>
                <span aria-hidden="true">{zone === "alley" ? "⌂" : zone === "school" ? "✎" : "✿"}</span>
                {zoneLabel}
              </span>
              <span className="little-detour__score">{score.toLocaleString()} <small>POINTS</small></span>
              <span className="little-detour__collect">✈ {collected}</span>
              {activePowerUps.length > 0 && (
                <div className="little-detour__active-powerups" aria-live="polite">
                  {activePowerUps.map((effect) => (
                    <span className="little-detour__active-powerup" key={effect.kind}>
                      <b>{POWER_UP_META[effect.kind].symbol}</b>
                      {POWER_UP_META[effect.kind].label}
                      <small>{Math.ceil(effect.secondsLeft)}s</small>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="little-detour__controls">
          <div className="little-detour__control-copy">
            <span className="little-detour__key">SPACE</span>
            <span className="little-detour__key">↑</span>
            <span>to jump</span>
          </div>
          <button
            className="little-detour__jump"
            onClick={() => {
              if (phase === "playing") jump();
              else if (phase === "intro" || phase === "gameover") startRun();
            }}
          >
            <ArrowUp size={17} /> {phase === "playing" ? "Jump" : phase === "intro" ? "Start" : "Again"}
          </button>
          <p>We take childhood seriously. Because we once had one, too.</p>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
