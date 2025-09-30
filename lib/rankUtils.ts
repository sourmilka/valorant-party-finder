// Helper function to map rank names to image files
export const getRankImage = (rank: string): string => {
  // Convert rank string to the format used in image files
  const rankMap: { [key: string]: string } = {
    'Iron 1': 'Iron_1_Rank.png',
    'Iron 2': 'Iron_2_Rank.png',
    'Iron 3': 'Iron_3_Rank.png',
    'Bronze 1': 'Bronze_1_Rank.png',
    'Bronze 2': 'Bronze_2_Rank.png',
    'Bronze 3': 'Bronze_3_Rank.png',
    'Silver 1': 'Silver_1_Rank.png',
    'Silver 2': 'Silver_2_Rank.png',
    'Silver 3': 'Silver_3_Rank.png',
    'Gold 1': 'Gold_1_Rank.png',
    'Gold 2': 'Gold_2_Rank.png',
    'Gold 3': 'Gold_3_Rank.png',
    'Platinum 1': 'Platinum_1_Rank.png',
    'Platinum 2': 'Platinum_2_Rank.png',
    'Platinum 3': 'Platinum_3_Rank.png',
    'Diamond 1': 'Diamond_1_Rank.png',
    'Diamond 2': 'Diamond_2_Rank.png',
    'Diamond 3': 'Diamond_3_Rank.png',
    'Ascendant 1': 'Ascendant_1_Rank.png',
    'Ascendant 2': 'Ascendant_2_Rank.png',
    'Ascendant 3': 'Ascendant_3_Rank.png',
    'Immortal 1': 'Immortal_1_Rank.png',
    'Immortal 2': 'Immortal_2_Rank.png',
    'Immortal 3': 'Immortal_3_Rank.png',
    'Radiant': 'Radiant_Rank.png',
  };

  return `/ranks/${rankMap[rank] || 'Iron_1_Rank.png'}`;
};

// Rank tiers for organization
export const rankTiers = {
  'Iron': ['Iron 1', 'Iron 2', 'Iron 3'],
  'Bronze': ['Bronze 1', 'Bronze 2', 'Bronze 3'],
  'Silver': ['Silver 1', 'Silver 2', 'Silver 3'],
  'Gold': ['Gold 1', 'Gold 2', 'Gold 3'],
  'Platinum': ['Platinum 1', 'Platinum 2', 'Platinum 3'],
  'Diamond': ['Diamond 1', 'Diamond 2', 'Diamond 3'],
  'Ascendant': ['Ascendant 1', 'Ascendant 2', 'Ascendant 3'],
  'Immortal': ['Immortal 1', 'Immortal 2', 'Immortal 3'],
  'Radiant': ['Radiant']
};

export const allRanks = Object.values(rankTiers).flat();
