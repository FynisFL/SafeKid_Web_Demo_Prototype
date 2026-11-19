"""Check entry progress, fallbacks, and page-specific loading in Chromium."""
import os
import re

from playwright.sync_api import expect, sync_playwright

BASE = os.getenv("SAFEKID_BASE_URL", "http://127.0.0.1:4173").rstrip("/")
WATCH = re.compile(r"/assets/rat-[^/]+\.webp$")
FONTS = "https://fonts.googleapis.com/**"


def enter(page, path="/"):
    page.goto(BASE + path, wait_until="commit")


def visible_home(page, timeout=9000):
    expect(page.get_by_role("heading", name="Let them explore the world.")).to_be_visible(timeout=timeout)
    expect(page.get_by_test_id("first-scene")).to_have_count(0, timeout=timeout)
    expect(page.get_by_role("link", name="Discover SafeKid", exact=True)).to_be_visible()


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.getenv("SAFEKID_CHROMIUM"))

    context = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    context.route(FONTS, lambda route: route.abort())
    context.add_init_script("""(() => {
      window.progressSamples = [];
      new MutationObserver(() => {
        const bar = document.querySelector('[data-testid=first-scene] [role=progressbar]');
        if (!bar) return;
        const value = Number(bar.getAttribute('aria-valuenow'));
        if (window.progressSamples.at(-1) !== value) window.progressSamples.push(value);
      }).observe(document, {subtree: true, childList: true, attributes: true, attributeFilter: ['aria-valuenow']});
    })()""")
    page = context.new_page()
    cdp = context.new_cdp_session(page)
    cdp.send("Network.enable")
    cdp.send("Network.emulateNetworkConditions", {
        "offline": False, "latency": 150, "downloadThroughput": 62500, "uploadThroughput": 31250,
    })
    enter(page)
    visible_home(page, timeout=20000)
    progress = page.evaluate("progressSamples")
    assert len(progress) > 1 and progress[-1] == 100 and progress == sorted(progress), progress
    assert page.evaluate("document.querySelector('main').closest('[inert]') === null")
    assert page.evaluate("document.documentElement.scrollWidth === innerWidth")
    cdp.send("Network.emulateNetworkConditions", {
        "offline": False, "latency": 0, "downloadThroughput": -1, "uploadThroughput": -1,
    })
    page.reload(wait_until="commit")
    visible_home(page)
    assert page.evaluate("progressSamples") == []
    context.close()
    print("PASS throttled cold start, monotonic progress, blocked font, warm reload")

    page = browser.new_page()
    page.route(WATCH, lambda route: route.fulfill(status=404, body=""))
    enter(page)
    visible_home(page)
    page.close()
    print("PASS missing opening watch falls back to readable content")

    page = browser.new_page(reduced_motion="reduce")
    page.route(FONTS, lambda route: route.abort())
    page.route(WATCH, lambda route: route.fulfill(status=404, body=""))
    enter(page, "/product/dragon/")
    expect(page.get_by_test_id("first-scene")).to_have_count(0)
    expect(page.get_by_role("heading", name="Dragon little explorer.")).to_be_visible()
    expect(page.locator("img[data-edition-art=dragon]")).to_have_js_property("complete", True)
    assert page.locator("img[data-edition-art=dragon]").evaluate("img => img.naturalWidth > 0")
    page.close()
    print("PASS direct product and reduced motion without Hero asset")

    for keyboard_skip in (True, False):
        page = browser.new_page()
        requests = []
        page.route(FONTS, lambda route: route.abort())
        page.route(WATCH, lambda route: requests.append(route))
        enter(page)
        expect(page.get_by_role("progressbar", name="First scene preparation")).to_be_visible()
        expect(page.locator("main h1")).to_have_count(1)
        if keyboard_skip:
            skip = page.get_by_role("button", name="Skip intro")
            skip.focus()
            page.keyboard.press("Enter")
        visible_home(page)
        if keyboard_skip:
            expect(page.locator("main")).to_be_focused()
        for route in requests:
            route.abort()
        page.close()
    print("PASS keyboard Skip, focus return and hard timeout for a stalled asset")

    page = browser.new_page(java_script_enabled=False)
    enter(page)
    expect(page.get_by_role("heading", name=re.compile("SafeKid.*The space between them"))).to_be_visible()
    page.close()
    browser.close()
    print("PASS readable HTML fallback with JavaScript disabled")
