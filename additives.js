/**
 * Comprehensive Food Additives Knowledge Base
 * Scientifically defensible entries: Presence, Function, Potential Concern, Allergen, Biological Evidence / Context
 */

export const ADDITIVES_DATABASE = [
  // --- PRESERVATIVES & E-NUMBERS ---
  {
    id: 'e211',
    eNumber: 'E211',
    name: 'Sodium Benzoate',
    aliases: ['sodium benzoate', 'benzoate of soda', 'e211'],
    category: 'Preservative',
    function: 'Inhibits growth of mold, yeast, and bacteria in acidic foods and beverages.',
    potentialConcern: 'Can form trace benzene (a known carcinogen) when combined with Vitamin C (Ascorbic Acid) in acidic soft drinks under heat and light exposure.',
    evidenceContext: 'FDA and EFSA consider it safe within established ADI (0-5 mg/kg body weight). Amount and combination with ascorbic acid matter.',
    riskLevel: 'moderate', // safe, moderate, flag
    dietaryFlags: []
  },
  {
    id: 'e250',
    eNumber: 'E250',
    name: 'Sodium Nitrite',
    aliases: ['sodium nitrite', 'e250', 'nitrite'],
    category: 'Preservative & Color Fixative',
    function: 'Prevents growth of Clostridium botulinum bacteria and maintains pinkish color in cured meats.',
    potentialConcern: 'Under high heat cooking (e.g. frying bacon), nitrites react with amino acids to form nitrosamines, which are classified as probable carcinogens.',
    evidenceContext: 'W.H.O. recommends limiting processed meat consumption. Vitamin C is often added by manufacturers to inhibit nitrosamine formation.',
    riskLevel: 'flag',
    dietaryFlags: []
  },
  {
    id: 'e320',
    eNumber: 'E320',
    name: 'Butylated Hydroxyanisole (BHA)',
    aliases: ['bha', 'butylated hydroxyanisole', 'e320'],
    category: 'Synthetic Antioxidant / Preservative',
    function: 'Prevents oxidative rancidity in fats, oils, and fat-containing foods like snack chips.',
    potentialConcern: 'Classified by California Prop 65 as a chemical known to cause cancer based on animal studies at high doses.',
    evidenceContext: 'EFSA re-evaluated BHA and lowered the Acceptable Daily Intake. Used in low concentrations in packaged dry foods.',
    riskLevel: 'flag',
    dietaryFlags: []
  },
  {
    id: 'e321',
    eNumber: 'E321',
    name: 'Butylated Hydroxytoluene (BHT)',
    aliases: ['bht', 'butylated hydroxytoluene', 'e321'],
    category: 'Synthetic Antioxidant / Preservative',
    function: 'Retains freshness and prevents fats/oils from turning rancid.',
    potentialConcern: 'Endocrine disruption concerns at high concentrations in rodent models; potential liver and kidney stress at super-dietary doses.',
    evidenceContext: 'Generally Recognized As Safe (GRAS) by FDA at <0.02% of fat content.',
    riskLevel: 'moderate',
    dietaryFlags: []
  },
  {
    id: 'e202',
    eNumber: 'E202',
    name: 'Potassium Sorbate',
    aliases: ['potassium sorbate', 'e202', 'sorbic acid potassium salt'],
    category: 'Preservative',
    function: 'Inhibits molds and yeasts in cheeses, wine, yogurt, and dried fruit.',
    potentialConcern: 'Rare hypersensitivity or mild contact skin reactions in sensitive individuals.',
    evidenceContext: 'Breakdowns into water and CO2 in the human body like natural fatty acids. Extensively tested and safe for general population.',
    riskLevel: 'safe',
    dietaryFlags: []
  },
  {
    id: 'e220',
    eNumber: 'E220',
    name: 'Sulfur Dioxide / Sulfites',
    aliases: ['sulfur dioxide', 'e220', 'sodium metabisulfite', 'e223', 'sulfites', 'sulphites'],
    category: 'Preservative & Antioxidant',
    function: 'Prevents browning in dried fruits, wines, and processed potatoes.',
    potentialConcern: 'Triggers severe asthma attacks and allergic respiratory reactions in sulfite-sensitive asthmatics.',
    evidenceContext: 'Must be explicitly labeled when concentration exceeds 10 ppm due to allergen sensitivity risks.',
    riskLevel: 'flag',
    dietaryFlags: ['allergen_sulfites']
  },

  // --- ARTIFICIAL COLORS & DYES ---
  {
    id: 'e102',
    eNumber: 'E102',
    name: 'Tartrazine (Yellow 5)',
    aliases: ['tartrazine', 'fd&c yellow no. 5', 'yellow 5', 'e102', 'yellow no. 5'],
    category: 'Artificial Azo Dye',
    function: 'Provides bright yellow/lemon color to candy, beverages, and cereals.',
    potentialConcern: 'Linked to hyperactivity in children in the UK Southampton study. Requires warning label in the European Union.',
    evidenceContext: 'FDA approves Yellow 5 but requires declaration on ingredient label for individuals with tartrazine allergy.',
    riskLevel: 'flag',
    dietaryFlags: ['kids_caution']
  },
  {
    id: 'e129',
    eNumber: 'E129',
    name: 'Allura Red AC (Red 40)',
    aliases: ['allura red', 'fd&c red no. 40', 'red 40', 'e129', 'red no. 40'],
    category: 'Artificial Azo Dye',
    function: 'Imparts intense red coloration to beverages, snacks, and condiments.',
    potentialConcern: 'Associated with behavioral changes/hyperactivity in sensitive children; potential intolerance in asthma/hives sufferers.',
    evidenceContext: 'Widely used in US foods. EFSA set ADI at 7 mg/kg body weight.',
    riskLevel: 'flag',
    dietaryFlags: ['kids_caution']
  },
  {
    id: 'e133',
    eNumber: 'E133',
    name: 'Brilliant Blue FCF (Blue 1)',
    aliases: ['brilliant blue', 'fd&c blue no. 1', 'blue 1', 'e133', 'blue no. 1'],
    category: 'Artificial Dye',
    function: 'Imparts bright blue color to confectionery, frostings, and sports drinks.',
    potentialConcern: 'Small amounts absorbed through intestinal tract; rare allergic sensitivity reported.',
    evidenceContext: 'EFSA and FDA consider it safe at authorized dietary levels.',
    riskLevel: 'moderate',
    dietaryFlags: ['kids_caution']
  },
  {
    id: 'e150d',
    eNumber: 'E150d',
    name: 'Ammonia Caramel (Caramel IV)',
    aliases: ['caramel color', 'caramel IV', 'e150d', 'ammonia caramel', 'class IV caramel'],
    category: 'Food Colorant',
    function: 'Provides deep dark brown color to colas, soy sauce, and dark baked goods.',
    potentialConcern: 'Contains 4-MEI (4-methylimidazole), a byproduct formed during manufacturing that showed carcinogenic potential at high doses in rodent studies.',
    evidenceContext: 'California requires Prop 65 warning if 4-MEI exposure exceeds 29 mcg/day. Many soda manufacturers have reduced 4-MEI levels.',
    riskLevel: 'moderate',
    dietaryFlags: []
  },

  // --- SWEETENERS & SUGAR ALCOHOLS ---
  {
    id: 'maltodextrin',
    eNumber: null,
    name: 'Maltodextrin',
    aliases: ['maltodextrin', 'malto-dextrin'],
    category: 'Carbohydrate Additive / Bulking Agent',
    function: 'Used as a thickener, filler, carrier for flavors, and texture stabilizer.',
    potentialConcern: 'Extremely high Glycemic Index (GI: 85-105), higher than table sugar (GI: 65). Can cause rapid blood glucose and insulin spikes.',
    evidenceContext: 'Not toxic or dangerous in small amounts, but crucial for individuals monitoring diabetes, ketogenic diets, or rapid carb intake.',
    riskLevel: 'moderate',
    dietaryFlags: ['keto_incompatible', 'diabetic_caution']
  },
  {
    id: 'hfcs',
    eNumber: null,
    name: 'High Fructose Corn Syrup (HFCS)',
    aliases: ['high fructose corn syrup', 'hfcs', 'hfcs-55', 'hfcs-42', 'glucose-fructose syrup', 'isoglucose'],
    category: 'Caloric Sweetener',
    function: 'Provides intense liquid sweetness, moisture retention, and golden browning in processed foods.',
    potentialConcern: 'Fructose is metabolized almost exclusively in the liver. High consumption is strongly linked to non-alcoholic fatty liver disease, insulin resistance, and visceral obesity.',
    evidenceContext: 'Calorically equivalent to sucrose (table sugar), but often overconsumed due to low cost and ubiquity in ultra-processed foods.',
    riskLevel: 'flag',
    dietaryFlags: ['low_sugar_violation']
  },
  {
    id: 'e951',
    eNumber: 'E951',
    name: 'Aspartame',
    aliases: ['aspartame', 'e951', 'nutrasweet', 'equal'],
    category: 'Artificial Intense Sweetener',
    function: 'Provides ~200x sweetness of sugar with near-zero calories in diet sodas and sugar-free products.',
    potentialConcern: 'Breaks down into phenylalanine, aspartic acid, and methanol. Classified by IARC as "possibly carcinogenic to humans" (Group 2B).',
    evidenceContext: 'JECFA reconfirmed the safe Acceptable Daily Intake at 40 mg/kg body weight (equivalent to ~9-14 cans of diet soda daily for an adult). Dangerous for individuals with Phenylketonuria (PKU).',
    riskLevel: 'moderate',
    dietaryFlags: ['pku_warning']
  },
  {
    id: 'e955',
    eNumber: 'E955',
    name: 'Sucralose',
    aliases: ['sucralose', 'e955', 'splenda'],
    category: 'Artificial Sweetener',
    function: 'Provides ~600x sweetness of sugar without caloric contribution.',
    potentialConcern: 'Emerging research suggests high long-term consumption may alter gut microbiome composition and decrease insulin sensitivity in some individuals.',
    evidenceContext: 'Does not spike immediate blood sugar. Heat stable up to moderate temperatures.',
    riskLevel: 'moderate',
    dietaryFlags: []
  },
  {
    id: 'e965',
    eNumber: 'E965',
    name: 'Maltitol',
    aliases: ['maltitol', 'maltitol syrup', 'e965'],
    category: 'Sugar Alcohol (Polyol)',
    function: 'Provides sugar-like bulk and sweetness (90% as sweet) with fewer calories.',
    potentialConcern: 'Has a moderate Glycemic Index (GI: 35-52) and incomplete absorption in the small intestine can cause osmotic diarrhea, bloating, and gas if overconsumed (>20g).',
    evidenceContext: 'Commonly used in "Sugar-Free" candies. Still impacts blood glucose more than erythritol or stevia.',
    riskLevel: 'moderate',
    dietaryFlags: ['digestive_distress_risk']
  },

  // --- EMULSIFIERS, THICKENERS & TEXTURIZERS ---
  {
    id: 'e466',
    eNumber: 'E466',
    name: 'Carboxymethyl Cellulose (CMC)',
    aliases: ['carboxymethyl cellulose', 'cmc', 'cellulose gum', 'e466'],
    category: 'Emulsifier & Thickener',
    function: 'Stabilizes emulsions, prevents ice crystal growth in ice cream, and increases viscosity.',
    potentialConcern: 'Animal studies suggest synthetic emulsifiers like CMC and Polysorbate 80 can alter intestinal mucosa thickness and promote low-grade gut inflammation.',
    evidenceContext: 'Approved food additive. Clinical trials in humans are ongoing to establish long-term microbiome impact.',
    riskLevel: 'moderate',
    dietaryFlags: []
  },
  {
    id: 'e407',
    eNumber: 'E407',
    name: 'Carrageenan',
    aliases: ['carrageenan', 'e407', 'irish moss extract'],
    category: 'Gelling Agent & Thickener',
    function: 'Extracted from red seaweed; prevents fat separation in plant milks, creamers, and deli meats.',
    potentialConcern: 'Degraded carrageenan (poligeenan) is a known gastrointestinal inflammatory agent. Undegraded food-grade carrageenan may cause stomach discomfort in sensitive individuals.',
    evidenceContext: 'FDA permits food-grade carrageenan. Organic standard regulations vary across countries.',
    riskLevel: 'moderate',
    dietaryFlags: []
  },
  {
    id: 'e450',
    eNumber: 'E450',
    name: 'Sodium Acid Pyrophosphate / Diphosphates',
    aliases: ['sodium acid pyrophosphate', 'diphosphates', 'e450', 'disodium pyrophosphate', 'tetrasodium pyrophosphate'],
    category: 'Leavening Agent & Emulsifier',
    function: 'Acts as a slow-acting baking acid in cakes/pancakes and retains moisture in processed meats.',
    potentialConcern: 'High intake of inorganic food-additive phosphates (unlike bound organic organic phosphates) rapidly raises serum phosphate levels, which is linked to arterial calcification and bone density degradation.',
    evidenceContext: 'EFSA established a combined group ADI for phosphates (40 mg/kg body weight per day expressed as phosphorus).',
    riskLevel: 'moderate',
    dietaryFlags: []
  },
  {
    id: 'e621',
    eNumber: 'E621',
    name: 'Monosodium Glutamate (MSG)',
    aliases: ['monosodium glutamate', 'msg', 'e621', 'glutamate'],
    category: 'Flavor Enhancer',
    function: 'Triggers umami (savory) taste receptors in processed savory snacks, soups, and seasonings.',
    potentialConcern: 'A small subgroup of individuals report mild transient symptoms (headache, flushing, tightness) when consuming large doses without food.',
    evidenceContext: 'Extensive double-blind scientific studies have debunked generalized "Chinese Restaurant Syndrome." Glutamate is naturally present in tomatoes and aged cheese.',
    riskLevel: 'safe',
    dietaryFlags: ['msg_sensitive']
  },

  // --- FATS & SEED OILS ---
  {
    id: 'hydrogenated_oil',
    eNumber: null,
    name: 'Partially Hydrogenated Oil (Trans Fat Source)',
    aliases: ['partially hydrogenated soybean oil', 'partially hydrogenated cottonseed oil', 'partially hydrogenated palm oil', 'partially hydrogenated vegetable oil'],
    category: 'Industrial Trans Fat',
    function: 'Increases shelf stability and converts liquid vegetable oils into solid fats for crispy textures.',
    potentialConcern: 'Contains artificial trans fatty acids which significantly raise LDL ("bad") cholesterol while lowering HDL ("good") cholesterol. Strongly causal for coronary heart disease.',
    evidenceContext: 'Banned or severely restricted by FDA (no longer GRAS) and WHO. Any remaining presence is a major red flag.',
    riskLevel: 'flag',
    dietaryFlags: ['trans_fat_danger', 'heart_health_hazard']
  },
  {
    id: 'palm_oil',
    eNumber: null,
    name: 'Palm Oil / Palm Kernel Oil',
    aliases: ['palm oil', 'palm kernel oil', 'fractionated palm oil', 'palmitic acid'],
    category: 'Saturated Plant Fat',
    function: 'Provides solid fat structure at room temperature, smooth mouthfeel, and high heat stability.',
    potentialConcern: 'High in saturated palmitic acid (44%), which can elevate LDL cholesterol if consumed in excess. Environmental deforestation impact.',
    evidenceContext: 'Nutritionally better than trans fats, but saturated fat content requires moderation for cardiovascular risk factors.',
    riskLevel: 'moderate',
    dietaryFlags: ['high_sat_fat']
  }
];

/**
 * Quick E-Number Lookup Helper
 */
export function lookupAdditive(term) {
  if (!term) return null;
  const cleanTerm = term.toLowerCase().trim();
  
  return ADDITIVES_DATABASE.find(item => {
    if (item.eNumber && item.eNumber.toLowerCase() === cleanTerm) return true;
    if (item.name.toLowerCase() === cleanTerm) return true;
    return item.aliases.some(alias => cleanTerm.includes(alias.toLowerCase()) || alias.toLowerCase().includes(cleanTerm));
  }) || null;
}
