import { House, LibraryItem } from './types';

export const INITIAL_HOUSES: House[] = [
  { 
    id: '12', 
    name: 'Legacy + Longevity', 
    description: 'Succession, heritage, and the long-term horizon.', 
    mantra: 'Endure forever.',
    intention: 'To ensure the long-term survival and succession of the family legacy.',
    status: 'clear',
    label: '12',
    order: 0 
  },
  { 
    id: '1', 
    name: 'Identity + Family Business', 
    description: 'Naming, identity, and the core of the family business.', 
    mantra: 'Know yourself.',
    intention: 'To establish the core identity and governance of the family business.',
    status: 'clear',
    label: '01',
    order: 1 
  },
  { 
    id: '2', 
    name: 'Assets + Economy', 
    description: 'Wealth, assets, and economic strategy.', 
    mantra: 'Preserve the value.',
    intention: 'To manage wealth, protect assets, and optimize the family economy.',
    status: 'active',
    label: '02',
    order: 2 
  },
  { 
    id: '3', 
    name: 'Telecom, Tech + Energy', 
    description: 'Information systems, digital assets, and physical energy.', 
    mantra: 'Connect and power.',
    intention: 'To secure telecommunications, leverage technology, and manage energy resources.',
    status: 'clear',
    label: '03',
    order: 3 
  },
  { 
    id: '4', 
    name: 'Home + Health', 
    description: 'The physical residence and the biological wellbeing.', 
    mantra: 'Nurture the temple.',
    intention: 'To create a resilient home environment and prioritize family health.',
    status: 'attention',
    label: '04',
    order: 4 
  },
  { 
    id: '5', 
    name: 'Work and Play Project Management', 
    description: 'Venture building and recreational optimization.', 
    mantra: 'Build and enjoy.',
    intention: 'To apply rigorous project management to both professional ventures and personal play.',
    status: 'clear',
    label: '05',
    order: 5 
  },
  { 
    id: '6', 
    name: 'Systems Operations', 
    description: 'The machinery of the castle. Logistics and governance.', 
    mantra: 'Order in all directions.',
    intention: 'To maintain efficient operational systems and governance workflows.',
    status: 'clear',
    label: '06',
    order: 6 
  },
  { 
    id: '7', 
    name: 'Contracts and Accounting', 
    description: 'Obligations, agreements, and financial ledgering.', 
    mantra: 'Balance the books.',
    intention: 'To manage legal obligations and maintain precise financial accounting.',
    status: 'active',
    label: '07',
    order: 7 
  },
  { 
    id: '8', 
    name: 'Insurance and Exit', 
    description: 'Risk mitigation and contingency planning.', 
    mantra: 'Plan the finish.',
    intention: 'To ensure coverage against risk and prepare exit strategies for all ventures.',
    status: 'critical',
    label: '08',
    order: 8 
  },
  { 
    id: '9', 
    name: 'Travel and Therapy', 
    description: 'Mental health, mobility, and the dynamics of trust.', 
    mantra: 'Move with grace.',
    intention: 'To cultivate trust, manage global mobility, and prioritize psychological wellbeing.',
    status: 'clear',
    label: '09',
    order: 9 
  },
  { 
    id: '10', 
    name: 'Story Standards', 
    description: 'Values, reputation, and the narrative of the family.', 
    mantra: 'Write the legend.',
    intention: 'To define family standards and control the narrative of our work.',
    status: 'clear',
    label: '10',
    order: 10 
  },
  { 
    id: '11', 
    name: 'Community Network', 
    description: 'Affiliates, partners, and the surrounding village.', 
    mantra: 'Expand the circle.',
    intention: 'To build and nurture a vital network of collaborators and community ties.',
    status: 'clear',
    label: '11',
    order: 11 
  },
];

export const INITIAL_LIBRARY_ITEMS: LibraryItem[] = [
  { id: 'family-constitution', houseId: '1', title: 'Family Constitution Template', type: 'declaration', description: 'Define the core values and rules of the family business.', status: 'approved' },
  { id: 'asset-map', houseId: '2', title: 'Asset Map Generator', type: 'checklist', description: 'Visualize and inventory all economic assets.', status: 'approved' },
  { id: 'tech-stack', houseId: '3', title: 'Digital Fortress Audit', type: 'checklist', description: 'Review security and efficiency of telecom and tech systems.', status: 'approved' },
  { id: 'health-ledger', houseId: '4', title: 'Health Records Ledger', type: 'checklist', description: 'Centralize family medical history and home care specs.', status: 'approved' },
  { id: 'project-playbook', houseId: '5', title: 'Venture & Play Playbook', type: 'playbook', description: 'SOPs for launching new projects or planning expeditions.', status: 'approved' },
  { id: 'ops-manual', houseId: '6', title: 'Castle Ops Manual', type: 'sop', description: 'The master guide to castle governance and mechanics.', status: 'approved' },
  { id: 'ledger-sync', houseId: '7', title: 'Accounts Reconciliation Flow', type: 'checklist', description: 'Standard process for closing the books.', status: 'approved' },
];
