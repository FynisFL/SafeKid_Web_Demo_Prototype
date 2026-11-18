import { ArrowDown, ArrowLeft, ArrowUpRight, Download, Globe2, Smartphone } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { SignalStage } from "@/components/app-experience/SignalStage";
import { scenes } from "@/components/app-experience/scenes";
import { EASE } from "@/components/motion/tokens";
import { BrandMark } from "@/components/site/BrandMark";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import "./app-experience.css";

type AndroidRelease = { url: string; version: string; size: string };

const appLinks: { webApp: string; androidRelease: AndroidRelease | null } = {
  webApp: "https://fynisfl.github.io/SafeKid-Parent-App-/",
  // Set this only after the public Release APK passes installation testing.
  androidRelease: null,
};

function WebAppLink() {
  return (
    <Button asChild size="lg" variant="brand" className="sk-app__tap sk-app__primary">
      <a href={appLinks.webApp}>Mở Web App <ArrowUpRight aria-hidden="true" /></a>
    </Button>
  );
}

function AndroidLink({ release }: { release: AndroidRelease | null }) {
  return (
    <a className="sk-app__tap sk-app__secondary" href={release?.url ?? "#android"}>
      <Download size={17} aria-hidden="true" /> Tải APK Android
    </a>
  );
}

export default function AppExperience() {
  usePageTitle("Trải nghiệm SafeKid Parent App | DigiBabi");

  const reduce = Boolean(useReducedMotion());
  const hero = useRef<HTMLElement>(null);
  const [interaction, setInteraction] = useState({ index: 0, replay: 0 });
  const scene = scenes[interaction.index];
  const { androidRelease } = appLinks;
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 36]);

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = "vi";
    if (window.location.hash === "#android") {
      document.getElementById("android")?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      document.documentElement.lang = previousLanguage;
    };
  }, []);

  function playScene(index: number) {
    setInteraction((current) => ({ index, replay: current.replay + 1 }));
  }

  return (
    <div className="sk-app" lang="vi">
      <header className="sk-app__header sk-app__shell">
        <BrandMark tone="light" compact />
        <Link className="sk-app__tap sk-app__back" to="/"><ArrowLeft size={16} aria-hidden="true" /> Quay về website</Link>
      </header>

      <main>
        <section className="sk-app__hero sk-app__shell" ref={hero}>
          <div className="sk-app__intro">
            <motion.div
              initial={reduce ? false : { opacity: 0.55, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.65, ease: EASE }}
            >
              <p className="sk-app__kicker">SafeKid Parent App</p>
              <h1>An tâm trong<br /> <span>từng kết nối.</span></h1>
              <p className="sk-app__lede">Khám phá ứng dụng dành cho phụ huynh, từ vùng an toàn đến những thói quen nhỏ mỗi ngày.</p>
            </motion.div>
            <div className="sk-app__actions">
              <WebAppLink />
              <AndroidLink release={androidRelease} />
            </div>
          </div>

          <motion.div className="sk-app__stage-placement" style={reduce ? undefined : { y: stageY }}>
            <SignalStage scene={scene} replay={interaction.replay} reduce={reduce}
              onReplay={() => playScene(interaction.index)} />
          </motion.div>

          <div className="sk-app__scenes">
            <h2>Thử một tình huống</h2>
            <div className="sk-app__scene-options" role="group" aria-label="Tình huống mô phỏng">
              {scenes.map(({ id, label, icon: Icon }, index) => (
                <button
                  type="button"
                  key={id}
                  className="sk-app__tap sk-app__scene"
                  aria-pressed={index === interaction.index}
                  onClick={() => playScene(index)}
                >
                  <Icon size={16} aria-hidden="true" /> {label}
                </button>
              ))}
            </div>
            <p className="sk-app__scene-description" aria-live="polite" aria-atomic="true">
              <span className="sr-only">{scene.title}. </span>{scene.description}
            </p>
          </div>
        </section>

        <section className="sk-app__access sk-app__shell" aria-labelledby="sk-app-access-title">
          <motion.div
            initial={reduce ? false : { opacity: 0.72, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
          >
            <h2 id="sk-app-access-title">Chọn cách trải nghiệm</h2>
            <div className="sk-app__cards">
              <article className="sk-app__card">
                <Globe2 size={22} aria-hidden="true" />
                <h3>Web App</h3>
                <p>Chạy trên trình duyệt của iPhone, Android và máy tính.</p>
                <WebAppLink />
              </article>
              <article className="sk-app__card" id="android">
                <Smartphone size={22} aria-hidden="true" />
                <h3>Android APK</h3>
                {androidRelease ? (
                  <>
                    <p>Phiên bản {androidRelease.version} · {androidRelease.size}. Mở tệp APK đã tải và làm theo hướng dẫn cài đặt trên Android.</p>
                    <AndroidLink release={androidRelease} />
                  </>
                ) : (
                  <p className="sk-app__availability"><ArrowDown size={15} aria-hidden="true" /> Bản Android đang chuẩn bị</p>
                )}
              </article>
            </div>
            <p className="sk-app__footnote">SafeKid Parent App đang trong giai đoạn thử nghiệm. Vị trí hiển thị là của điện thoại đang chạy app. Dữ liệu trên Web App và bản Android được lưu riêng.</p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
