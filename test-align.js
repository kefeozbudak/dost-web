const getAlignClass = (block, fieldKey = "", defaultClass = "mx-auto") => {
  let align = block?.styles?.textAlign;
  if (fieldKey) {
    align = block?.styles?.[fieldKey + "Align"] || align;
  }
  if (align === "left") return "mr-auto ml-0";
  if (align === "right") return "ml-auto mr-0";
  if (align === "center") return "mx-auto";
  return defaultClass;
};

console.log(getAlignClass({ styles: { subtitleAlign: "left" } }, "subtitle"));
