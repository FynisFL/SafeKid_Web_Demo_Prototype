"""SafeKid page scenes retain native content and input alternatives."""
import os
import re

from playwright.sync_api import expect, sync_playwright

origin = os.getenv("SAFEKID_BASE_URL", "http://127.0.0.1:4173").rstrip("/")
engine = os.getenv("SAFEKID_BROWSER", "chromium")


def visit(page, route):
    page.goto(origin + route, wait_until="domcontentloaded")
    expect(page.locator("main h1").first).to_be_visible()
    expect(page.get_by_test_id("first-scene")).to_have_count(0, timeout=12000)
    expect(page.locator("main[data-animated-content]")).to_have_count(1)


with sync_playwright() as driver:
    browser = getattr(driver, engine).launch(executable_path=os.getenv(f"SAFEKID_{engine.upper()}"))
    page = browser.new_page(viewport={"width": 390, "height": 844}, has_touch=True)
    page.route("https://fonts.googleapis.com/**", lambda route: route.fulfill(body="", content_type="text/css"))
    page.add_init_script("""(() => {
      const add = EventTarget.prototype.addEventListener;
      const remove = EventTarget.prototype.removeEventListener;
      window.heroPointerListeners = new Set();
      const track = (owner, type) => owner instanceof Element &&
        owner.classList.contains('perspective-1200') && /^pointer/.test(type);
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (track(this, type)) heroPointerListeners.add(listener);
        return add.call(this, type, listener, options);
      };
      EventTarget.prototype.removeEventListener = function(type, listener, options) {
        if (track(this, type)) heroPointerListeners.delete(listener);
        return remove.call(this, type, listener, options);
      };
    })()""")
    visit(page, "/")
    signal = page.locator("[data-hero-signal]")
    expect(signal).to_have_count(1, timeout=6000)
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    expect(signal).to_have_count(0)
    page.wait_for_function("window.heroPointerListeners.size === 0")
    page.evaluate("window.scrollTo(0, 0)")
    expect(signal).to_have_count(1)
    page.evaluate("""() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    }""")
    expect(signal).to_have_count(0)
    page.wait_for_function("window.heroPointerListeners.size === 0")
    page.close()

    page = browser.new_page(viewport={"width": 390, "height": 844})
    delayed = []
    page.route("**/assets/HeroSignal-*.js", lambda route: delayed.append(route))
    visit(page, "/")
    page.wait_for_timeout(800)
    assert delayed, "HeroSignal chunk should be deferred until the Hero has entered"
    expect(page.locator("[data-hero-signal]")).to_have_count(0)
    expect(page.get_by_role("link", name="Discover SafeKid", exact=True)).to_be_enabled()
    for route in delayed:
        route.continue_()
    expect(page.locator("[data-hero-signal]")).to_have_count(1)
    page.close()

    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.route("https://fonts.googleapis.com/**", lambda route: route.fulfill(body="", content_type="text/css"))
    visit(page, "/")
    passport = page.locator("section").filter(has=page.get_by_role("heading", name=re.compile("One Core.*More than one chapter")))
    initial = passport.evaluate("section => ({height: section.offsetHeight, zodiacTop: section.nextElementSibling.offsetTop})")
    passport.evaluate("section => scrollTo(0, section.offsetTop + section.offsetHeight - innerHeight * .35)")
    page.wait_for_timeout(900)
    final = passport.evaluate("section => ({height: section.offsetHeight, zodiacTop: section.nextElementSibling.offsetTop})")
    assert initial == final, (initial, final)
    page.close()

    for restriction in ("reduce", "save-data"):
        page = browser.new_page(viewport={"width": 390, "height": 844},
                                reduced_motion="reduce" if restriction == "reduce" else "no-preference")
        if restriction == "save-data":
            page.add_init_script("""Object.defineProperty(navigator, 'connection', {
              configurable: true, value: Object.assign(new EventTarget(), { saveData: true })
            })""")
        visit(page, "/")
        expect(page.get_by_role("link", name="Discover SafeKid", exact=True)).to_be_enabled()
        page.wait_for_timeout(600)
        expect(page.locator("[data-hero-signal]")).to_have_count(0)
        page.close()

    for width, count in [(390, 5), (768, 12), (1440, 12)]:
        page = browser.new_page(viewport={"width": width, "height": 900}, reduced_motion="reduce")
        visit(page, "/zodiac/")
        orbit = page.locator("[data-orbit-images]")
        expect(orbit.get_by_role("button")).to_have_count(count)
        next_edition = orbit.get_by_role("button", name=re.compile("Select Buffalo"))
        next_edition.click()
        expect(next_edition).to_have_attribute("aria-pressed", "true")
        page.get_by_role("link", name="Explore this edition", exact=True).click()
        expect(page).to_have_url(re.compile("/product/buffalo/?$"))
        page.go_back()
        expect(next_edition).to_have_attribute("aria-pressed", "true")
        page.close()

    page = browser.new_page(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    visit(page, "/sos/")
    slider = page.get_by_role("button", name="Slide to preview SOS")
    slider.press("Enter")
    expect(page.get_by_role("status")).to_contain_text("No alert was sent")
    page.get_by_role("button", name="Reset demo").click()
    expect(slider).to_be_enabled()
    visit(page, "/contact/")
    page.get_by_role("button", name="Slide to open draft").press("Enter")
    assert not page.locator("#contact-draft").evaluate("form => form.checkValidity()")
    expect(page.get_by_role("button", name="Open email draft", exact=True)).to_be_enabled()
    browser.close()
    print(f"PASS {engine} scene lifecycle, reduced motion, Save-Data, Orbit/Back, SOS and Contact keyboard paths")
