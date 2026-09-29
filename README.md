# The Marketing Game

A marketing portfolio you can play. Visitors open a board-game box, roll a die and move a token around a 20-space board. Every space opens a card: case studies with animated results, a player card, skills, career path, testimonials, wildcards that move you around, and a 20-second targeting mini-game. Anyone in a hurry can switch to a clean one-page portfolio with the **Read** button.

It's plain HTML, CSS and JavaScript. There's no build step and nothing to install, so it runs on GitHub Pages for free.

---

## 1. Make it hers (10 minutes)

Everything she'll want to change lives in **one file: `js/content.js`**. Open it in any text editor (TextEdit, Notepad, or VS Code) and replace the sample text. Keep the quote marks and commas; only change the words between the quotes.

| What | Where in `content.js` |
|---|---|
| Name, role, location, bio, email, LinkedIn | `person` |
| Player-card stats, superpower, weakness | `stats`, `superpower`, `weakness` |
| Case studies (up to 6) | `caseStudies` |
| Skills, tools, process | `skills`, `toolkit`, `playbook` |
| Jobs and qualifications | `experience`, `education` |
| Testimonials | `testimonials` (**use real quotes only**) |
| Fun facts and board surprises | `wildcards` |

When everything is real, set `sampleContent: false` at the top. That removes the yellow "Sample content" sticky note.

**Important:** every case study, number and testimonial in the file right now is sample content. Replace all of it with her real work before sharing the link.

### Adding images (optional)

- **Her photo:** put a square image at `assets/photo.jpg`, then set `photo: "assets/photo.jpg"`.
- **Case study images:** put images in `assets/work/` (2:1 landscape works best, e.g. 1600×800) and set `image: "assets/work/fizzwell.jpg"` on that case study. Without an image, each case gets generated cover art showing its headline result.
- **CV:** add `assets/Her-Name-CV.pdf` and set `cv: "assets/Her-Name-CV.pdf"`. A "Download CV" button appears.

File names are case-sensitive on GitHub: `Photo.JPG` and `photo.jpg` are different files.

### Link previews (LinkedIn, iMessage, WhatsApp, Slack)

Open `index.html` and edit the six lines at the top marked **EDIT THESE**: the title, the description, and the two URLs (swap `YOUR-USERNAME` and `YOUR-REPO` for the real ones). Link previews need the full `https://` address to the image.

`assets/og-image.png` is a generic preview image. For one with her name on it, open `tools/og.html?named` in Chrome, right-click, choose **Inspect**, press `Ctrl/Cmd + Shift + P`, run **Capture node screenshot** on the `<div id="og">` element, and save the result over `assets/og-image.png`.

---

## 2. Put it online with GitHub Pages (free)

### The no-code way (in the browser)

1. Sign up at [github.com](https://github.com) (free).
2. Click **+** at the top right, then **New repository**.
   - Name it something like `sophie-carter`. Or, for the shortest link, name it exactly `YOUR-USERNAME.github.io`.
   - Set it to **Public** and click **Create repository**.
3. On the new repository page, click **uploading an existing file**.
4. Open the portfolio folder on your computer, select **everything inside it** (not the folder itself), and drag it onto the page. That's `index.html`, `404.html`, `README.md`, and the `css`, `js`, `assets` and `tools` folders.
5. Click **Commit changes**.
6. Go to **Settings**, then **Pages** in the left sidebar. Under **Build and deployment**, set **Source** to **Deploy from a branch**, set the branch to **main** and the folder to **/ (root)**, then click **Save**.
7. Wait a minute or two and refresh. The address appears at the top of the Pages screen:
   - `https://YOUR-USERNAME.github.io/sophie-carter/`, or
   - `https://YOUR-USERNAME.github.io/` if you used the special repository name.

To update the site later, open a file on GitHub, click the pencil icon, edit, and **Commit changes**. The live site updates within a minute or two.

### The command-line way

```bash
cd portfolio
git init
git add .
git commit -m "The Marketing Game"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then turn on Pages as in step 6 above.

### Using her own domain (optional)

In **Settings → Pages → Custom domain**, enter the domain (e.g. `sophiecarter.com`), then add the DNS records GitHub shows you at the domain registrar. Tick **Enforce HTTPS** once it's available.

---

## 3. Preview on your computer before publishing

Double-clicking `index.html` works, but Chrome may block the custom fonts on local files. For an exact preview, run a tiny local server from the portfolio folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (VS Code's "Live Server" extension does the same.)

---

## How the game works

- **Roll the die** (button, or press `R` or Space) to move 1–6 spaces. **Click any space** to jump straight to it.
- **Coloured-band spaces** are case studies. The price at the bottom of each is its headline result.
- **Corners:** Launch day (rules, +200 Buzz every lap), Coffee break (her player card), Ad break (the mini-game), The pitch (contact).
- **Wildcards** show fun facts or move you: back two spaces, onward to the next case study, roll again, and so on.
- **Buzz** is the score. **Achievements** unlock as visitors explore. Visiting all 20 spaces triggers the end screen with a call to action.
- Progress is saved in the visitor's browser, so returning visitors can pick up where they left off.
- **Shareable case-study links:** every case study has its own URL (`…/#case/fizzwell`) and a **Copy link** button.
- **`#read`** at the end of the address opens the plain portfolio directly. It's handy for a CV or an email signature, and it prints cleanly to PDF.
- There's a secret. (Try the Konami code on the board: ↑ ↑ ↓ ↓ ← → ← → B A.)

Built in: keyboard support throughout, screen-reader labels and live announcements, reduced-motion support, sound toggle (sounds are generated live, so there are no audio files), responsive from small phones to large desktops, self-hosted fonts (no third-party requests), and a themed 404 page.

---

## Files

```
index.html          the page
404.html            "You rolled off the board" page
css/style.css       all the styling
js/content.js       ← ALL HER CONTENT. Edit this one.
js/app.js           the game engine
js/minigame.js      the Ad break mini-game
js/sound.js         synthesised sound effects
js/confetti.js      confetti for big moments
assets/             favicon, share image, fonts, her images
tools/og.html       redraws the link-preview image
```

Fonts and icons are open-source. See `CREDITS.md`.
