"""P-A checks for touch targets, form sizing and the mobile chat shortcut."""
import os

from playwright.sync_api import expect, sync_playwright

base = os.getenv("SAFEKID_BASE_URL", "http://127.0.0.1:4173").rstrip("/")
engine = os.getenv("SAFEKID_BROWSER", "chromium")


def target(button):
    expect(button).to_be_visible()
    box = button.bounding_box()
    assert box and min(box["width"], box["height"]) >= 43.5, box


def visit(page, path):
    page.goto(base + path, wait_until="domcontentloaded")
    expect(page.locator("main h1").first).to_be_visible()
    expect(page.get_by_test_id("first-scene")).to_have_count(0, timeout=10000)


with sync_playwright() as playwright:
    browser_type = getattr(playwright, engine)
    browser = browser_type.launch(executable_path=os.getenv(f"SAFEKID_{engine.upper()}"))
    for width, height in [(320, 568), (390, 844), (844, 390), (768, 1024)]:
        mobile_options = {} if engine == "firefox" else {"is_mobile": True}
        page = browser.new_page(viewport={"width": width, "height": height}, has_touch=True,
                                device_scale_factor=2, reduced_motion="reduce", **mobile_options)
        page.route("https://fonts.googleapis.com/**", lambda route: route.abort())
        visit(page, "/contact")
        expect(page.locator('meta[name="viewport"]')).to_have_attribute(
            "content", "width=device-width, initial-scale=1.0, viewport-fit=cover"
        )
        for field in page.locator("main input, main textarea").all():
            assert field.evaluate("node => parseFloat(getComputedStyle(node).fontSize)") >= 16
        menu = page.get_by_role("button", name="Open menu")
        target(menu)
        if width < 640:
            menu.click()
        page.get_by_role("button", name="Search the 12 editions").click()
        search = page.get_by_role("textbox", name="Search editions")
        expect(search).to_be_focused()
        assert search.evaluate("node => parseFloat(getComputedStyle(node).fontSize)") >= 16
        target(page.get_by_role("button", name="Close search"))
        page.keyboard.press("Escape")
        expect(page.get_by_role("dialog")).to_have_count(0)

        visit(page, "/s-f-ai")
        shortcut = page.get_by_role("button", name="Open the demo chat")
        target(shortcut)
        if width <= 390 and height >= 640:
            box = shortcut.bounding_box()
            assert box["y"] + box["height"] <= height, box
        shortcut.click()
        expect(page.locator("#chat-input")).to_be_focused()
        assert page.locator("#chat-input").evaluate("node => parseFloat(getComputedStyle(node).fontSize)") >= 16
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1")
        page.close()
        print(f"PASS {engine} device foundation {width}×{height}", flush=True)
    browser.close()
