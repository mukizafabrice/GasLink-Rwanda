export const RWANDA_PROVINCES = [
  'Kigali City',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'Western Province',
] as const;

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  'Kigali City': ['Gasabo', 'Kicukiro', 'Nyarugenge'],
  'Southern Province': ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
  'Northern Province': ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
  'Eastern Province': ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
  'Western Province': ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'],
};

export const SECTORS_BY_DISTRICT: Record<string, string[]> = {
  Gasabo: ['Kimironko', 'Kacyiru', 'Remera', 'Gisozi'],
  Kicukiro: ['Gatenga', 'Kagarama', 'Niboye', 'Kanombe'],
  Nyarugenge: ['Nyamirambo', 'Muhima', 'Kigali', 'Rwezamenyo'],
  Huye: ['Ngoma', 'Tumba', 'Maraba', 'Mukura'],
  Muhanga: ['Nyamabuye', 'Shyogwe', 'Mushishiro'],
  Musanze: ['Muhoza', 'Cyuve', 'Kinigi'],
  Rubavu: ['Gisenyi', 'Nyamyumba', 'Kanama'],
  Rusizi: ['Kamembe', 'Muganza', 'Nzahaha'],
  Rwamagana: ['Karenge', 'Kigabiro', 'Mwulire'],
  Bugesera: ['Nyamata', 'Ntarama', 'Gashora'],
};
