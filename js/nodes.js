export const nodes = {
  start: {
    id: "start",
    type: "unknown",
    title: "07",
    text: "لم يتم التعرف على المصدر.",
    links: [
      { label: "1969", target: "apollo-11" },
      { label: "1945", target: "hiroshima" },
      { label: "MARS", target: "mars" },
      { label: "Oppenheimer", target: "oppenheimer" }
    ]
  },

  "apollo-11": {
    id: "apollo-11",
    type: "historical",
    title: "1969",
    text: "MOON / EARTH / APOLLO 11",
    meta: "20.07.1969 / USA",
    links: [
      { label: "NEIL ARMSTRONG", target: "neil-armstrong" },
      { label: "NASA", target: "nasa" },
      { label: "MOON", target: "moon" },
      { label: "1969", target: "apollo-11" }
    ]
  },

  "neil-armstrong": {
    id: "neil-armstrong",
    type: "person",
    title: "NEIL ARMSTRONG",
    text: "1930—2012 / USA / NASA",
    meta: "APOLLO 11",
    links: [
      { label: "APOLLO 11", target: "apollo-11" },
      { label: "NASA", target: "nasa" },
      { label: "MOON", target: "moon" }
    ]
  },

  nasa: {
    id: "nasa",
    type: "organization",
    title: "NASA",
    text: "EST. 1958 / USA",
    meta: "SPACE / EARTH / MOON",
    links: [
      { label: "APOLLO 11", target: "apollo-11" },
      { label: "MARS", target: "mars" },
      { label: "MOON", target: "moon" }
    ]
  },

  moon: {
    id: "moon",
    type: "place",
    title: "MOON",
    text: "EARTH / NATURAL SATELLITE",
    meta: "DISTANCE ≈ 384,400 KM",
    links: [
      { label: "APOLLO 11", target: "apollo-11" },
      { label: "NASA", target: "nasa" },
      { label: "MARS", target: "mars" }
    ]
  },

  mars: {
    id: "mars",
    type: "planet",
    title: "MARS",
    text: "EARTH / RED PLANET",
    meta: "STATUS: ACTIVE SUBJECT",
    links: [
      { label: "NASA", target: "nasa" },
      { label: "MOON", target: "moon" },
      { label: "2050", target: "future-mars" }
    ]
  },

  "future-mars": {
    id: "future-mars",
    type: "projected",
    title: "2050",
    text: "MARS / HUMAN PRESENCE",
    meta: "STATUS: PROJECTED",
    links: [
      { label: "MARS", target: "mars" },
      { label: "NASA", target: "nasa" }
    ]
  },

  "hiroshima": {
    id: "hiroshima",
    type: "historical",
    title: "1945",
    text: "HIROSHIMA / JAPAN",
    meta: "06.08.1945",
    links: [
      { label: "MANHATTAN PROJECT", target: "manhattan-project" },
      { label: "OPPENHEIMER", target: "oppenheimer" },
      { label: "1945", target: "hiroshima" }
    ]
  },

  "manhattan-project": {
    id: "manhattan-project",
    type: "historical",
    title: "MANHATTAN PROJECT",
    text: "USA / 1942—1946",
    meta: "NUCLEAR WEAPONS",
    links: [
      { label: "OPPENHEIMER", target: "oppenheimer" },
      { label: "HIROSHIMA", target: "hiroshima" },
      { label: "1945", target: "hiroshima" }
    ]
  },

  oppenheimer: {
    id: "oppenheimer",
    type: "person",
    title: "J. ROBERT OPPENHEIMER",
    text: "1904—1967 / USA",
    meta: "THEORETICAL PHYSICS",
    links: [
      { label: "MANHATTAN PROJECT", target: "manhattan-project" },
      { label: "HIROSHIMA", target: "hiroshima" }
    ]
  }
};
