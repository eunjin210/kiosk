export type MenuOption = {
  temperature?: Array<'HOT' | 'COLD'>;
  size?: Array<'S' | 'L'>;
};

export type MenuItem = {
  id: number;
  category: string;
  name: string;
  price: string;
  img: string;
  option?: MenuOption;
};

export type MenuCategoryType =
  | 'ALL'
  | 'COFFEE'
  | 'TEA'
  | 'BEVERAGE'
  | 'DESSERT';
