# ChatterBox

Lightweight client-side chat app using vanilla JavaScript, DOM APIs, and browser storage. Designed for local/demo use — no backend required by default.

This README documents repository structure, development setup (Windows-focused), storage keys and data model conventions, and quick usage examples so contributors can get productive fast.

---

## Deployment

This app is currently deployed on GitHub Pages at: [https://hashimaziz88.github.io/chatterbox/](https://hashimaziz88.github.io/chatterbox/).

GitHub Pages deployment is configured to serve from the `main` branch, so pushing to `main` will update the live version. For local testing, see the "Quick start" section below.

---

## Summary

ChatterBox provides:

- Local user registration & authentication (stored in `localStorage` / `sessionStorage`).
- Per-tab sessions and cross-tab sync via the `storage` event.
- Messaging (direct & dynamic groups), user profiles, and a responsive UI for sending/receiving messages.
- Minimal dependencies — ES6 modules only; no build step required for local development.

---

## Machine requirements

To run and develop ChatterBox locally, ensure your machine meets the following requirements:

- **Modern Web Browser**: A recent version of [Google Chrome](https://www.google.com/chrome/), [Mozilla Firefox](https://www.mozilla.org/firefox/), or [Microsoft Edge](https://www.microsoft.com/edge) is required to support ES6 modules and the `storage` event API.
- **Code Editor**: [Visual Studio Code (VS Code)](https://code.visualstudio.com/) is the recommended editor for this project.
- **Live Server Extension**: For VS Code users, the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (by Ritwick Dey) is required for automatic browser reloading.
- **Python 3.x** (Optional): Available at [python.org](https://www.python.org/downloads/). Required if you prefer to serve the application via the terminal using the `http.server` module.
- **Node.js & npm** (Optional): Available at [nodejs.org](https://nodejs.org/). Useful if you prefer using `npx serve`.
- **Git**: Available at [git-scm.com](https://git-scm.com/). Required for cloning the repository and managing branch deployments to GitHub Pages.

---

## Project structure

- [index.html](https://www.google.com/search?q=index.html) — Launcher page that links the app pages.
- [pages/](https://www.google.com/search?q=pages/) — HTML views: sign-in, sign-up, main chats, profile.
- `sign-in.html`, `sign-up.html`, `main-chats.html`, `my-profile.html`.

- [js/](https://www.google.com/search?q=js/) — Page-specific logic scripts.
- `sign-in.js`, `sign-up.js`, `main-chats.js`, `my-profile.js`.

- [models/](https://www.google.com/search?q=models/) — Data & storage models (Single Source of Truth).
- `user.js`, `sessionmanager.js`, `message.js`, `chatstore.js`.

- [styles/](https://www.google.com/search?q=styles/) — CSS stylesheets.
- `styles.css`, `main-chats.css`, `my-profile.css`, etc.

---

## Quick start — Run locally (Windows)

No build step is required. Use one of the following methods to serve the files locally.

### Option 1: VS Code Live Server (Recommended)

This method allows you to see changes automatically reflected in your browser as you code.

1. **Install Extension**: Open VS Code, go to the **Extensions** tab, search for **"Live Server"** (by Ritwick Dey), and click **Install**.
2. **Open Project**: Open the `chatterbox` folder in VS Code.
3. **Launch**: Right-click `index.html` and select **Open with Live Server**, or click **"Go Live"** in the status bar.
4. **Auto-Reload**: The page will open at `http://127.0.0.1:5500`. It reloads automatically when you save changes.

### Option 2: Python 3 Static Server

1. Open PowerShell.
2. Navigate to your repo and run:

```powershell
cd "c:\Users\Hashim\Documents\Git Repos\chatterbox"
python -m http.server 5500

```

3. Open: `http://localhost:5500/index.html`.

## Quick start — Run locally (macOS/Linux)

No build step is required. Use one of the following methods to serve the files locally.

### Option 1: VS Code Live Server (Recommended)

This method allows you to see changes automatically reflected in your browser as you code.

1. **Install Extension**: Open VS Code, go to the **Extensions** tab, search for **"Live Server"** (by Ritwick Dey), and click **Install**.
2. **Open Project**: Open the `chatterbox` folder in VS Code.
3. **Launch**: Right-click `index.html` and select **Open with Live Server**, or click **"Go Live"** in the status bar.
4. **Auto-Reload**: The page will open at `http://127.0.0.1:5500`. It reloads automatically when you save changes.

### Option 2: Python 3 Static Server (Terminal/Bash)

1. Open your Terminal.
2. Navigate to your repository. If you are Hashim, the path might look like this:

```bash
cd ~/Documents/Git\ Repos/chatterbox

```

3. Start the server:

```bash
python3 -m http.server 5500

```

4. Open your browser and go to: `http://localhost:5500/index.html`.

---

## Conventions & design notes

- **Vanilla JS Modules**: ES6 Named exports used in models.
- **Security**: Avoid `innerHTML` for user-supplied content; use `textContent` to prevent XSS.
- **Responsive Design**: Mobile-view triggers at **860px** for single-column navigation.
- **Cross-tab Sync**: Implemented via `window.addEventListener('storage', ...)`.

---

## Debugging tips

- **Inspect Storage**: Use DevTools → Application → `localStorage` to see the JSON data.
- **Verify Sync**: Open two browser tabs side-by-side to verify real-time messaging and online rings.
- **Clear Session**: If you are stuck, clear `sessionStorage` or use the **Logout** button to reset your active session.
