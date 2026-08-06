// Server DB helper & mock persistence layer
import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve('src/server/database.json');

export const getDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [
        { id: 'usr_001', name: 'Sivan Ambi', email: 'sivan@stanford.edu', karma: 340, rating: 4.9 },
        { id: 'usr_002', name: 'Elena Rostova', email: 'elena@stanford.edu', karma: 510, rating: 4.95 }
      ],
      skills: [
        { id: 'sk_1', userId: 'usr_001', name: 'Python & Data Science', type: 'OFFERED', category: 'Programming' },
        { id: 'sk_2', userId: 'usr_001', name: 'Acoustic Guitar', type: 'DESIRED', category: 'Music' }
      ],
      swaps: [],
      reviews: []
    };
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
};

export const saveDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};
