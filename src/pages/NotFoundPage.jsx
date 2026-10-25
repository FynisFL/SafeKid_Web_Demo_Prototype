import SiteLayout from "../components/SiteLayout.jsx";

export default function NotFoundPage() {
  return (
    <SiteLayout>
      <section className="secondary-next-step not-found-page" data-reveal="up">
        <p className="landing-eyebrow"><span /> SAFEKID / NOT FOUND</p>
        <h1 className="landing-display">Looks like this trail ends here.</h1>
        <p>Head back to the SafeKid story or browse the Zodiac collection.</p>
        <div>
          <a className="landing-button landing-button-dark" href="#/">Return home</a>
          <a className="secondary-action" href="#/zodiac">Explore editions <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </SiteLayout>
  );
}
