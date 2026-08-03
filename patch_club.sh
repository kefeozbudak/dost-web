sed -i "s/reports.filter(r => r.type === 'chat' || \!r.type || r.data?.formName).length/reports.filter(r => r.type === 'club_registration_form').length/g" src/admin/hubs/ClubCenter.tsx
sed -i "s/Veli Asistanı/Kulüp Başvuruları/g" src/admin/hubs/ClubCenter.tsx
sed -i "s/activeTab === 'chat'/activeTab === 'club'/g" src/admin/hubs/ClubCenter.tsx
sed -i "s/setActiveTab('chat')/setActiveTab('club')/g" src/admin/hubs/ClubCenter.tsx
sed -i "s/const \[activeTab, setActiveTab\] = useState<'chat' | 'pre_registration' | 'contact' | 'all'>('chat');/const \[activeTab, setActiveTab\] = useState<'club'>('club');/g" src/admin/hubs/ClubCenter.tsx
sed -i "/activeTab === 'pre_registration'/,+41d" src/admin/hubs/ClubCenter.tsx
