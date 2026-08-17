const fs = require('fs');
let code = fs.readFileSync('src/lib/styleUtils.ts', 'utf8');

const target1 = `    if (cssProp === 'text-align' && (mobileVal === undefined || mobileVal === "")) {
      mobileVal = 'center';
    }`;
code = code.replace(target1, "");

const target2 = `export const getAlignClass = (block: any, fieldKey: string = "", defaultClass: string = "mx-auto") => {
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

const replacement2 = `export const getAlignClass = (block: any, fieldKey: string = "", defaultClass: string = "mx-auto") => {
  let align = block?.styles?.textAlign;
  if (fieldKey) {
    align = block?.styles?.[fieldKey + "Align"] || align;
  }
  let mobileAlign = block?.styles?.mobileAlign || block?.styles?.[fieldKey + "MobileAlign"];
  
  if (!mobileAlign && align) mobileAlign = align; // Fallback to desktop align if not specified
  
  let cls = "";
  if (mobileAlign === "left") cls += " mr-auto ml-0 text-left ";
  else if (mobileAlign === "right") cls += " ml-auto mr-0 text-right ";
  else if (mobileAlign === "center") cls += " mx-auto text-center ";
  else {
    if (defaultClass === "mx-auto") cls += " mx-auto text-center ";
  }
  
  if (align === "left") cls += " md:mr-auto md:ml-0 md:text-left ";
  else if (align === "right") cls += " md:ml-auto md:mr-0 md:text-right ";
  else if (align === "center") cls += " md:mx-auto md:text-center ";
  else {
    if (defaultClass === "mx-auto") cls += " md:mx-auto md:text-center ";
  }
  
  return cls.replace(/\\s+/g, ' ').trim();
};`;

code = code.replace(target2, replacement2);
fs.writeFileSync('src/lib/styleUtils.ts', code);
console.log("Fixed alignments");
