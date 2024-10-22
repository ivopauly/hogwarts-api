export default defineAppConfig({
  shadcnDocs: {
    site: {
      name: "Hogwarts API",
      description:
        "The API for getting information on the wizarding world in Harry Potter & Hogwarts.",
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
      logo: {
        light: "/logo.svg",
        dark: "/logo-dark.svg",
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
      credits: "Copyright © 2024",
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
