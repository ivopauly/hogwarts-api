export default defineAppConfig({
  shadcnDocs: {
    site: {
      name: "Hogwarts API",
      description:
        "The Hogwarts API is a magical API containing data from the wizarding world of Harry Potter, Hogwarts Legacy and the Fantastic Beasts universe.",
      // A static card of the brand lockup. Without this the theme falls back to
      // generating one per page from the ShadcnDocs component, which does not
      // carry our branding.
      ogImage: "/og-image.png",
    },
    theme: {
      customizable: true,
      color: "zinc",
      radius: 0.5,
    },
    header: {
      title: "Hogwarts API",
      showTitle: true,
      darkModeToggle: true,
      // The mark only, not the full lockup: the header renders the logo at h-7
      // (28px) alongside the site title, so the wordmark would be both duplicated
      // and illegible. The dark variant recolours the navy shield to #F1F5F9 —
      // the gold bolt has enough contrast on either background and is unchanged.
      logo: {
        light: "/logo-mark.png",
        dark: "/logo-mark-dark.png",
      },
      nav: [],
      links: [
        {
          icon: "lucide:github",
          to: "https://github.com/ivopauly/hogwarts-api",
          target: "_blank",
        },
      ],
    },
    aside: {
      useLevel: true,
      collapse: false,
    },
    main: {
      breadCrumb: true,
      showTitle: true,
    },
    footer: {
      credits: "Copyright © 2026",
      links: [
        {
          icon: "lucide:github",
          to: "https://github.com/ivopauly/hogwarts-api",
          target: "_blank",
        },
      ],
    },
    toc: {
      enable: true,
      title: "On This Page",
      links: [
        {
          title: "Star on GitHub",
          icon: "lucide:star",
          to: "https://github.com/ivopauly/hogwarts-api",
          target: "_blank",
        },
        {
          title: "Create Issues",
          icon: "lucide:circle-dot",
          to: "https://github.com/ivopauly/hogwarts-api/issues",
          target: "_blank",
        },
      ],
    },
    search: {
      enable: true,
      inAside: false,
    },
  },
});
