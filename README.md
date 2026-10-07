# HZ Arcade

The catalog page at **https://arcade.hz.ax/**. It lists the games and links to them; the games
themselves live in their own repositories in this organization and are published by GitHub Pages
under the same domain:

| Game | Address | Repository |
|---|---|---|
| Suika Jelly | https://arcade.hz.ax/suika-jelly/ | `suika-jelly` |
| Gold Miner | https://arcade.hz.ax/gold-miner/ | `gold-miner` |
| Pelican Pedal | https://arcade.hz.ax/pelican-pedal/ | `pelican-pedal` |
| Flap Flock | https://arcade.hz.ax/flap-flock/ | `flap-flock` |

## How the addresses work

This repository is the organization's Pages site and owns the custom domain (`CNAME`). GitHub
serves every other repository in the organization that has Pages turned on at
`arcade.hz.ax/<repository name>/`. Nothing here needs to change when a game is updated.

## Adding a game

1. Create the game's repository in this organization and turn on Pages for it. It must be built
   for the base path `/<repository name>/`.
2. Give it a `cover.png` (1200x630) at its root.
3. Add a card to `index.html` and its texts to the four tables in `catalog.js`.
4. Run `node scripts/assets.mjs` to refresh the link preview image, then push.

## Files

Plain files, no build step. `index.html` is complete without JavaScript; `catalog.js` only
switches the language (English, 简体中文, 繁體中文, Español) and passes an explicit choice on to the games
as `?lang=`.

The old addresses under `pages.hz.ax` forward here; those forwarding pages live in
`hwzh4640/hwzh4640.github.io`.
