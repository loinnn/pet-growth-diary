import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Utensils, ShoppingBag, BookOpen, Home, Shirt, CheckCircle2, Edit2, RefreshCcw, X, Plus, Trash2, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Pet, Task, Item, PetType } from './types';
import { INITIAL_TASKS, SHOP_ITEMS, PET_TEMPLATES } from './constants';
import { PetAvatar } from './components/PetAvatar';

export default function App() {
  // --- State ---
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('pet_points');
    return saved ? parseInt(saved) : 0;
  });
  
  const [pet, setPet] = useState<Pet | null>(() => {
    const saved = localStorage.getItem('pet_data');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [inventory, setInventory] = useState<string[]>(() => {
    const saved = localStorage.getItem('pet_inventory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pet_tasks');
    const today = new Date().toLocaleDateString();
    const lastReset = localStorage.getItem('pet_last_reset');
    
    if (lastReset !== today) {
      return [];
    }
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pet_all_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [shopItems, setShopItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('pet_shop_items');
    return saved ? JSON.parse(saved) : SHOP_ITEMS;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'shop' | 'closet'>('home');
  const [isActionAnimating, setIsActionAnimating] = useState<{ eating: boolean; playing: boolean }>({
    eating: false,
    playing: false,
  });
  const [isNamingPet, setIsNamingPet] = useState<PetType | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [isManagingTasks, setIsManagingTasks] = useState(false);
  const [isManagingShop, setIsManagingShop] = useState(false);
  const [tempPetName, setTempPetName] = useState('');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    points: 5,
    category: 'life',
    icon: '📝'
  });
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: '',
    price: 50,
    type: 'food',
    image: '🎁',
    effect: { hunger: 0, happiness: 0 }
  });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('pet_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('pet_data', JSON.stringify(pet));
  }, [pet]);

  useEffect(() => {
    localStorage.setItem('pet_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('pet_tasks', JSON.stringify(completedTaskIds));
    localStorage.setItem('pet_last_reset', new Date().toLocaleDateString());
  }, [completedTaskIds]);

  useEffect(() => {
    localStorage.setItem('pet_all_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pet_shop_items', JSON.stringify(shopItems));
  }, [shopItems]);

  const resetGame = () => {
    localStorage.clear();
    setPet(null);
    setPoints(0);
    setInventory([]);
    setCompletedTaskIds([]);
    setTasks(INITIAL_TASKS);
    setShopItems(SHOP_ITEMS);
    setIsResetConfirming(false);
    setActiveTab('home');
  };

  const addTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: 'custom-' + Date.now(),
      title: newTask.title,
      description: newTask.description || '',
      points: newTask.points || 5,
      category: newTask.category as any || 'life',
      icon: newTask.icon || '📝'
    };
    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', description: '', points: 5, category: 'life', icon: '📝' });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addShopItem = () => {
    if (!newItem.name) return;
    const item: Item = {
      id: 'custom-item-' + Date.now(),
      name: newItem.name,
      price: newItem.price || 50,
      type: newItem.type as any || 'food',
      image: newItem.image || '🎁',
      effect: newItem.effect || { hunger: 0, happiness: 0 }
    };
    setShopItems(prev => [...prev, item]);
    setNewItem({ name: '', price: 50, type: 'food', image: '🎁', effect: { hunger: 0, happiness: 0 } });
  };

  const deleteShopItem = (id: string) => {
    setShopItems(prev => prev.filter(i => i.id !== id));
  };

  // --- Actions ---
  const adoptPet = (type: PetType, name: string) => {
    const newPet: Pet = {
      id: Date.now().toString(),
      name: name || PET_TEMPLATES[type].name,
      type,
      level: 1,
      exp: 0,
      hunger: 50,
      happiness: 50,
      lastFed: Date.now(),
      lastPlayed: Date.now(),
      outfit: [],
      isAdopted: true,
    };
    
    setPet(newPet);
    setIsNamingPet(null);
    setTempPetName('');
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const renamePet = () => {
    if (!pet || !tempPetName.trim()) return;
    setPet({ ...pet, name: tempPetName });
    setIsEditingName(false);
    setTempPetName('');
  };

  const completeTask = (task: Task) => {
    if (completedTaskIds.includes(task.id)) return;
    
    setPoints(prev => prev + task.points);
    setCompletedTaskIds(prev => [...prev, task.id]);
    
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#FFD700', '#FFA500'],
    });
  };

  const buyItem = (item: Item) => {
    if (points >= item.price) {
      setPoints(prev => prev - item.price);
      setInventory(prev => [...prev, item.id]);
    } else {
      alert('积分不够哦，快去完成任务吧！');
    }
  };

  const useItem = (itemId: string) => {
    if (!pet) return;
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.type === 'food') {
      setIsActionAnimating(prev => ({ ...prev, eating: true }));
      setTimeout(() => setIsActionAnimating(prev => ({ ...prev, eating: false })), 2000);
      
      const newHunger = Math.min(100, pet.hunger + (item.effect?.hunger || 0));
      const newHappiness = Math.min(100, pet.happiness + (item.effect?.happiness || 0));
      
      const index = inventory.indexOf(itemId);
      const newInv = [...inventory];
      if (index > -1) newInv.splice(index, 1);

      setPet({ ...pet, hunger: newHunger, happiness: newHappiness, exp: pet.exp + 10 });
      setInventory(newInv);
    } else {
      const isEquipped = pet.outfit.includes(itemId);
      const newOutfit = isEquipped 
        ? pet.outfit.filter(id => id !== itemId)
        : [...pet.outfit, itemId];
      
      setPet({ ...pet, outfit: newOutfit });
    }
  };

  const playWithPet = () => {
    if (!pet) return;
    if (points < 5) {
      alert('积分不够陪它玩哦，快去完成任务吧！');
      return;
    }
    
    setPoints(prev => prev - 5);
    setIsActionAnimating(prev => ({ ...prev, playing: true }));
    setTimeout(() => setIsActionAnimating(prev => ({ ...prev, playing: false })), 2000);
    
    setPet({ 
      ...pet, 
      happiness: Math.min(100, pet.happiness + 20),
      exp: pet.exp + 5 
    });
  };

  // Level up logic
  useEffect(() => {
    if (pet && pet.exp >= pet.level * 100) {
      setPet({ ...pet, level: pet.level + 1, exp: 0 });
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.3 },
      });
    }
  }, [pet?.exp]);

  // --- Render Helpers ---
  const renderHome = () => (
    <div className="flex flex-col items-center justify-center space-y-8 py-10">
      {!pet ? (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">领养你的第一个伙伴吧</h2>
          <div className="grid grid-cols-2 gap-6 px-4">
            {(Object.keys(PET_TEMPLATES) as PetType[]).map(type => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNamingPet(type)}
                className="relative p-8 rounded-[40px] bg-white shadow-xl border-4 border-transparent hover:border-blue-400 transition-all flex flex-col items-center overflow-hidden group"
              >
                {/* Background Decoration */}
                <div 
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"
                  style={{ backgroundColor: PET_TEMPLATES[type].color }}
                />
                
                {/* Character Preview */}
                <div className="relative mb-4">
                  {/* Ears Preview */}
                  <div className="absolute -top-3 inset-x-0 flex justify-between px-1">
                    {type === 'rabbit' ? (
                      <>
                        <div className="w-4 h-10 bg-white rounded-full rotate-[-10deg] border-2 border-pink-100" />
                        <div className="w-4 h-10 bg-white rounded-full rotate-[10deg] border-2 border-pink-100" />
                      </>
                    ) : type === 'cat' ? (
                      <>
                        <div className="w-6 h-6 bg-pink-100 rounded-tr-2xl rotate-[-15deg]" />
                        <div className="w-6 h-6 bg-pink-100 rounded-tl-2xl rotate-[15deg]" />
                      </>
                    ) : type === 'dog' ? (
                      <>
                        <div className="w-6 h-10 bg-orange-100 rounded-b-full rotate-[-10deg]" />
                        <div className="w-6 h-10 bg-orange-100 rounded-b-full rotate-[10deg]" />
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 bg-green-100 rounded-full rotate-[-15deg]" />
                        <div className="w-6 h-6 bg-green-100 rounded-full rotate-[15deg]" />
                      </>
                    )}
                  </div>
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-6xl shadow-inner relative z-10"
                    style={{ backgroundColor: PET_TEMPLATES[type].color + '33' }}
                  >
                    {PET_TEMPLATES[type].stages[0]}
                    {/* Tiny Blush in Preview */}
                    <div className="absolute inset-x-0 bottom-6 flex justify-between px-4 opacity-40">
                      <div className="w-3 h-1.5 bg-pink-300 rounded-full blur-[1px]" />
                      <div className="w-3 h-1.5 bg-pink-300 rounded-full blur-[1px]" />
                    </div>
                  </div>
                </div>
                
                <span className="font-black text-gray-700 text-lg">{PET_TEMPLATES[type].name}</span>
                <div className="mt-2 px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  点击领养
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="w-full max-w-md bg-white/50 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-gray-800">{pet.name}</h3>
                <button 
                  onClick={() => {
                    setTempPetName(pet.name);
                    setIsEditingName(true);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsResetConfirming(true)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                  title="重置游戏"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">Lv.{pet.level}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Utensils className="w-5 h-5 text-orange-400" />
                <span className="text-[10px] font-bold text-orange-400">饱食度</span>
                <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pet.hunger}%` }}
                    className="h-full bg-orange-400"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-[10px] font-bold text-red-400">心情值</span>
                <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pet.happiness}%` }}
                    className="h-full bg-red-400"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(pet.exp / (pet.level * 100)) * 100}%` }}
                  className="h-full bg-yellow-400"
                />
              </div>
              <span className="text-xs font-bold text-gray-500">经验值</span>
            </div>
          </div>

          <PetAvatar 
            type={pet.type} 
            level={pet.level} 
            hunger={pet.hunger}
            happiness={pet.happiness}
            isEating={isActionAnimating.eating}
            isPlaying={isActionAnimating.playing}
            outfit={pet.outfit}
          />

          <div className="flex space-x-8">
            <div className="flex flex-col items-center space-y-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={playWithPet}
                className="bg-pink-400 text-white p-4 rounded-full shadow-lg hover:bg-pink-500 transition-colors relative"
              >
                <Heart className="w-8 h-8" />
                <div className="absolute -top-2 -right-2 bg-white text-pink-500 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-sm border border-pink-100">
                  -5
                </div>
              </motion.button>
              <span className="text-xs font-bold text-pink-500">陪它玩</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab('shop')}
                className="bg-orange-400 text-white p-4 rounded-full shadow-lg hover:bg-orange-500 transition-colors"
              >
                <Utensils className="w-8 h-8" />
              </motion.button>
              <span className="text-xs font-bold text-orange-500">去喂食</span>
            </div>
          </div>
        </>
      )}

    </div>
  );

  const renderTasks = () => {
    const categories = [
      { id: 'life', name: '生活类', icon: '🏠' },
      { id: 'habit', name: '习惯类', icon: '✨' },
      { id: 'learning', name: '学习 & 专注力类', icon: '📚' },
      { id: 'emotion', name: '礼貌与情绪类', icon: '🌈' },
    ];

    return (
      <div className="space-y-8 py-6 px-4 pb-24">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">今日任务</h2>
          <button 
            onClick={() => setIsManagingTasks(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>管理任务</span>
          </button>
        </div>
        {categories.map(cat => {
          const catTasks = tasks.filter(t => t.category === cat.id);
          if (catTasks.length === 0) return null;
          return (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                <span className="text-xl">{cat.icon}</span>
                <h3 className="text-lg font-bold text-gray-700">{cat.name}</h3>
              </div>
              <div className="space-y-3">
                {catTasks.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between border-2 border-transparent hover:border-green-200 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">{task.icon}</span>
                      <div>
                        <h4 className="font-bold text-gray-800">{task.title}</h4>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => completeTask(task)}
                      disabled={completedTaskIds.includes(task.id)}
                      className={`px-4 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center space-x-1 ${
                        completedTaskIds.includes(task.id)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {completedTaskIds.includes(task.id) ? (
                        <span>已完成</span>
                      ) : (
                        <>
                          <span>+{task.points}</span>
                          <Star className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderShop = () => (
    <div className="space-y-4 py-6 px-4 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">宠物商店</h2>
        <button 
          onClick={() => setIsManagingShop(true)}
          className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>管理商店</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {shopItems.map(item => (
          <motion.div
            key={item.id}
            className="bg-white p-4 rounded-3xl shadow-md flex flex-col items-center space-y-2 border-2 border-orange-50"
          >
            <span className="text-5xl">{item.image}</span>
            <h3 className="font-bold text-gray-800">{item.name}</h3>
            <button
              onClick={() => buyItem(item)}
              className="w-full bg-orange-100 text-orange-600 py-2 rounded-xl font-bold flex items-center justify-center space-x-1 hover:bg-orange-200 transition-colors"
            >
              <span>{item.price}</span>
              <Star className="w-4 h-4 fill-orange-600" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCloset = () => (
    <div className="space-y-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 px-4">我的衣橱</h2>
      {inventory.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Shirt className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>衣橱空空的，快去商店逛逛吧</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 px-4">
          {Array.from(new Set(inventory)).map((itemId: string) => {
            const item = shopItems.find(i => i.id === itemId);
            if (!item) return null;
            const count = inventory.filter(id => id === itemId).length;
            const isEquipped = pet?.outfit.includes(itemId);

            return (
              <motion.div
                key={itemId}
                whileTap={{ scale: 0.95 }}
                onClick={() => useItem(itemId)}
                className={`relative bg-white p-4 rounded-2xl shadow-sm border-2 transition-all cursor-pointer ${
                  isEquipped ? 'border-blue-400 bg-blue-50' : 'border-transparent'
                }`}
              >
                <span className="text-4xl block text-center">{item.image}</span>
                <p className="text-xs text-center mt-2 font-bold text-gray-600">{item.name}</p>
                {item.type === 'food' && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    x{count}
                  </span>
                )}
                {isEquipped && (
                  <CheckCircle2 className="absolute -top-2 -right-2 w-5 h-5 text-blue-500 bg-white rounded-full" />
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCF0] font-sans text-gray-900 selection:bg-blue-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-black tracking-tight text-gray-800 flex items-center space-x-2">
          <span className="bg-blue-500 text-white p-1 rounded-lg">🐾</span>
          <span>萌宠成长记</span>
        </h1>
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full font-bold flex items-center space-x-2 shadow-sm">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            <span>{points}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 max-w-lg mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && renderHome()}
            {activeTab === 'tasks' && renderTasks()}
            {activeTab === 'shop' && renderShop()}
            {activeTab === 'closet' && renderCloset()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl px-2 py-2 flex justify-around items-center z-50">
        <NavButton 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
          icon={<Home />} 
          label="家" 
        />
        <NavButton 
          active={activeTab === 'tasks'} 
          onClick={() => setActiveTab('tasks')} 
          icon={<BookOpen />} 
          label="任务" 
        />
        <NavButton 
          active={activeTab === 'shop'} 
          onClick={() => setActiveTab('shop')} 
          icon={<ShoppingBag />} 
          label="商店" 
        />
        <NavButton 
          active={activeTab === 'closet'} 
          onClick={() => setActiveTab('closet')} 
          icon={<Shirt />} 
          label="衣橱" 
        />
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {isManagingShop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-800">管理商店物品</h3>
                <button onClick={() => setIsManagingShop(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Add New Item Form */}
              <div className="bg-orange-50 p-4 rounded-2xl mb-6 space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="物品名称"
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                    className="flex-1 bg-white border-none rounded-xl px-4 py-2 text-sm outline-none"
                  />
                  <input
                    type="text"
                    placeholder="图标"
                    value={newItem.image}
                    onChange={e => setNewItem({...newItem, image: e.target.value})}
                    className="w-12 bg-white border-none rounded-xl px-2 py-2 text-center text-lg outline-none"
                  />
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 flex items-center bg-white rounded-xl px-3 py-2 space-x-1">
                    <span className="text-xs text-gray-400">价格:</span>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={e => setNewItem({...newItem, price: parseInt(e.target.value) || 0})}
                      className="w-full bg-transparent border-none text-sm font-bold outline-none"
                    />
                  </div>
                  <select
                    value={newItem.type}
                    onChange={e => setNewItem({...newItem, type: e.target.value as any})}
                    className="flex-1 bg-white border-none rounded-xl px-4 py-2 text-sm outline-none"
                  >
                    <option value="food">食物</option>
                    <option value="clothes">衣服</option>
                    <option value="accessory">饰品</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 flex items-center bg-white rounded-xl px-3 py-2 space-x-1">
                    <span className="text-[10px] text-gray-400">饱食度+:</span>
                    <input
                      type="number"
                      value={newItem.effect?.hunger}
                      onChange={e => setNewItem({...newItem, effect: { ...newItem.effect!, hunger: parseInt(e.target.value) || 0 }})}
                      className="w-full bg-transparent border-none text-sm font-bold outline-none"
                    />
                  </div>
                  <div className="flex-1 flex items-center bg-white rounded-xl px-3 py-2 space-x-1">
                    <span className="text-[10px] text-gray-400">心情+:</span>
                    <input
                      type="number"
                      value={newItem.effect?.happiness}
                      onChange={e => setNewItem({...newItem, effect: { ...newItem.effect!, happiness: parseInt(e.target.value) || 0 }})}
                      className="w-full bg-transparent border-none text-sm font-bold outline-none"
                    />
                  </div>
                  <button
                    onClick={addShopItem}
                    disabled={!newItem.name}
                    className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 disabled:opacity-50 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>添加</span>
                  </button>
                </div>
              </div>

              {/* Existing Items List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {shopItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <div className="text-sm font-bold text-gray-700">{item.name}</div>
                        <div className="text-[10px] text-gray-400">{item.price} 积分 | {item.type === 'food' ? '食物' : '装扮'}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteShopItem(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isManagingTasks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-800">管理任务列表</h3>
                <button onClick={() => setIsManagingTasks(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Add New Task Form */}
              <div className="bg-blue-50 p-4 rounded-2xl mb-6 space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="任务名称 (如: 练习钢琴)"
                    value={newTask.title}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    className="flex-1 bg-white border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="图标"
                    value={newTask.icon}
                    onChange={e => setNewTask({...newTask, icon: e.target.value})}
                    className="w-12 bg-white border-none rounded-xl px-2 py-2 text-center text-lg outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="任务描述 (可选)"
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm outline-none"
                />
                <div className="flex space-x-2">
                  <select
                    value={newTask.category}
                    onChange={e => setNewTask({...newTask, category: e.target.value as any})}
                    className="flex-1 bg-white border-none rounded-xl px-4 py-2 text-sm outline-none"
                  >
                    <option value="life">生活类</option>
                    <option value="habit">习惯类</option>
                    <option value="learning">学习类</option>
                    <option value="emotion">情绪类</option>
                  </select>
                  <div className="flex items-center bg-white rounded-xl px-3 py-2 space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <input
                      type="number"
                      value={newTask.points}
                      onChange={e => setNewTask({...newTask, points: parseInt(e.target.value) || 0})}
                      className="w-8 bg-transparent border-none text-sm font-bold outline-none text-center"
                    />
                  </div>
                  <button
                    onClick={addTask}
                    disabled={!newTask.title}
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>添加</span>
                  </button>
                </div>
              </div>

              {/* Existing Tasks List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{task.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-gray-700">{task.title}</div>
                        <div className="text-[10px] text-gray-400">{task.description}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isResetConfirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCcw className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">重置游戏？</h3>
              <p className="text-gray-500 mb-8">这会删除当前的宠物、积分和所有物品，无法恢复哦！</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsResetConfirming(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={resetGame}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                >
                  确定重置
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isNamingPet || isEditingName) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl text-center"
            >
              {isNamingPet && <span className="text-7xl mb-4 block">{PET_TEMPLATES[isNamingPet].stages[0]}</span>}
              <h3 className="text-2xl font-black text-gray-800 mb-2">
                {isEditingName ? '修改宠物名字' : '给它起个名字吧'}
              </h3>
              <p className="text-gray-500 mb-6">一个好听的名字是友谊的开始</p>
              <input
                type="text"
                value={tempPetName}
                onChange={(e) => setTempPetName(e.target.value)}
                placeholder="输入宠物名字..."
                className="w-full bg-gray-100 border-2 border-transparent focus:border-blue-400 focus:bg-white outline-none rounded-2xl px-6 py-4 text-lg font-bold text-center transition-all mb-6"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsNamingPet(null);
                    setIsEditingName(false);
                    setTempPetName('');
                  }}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => isEditingName ? renamePet() : adoptPet(isNamingPet!, tempPetName)}
                  disabled={!tempPetName.trim()}
                  className="flex-1 bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  {isEditingName ? '保存修改' : '确定领养'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactElement; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300 ${
        active ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {React.cloneElement(icon, { className: 'w-6 h-6' } as React.HTMLAttributes<HTMLElement>)}
      <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{label}</span>
    </button>
  );
}
