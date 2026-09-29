/* =====================================================================
   THE MARKETING GAME — CONTENT FILE
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to make the portfolio yours.
   Everything on the board, the cards, the read-only portfolio view and
   the mini-game copy is generated from what's below.

   Tips
   • Keep the quotes and commas exactly as they are — only change the text
     between the quotes.
   • You can have 1–6 case studies. Empty board spaces become wildcards.
   • Images are optional. Drop files into /assets and point to them, e.g.
       photo: "assets/photo.jpg"
       image: "assets/work/fizzwell.jpg"
   • When everything is real, set  sampleContent: false  (this removes the
     yellow "sample content" sticky note in the corner).
   ===================================================================== */

window.PORTFOLIO = {

  sampleContent: true,

  /* ------------------------------------------------------------------ */
  /*  ABOUT HER                                                          */
  /* ------------------------------------------------------------------ */
  person: {
    name: "Sophie Carter",
    firstName: "Sophie",
    initials: "SC",
    role: "Brand & Growth Marketer",
    location: "Sydney, Australia",
    photo: "",                       // e.g. "assets/photo.jpg" (square works best)
    tagline: "I make brands impossible to scroll past, then prove it in the numbers.",
    bio: [
      "I'm a brand and growth marketer with seven years across consumer goods, finance and the arts. I sit in the gap between the creative team and the spreadsheet, and I like it there.",
      "My best work starts with a real customer tension, turns it into an idea people want to share, and ends with a result the CFO is happy to repeat in a board meeting."
    ],
    lookingFor: "Senior brand or growth roles in Sydney or remote, from early 2027.",
    email: "sophie@example.com",
    linkedin: "https://www.linkedin.com/in/your-profile",
    instagram: "",                   // optional, full URL
    website: "",                     // optional, full URL
    calendly: "",                    // optional, a booking link
    cv: ""                           // optional, e.g. "assets/Sophie-Carter-CV.pdf"
  },

  /* Stats on her player card (0–100). Keep it to 4–6. The last one is a joke. */
  stats: [
    { label: "Brand strategy", value: 92 },
    { label: "Campaign creative", value: 95 },
    { label: "Performance & paid", value: 84 },
    { label: "Social & creators", value: 90 },
    { label: "Data & analytics", value: 82 },
    { label: "Coffee tolerance", value: 100 }
  ],

  /* A superpower and a weakness, shown on her player card. */
  superpower: "Finding the one sentence that makes a whole campaign make sense.",
  weakness: "Can't walk past a good billboard without photographing it.",

  /* ------------------------------------------------------------------ */
  /*  CASE STUDIES  (up to 6 — these are the heart of the board)         */
  /*  colour options: tomato, sky, mint, pink, sun, grape                */
  /*  results: value is a number; prefix/suffix wrap it (e.g. "+", "%")  */
  /* ------------------------------------------------------------------ */
  caseStudies: [
    {
      id: "fizzwell",
      title: "Fizzwell relaunch",
      client: "Fizzwell Kombucha",
      year: "2024",
      role: "Brand lead",
      colour: "tomato",
      image: "",
      headline: { value: 212, prefix: "+", suffix: "%", label: "retail sell-through" },
      summary: "Took a sleepy health-food-aisle brand into the fridge next to the energy drinks, with a louder pack and a campaign built around the 3pm slump.",
      challenge: "Fizzwell tasted great but looked like medicine. It was stuck on the bottom shelf of the health aisle, and the people most likely to love it — office workers hunting for an afternoon pick-me-up — never walked down that aisle.",
      approach: [
        "Interviewed 40 people about their 3pm routine and found the real enemy: the guilty second coffee.",
        "Rebuilt the pack around bold flavour colour blocks so it read from three metres away in a fridge.",
        "Launched \"Beat the 3pm\" across out-of-home near office towers, TikTok and in-store sampling timed to 3pm.",
        "Pitched a fridge-placement trial to two grocery chains using sampling data as proof."
      ],
      results: [
        { value: 212, prefix: "+", suffix: "%", label: "Retail sell-through in 6 months" },
        { value: 3.1, suffix: "M", decimals: 1, label: "Organic impressions" },
        { value: 1, prefix: "#", label: "New SKU in the category" }
      ],
      tags: ["Brand strategy", "Packaging", "Integrated campaign", "Retail"]
    },
    {
      id: "harbourline",
      title: "First home, first bank",
      client: "Harbourline Credit Union",
      year: "2023",
      role: "Marketing manager",
      colour: "sky",
      image: "",
      headline: { value: 38, prefix: "−", suffix: "%", label: "cost per lead" },
      summary: "A performance campaign for first-home buyers that swapped rate-shouting for honest, useful tools, and halved what each lead cost.",
      challenge: "Every bank in the market was yelling the same interest rate. Harbourline couldn't win on price, and its paid search costs were climbing every quarter.",
      approach: [
        "Mapped the first-home-buyer journey and found the moment of peak anxiety: working out a deposit.",
        "Built a plain-English deposit calculator and made it the hero of every ad.",
        "Restructured paid search and Meta around intent stages instead of products.",
        "Set up a nurture email sequence that answered one scary question per email."
      ],
      results: [
        { value: 38, prefix: "−", suffix: "%", label: "Cost per lead" },
        { value: 18, suffix: "k", label: "Loan enquiries in 9 months" },
        { value: 2.4, suffix: "×", decimals: 1, label: "Calculator-to-enquiry rate vs. site average" }
      ],
      tags: ["Performance", "Paid search", "Meta ads", "Email nurture"]
    },
    {
      id: "solenne",
      title: "The creator class",
      client: "Solenne Skincare",
      year: "2024",
      role: "Social & creator lead",
      colour: "pink",
      image: "",
      headline: { value: 9.4, suffix: "M", decimals: 1, label: "views" },
      summary: "An always-on creator program that paid for honesty, not reach, and turned a small skincare brand into a TikTok regular.",
      challenge: "Solenne had a loyal but tiny following and a budget that couldn't buy big influencers. One-off sponsored posts weren't moving sales.",
      approach: [
        "Recruited 42 micro-creators who were already customers, and paid them for long-term honesty instead of one-off posts.",
        "Gave creators a monthly \"skin diary\" format rather than a script.",
        "Turned the best-performing diaries into paid Spark Ads within 48 hours.",
        "Tracked every creator with unique codes so budget moved to what actually sold."
      ],
      results: [
        { value: 9.4, suffix: "M", decimals: 1, label: "Views across creator content" },
        { value: 4.2, suffix: "×", decimals: 1, label: "Return on ad spend" },
        { value: 42, label: "Creators in the program" }
      ],
      tags: ["Creator marketing", "TikTok", "Paid social", "Community"]
    },
    {
      id: "paper-lantern",
      title: "A season worth staying in for",
      client: "Paper Lantern Theatre Co.",
      year: "2022",
      role: "Content & CRM",
      colour: "grape",
      image: "",
      headline: { value: 64, prefix: "+", suffix: "%", label: "subscriptions" },
      summary: "A season launch that sold the experience of a night out, not a list of plays, and turned one-off ticket buyers into subscribers.",
      challenge: "Single-ticket sales were fine but subscriptions had fallen for three years. The season brochure read like a timetable.",
      approach: [
        "Reframed the season as \"eight nights you'll talk about for weeks\" and led with feelings, not titles.",
        "Filmed 20-second backstage teasers for each show and released one a week.",
        "Rebuilt the email program with behaviour-based journeys for lapsed and first-time bookers.",
        "Introduced a flexible \"pick any four\" subscription tested against the old fixed pack."
      ],
      results: [
        { value: 64, prefix: "+", suffix: "%", label: "Season subscriptions" },
        { value: 51, suffix: "%", label: "Average email open rate" },
        { value: 30, prefix: "+", suffix: "%", label: "Repeat bookers year on year" }
      ],
      tags: ["Content", "Email & CRM", "Video", "Arts"]
    },
    {
      id: "spoke",
      title: "Ride again",
      client: "Spoke & Co. Bikes",
      year: "2023",
      role: "Lifecycle marketer",
      colour: "mint",
      image: "",
      headline: { value: 27, prefix: "+", suffix: "%", label: "repeat purchase" },
      summary: "A lifecycle program that treated the day after a bike purchase as the start of the relationship, not the end.",
      challenge: "Spoke sold great bikes but almost nobody came back. Customers bought once, then serviced and upgraded elsewhere.",
      approach: [
        "Segmented customers by riding style using purchase and survey data.",
        "Built a first-90-days onboarding journey with ride tips, routes and a free service reminder.",
        "Launched a points-free loyalty idea: every service stamp unlocks a local group ride.",
        "A/B tested every journey step and killed anything that didn't lift repeat visits."
      ],
      results: [
        { value: 27, prefix: "+", suffix: "%", label: "Repeat purchase rate" },
        { value: 19, prefix: "−", suffix: "%", label: "Customer churn" },
        { value: 3200, label: "Riders at community rides" }
      ],
      tags: ["Lifecycle", "Loyalty", "Klaviyo", "A/B testing"]
    },
    {
      id: "afterglow",
      title: "Sold out in 36 hours",
      client: "Afterglow Night Markets",
      year: "2021",
      role: "Social & launch",
      colour: "sun",
      image: "",
      headline: { value: 36, suffix: " hrs", label: "to sell out" },
      summary: "A launch for a brand-new night market that built a waitlist before a single stall was booked.",
      challenge: "A first-year event with no audience, no track record and a tiny budget needed to sell 12,000 tickets in a crowded summer calendar.",
      approach: [
        "Opened a waitlist six weeks out with a vote on which food stalls to book.",
        "Let the waitlist name the market's signature dessert, and shared every step.",
        "Gave waitlisters a 24-hour head start and a bring-a-friend code.",
        "Partnered with 15 local food creators for opening-night coverage."
      ],
      results: [
        { value: 36, suffix: " hrs", label: "To sell 12,000 tickets" },
        { value: 21, suffix: "k", label: "Waitlist sign-ups" },
        { value: 0, prefix: "$", label: "Spent on paid media" }
      ],
      tags: ["Launch", "Community", "Social", "Events"]
    }
  ],

  /* ------------------------------------------------------------------ */
  /*  SKILLS & TOOLKIT                                                   */
  /* ------------------------------------------------------------------ */
  skills: [
    { name: "Brand strategy", detail: "Positioning, brand platforms, naming, tone of voice." },
    { name: "Integrated campaigns", detail: "From the brief to OOH, social, video and in-store." },
    { name: "Performance marketing", detail: "Paid search, paid social, CRO and budget planning." },
    { name: "Social & creators", detail: "Always-on content, creator programs, community." },
    { name: "Lifecycle & CRM", detail: "Email journeys, segmentation, loyalty and retention." },
    { name: "Measurement", detail: "GA4, attribution, dashboards and honest reporting." }
  ],

  toolkit: [
    "Google Analytics 4", "Google Ads", "Meta Ads Manager", "TikTok Ads",
    "HubSpot", "Klaviyo", "Looker Studio", "Semrush",
    "Figma", "Canva", "Adobe CC", "Notion"
  ],

  /* ------------------------------------------------------------------ */
  /*  HOW SHE WORKS  (a short, ordered process)                          */
  /* ------------------------------------------------------------------ */
  playbook: [
    { step: "Listen first", detail: "Talk to real customers before anyone opens a slide deck." },
    { step: "Find the tension", detail: "Every good campaign resolves one real, specific tension." },
    { step: "Make it unmissable", detail: "Craft matters. If it looks like an ad, it gets skipped like one." },
    { step: "Measure what matters", detail: "Pick one number up front and report it honestly, good or bad." }
  ],

  /* ------------------------------------------------------------------ */
  /*  EXPERIENCE  (most recent first)                                    */
  /* ------------------------------------------------------------------ */
  experience: [
    { role: "Senior Brand Marketer", company: "Fizzwell Kombucha", period: "2023 – now", detail: "Leads brand, packaging and integrated campaigns across Australia and NZ." },
    { role: "Marketing Manager", company: "Harbourline Credit Union", period: "2021 – 2023", detail: "Ran acquisition and a team of three across paid, email and content." },
    { role: "Social & Content Lead", company: "Small Giant Studio", period: "2019 – 2021", detail: "Agency side: social and launch work for arts, retail and events clients." },
    { role: "Marketing Coordinator", company: "Paper Lantern Theatre Co.", period: "2018 – 2019", detail: "Where it started: email, programs, and far too many opening nights." }
  ],

  education: [
    { title: "Bachelor of Commerce, Marketing", place: "University name", year: "2017" },
    { title: "Google Analytics 4 Certification", place: "Google", year: "2024" },
    { title: "Meta Certified Media Buying Professional", place: "Meta", year: "2023" },
    { title: "Inbound Marketing Certification", place: "HubSpot Academy", year: "2022" }
  ],

  /* ------------------------------------------------------------------ */
  /*  KIND WORDS  — replace with REAL quotes (ask a manager or client).  */
  /*  Don't publish the samples below.                                   */
  /* ------------------------------------------------------------------ */
  testimonials: [
    { quote: "Sophie is the rare marketer who can sit in a creative review and a finance meeting on the same day and win both rooms.", name: "Sample name", title: "Head of Marketing, Harbourline" },
    { quote: "She found the idea hiding in our customer research that three agencies had missed. Our sales team still quotes the campaign line.", name: "Sample name", title: "Founder, Fizzwell Kombucha" },
    { quote: "Calm under a launch deadline, allergic to vanity metrics, and genuinely fun to work with.", name: "Sample name", title: "Creative Director, Small Giant Studio" }
  ],

  /* ------------------------------------------------------------------ */
  /*  WILDCARDS — drawn at random when you land on a Wildcard space.     */
  /*  action (optional):                                                 */
  /*    { type: "move", steps: -2 }       move back/forward               */
  /*    { type: "goto", target: "game" }  game | pitch | about | launch   */
  /*    { type: "nextCase" }              jump to the next case study     */
  /*    { type: "roll" }                  roll again                      */
  /*    { type: "buzz", amount: 150 }     bonus points                    */
  /* ------------------------------------------------------------------ */
  wildcards: [
    { title: "Fun fact", text: "Sophie's camera roll is roughly 40% billboards, 60% dogs she's met." },
    { title: "Algorithm update", text: "The platform changed the rules overnight. Your reach drops.", action: { type: "move", steps: -2 }, button: "Move back 2 spaces" },
    { title: "Fun fact", text: "She wrote her first ad at nine: a hand-drawn flyer for a lemonade stand. It sold out by lunch." },
    { title: "Your post went viral", text: "A big account shared your work. Ride the wave.", action: { type: "goto", target: "game" }, button: "Advance to Ad Break" },
    { title: "Client loved the first draft", text: "No rounds of feedback. It happens about once a year.", action: { type: "roll" }, button: "Roll again" },
    { title: "Fun fact", text: "She can name the typeface on most cereal boxes. Nobody has ever asked her to." },
    { title: "Trending topic", text: "Everyone's talking about it. Jump to the next case study.", action: { type: "nextCase" }, button: "Go to the next case study" },
    { title: "Award shortlist", text: "Your campaign made the shortlist. Collect a bonus.", action: { type: "buzz", amount: 150 }, button: "Collect 150 Buzz" },
    { title: "Fun fact", text: "Her favourite marketing metric is the one nobody tracks: how many people told a friend." }
  ]
};
