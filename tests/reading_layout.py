"""Check the Home ending, scoped motion, and Zodiac introduction."""

import os
import re

from playwright.sync_api import expect, sync_playwright

BASE = os.getenv("SAFEKID_BASE_URL", "http://127.0.0.1:4173").rstrip("/")
ENGINE = os.getenv("SAFEKID_BROWSER", "chromium")
EXECUTABLE = os.getenv(f"SAFEKID_{ENGINE.upper()}")


def wait_for_page(page, title):
    expect(page.get_by_role("heading", level=1, name=title)).to_be_visible()
    expect(page.get_by_test_id("first-scene")).to_have_count(0, timeout=10000)


def check_home(page, width, height, reduced_motion):
    page.goto(BASE, wait_until="domcontentloaded")
    wait_for_page(page, "Let them explore the world.")
    assert page.evaluate("document.documentElement.scrollWidth === innerWidth")

    if width >= 1024 and height >= 650 and not reduced_motion:
        page.locator("#story").evaluate("el => scrollTo(0, el.offsetTop + 200)")
        page.wait_for_function("document.querySelector('#story .sticky').getBoundingClientRect().top === 0")

    closing = page.get_by_role("region", name="Independence, with connection.")
    title = closing.get_by_role("heading", level=2)
    primary = closing.get_by_role("link", name="Meet the 12 editions")
    secondary = closing.get_by_role("link", name="Try the Parent App")
    for element in (title, primary, secondary):
        expect(element).to_have_css("opacity", "1")
    if width in (407, 488):
        peaks, settled = closing.evaluate("""section => new Promise(resolve => {
          const waves = Array.from(section.querySelectorAll('[data-closing-pulse]'));
          const peaks = waves.map(() => 0);
          const start = performance.now();
          function sample(now) {
            const values = waves.map(wave => Number(getComputedStyle(wave).opacity));
            values.forEach((value, index) => { peaks[index] = Math.max(peaks[index], value); });
            if (now - start < 1600) requestAnimationFrame(sample);
            else resolve([peaks, values]);
          }
          section.querySelector('[data-closing-stage]').scrollIntoView({ block: 'center', behavior: 'instant' });
          requestAnimationFrame(sample);
        })""")
        assert settled == [0, 0], settled
        if reduced_motion:
            assert peaks == [0, 0], peaks
        else:
            assert all(peak > 0.4 for peak in peaks), peaks

    closing.scroll_into_view_if_needed()
    for link in (primary, secondary):
        assert link.bounding_box()["height"] >= 44, link
        expect(link).to_be_in_viewport(ratio=1)
    expect(page.get_by_test_id("home-thread")).to_have_count(0)
    assert not page.evaluate(
        "performance.getEntriesByType('resource').some(entry => /HomeThread-/.test(entry.name))"
    )

    primary.click()
    expect(page).to_have_url(re.compile(r"/zodiac/?$"))
    page.go_back()
    expect(closing).to_be_visible()
    secondary.click()
    expect(page).to_have_url(re.compile(r"/app/?$"))


def check_zodiac(page, width, height):
    page.goto(f"{BASE}/zodiac/", wait_until="domcontentloaded")
    wait_for_page(page, "Twelve little explorers.")
    intro = page.get_by_role("region", name="Twelve little explorers.")
    collection = page.get_by_role("region", name="Choose a Zodiac edition")
    watch = collection.get_by_role("img", name=re.compile("in the Mouse edition"))
    expect(intro.get_by_role("img")).to_have_count(0)
    assert page.evaluate("document.documentElement.scrollWidth === innerWidth")

    if width < 640 and height >= 844:
        expect(watch).to_be_in_viewport(ratio=1)
    intro.get_by_role("link", name="Explore all 12 editions").click()
    expect(page).to_have_url(re.compile(r"/zodiac/?#collection$"))
    page.wait_for_function("""() => {
      const top = document.querySelector('#collection').getBoundingClientRect().top;
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
      return Math.abs(top - offset) <= 2;
    }""", timeout=5000)
    expect(watch).to_be_in_viewport()


with sync_playwright() as driver:
    browser = getattr(driver, ENGINE).launch(executable_path=EXECUTABLE)
    for width, height, reduce in [
        (320, 740, False), (407, 904, False), (488, 1085, True),
        (768, 1024, False), (844, 390, False), (1440, 900, False), (2712, 1220, False),
    ]:
        page = browser.new_page(
            viewport={"width": width, "height": height},
            reduced_motion="reduce" if reduce else "no-preference",
        )
        page.route("https://fonts.googleapis.com/**", lambda route: route.abort())
        check_home(page, width, height, reduce)
        check_zodiac(page, width, height)
        page.close()
        print(f"PASS {ENGINE} {width}x{height} reduced={reduce}", flush=True)
    browser.close()
