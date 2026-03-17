import { useState, useMemo, useRef, useEffect } from "react";
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, AreaChart, Area } from "recharts";

/* ═══ MD3 TOKENS ═══ */
const LIGHT = {
  primary: "#1B6C4A", onPrimary: "#FFFFFF", primaryContainer: "#A4F4C6", onPrimaryContainer: "#002113",
  secondary: "#4E6355", onSecondary: "#FFFFFF", secondaryContainer: "#D0E8D6", onSecondaryContainer: "#0B1F14",
  tertiary: "#3B6470", onTertiary: "#FFFFFF", tertiaryContainer: "#BEE9F8", onTertiaryContainer: "#001F28",
  error: "#BA1A1A", onError: "#FFFFFF", errorContainer: "#FFDAD6", onErrorContainer: "#410002",
  surface: "#F8FAF5", surfaceContainerLowest: "#FFFFFF", surfaceContainerLow: "#EEF1EB",
  surfaceContainer: "#E0E3DD", surfaceContainerHigh: "#D8DBD5", surfaceContainerHighest: "#CCCFC9",
  onSurface: "#191C19", onSurfaceVariant: "#414942",
  inverseSurface: "#2E312E", inverseOnSurface: "#EFF1EC",
  outline: "#636B64", outlineVariant: "#899085",
  income: "#1B6C4A", expense: "#9C4040", warning: "#7D5700", warningContainer: "#FFDEA8",
  incomeFill: "#4CA87A", expenseFill: "#CC7070", warningFill: "#B89340",
  primaryHover: "#15573C", tonalHover: "#BDD8C4", errorHover: "#E8C1BE",
  scrim: "rgba(0,0,0,0.32)", cursorFill: "rgba(0,0,0,0.04)",
  chevronSvg: "%23636B64",
};
const DARK = {
  primary: "#6CD9A0", onPrimary: "#003822", primaryContainer: "#005233", onPrimaryContainer: "#A4F4C6",
  secondary: "#B4CCBA", onSecondary: "#203528", secondaryContainer: "#374B3E", onSecondaryContainer: "#D0E8D6",
  tertiary: "#A2CDDB", onTertiary: "#033542", tertiaryContainer: "#1F4D59", onTertiaryContainer: "#BEE9F8",
  error: "#FFB4AB", onError: "#690005", errorContainer: "#93000A", onErrorContainer: "#FFDAD6",
  surface: "#111411", surfaceContainerLowest: "#0C0F0C", surfaceContainerLow: "#191C19",
  surfaceContainer: "#1D201D", surfaceContainerHigh: "#282B27", surfaceContainerHighest: "#323632",
  onSurface: "#E1E3DE", onSurfaceVariant: "#C1C9BF",
  inverseSurface: "#E1E3DE", inverseOnSurface: "#2E312E",
  outline: "#8B938A", outlineVariant: "#5A625B",
  income: "#6CD9A0", expense: "#FFB4AB", warning: "#FFDEA8", warningContainer: "#5C4100",
  incomeFill: "#6CD9A0", expenseFill: "#FFB4AB", warningFill: "#FFDEA8",
  primaryHover: "#8BE4B5", tonalHover: "#4A5F50", errorHover: "#7A3030",
  scrim: "rgba(0,0,0,0.5)", cursorFill: "rgba(255,255,255,0.06)",
  chevronSvg: "%238B938A",
};
let M3 = { ...LIGHT };
const Type = {
  headlineSmall: { fontSize: 26, fontWeight: 400, lineHeight: "34px" },
  titleLarge: { fontSize: 24, fontWeight: 500, lineHeight: "30px" },
  titleMedium: { fontSize: 18, fontWeight: 500, lineHeight: "26px", letterSpacing: 0.15 },
  titleSmall: { fontSize: 16, fontWeight: 500, lineHeight: "22px", letterSpacing: 0.1 },
  bodyLarge: { fontSize: 18, fontWeight: 400, lineHeight: "26px", letterSpacing: 0.5 },
  bodyMedium: { fontSize: 16, fontWeight: 400, lineHeight: "22px", letterSpacing: 0.25 },
  bodySmall: { fontSize: 14, fontWeight: 400, lineHeight: "18px", letterSpacing: 0.4 },
  labelLarge: { fontSize: 16, fontWeight: 500, lineHeight: "22px", letterSpacing: 0.1 },
  labelMedium: { fontSize: 14, fontWeight: 500, lineHeight: "18px", letterSpacing: 0.5 },
  labelSmall: { fontSize: 13, fontWeight: 500, lineHeight: "18px", letterSpacing: 0.5 },
};
const Shape = { extraSmall: 4, small: 8, medium: 16, large: 20, extraLarge: 28, full: 9999 };
const Elevation = { level0: { boxShadow: "none" }, level1: { boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)" }, level2: { boxShadow: "0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)" }, level3: { boxShadow: "0 3px 6px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.08)" } };
const FONT = "'Google Sans', 'Roboto', -apple-system, 'Segoe UI', sans-serif";
const COLORS_LIGHT = ["#1B6C4A", "#4E6355", "#3B6470", "#9C4040", "#7D5700", "#6750A4", "#6D6875", "#8B5E6B", "#3A7D44", "#5B7B2F"];
const COLORS_DARK = ["#6CD9A0", "#A0BCA7", "#7FBCCC", "#FFB4AB", "#FFDEA8", "#C9B0FF", "#B0A8B8", "#D4A0AD", "#82CC8C", "#A8CC7A"];
const BUDGET_COLORS_LIGHT = { fixed: "#3B6470", variable: "#1B6C4A", lifestyle: "#9C4040", goals: "#7D5700" };
const BUDGET_COLORS_DARK = { fixed: "#7FBCCC", variable: "#6CD9A0", lifestyle: "#FFB4AB", goals: "#FFDEA8" };
const BUDGET_FILL_LIGHT = { fixed: "#6BA3B3", variable: "#4CA87A", lifestyle: "#CC7070", goals: "#B89340" };
const BUDGET_FILL_DARK = { fixed: "#7FBCCC", variable: "#6CD9A0", lifestyle: "#FFB4AB", goals: "#FFDEA8" };
const getColors = () => M3 === DARK || M3.surface === "#111411" ? COLORS_DARK : COLORS_LIGHT;
const getBudgetColors = () => M3.surface === "#111411" ? BUDGET_COLORS_DARK : BUDGET_COLORS_LIGHT;

const I = {
  dashboard: <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>,
  income: <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  expense: <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  budget: <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  loan: <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v4c0 1.66 3.13 3 7 3s7-1.34 7-3V6"/><path d="M5 10v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4"/><path d="M5 14v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4"/></svg>,
  savings: <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/><path d="M3 21h18"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h2"/></svg>,
  reports: <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h6"/><polyline points="16 19 18 21 22 17"/></svg>,
  plus: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  chevDown: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  check: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  filter: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  chevLeft: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevRight: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="9 6 15 12 9 18"/></svg>,
  calendar: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  repeat: <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  cashflow: <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M16.5 8a5.5 5.5 0 00-4.5-2C8.96 6 6.5 8.69 6.5 12s2.46 6 5.5 6a5.5 5.5 0 004.5-2"/><line x1="5.5" y1="10.5" x2="13.5" y2="10.5"/><line x1="5.5" y1="13.5" x2="13.5" y2="13.5"/></svg>,
  download: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  upload: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  cloud: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>,
  cloudCheck: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/><polyline points="10 15 12 17 16 13"/></svg>,
  search: <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  sun: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
};

/* ═══ HELPERS ═══ */
const fmt = (n) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtFull = (n) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const uid = () => Math.random().toString(36).slice(2, 10);
const mo_ = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const moFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const gM = (d) => new Date(d).getMonth();
const gY = (d) => new Date(d).getFullYear();
const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));
const getSelectStyle = () => ({ height: 40, padding: "0 36px 0 12px", border: `1px solid ${M3.outlineVariant}40`, borderRadius: 9999, fontSize: 16, fontWeight: 400, lineHeight: "22px", letterSpacing: 0.25, fontFamily: "'Google Sans', 'Roboto', -apple-system, 'Segoe UI', sans-serif", background: "transparent", color: M3.onSurface, outline: "none", appearance: "none", cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${M3.chevronSvg}' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" });
const fByM = (items, mo, yr) => items.filter(i => i.date && gM(i.date) === mo && gY(i.date) === yr);
// Data export
const exportCSV = (data, filename) => {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv = [keys.join(","), ...data.map(r => keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename + ".csv";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
const exportJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename + ".json";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
// Budget helper: get budget for a category, checking monthly overrides first
const getBudget = (budgets, cat, mo, yr) => {
  const key = `${yr}-${String(mo).padStart(2, "0")}`;
  if (budgets.overrides?.[key]?.[cat] !== undefined) return budgets.overrides[key][cat];
  return budgets.defaults?.[cat] ?? budgets[cat] ?? 0;
};

/* ═══ DATA ═══ */
const BUDGET_GROUPS = [
  { key: "fixed", label: "Fixed Costs", cats: ["Rent", "Bills & Taxes", "Gym Membership", "Subscriptions", "Debt Repayments"] },
  { key: "variable", label: "Variable Needs", cats: ["Groceries", "Fuel / Transport", "Hygiene / Cosmetics", "Supplements", "Haircut", "Home / Repairs", "Healthcare"] },
  { key: "lifestyle", label: "Lifestyle / Wants", cats: ["Dining Out", "Entertainment", "Clothing", "Accessories", "Travel", "Gifts", "Other"] },
  { key: "goals", label: "Financial Goals", cats: ["Savings / Investments", "Emergency Fund"] },
];
const INCOME_CATS = ["Salary", "Freelance", "Dividends", "Business", "Rental", "Other"];
const EXPENSE_CATS = [...new Set(BUDGET_GROUPS.flatMap(g => g.cats))];
const initBudgets = { defaults: { Rent: 1200, "Bills & Taxes": 200, "Gym Membership": 50, Subscriptions: 60, "Debt Repayments": 300, Groceries: 400, "Fuel / Transport": 80, "Hygiene / Cosmetics": 50, Supplements: 30, Haircut: 40, "Home / Repairs": 100, Healthcare: 100, "Dining Out": 100, Entertainment: 80, Clothing: 100, Accessories: 50, Travel: 0, Gifts: 50, Other: 50, "Savings / Investments": 500, "Emergency Fund": 200 }, overrides: {} };

/* ═══ MD3 COMPONENTS ═══ */
function Card({ children, style, onClick, variant = "filled" }) {
  const [h, setH] = useState(false);
  const v = { filled: { background: M3.surfaceContainerLow, border: `1px solid ${M3.outlineVariant}18`, ...Elevation.level0 }, elevated: { background: M3.surfaceContainerLowest, border: `1px solid ${M3.outlineVariant}14`, ...Elevation.level1 }, outlined: { background: M3.surfaceContainerLowest, border: `1px solid ${M3.outlineVariant}50`, boxShadow: "none" } };
  const hoverStyle = h && onClick ? { background: variant === "filled" ? M3.surfaceContainer : variant === "elevated" ? M3.surfaceContainerLow : M3.onSurface + "08" } : {};
  const interactiveProps = onClick ? { role: "button", tabIndex: 0, onKeyDown: e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } } : {};
  return <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} {...interactiveProps} style={{ borderRadius: Shape.medium, padding: 24, transition: "background 120ms ease-out", cursor: onClick ? "pointer" : "default", ...v[variant], ...hoverStyle, ...style }}>{children}</div>;
}
function KPICard({ label, value, sub, color = M3.primary, icon }) {
  return <Card variant="outlined" style={{ flex: "1 1 200px", minWidth: 180 }}><div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}><div style={{ flex: 1 }}><div style={{ ...Type.labelMedium, color: M3.onSurfaceVariant, marginBottom: 12 }}>{label}</div><div style={{ ...Type.headlineSmall, fontWeight: 600, color: M3.onSurface }}>{value}</div>{sub && <div style={{ ...Type.bodySmall, color: M3.onSurfaceVariant, marginTop: 4 }}>{sub}</div>}</div>{icon && <div style={{ width: 52, height: 52, borderRadius: Shape.medium, background: color + "14", display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div>}</div></Card>;
}
function Btn({ children, onClick, variant = "filled", size = "md", style, disabled, title }) {
  const [h, setH] = useState(false);
  const ht = size === "sm" ? 32 : size === "lg" ? 48 : 40;
  const px = size === "sm" ? 12 : 24;
  const base = { border: "none", cursor: disabled ? "default" : "pointer", fontFamily: FONT, ...Type.labelLarge, borderRadius: Shape.full, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, height: ht, paddingLeft: px, paddingRight: px, transition: "all 120ms ease-out", overflow: "hidden", opacity: disabled ? 0.38 : 1 };
  const hb = h && !disabled;
  const vars = {
    filled:   { background: hb ? M3.primaryHover : M3.primary, color: M3.onPrimary, ...(hb ? Elevation.level1 : {}) },
    tonal:    { background: hb ? M3.tonalHover : M3.secondaryContainer, color: M3.onSecondaryContainer, ...(hb ? Elevation.level1 : {}) },
    outlined: { background: hb ? M3.primary + "14" : "transparent", color: M3.primary, border: `1px solid ${hb ? M3.primary : M3.outlineVariant + "40"}` },
    text:     { background: hb ? M3.primary + "14" : "transparent", color: M3.primary, paddingLeft: 12, paddingRight: 12 },
    error:    { background: hb ? M3.errorHover : M3.errorContainer, color: M3.onErrorContainer },
    icon:     { background: hb ? M3.onSurfaceVariant + "1F" : "transparent", color: M3.onSurfaceVariant, width: ht, height: ht, padding: 0, borderRadius: Shape.full, minWidth: 0, paddingLeft: 0, paddingRight: 0 },
  };
  const ariaProps = variant === "icon" && title ? { "aria-label": title } : {};
  return <div style={{ position: "relative", display: "inline-flex" }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
    <button onClick={disabled ? undefined : onClick} disabled={disabled} {...ariaProps} style={{ ...base, ...vars[variant], ...style }}>{children}</button>
    {title && h && <div role="tooltip" style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 6, background: M3.inverseSurface, color: M3.inverseOnSurface, ...Type.labelSmall, padding: "4px 10px", borderRadius: Shape.extraSmall, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 100, ...Elevation.level2 }}>{title}</div>}
  </div>;
}
function Input({ label, value, onChange, type = "text", placeholder, style, options, min, step, error }) {
  const [f, setF] = useState(false);
  const [h, setH] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [inputId] = useState(() => "fh-" + Math.random().toString(36).slice(2, 8));
  const errId = inputId + "-err";
  const dropRef = useRef(null);
  const hv = value !== "" && value !== undefined && value !== null;
  const isDate = type === "date";
  const floatUp = f || hv || isDate || !!options;
  const borderColor = error ? M3.error : f || dropOpen ? M3.primary : h ? M3.onSurfaceVariant : M3.outlineVariant + "40";
  const borderWidth = f || dropOpen || error ? 2 : h ? 2 : 1;
  const bgColor = f || dropOpen ? "transparent" : h ? M3.onSurface + "08" : "transparent";
  const labelColor = error ? M3.error : f || dropOpen ? M3.primary : (floatUp ? M3.onSurfaceVariant : (h ? M3.onSurface : M3.onSurfaceVariant));
  const fs = { width: "100%", padding: "16px", paddingTop: 20, border: `${borderWidth}px solid ${borderColor}`, borderRadius: Shape.extraSmall, ...Type.bodyLarge, fontFamily: FONT, background: bgColor, outline: "none", transition: "border-color 100ms, border-width 100ms, background 100ms", boxSizing: "border-box", color: M3.onSurface, ...style };
  const dateExtra = isDate ? { colorScheme: M3.surface === "#111411" ? "dark" : "light", paddingTop: 20, cursor: "pointer" } : {};
  const errProps = error ? { "aria-invalid": true, "aria-describedby": errId } : {};

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropOpen) return;
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropOpen]);

  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} ref={options ? dropRef : undefined}>
      {label && <label htmlFor={inputId} style={{ position: "absolute", left: 12, background: floatUp ? M3.surfaceContainerLowest : "transparent", padding: "0 4px", transition: "all 120ms ease-out", top: floatUp ? -8 : 16, ...(floatUp ? { ...Type.bodySmall, color: labelColor } : { ...Type.bodyLarge, color: labelColor }), pointerEvents: "none", zIndex: 1 }}>{label}</label>}
      {options ? <>
        <div id={inputId} role="combobox" aria-expanded={dropOpen} aria-haspopup="listbox" tabIndex={0} onClick={() => setDropOpen(o => !o)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDropOpen(o => !o); } if (e.key === "Escape") setDropOpen(false); }} style={{ ...fs, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none", minHeight: 56 }}>
          <span style={{ color: value ? M3.onSurface : M3.onSurfaceVariant }}>{value || "Select..."}</span>
          <span style={{ color: M3.onSurfaceVariant, display: "flex", transform: dropOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 120ms ease-out" }}>{I.chevDown}</span>
        </div>
        {dropOpen && <div role="listbox" style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: M3.surfaceContainerLowest, border: `1px solid ${M3.outlineVariant}50`, borderRadius: Shape.small, ...Elevation.level2, zIndex: 50, maxHeight: 240, overflowY: "auto", padding: "4px 0" }}>
          {options.map(o => (
            <div key={o} role="option" aria-selected={value === o} onClick={() => { onChange(o); setDropOpen(false); }} style={{ padding: "10px 16px", cursor: "pointer", ...Type.bodyLarge, color: value === o ? M3.primary : M3.onSurface, background: value === o ? M3.primary + "14" : "transparent", fontWeight: value === o ? 500 : 400, transition: "background 80ms" }} onMouseEnter={e => { if (value !== o) e.currentTarget.style.background = M3.onSurface + "08"; }} onMouseLeave={e => { e.currentTarget.style.background = value === o ? M3.primary + "14" : "transparent"; }}>
              {o}
            </div>
          ))}
        </div>}
      </>
      : <input id={inputId} type={type} value={value} onChange={e => onChange(type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)} placeholder={f ? placeholder : ""} {...errProps} style={{ ...fs, ...dateExtra }} min={min} step={step} onFocus={() => setF(true)} onBlur={() => setF(false)} />}
      {error && <div id={errId} role="alert" style={{ ...Type.bodySmall, color: M3.error, marginTop: 4, paddingLeft: 16 }}>{error}</div>}
    </div>
  );
}
function Select({ value, onChange, options, placeholder = "Select...", ariaLabel, style: extraStyle }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const displayLabel = options.find(o => (typeof o === "string" ? o : o.value) === value);
  const displayText = displayLabel ? (typeof displayLabel === "string" ? displayLabel : displayLabel.label) : placeholder;
  return (
    <div ref={ref} style={{ position: "relative", ...extraStyle }}>
      <button role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-label={ariaLabel} onClick={() => setOpen(o => !o)} onKeyDown={e => { if (e.key === "Escape") setOpen(false); }} style={{ width: "100%", height: 40, padding: "0 36px 0 12px", border: `1px solid ${open ? M3.primary : M3.outlineVariant + "40"}`, borderRadius: Shape.full, ...Type.bodyMedium, fontFamily: FONT, background: "transparent", color: value ? M3.onSurface : M3.onSurfaceVariant, cursor: "pointer", outline: "none", textAlign: "left", display: "flex", alignItems: "center", transition: "border-color 100ms" }}>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayText}</span>
        <span style={{ position: "absolute", right: 12, display: "flex", color: M3.onSurfaceVariant, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 120ms ease-out" }}>{I.chevDown}</span>
      </button>
      {open && <div role="listbox" style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: M3.surfaceContainerLowest, border: `1px solid ${M3.outlineVariant}50`, borderRadius: Shape.small, ...Elevation.level2, zIndex: 50, maxHeight: 280, overflowY: "auto", padding: "4px 0" }}>
        {options.map((o, i) => {
          const val = typeof o === "string" ? o : o.value;
          const label = typeof o === "string" ? o : o.label;
          const selected = val === value;
          return (
            <div key={val} role="option" aria-selected={selected} onClick={() => { onChange(val); setOpen(false); }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ padding: "10px 16px", cursor: "pointer", ...Type.bodyMedium, color: selected ? M3.primary : M3.onSurface, background: selected ? M3.primary + "14" : hovered === i ? M3.onSurface + "08" : "transparent", fontWeight: selected ? 500 : 400, transition: "background 80ms" }}>
              {label}
            </div>
          );
        })}
      </div>}
    </div>
  );
}
function Toggle({ checked, onChange, label }) {
  const [h, setH] = useState(false);
  return <div role="switch" aria-checked={checked} tabIndex={0} onClick={() => onChange(!checked)} onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onChange(!checked); } }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", userSelect: "none", outline: "none" }}>
    <div style={{ width: 52, height: 32, borderRadius: Shape.full, background: checked ? (h ? M3.primaryHover : M3.primary) : (h ? M3.surfaceContainerHigh : M3.surfaceContainerHighest), border: checked ? "none" : `2px solid ${h ? M3.onSurface : M3.outline}`, padding: 2, transition: "all 120ms ease-out", display: "flex", alignItems: "center" }}>
      <div style={{ width: checked ? 24 : 16, height: checked ? 24 : 16, borderRadius: Shape.full, background: checked ? M3.onPrimary : (h ? M3.onSurfaceVariant : M3.outline), marginLeft: checked ? 22 : 4, transition: "all 120ms ease-out", display: "flex", alignItems: "center", justifyContent: "center" }}>{checked && <span style={{ color: M3.primary, display: "flex" }}>{I.check}</span>}</div>
    </div>
    {label && <span style={{ ...Type.bodyMedium, color: M3.onSurface }}>{label}</span>}
  </div>;
}
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose} onKeyDown={e => e.key === "Escape" && onClose()}>
    <div style={{ position: "absolute", inset: 0, background: M3.scrim }} aria-hidden="true" />
    <div role="dialog" aria-modal="true" aria-label={title} onClick={e => e.stopPropagation()} style={{ position: "relative", background: M3.surfaceContainerLowest, borderRadius: Shape.extraLarge, padding: 24, width: "min(480px, 90vw)", maxHeight: "85vh", overflow: "auto", ...Elevation.level3 }}>
      <div style={{ ...Type.headlineSmall, color: M3.onSurface, marginBottom: 16 }}>{title}</div>
      {children}
      <div style={{ position: "absolute", top: 12, right: 12 }}><Btn variant="icon" size="sm" onClick={onClose} title="Close">{I.x}</Btn></div>
    </div>
  </div>;
}

function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  if (!open) return null;
  return <div style={{ position: "fixed", inset: 0, zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center" }} onKeyDown={e => e.key === "Escape" && onClose()}>
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: M3.scrim }} aria-hidden="true" />
    <div role="alertdialog" aria-modal="true" aria-label={title || "Confirm"} style={{ position: "relative", background: M3.surfaceContainerLowest, borderRadius: Shape.extraLarge, padding: 24, width: "min(400px, 85vw)", ...Elevation.level3, zIndex: 1 }}>
      <div style={{ ...Type.headlineSmall, color: M3.onSurface, marginBottom: 8 }}>{title || "Delete?"}</div>
      <p style={{ ...Type.bodyMedium, color: M3.onSurfaceVariant, marginBottom: 24 }}>{message || "This action cannot be undone."}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn variant="text" onClick={onClose}>Cancel</Btn>
        <Btn variant="error" onClick={onConfirm}>Delete</Btn>
      </div>
    </div>
  </div>;
}
function useConfirm() {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({ title: "", msg: "" });
  const cbRef = useRef(null);
  const confirm = (cb, title, msg) => { cbRef.current = cb; setInfo({ title, msg }); setOpen(true); };
  const handleConfirm = () => { if (cbRef.current) cbRef.current(); cbRef.current = null; setOpen(false); };
  const handleClose = () => { cbRef.current = null; setOpen(false); };
  const dialog = <ConfirmDialog open={open} onClose={handleClose} onConfirm={handleConfirm} title={info.title} message={info.msg} />;
  return [confirm, dialog];
}

// Undo snackbar for deletions
function Snackbar({ message, onUndo, open }) {
  if (!open) return null;
  return <div role="status" aria-live="polite" style={{ position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)", background: M3.inverseSurface, color: M3.inverseOnSurface, borderRadius: Shape.small, padding: "12px 16px", ...Elevation.level3, display: "flex", alignItems: "center", gap: 16, zIndex: 2000, ...Type.bodyMedium, animation: "fadeIn 120ms ease-out" }}>
    <span>{message}</span>
    {onUndo && <button onClick={onUndo} style={{ background: "none", border: "none", color: M3.primaryContainer, cursor: "pointer", fontFamily: FONT, ...Type.labelLarge, padding: "4px 12px", borderRadius: Shape.small, transition: "background 150ms" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>Undo</button>}
  </div>;
}

function ProgressBar({ value, max, color = M3.primary, height = 6 }) {
  const p = pct(value, max);
  const fillColor = p > 100 ? M3.error : color;
  // Opacity scales from 40% at 0% fill to 100% at 60%+ fill
  const fillOpacity = Math.min(1, 0.4 + (Math.min(p, 60) / 60) * 0.6);
  const fillHex = Math.round(fillOpacity * 255).toString(16).padStart(2, "0");
  return <div style={{ height, borderRadius: Shape.full, background: fillColor + "18", overflow: "hidden", width: "100%" }}><div style={{ height: "100%", width: `${Math.min(p, 100)}%`, borderRadius: Shape.full, background: fillColor + fillHex, transition: "width 200ms ease-out" }} /></div>;
}
function EmptyState({ message, action }) {
  return <div style={{ textAlign: "center", padding: 48 }}><div style={{ ...Type.bodyLarge, color: M3.onSurfaceVariant, marginBottom: action ? 12 : 0 }}>{message}</div>{action}</div>;
}
function ChartCard({ title, children, action }) {
  return <Card variant="outlined" style={{ flex: 1, minWidth: 300 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><span style={{ ...Type.titleSmall, color: M3.onSurface }}>{title}</span>{action}</div>{children}</Card>;
}
function Chip({ label, selected, onClick }) {
  const [h, setH] = useState(false);
  return <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ height: 32, padding: "0 16px", borderRadius: Shape.small, border: selected ? "none" : `1px solid ${h ? M3.onSurfaceVariant : M3.outlineVariant + "40"}`, background: selected ? (h ? M3.tonalHover : M3.secondaryContainer) : (h ? M3.onSurface + "14" : "transparent"), color: selected ? M3.onSecondaryContainer : M3.onSurfaceVariant, ...Type.labelLarge, fontFamily: FONT, cursor: "pointer", transition: "all 120ms ease-out", display: "inline-flex", alignItems: "center", gap: 4 }}>{selected && <span style={{ width: 16, display: "flex" }}>{I.check}</span>}{label}</button>;
}
const CTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return <div style={{ background: M3.inverseSurface, color: M3.inverseOnSurface, borderRadius: Shape.small, padding: "10px 16px", border: `1px solid ${M3.inverseOnSurface}30`, ...Elevation.level3, ...Type.bodySmall }}><div style={{ ...Type.labelMedium, marginBottom: 4 }}>{label}</div>{payload.map((p, i) => {
    const dotColor = p.color || p.fill || p.stroke || p.payload?.fill || M3.outline;
    return <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, opacity: 0.9 }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: dotColor, flexShrink: 0 }} />{p.name}</span><span style={{ fontWeight: 600 }}>{fmt(p.value)}</span></div>;
  })}</div>;
};

/* ═══ PAGES ═══ */

function DashboardPage({ incomes, expenses, budgets, loans, savings, mo, yr, setPage }) {
  const mI = fByM(incomes, mo, yr), mE = fByM(expenses, mo, yr);
  const tI = mI.reduce((s, i) => s + i.amount, 0), tE = mE.reduce((s, e) => s + e.amount, 0);
  const net = tI - tE;
  const tB = BUDGET_GROUPS.flatMap(g => g.cats).reduce((s, c) => s + getBudget(budgets, c, mo, yr), 0);
  const tST = savings.reduce((s, g) => s + g.target_amount, 0), tSC = savings.reduce((s, g) => s + g.current_amount, 0);
  const tD = loans.reduce((s, l) => s + (l.total_amount - l.amount_paid), 0);
  const netWorth = tSC - tD;
  // Month-over-month
  const pMo = mo === 0 ? 11 : mo - 1, pYr = mo === 0 ? yr - 1 : yr;
  const prevI = fByM(incomes, pMo, pYr).reduce((s, i) => s + i.amount, 0);
  const prevE = fByM(expenses, pMo, pYr).reduce((s, e) => s + e.amount, 0);
  const moI = prevI > 0 ? Math.round(((tI - prevI) / prevI) * 100) : null;
  const moE = prevE > 0 ? Math.round(((tE - prevE) / prevE) * 100) : null;
  const trend = []; for (let i = 5; i >= 0; i--) { const m = new Date(yr, mo - i, 1); const tm = m.getMonth(), ty = m.getFullYear(); trend.push({ name: mo_[tm], Income: incomes.filter(x => gM(x.date) === tm && gY(x.date) === ty).reduce((s, x) => s + x.amount, 0), Expenses: expenses.filter(x => gM(x.date) === tm && gY(x.date) === ty).reduce((s, x) => s + x.amount, 0) }); }
  const catMap = {}; mE.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; }); const catData = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([name, value]) => ({ name, value }));
  const debtData = loans.map(l => ({ name: l.name, Paid: l.amount_paid, Remaining: l.total_amount - l.amount_paid }));
  const isEmpty = incomes.length === 0 && expenses.length === 0 && loans.length === 0 && savings.length === 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Welcome card for new users */}
      {isEmpty && (
        <Card variant="filled" style={{ padding: 32, textAlign: "center" }}>
          <div style={{ ...Type.headlineSmall, color: M3.onSurface, marginBottom: 8 }}>Welcome to FinanceHub</div>
          <div style={{ ...Type.bodyMedium, color: M3.onSurfaceVariant, marginBottom: 24, maxWidth: 480, margin: "0 auto 24px" }}>Start by adding your income and expenses for this month. Everything else builds on top of that.</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="filled" onClick={() => setPage("income")}>{I.income} Add Income</Btn>
            <Btn variant="tonal" onClick={() => setPage("expenses")}>{I.expense} Add Expenses</Btn>
            <Btn variant="outlined" onClick={() => setPage("loans")}>{I.loan} Track a Loan</Btn>
          </div>
        </Card>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Card variant="elevated" style={{ flex: "1 1 200px", minWidth: 180, cursor: "pointer" }} onClick={() => setPage("income")}><div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}><div><div style={{ ...Type.labelMedium, color: M3.onSurfaceVariant, marginBottom: 12 }}>Total Income</div><div style={{ ...Type.headlineSmall, fontWeight: 600, color: M3.onSurface }}>{fmt(tI)}</div>{moI !== null && <div style={{ ...Type.labelSmall, color: moI >= 0 ? M3.income : M3.expense, marginTop: 4 }}>{moI >= 0 ? "+" : ""}{moI}% vs last month</div>}</div><div style={{ width: 52, height: 52, borderRadius: Shape.medium, background: M3.income + "14", display: "flex", alignItems: "center", justifyContent: "center", color: M3.income, flexShrink: 0 }}>{I.income}</div></div></Card>
        <Card variant="elevated" style={{ flex: "1 1 200px", minWidth: 180, cursor: "pointer" }} onClick={() => setPage("expenses")}><div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}><div><div style={{ ...Type.labelMedium, color: M3.onSurfaceVariant, marginBottom: 12 }}>Total Expenses</div><div style={{ ...Type.headlineSmall, fontWeight: 600, color: M3.onSurface }}>{fmt(tE)}</div>{moE !== null && <div style={{ ...Type.labelSmall, color: moE <= 0 ? M3.income : M3.expense, marginTop: 4 }}>{moE >= 0 ? "+" : ""}{moE}% vs last month</div>}</div><div style={{ width: 52, height: 52, borderRadius: Shape.medium, background: M3.expense + "14", display: "flex", alignItems: "center", justifyContent: "center", color: M3.expense, flexShrink: 0 }}>{I.expense}</div></div></Card>
        <Card variant="elevated" style={{ flex: "1 1 200px", minWidth: 180, cursor: "pointer" }} onClick={() => setPage("reports")}><div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}><div><div style={{ ...Type.labelMedium, color: M3.onSurfaceVariant, marginBottom: 12 }}>Net Cash Flow</div><div style={{ ...Type.headlineSmall, fontWeight: 600, color: M3.onSurface }}>{fmt(net)}</div><div style={{ ...Type.bodySmall, color: M3.onSurfaceVariant, marginTop: 4 }}>{net >= 0 ? "You're saving this month" : "Spending exceeds income"}</div></div><div style={{ width: 52, height: 52, borderRadius: Shape.medium, background: (net >= 0 ? M3.income : M3.error) + "14", display: "flex", alignItems: "center", justifyContent: "center", color: net >= 0 ? M3.income : M3.error, flexShrink: 0 }}>{I.cashflow}</div></div></Card>
        <Card variant="elevated" style={{ flex: "1 1 200px", minWidth: 180, cursor: "pointer" }} onClick={() => setPage("budget")}><div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}><div><div style={{ ...Type.labelMedium, color: M3.onSurfaceVariant, marginBottom: 12 }}>Budget Status</div><div style={{ ...Type.headlineSmall, fontWeight: 600, color: M3.onSurface }}>{pct(tE, tB)}% used</div><div style={{ ...Type.bodySmall, color: M3.onSurfaceVariant, marginTop: 4 }}>{fmt(tE)} of {fmt(tB)}</div>{tI > 0 && tB > tI && <div style={{ ...Type.labelSmall, color: M3.error, marginTop: 4 }}>Budget exceeds income by {fmt(tB - tI)}</div>}</div><div style={{ width: 52, height: 52, borderRadius: Shape.medium, background: (tE > tB ? M3.error : M3.primary) + "14", display: "flex", alignItems: "center", justifyContent: "center", color: tE > tB ? M3.error : M3.primary, flexShrink: 0 }}>{I.budget}</div></div></Card>
        <Card variant="elevated" style={{ flex: "1 1 200px", minWidth: 180, cursor: "pointer" }} onClick={() => setPage("savings")}><div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}><div><div style={{ ...Type.labelMedium, color: M3.onSurfaceVariant, marginBottom: 12 }}>Savings</div><div style={{ ...Type.headlineSmall, fontWeight: 600, color: M3.onSurface }}>{pct(tSC, tST)}%</div><div style={{ ...Type.bodySmall, color: M3.onSurfaceVariant, marginTop: 4 }}>{fmt(tSC)} of {fmt(tST)}</div></div><div style={{ width: 52, height: 52, borderRadius: Shape.medium, background: M3.tertiary + "14", display: "flex", alignItems: "center", justifyContent: "center", color: M3.tertiary, flexShrink: 0 }}>{I.savings}</div></div></Card>
        <Card variant="elevated" style={{ flex: "1 1 200px", minWidth: 180, cursor: "pointer" }} onClick={() => setPage("loans")}><div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}><div><div style={{ ...Type.labelMedium, color: M3.onSurfaceVariant, marginBottom: 12 }}>Total Debt</div><div style={{ ...Type.headlineSmall, fontWeight: 600, color: M3.onSurface }}>{fmt(tD)}</div></div><div style={{ width: 52, height: 52, borderRadius: Shape.medium, background: M3.expense + "14", display: "flex", alignItems: "center", justifyContent: "center", color: M3.expense, flexShrink: 0 }}>{I.loan}</div></div></Card>
      </div>
      {/* Net Worth card */}
      <Card variant="filled" style={{ padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: Shape.medium, background: netWorth >= 0 ? M3.primaryContainer : M3.errorContainer, display: "flex", alignItems: "center", justifyContent: "center", color: netWorth >= 0 ? M3.onPrimaryContainer : M3.onErrorContainer, flexShrink: 0 }}>{I.cashflow}</div>
          <div><div style={{ ...Type.labelMedium, color: M3.onSurfaceVariant }}>Net Worth</div><div style={{ ...Type.bodySmall, color: M3.onSurfaceVariant, marginTop: 2 }}>Total Savings − Total Debt</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <div style={{ textAlign: "right" }}><span style={{ ...Type.bodyMedium, color: M3.onSurfaceVariant }}>Savings {fmt(tSC)}</span><span style={{ ...Type.bodyMedium, color: M3.outline, margin: "0 8px" }}>−</span><span style={{ ...Type.bodyMedium, color: M3.onSurfaceVariant }}>Debt {fmt(tD)}</span><span style={{ ...Type.bodyMedium, color: M3.outline, margin: "0 8px" }}>=</span></div>
          <span style={{ ...Type.headlineSmall, fontWeight: 700, color: netWorth >= 0 ? M3.income : M3.error }}>{fmt(netWorth)}</span>
        </div>
      </Card>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {trend.some(t => t.Income > 0 || t.Expenses > 0) ? <>
        <ChartCard title="Income vs Expenses Trend"><ResponsiveContainer width="100%" height={240}><AreaChart data={trend}><defs><linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={M3.primary} stopOpacity={0.25}/><stop offset="100%" stopColor={M3.primary} stopOpacity={0.03}/></linearGradient><linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={M3.expense} stopOpacity={0.25}/><stop offset="100%" stopColor={M3.expense} stopOpacity={0.03}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={M3.outlineVariant} strokeOpacity={0.5}/><XAxis dataKey="name" tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false}/><YAxis tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} tickFormatter={v=>`€${v/1000}k`}/><Tooltip content={<CTooltip/>} cursor={{ fill: M3.cursorFill }}/><Area type="monotone" dataKey="Income" stroke={M3.primary} fill="url(#gI)" strokeWidth={2} dot={false}/><Area type="monotone" dataKey="Expenses" stroke={M3.expense} fill="url(#gE)" strokeWidth={2} dot={false}/></AreaChart></ResponsiveContainer></ChartCard>
        {catData.length > 0 && <ChartCard title="Spending by Category"><ResponsiveContainer width="100%" height={240}><PieChart><Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" strokeWidth={0}>{catData.map((_, i) => <Cell key={i} fill={getColors()[i % getColors().length] + "B0"}/>)}</Pie><Tooltip content={<CTooltip/>} cursor={{ fill: M3.cursorFill }}/><Legend iconType="circle" iconSize={8} wrapperStyle={{...Type.labelSmall, color: M3.onSurfaceVariant}}/></PieChart></ResponsiveContainer></ChartCard>}
        </> : !isEmpty && <Card variant="outlined" style={{ flex: 1 }}><EmptyState message="Add a few entries to see trends and charts here" /></Card>}
      </div>
      {debtData.length > 0 && <ChartCard title="Debt Progress"><ResponsiveContainer width="100%" height={200}><BarChart data={debtData} layout="vertical" barSize={16}><CartesianGrid strokeDasharray="3 3" stroke={M3.outlineVariant} strokeOpacity={0.5} horizontal={false}/><XAxis type="number" tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} tickFormatter={v=>`€${v/1000}k`}/><YAxis type="category" dataKey="name" tick={{...Type.labelMedium, fill: M3.onSurface}} axisLine={false} tickLine={false} width={100}/><Tooltip content={<CTooltip/>} cursor={{ fill: M3.cursorFill }}/><Bar dataKey="Paid" stackId="a" fill={M3.primary + "B0"}/><Bar dataKey="Remaining" stackId="a" fill={M3.primary + "25"} radius={[0,4,4,0]}/></BarChart></ResponsiveContainer></ChartCard>}
    </div>
  );
}


function TransactionPage({ items, setItems, type, categories, colorMain, mo, yr }) {
  const [modal, setModal] = useState(false); const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ amount: "", category: categories[0], description: "", date: "", recurring: false });
  const [errors, setErrors] = useState({});
  const [range, setRange] = useState(6); const [sortKey, setSortKey] = useState("date"); const [sortDir, setSortDir] = useState(-1);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [undoItem, setUndoItem] = useState(null);
  const [undoOpen, setUndoOpen] = useState(false);
  const undoTimer = useRef(null);
  const [confirm, confirmDialog] = useConfirm();
  const isIncome = type === "income";

  const doDelete = (id) => {
    const item = items.find(i => i.id === id);
    setItems(p => p.filter(i => i.id !== id));
    setUndoItem(item);
    setUndoOpen(true);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => { setUndoOpen(false); setUndoItem(null); }, 5000);
  };
  const handleUndo = () => {
    if (undoItem) { setItems(p => [...p, undoItem]); setUndoItem(null); setUndoOpen(false); }
  };

  // Auto-generate default date for current selected month
  const defaultDate = () => {
    const now = new Date();
    if (mo === now.getMonth() && yr === now.getFullYear()) return now.toISOString().split("T")[0];
    return new Date(yr, mo, 1).toISOString().split("T")[0];
  };

  const mItems = fByM(items, mo, yr);
  const searchActive = search.length > 0;
  const displayItems = searchActive ? items : mItems;
  const total = mItems.reduce((s, i) => s + i.amount, 0);
  const cats = [...new Set(mItems.map(i => i.category))].length;
  const largest = mItems.length ? Math.max(...mItems.map(i => i.amount)) : 0;
  const trend = []; for (let j = range - 1; j >= 0; j--) { const m = new Date(yr, mo - j, 1); const tm = m.getMonth(), ty = m.getFullYear(); trend.push({ name: mo_[tm] + (ty !== yr ? ` '${String(ty).slice(2)}` : ""), amount: items.filter(x => gM(x.date) === tm && gY(x.date) === ty).reduce((s, x) => s + x.amount, 0) }); }
  const sorted = [...displayItems].filter(i => {
    if (search && !(`${i.description} ${i.category} ${i.amount}`).toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat && i.category !== filterCat) return false;
    return true;
  }).sort((a, b) => { if (sortKey === "date") return sortDir * (new Date(a.date) - new Date(b.date)); if (sortKey === "amount") return sortDir * (a.amount - b.amount); return sortDir * a.category.localeCompare(b.category); });
  const openAdd = () => { setEditing(null); setErrors({}); setForm({ amount: "", category: categories[0], description: "", date: defaultDate(), recurring: false }); setModal(true); };
  const openEdit = (item) => { setEditing(item.id); setErrors({}); setForm({ amount: item.amount, category: item.category, description: item.description, date: item.date, recurring: !!item.recurring }); setModal(true); };
  const save = () => {
    const e = {};
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Amount is required";
    if (!form.date) e.date = "Date is required";
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    if (editing) setItems(p => p.map(i => i.id === editing ? { ...i, ...form, amount: Number(form.amount) } : i));
    else setItems(p => [...p, { id: uid(), ...form, amount: Number(form.amount) }]);
    setModal(false);
  };
  const remove = (id) => confirm(() => doDelete(id), `Delete ${isIncome ? "income" : "expense"}?`, "You can undo this within 5 seconds.");
  const toggleSort = (k) => { if (sortKey === k) setSortDir(d => -d); else { setSortKey(k); setSortDir(-1); } };
  const sortArr = (k) => sortKey === k ? (sortDir === 1 ? " ↑" : " ↓") : "";
  const prevMo = mo === 0 ? 11 : mo - 1; const prevYr = mo === 0 ? yr - 1 : yr;
  const prevMonthItems = fByM(items, prevMo, prevYr);
  const hasPrevMonth = prevMonthItems.length > 0;
  const existingKeys = mItems.map(i => `${i.category}-${i.amount}-${i.description}`);
  const copyableCount = prevMonthItems.filter(i => !existingKeys.includes(`${i.category}-${i.amount}-${i.description}`)).length;
  const copyLastMonth = () => {
    const toAdd = prevMonthItems.filter(i => !existingKeys.includes(`${i.category}-${i.amount}-${i.description}`));
    if (toAdd.length === 0) return;
    const newItems = toAdd.map(i => {
      const oldDate = new Date(i.date); const newDate = new Date(yr, mo, Math.min(oldDate.getDate(), new Date(yr, mo + 1, 0).getDate()));
      return { id: uid(), amount: i.amount, category: i.category, description: i.description, date: newDate.toISOString().split("T")[0], recurring: !!i.recurring };
    });
    setItems(p => [...p, ...newItems]);
  };
  const chipBg = isIncome ? M3.primaryContainer : M3.errorContainer; const chipFg = isIncome ? M3.onPrimaryContainer : M3.onErrorContainer;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {confirmDialog}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <KPICard label={isIncome ? "Total Income" : "Total Spent"} value={fmt(total)} color={colorMain} icon={isIncome ? I.income : I.expense} />
        <KPICard label={isIncome ? "Income Sources" : "Categories Used"} value={cats} color={M3.secondary} />
        <KPICard label={isIncome ? "Largest Entry" : "Largest Expense"} value={fmt(largest)} color={M3.tertiary} />
      </div>
      <ChartCard title={`${isIncome ? "Income" : "Expense"} Trend`} action={<div style={{ display: "flex", gap: 8 }}><Chip label="6M" selected={range === 6} onClick={() => setRange(6)} /><Chip label="1Y" selected={range === 12} onClick={() => setRange(12)} /><Chip label="All" selected={range === 0} onClick={() => setRange(0)} /></div>}>
        <ResponsiveContainer width="100%" height={220}><BarChart data={range === 0 ? (() => { const byM = {}; items.forEach(i => { if (!i.date) return; const k = `${gY(i.date)}-${String(gM(i.date)).padStart(2,"0")}`; byM[k] = (byM[k] || 0) + i.amount; }); return Object.entries(byM).sort().slice(-24).map(([k, v]) => ({ name: mo_[parseInt(k.split("-")[1])]+` '${k.slice(2,4)}`, amount: v })); })() : trend} barSize={range === 0 ? 16 : 24}><CartesianGrid strokeDasharray="3 3" stroke={M3.outlineVariant} strokeOpacity={0.5} vertical={false}/><XAxis dataKey="name" tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false}/><YAxis tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} tickFormatter={v=>`€${v/1000}k`}/><Tooltip content={<CTooltip/>} cursor={{ fill: M3.cursorFill }}/><Bar dataKey="amount" name={isIncome?"Income":"Expenses"} fill={colorMain + "B0"} radius={[Shape.extraSmall,Shape.extraSmall,0,0]}/></BarChart></ResponsiveContainer>
      </ChartCard>
      <Card variant="outlined">
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <span style={{ ...Type.titleMedium, color: M3.onSurface }}>{isIncome ? "Income" : "Expense"} Entries {searchActive && <span style={{ ...Type.bodySmall, color: M3.onSurfaceVariant }}>(searching all months)</span>}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {copyableCount > 0 && <Btn variant="outlined" size="sm" onClick={copyLastMonth}>{I.repeat} Copy {copyableCount} from {mo_[prevMo]}</Btn>}
            <Btn onClick={openAdd} variant="filled">{I.plus} Add {isIncome ? "Income" : "Expense"}</Btn>
          </div>
        </div>
        {/* Search / filter / view controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ position: "relative", width: 280 }}>
            <input aria-label={`Search ${isIncome ? "income" : "expense"} entries`} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ width: "100%", height: 40, padding: "0 12px 0 36px", border: `1px solid ${M3.outlineVariant}40`, borderRadius: Shape.full, ...Type.bodyMedium, fontFamily: FONT, background: "transparent", outline: "none", color: M3.onSurface, transition: "border-color 100ms" }} onFocus={e => e.target.style.borderColor = M3.primary} onBlur={e => e.target.style.borderColor = M3.outlineVariant + "40"} />
            <span aria-hidden="true" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: M3.onSurfaceVariant, display: "flex" }}>{I.search}</span>
          </div>
          <Select ariaLabel="Filter by category" value={filterCat} onChange={setFilterCat} options={[{ value: "", label: "All categories" }, ...categories.map(c => ({ value: c, label: c }))]} placeholder="All categories" style={{ width: 200 }} />
          {displayItems.length > 0 && <Btn variant="outlined" size="sm" onClick={() => exportCSV(sorted.map(i => ({ Date: i.date, Amount: i.amount, Category: i.category, Description: i.description || "", Recurring: i.recurring ? "Yes" : "No" })), `${type}_export`)}>{I.download} CSV</Btn>}
        </div>
        {sorted.length === 0 ? <EmptyState message={`No ${type} entries for ${moFull[mo]}`} action={<Btn variant="tonal" size="sm" onClick={openAdd}>{I.plus} Add your first {type}</Btn>} /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ borderBottom: `1px solid ${M3.outlineVariant}50` }}>{[["date","Date"],["amount","Amount"],["category","Category"]].map(([k,l]) => <th key={k} scope="col" role="columnheader" aria-sort={sortKey === k ? (sortDir === 1 ? "ascending" : "descending") : "none"} className="th-sort" tabIndex={0} onClick={() => toggleSort(k)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSort(k); } }} style={{ textAlign: "left", padding: "12px 16px", ...Type.labelMedium, color: M3.onSurfaceVariant, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}>{l}{sortArr(k)}</th>)}<th scope="col" style={{ textAlign: "left", padding: "12px 16px", ...Type.labelMedium, color: M3.onSurfaceVariant }}>Description</th><th scope="col" style={{ padding: "12px 16px", textAlign: "right", ...Type.labelMedium, color: M3.onSurfaceVariant }}></th></tr></thead>
              <tbody>{sorted.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${M3.surfaceContainerHigh}`, transition: "background 150ms", background: idx % 2 === 1 ? M3.surfaceContainerLow + "80" : "transparent" }} onMouseEnter={e => e.currentTarget.style.background = M3.surfaceContainer} onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 1 ? M3.surfaceContainerLow + "80" : "transparent"}>
                  <td style={{ padding: "12px 16px", ...(Type.bodyMedium), color: M3.onSurfaceVariant }}>{fmtDate(item.date)}</td>
                  <td style={{ padding: "12px 16px", ...(Type.titleSmall), color: colorMain }}>{fmtFull(item.amount)}</td>
                  <td style={{ padding: "12px 16px" }}><span style={{ ...(Type.labelMedium), background: chipBg, color: chipFg, padding: "4px 12px", borderRadius: Shape.small }}>{item.category}</span>{item.recurring && <span style={{ ...Type.labelSmall, color: M3.onTertiaryContainer, background: M3.tertiaryContainer, padding: "1px 6px", borderRadius: Shape.extraSmall, marginLeft: 6 }} title="Recurring monthly">recurring</span>}</td>
                  <td style={{ padding: "12px 16px", ...(Type.bodyMedium), color: M3.onSurfaceVariant }}>{item.description || "—"}</td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap", textAlign: "right" }}>
                    <Btn variant="icon" size="sm" onClick={() => { setEditing(null); setErrors({}); setForm({ amount: item.amount, category: item.category, description: item.description, date: defaultDate(), recurring: !!item.recurring }); setModal(true); }} title="Duplicate">{I.repeat}</Btn>
                    <Btn variant="icon" size="sm" onClick={() => openEdit(item)} title="Edit">{I.edit}</Btn>
                    <Btn variant="icon" size="sm" onClick={() => remove(item.id)} style={{ color: M3.error }} title="Delete">{I.trash}</Btn>
                  </td>
                </tr>
              ))}</tbody>
              <tfoot><tr style={{ borderTop: `2px solid ${M3.outlineVariant}` }}>
                <td style={{ padding: "12px 16px", ...Type.labelMedium, color: M3.onSurfaceVariant }}>{sorted.length} {sorted.length === 1 ? "entry" : "entries"}</td>
                <td style={{ padding: "12px 16px", ...Type.titleSmall, color: colorMain, fontWeight: 700 }}>{fmtFull(sorted.reduce((s, i) => s + i.amount, 0))}</td>
                <td colSpan={3}></td>
              </tr></tfoot>
            </table>
          </div>
        )}
      </Card>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? `Edit ${isIncome ? "Income" : "Expense"}` : `Add ${isIncome ? "Income" : "Expense"}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}>
          <Input label="Amount" type="number" value={form.amount} onChange={v => { setForm({ ...form, amount: v }); if (errors.amount) setErrors(e => ({ ...e, amount: null })); }} placeholder="0.00" min="0" step="0.01" error={errors.amount} />
          <Input label="Category" value={form.category} onChange={v => setForm({ ...form, category: v })} options={categories} />
          <Input label="Description (optional)" value={form.description} onChange={v => setForm({ ...form, description: v })} placeholder="Add a note..." />
          <Input label="Date" type="date" value={form.date} onChange={v => { setForm({ ...form, date: v }); if (errors.date) setErrors(e => ({ ...e, date: null })); }} error={errors.date} />
          <Toggle checked={form.recurring} onChange={v => setForm({ ...form, recurring: v })} label="Recurring monthly" />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}><Btn variant="text" onClick={() => setModal(false)}>Cancel</Btn><Btn variant="filled" onClick={save}>{editing ? "Update" : "Add"}</Btn></div>
        </div>
      </Modal>
      <Snackbar open={undoOpen} message={`${isIncome ? "Income" : "Expense"} entry deleted`} onUndo={handleUndo} />
    </div>
  );
}


function BudgetPage({ budgets, setBudgets, expenses, incomes, mo, yr }) {
  const [expanded, setExpanded] = useState({ fixed: true, variable: true, lifestyle: true, goals: true });
  const [editingCat, setEditingCat] = useState(null); const [editVal, setEditVal] = useState(""); const [editScope, setEditScope] = useState("month");
  const mExp = fByM(expenses, mo, yr);
  const mInc = fByM(incomes, mo, yr);
  const totalIncome = mInc.reduce((s, i) => s + i.amount, 0);
  const sbc = {}; mExp.forEach(e => { sbc[e.category] = (sbc[e.category] || 0) + e.amount; });
  const totalSpent = mExp.reduce((s, e) => s + e.amount, 0);
  const allCats = BUDGET_GROUPS.flatMap(g => g.cats);
  const gB = (cat) => getBudget(budgets, cat, mo, yr);
  const totalBudgeted = allCats.reduce((s, c) => s + gB(c), 0);
  const unallocated = totalIncome - totalBudgeted;
  const moKey = `${yr}-${String(mo).padStart(2, "0")}`;
  const hasOvr = (cat) => budgets.overrides?.[moKey]?.[cat] !== undefined;
  const overBudget = allCats.filter(c => gB(c) > 0 && (sbc[c] || 0) > gB(c)).length;
  const nearLimit = allCats.filter(c => { const b = gB(c); const s = sbc[c] || 0; return b > 0 && s <= b && s >= b * 0.8; }).length;
  const notSet = allCats.filter(c => !gB(c)).length;
  const toggle = (k) => setExpanded(p => ({ ...p, [k]: !p[k] }));
  const startEdit = (c) => { setEditingCat(c); setEditVal(gB(c) || ""); setEditScope(hasOvr(c) ? "month" : "default"); };
  const saveEdit = () => {
    if (!editingCat) return; const val = Number(editVal) || 0;
    if (editScope === "month") {
      setBudgets(p => ({ ...p, overrides: { ...(p.overrides || {}), [moKey]: { ...(p.overrides?.[moKey] || {}), [editingCat]: val } } }));
    } else {
      setBudgets(p => ({ ...p, defaults: { ...(p.defaults || {}), [editingCat]: val } }));
    }
    setEditingCat(null);
  };
  const groupData = BUDGET_GROUPS.map(g => ({ name: g.label.split(" ")[0], Budget: g.cats.reduce((s, c) => s + gB(c), 0), Spent: g.cats.reduce((s, c) => s + (sbc[c] || 0), 0), color: getBudgetColors()[g.key] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Income vs Budget summary */}
      <Card variant="filled" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
          <div style={{ ...Type.titleSmall, color: M3.onSurface }}>Budget Allocation</div>
          {totalIncome > 0 ? (
            <span style={{ ...Type.labelMedium, color: unallocated >= 0 ? M3.income : M3.error, background: (unallocated >= 0 ? M3.income : M3.error) + "18", padding: "4px 16px", borderRadius: Shape.full }}>
              {unallocated >= 0 ? `${fmt(unallocated)} unallocated` : `${fmt(Math.abs(unallocated))} over-committed`}
            </span>
          ) : (
            <span style={{ ...Type.labelSmall, color: M3.onSurfaceVariant }}>Add income to see allocation</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
          <div><div style={{ ...Type.labelSmall, color: M3.onSurfaceVariant, marginBottom: 2 }}>Income</div><div style={{ ...Type.titleMedium, color: M3.income }}>{fmt(totalIncome)}</div></div>
          <div style={{ color: M3.outline, ...Type.titleMedium, alignSelf: "flex-end" }}>→</div>
          <div><div style={{ ...Type.labelSmall, color: M3.onSurfaceVariant, marginBottom: 2 }}>Budgeted</div><div style={{ ...Type.titleMedium, color: M3.onSurface }}>{fmt(totalBudgeted)}</div></div>
          <div style={{ color: M3.outline, ...Type.titleMedium, alignSelf: "flex-end" }}>→</div>
          <div><div style={{ ...Type.labelSmall, color: M3.onSurfaceVariant, marginBottom: 2 }}>Spent</div><div style={{ ...Type.titleMedium, color: M3.expense }}>{fmt(totalSpent)}</div></div>
        </div>
        {/* Stacked bar: Spent | Budgeted remaining | Unallocated */}
        {totalIncome > 0 && <div style={{ display: "flex", height: 12, borderRadius: Shape.full, overflow: "hidden", background: M3.income + "12" }}>
          <div style={{ width: `${Math.min(100, (totalSpent / totalIncome) * 100)}%`, background: M3.expenseFill, transition: "width 200ms" }} title={`Spent: ${fmt(totalSpent)}`} />
          <div style={{ width: `${Math.min(100 - (totalSpent / totalIncome) * 100, Math.max(0, (totalBudgeted - totalSpent) / totalIncome) * 100)}%`, background: M3.incomeFill + "50", transition: "width 200ms" }} title={`Budgeted remaining: ${fmt(Math.max(0, totalBudgeted - totalSpent))}`} />
        </div>}
        {totalIncome > 0 && <div style={{ display: "flex", gap: 16, marginTop: 8, ...Type.labelSmall, color: M3.onSurfaceVariant }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: M3.expenseFill }} /> Spent</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: M3.incomeFill + "50" }} /> Budgeted (remaining)</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: M3.income + "12" }} /> Unallocated</span>
        </div>}
      </Card>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <KPICard label={`Total Spent (${mo_[mo]})`} value={fmt(totalSpent)} color={M3.expense} icon={I.expense} />
        <KPICard label="Budget Remaining" value={fmt(Math.max(0, totalBudgeted - totalSpent))} sub={totalSpent > totalBudgeted ? `Over by ${fmt(totalSpent - totalBudgeted)}` : `${pct(totalBudgeted - totalSpent, totalBudgeted)}% of budget left`} color={totalSpent > totalBudgeted ? M3.error : M3.income} icon={I.cashflow} />
        <KPICard label="Over Budget" value={overBudget} color={overBudget > 0 ? M3.error : M3.onSurfaceVariant} />
        <KPICard label="Near Limit" value={nearLimit} color={nearLimit > 0 ? M3.warning : M3.onSurfaceVariant} />
      </div>
      <ChartCard title="Budget Overview by Group">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={groupData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={M3.outlineVariant} strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="name" tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} />
            <YAxis tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
            <Tooltip cursor={{ fill: M3.cursorFill }} content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const groupColor = payload[0]?.payload?.color || M3.outline;
              const spentColor = payload[0]?.payload?.Spent > payload[0]?.payload?.Budget ? M3.error : groupColor;
              return <div style={{ background: M3.inverseSurface, color: M3.inverseOnSurface, borderRadius: Shape.small, padding: "10px 16px", border: `1px solid ${M3.inverseOnSurface}30`, ...Elevation.level3, ...Type.bodySmall }}>
                <div style={{ ...Type.labelMedium, marginBottom: 4 }}>{label}</div>
                {payload.map((p, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, opacity: 0.9 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: p.dataKey === "Spent" ? spentColor : M3.surfaceContainer, flexShrink: 0 }} />{p.name}</span>
                  <span style={{ fontWeight: 600 }}>{fmt(p.value)}</span>
                </div>)}
              </div>;
            }} />
            <Bar dataKey="Budget" fill={M3.primary + "18"} radius={[Shape.extraSmall, Shape.extraSmall, 0, 0]} barSize={20} name="Budget" />
            <Bar dataKey="Spent" radius={[Shape.extraSmall, Shape.extraSmall, 0, 0]} barSize={20} name="Spent">
              {groupData.map((g, i) => <Cell key={i} fill={(g.Spent > g.Budget ? M3.error : g.color) + "B0"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {BUDGET_GROUPS.map(group => {
          const isOpen = expanded[group.key];
          const gs = group.cats.reduce((s, c) => s + (sbc[c] || 0), 0);
          const gBudget = group.cats.reduce((s, c) => s + gB(c), 0);
          const gRemaining = Math.max(0, gBudget - gs);
          const gOver = gs > gBudget && gBudget > 0;
          return (
            <Card key={group.key} variant="outlined" style={{ padding: 0, overflow: "hidden" }}>
              <button onClick={() => toggle(group.key)} aria-expanded={isOpen} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", cursor: "pointer", userSelect: "none", borderLeft: `4px solid ${getBudgetColors()[group.key]}`, transition: "background 150ms", width: "100%", border: "none", borderLeft: `4px solid ${getBudgetColors()[group.key]}`, background: "transparent", fontFamily: FONT, textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = M3.surfaceContainerLow} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ transform: isOpen ? "rotate(0)" : "rotate(-90deg)", transition: "transform 120ms ease-out", display: "flex" }}>{I.chevDown}</span><span style={{ ...Type.titleSmall }}>{group.label}</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>{gBudget > 0 && <span style={{ ...Type.labelMedium, color: gOver ? M3.error : M3.income }}>{gOver ? `Over by ${fmt(gs - gBudget)}` : `${fmt(gRemaining)} left`}</span>}<span style={{ ...Type.bodyMedium, color: M3.onSurfaceVariant }}>{fmt(gs)} <span style={{ color: M3.outline }}>/ {fmt(gBudget)}</span></span><div style={{ width: 80 }}><ProgressBar value={gs} max={gBudget || 1} color={getBudgetColors()[group.key]} /></div></div>
              </button>
              {isOpen && <div style={{ padding: "4px 24px 16px 44px" }}>{group.cats.map(cat => {
                const spent = sbc[cat] || 0; const budget = gB(cat); const remaining = Math.max(0, budget - spent);
                const isOver = budget > 0 && spent > budget; const isNear = budget > 0 && spent >= budget * 0.8 && !isOver;
                return (
                  <div key={cat} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${M3.surfaceContainerHigh}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ ...Type.bodyMedium, color: M3.onSurface }}>{cat}</span>
                          {hasOvr(cat) && <span style={{ ...Type.labelSmall, color: M3.tertiary, background: M3.tertiaryContainer, padding: "1px 6px", borderRadius: Shape.extraSmall }}>This month</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {isOver && <span style={{ ...Type.labelSmall, color: M3.onErrorContainer, background: M3.errorContainer, padding: "2px 8px", borderRadius: Shape.small }}>Over by {fmt(spent - budget)}</span>}
                          {isNear && <span style={{ ...Type.labelSmall, color: M3.warning, background: M3.warningContainer, padding: "2px 8px", borderRadius: Shape.small }}>Near limit</span>}
                          {!isOver && budget > 0 && <span style={{ ...Type.labelSmall, color: M3.income }}>{fmt(remaining)} left</span>}
                          <span style={{ ...Type.bodyMedium, color: M3.onSurfaceVariant }}>{fmt(spent)}</span>
                          <span style={{ color: M3.outline }}>/</span>
                          {editingCat === cat ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                              <input className="inline-edit" type="number" value={editVal} onChange={e => setEditVal(e.target.value)} autoFocus style={{ width: 80, padding: "4px 8px", border: `2px solid ${M3.primary}`, borderRadius: Shape.extraSmall, ...Type.bodyMedium, fontFamily: FONT, outline: "none", background: "transparent" }} onKeyDown={e => e.key === "Enter" && saveEdit()} />
                              <div role="radiogroup" aria-label="Budget scope" style={{ display: "flex", gap: 2 }}>
                                <button role="radio" aria-checked={editScope === "month"} onClick={() => setEditScope("month")} style={{ padding: "3px 10px", border: `1px solid ${editScope === "month" ? M3.primary : M3.outlineVariant + "40"}`, borderRadius: `${Shape.small}px 0 0 ${Shape.small}px`, ...Type.labelSmall, fontFamily: FONT, background: editScope === "month" ? M3.primaryContainer : "transparent", color: editScope === "month" ? M3.onPrimaryContainer : M3.onSurfaceVariant, cursor: "pointer" }}>{mo_[mo]} only</button>
                                <button role="radio" aria-checked={editScope === "default"} onClick={() => setEditScope("default")} style={{ padding: "3px 10px", border: `1px solid ${editScope === "default" ? M3.primary : M3.outlineVariant + "40"}`, borderLeft: "none", borderRadius: `0 ${Shape.small}px ${Shape.small}px 0`, ...Type.labelSmall, fontFamily: FONT, background: editScope === "default" ? M3.primaryContainer : "transparent", color: editScope === "default" ? M3.onPrimaryContainer : M3.onSurfaceVariant, cursor: "pointer" }}>All months</button>
                              </div>
                              <Btn variant="icon" size="sm" onClick={saveEdit} style={{ color: M3.primary }} title="Save">{I.check}</Btn>
                              <Btn variant="icon" size="sm" onClick={() => setEditingCat(null)} title="Cancel">{I.x}</Btn>
                            </div>
                          ) : <span className="budget-val" onClick={() => startEdit(cat)} style={{ ...Type.labelLarge, color: budget ? M3.onSurface : M3.outline, cursor: "pointer", borderBottom: `1px dashed ${M3.outline}` }}>{budget ? fmt(budget) : "Not Set"}</span>}
                        </div>
                      </div>
                      <ProgressBar value={spent} max={budget || spent || 1} color={isOver ? M3.expenseFill : isNear ? M3.warningFill : getBudgetColors()[group.key]} />
                    </div>
                  </div>
                );
              })}</div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function LoanCard({ loan, rem, p, payments, openEdit, removeLoan, setPayLoanId, setPayAmount, setModal }) {
  const [showHistory, setShowHistory] = useState(false);
  return <Card variant="outlined" style={{ flex: "1 1 280px", minWidth: 280, padding: 20, display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}><div><div style={{ ...Type.titleSmall }}>{loan.name}</div><span style={{ ...Type.labelSmall, color: M3.onSurfaceVariant, background: M3.surfaceContainerHighest, padding: "2px 8px", borderRadius: Shape.small, marginTop: 4, display: "inline-block" }}>{loan.type}</span></div><div style={{ display: "flex", gap: 2 }}><Btn variant="icon" size="sm" onClick={() => openEdit(loan)} title="Edit">{I.edit}</Btn><Btn variant="icon" size="sm" onClick={() => removeLoan(loan.id)} style={{ color: M3.error }} title="Delete">{I.trash}</Btn></div></div>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 80, height: 80, position: "relative" }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ value: loan.amount_paid }, { value: rem }]} cx="50%" cy="50%" innerRadius={24} outerRadius={36} startAngle={90} endAngle={450} dataKey="value" strokeWidth={0}><Cell fill={M3.primary + "B0"}/><Cell fill={M3.primary + "25"}/></Pie></PieChart></ResponsiveContainer><div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...Type.labelLarge, color: M3.primary }}>{p}%</div></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>{[["Total", fmt(loan.total_amount), M3.onSurface], ["Paid", fmt(loan.amount_paid), M3.income], ["Remaining", fmt(rem), M3.expense], ["Min Payment", `${fmt(loan.minimum_payment)}/mo`, M3.onSurfaceVariant], ...(loan.apr ? [["APR", `${loan.apr}%`, M3.tertiary]] : [])].map(([l, v, c]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", ...Type.bodyMedium }}><span style={{ color: M3.onSurfaceVariant }}>{l}</span><span style={{ color: c, ...Type.labelLarge, fontWeight: 600 }}>{v}</span></div>)}</div>
    </div>
    {payments.length > 0 && (
      <div style={{ marginTop: 12 }}>
        <button className="text-btn" aria-expanded={showHistory} onClick={() => setShowHistory(h => !h)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "4px 0", fontFamily: FONT, ...Type.labelMedium, color: M3.onSurfaceVariant }}>
          <span style={{ transform: showHistory ? "rotate(0)" : "rotate(-90deg)", transition: "transform 120ms", display: "flex" }}>{I.chevDown}</span>
          Payment History ({payments.length})
        </button>
        {showHistory && <div style={{ marginTop: 8, padding: 10, background: M3.surfaceContainer, borderRadius: Shape.small, maxHeight: 160, overflow: "auto" }}>
          {[...payments].reverse().map((pay, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i < payments.length - 1 ? `1px solid ${M3.surfaceContainerHigh}` : "none", ...Type.bodyMedium }}>
              <span style={{ color: M3.onSurfaceVariant }}>{pay.date ? fmtDate(pay.date) : "No date"}</span>
              <span style={{ color: M3.income, fontWeight: 600 }}>+{fmt(pay.amount)}</span>
            </div>
          ))}
        </div>}
      </div>
    )}
    <div style={{ marginTop: "auto", paddingTop: 16 }}>
      <Btn variant="tonal" size="sm" onClick={() => { setPayLoanId(loan.id); setPayAmount(""); setModal("pay"); }} style={{ width: "100%" }}>{I.plus} Log Payment</Btn>
    </div>
  </Card>;
}

function LoansPage({ loans, setLoans, loanPayments, setLoanPayments }) {
  const [modal, setModal] = useState(null); const [payLoanId, setPayLoanId] = useState(null); const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", type: "Loan", total_amount: "", amount_paid: "", minimum_payment: "", apr: "" });
  const [payAmount, setPayAmount] = useState(""); const [monthlyBudget, setMonthlyBudget] = useState(800);
  const [confirm, confirmDialog] = useConfirm();
  const [loanErrors, setLoanErrors] = useState({});
  const tB = loans.reduce((s, l) => s + l.total_amount, 0), tP = loans.reduce((s, l) => s + l.amount_paid, 0), tO = tB - tP;
  const openAdd = () => { setEditingId(null); setLoanErrors({}); setForm({ name: "", type: "Loan", total_amount: "", amount_paid: "", minimum_payment: "", apr: "" }); setModal("add"); };
  const openEdit = (l) => { setEditingId(l.id); setLoanErrors({}); setForm({ name: l.name, type: l.type, total_amount: l.total_amount, amount_paid: l.amount_paid, minimum_payment: l.minimum_payment, apr: l.apr || "" }); setModal("add"); };
  const saveLoan = () => {
    const e = {};
    if (!form.name) e.name = "Name is required";
    if (!form.total_amount || Number(form.total_amount) <= 0) e.total_amount = "Amount is required";
    if (Object.keys(e).length) { setLoanErrors(e); return; }
    setLoanErrors({});
    if (editingId) { setLoans(p => p.map(l => l.id === editingId ? { ...l, name: form.name, type: form.type, total_amount: Number(form.total_amount), amount_paid: Number(form.amount_paid) || 0, minimum_payment: Number(form.minimum_payment) || 0, apr: Number(form.apr) || 0 } : l)); } else { setLoans(p => [...p, { id: uid(), name: form.name, type: form.type, total_amount: Number(form.total_amount), amount_paid: Number(form.amount_paid) || 0, minimum_payment: Number(form.minimum_payment) || 0, apr: Number(form.apr) || 0 }]); } setModal(null); setEditingId(null);
  };
  const logPayment = () => { if (!payAmount || !payLoanId) return; const a = Number(payAmount); setLoans(p => p.map(l => l.id === payLoanId ? { ...l, amount_paid: Math.min(l.total_amount, l.amount_paid + a) } : l)); setLoanPayments(p => [...p, { loan_id: payLoanId, amount: a, date: new Date().toISOString().split("T")[0] }]); setModal(null); setPayAmount(""); };
  const removeLoan = (id) => confirm(() => setLoans(p => p.filter(l => l.id !== id)), "Delete loan?", "This loan and its data will be permanently removed.");
  // Unified debt projection: snowball strategy with per-loan monthly breakdown
  const debtPlan = useMemo(() => {
    const active = loans.filter(l => l.total_amount - l.amount_paid > 0);
    if (!active.length) return { timeline: [], perLoan: [], monthLabels: [] };
    const d = active.map(l => ({ id: l.id, name: l.name, type: l.type, remaining: l.total_amount - l.amount_paid, monthlyRate: (l.apr || 0) / 100 / 12, minPay: l.minimum_payment })).sort((a, b) => a.remaining - b.remaining);
    const mt = d.reduce((s, x) => s + x.minPay, 0);
    const ex = Math.max(0, monthlyBudget - mt);
    const perLoan = d.map(x => ({ name: x.name, type: x.type, current: Math.round(x.remaining * 100) / 100, months: [] }));
    const timeline = []; let mo = 0;
    const now = new Date(); const monthLabels = [];
    while (d.reduce((s, x) => s + Math.max(0, x.remaining), 0) > 0 && mo < 360) {
      mo++; let el = ex;
      for (let i = 0; i < d.length; i++) {
        const x = d[i];
        if (x.remaining <= 0) { perLoan[i].months.push(0); continue; }
        x.remaining += x.remaining * x.monthlyRate;
        x.remaining -= Math.min(x.remaining, x.minPay);
        if (el > 0) { const b = Math.min(x.remaining, el); x.remaining -= b; el -= b; }
        x.remaining = Math.max(0, x.remaining);
        perLoan[i].months.push(Math.round(x.remaining * 100) / 100);
      }
      const tr = d.reduce((s, x) => s + Math.max(0, x.remaining), 0);
      timeline.push({ month: `M${mo}`, remaining: Math.round(tr) });
      if (mo <= 24) {
        const md = new Date(now.getFullYear(), now.getMonth() + mo, 1);
        monthLabels.push(mo_[md.getMonth()] + (md.getFullYear() !== now.getFullYear() ? ` '${String(md.getFullYear()).slice(2)}` : ""));
      }
    }
    return { timeline, perLoan, monthLabels: monthLabels.slice(0, 12) };
  }, [loans, monthlyBudget]);
  const dfm = debtPlan.timeline.length ? debtPlan.timeline.findIndex(d => d.remaining === 0) + 1 : null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {confirmDialog}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}><KPICard label="Total Borrowed" value={fmt(tB)} color={M3.onSurfaceVariant} /><KPICard label="Still Owed" value={fmt(tO)} color={M3.expense} icon={I.loan} /><KPICard label="Total Paid" value={fmt(tP)} color={M3.income} /></div>
      <Card variant="outlined">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><span style={{ ...Type.titleMedium }}>Your Loans</span><Btn onClick={openAdd} variant="filled">{I.plus} Add Loan</Btn></div>
        {loans.length === 0 ? <EmptyState message="No loans tracked yet" action={<Btn variant="tonal" size="sm" onClick={openAdd}>{I.plus} Add your first loan</Btn>} /> : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>{loans.map(loan => {
            const rem = loan.total_amount - loan.amount_paid, p = pct(loan.amount_paid, loan.total_amount);
            const payments = loanPayments.filter(lp => lp.loan_id === loan.id);
            return <LoanCard key={loan.id} loan={loan} rem={rem} p={p} payments={payments} openEdit={openEdit} removeLoan={removeLoan} setPayLoanId={setPayLoanId} setPayAmount={setPayAmount} setModal={setModal} />;
          })}</div>
        )}
      </Card>
      {debtPlan.timeline.length > 0 && (
        <ChartCard title="Debt-Free Projection (Snowball)" action={dfm ? <span style={{ ...Type.labelMedium, color: M3.onPrimaryContainer, background: M3.primaryContainer, padding: "4px 16px", borderRadius: Shape.full }}>~{dfm} months</span> : null}>
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}><span style={{ ...Type.labelMedium, color: M3.onSurfaceVariant }}>Monthly Budget</span><input type="range" min={loans.reduce((s, l) => s + l.minimum_payment, 0)} max={3000} step={50} value={monthlyBudget} onChange={e => setMonthlyBudget(Number(e.target.value))} style={{ flex: 1, minWidth: 150, background: `linear-gradient(to right, ${M3.primary} 0%, ${M3.primary} ${((monthlyBudget - loans.reduce((s, l) => s + l.minimum_payment, 0)) / (3000 - loans.reduce((s, l) => s + l.minimum_payment, 0))) * 100}%, ${M3.primary}18 ${((monthlyBudget - loans.reduce((s, l) => s + l.minimum_payment, 0)) / (3000 - loans.reduce((s, l) => s + l.minimum_payment, 0))) * 100}%, ${M3.primary}18 100%)` }} /><span style={{ ...Type.titleSmall, color: M3.primary, minWidth: 80 }}>{fmt(monthlyBudget)}/mo</span></div>
          <ResponsiveContainer width="100%" height={200}><AreaChart data={debtPlan.timeline.filter((_, i) => i % (debtPlan.timeline.length > 60 ? 3 : 1) === 0)}><defs><linearGradient id="gD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={M3.expense} stopOpacity={0.25}/><stop offset="100%" stopColor={M3.expense} stopOpacity={0.03}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={M3.outlineVariant} strokeOpacity={0.5}/><XAxis dataKey="month" tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} interval="preserveStartEnd"/><YAxis tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} tickFormatter={v=>`€${v/1000}k`}/><Tooltip content={<CTooltip/>} cursor={{ fill: M3.cursorFill }}/><Area type="monotone" dataKey="remaining" name="Remaining" stroke={M3.expense} fill="url(#gD)" strokeWidth={2} dot={false}/></AreaChart></ResponsiveContainer>
        </ChartCard>
      )}
      {/* ── Debt Payoff Plan Table ── */}
      {debtPlan.perLoan.length > 0 && (() => {
        const { perLoan, monthLabels } = debtPlan;
        const totalLiabPerMonth = monthLabels.map((_, i) => perLoan.reduce((s, l) => s + (l.months[i] ?? 0), 0));
        const currentLiabTotal = perLoan.reduce((s, l) => s + l.current, 0);
        const cs = { padding: "8px 12px", textAlign: "right", whiteSpace: "nowrap", borderBottom: `1px solid ${M3.surfaceContainerHigh}` };
        const hs = { ...cs, ...Type.labelSmall, color: M3.onSurfaceVariant, position: "sticky", top: 0, background: M3.surfaceContainerLowest, zIndex: 1 };
        const rs = { ...cs, ...Type.bodyMedium };
        return (
          <Card variant="outlined" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <span style={{ ...Type.titleSmall, color: M3.onSurface }}>Debt Payoff Plan</span>
              <span style={{ ...Type.labelSmall, color: M3.onSurfaceVariant }}>Snowball strategy at {fmt(monthlyBudget)}/mo</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr>
                    <th style={{ ...hs, textAlign: "left", position: "sticky", left: 0, background: M3.surfaceContainerLowest, zIndex: 2, minWidth: 160 }}></th>
                    <th style={hs}>Now</th>
                    {monthLabels.map((m, i) => <th key={i} style={hs}>{m}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {perLoan.map((loan, li) => (
                    <tr key={li}>
                      <td style={{ ...rs, textAlign: "left", position: "sticky", left: 0, background: M3.surfaceContainerLowest, paddingLeft: 16, color: M3.onSurface }}>
                        {loan.name} <span style={{ ...Type.labelSmall, color: M3.onSurfaceVariant }}>{loan.type}</span>
                      </td>
                      <td style={{ ...rs, color: M3.expense }}>{fmtFull(loan.current)}</td>
                      {loan.months.map((v, i) => (
                        <td key={i} style={{ ...rs, color: v <= 0 ? M3.income : M3.expense, fontWeight: v <= 0 ? 600 : 400 }}>{v <= 0 ? <span style={{ ...Type.labelSmall, color: M3.onPrimaryContainer, background: M3.primaryContainer, padding: "2px 8px", borderRadius: Shape.small }}>Paid off</span> : fmtFull(v)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ background: M3.surfaceContainer }}>
                    <td style={{ ...rs, textAlign: "left", position: "sticky", left: 0, background: M3.surfaceContainer, ...Type.titleSmall, fontWeight: 700, color: M3.onSurface }}>Total Debt</td>
                    <td style={{ ...rs, ...Type.titleSmall, fontWeight: 700, color: M3.expense }}>{fmtFull(currentLiabTotal)}</td>
                    {totalLiabPerMonth.map((v, i) => <td key={i} style={{ ...rs, ...Type.titleSmall, fontWeight: 700, color: v <= 0 ? M3.income : M3.expense }}>{v <= 0 ? "€0,00" : fmtFull(v)}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        );
      })()}
      <Modal open={modal === "add"} onClose={() => { setModal(null); setEditingId(null); }} title={editingId ? "Edit Loan" : "Add Loan"}><div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}><Input label="Loan Name" value={form.name} onChange={v => { setForm({ ...form, name: v }); if (loanErrors.name) setLoanErrors(e => ({ ...e, name: null })); }} placeholder="e.g. Student Loan" error={loanErrors.name} /><Input label="Loan Type" value={form.type} onChange={v => setForm({ ...form, type: v })} options={["Loan", "Credit Card"]} /><Input label="Total Amount" type="number" value={form.total_amount} onChange={v => { setForm({ ...form, total_amount: v }); if (loanErrors.total_amount) setLoanErrors(e => ({ ...e, total_amount: null })); }} error={loanErrors.total_amount} /><Input label="Amount Already Paid" type="number" value={form.amount_paid} onChange={v => setForm({ ...form, amount_paid: v })} /><Input label="Minimum Monthly Payment" type="number" value={form.minimum_payment} onChange={v => setForm({ ...form, minimum_payment: v })} /><Input label="Annual Interest Rate (APR %)" type="number" value={form.apr} onChange={v => setForm({ ...form, apr: v })} placeholder="0" min="0" step="0.1" /><div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}><Btn variant="text" onClick={() => { setModal(null); setEditingId(null); }}>Cancel</Btn><Btn variant="filled" onClick={saveLoan}>{editingId ? "Update" : "Add"} Loan</Btn></div></div></Modal>
      <Modal open={modal === "pay"} onClose={() => setModal(null)} title="Log Payment"><div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}><div style={{ ...Type.bodyMedium, color: M3.onSurfaceVariant }}>Loan: <strong style={{ color: M3.onSurface }}>{loans.find(l => l.id === payLoanId)?.name}</strong></div><Input label="Payment Amount" type="number" value={payAmount} onChange={setPayAmount} placeholder="0.00" /><div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}><Btn variant="text" onClick={() => setModal(null)}>Cancel</Btn><Btn variant="filled" onClick={logPayment}>Log Payment</Btn></div></div></Modal>
    </div>
  );
}


function SavingsPage({ savings, setSavings, contributions, setContributions, mo, yr }) {
  const [modal, setModal] = useState(false); const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", target_amount: "", current_amount: "", target_date: "" });
  const [savingsErrors, setSavingsErrors] = useState({});
  const [addModal, setAddModal] = useState(null); const [addAmt, setAddAmt] = useState("");
  const [confirm, confirmDialog] = useConfirm();

  const monthContribs = contributions.filter(c => c.date && gM(c.date) === mo && gY(c.date) === yr);
  const totalThisMonth = monthContribs.reduce((s, c) => s + c.amount, 0);

  // Trend: last 6 months of contributions
  const contribTrend = [];
  for (let j = 5; j >= 0; j--) {
    const m = new Date(yr, mo - j, 1); const tm = m.getMonth(), ty = m.getFullYear();
    const total = contributions.filter(c => c.date && gM(c.date) === tm && gY(c.date) === ty).reduce((s, c) => s + c.amount, 0);
    contribTrend.push({ name: mo_[tm], amount: total });
  }

  const openAdd = () => { setEditing(null); setSavingsErrors({}); setForm({ name: "", target_amount: "", current_amount: "", target_date: "" }); setModal(true); };
  const save = () => {
    const e = {};
    if (!form.name) e.name = "Goal name is required";
    if (!form.target_amount || Number(form.target_amount) <= 0) e.target_amount = "Target amount is required";
    if (Object.keys(e).length) { setSavingsErrors(e); return; }
    setSavingsErrors({});
    if (editing) setSavings(p => p.map(s => s.id === editing ? { ...s, name: form.name, target_amount: Number(form.target_amount), current_amount: Number(form.current_amount) || 0, target_date: form.target_date || "" } : s));
    else setSavings(p => [...p, { id: uid(), name: form.name, target_amount: Number(form.target_amount), current_amount: Number(form.current_amount) || 0, target_date: form.target_date || "" }]);
    setModal(false);
  };
  const remove = (id) => confirm(() => setSavings(p => p.filter(s => s.id !== id)), "Delete savings goal?", "This goal will be permanently removed.");
  const addFunds = () => {
    if (!addAmt || !addModal) return;
    const amt = Number(addAmt);
    setSavings(p => p.map(s => s.id === addModal ? { ...s, current_amount: s.current_amount + amt } : s));
    const goalName = savings.find(s => s.id === addModal)?.name || "";
    setContributions(p => [...p, { id: uid(), goal_id: addModal, goal_name: goalName, amount: amt, date: new Date(yr, mo, new Date().getDate()).toISOString().split("T")[0] }]);
    setAddModal(null); setAddAmt("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {confirmDialog}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <KPICard label={`Contributed (${mo_[mo]})`} value={fmt(totalThisMonth)} color={M3.tertiary} icon={I.savings} />
        <KPICard label="Active Goals" value={savings.length} color={M3.secondary} />
        <KPICard label="Total Saved" value={fmt(savings.reduce((s, g) => s + g.current_amount, 0))} color={M3.income} />
      </div>
      {contribTrend.some(c => c.amount > 0) && (
        <ChartCard title="Monthly Contributions">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={contribTrend} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke={M3.outlineVariant} strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="name" tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} />
              <YAxis tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
              <Tooltip content={<CTooltip />} cursor={{ fill: M3.cursorFill }} />
              <Bar dataKey="amount" name="Contributions" fill={M3.tertiary + "B0"} radius={[Shape.extraSmall, Shape.extraSmall, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ ...Type.titleLarge }}>Savings Goals</span><Btn onClick={openAdd} variant="filled">{I.plus} New Goal</Btn></div>
      {savings.length === 0 ? <Card variant="outlined"><EmptyState message="No savings goals yet" action={<Btn variant="tonal" size="sm" onClick={openAdd}>{I.plus} Create your first goal</Btn>} /></Card> : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>{savings.map(goal => {
          const p = pct(goal.current_amount, goal.target_amount), rem = goal.target_amount - goal.current_amount;
          const isComplete = goal.current_amount >= goal.target_amount;
          const goalContribs = monthContribs.filter(c => c.goal_id === goal.id);
          // Pace indicator with timeline
          let paceLabel = null, paceColor = M3.onSurfaceVariant, timelinePct = null, expectedPct = null;
          const goalContribAll = contributions.filter(c => c.goal_id === goal.id);
          const uniqueMonths = new Set(goalContribAll.map(c => c.date?.slice(0, 7))).size;
          if (isComplete) {
            paceLabel = "Goal reached"; paceColor = M3.income;
          } else if (goal.target_date && rem > 0) {
            const target = new Date(goal.target_date); const now = new Date();
            const created = goalContribAll.map(c => new Date(c.date)).sort((a,b) => a-b)[0] || now;
            const totalSpan = Math.max(1, target - created);
            const elapsed = Math.max(0, now - created);
            timelinePct = Math.min(100, Math.round((elapsed / totalSpan) * 100));
            expectedPct = timelinePct;
            const monthsLeft = Math.max(0, (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()));
            if (monthsLeft <= 0) { paceLabel = "Past deadline"; paceColor = M3.error; }
            else if (uniqueMonths < 2) { paceLabel = "Not enough data yet"; paceColor = M3.onSurfaceVariant; }
            else {
              const neededPerMonth = rem / monthsLeft;
              const avgContrib = goalContribAll.reduce((s, c) => s + c.amount, 0) / uniqueMonths;
              if (avgContrib >= neededPerMonth * 0.9) { paceLabel = "On track"; paceColor = M3.income; }
              else if (avgContrib >= neededPerMonth * 0.5) { paceLabel = "Behind pace"; paceColor = M3.warning; }
              else { paceLabel = `Need ${fmt(Math.round(neededPerMonth))}/mo`; paceColor = M3.expense; }
            }
          }
          return <Card key={goal.id} variant="outlined" style={{ flex: "1 1 300px", minWidth: 300 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}><div><div style={{ ...Type.titleMedium }}>{goal.name}</div><div style={{ ...Type.bodySmall, color: M3.onSurfaceVariant, marginTop: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>{isComplete ? <span style={{ color: M3.income }}>Target reached{goal.current_amount > goal.target_amount ? ` (+${fmt(goal.current_amount - goal.target_amount)} extra)` : ""}</span> : <>{fmt(rem)} to go</>}{goal.target_date && !isComplete && <span> · by {fmtDate(goal.target_date)}</span>}{paceLabel && <span style={{ ...Type.labelSmall, color: paceColor, background: paceColor + "18", padding: "1px 8px", borderRadius: Shape.extraSmall }}>{paceLabel}</span>}</div></div><div style={{ display: "flex", gap: 4 }}><Btn variant="icon" size="sm" onClick={() => { setEditing(goal.id); setSavingsErrors({}); setForm({ name: goal.name, target_amount: goal.target_amount, current_amount: goal.current_amount, target_date: goal.target_date || "" }); setModal(true); }} title="Edit">{I.edit}</Btn><Btn variant="icon" size="sm" onClick={() => remove(goal.id)} style={{ color: M3.error }} title="Delete">{I.trash}</Btn></div></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <div style={{ position: "relative", width: 120, height: 120 }}>
                <svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke={(p >= 100 ? M3.primary : M3.tertiary) + "18"} strokeWidth="8"/><circle cx="60" cy="60" r="50" fill="none" stroke={p >= 100 ? M3.incomeFill : M3.tertiary} strokeWidth="8" strokeDasharray={`${Math.min(p, 100) * 3.14} ${314 - Math.min(p, 100) * 3.14}`} strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: "stroke-dasharray 250ms ease-out" }}/></svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...Type.headlineSmall, fontWeight: 600, color: M3.primary }}>{p}%</div>
              </div>
            </div>
            {/* Timeline bar */}
            {timelinePct !== null && <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", ...Type.labelSmall, color: M3.onSurfaceVariant, marginBottom: 4 }}><span>Start</span><span>Target date</span></div>
              <div style={{ position: "relative", height: 8, borderRadius: Shape.full, background: (p >= expectedPct ? M3.income : paceColor) + "18", overflow: "visible" }}>
                {/* Expected position marker */}
                <div style={{ position: "absolute", left: `${expectedPct}%`, top: -2, width: 2, height: 12, background: M3.outline, borderRadius: 1, zIndex: 2 }} title={`Time elapsed: ${expectedPct}%`} />
                {/* Actual savings progress */}
                <div style={{ height: "100%", width: `${Math.min(p, 100)}%`, borderRadius: Shape.full, background: p >= expectedPct ? M3.incomeFill : paceColor, transition: "width 200ms ease-out" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", ...Type.labelSmall, marginTop: 4 }}>
                <span style={{ color: M3.income }}>Saved {p}%</span>
                <span style={{ color: M3.outline }}>Time {expectedPct}%</span>
              </div>
            </div>}
            <div style={{ display: "flex", justifyContent: "space-between", ...Type.bodyMedium, color: M3.onSurfaceVariant, marginBottom: 8 }}><span>Saved: <strong style={{ color: M3.income }}>{fmt(goal.current_amount)}</strong></span><span>Target: <strong style={{ color: M3.onSurface }}>{fmt(goal.target_amount)}</strong></span></div>
            {goalContribs.length > 0 && <div style={{ marginBottom: 12, padding: 8, background: M3.surfaceContainer, borderRadius: Shape.small }}>
              <div style={{ ...Type.labelSmall, color: M3.onSurfaceVariant, marginBottom: 4 }}>This month's contributions:</div>
              {goalContribs.map((c, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", ...Type.bodyMedium, padding: "2px 0" }}><span style={{ color: M3.onSurfaceVariant }}>{fmtDate(c.date)}</span><span style={{ color: M3.income, fontWeight: 600 }}>+{fmt(c.amount)}</span></div>)}
            </div>}
            <Btn variant="tonal" size="sm" onClick={() => { setAddModal(goal.id); setAddAmt(""); }} style={{ width: "100%" }}>{I.plus} Add Funds</Btn>
          </Card>;
        })}</div>
      )}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Goal" : "New Savings Goal"}><div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}><Input label="Goal Name" value={form.name} onChange={v => { setForm({ ...form, name: v }); if (savingsErrors.name) setSavingsErrors(e => ({ ...e, name: null })); }} placeholder="e.g. Emergency Fund" error={savingsErrors.name} /><Input label="Target Amount" type="number" value={form.target_amount} onChange={v => { setForm({ ...form, target_amount: v }); if (savingsErrors.target_amount) setSavingsErrors(e => ({ ...e, target_amount: null })); }} error={savingsErrors.target_amount} /><Input label="Current Amount" type="number" value={form.current_amount} onChange={v => setForm({ ...form, current_amount: v })} /><Input label="Target Date (optional)" type="date" value={form.target_date} onChange={v => setForm({ ...form, target_date: v })} /><div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}><Btn variant="text" onClick={() => setModal(false)}>Cancel</Btn><Btn variant="filled" onClick={save}>{editing ? "Update" : "Create"}</Btn></div></div></Modal>
      <Modal open={!!addModal} onClose={() => setAddModal(null)} title="Add Funds"><div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}><div style={{ ...Type.bodyMedium, color: M3.onSurfaceVariant }}>Goal: <strong style={{ color: M3.onSurface }}>{savings.find(s => s.id === addModal)?.name}</strong></div><Input label="Amount" type="number" value={addAmt} onChange={setAddAmt} placeholder="0.00" /><div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}><Btn variant="text" onClick={() => setAddModal(null)}>Cancel</Btn><Btn variant="filled" onClick={addFunds}>Add Funds</Btn></div></div></Modal>
    </div>
  );
}

function ReportsPage({ incomes, expenses, budgets, loans, mo, yr }) {
  const [fT, setFT] = useState("month"); const [cF, setCF] = useState(""); const [cT, setCT] = useState("");
  const fY = yr;
  const filtered = useMemo(() => { let fI = incomes, fE = expenses; if (fT === "month") { fI = incomes.filter(i => gM(i.date) === mo && gY(i.date) === yr); fE = expenses.filter(e => gM(e.date) === mo && gY(e.date) === yr); } else if (fT === "year") { fI = incomes.filter(i => gY(i.date) === yr); fE = expenses.filter(e => gY(e.date) === yr); } else if (cF && cT) { const f = new Date(cF), t = new Date(cT); fI = incomes.filter(i => { const d = new Date(i.date); return d >= f && d <= t; }); fE = expenses.filter(e => { const d = new Date(e.date); return d >= f && d <= t; }); } return { incomes: fI, expenses: fE }; }, [incomes, expenses, fT, mo, yr, cF, cT]);
  const tI = filtered.incomes.reduce((s, i) => s + i.amount, 0), tE = filtered.expenses.reduce((s, e) => s + e.amount, 0);
  // Month-over-month change
  const pMo = mo === 0 ? 11 : mo - 1, pYr = mo === 0 ? yr - 1 : yr;
  const prevI = fByM(incomes, pMo, pYr).reduce((s, i) => s + i.amount, 0);
  const prevE = fByM(expenses, pMo, pYr).reduce((s, e) => s + e.amount, 0);
  const incChange = prevI > 0 ? Math.round(((tI - prevI) / prevI) * 100) : null;
  const expChange = prevE > 0 ? Math.round(((tE - prevE) / prevE) * 100) : null;
  const catMap = {}; filtered.expenses.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; }); const catData = Object.entries(catMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  // Spending insights: compare each category to its 3-month average
  const insights = useMemo(() => {
    if (fT !== "month") return [];
    const result = [];
    const cats = Object.keys(catMap);
    cats.forEach(cat => {
      const current = catMap[cat];
      let totalPrev = 0, monthsWithData = 0;
      for (let j = 1; j <= 3; j++) {
        const pm = new Date(yr, mo - j, 1);
        const pmExp = expenses.filter(e => gM(e.date) === pm.getMonth() && gY(e.date) === pm.getFullYear() && e.category === cat);
        const pmTotal = pmExp.reduce((s, e) => s + e.amount, 0);
        if (pmTotal > 0) { totalPrev += pmTotal; monthsWithData++; }
      }
      if (monthsWithData < 2) return; // Need at least 2 months of history
      const avg = totalPrev / monthsWithData;
      const changePct = Math.round(((current - avg) / avg) * 100);
      if (Math.abs(changePct) >= 25 && Math.abs(current - avg) >= 20) {
        result.push({ cat, current, avg: Math.round(avg), changePct, isUp: changePct > 0 });
      }
    });
    return result.sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)).slice(0, 4);
  }, [catMap, expenses, mo, yr, fT]);
  const mc = []; for (let m = 0; m < 12; m++) { mc.push({ name: mo_[m], Income: incomes.filter(i => gM(i.date) === m && gY(i.date) === fY).reduce((s, i) => s + i.amount, 0), Expenses: expenses.filter(e => gM(e.date) === m && gY(e.date) === fY).reduce((s, e) => s + e.amount, 0) }); }
  const bp = BUDGET_GROUPS.flatMap(g => g.cats).filter(c => getBudget(budgets, c, mo, yr) > 0).map(cat => ({ name: cat.length > 12 ? cat.slice(0, 12) + "…" : cat, Budget: getBudget(budgets, cat, mo, yr), Spent: filtered.expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0) }));
  const dt = loans.map(l => ({ name: l.name, Months: l.minimum_payment > 0 ? Math.ceil((l.total_amount - l.amount_paid) / l.minimum_payment) : 0 }));
  const ss = { ...getSelectStyle(), borderRadius: Shape.small };
  const periodLabel = fT === "month" ? `${moFull[mo]} ${yr}` : fT === "year" ? `${yr}` : cF && cT ? "Custom range" : "Select dates";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card variant="filled" style={{ padding: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ ...Type.labelMedium, color: M3.onSurfaceVariant, display: "flex", alignItems: "center", gap: 4 }}>{I.filter} Period</span>
        <div style={{ display: "flex", gap: 8 }}>
          <Chip label={`${mo_[mo]} ${yr}`} selected={fT === "month"} onClick={() => setFT("month")} />
          <Chip label={`Full ${yr}`} selected={fT === "year"} onClick={() => setFT("year")} />
          <Chip label="Custom" selected={fT === "custom"} onClick={() => setFT("custom")} />
        </div>
        {fT === "custom" && <><input type="date" value={cF} onChange={e => setCF(e.target.value)} style={{ ...ss, padding: "8px 12px", colorScheme: M3.surface === "#111411" ? "dark" : "light" }} /><span style={{ ...Type.bodySmall, color: M3.outline }}>to</span><input type="date" value={cT} onChange={e => setCT(e.target.value)} style={{ ...ss, padding: "8px 12px", colorScheme: M3.surface === "#111411" ? "dark" : "light" }} /></>}
        <div style={{ marginLeft: "auto", display: "flex", gap: 16, ...Type.labelLarge, flexWrap: "wrap" }}>
          <span style={{ color: M3.onSurfaceVariant }}>Income: <strong style={{ color: M3.income }}>{fmt(tI)}</strong>{fT === "month" && incChange !== null && <span style={{ ...Type.labelSmall, marginLeft: 4, color: incChange >= 0 ? M3.income : M3.expense }}>{incChange >= 0 ? "+" : ""}{incChange}%</span>}</span>
          <span style={{ color: M3.onSurfaceVariant }}>Expenses: <strong style={{ color: M3.expense }}>{fmt(tE)}</strong>{fT === "month" && expChange !== null && <span style={{ ...Type.labelSmall, marginLeft: 4, color: expChange <= 0 ? M3.income : M3.expense }}>{expChange >= 0 ? "+" : ""}{expChange}%</span>}</span>
          <span style={{ color: M3.onSurfaceVariant }}>Net: <strong style={{ color: tI - tE >= 0 ? M3.income : M3.error }}>{fmt(tI - tE)}</strong></span>
        </div>
      </div></Card>
      {/* Spending insights */}
      {insights.length > 0 && <Card variant="outlined" style={{ padding: 20 }}>
        <div style={{ ...Type.titleSmall, color: M3.onSurface, marginBottom: 12 }}>Spending Insights</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {insights.map(ins => (
            <div key={ins.cat} style={{ flex: "1 1 220px", padding: "12px 16px", background: ins.isUp ? M3.errorContainer + "60" : M3.primaryContainer + "60", borderRadius: Shape.small, border: `1px solid ${ins.isUp ? M3.error + "30" : M3.income + "30"}` }}>
              <div style={{ ...Type.labelMedium, color: M3.onSurface, marginBottom: 4 }}>{ins.cat}</div>
              <div style={{ ...Type.bodySmall, color: M3.onSurfaceVariant }}>
                {fmt(ins.current)} this month vs {fmt(ins.avg)} avg
              </div>
              <div style={{ ...Type.labelLarge, color: ins.isUp ? M3.error : M3.income, marginTop: 4 }}>
                {ins.isUp ? "↑" : "↓"} {Math.abs(ins.changePct)}% {ins.isUp ? "higher" : "lower"} than usual
              </div>
            </div>
          ))}
        </div>
      </Card>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <ChartCard title="Spending by Category">{catData.length === 0 ? <EmptyState message="No expenses in this period" /> : <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={catData} cx="50%" cy="50%" innerRadius={50} outerRadius={95} paddingAngle={2} dataKey="value" strokeWidth={0}>{catData.map((_, i) => <Cell key={i} fill={getColors()[i % getColors().length] + "B0"}/>)}</Pie><Tooltip content={<CTooltip/>} cursor={{ fill: M3.cursorFill }}/><Legend iconType="circle" iconSize={8} wrapperStyle={{...Type.labelSmall, color: M3.onSurfaceVariant}}/></PieChart></ResponsiveContainer>}</ChartCard>
        <ChartCard title={`Monthly Income vs Expenses (${fY})`}><ResponsiveContainer width="100%" height={260}><BarChart data={mc} barGap={2}><CartesianGrid strokeDasharray="3 3" stroke={M3.outlineVariant} strokeOpacity={0.5} vertical={false}/><XAxis dataKey="name" tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false}/><YAxis tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} tickFormatter={v=>`€${v/1000}k`}/><Tooltip content={<CTooltip/>} cursor={{ fill: M3.cursorFill }}/><Bar dataKey="Income" fill={M3.primary + "B0"} radius={[Shape.extraSmall,Shape.extraSmall,0,0]} barSize={14}/><Bar dataKey="Expenses" fill={M3.expense + "B0"} radius={[Shape.extraSmall,Shape.extraSmall,0,0]} barSize={14}/></BarChart></ResponsiveContainer></ChartCard>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {bp.length > 0 && <ChartCard title="Budget Performance"><ResponsiveContainer width="100%" height={260}><BarChart data={bp} barGap={2}><CartesianGrid strokeDasharray="3 3" stroke={M3.outlineVariant} strokeOpacity={0.5} vertical={false}/><XAxis dataKey="name" tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={60}/><YAxis tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false} tickFormatter={v=>`€${v}`}/><Tooltip content={<CTooltip/>} cursor={{ fill: M3.cursorFill }}/><Bar dataKey="Budget" fill={M3.primary + "25"} radius={[Shape.extraSmall,Shape.extraSmall,0,0]} barSize={12}/><Bar dataKey="Spent" fill={M3.expense + "B0"} radius={[Shape.extraSmall,Shape.extraSmall,0,0]} barSize={12}/></BarChart></ResponsiveContainer></ChartCard>}
        {dt.length > 0 && <ChartCard title="Debt Payoff Timeline"><ResponsiveContainer width="100%" height={260}><BarChart data={dt} layout="vertical" barSize={20}><CartesianGrid strokeDasharray="3 3" stroke={M3.outlineVariant} strokeOpacity={0.5} horizontal={false}/><XAxis type="number" tick={{...Type.labelSmall, fill: M3.onSurfaceVariant}} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" tick={{...Type.labelMedium, fill: M3.onSurface}} axisLine={false} tickLine={false} width={100}/><Tooltip formatter={v=>`${v} months`} cursor={{ fill: M3.cursorFill }}/><Bar dataKey="Months" fill={M3.expense + "B0"} radius={[0,Shape.extraSmall,Shape.extraSmall,0]}/></BarChart></ResponsiveContainer></ChartCard>}
      </div>
    </div>
  );
}

/* ═══ APP SHELL ═══ */
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: I.dashboard }, { key: "income", label: "Income", icon: I.income },
  { key: "expenses", label: "Expenses", icon: I.expense }, { key: "budget", label: "Budget", icon: I.budget },
  { key: "loans", label: "Loans", icon: I.loan }, { key: "savings", label: "Savings", icon: I.savings },
  { key: "reports", label: "Reports", icon: I.reports },
];
const DESC = { dashboard: "Your financial overview at a glance", income: "Track and manage your income sources", expenses: "Monitor your spending habits", budget: "Set and track monthly budgets", loans: "Manage debt and plan repayment", savings: "Track progress toward your goals", reports: "Detailed financial reports and analysis" };

const STORAGE_KEY = "financehub-data";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState(initBudgets);
  const [loans, setLoans] = useState([]);
  const [loanPayments, setLoanPayments] = useState([]);
  const [savings, setSavings] = useState([]);
  const [savingsContributions, setSavingsContributions] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [sMo, setSMo] = useState(new Date().getMonth());
  const [sYr, setSYr] = useState(new Date().getFullYear());
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const fileInputRef = useRef(null);

  // ── Theme: mutate module-level M3 & Elevation on each render ──
  // This is intentional. M3 and Elevation are module-level mutable objects read by all
  // components during render. Because darkMode is React state, toggling it triggers a
  // full tree re-render, at which point every component reads the updated M3 values.
  // This avoids a Context provider + 226 consumer rewrites for a single-file app.
  if (darkMode) {
    Object.assign(M3, DARK);
    Object.assign(Elevation, {
      level0: { boxShadow: "none" },
      level1: { boxShadow: "0 1px 2px rgba(0,0,0,0.3)" },
      level2: { boxShadow: "0 2px 4px rgba(0,0,0,0.3)" },
      level3: { boxShadow: "0 3px 8px rgba(0,0,0,0.4)" },
    });
  } else {
    Object.assign(M3, LIGHT);
    Object.assign(Elevation, {
      level0: { boxShadow: "none" },
      level1: { boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)" },
      level2: { boxShadow: "0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)" },
      level3: { boxShadow: "0 3px 6px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.08)" },
    });
  }

  // Persist dark mode preference
  useEffect(() => {
    (async () => { try { const r = await window.storage.get("financehub-theme"); if (r?.value === "dark") setDarkMode(true); } catch(e) {} })();
  }, []);
  useEffect(() => {
    (async () => { try { await window.storage.set("financehub-theme", darkMode ? "dark" : "light"); } catch(e) {} })();
  }, [darkMode]);

  // ── Load data from storage on mount ──
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result?.value) {
          const data = JSON.parse(result.value);
          if (data.incomes) setIncomes(data.incomes);
          if (data.expenses) setExpenses(data.expenses);
          if (data.budgets) setBudgets(data.budgets);
          if (data.loans) setLoans(data.loans);
          if (data.loanPayments) setLoanPayments(data.loanPayments);
          if (data.savings) setSavings(data.savings);
          if (data.savingsContributions) setSavingsContributions(data.savingsContributions);
        }
      } catch (e) {
        // No saved data yet — that's fine, start fresh
      }
      setLoaded(true);
    })();
  }, []);

  // ── Auto-save to storage whenever data changes ──
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!loaded) return; // Don't save until initial load is done
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        const data = JSON.stringify({ incomes, expenses, budgets, loans, loanPayments, savings, savingsContributions });
        await window.storage.set(STORAGE_KEY, data);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (e) {
        setSaveStatus("error");
      }
    }, 500); // Debounce 500ms so we don't save on every keystroke
    return () => clearTimeout(saveTimer.current);
  }, [incomes, expenses, budgets, loans, loanPayments, savings, savingsContributions, loaded]);

  // ── Backup: download all data as JSON ──
  const downloadBackup = () => {
    const data = { incomes, expenses, budgets, loans, loanPayments, savings, savingsContributions, exportedAt: new Date().toISOString() };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financehub-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // ── Restore: load data from JSON file ──
  const handleRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.incomes) setIncomes(data.incomes);
        if (data.expenses) setExpenses(data.expenses);
        if (data.budgets) setBudgets(data.budgets);
        if (data.loans) setLoans(data.loans);
        if (data.loanPayments) setLoanPayments(data.loanPayments);
        if (data.savings) setSavings(data.savings);
        if (data.savingsContributions) setSavingsContributions(data.savingsContributions);
        setShowBackupModal(false);
      } catch (err) {
        alert("Could not read this file. Make sure it's a FinanceHub backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ── Reset all data ──
  const [confirmReset, resetDialog] = useConfirm();
  const resetAll = () => confirmReset(async () => {
    setIncomes([]); setExpenses([]); setBudgets(initBudgets); setLoans([]); setLoanPayments([]); setSavings([]); setSavingsContributions([]);
    try { await window.storage.delete(STORAGE_KEY); } catch (e) {}
  }, "Reset all data?", "This will permanently delete all your income, expenses, budgets, loans, and savings. This cannot be undone.");

  const prevMonth = () => { if (sMo === 0) { setSMo(11); setSYr(y => y - 1); } else setSMo(m => m - 1); };
  const nextMonth = () => { if (sMo === 11) { setSMo(0); setSYr(y => y + 1); } else setSMo(m => m + 1); };

  // Keyboard shortcuts
  useEffect(() => {
    const pages = ["dashboard", "income", "expenses", "budget", "loans", "savings", "reports"];
    const handler = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 7) { e.preventDefault(); setPage(pages[num - 1]); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); prevMonth(); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); nextMonth(); return; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sMo, sYr]);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage incomes={incomes} expenses={expenses} budgets={budgets} loans={loans} savings={savings} mo={sMo} yr={sYr} setPage={setPage} />;
      case "income": return <TransactionPage items={incomes} setItems={setIncomes} type="income" categories={INCOME_CATS} colorMain={M3.income} mo={sMo} yr={sYr} />;
      case "expenses": return <TransactionPage items={expenses} setItems={setExpenses} type="expense" categories={EXPENSE_CATS} colorMain={M3.expense} mo={sMo} yr={sYr} />;
      case "budget": return <BudgetPage budgets={budgets} setBudgets={setBudgets} expenses={expenses} incomes={incomes} mo={sMo} yr={sYr} />;
      case "loans": return <LoansPage loans={loans} setLoans={setLoans} loanPayments={loanPayments} setLoanPayments={setLoanPayments} />;
      case "savings": return <SavingsPage savings={savings} setSavings={setSavings} contributions={savingsContributions} setContributions={setSavingsContributions} mo={sMo} yr={sYr} />;
      case "reports": return <ReportsPage incomes={incomes} expenses={expenses} budgets={budgets} loans={loans} mo={sMo} yr={sYr} />;
      default: return null;
    }
  };

  if (!loaded) {
    return <>
      <style>{`@keyframes fhSpin { to { transform: rotate(360deg); } }`}</style>
      <div aria-busy="true" aria-live="polite" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: FONT, background: M3.surface }}>
        <div style={{ textAlign: "center" }}>
          <div role="status" style={{ width: 40, height: 40, border: `3px solid ${M3.surfaceContainerHighest}`, borderTopColor: M3.primary, borderRadius: "50%", animation: "fhSpin 800ms linear infinite", margin: "0 auto 16px" }}><span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }}>Loading</span></div>
          <div style={{ ...Type.titleMedium, color: M3.onSurfaceVariant, marginBottom: 8 }}>Loading your data...</div>
          <div style={{ ...Type.bodySmall, color: M3.outline }}>FinanceHub</div>
        </div>
      </div>
    </>;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ${FONT}; background: ${M3.surface}; color: ${M3.onSurface}; -webkit-font-smoothing: antialiased; color-scheme: ${darkMode ? "dark" : "light"}; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${M3.outlineVariant}; border-radius: ${Shape.full}px; }
        input[type="range"] { height: 4px; cursor: pointer; -webkit-appearance: none; appearance: none; border-radius: 9999px; border: none; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: ${M3.primary}; border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.15); margin-top: -8px; }
        input[type="range"]::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: ${M3.primary}; border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
        input[type="range"]::-webkit-slider-runnable-track { height: 4px; border-radius: 9999px; }
        input[type="range"]::-moz-range-track { height: 4px; border-radius: 9999px; background: ${M3.primary}18; border: none; }
        input[type="range"]::-moz-range-progress { height: 4px; border-radius: 9999px; background: ${M3.primary}; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        ::selection { background: ${M3.primaryContainer}; color: ${M3.onPrimaryContainer}; }
        button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid ${M3.primary}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
        .th-sort { transition: color 80ms, background 80ms; border-radius: ${Shape.small}px; }
        .th-sort:hover { color: ${M3.onSurface} !important; background: ${M3.onSurface}0D; }
        .budget-val { transition: color 80ms, background 80ms, border-color 150ms; border-radius: ${Shape.extraSmall}px; padding: 2px 6px; margin: -2px -6px; }
        .budget-val:hover { background: ${M3.primary}14; color: ${M3.primary} !important; border-color: ${M3.primary} !important; }
        .inline-edit { transition: border-color 80ms, box-shadow 80ms; }
        .inline-edit:hover { border-color: ${M3.onSurface} !important; }
        .inline-edit:focus { border-color: ${M3.primary} !important; box-shadow: 0 0 0 1px ${M3.primary}; }
        .text-btn { transition: color 80ms, background 80ms; border-radius: ${Shape.small}px; padding: 4px 8px; margin: -4px -8px; }
        .text-btn:hover { background: ${M3.onSurface}0D; color: ${M3.onSurface} !important; }
        input[type="date"] { position: relative; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; border-radius: 50%; padding: 4px; transition: background 80ms; }
        input[type="date"]::-webkit-calendar-picker-indicator:hover { background: ${M3.onSurface}14; }
        @media (max-width: 768px) {
          .fh-nav { width: 0 !important; min-width: 0 !important; overflow: hidden !important; padding: 0 !important; }
          .fh-header { padding: 0 16px !important; }
          .fh-content { padding: 16px 16px 100px !important; }
          .fh-mobile-nav { display: flex !important; }
        }
        .fh-mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; height: 72px; background: ${M3.surfaceContainerLow}; border-top: 1px solid ${M3.outlineVariant}40; z-index: 20; align-items: center; justify-content: space-around; padding: 0 4px; }
        .fh-mobile-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; border: none; background: none; cursor: pointer; font-family: ${FONT}; color: ${M3.onSurfaceVariant}; padding: 8px 12px; border-radius: ${Shape.large}px; transition: background 80ms; min-width: 48px; }
        .fh-mobile-btn.active { color: ${M3.onSecondaryContainer}; }
        .fh-mobile-btn.active .fh-mobile-icon { background: ${M3.secondaryContainer}; border-radius: ${Shape.full}px; padding: 4px 20px; }
      `}</style>
      <a href="#fh-main" style={{ position: "absolute", top: -100, left: 0, background: M3.primary, color: M3.onPrimary, padding: "8px 16px", zIndex: 9999, ...Type.labelLarge, borderRadius: Shape.small, transition: "top 200ms" }} onFocus={e => e.target.style.top = "8px"} onBlur={e => e.target.style.top = "-100px"}>Skip to content</a>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <nav className="fh-nav" aria-label="Main navigation" style={{ position: "relative", width: collapsed ? 72 : 240, minWidth: collapsed ? 72 : 240, background: M3.surfaceContainerLow, display: "flex", flexDirection: "column", transition: "width 180ms ease-out, min-width 180ms ease-out", overflow: "hidden", zIndex: 10 }}>
          <div style={{ padding: collapsed ? "20px 12px" : "20px 16px 12px 16px", display: "flex", alignItems: "center", minHeight: 72, justifyContent: collapsed ? "center" : "space-between" }}>
            {!collapsed && <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: Shape.small, background: M3.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: M3.onPrimary, fontWeight: 700, fontSize: 17 }}>F</span></div>
              <span style={{ ...Type.titleMedium, color: M3.onSurface, whiteSpace: "nowrap" }}>FinanceHub</span>
            </div>}
            {!collapsed && <button aria-label="Collapse sidebar" onClick={() => setCollapsed(true)} style={{ width: 36, height: 36, borderRadius: Shape.full, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: M3.onSurfaceVariant, transition: "background 150ms", flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.background = M3.onSurface + "14"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>{I.chevLeft}</button>}
            {collapsed && <button aria-label="Expand sidebar" onClick={() => setCollapsed(false)} style={{ width: 36, height: 36, borderRadius: Shape.full, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: M3.onSurfaceVariant, transition: "background 150ms", flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.background = M3.onSurface + "14"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>{I.chevRight}</button>}
          </div>
          <div style={{ flex: 1, padding: collapsed ? "8px 8px" : "8px 12px", display: "flex", flexDirection: "column", gap: 4, alignItems: collapsed ? "center" : "stretch" }}>
            {NAV.map(item => {
              const active = page === item.key;
              return <button key={item.key} onClick={() => setPage(item.key)} aria-current={active ? "page" : undefined} style={{ display: "flex", alignItems: "center", gap: 12, height: collapsed ? 48 : 56, paddingLeft: collapsed ? 0 : 16, paddingRight: collapsed ? 0 : 24, border: "none", cursor: "pointer", fontFamily: FONT, background: active ? M3.secondaryContainer : "transparent", color: active ? M3.onSecondaryContainer : M3.onSurfaceVariant, borderRadius: Shape.full, ...Type.labelLarge, fontWeight: active ? 700 : 500, transition: "all 120ms ease-out", justifyContent: collapsed ? "center" : "flex-start", whiteSpace: "nowrap", width: collapsed ? 48 : "100%" }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = M3.onSurface + "0D"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? M3.secondaryContainer : "transparent"; }}
                title={collapsed ? item.label : undefined}>
                <span style={{ flexShrink: 0, display: "flex" }}>{item.icon}</span>
                {!collapsed && item.label}
              </button>;
            })}
          </div>
          <div style={{ padding: collapsed ? "8px 8px 16px" : "8px 12px 16px", borderTop: `1px solid ${M3.outlineVariant}14`, display: "flex", flexDirection: "column", gap: 4, alignItems: collapsed ? "center" : "stretch" }}>
            <button onClick={() => setShowBackupModal(true)} style={{ display: "flex", alignItems: "center", gap: 12, height: collapsed ? 48 : 44, paddingLeft: collapsed ? 0 : 16, paddingRight: collapsed ? 0 : 24, border: "none", cursor: "pointer", fontFamily: FONT, background: "transparent", color: M3.onSurfaceVariant, borderRadius: Shape.full, ...(collapsed ? Type.labelSmall : Type.labelMedium), transition: "background 150ms", width: collapsed ? 48 : "100%", justifyContent: collapsed ? "center" : "flex-start" }} onMouseEnter={e => e.currentTarget.style.background = M3.onSurface + "0D"} onMouseLeave={e => e.currentTarget.style.background = "transparent"} title={collapsed ? "Data & Backup" : undefined}>
              <span style={{ display: "flex" }}>{I.cloud}</span>
              {!collapsed && "Data & Backup"}
            </button>
          </div>
        </nav>
        <main id="fh-main" role="main" style={{ flex: 1, overflow: "auto", background: M3.surface }}>
          <header className="fh-header" style={{ height: 72, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: M3.surface, position: "sticky", top: 0, zIndex: 5, borderBottom: `1px solid ${M3.outlineVariant}28` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h1 style={{ ...Type.titleLarge, color: M3.onSurface }}>{NAV.find(n => n.key === page)?.label}</h1>
              {saveStatus === "saved" && <span aria-live="polite" style={{ display: "flex", alignItems: "center", gap: 4, ...Type.labelSmall, color: M3.income, opacity: 0.8, transition: "opacity 300ms" }}>{I.cloudCheck} Saved</span>}
              {saveStatus === "error" && <span aria-live="assertive" style={{ ...Type.labelSmall, color: M3.error }}>Save failed</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: M3.surfaceContainerLow, borderRadius: Shape.full, padding: "4px 4px", border: `1px solid ${M3.outlineVariant}50` }}>
                <button aria-label="Previous month" onClick={prevMonth} style={{ width: 44, height: 44, borderRadius: Shape.full, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: M3.onSurfaceVariant, transition: "background 150ms" }} onMouseEnter={e => e.currentTarget.style.background = M3.onSurface + "14"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>{I.chevLeft}</button>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px", minWidth: 160, justifyContent: "center" }}><span style={{ color: M3.primary, display: "flex" }}>{I.calendar}</span><span style={{ ...Type.titleSmall, color: M3.onSurface, fontWeight: 600 }}>{moFull[sMo]} {sYr}</span></div>
                <button aria-label="Next month" onClick={nextMonth} style={{ width: 44, height: 44, borderRadius: Shape.full, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: M3.onSurfaceVariant, transition: "background 150ms" }} onMouseEnter={e => e.currentTarget.style.background = M3.onSurface + "14"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>{I.chevRight}</button>
              </div>
              <Btn variant="icon" onClick={() => setDarkMode(d => !d)} title={darkMode ? "Light mode" : "Dark mode"}>{darkMode ? I.sun : I.moon}</Btn>
            </div>
          </header>
          <div className="fh-content" style={{ padding: "24px 32px 40px 32px", maxWidth: 1240, margin: "0 auto" }}>
            <p style={{ ...Type.bodyMedium, color: M3.onSurfaceVariant, marginBottom: 28 }}>{DESC[page]}</p>
            {renderPage()}
          </div>
        </main>
        {/* Backup & Data Modal */}
        <Modal open={showBackupModal} onClose={() => setShowBackupModal(false)} title="Data & Backup">
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
            <div style={{ ...Type.bodyMedium, color: M3.onSurfaceVariant }}>Your data is automatically saved in this conversation. Use backup to keep a copy or move data between devices.</div>
            <Card variant="filled" style={{ padding: 16 }}>
              <div style={{ ...Type.titleSmall, color: M3.onSurface, marginBottom: 8 }}>Download Backup</div>
              <div style={{ ...Type.bodySmall, color: M3.onSurfaceVariant, marginBottom: 12 }}>Saves all your data as a file. Keep it safe — you can restore from it anytime.</div>
              <Btn variant="filled" size="sm" onClick={downloadBackup}>{I.download} Download Backup</Btn>
            </Card>
            <Card variant="filled" style={{ padding: 16 }}>
              <div style={{ ...Type.titleSmall, color: M3.onSurface, marginBottom: 8 }}>Restore from Backup</div>
              <div style={{ ...Type.bodySmall, color: M3.onSurfaceVariant, marginBottom: 12 }}>Load a previously saved backup file. This will replace all current data.</div>
              <Btn variant="tonal" size="sm" onClick={() => fileInputRef.current?.click()}>{I.upload} Load Backup File</Btn>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleRestore} style={{ display: "none" }} />
            </Card>
            <Card variant="filled" style={{ padding: 16, border: `1px solid ${M3.error}30` }}>
              <div style={{ ...Type.titleSmall, color: M3.error, marginBottom: 8 }}>Reset All Data</div>
              <div style={{ ...Type.bodySmall, color: M3.onSurfaceVariant, marginBottom: 12 }}>Permanently delete everything and start fresh.</div>
              <Btn variant="error" size="sm" onClick={resetAll}>{I.trash} Reset Everything</Btn>
            </Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", ...Type.bodySmall, color: M3.outline }}>
              <span style={{ display: "flex" }}>{I.cloudCheck}</span>
              {incomes.length + expenses.length + loans.length + savings.length} items tracked · Last saved: just now
            </div>
          </div>
        </Modal>
        {resetDialog}
        {/* Mobile bottom navigation */}
        <div className="fh-mobile-nav" role="navigation" aria-label="Mobile navigation">
          {NAV.slice(0, 5).map(item => (
            <button key={item.key} className={`fh-mobile-btn ${page === item.key ? "active" : ""}`} onClick={() => setPage(item.key)} aria-current={page === item.key ? "page" : undefined} aria-label={item.label}>
              <span className="fh-mobile-icon" style={{ display: "flex" }}>{item.icon}</span>
              <span style={{ ...Type.labelSmall, fontSize: 10 }}>{item.label}</span>
            </button>
          ))}
          <button className={`fh-mobile-btn ${page === "reports" || page === "savings" ? "active" : ""}`} onClick={() => setPage(page === "savings" ? "reports" : "savings")} aria-label={page === "savings" ? "Reports" : "Savings"} aria-current={page === "reports" || page === "savings" ? "page" : undefined}>
            <span className="fh-mobile-icon" style={{ display: "flex" }}>{page === "savings" ? I.reports : I.savings}</span>
            <span style={{ ...Type.labelSmall, fontSize: 10 }}>{page === "savings" ? "Reports" : "Savings"}</span>
          </button>
        </div>
      </div>
    </>
  );
}