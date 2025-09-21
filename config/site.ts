export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "RUST VEIL",
  description: "Free LLM ",
  navItems: [
        {
      label: "Data",
      href: "/data",
    },
    {
      label: "SNA",
      href: "/social_network",
    },
    {
      label: "Sentiment",
      href: "/sentiment_analysis",
    },
    {
      label: "NER",
      href: "/ner",
    },
    {
      label: "Modelling",
      href: "/topic_modelling",
    },
    {
      label: "Classsification",
      href: "/topic_classification",
    },
    {
      label: "Relation",
      href: "/relation_extraction",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Data",
      href: "/data",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Workstation",
      href: "/work",
    },
  ],
  links: {
    github: "https://github.com/dwissaaj/rustveil",
    docs: "docs",
  },
};
