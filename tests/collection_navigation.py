"""Check collection history and modal behaviour against the production preview."""
import os
import re

from playwright.sync_api import expect, sync_playwright

base = os.getenv("SAFEKID_BASE_URL", "http://127.0.0.1:4173").rstrip("/")
engine = os.getenv("SAFEKID_BROWSER", "chromium")

def settle_transition(page):
    page.wait_for_function("""() => !document.getAnimations().some(animation =>
      animation.effect?.pseudoElement?.startsWith('::view-transition'))""")

with sync_playwright() as driver:
    browser = getattr(driver, engine).launch(executable_path=os.getenv("SAFEKID_CHROMIUM"))
    for preference in ("no-preference", "reduce"):
        page = browser.new_page(viewport={"width": 1363, "height": 936}, reduced_motion=preference)
        page.route("https://fonts.googleapis.com/**", lambda route: route.fulfill(body="", content_type="text/css"))
        page.goto(f"{base}/zodiac/")
        dragon = page.get_by_role("button", name=re.compile("Dragon.*Thìn"))
        dragon.click()
        expect(dragon).to_have_attribute("aria-pressed", "true")
        settle_transition(page)
        stage_link = page.get_by_role("link", name="Explore this edition")
        stage_link.scroll_into_view_if_needed()
        y = page.evaluate("scrollY")
        assert y > 0
        stage_link.click()
        expect(page).to_have_url(re.compile(r"/product/dragon/?$"))
        settle_transition(page)
        page.go_back()
        expect(dragon).to_have_attribute("aria-pressed", "true")
        settle_transition(page)
        page.wait_for_function("expected => Math.abs(scrollY - expected) <= 3", arg=y)
        page.go_forward()
        expect(page).to_have_url(re.compile(r"/product/dragon/?$"))
        settle_transition(page)
        page.go_back()
        expect(dragon).to_have_attribute("aria-pressed", "true")
        settle_transition(page)

        rail = page.get_by_role("region", name="All twelve editions")
        mouse = rail.get_by_role("link", name=re.compile(r"Mouse edition"))
        mouse.scroll_into_view_if_needed()
        mouse.evaluate("el => el.addEventListener('click', () => { window.railDepartureY = scrollY; }, { once: true })")
        mouse.click()
        y = page.evaluate("window.railDepartureY")
        assert y > 0
        expect(page).to_have_url(re.compile(r"/product/rat/?$"))
        settle_transition(page)
        page.go_back()
        expect(dragon).to_have_attribute("aria-pressed", "true")
        settle_transition(page)
        page.wait_for_function("expected => Math.abs(scrollY - expected) <= 3", arg=y)

        search = page.get_by_role("button", name="Search the 12 editions")
        search.click()
        dialog = page.get_by_role("dialog", name="Search the Zodiac collection")
        input_box = dialog.get_by_role("textbox", name="Search editions")
        expect(input_box).to_be_focused()
        assert not page.get_by_role("link", name="Talk to the team", exact=True).count()
        for key in ["Shift+Tab", "Tab"] * 16 + ["Tab"] * 16:
            page.keyboard.press(key)
            assert dialog.evaluate("el => el.contains(document.activeElement)")
        page.keyboard.press("Escape")
        expect(dialog).to_have_count(0)
        expect(search).to_be_focused()
        page.wait_for_function("getComputedStyle(document.body).overflowY !== 'hidden'")

        search.click()
        input_box.fill("dragon")
        input_box.press("Enter")
        expect(page.get_by_role("heading", name="Dragon little explorer.")).to_be_visible()
        expect(dialog).to_have_count(0)
        page.wait_for_function("getComputedStyle(document.body).overflowY !== 'hidden'")
        settle_transition(page)
        page.go_back()
        expect(dragon).to_have_attribute("aria-pressed", "true")
        settle_transition(page)
        page.close()
        print(f"PASS {engine}: collection history and search, reduced motion={preference}")
    browser.close()
