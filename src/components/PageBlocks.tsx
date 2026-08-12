import ErrorBoundary from "./ErrorBoundary";
import React, { useState, useEffect } from "react";
import LgsCalculator from "./LgsCalculator";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db, storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import TextWithKvkkLink from "./TextWithKvkkLink";
import IconField, { IconPreview } from "./IconField";
import SmartLink from "./SmartLink";
import { ManagementHeroBlock, ManagementRectorBlock, ManagementTeamGridBlock } from './ManagementBlocks';
import { SchoolHeroBlock, SchoolBentoBlock, SchoolBranchesBlock, SchoolPedagogyBlock, SchoolLgsBlock } from './SchoolBlocks';
import { AboutHeroBlock, AcademicHeroBlock, AkademikKadroBlock, TimelineBlock, MissionVisionBlock, ValuesBlock, QuoteImageBlock } from './AboutBlocks';
import {
  DEFAULT_PRE_REGISTRATION_INPUTS,
  DEFAULT_CLUB_INPUTS,
  DEFAULT_SCHOLARSHIP_INPUTS,
  DEFAULT_CAREER_INPUTS,
  DEFAULT_CONTACT_INPUTS,
} from "../lib/defaultFormInputs";

export const getHeroAlignStyle = (block: any): React.CSSProperties => {
  if (!block.type || !block.type.includes("hero")) return {};
  const alignY = block.styles?.heroAlignY;
  const style: React.CSSProperties = {};

  if (alignY === "top") {
    style.justifyContent = "flex-start";
    style.alignItems = "flex-start"; // for flex-row
  } else if (alignY === "bottom") {
    style.justifyContent = "flex-end";
    style.alignItems = "flex-end"; // for flex-row
  } else if (alignY === "center") {
    style.justifyContent = "center";
    style.alignItems = "center";
  }
  return style;
};

export const getAlignClass = (block: any, fieldKey: string = "", defaultClass: string = "mx-auto") => {
  let align = block?.styles?.textAlign;
  if (fieldKey) {
    align = block?.styles?.[fieldKey + "Align"] || align;
  }
  if (align === "left") return "mr-auto ml-0";
  if (align === "right") return "ml-auto mr-0";
  if (align === "center") return "mx-auto";
  return defaultClass;
};

export const getHeroInnerClass = (block: any, defaultClasses: string = "") => {
  if (!block.type || !block.type.includes("hero")) return defaultClasses;
  const alignX = block.styles?.heroAlignX || block.styles?.subtitleAlign || block.styles?.textAlign;
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
};

const ClubsGridBlock = ({
  block,
  getStyle,
  getTitleStyle,
  getCardStyle,
  getImageStyle,
  getCardTitleStyle,
  getCardDescStyle,
  IconPreview,
  getIconStyle
}: any) => {
  const [activeFilter, setActiveFilter] = React.useState("Hepsi");
  const [selectedItem, setSelectedItem] = React.useState<any>(null);
  const categoriesStr =
    block.categories ||
    "Spor, Sanat, Bilim & Teknoloji, Sosyal Sorumluluk, Dil & Kültür";
  const categories = [
    "Hepsi",
    ...categoriesStr
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
  ];

  const items = block.items || [];
  const filteredItems =
    activeFilter === "Hepsi"
      ? items
      : items.filter((item) => item.category === activeFilter);

  return (
    <div key={block.id || "clubs-grid"} style={getStyle(block, "container")}>
      <section
        className="py-12 bg-white border-b border-border-subtle sticky top-20 z-40 whitespace-pre-line"
        id="clubs"
      >
        <div
          className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-gutter`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 whitespace-pre-line">
            <h2
              className="font-headline-md text-headline-md text-primary whitespace-pre-line"
              style={getTitleStyle(block)}
            >
              {block.title || "Kulüp Branşları"}
            </h2>
            {block.hideCategories !== true && (
              <div className="flex flex-wrap justify-center gap-2 whitespace-pre-line">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-5 py-2 rounded-full font-label-md text-label-md transition-all ${activeFilter === cat ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-primary-fixed"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        className={`py-section-gap ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-gutter`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 whitespace-pre-line">
          {filteredItems.map((item: any, i: number) => {
            const isError = item.badgeColor === "error";
            const badgeClass = isError
              ? "bg-error-container text-on-error-container"
              : "bg-secondary-container text-on-secondary-container";
            return (
              <div
                key={i}
                className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group whitespace-pre-line"
                style={getCardStyle(item, block)}
              >
                <div className="h-56 relative overflow-hidden whitespace-pre-line">
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 whitespace-pre-line"
                    style={getImageStyle(item, "image", i)}
                  ></div>
                  {item.badge && item.hideBadge !== true && (
                    <span
                      className={`absolute top-4 right-4 ${badgeClass} px-3 py-1 rounded-full font-label-sm text-label-sm`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col whitespace-pre-line">
                  <div className="flex items-center gap-2 mb-2 whitespace-pre-line">
                    {item.icon &&
                      (typeof item.icon === "string" &&
                      item.icon === item.icon.toLowerCase() ? (
                        <IconPreview
                          data={item.icon}
                          className="text-primary text-[24px] whitespace-pre-line"
                          style={{ ...getIconStyle(item, block), fontVariationSettings: "'FILL' 1" }}
                        />
                      ) : (
                        <IconPreview
                          data={item.icon}
                          className="w-[24px] h-[24px] text-primary whitespace-pre-line"
                         style={getIconStyle(item, block)} />
                      ))}
                    <span className="text-primary font-label-sm uppercase tracking-wider whitespace-pre-line">
                      {item.category}
                    </span>
                  </div>
                  <h3
                    className="font-headline-md text-headline-md text-on-surface mb-3 whitespace-pre-line"
                    style={getCardTitleStyle(item, block)}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-on-surface-variant font-body-md mb-6 line-clamp-3 whitespace-pre-line"
                    style={getCardDescStyle(item, block)}
                  >
                    {item.subtitle || item.desc}
                  </p>
                  {item.hideButton !== true && (
                    <div className="mt-auto flex items-center justify-between whitespace-pre-line">
                      {item.url && item.url !== "#" ? (
                        <a
                          href={item.url}
                          className="flex items-center gap-2 text-primary font-label-md hover:translate-x-1 transition-transform whitespace-pre-line"
                        >
                          {item.buttonText || "Detaylı Bilgi"}
                          <span
                            className="material-symbols-outlined whitespace-pre-line"
                            translate="no"
                            aria-hidden="true"
                          >
                            arrow_forward
                          </span>
                        </a>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedItem({ ...item, imageStyle: getImageStyle(item, "image", i) });
                          }}
                          className="flex items-center gap-2 text-primary font-label-md hover:translate-x-1 transition-transform whitespace-pre-line text-left"
                        >
                          {item.buttonText || "Detaylı Bilgi"}
                          <span
                            className="material-symbols-outlined whitespace-pre-line"
                            translate="no"
                            aria-hidden="true"
                          >
                            arrow_forward
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <span className="material-symbols-outlined text-lg" translate="no">close</span>
            </button>
            <div 
              className="w-full shrink-0 h-64 sm:h-80 bg-cover bg-center" 
              style={selectedItem.imageStyle}
            ></div>
            <div className="p-8 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                {selectedItem.icon && (
                  typeof selectedItem.icon === "string" && selectedItem.icon === selectedItem.icon.toLowerCase() ? (
                    <IconPreview data={selectedItem.icon} className="text-primary text-[28px]" />
                  ) : (
                    <IconPreview data={selectedItem.icon} className="w-[28px] h-[28px] text-primary" />
                  )
                )}
                <span className="text-primary font-label-md uppercase tracking-wider">
                  {selectedItem.category}
                </span>
              </div>
              <h3 className="font-headline-lg text-on-surface mb-6">{selectedItem.title}</h3>
              <div className="text-on-surface-variant font-body-lg whitespace-pre-wrap leading-relaxed">
                {selectedItem.desc || selectedItem.subtitle}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CareerHeroBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  return (
    <section
      key={index}
      className="relative w-full rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center mb-8 whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div
        className="absolute inset-0 bg-cover bg-center whitespace-pre-line"
        style={{
          backgroundImage: `url(${block.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80"})`,
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#002147]/90 to-[#1d4eca]/80 whitespace-pre-line"></div>
      <div
        className={`relative z-10 ${block.styles?.textAlign ? "" : "text-center"} px-6 py-16 md:py-24 text-white max-w-3xl ${getAlignClass(block, "title")}`}
      >
        <h1
          className="font-display-lg text-display-lg font-black text-white mb-6 leading-[1.2] tracking-tight whitespace-pre-line"
          style={getTitleStyle(block)}
        >
          {block.title || "Dost Koleji'nde Kariyer"}
        </h1>
        <p
          className={`font-body-lg text-[18px] text-white/90 mb-8 max-w-2xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}
          style={getSubtitleStyle(block)}
        >
          {block.subtitle ||
            "Akademik mükemmelliğe, sürekli gelişime ve huzurlu, profesyonel bir ortamda geleceği şekillendirmeye kararlı bir ekibe katılın."}
        </p>
        <a
          href="#application-form"
          className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-yellow-500 text-[#002147] font-bold text-[14px] px-8 py-3 rounded-full transition-colors shadow-sm whitespace-pre-line"
        >
          <span>{block.buttonText || "Açık Pozisyonları Görüntüle"}</span>
          <span
            className="material-symbols-outlined whitespace-pre-line"
            translate="no"
            aria-hidden="true"
          >
            arrow_downward
          </span>
        </a>
      </div>
    </section>
  );
};

const CareerBenefitsBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  const items = block.items || [
    {
      title: "Sürekli Gelişim",
      desc: "Eğitim sektöründe sürekli eğitim, atölye çalışmaları ve mesleki gelişim fırsatları ile personelimize yatırım yapıyoruz.",
      icon: "psychology",
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      title: "Kurumsal Güven",
      desc: "Dürüstlük ve istikrar temeli üzerine kurulmuş, güvenebileceğiniz güvenli ve şeffaf bir çalışma ortamı sunuyoruz.",
      icon: "verified_user",
      iconColor: "text-[#D4AF37]",
      iconBg: "bg-yellow-100",
      borderTop: "border-t-4 border-t-[#D4AF37]",
    },
    {
      title: "Huzurlu Ortam",
      desc: "Kampüslerimiz hem öğrenciler hem de personel için refah, işbirliği ve uyumlu bir atmosferi teşvik etmek üzere tasarlanmıştır.",
      icon: "spa",
      iconColor: "text-emerald-700",
      iconBg: "bg-emerald-100",
    },
  ];

  return (
    <section
      key={index}
      className="w-full px-4 md:px-0 mb-16 whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div className={`${block.styles?.textAlign ? "" : "text-center"} mb-12`}>
        <h2
          className="font-bold text-2xl md:text-3xl text-[#002147] mb-4 whitespace-pre-line"
          style={getTitleStyle(block)}
        >
          {block.title || "Neden Bize Katılmalısınız?"}
        </h2>
        <p
          className={`font-normal text-[16px] text-slate-500 max-w-2xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}
          style={getSubtitleStyle(block)}
        >
          {block.subtitle ||
            "Dost Koleji ailesinin bir parçası olmanın avantajlarını keşfedin."}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 whitespace-pre-line">
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className={`bg-white border border-slate-200 rounded-xl p-6 transition-transform hover:-translate-y-1 hover:shadow-md ${item.borderTop || ""}`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${item.iconBg || "bg-slate-100"} ${item.iconColor || "text-slate-700"}`}
            >
              <IconPreview
                data={item.icon || "star"}
                style={{ ...getIconStyle(item, block), fontVariationSettings: "'FILL' 1" }}
              />
            </div>
            <h3 className="font-bold text-[20px] text-slate-900 mb-2 whitespace-pre-line">
              {item.title}
            </h3>
            <p className="font-normal text-[16px] text-slate-500 whitespace-pre-line">
              {item.subtitle || item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const CareerApplicationBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  const positions = block.items || [];

  return (
    <section
      key={index}
      id="application-form"
      className="w-full px-4 md:px-0 mb-16 whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div
        className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-7xl"} mx-auto flex flex-col lg:flex-row gap-12`}
      >
        {/* Left Side: Open Positions */}
        <div className="w-full lg:w-1/3 whitespace-pre-line">
          <div className="sticky top-24 whitespace-pre-line">
            <h2
              className="font-bold text-2xl text-[#002147] mb-6 whitespace-pre-line"
              style={getTitleStyle(block)}
            >
              {block.title || "Açık Pozisyonlar"}
            </h2>
            {positions.length > 0 ? (
              <div className="space-y-4 whitespace-pre-line">
                {positions.map((pos: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[#D4AF37] hover:shadow-md transition-all group whitespace-pre-line"
                  >
                    <div className="flex items-start justify-between mb-2 whitespace-pre-line">
                      <h4 className="font-bold text-[#002147] group-hover:text-[#D4AF37] transition-colors whitespace-pre-line">
                        {pos.title}
                      </h4>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded whitespace-pre-line">
                        {pos.type}
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-500 whitespace-pre-line">
                      {pos.dept}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`bg-slate-50 text-slate-500 p-6 rounded-xl ${block.styles?.textAlign ? "" : "text-center"} text-sm border border-slate-100`}
              >
                Şu an açık pozisyon bulunmamaktadır. Genel başvuru
                yapabilirsiniz.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Application Form */}
        <div className="w-full lg:w-2/3 whitespace-pre-line">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 relative whitespace-pre-line">
            {/* Header */}
            <div
              className={`bg-[#002147] px-8 py-6 text-white ${block.styles?.textAlign ? "" : "text-center"}`}
            >
              <h2 className="font-bold text-[24px] whitespace-pre-line">
                İş Başvurusu
              </h2>
              <p className="text-white/80 mt-2 whitespace-pre-line">
                Dost Koleji ailesine katılmak için formu doldurun
              </p>
            </div>

            <div className="p-8 whitespace-pre-line">
              <DynamicFormBuilder getIconStyle={getIconStyle} block={block} type="career_application" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const EduSystemHeroBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  const bgImage =
    block.image ||
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80";
  const posX = block.image_posX || "50";
  const posY = block.image_posY || "50";
  const scale = block.image_scale || "100";

  return (
    <section
      key={index}
      className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div className="absolute inset-0 z-0 whitespace-pre-line">
        <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 to-on-background/40 z-10 whitespace-pre-line"></div>
        <div
          className="w-full h-full bg-cover whitespace-pre-line"
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundPosition: `${posX}% ${posY}%`,
            transform: `scale(${scale / 100})`,
          }}
        ></div>
      </div>
      <div
        className={`relative z-20 w-full ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} px-margin-mobile md:px-margin-desktop py-20 ${block.styles?.textAlign ? "" : "text-center"} text-white`}
      >
        <h1
          className="font-display-lg text-display-lg font-extrabold mb-6 whitespace-pre-line"
          style={getTitleStyle(block)}
        >
          {block.title || "Eğitim Sistemimiz"}
        </h1>
        <p
          className={`font-body-lg text-lg md:text-xl max-w-3xl ${getAlignClass(block, "subtitle")} text-surface-bright/90 whitespace-pre-line`}
          style={getSubtitleStyle(block)}
        >
          {block.subtitle || "Geleceğe Güvenle Hazırlıyoruz"}
        </p>
      </div>
    </section>
  );
};

const EduSystemLevelsBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getCardTitleStyle,
  getCardDescStyle,
  getIconStyle
}: any) => {
  return (
    <section
      key={index}
      className={`py-section-gap px-margin-mobile md:px-margin-desktop ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto`}
      style={getStyle(block, "container")}
    >
      <div className={`${block.styles?.textAlign ? "" : "text-center"} mb-16`}>
        <h2
          className="font-headline-xl text-2xl md:text-4xl font-bold text-text-main mb-4 whitespace-pre-line"
          style={getTitleStyle(block)}
        >
          {block.title}
        </h2>
        <div className="h-1 w-20 bg-secondary rounded-full mx-auto whitespace-pre-line"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 whitespace-pre-line">
        {(block.items || []).map((item: any, i: number) => {
          const isPrimary = i % 2 === 0;
          const colorClass = isPrimary ? "primary" : "secondary";
          return (
            <div
              key={i}
              className="bg-surface-card rounded-xl border border-border-subtle p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full whitespace-pre-line"
              style={{
                backgroundColor: item.cardBgColor || undefined,
                borderColor: item.cardBorderColor || undefined,
                borderWidth: item.cardBorderWidth || undefined,
                borderRadius: item.cardBorderRadius || undefined,
                padding: item.cardPadding || undefined,
                boxShadow:
                  item.cardShadow === "none"
                    ? "none"
                    : item.cardShadow
                      ? `var(--tw-shadow-${item.cardShadow})`
                      : undefined,
              }}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors ${isPrimary ? "bg-primary/10 group-hover:bg-primary text-primary" : "bg-secondary/10 group-hover:bg-secondary text-secondary"} group-hover:text-white`}
              >
                <IconPreview
                  data={item.icon || "school"}
                  className="text-3xl transition-colors whitespace-pre-line"
                 style={getIconStyle(item, block)} />
              </div>
              <h3
                className="font-headline-md text-xl font-bold text-text-main mb-3 whitespace-pre-line"
                style={getCardTitleStyle(item, block)}
              >
                {item.title}
              </h3>
              <p
                className="font-body-md text-text-muted mb-6 flex-grow whitespace-pre-line"
                style={getCardDescStyle(item, block)}
              >
                {item.subtitle || item.desc}
              </p>
              {item.url && !item.hideButton && (
                <SmartLink
                  className={`inline-flex items-center font-label-md font-semibold hover:opacity-80 group/link ${isPrimary ? "text-primary" : "text-secondary"}`}
                  url={item.url}
                >
                  {item.buttonText || "Detaylı Bilgi"}
                  <span
                    className="material-symbols-outlined text-sm ml-1 group-hover/link:translate-x-1 transition-transform whitespace-pre-line"
                    translate="no"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </SmartLink>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const EduSystemYadepBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getCardTitleStyle,
  getCardDescStyle,
  getIconStyle
}: any) => {
  return (
    <section
      key={index}
      className="py-section-gap bg-surface-container-low whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div
        className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-mobile md:px-margin-desktop`}
      >
        <div
          className={`${block.styles?.textAlign ? "" : "text-center"} mb-16`}
        >
          <h2
            className="font-headline-xl text-2xl md:text-4xl font-bold text-text-main mb-4 whitespace-pre-line"
            style={getTitleStyle(block)}
          >
            {block.title}
          </h2>
          <p
            className={`font-body-lg text-text-muted max-w-2xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}
            style={getSubtitleStyle(block)}
          >
            {block.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 whitespace-pre-line">
          {(block.items || []).map((item: any, i: number) => {
            let colorClass = "primary";
            if (i === 1) colorClass = "secondary";
            if (i === 2) colorClass = "error";

            return (
              <div
                key={i}
                className="bg-surface-card p-8 rounded-xl shadow-sm border border-border-subtle hover:shadow-md transition-shadow whitespace-pre-line"
                style={{
                  backgroundColor: item.cardBgColor || undefined,
                  borderColor: item.cardBorderColor || undefined,
                  borderWidth: item.cardBorderWidth || undefined,
                  borderRadius: item.cardBorderRadius || undefined,
                  padding: item.cardPadding || undefined,
                  boxShadow:
                    item.cardShadow === "none"
                      ? "none"
                      : item.cardShadow
                        ? `var(--tw-shadow-${item.cardShadow})`
                        : undefined,
                }}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    colorClass === "error"
                      ? "bg-error-container/30 text-error-red"
                      : colorClass === "secondary"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  <IconPreview
                    data={item.icon}
                    className="text-3xl whitespace-pre-line"
                   style={getIconStyle(item, block)} />
                </div>
                <h3
                  className="font-headline-md text-xl font-bold text-text-main mb-3 whitespace-pre-line"
                  style={getCardTitleStyle(item, block)}
                >
                  {item.title}
                </h3>
                <p
                  className="font-body-md text-text-muted whitespace-pre-line"
                  style={getCardDescStyle(item, block)}
                >
                  {item.subtitle || item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const EduSystemPhilosophyBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getCardTitleStyle,
  getCardDescStyle,
  getIconStyle
}: any) => {
  const bgImage =
    block.image ||
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80";
  const posX = block.image_posX || "50";
  const posY = block.image_posY || "50";
  const scale = block.image_scale || "100";

  return (
    <section
      key={index}
      className="py-section-gap bg-surface-container relative overflow-hidden whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none whitespace-pre-line"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none whitespace-pre-line"></div>

      <div
        className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-mobile md:px-margin-desktop relative z-10`}
      >
        <div className="flex flex-col lg:flex-row gap-16 items-center whitespace-pre-line">
          <div className="w-full lg:w-1/2 space-y-8 whitespace-pre-line">
            <div>
              <span className="text-secondary font-label-md tracking-wider uppercase mb-2 block whitespace-pre-line">
                {block.badge}
              </span>
              <h2
                className="font-headline-xl text-2xl md:text-4xl font-bold text-text-main whitespace-pre-line"
                style={getTitleStyle(block)}
              >
                {block.title}
              </h2>
            </div>
            <p
              className="font-body-md text-text-muted text-lg whitespace-pre-line"
              style={getSubtitleStyle(block)}
            >
              {block.subtitle || block.desc}
            </p>
            <div className="space-y-6 whitespace-pre-line">
              {(block.items || []).map((item: any, i: number) => {
                const colorClass = i % 2 === 0 ? "primary" : "secondary";
                return (
                  <div key={i} className="flex gap-4 whitespace-pre-line">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center shadow-sm whitespace-pre-line">
                      <IconPreview data={item.icon}  style={getIconStyle(item, block)} />
                    </div>
                    <div>
                      <h4
                        className="font-headline-md text-lg font-bold text-text-main mb-1 whitespace-pre-line"
                        style={getCardTitleStyle(item, block)}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="font-body-md text-text-muted text-sm whitespace-pre-line"
                        style={getCardDescStyle(item, block)}
                      >
                        {item.subtitle || item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative whitespace-pre-line">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white whitespace-pre-line">
              <div
                className="w-full h-full bg-cover whitespace-pre-line"
                style={{
                  backgroundImage: `url('${bgImage}')`,
                  backgroundPosition: `${posX}% ${posY}%`,
                  transform: `scale(${scale / 100})`,
                }}
              ></div>
            </div>
            {block.cardTitle && (
              <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white shadow-lg max-w-xs hidden sm:block whitespace-pre-line">
                <div className="flex items-center gap-3 mb-2 whitespace-pre-line">
                  <span
                    className="material-symbols-outlined text-secondary text-3xl whitespace-pre-line"
                    translate="no"
                    aria-hidden="true"
                  >
                    {block.cardIcon || "emoji_events"}
                  </span>
                  <span className="font-headline-md font-bold text-text-main whitespace-pre-line">
                    {block.cardTitle}
                  </span>
                </div>
                <p className="font-body-md text-sm text-text-muted whitespace-pre-line">
                  {block.cardDesc}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const EduSystemCtaBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  return (
    <section
      key={index}
      className="py-24 bg-primary text-white relative overflow-hidden whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none whitespace-pre-line"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      ></div>
      <div
        className={`max-w-4xl ${getAlignClass(block, "title")} px-margin-mobile ${block.styles?.textAlign ? "" : "text-center"} relative z-10`}
      >
        <h2
          className="font-headline-xl text-2xl md:text-4xl font-bold mb-6 whitespace-pre-line"
          style={getTitleStyle(block)}
        >
          {block.title}
        </h2>
        <p
          className={`font-body-lg text-lg text-primary-fixed-dim mb-10 max-w-2xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}
          style={getSubtitleStyle(block)}
        >
          {block.subtitle || block.desc}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 whitespace-pre-line">
          {(block.buttons || []).map((btn: any, btnIdx: number) => (
            <SmartLink
              key={btnIdx}
              url={btn.url}
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-label-md font-bold rounded-lg hover:bg-surface-bright hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-pre-line"
            >
              {btn.icon && <IconPreview data={btn.icon}  style={getIconStyle(btn, block)} />}
              {btn.label || btn.buttonText}
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
};
const DynamicFormBuilder = ({ block, type, submitForm, getIconStyle }: any) => {
  let defaultInputs =
    block.inputs && block.inputs.length > 0
      ? block.inputs
      : type === "club_registration_form"
        ? DEFAULT_CLUB_INPUTS
        : type === "bursluluk_exam_form"
          ? DEFAULT_SCHOLARSHIP_INPUTS
          : type === "career_application"
            ? DEFAULT_CAREER_INPUTS
            : type === "contact_form"
              ? DEFAULT_CONTACT_INPUTS
              : DEFAULT_PRE_REGISTRATION_INPUTS;

  // Migration for old pre_registration_form grade options
  const hasKvkk = defaultInputs.some((i: any) => i.name === "kvkk_approval" || (i.label && i.label.includes("KVKK")));
  if (!hasKvkk && defaultInputs.length > 0) {
    defaultInputs = [...defaultInputs, { id: "kvkk_auto", name: "kvkk_approval", type: "checkbox", label: "Gizlilik Politikası ve KVKK metnini okudum, onaylıyorum.", required: true, fullWidth: true }];
  }
  if (type === "pre_registration_form" && block.inputs && block.inputs.length > 0) {
    defaultInputs = defaultInputs.map((inp: any) => {
      if (inp.name === "grade" && typeof inp.options === "string") {
        return {
          ...inp,
          options: 'Okul Öncesi 4 Yaş, Okul Öncesi 5 Yaş, Okul Öncesi 6 Yaş, 1. Sınıf, 2. Sınıf, 3. Sınıf, 4. Sınıf, 5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf, 9. Sınıf Anadolu Lisesi, 9. Sınıf Fen Lisesi, 10. Sınıf Anadolu Lisesi, 10. Sınıf Fen Lisesi, 11. Sınıf Anadolu Lisesi, 11. Sınıf Fen Lisesi, 12. Sınıf Anadolu Lisesi, 12. Sınıf Fen Lisesi'
        };
      }
      return inp;
    });
  }
  const defaultClubs =
    block.clubs && block.clubs.length > 0
      ? block.clubs
      : type === "club_registration_form"
        ? [
            { id: "cimnastik", label: "Cimnastik", icon: "sports_gymnastics" },
            { id: "basketbol", label: "Basketbol", icon: "sports_basketball" },
            { id: "voleybol", label: "Voleybol", icon: "sports_volleyball" },
            { id: "halk_oyunlari", label: "Halk Oyunları", icon: "accessibility_new" },
            { id: "oryantiring", label: "Oryantiring", icon: "explore" },
            { id: "masa_tenisi", label: "Masa Tenisi", icon: "sports_tennis" },
            { id: "okculuk", label: "Okçuluk", icon: "sports_martial_arts" },
            { id: "atletik_koordinasyon", label: "Atletik Koordinasyon", icon: "fitness_center" },
            { id: "yuzme", label: "Yüzme", icon: "pool" },
            { id: "taekwondo", label: "Taekwondo", icon: "sports_martial_arts" },
            { id: "futsal", label: "Futsal", icon: "sports_soccer" },
            { id: "keman", label: "Keman", icon: "music_note" },
            { id: "gitar", label: "Gitar", icon: "music_note" },
            { id: "piyano", label: "Piyano", icon: "piano" }
          ]
        : [];
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedDocId, setSubmittedDocId] = useState<string>("");
  const [botValue, setBotValue] = useState("");

  // set initial states
  useEffect(() => {
    setFormData((prev: any) => {
      const initData: any = { ...prev };
      let changed = false;
      const inputsToProcess = defaultInputs;
      if (inputsToProcess.length > 0) {
        inputsToProcess.forEach((inp: any) => {
          if (
            inp.type !== "section_title" &&
            initData[inp.name] === undefined
          ) {
            initData[inp.name] = inp.type === "checkbox" ? false : "";
            changed = true;
          }
        });
        if (
          type === "club_registration_form" &&
          defaultClubs.length > 0 &&
          initData["club"] === undefined
        ) {
          initData["club"] = "";
          changed = true;
        }
      }
      return changed ? initData : prev;
    });
  }, [defaultInputs, defaultClubs, type]);

  const handleChange = (name: string, value: any) => {
    let finalValue = value;
    const lowerName = name.toLowerCase();

    // Frontend validation: Phone numbers can only contain numbers, spaces, or +
    if (
      lowerName.includes("telefon") ||
      lowerName.includes("phone") ||
      lowerName.includes("tel")
    ) {
      if (typeof value === "string") {
        finalValue = value.replace(/[^\d\s+]/g, "");
      }
    }

    // Frontend validation: TC Kimlik can only contain numbers and max 11 chars
    if (lowerName === "tc" || lowerName === "t.c." || lowerName.includes("kimlik") || lowerName.includes("_tc")) {
      if (typeof value === "string") {
        finalValue = value.replace(/[^\d]/g, "").slice(0, 11);
      }
    }

    setFormData((prev: any) => {
      const newData = { ...prev, [name]: finalValue };
      if (type === "pre_registration_form" && name === "grade") {
        if (typeof finalValue === "string" && (finalValue.includes("Anadolu Lisesi") || finalValue.includes("Fen Lisesi"))) {
          newData.campus = "Eryaman Kampüsü";
        }
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Bot & Spam Protection (Honeypot)
    if (botValue) {
      console.log("Bot detected, ignoring submission.");
      setSubmitted(true);
      return;
    }

    // 2. Double Submit Prevention
    if (submitting) return;

    setSubmitting(true);
    try {
      // Clean up files to base64 or drop them if too large
      const processedData = { ...formData };
      for (const key of Object.keys(processedData)) {
        if (processedData[key] instanceof File) {
          // Just store file name and size for demo purposes as we don't have Storage setup
          // Or read as DataURL if it's small, but to prevent firestore size limits, just metadata
          processedData[key] = {
            name: processedData[key].name,
            size: processedData[key].size,
            type: processedData[key].type,
            isUploaded: true,
          };
        }
      }

      if (submitForm) {
        const resId = await submitForm(processedData);
        if (resId) setSubmittedDocId(resId);
      } else {
        const docRef = await addDoc(collection(db, "forms"), {
          type: type,
          createdAt: Date.now(),
          data: processedData,
        });
        if (docRef?.id) setSubmittedDocId(docRef.id);
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        // reset form
        const resetData: any = {};
        defaultInputs.forEach((inp: any) => {
          if (inp.type !== "section_title") {
            resetData[inp.name] = inp.type === "checkbox" ? false : "";
          }
        });
        if (type === "club_registration_form") resetData["club"] = "";
        setFormData(resetData);
      }, 15000);
    } catch (error) {
      console.error("Form error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setSubmitting(false);
    }
  };

  const isStyledForm =
    type === "pre_registration_form" || type === "bursluluk_exam_form";

  return (
    <div
      className={
        type === "club_registration_form"
          ? "bg-surface-card border border-border-subtle rounded-xl p-6 md:p-10 shadow-sm relative form-card"
          : "relative"
      }
      style={
        type === "club_registration_form" && block.styles?.cardBgColor
          ? { backgroundColor: block.styles.cardBgColor }
          : {}
      }
    >
      {submitted ? (
        type === "bursluluk_exam_form" ? (
          <div
            className={`p-8 md:p-12 ${block.styles?.textAlign ? "" : "text-center"} min-h-[400px] flex flex-col items-center justify-center space-y-6`}
          >
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner whitespace-pre-line">
              <span
                className="material-symbols-outlined text-4xl whitespace-pre-line"
                translate="no"
                aria-hidden="true"
              >
                check_circle
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#002147] whitespace-pre-line">
              Bursluluk Sınavı Başvurunuz Başarıyla Alındı!
            </h3>
            <p className={`text-slate-600 max-w-md ${getAlignClass(block)} text-sm leading-relaxed whitespace-pre-line`}>
              Sınav giriş belgeniz oluşturulmuştur. Belgenizi hemen görüntülemek
              ve indirmek için aşağıdaki butona tıklayabilirsiniz.
            </p>
            <a
              href={
                submittedDocId
                  ? `/bursluluk-basvuru-onay?id=${submittedDocId}`
                  : `/bursluluk-basvuru-onay`
              }
              className="px-6 py-3.5 bg-[#002147] text-white font-bold rounded-xl hover:bg-[#002147]/90 transition-all text-sm inline-flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer whitespace-pre-line"
            >
              <span
                className="material-symbols-outlined whitespace-pre-line"
                translate="no"
                aria-hidden="true"
              >
                badge
              </span>
              Sınav Giriş Belgesini Görüntüle ve İndir
            </a>
          </div>
        ) : type === "contact_form" ? (
          <div
            className={`p-12 ${block.styles?.textAlign ? "" : "text-center"} bg-green-50 rounded-xl border border-green-100 min-h-[300px] flex flex-col items-center justify-center`}
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 whitespace-pre-line">
              <span
                className="material-symbols-outlined text-3xl whitespace-pre-line"
                translate="no"
                aria-hidden="true"
              >
                check_circle
              </span>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2 whitespace-pre-line">
              Mesajınız İletildi
            </h3>
            <p className="text-green-700 whitespace-pre-line">
              Mesajınız başarıyla gönderilmiştir. En kısa sürede sizinle
              iletişime geçeceğiz.
            </p>
          </div>
        ) : (
          <div
            className={`p-12 ${block.styles?.textAlign ? "" : "text-center"} min-h-[400px] flex flex-col items-center justify-center`}
          >
            <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4 whitespace-pre-line">
              <span
                className="material-symbols-outlined text-3xl whitespace-pre-line"
                translate="no"
                aria-hidden="true"
              >
                check_circle
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 whitespace-pre-line">
              Başvurunuz Alındı
            </h3>
            <p className="font-body-md text-body-md text-text-muted whitespace-pre-line">
              Kayıt başvurunuz başarıyla alınmıştır.
            </p>
          </div>
        )
      ) : (
        <form
          onSubmit={handleSubmit}
          className={
            isStyledForm ? "p-6 md:p-10 space-y-10 text-left" : "space-y-8"
          }
        >
          {/* Honeypot field - invisible to real users but bots will fill it */}
          <input
            type="text"
            name="honey_pot_email_verify"
            value={botValue}
            onChange={(e) => setBotValue(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          {defaultInputs.length === 0 ? (
            <div
              className={`p-6 ${block.styles?.textAlign ? "" : "text-center"} text-text-muted border border-dashed border-border-subtle rounded-lg`}
            >
              Lütfen yönetim panelinden form alanlarını (inputlar) ekleyiniz.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 whitespace-pre-line">
              {defaultInputs.map((input: any, i: number) => {
                const inputKey = input.id || input.name || `inp_${i}`;
                const colSpan =
                  input.type === "section_title" ||
                  input.type === "textarea" ||
                  input.type === "checkbox" ||
                  input.type === "radio" ||
                  input.fullWidth
                    ? "md:col-span-2"
                    : "";

                if (input.type === "section_title") {
                  if (isStyledForm) {
                    return (
                      <div
                        key={inputKey}
                        className={`flex items-center gap-3 mb-6 border-b border-border-subtle pb-2 mt-4 first:mt-0 ${colSpan}`}
                      >
                        {input.icon && (
                          <IconPreview
                            data={input.icon}
                            className="text-primary whitespace-pre-line"
                           style={getIconStyle(input, block)} />
                        )}
                        <h2 className="font-label-md text-label-md text-text-main uppercase tracking-wider whitespace-pre-line">
                          {input.label}
                        </h2>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={inputKey}
                      className={`flex items-center gap-2 border-b border-border-subtle pb-3 mt-4 first:mt-0 ${colSpan}`}
                    >
                      {input.icon && (
                        <IconPreview
                          data={input.icon}
                          className="text-primary whitespace-pre-line"
                         style={getIconStyle(input, block)} />
                      )}
                      <h2 className="font-headline-md text-headline-md text-on-surface whitespace-pre-line">
                        {input.label}
                      </h2>
                    </div>
                  );
                }

                if (input.type === "checkbox") {
                  return (
                    <div
                      key={inputKey}
                      className={`pt-2 border-t border-border-subtle ${colSpan}`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer group whitespace-pre-line">
                        <div className="relative mt-1 whitespace-pre-line">
                          <input
                            type="checkbox"
                            required={input.required}
                            checked={!!formData[input.name]}
                            onChange={(e) =>
                              handleChange(input.name, e.target.checked)
                            }
                            className="peer h-5 w-5 rounded border-border-subtle text-primary focus:ring-primary/20 transition-all cursor-pointer whitespace-pre-line"
                          />
                        </div>
                        <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors whitespace-pre-line">
                          <TextWithKvkkLink text={input.label} />
                        </span>
                      </label>
                    </div>
                  );
                }

                if (input.type === "radio") {
                  const opts = (input.options || "")
                    .split(",")
                    .map((o: string) => o.trim());
                  return (
                    <div key={inputKey} className={`space-y-2 ${colSpan}`}>
                      <label className="font-label-md text-label-md text-on-surface-variant block whitespace-pre-line">
                        {input.label}
                      </label>
                      <div className="space-y-2 whitespace-pre-line">
                        {opts.map((opt: string, optIdx: number) => (
                          <label
                            key={`${inputKey}_opt_${optIdx}`}
                            className="flex items-center gap-2 cursor-pointer whitespace-pre-line"
                          >
                            <input
                              type="radio"
                              name={input.name}
                              value={opt}
                              required={input.required}
                              checked={formData[input.name] === opt}
                              onChange={(e) =>
                                handleChange(input.name, e.target.value)
                              }
                              className="text-primary focus:ring-primary/20 whitespace-pre-line"
                            />
                            <span className="font-body-md text-body-md text-on-surface whitespace-pre-line">
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (input.type === "textarea") {
                  return (
                    <div key={inputKey} className={`space-y-2 ${colSpan}`}>
                      <label className="font-label-md text-label-md text-on-surface-variant block whitespace-pre-line">
                        {input.label}
                      </label>
                      <textarea
                        required={input.required}
                        rows={4}
                        value={formData[input.name] || ""}
                        onChange={(e) =>
                          handleChange(input.name, e.target.value)
                        }
                        className="w-full px-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none whitespace-pre-line"
                        placeholder={input.placeholder || ""}
                      />
                    </div>
                  );
                }

                if (input.type === "select") {
                  let opts = (input.options || "")
                    .split(",")
                    .map((o: string) => o.trim());

                  // Auto-populate career form positions if available
                  if (
                    type === "career_application" &&
                    input.name === "position" &&
                    block.items &&
                    block.items.length > 0
                  ) {
                    opts = block.items.map(
                      (pos: any) => pos.title || pos.val || "Pozisyon",
                    );
                    opts.push("Diğer / Genel Başvuru");
                  }

                  // Bursluluk Sınavı 8. Sınıf Filtresi (Ümitköy ve Oran kampüslerinde 8. sınıf gizlenir)
                  if (
                    (type === "bursluluk_sinavi" ||
                      type === "scholarship_form") &&
                    (input.name === "grade" ||
                      input.name === "studentClass" ||
                      input.name === "grade_level")
                  ) {
                    const selectedCampus = String(
                      formData.campus ||
                        formData.campus_preference ||
                        formData.campus_select ||
                        "",
                    ).toLowerCase();
                    if (
                      selectedCampus.includes("ümitköy") ||
                      selectedCampus.includes("umitkoy") ||
                      selectedCampus.includes("oran")
                    ) {
                      opts = opts.filter((opt: string) => !opt.includes("8."));

                      // Eğer şu anda seçili olan değer '8. Sınıf' ise, değeri sıfırla
                      if (String(formData[input.name]).includes("8.")) {
                        setTimeout(() => handleChange(input.name, ""), 0);
                      }
                    }
                  }

                  const isHighSchoolSelected = type === "pre_registration_form" && typeof formData.grade === "string" && (formData.grade.includes("Anadolu Lisesi") || formData.grade.includes("Fen Lisesi"));
                  const isCampusField = input.name === "campus";
                  const shouldDisableCampus = isHighSchoolSelected && isCampusField;

                  return (
                    <div
                      key={inputKey}
                      className={
                        isStyledForm
                          ? `space-y-1 ${colSpan}`
                          : `space-y-2 ${colSpan}`
                      }
                    >
                      <label
                        className={
                          isStyledForm
                            ? "font-label-sm text-label-sm text-text-muted block"
                            : "font-label-md text-label-md text-on-surface-variant block"
                        }
                      >
                        {input.label}
                      </label>
                      <select
                        required={input.required}
                        disabled={shouldDisableCampus}
                        value={formData[input.name] || ""}
                        onChange={(e) =>
                          handleChange(input.name, e.target.value)
                        }
                        className={
                          isStyledForm
                            ? `w-full px-4 py-3 rounded-lg border border-border-subtle bg-surface-background text-text-main font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat ${shouldDisableCampus ? 'opacity-60 cursor-not-allowed !bg-slate-100' : ''}`
                            : `w-full px-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat ${shouldDisableCampus ? 'opacity-60 cursor-not-allowed !bg-slate-100' : ''}`
                        }
                      >
                        <option disabled value="">
                          {input.placeholder || "Seçiniz"}
                        </option>
                        {opts.map((opt: string, optIdx: number) => (
                          <option key={`${inputKey}_opt_${optIdx}`} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {shouldDisableCampus && (
                        <p className="text-xs text-blue-600 mt-1">Lise seviyesi eğitimimiz sadece Eryaman kampüsümüzde mevcuttur.</p>
                      )}
                    </div>
                  );
                }

                if (input.type === "file") {
                  return (
                    <div
                      key={inputKey}
                      className={
                        isStyledForm
                          ? `space-y-1 ${colSpan}`
                          : `space-y-2 ${colSpan}`
                      }
                    >
                      <label
                        className={
                          isStyledForm
                            ? "font-label-sm text-label-sm text-text-muted block"
                            : "font-label-md text-label-md text-on-surface-variant block"
                        }
                      >
                        {input.label}
                      </label>
                      <input
                        type="file"
                        required={input.required}
                        onChange={(e) =>
                          handleChange(
                            input.name,
                            e.target.files ? e.target.files[0] : null,
                          )
                        }
                        className={
                          isStyledForm
                            ? "w-full px-4 py-2.5 rounded-lg border border-border-subtle bg-surface-background text-text-main font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            : "w-full px-4 py-2.5 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        }
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={inputKey}
                    className={
                      isStyledForm
                        ? `space-y-1 ${colSpan}`
                        : `space-y-2 ${colSpan}`
                    }
                  >
                    <label
                      className={
                        isStyledForm
                          ? "font-label-sm text-label-sm text-text-muted block"
                          : "font-label-md text-label-md text-on-surface-variant block"
                      }
                    >
                      {input.label}
                    </label>
                    <input
                      type={input.type === 'date' ? (formData[input.name] ? 'date' : 'text') : (input.type || "text")}
                      onFocus={input.type === 'date' ? (e) => e.target.type = 'date' : undefined}
                      onBlur={input.type === 'date' ? (e) => !e.target.value && (e.target.type = 'text') : undefined}
                      required={input.required}
                      value={formData[input.name] || ""}
                      onChange={(e) => handleChange(input.name, e.target.value)}
                      className={
                        isStyledForm
                          ? "w-full px-4 py-3 rounded-lg border border-border-subtle bg-surface-background text-text-main font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                          : "w-full px-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      }
                      placeholder={input.type === 'date' ? "gg.aa.yyyy" : (input.placeholder || "")}
                    />
                  </div>
                );
              })}

              {type === "club_registration_form" &&
                defaultClubs &&
                defaultClubs.length > 0 && (
                  <div className="md:col-span-2 space-y-6 mt-0 whitespace-pre-line">
                    <div className="flex items-center gap-2 border-b border-border-subtle pb-3 whitespace-pre-line">
                      <span
                        className="material-symbols-outlined text-primary whitespace-pre-line"
                        translate="no"
                        aria-hidden="true"
                      >
                        explore
                      </span>
                      <h2 className="font-headline-md text-headline-md text-on-surface whitespace-pre-line">
                        Kulüp Seçimi
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 whitespace-pre-line">
                      {defaultClubs.map((clubOpt: any, clubIdx: number) => {
                        const isSelected = formData.club === clubOpt.label;
                        const clubId = clubOpt.id || `club_${clubIdx}`;
                        const iconVal = clubOpt.icon || "explore";
                        const isMaterialIcon =
                          typeof iconVal === "string" &&
                          iconVal === iconVal.toLowerCase();

                        return (
                          <div
                            key={clubId}
                            className="relative whitespace-pre-line"
                          >
                            <input
                              type="radio"
                              name="club"
                              id={`club_${clubId}`}
                              value={clubOpt.label}
                              required
                              checked={isSelected}
                              onChange={(e) =>
                                handleChange("club", e.target.value)
                              }
                              className="peer hidden whitespace-pre-line"
                            />
                            <label
                              htmlFor={`club_${clubId}`}
                              className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all duration-200 group h-full ${block.styles?.textAlign ? "" : "text-center"} relative overflow-hidden ${
                                isSelected
                                  ? "bg-[#002147] border-[#002147] text-white shadow-md ring-2 ring-[#002147]/30 scale-[1.02]"
                                  : "bg-white border-border-subtle text-on-surface hover:border-blue-300 hover:bg-slate-50"
                              }`}
                            >
                              <div className="mb-2 whitespace-pre-line">
                                {isMaterialIcon ? (
                                  <span
                                    className={`material-symbols-outlined text-3xl transition-colors ${isSelected ? "text-white" : "text-text-muted group-hover:text-primary"}`}
                                    translate="no"
                                    aria-hidden="true"
                                  >
                                    {iconVal}
                                  </span>
                                ) : (
                                  <IconPreview
                                    data={iconVal}
                                    className={`w-8 h-8 transition-colors ${isSelected ? "text-white" : "text-text-muted group-hover:text-primary"}`}
                                   style={getIconStyle(null, block)} />
                                )}
                              </div>
                              <span
                                className={`font-bold text-xs sm:text-sm transition-colors ${isSelected ? "text-white" : "text-on-surface"}`}
                              >
                                {clubOpt.label}
                              </span>
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-white text-[10px] whitespace-pre-line">
                                  ✓
                                </div>
                              )}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          )}

          <div className="pt-6 whitespace-pre-line">
            <button
              type="submit"
              disabled={submitting}
              className={
                isStyledForm
                  ? "w-full bg-primary hover:bg-[#002147] text-white font-label-md text-label-md py-4 rounded-lg shadow-sm transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100"
                  : "w-full py-4 bg-primary text-white font-bold text-label-md rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
              }
            >
              {submitting
                ? isStyledForm
                  ? "Gönderiliyor..."
                  : "İşleniyor..."
                : isStyledForm
                  ? "Başvuruyu Tamamla"
                  : "Kaydı Tamamla"}
              {!submitting && (
                <span
                  className="material-symbols-outlined whitespace-pre-line"
                  translate="no"
                  aria-hidden="true"
                >
                  send
                </span>
              )}
              {submitting && (
                <svg
                  className="animate-spin h-5 w-5 text-white whitespace-pre-line"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25 whitespace-pre-line"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75 whitespace-pre-line"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </button>
            {isStyledForm && (
              <p
                className={`mt-4 ${block.styles?.textAlign ? "" : "text-center"} font-caption text-caption text-text-muted px-4`}
              >
                Gönder butonuna basarak kişisel verilerinizin işlenmesine dair
                aydınlatma metnini okuduğunuzu ve kabul ettiğinizi beyan etmiş
                olursunuz.
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

const ClubRegistrationFormBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  return (
    <section
      key={index}
      className="py-section-gap w-full flex items-center justify-center p-4 md:p-8 whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div className="w-full max-w-[640px] animate-in fade-in slide-in-from-bottom-4 duration-700 whitespace-pre-line">
        <div className={`mb-8 ${block.styles?.textAlign ? "" : "text-center"}`}>
          <h1 className="font-display-lg text-display-lg text-primary mb-2 whitespace-pre-line">
            {block.title || "Dost Koleji"}
          </h1>
          <p className="font-body-lg text-body-lg text-text-muted whitespace-pre-line">
            {block.subtitle || "Öğrenci Kulüp Kayıt Portalı"}
          </p>
        </div>
        <DynamicFormBuilder getIconStyle={getIconStyle} block={block} type="club_registration_form" />
      </div>
    </section>
  );
};
const PreRegistrationFormBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  const submitForm = async (formData: any) => {
    if (block.webhookUrl) {
      try {
        await fetch(block.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.error("Webhook error", err);
      }
    }
    await addDoc(collection(db, "forms"), {
      type: "pre_registration_form",
      createdAt: Date.now(),
      data: formData,
    });
  };

  return (
    <section
      key={index}
      className="py-section-gap w-full flex items-center justify-center p-4 md:p-8 whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div
        className="w-full max-w-4xl bg-surface-card rounded-lg shadow-sm border border-border-subtle overflow-hidden relative whitespace-pre-line"
        style={
          block.styles?.cardBgColor
            ? { backgroundColor: block.styles.cardBgColor }
            : {}
        }
      >
        {/* Header */}
        <div
          className={`p-8 md:p-12 ${block.styles?.textAlign ? "" : "text-center"} relative overflow-hidden`}
          style={{ backgroundColor: block.styles?.headerBgColor || "#002147" }}
        >
          <div className="relative z-10 whitespace-pre-line">
            <h1
              className="font-headline-md text-headline-md text-white mb-2 uppercase tracking-wide whitespace-pre-line"
              style={getTitleStyle(block)}
            >
              {block.title || "ÖĞRENCİ ÖN KAYIT FORMU"}
            </h1>
            <p
              className="font-body-md text-body-md text-blue-200 whitespace-pre-line"
              style={getSubtitleStyle(block)}
            >
              {block.subtitle || "Lütfen Formu Eksiksiz Doldurunuz."}
            </p>
            <div className="mt-6 flex justify-center whitespace-pre-line">
              <div
                className="h-1 w-20 bg-primary rounded-full whitespace-pre-line"
                style={
                  block.styles?.titlePart1Color
                    ? { backgroundColor: block.styles.titlePart1Color }
                    : {}
                }
              ></div>
            </div>
          </div>
        </div>

        <DynamicFormBuilder getIconStyle={getIconStyle}
          block={block}
          type="pre_registration_form"
          submitForm={submitForm}
        />

        {/* Aesthetic Footer Graphic */}
        <div className="h-2 w-full flex whitespace-pre-line">
          <div className="h-full flex-1 bg-primary whitespace-pre-line"></div>
          <div className="h-full flex-1 bg-[#002147] whitespace-pre-line"></div>
          <div className="h-full flex-1 bg-secondary-fixed-dim whitespace-pre-line"></div>
          <div className="h-full flex-1 bg-primary whitespace-pre-line"></div>
        </div>
      </div>
    </section>
  );
};


const TuitionFeesHeroBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
}: any) => {
  const heroBg =
    block.image ||
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80";

  return (
    <section
      key={index}
      className="relative h-[550px] md:h-[600px] flex items-center overflow-hidden whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div className="absolute inset-0 z-0 whitespace-pre-line">
        <div className="absolute inset-0 bg-gradient-to-r from-[#002147]/90 via-[#002147]/70 to-[#002147]/40 z-10 whitespace-pre-line"></div>
        <div
          className="w-full h-full bg-cover bg-center whitespace-pre-line"
          style={{ backgroundImage: `url('${heroBg}')` }}
        />
      </div>
      <div
        className={`relative z-20 ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop w-full`}
      >
        <div className={getHeroInnerClass(block, "max-w-2xl text-white")}>
          {block.badge && (
            <span className="inline-block px-4 py-1.5 bg-[#D4AF37] text-[#002147] font-bold text-caption rounded-full mb-6 tracking-widest uppercase shadow-md whitespace-pre-line">
              {block.badge}
            </span>
          )}
          <h1
            className="font-display-lg text-3xl sm:text-4xl md:text-display-lg mb-6 leading-tight font-extrabold whitespace-pre-line"
            style={getTitleStyle(block)}
          >
            {block.title || "2026-2027 Eğitim-Öğretim Yılı Ücretleri"}
          </h1>
          <p
            className="font-body-lg text-base md:text-body-lg mb-8 opacity-90 leading-relaxed whitespace-pre-line"
            style={getSubtitleStyle(block)}
          >
            {block.subtitle ||
              "Dost Koleji olarak, öğrencilerimize sunduğumuz kaliteli eğitim ve olanakların karşılığında belirlenen akademik yıl ücretlendirme detaylarımızı aşağıda inceleyebilirsiniz."}
          </p>
        </div>
      </div>
    </section>
  );
};

const BurslulukHeroBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  const stats = block.stats || [
    { value: "16-17 Mart", label: "Sınav Tarihi" },
    { value: "4-11. Sınıflar", label: "Katılımcı Seviyesi" },
    { value: "%100'e Varan", label: "Burs İmkanı" },
  ];

  const heroBg =
    block.image ||
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80";

  return (
    <section
      key={index}
      className="relative h-[550px] md:h-[600px] flex items-center overflow-hidden whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div className="absolute inset-0 z-0 whitespace-pre-line">
        <div className="absolute inset-0 bg-gradient-to-r from-[#002147]/90 via-[#002147]/70 to-[#002147]/40 z-10 whitespace-pre-line"></div>
        <div
          className="w-full h-full bg-cover bg-center whitespace-pre-line"
          style={{ backgroundImage: `url('${heroBg}')` }}
        />
      </div>
      <div
        className={`relative z-20 ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop w-full`}
      >
        <div className={getHeroInnerClass(block, "max-w-2xl text-white")}>
          <span className="inline-block px-4 py-1.5 bg-[#D4AF37] text-[#002147] font-bold text-caption rounded-full mb-6 tracking-widest uppercase shadow-md whitespace-pre-line">
            {block.badge || "2026-2027 EĞİTİM YILI"}
          </span>
          <h1
            className="font-display-lg text-3xl sm:text-4xl md:text-display-lg mb-6 leading-tight font-extrabold whitespace-pre-line"
            style={getTitleStyle(block)}
          >
            {block.title || "Akademik Başarıya Giden Yolunuz"}
          </h1>
          <p
            className="font-body-lg text-base md:text-body-lg mb-8 opacity-90 leading-relaxed whitespace-pre-line"
            style={getSubtitleStyle(block)}
          >
            {block.subtitle ||
              "Geleceğin liderlerini yetiştiren Dost Koleji'nde yerinizi ayırtın. Bursluluk sınavımıza katılarak %100'e varan eğitim desteği fırsatlarından yararlanın."}
          </p>
          <div className="mt-8 flex flex-wrap gap-8 border-l-2 border-[#D4AF37] pl-6 whitespace-pre-line">
            {stats.map((stat: any, idx: number) => (
              <div key={idx}>
                <p className="text-[#D4AF37] font-bold text-xl md:text-2xl whitespace-pre-line">
                  {stat.value}
                </p>
                <p className="text-sm opacity-80 whitespace-pre-line">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const BurslulukExamFormBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  const [burslulukActive, setBurslulukActive] = useState<boolean>(true);
  const [burslulukInactiveMessage, setBurslulukInactiveMessage] =
    useState<string>("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.burslulukActive !== undefined) {
            let isActive = data.burslulukActive;

            if (isActive) {
              const now = new Date();
              if (
                data.burslulukStartDate &&
                new Date(data.burslulukStartDate) > now
              ) {
                isActive = false;
              }
              if (
                data.burslulukEndDate &&
                new Date(data.burslulukEndDate) < now
              ) {
                isActive = false;
              }
            }

            setBurslulukActive(isActive);
            setBurslulukInactiveMessage(data.burslulukInactiveMessage || "");
          }
        }
      } catch (e) {
        console.error("Error fetching bursluluk settings", e);
      }
    };
    fetchSettings();
  }, []);

  const submitForm = async (formData: any) => {
    if (block.webhookUrl) {
      try {
        await fetch(block.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.error("Webhook error", err);
      }
    }
    const formPayload = {
      type: "bursluluk_basvuru_formu",
      formName: "Bursluluk Sınav Başvurusu",
      createdAt: Date.now(),
      data: formData,
    };

    const docRef = await addDoc(collection(db, "forms"), formPayload);

    try {
      const localBackup = JSON.parse(
        localStorage.getItem("dost_scholarship_forms_backup") || "[]",
      );
      localBackup.unshift({ id: docRef.id, ...formPayload });
      localStorage.setItem(
        "dost_scholarship_forms_backup",
        JSON.stringify(localBackup),
      );
    } catch (err) {
      console.error("Local backup error", err);
    }

    return docRef.id;
  };

  return (
    <section
      key={index}
      id="basvuru-formu"
      className="py-section-gap w-full flex items-center justify-center p-4 md:p-8 whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div
        className="w-full max-w-4xl bg-surface-card rounded-xl shadow-sm border border-border-subtle overflow-hidden relative whitespace-pre-line"
        style={
          block.styles?.cardBgColor
            ? { backgroundColor: block.styles.cardBgColor }
            : {}
        }
      >
        {/* Header */}
        <div
          className={`p-8 md:p-12 ${block.styles?.textAlign ? "" : "text-center"} relative overflow-hidden`}
          style={{ backgroundColor: block.styles?.headerBgColor || "#002147" }}
        >
          <div className="relative z-10 whitespace-pre-line">
            <h1
              className="font-headline-md text-headline-md text-white mb-2 uppercase tracking-wide whitespace-pre-line"
              style={getTitleStyle(block)}
            >
              {block.title || "BURSLULUK SINAVI BAŞVURU FORMU"}
            </h1>
            <p
              className="font-body-md text-body-md text-blue-200 whitespace-pre-line"
              style={getSubtitleStyle(block)}
            >
              {block.subtitle || "Lütfen Formu Eksiksiz Doldurunuz."}
            </p>
            <div className="mt-6 flex justify-center whitespace-pre-line">
              <div
                className="h-1 w-20 bg-primary rounded-full whitespace-pre-line"
                style={
                  block.styles?.titlePart1Color
                    ? { backgroundColor: block.styles.titlePart1Color }
                    : {}
                }
              ></div>
            </div>
          </div>
        </div>

        {burslulukActive ? (
          <DynamicFormBuilder getIconStyle={getIconStyle}
            block={block}
            type="bursluluk_exam_form"
            submitForm={submitForm}
          />
        ) : (
          <div className="p-8 md:p-12 whitespace-pre-line">
            <div
              className={`${block.styles?.textAlign ? "" : "text-center"} bg-blue-50 border border-blue-100 p-8 rounded-xl`}
            >
              <span
                className="material-symbols-outlined text-blue-500 text-5xl mb-4 whitespace-pre-line"
                translate="no"
                aria-hidden="true"
              >
                info
              </span>
              <p className={`text-lg text-slate-700 whitespace-pre-line leading-relaxed max-w-2xl ${getAlignClass(block)} whitespace-pre-line`}>
                {burslulukInactiveMessage ||
                  "Değerli Velimiz,\n2026-2027 Eğitim-Öğretim yılı Bursluluk ve Kabul Sınavı başvuru sürecimiz şu an için aktif değildir. Yeni dönem sınav takvimimiz ve başvuru tarihlerimiz belirlendiğinde web sitemiz ve sosyal medya hesaplarımız üzerinden duyurulacaktır. Kurumumuza gösterdiğiniz değerli ilgi için teşekkür ederiz."}
              </p>
            </div>
          </div>
        )}

        {/* Aesthetic Footer Graphic */}
        <div className="h-2 w-full flex whitespace-pre-line">
          <div className="h-full flex-1 bg-primary whitespace-pre-line"></div>
          <div className="h-full flex-1 bg-[#002147] whitespace-pre-line"></div>
          <div className="h-full flex-1 bg-secondary-fixed-dim whitespace-pre-line"></div>
          <div className="h-full flex-1 bg-primary whitespace-pre-line"></div>
        </div>
      </div>
    </section>
  );
};

const BurslulukInfoCardsBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  const items = block.items || [
    {
      icon: "history_edu",
      title: "Sınav Kuralları",
      rules: [
        "Sınav saatinden 30 dk önce okulda olunmalıdır.",
        "Kalem, silgi ve su öğrenci tarafından getirilir.",
      ],
    },
    {
      icon: "content_paste",
      title: "Gerekli Belgeler",
      rules: [
        "Nüfus Cüzdanı veya Kimlik Kartı aslı.",
        "Sistemden alınan Sınav Giriş Belgesi.",
      ],
    },
    {
      icon: "insights",
      title: "Puanlama",
      rules: [
        "4 yanlış 1 doğruyu götürmektedir.",
        "Sonuçlar sınavdan 1 hafta sonra açıklanır.",
      ],
    },
  ];

  return (
    <section
      key={index}
      id="bilgilendirme"
      className="py-section-gap bg-white whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div
        className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
      >
        {block.title && (
          <div
            className={`${block.styles?.textAlign ? "" : "text-center"} mb-12`}
          >
            <h2
              className="font-headline-xl text-2xl md:text-headline-xl text-[#002147] mb-4 font-bold whitespace-pre-line"
              style={getTitleStyle(block)}
            >
              {block.title}
            </h2>
            {block.subtitle && (
              <p
                className={`text-slate-500 max-w-2xl ${getAlignClass(block, "subtitle")} text-sm md:text-base whitespace-pre-line`}
                style={getSubtitleStyle(block)}
              >
                {block.subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 whitespace-pre-line">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-[#f3f2fd] border border-[#e2e8f0] hover:border-[#1d4eca]/30 transition-all shadow-sm hover:shadow-md whitespace-pre-line"
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform whitespace-pre-line">
                <IconPreview
                  data={item.icon || "info"}
                  className="text-[#1d4eca] text-3xl whitespace-pre-line"
                 style={getIconStyle(item, block)} />
              </div>
              <h4 className="text-xl font-bold text-[#002147] mb-4 whitespace-pre-line">
                {item.title}
              </h4>
              <ul className="space-y-3 text-[#434654] whitespace-pre-line">
                {(item.rules || item.desc || []).map(
                  (rule: string, rIdx: number) => (
                    <li
                      key={rIdx}
                      className="flex items-start gap-2 text-sm leading-relaxed whitespace-pre-line"
                    >
                      <span
                        className="material-symbols-outlined text-[#1d4eca] text-base mt-0.5 shrink-0 whitespace-pre-line"
                        translate="no"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      <span>{rule}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BurslulukResultQueryBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  const [tcQuery, setTcQuery] = useState("");
  const [queryModal, setQueryModal] = useState(false);

  return (
    <section
      key={index}
      className="py-section-gap bg-[#e2e1ec]/20 whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div
        className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
      >
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-[#002147] rounded-[40px] overflow-hidden shadow-xl whitespace-pre-line">
          <div className="flex-1 p-8 md:p-12 text-white whitespace-pre-line">
            <h2
              className="font-headline-xl text-2xl md:text-headline-xl mb-4 md:mb-6 font-bold whitespace-pre-line"
              style={getTitleStyle(block)}
            >
              {block.title || "Sınav Sonuç Sorgulama"}
            </h2>
            <p
              className="text-base md:text-lg opacity-80 mb-8 whitespace-pre-line"
              style={getSubtitleStyle(block)}
            >
              {block.subtitle ||
                "Aşağıdaki butona tıklayarak sınav sonuç sorgulama sayfasına ulaşabilirsiniz."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md whitespace-pre-line">
              <button
                type="button"
                onClick={() => setQueryModal(true)}
                className="w-full bg-[#D4AF37] text-[#002147] font-bold py-4 px-6 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg text-sm md:text-base uppercase tracking-wider cursor-pointer whitespace-pre-line"
              >
                <span
                  className="material-symbols-outlined whitespace-pre-line"
                  translate="no"
                  aria-hidden="true"
                >
                  search
                </span>
                {block.buttonText || "SINAV SONUCUNU ÖĞREN"}
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3 h-[280px] md:h-[360px] relative shrink-0 whitespace-pre-line">
            <div
              className="w-full h-full bg-cover bg-center whitespace-pre-line"
              style={{
                backgroundImage: `url('${block.image || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80"}')`,
              }}
            />
          </div>
        </div>
      </div>

      {queryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 whitespace-pre-line">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative whitespace-pre-line">
            <button
              type="button"
              onClick={() => setQueryModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer whitespace-pre-line"
            >
              <span
                className="material-symbols-outlined whitespace-pre-line"
                translate="no"
                aria-hidden="true"
              >
                close
              </span>
            </button>
            <h3 className="text-2xl font-bold text-[#002147] mb-2 whitespace-pre-line">
              Sınav Sonuç Sorgulama
            </h3>
            <p className="text-slate-500 text-sm mb-6 whitespace-pre-line">
              Lütfen öğrencinin T.C. Kimlik Numarasını giriniz.
            </p>
            <input
              type="text"
              maxLength={11}
              value={tcQuery}
              onChange={(e) => setTcQuery(e.target.value)}
              placeholder="11 haneli T.C. Kimlik No"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-[#1d4eca] text-sm whitespace-pre-line"
            />
            <button
              type="button"
              onClick={() => {
                if (tcQuery.length !== 11) {
                  alert("Lütfen 11 haneli T.C. Kimlik No giriniz.");
                  return;
                }
                alert(
                  "Sınav sonuçları açıklandığında bu alandan ve SMS ile bilgilendirme yapılacaktır.",
                );
                setQueryModal(false);
              }}
              className="w-full bg-[#1d4eca] text-white py-3.5 rounded-xl font-bold hover:bg-[#1d4eca]/90 transition-all text-sm cursor-pointer whitespace-pre-line"
            >
              Sorgula
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const BurslulukConfirmationBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  const [submission, setSubmission] = useState<any>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      const docRef = doc(db, "forms", id);
      getDoc(docRef)
        .then((snap) => {
          if (snap.exists()) {
            setSubmission(snap.data());
          }
        })
        .catch((err) => {
          console.error("Error fetching submission:", err);
        });
    }
  }, []);

  const subData = submission?.data || submission || {};

  const studentName =
    subData.studentName ||
    subData.student_fullname ||
    subData.student_name ||
    "AHMET YILMAZ";
  const studentTc =
    subData.studentTc || subData.student_tc || subData.tc || "12345678901";
  const rawGrade =
    subData.grade || subData.grade_level || subData.class || "8. Sınıf";
  const formattedGrade = String(rawGrade).includes("Sınıf")
    ? rawGrade
    : `${rawGrade}. Sınıf`;

  const campusVal = String(
    subData.campus ||
      subData.campus_preference ||
      subData.campus_select ||
      "eryaman",
  ).toLowerCase();

  let campusName = "Eryaman Kampüsü - Ana Bina";
  if (campusVal.includes("oran")) campusName = "Oran Kampüsü - Ana Bina";
  else if (campusVal.includes("umitkoy") || campusVal.includes("ümitköy"))
    campusName = "Ümitköy Kampüsü - Ana Bina";
  else if (campusVal.includes("eryaman"))
    campusName = "Eryaman Kampüsü - Ana Bina";
  else if (subData.campus) campusName = subData.campus;

  const sessionVal = String(
    subData.examSession || subData.exam_session || "session_1",
  ).toLowerCase();
  let examTime = "10:00";
  if (
    sessionVal.includes("14") ||
    sessionVal.includes("2") ||
    sessionVal.includes("14:00")
  ) {
    examTime = "14:00";
  } else if (subData.examSession) {
    examTime = subData.examSession;
  }

  const examDate = block.examDate || "16 Mart 2026";
  const docNo = submission
    ? `2026-${String(submission.createdAt || Date.now()).slice(-4)}`
    : block.documentNo || "2026-8842";

  const formattedDocDate = submission?.createdAt
    ? new Date(submission.createdAt).toLocaleDateString("tr-TR")
    : new Date().toLocaleDateString("tr-TR");

  const campusAddresses: any = block.campusAddresses || {
    eryaman:
      "Şehit Osman Avcı Mh. Malazgirt 1071 Cad. No:20 Eryaman / Etimesgut / Ankara",
    oran: "Oran Mh. Rafet Canıtez Cd. No:8 Çankaya / Ankara",
    umitkoy: "Ümitköy Mh. 2432. Cd. No:18 Çankaya / Ankara",
  };

  let currentCampusAddress = campusAddresses.eryaman;
  if (campusVal.includes("oran")) currentCampusAddress = campusAddresses.oran;
  else if (campusVal.includes("umitkoy") || campusVal.includes("ümitköy"))
    currentCampusAddress = campusAddresses.umitkoy;

  const handlePrint = () => {
    window.print();
  };

  const rulesList =
    block.rules && Array.isArray(block.rules)
      ? block.rules.map((r: any) =>
          typeof r === "string" ? r : r.rule || r.text || "",
        )
      : [
          "Sınav başlamadan 30 dk. önce salonda hazır bulununuz.",
          "İlk 30 dk. ve son 15 dk. salondan çıkmak yasaktır.",
          "Optik formda kodlamaları kurşun kalemle yapınız.",
        ];

  const docsList =
    block.requiredDocuments && Array.isArray(block.requiredDocuments)
      ? block.requiredDocuments.map((d: any) =>
          typeof d === "string" ? d : d.docName || d.text || "",
        )
      : ["Nüfus Cüzdanı veya Kimlik Kartı", "Sınav Giriş Belgesi"];

  return (
    <section
      key={index}
      className="py-12 md:py-16 bg-surface-background min-h-screen whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-exam-document, #printable-exam-document * {
            visibility: visible !important;
          }
          #printable-exam-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className={`max-w-4xl ${getAlignClass(block)} px-4 sm:px-6 whitespace-pre-line`}>
        {/* Success Header */}
        <div
          className={`${block.styles?.textAlign ? "" : "text-center"} mb-10 no-print`}
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner whitespace-pre-line">
            <span
              className="material-symbols-outlined text-5xl whitespace-pre-line"
              translate="no"
              aria-hidden="true"
            >
              {block.successIcon || "check_circle"}
            </span>
          </div>
          <h1
            className="font-headline-xl text-2xl md:text-4xl text-[#002147] mb-3 font-bold whitespace-pre-line"
            style={getTitleStyle(block)}
          >
            {block.title || "Başvurunuz Başarıyla Alındı!"}
          </h1>
          <p
            className={`text-slate-600 max-w-2xl ${getAlignClass(block, "subtitle")} text-sm md:text-base leading-relaxed whitespace-pre-line`}
            style={getSubtitleStyle(block)}
          >
            {block.subtitle ||
              "Sınav giriş belgeniz aşağıda oluşturulmuştur. Lütfen sınav günü yanınızda bulundurunuz. Belgenizi indirip yazdırarak sınava getirmeyi unutmayınız."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 no-print whitespace-pre-line">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#002147] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#002147]/90 transition-all shadow-md active:scale-95 cursor-pointer text-sm whitespace-pre-line"
          >
            <span
              className="material-symbols-outlined text-xl whitespace-pre-line"
              translate="no"
              aria-hidden="true"
            >
              download
            </span>{" "}
            İndir (PDF)
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white text-[#002147] border-2 border-[#002147] px-6 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer text-sm whitespace-pre-line"
          >
            <span
              className="material-symbols-outlined text-xl whitespace-pre-line"
              translate="no"
              aria-hidden="true"
            >
              print
            </span>{" "}
            Yazdır
          </button>
        </div>

        {/* PDF Preview Container (A4 Mockup Card) */}
        <div
          id="printable-exam-document"
          className="bg-white shadow-2xl rounded-2xl mx-auto overflow-hidden border border-slate-200 p-6 md:p-12 relative whitespace-pre-line"
          style={{
            maxWidth: "800px",
            minHeight: "550px",
            ...(block.styles?.cardBgColor
              ? { backgroundColor: block.styles.cardBgColor }
              : {}),
          }}
        >
          <div className="h-full flex flex-col whitespace-pre-line">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-[#002147] pb-6 mb-8 gap-4 whitespace-pre-line">
              <div className="flex items-center gap-4 whitespace-pre-line">
                <img
                  src={block.documentLogo || "/dost-logo-png.png"}
                  alt="Dost Koleji Logo"
                  className="h-12 w-auto object-contain whitespace-pre-line"
                  onError={(e: any) => {
                    e.target.src =
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcW18movsC69qnz9zpsbzsrJLWPy_Geo5sAAAi9nqoC0YE-bdMj0AiEUe-Z78NoFFBpFQy5UuXaMmRO0quff6khOovxlJfE1ptuTa38PqzHcJhVeJMUlPxZqHhxVw08UApxaSzgRKctOtlTu4DtjMgzPIZdZ0WMLs8KuA96cHwv2jaeSc1OpVg0rX0eqzr2iTpWL0N0C_Y9PkoQ7IeERePRqYH46NNAxWyoW03nr17RN7GXuwfevi2RYWTPiQtM4pg9fysMIgmkuk";
                  }}
                />
                <div>
                  <h3 className="font-bold text-[#002147] text-lg uppercase tracking-wider whitespace-pre-line">
                    {block.documentTitle || "Bursluluk Sınavı Giriş Belgesi"}
                  </h3>
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold whitespace-pre-line">
                    DOST KOLEJİ EĞİTİM KURUMLARI
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right border-l sm:border-l-0 border-slate-200 pl-3 sm:pl-0 whitespace-pre-line">
                <p className="text-xs font-bold text-[#002147] tracking-wide whitespace-pre-line">
                  {block.documentNoPrefix || "BELGE NO: "}
                  {docNo}
                </p>
                <p className="text-xs text-slate-500 whitespace-pre-line">
                  Tarih: {formattedDocDate}
                </p>
              </div>
            </div>

            {/* Document Body - Student & Exam Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-10 bg-slate-50/80 p-6 rounded-xl border border-slate-200/80 whitespace-pre-line">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 whitespace-pre-line">
                  Adı Soyadı
                </p>
                <p className="font-bold text-[#002147] text-lg uppercase whitespace-pre-line">
                  {studentName}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 whitespace-pre-line">
                  T.C. Kimlik No
                </p>
                <p className="font-bold text-[#002147] text-lg whitespace-pre-line">
                  {studentTc}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 whitespace-pre-line">
                  Sınıf Seviyesi
                </p>
                <p className="font-bold text-[#002147] text-lg whitespace-pre-line">
                  {formattedGrade}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 whitespace-pre-line">
                  Sınav Tarihi
                </p>
                <p className="font-bold text-[#002147] text-lg whitespace-pre-line">
                  {examDate}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 whitespace-pre-line">
                  Sınav Saati
                </p>
                <p className="font-bold text-[#002147] text-lg whitespace-pre-line">
                  {examTime}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 whitespace-pre-line">
                  Sınav Merkezi
                </p>
                <p className="font-bold text-[#002147] text-lg whitespace-pre-line">
                  {campusName}
                </p>
              </div>
            </div>

            {/* Bottom Section - Rules, Required Docs, Campus Address */}
            <div className="mt-auto border-t border-slate-200 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left whitespace-pre-line">
              <div>
                <h4 className="text-xs font-bold text-[#002147] mb-2 uppercase tracking-wider flex items-center gap-1.5 whitespace-pre-line">
                  <span
                    className="material-symbols-outlined text-sm text-primary whitespace-pre-line"
                    translate="no"
                    aria-hidden="true"
                  >
                    gavel
                  </span>
                  Sınav Kuralları
                </h4>
                <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed whitespace-pre-line">
                  {rulesList.map((rule: string, rIdx: number) => (
                    <li key={rIdx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#002147] mb-2 uppercase tracking-wider flex items-center gap-1.5 whitespace-pre-line">
                  <span
                    className="material-symbols-outlined text-sm text-primary whitespace-pre-line"
                    translate="no"
                    aria-hidden="true"
                  >
                    badge
                  </span>
                  Gerekli Belgeler
                </h4>
                <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed whitespace-pre-line">
                  {docsList.map((docItem: string, dIdx: number) => (
                    <li key={dIdx}>{docItem}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#002147] mb-2 uppercase tracking-wider flex items-center gap-1.5 whitespace-pre-line">
                  <span
                    className="material-symbols-outlined text-sm text-primary whitespace-pre-line"
                    translate="no"
                    aria-hidden="true"
                  >
                    location_on
                  </span>
                  Kampüs Adresi
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
                  {currentCampusAddress}
                </p>
              </div>
            </div>

            {/* Watermark / Footer Strip */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 whitespace-pre-line">
              <span>Dost Koleji Sınav Hizmetleri © 2026</span>
              <span className="font-mono whitespace-pre-line">
                VERIFIED OFFICIAL ENTRY TICKET
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Action Link */}
        <div
          className={`mt-10 ${block.styles?.textAlign ? "" : "text-center"} no-print`}
        >
          <a
            href="/"
            className="text-primary font-bold inline-flex items-center justify-center gap-2 hover:underline text-sm whitespace-pre-line"
          >
            <span
              className="material-symbols-outlined text-lg whitespace-pre-line"
              translate="no"
              aria-hidden="true"
            >
              home
            </span>{" "}
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </section>
  );
};

const ContactFormBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  return (
    <section
      key={index}
      className="py-section-gap bg-surface-container-low whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div
        className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
      >
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-border-subtle whitespace-pre-line">
          <div className="mb-8 whitespace-pre-line">
            <h2
              className="font-headline-xl text-headline-xl text-on-surface mb-2 whitespace-pre-line"
              style={getTitleStyle(block)}
            >
              {block.title || "Bize Ulaşın"}
            </h2>
            {block.subtitle && (
              <p
                className="font-body-md text-body-md text-text-muted whitespace-pre-line"
                style={getSubtitleStyle(block)}
              >
                {block.subtitle}
              </p>
            )}
          </div>

          <DynamicFormBuilder getIconStyle={getIconStyle} block={block} type="contact_form" />
        </div>
      </div>
    </section>
  );
};

export const DynamicBlockRenderer = ({
  blocks,
  onBlockClick,
}: {
  blocks: any[];
  onBlockClick?: (index: number, e?: React.MouseEvent) => void;
}) => {
  console.log("DynamicBlockRenderer blocks:", blocks);
  if (!blocks || !Array.isArray(blocks)) return null;

  const processedBlocks: any[] = blocks;

  const getStyle = (block: any, prefix: string) => {
    const style: any = {};
    
    // Normal properties
    style.color =
      block.styles?.[prefix + "Color"] ||
      (prefix === "container" || prefix === ""
        ? block.styles?.color
        : undefined) ||
      undefined;
      
    style.fontWeight = block.styles?.[prefix + "Weight"] || undefined;
    
    style.backgroundColor =
      block.styles?.[prefix + "BackgroundColor"] ||
      (prefix === "container" || prefix === ""
        ? block.styles?.backgroundColor
        : undefined) ||
      undefined;
      
    style.borderRadius = block.styles?.[prefix + "BorderRadius"]
      ? block.styles[prefix + "BorderRadius"] + "px"
      : undefined;
      
    style.backgroundImage =
      (prefix === "" || prefix === "container") &&
      block.styles?.backgroundImage
        ? `url(${block.styles.backgroundImage})`
        : undefined;
        
    style.backgroundSize =
      (prefix === "" || prefix === "container") &&
      block.styles?.backgroundImage
        ? "cover"
        : undefined;
        
    style.backgroundPosition =
      (prefix === "" || prefix === "container") &&
      block.styles?.backgroundImage
        ? "center"
        : undefined;

    // Helper for responsive variables
    const addResponsiveVar = (cssProp: string, jsProp: string, suffix: string, unit: string = "") => {
      let desktopVal = block.styles?.[prefix + suffix] || (prefix === "" || prefix === "container" ? block.styles?.[suffix.charAt(0).toLowerCase() + suffix.slice(1)] : undefined);
      let mobileVal = block.styles?.[prefix + "Mobile" + suffix] || (prefix === "" || prefix === "container" ? block.styles?.["mobile" + suffix] : undefined);
        
      // FIX: If it's a size property and it's 0 or 0px, treat it as undefined so it falls back to CSS classes.
      if (cssProp === 'font-size') {
         if (desktopVal === '0' || desktopVal === '0px' || desktopVal === 0) desktopVal = undefined;
         if (mobileVal === '0' || mobileVal === '0px' || mobileVal === 0) mobileVal = undefined;
      }

      if (mobileVal !== undefined && mobileVal !== "") {
        style[`--desktop-${cssProp}`] = desktopVal ? desktopVal + unit : (unit === "px" ? "0px" : "inherit");
        style[`--mobile-${cssProp}`] = mobileVal + unit;
      } else if (desktopVal !== undefined && desktopVal !== "") {
        style[jsProp] = desktopVal + unit;
      }
    };

    addResponsiveVar("text-align", "textAlign", "Align");
    addResponsiveVar("font-size", "fontSize", "Size");
    addResponsiveVar("margin-top", "marginTop", "MarginTop", "px");
    addResponsiveVar("margin-bottom", "marginBottom", "MarginBottom", "px");
    addResponsiveVar("padding-top", "paddingTop", "PaddingTop", "px");
    addResponsiveVar("padding-bottom", "paddingBottom", "PaddingBottom", "px");
    addResponsiveVar("padding-left", "paddingLeft", "PaddingLeft", "px");
    addResponsiveVar("padding-right", "paddingRight", "PaddingRight", "px");

    // Filter out undefined
    Object.keys(style).forEach(key => style[key] === undefined && delete style[key]);
    
    return style;
  };

  const getTitleStyle = (block: any) => ({
    ...getStyle(block, "title"),
    whiteSpace: "pre-line" as const,
  });
  const getSubtitleStyle = (block: any) => ({
    ...getStyle(block, "subtitle"),
    whiteSpace: "pre-line" as const,
  });
  const getDescStyle = (block: any) => ({
    ...getStyle(block, "desc"),
    whiteSpace: "pre-line" as const,
  });
  const getBadgeStyle = (block: any) => getStyle(block, "badge");
  const getButtonStyle = (block: any) => getStyle(block, "buttons");
  const getItemContainerStyle = (block: any) =>
    getStyle(block, "itemContainer");
  const getItemTitleStyle = (block: any, item?: any) => {
    const style: React.CSSProperties = {
      ...getStyle(block, "itemTitle"),
      whiteSpace: "pre-line" as const,
    };
    if (item && item.itemTitleColor) style.color = item.itemTitleColor;
    return style;
  };
  const getItemDescStyle = (block: any, item?: any) => {
    const style: React.CSSProperties = {
      ...getStyle(block, "itemDesc"),
      whiteSpace: "pre-line" as const,
    };
    if (item && item.itemDescColor) style.color = item.itemDescColor;
    return style;
  };
  const getItemButtonStyle = (block: any) => getStyle(block, "itemButton");
  const getTitlePart1Style = (block: any) => ({
    whiteSpace: "pre-line" as const,
    ...getStyle(block, "titlePart1"),
    color: block.styles?.titlePart1Color || block.styles?.titleColor || block.titlePart1Color || block.titleColor || undefined,
  });
  const getTitlePart2Style = (block: any) => ({
    whiteSpace: "pre-line" as const,
    ...getStyle(block, "titlePart2"),
    color: block.styles?.titlePart2Color || block.styles?.titleColor || block.titlePart2Color || block.titleColor || undefined,
  });

  const getValidText = (...values: any[]) => {
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

const getValidStyle = (block: any, ...keys: string[]) => {
  for (const key of keys) {
    const s = getStyle(block, key);
    if (Object.keys(s).length > 0) return s;
  }
  return {};
};

const getIndividualButtonStyle = (btn: any) => {
    const style: any = {};

    if (btn.bgColor) style.backgroundColor = btn.bgColor;
    if (btn.textColor) style.color = btn.textColor;
    if (btn.borderColor) {
      style.borderColor = btn.borderColor;
      style.borderWidth = "2px";
      style.borderStyle = "solid";
    }
    if (btn.borderRadius) style.borderRadius = btn.borderRadius;
    return style;
  };

  const fallbackImages = [
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  ];

  const getImageStyle = (obj: any, key: string, fallbackIndex = 0) => {
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

  const getCardStyle = (item: any, block?: any) => {
    if (!item) return {};
    const style: React.CSSProperties = {};
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
    return style;
  };

  const getCardClass = (item: any, baseClass: string) => {
    let cls = baseClass;
    if (!item) return cls;

    if (item.cardShadow) {
      // Remove any existing shadow classes
      cls = cls.replace(/shadow(-\w+)?/g, "").trim();
      if (item.cardShadow !== "none") {
        cls += ` shadow-${item.cardShadow}`;
      }
    }
    if (item.hoverEffect) {
      cls +=
        " transition-all duration-300 hover:-translate-y-2 hover:shadow-xl";
    }
    return cls.replace(/\s+/g, " ").trim();
  };

  const getCardTitleStyle = (item: any, block: any) => {
    const style = { ...getItemTitleStyle(block) };
    if (item?.itemTitleColor) style.color = item.itemTitleColor;
    return style;
  };

  const getCardDescStyle = (item: any, block: any) => {
    const style = { ...getItemDescStyle(block) };
    if (item?.itemDescColor) style.color = item.itemDescColor;
    return style;
  };

  const extractAlignClass = (styleObj: any) => {
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

const removeAlignStyles = (styleObj: any) => {
  const newStyle = { ...styleObj };
  delete newStyle["--desktop-text-align"];
  delete newStyle["--mobile-text-align"];
  return newStyle;
};

const getIconStyle = (item: any, block: any, prefix = "icon") => {
    const style: React.CSSProperties = { ...getStyle(block, prefix) };
    if (item?.iconColor) style.color = item.iconColor;
    return style;
  };

  const getCardButtonStyle = (item: any, block: any) => {
    const style = { ...getItemButtonStyle(block) };
    if (item?.buttonTextColor) style.color = item.buttonTextColor;
    if (item?.buttonBgColor) style.backgroundColor = item.buttonBgColor;
    return style;
  };

  const renderBlock = (block: any, index: number) => {
    const renderContent = () => {
      switch (block.type) {
        case "about_hero":
          return (
            <AboutHeroBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "academic_hero":
          return (
            <AcademicHeroBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "akademik_kadro":
          return (
            <AkademikKadroBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "timeline":
          return (
            <TimelineBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "mission_vision":
          return (
            <MissionVisionBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "values":
          return (
            <ValuesBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "quote_image":
          return (
            <QuoteImageBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "kindergarten_hero":
        case "primary_school_hero":
        case "middle_school_hero":
          return (
            <SchoolHeroBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "kindergarten_bento":
        case "primary_school_bento":
          return (
            <SchoolBentoBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "kindergarten_branches":
          return (
            <SchoolBranchesBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "middle_school_pedagogy":
          return (
            <SchoolPedagogyBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "middle_school_lgs":
          return (
            <SchoolLgsBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "management_hero":
          return (
            <ManagementHeroBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "management_rector":
          return (
            <ManagementRectorBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "management_vice_rectors":
        case "management_deans":
          return (
            <ManagementTeamGridBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "campus_hero":
          return (
            <section
              key={index}
              className="relative h-[600px] w-full flex items-center overflow-hidden transition-all duration-1000 opacity-100 translate-y-0 whitespace-pre-line"
              style={getStyle(block, "container")}
            >
              <div className="absolute inset-0 z-0 whitespace-pre-line">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent z-10 whitespace-pre-line"></div>
                {block.image && (
                  <img
                    className="w-full h-full object-cover whitespace-pre-line"
                    src={block.image}
                    alt=""
                    style={{
                      ...getImageStyle(block, "image"),
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                    }}
                  />
                )}
              </div>
              <div
                className={`relative z-20 ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop w-full`}
              >
                <div className={getHeroInnerClass(block, "max-w-2xl")}>
                  <h1
                    className="font-display-lg text-display-lg text-white mb-6 whitespace-pre-line"
                    style={getTitleStyle(block)}
                  >
                    {block.title}
                  </h1>
                  <p
                    className="font-body-md text-body-lg text-white/90 mb-8 leading-relaxed whitespace-pre-line"
                    style={getSubtitleStyle(block)}
                  >
                    {block.subtitle}
                  </p>
                  {block.buttons && block.buttons.length > 0 && (
                    <div className="flex gap-4 flex-wrap whitespace-pre-line">
                      {block.buttons.map((btn: any, btnIdx: number) => (
                        <SmartLink
                          key={btnIdx}
                          url={btn.url || btn.buttonUrl || btn.link}
                          className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-surface-container-low transition-all shadow-lg flex items-center gap-2 whitespace-pre-line"
                          style={getIndividualButtonStyle(btn)}
                        >
                          {btn.label}{" "}
                          {btn.icon && <IconPreview data={btn.icon}  style={getIconStyle(btn, block)} />}
                        </SmartLink>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          );

        case "campus_bento":
          // Tailwind safelist: col-span-12 md:col-span-6 lg:col-span-4 lg:col-span-8
          return (
            <section
              key={index}
              className={`py-section-gap ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop transition-all duration-1000 opacity-100 translate-y-0`}
              style={getStyle(block, "container")}
            >
              <div
                className={`${block.styles?.textAlign ? "" : "text-center"} mb-16`}
              >
                <h2
                  className="font-headline-xl text-headline-xl text-text-main mb-4 whitespace-pre-line"
                  style={getTitleStyle(block)}
                >
                  {block.title}
                </h2>
                {block.subtitle && (
                  <p
                    className={`font-body-lg text-text-muted max-w-2xl ${getAlignClass(block, "subtitle")} mb-4 whitespace-pre-line`}
                    style={getSubtitleStyle(block)}
                    dangerouslySetInnerHTML={{ __html: block.subtitle }}
                  />
                )}
                <div className="w-20 h-1 bg-primary mx-auto rounded-full whitespace-pre-line"></div>
              </div>
              <div className="grid grid-cols-12 gap-6 whitespace-pre-line">
                {(block.items || []).map((item: any, i: number) => {
                  const cols =
                    item.colSpan || "col-span-12 md:col-span-6 lg:col-span-4";
                  const baseStyle = getCardStyle(item, block);
                  if (
                    !item.image &&
                    !baseStyle.backgroundColor &&
                    !item.styles?.backgroundColor
                  ) {
                    baseStyle.backgroundColor = "#747685";
} else if (item.styles?.backgroundColor) {
                    baseStyle.backgroundColor = item.styles.backgroundColor;
                  }
                  return (
                    <div
                      key={i}
                      className={`${cols} group relative overflow-hidden rounded-3xl h-[400px] border border-border-subtle hover:border-primary transition-all duration-500 shadow-sm`}
                      style={baseStyle}
                    >
                      {item.image && (
                        <img
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 whitespace-pre-line"
                          src={item.image}
                          alt=""
                          style={getImageStyle(item, "image", i)}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 whitespace-pre-line">
                        <h3
                          className="font-headline-md text-headline-md text-white mb-2 whitespace-pre-line"
                          style={getCardTitleStyle(item, block)}
                        >
                          {item.title}
                        </h3>
                        {item.desc && (
                          <p
                            className="text-white/80 font-body-md whitespace-pre-line"
                            style={getCardDescStyle(item, block)}
                          >
                            {item.subtitle || item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );

        case "campus_gallery":
          return (
            <section
              key={index}
              className="bg-surface-container-low py-section-gap transition-all duration-1000 opacity-100 translate-y-0 whitespace-pre-line"
              style={getStyle(block, "container")}
            >
              <div
                className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full mb-12 gap-6 whitespace-pre-line">
                  <div className="w-full md:w-auto flex-1">
                    <h2
                      className="font-headline-xl text-headline-xl text-text-main mb-4 whitespace-pre-line"
                      style={getTitleStyle(block)}
                    >
                      {block.title}
                    </h2>
                    <p
                      className={`font-body-md text-text-muted max-w-xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}
                      style={getSubtitleStyle(block)}
                    >
                      {block.subtitle}
                    </p>
                  </div>
                  <div className="flex gap-2 whitespace-pre-line">
                    <button
                      className="w-12 h-12 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all whitespace-pre-line"
                      onClick={(e) => {
                        const c =
                          e.currentTarget.parentElement?.parentElement
                            ?.nextElementSibling;
                        if (c) {
                          c.scrollBy({ left: -350, behavior: "smooth" });
                        }
                      }}
                    >
                      <span
                        className="material-symbols-outlined whitespace-pre-line"
                        translate="no"
                        aria-hidden="true"
                      >
                        chevron_left
                      </span>
                    </button>
                    <button
                      className="w-12 h-12 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all whitespace-pre-line"
                      onClick={(e) => {
                        const c =
                          e.currentTarget.parentElement?.parentElement
                            ?.nextElementSibling;
                        if (c) {
                          c.scrollBy({ left: 350, behavior: "smooth" });
                        }
                      }}
                    >
                      <span
                        className="material-symbols-outlined whitespace-pre-line"
                        translate="no"
                        aria-hidden="true"
                      >
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>
                <div
                  className="flex gap-6 overflow-x-auto no-scrollbar pb-4 whitespace-pre-line"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {(block.items || []).map((item: any, i: number) => (
                    <div
                      key={i}
                      className="min-w-[350px] bg-white rounded-2xl overflow-hidden shadow-sm border border-border-subtle group flex-shrink-0 whitespace-pre-line"
                      style={getCardStyle(item, block)}
                    >
                      <div className="h-64 overflow-hidden relative whitespace-pre-line">
                        {item.image && (
                          <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 whitespace-pre-line"
                            src={item.image}
                            alt=""
                            style={getImageStyle(item, "image", i)}
                          />
                        )}
                      </div>
                      <div className="p-6 whitespace-pre-line">
                        <h4
                          className="font-headline-md text-[20px] mb-2 whitespace-pre-line"
                          style={getCardTitleStyle(item, block)}
                        >
                          {item.title}
                        </h4>
                        <p
                          className="text-text-muted text-label-md whitespace-pre-line"
                          style={getCardDescStyle(item, block)}
                        >
                          {item.subtitle || item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <style
                dangerouslySetInnerHTML={{
                  __html: `
              .no-scrollbar::-webkit-scrollbar { display: none; }
            `,
                }}
              />
            </section>
          );

        case "campus_life":
          return (
            <section
              key={index}
              className={`py-section-gap ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop transition-all duration-1000 opacity-100 translate-y-0`}
              style={getStyle(block, "container")}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center whitespace-pre-line">
                <div className="order-2 lg:order-1 whitespace-pre-line">
                  <div className="grid grid-cols-2 gap-6 items-center whitespace-pre-line">
                    <div className="flex flex-col gap-6 whitespace-pre-line">
                      <div className="h-48 rounded-2xl overflow-hidden shadow-lg  whitespace-pre-line">
                        {block.image1 && (
                          <img
                            className="w-full h-full object-cover whitespace-pre-line"
                            src={block.image1}
                            alt=""
                          />
                        )}
                      </div>
                      <div className="h-64 rounded-2xl overflow-hidden shadow-lg whitespace-pre-line">
                        {block.image2 && (
                          <img
                            className="w-full h-full object-cover whitespace-pre-line"
                            src={block.image2}
                            alt=""
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-6 pt-12 whitespace-pre-line">
                      <div className="h-64 rounded-2xl overflow-hidden shadow-lg whitespace-pre-line">
                        {block.image3 && (
                          <img
                            className="w-full h-full object-cover whitespace-pre-line"
                            src={block.image3}
                            alt=""
                          />
                        )}
                      </div>
                      <div className="h-48 rounded-2xl overflow-hidden shadow-lg  whitespace-pre-line">
                        {block.image4 && (
                          <img
                            className="w-full h-full object-cover whitespace-pre-line"
                            src={block.image4}
                            alt=""
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 space-y-8 whitespace-pre-line">
                  {block.badge && (
                    <span
                      className="text-primary font-bold text-label-md tracking-widest uppercase whitespace-pre-line"
                      style={getBadgeStyle(block)}
                    >
                      {block.badge}
                    </span>
                  )}
                  <h2
                    className="font-headline-xl text-headline-xl text-text-main whitespace-pre-line"
                    style={getTitleStyle(block)}
                  >
                    {block.titlePart1}{" "}
                    {block.titlePart2 && (
                      <div style={getTitlePart2Style(block)}>
                        {block.titlePart2}
                      </div>
                    )}
                  </h2>
                  <p
                    className="font-body-md text-text-muted leading-relaxed whitespace-pre-line"
                    style={getSubtitleStyle(block)}
                  >
                    {block.subtitle}
                  </p>
                  <ul className="space-y-4 whitespace-pre-line">
                    {(block.items || []).map((item: any, i: number) => (
                      <li
                        key={i}
                        className="flex items-center gap-4 whitespace-pre-line"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 whitespace-pre-line">
                          {item.icon &&
                            (typeof item.icon === "string" &&
                            item.icon === item.icon.toLowerCase() ? (
                              <IconPreview data={item.icon}  style={getIconStyle(item, block)} />
                            ) : (
                              <IconPreview
                                data={item.icon}
                                className="w-6 h-6 fill-current whitespace-pre-line"
                               style={getIconStyle(item, block)} />
                            ))}
                        </div>
                        <span
                          className="font-label-md text-text-main whitespace-pre-line"
                          style={getCardTitleStyle(item, block)}
                        >
                          {item.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {block.buttons && block.buttons.length > 0 && (
                    <div className="flex gap-4 flex-wrap whitespace-pre-line">
                      {block.buttons.map((btn: any, btnIdx: number) => (
                        <SmartLink
                          key={btnIdx}
                          url={btn.url || btn.buttonUrl || btn.link}
                          className={`px-8 py-4 rounded-xl font-bold transition-all shadow-md ${btn.style === "outline" ? "border-2 border-primary text-primary hover:bg-primary/5" : "bg-secondary text-white hover:opacity-90"}`}
                          style={getIndividualButtonStyle(btn)}
                        >
                          {btn.label}
                        </SmartLink>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          );

        case "campus_contact":
          return (
            <section
              key={index}
              className="py-section-gap bg-surface-dim/30 transition-all duration-1000 opacity-100 translate-y-0 whitespace-pre-line"
              style={getStyle(block, "container")}
            >
              <div
                className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
              >
                <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row whitespace-pre-line">
                  <div className="p-12 w-full lg:w-1/2 space-y-8 flex flex-col justify-center whitespace-pre-line">
                    <h2
                      className="font-headline-xl text-headline-xl whitespace-pre-line"
                      style={getTitleStyle(block)}
                    >
                      {block.title}
                    </h2>
                    {block.subtitle && (
                      <p
                        className="font-body-lg text-text-muted whitespace-pre-line"
                        style={getSubtitleStyle(block)}
                        dangerouslySetInnerHTML={{ __html: block.subtitle }}
                      />
                    )}
                    <div className="space-y-6 whitespace-pre-line">
                      {(block.items || []).map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex gap-4 items-start whitespace-pre-line"
                        >
                          <IconPreview
                            data={item.icon}
                            className="text-primary whitespace-pre-line"
                           style={getIconStyle(item, block)} />
                          <div>
                            <h4
                              className="font-bold text-text-main whitespace-pre-line"
                              style={getCardTitleStyle(item, block)}
                            >
                              {item.title}
                            </h4>
                            <p
                              className="text-text-muted whitespace-pre-line"
                              style={getCardDescStyle(item, block)}
                            >
                              {item.subtitle || item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 min-h-[400px] relative overflow-hidden whitespace-pre-line">
                    {block.mapCode ? (
                      <div
                        className="w-full h-full flex flex-col [&>iframe]:flex-1 [&>iframe]:w-full [&>iframe]:min-h-[400px] min-h-[400px] whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: block.mapCode }}
                      />
                    ) : (
                      <>
                        {block.image && (
                          <img
                            className="absolute inset-0 w-full h-full object-cover whitespace-pre-line"
                            src={block.image}
                            alt=""
                            style={getImageStyle(block, "image")}
                          />
                        )}
                        <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-md p-6 rounded-2xl flex items-center justify-between border border-border-subtle/80 whitespace-pre-line">
                          <div className="w-full md:w-auto flex-1">
                            <h4 className="font-bold whitespace-pre-line">
                              {block.cardTitle}
                            </h4>
                            <p className="text-sm text-text-muted whitespace-pre-line">
                              {block.cardDesc}
                            </p>
                          </div>
                          {block.buttons && block.buttons[0] && (
                            <SmartLink
                              url={
                                block.buttons[0].url ||
                                block.buttons[0].buttonUrl ||
                                block.buttons[0].link
                              }
                              className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity whitespace-pre-line"
                            >
                              <IconPreview
                                data={block.buttons[0].icon || "directions"}
                               style={getIconStyle(null, block)} />
                            </SmartLink>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );

        case "contact_hero":
          return (
            <section
              key={index}
              className="bg-white py-16 whitespace-pre-line"
              style={getStyle(block, "container")}
            >
              <div
                className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop ${block.styles?.textAlign ? "" : "text-center"}`}
              >
                <h1
                  className="font-display-lg text-display-lg text-primary mb-4 whitespace-pre-line"
                  style={getTitleStyle(block)}
                >
                  {block.title || "İletişim"}
                </h1>
                <p
                  className={`font-body-lg text-body-lg text-text-muted max-w-2xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}
                  style={getSubtitleStyle(block)}
                >
                  {block.subtitle}
                </p>
              </div>
            </section>
          );

        case "contact_campuses":
          return (
            <section
              key={index}
              className="py-section-gap bg-surface-background whitespace-pre-line"
              style={getStyle(block, "container")}
            >
              <div
                className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
              >
                <div className="flex flex-col gap-12 whitespace-pre-line">
                  {(block.items || []).map((item: any, i: number) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-sm whitespace-pre-line"
                      style={getCardStyle(item, block)}
                    >
                      <div className="md:col-span-1 p-8 flex flex-col justify-center border-r border-border-subtle whitespace-pre-line">
                        {item.badge && (
                          <div className="bg-primary text-on-primary px-3 py-1 rounded text-caption font-caption w-fit mb-4 uppercase whitespace-pre-line">
                            {item.badge}
                          </div>
                        )}
                        <h3
                          className="font-headline-xl text-headline-xl text-on-surface mb-4 whitespace-pre-line"
                          style={getCardTitleStyle(item, block)}
                        >
                          {item.title}
                        </h3>
                        <div className="space-y-4 mb-6 whitespace-pre-line">
                          {item.address && (
                            <div className="flex items-start gap-3 whitespace-pre-line">
                              <span
                                className="material-symbols-outlined text-primary text-[24px] whitespace-pre-line"
                                translate="no"
                                aria-hidden="true"
                              >
                                location_on
                              </span>
                              <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">
                                {item.address}
                              </p>
                            </div>
                          )}
                          {item.phone && (
                            <div className="flex items-start gap-3 whitespace-pre-line">
                              <span
                                className="material-symbols-outlined text-primary text-[24px] whitespace-pre-line"
                                translate="no"
                                aria-hidden="true"
                              >
                                call
                              </span>
                              <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">
                                {item.phone}
                              </p>
                            </div>
                          )}
                        </div>
                        {item.buttonText && (
                          <a
                            href={item.url || "#"}
                            className="w-full border-2 border-primary text-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 whitespace-pre-line"
                          >
                            <span
                              className="material-symbols-outlined text-[20px] whitespace-pre-line"
                              translate="no"
                              aria-hidden="true"
                            >
                              directions
                            </span>{" "}
                            {item.buttonText}
                          </a>
                        )}
                      </div>
                      <div className="md:col-span-2 h-[400px] relative bg-surface-container overflow-hidden whitespace-pre-line">
                        {item.mapCode ? (
                          <div
                            className="w-full h-full flex flex-col [&>iframe]:flex-1 [&>iframe]:w-full [&>iframe]:min-h-[400px] whitespace-pre-line"
                            dangerouslySetInnerHTML={{ __html: item.mapCode }}
                          />
                        ) : (
                          <>
                            <div
                              className="absolute inset-0 grayscale-[0.5] opacity-80 whitespace-pre-line"
                              style={{
                                ...getImageStyle(item, "image", i),
                                backgroundSize: "cover",
                                backgroundPosition: "center center",
                              }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none whitespace-pre-line">
                              <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg border border-primary/20 pointer-events-auto whitespace-pre-line">
                                <p className="font-label-md text-primary whitespace-pre-line">
                                  {item.title} Haritası
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

        case "pre_registration_form":
          return (
            <PreRegistrationFormBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );

        case "tuition_fees_hero":
          return (
            <TuitionFeesHeroBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "bursluluk_hero":
          return (
            <BurslulukHeroBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );

        case "bursluluk_exam_form":
          return (
            <BurslulukExamFormBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );

        case "bursluluk_info_cards":
          return (
            <BurslulukInfoCardsBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );

        case "bursluluk_result_query":
          return (
            <BurslulukResultQueryBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );

        case "bursluluk_confirmation":
          return (
            <BurslulukConfirmationBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );

        case "club_registration_form":
          return (
            <ClubRegistrationFormBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );

        case "career_hero":
          return (
            <CareerHeroBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "career_benefits":
          return (
            <CareerBenefitsBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "career_application":
          return (
            <CareerApplicationBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
            />
          );
        case "edu_system_hero":
          return (
            <EduSystemHeroBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "edu_system_levels":
          return (
            <EduSystemLevelsBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
              getCardTitleStyle={getCardTitleStyle}
              getCardDescStyle={getCardDescStyle}
              />
          );
        case "edu_system_yadep":
          return (
            <EduSystemYadepBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
              getCardTitleStyle={getCardTitleStyle}
              getCardDescStyle={getCardDescStyle}
              />
          );
        case "edu_system_philosophy":
          return (
            <EduSystemPhilosophyBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
              getCardTitleStyle={getCardTitleStyle}
              getCardDescStyle={getCardDescStyle}
              />
          );
        case "edu_system_cta":
          return (
            <EduSystemCtaBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "contact_form":
          return (
            <ContactFormBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
        case "lgs_calculator":
          return <LgsCalculator key={index} block={block} />;

        case "social_media":
          const validItems = (block.items || []).filter(
            (item: any) => item.icon || item.url,
          );
          if (validItems.length === 0 && !block.title && !block.subtitle)
            return null;

          return (
            <section
              key={index}
              className="py-12 bg-white border-t border-border-subtle whitespace-pre-line"
              style={getStyle(block, "container")}
            >
              <div
                className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop ${block.styles?.textAlign ? "" : "text-center"}`}
              >
                {block.title && (
                  <h3
                    className="font-headline-md text-headline-md text-on-surface mb-6 whitespace-pre-line"
                    style={getTitleStyle(block)}
                  >
                    {block.title}
                  </h3>
                )}
                {block.subtitle && (
                  <p
                    className={`font-body-md text-body-md text-text-muted mb-8 max-w-2xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}
                    style={getSubtitleStyle(block)}
                  >
                    {block.subtitle}
                  </p>
                )}
                {validItems.length > 0 && (
                  <div className="flex justify-center gap-6 whitespace-pre-line">
                    {validItems.map((item: any, i: number) => (
                      <a
                        key={i}
                        href={item.url || "#"}
                        className="w-14 h-14 rounded-xl border border-border-subtle flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all group whitespace-pre-line"
                      >
                        {item.icon &&
                          (typeof item.icon === "string" &&
                          item.icon === item.icon.toLowerCase() ? (
                            <IconPreview
                              data={item.icon}
                              className="text-2xl whitespace-pre-line"
                             style={getIconStyle(item, block)} />
                          ) : (
                            <IconPreview
                              data={item.icon}
                              className="w-6 h-6 fill-current group-hover:fill-white transition-colors whitespace-pre-line"
                             style={getIconStyle(item, block)} />
                          ))}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );

        case "clubs_hero":
          return (
            <section
              key={index}
              className="relative h-[60vh] flex items-center justify-center overflow-hidden whitespace-pre-line"
              style={getStyle(block, "container")}
            >
              <div className="absolute inset-0 z-0 whitespace-pre-line">
                <div
                  className="w-full h-full bg-cover bg-center whitespace-pre-line"
                  style={getImageStyle(block, "image")}
                ></div>
                <div className="absolute inset-0 bg-primary/60 mix-blend-multiply whitespace-pre-line"></div>
              </div>
              <div
                className={`relative z-10 ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-gutter w-full`}
              >
                <div
                  className={getHeroInnerClass(
                    block,
                    `relative ${block.styles?.textAlign ? "" : "text-center"} max-w-4xl w-full`,
                  )}
                >
                  <h1
                    className={`font-display-lg text-display-lg text-on-primary mb-6 drop-shadow-lg whitespace-pre-line ${(block.styles?.subtitleAlign || block.styles?.textAlign) === 'left' ? 'text-left w-full' : (block.styles?.subtitleAlign || block.styles?.textAlign) === 'right' ? 'text-right w-full' : 'text-center w-full'}`}
                    style={getTitleStyle(block)}
                  >
                    {block.titlePart1 || block.title}{" "}
                    {block.titlePart2 && (
                      <>
                        <br />
                        {block.titlePart2}
                      </>
                    )}
                  </h1>
                  {block.subtitle && (
                    <p
                      className={`font-body-lg text-body-lg text-on-primary-container opacity-90 max-w-2xl ${getAlignClass(block, "subtitle")} mb-8 whitespace-pre-line ${(block.styles?.subtitleAlign || block.styles?.textAlign) === 'left' ? 'text-left w-full' : (block.styles?.subtitleAlign || block.styles?.textAlign) === 'right' ? 'text-right w-full' : 'text-center w-full'}`}
                      style={getSubtitleStyle(block)}
                    >
                      {block.subtitle}
                    </p>
                  )}
                  {block.buttons && block.buttons.length > 0 && (
                    <div className={`flex flex-wrap gap-4 whitespace-pre-line w-full ${(block.styles?.subtitleAlign || block.styles?.textAlign) === 'left' ? 'justify-start' : (block.styles?.subtitleAlign || block.styles?.textAlign) === 'right' ? 'justify-end' : 'justify-center'}`}>
                      {block.buttons.map((btn: any, i: number) => {
                      const isCustom =
                        btn.bgColor ||
                        btn.textColor ||
                        btn.borderColor ||
                        btn.borderRadius;
                      const defaultClass =
                        btn.style === "outline"
                          ? "bg-white/10 backdrop-blur-md text-on-primary border border-white/20 px-8 py-3 rounded-xl font-label-md hover:bg-white/20 transition-all"
                          : "bg-secondary-container text-on-secondary-container px-8 py-3 rounded-xl font-label-md hover:scale-105 transition-transform";
                      return (
                        <a
                          key={i}
                          href={btn.url || "#"}
                          style={getIndividualButtonStyle(btn)}
                          className={
                            !isCustom
                              ? defaultClass
                              : "px-8 py-3 rounded-xl font-label-md transition-all hover:scale-105"
                          }
                        >
                          {btn.label}
                        </a>
                      );
                    })}
                  </div>
                )}
                </div>
              </div>
            </section>
          );

        case "clubs_grid":
          return (
            <ClubsGridBlock
              key={index}
              block={block}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getCardStyle={getCardStyle}
              getImageStyle={getImageStyle}
              getCardTitleStyle={getCardTitleStyle}
              getCardDescStyle={getCardDescStyle}
              IconPreview={IconPreview}
            />
          );

        case "clubs_benefits":
          return (
            <section
              key={index}
              className="py-section-gap bg-surface-container-low whitespace-pre-line"
              id="benefits"
              style={getStyle(block, "container")}
            >
              <div
                className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-gutter`}
              >
                <div
                  className={`${block.styles?.textAlign ? "" : "text-center"} mb-16`}
                >
                  <h2
                    className="font-headline-xl text-headline-xl text-primary mb-4 whitespace-pre-line"
                    style={getTitleStyle(block)}
                  >
                    {block.title || "Neden Kulüplere Katılmalısın?"}
                  </h2>
                  {block.subtitle && (
                    <p
                      className={`text-on-surface-variant max-w-2xl ${getAlignClass(block, "subtitle")} font-body-lg whitespace-pre-line`}
                      style={getSubtitleStyle(block)}
                    >
                      {block.subtitle}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 whitespace-pre-line">
                  {(block.items || []).map((item: any, i: number) => (
                    <div
                      key={i}
                      className={`bg-white p-8 rounded-2xl border border-border-subtle ${block.styles?.textAlign ? "" : "text-center"} hover:-translate-y-1 transition-transform shadow-sm`}
                      style={getCardStyle(item, block)}
                    >
                      <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center mx-auto mb-6 whitespace-pre-line">
                        {item.icon &&
                          (typeof item.icon === "string" &&
                          item.icon === item.icon.toLowerCase() ? (
                            <IconPreview
                              data={item.icon}
                              className="text-primary text-3xl whitespace-pre-line"
                             style={getIconStyle(item, block)} />
                          ) : (
                            <IconPreview
                              data={item.icon}
                              className="w-[32px] h-[32px] text-primary whitespace-pre-line"
                             style={getIconStyle(item, block)} />
                          ))}
                      </div>
                      <h4
                        className="font-headline-md text-headline-md text-on-surface mb-3 text-lg whitespace-pre-line"
                        style={getCardTitleStyle(item, block)}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="text-on-surface-variant text-sm whitespace-pre-line"
                        style={getCardDescStyle(item, block)}
                      >
                        {item.subtitle || item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

        case "clubs_cta":
          return (
            <section
              key={index}
              className="py-section-gap whitespace-pre-line"
              style={getStyle(block, "container")}
            >
              <div
                className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-gutter`}
              >
                <div className="bg-primary rounded-3xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-md whitespace-pre-line">
                  <div
                    className={`relative z-10 ${block.styles?.textAlign ? "" : "text-center"} md:text-left`}
                  >
                    <h2
                      className="font-headline-xl text-headline-xl text-on-primary mb-4 whitespace-pre-line"
                      style={getTitleStyle(block)}
                    >
                      {block.title || "Bir Kulübe Katılmak İster misin?"}
                    </h2>
                    {block.subtitle && (
                      <p
                        className={`text-primary-fixed opacity-90 max-w-lg font-body-lg ${getAlignClass(block, "subtitle")} whitespace-pre-line`}
                        style={getSubtitleStyle(block)}
                      >
                        {block.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="relative z-10 whitespace-pre-line">
                    {block.buttons &&
                      block.buttons.map((btn: any, i: number) => {
                        const isCustom =
                          btn.bgColor ||
                          btn.textColor ||
                          btn.borderColor ||
                          btn.borderRadius;
                        const defaultClass =
                          "bg-secondary-container text-on-secondary-container px-12 py-4 rounded-2xl font-label-md text-lg hover:scale-105 transition-transform shadow-xl";
                        return (
                          <a
                            key={i}
                            href={btn.url || "#"}
                            style={getIndividualButtonStyle(btn)}
                            className={
                              !isCustom
                                ? defaultClass
                                : "px-12 py-4 rounded-2xl font-label-md text-lg hover:scale-105 transition-transform shadow-xl"
                            }
                          >
                            {btn.label}
                          </a>
                        );
                      })}
                  </div>
                  <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl whitespace-pre-line"></div>
                  <div className="absolute -left-20 -top-20 w-60 h-60 bg-white/5 rounded-full blur-2xl whitespace-pre-line"></div>
                </div>
              </div>
            </section>
          );

        case "news_hero":
          return (
            <section
              key={index}
              className={`relative pt-32 pb-20 overflow-hidden ${block.fullWidth || block.styles?.fullWidth ? "w-full" : "max-w-container-max mx-auto rounded-3xl"}`}
              style={getStyle(block, "")}
            >
              <div className="absolute inset-0 z-0 whitespace-pre-line">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 z-10 whitespace-pre-line"></div>
                <div className="w-full h-full relative overflow-hidden whitespace-pre-line">
                  <div
                    className="absolute inset-0 w-full h-full whitespace-pre-line"
                    style={getImageStyle(block, "image")}
                  ></div>
                </div>
              </div>
              <div
                className={`relative z-20 px-margin-mobile md:px-margin-desktop ${block.fullWidth || block.styles?.fullWidth ? "max-w-container-max mx-auto" : "w-full"}`}
              >
                <div
                  className={getHeroInnerClass(
                    block,
                    "max-w-2xl text-on-primary",
                  )}
                >
                  {block.title && (
                    <h1
                      style={getTitleStyle(block)}
                      className="font-display-lg text-3xl md:text-display-lg mb-4 whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: (block.title || "").replace(
                          "Eğitimde Dostluk, Gelecekte Başarı",
                          'Eğitimde Dostluk, <br class="block md:hidden" /> Gelecekte Başarı',
                        ),
                      }}
                    ></h1>
                  )}
                  {block.subtitle && (
                    <p
                      style={getSubtitleStyle(block)}
                      className="font-body-lg text-base md:text-body-lg opacity-90 leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: block.subtitle }}
                    ></p>
                  )}
                </div>
              </div>
            </section>
          );

        case "news_grid":
          return (
            <div
              key={index}
              className={
                block.fullWidth || block.styles?.fullWidth
                  ? "w-full"
                  : "max-w-container-max mx-auto"
              }
              style={getStyle(block, "")}
            >
              <section
                className="bg-surface-container-lowest sticky top-20 z-40 border-b border-border-subtle whitespace-pre-line"
                style={getStyle(block, "filterContainer")}
              >
                <div
                  className={`px-margin-mobile md:px-margin-desktop ${block.fullWidth || block.styles?.fullWidth ? "max-w-container-max mx-auto" : "w-full"}`}
                >
                  <div className="flex flex-nowrap md:flex-wrap overflow-x-auto items-center gap-6 md:gap-8 py-4 no-scrollbar whitespace-pre-line">
                    {block.categories?.map((cat: any, i: number) => (
                      <button
                        key={i}
                        className={`whitespace-nowrap category-btn font-label-md text-sm md:text-label-md pb-4 transition-all ${i === 0 ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"}`}
                      >
                        {cat.label || cat}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section
                className="py-10 md:py-section-gap px-margin-mobile md:px-margin-desktop whitespace-pre-line"
                style={getStyle(block, "")}
              >
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 ${block.fullWidth || block.styles?.fullWidth ? "max-w-container-max mx-auto" : "w-full"}`}
                >
                  {block.items?.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden hover:shadow-sm transition-all group flex flex-col whitespace-pre-line"
                      style={{
                        backgroundColor: item.cardBgColor,
                        borderColor: item.cardBorderColor,
                        borderRadius: item.cardBorderRadius,
                      }}
                    >
                      <div className="relative aspect-video overflow-hidden whitespace-pre-line">
                        <div className="w-full h-full relative overflow-hidden whitespace-pre-line">
                          <div
                            className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-500 whitespace-pre-line"
                            style={getImageStyle(item, "image")}
                          ></div>
                        </div>
                        {item.tag && (
                          <span
                            className={`absolute top-4 left-4 text-white px-3 py-1 rounded-full font-label-sm text-xs ${item.tagColor || "bg-secondary"}`}
                          >
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <div
                        className="p-6 flex flex-col flex-grow whitespace-pre-line"
                        style={{ padding: item.cardPadding }}
                      >
                        {item.date && (
                          <div className="flex items-center gap-2 text-text-muted mb-3 font-label-sm text-xs md:text-label-sm whitespace-pre-line">
                            <span
                              className="material-symbols-outlined text-[16px] md:text-[18px] whitespace-pre-line"
                              translate="no"
                              aria-hidden="true"
                            >
                              calendar_today
                            </span>
                            <span>{item.date}</span>
                          </div>
                        )}
                        {item.title && (
                          <h3
                            style={getCardTitleStyle(item, block)}
                            className="font-headline-md text-xl md:text-headline-md mb-3 group-hover:text-primary transition-colors line-clamp-2 whitespace-pre-line"
                          >
                            {item.title}
                          </h3>
                        )}
                        {item.desc && (
                          <p
                            style={getCardDescStyle(item, block)}
                            className="font-body-md text-sm md:text-body-md text-on-surface-variant mb-6 line-clamp-3 whitespace-pre-line"
                          >
                            {item.subtitle || item.desc}
                          </p>
                        )}
                        {!item.hideButton && (
                          <div className="mt-auto whitespace-pre-line">
                            <a
                              href={item.url || "#"}
                              className="flex items-center gap-2 text-primary font-label-md text-sm md:text-label-md hover:underline group/link whitespace-pre-line"
                            >
                              {item.buttonText || "Devamını Oku"}
                              <span
                                className="material-symbols-outlined transition-transform group-hover/link:translate-x-1 text-sm md:text-base whitespace-pre-line"
                                translate="no"
                                aria-hidden="true"
                              >
                                arrow_forward
                              </span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          );

        case "newsletter":
          return (
            <section
              key={index}
              className={`py-12 md:py-section-gap px-margin-mobile md:px-margin-desktop bg-primary-container/10 ${block.fullWidth || block.styles?.fullWidth ? "w-full" : "max-w-container-max mx-auto rounded-3xl"}`}
              style={getStyle(block, "")}
            >
              <div
                className={`max-w-4xl ${getAlignClass(block)} ${block.styles?.textAlign ? "" : "text-center"} ${block.fullWidth || block.styles?.fullWidth ? "max-w-container-max mx-auto" : "w-full"}`}
              >
                {block.icon && (
                  <IconPreview
                    data={block.icon}
                    className="text-primary text-2xl md:text-4xl mb-4 whitespace-pre-line"
                    style={{ ...getIconStyle(block, block), fontVariationSettings: "'FILL' 1" }}
                  />
                )}
                {block.title && (
                  <h2
                    style={getTitleStyle(block)}
                    className="font-headline-xl text-2xl md:text-headline-xl text-primary mb-4 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: (block.title || "").replace(
                        "Eğitimde Dostluk, Gelecekte Başarı",
                        'Eğitimde Dostluk, <br class="block md:hidden" /> Gelecekte Başarı',
                      ),
                    }}
                  ></h2>
                )}
                {block.desc && (
                  <p
                    style={getDescStyle(block)}
                    className="font-body-lg text-base md:text-body-lg text-on-surface-variant mb-6 md:mb-8 whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: block.desc }}
                    ></p>
                )}

                <form
                  className={`flex flex-col sm:flex-row gap-4 max-w-xl ${getAlignClass(block)} w-full whitespace-pre-line`}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    className="flex-grow px-4 md:px-6 py-3 md:py-4 rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary outline-none text-sm md:text-body-md whitespace-pre-line"
                    placeholder={block.inputPlaceholder || "E-posta adresiniz"}
                    required
                    type="email"
                  />
                  <button
                    className="bg-primary text-on-primary px-6 md:px-8 py-3 md:py-4 rounded-xl font-label-md text-sm md:text-label-md hover:opacity-90 transition-all shadow-md whitespace-pre-line"
                    type="submit"
                  >
                    {block.buttonText || "Abone Ol"}
                  </button>
                </form>
                {block.caption && (
                  <p
                    className="mt-4 text-xs md:text-caption text-text-muted whitespace-pre-line"
                    ><TextWithKvkkLink text={block.caption} /></p>


                )}
              </div>
            </section>
          );
        case "hero":
          return (
            <section
              key={index}
              className={`relative flex flex-col justify-center items-center pt-8 pb-8 md:pt-12 md:pb-10 px-margin-mobile md:px-margin-desktop bg-[#f8f9fa] overflow-hidden ${block.fullWidth || block.styles?.fullWidth ? "w-full" : "max-w-container-max mx-auto rounded-3xl"}`}
              style={getStyle(block, "")}
            >
              <div className="w-full flex flex-col gap-6 md:gap-10 whitespace-pre-line">
                {(() => {
                  const layoutOrder =
                    block.layoutOrder || "text_images_buttons";

                  const textContent = (
                    <div
                      className={`${block.fullWidth || block.styles?.fullWidth ? "max-w-container-max mx-auto" : "w-full"} ${block.styles?.textAlign ? "" : "text-center"} relative z-10`}
                    >
                      {block.badge && (
                        <span
                          style={getBadgeStyle(block)}
                          className="inline-block py-1.5 px-6 rounded-full bg-blue-100/80 text-blue-800 text-[11px] font-bold mb-4 tracking-widest whitespace-pre-line"
                        >
                          {block.badge}
                        </span>
                      )}
                      {(() => {
                        const titleAlign = block.styles?.titleAlign || block.styles?.textAlign || "center";
                        const flexAlign = titleAlign === "left" ? "items-start justify-start text-left" : titleAlign === "right" ? "items-end justify-end text-right" : "items-center justify-center text-center";
                        const isStacked =
                          block.titleLayout === "stacked" ||
                          block.styles?.titleLayout === "stacked";
                        const hasPart1 = Boolean(
                          block.titlePart1 && block.titlePart1.trim(),
                        );
                        const hasPart2 = Boolean(
                          block.titlePart2 && block.titlePart2.trim(),
                        );

                        if (hasPart1 || hasPart2) {
                          return (
                            <h1
                              style={getTitleStyle(block)}
                              className={`text-2xl md:text-4xl lg:text-5xl font-extrabold mb-4 max-w-4xl ${getAlignClass(block, "title")} leading-tight ${
                                isStacked
                                  ? `flex flex-col gap-1 md:gap-2 ${flexAlign}`
                                  : `flex flex-wrap gap-x-3 md:gap-x-4 gap-y-1 ${flexAlign}`
                              }`}
                            >
                              {hasPart1 && (
                                <span
                                  style={getTitlePart1Style(block)}
                                  className="block md:inline-block whitespace-pre-line"
                                >
                                  {block.titlePart1}
                                </span>
                              )}
                              {hasPart2 && (
                                <span
                                  style={getTitlePart2Style(block)}
                                  className="block md:inline-block whitespace-pre-line"
                                >
                                  {block.titlePart2}
                                </span>
                              )}
                            </h1>
                          );
                        }

                        return (
                          <h1
                            style={getTitleStyle(block)}
                            className={`text-2xl md:text-4xl lg:text-5xl font-extrabold text-[#232b38] mb-4 max-w-4xl ${getAlignClass(block, "title")} leading-tight whitespace-pre-line`}
                            dangerouslySetInnerHTML={{
                              __html: (block.title || "").replace(
                                "Eğitimde Dostluk, Gelecekte Başarı",
                                'Eğitimde Dostluk, <br class="block md:hidden" /> Gelecekte Başarı',
                              ),
                            }}
                          />
                        );
                      })()}
                      <p
                        style={getSubtitleStyle(block)}
                        className={`text-base md:text-[17px] text-[#556987] max-w-3xl ${getAlignClass(block, "subtitle")} whitespace-pre-line font-medium leading-relaxed whitespace-pre-line`}
                        dangerouslySetInnerHTML={{
                          __html: block.subtitle || "",
                        }}
                      ></p>
                    </div>
                  );

                  const imagesContent = (
                    <div className="w-full whitespace-pre-line">
                      {(() => {
                        const itemsToRender =
                          block.items && block.items.length > 0
                            ? block.items
                            : [
                                {
                                  title: "Eryaman Kampüsü",
                                  image:
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuC8qIP1ABoe09FATRO4Pj7E6mBOuDgJnB1tvLe6uqNVcTi6mfsEYvB2XH2rrzky0Gi4UUXnUaO_qiKoZeUsFn-CntOlSlzUdC5yjWK8U8AhvsYNqNxP5aO37U0NO3Tfmr0CHJRSC9Q35cbrcEAegl1qOEnhTDvjaDMa-L-uFCGMr32huP2UwRG_39CfFdlX5FI6C3jBHLayks_vh92PvxO4WHTE3Z2xdCwKGIujtGoiSuStdWlHKFj-",
                                },
                                {
                                  title: "Oran Kampüsü",
                                  image:
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBjDG8_JX7MULyyExwEfK72LW1u8gclH3Dna__2yYyO7bu61vZzFjocpfViy9CA7YjDQJhJeuw1xmbFl00DYTJRSismY7U2bqM2d9SuTsfYp_hy1dF5dNP0GtZkcNa3qU3MOQwXzr78JTskXa8JK816aJcXU5Owwr_RxmDpm60RrKff19l0JINLnOFznHF6_pBpct_1yePy5adSKReuqc8WOWadrlyiu0E_E-UasPTpZOd642Bx2msr",
                                },
                                {
                                  title: "Ümitköy Kampüsü",
                                  image:
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuA5CIEGWjb5N00w9IoqzRdjl_ii1MbkI7Z1xQkvkffIT-UMMiC1lGzNY8gEffFUaAcOgCIWSqHyjPyVwFA6b8odbabXRT3NpYvqJ9kjlniTj66HVIyK9J_aF_TtcQMqSeWEk6QLzaBua6W-MPgsOuC0ucsq66FIeadv-cd3ld8LK3aTAttcYZmTQtKcrzsqeFk6v6GHydnRqRb34MkLs-EykBN6zKsuX_HayF1xTPq4R8F1NJavFJVK",
                                },
                              ];
                        return (
                          <div
                            className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto w-full flex flex-col md:flex-row gap-3 md:gap-6 relative z-10 px-4 md:px-0 h-[560px] md:h-[480px]`}
                          >
                            {itemsToRender.map((item: any, i: number) => (
                              <div
                                key={i}
                                className="group relative rounded-[24px] md:rounded-[32px] overflow-hidden min-h-[110px] md:min-h-0 h-full flex-1 hover:flex-[2.5] active:flex-[2.5] md:hover:flex-[2] lg:hover:flex-[3] transition-all duration-700 ease-in-out cursor-pointer select-none whitespace-pre-line"
                              >
                                <div className="absolute inset-0 overflow-hidden whitespace-pre-line">
                                  <div
                                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700 whitespace-pre-line"
                                    style={getImageStyle(item, "image", i)}
                                  ></div>
                                </div>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent group-active:bg-transparent transition-colors duration-500 whitespace-pre-line"></div>
                                <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-max max-w-[90%] z-10 whitespace-pre-line">
                                  {item.url ? (
                                    <a
                                      href={item.url}
                                      style={getCardTitleStyle(item, block)}
                                      className={`bg-white/95 backdrop-blur-sm text-primary font-bold text-[13px] md:text-[15px] px-5 md:px-8 py-2 md:py-3 rounded-full shadow-lg whitespace-nowrap block ${block.styles?.textAlign ? "" : "text-center"} transition-transform group-hover:-translate-y-1 duration-300 hover:bg-primary hover:text-white cursor-pointer`}
                                    >
                                      {item.title}
                                    </a>
                                  ) : (
                                    <span
                                      style={getCardTitleStyle(item, block)}
                                      className={`bg-white/95 backdrop-blur-sm text-primary font-bold text-[13px] md:text-[15px] px-5 md:px-8 py-2 md:py-3 rounded-full shadow-lg whitespace-nowrap block ${block.styles?.textAlign ? "" : "text-center"} transition-transform group-hover:-translate-y-1 duration-300`}
                                    >
                                      {item.title}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  );

                  const buttonsContent =
                    block.buttons && block.buttons.length > 0 ? (
                      <div
                        className={`flex flex-col sm:flex-row gap-4 ${block.styles?.textAlign === "left" ? "justify-start items-start" : block.styles?.textAlign === "right" ? "justify-end items-end" : "justify-center items-center"} w-full ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto relative z-10`}
                      >
                        {block.buttons.map((btn: any, i: number) => {
                          const isCustomColors = btn.bgColor || btn.textColor;
                          const defaultClasses = btn.primary
                            ? "bg-primary text-white hover:bg-primary/90 hover:shadow-lg"
                            : "bg-white text-primary border border-border-subtle hover:bg-surface-container";

                          let buttonUrl = btn.url || "#";
                          if (btn.label === "Kampüsleri Keşfet") {
                            buttonUrl = "#campuses-section";
                          }

                          return (
                            <SmartLink
                              key={i}
                              url={buttonUrl}
                              style={getIndividualButtonStyle(btn)}
                              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all ${!isCustomColors ? defaultClasses : "hover:opacity-90 hover:shadow-lg"}`}
                            >
                              {btn.label}
                              {btn.icon &&
                                (typeof btn.icon === "string" &&
                                btn.icon === btn.icon.toLowerCase() ? (
                                  <IconPreview
                                    data={btn.icon}
                                    className="text-[1.1em] whitespace-pre-line"
                                   style={getIconStyle(btn, block)} />
                                ) : (
                                  <IconPreview
                                    data={btn.icon}
                                    className="w-[1.1em] h-[1.1em] whitespace-pre-line"
                                   style={getIconStyle(btn, block)} />
                                ))}
                            </SmartLink>
                          );
                        })}
                      </div>
                    ) : null;

                  if (layoutOrder === "images_text_buttons") {
                    return (
                      <>
                        {imagesContent}
                        {textContent}
                        {buttonsContent}
                      </>
                    );
} else if (layoutOrder === "text_buttons_images") {
                    return (
                      <>
                        {textContent}
                        {buttonsContent}
                        {imagesContent}
                      </>
                    );
                  }

                  return (
                    <>
                      {textContent}
                      {imagesContent}
                      {buttonsContent}
                    </>
                  );
                })()}
              </div>
            </section>
          );

        case "education_levels":
          return (
            <section
              key={index}
              className={`py-section-gap px-margin-mobile md:px-margin-desktop ${block.fullWidth || block.styles?.fullWidth ? "w-full" : "max-w-container-max mx-auto rounded-3xl"}`}
              style={{
                backgroundColor: block.styles?.backgroundColor || "#4873f4",
                ...getStyle(block, ""),
              }}
            >
              <div
                className={
                  block.fullWidth || block.styles?.fullWidth
                    ? "max-w-container-max mx-auto"
                    : "w-full"
                }
              >
                <div className="flex flex-row items-center gap-4 mb-10 md:mb-12 whitespace-pre-line">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-lg backdrop-blur-sm whitespace-pre-line">
                    <span
                      className="material-symbols-outlined text-white text-3xl whitespace-pre-line"
                      translate="no"
                      aria-hidden="true"
                    >
                      school
                    </span>
                  </div>
                  <div>
                    {block.subtitle && (
                      <span
                        style={getSubtitleStyle(block)}
                        className="text-white/80 text-xs md:text-sm font-bold tracking-widest mb-1 block whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: block.subtitle }}
                      ></span>
                    )}
                    <h2
                      style={getTitleStyle(block)}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold text-white whitespace-pre-line leading-tight whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: (block.title || "").replace(
                          "Eğitimde Dostluk, Gelecekte Başarı",
                          'Eğitimde Dostluk, <br class="block md:hidden" /> Gelecekte Başarı',
                        ),
                      }}
                    ></h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 whitespace-pre-line">
                  {block.items?.map((item: any, i: number) => (
                    <div
                      key={i}
                      data-editor-item-index={i}
                      className={`p-6 md:p-8 rounded-[2rem] bg-white/10 border border-white/10 ${item.hoverEffect ? "hover:-translate-y-1 hover:shadow-2xl" : ""} hover:bg-white/[0.15] hover:border-white/20 transition-all duration-300 flex flex-col text-left backdrop-blur-md`}
                      style={getCardStyle(item, block)}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner whitespace-pre-line ${extractAlignClass(getIconStyle(item, block))}`}>
                        {typeof item.icon === "object" ||
                        (typeof item.icon === "string" &&
                          item.icon !== item.icon.toLowerCase()) ? (
                          <IconPreview
                            data={item.icon}
                            className="text-[#5eead4] w-6 h-6 whitespace-pre-line"
                           style={removeAlignStyles(getIconStyle(item, block))} />
                        ) : (
                          <IconPreview
                            data={item.icon || "school"}
                            className="text-[#5eead4] whitespace-pre-line"
                           style={removeAlignStyles(getIconStyle(item, block))} />
                        )}
                      </div>
                      <h3
                        style={getCardTitleStyle(item, block)}
                        className="text-xl md:text-2xl font-bold mb-3 text-white whitespace-pre-line"
                      >
                        {item.title}
                      </h3>
                      <p
                        style={getCardDescStyle(item, block)}
                        className="text-white/80 text-sm leading-relaxed mb-8 flex-1 whitespace-pre-line"
                      >
                        {item.subtitle || item.desc}
                      </p>
                      {(item.buttonText || item.buttonUrl || item.url) && (
                        <SmartLink
                          url={item.buttonUrl || item.url || item.link}
                          className={`w-full py-3.5 px-4 rounded-xl bg-[#5eead4] text-[#0f172a] font-bold text-sm ${block.styles?.textAlign ? "" : "text-center"} hover:opacity-90 hover:shadow-lg transition-all duration-300 block`}
                          style={getCardButtonStyle(item, block)}
                        >
                          {item.buttonText || "Detaylı Bilgi"}
                        </SmartLink>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

        case "features":
          return (
            <section
              key={index}
              className={`py-section-gap px-margin-desktop ${block.fullWidth || block.styles?.fullWidth ? "w-full" : "max-w-container-max mx-auto rounded-3xl"}`}
              style={getStyle(block, "")}
            >
              <div
                className={
                  block.fullWidth || block.styles?.fullWidth
                    ? "max-w-container-max mx-auto"
                    : "w-full"
                }
              >
                <div
                  className={`${block.styles?.textAlign ? "" : "text-center"} mb-10 md:mb-16`}
                >
                  <span
                    style={getSubtitleStyle(block)}
                    className="text-primary text-xs md:text-sm font-bold tracking-widest mb-3 md:mb-4 block whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: block.subtitle || "" }}
                  ></span>
                  <h2
                    style={getTitleStyle(block)}
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-background whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: (block.title || "").replace(
                        "Eğitimde Dostluk, Gelecekte Başarı",
                        'Eğitimde Dostluk, <br class="block md:hidden" /> Gelecekte Başarı',
                      ),
                    }}
                  ></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto whitespace-pre-line">
                  {block.items?.map((item: any, i: number) => (
                    <div
                      key={i}
                      className={`bento-card p-6 md:p-8 rounded-2xl border border-border-subtle flex flex-col ${item.highlight ? "bg-primary text-white md:col-span-2 relative overflow-hidden" : "bg-white text-on-surface"} ${item.rowSpan ? "md:row-span-2" : ""}`}
                      style={getCardStyle(item, block)}
                    >
                      {item.highlight ? (
                        <>
                          {item.image && (
                            <div className="absolute inset-0 z-0 whitespace-pre-line">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover opacity-40 mix-blend-overlay whitespace-pre-line"
                              />
                            </div>
                          )}
                          <div
                            className={`relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 ${block.styles?.textAlign ? "" : "text-center"} md:text-left`}
                          >
                            <div className="flex-1 whitespace-pre-line">
                              <h3
                                style={getCardTitleStyle(item, block)}
                                className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-white whitespace-pre-line"
                              >
                                {item.title}
                              </h3>
                              <p
                                style={getCardDescStyle(item, block)}
                                className="text-white/80 mb-5 md:mb-6 text-sm md:text-base whitespace-pre-line"
                              >
                                {item.subtitle || item.desc}
                              </p>
                              {item.buttonText && (
                                <SmartLink
                                  url={item.buttonUrl || item.url || item.link}
                                  className="bg-white text-primary text-sm md:text-base font-bold px-5 py-2.5 md:px-6 md:py-3 rounded-lg hover:bg-surface-container transition-all inline-block whitespace-pre-line"
                                  style={getCardButtonStyle(item, block)}
                                >
                                  {item.buttonText}{" "}
                                  {item.buttonIcon && (
                                    <span
                                      className="material-symbols-outlined ml-1 text-[0.9em] whitespace-pre-line"
                                      translate="no"
                                      aria-hidden="true"
                                    >
                                      {item.buttonIcon}
                                    </span>
                                  )}
                                </SmartLink>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {item.image && (
                            <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden mb-5 shrink-0 relative whitespace-pre-line">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover whitespace-pre-line"
                              />
                              <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm text-primary flex items-center justify-center shadow-sm whitespace-pre-line">
                                {typeof item.icon === "object" ||
                                (typeof item.icon === "string" &&
                                  item.icon !== item.icon.toLowerCase()) ? (
                                  <IconPreview
                                    data={item.icon}
                                    className="w-5 h-5 whitespace-pre-line"
                                   style={getIconStyle(item, block)} />
                                ) : (
                                  <IconPreview
                                    data={item.icon}
                                    className="text-xl whitespace-pre-line"
                                   style={getIconStyle(item, block)} />
                                )}
                              </div>
                            </div>
                          )}
                          {!item.image && (
                            <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center mb-5 shrink-0 whitespace-pre-line">
                              {typeof item.icon === "object" ||
                              (typeof item.icon === "string" &&
                                item.icon !== item.icon.toLowerCase()) ? (
                                <IconPreview
                                  data={item.icon}
                                  className="w-6 h-6 whitespace-pre-line"
                                 style={getIconStyle(item, block)} />
                              ) : (
                                <IconPreview
                                  data={item.icon}
                                  className="text-2xl whitespace-pre-line"
                                 style={getIconStyle(item, block)} />
                              )}
                            </div>
                          )}
                          <h3
                            style={getCardTitleStyle(item, block)}
                            className="text-lg font-bold mb-2 whitespace-pre-line"
                          >
                            {item.title}
                          </h3>
                          <p
                            style={getCardDescStyle(item, block)}
                            className="text-text-muted text-sm leading-relaxed whitespace-pre-line"
                          >
                            {item.subtitle || item.desc}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

        case "campuses":
          return (
            <section
              key={index}
              id="campuses-section"
              className={`py-section-gap px-margin-desktop bg-surface-container/50 ${block.fullWidth || block.styles?.fullWidth ? "w-full" : "max-w-container-max mx-auto rounded-3xl"}`}
              style={getStyle(block, "")}
            >
              <div
                className={
                  block.fullWidth || block.styles?.fullWidth
                    ? "max-w-container-max mx-auto"
                    : "w-full"
                }
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6 whitespace-pre-line">
                  <div className="w-full md:w-auto flex-1">
                    <span
                      style={getSubtitleStyle(block)}
                      className="text-primary text-xs md:text-sm font-bold tracking-widest mb-3 md:mb-4 block whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: block.subtitle || "" }}
                    ></span>
                    <h2
                      style={getTitleStyle(block)}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: (block.title || "").replace(
                          "Eğitimde Dostluk, Gelecekte Başarı",
                          'Eğitimde Dostluk, <br class="block md:hidden" /> Gelecekte Başarı',
                        ),
                      }}
                    ></h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 whitespace-pre-line">
                  {block.items?.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-border-subtle flex flex-col whitespace-pre-line"
                      style={getCardStyle(item, block)}
                    >
                      <div className="h-48 md:h-64 overflow-hidden shrink-0 whitespace-pre-line">
                        <div className="w-full h-full relative overflow-hidden whitespace-pre-line">
                          <div
                            className="absolute inset-0 w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700 whitespace-pre-line"
                            style={getImageStyle(item, "image")}
                          ></div>
                        </div>
                      </div>
                      <div className="p-5 md:p-6 flex flex-col flex-1 whitespace-pre-line">
                        <div className="flex items-center justify-between mb-3 md:mb-4 whitespace-pre-line">
                          <h3
                            style={getCardTitleStyle(item, block)}
                            className="text-xl md:text-2xl font-bold whitespace-pre-line"
                          >
                            {item.title}
                          </h3>
                          <span
                            className="text-primary material-symbols-outlined whitespace-pre-line"
                            translate="no"
                            aria-hidden="true"
                          >
                            location_on
                          </span>
                        </div>
                        <p
                          style={getCardDescStyle(item, block)}
                          className="text-text-muted text-sm md:text-base mb-5 md:mb-6 flex-1 whitespace-pre-line"
                        >
                          {item.subtitle || item.desc}
                        </p>
                        {!item.hideButton && (
                          <SmartLink
                            url={item.buttonUrl || item.url || item.link}
                            className={`w-full border-2 border-primary/20 text-primary text-sm md:text-base font-bold py-2.5 md:py-3 rounded-xl hover:bg-primary hover:text-white transition-all mt-auto ${block.styles?.textAlign ? "" : "text-center"} block`}
                          >
                            {item.buttonText || "İncele"}{" "}
                            {item.buttonIcon && (
                              <span
                                className="material-symbols-outlined ml-1 text-[0.9em] whitespace-pre-line"
                                translate="no"
                                aria-hidden="true"
                              >
                                {item.buttonIcon}
                              </span>
                            )}
                          </SmartLink>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

        case "video":
          return (
            <section
              key={index}
              className={`py-section-gap px-margin-mobile md:px-margin-desktop relative overflow-hidden ${block.fullWidth || block.styles?.fullWidth ? "w-full" : "max-w-container-max mx-auto rounded-3xl"}`}
              style={getStyle(block, "")}
            >
              <div
                className={
                  block.fullWidth || block.styles?.fullWidth
                    ? "max-w-container-max mx-auto relative z-10"
                    : "relative z-10"
                }
              >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl whitespace-pre-line"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl whitespace-pre-line"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 whitespace-pre-line">
                  {/* Left: Text Content */}
                  <div className="lg:col-span-5 flex flex-col justify-center whitespace-pre-line">
                    {block.title && (
                      <h2
                        style={getTitleStyle(block)}
                        className="font-display-lg text-2xl md:text-4xl lg:text-5xl text-on-surface mb-6 leading-tight whitespace-pre-line"
                        dangerouslySetInnerHTML={{
                          __html: (block.title || "").replace(
                            "Eğitimde Dostluk, Gelecekte Başarı",
                            'Eğitimde Dostluk, <br class="block md:hidden" /> Gelecekte Başarı',
                          ),
                        }}
                      ></h2>
                    )}
                    {block.subtitle && (
                      <p
                        style={getSubtitleStyle(block)}
                        className="font-body-lg text-lg md:text-body-lg text-text-muted mb-8 whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: block.subtitle }}
                      ></p>
                    )}
                    {block.desc && (
                      <div
                        style={getDescStyle(block)}
                        className="prose prose-slate max-w-none text-on-surface-variant whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: block.desc }}
                      ></div>
                    )}
                  </div>

                  {/* Right: Video Area */}
                  <div className="lg:col-span-7 group relative aspect-video bg-inverse-surface rounded-2xl overflow-hidden shadow-2xl border border-border-subtle cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(29,78,202,0.2)] whitespace-pre-line">
                    {block.thumbnailUrl ? (
                      <img
                        src={block.thumbnailUrl}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover whitespace-pre-line"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 whitespace-pre-line">
                        Video Kapak Görseli
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 whitespace-pre-line"></div>

                    {/* Video Play Interaction */}
                    <div className="absolute inset-0 flex items-center justify-center whitespace-pre-line">
                      <div className="relative whitespace-pre-line">
                        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75 duration-1000 whitespace-pre-line"></div>
                        <a
                          href={block.videoUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 z-10 text-primary whitespace-pre-line"
                        >
                          <span
                            className="material-symbols-outlined text-2xl md:text-4xl whitespace-pre-line"
                            translate="no"
                            aria-hidden="true"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            play_arrow
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );

        case "achievements_hero":
          return (
            <section
              key={index}
              className="relative text-white overflow-hidden min-h-[600px] flex items-center whitespace-pre-line"
              
              style={{
                ...getStyle(block, "container"), backgroundColor: block.styles?.innerBgColor || "#00164f",
                backgroundImage: block.image ? `linear-gradient(color-mix(in srgb, ${block.styles?.innerBgColor || "#00164f"} ${block.styles?.innerBgOpacity ?? 70}%, transparent), color-mix(in srgb, ${block.styles?.innerBgColor || "#00164f"} ${block.styles?.innerBgOpacity ?? 70}%, transparent)), url("${block.image}")` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            >
              <div
                className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} w-full mx-auto px-margin-desktop grid grid-cols-1 gap-6 relative z-10 py-20 items-center`}
              >
                <div
                  className={getHeroInnerClass(
                    block,
                    `space-y-6 ${block.styles?.textAlign ? "" : "text-center"} mx-auto`,
                  )}
                >
                  {block.badge && (
                    <span className="inline-block bg-primary-container/20 text-inverse-primary px-4 py-1 rounded-full text-label-sm font-label-sm whitespace-pre-line">
                      {block.badge}
                    </span>
                  )}
                  {block.titlePart1 || block.titlePart2 ? (
                    <h1
                      className="font-display-lg text-display-lg leading-tight whitespace-pre-line"
                      style={getTitleStyle(block)}
                    >
                      {block.titlePart1}
                      {block.titlePart1 && block.titlePart2 && " "}
                      {block.titlePart2 && (
                        <span
                          className="text-gold whitespace-pre-line"
                          style={
                            block.titlePart2Color
                              ? { color: block.titlePart2Color }
                              : { color: "#D4AF37" }
                          }
                        >
                          {block.titlePart2}
                        </span>
                      )}
                    </h1>
                  ) : (
                    <h1
                      className="font-display-lg text-display-lg leading-tight whitespace-pre-line"
                      style={getTitleStyle(block)}
                      dangerouslySetInnerHTML={{
                        __html: (block.title || "").replace(
                          "Eğitimde Dostluk, Gelecekte Başarı",
                          'Eğitimde Dostluk, <br class="block md:hidden" /> Gelecekte Başarı',
                        ),
                      }}
                    ></h1>
                  )}
                  {block.subtitle && (
                    <p
                      className={`text-body-lg text-primary-fixed max-w-xl whitespace-pre-line`}
                      dangerouslySetInnerHTML={{ __html: block.subtitle }}
                    ></p>
                  )}
                  {block.buttons && block.buttons.length > 0 && (
                    <div className="flex gap-4 pt-4 whitespace-pre-line">
                      {block.buttons.map((btn: any, i: number) => (
                        <a
                          key={i}
                          href={btn.url || "#"}
                          style={getIndividualButtonStyle(btn)}
                          className={
                            btn.primary
                              ? "bg-primary text-on-primary px-8 py-3 rounded-xl font-label-md text-label-md flex items-center gap-2 hover:opacity-90 transition-opacity"
                              : "border-2 border-white text-white px-8 py-3 rounded-xl font-label-md hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                          }
                        >
                          {btn.label}
                          {btn.icon &&
                            (typeof btn.icon === "string" ? (
                              <IconPreview data={btn.icon}  style={getIconStyle(btn, block)} />
                            ) : null)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
      
        case "bento_academic":
          return (
            <section
              key={index}
              className="py-section-gap bg-surface whitespace-pre-line"
              style={getStyle(block, "container")}
            >
              <div
                className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
              >
                <div
                  className={`${block.styles?.textAlign ? "" : "text-center"} mb-16`}
                >
                  <h2 className="font-headline-xl text-headline-xl text-on-surface mb-4 whitespace-pre-line">
                    {block.title}
                  </h2>
                  <div
                    className="w-24 h-1 bg-gold mx-auto rounded-full whitespace-pre-line"
                    style={{ backgroundColor: "#D4AF37" }}
                  ></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 whitespace-pre-line">
                  {/* LGS Card */}
                  {block.items && block.items[0] && (
                    <div className="bg-surface-card border border-border-subtle rounded-3xl p-8 bento-card relative overflow-hidden transition-all duration-700 hover:-translate-y-2 whitespace-pre-line">
                      <div
                        className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 whitespace-pre-line"
                        style={{ backgroundColor: "rgba(212, 175, 55, 0.05)" }}
                      ></div>
                      <IconPreview
                        data={block.items[0].icon || "school"}
                        className="text-primary text-4xl mb-6 whitespace-pre-line"
                       style={getIconStyle(null, block)} />
                      <h3 className="font-headline-md text-headline-md mb-2 whitespace-pre-line">
                        {block.items[0].title}
                      </h3>
                      <p className="text-on-surface-variant mb-8 whitespace-pre-line">
                        {block.items[0].desc}
                      </p>
                      <div className="space-y-6 whitespace-pre-line">
                        <div className="flex items-end gap-3 whitespace-pre-line">
                          <span
                            className="text-4xl font-extrabold text-gold whitespace-pre-line"
                            style={{ color: "#D4AF37" }}
                          >
                            {block.items[0].stat !== undefined ? block.items[0].stat : block.items[0].statValue}
                          </span>
                          <span className="text-label-md text-on-surface-variant pb-1 whitespace-pre-line">
                            {block.items[0].statLabel}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden whitespace-pre-line">
                          <div
                            className="h-full bg-gold w-[98%] whitespace-pre-line"
                            style={{ backgroundColor: "#D4AF37" }}
                          ></div>
                        </div>
                        <p className="text-label-sm font-label-sm text-primary uppercase whitespace-pre-line">
                          {block.items[0].tag !== undefined ? block.items[0].tag : block.items[0].badge}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* YKS Card */}
                  {block.items && block.items[1] && (
                    <div className="bg-primary text-on-primary rounded-3xl p-8 bento-card relative overflow-hidden transition-all duration-700 hover:-translate-y-2 whitespace-pre-line">
                      <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -mr-24 rotate-45 whitespace-pre-line"></div>
                      <IconPreview
                        data={block.items[1].icon || "star"}
                        className="text-gold text-4xl mb-6 whitespace-pre-line"
                        style={{ ...getIconStyle(null, block), fontVariationSettings: "'FILL' 1",
                          color: "#D4AF37",
                        }}
                      />
                      <h3 className="font-headline-md text-headline-md mb-2 text-white whitespace-pre-line">
                        {block.items[1].title}
                      </h3>
                      <p className="text-primary-fixed mb-8 whitespace-pre-line">
                        {block.items[1].desc}
                      </p>
                      <div className="grid grid-cols-2 gap-6 items-center whitespace-pre-line">
                        {(() => {
                          let stats: any[] = [];
                          if (block.items[1].stat1Label !== undefined || block.items[1].stat1Value !== undefined) {
                            if (block.items[1].stat1Label || block.items[1].stat1Value) {
                              stats.push({ label: block.items[1].stat1Label, value: block.items[1].stat1Value });
                            }
                            if (block.items[1].stat2Label || block.items[1].stat2Value) {
                              stats.push({ label: block.items[1].stat2Label, value: block.items[1].stat2Value });
                            }
                          } else {
                            stats = block.items[1].stats || [];
                          }
                          return stats.map((stat: any, i: number) => (
                            <div
                              key={i}
                              className="bg-white/10 p-4 rounded-2xl whitespace-pre-line"
                            >
                              <div
                                className="text-2xl font-bold text-gold whitespace-pre-line"
                                style={{ color: "#D4AF37" }}
                              >
                                {stat.value}
                              </div>
                              <div className="text-[10px] opacity-80 uppercase tracking-wider whitespace-pre-line">
                                {stat.label}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                      {block.items[1].buttonText && (
                        <a
                          href={block.items[1].url || "#"}
                          className={`mt-8 block ${block.styles?.textAlign ? "" : "text-center"} w-full py-3 bg-gold text-[#00164f] font-bold rounded-xl hover:opacity-90 transition-opacity`}
                          style={{ backgroundColor: "#D4AF37" }}
                        >
                          {block.items[1].buttonText}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Rankings Card */}
                  {block.items && block.items[2] && (
                    <div className="bg-surface-card border border-border-subtle rounded-3xl p-8 bento-card flex flex-col justify-between transition-all duration-700 hover:-translate-y-2 whitespace-pre-line">
                      <div className="w-full md:w-auto flex-1">
                        <IconPreview
                          data={block.items[2].icon || "analytics"}
                          className="text-primary text-4xl mb-6 whitespace-pre-line"
                         style={getIconStyle(null, block)} />
                        <h3 className="font-headline-md text-headline-md mb-2 whitespace-pre-line">
                          {block.items[2].title}
                        </h3>
                        <p className="text-on-surface-variant mb-6 whitespace-pre-line">
                          {block.items[2].desc}
                        </p>
                      </div>
                      <ul className="space-y-4 whitespace-pre-line">
                        {(() => {
                          let list = [];
                          if (block.items[2].listString !== undefined) {
                            list = block.items[2].listString.split('\n').filter((x: string) => x.trim());
                          } else {
                            list = block.items[2].listItems || block.items[2].list || [];
                          }
                          return list.map(
                            (listItem: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-center gap-3 whitespace-pre-line"
                              >
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 whitespace-pre-line"
                                  style={{
                                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                                  }}
                                >
                                  <span
                                    className="material-symbols-outlined text-gold text-lg whitespace-pre-line"
                                    translate="no"
                                    aria-hidden="true"
                                    style={{ color: "#D4AF37" }}
                                  >
                                    check_circle
                                  </span>
                                </div>
                                <span className="font-body-md text-body-md whitespace-pre-line">
                                  {listItem}
                                </span>
                              </li>
                            )
                          );
                        })()}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );

      
        case "high_school_programs":
          return (
            <section
              key={index}
              className="py-section-gap bg-surface whitespace-pre-line"
              style={getStyle(block, "container")}
            >
              <div
                className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
              >
                <div
                  className={`${block.styles?.textAlign ? "" : "text-center"} mb-16`}
                >
                  <h2 className="font-headline-xl text-headline-xl text-on-surface mb-4 whitespace-pre-line">
                    {block.title || "Programlar"}
                  </h2>
                  {block.subtitle && (
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto whitespace-pre-line">
                      {block.subtitle}
                    </p>
                  )}
                  <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full whitespace-pre-line"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 whitespace-pre-line">
                  {(block.items || []).map((item: any, i: number) => {
                    const isPrimary = i % 2 === 0;
                    return (
                      <div
                        key={i}
                        className={`${isPrimary ? "bg-primary text-on-primary" : "bg-surface-card border border-border-subtle"} rounded-3xl p-8 relative overflow-hidden transition-all duration-700 hover:-translate-y-2 flex flex-col whitespace-pre-line`}
                      >
                        {isPrimary && (
                          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mb-32 -mr-32 whitespace-pre-line"></div>
                        )}
                        <div className="mb-6 whitespace-pre-line">
                          <IconPreview
                            data={item.icon || "school"}
                            className={`${isPrimary ? "text-gold" : "text-primary"} text-4xl whitespace-pre-line`}
                            style={isPrimary ? { color: "#D4AF37" } : getIconStyle(null, block)}
                          />
                        </div>
                        <h3 className={`font-headline-md text-headline-md mb-4 ${isPrimary ? "text-white" : "text-on-surface"} whitespace-pre-line`}>
                          {item.title}
                        </h3>
                        <p className={`${isPrimary ? "text-primary-fixed" : "text-on-surface-variant"} mb-8 flex-grow whitespace-pre-line`}>
                          {item.subtitle || item.desc}
                        </p>
                        
                        {item.image && (
                          <div className="mb-8 rounded-2xl overflow-hidden aspect-video whitespace-pre-line">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover whitespace-pre-line" />
                          </div>
                        )}

                        <ul className="space-y-4 mb-8 whitespace-pre-line">
                          {(() => {
                            let list = item.list || [];
                            if (list.length === 0 && item.listString) {
                              list = item.listString.split('\n').filter((x: string) => x.trim());
                            }
                            return list.map((listItem: string, j: number) => (
                              <li key={j} className="flex items-start gap-3 whitespace-pre-line">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isPrimary ? "bg-white/10" : "bg-primary/10"}`}>
                                  <span className={`material-symbols-outlined text-sm ${isPrimary ? "text-gold" : "text-primary"}`} style={isPrimary ? { color: "#D4AF37" } : {}}>check</span>
                                </div>
                                <span className={`font-body-md text-body-md ${isPrimary ? "text-white" : "text-on-surface-variant"} whitespace-pre-line`}>
                                  {listItem}
                                </span>
                              </li>
                            ));
                          })()}
                        </ul>

                        {(item.buttonText || item.url) && (
                          <a
                            href={item.url || "#"}
                            className={`inline-flex items-center gap-2 font-label-lg text-label-lg mt-auto ${isPrimary ? "text-gold hover:text-white" : "text-primary hover:text-primary-dark"} transition-colors whitespace-pre-line`}
                            style={isPrimary ? { color: "#D4AF37" } : {}}
                          >
                            {item.buttonText || "Detaylı Bilgi"}
                            <span className="material-symbols-outlined text-lg" translate="no" aria-hidden="true">arrow_forward</span>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

      default:
        if (block.type === "achievements_hero") {
        return (
          <section
            key={block.id}
            className="relative text-white overflow-hidden min-h-[600px] flex items-center whitespace-pre-line"
              
            style={
              block.image
                ? {
                    backgroundImage: block.image ? `linear-gradient(color-mix(in srgb, ${block.styles?.innerBgColor || "#00164f"} ${block.styles?.innerBgOpacity ?? 70}%, transparent), color-mix(in srgb, ${block.styles?.innerBgColor || "#00164f"} ${block.styles?.innerBgOpacity ?? 70}%, transparent)), url("${block.image}")` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                  }
                : {}
            }
          >
            <div
              className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-7xl"} mx-auto px-8 grid grid-cols-1 gap-6 relative z-10 py-20 items-center w-full`}
            >
              <div
                className={`space-y-6 ${block.styles?.textAlign ? "" : "text-center"} mx-auto`}
              >
                {block.badge && (
                  <span className="inline-block bg-[#3f68e4]/20 text-[#b6c4ff] px-4 py-1 rounded-full text-[12px] font-bold tracking-[0.05em] whitespace-pre-line">
                    {block.badge}
                  </span>
                )}
                <h1
                  className="font-bold text-2xl md:text-4xl leading-tight tracking-[-0.02em] whitespace-pre-line"
                  style={getTitleStyle(block)}
                >
                  {block.titlePart1}{" "}
                  {block.titlePart2 && (
                    <span style={{ color: block.titlePart2Color || "#D4AF37" }}>
                      {block.titlePart2}
                    </span>
                  )}
                </h1>
                {block.subtitle && (
                  <p
                    className={`text-lg md:text-[18px] text-[#dce1ff] max-w-xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}
                    style={getSubtitleStyle(block)}
                  >
                    {block.subtitle}
                  </p>
                )}

                {block.buttons && block.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-4 pt-4 justify-center whitespace-pre-line">
                    {block.buttons.map((btn: any, i: number) => (
                      <a
                        key={i}
                        href={btn.url || "#"}
                        style={getIndividualButtonStyle(btn)}
                        className="px-8 py-3 rounded-xl text-[14px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-pre-line"
                      >
                        {btn.label}
                        {btn.icon &&
                          (typeof btn.icon === "string" &&
                          btn.icon === btn.icon.toLowerCase() ? (
                            <IconPreview
                              data={btn.icon}
                              className="text-[1.1em] whitespace-pre-line"
                             style={getIconStyle(btn, block)} />
                          ) : (
                            <IconPreview
                              data={btn.icon}
                              className="w-[1.1em] h-[1.1em] whitespace-pre-line"
                             style={getIconStyle(btn, block)} />
                          ))}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "achievements_academic_bento") {
        return (
          <section
            key={block.id}
            className="py-20 bg-[#faf8ff] whitespace-pre-line"
            style={getStyle(block, "")}
          >
            <div
              className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-7xl"} mx-auto px-8`}
            >
              <div
                className={`${block.styles?.textAlign ? "" : "text-center"} mb-16`}
              >
                <h2 className="font-bold text-2xl md:text-3xl text-[#1a1b23] mb-4 whitespace-pre-line">
                  {block.title}
                </h2>
                <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full whitespace-pre-line"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 whitespace-pre-line">
                {(block.items || []).map((item: any, idx: number) => {
                  if (item.style === "primary") {
                    return (
                      <div
                        key={idx}
                        className={getCardClass(
                          item,
                          "bg-[#1d4eca] text-white rounded-3xl p-8 relative overflow-hidden transition-all duration-700 hover:-translate-y-2",
                        )}
                        style={getCardStyle(item, block)}
                      >
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -mr-24 rotate-45 whitespace-pre-line"></div>
                        <div className="mb-6 whitespace-pre-line">
                          {typeof item.icon === "object" ||
                          (typeof item.icon === "string" &&
                            item.icon !== item.icon.toLowerCase()) ? (
                            <IconPreview
                              data={item.icon}
                              className="text-[#D4AF37] w-10 h-10 whitespace-pre-line"
                             style={getIconStyle(item, block)} />
                          ) : (
                            <IconPreview
                              data={item.icon || "star"}
                              className="text-[#D4AF37] text-4xl whitespace-pre-line"
                              style={{ ...getIconStyle(item, block), fontVariationSettings: "'FILL' 1" }}
                            />
                          )}
                        </div>
                        <h3 className="font-bold text-[24px] mb-2 text-white whitespace-pre-line">
                          {item.title}
                        </h3>
                        <p
                          className="text-[#dce1ff] mb-8 whitespace-pre-line"
                          style={getCardDescStyle(item, block)}
                        >
                          {item.subtitle || item.desc}
                        </p>

                        {item.stats && item.stats.length > 0 && (
                          <div className="grid grid-cols-2 gap-6 items-center whitespace-pre-line">
                            {(Array.isArray(item.stats) ? item.stats : (item.stats || "").split("\n").filter((x:string)=>x.trim()).map((x:string) => { const [val, lab] = x.split("|"); return {value: val?.trim() || "", label: lab?.trim() || ""} })).map((st: any, i: number) => (
                              <div
                                key={i}
                                className="bg-white/10 p-4 rounded-2xl whitespace-pre-line"
                              >
                                <div className="text-2xl font-bold text-[#D4AF37] whitespace-pre-line">
                                  {st.value}
                                </div>
                                <div className="text-[10px] opacity-80 uppercase tracking-wider whitespace-pre-line">
                                  {st.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {item.buttonText && (
                          <a
                            href={item.url || "#"}
                            className={`mt-8 block w-full ${block.styles?.textAlign ? "" : "text-center"} py-3 bg-[#D4AF37] text-[#00164f] font-bold rounded-xl hover:bg-[#D4AF37]/90 transition-colors`}
                          >
                            {item.buttonText}
                          </a>
                        )}
                      </div>
                    );
} else if (item.style === "list") {
                    return (
                      <div
                        key={idx}
                        className={getCardClass(
                          item,
                          "bg-white border border-[#e2e8f0] rounded-3xl p-8 flex flex-col justify-between transition-all duration-700 hover:-translate-y-2",
                        )}
                        style={getCardStyle(item, block)}
                      >
                        <div>
                          <div className="mb-6 whitespace-pre-line">
                            {typeof item.icon === "object" ||
                            (typeof item.icon === "string" &&
                              item.icon !== item.icon.toLowerCase()) ? (
                              <IconPreview
                                data={item.icon}
                                className="text-[#1d4eca] w-10 h-10 whitespace-pre-line"
                               style={getIconStyle(item, block)} />
                            ) : (
                              <IconPreview
                                data={item.icon || "analytics"}
                                className="text-[#1d4eca] text-4xl whitespace-pre-line"
                               style={getIconStyle(item, block)} />
                            )}
                          </div>
                          <h3 className="font-bold text-[24px] mb-2 whitespace-pre-line">
                            {item.title}
                          </h3>
                          <p
                            className="text-[#434654] mb-6 whitespace-pre-line"
                            style={getCardDescStyle(item, block)}
                          >
                            {item.subtitle || item.desc}
                          </p>
                        </div>
                        {item.listItems && item.listItems.length > 0 && (
                          <ul className="space-y-4 whitespace-pre-line">
                            {(Array.isArray(item.listItems) ? item.listItems : (item.listItems || "").split("\n").filter((x:string)=>x.trim())).map((li: any, i: number) => (
                              <li
                                key={i}
                                className="flex items-center gap-3 whitespace-pre-line"
                              >
                                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0 whitespace-pre-line">
                                  <span
                                    className="material-symbols-outlined text-[#D4AF37] text-lg whitespace-pre-line"
                                    translate="no"
                                    aria-hidden="true"
                                  >
                                    check_circle
                                  </span>
                                </div>
                                <span className="text-[14px] font-semibold whitespace-pre-line">
                                  {li}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
} else {
                    return (
                      <div
                        key={idx}
                        className={getCardClass(
                          item,
                          "bg-white border border-[#e2e8f0] rounded-3xl p-8 relative overflow-hidden transition-all duration-700 hover:-translate-y-2",
                        )}
                        style={getCardStyle(item, block)}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -mr-16 -mt-16 whitespace-pre-line"></div>
                        <div className="mb-6 whitespace-pre-line">
                          {typeof item.icon === "object" ||
                          (typeof item.icon === "string" &&
                            item.icon !== item.icon.toLowerCase()) ? (
                            <IconPreview
                              data={item.icon}
                              className="text-[#1d4eca] w-10 h-10 whitespace-pre-line"
                             style={getIconStyle(item, block)} />
                          ) : (
                            <IconPreview
                              data={item.icon || "school"}
                              className="text-[#1d4eca] text-4xl whitespace-pre-line"
                             style={getIconStyle(item, block)} />
                          )}
                        </div>
                        <h3 className="font-bold text-[24px] mb-2 whitespace-pre-line">
                          {item.title}
                        </h3>
                        <p
                          className="text-[#434654] mb-8 whitespace-pre-line"
                          style={getCardDescStyle(item, block)}
                        >
                          {item.subtitle || item.desc}
                        </p>
                        <div className="space-y-6 whitespace-pre-line">
                          {item.statValue && (
                            <div className="flex flex-col gap-1 whitespace-pre-line">
                              <div className="flex items-end gap-3 whitespace-pre-line">
                                <span className="text-4xl font-extrabold text-[#D4AF37] whitespace-pre-line">
                                  {item.statValue}
                                </span>
                                {item.statLabel && (
                                  <span className="text-[14px] font-semibold text-[#434654] pb-1 whitespace-pre-line">
                                    {item.statLabel}
                                  </span>
                                )}
                              </div>
                              <div className="h-2 w-full bg-[#ededf8] rounded-full overflow-hidden whitespace-pre-line">
                                <div className="h-full bg-[#D4AF37] w-[98%] whitespace-pre-line"></div>
                              </div>
                            </div>
                          )}
                          {item.badge && (
                            <p className="text-[12px] font-bold tracking-[0.05em] text-[#1d4eca] whitespace-pre-line">
                              {item.badge}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "achievements_grid" || block.type === "achievements_social_gallery") {
        return (
          <section
            key={block.id}
            className="py-20 bg-white whitespace-pre-line"
            style={getStyle(block, "")}
          >
            <div
              className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-7xl"} mx-auto px-8`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-6 mb-12 whitespace-pre-line">
                <div className={getHeroInnerClass(block, "max-w-2xl")}>
                  <h2 className="font-bold text-2xl md:text-3xl text-[#1a1b23] mb-4 whitespace-pre-line">
                    {block.title}
                  </h2>
                  {block.subtitle && (
                    <p className="text-[18px] text-[#434654] whitespace-pre-line">
                      {block.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 whitespace-pre-line">
                  <button className="p-3 rounded-full border border-[#e2e8f0] hover:bg-[#faf8ff] transition-colors flex items-center justify-center whitespace-pre-line">
                    <span
                      className="material-symbols-outlined whitespace-pre-line"
                      translate="no"
                      aria-hidden="true"
                    >
                      chevron_left
                    </span>
                  </button>
                  <button className="p-3 rounded-full border border-[#e2e8f0] bg-[#1d4eca] text-white hover:opacity-90 transition-colors flex items-center justify-center whitespace-pre-line">
                    <span
                      className="material-symbols-outlined whitespace-pre-line"
                      translate="no"
                      aria-hidden="true"
                    >
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 whitespace-pre-line">
                {(block.items || []).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="group cursor-pointer whitespace-pre-line"
                  >
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative whitespace-pre-line">
                      {item.image ? (
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 whitespace-pre-line"
                          src={item.image}
                          alt={item.title}
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200 whitespace-pre-line"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 whitespace-pre-line">
                        <p className="text-white text-[12px] font-bold tracking-[0.05em] whitespace-pre-line">
                          {item.hoverText}
                        </p>
                      </div>
                    </div>
                    <h4 className="font-bold text-lg mb-1 text-slate-900 whitespace-pre-line">
                      {item.title}
                    </h4>
                    <p
                      className="text-[#434654] text-[12px] font-bold tracking-[0.05em] whitespace-pre-line"
                      style={getCardDescStyle(item, block)}
                    >
                      {item.subtitle || item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "achievements_science" || block.type === "achievements_science_projects") {
        return (
          <section
            key={block.id}
            className="py-20 bg-[#f3f2fd] overflow-hidden whitespace-pre-line"
            style={getStyle(block, "")}
          >
            <div
              className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-7xl"} mx-auto px-8`}
            >
              <div className="rounded-[40px] p-8 md:p-20 relative overflow-hidden text-white whitespace-pre-line"
                  style={{
                    backgroundColor: block.styles?.innerBgColor 
                      ? `color-mix(in srgb, ${block.styles.innerBgColor} ${block.styles.innerBgOpacity ?? 100}%, transparent)` 
                      : `color-mix(in srgb, #0f172a ${block.styles?.innerBgOpacity ?? 100}%, transparent)`
                  }}>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1d4eca]/10 rounded-full blur-[100px] -mr-[250px] -mt-[250px] whitespace-pre-line"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center whitespace-pre-line">
                  <div>
                    {block.badge && (
                      <span className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-1 rounded-full text-[12px] font-bold tracking-[0.05em] mb-6 whitespace-pre-line">
                        {block.badge}
                      </span>
                    )}
                    <h2 className="font-bold text-2xl md:text-3xl mb-6 leading-tight whitespace-pre-line">
                      {block.title}
                    </h2>
                    {block.subtitle && (
                      <p className="text-[#dce1ff] mb-10 text-lg whitespace-pre-line">
                        {block.subtitle}
                      </p>
                    )}

                    <div className="space-y-6 whitespace-pre-line">
                      {(block.items || []).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className={getCardClass(
                            item,
                            "flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#D4AF37]/50 transition-colors",
                          )}
                          style={getCardStyle(item, block)}
                        >
                          <div className="shrink-0 mt-1 whitespace-pre-line">
                            {typeof item.icon === "object" ||
                            (typeof item.icon === "string" &&
                              item.icon !== item.icon.toLowerCase()) ? (
                              <IconPreview
                                data={item.icon}
                                className="text-[#D4AF37] w-8 h-8 whitespace-pre-line"
                               style={getIconStyle(item, block)} />
                            ) : (
                              <IconPreview
                                data={item.icon || "science"}
                                className="text-[#D4AF37] text-3xl whitespace-pre-line"
                               style={getIconStyle(item, block)} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-1 whitespace-pre-line">
                              {item.title}
                            </h4>
                            <p
                              className="text-sm opacity-70 leading-relaxed whitespace-pre-line"
                              style={getCardDescStyle(item, block)}
                            >
                              {item.subtitle || item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative mt-10 md:mt-0 whitespace-pre-line">
                    {block.image && (
                      <img
                        className="rounded-3xl shadow-2xl border border-white/10 w-full object-cover aspect-video whitespace-pre-line"
                        src={block.image}
                        alt={block.title}
                      />
                    )}
                    {block.imageBadge && (
                      <div className="absolute -top-4 -right-4 bg-[#D4AF37] text-[#00164f] p-4 rounded-xl font-bold shadow-lg whitespace-pre-line">
                        {block.highlightTag || block.imageBadge}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "menu_hero") {
        return (
          <section
            key={index}
            className="relative h-[400px] flex items-center overflow-hidden whitespace-pre-line"
            style={getStyle(block, "container")}
          >
            {block.image && (
              <img
                alt=""
                className="absolute inset-0 w-full h-full object-cover whitespace-pre-line"
                src={block.image}
                style={getImageStyle(block, "image", index)}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 whitespace-pre-line"></div>
            <div
              className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop relative z-10 w-full`}
            >
              <div className={getHeroInnerClass(block, "max-w-2xl")}>
                {block.badge && (
                  <span
                    className="inline-block py-1 px-3 rounded-full bg-primary/20 text-[#b6c4ff] text-sm font-semibold mb-4 backdrop-blur-sm border border-white/10 whitespace-pre-line"
                    style={getBadgeStyle(block)}
                  >
                    {block.badge}
                  </span>
                )}
                <h1
                  className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight whitespace-pre-line"
                  style={getTitleStyle(block)}
                >
                  {block.title}
                </h1>
                {block.subtitle && (
                  <p className="text-lg lg:text-xl text-white/80 font-light leading-relaxed whitespace-pre-line">
                    {block.subtitle}
                  </p>
                )}
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "menu_calendar") {
        return (
          <section
            key={index}
            className="py-12 bg-surface-background whitespace-pre-line"
            style={getStyle(block, "container")}
          >
            <div
              className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
            >
              <div className="w-full md:w-auto flex-1">
                <h2
                  className="text-2xl font-bold text-slate-800 whitespace-pre-line"
                  style={getTitleStyle(block)}
                >
                  {block.title}
                </h2>
                {block.subtitle && (
                  <p className="text-slate-500 whitespace-pre-line">
                    {block.subtitle}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 whitespace-pre-line">
                <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm whitespace-pre-line">
                  <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-pre-line">
                    <span
                      className="material-symbols-outlined text-slate-500 whitespace-pre-line"
                      translate="no"
                      aria-hidden="true"
                    >
                      chevron_left
                    </span>
                  </button>
                  <span
                    className={`px-6 font-bold text-slate-800 min-w-[140px] ${block.styles?.textAlign ? "" : "text-center"}`}
                  >
                    {block.month || "Ekim 2023"}
                  </span>
                  <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-pre-line">
                    <span
                      className="material-symbols-outlined text-slate-500 whitespace-pre-line"
                      translate="no"
                      aria-hidden="true"
                    >
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
            >
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden overflow-x-auto whitespace-pre-line">
                <div className="min-w-[800px] whitespace-pre-line">
                  <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 whitespace-pre-line">
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-slate-600 uppercase tracking-widest hidden md:block`}
                    >
                      Pazartesi
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-slate-600 uppercase tracking-widest hidden md:block`}
                    >
                      Salı
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-slate-600 uppercase tracking-widest hidden md:block`}
                    >
                      Çarşamba
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-slate-600 uppercase tracking-widest hidden md:block`}
                    >
                      Perşembe
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-slate-600 uppercase tracking-widest hidden md:block`}
                    >
                      Cuma
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-primary uppercase tracking-widest hidden md:block`}
                    >
                      Cumartesi
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-red-500 uppercase tracking-widest hidden md:block`}
                    >
                      Pazar
                    </div>

                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-slate-600 uppercase tracking-widest md:hidden`}
                    >
                      Pzt
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-slate-600 uppercase tracking-widest md:hidden`}
                    >
                      Sal
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-slate-600 uppercase tracking-widest md:hidden`}
                    >
                      Çar
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-slate-600 uppercase tracking-widest md:hidden`}
                    >
                      Per
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-slate-600 uppercase tracking-widest md:hidden`}
                    >
                      Cum
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-primary uppercase tracking-widest md:hidden`}
                    >
                      Cmt
                    </div>
                    <div
                      className={`py-5 ${block.styles?.textAlign ? "" : "text-center"} text-xs font-black text-red-500 uppercase tracking-widest md:hidden`}
                    >
                      Paz
                    </div>
                  </div>

                  <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 whitespace-pre-line">
                    {block.days?.map((day: any, i: number) => {
                      if (!day.isCurrentMonth) {
                        return (
                          <div
                            key={i}
                            className="p-2 md:p-4 bg-slate-50/50 min-h-[120px] md:min-h-[220px] whitespace-pre-line"
                          >
                            <span className="text-slate-400 font-medium opacity-50 text-xs md:text-base whitespace-pre-line">
                              {day.date}
                            </span>
                          </div>
                        );
                      }

                      if (day.isClosed) {
                        return (
                          <div
                            key={i}
                            className="p-2 md:p-4 hover:bg-slate-50 transition-colors group min-h-[120px] md:min-h-[220px] bg-red-50/30 whitespace-pre-line"
                          >
                            <div className="flex flex-col md:flex-row md:justify-between items-start gap-1 mb-3 whitespace-pre-line">
                              <span className="text-sm md:text-xl font-black text-slate-800 whitespace-pre-line">
                                {day.date}
                              </span>
                              <span
                                className={`text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-red-100 text-red-600 uppercase ${block.styles?.textAlign ? "" : "text-center"}`}
                              >
                                Kapalı
                              </span>
                            </div>
                          </div>
                        );
                      }

                      if (day.isToday) {
                        return (
                          <div
                            key={i}
                            className="p-2 md:p-4 bg-primary/5 transition-colors ring-1 md:ring-2 ring-inset ring-primary relative min-h-[120px] md:min-h-[220px] whitespace-pre-line"
                          >
                            <div className="absolute -top-1 -right-1 whitespace-pre-line">
                              <span className="flex h-3 w-3 md:h-4 md:w-4 whitespace-pre-line">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 whitespace-pre-line"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-primary whitespace-pre-line"></span>
                              </span>
                            </div>
                            <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-1 mb-3 whitespace-pre-line">
                              <span className="text-sm md:text-xl font-black text-primary whitespace-pre-line">
                                {day.date}
                              </span>
                              <span
                                className={`text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-primary text-white uppercase ${block.styles?.textAlign ? "" : "text-center"} w-full xl:w-auto`}
                              >
                                Bugün
                              </span>
                            </div>
                            <ul className="space-y-1 md:space-y-2 whitespace-pre-line">
                              {(Array.isArray(day.meals)
                                ? day.meals
                                : typeof day.meals === "string"
                                  ? day.meals
                                      .split(/[,\n]+/)
                                      .map((s: string) => s.trim())
                                      .filter(Boolean)
                                  : []
                              )?.map((meal: string, mIndex: number) => (
                                <li
                                  key={mIndex}
                                  className="text-[10px] md:text-sm font-bold text-slate-800 flex items-start gap-1 md:gap-2 leading-tight whitespace-pre-line"
                                >
                                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary mt-1 md:mt-1.5 shrink-0 whitespace-pre-line"></span>{" "}
                                  {meal}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={i}
                          className="p-2 md:p-4 hover:bg-slate-50 transition-colors group min-h-[120px] md:min-h-[220px] whitespace-pre-line"
                        >
                          <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-1 mb-3 whitespace-pre-line">
                            <span className="text-sm md:text-xl font-black text-slate-800 whitespace-pre-line">
                              {day.date}
                            </span>
                            {day.kcal && (
                              <span
                                className={`text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9] uppercase ${block.styles?.textAlign ? "" : "text-center"} w-full xl:w-auto`}
                              >
                                {day.kcal}
                              </span>
                            )}
                          </div>
                          <ul className="space-y-1 md:space-y-2 whitespace-pre-line">
                            {(Array.isArray(day.meals)
                              ? day.meals
                              : typeof day.meals === "string"
                                ? day.meals
                                    .split(/[,\n]+/)
                                    .map((s: string) => s.trim())
                                    .filter(Boolean)
                                : []
                            )?.map((meal: string, mIndex: number) => (
                              <li
                                key={mIndex}
                                className="text-[10px] md:text-sm text-slate-700 flex items-start gap-1 md:gap-2 leading-tight whitespace-pre-line"
                              >
                                <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary mt-1 md:mt-1.5 shrink-0 whitespace-pre-line"></span>{" "}
                                {meal}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}

                    {Array.from({
                      length: Math.max(0, 35 - (block.days?.length || 0)),
                    }).map((_, i) => (
                      <div
                        key={"empty-" + i}
                        className="p-2 md:p-4 bg-slate-50/50 min-h-[120px] md:min-h-[220px] whitespace-pre-line"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "menu_features") {
        return (
          <section
            key={index}
            className={`py-8 bg-surface-background ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop`}
            style={getStyle(block, "container")}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 whitespace-pre-line">
              {block.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm flex items-center gap-4 whitespace-pre-line"
                  style={getCardStyle(item, block)}
                >
                  {item.icon && (
                    <IconPreview
                      data={item.icon}
                      className="text-4xl whitespace-pre-line"
                      style={{ ...getIconStyle(item, block), color: item.iconColor || "var(--color-primary)",
                      }}
                    />
                  )}
                  <div>
                    <h4
                      className="font-bold text-slate-800 whitespace-pre-line"
                      style={getCardTitleStyle(item, block)}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-sm text-slate-500 whitespace-pre-line"
                      style={getCardDescStyle(item, block)}
                    >
                      {item.subtitle || item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }
      if (block.type === "academic_calendar_hero") {
        return (
          <section
            key={index}
            className="relative bg-primary text-on-primary overflow-hidden whitespace-pre-line"
            style={getStyle(block, "container")}
          >
            <div className="absolute inset-0 z-0 whitespace-pre-line">
              <div
                className="w-full h-full bg-cover bg-center opacity-30 mix-blend-multiply whitespace-pre-line"
                style={getImageStyle(block, "image", index)}
              />
            </div>
            <div
              className={`relative z-10 ${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop py-section-gap flex flex-col items-center ${block.styles?.textAlign ? "" : "text-center"}`}
            >
              <h1
                className="font-display-lg text-display-lg text-on-primary mb-6 whitespace-pre-line"
                style={getTitleStyle(block)}
              >
                {block.title}
              </h1>
              {block.subtitle && (
                <p
                  className={`font-body-lg text-body-lg text-on-primary-container max-w-2xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}
                  style={getSubtitleStyle(block)}
                >
                  {block.subtitle}
                </p>
              )}
            </div>
          </section>
        );
      }

      if (block.type === "academic_calendar") {
        return (
          <div
            key={index}
            className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop py-section-gap`}
            style={getStyle(block, "container")}
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-surface-card p-6 rounded-xl border border-border-subtle shadow-sm whitespace-pre-line">
              <div className="flex items-center space-x-6 mb-4 md:mb-0 whitespace-pre-line">
                <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface flex items-center justify-center whitespace-pre-line">
                  <span
                    className="material-symbols-outlined whitespace-pre-line"
                    translate="no"
                    aria-hidden="true"
                  >
                    chevron_left
                  </span>
                </button>
                <h2 className="font-headline-xl text-headline-xl text-on-surface whitespace-pre-line">
                  {block.month || "Ekim 2023"}
                </h2>
                <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface flex items-center justify-center whitespace-pre-line">
                  <span
                    className="material-symbols-outlined whitespace-pre-line"
                    translate="no"
                    aria-hidden="true"
                  >
                    chevron_right
                  </span>
                </button>
              </div>
              <div className="flex space-x-4 whitespace-pre-line">
                {block.pdfUrl && (
                  <SmartLink
                    url={block.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 border-2 border-primary text-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/5 transition-colors whitespace-pre-line"
                  >
                    <span
                      className="material-symbols-outlined text-xl whitespace-pre-line"
                      translate="no"
                      aria-hidden="true"
                    >
                      picture_as_pdf
                    </span>
                    <span>{block.pdfButtonText || "PDF İndir"}</span>
                  </SmartLink>
                )}
              </div>
            </div>

            <div className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden shadow-sm mb-section-gap overflow-x-auto whitespace-pre-line">
              <div className="min-w-[800px] whitespace-pre-line">
                <div className="grid grid-cols-7 border-b border-border-subtle bg-surface-container-low whitespace-pre-line">
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant hidden md:block`}
                  >
                    Pazartesi
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant hidden md:block`}
                  >
                    Salı
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant hidden md:block`}
                  >
                    Çarşamba
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant hidden md:block`}
                  >
                    Perşembe
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant hidden md:block`}
                  >
                    Cuma
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant text-error hidden md:block`}
                  >
                    Cumartesi
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant text-error hidden md:block`}
                  >
                    Pazar
                  </div>

                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant md:hidden`}
                  >
                    Pzt
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant md:hidden`}
                  >
                    Sal
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant md:hidden`}
                  >
                    Çar
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant md:hidden`}
                  >
                    Per
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant md:hidden`}
                  >
                    Cum
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant text-error md:hidden`}
                  >
                    Cmt
                  </div>
                  <div
                    className={`py-4 ${block.styles?.textAlign ? "" : "text-center"} font-label-md text-label-md text-on-surface-variant text-error md:hidden`}
                  >
                    Paz
                  </div>
                </div>

                <div className="grid grid-cols-7 border-l border-t border-border-subtle whitespace-pre-line">
                  {block.days?.map((day: any, i: number) => {
                    if (!day.isCurrentMonth) {
                      return (
                        <div
                          key={i}
                          className="min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-border-subtle bg-surface-container relative whitespace-pre-line"
                        >
                          <span className="font-label-md text-label-md text-on-surface-variant opacity-50 absolute top-1 md:top-2 right-1 md:right-2 whitespace-pre-line">
                            {day.date}
                          </span>
                        </div>
                      );
                    }

                    if (day.isWeekend) {
                      return (
                        <div
                          key={i}
                          className="min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-border-subtle bg-surface-container-high relative whitespace-pre-line"
                        >
                          <span className="font-label-md text-label-md text-on-surface-variant opacity-50 absolute top-1 md:top-2 right-1 md:right-2 whitespace-pre-line">
                            {day.date}
                          </span>
                          <div
                            className={`mt-8 ${block.styles?.textAlign ? "" : "text-center"} text-on-surface-variant font-caption text-[8px] md:text-caption opacity-50`}
                          >
                            Hafta Sonu
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={i}
                        className={`min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-border-subtle relative group hover:bg-surface-container-lowest transition-colors ${day.isToday ? "ring-2 ring-primary ring-inset" : ""} ${day.bgColor ? day.bgColor : "bg-surface-card"}`}
                      >
                        {day.isToday && (
                          <span className="absolute top-1 md:top-2 left-1 md:left-2 bg-primary text-on-primary font-caption text-[8px] md:text-caption px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-pre-line">
                            Bugün
                          </span>
                        )}
                        <span
                          className={`font-label-md text-label-md absolute top-1 md:top-2 right-1 md:right-2 ${day.isToday ? "text-primary font-bold" : "text-on-surface"}`}
                        >
                          {day.date}
                        </span>

                        <div className="mt-6 md:mt-8 space-y-1 whitespace-pre-line">
                          {day.events && day.events.length > 0 ? (
                            day.events.map((event: any, eIndex: number) => (
                              <div
                                key={eIndex}
                                className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[8px] md:text-[10px] font-bold leading-tight truncate border ${event.colorClass || "bg-surface-container text-on-surface border-border-subtle"}`}
                              >
                                {event.title}
                                {event.subtitle && (
                                  <>
                                    <br />
                                    <span
                                      className={`font-normal opacity-90 ${block.styles?.textAlign ? "" : "text-center"} block`}
                                    >
                                      {event.subtitle}
                                    </span>
                                  </>
                                )}
                              </div>
                            ))
                          ) : day.eventTitle ? (
                            <div
                              className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[8px] md:text-[10px] font-bold leading-tight truncate border ${day.eventColorClass || "bg-surface-container text-on-surface border-border-subtle"}`}
                            >
                              {day.eventTitle}
                              {day.eventSubtitle && (
                                <>
                                  <br />
                                  <span
                                    className={`font-normal opacity-90 ${block.styles?.textAlign ? "" : "text-center"} block`}
                                  >
                                    {day.eventSubtitle}
                                  </span>
                                </>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {block.legends && block.legends.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter whitespace-pre-line">
                {block.legends.map((legend: any, i: number) => (
                  <div
                    key={i}
                    className="bg-surface-card border border-border-subtle rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow whitespace-pre-line"
                    style={getCardStyle(legend, block)}
                  >
                    <div className="flex items-center space-x-3 mb-4 whitespace-pre-line">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center ${legend.iconBgClass || "bg-surface-container"}`}
                      >
                        <IconPreview
                          data={legend.icon}
                          className={`text-sm ${legend.iconColorClass || "text-on-surface"}`}
                          style={{ ...getIconStyle(legend, block), fontVariationSettings: "'FILL' 1" }}
                        />
                      </div>
                      <h3
                        className="font-headline-md text-headline-md text-on-surface whitespace-pre-line"
                        style={getCardTitleStyle(legend, block)}
                      >
                        {legend.title}
                      </h3>
                    </div>
                    <p
                      className="font-body-md text-body-md text-on-surface-variant mb-4 whitespace-pre-line"
                      style={getCardDescStyle(legend, block)}
                    >
                      {legend.desc}
                    </p>
                    {legend.url && !legend.hideButton && (
                      <SmartLink
                        url={legend.url}
                        className="text-primary font-label-md text-label-md font-bold flex items-center space-x-1 hover:underline whitespace-pre-line"
                      >
                        <span>{legend.buttonText || "İncele"}</span>
                        <span
                          className="material-symbols-outlined text-sm whitespace-pre-line"
                          translate="no"
                          aria-hidden="true"
                        >
                          arrow_forward
                        </span>
                      </SmartLink>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      if (block.type === "tuition_fees") {
        return (
          <main
            key={index}
            className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap bg-surface-background text-on-background min-h-screen whitespace-pre-line"
            style={getStyle(block, "container")}
          >
            

            {/* Pricing Cards */}
            <section className="mb-section-gap whitespace-pre-line">
              <h2 className="font-headline-xl text-headline-xl text-primary mb-8 text-center whitespace-pre-line">
                {block.tableTitle || "Eğitim Kadranları Ücret Tablosu"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter whitespace-pre-line">
                {(block.items || []).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-surface-card rounded-xl border border-border-subtle p-6 flex flex-col relative overflow-hidden group hover:bg-surface-container-low transition-colors duration-300 whitespace-pre-line"
                    style={getCardStyle(item, block)}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors duration-300 whitespace-pre-line"></div>
                    <div className="flex items-center gap-3 mb-6 whitespace-pre-line">
                      <IconPreview
                        data={item.icon || "school"}
                        className="text-primary text-3xl"
                        style={{ ...getIconStyle(item, block), fontVariationSettings: "'FILL' 1" }}
                      />
                      <h3
                        className="font-headline-md text-headline-md text-text-main whitespace-pre-line"
                        style={getCardTitleStyle(item, block)}
                      >
                        {item.title}
                      </h3>
                    </div>

                    <div className="space-y-4 flex-grow whitespace-pre-line">
                      <div className="flex justify-between items-center border-b border-border-subtle pb-2 whitespace-pre-line">
                        <span
                          className="font-body-md text-body-md text-text-muted whitespace-pre-line"
                          style={getCardDescStyle(item, block)}
                        >
                          Eğitim Ücreti
                        </span>
                        <span
                          className="font-label-md text-label-md text-text-main whitespace-pre-line"
                          style={getCardTitleStyle(item, block)}
                        >
                          {item.tuitionFee}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border-subtle pb-2 whitespace-pre-line">
                        <span
                          className="font-body-md text-body-md text-text-muted whitespace-pre-line"
                          style={getCardDescStyle(item, block)}
                        >
                          Yemek Ücreti
                        </span>
                        <span
                          className="font-label-md text-label-md text-text-main whitespace-pre-line"
                          style={getCardTitleStyle(item, block)}
                        >
                          {item.foodFee}
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t-2 border-primary/20 whitespace-pre-line">
                      <div className="flex justify-between items-end whitespace-pre-line">
                        <span
                          className="font-body-lg text-body-lg text-text-main whitespace-pre-line"
                          style={getCardTitleStyle(item, block)}
                        >
                          Toplam
                        </span>
                        <span className="font-headline-md text-headline-md text-primary whitespace-pre-line">
                          {item.totalFee}
                        </span>
                      </div>
                      <p
                        className="font-caption text-caption text-text-muted mt-1 text-right whitespace-pre-line"
                        style={getCardDescStyle(item, block)}
                      >
                        {item.vatText || "*KDV Dahildir"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-section-gap whitespace-pre-line">
              {/* Discounts */}
              <section className="bg-surface-card rounded-xl border border-border-subtle p-8 whitespace-pre-line">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border-subtle whitespace-pre-line">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center whitespace-pre-line">
                    <span
                      className="material-symbols-outlined text-secondary whitespace-pre-line"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      percent
                    </span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl text-text-main whitespace-pre-line">
                    {block.discountsTitle || "İndirimler"}
                  </h2>
                </div>
                <ul className="space-y-6 whitespace-pre-line">
                  {(block.discounts || []).map((disc: any, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-4 whitespace-pre-line"
                    >
                      <IconPreview
                        data={disc.icon || "schedule"}
                        className="text-secondary mt-1"
                       style={getIconStyle(disc, block)} />
                      <div className="whitespace-pre-line">
                        <h4 className="font-label-md text-label-md text-text-main whitespace-pre-line">
                          {disc.title}
                        </h4>
                        <p className="font-body-md text-body-md text-text-muted whitespace-pre-line">
                          {disc.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Payment Plans */}
              <section className="bg-primary/5 rounded-xl border border-primary/20 p-8 whitespace-pre-line">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-primary/20 whitespace-pre-line">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center whitespace-pre-line">
                    <span
                      className="material-symbols-outlined text-primary whitespace-pre-line"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      account_balance
                    </span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl text-primary whitespace-pre-line">
                    {block.paymentsTitle || "Ödeme Seçenekleri"}
                  </h2>
                </div>
                <div className="space-y-6 whitespace-pre-line">
                  {(block.payments || []).map((pay: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-surface-card p-4 rounded-lg border border-border-subtle shadow-sm whitespace-pre-line"
                    >
                      <h4 className="font-label-md text-label-md text-primary mb-2 flex items-center gap-2 whitespace-pre-line">
                        <IconPreview
                          data={pay.icon || "credit_card"}
                          className="text-lg"
                         style={getIconStyle(pay, block)} />{" "}
                        {pay.title}
                      </h4>
                      <p className="font-body-md text-body-md text-text-muted whitespace-pre-line">
                        {pay.desc}
                      </p>

                      {pay.banks && (
                        <div className="mt-4 pt-4 border-t border-border-subtle whitespace-pre-line">
                          <span className="font-label-sm text-label-sm text-text-muted block mb-2 whitespace-pre-line">
                            Anlaşmalı Kurumlar:
                          </span>
                          <div className="flex gap-4 opacity-70 whitespace-pre-line">
                            {pay.banks
                              .split(",")
                              .map((bank: string, bIdx: number) => (
                                <div
                                  key={bIdx}
                                  className="h-8 w-16 px-2 bg-surface-variant rounded flex items-center justify-center text-[10px] font-bold text-tertiary text-center whitespace-pre-line"
                                >
                                  {bank.trim()}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        );
      }
      return null;
    }
    };

    if (block.isHidden && !onBlockClick) {
      return null;
    }

    return (
      <div
        key={index}
        className={`${onBlockClick ? "relative group/block" : ""} ${block.isHidden ? "opacity-50 grayscale" : ""}`}
        onClickCapture={(e) => {
          if (onBlockClick) {
            e.preventDefault();
            e.stopPropagation();
            onBlockClick(index, e);
          }
        }}
      >
        {block.isHidden && onBlockClick && (
          <div className="absolute top-2 right-2 bg-slate-800/80 text-white text-[10px] font-bold px-2 py-1 rounded z-50 shadow backdrop-blur-sm pointer-events-none whitespace-pre-line">
            GİZLİ BÖLÜM
          </div>
        )}
        <ErrorBoundary>{renderContent()}</ErrorBoundary>
      </div>
    );
  };

  return (
    <>{processedBlocks.map((block: any, index: number) => renderBlock(block, index))}</>
  );
};
