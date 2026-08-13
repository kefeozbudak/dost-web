const getStyleMock = (block, prefix) => {
  const style = {};
  const addResponsiveVar = (cssProp, jsProp, suffix, unit = "") => {
    let desktopVal = block.styles?.[prefix + suffix] || (prefix === "" || prefix === "container" ? block.styles?.[suffix.charAt(0).toLowerCase() + suffix.slice(1)] : undefined);
    let mobileVal = block.styles?.[prefix + "Mobile" + suffix] || (prefix === "" || prefix === "container" ? block.styles?.["mobile" + suffix] : undefined);
    
    if (cssProp === 'font-size') { 
      if (desktopVal === '0' || desktopVal === '0px' || desktopVal === 0) desktopVal = undefined;
      if (mobileVal === '0' || mobileVal === '0px' || mobileVal === 0) mobileVal = undefined;
    }
    if (desktopVal !== undefined && desktopVal !== "") {
      style[`--desktop-${cssProp}`] = desktopVal + unit;
      style[jsProp] = desktopVal + unit; 
    }
    if (mobileVal !== undefined && mobileVal !== "") {
      style[`--mobile-${cssProp}`] = mobileVal + unit;
    }
  };
  addResponsiveVar("font-size", "fontSize", "Size", "px");
  addResponsiveVar("margin-top", "marginTop", "MarginTop", "px");
  return style;
};

console.log(getStyleMock({ styles: { itemTitleMobileSize: 24, itemTitleMobileMarginTop: 10 } }, "itemTitle"));
