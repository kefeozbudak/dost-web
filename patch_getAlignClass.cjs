const fs = require('fs');
let code = fs.readFileSync('src/lib/styleUtils.ts', 'utf8');

const target = `export const getAlignClass = (block: any, fieldKey: string = "", defaultClass: string = "mx-auto") => {
  let align = block?.styles?.textAlign;
  if (fieldKey) {
    align = block?.styles?.[fieldKey + "Align"] || align;
  }
  if (align === "left") return "mr-auto ml-0";
  if (align === "right") return "ml-auto mr-0";
  if (align === "center") return "mx-auto";
  return defaultClass;
};`;

const replacement = `export const getAlignClass = (block: any, fieldKey: string = "", defaultClass: string = "mx-auto") => {
  let align = block?.styles?.textAlign;
  if (fieldKey) {
    align = block?.styles?.[fieldKey + "Align"] || align;
  }
  let mobileAlign = block?.styles?.mobileAlign || block?.styles?.[fieldKey + "MobileAlign"] || "center";
  
  let cls = "";
  if (mobileAlign === "left") cls += " mr-auto ml-0 text-left ";
  else if (mobileAlign === "right") cls += " ml-auto mr-0 text-right ";
  else cls += " mx-auto text-center ";
  
  if (align === "left") cls += " md:mr-auto md:ml-0 md:text-left ";
  else if (align === "right") cls += " md:ml-auto md:mr-0 md:text-right ";
  else if (align === "center") cls += " md:mx-auto md:text-center ";
  else cls += " md:" + defaultClass + " ";
  
  return cls.trim();
};`;

code = code.replace(target, replacement);
fs.writeFileSync('src/lib/styleUtils.ts', code);
console.log("Patched getAlignClass");
