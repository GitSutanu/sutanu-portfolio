// `mock` drives the abstract browser preview (no invented screenshots).
// `span` = grid columns out of 6 on desktop.
const TRAVEL_ROLE = "UI/UX implementation and front-end development";
const TRAVEL_TECH = ["HTML", "CSS", "JavaScript", "jQuery"];
const TRAVEL_DESC = "Live travel booking website for flights, hotels, cruises and car rentals. I built the front-end UI: search sections, booking layouts, navigation and forms.";

export const projectGroups = [
  {
    title: "Travel booking websites",
    note: "Built at Webvio Technology. The underlying platform stack is separate from my front-end work.",
    items: [
      { name: "CompareTicketNow", url: "https://compareticketnow.com/", category: "Travel booking", role: TRAVEL_ROLE, tech: TRAVEL_TECH, platform: "Angular", description: TRAVEL_DESC, span: 3, mock: { variant: "search", a: "#F5B800", b: "#0F5C5C" } },
      { name: "FareFinder24", url: "https://farefinder24.com/", category: "Travel booking", role: TRAVEL_ROLE, tech: TRAVEL_TECH, platform: "Angular", description: TRAVEL_DESC, span: 3, mock: { variant: "search", a: "#0F5C5C", b: "#F5B800" } },
      { name: "SkyFareAgency", url: "https://skyfareagency.com/", category: "Travel booking", role: TRAVEL_ROLE, tech: TRAVEL_TECH, platform: "Angular", description: TRAVEL_DESC, span: 2, mock: { variant: "search", a: "#C8472B", b: "#13161B" } },
      { name: "FlightHelpBuddy", url: "https://flighthelpbuddy.com/", category: "Travel booking", role: TRAVEL_ROLE, tech: TRAVEL_TECH, platform: "Angular", description: TRAVEL_DESC, span: 2, mock: { variant: "search", a: "#13161B", b: "#F5B800" } },
      { name: "TravelFareCompare", url: "https://travelfarecompare.us/", category: "Travel booking", role: TRAVEL_ROLE, tech: TRAVEL_TECH, platform: "PHP", description: TRAVEL_DESC, span: 2, mock: { variant: "search", a: "#5E6670", b: "#0F5C5C" } },
    ],
  },
  {
    title: "Other projects",
    note: "SaaS, eCommerce, corporate, education and personal demo builds.",
    items: [
      { name: "Syncinns", url: "https://syncinns.com/", category: "B2B hospitality and travel distribution SaaS", role: "Front-end development", tech: ["HTML", "CSS", "JavaScript", "Bootstrap"], description: "Front-end for a B2B platform for hotels, reservation agencies and travel companies.", span: 3, mock: { variant: "dashboard", a: "#0F5C5C", b: "#F5B800" } },
      { name: "Pro Coffee Gear", url: "https://procoffeegear.com/", category: "Commercial espresso equipment store", role: "Front-end HTML/CSS and UI customization", tech: ["Shopify", "HTML", "CSS", "JavaScript"], description: "Front-end HTML/CSS and UI customization for a live Shopify store with bundles and filtering.", span: 3, mock: { variant: "store", a: "#7A4B2A", b: "#F5B800" } },
      { name: "Global Micro Tech", url: "https://globalmicrotech.com.au/", category: "IT services website", role: "Front-end customization", tech: ["Shopify", "HTML", "CSS", "JavaScript"], description: "Front-end customization of a live IT services website with service modules and testimonials.", span: 2, mock: { variant: "corporate", a: "#13161B", b: "#0F5C5C" } },
      { name: "Art School Multimedia Training", url: "https://khusirdinga.com/", category: "Education website", role: "Front-end development", tech: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap"], description: "Responsive website with course listings, admission form, gallery and contact form integration.", span: 2, mock: { variant: "course", a: "#C8472B", b: "#F5B800" } },
      { name: "Observability Monitoring SaaS", url: "https://earnest-cupcake-26f7e1.netlify.app/", category: "SaaS landing page", role: "Complete front-end", tech: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap"], description: "Complete front-end of a responsive SaaS landing page with comparison table, FAQ and dashboard UI.", span: 2, mock: { variant: "dashboard", a: "#5E6670", b: "#F5B800" } },
      { name: "Shoe E-commerce Demo", url: "https://shoemonster.netlify.app/", category: "eCommerce demo", role: "Figma design and front-end development", tech: ["Figma", "HTML", "CSS", "JavaScript", "Bootstrap"], description: "Figma-designed demo with product listing, filtering and cart, using local JSON data.", span: 3, mock: { variant: "store", a: "#0F5C5C", b: "#EDEEEA" } },
      { name: "BUNCRUST Food Delivery Demo", url: "https://buncrust.netlify.app/", category: "Restaurant and food delivery demo", role: "Figma design and React.js front-end", tech: ["Figma", "React.js", "HTML", "CSS", "Bootstrap", "Context API"], description: "React.js food delivery demo with menu, offers and reviews; Context API for state.", span: 3, mock: { variant: "menu", a: "#C8472B", b: "#F5B800" } },
    ],
  },
];
