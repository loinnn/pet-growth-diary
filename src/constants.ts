import { PetType, Task, Item } from './types';

export const PET_TEMPLATES: Record<PetType, { name: string; color: string; stages: string[] }> = {
  cat: { name: '小猫咪', color: '#FFB7B2', stages: ['🐱', '🐈', '🦁'] },
  dog: { name: '小狗狗', color: '#FFDAC1', stages: ['🐶', '🐕', '🐩'] },
  rabbit: { name: '小兔子', color: '#E2F0CB', stages: ['🐰', '🐇', '🦄'] },
  dragon: { name: '小火龙', color: '#B5EAD7', stages: ['🐲', '🐉', '🦖'] },
};

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: '阅读30分钟', description: '静下心来读一本好书', points: 50, icon: '📖', category: 'study' },
  { id: 't2', title: '整理玩具', description: '把玩好的玩具放回原位', points: 30, icon: '🧸', category: 'chore' },
  { id: 't3', title: '自己刷牙', description: '早晚都要认真刷牙哦', points: 20, icon: '🪥', category: 'habit' },
  { id: 't4', title: '帮妈妈扫地', description: '做一个勤劳的小帮手', points: 40, icon: '🧹', category: 'chore' },
  { id: 't5', title: '背诵一首古诗', description: '感受中华文化的魅力', points: 60, icon: '📜', category: 'study' },
  { id: 't6', title: '自己穿衣服', description: '我是独立的小宝贝', points: 20, icon: '👕', category: 'habit' },
  { id: 't7', title: '练习钢琴/乐器', description: '美妙的音乐从这里开始', points: 70, icon: '🎹', category: 'study' },
  { id: 't8', title: '吃完碗里的饭', description: '不浪费粮食是好习惯', points: 30, icon: '🍚', category: 'habit' },
  { id: 't9', title: '给花浇水', description: '照顾小植物慢慢长大', points: 25, icon: '💧', category: 'chore' },
  { id: 't10', title: '早睡早起', description: '晚上9点前上床睡觉', points: 50, icon: '🌙', category: 'habit' },
];

export const SHOP_ITEMS: Item[] = [
  { id: 'i1', name: '美味罐头', price: 20, type: 'food', image: '🥫', effect: { hunger: 30 } },
  { id: 'i2', name: '超级骨头', price: 15, type: 'food', image: '🦴', effect: { hunger: 20, happiness: 10 } },
  { id: 'i3', name: '酷酷墨镜', price: 100, type: 'accessory', image: '🕶️', effect: { happiness: 50 } },
  { id: 'i4', name: '小红帽', price: 150, type: 'clothes', image: '👒', effect: { happiness: 60 } },
  { id: 'i5', name: '蝴蝶结', price: 80, type: 'accessory', image: '🎀', effect: { happiness: 40 } },
  { id: 'i6', name: '魔法棒', price: 200, type: 'accessory', image: '🪄', effect: { happiness: 100 } },
  { id: 'i7', name: '甜甜圈', price: 25, type: 'food', image: '🍩', effect: { hunger: 15, happiness: 20 } },
  { id: 'i8', name: '新鲜牛奶', price: 10, type: 'food', image: '🥛', effect: { hunger: 10, happiness: 5 } },
  { id: 'i9', name: '皇冠', price: 500, type: 'accessory', image: '👑', effect: { happiness: 200 } },
  { id: 'i10', name: '披风', price: 300, type: 'clothes', image: '🧥', effect: { happiness: 120 } },
  { id: 'i11', name: '小气球', price: 50, type: 'accessory', image: '🎈', effect: { happiness: 30 } },
  { id: 'i12', name: '生日蛋糕', price: 100, type: 'food', image: '🎂', effect: { hunger: 50, happiness: 50 } },
];
