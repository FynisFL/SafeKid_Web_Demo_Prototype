"""Run the SafeKid browser regressions against a local production build.

Install Python Playwright and its Chromium browser:
    python -m pip install playwright
    python -m playwright install chromium

Start the site with npm run build && npm run preview, then run:
    python tests/motion_smoke.py

SAFEKID_BASE_URL overrides the preview address. SAFEKID_CHROMIUM can point
to an existing Chromium executable. No real order or payment is submitted.
"""

import os
import re
from playwright.sync_api import expect, sync_playwright

base = os.environ.get("SAFEKID_BASE_URL", "http://127.0.0.1:4173").rstrip("/")
routes = ["", "app/", "zodiac/", "watch-passport/", "WatchPassport/", "about/", "support/", "contact/", "chat/", "s-f-ai/", "sos/", "cart/", "checkout/", "not-a-safekid-page"]
editions = "rat buffalo tiger cat dragon snake horse sheep monkey rooster dog pig".split()
sizes = [(320,640,True,False), (390,844,True,False), (768,1024,True,False), (844,390,True,False), (1024,600,False,False), (1024,768,False,False), (1440,900,False,False), (390,844,True,True), (1440,900,False,True)]

def go(page, path):
    page.goto(f"{base}/{path}", wait_until="domcontentloaded")
    expect(page.locator("h1").first, f"Heading on /{path}").to_be_visible(timeout=8000)
    expect(page.get_by_test_id("first-scene")).to_have_count(0, timeout=9000)

def swipe(context, page, target, distance):
    target.evaluate('(el) => el.scrollIntoView({block:"center", behavior:"instant"})')
    page.wait_for_timeout(300)
    box = target.bounding_box()
    assert box is not None
    x = box["x"] + box["width"] * (0.75 if distance < 0 else 0.25)
    y = box["y"] + min(120, box["height"] / 2)
    assert 100 < y < page.viewport_size["height"] - 10, (box,y)
    cdp = context.new_cdp_session(page)
    cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x, "y": y}]})
    for step in range(1, 13):
        cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x + distance * step / 12, "y": y}]})
    cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
    page.wait_for_timeout(180)
    cdp.detach()

def overflow(page, label):
    width, content = page.evaluate("[innerWidth,document.documentElement.scrollWidth]")
    assert content == width, (label, width, content)

def in_bounds(locator, width):
    assert locator.evaluate("(el, w) => { const r=el.getBoundingClientRect(); return r.left >= -0.5 && r.right <= w+0.5; }", width), locator

def init(context):
    context.route("https://fonts.googleapis.com/**",lambda r:r.fulfill(body="",content_type="text/css"))
    context.add_init_script("""(() => {
      window.transitionChecks = [];
      if (!document.startViewTransition) return;
      const original = document.startViewTransition.bind(document);
      document.startViewTransition = (...args) => {
        const old = [...document.querySelectorAll('img')].map(el => getComputedStyle(el).viewTransitionName).filter(n => n && n !== 'none');
        const transition = original(...args);
        transition.ready.then(() => {
          const next = [...document.querySelectorAll('img')].map(el => getComputedStyle(el).viewTransitionName).filter(n => n && n !== 'none');
          window.transitionChecks.push({old, next, ready:true});
        }, e => window.transitionChecks.push({old, ready:false, error:String(e)}));
        return transition;
      };
    })()""")

def browse_all(browser):
    count = 0
    for width,height,touch,reduce in sizes:
        ctx=browser.new_context(viewport={"width":width,"height":height},is_mobile=touch,has_touch=touch,reduced_motion="reduce" if reduce else "no-preference")
        init(ctx)
        page=ctx.new_page()
        errors=[]
        page.on("pageerror",lambda error:errors.append(str(error)))
        for route in routes+["product/"+edition+"/" for edition in editions]:
            go(page,route)
            if route == "WatchPassport/":
                expect(page).to_have_url(re.compile(r"/watch-passport/?$"))
            if "not-a-safekid-page" in route:
                expect(page.get_by_role("link",name="Back to the story")).to_be_visible()
            if route.startswith("product/"):
                expect(page.get_by_role("button",name="Add to bag")).to_be_visible()
                art=page.get_by_role("button",name=re.compile("Enlarge .* edition image"))
                in_bounds(art,width)
                expect(art.locator("img")).to_have_js_property("complete", True)
                assert art.locator("img").evaluate("(el) => el.naturalWidth > 0")
            overflow(page,route)
            count += 1
        assert not errors, (width,height,errors)
        print(f"ROUTES {width}x{height} reduced={reduce}: 26 passed",flush=True)
        ctx.close()
    print(f"ALL ROUTE CHECKS {count}",flush=True)

def interactions(browser, width, height, touch, reduce):
    ctx=browser.new_context(viewport={"width":width,"height":height},is_mobile=touch,has_touch=touch,reduced_motion="reduce" if reduce else "no-preference")
    init(ctx)
    page=ctx.new_page()
    errors=[]
    writes=[]
    page.on("pageerror",lambda error:errors.append(str(error)))
    page.on("request",lambda req:writes.append((req.method, req.url)) if req.method not in ("GET","HEAD","OPTIONS") else None)

    go(page,"")
    if touch and not reduce:
        story=page.get_by_role("region",name="SafeKid story chapters")
        keyboard=story.get_by_role("button",name=re.compile("Chapter 1:"))
        keyboard.focus()
        page.keyboard.press("ArrowRight")
        expect(story.get_by_role("button",name=re.compile("Chapter 2:"))).to_have_attribute("aria-current","step")
        story.get_by_role("button",name=re.compile("Chapter 1:")).click()
        expect(keyboard).to_have_attribute("aria-current","step")
        page.wait_for_timeout(400)
        track=story.locator('[aria-roledescription="slide"]:not([aria-hidden="true"])')
        swipe(ctx,page,track,-235)
        expect(story.get_by_role("button",name=re.compile("Chapter 2:"))).to_have_attribute("aria-current","step")
        for i in (3,1):
            button=story.get_by_role("button",name=re.compile(f"Chapter {i}:"))
            button.click()
            expect(button).to_have_attribute("aria-current","step")
            assert story.locator('[aria-roledescription="slide"]:not([aria-hidden="true"])').count() == 1
        in_bounds(story,width)
    elif not reduce:
        page.get_by_role("button",name=re.compile("Go to chapter 3:")).click()
        expect(page.get_by_role("button",name=re.compile("Go to chapter 3:"))).to_have_attribute("aria-current","step")

    home_app=page.get_by_role("region",name="SafeKid Parent App")
    home_app.get_by_role("button",name="SOS Demo").click()
    expect(home_app.get_by_text("SOS recorded").last).to_be_visible()
    home_app.get_by_role("link",name="Explore the Parent App").click()
    expect(page).to_have_url(re.compile(r"/app\?scenario=sos"))
    scenes=page.get_by_role("group",name="Demo scenarios")
    expect(scenes.get_by_role("button",name="SOS Demo")).to_have_attribute("aria-pressed","true")
    for label,title in (("Habits","Task completed"),("Safe Zones","Arrived at school"),("SOS Demo","SOS recorded")):
        scenes.get_by_role("button",name=label).click()
        expect(page.locator(".sk-stage__phone-event span")).to_have_text(title)
    page.get_by_role("button",name="Replay demo").click()
    expect(page.locator(".sk-stage__phone-event")).to_have_css("opacity","1")

    release=re.compile(r"https://api\.github\.com/repos/[^/]+/[^/]+/releases/tags/.*")
    page.route(release,lambda r:r.fulfill(status=200,json={"draft":False,"assets":[{"name":"SafeKid-Test.apk","size":2560000,"state":"uploaded"}]}))
    trigger=page.get_by_role("button",name="Download Android APK").first
    trigger.click()
    download=page.get_by_role("dialog")
    expect(download.get_by_role("heading",name="Download for Android")).to_be_visible()
    expect(download.get_by_role("link",name=re.compile(r"SafeKid-Test\.apk"))).to_be_visible()
    in_bounds(download,width)
    page.keyboard.press("Escape")
    expect(download).to_have_count(0)
    expect(trigger).to_be_focused()
    page.unroute(release)
    page.route(release,lambda r:r.fulfill(status=503,body="unavailable"))
    trigger.click()
    expect(download.get_by_text(re.compile("release could not be checked"))).to_be_visible()
    expect(download.get_by_role("link",name="View GitHub release")).to_be_visible()
    page.keyboard.press("Escape")

    go(page,"zodiac/")
    rail=page.get_by_role("region",name="All twelve editions")
    next_button=rail.get_by_role("button",name="Scroll collection right")
    prev_button=rail.get_by_role("button",name="Scroll collection left")
    expect(prev_button).to_be_disabled()
    next_button.click()
    expect(prev_button).to_be_enabled()
    next_button.focus()
    page.keyboard.press("ArrowLeft")
    expect(prev_button).to_be_disabled()
    if touch and not reduce:
        page.wait_for_timeout(400)
        swipe(ctx,page,rail.locator('[aria-roledescription="slide"]').first,-150)
        expect(prev_button).to_be_enabled()
        prev_button.click()
        expect(prev_button).to_be_disabled()
    # Click a visible card on a cold product route, recording both named snapshots.
    rail.get_by_role("link",name=re.compile("Mouse edition")).click()
    expect(page.get_by_role("heading",name="Mouse little explorer.")).to_be_visible()
    if not reduce:
        page.wait_for_function("window.transitionChecks?.length > 0",timeout=4500)
        result=page.evaluate("window.transitionChecks.at(-1)")
        assert result == {"old":["edition-rat"],"next":["edition-rat"],"ready":True}, result
    else:
        assert page.evaluate("window.transitionChecks.length") == 0

    zoom=page.get_by_role("button",name="Enlarge Mouse edition image")
    zoom.focus()
    page.keyboard.press("Enter")
    image=page.get_by_role("dialog",name="Mouse edition")
    expect(image.get_by_role("img")).to_be_visible()
    in_bounds(image,width)
    page.keyboard.press("Escape")
    expect(image).to_have_count(0)
    expect(zoom).to_be_focused()
    page.get_by_role("link",name=re.compile("Previous edition:")).click()
    expect(page).to_have_url(re.compile(r"/product/pig$"))
    page.get_by_role("link",name=re.compile("Next edition:")).click()
    expect(page).to_have_url(re.compile(r"/product/rat$"))
    if touch and not reduce:
        swipe(ctx,page,zoom,-140)
        expect(page).to_have_url(re.compile(r"/product/buffalo$"))
        expect(page.get_by_role("dialog")).to_have_count(0)
        page.wait_for_timeout(420)
        current=page.get_by_role("button",name=re.compile(r"Enlarge .* edition image"))
        swipe(ctx,page,current,140)
        expect(page).to_have_url(re.compile(r"/product/rat$"))
        expect(page.get_by_role("dialog")).to_have_count(0)
    go(page,"zodiac/")
    page.get_by_role("link",name="Explore this edition").click()
    expect(page.get_by_role("heading",name="Mouse little explorer.")).to_be_visible()
    if not reduce:
        page.wait_for_function("window.transitionChecks?.length > 0",timeout=4500)
        result=page.evaluate("window.transitionChecks.at(-1)")
        assert result == {"old":["edition-rat"],"next":["edition-rat"],"ready":True}, result

    print("PASS story, Parent App, APK feedback, Zodiac and Product",width,reduce,flush=True)

    go(page,"watch-passport/")
    stages=page.get_by_role("group",name="Lifecycle chapter").get_by_role("button")
    tabs=page.get_by_role("group",name="Passport section").get_by_role("button")
    for stage in range(4):
        stages.nth(stage).click()
        expect(stages.nth(stage)).to_have_attribute("aria-pressed","true")
        for tab in (1,2,0):
            tabs.nth(tab).click()
            expect(tabs.nth(tab)).to_have_attribute("aria-pressed","true")
            in_bounds(tabs.nth(tab),width)
        overflow(page,"passport")
    go(page,"about/")
    if touch or reduce:
        for card in page.get_by_role("button",name=re.compile(r"What .* works on")).all():
            card.click()
            expect(card).to_have_attribute("aria-expanded","true")
            panel_id=card.get_attribute("aria-controls")
            expect(page.locator(f'[id="{panel_id}"]').locator("li").first).to_be_visible()
            card.click()
            expect(card).to_have_attribute("aria-expanded","false")

    go(page,"support/")
    faq=page.get_by_role("button",name=re.compile("How much does a SafeKid watch cost"))
    faq.focus()
    page.keyboard.press("Enter")
    expect(faq).to_have_attribute("aria-expanded","true")
    expect(page.get_by_text(re.compile(r"Each watch is listed at 1\.450\.000"))).to_be_visible()
    page.keyboard.press("Enter")
    expect(faq).to_have_attribute("aria-expanded","false")

    go(page,"contact/")
    form=page.locator("form")
    send=page.get_by_role("button",name="Open email draft")
    send.click()
    assert form.evaluate("(el) => !el.checkValidity()")
    for name,value in [("name","QA Tester"),("email","tester@example.com"),("subject","SafeKid preview"),("message","Local browser test")]:
        form.locator(f'[name="{name}"]').fill(value)
    send.click()
    status=page.get_by_text(re.compile("An email draft should have opened"))
    expect(status).to_be_visible()
    form.locator('[name="message"]').fill("Edited draft")
    expect(status).to_have_count(0)

    go(page,"s-f-ai/")
    chat=page.get_by_role("log")
    question=page.get_by_placeholder("Ask about SafeKid…")
    question.fill("How much does a Mouse Edition watch cost?")
    question.press("Enter")
    expect(chat.get_by_text(re.compile(r"SafeKid watches are listed at 1\.450\.000"))).to_be_visible(timeout=7000)
    expect(chat.get_by_text("Reviewed",exact=True)).to_be_visible()
    assert chat.get_by_text("Reviewed",exact=True).locator("span").count() == 0
    page.get_by_role("button",name="New",exact=True).click()
    expect(chat.get_by_text("Reviewed",exact=True)).to_have_count(0)

    go(page,"sos/")
    sos=page.get_by_role("button",name="Press and hold to preview the SOS demonstration")
    sos.scroll_into_view_if_needed()
    b=sos.bounding_box()
    page.mouse.move(b["x"]+b["width"]/2,b["y"]+b["height"]/2)
    page.mouse.down()
    expect(page.get_by_role("status").filter(has_text="Keep holding")).to_be_visible()
    page.mouse.up()
    expect(page.get_by_role("status").filter(has_text="Hold the button")).to_be_visible()
    page.mouse.down()
    expect(page.get_by_role("status").filter(has_text="No alert was sent.")).to_be_visible(timeout=3000)
    page.mouse.up()
    page.get_by_role("button",name="Reset demo").click()
    sos.focus()
    page.keyboard.press("Space")
    expect(page.get_by_role("status").filter(has_text="No alert was sent.")).to_be_visible()

    go(page,"not-a-safekid-page")
    page.get_by_role("link",name="Back to the story").click()
    expect(page).to_have_url(base+"/")
    overflow(page,"return")
    assert not errors,(width,reduce,errors)
    assert not writes,(width,reduce,writes)
    print("PASS Passport, About, Support, Contact, Chat, SOS and 404",width,reduce,flush=True)

    go(page, "product/rat/")
    add=page.get_by_role("button",name="Add to bag")
    add.click()
    expect(page.get_by_role("link",name="Shopping bag, 1 item")).to_be_visible()
    flight=page.locator("[data-bag-flight]")
    expect(flight).to_have_count(0 if reduce else 1)
    expect(flight).to_have_count(0)
    page.get_by_role("link",name="View bag").click()
    page.get_by_role("button",name="Increase quantity for Mouse Edition").click()
    expect(page.locator("[data-preview-total]")).to_have_text(re.compile(r"2\.900\.000\s*₫"))
    expect(page.get_by_role("region",name="Bag summary").get_by_text("Free",exact=True)).to_have_count(3)
    page.get_by_role("link",name="Preview checkout").click()
    expect(page.get_by_role("heading",name="Checkout")).to_be_visible()
    for option in ("Bank QR", "Debit or credit card", "E-wallet"):
        method=page.get_by_role("radio",name=re.compile(option))
        method.locator("..").click()
        expect(method).to_be_checked()
        pay=page.get_by_role("button",name="Confirm payment")
        pay.click()
        dialog=page.get_by_role("dialog")
        expect(dialog.get_by_role("heading",name="SafeKid isn’t available to order yet")).to_be_visible()
        expect(dialog.get_by_text("Your items are still in your bag. No payment was taken.")).to_be_visible()
        in_bounds(dialog,width)
        page.keyboard.press("Escape")
        expect(dialog).to_have_count(0)
        expect(pay).to_be_focused()
    page.get_by_role("link",name="Back to bag").click()
    page.get_by_role("button",name="Remove Mouse Edition").click()
    expect(page.get_by_role("heading",name="Your bag is empty")).to_be_visible()
    assert not writes, (width,reduce,writes)
    assert not errors, (width,reduce,errors)
    print("PASS cart totals, all payment previews, focus restoration and empty state",width,reduce,flush=True)
    ctx.close()

def failed_chunk_fallback(browser):
    ctx=browser.new_context()
    init(ctx)
    page=ctx.new_page()
    page.route(re.compile(r"/assets/Product-[^/]+\.js"),lambda route:route.abort())
    page.goto(f"{base}/product/rat/",wait_until="domcontentloaded")
    expect(page.get_by_role("alert").get_by_role("heading",name="Something went wrong")).to_be_visible()
    expect(page.get_by_role("button",name="Try again")).to_be_visible()
    page.unroute(re.compile(r"/assets/Product-[^/]+\.js"))
    page.get_by_role("button",name="Try again").click()
    expect(page.get_by_role("heading",name="Mouse little explorer.")).to_be_visible()
    print("PASS route error fallback and retry",flush=True)
    ctx.close()

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get("SAFEKID_CHROMIUM"),args=["--no-sandbox"])
    if os.environ.get("SAFEKID_SUITE","both") != "interactions":
        browse_all(browser)
    if os.environ.get("SAFEKID_SUITE","both") != "routes":
        for i,size in enumerate(((390,844,True,False),(1440,900,False,False),(390,844,True,True))):
            if os.environ.get("SAFEKID_SIZE",str(i)) != str(i): continue
            interactions(browser,*size)
    if os.environ.get("SAFEKID_SUITE","both") == "both": failed_chunk_fallback(browser)
    browser.close()
