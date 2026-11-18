"""Interaction regressions for the motion refresh. Run against the production preview."""
import os
import re

from playwright.sync_api import expect, sync_playwright

BASE = os.getenv("SAFEKID_BASE_URL", "http://127.0.0.1:4173").rstrip("/")


def visit(page, path):
    page.goto(BASE + path, wait_until="domcontentloaded")
    expect(page.locator("h1").first).to_be_visible()


def search_and_checkout(page, width, height):
    visit(page, "/product/rat/")
    menu = page.get_by_role("button", name="Open menu")
    opener = page.get_by_role("button", name="Search the 12 editions")
    if width < 640:
        menu.click()
    opener.click()
    dialog = page.get_by_role("dialog", name="Search the Zodiac collection")
    search = dialog.get_by_role("textbox")
    expect(search).to_be_focused()
    page.wait_for_function("""() => {
        const {top, bottom} = document.querySelector('[role="dialog"]').getBoundingClientRect();
        return top >= 0 && bottom <= innerHeight;
    }""")
    for key in ("Shift+Tab", "Tab"):
        for _ in range(17):
            page.keyboard.press(key)
            assert dialog.evaluate("(el) => el.contains(document.activeElement)"), (width, height, key)
    search.fill("Dragon")
    expect(dialog.get_by_role("link")).to_have_count(1)
    page.keyboard.press("Escape")
    expect(menu if width < 640 else opener).to_be_focused()

    page.get_by_role("button", name="Add to bag").click()
    visit(page, "/checkout/")
    bar = page.get_by_role("complementary", name="Quick bag total")
    bar.get_by_role("button", name="Review total").click()
    ready = page.get_by_role("button", name="Confirm payment")
    page.wait_for_function("""() => {
        const confirm = document.querySelector('#bag-summary button').getBoundingClientRect();
        const bar = document.querySelector('aside[aria-label="Quick bag total"]').getBoundingClientRect();
        const header = document.querySelector('header').getBoundingClientRect();
        return confirm.bottom <= bar.top - 5 && confirm.top > header.bottom;
    }""")
    expect(page.locator("#bag-summary")).to_be_focused()
    ready.click()
    expect(page.get_by_role("dialog")).to_be_visible()
    page.keyboard.press("Escape")
    expect(ready).to_be_focused()


def collection_click(page, link):
    # The browser may scroll the link into view during the click itself.
    link.evaluate("""(el) => el.addEventListener("click", () => {
        window.collectionClickY = scrollY;
    }, {capture: true, once: true})""")
    link.click()
    return page.evaluate("window.collectionClickY")


def restore_collection(page, width):
    visit(page, "/zodiac/")
    if width < 1024:
        thumbnails = page.get_by_role("group", name="Edition thumbnails")
        first = thumbnails.get_by_role("button", name="Mouse edition")
        first.focus()
        page.keyboard.press("ArrowRight")
        expect(thumbnails.get_by_role("button", name="Buffalo edition")).to_have_attribute("aria-pressed", "true")
    else:
        page.get_by_role("button", name="Next edition", exact=True).click()
    link = page.get_by_role("link", name="Explore this edition")
    y = collection_click(page, link)
    expect(page).to_have_url(re.compile(r"/product/buffalo/?$"))
    expect(page.get_by_role("group", name="Edition thumbnails").get_by_role("button", name="Buffalo edition")).to_have_attribute("aria-pressed", "true")
    page.get_by_role("main").get_by_role("link", name="Zodiac collection", exact=True).click()
    expect(link).to_be_focused()
    assert abs(page.evaluate("scrollY") - y) <= 3, (width, y, page.evaluate("scrollY"))
    expect(link).to_have_attribute("href", "/product/buffalo")

    rail = page.get_by_role("region", name="All twelve editions")
    rail.get_by_role("button", name="Scroll collection right").click()
    card = rail.get_by_role("link", name=re.compile("Tiger edition"))
    y = collection_click(page, card)
    expect(page).to_have_url(re.compile(r"/product/tiger/?$"))
    page.go_back()
    expect(card).to_be_focused()
    assert abs(page.evaluate("scrollY") - y) <= 3, (width, y, page.evaluate("scrollY"))


def preserve_chat_scroll(page):
    visit(page, "/chat/")
    log = page.get_by_role("log", name="Conversation")
    composer = page.get_by_role("textbox", name="Your message")
    for _ in range(3):
        composer.fill("How much does a Mouse Edition watch cost?")
        composer.press("Enter")
        expect(page.get_by_role("button", name="Stop", exact=True)).to_have_count(0, timeout=7000)
    composer.fill("How much does a Mouse Edition watch cost?")
    composer.press("Enter")
    expect(page.get_by_role("button", name="Stop", exact=True)).to_be_visible()
    log.evaluate("(el) => el.scrollTo({top: 0, behavior: 'instant'})")
    assert log.evaluate("(el) => el.scrollTop") == 0
    unread = page.get_by_role("button", name="New message")
    expect(unread).to_be_visible(timeout=7000)
    assert log.evaluate("(el) => el.scrollTop") == 0
    unread.click()
    expect(log).to_be_focused()
    assert log.evaluate("(el) => el.scrollHeight - el.clientHeight - el.scrollTop") < 3


with sync_playwright() as driver:
    browser = driver.chromium.launch(executable_path=os.getenv("SAFEKID_CHROMIUM"))
    for width, height in [(320, 640), (390, 844), (667, 375), (844, 390), (768, 1024), (1440, 900)]:
        page = browser.new_page(viewport={"width": width, "height": height}, has_touch=width < 1024)
        page.route("https://fonts.googleapis.com/**", lambda route: route.fulfill(body="", content_type="text/css"))
        if width < 1024:
            search_and_checkout(page, width, height)
        restore_collection(page, width)
        page.close()
        print(f"PASS interaction regressions at {width}×{height}", flush=True)
    for preference in ("no-preference", "reduce"):
        page = browser.new_page(viewport={"width": 390, "height": 844}, reduced_motion=preference)
        preserve_chat_scroll(page)
        if preference == "reduce":
            visit(page, "/")
            story = page.get_by_role("region", name="SafeKid story chapters")
            story.get_by_role("button", name="Next story chapter").click()
            expect(story.get_by_role("button", name=re.compile("Chapter 2:"))).to_have_attribute("aria-current", "step")
        page.close()
        print(f"PASS chat and motion preference: {preference}", flush=True)
    browser.close()
