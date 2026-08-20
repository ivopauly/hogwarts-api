<div align="center">
  <a href="https://hogwarts-api.com">
    <picture>
      <!-- The wordmark is navy, so it disappears on GitHub's dark theme.
           The dark variant recolours it; the gold bolt is shared by both. -->
      <source media="(prefers-color-scheme: dark)" srcset="public/logo-dark.png">
      <img src="public/logo.png" alt="Hogwarts API" width="280">
    </picture>
  </a>

  <br />
  <a href="https://github.com/ivopauly/hogwarts-api/issues/new?assignees=&labels=bug&template=1_bug_report.yml">Report a Bug</a>
  ·
  <a href="https://github.com/ivopauly/hogwarts-api/issues/new?assignees=&labels=enhancement&template=2_feature_request.yml">Request a Feature</a>
  ·
  <a href="https://github.com/ivopauly/hogwarts-api/discussions">Ask a Question</a>
  ·
  <a href="https://github.com/ivopauly/hogwarts-api/issues?q=is%3Aopen">Issues</a>
</div>

<div align="center">
<br />

# Hogwarts API

[![Netlify Status](https://api.netlify.com/api/v1/badges/7f0ff807-c593-4942-92fb-72dcf4bd03ea/deploy-status)](https://app.netlify.com/sites/hogwarts-api/deploys)
[![Project license](https://img.shields.io/github/license/ivopauly/hogwarts-api)](LICENSE)
[![Stars](https://img.shields.io/github/stars/ivopauly/hogwarts-api?style=flat-round)](https://github.com/ivopauly/hogwarts-api/stargazers)
[![Contributors](https://img.shields.io/github/contributors/ivopauly/hogwarts-api?style=flat-round)](https://github.com/ivopauly/hogwarts-api/graphs/contributors)
[![Issue](https://img.shields.io/github/issues/ivopauly/hogwarts-api?style=flat-round)](https://github.com/ivopauly/hogwarts-api/issues)
[![PRs](https://img.shields.io/github/issues-pr/ivopauly/hogwarts-api?style=flat-round)](https://github.com/ivopauly/hogwarts-api/pulls)
[![Lines of Code](https://tokei.rs/b1/github/ivopauly/hogwarts-api?category=code&style=flat-round)](https://github.com/ivopauly/hogwarts-api)

</div>

<details open="open">
<summary>Table of Contents</summary>

- [About ✨](#about-)
- [Developer Instructions 🪄](#developer-instructions-)
- [Support 🙋](#support-)
- [Contributing 💪](#contributing-)
- [Authors & Contributors 👥](#authors--contributors-)
- [Warranty 🔒](#warranty-)
- [License 📜](#license-)

</details>

## About ✨

The Hogwarts API is a magical API containing data from the wizarding world of Harry Potter, Hogwarts Legacy and the Fantastic Beasts universe.

It serves **6,084 records** across six collections as plain JSON over HTTP — no API key, no signup, no rate limit — so you have something better than `lorem ipsum` when building, teaching or demoing.

| Collection | Records | Endpoint |
| --- | --- | --- |
| Books | 7 | `/api/books` |
| Movies | 11 | `/api/movies` |
| Characters | 5,410 | `/api/characters` |
| Spells | 345 | `/api/spells` |
| Potions | 168 | `/api/potions` |
| Creatures | 143 | `/api/creatures` |

```bash
curl https://hogwarts-api.com/api/spells/expecto-patronum
```

Full documentation lives at **[hogwarts-api.com](https://hogwarts-api.com)**.

## Developer Instructions 🪄

### Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install

# bun
bun install
```

### Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Support 🙋

If you need any support, we're here to help! You can ask your question on the [GitHub Discussions](https://github.com/ivopauly/hogwarts-api/discussions) to get help from the community or open a [GitHub issue](https://github.com/ivopauly/hogwarts-api/issues/new/choose) to report a bug or request a feature. Our team will respond to your issue as soon as possible. We're committed to providing the best support possible to our users.

If you want to say **thank you** or/and support active development of Hogwarts API:

- Add a [GitHub Star](https://github.com/ivopauly/hogwarts-api) to the project.
- Engage with the community on [GitHub Discussions](https://github.com/ivopauly/hogwarts-api/discussions).
- Write interesting articles about the project on [Dev.to](https://dev.to/), [Medium](https://medium.com/) or your personal blog.

## Contributing 💪

First off, thanks for taking the time to contribute! Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are **greatly appreciated**.

If you want to help with the project make sure to look at the [Issues](https://github.com/ivopauly/hogwarts-api) and leave a note if you want to work on something.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

Please read [our contribution guidelines](CONTRIBUTING.md), and thank you for being involved!

## Authors & Contributors 👥

The original setup of this repository is by [Ivo Pauly-Koelewijn](https://github.com/ivopauly) and starter template [shadcn-docs-nuxt](https://github.com/ZTL-UwU/shadcn-docs-nuxt) is used.

For a full list of all authors and contributors, see [the contributors page](https://github.com/ivopauly/hogwarts-api/contributors).

## Warranty 🔒

Hogwarts API is provided **"as is"** without any **warranty**. Use at your own risk.

## License 📜

This project is licensed under the **MIT license**.

See [LICENSE](LICENSE) for more information.
