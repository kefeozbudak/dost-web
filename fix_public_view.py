with open('src/pages/PublicView.tsx', 'r') as f:
    code = f.read()

target = "const navigate = useNavigate();"
new_target = "const navigate = useNavigate();\n  const handleAdminLogin = () => navigate('/admin/login');"

if target in code:
    code = code.replace(target, new_target)
    with open('src/pages/PublicView.tsx', 'w') as f:
        f.write(code)
    print("Fixed PublicView!")
else:
    print("Not found navigate")
