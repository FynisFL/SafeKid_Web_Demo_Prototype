"""Exercise the new scenes and the preserved hidden game."""
import os
import re

from playwright.sync_api import expect, sync_playwright

base = os.getenv("SAFEKID_BASE_URL", "http://127.0.0.1:4173").rstrip("/")

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.getenv("SAFEKID_CHROMIUM"))
    for width, height in [(320, 640), (390, 844), (768, 1024), (844, 390), (1024, 600), (1024, 768), (1363, 936), (1440, 900)]:
        page = browser.new_page(viewport={"width": width, "height": height})
        page.route("https://fonts.googleapis.com/**", lambda route: route.abort())
        page.goto(base + "/")
        action = page.get_by_role("link", name="Discover SafeKid", exact=True)
        expect(action).to_be_visible()
        expect(page.get_by_test_id("first-scene")).to_have_count(0, timeout=9000)
        action.click()
        if width >= 1024 and height >= 650:
            chapter = page.get_by_role("button", name=re.compile("Go to chapter 3:"))
            chapter.click()
            expect(chapter).to_have_attribute("aria-current", "step")
        elif 640 <= width < 1024 and height >= 650:
            expect(page.get_by_role("heading", name="Made it to school.")).to_be_visible()
            expect(page.get_by_role("heading", name="One shared moment.")).to_be_visible()
        else:
            chapter = page.get_by_role("button", name=re.compile("Chapter 3:"))
            chapter.click()
            expect(chapter).to_have_attribute("aria-current", "step")
        assert page.evaluate("document.documentElement.scrollWidth === innerWidth")
        page.goto(base + "/watch-passport/")
        layers = page.get_by_role("group", name="Choose a concept layer")
        skill = layers.get_by_role("button", name=re.compile("Skill"))
        skill.click()
        expect(skill).to_have_attribute("aria-pressed", "true")
        expect(page.get_by_text("Software capabilities can evolve", exact=False)).to_be_visible()
        assert page.evaluate("document.documentElement.scrollWidth === innerWidth")
        print(f"PASS Story and Passport at {width}×{height}", flush=True)
        page.close()

    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.route("https://fonts.googleapis.com/**", lambda route: route.abort())
    page.goto(base + "/")
    footer_logo = page.locator("footer").get_by_role("link", name="SafeKid home")
    footer_logo.hover()
    game = page.get_by_role("dialog", name="A Little Detour secret game")
    expect(game).to_be_visible(timeout=7500)
    game.get_by_role("button", name="Start", exact=True).click()
    expect(game.get_by_role("button", name="Jump", exact=True)).to_be_visible()
    game.get_by_role("button", name="Close secret game").click()
    expect(game).to_have_count(0)
    print("PASS Little Detour opens, runs and closes")
    browser.close()
