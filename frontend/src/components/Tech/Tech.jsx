import React, { useEffect, useRef, useState } from 'react'
import { tech_list } from '../../assets/skill/skill'
import { useDarkMode } from '../../contexts/DarkModeContext'

const Tech = ({ category, setCategory }) => {
  const { darkMode } = useDarkMode();
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const techItems = [...tech_list, ...tech_list];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    let animationId;
    const scrollSpeed = 1;

    const autoScroll = () => {
      if (!isHovered && scrollContainer) {
        scrollAmount += scrollSpeed;
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0;
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft = scrollAmount;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isHovered]);

  return (
    <div id='tech' className={`py-8 px-4 -mt-2 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 pt-7 -mb-20">
        <h1 className={`text-2xl md:text-3xl font-bold mb-5 text-start ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Tech Stacks - Tools I Use Everyday
        </h1>
        
        <div 
          ref={scrollContainerRef}
          className="relative overflow-x-auto py-4 scrollbar-hide -mt-4 md:mt-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="inline-flex items-center px-4 gap-4 md:gap-10 lg:gap-20">
            {techItems.map((item, index) => (
              <div 
                key={`${item.tech_name}-${index}`}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 min-w-[90px] max-w-[90px] ${
                  darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                } ${
                  category === item.tech_name ? (darkMode ? 'ring-2 ring-blue-400' : 'ring-2 ring-blue-500') : ''
                } shadow-md`}
                onClick={() => setCategory(item.tech_name)}
              >
                <div className="h-12 w-12 flex items-center justify-center mb-2">
                  <img 
                    className="h-full w-full object-contain" 
                    src={item.tech_image} 
                    alt={item.tech_name} 
                    loading="lazy"
                  />
                </div>
                <p className={`text-xs font-medium text-center truncate w-full ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {item.tech_name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tech