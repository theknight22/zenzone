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

const packagesCatalog = [
  {
    name: '"Reset Sistem"',
    description: "Platiš 5, šesti termin je moj poklon tebi.",
    originalPrice: 0,
    price: 0,
    terms: "5+1 Gratis",
  },
  {
    name: '"Leđa bez tereta"',
    description: "Serija od 5 medicinskih masaža",
    originalPrice: 225,
    price: 200,
    terms: "5 termina",
  },
  {
    name: '"Godišnje održavanje"',
    description: "Paket od 10 termina po tvom izboru",
    originalPrice: 450,
    price: 380,
    terms: "10 termina",
  },
  {
    name: '"Duo Detoks"',
    description: "Set od 2 tretmana hidžame",
    originalPrice: 80,
    price: 70,
    terms: "2 tretmana",
  },
] as const;

export const seedServicesAndPackages = mutation({
  args: {},
  handler: async (ctx) => {
    const existingServices = await ctx.db.query("services").collect();
    const existingPackages = await ctx.db.query("packages").collect();

    const serviceNames = new Set<string>(
      servicesCatalog.map((service) => service.name)
    );
    const packageNames = new Set<string>(
      packagesCatalog.map((pkg) => pkg.name)
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

    for (const pkg of packagesCatalog) {
      const existing = existingPackages.find((entry) => entry.name === pkg.name);

      if (existing) {
        await ctx.db.patch(existing._id, {
          ...pkg,
          active: true,
        });
      } else {
        await ctx.db.insert("packages", {
          ...pkg,
          active: true,
        });
      }
    }

    for (const service of existingServices) {
      if (!serviceNames.has(service.name) && service.active) {
        await ctx.db.patch(service._id, { active: false });
      }
    }

    for (const pkg of existingPackages) {
      if (!packageNames.has(pkg.name) && pkg.active) {
        await ctx.db.patch(pkg._id, { active: false });
      }
    }

    return {
      services: servicesCatalog.length,
      packages: packagesCatalog.length,
    };
  },
});
