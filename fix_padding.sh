find src/components/ -type f -name "*.tsx" -exec sed -i 's/px-margin-mobile md:px-margin-desktop/TMP_PAD/g' {} +
find src/components/ -type f -name "*.tsx" -exec sed -i 's/px-margin-desktop/TMP_PAD/g' {} +
find src/components/ -type f -name "*.tsx" -exec sed -i 's/TMP_PAD/px-margin-mobile md:px-margin-desktop/g' {} +
