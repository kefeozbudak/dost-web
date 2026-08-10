function getHeroInnerClass(block, defaultClasses = "") {
  if (!block.type || !block.type.includes("hero")) return defaultClasses;
  const alignX = block.styles?.heroAlignX || block.styles?.textAlign;
  let alignClass = "";
  if (alignX === "center") alignClass = "mx-auto text-center items-center";
  else if (alignX === "right") alignClass = "ml-auto text-right items-end";
  else if (alignX === "left") alignClass = "mr-auto text-left items-start";

  let cleanedClasses = defaultClasses;
  if (alignClass) {
    cleanedClasses = cleanedClasses.replace(/\bmx-auto\b/g, '')
                                   .replace(/\bml-auto\b/g, '')
                                   .replace(/\bmr-auto\b/g, '')
                                   .replace(/\btext-center\b/g, '')
                                   .replace(/\btext-left\b/g, '')
                                   .replace(/\btext-right\b/g, '');
    if (!cleanedClasses.includes("flex-col")) {
      alignClass = "flex flex-col " + alignClass;
    }
  }

  return `${cleanedClasses} ${alignClass}`.trim().replace(/\s+/g, ' ');
}

console.log(getHeroInnerClass({ type: "achievements_hero", styles: { heroAlignX: "left" } }, "space-y-6 text-center mx-auto"));
