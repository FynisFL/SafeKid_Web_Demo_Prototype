"""Run against the same preview and Chromium as motion_smoke.py."""
import os
from playwright.sync_api import expect, sync_playwright

engine = os.getenv("SAFEKID_BROWSER", "chromium")

base = os.getenv("SAFEKID_BASE_URL", "http://localhost:4173").rstrip("/")
with sync_playwright() as driver:
    browser = getattr(driver, engine).launch(executable_path=os.getenv(f"SAFEKID_{engine.upper()}"))
    for width, height in [(320, 640), (390, 844), (768, 1024), (844, 390), (1024, 768), (1440, 900)]:
        page = browser.new_page(viewport={"width": width, "height": height})
        page.route("https://fonts.googleapis.com/**", lambda route: route.fulfill(body="", content_type="text/css"))

        def visit(path):
            page.goto(base + path, wait_until="domcontentloaded")
            expect(page.locator("h1").first).to_be_visible()
            expect(page.get_by_test_id("first-scene")).to_have_count(0, timeout=9000)

        for path in ["/about/", "/contact/"]:
            visit(path)
            assert page.evaluate("document.documentElement.scrollWidth === innerWidth"), (path, width)

        visit("/sos/")
        hold = page.get_by_role("button", name="Press and hold SOS to preview the demonstration")
        hold.press("Enter")
        expect(page.get_by_role("button", name="Reset demo")).to_be_visible()
        assert hold.evaluate("""el => document.querySelector('[role=status]').parentElement
            .getBoundingClientRect().top > el.getBoundingClientRect().bottom""")

        visit("/product/rat/")
        if width < 1024:
            art = page.get_by_role("button", name="Enlarge Mouse edition image")
            add = page.get_by_role("button", name="Add to bag")
            assert page.locator("h1").bounding_box()["y"] < art.bounding_box()["y"] < add.bounding_box()["y"]
            menu = page.get_by_role("button", name="Open menu")
            menu.click()
            dialog = page.get_by_role("dialog", name="Site navigation")
            for _ in range(18):
                page.keyboard.press("Shift+Tab")
                assert dialog.evaluate("el => el.contains(document.activeElement)")
            page.keyboard.press("Escape")
            expect(menu).to_be_focused()
            menu.click()
            page.set_viewport_size({"width": 1100, "height": 768})
            expect(dialog).to_have_count(0)
            page.wait_for_function("getComputedStyle(document.body).overflowY !== 'hidden'")
            page.set_viewport_size({"width": width, "height": height})

        if width < 640:
            for path in ["/", "/zodiac/"]:
                visit(path)
                collection = page.locator('[aria-labelledby="collection-heading"]')
                watch = collection.get_by_role("img", name="SafeKid smartwatch concept in the Mouse edition")
                collection.scroll_into_view_if_needed()
                # The outer section clips overflow, so the document width can look correct
                # even when the whole stage has been pushed off screen by the edition rail.
                rail = collection.get_by_role("list", name="Zodiac editions")
                next_edition = collection.get_by_role("button", name="Next edition")
                for element in (watch, next_edition, rail):
                    box = element.bounding_box()
                    assert box and box["x"] >= 0 and box["x"] + box["width"] <= width + 1, (path, width, box)
                assert watch.evaluate("el => el.decode().then(() => el.naturalWidth > 0)")
                assert rail.evaluate("el => el.scrollWidth > el.clientWidth")
                next_edition.click()
                expect(collection.get_by_role("link", name="Explore this edition")).to_have_attribute("href", "/product/buffalo")

        visit("/app/")
        stage = page.locator(".sk-stage__viewport")
        stage.scroll_into_view_if_needed()
        box = stage.bounding_box()
        x, y = box["x"] + box["width"] * 0.7, box["y"] + box["height"] * 0.4
        page.mouse.move(x, y)
        page.mouse.down()
        page.mouse.move(x - 95, y, steps=12)
        page.mouse.up()
        expect(stage).to_have_attribute("data-scene", "sos")
        print(f"PASS {width}x{height}", flush=True)
        page.close()
    browser.close()
