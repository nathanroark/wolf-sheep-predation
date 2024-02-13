export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Nathan Roark",
  url: "https://wolf-sheep-predation.nathanroark.dev",
  ogImage: "https://wolf-sheep-predation.nathanroark.dev/og.png", // png is the original format, jpg is there because discord keeps linking to jpg
  description: "Wolf Sheep Predation Simulation",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/nathanroark",
    github: "https://github.com/nathanroark",
  },
}
