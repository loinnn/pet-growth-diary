import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';
import { PetType, Item } from '../types';
import { PET_TEMPLATES } from '../constants';

interface PetAvatarProps {
  type: PetType;
  level: number;
  hunger: number;
  happiness: number;
  isEating?: boolean;
  isPlaying?: boolean;
  outfit: string[];
  allShopItems?: Item[];
}

export const PetAvatar: React.FC<PetAvatarProps> = ({ 
  type, 
  level, 
  hunger, 
  happiness, 
  isEating, 
  isPlaying, 
  outfit,
  allShopItems = []
}) => {
  const template = PET_TEMPLATES[type];
  
  // Evolution Stage
  let stageIndex = 0;
  if (level >= 8) stageIndex = 2;
  else if (level >= 4) stageIndex = 1;
  
  const currentIcon = template.stages[stageIndex];
  
  // Emotion logic
  const isSad = hunger < 30 || happiness < 30;
  const isHappy = happiness > 70;

  // Proportions - compact and cute
  const characterScale = 1.0 + (level * 0.02);
  const headSize = 140 + (level * 2);
  const bodySize = 100 + (level * 3);

  return (
    <div className="relative flex flex-col items-center justify-center w-72 h-[380px]">
      {/* Food Particles Animation */}
      <AnimatePresence>
        {isEating && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: "50%", 
                  y: "40%" 
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: `${40 + Math.random() * 20}%`,
                  y: `${30 + Math.random() * 20}%`,
                  rotate: Math.random() * 360
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  delay: i * 0.1,
                  ease: "easeOut" 
                }}
                className="absolute text-xl"
              >
                {['✨', '🍪', '🍰', '🧁'][i % 4]}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -40 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-[35%] left-1/2 -translate-x-1/2 text-pink-500 font-black text-xl italic"
            >
              NOM NOM!
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Background Glow - Very soft */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-0 rounded-full blur-[60px]"
        style={{ backgroundColor: template.color }}
      />

      {/* Thought Bubble - Minimalist */}
      <AnimatePresence>
        {(isSad || isHappy || hunger < 40) && !isEating && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-md border border-white/50 flex items-center">
              <span className="text-lg">
                {hunger < 40 ? '🍕' : happiness === 100 ? '🌟' : isSad ? '😢' : '❤️'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Character Container */}
      <motion.div
        animate={
          isEating 
            ? { y: [0, -8, 0], scale: [1, 1.02, 1] } 
            : isPlaying 
            ? { y: [0, -50, 0], rotate: [0, -3, 3, 0] }
            : { y: [0, -5, 0] }
        }
        transition={{ 
          duration: isEating ? 0.3 : isPlaying ? 0.5 : 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10 flex flex-col items-center"
        style={{ transform: `scale(${characterScale})` }}
      >
        {/* Head - The Animal itself */}
        <div 
          className="relative rounded-full shadow-xl z-20 flex items-center justify-center border-[6px] border-white/40" 
          style={{ 
            width: `${headSize}px`, 
            height: `${headSize}px`, 
            background: `radial-gradient(circle at 30% 30%, ${template.color}, ${template.color}dd)`,
            boxShadow: `0 20px 40px -10px ${template.color}66, inset 0 -10px 20px rgba(0,0,0,0.1)`
          }}
        >
          {/* Ears - Dynamic based on type */}
          <div className="absolute -top-6 inset-x-0 flex justify-between px-2 z-0">
            {type === 'rabbit' ? (
              <>
                <div className="w-10 h-24 bg-white rounded-full rotate-[-10deg] border-4 border-pink-200" />
                <div className="w-10 h-24 bg-white rounded-full rotate-[10deg] border-4 border-pink-200" />
              </>
            ) : type === 'cat' ? (
              <>
                <div className="w-12 h-12 bg-pink-200 rounded-tr-[40px] rotate-[-15deg] border-2 border-white/20" />
                <div className="w-12 h-12 bg-pink-200 rounded-tl-[40px] rotate-[15deg] border-2 border-white/20" />
              </>
            ) : type === 'dog' ? (
              <>
                <div className="w-14 h-20 bg-orange-200 rounded-b-full rotate-[-10deg] border-2 border-white/20" />
                <div className="w-14 h-20 bg-orange-200 rounded-b-full rotate-[10deg] border-2 border-white/20" />
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-green-200 rounded-full rotate-[-15deg] border-2 border-white/20" />
                <div className="w-12 h-12 bg-green-200 rounded-full rotate-[15deg] border-2 border-white/20" />
              </>
            )}
          </div>

          {/* Animal Icon - Large and centered */}
          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-90 select-none filter drop-shadow-lg z-10">
            {currentIcon}
          </div>

          {/* Simple Face Overlay - To make it more expressive */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            {/* Eyes - Large and expressive */}
            <div className="flex space-x-14 mb-2 mt-8">
              {[0, 1].map((i) => (
                <div key={i} className="relative">
                  {isHappy ? (
                    <div className="text-4xl font-black text-black/50">^</div>
                  ) : isSad ? (
                    <div className="text-4xl font-black text-black/50">U</div>
                  ) : (
                    <motion.div 
                      animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                      transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.92, 0.94, 1] }}
                      className="w-5 h-5 bg-black/40 rounded-full flex items-start justify-center pt-1"
                    >
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full ml-1" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            {/* Blush */}
            <AnimatePresence>
              {(isHappy || !isSad) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="absolute flex justify-between w-36 px-2 mt-4"
                >
                  <div className="w-8 h-4 bg-pink-400 rounded-full blur-[3px]" />
                  <div className="w-8 h-4 bg-pink-400 rounded-full blur-[3px]" />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Nose & Mouth */}
            <div className="flex flex-col items-center -mt-1">
              <div className="w-3 h-2 bg-pink-600/40 rounded-full mb-0.5" />
              <motion.div 
                animate={isEating ? { scaleY: [1, 1.5, 1], scaleX: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="flex -space-x-0.5"
              >
                <div className="w-3 h-3 border-b-2 border-l-2 border-black/20 rounded-bl-full rotate-[-45deg]" />
                <div className="w-3 h-3 border-b-2 border-r-2 border-black/20 rounded-br-full rotate-[45deg]" />
              </motion.div>
            </div>

            {/* Glasses moved here to be relative to the face */}
            {outfit.includes('i3') && (
              <div className="absolute top-11 left-1/2 -translate-x-1/2 text-7xl z-30 filter drop-shadow-md">🕶️</div>
            )}
          </div>
          {/* Outfit: Hats */}
          {outfit.includes('i4') && <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-8xl z-30 drop-shadow-lg">👒</div>}
          {outfit.includes('i9') && <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-8xl z-30 drop-shadow-lg">👑</div>}
        </div>

        {/* Torso - Detailed Clothing */}
        <div 
          className="relative w-36 shadow-lg z-10 rounded-t-[40px] rounded-b-[30px] -mt-6 flex flex-col items-center border-[6px] border-white/30 overflow-hidden" 
          style={{ 
            height: `${bodySize}px`, 
            background: `linear-gradient(to bottom, ${template.color}, ${template.color}ee)`,
            filter: 'brightness(0.95)' 
          }}
        >
          {/* Shirt/Clothing Layer */}
          <div className="absolute inset-x-0 top-0 h-full bg-white/40 flex flex-col items-center">
            <div className="w-full h-1/3 bg-white/30 border-b border-white/10 flex justify-center items-center">
              <div className="w-12 h-4 bg-white/20 rounded-full" />
            </div>
            <div className="text-2xl opacity-40 mt-6">✨</div>
            {/* Belly patch */}
            <div className="absolute bottom-[-10px] w-20 h-20 bg-white/20 rounded-full blur-[5px]" />
          </div>

          {/* Outfit: Cloak */}
          {outfit.includes('i10') && (
            <div className="absolute inset-0 z-20">
              {/* Main Cloak Body */}
              <div className="absolute inset-0 bg-red-600 border-t-[12px] border-red-500 rounded-t-[30px] shadow-inner" />
              {/* Collar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-8 flex justify-between px-2">
                <div className="w-12 h-10 bg-red-700 rounded-br-3xl rotate-[-15deg] border-r-2 border-red-800/30" />
                <div className="w-12 h-10 bg-red-700 rounded-bl-3xl rotate-[15deg] border-l-2 border-red-800/30" />
              </div>
              {/* Buttons */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col space-y-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm border border-yellow-600" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm border border-yellow-600" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm border border-yellow-600" />
              </div>
              {/* Lapels/Opening */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-red-800/20" />
            </div>
          )}

          {/* Outfit: Bow */}
          {outfit.includes('i5') && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-6xl z-30 filter drop-shadow-md">🎀</div>}
        </div>

        {/* Arms - Simple Paws */}
        <motion.div 
          animate={isPlaying ? { rotate: [0, 140, 0] } : isEating ? { y: [0, -10, 0] } : { rotate: [0, 10, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
          className="absolute -left-8 top-36 w-10 h-16 rounded-full origin-top-right shadow-md border-r-[4px] border-white/10 z-20"
          style={{ backgroundColor: template.color, filter: 'brightness(0.9)' }}
        >
          {outfit.includes('i6') && (
            <span 
              className="absolute bottom-[15px] left-[calc(50%-30px)] -translate-x-1/2 text-6xl z-30 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
              style={{ transform: 'scaleX(-1) rotate(40deg)', transformOrigin: 'center center' }}
            >
              🪄
            </span>
          )}
        </motion.div>
        
        <motion.div 
          animate={isPlaying ? { rotate: [0, -140, 0] } : isEating ? { y: [0, -10, 0] } : { rotate: [0, -10, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
          className="absolute -right-8 top-36 w-10 h-16 rounded-full origin-top-left shadow-md border-l-[4px] border-white/10 z-20"
          style={{ backgroundColor: template.color, filter: 'brightness(0.9)' }}
        >
          {outfit.includes('i11') && (
            <span 
              className="absolute bottom-[15px] left-[calc(50%+25px)] -translate-x-1/2 text-6xl z-30 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
              style={{ transform: 'rotate(40deg)', transformOrigin: 'center center' }}
            >
              🎈
            </span>
          )}
        </motion.div>

        {/* Legs - Simple Stubs */}
        <div className="flex space-x-16 -mt-6">
          {[0, 1].map((i) => (
            <motion.div 
              key={i}
              animate={isPlaying ? { y: [0, -15, 0] } : {}}
              transition={{ delay: i * 0.1 }}
              className="w-12 h-10 rounded-b-xl shadow-md border-x-2 border-white/10" 
              style={{ backgroundColor: template.color, filter: 'brightness(0.85)' }}
            />
          ))}
        </div>

        {/* Level Badge - Minimalist */}
        <motion.div 
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute -top-6 -right-12 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-black px-3 py-1 rounded-full shadow-sm border border-gray-100 z-40 flex items-center space-x-1"
        >
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>LV.{level}</span>
        </motion.div>

        {/* Custom Items / Companions */}
        <div className="absolute -bottom-4 -right-16 flex flex-wrap-reverse flex-row-reverse max-w-[120px] pointer-events-none">
          {outfit.filter(id => !['i3', 'i4', 'i5', 'i6', 'i9', 'i10', 'i11'].includes(id)).map(id => {
            const item = allShopItems.find(i => i.id === id);
            if (!item) return null;
            return (
              <motion.div 
                key={id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl filter drop-shadow-md m-1"
              >
                {item.image}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Shadow - Subtle */}
      <motion.div
        animate={{ 
          scaleX: isPlaying ? [1, 0.5, 1] : [1, 1.2, 1], 
          opacity: [0.15, 0.05, 0.15] 
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 w-48 h-8 bg-black/10 rounded-full blur-[20px]"
      />

      {/* Stage Label - Minimalist */}
      <div className="absolute bottom-0 bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/40">
        {level >= 8 ? '🌟 终极形态' : level >= 4 ? '🌈 成长期' : '🐣 幼年期'}
      </div>
    </div>
  );
};
