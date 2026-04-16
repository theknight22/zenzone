import { mutation } from "./_generated/server";

const servicesCatalog = [
  {
    name: "Medicinska terapija",
    duration: "45 min",
    description: "Fokus na bolne tačke i specifične tegobe.",
    price: 45,
    category: "masaze",
  },
  {
    name: "Antistress masaža",
    duration: "45 min",
    description: "Lagani pokreti, aromatična ulja i potpuno opuštanje.",
    price: 35,
    category: "masaze",
  },
  {
    name: "Deep Tissue / Sportska",
    duration: "60 min",
    description: "Snažan pritisak za dubinsku regeneraciju mišića.",
    price: 50,
    category: "masaze",
  },
  {
    name: '"Mirna glava"',
    duration: "25 min",
    description:
      "Relaksacija mišića lica, vlasišta i vrata (idealno za glavobolje).",
    price: 30,
    category: "parcijalni",
  },
  {
    name: '"Cloud Walk"',
    duration: "25 min",
    description: "Masaža stopala i listova za osjećaj lakoće.",
    price: 30,
    category: "parcijalni",
  },
  {
    name: '"Office Relief"',
    duration: "30 min",
    description: "Intenzivan fokus na lopatice, ramena i vrat.",
    price: 35,
    category: "parcijalni",
  },
  {
    name: "Standardna Hidžama",
    duration: "",
    description: "Tretman uz korištenje sterilnog seta.",
    price: 40,
    category: "hidzama",
  },
  {
    name: "Hidžama + Masaža leđa",
    duration: "20 min masaže + hidžama",
    description: "Kombinacija masaže leđa i hidžame.",
    price: 55,
    category: "hidzama",
  },
  {
    name: "Premium Detoks",
    duration: "30 min Full Body masaža + hidžama",
    description: "Full Body masaža uz hidžamu za dubinski reset tijela.",
    price: 70,
    category: "hidzama",
  },
] as const;

export const seedServices = mutation({
  args: {},
  handler: async (ctx) => {
    const existingServices = await ctx.db.query("services").collect();

    const serviceNames = new Set<string>(
      servicesCatalog.map((service) => service.name)
    );

    for (const service of servicesCatalog) {
      const existing = existingServices.find((entry) => entry.name === service.name);

      if (existing) {
        await ctx.db.patch(existing._id, {
          ...service,
          active: true,
        });
      } else {
        await ctx.db.insert("services", {
          ...service,
          active: true,
        });
      }
    }

    for (const service of existingServices) {
      if (!serviceNames.has(service.name) && service.active) {
        await ctx.db.patch(service._id, { active: false });
      }
    }

    return {
      services: servicesCatalog.length,
    };
  },
});
