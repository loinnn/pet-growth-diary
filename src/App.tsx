import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Utensils, ShoppingBag, BookOpen, Home, Shirt, CheckCircle2, Edit2 } from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'shop' | 'closet'>('home');
  const [isActionAnimating, setIsActionAnimating] = useState<{ eating: boolean; playing: boolean }>({
    eating: false,
    playing: false,
  });
  const [isNamingPet, setIsNamingPet] = useState<PetType | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempPetName, setTempPetName] = useState('');

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
    const item = SHOP_ITEMS.find(i => i.id === itemId);
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
    setIsActionAnimating(prev => ({ ...prev, playing: true }));
    setTimeout(() => setIsActionAnimating(prev => ({ ...prev, playing: false })), 2000);
    
    setPet({ 
      ...pet, 
      happiness: Math.min(100, pet.happiness + 20),
      exp: pet.exp + 15 
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
          <div className="grid grid-cols-2 gap-4 px-4">
            {(Object.keys(PET_TEMPLATES) as PetType[]).map(type => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNamingPet(type)}
                className="p-6 rounded-3xl bg-white shadow-lg border-4 border-transparent hover:border-blue-400 transition-all flex flex-col items-center"
              >
                <span className="text-6xl mb-2">{PET_TEMPLATES[type].stages[0]}</span>
                <span className="font-bold text-gray-700">{PET_TEMPLATES[type].name}</span>
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
                className="bg-pink-400 text-white p-4 rounded-full shadow-lg hover:bg-pink-500 transition-colors"
              >
                <Heart className="w-8 h-8" />
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

      {/* Naming Modal */}
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

  const renderTasks = () => (
    <div className="space-y-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 px-4">今日任务</h2>
      <div className="space-y-3 px-4">
        {INITIAL_TASKS.map(task => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between border-2 border-transparent hover:border-green-200 transition-all"
          >
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{task.icon}</span>
              <div>
                <h3 className="font-bold text-gray-800">{task.title}</h3>
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

  const renderShop = () => (
    <div className="space-y-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 px-4">宠物商店</h2>
      <div className="grid grid-cols-2 gap-4 px-4 pb-20">
        {SHOP_ITEMS.map(item => (
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
            const item = SHOP_ITEMS.find(i => i.id === itemId);
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
