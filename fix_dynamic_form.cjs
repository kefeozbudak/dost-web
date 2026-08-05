const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

const targetStr = `  const [submitting, setSubmitting] = useState(false);`;

const newCode = `const DynamicFormBuilder = ({ block, type, submitForm }: any) => {
  const defaultInputs = block.inputs && block.inputs.length > 0 ? block.inputs : (type === 'club_registration_form' ? DEFAULT_CLUB_INPUTS : type === 'bursluluk_exam_form' ? DEFAULT_SCHOLARSHIP_INPUTS : DEFAULT_PRE_REGISTRATION_INPUTS);
  const defaultClubs = block.clubs && block.clubs.length > 0 ? block.clubs : (type === 'club_registration_form' ? [
    { id: "spor", label: "Spor", icon: "sports_basketball" },
    { id: "sanat", label: "Sanat", icon: "palette" },
    { id: "bilim", label: "Bilim", icon: "biotech" },
    { id: "muzik", label: "Müzik", icon: "music_note" },
    { id: "robotik", label: "Robotik", icon: "smart_toy" },
    { id: "drama", label: "Drama", icon: "theater_comedy" }
  ] : []);
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);`;

file = file.replace(targetStr, newCode);
fs.writeFileSync('./src/components/PageBlocks.tsx', file);
