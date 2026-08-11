export interface DrugInteraction {
  id: string;
  drug1: string; // generic identifier (lowercase)
  drug2: string; // generic identifier (lowercase)
  severity: 'critical' | 'high' | 'moderate';
  risk: string;
  mechanism: string;
  advice: string;
}

export interface DetectedInteraction {
  interaction: DrugInteraction;
  matchedDrug1: string; // original name from list 1
  matchedDrug2: string; // original name from list 2
}

// Brand name & common alias synonyms mapped to their core generic drug keys
export const DRUG_SYNONYMS: Record<string, string> = {
  // Aspirin
  'aspirin': 'aspirin',
  'acetylsalicylic acid': 'aspirin',
  'ecotrin': 'aspirin',
  'bayer': 'aspirin',
  'bufferin': 'aspirin',
  'disprin': 'aspirin',
  // Warfarin
  'warfarin': 'warfarin',
  'coumadin': 'warfarin',
  'jantoven': 'warfarin',
  'marevan': 'warfarin',
  // Ibuprofen
  'ibuprofen': 'ibuprofen',
  'advil': 'ibuprofen',
  'motrin': 'ibuprofen',
  'nurofen': 'ibuprofen',
  'brufen': 'ibuprofen',
  'ibu': 'ibuprofen',
  // Naproxen
  'naproxen': 'naproxen',
  'aleve': 'naproxen',
  'naprosyn': 'naproxen',
  'anaprox': 'naproxen',
  'flanax': 'naproxen',
  // Sildenafil
  'sildenafil': 'sildenafil',
  'viagra': 'sildenafil',
  'revatio': 'sildenafil',
  // Nitrates / Nitroglycerin
  'nitroglycerin': 'nitroglycerin',
  'nitronal': 'nitroglycerin',
  'nitrolingual': 'nitroglycerin',
  'nitrostat': 'nitroglycerin',
  'nitrogard': 'nitroglycerin',
  'nitrate': 'nitroglycerin',
  'nitrates': 'nitroglycerin',
  'isosorbide dinitrate': 'nitroglycerin',
  'isosorbide mononitrate': 'nitroglycerin',
  'imdur': 'nitroglycerin',
  'monoket': 'nitroglycerin',
  // Lisinopril
  'lisinopril': 'lisinopril',
  'prinivil': 'lisinopril',
  'zestril': 'lisinopril',
  // Spironolactone
  'spironolactone': 'spironolactone',
  'aldactone': 'spironolactone',
  'carospir': 'spironolactone',
  // Potassium
  'potassium': 'potassium',
  'potassium chloride': 'potassium',
  'k-tab': 'potassium',
  'klor-con': 'potassium',
  'k-dur': 'potassium',
  // Atorvastatin
  'atorvastatin': 'atorvastatin',
  'lipitor': 'atorvastatin',
  // Simvastatin
  'simvastatin': 'simvastatin',
  'zocor': 'simvastatin',
  // Amiodarone
  'amiodarone': 'amiodarone',
  'pacerone': 'amiodarone',
  'cordarone': 'amiodarone',
  // Clarithromycin
  'clarithromycin': 'clarithromycin',
  'biaxin': 'clarithromycin',
  // Erythromycin
  'erythromycin': 'erythromycin',
  'eryc': 'erythromycin',
  'ery-tab': 'erythromycin',
  'e-mycin': 'erythromycin',
  // Sertraline
  'sertraline': 'sertraline',
  'zoloft': 'sertraline',
  // Fluoxetine
  'fluoxetine': 'fluoxetine',
  'prozac': 'fluoxetine',
  'sarafem': 'fluoxetine',
  // Tramadol
  'tramadol': 'tramadol',
  'ultram': 'tramadol',
  'conzip': 'tramadol',
  // Ciprofloxacin
  'ciprofloxacin': 'ciprofloxacin',
  'cipro': 'ciprofloxacin',
  // Levofloxacin
  'levofloxacin': 'levofloxacin',
  'levaquin': 'levofloxacin',
  // Metronidazole
  'metronidazole': 'metronidazole',
  'flagyl': 'metronidazole',
  // Alcohol
  'alcohol': 'alcohol',
  'beer': 'alcohol',
  'wine': 'alcohol',
  'ethanol': 'alcohol',
  'liquor': 'alcohol',
  'whiskey': 'alcohol',
  'vodka': 'alcohol',
  // Amlodipine
  'amlodipine': 'amlodipine',
  'norvasc': 'amlodipine',
  'amlogard': 'amlodipine',
  // Digoxin
  'digoxin': 'digoxin',
  'lanoxin': 'digoxin',
  'digitek': 'digoxin',
  // Furosemide
  'furosemide': 'furosemide',
  'lasix': 'furosemide',
  // Hydrochlorothiazide
  'hydrochlorothiazide': 'hydrochlorothiazide',
  'hctz': 'hydrochlorothiazide',
  'microzide': 'hydrochlorothiazide',
  // Methotrexate
  'methotrexate': 'methotrexate',
  'trexall': 'methotrexate',
  'rheumatrex': 'methotrexate',
  'rasuvo': 'methotrexate',
  // Paracetamol
  'paracetamol': 'paracetamol',
  'acetaminophen': 'paracetamol',
  'tylenol': 'paracetamol',
  'panadol': 'paracetamol',
  'calpol': 'paracetamol',
  'feverall': 'paracetamol'
};

// Database of critical, high, and moderate drug-drug interactions
export const INTERACTION_DATABASE: DrugInteraction[] = [
  {
    id: 'int-1',
    drug1: 'aspirin',
    drug2: 'warfarin',
    severity: 'critical',
    risk: 'Severe internal bleeding risk',
    mechanism: 'Both medications decrease blood clotting (Aspirin is antiplatelet, Warfarin is anticoagulant). Combining them significantly amplifies bleeding risks, particularly gastrointestinal or cerebral hemorrhage.',
    advice: 'Avoid taking together unless explicitly prescribed and closely monitored by your cardiologist. Require frequent clotting profile (INR) testing.'
  },
  {
    id: 'int-2',
    drug1: 'aspirin',
    drug2: 'ibuprofen',
    severity: 'moderate',
    risk: 'Increased risk of stomach ulcers and reduced aspirin benefit',
    mechanism: 'Ibuprofen blocks the binding of low-dose aspirin to platelets, neutralizing its cardioprotective effect. Both also damage gastrointestinal lining, raising ulcer risks.',
    advice: 'If both are necessary, take ibuprofen at least 8 hours before or 30 minutes after taking immediate-release aspirin. Seek guidance on gastroprotective options like Proton Pump Inhibitors (PPIs).'
  },
  {
    id: 'int-3',
    drug1: 'aspirin',
    drug2: 'naproxen',
    severity: 'moderate',
    risk: 'Increased bleeding risk and decreased cardioprotective benefit',
    mechanism: 'Like Ibuprofen, Naproxen competes with Aspirin for platelet binding, rendering anti-platelet therapy less effective while escalating mucosal ulceration rates.',
    advice: 'Consult your doctor before combined use. Acetaminophen (Paracetamol) may be a safer pain relief alternative for those on daily low-dose aspirin.'
  },
  {
    id: 'int-4',
    drug1: 'warfarin',
    drug2: 'ibuprofen',
    severity: 'critical',
    risk: 'Extreme hazard of stomach and internal bleeding',
    mechanism: 'NSAIDs like Ibuprofen cause gastric mucosal injury and impair platelet aggregation, which directly compounds Warfarin\'s powerful systemic anticoagulation.',
    advice: 'Avoid NSAIDs entirely. Use Paracetamol (Acetaminophen) for mild pain relief, and verify with your primary care provider.'
  },
  {
    id: 'int-5',
    drug1: 'warfarin',
    drug2: 'naproxen',
    severity: 'critical',
    risk: 'Extreme hazard of gastrointestinal bleeding',
    mechanism: 'Naproxen disrupts mucosal integrity and platelet clotting. Co-administration with Warfarin can lead to severe, rapid internal bleeding.',
    advice: 'NSAIDs should not be co-administered with anticoagulants unless highly specialized clinical conditions demand it. Contact your cardiologist immediately.'
  },
  {
    id: 'int-6',
    drug1: 'sildenafil',
    drug2: 'nitroglycerin',
    severity: 'critical',
    risk: 'Life-threatening drop in blood pressure (Hypotension)',
    mechanism: 'Nitrates and PDE5 inhibitors (Sildenafil) both release nitric oxide, causing dramatic smooth muscle relaxation. Together, they trigger acute, dangerous circulatory collapse.',
    advice: 'Absolute contraindication. Never take Sildenafil if you use sublingual or oral nitroglycerin/nitrates for chest pain. Seek emergency services if co-ingested.'
  },
  {
    id: 'int-7',
    drug1: 'lisinopril',
    drug2: 'spironolactone',
    severity: 'high',
    risk: 'Hyperkalemia (dangerous potassium spikes)',
    mechanism: 'Lisinopril (ACE inhibitor) reduces aldosterone secretion, causing potassium retention. Spironolactone is a potassium-sparing diuretic. Combined, they create severe potassium build-ups.',
    advice: 'Monitor serum potassium and kidney function within 1-2 weeks of combined therapy. Avoid potassium supplements, potassium salt-substitutes, and high-potassium diets.'
  },
  {
    id: 'int-8',
    drug1: 'lisinopril',
    drug2: 'potassium',
    severity: 'high',
    risk: 'Severe Hyperkalemia risk',
    mechanism: 'ACE Inhibitors inhibit potassium excretion. Exogenous potassium supplements can rapidly cause cardiotoxic hyperkalemia, triggering lethal cardiac arrhythmias.',
    advice: 'Do not take potassium supplements alongside Lisinopril without explicit doctor instructions and regular blood tests.'
  },
  {
    id: 'int-9',
    drug1: 'atorvastatin',
    drug2: 'clarithromycin',
    severity: 'high',
    risk: 'Myopathy and Rhabdomyolysis (muscle tissue breakdown)',
    mechanism: 'Clarithromycin is a potent inhibitor of CYP3A4, the liver enzyme responsible for metabolizing Atorvastatin. This dramatically increases blood statin levels, damaging muscle skeletal tissue.',
    advice: 'Discuss pausing Atorvastatin temporarily during the course of the antibiotic, or swapping to a non-CYP3A4 statin (like Pravastatin) with your doctor.'
  },
  {
    id: 'int-10',
    drug1: 'simvastatin',
    drug2: 'clarithromycin',
    severity: 'critical',
    risk: 'Severe Rhabdomyolysis (muscle breakdown) & acute kidney injury',
    mechanism: 'Clarithromycin raises Simvastatin concentrations by up to 10-fold, heavily escalating statin toxicity, causing muscle fiber breakdown which clogs kidneys.',
    advice: 'Contraindicated. Pause Simvastatin treatment during the antibiotic course. Report any unexplained muscle pain, dark urine, or extreme fatigue immediately.'
  },
  {
    id: 'int-11',
    drug1: 'simvastatin',
    drug2: 'amiodarone',
    severity: 'high',
    risk: 'Increased risk of Statin-induced Myopathy',
    mechanism: 'Amiodarone inhibits CYP3A4 metabolism, increasing active Simvastatin blood levels and toxicity.',
    advice: 'Daily Simvastatin dose should never exceed 20mg if co-prescribed with Amiodarone.'
  },
  {
    id: 'int-12',
    drug1: 'sertraline',
    drug2: 'tramadol',
    severity: 'high',
    risk: 'Serotonin Syndrome (lethal neurotransmitter excess)',
    mechanism: 'Both Sertraline (SSRI) and Tramadol (weak opioid with serotonin reuptake inhibition) raise brain serotonin levels. Combining them triggers shivering, fever, rigidity, and mental confusion.',
    advice: 'Use extreme caution. Report symptoms like rapid heartbeat, sweating, tremors, muscle spasms, or agitation immediately. Consider alternative non-serotonergic analgesics.'
  },
  {
    id: 'int-13',
    drug1: 'fluoxetine',
    drug2: 'tramadol',
    severity: 'high',
    risk: 'Serotonin Syndrome and seizures',
    mechanism: 'Fluoxetine inhibits the metabolism of Tramadol while compounding serotonin reuptake inhibition. Increases risks of seizures and cardiovascular crises.',
    advice: 'Avoid combining. Discuss alternative therapies for neuropathic or skeletal pain management.'
  },
  {
    id: 'int-14',
    drug1: 'ciprofloxacin',
    drug2: 'potassium',
    severity: 'moderate',
    risk: 'Reduced antibiotic absorption and efficacy',
    mechanism: 'Multivalent cations (like Potassium, Calcium, Magnesium) bind or chelate with fluoroquinolones (Ciprofloxacin) in the stomach, rendering the antibiotic unabsorbable.',
    advice: 'Administer Ciprofloxacin at least 2 hours before or 6 hours after taking mineral supplements or antacids.'
  },
  {
    id: 'int-15',
    drug1: 'levofloxacin',
    drug2: 'potassium',
    severity: 'moderate',
    risk: 'Reduced Levofloxacin therapeutic levels',
    mechanism: 'Cations chelate the antibiotic in the GI tract, preventing therapeutic systemic absorption.',
    advice: 'Space antibiotic intake by 2 hours before or 4-6 hours after taking supplements, mineral formulations, or stomach antacids.'
  },
  {
    id: 'int-16',
    drug1: 'metronidazole',
    drug2: 'alcohol',
    severity: 'critical',
    risk: 'Severe Disulfiram-like toxic reaction',
    mechanism: 'Metronidazole inhibits aldehyde dehydrogenase. When alcohol is consumed, acetaldehyde toxic accumulations occur, triggering flushing, severe vomiting, chest pain, and rapid heartbeat.',
    advice: 'Absolutely avoid all alcohol (including mouthwashes or cough syrups containing alcohol) during Metronidazole therapy and for 72 hours after completion.'
  },
  {
    id: 'int-17',
    drug1: 'amlodipine',
    drug2: 'simvastatin',
    severity: 'moderate',
    risk: 'Mild-to-moderate Statin toxicity',
    mechanism: 'Amlodipine increases systemic exposure of Simvastatin, raising potential for skeletal muscle aches.',
    advice: 'Restrict daily Simvastatin dose to 20mg max when taken alongside Amlodipine.'
  },
  {
    id: 'int-18',
    drug1: 'digoxin',
    drug2: 'furosemide',
    severity: 'high',
    risk: 'Potassium depletion causing fatal Digoxin cardiac toxicity',
    mechanism: 'Furosemide (loop diuretic) causes loss of potassium (hypokalemia). Low potassium levels hyper-sensitize the cardiac muscle to Digoxin, triggering severe ventricular arrhythmias.',
    advice: 'Regularly monitor potassium, magnesium, and digoxin blood concentrations. Check for signs of toxicity like halo vision, nausea, or slow pulse. Take potassium supplements if prescribed.'
  },
  {
    id: 'int-19',
    drug1: 'digoxin',
    drug2: 'hydrochlorothiazide',
    severity: 'high',
    risk: 'Thiazide-induced hypokalemic Digoxin toxicity',
    mechanism: 'Hydrochlorothiazide depletes blood potassium, elevating the toxicity potential of Digoxin on the heart.',
    advice: 'Maintain a high-potassium diet or potassium replacement protocols as directed by your physician. Run frequent metabolic blood profiles.'
  },
  {
    id: 'int-20',
    drug1: 'methotrexate',
    drug2: 'ibuprofen',
    severity: 'critical',
    risk: 'Severe Bone Marrow Suppression and Kidney Failure',
    mechanism: 'Ibuprofen reduces renal blood flow and inhibits renal tubular secretion of Methotrexate, causing dangerous, toxic levels of Methotrexate in the blood.',
    advice: 'Avoid self-medicating with Ibuprofen or any NSAIDs if you are undergoing Methotrexate chemotherapy or autoimmune therapy. Use Paracetamol for pain relief instead.'
  }
];

/**
 * Normalizes a medical prescription drug name to help match it against standard generic keys.
 * Handles cleaning up trade extensions, tablet dosages, etc.
 */
export function normalizeDrugName(name: string): string {
  if (!name) return '';
  
  // Clean string and convert to lowercase
  let clean = name.toLowerCase().trim();

  // Strip common packaging, forms, dosages
  // e.g., "Amoxicillin 500mg tablet", "Zoloft 50mg" -> "Amoxicillin", "Zoloft"
  // Match patterns like "500mg", "10 ml", "50 mcg", "1.2g", etc., and anything after
  clean = clean.replace(/\s*\d+(\.\d+)?\s*(mg|mcg|g|ml|tab|tablet|capsule|cap|caps|tabs|ui|iu)\b.*/gi, '');
  
  // Clean up any other trailing numbers or brackets
  clean = clean.replace(/\s*\d+\s*(tablet|tablets|capsule|capsules|pill|pills|injection|puffs)\b.*/gi, '');
  clean = clean.replace(/[^a-zA-Z\s-]/g, '').trim();

  // Now, match the name against brand/generic synonyms to resolve to the core key
  // We do both exact matching and substring checking.
  // First, check exact matches
  if (DRUG_SYNONYMS[clean]) {
    return DRUG_SYNONYMS[clean];
  }

  // Second, check if any of our keys or synonyms is a substring of this drug name
  for (const [alias, genericKey] of Object.entries(DRUG_SYNONYMS)) {
    if (clean.includes(alias) || alias.includes(clean)) {
      return genericKey;
    }
  }

  return clean;
}

/**
 * Compares two lists of drug names (or a single list with itself) to detect known contraindications.
 * If list2 is provided, it compares list1 against list2 (e.g. prescribed drugs vs existing active drugs).
 * If list2 is not provided, it does a pairwise comparison of all items within list1 (e.g. drugs inside the same prescription).
 */
export function checkDrugInteractions(
  list1: { name: string }[],
  list2?: { name: string }[]
): DetectedInteraction[] {
  const detected: DetectedInteraction[] = [];
  const seenInteractions = new Set<string>(); // to prevent duplicates in output

  const normalizedList1 = list1.map(m => ({
    original: m.name,
    normalized: normalizeDrugName(m.name)
  })).filter(m => m.normalized !== '');

  if (list2) {
    // Compare list1 vs list2
    const normalizedList2 = list2.map(m => ({
      original: m.name,
      normalized: normalizeDrugName(m.name)
    })).filter(m => m.normalized !== '');

    for (const item1 of normalizedList1) {
      for (const item2 of normalizedList2) {
        const drugA = item1.normalized;
        const drugB = item2.normalized;

        if (drugA === drugB) continue; // Same drug, not an interaction

        const match = INTERACTION_DATABASE.find(
          inter =>
            (inter.drug1 === drugA && inter.drug2 === drugB) ||
            (inter.drug1 === drugB && inter.drug2 === drugA)
        );

        if (match) {
          const uniqueKey = [match.id, item1.original, item2.original].sort().join('|');
          if (!seenInteractions.has(uniqueKey)) {
            seenInteractions.add(uniqueKey);
            detected.push({
              interaction: match,
              matchedDrug1: item1.original,
              matchedDrug2: item2.original
            });
          }
        }
      }
    }
  } else {
    // Pairwise comparison within list1
    for (let i = 0; i < normalizedList1.length; i++) {
      for (let j = i + 1; j < normalizedList1.length; j++) {
        const item1 = normalizedList1[i];
        const item2 = normalizedList1[j];
        const drugA = item1.normalized;
        const drugB = item2.normalized;

        const match = INTERACTION_DATABASE.find(
          inter =>
            (inter.drug1 === drugA && inter.drug2 === drugB) ||
            (inter.drug1 === drugB && inter.drug2 === drugA)
        );

        if (match) {
          const uniqueKey = [match.id, item1.original, item2.original].sort().join('|');
          if (!seenInteractions.has(uniqueKey)) {
            seenInteractions.add(uniqueKey);
            detected.push({
              interaction: match,
              matchedDrug1: item1.original,
              matchedDrug2: item2.original
            });
          }
        }
      }
    }
  }

  return detected;
}
