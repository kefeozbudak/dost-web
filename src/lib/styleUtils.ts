import React from 'react';

export const getStyle = (block: any, prefix: string) => {
  const style: any = {};
  
  style.color = block.styles?.[prefix + "Color"] || (prefix === "container" || prefix === "" ? block.styles?.color : undefined) || undefined;
  style.fontWeight = block.styles?.[prefix + "Weight"] || undefined;
  style.backgroundColor = block.styles?.[prefix + "BackgroundColor"] || (prefix === "container" || prefix === "" ? block.styles?.backgroundColor : undefined) || undefined;
  style.borderRadius = block.styles?.[prefix + "BorderRadius"] ? String(block.styles[prefix + "BorderRadius"]).replace(/px/g, '') + "px" : undefined;
  
  style.backgroundImage = (prefix === "" || prefix === "container") && block.styles?.backgroundImage ? `url(${block.styles.backgroundImage})` : undefined;
  style.backgroundSize = (prefix === "" || prefix === "container") && block.styles?.backgroundImage ? "cover" : undefined;
  style.backgroundPosition = (prefix === "" || prefix === "container") && block.styles?.backgroundImage ? "center" : undefined;

  const addResponsiveVar = (cssProp: string, jsProp: string, suffix: string, unit: string = "") => {
    let desktopVal = block.styles?.[prefix + suffix] || (prefix === "" || prefix === "container" ? block.styles?.[suffix.charAt(0).toLowerCase() + suffix.slice(1)] : undefined);
    let mobileVal = block.styles?.[prefix + "Mobile" + suffix] || (prefix === "" || prefix === "container" ? block.styles?.["mobile" + suffix] : undefined);
    
    if (cssProp === 'font-size') { 
      if (desktopVal === '0' || desktopVal === '0px' || desktopVal === 0) desktopVal = undefined;
      if (mobileVal === '0' || mobileVal === '0px' || mobileVal === 0) mobileVal = undefined;
    }
    
    const clean = (val: any) => typeof val === 'string' ? val.replace(/px/g, '') : val;

    
    if (desktopVal !== undefined && desktopVal !== "") {
      style[`--desktop-${cssProp}`] = clean(desktopVal) + unit;
      style[jsProp] = clean(desktopVal) + unit; 
    }
    if (mobileVal !== undefined && mobileVal !== "") {
      style[`--mobile-${cssProp}`] = clean(mobileVal) + unit;
    }

  };

  addResponsiveVar("text-align", "textAlign", "Align");
  addResponsiveVar("font-size", "fontSize", "Size", "px");
  addResponsiveVar("padding-top", "paddingTop", "PaddingTop", "px");
  addResponsiveVar("padding-bottom", "paddingBottom", "PaddingBottom", "px");
  addResponsiveVar("padding-left", "paddingLeft", "PaddingLeft", "px");
  addResponsiveVar("padding-right", "paddingRight", "PaddingRight", "px");
  addResponsiveVar("margin-top", "marginTop", "MarginTop", "px");
  addResponsiveVar("margin-bottom", "marginBottom", "MarginBottom", "px");
  
  Object.keys(style).forEach(key => style[key] === undefined && delete style[key]);
  return style;
};

export const getTitleStyle = (block: any) => ({ ...getStyle(block, "title") });
export const getSubtitleStyle = (block: any) => ({ ...getStyle(block, "subtitle") });
export const getDescStyle = (block: any) => ({ ...getStyle(block, "desc") });
export const getBadgeStyle = (block: any) => getStyle(block, "badge");
export const getButtonStyle = (block: any) => getStyle(block, "buttons");
export const getItemContainerStyle = (block: any) => getStyle(block, "itemContainer");

export const getItemTitleStyle = (block: any, item?: any) => {
  const style: React.CSSProperties = { ...getStyle(block, "itemTitle") };
  if (item && item.itemTitleColor) style.color = item.itemTitleColor;
  return style;
};

export const getItemDescStyle = (block: any, item?: any) => {
  const style: React.CSSProperties = { ...getStyle(block, "itemDesc") };
  if (item && item.itemDescColor) style.color = item.itemDescColor;
  return style;
};

export const getItemButtonStyle = (block: any) => getStyle(block, "itemButton");

export const getTitlePart1Style = (block: any) => ({
  
  ...getStyle(block, "titlePart1"),
  color: block.styles?.titlePart1Color || block.styles?.titleColor || block.titlePart1Color || block.titleColor || undefined,
});

export const getTitlePart2Style = (block: any) => ({
  
  ...getStyle(block, "titlePart2"),
  color: block.styles?.titlePart2Color || block.styles?.titleColor || block.titlePart2Color || block.titleColor || undefined,
});

export const getValidText = (...values: any[]) => {
  for (const v of values) {
    if (typeof v === 'string') {
      const stripped = v.replace(/<[^>]*>?/gm, '').trim();
      if (stripped.length > 0) return v;
    } else if (v) {
      return v;
    }
  }
  return values[values.length - 1] || "";
};

export const getValidStyle = (block: any, ...keys: string[]) => {
  for (const key of keys) {
    const s = getStyle(block, key);
    if (Object.keys(s).length > 0) return s;
  }
  return {};
};

export const getIndividualButtonStyle = (btn: any, block?: any) => {
  const style: any = block ? { ...getButtonStyle(block) } : {};
  if (btn.bgColor || btn.cardBgColor) style.backgroundColor = btn.bgColor || btn.cardBgColor;
  if (btn.textColor || btn.cardTextColor) style.color = btn.textColor || btn.cardTextColor;
  if (btn.borderColor || btn.cardBorderColor) {
    style.borderColor = btn.borderColor || btn.cardBorderColor;
    style.borderWidth = "2px";
    style.borderStyle = "solid";
  }
  if (btn.borderRadius || btn.cardBorderRadius) style.borderRadius = btn.borderRadius || btn.cardBorderRadius;
  return style;
};

export const fallbackImages = [
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
];

export const getImageStyle = (obj: any, key: string, fallbackIndex = 0) => {
  let url = obj[key];
  if (!url || url.includes("lh3.googleusercontent.com/aida-public/")) {
    url = fallbackImages[fallbackIndex % fallbackImages.length];
  }
  const posX = obj[`${key}_posX`] ?? 50;
  const posY = obj[`${key}_posY`] ?? 50;
  const scale = obj[`${key}_scale`] ?? 100;
  return {
    backgroundImage: `url('${url}')`,
    backgroundPosition: `${posX}% ${posY}%`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    transformOrigin: `${posX}% ${posY}%`,
    scale: scale !== 100 ? scale / 100 : undefined,
  } as React.CSSProperties;
};

export const getCardStyle = (item: any, block?: any) => {
  if (!item) return {};
  const style: React.CSSProperties = { ...getItemContainerStyle(block) };
  if (item.cardBgColor || block?.styles?.cardBgColor) style.backgroundColor = item.cardBgColor || block?.styles?.cardBgColor;
  
  const bgImage = item.cardBgImage || block?.styles?.cardBgImage;
  if (bgImage) {
    style.backgroundImage = `url('${bgImage}')`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
    style.backgroundRepeat = "no-repeat";
  }
  
  if (item.cardBorderColor || block?.styles?.cardBorderColor) style.borderColor = item.cardBorderColor || block?.styles?.cardBorderColor;
  if (item.cardBorderWidth || block?.styles?.cardBorderWidth) style.borderWidth = item.cardBorderWidth || block?.styles?.cardBorderWidth;
  if (item.cardBorderRadius || block?.styles?.cardBorderRadius) style.borderRadius = item.cardBorderRadius || block?.styles?.cardBorderRadius;
  if (item.cardPadding || block?.styles?.cardPadding) style.padding = item.cardPadding || block?.styles?.cardPadding;
  return style;
};

export const getCardClass = (item: any, baseClass: string) => {
  let cls = baseClass;
  if (!item) return cls;
  if (item.cardShadow) {
    cls = cls.replace(/shadow(-\\w+)?/g, "").trim();
    if (item.cardShadow !== "none") cls += ` shadow-${item.cardShadow}`;
  }
  if (item.hoverEffect) {
    cls += " transition-all duration-300 hover:-translate-y-2 hover:shadow-xl";
  }
  return cls.replace(/\\s+/g, " ").trim();
};

export const getCardTitleStyle = (item: any, block: any) => {
  const style = { ...getItemTitleStyle(block) };
  if (item?.itemTitleColor) style.color = item.itemTitleColor;
  return style;
};

export const getCardDescStyle = (item: any, block: any) => {
  const style = { ...getItemDescStyle(block) };
  if (item?.itemDescColor) style.color = item.itemDescColor;
  return style;
};

export const extractAlignClass = (styleObj: any) => {
  const dAlign = styleObj["--desktop-text-align"]?.replace("px", "").trim();
  const mAlign = styleObj["--mobile-text-align"]?.replace("px", "").trim();
  let cls = "";
  if (mAlign === "center") cls += " mx-auto ";
  else if (mAlign === "right") cls += " ml-auto mr-0 ";
  else if (mAlign === "left") cls += " ml-0 mr-auto ";
  
  if (dAlign === "center") cls += " md:mx-auto md:ml-auto md:mr-auto ";
  else if (dAlign === "right") cls += " md:ml-auto md:mr-0 ";
  else if (dAlign === "left") cls += " md:ml-0 md:mr-auto ";
  
  return cls.trim();
};

export const removeAlignStyles = (styleObj: any) => {
  const newStyle = { ...styleObj };
  delete newStyle["--desktop-text-align"];
  delete newStyle["--mobile-text-align"];
  return newStyle;
};

export const getIconStyle = (item: any, block: any, prefix = "icon") => {
  const style: React.CSSProperties = { ...getStyle(block, prefix) };
  if (item?.iconColor) style.color = item.iconColor;
  return style;
};

export const getCardButtonStyle = (item: any, block: any) => {
  const style = { ...getItemButtonStyle(block) };
  if (item?.buttonTextColor) style.color = item.buttonTextColor;
  if (item?.buttonBgColor) style.backgroundColor = item.buttonBgColor;
  return style;
};

export const getHeroOverlayClass = (block: any, defaultClasses: string) => {
  const isEnabled = block.styles?.enableDarkOverlay;
  if (!isEnabled) return `${defaultClasses} opacity-0 pointer-events-none`;
  
  const hoverReveal = block.styles?.overlayHoverReveal !== false; // true by default
  const hoverClass = hoverReveal ? "group-hover:opacity-0" : "";
  
  // We use inline styles for the actual color and opacity, so we just return the layout classes + hover transition
  // We strip bg- gradient classes from default so our solid color takes full effect without weird blending
  const baseClasses = defaultClasses.split(' ').filter(c => !c.startsWith('bg-') && !c.startsWith('from-') && !c.startsWith('via-') && !c.startsWith('to-')).join(' ');
  
  return `${baseClasses} ${hoverClass} transition-opacity duration-500 pointer-events-none`;
};

export const getHeroOverlayStyle = (block: any): React.CSSProperties => {
  const isEnabled = block.styles?.enableDarkOverlay;
  if (!isEnabled) return {};

  const color = block.styles?.overlayColor || "#000000";
  const opacity = block.styles?.overlayOpacity ?? 100;
  
  // Convert hex to rgb
  let r = 0, g = 0, b = 0;
  if (color.length === 7) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else if (color.length === 4) {
    r = parseInt(color.slice(1, 2).repeat(2), 16);
    g = parseInt(color.slice(2, 3).repeat(2), 16);
    b = parseInt(color.slice(3, 4).repeat(2), 16);
  }
  
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity / 100})`,
    // If they want blend mode in future: mixBlendMode: block.styles?.overlayBlendMode || "normal"
  };
};
  
  