"""Exercise the decorative SVG on Home using the production build."""

import os
import re

from playwright.sync_api import expect, sync_playwright

BASE = os.getenv("SAFEKID_BASE_URL", "http://127.0.0.1:4173").rstrip("/")
ENGINE = os.getenv("SAFEKID_BROWSER", "chromium")
EXECUTABLE = os.getenv(f"SAFEKID_{ENGINE.upper()}")
THREAD = '[data-testid="home-thread"]'
HEAD = f"{THREAD} circle"
PATH = f"{THREAD} path"
SIZES = [(320, 740), (360, 800), (390, 844), (640, 900), (768, 1024),
         (844, 390), (1024, 600), (1280, 800), (1440, 900)]

GEOMETRY = """() => {
  const svg = document.querySelector('[data-testid="home-thread"]');
  const path = svg.querySelector('path');
  const length = path.getTotalLength();
  const start = document.querySelector('[data-home-thread-start]').getBoundingClientRect();
  const end = document.querySelector('[data-home-thread-end]').getBoundingClientRect();
  const box = svg.getBoundingClientRect();
  const points = Array.from({length: 101}, (_, index) => path.getPointAtLength(length * index / 100));
  const last = points[100];
  return {
    bounded: points.every(p => p.x >= 0 && p.x <= box.width && p.y >= 0 && p.y <= box.height),
    monotonic: points.slice(1).every((p, index) => p.y > points[index].y),
    startError: Math.hypot(box.left + points[0].x - start.left, box.top + points[0].y - start.top),
    endError: Math.hypot(box.left + last.x - end.left, box.top + last.y - end.top),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    chapters: [...document.querySelectorAll('[data-home-thread-chapter]')].map(el => el.dataset.homeThreadChapter),
  };
}"""

TRACK = """() => {
  const listeners = [];
  const pending = new Set();
  const belongsToThread = () => (new Error()).stack.includes('HomeThread-');
  const add = EventTarget.prototype.addEventListener;
  const remove = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function(type, fn, opts) {
    if (belongsToThread()) listeners.push([this, type, fn]);
    return add.call(this, type, fn, opts);
  };
  EventTarget.prototype.removeEventListener = function(type, fn, opts) {
    const index = listeners.findIndex(([target, event, listener]) => target === this && event === type && listener === fn);
    if (index !== -1) listeners.splice(index, 1);
    return remove.call(this, type, fn, opts);
  };
  const request = window.requestAnimationFrame;
  const cancel = window.cancelAnimationFrame;
  window.requestAnimationFrame = function(fn) {
    if (!belongsToThread()) return request.call(window, fn);
    const id = request.call(window, time => {
      pending.delete(id);
      fn(time);
    });
    pending.add(id);
    return id;
  };
  window.cancelAnimationFrame = function(id) {
    pending.delete(id);
    cancel.call(window, id);
  };
  window.threadResources = () => [listeners.length, pending.size];
}"""


def visit(page):
    page.route("https://fonts.googleapis.com/**", lambda route: route.abort())
    page.goto(BASE, wait_until="domcontentloaded")
    expect(page.locator(THREAD)).to_have_attribute("data-thread-mode", re.compile("scroll|static"))


def check_geometry(page):
    page.wait_for_function(f"({GEOMETRY})().startError < 2 && ({GEOMETRY})().endError < 2")
    result = page.evaluate(GEOMETRY)
    assert result["overflow"] <= 1 and result["bounded"] and result["monotonic"], result
    assert result["chapters"] == ["story", "app", "passport", "zodiac", "closing"], result


with sync_playwright() as playwright:
    browser = getattr(playwright, ENGINE).launch(executable_path=EXECUTABLE)
    page = browser.new_page(viewport={"width": 320, "height": 740}, reduced_motion="no-preference")
    visit(page)
    for width, height in SIZES:
        page.set_viewport_size({"width": width, "height": height})
        check_geometry(page)

    page.evaluate("""() => scrollTo(0, document.querySelector('#story').offsetTop + 400)""")
    page.wait_for_function("Math.abs(document.querySelector('#story .sticky').getBoundingClientRect().top) <= 2")
    expect(page.locator(HEAD)).to_have_attribute("opacity", "1")
    check_geometry(page)
    # Simulate a delayed font swap that wraps the Hero copy and moves chapters below it.
    before = page.locator(PATH).get_attribute("d")
    page.add_style_tag(content="section[aria-label='SafeKid introduction'] h1 {font: 900 94px/1.18 monospace !important;}")
    page.evaluate("document.fonts.dispatchEvent(new Event('loadingdone'))")
    expect(page.locator(PATH)).not_to_have_attribute("d", before)
    check_geometry(page)
    page.close()
    print(f"PASS {ENGINE}: single path, nine sizes, sticky Story, resize and delayed font reflow")

    for save_data in [False, True]:
        page = browser.new_page(viewport={"width": 390, "height": 844},
                                reduced_motion="no-preference" if save_data else "reduce")
        if save_data:
            page.add_init_script("""Object.defineProperty(navigator, 'connection', {
              value: Object.assign(new EventTarget(), {saveData: true})
            })""")
        visit(page)
        expect(page.locator(THREAD)).to_have_attribute("data-thread-mode", "static")
        expect(page.locator(PATH)).to_have_attribute("stroke-dashoffset", "0")
        expect(page.locator(HEAD)).to_have_attribute("opacity", "0")
        expect(page.get_by_role("heading", level=1)).to_be_visible()
        expect(page.locator('main a[href="/zodiac"]').first).to_be_visible()
        assert page.locator("canvas").count() == 0
        check_geometry(page)
        page.close()
    print(f"PASS {ENGINE}: reduced-motion/Save-Data preserve the static path and the Home content")

    page = browser.new_page(viewport={"width": 390, "height": 844}, reduced_motion="no-preference")
    page.add_init_script(f"({TRACK})()")
    visit(page)
    active = page.evaluate("threadResources()[0]")
    assert active >= 5, active
    page.evaluate("scrollTo(0, 700)")
    expect(page.locator(HEAD)).to_have_attribute("opacity", "1")
    before = page.locator(PATH).get_attribute("stroke-dashoffset")
    page.evaluate("""() => {
      Object.defineProperty(document, 'hidden', {configurable: true, value: true});
      document.dispatchEvent(new Event('visibilitychange'));
      scrollTo(0, 1000);
    }""")
    page.evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
    expect(page.locator(PATH)).to_have_attribute("stroke-dashoffset", before)
    assert page.evaluate("threadResources()[1]") == 0
    page.evaluate("""() => {
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    }""")
    expect(page.locator(PATH)).not_to_have_attribute("stroke-dashoffset", before)
    page.evaluate("""() => {
      const spacer = document.createElement('div');
      spacer.style.height = '300vh';
      document.body.append(spacer);
      scrollTo(0, document.body.scrollHeight);
    }""")
    page.wait_for_function("document.querySelector('[data-testid=home-thread]').getBoundingClientRect().bottom < 0")
    page.evaluate("new Promise(resolve => setTimeout(resolve, 100))")
    before = page.locator(PATH).get_attribute("d")
    page.add_style_tag(content="#story {padding-bottom: 80px}")
    page.evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
    expect(page.locator(PATH)).to_have_attribute("d", before)
    assert page.evaluate("threadResources()[1]") == 0
    page.evaluate("scrollTo(0, 400)")
    expect(page.locator(PATH)).not_to_have_attribute("d", before)

    for _ in range(3):
        page.evaluate("scrollTo(0, 0)")
        page.locator('main a[href="/zodiac"]').first.click()
        expect(page).to_have_url(re.compile(r"/zodiac/?$"))
        expect(page.locator(THREAD)).to_have_count(0)
        assert page.evaluate("threadResources()") == [0, 0]
        page.go_back()
        expect(page.locator(THREAD)).to_have_count(1)
        expect(page.locator(THREAD)).to_have_attribute("data-thread-mode", "scroll")
        assert page.evaluate("threadResources()[0]") == active
    page.close()
    print(f"PASS {ENGINE}: pauses out of view/hidden and releases listeners and RAFs on three round trips")

    page = browser.new_page(viewport={"width": 390, "height": 844})
    held = []
    page.route(re.compile(r"/HomeThread-[^/]+\.js$"), lambda route: held.append(route))
    page.route("https://fonts.googleapis.com/**", lambda route: route.abort())
    with page.expect_request(re.compile(r"/HomeThread-[^/]+\.js$")):
        page.goto(BASE, wait_until="domcontentloaded")
        collection = page.locator('main a[href="/zodiac"]').first
        collection.focus()
        page.wait_for_function("performance.getEntriesByName('safekid-hero-enter').length > 0")
        expect(collection).to_be_focused()
        expect(collection).to_be_enabled()
        expect(page.locator(THREAD)).to_have_count(0)
    collection.press("Enter")
    expect(page).to_have_url(re.compile(r"/zodiac/?$"))
    assert held, "The lazy chunk request was never intercepted"
    held[0].continue_()
    page.go_back()
    expect(page.locator(THREAD)).to_have_count(1)
    assert page.evaluate("""() => {
      const start = performance.getEntriesByName('safekid-hero-enter')[0];
      const chunk = performance.getEntriesByType('resource').find(entry => entry.name.includes('/HomeThread-'));
      return start && chunk && chunk.startTime >= start.startTime;
    }"""), "The SVG chunk started loading before the Hero entrance"
    print(f"PASS {ENGINE}: the SVG starts after the Hero and does not block keyboard navigation")
    browser.close()
