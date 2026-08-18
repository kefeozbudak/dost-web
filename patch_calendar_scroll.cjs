const fs = require('fs');
let code = fs.readFileSync('src/admin/CalendarGridEditor.tsx', 'utf8');

const useeffect = `  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (activeArrayItem && activeArrayItem.arrayKey === arrayKey && activeArrayItem.index !== undefined) {
      const activeItem = currentArray[activeArrayItem.index];
      if (activeItem && activeItem.date) {
        const parsedDay = parseInt(String(activeItem.date).replace(/\\D/g, ''));
        if (!isNaN(parsedDay)) {
          setSelectedDay(parsedDay);
        }
      } else if (activeArrayItem.index !== -1 && activeArrayItem.index < 31) {
          setSelectedDay(activeArrayItem.index + 1);
      }
      
      // Scroll into view
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [activeArrayItem, arrayKey, currentArray]);`;

code = code.replace(/const \[selectedDay, setSelectedDay\] = useState\<number \| null\>\(null\);[\s\S]*?\}, \[activeArrayItem, arrayKey, currentArray\]\);/, useeffect);

code = code.replace(/<div className="bg-slate-50 border border-slate-200 rounded-xl p-4">/, `<div ref={containerRef} className="bg-slate-50 border border-slate-200 rounded-xl p-4">`);

fs.writeFileSync('src/admin/CalendarGridEditor.tsx', code);
