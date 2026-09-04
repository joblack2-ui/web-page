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
      { label: "OPPENHEIMER", target: "oppenheimer" }
    ]
  },

"apollo-11": {
  id: "apollo-11",
  type: "historical",
  title: "1969",

  text: `
MOON / EARTH / APOLLO 11

FIRST CREWED LUNAR LANDING
THREE HUMANS / ONE MISSION

LAUNCH: 16.07.1969
LANDING: 20.07.1969
RETURN: 24.07.1969
  `,

  meta: "USA / NASA / SATURN V",

  links: [
    { label: "MOON", target: "moon" },
    { label: "EARTH", target: "earth" },
    { label: "NEIL ARMSTRONG", target: "neil-armstrong" },
    { label: "BUZZ ALDRIN", target: "buzz-aldrin" },
    { label: "MICHAEL COLLINS", target: "michael-collins" },
    { label: "NASA", target: "nasa" },
    { label: "SATURN V", target: "saturn-v" },
    { label: "1969", target: "apollo-11" }
  ]
},

  earth: {
    id: "earth",
    type: "place",
    title: "EARTH",
    text: "ORIGIN / HUMAN SPECIES / UNKNOWN",
    meta: "SOL-3",
    links: [
      { label: "MOON", target: "moon" },
      { label: "MARS", target: "mars" },
      { label: "NASA", target: "nasa" },
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
      { label: "MOON", target: "moon" },
      { label: "EARTH", target: "earth" }
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
      { label: "MOON", target: "moon" },
      { label: "EARTH", target: "earth" }
    ]
  },

  moon: {
    id: "moon",
    type: "place",
    title: "MOON",
    text: "EARTH / NATURAL SATELLITE",
    meta: "DISTANCE ≈ 384,400 KM",
    links: [
      { label: "EARTH", target: "earth" },
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
      { label: "EARTH", target: "earth" },
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
      { label: "NASA", target: "nasa" },
      { label: "EARTH", target: "earth" }
    ]
  },

  hiroshima: {
    id: "hiroshima",
    type: "historical",
    title: "1945",
    text: "HIROSHIMA / JAPAN",
    meta: "06.08.1945",
    links: [
      { label: "MANHATTAN PROJECT", target: "manhattan-project" },
      { label: "OPPENHEIMER", target: "oppenheimer" },
      { label: "1945", target: "hiroshima" },
      { label: "JAPAN", target: "japan" }
    ]
  },

  japan: {
    id: "japan",
    type: "place",
    title: "JAPAN",
    text: "EAST ASIA / PACIFIC",
    meta: "ISLAND COUNTRY",
    links: [
      { label: "HIROSHIMA", target: "hiroshima" },
      { label: "1945", target: "hiroshima" },
      { label: "EARTH", target: "earth" }
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
      { label: "1945", target: "hiroshima" },
      { label: "USA", target: "usa" }
    ]
  },

  usa: {
    id: "usa",
    type: "place",
    title: "USA",
    text: "NORTH AMERICA / FEDERAL REPUBLIC",
    meta: "EARTH",
    links: [
      { label: "NASA", target: "nasa" },
      { label: "MANHATTAN PROJECT", target: "manhattan-project" },
      { label: "APOLLO 11", target: "apollo-11" },
      { label: "EARTH", target: "earth" }
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
      { label: "HIROSHIMA", target: "hiroshima" },
      { label: "USA", target: "usa" }
    ]
  }
};

  "george-washington": {
    id: "george-washington",
    type: "person",
    title: "George Washington",
    text: "George Washington was the 1st President of the United States, serving from April 30, 1789, to March 4, 1797. As one of the Founding Fathers, he led the Continental Army to victory in the American Revolutionary War and presided over the convention that drafted the U.S. Constitution.",
    meta: "Presidential Term: Apr 30, 1789 – Mar 4, 1797",
    links: [
      { label: "American Revolution", target: "american-revolution" }
    ]
  },
  "john-adams": {
    id: "john-adams",
    type: "person",
    title: "John Adams",
    text: "John Adams was the 2nd President of the United States, serving from March 4, 1797, to March 4, 1801. A prominent attorney, diplomat, and Founding Father, he was a leader of the American Revolution and served as the first vice president under George Washington.",
    meta: "Presidential Term: Mar 4, 1797 – Mar 4, 1801",
    links: [
      { label: "Declaration of Independence", target: "declaration-of-independence" }
    ]
  },
  "thomas-jefferson": {
    id: "thomas-jefferson",
    type: "person",
    title: "Thomas Jefferson",
    text: "Thomas Jefferson was the 3rd President of the United States, serving from March 4, 1801, to March 4, 1809. A Founding Father and the principal author of the Declaration of Independence, his presidency was highlighted by the Louisiana Purchase.",
    meta: "Presidential Term: Mar 4, 1801 – Mar 4, 1809",
    links: [
      { label: "Louisiana Purchase", target: "louisiana-purchase" }
    ]
  },
  "james-madison": {
    id: "james-madison",
    type: "person",
    title: "James Madison",
    text: "James Madison was the 4th President of the United States, serving from March 4, 1809, to March 4, 18017. Hailed as the 'Father of the Constitution' for his pivotal role in drafting the U.S. Constitution and the Bill of Rights, he led the country through the War of 1812.",
    meta: "Presidential Term: Mar 4, 1809 – Mar 4, 1817",
    links: [
      { label: "War of 1812", target: "war-of-1812" }
    ]
  },
  "james-monroe": {
    id: "james-monroe",
    type: "person",
    title: "James Monroe",
    text: "James Monroe was the 5th President of the United States, serving from March 4, 1817, to March 4, 1825. His presidency, known as the Era of Good Feelings, was defined by the Monroe Doctrine, which opposed European colonialism in the Americas.",
    meta: "Presidential Term: Mar 4, 1817 – Mar 4, 1825",
    links: [
      { label: "Monroe Doctrine", target: "monroe-doctrine" }
    ]
  },
  "john-quincy-adams": {
    id: "john-quincy-adams",
    type: "person",
    title: "John Quincy Adams",
    text: "John Quincy Adams was the 6th President of the United States, serving from March 4, 1825, to March 4, 1829. The son of John Adams, he was a masterful diplomat before his presidency and later served as a dedicated member of Congress fighting against slavery.",
    meta: "Presidential Term: Mar 4, 1825 – Mar 4, 1829",
    links: [
      { label: "Erie Canal", target: "erie-canal" }
    ]
  },
  "andrew-jackson": {
    id: "andrew-jackson",
    type: "person",
    title: "Andrew Jackson",
    text: "Andrew Jackson was the 7th President of the United States, serving from March 4, 1829, to March 4, 1837. A general in the War of 1812, his presidency saw the rise of Jacksonian democracy, the expansion of voting rights, and the controversial Indian Removal Act.",
    meta: "Presidential Term: Mar 4, 1829 – Mar 4, 1837",
    links: [
      { label: "Bank War", target: "bank-war" }
    ]
  },
  "martin-van-buren": {
    id: "martin-van-buren",
    type: "person",
    title: "Martin Van Buren",
    text: "Martin Van Buren was the 8th President of the United States, serving from March 4, 1837, to March 4, 1841. He was the first president born a U.S. citizen. His administration was largely defined by the economic hardships of the Panic of 1837.",
    meta: "Presidential Term: Mar 4, 1837 – Mar 4, 1841",
    links: [
      { label: "Panic of 1837", target: "panic-of-1837" }
    ]
  },
  "william-henry-harrison": {
    id: "william-henry-harrison",
    type: "person",
    title: "William Henry Harrison",
    text: "William Henry Harrison was the 9th President of the United States, serving from March 4, 1841, to April 4, 1841. He was a military officer famous for the Battle of Tippecanoe. He became the first U.S. president to die in office, serving for just 31 days.",
    meta: "Presidential Term: Mar 4, 1841 – Apr 4, 1841",
    links: [
      { label: "Battle of Tippecanoe", target: "battle-of-tippecanoe" }
    ]
  },
  "john-tyler": {
    id: "john-tyler",
    type: "person",
    title: "John Tyler",
    text: "John Tyler was the 10th President of the United States, serving from April 4, 1841, to March 4, 1845. Assuming the presidency upon William Henry Harrison's sudden death, he firmly established the precedent that a vice president succeeds to the full powers of the office.",
    meta: "Presidential Term: Apr 4, 1841 – Mar 4, 1845",
    links: [
      { label: "Texas Annexation", target: "texas-annexation" }
    ]
  },
  "james-k-polk": {
    id: "james-k-polk",
    type: "person",
    title: "James K. Polk",
    text: "James K. Polk was the 11th President of the United States, serving from March 4, 1845, to March 4, 1849. A strong proponent of Manifest Destiny, his single term saw massive territorial expansion following the Mexican-American War.",
    meta: "Presidential Term: Mar 4, 1845 – Mar 4, 1849",
    links: [
      { label: "Mexican-American War", target: "mexican-american-war" }
    ]
  },
  "zachary-taylor": {
    id: "zachary-taylor",
    type: "person",
    title: "Zachary Taylor",
    text: "Zachary Taylor was the 12th President of the United States, serving from March 4, 1849, to July 9, 1850. A national hero of the Mexican-American War, he sought to preserve the Union despite growing sectional debates over slavery before dying suddenly in office.",
    meta: "Presidential Term: Mar 4, 1849 – Jul 9, 1850",
    links: [
      { label: "Compromise of 1850", target: "compromise-of-1850" }
    ]
  },
  "millard-fillmore": {
    id: "millard-fillmore",
    type: "person",
    title: "Millard Fillmore",
    text: "Millard Fillmore was the 13th President of the United States, serving from July 9, 1850, to March 4, 1853. Assuming office after Zachary Taylor's death, he signed the Compromise of 1850 in an effort to delay the outbreak of a civil conflict.",
    meta: "Presidential Term: Jul 9, 1850 – Mar 4, 1853",
    links: [
      { label: "Fugitive Slave Act", target: "fugitive-slave-act" }
    ]
  },
  "franklin-pierce": {
    id: "franklin-pierce",
    type: "person",
    title: "Franklin Pierce",
    text: "Franklin Pierce was the 14th President of the United States, serving from March 4, 1853, to March 4, 1857. His administration signed the Kansas-Nebraska Act, which repealed the Missouri Compromise and fueled severe anti-slavery agitation across the nation.",
    meta: "Presidential Term: Mar 4, 1853 – Mar 4, 1857",
    links: [
      { label: "Kansas-Nebraska Act", target: "kansas-nebraska-act" }
    ]
  },
  "james-buchanan": {
    id: "james-buchanan",
    type: "person",
    title: "James Buchanan",
    text: "James Buchanan was the 15th President of the United States, serving from March 4, 1857, to March 4, 1861. His inability to effectively address the crisis of slavery and prevent the secession of Southern states directly preceded the American Civil War.",
    meta: "Presidential Term: Mar 4, 1857 – Mar 4, 1861",
    links: [
      { label: "Dred Scott Decision", target: "dred-scott-decision" }
    ]
  },
  "abraham-lincoln": {
    id: "abraham-lincoln",
    type: "person",
    title: "Abraham Lincoln",
    text: "Abraham Lincoln was the 16th President of the United States, serving from March 4, 1861, to April 15, 1865. He successfully led the country through the American Civil War, preserved the Union, and issued the Emancipation Proclamation before his assassination.",
    meta: "Presidential Term: Mar 4, 1861 – Apr 15, 1865",
    links: [
      { label: "Emancipation Proclamation", target: "emancipation-proclamation" }
    ]
  },
  "andrew-johnson": {
    id: "andrew-johnson",
    type: "person",
    title: "Andrew Johnson",
    text: "Andrew Johnson was the 17th President of the United States, serving from April 15, 1865, to March 4, 1869. Taking office after Lincoln's assassination, his contentious approach to post-Civil War Reconstruction led to his impeachment by the House of Representatives.",
    meta: "Presidential Term: Apr 15, 1865 – Mar 4, 1869",
    links: [
      { label: "Reconstruction Era", target: "reconstruction-era" }
    ]
  },
  "ulysses-s-grant": {
    id: "ulysses-s-grant",
    type: "person",
    title: "Ulysses S. Grant",
    text: "Ulysses S. Grant was the 18th President of the United States, serving from March 4, 1869, to March 4, 1877. As Union general, he led the North to victory in the Civil War. As president, he worked to protect the civil rights of newly freed African Americans.",
    meta: "Presidential Term: Mar 4, 1869 – Mar 4, 1877",
    links: [
      { label: "Fifteenth Amendment", target: "fifteenth-amendment" }
    ]
  },
  "rutherford-b-hayes": {
    id: "rutherford-b-hayes",
    type: "person",
    title: "Rutherford B. Hayes",
    text: "Rutherford B. Hayes was the 19th President of the United States, serving from March 4, 1877, to March 4, 1881. Winning office through the highly contested Compromise of 1877, his administration oversaw the official end of the Reconstruction era.",
    meta: "Presidential Term: Mar 4, 1877 – Mar 4, 1881",
    links: [
      { label: "Compromise of 1877", target: "compromise-of-1877" }
    ]
  },
  "james-a-garfield": {
    id: "james-a-garfield",
    type: "person",
    title: "James A. Garfield",

