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

type Player = {
  x: number;
  y: number;
  vy: number;
  onGround: boolean;
  frame: number;
};

type World = {
  distance: number;
  elapsed: number;
  speed: number;
  spawnTimer: number;
  planeTimer: number;
  obstacles: Obstacle[];
  planes: PaperPlane[];
  collected: number;
};

const WIDTH = 960;
const HEIGHT = 540;
const GROUND = 430;
const PLAYER_X = 150;
const PLAYER_W = 48;
const PLAYER_H = 76;
const BEST_KEY = "safekid-little-detour-best-v1";
const GAME_ART = `${import.meta.env.BASE_URL}game-art/alley.png`;

function zoneFor(distance: number): Zone {
  if (distance < 1500) return "alley";
  if (distance < 4300) return "school";
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

function drawBackground(ctx: CanvasRenderingContext2D, distance: number, time: number, background: HTMLImageElement | null) {
  const zone = zoneFor(distance);
  if (background?.complete && background.naturalWidth) {
    const scale = Math.max(WIDTH / background.naturalWidth, HEIGHT / background.naturalHeight);
    const bw = background.naturalWidth * scale; const bh = background.naturalHeight * scale;
    const offset = (distance * 0.12) % Math.max(1, bw - WIDTH);
    ctx.drawImage(background, -offset, (HEIGHT - bh) / 2, bw, bh);
    ctx.fillStyle = zone === "school" ? "rgba(255, 226, 170, .16)" : zone === "field" ? "rgba(186, 211, 151, .17)" : "rgba(255, 244, 215, .1)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgba(192, 156, 107, .9)"; ctx.fillRect(0, GROUND, WIDTH, HEIGHT-GROUND);
    ctx.fillStyle = "#8da879"; ctx.fillRect(0, GROUND-5, WIDTH, 8);
    return zone;
  }
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, zone === "field" ? "#94c6d0" : "#a9d6df");
  sky.addColorStop(0.7, "#f3ddb8");
  sky.addColorStop(1, "#f5d7a4");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "rgba(255, 224, 151, 0.88)";
  ctx.beginPath();
  ctx.arc(770, 105, 43, 0, Math.PI * 2);
  ctx.fill();

  const cloudOffset = (distance * 0.08) % 1180;
  drawCloud(ctx, 130 - cloudOffset, 105, 0.9);
  drawCloud(ctx, 520 - cloudOffset * 0.68, 155, 0.7);
  drawCloud(ctx, 990 - cloudOffset, 90, 1.05);
  drawCloud(ctx, 1180 - cloudOffset * 0.8, 185, 0.62);

  if (zone === "alley") {
    ctx.fillStyle = "#b5c9ad";
    ctx.beginPath();
    ctx.moveTo(0, 335);
    ctx.quadraticCurveTo(230, 285, 450, 330);
    ctx.quadraticCurveTo(710, 290, WIDTH, 330);
    ctx.lineTo(WIDTH, GROUND);
    ctx.lineTo(0, GROUND);
    ctx.fill();

    const houseOffset = (distance * 0.34) % 400;
    drawHouse(ctx, 30 - houseOffset, 245, 145, 185, "#d69e79");
    drawHouse(ctx, 270 - houseOffset, 265, 125, 165, "#d7bd8d");
    drawHouse(ctx, 500 - houseOffset, 235, 160, 195, "#c98970");
    drawHouse(ctx, 760 - houseOffset, 260, 145, 170, "#d8b88b");
    drawTree(ctx, 230 - ((distance * 0.28) % 1040), 424, 0.95);
    drawTree(ctx, 700 - ((distance * 0.28) % 1040), 424, 0.85);
  } else if (zone === "school") {
    ctx.fillStyle = "#a9c19c";
    ctx.beginPath();
    ctx.moveTo(0, 350);
    ctx.quadraticCurveTo(250, 305, 500, 350);
    ctx.quadraticCurveTo(750, 300, WIDTH, 345);
    ctx.lineTo(WIDTH, GROUND);
    ctx.lineTo(0, GROUND);
    ctx.fill();

    const schoolOffset = (distance * 0.24) % 720;
    ctx.save();
    ctx.translate(440 - schoolOffset, 0);
    ctx.fillStyle = "#e7bd8b";
    ctx.strokeStyle = "#886c58";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 286);
    ctx.lineTo(40, 225);
    ctx.lineTo(300, 225);
    ctx.lineTo(340, 286);
    ctx.lineTo(340, 430);
    ctx.lineTo(0, 430);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#73949a";
    roundedRect(ctx, 134, 250, 72, 180, 34);
    ctx.fill();
    ctx.fillStyle = "#f7e5bf";
    for (let i = 0; i < 4; i += 1) {
      roundedRect(ctx, 25 + i * 76, 300, 45, 54, 6);
      ctx.fill();
    }
    ctx.restore();
    drawTree(ctx, 120 - ((distance * 0.3) % 1100), 424, 0.95);
    drawTree(ctx, 850 - ((distance * 0.3) % 1100), 424, 1.1);
  } else {
    ctx.fillStyle = "#83a982";
    ctx.beginPath();
    ctx.moveTo(0, 355);
    ctx.quadraticCurveTo(210, 280, 430, 345);
    ctx.quadraticCurveTo(730, 270, WIDTH, 342);
    ctx.lineTo(WIDTH, GROUND);
    ctx.lineTo(0, GROUND);
    ctx.fill();
    ctx.fillStyle = "#a6bd89";
    ctx.beginPath();
    ctx.moveTo(0, 385);
    ctx.quadraticCurveTo(330, 330, 600, 383);
    ctx.quadraticCurveTo(820, 345, WIDTH, 375);
    ctx.lineTo(WIDTH, GROUND);
    ctx.lineTo(0, GROUND);
    ctx.fill();

    for (let i = 0; i < 9; i += 1) {
      const x = ((i * 137 - distance * 0.18) % 1180 + 1180) % 1180 - 100;
      ctx.strokeStyle = "#f4e8bd";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, 375 + Math.sin(i) * 9);
      ctx.lineTo(x + 12, 350 + Math.cos(i) * 10);
      ctx.stroke();
    }
  }

  ctx.fillStyle = "#d6b783";
  ctx.fillRect(0, GROUND, WIDTH, HEIGHT - GROUND);
  ctx.fillStyle = "#8da879";
  ctx.fillRect(0, GROUND - 5, WIDTH, 8);
  ctx.strokeStyle = "rgba(118, 91, 61, 0.22)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 30; i += 1) {
    const x = ((i * 61 - distance * 0.8) % (WIDTH + 100) + WIDTH + 100) % (WIDTH + 100) - 50;
    const y = GROUND + 26 + (i % 4) * 22;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 8, y - 3, x + 18, y + 1);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 248, 224, 0.16)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  return zone;
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player, time: number) {
  const run = Math.sin(time * 13);
  const airborne = !player.onGround;
  const x = player.x;
  const y = player.y;

  ctx.save();
  ctx.fillStyle = "rgba(79, 70, 59, 0.16)";
  ctx.beginPath();
  ctx.ellipse(x + 24, GROUND + 1, airborne ? 17 : 25 - Math.abs(run) * 2, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const legSwing = airborne ? 5 : run * 9;
  ctx.strokeStyle = "#67504a";
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(x + 22, y + 54);
  ctx.lineTo(x + 20 + legSwing, y + 69);
  ctx.lineTo(x + 14 + legSwing, y + 73);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 30, y + 54);
  ctx.lineTo(x + 34 - legSwing, y + 68);
  ctx.lineTo(x + 42 - legSwing, y + 72);
  ctx.stroke();

  ctx.fillStyle = "#e3a36e";
  ctx.strokeStyle = "#76574b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 12, y + 28);
  ctx.quadraticCurveTo(x + 23, y + 18, x + 37, y + 28);
  ctx.lineTo(x + 40, y + 56);
  ctx.quadraticCurveTo(x + 26, y + 64, x + 11, y + 55);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#e3a36e";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(x + 12, y + 34);
  ctx.lineTo(x + 4, y + (airborne ? 28 : 42 + run * 5));
  ctx.moveTo(x + 37, y + 34);
  ctx.lineTo(x + 46, y + (airborne ? 23 : 42 - run * 5));
  ctx.stroke();

  ctx.fillStyle = "#f0bd8c";
  ctx.beginPath();
  ctx.arc(x + 25, y + 15, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#76574b";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#59483f";
  ctx.beginPath();
  ctx.arc(x + 23, y + 7, 15, Math.PI, Math.PI * 2);
  ctx.quadraticCurveTo(x + 42, y + 8, x + 38, y + 19);
  ctx.quadraticCurveTo(x + 30, y + 13, x + 15, y + 15);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#59483f";
  ctx.beginPath();
  ctx.arc(x + 31, y + 16, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#a56d59";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x + 30, y + 22, 4, 0.15, 1.55);
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

function safeReadBest() {
  try {
    return Number(window.localStorage.getItem(BEST_KEY) || 0);
  } catch {
    return 0;
  }
}

export function LittleDetourGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const jumpRef = useRef<(() => void) | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [runKey, setRunKey] = useState(0);
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState(0);
  const [best, setBest] = useState(safeReadBest);
  const [zone, setZone] = useState<Zone>("alley");
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);
  mutedRef.current = muted;

  const startRun = useCallback(() => {
    setScore(0);
    setCollected(0);
    setZone("alley");
    setRunKey((value) => value + 1);
    setPhase("playing");
  }, []);

  const jump = useCallback(() => {
    jumpRef.current?.();
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
      if (event.code === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

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

    const background = new Image();
    background.src = GAME_ART;
    let audio: AudioContext | null = null;
    const beep = (frequency: number, duration: number, shape: OscillatorType = "sine") => {
      if (mutedRef.current || !audio || audio.state !== "running") return;
      const osc = audio.createOscillator(); const gain = audio.createGain();
      osc.type=shape; osc.frequency.setValueAtTime(frequency,audio.currentTime);
      gain.gain.setValueAtTime(.0001,audio.currentTime); gain.gain.exponentialRampToValueAtTime(.08,audio.currentTime+.015); gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+duration);
      osc.connect(gain); gain.connect(audio.destination); osc.start(); osc.stop(audio.currentTime+duration);
    };
    let frame = 0;
    let lastTime = 0;
    let frameCount = 0;
    let scoreClock = 0;
    let world: World = {
      distance: 0,
      elapsed: 0,
      speed: 315,
      spawnTimer: 1.1,
      planeTimer: 0.7,
      obstacles: [],
      planes: [],
      collected: 0,
    };
    let lastZone: Zone = "alley";
    const player: Player = {
      x: PLAYER_X,
      y: GROUND - PLAYER_H,
      vy: 0,
      onGround: true,
      frame: 0,
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(canvas.width / WIDTH, 0, 0, canvas.height / HEIGHT, 0, 0);
      if (phase !== "playing") {
        drawBackground(ctx, 320, 0, background);
        drawPlayer(ctx, player, 0);
      }
    };

    const drawFrame = (time: number) => {
      const currentZone = drawBackground(ctx, world.distance, time, background);
      if (phase === "playing") {
        for (const plane of world.planes) drawPlane(ctx, plane, time);
        for (const obstacle of world.obstacles) {
          if (obstacle.kind === "puddle") drawPuddle(ctx, obstacle);
          else if (obstacle.kind === "bag") drawBag(ctx, obstacle);
          else drawFence(ctx, obstacle);
        }
        drawPlayer(ctx, player, time);
      } else {
        drawPlayer(ctx, player, time);
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
        window.removeEventListener("resize", resizeCanvas);
      };
    }

    jumpRef.current = () => {
      if (player.onGround) {
        if (!audio) audio = new AudioContext();
        if (audio.state === "suspended") void audio.resume();
        beep(520, .12, "triangle");
        player.vy = -720;
        player.onGround = false;
      }
    };

    const finishRun = () => {
      const finalScore = Math.floor(world.distance / 12) + world.collected * 35;
      setScore(finalScore);
      setCollected(world.collected);
      setBest((previous) => {
        const next = Math.max(previous, finalScore);
        try {
          window.localStorage.setItem(BEST_KEY, String(next));
        } catch {
          // Local score storage is optional; the game remains playable without it.
        }
        return next;
      });
      setPhase("gameover");
    };

    const tick = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.034);
      lastTime = timestamp;

      world.elapsed += dt;
      world.speed = Math.min(315 + world.elapsed * 8.5, 610);
      world.distance += world.speed * dt;
      player.frame += dt * 12;
      player.vy += 1900 * dt;
      player.y += player.vy * dt;

      if (player.y + PLAYER_H >= GROUND) {
        player.y = GROUND - PLAYER_H;
        player.vy = 0;
        player.onGround = true;
      }

      world.spawnTimer -= dt;
      if (world.spawnTimer <= 0) {
        const kinds: ObstacleKind[] = ["puddle", "bag", "fence"];
        const kind = kinds[Math.floor(Math.random() * kinds.length)];
        const width = kind === "puddle" ? 66 : kind === "bag" ? 43 : 48;
        const height = kind === "puddle" ? 20 : kind === "bag" ? 48 : 53;
        world.obstacles.push({ x: WIDTH + 40, kind, width, height });
        world.spawnTimer = Math.max(0.95, 1.62 - world.elapsed * 0.006) + Math.random() * 0.42;
      }

      world.planeTimer -= dt;
      if (world.planeTimer <= 0) {
        world.planes.push({
          x: WIDTH + 30,
          y: 280 + Math.random() * 90,
          bob: Math.random() * Math.PI * 2,
        });
        world.planeTimer = 1.35 + Math.random() * 1.2;
      }

      for (const obstacle of world.obstacles) obstacle.x -= world.speed * dt;
      for (const plane of world.planes) plane.x -= world.speed * dt;
      world.obstacles = world.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -30);
      world.planes = world.planes.filter((plane) => plane.x > -40);

      const playerBox = {
        left: player.x + 9,
        right: player.x + PLAYER_W - 7,
        top: player.y + 9,
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

      scoreClock += dt;
      if (scoreClock > 0.12) {
        scoreClock = 0;
        setScore(Math.floor(world.distance / 12) + world.collected * 35);
      }

      drawFrame(world.elapsed);
      frameCount += 1;
      if (frameCount > 0) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resizeCanvas);
      jumpRef.current = null;
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
            <button className="little-detour__icon-button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Enable sound" : "Mute sound"} title={muted ? "Enable sound" : "Mute sound"}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
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
              <span className="little-detour__zone">{zoneLabel}</span>
              <span className="little-detour__score">{score.toLocaleString()} <small>POINTS</small></span>
              <span className="little-detour__collect">✈ {collected}</span>
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
            onPointerDown={(event) => event.preventDefault()}
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
