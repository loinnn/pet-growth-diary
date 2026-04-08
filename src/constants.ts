import { PetType, Task, Item } from './types';

export const PET_TEMPLATES: Record<PetType, { name: string; color: string; stages: string[] }> = {
  cat: { name: '奶糖猫', color: '#FFB7B2', stages: ['😺', '🐈', '🦁'] },
  dog: { name: '芝士犬', color: '#FFDAC1', stages: ['🐶', '🐕', '🐩'] },
  rabbit: { name: '草莓兔', color: '#FF9AA2', stages: ['🐰', '🐇', '🦄'] },
  dragon: { name: '薄荷龙', color: '#B5EAD7', stages: ['🐲', '🐉', '🦖'] },
};

export const INITIAL_TASKS: Task[] = [
  // 一、生活类
  { id: 'l1', title: '按时起床', description: '按时起床，不赖床', points: 5, icon: '⏰', category: 'life' },
  { id: 'l2', title: '自己穿衣穿鞋', description: '自己穿衣服、穿袜子、穿鞋', points: 5, icon: '👟', category: 'life' },
  { id: 'l3', title: '自己刷牙', description: '自己刷牙（早晚各一次）', points: 5, icon: '🪥', category: 'life' },
  { id: 'l4', title: '自己洗脸', description: '自己洗脸、擦香香', points: 5, icon: '🧼', category: 'life' },
  { id: 'l5', title: '主动上厕所', description: '主动上厕所，不憋尿', points: 5, icon: '🚽', category: 'life' },
  { id: 'l6', title: '整理睡具', description: '自己整理睡衣 / 小被子', points: 5, icon: '🛌', category: 'life' },
  { id: 'l7', title: '按时上床', description: '按时上床，不拖延', points: 5, icon: '🌙', category: 'life' },
  { id: 'l8', title: '安静入睡', description: '安静入睡，不吵闹', points: 5, icon: '💤', category: 'life' },

  // 二、习惯类
  { id: 'h1', title: '按时吃饭', description: '按时坐好吃饭，不拖拉', points: 5, icon: '🍽️', category: 'habit' },
  { id: 'h2', title: '自己吃饭', description: '自己用勺子 / 筷子吃饭，不喂饭', points: 5, icon: '🥄', category: 'habit' },
  { id: 'h3', title: '不挑食', description: '不挑食，不边玩边吃', points: 5, icon: '🥗', category: 'habit' },
  { id: 'h4', title: '吃饭不撒饭', description: '吃饭不撒太多饭菜', points: 5, icon: '🍚', category: 'habit' },
  { id: 'h5', title: '饭后送碗', description: '吃完自己把碗送到厨房', points: 5, icon: '🥣', category: 'habit' },
  { id: 'h6', title: '饭前洗手', description: '饭前洗手、饭后擦嘴', points: 5, icon: '🧼', category: 'habit' },
  { id: 'h7', title: '玩具归位', description: '玩具玩完自己收拾归位', points: 5, icon: '🧸', category: 'habit' },
  { id: 'h8', title: '书放回书架', description: '看完书把书放回书架', points: 5, icon: '📚', category: 'habit' },
  { id: 'h9', title: '挂好衣服', description: '自己脱外套、挂好衣服', points: 5, icon: '🧥', category: 'habit' },
  { id: 'h10', title: '不乱扔垃圾', description: '不乱扔垃圾，知道丢垃圾桶', points: 5, icon: '🗑️', category: 'habit' },
  { id: 'h11', title: '整理小口袋', description: '自己整理小书包 / 小口袋', points: 5, icon: '🎒', category: 'habit' },
  { id: 'h12', title: '换鞋', description: '外出回家主动换鞋', points: 5, icon: '👞', category: 'habit' },

  // 三、学习 & 专注力类
  { id: 's1', title: '安静看书', description: '安静看书 10 分钟', points: 5, icon: '📖', category: 'learning' },
  { id: 's2', title: '完成手工', description: '完成简单小手工 / 涂色', points: 5, icon: '🎨', category: 'learning' },
  { id: 's3', title: '认识字数', description: '认识 1～3 个汉字 / 数字', points: 5, icon: '🔢', category: 'learning' },
  { id: 's4', title: '练习舞蹈', description: '跟着音乐练习舞蹈动作', points: 5, icon: '💃', category: 'learning' },

  // 四、礼貌与情绪类
  { id: 'e1', title: '说对不起', description: '犯错愿意说 “对不起”', points: 5, icon: '🙏', category: 'emotion' },
  { id: 'e2', title: '不哭闹', description: '不哭闹、不乱发脾气', points: 5, icon: '😊', category: 'emotion' },
  { id: 'e3', title: '少看电视', description: '不一直看手机 / 电视', points: 5, icon: '📺', category: 'emotion' },
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
