const fs = require('fs');
let code = fs.readFileSync('src/admin/CalendarGridEditor.tsx', 'utf8');

const newProps = `export default function CalendarGridEditor({ block, arrayKey, onChange, activeArrayItem }: { block: any, arrayKey: string, onChange: (key: string, val: any) => void, activeArrayItem?: { arrayKey: string; index: number } | null }) {`;

code = code.replace(/export default function CalendarGridEditor[\s\S]*?\{/, newProps);

const useeffect = `  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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
    }
  }, [activeArrayItem, arrayKey, currentArray]);`;

code = code.replace(/const \[selectedDay, setSelectedDay\] = useState\<number \| null\>\(null\);/, useeffect);

fs.writeFileSync('src/admin/CalendarGridEditor.tsx', code);
