import SiteLayout from "../components/SiteLayout.jsx";
import RippleButton from "../components/RippleButton.jsx";
import "../styles/interactive.css";

export default function NotFoundPage() {
  return (
    <SiteLayout>
      <section className="secondary-next-step not-found-page" data-reveal="up">
        <p className="landing-eyebrow"><span /> SAFEKID / NOT FOUND</p>
        <h1 className="landing-display">Looks like this trail ends here.</h1>
        <p>Head back to the SafeKid story or browse the Zodiac collection.</p>
        <div>
          <RippleButton className="landing-button landing-button-dark" as="a" href="#/">Return home</RippleButton>
          <RippleButton className="secondary-action" as="a" href="#/zodiac">Explore editions <span aria-hidden="true">→</span></RippleButton>
        </div>
      </section>
    </SiteLayout>
  );
}
