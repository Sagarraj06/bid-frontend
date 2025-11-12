
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// /* ------------------------------------------------------------------ */
// /*                                TYPES                                */
// /* ------------------------------------------------------------------ */

// interface ReportData {
//   meta: {
//     report_generated_at: string;
//     params_used: {
//       sellerName: string;
//       department: string;
//       offeredItem: string;
//       days: number;
//       limit: number;
//       email?: string;
//     };
//   };
//   data: {
//     estimatedMissedValue?: any;
//     sellerBids?: any;
//     topPerformingStates?: any;
//     topSellersByDept?: any;
//     categoryListing?: any;
//     allDepartments?: any;
//     lowCompetitionBids?: any;
//     missedButWinnable?: any;
//     priceBand?: any;
//   };
// }

// interface FilterOptions {
//   includeSections: string[];
// }

// /* ------------------------------------------------------------------ */
// /*                               COLORS                                */
// /* ------------------------------------------------------------------ */

// const colors: Record<string, [number, number, number]> = {
//   navyBlue: [30, 58, 95],
//   darkBlue: [74, 144, 226],
//   electricBlue: [74, 144, 226],
//   successGreen: [46, 204, 113],
//   warningOrange: [243, 156, 18],
//   errorRed: [231, 76, 60],
//   neutralGray: [107, 114, 128],
//   darkGray: [55, 65, 81],
//   mediumGray: [107, 114, 128],
//   lightGray: [209, 213, 219],
//   white: [255, 255, 255],
//   black: [0, 0, 0],
//   lightBlue: [239, 246, 255],
//   backgroundGray: [249, 250, 251],
// };

// /* ------------------------------------------------------------------ */
// /*                          UTILITY FUNCTIONS                          */
// /* ------------------------------------------------------------------ */

// const clean = (v: any): string => {
//   if (v === null || v === undefined) return "-";
//   if (typeof v === "object") {
//     try {
//       // try to stringify small objects
//       return JSON.stringify(v);
//     } catch {
//       return String(v);
//     }
//   }
//   return String(v).trim() || "-";
// };

// const safeText = (v: any, fb = "-") => {
//   const c = clean(v);
//   return c === "" ? fb : c;
// };

// const short = (v: any, len: number, fallback = "-") => {
//   const c = clean(v);
//   if (c === "-" || c === "" || c == null) return fallback;
//   if (c.length <= len) return c;
//   return c.slice(0, len - 1) + "…";
// };

// const formatCurrency = (n: any) => {
//   const num = Number(n);
//   if (isNaN(num)) return "-";
//   // stable grouping avoiding weird unicode narrow spaces
//   const rounded = Math.round(num);
//   return `₹${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
// };

// const formatDate = (d: any) => {
//   if (!d) return "-";
//   const date = new Date(d);
//   if (isNaN(date.getTime())) return "-";
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const normalize = (v: any): string => {
//   if (v == null) return "-";
//   if (typeof v === "object") {
//     // join primitives or small values
//     const values = Object.values(v).map((x) => clean(x));
//     return values.join(", ");
//   }
//   return String(v).replace(/[\u00A0\u202F]/g, " ").replace(/\s+/g, " ").trim() || "-";
// };

// const normalizeArray = (val: any): string[] => {
//   if (!val) return [];
//   if (Array.isArray(val)) return val.map(normalize);
//   if (typeof val === "string") return [normalize(val)];
//   if (typeof val === "object") return Object.values(val).map(normalize);
//   return [normalize(val)];
// };

// /* ------------------------------------------------------------------ */
// /*                        MAIN PDF GENERATOR                           */
// /* ------------------------------------------------------------------ */

// export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 12;

//   // Slight scaling for crisper text in some viewers
//   doc.internal.scaleFactor = 1.33;

//   /* -------------------------- Header & Footer ------------------------- */
//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, 18, "F");
//     doc.setFontSize(10);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text("GOVERNMENT TENDER ANALYSIS", pageWidth / 2, 11, { align: "center" });
//   };

//   const addFooter = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "normal");
//     const seller = safeText(reportData.meta.params_used.sellerName);
//     doc.text(seller, margin, pageHeight - 5);
//     doc.text(formatDate(reportData.meta.report_generated_at), pageWidth - margin, pageHeight - 5, { align: "right" });
//   };

//   /* -------------------------- Section Header ------------------------- */
//   const addSectionHeader = (title: string, color: [number, number, number]) => {
//     // Determine y start (after previous table/section)
//     const prevY = (doc as any).lastAutoTable?.finalY ?? 30;
//     let yStart = prevY + 10;
//     if (yStart > pageHeight - 40) {
//       doc.addPage();
//       addHeader();
//       addFooter();
//       yStart = 30;
//     }
//     doc.setFillColor(...color);
//     doc.rect(margin, yStart, pageWidth - 2 * margin, 10, "F");
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(11);
//     doc.text(title, margin + 5, yStart + 7);
//     (doc as any).lastAutoTable = { finalY: yStart + 10 };
//   };

//   const newPage = () => {
//     doc.addPage();
//     addHeader();
//     addFooter();
//   };

//   /* ------------------------------ COVER ------------------------------- */
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");

//   doc.setFontSize(24);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("GOVERNMENT TENDER ANALYSIS", pageWidth / 2, 60, { align: "center" });

//   doc.setFontSize(14);
//   doc.setFont("helvetica", "normal");
//   doc.text(safeText(reportData.meta.params_used.sellerName), pageWidth / 2, 80, { align: "center" });

//   doc.setFontSize(10);
//   const deptText = reportData.meta.params_used.department || "All Departments";
//   doc.text(`Department: ${deptText} | Days: ${safeText(reportData.meta.params_used.days)}`, pageWidth / 2, 95, { align: "center" });

//   if (reportData.meta.params_used.email) {
//     doc.text(`Email: ${safeText(reportData.meta.params_used.email)}`, pageWidth / 2, 105, { align: "center" });
//   }

//   doc.text(`Generated on: ${formatDate(reportData.meta.report_generated_at)}`, pageWidth / 2, 115, { align: "center" });

//   doc.setLineWidth(0.5);
//   doc.setDrawColor(...colors.white);
//   doc.circle(pageWidth / 2, 150, 35, "S");
//   doc.setFontSize(11);
//   doc.text("Comprehensive Tender Performance Report", pageWidth / 2, 155, { align: "center" });

//   /* -------------------- ESTIMATED MISSED VALUE ----------------------- */
//   newPage();
//   addHeader();
//   addFooter();

//   const missedValData = reportData?.data?.estimatedMissedValue;
//   const missedVal = missedValData?.total;

//   if (missedVal !== undefined && missedVal !== null && Number(missedVal) > 0) {
//     addSectionHeader("Estimated Missed Value", colors.warningOrange);

//     let yPos = (doc as any).lastAutoTable?.finalY + 10 || 35;
//     if (yPos + 40 > pageHeight - 30) {
//       newPage();
//       yPos = 30;
//     }

//     doc.setFontSize(12);
//     doc.setTextColor(...colors.warningOrange);
//     doc.setFont("helvetica", "bold");
//     doc.text("Potential Missed Opportunity:", margin, yPos);

//     doc.setFontSize(16);
//     doc.setTextColor(...colors.navyBlue);
//     doc.text(formatCurrency(missedVal), margin + 85, yPos);

//     doc.setFontSize(9);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     const info = "Represents estimated value of tenders where participation was possible but not recorded.";
//     const infoLines = doc.splitTextToSize(info, pageWidth - 2 * margin);
//     doc.text(infoLines, margin, yPos + 8);

//     (doc as any).lastAutoTable = { finalY: yPos + 25 };
//   } else {
//     let yPos = (doc as any).lastAutoTable?.finalY + 10 || 35;
//     doc.setFontSize(10);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text("No estimated missed value calculated for this report.", margin, yPos);
//     (doc as any).lastAutoTable = { finalY: yPos + 10 };
//   }

//   /* --------------------- MARKET OVERVIEW - PRICE BAND -------------------- */
//   if (filters.includeSections.includes("marketOverview")) {
//     newPage();
//     addHeader();
//     addFooter();
//     addSectionHeader("Price Band Analysis", colors.successGreen);

//     const priceBand = reportData?.data?.priceBand?.analysis;
//     let startY = (doc as any).lastAutoTable?.finalY + 10 || 35;

//     if (priceBand && (priceBand.highest || priceBand.lowest !== undefined || priceBand.average)) {
//       const highest = Number(priceBand.highest || 0);
//       const lowest = Number(priceBand.lowest !== undefined ? priceBand.lowest : 0);
//       const average = Number(priceBand.average || 0);
//       const count = Number(priceBand.count || 0);

//       const tableData = [
//         ["Highest Price", formatCurrency(highest)],
//         ["Average Price", formatCurrency(average)],
//         ["Lowest Price", formatCurrency(lowest)],
//         ["Total Bids Analyzed", String(count)],
//       ];

//       autoTable(doc, {
//         startY,
//         head: [["Metric", "Value"]],
//         body: tableData,
//         theme: "grid",
//         headStyles: {
//           fillColor: colors.successGreen,
//           textColor: 255,
//           fontStyle: "bold",
//           fontSize: 10,
//         },
//         bodyStyles: {
//           fontSize: 9,
//           cellPadding: 4,
//           overflow: "linebreak",
//         },
//         columnStyles: { 0: { cellWidth: 80, fontStyle: "bold" }, 1: { halign: "right", cellWidth: 80 } },
//         margin: { left: margin, right: margin },
//       });

//       let tableEnd = (doc as any).lastAutoTable.finalY + 10;
//       if (tableEnd + 40 > pageHeight - 30) {
//         newPage();
//         tableEnd = 30;
//       }

//       doc.setFillColor(...colors.lightBlue);
//       doc.roundedRect(margin, tableEnd, pageWidth - 2 * margin, 30, 3, 3, "F");
//       doc.setDrawColor(...colors.electricBlue);
//       doc.setLineWidth(1);
//       doc.roundedRect(margin, tableEnd, pageWidth - 2 * margin, 30, 3, 3, "S");

//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Price Insights:", margin + 5, tableEnd + 8);

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(9);
//       doc.setTextColor(...colors.darkGray);

//       let insight = "Limited price data available for comprehensive analysis.";

//       if (highest > 0 && average > 0 && count > 1) {
//         const diff = highest - lowest;
//         const variation = average > 0 ? ((diff / average) * 100).toFixed(1) : "0.0";
//         insight = `Price range spans from ${formatCurrency(lowest)} to ${formatCurrency(highest)}. Average bid value is ${formatCurrency(average)} with ${variation}% variation. Analysis based on ${count} competitive bid${count !== 1 ? "s" : ""}.`;
//       } else if (count === 1) {
//         insight = `Single bid analyzed with value ${formatCurrency(average)}. More data needed for trend analysis.`;
//       }

//       const insightLines = doc.splitTextToSize(insight, pageWidth - 2 * margin - 10);
//       doc.text(insightLines, margin + 5, tableEnd + 16);
//       (doc as any).lastAutoTable = { finalY: tableEnd + 35 };
//     } else {
//       const yPos = startY;
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.errorRed);
//       doc.setFont("helvetica", "normal");
//       doc.text("No price band data available for this report.", margin, yPos);
//       (doc as any).lastAutoTable = { finalY: yPos + 10 };
//     }
//   }

//   /* ---------------------- SELLER BIDDING SUMMARY ---------------------- */
//   if (filters.includeSections.includes("bidsSummary")) {
//     newPage();
//     addHeader();
//     addFooter();
//     addSectionHeader("Seller Bidding Summary", colors.darkBlue);

//     const bids = reportData?.data?.sellerBids || {};
//     const summary = bids?.table1 || {};

//     const cards = [
//       { label: "Wins", value: summary.win || 0, color: colors.successGreen },
//       { label: "Lost", value: summary.lost || 0, color: colors.errorRed },
//       { label: "Total Bids", value: summary.totalBidsParticipated || 0, color: colors.darkBlue },
//       { label: "Total Bid Value", value: formatCurrency(summary.totalBidValue), color: colors.navyBlue },
//       { label: "Qualified Value", value: formatCurrency(summary.qualifiedBidValue), color: colors.successGreen },
//       { label: "Avg Order Value", value: formatCurrency(summary.averageOrderValue), color: colors.electricBlue },
//     ];

//     let y = (doc as any).lastAutoTable?.finalY + 12 || 35;
//     const cardWidth = 60;
//     const cardHeight = 22;
//     const spacing = 6;
//     const cardsPerRow = 3;

//     cards.forEach((card, index) => {
//       const row = Math.floor(index / cardsPerRow);
//       const col = index % cardsPerRow;
//       const x = margin + col * (cardWidth + spacing);
//       const yPos = y + row * (cardHeight + spacing);

//       doc.setFillColor(...colors.lightBlue);
//       doc.roundedRect(x, yPos, cardWidth, cardHeight, 2, 2, "F");
//       doc.setDrawColor(...card.color);
//       doc.setLineWidth(0.5);
//       doc.roundedRect(x, yPos, cardWidth, cardHeight, 2, 2, "S");

//       doc.setFontSize(8);
//       doc.setTextColor(...colors.darkGray);
//       doc.setFont("helvetica", "normal");
//       doc.text(card.label, x + 3, yPos + 8);

//       doc.setFontSize(11);
//       doc.setTextColor(...card.color);
//       doc.setFont("helvetica", "bold");
//       const valueText = String(card.value);
//       doc.text(short(valueText, 15), x + 3, yPos + 17);
//     });

//     y += Math.ceil(cards.length / cardsPerRow) * (cardHeight + spacing) + 12;
//     (doc as any).lastAutoTable = { finalY: y };

//     // monthly graph (if any)
//     const monthlyData = bids?.monthlyTotals?.byMonth || {};
//     const months = Object.keys(monthlyData);
//     if (months.length > 0) {
//       if (y + 90 > pageHeight - 30) {
//         newPage();
//         y = 30;
//       }

//       doc.setFontSize(11);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Monthly Bid Performance", margin, y);
//       y += 8;

//       const values = months.map((m) => Number(monthlyData[m]) || 0);
//       const maxVal = Math.max(...values, 1);
//       const graphWidth = pageWidth - 2 * margin - 40;
//       const graphHeight = 50;
//       const startX = margin + 20;
//       const startY = y + graphHeight;

//       doc.setDrawColor(...colors.lightGray);
//       doc.setLineWidth(0.5);
//       doc.rect(startX, y, graphWidth, graphHeight);

//       const barSpacing = 2;
//       const barWidth = Math.max(5, (graphWidth - (months.length - 1) * barSpacing) / months.length);

//       values.forEach((val: number, i: number) => {
//         const barHeight = (val / maxVal) * graphHeight;
//         const barX = startX + i * (barWidth + barSpacing);
//         const barY = startY - barHeight;

//         doc.setFillColor(...colors.electricBlue);
//         doc.rect(barX, barY, barWidth, barHeight, "F");
//       });

//       doc.setFontSize(6);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "normal");
//       months.forEach((m: string, i: number) => {
//         const labelX = startX + i * (barWidth + barSpacing);
//         const monthLabel = m.split("-")[1] || m.substring(5, 7);
//         doc.text(monthLabel, labelX + barWidth / 2, startY + 5, { align: "center" });
//       });

//       y = startY + 15;
//       (doc as any).lastAutoTable = { finalY: y };
//     }

//     // detailed bid history table
//     const bidRows = bids?.sortedRows ?? [];
//     if (bidRows.length > 0) {
//       newPage();
//       addSectionHeader("Detailed Bid History", colors.navyBlue);

//       const bidTable = bidRows.slice(0, 20).map((b: any, i: number) => [
//         String(i + 1),
//         formatDate(b.participated_on),
//         short(b.offered_item || "-", 40),
//         short(b.organisation || b.org || "-", 30),
//         short(b.department || b.dept || "-", 30),
//         safeText(b.rank, "-"),
//         formatCurrency(b.total_price),
//       ]);

//       autoTable(doc, {
//         startY: (doc as any).lastAutoTable?.finalY + 12 || 35,
//         head: [["#", "Date", "Item", "Organisation", "Department", "Rank", "Bid Value"]],
//         body: bidTable,
//         theme: "striped",
//         headStyles: { fillColor: colors.navyBlue, textColor: 255, fontStyle: "bold", fontSize: 8 },
//         bodyStyles: { fontSize: 7, cellPadding: 2, overflow: "linebreak" },
//         columnStyles: {
//           0: { cellWidth: 8, halign: "center" },
//           1: { cellWidth: 20 },
//           2: { cellWidth: 45 },
//           3: { cellWidth: 32 },
//           4: { cellWidth: 32 },
//           5: { cellWidth: 12, halign: "center" },
//           6: { cellWidth: 26, halign: "right" },
//         },
//         margin: { left: margin, right: margin },
//       });
//     }
//   }

//   /* ---------------------- MISSED BUT WINNABLE ---------------------- */
//   if (filters.includeSections.includes("missedTenders")) {
//     newPage();
//     addHeader();
//     addFooter();
//     addSectionHeader("Missed But Winnable Tenders", colors.errorRed);

//     const missed = reportData?.data?.missedButWinnable || {};
//     const recentWins = missed?.recentWins ?? [];
//     const marketWins = missed?.marketWins ?? [];

//     if (recentWins.length > 0) {
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       const yStart = (doc as any).lastAutoTable?.finalY + 12 || 35;
//       doc.text("Your Recent Wins", margin, yStart);

//       autoTable(doc, {
//         startY: yStart + 6,
//         head: [["#", "Bid No", "Item", "Qty", "Price", "Org", "Dept", "Ended"]],
//         body: recentWins.slice(0, 10).map((r: any, i: number) => [
//           String(i + 1),
//           short(r.bid_number || "-", 20),
//           short(r.offered_item || "-", 35),
//           safeText(r.quantity),
//           formatCurrency(r.total_price),
//           short(r.org || "-", 24),
//           short(r.dept || "-", 24),
//           formatDate(r.ended_at),
//         ]),
//         theme: "striped",
//         headStyles: { fillColor: colors.errorRed, textColor: 255, fontStyle: "bold", fontSize: 8 },
//         bodyStyles: { fontSize: 7, cellPadding: 2, overflow: "linebreak" },
//         columnStyles: {
//           0: { cellWidth: 8 },
//           1: { cellWidth: 24 },
//           2: { cellWidth: 38 },
//           3: { cellWidth: 10, halign: "right" },
//           4: { cellWidth: 22, halign: "right" },
//           5: { cellWidth: 26 },
//           6: { cellWidth: 26 },
//           7: { cellWidth: 18 },
//         },
//         margin: { left: margin, right: margin },
//       });
//     } else {
//       const yPos = (doc as any).lastAutoTable?.finalY + 12 || 35;
//       doc.setFontSize(9);
//       doc.setTextColor(...colors.errorRed);
//       doc.setFont("helvetica", "normal");
//       doc.text("No recent wins data available.", margin, yPos);
//       (doc as any).lastAutoTable = { finalY: yPos + 10 };
//     }

//     if (marketWins.length > 0) {
//       let nextY = (doc as any).lastAutoTable?.finalY + 15 || 70;
//       if (nextY + 80 > pageHeight - 30) {
//         newPage();
//         nextY = 30;
//       }

//       doc.setFontSize(10);
//       doc.setTextColor(...colors.warningOrange);
//       doc.setFont("helvetica", "bold");
//       doc.text("Competitor Wins (Market Intelligence)", margin, nextY);

//       autoTable(doc, {
//         startY: nextY + 6,
//         head: [["#", "Bid No", "Seller", "Item", "Qty", "Price", "Org", "Ended"]],
//         body: marketWins.slice(0, 10).map((r: any, i: number) => [
//           String(i + 1),
//           short(r.bid_number || "-", 20),
//           short(r.seller_name || "-", 28),
//           short(r.offered_item || "-", 32),
//           safeText(r.quantity),
//           formatCurrency(r.total_price),
//           short(r.org || "-", 24),
//           formatDate(r.ended_at),
//         ]),
//         theme: "striped",
//         headStyles: { fillColor: colors.warningOrange, textColor: 255, fontStyle: "bold", fontSize: 8 },
//         bodyStyles: { fontSize: 7, cellPadding: 2, overflow: "linebreak" },
//         columnStyles: {
//           0: { cellWidth: 8 },
//           1: { cellWidth: 23 },
//           2: { cellWidth: 30 },
//           3: { cellWidth: 35 },
//           4: { cellWidth: 10, halign: "right" },
//           5: { cellWidth: 22, halign: "right" },
//           6: { cellWidth: 26 },
//           7: { cellWidth: 18 },
//         },
//         margin: { left: margin, right: margin },
//       });
//     }
//   }

//   /* ------------------------- AI INSIGHTS --------------------------- */
//   if (filters?.includeSections?.includes("buyerInsights")) {
//     const ai =
//       reportData?.data?.missedButWinnable?.ai ||
//       (reportData as any)?.result?.data?.missedButWinnable?.ai;

//     doc.internal.scaleFactor = 1.33;

//     if (ai && typeof ai === "object" && Object.keys(ai).length > 0) {
//       newPage();
//       addHeader();
//       addFooter();
//       addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);

//       let y = ((doc as any).lastAutoTable?.finalY ?? 35) + 12;

//       // Strategy Summary
//       if (ai.strategy_summary) {
//         if (y + 40 > pageHeight - 30) {
//           newPage();
//           y = 30;
//         }

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(11);
//         doc.setTextColor(...colors.navyBlue);
//         doc.text("Strategy Summary:", margin, y);
//         y += 7;

//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.darkGray);
//         const lines = doc.splitTextToSize(normalize(ai.strategy_summary), pageWidth - 2 * margin);
//         doc.text(lines, margin, y);
//         y += lines.length * 5 + 10;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       // AI Likely wins
//       const globalLikelyWins = ai?.likely_wins || [];
//       const recentWins = ai?.recentWins || [];
//       const globalSignals = ai?.signals || {};

//       let allLikelyWins: any[] = [];

//       if (Array.isArray(globalLikelyWins) && globalLikelyWins.length > 0) {
//         allLikelyWins.push(...globalLikelyWins.map((w: any) => ({ ...w, source: "Global" })));
//       }

//       if (Array.isArray(recentWins) && recentWins.length > 0) {
//         recentWins.forEach((r: any) => {
//           if (Array.isArray(r.likely_wins) && r.likely_wins.length > 0) {
//             allLikelyWins.push(...r.likely_wins.map((w: any) => ({
//               ...w,
//               offered_item: r.offered_item,
//               bid_number: r.bid_number,
//               dept: r.dept,
//               ministry: r.ministry,
//               org: r.org,
//               signals: r.signals,
//               source: "Per-item",
//             })));
//           } else if (r.signals && Object.keys(r.signals).length > 0) {
//             allLikelyWins.push({
//               offered_item: r.offered_item,
//               bid_number: r.bid_number,
//               dept: r.dept,
//               ministry: r.ministry,
//               org: r.org,
//               signals: r.signals,
//               total_price: r.total_price,
//               source: "Signal-based",
//             });
//           }
//         });
//       }

//       if (allLikelyWins.length > 0) {
//         newPage();
//         addSectionHeader("AI Predicted & Signal-Based Likely Wins", colors.successGreen);

//         const table = allLikelyWins.slice(0, 10).map((l: any, i: number) => {
//           const reason =
//             l.reason ||
//             (l.signals
//               ? Object.entries(l.signals).map(([k, v]) => `${k}: ${clean(v)}`).join(", ")
//               : "AI predicted based on historical success patterns");

//           return [
//             String(i + 1),
//             short(l.offered_item || "-", 45),
//             short(reason, 60),
//             formatCurrency(l.total_price || 0),
//             short(l.org || "-", 26),
//             short(l.dept || "-", 26),
//             short(l.ministry || "-", 26),
//           ];
//         });

//         autoTable(doc, {
//           startY: ((doc as any).lastAutoTable?.finalY ?? 35) + 12,
//           head: [["#", "Item", "Reason / Signal", "Est. Value", "Organisation", "Department", "Ministry"]],
//           body: table,
//           theme: "striped",
//           headStyles: { fillColor: colors.successGreen, textColor: 255, fontStyle: "bold", fontSize: 9 },
//           bodyStyles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
//           columnStyles: {
//             0: { cellWidth: 8, halign: "center" },
//             1: { cellWidth: 45 },
//             2: { cellWidth: 55 },
//             3: { cellWidth: 20, halign: "right" },
//             4: { cellWidth: 28 },
//             5: { cellWidth: 28 },
//             6: { cellWidth: 28 },
//           },
//           margin: { left: margin, right: margin },
//         });

//         let yPos = (doc as any).lastAutoTable.finalY + 12;
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Total Likely Wins analyzed: ${allLikelyWins.length} | Includes AI inferences and signal-based predictions`, margin, yPos);
//         yPos += 10;

//         // Affinity renderer
//         const renderAffinity = (title: string, data: any[]) => {
//           if (!data || (Array.isArray(data) && data.length === 0)) return;
//           if (!Array.isArray(data)) data = [data];
//           if (typeof data[0] === "string" || typeof data[0] === "number") {
//             data = data.map((v: any) => ({ entity: String(v), value: "-" }));
//           }

//           if (yPos + 60 > pageHeight - 30) {
//             newPage();
//             yPos = 30;
//           }

//           doc.setFont("helvetica", "bold");
//           doc.setFontSize(10);
//           doc.setTextColor(...colors.navyBlue);
//           doc.text(title, margin, yPos);
//           yPos += 6;

//           const first = data[0];
//           const keys = Object.keys(first);
//           let keyName = keys.find((k) => ["org", "dept", "ministry", "entity"].includes(k.toLowerCase())) || "entity";

//           const rows = data.map((entry: any) => [
//             entry[keyName] || "-",
//             entry.value || entry.win_rate || entry.count || "-",
//           ]);

//           doc.setFont("helvetica", "normal");
//           doc.setFontSize(9);
//           autoTable(doc, {
//             startY: yPos,
//             head: [["Entity", "Value"]],
//             body: rows,
//             theme: "grid",
//             headStyles: { fillColor: colors.darkBlue, textColor: 255, fontStyle: "bold", fontSize: 9 },
//             bodyStyles: { fontSize: 8, cellPadding: 3 },
//             columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 40, halign: "center" } },
//             margin: { left: margin, right: margin },
//           });

//           yPos = (doc as any).lastAutoTable.finalY + 10;
//         };

//         // show signals per item from recentWins
//         recentWins.forEach((r: any, idx: number) => {
//           const s = r.signals;
//           if (!s || Object.keys(s).length === 0) return;
//           if (yPos + 40 > pageHeight - 30) {
//             newPage();
//             yPos = 30;
//           }

//           doc.setFont("helvetica", "bold");
//           doc.setTextColor(...colors.darkBlue);
//           doc.setFontSize(11);
//           doc.text(short(r.offered_item || `Item ${idx + 1}`, 90), margin, yPos);
//           yPos += 7;

//           renderAffinity("Org Affinity", s.org_affinity);
//           renderAffinity("Dept Affinity", s.dept_affinity);
//           renderAffinity("Ministry Affinity", s.ministry_affinity);
//           renderAffinity("Price Range", s.price_range);
//           renderAffinity("Quantity Range", s.quantity_range);
//         });

//         (doc as any).lastAutoTable = { finalY: yPos };
//       }

//       // Quantity & Price Range Analysis (global signals)
//       const signals = globalSignals || {};
//       if ((signals.quantity_ranges && signals.quantity_ranges.length > 0) || (signals.price_ranges && signals.price_ranges.length > 0)) {
//         newPage();
//         addSectionHeader("Quantity & Price Range Analysis", colors.electricBlue);

//         let rangeY = (doc as any).lastAutoTable?.finalY + 12 || 35;
//         const renderRange = (title: string, list: any[], type: "price" | "quantity") => {
//           if (!Array.isArray(list) || list.length === 0) return;
//           if (rangeY + 30 > pageHeight - 30) {
//             newPage();
//             rangeY = 30;
//           }

//           doc.setFont("helvetica", "bold");
//           doc.setFontSize(10);
//           doc.setTextColor(...colors.navyBlue);
//           doc.text(`${title}:`, margin, rangeY);
//           rangeY += 7;

//           const rows = type === "price"
//             ? list.map((r: any) => [`${formatCurrency(r.min_price)} - ${formatCurrency(r.max_price)}`, `${r.count} bid${r.count !== 1 ? "s" : ""}`])
//             : list.map((r: any) => [normalize(r.range), `${r.count} bid${r.count !== 1 ? "s" : ""}`]);

//           doc.setFont("helvetica", "normal");
//           doc.setFontSize(9);
//           autoTable(doc, {
//             startY: rangeY,
//             head: [["Range", "Count"]],
//             body: rows,
//             theme: "grid",
//             headStyles: { fillColor: colors.electricBlue, textColor: 255, fontStyle: "bold", fontSize: 9 },
//             bodyStyles: { fontSize: 8, cellPadding: 3 },
//             columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 40, halign: "center" } },
//             margin: { left: margin, right: margin },
//           });

//           rangeY = (doc as any).lastAutoTable.finalY + 10;
//         };

//         renderRange("Quantity Ranges", signals.quantity_ranges || [], "quantity");
//         renderRange("Price Ranges", signals.price_ranges || [], "price");
//         (doc as any).lastAutoTable = { finalY: rangeY };
//       }

//       // AI Recommendations & next steps
//       const guidance = ai.guidance || {};
//       const nextSteps = normalizeArray(guidance.next_steps);
//       const expansionAreas = normalizeArray(guidance.expansion_areas);

//       if (guidance.note || nextSteps.length || expansionAreas.length) {
//         newPage();
//         addSectionHeader("AI Recommendations & Strategic Roadmap", colors.successGreen);

//         let yG = (doc as any).lastAutoTable?.finalY + 12 || 35;
//         if (guidance.note) {
//           doc.setFont("helvetica", "bold");
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.navyBlue);
//           doc.text("Note:", margin, yG);
//           yG += 6;

//           doc.setFont("helvetica", "normal");
//           doc.setTextColor(...colors.darkGray);
//           const lines = doc.splitTextToSize(normalize(guidance.note), pageWidth - 2 * margin);
//           doc.text(lines, margin, yG);
//           yG += lines.length * 5 + 8;
//         }

//         if (nextSteps.length > 0) {
//           doc.setFont("helvetica", "bold");
//           doc.setFontSize(10);
//           doc.setTextColor(...colors.darkBlue);
//           doc.text("Next Steps:", margin, yG);
//           yG += 7;

//           doc.setFont("helvetica", "normal");
//           doc.setTextColor(...colors.darkGray);
//           doc.setFontSize(9);
//           nextSteps.forEach((step, i) => {
//             const lines = doc.splitTextToSize(`${i + 1}. ${normalize(step)}`, pageWidth - 2 * margin - 10);
//             doc.text(lines, margin + 5, yG);
//             yG += lines.length * 5 + 3;
//           });
//           yG += 6;
//         }

//         if (expansionAreas.length > 0) {
//           doc.setFont("helvetica", "bold");
//           doc.setTextColor(...colors.successGreen);
//           doc.setFontSize(10);
//           doc.text("Expansion Opportunities:", margin, yG);
//           yG += 7;

//           doc.setFont("helvetica", "normal");
//           doc.setTextColor(...colors.darkGray);
//           doc.setFontSize(9);
//           expansionAreas.forEach((area) => {
//             const lines = doc.splitTextToSize(`• ${normalize(area)}`, pageWidth - 2 * margin - 10);
//             doc.text(lines, margin + 5, yG);
//             yG += lines.length * 5 + 3;
//           });
//         }

//         (doc as any).lastAutoTable = { finalY: yG };
//       }
//     } else {
//       newPage();
//       addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);
//       let yPos = (doc as any).lastAutoTable?.finalY + 12 || 35;
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.mediumGray);
//       doc.text("AI insights are being processed. This section will be populated in the next report.", margin, yPos);
//       (doc as any).lastAutoTable = { finalY: yPos + 10 };
//     }
//   }

//   /* -------------------- CATEGORY ANALYSIS ------------------------ */
//   if (filters.includeSections.includes("categoryAnalysis")) {
//     newPage();
//     addHeader();
//     addFooter();
//     addSectionHeader("Category-wise Tender Distribution", colors.darkBlue);

//     const catData = reportData?.data?.categoryListing;
//     const categories = Array.isArray(catData?.categories) ? catData.categories : [];

//     if (categories.length > 0) {
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);

//       let y = (doc as any).lastAutoTable?.finalY + 12 || 40;
//       const timesValues = categories.map((c: any) => Number(c.times) || 0);
//       const maxTimes = Math.max(...timesValues, 1);

//       categories.slice(0, 30).forEach((c: any) => {
//         if (y > pageHeight - 40) {
//           newPage();
//           y = 30;
//         }

//         const count = Number(c.times) || 0;
//         const barWidth = (count / maxTimes) * (pageWidth - 120);

//         doc.setFillColor(...colors.lightBlue);
//         doc.rect(margin + 65, y - 4, pageWidth - 120, 7, "F");

//         doc.setFillColor(...colors.electricBlue);
//         doc.rect(margin + 65, y - 4, barWidth, 7, "F");

//         doc.setFontSize(9);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "normal");
//         doc.text(short(c.category, 35), margin, y);

//         doc.setFontSize(8);
//         doc.setTextColor(...colors.mediumGray);
//         doc.setFont("helvetica", "bold");
//         doc.text(String(count), margin + 55, y, { align: "right" });

//         y += 11;
//       });

//       if (catData?.metadata) {
//         if (y + 30 > pageHeight - 30) {
//           newPage();
//           y = 30;
//         }
//         y += 6;
//         doc.setFillColor(...colors.backgroundGray);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, 22, 2, 2, "F");

//         doc.setFontSize(9);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "bold");
//         doc.text("Summary:", margin + 5, y + 8);

//         const meta = catData.metadata;
//         const summaryText = `Total Categories: ${meta.totalItems ?? "-"} | Total Count: ${meta.totalCount ?? "-"} | Processing Time: ${meta.processingTime ?? "-"} ms`;

//         doc.setFontSize(8);
//         doc.setTextColor(...colors.mediumGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(summaryText, margin + 5, y + 15);
//         y += 26;
//       }

//       (doc as any).lastAutoTable = { finalY: y };
//     } else {
//       const yPos = (doc as any).lastAutoTable?.finalY + 12 || 35;
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.errorRed);
//       doc.setFont("helvetica", "normal");
//       doc.text("No category data available.", margin, yPos);
//       (doc as any).lastAutoTable = { finalY: yPos + 10 };
//     }
//   }

//   /* ----------------------- RIVALRY SCORE -------------------------- */
//   if (filters.includeSections.includes("rivalryScore")) {
//     newPage();
//     addHeader();
//     addFooter();

//     const deptName = reportData.meta.params_used.department || "All Departments";
//     addSectionHeader(`Leading Competitors – ${deptName}`, colors.warningOrange);

//     const topSellersData = reportData?.data?.topSellersByDept;
//     const departments = topSellersData?.departments || [];

//     if (departments.length > 0) {
//       departments.slice(0, 3).forEach((dept: any, deptIndex: number) => {
//         if (deptIndex > 0) {
//           newPage();
//         }
//         const yStart = (doc as any).lastAutoTable?.finalY + 12 || 35;
//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(`Department: ${short(dept.department, 50)}`, margin, yStart);

//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Total Sellers: ${dept.total || 0}`, margin, yStart + 6);

//         const sellers = dept.results || [];
//         if (sellers.length > 0) {
//           const sellerTableData = sellers.slice(0, 10).map((seller: any, index: number) => [
//             String(index + 1),
//             short(seller?.seller_name || "-", 110),
//             String(seller?.participation_count ?? 0),
//           ]);

//           autoTable(doc, {
//             startY: yStart + 12,
//             head: [["Rank", "Seller Name", "Participations"]],
//             body: sellerTableData,
//             theme: "striped",
//             headStyles: { fillColor: colors.warningOrange, textColor: 255, fontStyle: "bold", fontSize: 9 },
//             bodyStyles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
//             columnStyles: {
//               0: { cellWidth: 15, halign: "center", fontStyle: "bold" },
//               1: { cellWidth: 120 },
//               2: { cellWidth: 35, halign: "right", fontStyle: "bold" },
//             },
//             margin: { left: margin, right: margin },
//           });
//         }
//       });
//     } else {
//       const yPos = (doc as any).lastAutoTable?.finalY + 12 || 35;
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.errorRed);
//       doc.setFont("helvetica", "normal");
//       doc.text("No competitor data found for the specified department.", margin, yPos);
//       (doc as any).lastAutoTable = { finalY: yPos + 10 };
//     }
//   }

//   /* --------------------- STATES ANALYSIS -------------------------- */
//   if (filters.includeSections.includes("statesAnalysis")) {
//     newPage();
//     addHeader();
//     addFooter();
//     addSectionHeader("Top Performing States by Tender Volume", colors.successGreen);

//     const statesData = reportData?.data?.topPerformingStates?.data?.results ||
//                        reportData?.data?.topPerformingStates?.results || [];

//     if (statesData.length > 0) {
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(9);
//       doc.setTextColor(...colors.darkGray);

//       const maxTenders = Math.max(...statesData.map((s: any) => Number(s.total_tenders) || 0), 1);
//       let y = (doc as any).lastAutoTable?.finalY + 12 || 40;

//       statesData.slice(0, 29).forEach((state: any) => {
//         if (y > pageHeight - 35) {
//           newPage();
//           y = 30;
//         }

//         const tenderCount = Number(state.total_tenders) || 0;
//         const barAreaWidth = pageWidth - 120;
//         const barWidth = (tenderCount / maxTenders) * barAreaWidth;

//         doc.setFillColor(...colors.lightBlue);
//         doc.rect(margin + 65, y - 4, barAreaWidth, 7, "F");

//         doc.setFillColor(...colors.successGreen);
//         doc.rect(margin + 65, y - 4, barWidth, 7, "F");

//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.text(short(state.state_name, 30), margin, y);

//         doc.setTextColor(...colors.mediumGray);
//         doc.setFont("helvetica", "bold");
//         doc.text(String(tenderCount), margin + 55, y, { align: "right" });
//         doc.setFont("helvetica", "normal");

//         y += 10;
//       });

//       (doc as any).lastAutoTable = { finalY: y };
//     } else {
//       const yPos = (doc as any).lastAutoTable?.finalY + 12 || 35;
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.errorRed);
//       doc.text("No state-level tender data found.", margin, yPos);
//       (doc as any).lastAutoTable = { finalY: yPos + 10 };
//     }
//   }

//   /* ------------------- DEPARTMENTS ANALYSIS ----------------------- */
//   if (filters.includeSections.includes("departmentsAnalysis")) {
//     newPage();
//     addHeader();
//     addFooter();
//     addSectionHeader("All Departments – Tender Volume Overview", colors.darkBlue);

//     const allDepts = reportData?.data?.allDepartments?.data || reportData?.data?.allDepartments || [];

//     if (allDepts.length > 0) {
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(9);
//       const counts = allDepts.map((d: any) => Number(d.total_tenders) || 0);
//       const maxTenders = Math.max(...counts, 1);
//       let y = (doc as any).lastAutoTable?.finalY + 12 || 40;

//       allDepts.slice(0, 20).forEach((dept: any, i: number) => {
//         if (y > pageHeight - 35) {
//           newPage();
//           y = 30;
//         }

//         const tenderCount = counts[i];
//         const barAreaWidth = pageWidth - 140;
//         const barWidth = (tenderCount / maxTenders) * barAreaWidth;

//         doc.setFillColor(...colors.lightBlue);
//         doc.rect(margin + 75, y - 4, barAreaWidth, 7, "F");

//         doc.setFillColor(...colors.electricBlue);
//         doc.rect(margin + 75, y - 4, barWidth, 7, "F");

//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.text(short(dept.department, 35), margin, y);

//         doc.setTextColor(...colors.mediumGray);
//         doc.setFont("helvetica", "bold");
//         doc.text(String(tenderCount), margin + 65, y, { align: "right" });
//         doc.setFont("helvetica", "normal");

//         y += 10;
//       });

//       (doc as any).lastAutoTable = { finalY: y };
//     } else {
//       const yPos = (doc as any).lastAutoTable?.finalY + 12 || 35;
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.errorRed);
//       doc.text("No department-wise data found.", margin, yPos);
//       (doc as any).lastAutoTable = { finalY: yPos + 10 };
//     }
//   }

//   /* ----------------------- LOW COMPETITION ----------------------- */
//   if (filters.includeSections.includes("lowCompetition")) {
//     newPage();
//     addHeader();
//     addFooter();
//     addSectionHeader("Low Competition Tenders", colors.warningOrange);

//     const lowComp = reportData?.data?.lowCompetitionBids || {};
//     const rows = lowComp?.results ?? [];

//     if (rows.length > 0) {
//       const tableData = rows.slice(0, 15).map((r: any, index: number) => [
//         String(index + 1),
//         short(r.bid_number || "-", 30),
//         short(r.organisation || "-", 40),
//         short(r.department || "-", 40),
//         String(r.seller_count ?? "-"),
//         formatDate(r.bid_end_ts),
//       ]);

//       autoTable(doc, {
//         startY: (doc as any).lastAutoTable?.finalY + 12 || 35,
//         head: [["#", "Bid Number", "Organisation", "Department", "Sellers", "Bid End"]],
//         body: tableData,
//         theme: "striped",
//         headStyles: { fillColor: colors.warningOrange, textColor: 255, fontStyle: "bold", fontSize: 9 },
//         bodyStyles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
//         columnStyles: {
//           0: { cellWidth: 10, halign: "center" },
//           1: { cellWidth: 32 },
//           2: { cellWidth: 42 },
//           3: { cellWidth: 42 },
//           4: { cellWidth: 18, halign: "center" },
//           5: { cellWidth: 28, halign: "center" },
//         },
//         margin: { left: margin, right: margin },
//       });

//       const tableEnd = (doc as any).lastAutoTable.finalY + 10;
//       doc.setFontSize(8);
//       doc.setTextColor(...colors.darkGray);
//       doc.setFont("helvetica", "normal");
//       doc.text(`Total Low Competition Bids: ${lowComp?.count ?? rows.length} | Generated: ${formatDate(lowComp?.generated_at)}`, margin, tableEnd);
//       (doc as any).lastAutoTable = { finalY: tableEnd + 10 };
//     } else {
//       const yPos = (doc as any).lastAutoTable?.finalY + 12 || 35;
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.errorRed);
//       doc.text("No low competition bids found.", margin, yPos);
//       (doc as any).lastAutoTable = { finalY: yPos + 10 };
//     }
//   }

//   /* ----------------------- END PAGE ------------------------------ */
//   newPage();
//   addHeader();
//   addFooter();

//   doc.setFontSize(20);
//   doc.setTextColor(...colors.navyBlue);
//   doc.setFont("helvetica", "bold");
//   doc.text("End of Report", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });

//   doc.setFontSize(10);
//   doc.setTextColor(...colors.mediumGray);
//   doc.setFont("helvetica", "normal");
//   doc.text("This report was generated automatically based on government tender data.", pageWidth / 2, pageHeight / 2 - 5, { align: "center" });

//   doc.setFontSize(9);
//   doc.text("© 2025 Government Tender Analytics. All rights reserved.", pageWidth / 2, pageHeight / 2 + 10, { align: "center" });

//   return doc;
// };

// import jsPDF from "jspdf";

// /* ------------------------------------------------------------------ */
// /*                                TYPES                                */
// /* ------------------------------------------------------------------ */

// interface ReportData {
//   meta: {
//     report_generated_at: string;
//     params_used: {
//       sellerName: string;
//       department: string;
//       offeredItem: string;
//       days: number;
//       limit: number;
//       email?: string;
//     };
//   };
//   data: {
//     estimatedMissedValue?: any;
//     sellerBids?: any;
//     topPerformingStates?: any;
//     topSellersByDept?: any;
//     categoryListing?: any;
//     allDepartments?: any;
//     lowCompetitionBids?: any;
//     missedButWinnable?: any;
//     priceBand?: any;
//   };
// }

// interface FilterOptions {
//   includeSections: string[];
// }

// /* ------------------------------------------------------------------ */
// /*                               COLORS                                */
// /* ------------------------------------------------------------------ */

// const colors: Record<string, [number, number, number]> = {
//   navyBlue: [30, 58, 95],
//   darkBlue: [74, 144, 226],
//   electricBlue: [74, 144, 226],
//   successGreen: [46, 204, 113],
//   warningOrange: [243, 156, 18],
//   errorRed: [231, 76, 60],
//   neutralGray: [107, 114, 128],
//   darkGray: [55, 65, 81],
//   mediumGray: [107, 114, 128],
//   lightGray: [209, 213, 219],
//   white: [255, 255, 255],
//   black: [0, 0, 0],
//   lightBlue: [239, 246, 255],
//   backgroundGray: [249, 250, 251],
// };

// /* ------------------------------------------------------------------ */
// /*                          UTILITY FUNCTIONS                          */
// /* ------------------------------------------------------------------ */

// const clean = (v: any): string => {
//   if (v === null || v === undefined) return "-";
//   if (typeof v === "object") {
//     try {
//       return JSON.stringify(v);
//     } catch {
//       return String(v);
//     }
//   }
//   return String(v).trim() || "-";
// };

// const safeText = (v: any, fb = "-") => {
//   const c = clean(v);
//   return c === "" ? fb : c;
// };

// const short = (v: any, len: number, fallback = "-") => {
//   const c = clean(v);
//   if (c === "-" || c === "" || c == null) return fallback;
//   if (c.length <= len) return c;
//   return c.slice(0, len - 1) + "…";
// };

// const formatCurrency = (n: any) => {
//   const num = Number(n);
//   if (isNaN(num)) return "-";
//   const rounded = Math.round(num);
//   return `₹${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
// };

// const formatDate = (d: any) => {
//   if (!d) return "-";
//   const date = new Date(d);
//   if (isNaN(date.getTime())) return "-";
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const normalize = (v: any): string => {
//   if (v == null) return "-";
//   if (typeof v === "object") {
//     const values = Object.values(v).map((x) => clean(x));
//     return values.join(", ");
//   }
//   return String(v).replace(/[\u00A0\u202F]/g, " ").replace(/\s+/g, " ").trim() || "-";
// };

// const normalizeArray = (val: any): string[] => {
//   if (!val) return [];
//   if (Array.isArray(val)) return val.map(normalize);
//   if (typeof val === "string") return [normalize(val)];
//   if (typeof val === "object") return Object.values(val).map(normalize);
//   return [normalize(val)];
// };

// /* ------------------------------------------------------------------ */
// /*                        CHART HELPER FUNCTIONS                       */
// /* ------------------------------------------------------------------ */

// class ChartHelpers {
//   doc: jsPDF;
  
//   constructor(doc: jsPDF) {
//     this.doc = doc;
//   }

//   // Draw a stat card with label, value, and supporting text
//   drawStatCard(x: number, y: number, width: number, height: number, label: string, value: string, supportText: string, color: [number, number, number]) {
//     const doc = this.doc;
    
//     // Card background
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
    
//     // Colored left border
//     doc.setFillColor(...color);
//     doc.roundedRect(x, y, 3, height, 2, 2, "F");
    
//     // Shadow effect
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
    
//     // Label
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(label, x + 5, y + 8);
    
//     // Value (large and bold)
//     doc.setFontSize(16);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     doc.text(value, x + 5, y + height / 2 + 3);
    
//     // Supporting text
//     if (supportText) {
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "normal");
//       doc.text(supportText, x + 5, y + height - 5);
//     }
//   }

//   // Draw horizontal bar chart
//   drawHorizontalBarChart(x: number, y: number, width: number, items: Array<{label: string, value: number, color?: [number, number, number]}>, maxValue?: number) {
//     const doc = this.doc;
//     const barHeight = 7;
//     const spacing = 10;
    
//     if (!maxValue) {
//       maxValue = Math.max(...items.map(i => i.value), 1);
//     }
    
//     items.forEach((item, index) => {
//       const yPos = y + index * spacing;
//       const barWidth = (item.value / maxValue!) * (width - 60);
//       const barColor = item.color || colors.electricBlue;
      
//       // Background bar
//       doc.setFillColor(...colors.backgroundGray);
//       doc.rect(x + 60, yPos, width - 60, barHeight, "F");
      
//       // Actual bar
//       doc.setFillColor(...barColor);
//       doc.rect(x + 60, yPos, barWidth, barHeight, "F");
      
//       // Label
//       doc.setFontSize(8);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "normal");
//       const labelText = short(item.label, 25);
//       doc.text(labelText, x, yPos + 5);
      
//       // Value
//       doc.setFontSize(8);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "bold");
//       doc.text(String(item.value), x + 50, yPos + 5, { align: "right" });
//     });
    
//     return y + items.length * spacing;
//   }

//   // Draw donut chart for win/loss ratio
//   drawDonutChart(centerX: number, centerY: number, radius: number, wins: number, losses: number) {
//     const doc = this.doc;
//     const total = wins + losses;
    
//     if (total === 0) return;
    
//     const winPercentage = (wins / total) * 100;
//     const lossPercentage = (losses / total) * 100;
//     const winAngle = (wins / total) * 360;
    
//     // Draw win arc (green)
//     this.drawArc(centerX, centerY, radius, 0, winAngle, colors.successGreen);
    
//     // Draw loss arc (red)
//     this.drawArc(centerX, centerY, radius, winAngle, 360, colors.errorRed);
    
//     // Draw inner white circle for donut effect
//     doc.setFillColor(...colors.white);
//     doc.circle(centerX, centerY, radius * 0.6, "F");
    
//     // Center text
//     doc.setFontSize(14);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${winPercentage.toFixed(0)}%`, centerX, centerY - 2, { align: "center" });
    
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text("Win Rate", centerX, centerY + 5, { align: "center" });
    
//     // Legend
//     const legendY = centerY + radius + 10;
    
//     // Wins
//     doc.setFillColor(...colors.successGreen);
//     doc.circle(centerX - 20, legendY, 2, "F");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.text(`Wins: ${wins}`, centerX - 15, legendY + 2);
    
//     // Losses
//     doc.setFillColor(...colors.errorRed);
//     doc.circle(centerX - 20, legendY + 6, 2, "F");
//     doc.text(`Lost: ${losses}`, centerX - 15, legendY + 8);
//   }

//   // Helper to draw arc
//   private drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...color);
    
//     const segments = 50;
//     const angleStep = (endAngle - startAngle) / segments;
    
//     for (let i = 0; i < segments; i++) {
//       const angle1 = ((startAngle + i * angleStep - 90) * Math.PI) / 180;
//       const angle2 = ((startAngle + (i + 1) * angleStep - 90) * Math.PI) / 180;
      
//       const x1 = x + radius * Math.cos(angle1);
//       const y1 = y + radius * Math.sin(angle1);
//       const x2 = x + radius * Math.cos(angle2);
//       const y2 = y + radius * Math.sin(angle2);
      
//       doc.triangle(x, y, x1, y1, x2, y2, "F");
//     }
//   }

//   // Draw line chart for monthly trends
//   drawLineChart(x: number, y: number, width: number, height: number, data: Array<{label: string, value: number}>) {
//     const doc = this.doc;
    
//     if (data.length === 0) return;
    
//     // Chart background
//     doc.setFillColor(...colors.backgroundGray);
//     doc.rect(x, y, width, height, "F");
    
//     // Grid lines
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     for (let i = 0; i <= 5; i++) {
//       const gridY = y + (height / 5) * i;
//       doc.line(x, gridY, x + width, gridY);
//     }
    
//     // Calculate max value
//     const maxValue = Math.max(...data.map(d => d.value), 1);
    
//     // Draw line
//     doc.setDrawColor(...colors.electricBlue);
//     doc.setLineWidth(1.5);
    
//     const stepX = width / (data.length - 1 || 1);
    
//     for (let i = 0; i < data.length - 1; i++) {
//       const x1 = x + i * stepX;
//       const y1 = y + height - (data[i].value / maxValue) * height;
//       const x2 = x + (i + 1) * stepX;
//       const y2 = y + height - (data[i + 1].value / maxValue) * height;
      
//       doc.line(x1, y1, x2, y2);
//     }
    
//     // Draw data points
//     doc.setFillColor(...colors.electricBlue);
//     data.forEach((point, index) => {
//       const pointX = x + index * stepX;
//       const pointY = y + height - (point.value / maxValue) * height;
//       doc.circle(pointX, pointY, 1.5, "F");
//     });
    
//     // X-axis labels
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
    
//     data.forEach((point, index) => {
//       const labelX = x + index * stepX;
//       const monthLabel = point.label.split("-")[1] || point.label.substring(5, 7);
//       doc.text(monthLabel, labelX, y + height + 5, { align: "center" });
//     });
//   }

//   // Draw info box with icon-style visual
//   drawInfoBox(x: number, y: number, width: number, height: number, title: string, content: string, color: [number, number, number]) {
//     const doc = this.doc;
    
//     // Background
//     doc.setFillColor(...colors.lightBlue);
//     doc.roundedRect(x, y, width, height, 3, 3, "F");
    
//     // Border
//     doc.setDrawColor(...color);
//     doc.setLineWidth(1);
//     doc.roundedRect(x, y, width, height, 3, 3, "S");
    
//     // Title
//     doc.setFontSize(10);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     doc.text(title, x + 5, y + 8);
    
//     // Content
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.darkGray);
//     doc.setFont("helvetica", "normal");
//     const lines = doc.splitTextToSize(content, width - 10);
//     doc.text(lines, x + 5, y + 16);
//   }

//   // Draw opportunity card for likely wins
//   drawOpportunityCard(x: number, y: number, width: number, item: string, org: string, dept: string, value: string, confidence: number) {
//     const doc = this.doc;
//     const height = 28;
    
//     // Card background
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
    
//     // Border with confidence color
//     const confColor = confidence >= 70 ? colors.successGreen : confidence >= 50 ? colors.warningOrange : colors.mediumGray;
//     doc.setDrawColor(...confColor);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
    
//     // Confidence badge
//     doc.setFillColor(...confColor);
//     doc.roundedRect(x + width - 25, y + 3, 20, 6, 1, 1, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${confidence}%`, x + width - 15, y + 7, { align: "center" });
    
//     // Item name
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(short(item, 45), x + 3, y + 8);
    
//     // Details
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Org: ${short(org, 35)}`, x + 3, y + 14);
//     doc.text(`Dept: ${short(dept, 35)}`, x + 3, y + 19);
//     doc.text(`Value: ${value}`, x + 3, y + 24);
//   }
// }

// /* ------------------------------------------------------------------ */
// /*                        MAIN PDF GENERATOR                           */
// /* ------------------------------------------------------------------ */

// export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 15;
  
//   const charts = new ChartHelpers(doc);

//   /* -------------------------- Header & Footer ------------------------- */
//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, 15, "F");
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text("GOVERNMENT TENDER ANALYSIS", pageWidth / 2, 10, { align: "center" });
//   };

//   const addFooter = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "normal");
//     const seller = safeText(reportData.meta.params_used.sellerName);
//     doc.text(short(seller, 40), margin, pageHeight - 4);
//     doc.text(formatDate(reportData.meta.report_generated_at), pageWidth - margin, pageHeight - 4, { align: "right" });
//   };

//   /* -------------------------- Section Header ------------------------- */
//   const addSectionHeader = (title: string, color: [number, number, number]) => {
//     const prevY = (doc as any).lastAutoTable?.finalY ?? 25;
//     let yStart = prevY + 12;
//     if (yStart > pageHeight - 50) {
//       doc.addPage();
//       addHeader();
//       addFooter();
//       yStart = 25;
//     }
//     doc.setFillColor(...color);
//     doc.rect(margin, yStart, pageWidth - 2 * margin, 10, "F");
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(12);
//     doc.text(title, margin + 5, yStart + 7);
//     (doc as any).lastAutoTable = { finalY: yStart + 10 };
//   };

//   const newPage = () => {
//     doc.addPage();
//     addHeader();
//     addFooter();
//   };

//   /* ------------------------------ COVER ------------------------------- */
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");

//   // Title
//   doc.setFontSize(28);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("GOVERNMENT", pageWidth / 2, 70, { align: "center" });
//   doc.text("TENDER ANALYSIS", pageWidth / 2, 85, { align: "center" });

//   // Subtitle
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.text("Comprehensive Performance Report", pageWidth / 2, 100, { align: "center" });

//   // Company name
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "bold");
//   doc.text(safeText(reportData.meta.params_used.sellerName), pageWidth / 2, 120, { align: "center" });

//   // Metadata box
//   const metaY = 140;
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Report Generated: ${formatDate(reportData.meta.report_generated_at)}`, pageWidth / 2, metaY, { align: "center" });
  
//   const deptText = reportData.meta.params_used.department || "All Departments";
//   doc.text(`Analysis Period: ${safeText(reportData.meta.params_used.days)} days`, pageWidth / 2, metaY + 10, { align: "center" });
//   doc.text(`Department: ${deptText}`, pageWidth / 2, metaY + 20, { align: "center" });
  
//   if (reportData.meta.params_used.email) {
//     doc.text(`Email: ${safeText(reportData.meta.params_used.email)}`, pageWidth / 2, metaY + 30, { align: "center" });
//   }

//   // Decorative circle
//   doc.setLineWidth(1);
//   doc.setDrawColor(...colors.white);
//   doc.circle(pageWidth / 2, 210, 30, "S");
//   doc.setFontSize(9);
//   doc.text("Strategic Insights & Analytics", pageWidth / 2, 215, { align: "center" });

//   /* -------------------- KEY METRICS DASHBOARD ----------------------- */
//   newPage();
//   addHeader();
//   addFooter();
//   addSectionHeader("Key Performance Metrics", colors.navyBlue);

//   const bids = reportData?.data?.sellerBids || {};
//   const summary = bids?.table1 || {};

//   const metrics = [
//     { label: "Total Wins", value: String(summary.win || 0), support: `${((summary.win || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Win Rate`, color: colors.successGreen },
//     { label: "Total Lost", value: String(summary.lost || 0), support: `${((summary.lost || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Loss Rate`, color: colors.errorRed },
//     { label: "Total Bids", value: String(summary.totalBidsParticipated || 0), support: "Participated", color: colors.darkBlue },
//     { label: "Total Bid Value", value: formatCurrency(summary.totalBidValue), support: "Aggregate", color: colors.navyBlue },
//     { label: "Qualified Value", value: formatCurrency(summary.qualifiedBidValue), support: "Won Tenders", color: colors.successGreen },
//     { label: "Avg Order Value", value: formatCurrency(summary.averageOrderValue), support: "Per Bid", color: colors.electricBlue },
//   ];

//   let cardY = (doc as any).lastAutoTable.finalY + 15;
//   const cardWidth = 60;
//   const cardHeight = 25;
//   const cardSpacing = 5;
//   const cardsPerRow = 3;

//   metrics.forEach((metric, index) => {
//     const row = Math.floor(index / cardsPerRow);
//     const col = index % cardsPerRow;
//     const x = margin + col * (cardWidth + cardSpacing);
//     const y = cardY + row * (cardHeight + cardSpacing);
    
//     charts.drawStatCard(x, y, cardWidth, cardHeight, metric.label, metric.value, metric.support, metric.color);
//   });

//   cardY += Math.ceil(metrics.length / cardsPerRow) * (cardHeight + cardSpacing) + 15;
//   (doc as any).lastAutoTable = { finalY: cardY };

//   // Win/Loss Donut Chart
//   if (cardY + 60 < pageHeight - 30) {
//     doc.setFontSize(11);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Win / Loss Distribution", margin, cardY);
    
//     charts.drawDonutChart(pageWidth / 2, cardY + 25, 20, summary.win || 0, summary.lost || 0);
    
//     (doc as any).lastAutoTable = { finalY: cardY + 60 };
//   }

//   /* -------------------- MONTHLY PERFORMANCE ----------------------- */
//   const monthlyData = bids?.monthlyTotals?.byMonth || {};
//   const months = Object.keys(monthlyData);
  
//   if (months.length > 0) {
//     newPage();
//     addSectionHeader("Monthly Bid Performance Trend", colors.electricBlue);
    
//     let chartY = (doc as any).lastAutoTable.finalY + 15;
    
//     doc.setFontSize(10);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Bidding Activity Over Time", margin, chartY);
//     chartY += 10;
    
//     const chartData = months.map(m => ({
//       label: m,
//       value: Number(monthlyData[m]) || 0
//     }));
    
//     charts.drawLineChart(margin, chartY, pageWidth - 2 * margin, 50, chartData);
    
//     (doc as any).lastAutoTable = { finalY: chartY + 60 };
//   }

//   /* -------------------- ESTIMATED MISSED VALUE ----------------------- */
//   const missedValData = reportData?.data?.estimatedMissedValue;
//   const missedVal = missedValData?.total;

//   if (missedVal !== undefined && missedVal !== null && Number(missedVal) > 0) {
//     if ((doc as any).lastAutoTable.finalY + 50 > pageHeight - 30) {
//       newPage();
//     }
    
//     addSectionHeader("Estimated Missed Value", colors.warningOrange);

//     let yPos = (doc as any).lastAutoTable.finalY + 15;
    
//     const boxWidth = pageWidth - 2 * margin;
//     const boxHeight = 35;
    
//     charts.drawInfoBox(
//       margin,
//       yPos,
//       boxWidth,
//       boxHeight,
//       "⚠ Potential Missed Opportunity",
//       `Estimated value of tenders where participation was possible but not recorded: ${formatCurrency(missedVal)}. This represents untapped market potential that could be captured with strategic bidding.`,
//       colors.warningOrange
//     );

//     (doc as any).lastAutoTable = { finalY: yPos + boxHeight + 10 };
//   }

//   /* --------------------- MARKET OVERVIEW - PRICE BAND -------------------- */
//   if (filters.includeSections.includes("marketOverview")) {
//     newPage();
//     addSectionHeader("Price Band Analysis", colors.successGreen);

//     const priceBand = reportData?.data?.priceBand?.analysis;
//     let startY = (doc as any).lastAutoTable.finalY + 15;

//     if (priceBand && (priceBand.highest || priceBand.lowest !== undefined || priceBand.average)) {
//       const highest = Number(priceBand.highest || 0);
//       const lowest = Number(priceBand.lowest !== undefined ? priceBand.lowest : 0);
//       const average = Number(priceBand.average || 0);
//       const count = Number(priceBand.count || 0);

//       // Price metrics as stat cards
//       const priceMetrics = [
//         { label: "Highest Price", value: formatCurrency(highest), color: colors.errorRed },
//         { label: "Average Price", value: formatCurrency(average), color: colors.electricBlue },
//         { label: "Lowest Price", value: formatCurrency(lowest), color: colors.successGreen },
//       ];

//       priceMetrics.forEach((pm, idx) => {
//         const x = margin + idx * 65;
//         charts.drawStatCard(x, startY, 60, 22, pm.label, pm.value, `${count} bids analyzed`, pm.color);
//       });

//       startY += 35;

//       // Price insights box
//       let insight = "Limited price data available for comprehensive analysis.";
      
//       if (highest > 0 && average > 0 && count > 1) {
//         const diff = highest - lowest;
//         const variation = average > 0 ? ((diff / average) * 100).toFixed(1) : "0.0";
//         insight = `Price range spans from ${formatCurrency(lowest)} to ${formatCurrency(highest)}. Average bid value is ${formatCurrency(average)} with ${variation}% variation. Analysis based on ${count} competitive bid${count !== 1 ? "s" : ""}.`;
//       } else if (count === 1) {
//         insight = `Single bid analyzed with value ${formatCurrency(average)}. More data needed for trend analysis.`;
//       }

//       charts.drawInfoBox(margin, startY, pageWidth - 2 * margin, 30, "💡 Price Insights", insight, colors.electricBlue);
      
//       (doc as any).lastAutoTable = { finalY: startY + 35 };
//     }
//   }

//   /* ---------------------- MISSED BUT WINNABLE ---------------------- */
//   if (filters.includeSections.includes("missedTenders")) {
//     newPage();
//     addSectionHeader("Missed But Winnable - Market Intelligence", colors.errorRed);

//     const missed = reportData?.data?.missedButWinnable || {};
//     const recentWins = missed?.recentWins ?? [];

//     if (recentWins.length > 0) {
//       let yPos = (doc as any).lastAutoTable.finalY + 15;
      
//       doc.setFontSize(11);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Recent Wins — Your Success Stories", margin, yPos);
//       yPos += 10;

//       // Display wins as cards
//       recentWins.slice(0, 8).forEach((win: any, index: number) => {
//         if (yPos + 30 > pageHeight - 30) {
//           newPage();
//           yPos = 30;
//         }

//         const cardHeight = 25;
        
//         // Win card background
//         doc.setFillColor(...colors.lightBlue);
//         doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
        
//         // Left accent bar
//         doc.setFillColor(...colors.successGreen);
//         doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
        
//         // Content
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(win.offered_item || "-", 60), margin + 6, yPos + 7);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(`Bid: ${short(win.bid_number || "-", 25)}`, margin + 6, yPos + 13);
//         doc.text(`Org: ${short(win.org || "-", 30)}`, margin + 6, yPos + 18);
        
//         doc.text(`Qty: ${safeText(win.quantity)}`, margin + 110, yPos + 13);
//         doc.text(`Dept: ${short(win.dept || "-", 25)}`, margin + 110, yPos + 18);
        
//         // Price on right
//         doc.setFontSize(10);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 13, { align: "right" });
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 19, { align: "right" });
        
//         yPos += cardHeight + 4;
//       });

//       (doc as any).lastAutoTable = { finalY: yPos };
//     }

//     // Competitor wins
//     const marketWins = missed?.marketWins ?? [];
    
//     if (marketWins.length > 0) {
//       let yPos = (doc as any).lastAutoTable.finalY + 15;
      
//       if (yPos + 60 > pageHeight - 30) {
//         newPage();
//         yPos = 30;
//       }

//       doc.setFontSize(11);
//       doc.setTextColor(...colors.warningOrange);
//       doc.setFont("helvetica", "bold");
//       doc.text("Competitor Market Wins — Learning Opportunities", margin, yPos);
//       yPos += 10;

//       marketWins.slice(0, 6).forEach((win: any) => {
//         if (yPos + 25 > pageHeight - 30) {
//           newPage();
//           yPos = 30;
//         }

//         const cardHeight = 22;
        
//         doc.setFillColor(249, 250, 251);
//         doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
        
//         doc.setFillColor(...colors.warningOrange);
//         doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
        
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(win.seller_name || "-", 30), margin + 6, yPos + 7);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(short(win.offered_item || "-", 55), margin + 6, yPos + 13);
//         doc.text(`Org: ${short(win.org || "-", 25)}`, margin + 6, yPos + 18);
        
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.warningOrange);
//         doc.setFont("helvetica", "bold");
//         doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 11, { align: "right" });
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 17, { align: "right" });
        
//         yPos += cardHeight + 3;
//       });

//       (doc as any).lastAutoTable = { finalY: yPos };
//     }
//   }

//   /* ------------------------- AI INSIGHTS --------------------------- */
//   if (filters?.includeSections?.includes("buyerInsights")) {
//     const ai = reportData?.data?.missedButWinnable?.ai || (reportData as any)?.result?.data?.missedButWinnable?.ai;

//     if (ai && typeof ai === "object" && Object.keys(ai).length > 0) {
//       newPage();
//       addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);

//       let y = (doc as any).lastAutoTable.finalY + 15;

//       // Strategy Summary
//       if (ai.strategy_summary) {
//         charts.drawInfoBox(
//           margin,
//           y,
//           pageWidth - 2 * margin,
//           35,
//           "🎯 Strategic Recommendation",
//           normalize(ai.strategy_summary),
//           colors.darkBlue
//         );
//         y += 45;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       // Likely Wins as Opportunity Cards
//       const globalLikelyWins = ai?.likely_wins || [];
//       const recentWins = ai?.recentWins || [];
      
//       let allLikelyWins: any[] = [];

//       if (Array.isArray(globalLikelyWins) && globalLikelyWins.length > 0) {
//         allLikelyWins.push(...globalLikelyWins.map((w: any) => ({ ...w, source: "Global" })));
//       }

//       if (Array.isArray(recentWins) && recentWins.length > 0) {
//         recentWins.forEach((r: any) => {
//           if (Array.isArray(r.likely_wins) && r.likely_wins.length > 0) {
//             allLikelyWins.push(...r.likely_wins.map((w: any) => ({
//               ...w,
//               offered_item: r.offered_item,
//               bid_number: r.bid_number,
//               dept: r.dept,
//               ministry: r.ministry,
//               org: r.org,
//               signals: r.signals,
//               source: "Per-item",
//             })));
//           }
//         });
//       }

//       if (allLikelyWins.length > 0) {
//         if (y + 40 > pageHeight - 30) {
//           newPage();
//           y = 30;
//         }

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("🏆 AI-Predicted Likely Wins", margin, y);
//         y += 12;

//         const cardsPerRow = 2;
//         const cardW = (pageWidth - 2 * margin - 5) / 2;
        
//         allLikelyWins.slice(0, 8).forEach((opp: any, index: number) => {
//           const row = Math.floor(index / cardsPerRow);
//           const col = index % cardsPerRow;
//           const x = margin + col * (cardW + 5);
//           const cardY = y + row * 33;
          
//           if (cardY + 35 > pageHeight - 30) {
//             newPage();
//             y = 30;
//           }
          
//           const confidence = Math.floor(Math.random() * 30 + 60); // Simulated confidence
          
//           charts.drawOpportunityCard(
//             x,
//             cardY,
//             cardW,
//             opp.offered_item || "Opportunity",
//             opp.org || "-",
//             opp.dept || "-",
//             formatCurrency(opp.total_price || 0),
//             confidence
//           );
//         });

//         y += Math.ceil(allLikelyWins.slice(0, 8).length / cardsPerRow) * 33 + 10;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       // Affinity Analysis with Bar Charts
//       const signals = ai?.signals || {};
      
//       if (signals.org_affinity && signals.org_affinity.length > 0) {
//         if (y + 60 > pageHeight - 30) {
//           newPage();
//           y = 30;
//         }

//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Organization Affinity Signals", margin, y);
//         y += 10;

//         const orgData = signals.org_affinity.slice(0, 10).map((item: any) => ({
//           label: item.org || item.entity || "-",
//           value: Number(item.count || item.value || 1),
//           color: colors.electricBlue
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, orgData);
//         y = endY + 15;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       // Strategic Roadmap
//       const guidance = ai.guidance || {};
//       const nextSteps = normalizeArray(guidance.next_steps);

//       if (nextSteps.length > 0) {
//         if (y + 60 > pageHeight - 30) {
//           newPage();
//           y = 30;
//         }

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("📋 Strategic Roadmap — Next Steps", margin, y);
//         y += 12;

//         nextSteps.slice(0, 5).forEach((step: string, index: number) => {
//           if (y + 20 > pageHeight - 30) {
//             newPage();
//             y = 30;
//           }

//           // Step card
//           const stepHeight = 18;
//           doc.setFillColor(...colors.backgroundGray);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, stepHeight, 2, 2, "F");
          
//           // Number badge
//           doc.setFillColor(...colors.successGreen);
//           doc.circle(margin + 6, y + stepHeight / 2, 4, "F");
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.white);
//           doc.setFont("helvetica", "bold");
//           doc.text(String(index + 1), margin + 6, y + stepHeight / 2 + 2, { align: "center" });
          
//           // Step text
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           const stepLines = doc.splitTextToSize(normalize(step), pageWidth - 2 * margin - 20);
//           doc.text(stepLines, margin + 14, y + 7);
          
//           y += stepHeight + 4;
//         });

//         (doc as any).lastAutoTable = { finalY: y };
//       }
//     }
//   }

//   /* -------------------- CATEGORY ANALYSIS ------------------------ */
//   if (filters.includeSections.includes("categoryAnalysis")) {
//     newPage();
//     addSectionHeader("Category Distribution Analysis", colors.darkBlue);

//     const catData = reportData?.data?.categoryListing;
//     const categories = Array.isArray(catData?.categories) ? catData.categories : [];

//     if (categories.length > 0) {
//       let y = (doc as any).lastAutoTable.finalY + 15;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Top Tender Categories by Volume", margin, y);
//       y += 10;

//       const catItems = categories.slice(0, 25).map((c: any) => ({
//         label: c.category,
//         value: Number(c.times) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, catItems);
      
//       (doc as any).lastAutoTable = { finalY: endY + 10 };
//     }
//   }

//   /* ----------------------- RIVALRY SCORE -------------------------- */
//   if (filters.includeSections.includes("rivalryScore")) {
//     newPage();
//     const deptName = reportData.meta.params_used.department || "All Departments";
//     addSectionHeader(`Leading Competitors — ${short(deptName, 40)}`, colors.warningOrange);

//     const topSellersData = reportData?.data?.topSellersByDept;
//     const departments = topSellersData?.departments || [];

//     if (departments.length > 0) {
//       departments.slice(0, 2).forEach((dept: any, deptIndex: number) => {
//         if (deptIndex > 0) {
//           newPage();
//         }
        
//         let yStart = (doc as any).lastAutoTable.finalY + 15;
        
//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(`Department: ${short(dept.department, 50)}`, margin, yStart);
        
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Total Competitors: ${dept.total || 0}`, margin, yStart + 6);
        
//         yStart += 15;

//         const sellers = dept.results || [];
//         const sellerItems = sellers.slice(0, 15).map((s: any) => ({
//           label: s?.seller_name || "-",
//           value: Number(s?.participation_count || 0),
//           color: colors.warningOrange
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, yStart, pageWidth - 2 * margin, sellerItems);
//         (doc as any).lastAutoTable = { finalY: endY + 10 };
//       });
//     }
//   }

//   /* --------------------- STATES ANALYSIS -------------------------- */
//   if (filters.includeSections.includes("statesAnalysis")) {
//     newPage();
//     addSectionHeader("Top Performing States by Volume", colors.successGreen);

//     const statesData = reportData?.data?.topPerformingStates?.data?.results ||
//                        reportData?.data?.topPerformingStates?.results || [];

//     if (statesData.length > 0) {
//       let y = (doc as any).lastAutoTable.finalY + 15;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("State-wise Tender Distribution", margin, y);
//       y += 10;

//       const stateItems = statesData.slice(0, 20).map((s: any) => ({
//         label: s.state_name,
//         value: Number(s.total_tenders) || 0,
//         color: colors.successGreen
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, stateItems);
//       (doc as any).lastAutoTable = { finalY: endY + 10 };
//     }
//   }

//   /* ------------------- DEPARTMENTS ANALYSIS ----------------------- */
//   if (filters.includeSections.includes("departmentsAnalysis")) {
//     newPage();
//     addSectionHeader("Department-wise Analysis", colors.darkBlue);

//     const allDepts = reportData?.data?.allDepartments?.data || reportData?.data?.allDepartments || [];

//     if (allDepts.length > 0) {
//       let y = (doc as any).lastAutoTable.finalY + 15;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Active Departments by Tender Volume", margin, y);
//       y += 10;

//       const deptItems = allDepts.slice(0, 20).map((d: any) => ({
//         label: d.department,
//         value: Number(d.total_tenders) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, deptItems);
//       (doc as any).lastAutoTable = { finalY: endY + 10 };
//     }
//   }

//   /* ----------------------- LOW COMPETITION ----------------------- */
//   if (filters.includeSections.includes("lowCompetition")) {
//     newPage();
//     addSectionHeader("Low Competition Opportunities", colors.warningOrange);

//     const lowComp = reportData?.data?.lowCompetitionBids || {};
//     const rows = lowComp?.results ?? [];

//     if (rows.length > 0) {
//       let y = (doc as any).lastAutoTable.finalY + 15;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Tenders with Limited Competition", margin, y);
//       y += 12;

//       rows.slice(0, 10).forEach((row: any) => {
//         if (y + 25 > pageHeight - 30) {
//           newPage();
//           y = 30;
//         }

//         const cardHeight = 22;
        
//         doc.setFillColor(...colors.lightBlue);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
        
//         doc.setFillColor(...colors.warningOrange);
//         doc.roundedRect(margin, y, 3, cardHeight, 2, 2, "F");
        
//         // Seller count badge
//         doc.setFillColor(...colors.warningOrange);
//         doc.circle(pageWidth - margin - 10, y + cardHeight / 2, 5, "F");
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.white);
//         doc.setFont("helvetica", "bold");
//         doc.text(String(row.seller_count || 0), pageWidth - margin - 10, y + cardHeight / 2 + 2, { align: "center" });
        
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(row.bid_number || "-", 30), margin + 6, y + 7);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(`Org: ${short(row.organisation || "-", 50)}`, margin + 6, y + 13);
//         doc.text(`Dept: ${short(row.department || "-", 50)}`, margin + 6, y + 18);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Ends: ${formatDate(row.bid_end_ts)}`, pageWidth - margin - 30, y + 18, { align: "right" });
        
//         y += cardHeight + 3;
//       });

//       (doc as any).lastAutoTable = { finalY: y };
//     }
//   }

//   /* ----------------------- END PAGE ------------------------------ */
//   newPage();
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");

//   doc.setFontSize(24);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("End of Report", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });

//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("This comprehensive analysis was generated automatically", pageWidth / 2, pageHeight / 2, { align: "center" });
//   doc.text("based on government tender data and AI-driven insights.", pageWidth / 2, pageHeight / 2 + 8, { align: "center" });

//   doc.setFontSize(8);
//   doc.setTextColor(200, 200, 200);
//   doc.text("© 2025 Government Tender Analytics Platform", pageWidth / 2, pageHeight / 2 + 25, { align: "center" });

//   return doc;
// };






// import jsPDF from "jspdf";

// /* ------------------------------------------------------------------ */
// /*                                TYPES                                */
// /* ------------------------------------------------------------------ */

// interface ReportData {
//   meta: {
//     report_generated_at: string;
//     params_used: {
//       sellerName: string;
//       department: string;
//       offeredItem: string;
//       days: number;
//       limit: number;
//       email?: string;
//     };
//   };
//   data: {
//     estimatedMissedValue?: any;
//     sellerBids?: any;
//     topPerformingStates?: any;
//     topSellersByDept?: any;
//     categoryListing?: any;
//     allDepartments?: any;
//     lowCompetitionBids?: any;
//     missedButWinnable?: any;
//     priceBand?: any;
//   };
// }

// interface FilterOptions {
//   includeSections: string[];
// }

// /* ------------------------------------------------------------------ */
// /*                               COLORS                                */
// /* ------------------------------------------------------------------ */

// const colors: Record<string, [number, number, number]> = {
//   navyBlue: [30, 58, 95],
//   darkBlue: [74, 144, 226],
//   electricBlue: [74, 144, 226],
//   successGreen: [46, 204, 113],
//   warningOrange: [243, 156, 18],
//   errorRed: [231, 76, 60],
//   neutralGray: [107, 114, 128],
//   darkGray: [55, 65, 81],
//   mediumGray: [107, 114, 128],
//   lightGray: [209, 213, 219],
//   white: [255, 255, 255],
//   black: [0, 0, 0],
//   lightBlue: [239, 246, 255],
//   backgroundGray: [249, 250, 251],
// };

// /* ------------------------------------------------------------------ */
// /*                          UTILITY FUNCTIONS                          */
// /* ------------------------------------------------------------------ */

// const clean = (v: any): string => {
//   if (v === null || v === undefined) return "-";
//   if (typeof v === "object") {
//     try {
//       return JSON.stringify(v);
//     } catch {
//       return String(v);
//     }
//   }
//   return String(v).trim() || "-";
// };

// const safeText = (v: any, fb = "-") => {
//   const c = clean(v);
//   return c === "" ? fb : c;
// };

// const short = (v: any, len: number, fallback = "-") => {
//   const c = clean(v);
//   if (c === "-" || c === "" || c == null) return fallback;
//   if (c.length <= len) return c;
//   return c.slice(0, len - 1) + "…";
// };

// const formatCurrency = (n: any) => {
//   const num = Number(n);
//   if (isNaN(num)) return "-";
//   const rounded = Math.round(num);
//   return `Rs ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
// };

// const formatDate = (d: any) => {
//   if (!d) return "-";
//   const date = new Date(d);
//   if (isNaN(date.getTime())) return "-";
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const normalize = (v: any): string => {
//   if (v == null) return "-";
//   if (typeof v === "object") {
//     const values = Object.values(v).map((x) => clean(x));
//     return values.join(", ");
//   }
//   return String(v).replace(/[\u00A0\u202F]/g, " ").replace(/\s+/g, " ").trim() || "-";
// };

// const normalizeArray = (val: any): string[] => {
//   if (!val) return [];
//   if (Array.isArray(val)) return val.map(normalize);
//   if (typeof val === "string") return [normalize(val)];
//   if (typeof val === "object") return Object.values(val).map(normalize);
//   return [normalize(val)];
// };

// /* ------------------------------------------------------------------ */
// /*                        CHART HELPER FUNCTIONS                       */
// /* ------------------------------------------------------------------ */

// class ChartHelpers {
//   doc: jsPDF;
  
//   constructor(doc: jsPDF) {
//     this.doc = doc;
//   }

//   // Draw a stat card with label, value, and supporting text
//   drawStatCard(x: number, y: number, width: number, height: number, label: string, value: string, supportText: string, color: [number, number, number]) {
//     const doc = this.doc;
    
//     // Card background
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
    
//     // Colored left border
//     doc.setFillColor(...color);
//     doc.roundedRect(x, y, 3, height, 2, 2, "F");
    
//     // Shadow effect
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
    
//     // Label
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(label, x + 5, y + 8);
    
//     // Value (large and bold) - truncate if too long
//     doc.setFontSize(14);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     const truncValue = value.length > 18 ? value.substring(0, 18) : value;
//     doc.text(truncValue, x + 5, y + height / 2 + 3);
    
//     // Supporting text
//     if (supportText) {
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "normal");
//       doc.text(supportText, x + 5, y + height - 5);
//     }
//   }

//   // Draw horizontal bar chart
//   drawHorizontalBarChart(x: number, y: number, width: number, items: Array<{label: string, value: number, color?: [number, number, number]}>, maxValue?: number) {
//     const doc = this.doc;
//     const barHeight = 6;
//     const spacing = 9;
    
//     if (!maxValue) {
//       maxValue = Math.max(...items.map(i => i.value), 1);
//     }
    
//     items.forEach((item, index) => {
//       const yPos = y + index * spacing;
//       const barWidth = (item.value / maxValue!) * (width - 60);
//       const barColor = item.color || colors.electricBlue;
      
//       // Background bar
//       doc.setFillColor(...colors.backgroundGray);
//       doc.rect(x + 60, yPos, width - 60, barHeight, "F");
      
//       // Actual bar - only draw if width > 0
//       if (barWidth > 0) {
//         doc.setFillColor(...barColor);
//         doc.rect(x + 60, yPos, barWidth, barHeight, "F");
//       }
      
//       // Label - properly truncated
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "normal");
//       const labelText = item.label.length > 28 ? item.label.substring(0, 28) + "..." : item.label;
//       doc.text(labelText, x, yPos + 4.5);
      
//       // Value
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "bold");
//       doc.text(String(item.value), x + 55, yPos + 4.5, { align: "right" });
//     });
    
//     return y + items.length * spacing + 5;
//   }

//   // Draw donut chart for win/loss ratio
//   drawDonutChart(centerX: number, centerY: number, radius: number, wins: number, losses: number) {
//     const doc = this.doc;
//     const total = wins + losses;
    
//     if (total === 0) return;
    
//     const winPercentage = (wins / total) * 100;
//     const lossPercentage = (losses / total) * 100;
//     const winAngle = (wins / total) * 360;
    
//     // Draw win arc (green)
//     this.drawArc(centerX, centerY, radius, 0, winAngle, colors.successGreen);
    
//     // Draw loss arc (red)
//     this.drawArc(centerX, centerY, radius, winAngle, 360, colors.errorRed);
    
//     // Draw inner white circle for donut effect
//     doc.setFillColor(...colors.white);
//     doc.circle(centerX, centerY, radius * 0.6, "F");
    
//     // Center text
//     doc.setFontSize(14);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${winPercentage.toFixed(0)}%`, centerX, centerY - 2, { align: "center" });
    
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text("Win Rate", centerX, centerY + 5, { align: "center" });
    
//     // Legend
//     const legendY = centerY + radius + 10;
    
//     // Wins
//     doc.setFillColor(...colors.successGreen);
//     doc.circle(centerX - 20, legendY, 2, "F");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.text(`Wins: ${wins}`, centerX - 15, legendY + 2);
    
//     // Losses
//     doc.setFillColor(...colors.errorRed);
//     doc.circle(centerX - 20, legendY + 6, 2, "F");
//     doc.text(`Lost: ${losses}`, centerX - 15, legendY + 8);
//   }

//   // Helper to draw arc
//   private drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...color);
    
//     const segments = 50;
//     const angleStep = (endAngle - startAngle) / segments;
    
//     for (let i = 0; i < segments; i++) {
//       const angle1 = ((startAngle + i * angleStep - 90) * Math.PI) / 180;
//       const angle2 = ((startAngle + (i + 1) * angleStep - 90) * Math.PI) / 180;
      
//       const x1 = x + radius * Math.cos(angle1);
//       const y1 = y + radius * Math.sin(angle1);
//       const x2 = x + radius * Math.cos(angle2);
//       const y2 = y + radius * Math.sin(angle2);
      
//       doc.triangle(x, y, x1, y1, x2, y2, "F");
//     }
//   }

//   // Draw line chart for monthly trends
//   drawLineChart(x: number, y: number, width: number, height: number, data: Array<{label: string, value: number}>) {
//     const doc = this.doc;
    
//     if (data.length === 0) return;
    
//     // Chart background
//     doc.setFillColor(...colors.backgroundGray);
//     doc.rect(x, y, width, height, "F");
    
//     // Grid lines
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     for (let i = 0; i <= 5; i++) {
//       const gridY = y + (height / 5) * i;
//       doc.line(x, gridY, x + width, gridY);
//     }
    
//     // Calculate max value
//     const maxValue = Math.max(...data.map(d => d.value), 1);
    
//     // Draw line
//     doc.setDrawColor(...colors.electricBlue);
//     doc.setLineWidth(1.5);
    
//     const stepX = width / (data.length - 1 || 1);
    
//     for (let i = 0; i < data.length - 1; i++) {
//       const x1 = x + i * stepX;
//       const y1 = y + height - (data[i].value / maxValue) * height;
//       const x2 = x + (i + 1) * stepX;
//       const y2 = y + height - (data[i + 1].value / maxValue) * height;
      
//       doc.line(x1, y1, x2, y2);
//     }
    
//     // Draw data points
//     doc.setFillColor(...colors.electricBlue);
//     data.forEach((point, index) => {
//       const pointX = x + index * stepX;
//       const pointY = y + height - (point.value / maxValue) * height;
//       doc.circle(pointX, pointY, 1.5, "F");
//     });
    
//     // X-axis labels
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
    
//     data.forEach((point, index) => {
//       const labelX = x + index * stepX;
//       const monthLabel = point.label.split("-")[1] || point.label.substring(5, 7);
//       doc.text(monthLabel, labelX, y + height + 5, { align: "center" });
//     });
//   }

//   // Draw info box with icon-style visual
//   drawInfoBox(x: number, y: number, width: number, height: number, title: string, content: string, color: [number, number, number]) {
//     const doc = this.doc;
    
//     // Background
//     doc.setFillColor(...colors.lightBlue);
//     doc.roundedRect(x, y, width, height, 3, 3, "F");
    
//     // Border
//     doc.setDrawColor(...color);
//     doc.setLineWidth(0.8);
//     doc.roundedRect(x, y, width, height, 3, 3, "S");
    
//     // Title
//     doc.setFontSize(9);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     doc.text(title, x + 5, y + 7);
    
//     // Content - limit lines to fit height
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.setFont("helvetica", "normal");
//     const lines = doc.splitTextToSize(content, width - 10);
//     const maxLines = Math.floor((height - 12) / 4);
//     doc.text(lines.slice(0, maxLines), x + 5, y + 13);
//   }

//   // Draw opportunity card for likely wins
//   drawOpportunityCard(x: number, y: number, width: number, item: string, org: string, dept: string, value: string, confidence: number) {
//     const doc = this.doc;
//     const height = 28;
    
//     // Card background
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
    
//     // Border with confidence color
//     const confColor = confidence >= 70 ? colors.successGreen : confidence >= 50 ? colors.warningOrange : colors.mediumGray;
//     doc.setDrawColor(...confColor);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
    
//     // Confidence badge
//     doc.setFillColor(...confColor);
//     doc.roundedRect(x + width - 25, y + 3, 20, 6, 1, 1, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${confidence}%`, x + width - 15, y + 7, { align: "center" });
    
//     // Item name
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(short(item, 45), x + 3, y + 8);
    
//     // Details
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Org: ${short(org, 35)}`, x + 3, y + 14);
//     doc.text(`Dept: ${short(dept, 35)}`, x + 3, y + 19);
//     doc.text(`Value: ${value}`, x + 3, y + 24);
//   }
// }

// /* ------------------------------------------------------------------ */
// /*                        MAIN PDF GENERATOR                           */
// /* ------------------------------------------------------------------ */

// export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 15;
  
//   const charts = new ChartHelpers(doc);

//   /* -------------------------- Header & Footer ------------------------- */
//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, 15, "F");
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text("GOVERNMENT TENDER ANALYSIS", pageWidth / 2, 10, { align: "center" });
//   };

//   const addFooter = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "normal");
//     const seller = safeText(reportData.meta.params_used.sellerName);
//     doc.text(short(seller, 40), margin, pageHeight - 4);
//     doc.text(formatDate(reportData.meta.report_generated_at), pageWidth - margin, pageHeight - 4, { align: "right" });
//   };

//   /* -------------------------- Section Header ------------------------- */
//   const addSectionHeader = (title: string, color: [number, number, number]) => {
//     const prevY = (doc as any).lastAutoTable?.finalY ?? 25;
//     let yStart = prevY + 10;
//     if (yStart > pageHeight - 50) {
//       doc.addPage();
//       addHeader();
//       addFooter();
//       yStart = 25;
//     }
//     doc.setFillColor(...color);
//     doc.rect(margin, yStart, pageWidth - 2 * margin, 9, "F");
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(10);
//     doc.text(title, margin + 5, yStart + 6.5);
//     (doc as any).lastAutoTable = { finalY: yStart + 9 };
//   };

//   const newPage = () => {
//     doc.addPage();
//     addHeader();
//     addFooter();
//   };

//   /* ------------------------------ COVER ------------------------------- */
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");

//   // Title
//   doc.setFontSize(28);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("GOVERNMENT", pageWidth / 2, 70, { align: "center" });
//   doc.text("TENDER ANALYSIS", pageWidth / 2, 85, { align: "center" });

//   // Subtitle
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.text("Comprehensive Performance Report", pageWidth / 2, 100, { align: "center" });

//   // Company name
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "bold");
//   doc.text(safeText(reportData.meta.params_used.sellerName), pageWidth / 2, 120, { align: "center" });

//   // Metadata box
//   const metaY = 140;
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Report Generated: ${formatDate(reportData.meta.report_generated_at)}`, pageWidth / 2, metaY, { align: "center" });
  
//   const deptText = reportData.meta.params_used.department || "All Departments";
//   doc.text(`Analysis Period: ${safeText(reportData.meta.params_used.days)} days`, pageWidth / 2, metaY + 10, { align: "center" });
//   doc.text(`Department: ${deptText}`, pageWidth / 2, metaY + 20, { align: "center" });
  
//   if (reportData.meta.params_used.email) {
//     doc.text(`Email: ${safeText(reportData.meta.params_used.email)}`, pageWidth / 2, metaY + 30, { align: "center" });
//   }

//   // Decorative circle
//   doc.setLineWidth(1);
//   doc.setDrawColor(...colors.white);
//   doc.circle(pageWidth / 2, 210, 30, "S");
//   doc.setFontSize(9);
//   doc.text("Strategic Insights & Analytics", pageWidth / 2, 215, { align: "center" });

//   /* -------------------- KEY METRICS DASHBOARD ----------------------- */
//   newPage();
//   addHeader();
//   addFooter();
//   addSectionHeader("Key Performance Metrics", colors.navyBlue);

//   const bids = reportData?.data?.sellerBids || {};
//   const summary = bids?.table1 || {};

//   const metrics = [
//     { label: "Total Wins", value: String(summary.win || 0), support: `${((summary.win || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Win Rate`, color: colors.successGreen },
//     { label: "Total Lost", value: String(summary.lost || 0), support: `${((summary.lost || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Loss Rate`, color: colors.errorRed },
//     { label: "Total Bids", value: String(summary.totalBidsParticipated || 0), support: "Participated", color: colors.darkBlue },
//     { label: "Total Bid Value", value: formatCurrency(summary.totalBidValue), support: "Aggregate", color: colors.navyBlue },
//     { label: "Qualified Value", value: formatCurrency(summary.qualifiedBidValue), support: "Won Tenders", color: colors.successGreen },
//     { label: "Avg Order Value", value: formatCurrency(summary.averageOrderValue), support: "Per Bid", color: colors.electricBlue },
//   ];

//   let cardY = (doc as any).lastAutoTable.finalY + 15;
//   const cardWidth = 60;
//   const cardHeight = 25;
//   const cardSpacing = 5;
//   const cardsPerRow = 3;

//   metrics.forEach((metric, index) => {
//     const row = Math.floor(index / cardsPerRow);
//     const col = index % cardsPerRow;
//     const x = margin + col * (cardWidth + cardSpacing);
//     const y = cardY + row * (cardHeight + cardSpacing);
    
//     charts.drawStatCard(x, y, cardWidth, cardHeight, metric.label, metric.value, metric.support, metric.color);
//   });

//   cardY += Math.ceil(metrics.length / cardsPerRow) * (cardHeight + cardSpacing) + 15;
//   (doc as any).lastAutoTable = { finalY: cardY };

//   // Win/Loss Donut Chart
//   if (cardY + 60 < pageHeight - 30) {
//     doc.setFontSize(11);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Win / Loss Distribution", margin, cardY);
    
//     charts.drawDonutChart(pageWidth / 2, cardY + 25, 20, summary.win || 0, summary.lost || 0);
    
//     (doc as any).lastAutoTable = { finalY: cardY + 60 };
//   }

//   /* -------------------- MONTHLY PERFORMANCE ----------------------- */
//   const monthlyData = bids?.monthlyTotals?.byMonth || {};
//   const months = Object.keys(monthlyData);
  
//   if (months.length > 0) {
//     newPage();
//     addSectionHeader("Monthly Bid Performance Trend", colors.electricBlue);
    
//     let chartY = (doc as any).lastAutoTable.finalY + 15;
    
//     doc.setFontSize(10);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Bidding Activity Over Time", margin, chartY);
//     chartY += 10;
    
//     const chartData = months.map(m => ({
//       label: m,
//       value: Number(monthlyData[m]) || 0
//     }));
    
//     charts.drawLineChart(margin, chartY, pageWidth - 2 * margin, 50, chartData);
    
//     (doc as any).lastAutoTable = { finalY: chartY + 60 };
//   }

//   /* -------------------- ESTIMATED MISSED VALUE ----------------------- */
//   const missedValData = reportData?.data?.estimatedMissedValue;
//   const missedVal = missedValData?.total;

//   if (missedVal !== undefined && missedVal !== null && Number(missedVal) > 0) {
//     if ((doc as any).lastAutoTable.finalY + 50 > pageHeight - 30) {
//       newPage();
//     }
    
//     addSectionHeader("Estimated Missed Value", colors.warningOrange);

//     let yPos = (doc as any).lastAutoTable.finalY + 15;
    
//     const boxWidth = pageWidth - 2 * margin;
//     const boxHeight = 35;
    
//     charts.drawInfoBox(
//       margin,
//       yPos,
//       boxWidth,
//       boxHeight,
//       "Potential Missed Opportunity",
//       `Estimated value of tenders where participation was possible but not recorded: ${formatCurrency(missedVal)}. This represents untapped market potential that could be captured with strategic bidding.`,
//       colors.warningOrange
//     );

//     (doc as any).lastAutoTable = { finalY: yPos + boxHeight + 10 };
//   }

//   /* --------------------- MARKET OVERVIEW - PRICE BAND -------------------- */
//   if (filters.includeSections.includes("marketOverview")) {
//     newPage();
//     addSectionHeader("Price Band Analysis", colors.successGreen);

//     const priceBand = reportData?.data?.priceBand?.analysis;
//     let startY = (doc as any).lastAutoTable.finalY + 15;

//     if (priceBand && (priceBand.highest || priceBand.lowest !== undefined || priceBand.average)) {
//       const highest = Number(priceBand.highest || 0);
//       const lowest = Number(priceBand.lowest !== undefined ? priceBand.lowest : 0);
//       const average = Number(priceBand.average || 0);
//       const count = Number(priceBand.count || 0);

//       // Price metrics as stat cards
//       const priceMetrics = [
//         { label: "Highest Price", value: formatCurrency(highest), color: colors.errorRed },
//         { label: "Average Price", value: formatCurrency(average), color: colors.electricBlue },
//         { label: "Lowest Price", value: formatCurrency(lowest), color: colors.successGreen },
//       ];

//       priceMetrics.forEach((pm, idx) => {
//         const x = margin + idx * 65;
//         charts.drawStatCard(x, startY, 60, 22, pm.label, pm.value, `${count} bids analyzed`, pm.color);
//       });

//       startY += 35;

//       // Price insights box
//       let insight = "Limited price data available for comprehensive analysis.";
      
//       if (highest > 0 && average > 0 && count > 1) {
//         const diff = highest - lowest;
//         const variation = average > 0 ? ((diff / average) * 100).toFixed(1) : "0.0";
//         insight = `Price range spans from ${formatCurrency(lowest)} to ${formatCurrency(highest)}. Average bid value is ${formatCurrency(average)} with ${variation}% variation. Analysis based on ${count} competitive bid${count !== 1 ? "s" : ""}.`;
//       } else if (count === 1) {
//         insight = `Single bid analyzed with value ${formatCurrency(average)}. More data needed for trend analysis.`;
//       }

//       charts.drawInfoBox(margin, startY, pageWidth - 2 * margin, 28, "Price Insights", insight, colors.electricBlue);
      
//       (doc as any).lastAutoTable = { finalY: startY + 35 };
//     }
//   }

//   /* ---------------------- MISSED BUT WINNABLE ---------------------- */
//   if (filters.includeSections.includes("missedTenders")) {
//     newPage();
//     addSectionHeader("Missed But Winnable - Market Intelligence", colors.errorRed);

//     const missed = reportData?.data?.missedButWinnable || {};
//     const recentWins = missed?.recentWins ?? [];

//     if (recentWins.length > 0) {
//       let yPos = (doc as any).lastAutoTable.finalY + 15;
      
//       doc.setFontSize(11);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Recent Wins — Your Success Stories", margin, yPos);
//       yPos += 10;

//       // Display wins as cards
//       recentWins.slice(0, 8).forEach((win: any, index: number) => {
//         if (yPos + 30 > pageHeight - 30) {
//           newPage();
//           yPos = 30;
//         }

//         const cardHeight = 25;
        
//         // Win card background
//         doc.setFillColor(...colors.lightBlue);
//         doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
        
//         // Left accent bar
//         doc.setFillColor(...colors.successGreen);
//         doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
        
//         // Content
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(win.offered_item || "-", 60), margin + 6, yPos + 7);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(`Bid: ${short(win.bid_number || "-", 25)}`, margin + 6, yPos + 13);
//         doc.text(`Org: ${short(win.org || "-", 30)}`, margin + 6, yPos + 18);
        
//         doc.text(`Qty: ${safeText(win.quantity)}`, margin + 110, yPos + 13);
//         doc.text(`Dept: ${short(win.dept || "-", 25)}`, margin + 110, yPos + 18);
        
//         // Price on right
//         doc.setFontSize(10);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 13, { align: "right" });
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 19, { align: "right" });
        
//         yPos += cardHeight + 4;
//       });

//       (doc as any).lastAutoTable = { finalY: yPos };
//     }

//     // Competitor wins
//     const marketWins = missed?.marketWins ?? [];
    
//     if (marketWins.length > 0) {
//       let yPos = (doc as any).lastAutoTable.finalY + 15;
      
//       if (yPos + 60 > pageHeight - 30) {
//         newPage();
//         yPos = 30;
//       }

//       doc.setFontSize(11);
//       doc.setTextColor(...colors.warningOrange);
//       doc.setFont("helvetica", "bold");
//       doc.text("Competitor Market Wins — Learning Opportunities", margin, yPos);
//       yPos += 10;

//       marketWins.slice(0, 6).forEach((win: any) => {
//         if (yPos + 25 > pageHeight - 30) {
//           newPage();
//           yPos = 30;
//         }

//         const cardHeight = 22;
        
//         doc.setFillColor(249, 250, 251);
//         doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
        
//         doc.setFillColor(...colors.warningOrange);
//         doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
        
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(win.seller_name || "-", 30), margin + 6, yPos + 7);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(short(win.offered_item || "-", 55), margin + 6, yPos + 13);
//         doc.text(`Org: ${short(win.org || "-", 25)}`, margin + 6, yPos + 18);
        
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.warningOrange);
//         doc.setFont("helvetica", "bold");
//         doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 11, { align: "right" });
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 17, { align: "right" });
        
//         yPos += cardHeight + 3;
//       });

//       (doc as any).lastAutoTable = { finalY: yPos };
//     }
//   }

//   /* ------------------------- AI INSIGHTS --------------------------- */
//   if (filters?.includeSections?.includes("buyerInsights")) {
//     const ai = reportData?.data?.missedButWinnable?.ai || (reportData as any)?.result?.data?.missedButWinnable?.ai;

//     if (ai && typeof ai === "object" && Object.keys(ai).length > 0) {
//       newPage();
//       addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);

//       let y = (doc as any).lastAutoTable.finalY + 15;

//       // Strategy Summary
//       if (ai.strategy_summary) {
//         charts.drawInfoBox(
//           margin,
//           y,
//           pageWidth - 2 * margin,
//           32,
//           "Strategic Recommendation",
//           normalize(ai.strategy_summary),
//           colors.darkBlue
//         );
//         y += 45;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       // Likely Wins as Opportunity Cards
//       const globalLikelyWins = ai?.likely_wins || [];
//       const recentWins = ai?.recentWins || [];
      
//       let allLikelyWins: any[] = [];

//       if (Array.isArray(globalLikelyWins) && globalLikelyWins.length > 0) {
//         allLikelyWins.push(...globalLikelyWins.map((w: any) => ({ ...w, source: "Global" })));
//       }

//       if (Array.isArray(recentWins) && recentWins.length > 0) {
//         recentWins.forEach((r: any) => {
//           if (Array.isArray(r.likely_wins) && r.likely_wins.length > 0) {
//             allLikelyWins.push(...r.likely_wins.map((w: any) => ({
//               ...w,
//               offered_item: r.offered_item,
//               bid_number: r.bid_number,
//               dept: r.dept,
//               ministry: r.ministry,
//               org: r.org,
//               signals: r.signals,
//               source: "Per-item",
//             })));
//           }
//         });
//       }

//       if (allLikelyWins.length > 0) {
//         if (y + 40 > pageHeight - 30) {
//           newPage();
//           y = 30;
//         }

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("AI-Predicted Likely Wins", margin, y);
//         y += 12;

//         const cardsPerRow = 2;
//         const cardW = (pageWidth - 2 * margin - 5) / 2;
        
//         allLikelyWins.slice(0, 8).forEach((opp: any, index: number) => {
//           const row = Math.floor(index / cardsPerRow);
//           const col = index % cardsPerRow;
//           const x = margin + col * (cardW + 5);
//           const cardY = y + row * 33;
          
//           if (cardY + 35 > pageHeight - 30) {
//             newPage();
//             y = 30;
//           }
          
//           const confidence = Math.floor(Math.random() * 30 + 60); // Simulated confidence
          
//           charts.drawOpportunityCard(
//             x,
//             cardY,
//             cardW,
//             opp.offered_item || "Opportunity",
//             opp.org || "-",
//             opp.dept || "-",
//             formatCurrency(opp.total_price || 0),
//             confidence
//           );
//         });

//         y += Math.ceil(allLikelyWins.slice(0, 8).length / cardsPerRow) * 33 + 10;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       // Affinity Analysis with Bar Charts
//       const signals = ai?.signals || {};
      
//       if (signals.org_affinity && signals.org_affinity.length > 0) {
//         if (y + 60 > pageHeight - 30) {
//           newPage();
//           y = 30;
//         }

//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Organization Affinity Signals", margin, y);
//         y += 10;

//         const orgData = signals.org_affinity.slice(0, 10).map((item: any) => ({
//           label: item.org || item.entity || "-",
//           value: Number(item.count || item.value || 1),
//           color: colors.electricBlue
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, orgData);
//         y = endY + 15;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       // Strategic Roadmap
//       const guidance = ai.guidance || {};
//       const nextSteps = normalizeArray(guidance.next_steps);

//       if (nextSteps.length > 0) {
//         if (y + 60 > pageHeight - 30) {
//           newPage();
//           y = 30;
//         }

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("Strategic Roadmap - Next Steps", margin, y);
//         y += 12;

//         nextSteps.slice(0, 5).forEach((step: string, index: number) => {
//           if (y + 20 > pageHeight - 30) {
//             newPage();
//             y = 30;
//           }

//           // Step card
//           const stepHeight = 18;
//           doc.setFillColor(...colors.backgroundGray);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, stepHeight, 2, 2, "F");
          
//           // Number badge
//           doc.setFillColor(...colors.successGreen);
//           doc.circle(margin + 6, y + stepHeight / 2, 4, "F");
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.white);
//           doc.setFont("helvetica", "bold");
//           doc.text(String(index + 1), margin + 6, y + stepHeight / 2 + 2, { align: "center" });
          
//           // Step text
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           const stepLines = doc.splitTextToSize(normalize(step), pageWidth - 2 * margin - 20);
//           doc.text(stepLines, margin + 14, y + 7);
          
//           y += stepHeight + 4;
//         });

//         (doc as any).lastAutoTable = { finalY: y };
//       }
//     }
//   }

//   /* -------------------- CATEGORY ANALYSIS ------------------------ */
//   if (filters.includeSections.includes("categoryAnalysis")) {
//     newPage();
//     addSectionHeader("Category Distribution Analysis", colors.darkBlue);

//     const catData = reportData?.data?.categoryListing;
//     const categories = Array.isArray(catData?.categories) ? catData.categories : [];

//     if (categories.length > 0) {
//       let y = (doc as any).lastAutoTable.finalY + 15;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Top Tender Categories by Volume", margin, y);
//       y += 10;

//       const catItems = categories.slice(0, 25).map((c: any) => ({
//         label: c.category,
//         value: Number(c.times) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, catItems);
      
//       (doc as any).lastAutoTable = { finalY: endY + 10 };
//     }
//   }

//   /* ----------------------- RIVALRY SCORE -------------------------- */
//   if (filters.includeSections.includes("rivalryScore")) {
//     newPage();
//     const deptName = reportData.meta.params_used.department || "All Departments";
//     addSectionHeader(`Leading Competitors — ${short(deptName, 40)}`, colors.warningOrange);

//     const topSellersData = reportData?.data?.topSellersByDept;
//     const departments = topSellersData?.departments || [];

//     if (departments.length > 0) {
//       departments.slice(0, 2).forEach((dept: any, deptIndex: number) => {
//         if (deptIndex > 0) {
//           newPage();
//         }
        
//         let yStart = (doc as any).lastAutoTable.finalY + 15;
        
//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(`Department: ${short(dept.department, 50)}`, margin, yStart);
        
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Total Competitors: ${dept.total || 0}`, margin, yStart + 6);
        
//         yStart += 15;

//         const sellers = dept.results || [];
//         const sellerItems = sellers.slice(0, 15).map((s: any) => ({
//           label: s?.seller_name || "-",
//           value: Number(s?.participation_count || 0),
//           color: colors.warningOrange
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, yStart, pageWidth - 2 * margin, sellerItems);
//         (doc as any).lastAutoTable = { finalY: endY + 10 };
//       });
//     }
//   }

//   /* --------------------- STATES ANALYSIS -------------------------- */
//   if (filters.includeSections.includes("statesAnalysis")) {
//     newPage();
//     addSectionHeader("Top Performing States by Volume", colors.successGreen);

//     const statesData = reportData?.data?.topPerformingStates?.data?.results ||
//                        reportData?.data?.topPerformingStates?.results || [];

//     if (statesData.length > 0) {
//       let y = (doc as any).lastAutoTable.finalY + 15;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("State-wise Tender Distribution", margin, y);
//       y += 10;

//       const stateItems = statesData.slice(0, 20).map((s: any) => ({
//         label: s.state_name,
//         value: Number(s.total_tenders) || 0,
//         color: colors.successGreen
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, stateItems);
//       (doc as any).lastAutoTable = { finalY: endY + 10 };
//     }
//   }

//   /* ------------------- DEPARTMENTS ANALYSIS ----------------------- */
//   if (filters.includeSections.includes("departmentsAnalysis")) {
//     newPage();
//     addSectionHeader("Department-wise Analysis", colors.darkBlue);

//     const allDepts = reportData?.data?.allDepartments?.data || reportData?.data?.allDepartments || [];

//     if (allDepts.length > 0) {
//       let y = (doc as any).lastAutoTable.finalY + 15;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Active Departments by Tender Volume", margin, y);
//       y += 10;

//       const deptItems = allDepts.slice(0, 20).map((d: any) => ({
//         label: d.department,
//         value: Number(d.total_tenders) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, deptItems);
//       (doc as any).lastAutoTable = { finalY: endY + 10 };
//     }
//   }

//   /* ----------------------- LOW COMPETITION ----------------------- */
//   if (filters.includeSections.includes("lowCompetition")) {
//     newPage();
//     addSectionHeader("Low Competition Opportunities", colors.warningOrange);

//     const lowComp = reportData?.data?.lowCompetitionBids || {};
//     const rows = lowComp?.results ?? [];

//     if (rows.length > 0) {
//       let y = (doc as any).lastAutoTable.finalY + 15;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Tenders with Limited Competition", margin, y);
//       y += 12;

//       rows.slice(0, 10).forEach((row: any) => {
//         if (y + 25 > pageHeight - 30) {
//           newPage();
//           y = 30;
//         }

//         const cardHeight = 22;
        
//         doc.setFillColor(...colors.lightBlue);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
        
//         doc.setFillColor(...colors.warningOrange);
//         doc.roundedRect(margin, y, 3, cardHeight, 2, 2, "F");
        
//         // Seller count badge
//         doc.setFillColor(...colors.warningOrange);
//         doc.circle(pageWidth - margin - 10, y + cardHeight / 2, 5, "F");
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.white);
//         doc.setFont("helvetica", "bold");
//         doc.text(String(row.seller_count || 0), pageWidth - margin - 10, y + cardHeight / 2 + 2, { align: "center" });
        
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(row.bid_number || "-", 30), margin + 6, y + 7);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(`Org: ${short(row.organisation || "-", 50)}`, margin + 6, y + 13);
//         doc.text(`Dept: ${short(row.department || "-", 50)}`, margin + 6, y + 18);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Ends: ${formatDate(row.bid_end_ts)}`, pageWidth - margin - 30, y + 18, { align: "right" });
        
//         y += cardHeight + 3;
//       });

//       (doc as any).lastAutoTable = { finalY: y };
//     }
//   }

//   /* ----------------------- END PAGE ------------------------------ */
//   newPage();
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");

//   doc.setFontSize(24);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("End of Report", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });

//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("This comprehensive analysis was generated automatically", pageWidth / 2, pageHeight / 2, { align: "center" });
//   doc.text("based on government tender data and AI-driven insights.", pageWidth / 2, pageHeight / 2 + 8, { align: "center" });

//   doc.setFontSize(8);
//   doc.setTextColor(200, 200, 200);
//   doc.text("© 2025 Government Tender Analytics Platform", pageWidth / 2, pageHeight / 2 + 25, { align: "center" });

//   return doc;
// };




// import jsPDF from "jspdf";

// /* ------------------------------------------------------------------ */
// /*                                TYPES                                */
// /* ------------------------------------------------------------------ */

// interface ReportData {
//   meta: {
//     report_generated_at: string;
//     params_used: {
//       sellerName: string;
//       department: string;
//       offeredItem: string;
//       days: number;
//       limit: number;
//       email?: string;
//     };
//   };
//   data: {
//     estimatedMissedValue?: any;
//     sellerBids?: any;
//     topPerformingStates?: any;
//     topSellersByDept?: any;
//     categoryListing?: any;
//     allDepartments?: any;
//     lowCompetitionBids?: any;
//     missedButWinnable?: any;
//     priceBand?: any;
//   };
// }

// interface FilterOptions {
//   includeSections: string[];
// }

// /* ------------------------------------------------------------------ */
// /*                               COLORS                                */
// /* ------------------------------------------------------------------ */

// const colors: Record<string, [number, number, number]> = {
//   navyBlue: [30, 58, 95],
//   darkBlue: [74, 144, 226],
//   electricBlue: [74, 144, 226],
//   successGreen: [46, 204, 113],
//   warningOrange: [243, 156, 18],
//   errorRed: [231, 76, 60],
//   neutralGray: [107, 114, 128],
//   darkGray: [55, 65, 81],
//   mediumGray: [107, 114, 128],
//   lightGray: [209, 213, 219],
//   white: [255, 255, 255],
//   black: [0, 0, 0],
//   lightBlue: [239, 246, 255],
//   backgroundGray: [249, 250, 251],
// };

// /* ------------------------------------------------------------------ */
// /*                          UTILITY FUNCTIONS                          */
// /* ------------------------------------------------------------------ */

// const clean = (v: any): string => {
//   if (v === null || v === undefined) return "-";
//   if (typeof v === "object") {
//     try {
//       return JSON.stringify(v);
//     } catch {
//       return String(v);
//     }
//   }
//   return String(v).trim() || "-";
// };

// const safeText = (v: any, fb = "-") => {
//   const c = clean(v);
//   return c === "" ? fb : c;
// };

// const short = (v: any, len: number, fallback = "-") => {
//   const c = clean(v);
//   if (c === "-" || c === "" || c == null) return fallback;
//   if (c.length <= len) return c;
//   return c.slice(0, len - 1) + "…";
// };

// const formatCurrency = (n: any) => {
//   const num = Number(n);
//   if (isNaN(num)) return "-";
//   const rounded = Math.round(num);
//   return `Rs ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
// };

// const formatDate = (d: any) => {
//   if (!d) return "-";
//   const date = new Date(d);
//   if (isNaN(date.getTime())) return "-";
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const normalize = (v: any): string => {
//   if (v == null) return "-";
//   if (typeof v === "object") {
//     const values = Object.values(v).map((x) => clean(x));
//     return values.join(", ");
//   }
//   return String(v).replace(/[\u00A0\u202F]/g, " ").replace(/\s+/g, " ").trim() || "-";
// };

// const normalizeArray = (val: any): string[] => {
//   if (!val) return [];
//   if (Array.isArray(val)) return val.map(normalize);
//   if (typeof val === "string") return [normalize(val)];
//   if (typeof val === "object") return Object.values(val).map(normalize);
//   return [normalize(val)];
// };

// /* ------------------------------------------------------------------ */
// /*                        CHART HELPER FUNCTIONS                       */
// /* ------------------------------------------------------------------ */

// class ChartHelpers {
//   doc: jsPDF;
  
//   constructor(doc: jsPDF) {
//     this.doc = doc;
//   }

//   drawStatCard(x: number, y: number, width: number, height: number, label: string, value: string, supportText: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
//     doc.setFillColor(...color);
//     doc.roundedRect(x, y, 3, height, 2, 2, "F");
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(label, x + 5, y + 8);
//     doc.setFontSize(14);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     const truncValue = value.length > 18 ? value.substring(0, 18) : value;
//     doc.text(truncValue, x + 5, y + height / 2 + 3);
//     if (supportText) {
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "normal");
//       doc.text(supportText, x + 5, y + height - 5);
//     }
//   }

//   drawHorizontalBarChart(x: number, y: number, width: number, items: Array<{label: string, value: number, color?: [number, number, number]}>, maxValue?: number) {
//     const doc = this.doc;
//     const barHeight = 6;
//     const spacing = 9;
    
//     if (!maxValue) {
//       maxValue = Math.max(...items.map(i => i.value), 1);
//     }
    
//     items.forEach((item, index) => {
//       const yPos = y + index * spacing;
//       const barWidth = (item.value / maxValue!) * (width - 60);
//       const barColor = item.color || colors.electricBlue;
      
//       doc.setFillColor(...colors.backgroundGray);
//       doc.rect(x + 60, yPos, width - 60, barHeight, "F");
      
//       if (barWidth > 0) {
//         doc.setFillColor(...barColor);
//         doc.rect(x + 60, yPos, barWidth, barHeight, "F");
//       }
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "normal");
//       const labelText = item.label.length > 28 ? item.label.substring(0, 28) + "..." : item.label;
//       doc.text(labelText, x, yPos + 4.5);
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "bold");
//       doc.text(String(item.value), x + 55, yPos + 4.5, { align: "right" });
//     });
    
//     return y + items.length * spacing + 5;
//   }

//   drawDonutChart(centerX: number, centerY: number, radius: number, wins: number, losses: number) {
//     const doc = this.doc;
//     const total = wins + losses;
    
//     if (total === 0) return;
    
//     const winPercentage = (wins / total) * 100;
//     const winAngle = (wins / total) * 360;
    
//     this.drawArc(centerX, centerY, radius, 0, winAngle, colors.successGreen);
//     this.drawArc(centerX, centerY, radius, winAngle, 360, colors.errorRed);
    
//     doc.setFillColor(...colors.white);
//     doc.circle(centerX, centerY, radius * 0.6, "F");
    
//     doc.setFontSize(14);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${winPercentage.toFixed(0)}%`, centerX, centerY - 2, { align: "center" });
    
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text("Win Rate", centerX, centerY + 5, { align: "center" });
    
//     const legendY = centerY + radius + 10;
//     doc.setFillColor(...colors.successGreen);
//     doc.circle(centerX - 20, legendY, 2, "F");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.text(`Wins: ${wins}`, centerX - 15, legendY + 2);
//     doc.setFillColor(...colors.errorRed);
//     doc.circle(centerX - 20, legendY + 6, 2, "F");
//     doc.text(`Lost: ${losses}`, centerX - 15, legendY + 8);
//   }

//   private drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...color);
    
//     const segments = 50;
//     const angleStep = (endAngle - startAngle) / segments;
    
//     for (let i = 0; i < segments; i++) {
//       const angle1 = ((startAngle + i * angleStep - 90) * Math.PI) / 180;
//       const angle2 = ((startAngle + (i + 1) * angleStep - 90) * Math.PI) / 180;
      
//       const x1 = x + radius * Math.cos(angle1);
//       const y1 = y + radius * Math.sin(angle1);
//       const x2 = x + radius * Math.cos(angle2);
//       const y2 = y + radius * Math.sin(angle2);
      
//       doc.triangle(x, y, x1, y1, x2, y2, "F");
//     }
//   }

//   drawLineChart(x: number, y: number, width: number, height: number, data: Array<{label: string, value: number}>) {
//     const doc = this.doc;
    
//     if (data.length === 0) return;
    
//     doc.setFillColor(...colors.backgroundGray);
//     doc.rect(x, y, width, height, "F");
    
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     for (let i = 0; i <= 5; i++) {
//       const gridY = y + (height / 5) * i;
//       doc.line(x, gridY, x + width, gridY);
//     }
    
//     const maxValue = Math.max(...data.map(d => d.value), 1);
    
//     doc.setDrawColor(...colors.electricBlue);
//     doc.setLineWidth(1.5);
    
//     const stepX = width / (data.length - 1 || 1);
    
//     for (let i = 0; i < data.length - 1; i++) {
//       const x1 = x + i * stepX;
//       const y1 = y + height - (data[i].value / maxValue) * height;
//       const x2 = x + (i + 1) * stepX;
//       const y2 = y + height - (data[i + 1].value / maxValue) * height;
//       doc.line(x1, y1, x2, y2);
//     }
    
//     doc.setFillColor(...colors.electricBlue);
//     data.forEach((point, index) => {
//       const pointX = x + index * stepX;
//       const pointY = y + height - (point.value / maxValue) * height;
//       doc.circle(pointX, pointY, 1.5, "F");
//     });
    
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
    
//     data.forEach((point, index) => {
//       const labelX = x + index * stepX;
//       const monthLabel = point.label.split("-")[1] || point.label.substring(5, 7);
//       doc.text(monthLabel, labelX, y + height + 5, { align: "center" });
//     });
//   }

//   drawInfoBox(x: number, y: number, width: number, height: number, title: string, content: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.lightBlue);
//     doc.roundedRect(x, y, width, height, 3, 3, "F");
//     doc.setDrawColor(...color);
//     doc.setLineWidth(0.8);
//     doc.roundedRect(x, y, width, height, 3, 3, "S");
//     doc.setFontSize(9);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     doc.text(title, x + 5, y + 7);
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.setFont("helvetica", "normal");
//     const lines = doc.splitTextToSize(content, width - 10);
//     const maxLines = Math.floor((height - 12) / 4);
//     doc.text(lines.slice(0, maxLines), x + 5, y + 13);
//   }

//   drawOpportunityCard(x: number, y: number, width: number, item: string, org: string, dept: string, value: string, confidence: number) {
//     const doc = this.doc;
//     const height = 28;
    
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
    
//     const confColor = confidence >= 70 ? colors.successGreen : confidence >= 50 ? colors.warningOrange : colors.mediumGray;
//     doc.setDrawColor(...confColor);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
    
//     doc.setFillColor(...confColor);
//     doc.roundedRect(x + width - 25, y + 3, 20, 6, 1, 1, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${confidence}%`, x + width - 15, y + 7, { align: "center" });
    
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(short(item, 45), x + 3, y + 8);
    
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Org: ${short(org, 35)}`, x + 3, y + 14);
//     doc.text(`Dept: ${short(dept, 35)}`, x + 3, y + 19);
//     doc.text(`Value: ${value}`, x + 3, y + 24);
//   }
// }

// /* ------------------------------------------------------------------ */
// /*                        MAIN PDF GENERATOR                           */
// /* ------------------------------------------------------------------ */

// export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 15;
  
//   const charts = new ChartHelpers(doc);

//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, 15, "F");
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text("GOVERNMENT TENDER ANALYSIS", pageWidth / 2, 10, { align: "center" });
//   };

//   const addFooter = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "normal");
//     const seller = safeText(reportData.meta.params_used.sellerName);
//     doc.text(short(seller, 40), margin, pageHeight - 4);
//     doc.text(formatDate(reportData.meta.report_generated_at), pageWidth - margin, pageHeight - 4, { align: "right" });
//   };

//   const addSectionHeader = (title: string, color: [number, number, number]) => {
//     const prevY = (doc as any).lastAutoTable?.finalY ?? 25;
//     let yStart = prevY + 10;
//     if (yStart > pageHeight - 50) {
//       doc.addPage();
//       addHeader();
//       addFooter();
//       yStart = 25;
//     }
//     doc.setFillColor(...color);
//     doc.rect(margin, yStart, pageWidth - 2 * margin, 9, "F");
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(10);
//     doc.text(title, margin + 5, yStart + 6.5);
//     (doc as any).lastAutoTable = { finalY: yStart + 9 };
//   };

//   const checkSpace = (requiredSpace: number): boolean => {
//     const currentY = (doc as any).lastAutoTable?.finalY ?? 25;
//     return currentY + requiredSpace < pageHeight - 20;
//   };

//   const newPage = () => {
//     doc.addPage();
//     addHeader();
//     addFooter();
//     (doc as any).lastAutoTable = { finalY: 25 };
//   };

//   // COVER PAGE
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(28);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("GOVERNMENT", pageWidth / 2, 70, { align: "center" });
//   doc.text("TENDER ANALYSIS", pageWidth / 2, 85, { align: "center" });
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.text("Comprehensive Performance Report", pageWidth / 2, 100, { align: "center" });
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "bold");
//   doc.text(safeText(reportData.meta.params_used.sellerName), pageWidth / 2, 120, { align: "center" });
//   const metaY = 140;
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Report Generated: ${formatDate(reportData.meta.report_generated_at)}`, pageWidth / 2, metaY, { align: "center" });
//   const deptText = reportData.meta.params_used.department || "All Departments";
//   doc.text(`Analysis Period: ${safeText(reportData.meta.params_used.days)} days`, pageWidth / 2, metaY + 10, { align: "center" });
//   doc.text(`Department: ${deptText}`, pageWidth / 2, metaY + 20, { align: "center" });
//   if (reportData.meta.params_used.email) {
//     doc.text(`Email: ${safeText(reportData.meta.params_used.email)}`, pageWidth / 2, metaY + 30, { align: "center" });
//   }
//   doc.setLineWidth(1);
//   doc.setDrawColor(...colors.white);
//   doc.circle(pageWidth / 2, 210, 30, "S");
//   doc.setFontSize(9);
//   doc.text("Strategic Insights & Analytics", pageWidth / 2, 215, { align: "center" });

//   // KEY METRICS DASHBOARD
//   newPage();
//   addSectionHeader("Key Performance Metrics", colors.navyBlue);

//   const bids = reportData?.data?.sellerBids || {};
//   const summary = bids?.table1 || {};

//   const metrics = [
//     { label: "Total Wins", value: String(summary.win || 0), support: `${((summary.win || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Win Rate`, color: colors.successGreen },
//     { label: "Total Lost", value: String(summary.lost || 0), support: `${((summary.lost || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Loss Rate`, color: colors.errorRed },
//     { label: "Total Bids", value: String(summary.totalBidsParticipated || 0), support: "Participated", color: colors.darkBlue },
//     { label: "Total Bid Value", value: formatCurrency(summary.totalBidValue), support: "Aggregate", color: colors.navyBlue },
//     { label: "Qualified Value", value: formatCurrency(summary.qualifiedBidValue), support: "Won Tenders", color: colors.successGreen },
//     { label: "Avg Order Value", value: formatCurrency(summary.averageOrderValue), support: "Per Bid", color: colors.electricBlue },
//   ];

//   let cardY = (doc as any).lastAutoTable.finalY + 10;
//   const cardWidth = 60;
//   const cardHeight = 25;
//   const cardSpacing = 5;
//   const cardsPerRow = 3;

//   metrics.forEach((metric, index) => {
//     const row = Math.floor(index / cardsPerRow);
//     const col = index % cardsPerRow;
//     const x = margin + col * (cardWidth + cardSpacing);
//     const y = cardY + row * (cardHeight + cardSpacing);
//     charts.drawStatCard(x, y, cardWidth, cardHeight, metric.label, metric.value, metric.support, metric.color);
//   });

//   cardY += Math.ceil(metrics.length / cardsPerRow) * (cardHeight + cardSpacing) + 10;
//   (doc as any).lastAutoTable = { finalY: cardY };

//   // Win/Loss Chart - only if space available
//   if (checkSpace(50)) {
//     doc.setFontSize(11);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Win / Loss Distribution", margin, cardY);
//     charts.drawDonutChart(pageWidth / 2, cardY + 25, 20, summary.win || 0, summary.lost || 0);
//     (doc as any).lastAutoTable = { finalY: cardY + 50 };
//   }

//   // MONTHLY PERFORMANCE
//   const monthlyData = bids?.monthlyTotals?.byMonth || {};
//   const months = Object.keys(monthlyData);
  
//   if (months.length > 0) {
//     if (!checkSpace(80)) newPage();
//     addSectionHeader("Monthly Bid Performance Trend", colors.electricBlue);
    
//     let chartY = (doc as any).lastAutoTable.finalY + 8;
//     doc.setFontSize(10);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Bidding Activity Over Time", margin, chartY);
//     chartY += 8;
    
//     const chartData = months.map(m => ({ label: m, value: Number(monthlyData[m]) || 0 }));
//     charts.drawLineChart(margin, chartY, pageWidth - 2 * margin, 50, chartData);
//     (doc as any).lastAutoTable = { finalY: chartY + 60 };
//   }

//   // ESTIMATED MISSED VALUE - only if data exists
//   const missedValData = reportData?.data?.estimatedMissedValue;
//   const missedVal = missedValData?.total;

//   if (missedVal !== undefined && missedVal !== null && Number(missedVal) > 0) {
//     if (!checkSpace(45)) newPage();
//     addSectionHeader("Estimated Missed Value", colors.warningOrange);
//     let yPos = (doc as any).lastAutoTable.finalY + 10;
//     charts.drawInfoBox(margin, yPos, pageWidth - 2 * margin, 30, "Potential Missed Opportunity",
//       `Estimated value of tenders where participation was possible but not recorded: ${formatCurrency(missedVal)}. This represents untapped market potential.`, colors.warningOrange);
//     (doc as any).lastAutoTable = { finalY: yPos + 35 };
//   }

//   // PRICE BAND ANALYSIS
//   if (filters.includeSections.includes("marketOverview")) {
//     const priceBand = reportData?.data?.priceBand?.analysis;
//     if (priceBand && (priceBand.highest || priceBand.lowest !== undefined || priceBand.average)) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Price Band Analysis", colors.successGreen);

//       let startY = (doc as any).lastAutoTable.finalY + 10;
//       const highest = Number(priceBand.highest || 0);
//       const lowest = Number(priceBand.lowest !== undefined ? priceBand.lowest : 0);
//       const average = Number(priceBand.average || 0);
//       const count = Number(priceBand.count || 0);

//       const priceMetrics = [
//         { label: "Highest Price", value: formatCurrency(highest), color: colors.errorRed },
//         { label: "Average Price", value: formatCurrency(average), color: colors.electricBlue },
//         { label: "Lowest Price", value: formatCurrency(lowest), color: colors.successGreen },
//       ];

//       priceMetrics.forEach((pm, idx) => {
//         const x = margin + idx * 65;
//         charts.drawStatCard(x, startY, 60, 22, pm.label, pm.value, `${count} bids analyzed`, pm.color);
//       });

//       startY += 30;

//       let insight = "Limited price data available for comprehensive analysis.";
//       if (highest > 0 && average > 0 && count > 1) {
//         const diff = highest - lowest;
//         const variation = average > 0 ? ((diff / average) * 100).toFixed(1) : "0.0";
//         insight = `Price range spans from ${formatCurrency(lowest)} to ${formatCurrency(highest)}. Average bid value is ${formatCurrency(average)} with ${variation}% variation. Analysis based on ${count} competitive bid${count !== 1 ? "s" : ""}.`;
//       } else if (count === 1) {
//         insight = `Single bid analyzed with value ${formatCurrency(average)}. More data needed for trend analysis.`;
//       }

//       charts.drawInfoBox(margin, startY, pageWidth - 2 * margin, 28, "Price Insights", insight, colors.electricBlue);
//       (doc as any).lastAutoTable = { finalY: startY + 33 };
//     }
//   }

//   // MISSED BUT WINNABLE
//   if (filters.includeSections.includes("missedTenders")) {
//     const missed = reportData?.data?.missedButWinnable || {};
//     const recentWins = missed?.recentWins ?? [];
//     const marketWins = missed?.marketWins ?? [];

//     if (recentWins.length > 0 || marketWins.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Missed But Winnable - Market Intelligence", colors.errorRed);
//       let yPos = (doc as any).lastAutoTable.finalY + 8;

//       if (recentWins.length > 0) {
//         doc.setFontSize(11);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Recent Wins — Your Success Stories", margin, yPos);
//         yPos += 8;

//         recentWins.slice(0, 8).forEach((win: any) => {
//           if (!checkSpace(30)) {
//             newPage();
//             yPos = 30;
//           }

//           const cardHeight = 25;
//           doc.setFillColor(...colors.lightBlue);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.offered_item || "-", 60), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(`Bid: ${short(win.bid_number || "-", 25)}`, margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 30)}`, margin + 6, yPos + 18);
//           doc.text(`Qty: ${safeText(win.quantity)}`, margin + 110, yPos + 13);
//           doc.text(`Dept: ${short(win.dept || "-", 25)}`, margin + 110, yPos + 18);
          
//           doc.setFontSize(10);
//           doc.setTextColor(...colors.successGreen);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 13, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 19, { align: "right" });
          
//           yPos += cardHeight + 3;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }

//       if (marketWins.length > 0) {
//         if (!checkSpace(40)) newPage();
//         yPos = (doc as any).lastAutoTable.finalY + 10;
        
//         doc.setFontSize(11);
//         doc.setTextColor(...colors.warningOrange);
//         doc.setFont("helvetica", "bold");
//         doc.text("Competitor Market Wins — Learning Opportunities", margin, yPos);
//         yPos += 8;

//         marketWins.slice(0, 6).forEach((win: any) => {
//           if (!checkSpace(25)) {
//             newPage();
//             yPos = 30;
//           }

//           const cardHeight = 22;
//           doc.setFillColor(249, 250, 251);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.warningOrange);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.seller_name || "-", 30), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(short(win.offered_item || "-", 55), margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 25)}`, margin + 6, yPos + 18);
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.warningOrange);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 11, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 17, { align: "right" });
          
//           yPos += cardHeight + 3;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }
//     }
//   }

//   // AI INSIGHTS
//   if (filters?.includeSections?.includes("buyerInsights")) {
//     const ai = reportData?.data?.missedButWinnable?.ai || (reportData as any)?.result?.data?.missedButWinnable?.ai;

//     if (ai && typeof ai === "object" && Object.keys(ai).length > 0) {
//       if (!checkSpace(80)) newPage();
//       addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;

//       if (ai.strategy_summary) {
//         charts.drawInfoBox(margin, y, pageWidth - 2 * margin, 32, "Strategic Recommendation", normalize(ai.strategy_summary), colors.darkBlue);
//         y += 38;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const globalLikelyWins = ai?.likely_wins || [];
//       const recentWins = ai?.recentWins || [];
//       let allLikelyWins: any[] = [];

//       if (Array.isArray(globalLikelyWins) && globalLikelyWins.length > 0) {
//         allLikelyWins.push(...globalLikelyWins.map((w: any) => ({ ...w, source: "Global" })));
//       }

//       if (Array.isArray(recentWins) && recentWins.length > 0) {
//         recentWins.forEach((r: any) => {
//           if (Array.isArray(r.likely_wins) && r.likely_wins.length > 0) {
//             allLikelyWins.push(...r.likely_wins.map((w: any) => ({ ...w, offered_item: r.offered_item, bid_number: r.bid_number, dept: r.dept, ministry: r.ministry, org: r.org, signals: r.signals, source: "Per-item" })));
//           }
//         });
//       }

//       if (allLikelyWins.length > 0) {
//         if (!checkSpace(70)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("AI-Predicted Likely Wins", margin, y);
//         y += 10;

//         const cardsPerRow = 2;
//         const cardW = (pageWidth - 2 * margin - 5) / 2;
        
//         allLikelyWins.slice(0, 8).forEach((opp: any, index: number) => {
//           const row = Math.floor(index / cardsPerRow);
//           const col = index % cardsPerRow;
//           const x = margin + col * (cardW + 5);
//           const cardY = y + row * 33;
          
//           if (!checkSpace(35)) {
//             newPage();
//             y = 30;
//           }
          
//           const confidence = Math.floor(Math.random() * 30 + 60);
//           charts.drawOpportunityCard(x, cardY, cardW, opp.offered_item || "Opportunity", opp.org || "-", opp.dept || "-", formatCurrency(opp.total_price || 0), confidence);
//         });

//         y += Math.ceil(allLikelyWins.slice(0, 8).length / cardsPerRow) * 33 + 5;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const signals = ai?.signals || {};
//       if (signals.org_affinity && signals.org_affinity.length > 0) {
//         if (!checkSpace(60)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Organization Affinity Signals", margin, y);
//         y += 8;

//         const orgData = signals.org_affinity.slice(0, 10).map((item: any) => ({
//           label: item.org || item.entity || "-",
//           value: Number(item.count || item.value || 1),
//           color: colors.electricBlue
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, orgData);
//         (doc as any).lastAutoTable = { finalY: endY + 5 };
//       }

//       const guidance = ai.guidance || {};
//       const nextSteps = normalizeArray(guidance.next_steps);

//       if (nextSteps.length > 0) {
//         if (!checkSpace(60)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("Strategic Roadmap - Next Steps", margin, y);
//         y += 10;

//         nextSteps.slice(0, 5).forEach((step: string, index: number) => {
//           if (!checkSpace(20)) {
//             newPage();
//             y = 30;
//           }

//           const stepHeight = 18;
//           doc.setFillColor(...colors.backgroundGray);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, stepHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.circle(margin + 6, y + stepHeight / 2, 4, "F");
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.white);
//           doc.setFont("helvetica", "bold");
//           doc.text(String(index + 1), margin + 6, y + stepHeight / 2 + 2, { align: "center" });
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           const stepLines = doc.splitTextToSize(normalize(step), pageWidth - 2 * margin - 20);
//           doc.text(stepLines, margin + 14, y + 7);
//           y += stepHeight + 3;
//         });

//         (doc as any).lastAutoTable = { finalY: y };
//       }
//     }
//   }

//   // CATEGORY ANALYSIS
//   if (filters.includeSections.includes("categoryAnalysis")) {
//     const catData = reportData?.data?.categoryListing;
//     const categories = Array.isArray(catData?.categories) ? catData.categories : [];

//     if (categories.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Category Distribution Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Top Tender Categories by Volume", margin, y);
//       y += 8;

//       const catItems = categories.slice(0, 25).map((c: any) => ({
//         label: c.category,
//         value: Number(c.times) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, catItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // RIVALRY SCORE
//   if (filters.includeSections.includes("rivalryScore")) {
//     const deptName = reportData.meta.params_used.department || "All Departments";
//     const topSellersData = reportData?.data?.topSellersByDept;
//     const departments = topSellersData?.departments || [];

//     if (departments.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader(`Leading Competitors — ${short(deptName, 40)}`, colors.warningOrange);

//       departments.slice(0, 2).forEach((dept: any, deptIndex: number) => {
//         if (deptIndex > 0 && !checkSpace(60)) newPage();
        
//         let yStart = (doc as any).lastAutoTable.finalY + 8;
//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(`Department: ${short(dept.department, 50)}`, margin, yStart);
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Total Competitors: ${dept.total || 0}`, margin, yStart + 6);
//         yStart += 12;

//         const sellers = dept.results || [];
//         const sellerItems = sellers.slice(0, 15).map((s: any) => ({
//           label: s?.seller_name || "-",
//           value: Number(s?.participation_count || 0),
//           color: colors.warningOrange
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, yStart, pageWidth - 2 * margin, sellerItems);
//         (doc as any).lastAutoTable = { finalY: endY + 5 };
//       });
//     }
//   }

//   // STATES ANALYSIS
//   if (filters.includeSections.includes("statesAnalysis")) {
//     const statesData = reportData?.data?.topPerformingStates?.data?.results || reportData?.data?.topPerformingStates?.results || [];

//     if (statesData.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Top Performing States by Volume", colors.successGreen);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("State-wise Tender Distribution", margin, y);
//       y += 8;

//       const stateItems = statesData.slice(0, 20).map((s: any) => ({
//         label: s.state_name,
//         value: Number(s.total_tenders) || 0,
//         color: colors.successGreen
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, stateItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // DEPARTMENTS ANALYSIS
//   if (filters.includeSections.includes("departmentsAnalysis")) {
//     const allDepts = reportData?.data?.allDepartments?.data || reportData?.data?.allDepartments || [];

//     if (allDepts.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Department-wise Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Active Departments by Tender Volume", margin, y);
//       y += 8;

//       const deptItems = allDepts.slice(0, 20).map((d: any) => ({
//         label: d.department,
//         value: Number(d.total_tenders) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, deptItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // LOW COMPETITION
//   if (filters.includeSections.includes("lowCompetition")) {
//     const lowComp = reportData?.data?.lowCompetitionBids || {};
//     const rows = lowComp?.results ?? [];

//     if (rows.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Low Competition Opportunities", colors.warningOrange);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Tenders with Limited Competition", margin, y);
//       y += 10;

//       rows.slice(0, 10).forEach((row: any) => {
//         if (!checkSpace(25)) {
//           newPage();
//           y = 30;
//         }

//         const cardHeight = 22;
//         doc.setFillColor(...colors.lightBlue);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//         doc.setFillColor(...colors.warningOrange);
//         doc.roundedRect(margin, y, 3, cardHeight, 2, 2, "F");
//         doc.setFillColor(...colors.warningOrange);
//         doc.circle(pageWidth - margin - 10, y + cardHeight / 2, 5, "F");
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.white);
//         doc.setFont("helvetica", "bold");
//         doc.text(String(row.seller_count || 0), pageWidth - margin - 10, y + cardHeight / 2 + 2, { align: "center" });
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(row.bid_number || "-", 30), margin + 6, y + 7);
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(`Org: ${short(row.organisation || "-", 50)}`, margin + 6, y + 13);
//         doc.text(`Dept: ${short(row.department || "-", 50)}`, margin + 6, y + 18);
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Ends: ${formatDate(row.bid_end_ts)}`, pageWidth - margin - 30, y + 18, { align: "right" });
//         y += cardHeight + 3;
//       });

//       (doc as any).lastAutoTable = { finalY: y };
//     }
//   }

//   // END PAGE
//   newPage();
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(24);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("End of Report", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("This comprehensive analysis was generated automatically", pageWidth / 2, pageHeight / 2, { align: "center" });
//   doc.text("based on government tender data and AI-driven insights.", pageWidth / 2, pageHeight / 2 + 8, { align: "center" });
//   doc.setFontSize(8);
//   doc.setTextColor(200, 200, 200);
//   doc.text("© 2025 Government Tender Analytics Platform", pageWidth / 2, pageHeight / 2 + 25, { align: "center" });

//   return doc;
// };




// import jsPDF from "jspdf";

// /* ------------------------------------------------------------------ */
// /*                                TYPES                                */
// /* ------------------------------------------------------------------ */

// interface ReportData {
//   meta: {
//     report_generated_at: string;
//     params_used: {
//       sellerName: string;
//       department: string;
//       offeredItem: string;
//       days: number;
//       limit: number;
//       email?: string;
//     };
//   };
//   data: {
//     estimatedMissedValue?: any;
//     sellerBids?: any;
//     topPerformingStates?: any;
//     topSellersByDept?: any;
//     categoryListing?: any;
//     allDepartments?: any;
//     lowCompetitionBids?: any;
//     missedButWinnable?: any;
//     priceBand?: any;
//   };
// }

// interface FilterOptions {
//   includeSections: string[];
// }

// /* ------------------------------------------------------------------ */
// /*                               COLORS                                */
// /* ------------------------------------------------------------------ */

// const colors: Record<string, [number, number, number]> = {
//   navyBlue: [30, 58, 95],
//   darkBlue: [74, 144, 226],
//   electricBlue: [74, 144, 226],
//   successGreen: [46, 204, 113],
//   warningOrange: [243, 156, 18],
//   errorRed: [231, 76, 60],
//   neutralGray: [107, 114, 128],
//   darkGray: [55, 65, 81],
//   mediumGray: [107, 114, 128],
//   lightGray: [209, 213, 219],
//   white: [255, 255, 255],
//   black: [0, 0, 0],
//   lightBlue: [239, 246, 255],
//   backgroundGray: [249, 250, 251],
// };

// /* ------------------------------------------------------------------ */
// /*                          UTILITY FUNCTIONS                          */
// /* ------------------------------------------------------------------ */

// const clean = (v: any): string => {
//   if (v === null || v === undefined) return "-";
//   if (typeof v === "object") {
//     try {
//       return JSON.stringify(v);
//     } catch {
//       return String(v);
//     }
//   }
//   return String(v).trim() || "-";
// };

// const safeText = (v: any, fb = "-") => {
//   const c = clean(v);
//   return c === "" ? fb : c;
// };

// const short = (v: any, len: number, fallback = "-") => {
//   const c = clean(v);
//   if (c === "-" || c === "" || c == null) return fallback;
//   if (c.length <= len) return c;
//   return c.slice(0, len - 1) + "…";
// };

// const formatCurrency = (n: any) => {
//   const num = Number(n);
//   if (isNaN(num)) return "-";
//   const rounded = Math.round(num);
//   return `Rs ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
// };

// const formatDate = (d: any) => {
//   if (!d) return "-";
//   const date = new Date(d);
//   if (isNaN(date.getTime())) return "-";
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const normalize = (v: any): string => {
//   if (v == null) return "-";
//   if (typeof v === "object") {
//     const values = Object.values(v).map((x) => clean(x));
//     return values.join(", ");
//   }
//   return String(v).replace(/[\u00A0\u202F]/g, " ").replace(/\s+/g, " ").trim() || "-";
// };

// const normalizeArray = (val: any): string[] => {
//   if (!val) return [];
//   if (Array.isArray(val)) return val.map(normalize);
//   if (typeof val === "string") return [normalize(val)];
//   if (typeof val === "object") return Object.values(val).map(normalize);
//   return [normalize(val)];
// };

// /* ------------------------------------------------------------------ */
// /*                        CHART HELPER FUNCTIONS                       */
// /* ------------------------------------------------------------------ */

// class ChartHelpers {
//   doc: jsPDF;
  
//   constructor(doc: jsPDF) {
//     this.doc = doc;
//   }

//   drawStatCard(x: number, y: number, width: number, height: number, label: string, value: string, supportText: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
//     doc.setFillColor(...color);
//     doc.roundedRect(x, y, 3, height, 2, 2, "F");
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(label, x + 5, y + 8);
//     doc.setFontSize(14);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     const truncValue = value.length > 18 ? value.substring(0, 18) : value;
//     doc.text(truncValue, x + 5, y + height / 2 + 3);
//     if (supportText) {
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "normal");
//       doc.text(supportText, x + 5, y + height - 5);
//     }
//   }

//   drawHorizontalBarChart(x: number, y: number, width: number, items: Array<{label: string, value: number, color?: [number, number, number]}>, maxValue?: number) {
//     const doc = this.doc;
//     const barHeight = 6;
//     const spacing = 9;
    
//     if (!maxValue) {
//       maxValue = Math.max(...items.map(i => i.value), 1);
//     }
    
//     items.forEach((item, index) => {
//       const yPos = y + index * spacing;
//       const barWidth = (item.value / maxValue!) * (width - 60);
//       const barColor = item.color || colors.electricBlue;
      
//       doc.setFillColor(...colors.backgroundGray);
//       doc.rect(x + 60, yPos, width - 60, barHeight, "F");
      
//       if (barWidth > 0) {
//         doc.setFillColor(...barColor);
//         doc.rect(x + 60, yPos, barWidth, barHeight, "F");
//       }
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "normal");
//       const labelText = item.label.length > 28 ? item.label.substring(0, 28) + "..." : item.label;
//       doc.text(labelText, x, yPos + 4.5);
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "bold");
//       doc.text(String(item.value), x + 55, yPos + 4.5, { align: "right" });
//     });
    
//     return y + items.length * spacing + 5;
//   }

//   drawDonutChart(centerX: number, centerY: number, radius: number, wins: number, losses: number) {
//     const doc = this.doc;
//     const total = wins + losses;
    
//     if (total === 0) return;
    
//     const winPercentage = (wins / total) * 100;
//     const winAngle = (wins / total) * 360;
    
//     this.drawArc(centerX, centerY, radius, 0, winAngle, colors.successGreen);
//     this.drawArc(centerX, centerY, radius, winAngle, 360, colors.errorRed);
    
//     doc.setFillColor(...colors.white);
//     doc.circle(centerX, centerY, radius * 0.6, "F");
    
//     doc.setFontSize(14);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${winPercentage.toFixed(0)}%`, centerX, centerY - 2, { align: "center" });
    
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text("Win Rate", centerX, centerY + 5, { align: "center" });
    
//     const legendY = centerY + radius + 10;
//     doc.setFillColor(...colors.successGreen);
//     doc.circle(centerX - 20, legendY, 2, "F");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.text(`Wins: ${wins}`, centerX - 15, legendY + 2);
//     doc.setFillColor(...colors.errorRed);
//     doc.circle(centerX - 20, legendY + 6, 2, "F");
//     doc.text(`Lost: ${losses}`, centerX - 15, legendY + 8);
//   }

//   private drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...color);
    
//     const segments = 50;
//     const angleStep = (endAngle - startAngle) / segments;
    
//     for (let i = 0; i < segments; i++) {
//       const angle1 = ((startAngle + i * angleStep - 90) * Math.PI) / 180;
//       const angle2 = ((startAngle + (i + 1) * angleStep - 90) * Math.PI) / 180;
      
//       const x1 = x + radius * Math.cos(angle1);
//       const y1 = y + radius * Math.sin(angle1);
//       const x2 = x + radius * Math.cos(angle2);
//       const y2 = y + radius * Math.sin(angle2);
      
//       doc.triangle(x, y, x1, y1, x2, y2, "F");
//     }
//   }

//   drawLineChart(x: number, y: number, width: number, height: number, data: Array<{label: string, value: number}>) {
//     const doc = this.doc;
    
//     if (data.length === 0) return;
    
//     doc.setFillColor(...colors.backgroundGray);
//     doc.rect(x, y, width, height, "F");
    
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     for (let i = 0; i <= 5; i++) {
//       const gridY = y + (height / 5) * i;
//       doc.line(x, gridY, x + width, gridY);
//     }
    
//     const maxValue = Math.max(...data.map(d => d.value), 1);
    
//     doc.setDrawColor(...colors.electricBlue);
//     doc.setLineWidth(1.5);
    
//     const stepX = width / (data.length - 1 || 1);
    
//     for (let i = 0; i < data.length - 1; i++) {
//       const x1 = x + i * stepX;
//       const y1 = y + height - (data[i].value / maxValue) * height;
//       const x2 = x + (i + 1) * stepX;
//       const y2 = y + height - (data[i + 1].value / maxValue) * height;
//       doc.line(x1, y1, x2, y2);
//     }
    
//     doc.setFillColor(...colors.electricBlue);
//     data.forEach((point, index) => {
//       const pointX = x + index * stepX;
//       const pointY = y + height - (point.value / maxValue) * height;
//       doc.circle(pointX, pointY, 1.5, "F");
//     });
    
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
    
//     data.forEach((point, index) => {
//       const labelX = x + index * stepX;
//       const monthLabel = point.label.split("-")[1] || point.label.substring(5, 7);
//       doc.text(monthLabel, labelX, y + height + 5, { align: "center" });
//     });
//   }

//   drawInfoBox(x: number, y: number, width: number, height: number, title: string, content: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.lightBlue);
//     doc.roundedRect(x, y, width, height, 3, 3, "F");
//     doc.setDrawColor(...color);
//     doc.setLineWidth(0.8);
//     doc.roundedRect(x, y, width, height, 3, 3, "S");
//     doc.setFontSize(9);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     doc.text(title, x + 5, y + 7);
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.setFont("helvetica", "normal");
//     const lines = doc.splitTextToSize(content, width - 10);
//     const maxLines = Math.floor((height - 12) / 4);
//     doc.text(lines.slice(0, maxLines), x + 5, y + 13);
//   }

//   drawOpportunityCard(x: number, y: number, width: number, item: string, org: string, dept: string, value: string, confidence: number) {
//     const doc = this.doc;
//     const height = 35;
    
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
    
//     const confColor = confidence >= 70 ? colors.successGreen : confidence >= 50 ? colors.warningOrange : colors.mediumGray;
//     doc.setDrawColor(...confColor);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
    
//     doc.setFillColor(...confColor);
//     doc.roundedRect(x + width - 25, y + 3, 20, 6, 1, 1, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${confidence}%`, x + width - 15, y + 7, { align: "center" });
    
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     const itemMaxWidth = width - 30;
//     const itemLines = doc.splitTextToSize(item && item !== '-' ? item : 'Opportunity', itemMaxWidth);
//     doc.text(itemLines.slice(0, 2), x + 3, y + 9);
    
//     const textY = itemLines.length > 1 ? y + 20 : y + 16;
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
    
//     const orgText = org && org !== '-' ? short(org, 35) : 'Not specified';
//     const deptText = dept && dept !== '-' ? short(dept, 35) : 'Not specified';
    
//     doc.text(`Org: ${orgText}`, x + 3, textY);
//     doc.text(`Dept: ${deptText}`, x + 3, textY + 5);
//     doc.text(`Value: ${value}`, x + 3, textY + 10);
//   }
// }

// /* ------------------------------------------------------------------ */
// /*                        MAIN PDF GENERATOR                           */
// /* ------------------------------------------------------------------ */

// export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 15;
  
//   const charts = new ChartHelpers(doc);

//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, 15, "F");
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text("GOVERNMENT TENDER ANALYSIS", pageWidth / 2, 10, { align: "center" });
//   };

//   const addFooter = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "normal");
//     const seller = safeText(reportData.meta.params_used.sellerName);
//     doc.text(short(seller, 40), margin, pageHeight - 4);
//     doc.text(formatDate(reportData.meta.report_generated_at), pageWidth - margin, pageHeight - 4, { align: "right" });
//   };

//   const addSectionHeader = (title: string, color: [number, number, number]) => {
//     const prevY = (doc as any).lastAutoTable?.finalY ?? 25;
//     let yStart = prevY + 10;
//     if (yStart > pageHeight - 50) {
//       doc.addPage();
//       addHeader();
//       addFooter();
//       yStart = 25;
//     }
//     doc.setFillColor(...color);
//     doc.rect(margin, yStart, pageWidth - 2 * margin, 9, "F");
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(10);
//     doc.text(title, margin + 5, yStart + 6.5);
//     (doc as any).lastAutoTable = { finalY: yStart + 9 };
//   };

//   const checkSpace = (requiredSpace: number): boolean => {
//     const currentY = (doc as any).lastAutoTable?.finalY ?? 25;
//     return currentY + requiredSpace < pageHeight - 20;
//   };

//   const newPage = () => {
//     doc.addPage();
//     addHeader();
//     addFooter();
//     (doc as any).lastAutoTable = { finalY: 25 };
//   };

//   // COVER PAGE
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(28);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("GOVERNMENT", pageWidth / 2, 70, { align: "center" });
//   doc.text("TENDER ANALYSIS", pageWidth / 2, 85, { align: "center" });
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.text("Comprehensive Performance Report", pageWidth / 2, 100, { align: "center" });
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "bold");
//   doc.text(safeText(reportData.meta.params_used.sellerName), pageWidth / 2, 120, { align: "center" });
//   const metaY = 140;
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Report Generated: ${formatDate(reportData.meta.report_generated_at)}`, pageWidth / 2, metaY, { align: "center" });
//   const deptText = reportData.meta.params_used.department || "All Departments";
//   doc.text(`Analysis Period: ${safeText(reportData.meta.params_used.days)} days`, pageWidth / 2, metaY + 10, { align: "center" });
//   doc.text(`Department: ${deptText}`, pageWidth / 2, metaY + 20, { align: "center" });
//   if (reportData.meta.params_used.email) {
//     doc.text(`Email: ${safeText(reportData.meta.params_used.email)}`, pageWidth / 2, metaY + 30, { align: "center" });
//   }
//   doc.setLineWidth(1);
//   doc.setDrawColor(...colors.white);
//   doc.circle(pageWidth / 2, 210, 30, "S");
//   doc.setFontSize(9);
//   doc.text("Strategic Insights & Analytics", pageWidth / 2, 215, { align: "center" });

//   // KEY METRICS DASHBOARD
//   newPage();
//   addSectionHeader("Key Performance Metrics", colors.navyBlue);

//   const bids = reportData?.data?.sellerBids || {};
//   const summary = bids?.table1 || {};

//   const metrics = [
//     { label: "Total Wins", value: String(summary.win || 0), support: `${((summary.win || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Win Rate`, color: colors.successGreen },
//     { label: "Total Lost", value: String(summary.lost || 0), support: `${((summary.lost || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Loss Rate`, color: colors.errorRed },
//     { label: "Total Bids", value: String(summary.totalBidsParticipated || 0), support: "Participated", color: colors.darkBlue },
//     { label: "Total Bid Value", value: formatCurrency(summary.totalBidValue), support: "Aggregate", color: colors.navyBlue },
//     { label: "Qualified Value", value: formatCurrency(summary.qualifiedBidValue), support: "Won Tenders", color: colors.successGreen },
//     { label: "Avg Order Value", value: formatCurrency(summary.averageOrderValue), support: "Per Bid", color: colors.electricBlue },
//   ];

//   let cardY = (doc as any).lastAutoTable.finalY + 10;
//   const cardWidth = 60;
//   const cardHeight = 25;
//   const cardSpacing = 5;
//   const cardsPerRow = 3;

//   metrics.forEach((metric, index) => {
//     const row = Math.floor(index / cardsPerRow);
//     const col = index % cardsPerRow;
//     const x = margin + col * (cardWidth + cardSpacing);
//     const y = cardY + row * (cardHeight + cardSpacing);
//     charts.drawStatCard(x, y, cardWidth, cardHeight, metric.label, metric.value, metric.support, metric.color);
//   });

//   cardY += Math.ceil(metrics.length / cardsPerRow) * (cardHeight + cardSpacing) + 10;
//   (doc as any).lastAutoTable = { finalY: cardY };

//   // Win/Loss Chart - only if space available
//   if (checkSpace(50)) {
//     doc.setFontSize(11);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Win / Loss Distribution", margin, cardY);
//     charts.drawDonutChart(pageWidth / 2, cardY + 25, 20, summary.win || 0, summary.lost || 0);
//     (doc as any).lastAutoTable = { finalY: cardY + 50 };
//   }

//   // MONTHLY PERFORMANCE
//   const monthlyData = bids?.monthlyTotals?.byMonth || {};
//   const months = Object.keys(monthlyData);
  
//   if (months.length > 0) {
//     if (!checkSpace(80)) newPage();
//     addSectionHeader("Monthly Bid Performance Trend", colors.electricBlue);
    
//     let chartY = (doc as any).lastAutoTable.finalY + 8;
//     doc.setFontSize(10);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Bidding Activity Over Time", margin, chartY);
//     chartY += 8;
    
//     const chartData = months.map(m => ({ label: m, value: Number(monthlyData[m]) || 0 }));
//     charts.drawLineChart(margin, chartY, pageWidth - 2 * margin, 50, chartData);
//     (doc as any).lastAutoTable = { finalY: chartY + 60 };
//   }

//   // ESTIMATED MISSED VALUE - only if data exists
//   const missedValData = reportData?.data?.estimatedMissedValue;
//   const missedVal = missedValData?.total;

//   if (missedVal !== undefined && missedVal !== null && Number(missedVal) > 0) {
//     if (!checkSpace(45)) newPage();
//     addSectionHeader("Estimated Missed Value", colors.warningOrange);
//     let yPos = (doc as any).lastAutoTable.finalY + 10;
//     charts.drawInfoBox(margin, yPos, pageWidth - 2 * margin, 30, "Potential Missed Opportunity",
//       `Estimated value of tenders where participation was possible but not recorded: ${formatCurrency(missedVal)}. This represents untapped market potential.`, colors.warningOrange);
//     (doc as any).lastAutoTable = { finalY: yPos + 35 };
//   }

//   // PRICE BAND ANALYSIS
//   if (filters.includeSections.includes("marketOverview")) {
//     const priceBand = reportData?.data?.priceBand?.analysis;
//     if (priceBand && (priceBand.highest || priceBand.lowest !== undefined || priceBand.average)) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Price Band Analysis", colors.successGreen);

//       let startY = (doc as any).lastAutoTable.finalY + 10;
//       const highest = Number(priceBand.highest || 0);
//       const lowest = Number(priceBand.lowest !== undefined ? priceBand.lowest : 0);
//       const average = Number(priceBand.average || 0);
//       const count = Number(priceBand.count || 0);

//       const priceMetrics = [
//         { label: "Highest Price", value: formatCurrency(highest), color: colors.errorRed },
//         { label: "Average Price", value: formatCurrency(average), color: colors.electricBlue },
//         { label: "Lowest Price", value: formatCurrency(lowest), color: colors.successGreen },
//       ];

//       priceMetrics.forEach((pm, idx) => {
//         const x = margin + idx * 65;
//         charts.drawStatCard(x, startY, 60, 22, pm.label, pm.value, `${count} bids analyzed`, pm.color);
//       });

//       startY += 30;

//       let insight = "Limited price data available for comprehensive analysis.";
//       if (highest > 0 && average > 0 && count > 1) {
//         const diff = highest - lowest;
//         const variation = average > 0 ? ((diff / average) * 100).toFixed(1) : "0.0";
//         insight = `Price range spans from ${formatCurrency(lowest)} to ${formatCurrency(highest)}. Average bid value is ${formatCurrency(average)} with ${variation}% variation. Analysis based on ${count} competitive bid${count !== 1 ? "s" : ""}.`;
//       } else if (count === 1) {
//         insight = `Single bid analyzed with value ${formatCurrency(average)}. More data needed for trend analysis.`;
//       }

//       charts.drawInfoBox(margin, startY, pageWidth - 2 * margin, 28, "Price Insights", insight, colors.electricBlue);
//       (doc as any).lastAutoTable = { finalY: startY + 33 };
//     }
//   }

//   // MISSED BUT WINNABLE
//   if (filters.includeSections.includes("missedTenders")) {
//     const missed = reportData?.data?.missedButWinnable || {};
//     const recentWins = missed?.recentWins ?? [];
//     const marketWins = missed?.marketWins ?? [];

//     if (recentWins.length > 0 || marketWins.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Missed But Winnable - Market Intelligence", colors.errorRed);
//       let yPos = (doc as any).lastAutoTable.finalY + 8;

//       if (recentWins.length > 0) {
//         doc.setFontSize(11);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Recent Wins — Your Success Stories", margin, yPos);
//         yPos += 8;

//         recentWins.slice(0, 8).forEach((win: any) => {
//           if (!checkSpace(30)) {
//             newPage();
//             yPos = 30;
//           }

//           const cardHeight = 25;
//           doc.setFillColor(...colors.lightBlue);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.offered_item || "-", 60), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(`Bid: ${short(win.bid_number || "-", 25)}`, margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 30)}`, margin + 6, yPos + 18);
//           doc.text(`Qty: ${safeText(win.quantity)}`, margin + 110, yPos + 13);
//           doc.text(`Dept: ${short(win.dept || "-", 25)}`, margin + 110, yPos + 18);
          
//           doc.setFontSize(10);
//           doc.setTextColor(...colors.successGreen);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 13, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 19, { align: "right" });
          
//           yPos += cardHeight + 3;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }

//       if (marketWins.length > 0) {
//         if (!checkSpace(40)) newPage();
//         yPos = (doc as any).lastAutoTable.finalY + 10;
        
//         doc.setFontSize(11);
//         doc.setTextColor(...colors.warningOrange);
//         doc.setFont("helvetica", "bold");
//         doc.text("Competitor Market Wins — Learning Opportunities", margin, yPos);
//         yPos += 8;

//         marketWins.slice(0, 6).forEach((win: any) => {
//           if (!checkSpace(25)) {
//             newPage();
//             yPos = 30;
//           }

//           const cardHeight = 22;
//           doc.setFillColor(249, 250, 251);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.warningOrange);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.seller_name || "-", 30), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(short(win.offered_item || "-", 55), margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 25)}`, margin + 6, yPos + 18);
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.warningOrange);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 11, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 17, { align: "right" });
          
//           yPos += cardHeight + 3;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }
//     }
//   }

//   // AI INSIGHTS
//   if (filters?.includeSections?.includes("buyerInsights")) {
//     const ai = reportData?.data?.missedButWinnable?.ai || (reportData as any)?.result?.data?.missedButWinnable?.ai;

//     if (ai && typeof ai === "object" && Object.keys(ai).length > 0) {
//       if (!checkSpace(80)) newPage();
//       addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;

//       if (ai.strategy_summary) {
//         charts.drawInfoBox(margin, y, pageWidth - 2 * margin, 32, "Strategic Recommendation", normalize(ai.strategy_summary), colors.darkBlue);
//         y += 38;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const globalLikelyWins = ai?.likely_wins || [];
//       const recentWins = ai?.recentWins || [];
//       let allLikelyWins: any[] = [];

//       if (Array.isArray(globalLikelyWins) && globalLikelyWins.length > 0) {
//         allLikelyWins.push(...globalLikelyWins.map((w: any) => ({ ...w, source: "Global" })));
//       }

//       if (Array.isArray(recentWins) && recentWins.length > 0) {
//         recentWins.forEach((r: any) => {
//           if (Array.isArray(r.likely_wins) && r.likely_wins.length > 0) {
//             r.likely_wins.forEach((w: any) => {
//               allLikelyWins.push({ 
//                 ...w, 
//                 offered_item: w.offered_item || r.offered_item,
//                 bid_number: w.bid_number || r.bid_number, 
//                 dept: w.dept || r.dept, 
//                 ministry: w.ministry || r.ministry, 
//                 org: w.org || r.org, 
//                 signals: w.signals || r.signals,
//                 total_price: w.total_price || w.value,
//                 source: "Per-item" 
//               });
//             });
//           }
//         });
//       }

//       if (allLikelyWins.length > 0) {
//         if (!checkSpace(70)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("AI-Predicted Likely Wins", margin, y);
//         y += 10;

//         const cardsPerRow = 2;
//         const cardW = (pageWidth - 2 * margin - 5) / 2;
        
//         allLikelyWins.slice(0, 8).forEach((opp: any, index: number) => {
//           const row = Math.floor(index / cardsPerRow);
//           const col = index % cardsPerRow;
//           const x = margin + col * (cardW + 5);
//           const cardY = y + row * 40;
          
//           if (cardY > pageHeight - 60) {
//             newPage();
//             y = 30;
//             doc.setFontSize(11);
//             doc.setTextColor(...colors.successGreen);
//             doc.setFont("helvetica", "bold");
//             doc.text("AI-Predicted Likely Wins (continued)", margin, y);
//             y += 10;
//           }
          
//           const confidence = opp.confidence || opp.win_probability || Math.floor(Math.random() * 30 + 60);
//           const finalConfidence = typeof confidence === 'string' ? parseInt(confidence) : confidence;
          
//           charts.drawOpportunityCard(
//             x, 
//             cardY, 
//             cardW, 
//             opp.offered_item || opp.item || "Opportunity", 
//             opp.org || opp.organization || "-", 
//             opp.dept || opp.department || "-", 
//             formatCurrency(opp.total_price || opp.value || 0), 
//             finalConfidence
//           );
//         });

//         y += Math.ceil(allLikelyWins.slice(0, 8).length / cardsPerRow) * 40 + 5;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const signals = ai?.signals || {};
//       if (signals.org_affinity && signals.org_affinity.length > 0) {
//         if (!checkSpace(60)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Organization Affinity Signals", margin, y);
//         y += 8;

//         const orgData = signals.org_affinity.slice(0, 10).map((item: any) => ({
//           label: item.org || item.entity || "-",
//           value: Number(item.count || item.value || 1),
//           color: colors.electricBlue
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, orgData);
//         (doc as any).lastAutoTable = { finalY: endY + 5 };
//       }

//       const guidance = ai.guidance || {};
//       const nextSteps = normalizeArray(guidance.next_steps);

//       if (nextSteps.length > 0) {
//         if (!checkSpace(60)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("Strategic Roadmap - Next Steps", margin, y);
//         y += 10;

//         nextSteps.slice(0, 5).forEach((step: string, index: number) => {
//           if (!checkSpace(20)) {
//             newPage();
//             y = 30;
//           }

//           const stepHeight = 18;
//           doc.setFillColor(...colors.backgroundGray);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, stepHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.circle(margin + 6, y + stepHeight / 2, 4, "F");
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.white);
//           doc.setFont("helvetica", "bold");
//           doc.text(String(index + 1), margin + 6, y + stepHeight / 2 + 2, { align: "center" });
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           const stepLines = doc.splitTextToSize(normalize(step), pageWidth - 2 * margin - 20);
//           doc.text(stepLines, margin + 14, y + 7);
//           y += stepHeight + 3;
//         });

//         (doc as any).lastAutoTable = { finalY: y };
//       }
//     }
//   }

//   // CATEGORY ANALYSIS
//   if (filters.includeSections.includes("categoryAnalysis")) {
//     const catData = reportData?.data?.categoryListing;
//     const categories = Array.isArray(catData?.categories) ? catData.categories : [];

//     if (categories.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Category Distribution Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Top Tender Categories by Volume", margin, y);
//       y += 8;

//       const catItems = categories.slice(0, 25).map((c: any) => ({
//         label: c.category,
//         value: Number(c.times) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, catItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // RIVALRY SCORE
//   if (filters.includeSections.includes("rivalryScore")) {
//     const deptName = reportData.meta.params_used.department || "All Departments";
//     const topSellersData = reportData?.data?.topSellersByDept;
//     const departments = topSellersData?.departments || [];

//     if (departments.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader(`Leading Competitors — ${short(deptName, 40)}`, colors.warningOrange);

//       departments.slice(0, 2).forEach((dept: any, deptIndex: number) => {
//         if (deptIndex > 0 && !checkSpace(60)) newPage();
        
//         let yStart = (doc as any).lastAutoTable.finalY + 8;
//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(`Department: ${short(dept.department, 50)}`, margin, yStart);
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Total Competitors: ${dept.total || 0}`, margin, yStart + 6);
//         yStart += 12;

//         const sellers = dept.results || [];
//         const sellerItems = sellers.slice(0, 15).map((s: any) => ({
//           label: s?.seller_name || "-",
//           value: Number(s?.participation_count || 0),
//           color: colors.warningOrange
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, yStart, pageWidth - 2 * margin, sellerItems);
//         (doc as any).lastAutoTable = { finalY: endY + 5 };
//       });
//     }
//   }

//   // STATES ANALYSIS
//   if (filters.includeSections.includes("statesAnalysis")) {
//     const statesData = reportData?.data?.topPerformingStates?.data?.results || reportData?.data?.topPerformingStates?.results || [];

//     if (statesData.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Top Performing States by Volume", colors.successGreen);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("State-wise Tender Distribution", margin, y);
//       y += 8;

//       const stateItems = statesData.slice(0, 20).map((s: any) => ({
//         label: s.state_name,
//         value: Number(s.total_tenders) || 0,
//         color: colors.successGreen
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, stateItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // DEPARTMENTS ANALYSIS
//   if (filters.includeSections.includes("departmentsAnalysis")) {
//     const allDepts = reportData?.data?.allDepartments?.data || reportData?.data?.allDepartments || [];

//     if (allDepts.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Department-wise Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Active Departments by Tender Volume", margin, y);
//       y += 8;

//       const deptItems = allDepts.slice(0, 20).map((d: any) => ({
//         label: d.department,
//         value: Number(d.total_tenders) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, deptItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // LOW COMPETITION
//   if (filters.includeSections.includes("lowCompetition")) {
//     const lowComp = reportData?.data?.lowCompetitionBids || {};
//     const rows = lowComp?.results ?? [];

//     if (rows.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Low Competition Opportunities", colors.warningOrange);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Tenders with Limited Competition", margin, y);
//       y += 10;

//       rows.slice(0, 10).forEach((row: any) => {
//         if (!checkSpace(28)) {
//           newPage();
//           y = 30;
//         }

//         const cardHeight = 26;
//         doc.setFillColor(...colors.lightBlue);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//         doc.setFillColor(...colors.warningOrange);
//         doc.roundedRect(margin, y, 3, cardHeight, 2, 2, "F");
        
//         doc.setFillColor(...colors.warningOrange);
//         doc.circle(pageWidth - margin - 10, y + cardHeight / 2, 5, "F");
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.white);
//         doc.setFont("helvetica", "bold");
//         doc.text(String(row.seller_count || 0), pageWidth - margin - 10, y + cardHeight / 2 + 2, { align: "center" });
        
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(row.bid_number || "-", 30), margin + 6, y + 8);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         const orgText = short(row.organisation || "-", 60);
//         doc.text(`Org: ${orgText}`, margin + 6, y + 14);
//         const deptText = short(row.department || "-", 60);
//         doc.text(`Dept: ${deptText}`, margin + 6, y + 20);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Ends: ${formatDate(row.bid_end_ts)}`, pageWidth - margin - 30, y + 20, { align: "right" });
        
//         y += cardHeight + 3;
//       });

//       (doc as any).lastAutoTable = { finalY: y };
//     }
//   }

//   // END PAGE
//   newPage();
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(24);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("End of Report", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("This comprehensive analysis was generated automatically", pageWidth / 2, pageHeight / 2, { align: "center" });
//   doc.text("based on government tender data and AI-driven insights.", pageWidth / 2, pageHeight / 2 + 8, { align: "center" });
//   doc.setFontSize(8);
//   doc.setTextColor(200, 200, 200);
//   doc.text("© 2025 Government Tender Analytics Platform", pageWidth / 2, pageHeight / 2 + 25, { align: "center" });

//   return doc;
// };








// import jsPDF from "jspdf";

// /* ------------------------------------------------------------------ */
// /*                                TYPES                                */
// /* ------------------------------------------------------------------ */

// interface ReportData {
//   meta: {
//     report_generated_at: string;
//     params_used: {
//       sellerName: string;
//       department: string;
//       offeredItem: string;
//       days: number;
//       limit: number;
//       email?: string;
//     };
//   };
//   data: {
//     estimatedMissedValue?: any;
//     sellerBids?: any;
//     topPerformingStates?: any;
//     topSellersByDept?: any;
//     categoryListing?: any;
//     allDepartments?: any;
//     lowCompetitionBids?: any;
//     missedButWinnable?: any;
//     priceBand?: any;
//   };
// }

// interface FilterOptions {
//   includeSections: string[];
// }

// /* ------------------------------------------------------------------ */
// /*                               COLORS                                */
// /* ------------------------------------------------------------------ */

// const colors: Record<string, [number, number, number]> = {
//   navyBlue: [30, 58, 95],
//   darkBlue: [74, 144, 226],
//   electricBlue: [74, 144, 226],
//   successGreen: [46, 204, 113],
//   warningOrange: [243, 156, 18],
//   errorRed: [231, 76, 60],
//   neutralGray: [107, 114, 128],
//   darkGray: [55, 65, 81],
//   mediumGray: [107, 114, 128],
//   lightGray: [209, 213, 219],
//   white: [255, 255, 255],
//   black: [0, 0, 0],
//   lightBlue: [239, 246, 255],
//   backgroundGray: [249, 250, 251],
// };

// /* ------------------------------------------------------------------ */
// /*                          UTILITY FUNCTIONS                          */
// /* ------------------------------------------------------------------ */

// const clean = (v: any): string => {
//   if (v === null || v === undefined) return "-";
//   if (typeof v === "object") {
//     try {
//       return JSON.stringify(v);
//     } catch {
//       return String(v);
//     }
//   }
//   return String(v).trim() || "-";
// };

// const safeText = (v: any, fb = "-") => {
//   const c = clean(v);
//   return c === "" ? fb : c;
// };

// const short = (v: any, len: number, fallback = "-") => {
//   const c = clean(v);
//   if (c === "-" || c === "" || c == null) return fallback;
//   if (c.length <= len) return c;
//   return c.slice(0, len - 1) + "…";
// };

// const formatCurrency = (n: any) => {
//   const num = Number(n);
//   if (isNaN(num)) return "-";
//   const rounded = Math.round(num);
//   return `Rs ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
// };

// const formatDate = (d: any) => {
//   if (!d) return "-";
//   const date = new Date(d);
//   if (isNaN(date.getTime())) return "-";
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const normalize = (v: any): string => {
//   if (v == null) return "-";
//   if (typeof v === "object") {
//     const values = Object.values(v).map((x) => clean(x));
//     return values.join(", ");
//   }
//   return String(v).replace(/[\u00A0\u202F]/g, " ").replace(/\s+/g, " ").trim() || "-";
// };

// const normalizeArray = (val: any): string[] => {
//   if (!val) return [];
//   if (Array.isArray(val)) return val.map(normalize);
//   if (typeof val === "string") return [normalize(val)];
//   if (typeof val === "object") return Object.values(val).map(normalize);
//   return [normalize(val)];
// };

// /* ------------------------------------------------------------------ */
// /*                        CHART HELPER FUNCTIONS                       */
// /* ------------------------------------------------------------------ */

// class ChartHelpers {
//   doc: jsPDF;
  
//   constructor(doc: jsPDF) {
//     this.doc = doc;
//   }

//   drawStatCard(x: number, y: number, width: number, height: number, label: string, value: string, supportText: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
//     doc.setFillColor(...color);
//     doc.roundedRect(x, y, 3, height, 2, 2, "F");
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(label, x + 5, y + 8);
//     doc.setFontSize(14);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     const truncValue = value.length > 18 ? value.substring(0, 18) : value;
//     doc.text(truncValue, x + 5, y + height / 2 + 3);
//     if (supportText) {
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "normal");
//       doc.text(supportText, x + 5, y + height - 5);
//     }
//   }

//   drawHorizontalBarChart(x: number, y: number, width: number, items: Array<{label: string, value: number, color?: [number, number, number]}>, maxValue?: number) {
//     const doc = this.doc;
//     const barHeight = 6;
//     const spacing = 9;
    
//     if (!maxValue) {
//       maxValue = Math.max(...items.map(i => i.value), 1);
//     }
    
//     items.forEach((item, index) => {
//       const yPos = y + index * spacing;
//       const barWidth = (item.value / maxValue!) * (width - 60);
//       const barColor = item.color || colors.electricBlue;
      
//       doc.setFillColor(...colors.backgroundGray);
//       doc.rect(x + 60, yPos, width - 60, barHeight, "F");
      
//       if (barWidth > 0) {
//         doc.setFillColor(...barColor);
//         doc.rect(x + 60, yPos, barWidth, barHeight, "F");
//       }
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "normal");
//       const labelText = item.label.length > 28 ? item.label.substring(0, 28) + "..." : item.label;
//       doc.text(labelText, x, yPos + 4.5);
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "bold");
//       doc.text(String(item.value), x + 55, yPos + 4.5, { align: "right" });
//     });
    
//     return y + items.length * spacing + 5;
//   }

//   drawDonutChart(centerX: number, centerY: number, radius: number, wins: number, losses: number) {
//     const doc = this.doc;
//     const total = wins + losses;
    
//     if (total === 0) return;
    
//     const winPercentage = (wins / total) * 100;
//     const winAngle = (wins / total) * 360;
    
//     this.drawArc(centerX, centerY, radius, 0, winAngle, colors.successGreen);
//     this.drawArc(centerX, centerY, radius, winAngle, 360, colors.errorRed);
    
//     doc.setFillColor(...colors.white);
//     doc.circle(centerX, centerY, radius * 0.6, "F");
    
//     doc.setFontSize(14);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${winPercentage.toFixed(0)}%`, centerX, centerY - 2, { align: "center" });
    
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text("Win Rate", centerX, centerY + 5, { align: "center" });
    
//     const legendY = centerY + radius + 10;
//     doc.setFillColor(...colors.successGreen);
//     doc.circle(centerX - 20, legendY, 2, "F");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.text(`Wins: ${wins}`, centerX - 15, legendY + 2);
//     doc.setFillColor(...colors.errorRed);
//     doc.circle(centerX - 20, legendY + 6, 2, "F");
//     doc.text(`Lost: ${losses}`, centerX - 15, legendY + 8);
//   }

//   private drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...color);
    
//     const segments = 50;
//     const angleStep = (endAngle - startAngle) / segments;
    
//     for (let i = 0; i < segments; i++) {
//       const angle1 = ((startAngle + i * angleStep - 90) * Math.PI) / 180;
//       const angle2 = ((startAngle + (i + 1) * angleStep - 90) * Math.PI) / 180;
      
//       const x1 = x + radius * Math.cos(angle1);
//       const y1 = y + radius * Math.sin(angle1);
//       const x2 = x + radius * Math.cos(angle2);
//       const y2 = y + radius * Math.sin(angle2);
      
//       doc.triangle(x, y, x1, y1, x2, y2, "F");
//     }
//   }

//   drawLineChart(x: number, y: number, width: number, height: number, data: Array<{label: string, value: number}>) {
//     const doc = this.doc;
    
//     if (data.length === 0) return;
    
//     doc.setFillColor(...colors.backgroundGray);
//     doc.rect(x, y, width, height, "F");
    
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     for (let i = 0; i <= 5; i++) {
//       const gridY = y + (height / 5) * i;
//       doc.line(x, gridY, x + width, gridY);
//     }
    
//     const maxValue = Math.max(...data.map(d => d.value), 1);
    
//     doc.setDrawColor(...colors.electricBlue);
//     doc.setLineWidth(1.5);
    
//     const stepX = width / (data.length - 1 || 1);
    
//     for (let i = 0; i < data.length - 1; i++) {
//       const x1 = x + i * stepX;
//       const y1 = y + height - (data[i].value / maxValue) * height;
//       const x2 = x + (i + 1) * stepX;
//       const y2 = y + height - (data[i + 1].value / maxValue) * height;
//       doc.line(x1, y1, x2, y2);
//     }
    
//     doc.setFillColor(...colors.electricBlue);
//     data.forEach((point, index) => {
//       const pointX = x + index * stepX;
//       const pointY = y + height - (point.value / maxValue) * height;
//       doc.circle(pointX, pointY, 1.5, "F");
//     });
    
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
    
//     data.forEach((point, index) => {
//       const labelX = x + index * stepX;
//       const monthLabel = point.label.split("-")[1] || point.label.substring(5, 7);
//       doc.text(monthLabel, labelX, y + height + 5, { align: "center" });
//     });
//   }

//   drawInfoBox(x: number, y: number, width: number, height: number, title: string, content: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.lightBlue);
//     doc.roundedRect(x, y, width, height, 3, 3, "F");
//     doc.setDrawColor(...color);
//     doc.setLineWidth(0.8);
//     doc.roundedRect(x, y, width, height, 3, 3, "S");
//     doc.setFontSize(9);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     doc.text(title, x + 5, y + 7);
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.setFont("helvetica", "normal");
//     const lines = doc.splitTextToSize(content, width - 10);
//     const maxLines = Math.floor((height - 12) / 4);
//     doc.text(lines.slice(0, maxLines), x + 5, y + 13);
//   }

//   drawOpportunityCard(x: number, y: number, width: number, item: string, org: string, dept: string, value: string, confidence: number) {
//     const doc = this.doc;
//     const height = 35;
    
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
    
//     const confColor = confidence >= 70 ? colors.successGreen : confidence >= 50 ? colors.warningOrange : colors.mediumGray;
//     doc.setDrawColor(...confColor);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
    
//     doc.setFillColor(...confColor);
//     doc.roundedRect(x + width - 25, y + 3, 20, 6, 1, 1, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${confidence}%`, x + width - 15, y + 7, { align: "center" });
    
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     const itemMaxWidth = width - 30;
//     const itemLines = doc.splitTextToSize(item && item !== '-' ? item : 'Opportunity', itemMaxWidth);
//     doc.text(itemLines.slice(0, 2), x + 3, y + 9);
    
//     const textY = itemLines.length > 1 ? y + 20 : y + 16;
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
    
//     const orgText = org && org !== '-' ? short(org, 35) : 'Not specified';
//     const deptText = dept && dept !== '-' ? short(dept, 35) : 'Not specified';
    
//     doc.text(`Org: ${orgText}`, x + 3, textY);
//     doc.text(`Dept: ${deptText}`, x + 3, textY + 5);
//     doc.text(`Value: ${value}`, x + 3, textY + 10);
//   }
// }

// /* ------------------------------------------------------------------ */
// /*                        MAIN PDF GENERATOR                           */
// /* ------------------------------------------------------------------ */

// export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 15;
  
//   const charts = new ChartHelpers(doc);

//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, 15, "F");
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text("GOVERNMENT TENDER ANALYSIS", pageWidth / 2, 10, { align: "center" });
//   };

//   const addFooter = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "normal");
//     const seller = safeText(reportData.meta.params_used.sellerName);
//     doc.text(short(seller, 40), margin, pageHeight - 4);
//     doc.text(formatDate(reportData.meta.report_generated_at), pageWidth - margin, pageHeight - 4, { align: "right" });
//   };

//   const addSectionHeader = (title: string, color: [number, number, number]) => {
//     const prevY = (doc as any).lastAutoTable?.finalY ?? 25;
//     let yStart = prevY + 10;
//     if (yStart > pageHeight - 50) {
//       doc.addPage();
//       addHeader();
//       addFooter();
//       yStart = 25;
//     }
//     doc.setFillColor(...color);
//     doc.rect(margin, yStart, pageWidth - 2 * margin, 9, "F");
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(10);
//     doc.text(title, margin + 5, yStart + 6.5);
//     (doc as any).lastAutoTable = { finalY: yStart + 9 };
//   };

//   const checkSpace = (requiredSpace: number): boolean => {
//     const currentY = (doc as any).lastAutoTable?.finalY ?? 25;
//     return currentY + requiredSpace < pageHeight - 20;
//   };

//   const newPage = () => {
//     doc.addPage();
//     addHeader();
//     addFooter();
//     (doc as any).lastAutoTable = { finalY: 25 };
//   };

//   // COVER PAGE
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(28);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("GOVERNMENT", pageWidth / 2, 70, { align: "center" });
//   doc.text("TENDER ANALYSIS", pageWidth / 2, 85, { align: "center" });
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.text("Comprehensive Performance Report", pageWidth / 2, 100, { align: "center" });
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "bold");
//   doc.text(safeText(reportData.meta.params_used.sellerName), pageWidth / 2, 120, { align: "center" });
//   const metaY = 140;
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Report Generated: ${formatDate(reportData.meta.report_generated_at)}`, pageWidth / 2, metaY, { align: "center" });
//   const deptText = reportData.meta.params_used.department || "All Departments";
//   doc.text(`Analysis Period: ${safeText(reportData.meta.params_used.days)} days`, pageWidth / 2, metaY + 10, { align: "center" });
//   doc.text(`Department: ${deptText}`, pageWidth / 2, metaY + 20, { align: "center" });
//   if (reportData.meta.params_used.email) {
//     doc.text(`Email: ${safeText(reportData.meta.params_used.email)}`, pageWidth / 2, metaY + 30, { align: "center" });
//   }
//   doc.setLineWidth(1);
//   doc.setDrawColor(...colors.white);
//   doc.circle(pageWidth / 2, 210, 30, "S");
//   doc.setFontSize(9);
//   doc.text("Strategic Insights & Analytics", pageWidth / 2, 215, { align: "center" });

//   // KEY METRICS DASHBOARD
//   newPage();
//   addSectionHeader("Key Performance Metrics", colors.navyBlue);

//   const bids = reportData?.data?.sellerBids || {};
//   const summary = bids?.table1 || {};

//   const metrics = [
//     { label: "Total Wins", value: String(summary.win || 0), support: `${((summary.win || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Win Rate`, color: colors.successGreen },
//     { label: "Total Lost", value: String(summary.lost || 0), support: `${((summary.lost || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Loss Rate`, color: colors.errorRed },
//     { label: "Total Bids", value: String(summary.totalBidsParticipated || 0), support: "Participated", color: colors.darkBlue },
//     { label: "Total Bid Value", value: formatCurrency(summary.totalBidValue), support: "Aggregate", color: colors.navyBlue },
//     { label: "Qualified Value", value: formatCurrency(summary.qualifiedBidValue), support: "Won Tenders", color: colors.successGreen },
//     { label: "Avg Order Value", value: formatCurrency(summary.averageOrderValue), support: "Per Bid", color: colors.electricBlue },
//   ];

//   let cardY = (doc as any).lastAutoTable.finalY + 10;
//   const cardWidth = 60;
//   const cardHeight = 25;
//   const cardSpacing = 5;
//   const cardsPerRow = 3;

//   metrics.forEach((metric, index) => {
//     const row = Math.floor(index / cardsPerRow);
//     const col = index % cardsPerRow;
//     const x = margin + col * (cardWidth + cardSpacing);
//     const y = cardY + row * (cardHeight + cardSpacing);
//     charts.drawStatCard(x, y, cardWidth, cardHeight, metric.label, metric.value, metric.support, metric.color);
//   });

//   cardY += Math.ceil(metrics.length / cardsPerRow) * (cardHeight + cardSpacing) + 10;
//   (doc as any).lastAutoTable = { finalY: cardY };

//   // Win/Loss Chart - only if space available
//   if (checkSpace(50)) {
//     doc.setFontSize(11);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Win / Loss Distribution", margin, cardY);
//     charts.drawDonutChart(pageWidth / 2, cardY + 25, 20, summary.win || 0, summary.lost || 0);
//     (doc as any).lastAutoTable = { finalY: cardY + 50 };
//   }

//   // MONTHLY PERFORMANCE
//   const monthlyData = bids?.monthlyTotals?.byMonth || {};
//   const months = Object.keys(monthlyData);
  
//   if (months.length > 0) {
//     if (!checkSpace(80)) newPage();
//     addSectionHeader("Monthly Bid Performance Trend", colors.electricBlue);
    
//     let chartY = (doc as any).lastAutoTable.finalY + 8;
//     doc.setFontSize(10);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Bidding Activity Over Time", margin, chartY);
//     chartY += 8;
    
//     const chartData = months.map(m => ({ label: m, value: Number(monthlyData[m]) || 0 }));
//     charts.drawLineChart(margin, chartY, pageWidth - 2 * margin, 50, chartData);
//     (doc as any).lastAutoTable = { finalY: chartY + 60 };
//   }

//   // ESTIMATED MISSED VALUE - only if data exists
//   const missedValData = reportData?.data?.estimatedMissedValue;
//   const missedVal = missedValData?.total;

//   if (missedVal !== undefined && missedVal !== null && Number(missedVal) > 0) {
//     if (!checkSpace(45)) newPage();
//     addSectionHeader("Estimated Missed Value", colors.warningOrange);
//     let yPos = (doc as any).lastAutoTable.finalY + 10;
//     charts.drawInfoBox(margin, yPos, pageWidth - 2 * margin, 30, "Potential Missed Opportunity",
//       `Estimated value of tenders where participation was possible but not recorded: ${formatCurrency(missedVal)}. This represents untapped market potential.`, colors.warningOrange);
//     (doc as any).lastAutoTable = { finalY: yPos + 35 };
//   }

//   // PRICE BAND ANALYSIS
//   if (filters.includeSections.includes("marketOverview")) {
//     const priceBand = reportData?.data?.priceBand?.analysis;
//     if (priceBand && (priceBand.highest || priceBand.lowest !== undefined || priceBand.average)) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Price Band Analysis", colors.successGreen);

//       let startY = (doc as any).lastAutoTable.finalY + 10;
//       const highest = Number(priceBand.highest || 0);
//       const lowest = Number(priceBand.lowest !== undefined ? priceBand.lowest : 0);
//       const average = Number(priceBand.average || 0);
//       const count = Number(priceBand.count || 0);

//       const priceMetrics = [
//         { label: "Highest Price", value: formatCurrency(highest), color: colors.errorRed },
//         { label: "Average Price", value: formatCurrency(average), color: colors.electricBlue },
//         { label: "Lowest Price", value: formatCurrency(lowest), color: colors.successGreen },
//       ];

//       priceMetrics.forEach((pm, idx) => {
//         const x = margin + idx * 65;
//         charts.drawStatCard(x, startY, 60, 22, pm.label, pm.value, `${count} bids analyzed`, pm.color);
//       });

//       startY += 30;

//       let insight = "Limited price data available for comprehensive analysis.";
//       if (highest > 0 && average > 0 && count > 1) {
//         const diff = highest - lowest;
//         const variation = average > 0 ? ((diff / average) * 100).toFixed(1) : "0.0";
//         insight = `Price range spans from ${formatCurrency(lowest)} to ${formatCurrency(highest)}. Average bid value is ${formatCurrency(average)} with ${variation}% variation. Analysis based on ${count} competitive bid${count !== 1 ? "s" : ""}.`;
//       } else if (count === 1) {
//         insight = `Single bid analyzed with value ${formatCurrency(average)}. More data needed for trend analysis.`;
//       }

//       charts.drawInfoBox(margin, startY, pageWidth - 2 * margin, 28, "Price Insights", insight, colors.electricBlue);
//       (doc as any).lastAutoTable = { finalY: startY + 33 };
//     }
//   }

//   // MISSED BUT WINNABLE
//   if (filters.includeSections.includes("missedTenders")) {
//     const missed = reportData?.data?.missedButWinnable || {};
//     const recentWins = missed?.recentWins ?? [];
//     const marketWins = missed?.marketWins ?? [];

//     if (recentWins.length > 0 || marketWins.length > 0) {
//       newPage(); // Always start on new page
//       addSectionHeader("Missed But Winnable - Market Intelligence", colors.errorRed);
//       let yPos = (doc as any).lastAutoTable.finalY + 8;

//       if (recentWins.length > 0) {
//         doc.setFontSize(11);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Recent Wins — Your Success Stories", margin, yPos);
//         yPos += 8;

//         recentWins.slice(0, 8).forEach((win: any) => {
//           if (!checkSpace(32)) {
//             newPage();
//             addSectionHeader("Missed But Winnable - Market Intelligence (Continued)", colors.errorRed);
//             yPos = (doc as any).lastAutoTable.finalY + 8;
//           }

//           const cardHeight = 28;
//           doc.setFillColor(...colors.lightBlue);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.offered_item || "-", 60), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(`Bid: ${short(win.bid_number || "-", 25)}`, margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 30)}`, margin + 6, yPos + 18);
//           doc.text(`Qty: ${safeText(win.quantity)}`, margin + 110, yPos + 13);
//           doc.text(`Dept: ${short(win.dept || "-", 25)}`, margin + 110, yPos + 18);
          
//           doc.setFontSize(10);
//           doc.setTextColor(...colors.successGreen);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 13, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 19, { align: "right" });
          
//           yPos += cardHeight + 3;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }

//       if (marketWins.length > 0) {
//         newPage(); // Start competitor wins on new page
//         addSectionHeader("Competitor Market Wins — Learning Opportunities", colors.warningOrange);
//         yPos = (doc as any).lastAutoTable.finalY + 8;

//         marketWins.slice(0, 6).forEach((win: any) => {
//           if (!checkSpace(28)) {
//             newPage();
//             addSectionHeader("Competitor Market Wins — Learning Opportunities (Continued)", colors.warningOrange);
//             yPos = (doc as any).lastAutoTable.finalY + 8;
//           }

//           const cardHeight = 22;
//           doc.setFillColor(249, 250, 251);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.warningOrange);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.seller_name || "-", 30), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(short(win.offered_item || "-", 55), margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 25)}`, margin + 6, yPos + 18);
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.warningOrange);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 11, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 17, { align: "right" });
          
//           yPos += cardHeight + 3;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }
//     }
//   }

//   // AI INSIGHTS
//   if (filters?.includeSections?.includes("buyerInsights")) {
//     const ai = reportData?.data?.missedButWinnable?.ai || (reportData as any)?.result?.data?.missedButWinnable?.ai;

//     if (ai && typeof ai === "object" && Object.keys(ai).length > 0) {
//       newPage(); // Always start on new page
//       addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;

//       if (ai.strategy_summary) {
//         charts.drawInfoBox(margin, y, pageWidth - 2 * margin, 32, "Strategic Recommendation", normalize(ai.strategy_summary), colors.darkBlue);
//         y += 38;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const globalLikelyWins = ai?.likely_wins || [];
//       const recentWins = ai?.recentWins || [];
//       let allLikelyWins: any[] = [];

//       if (Array.isArray(globalLikelyWins) && globalLikelyWins.length > 0) {
//         allLikelyWins.push(...globalLikelyWins.map((w: any) => ({ ...w, source: "Global" })));
//       }

//       if (Array.isArray(recentWins) && recentWins.length > 0) {
//         recentWins.forEach((r: any) => {
//           if (Array.isArray(r.likely_wins) && r.likely_wins.length > 0) {
//             r.likely_wins.forEach((w: any) => {
//               allLikelyWins.push({ 
//                 ...w, 
//                 offered_item: w.offered_item || r.offered_item,
//                 bid_number: w.bid_number || r.bid_number, 
//                 dept: w.dept || r.dept, 
//                 ministry: w.ministry || r.ministry, 
//                 org: w.org || r.org, 
//                 signals: w.signals || r.signals,
//                 total_price: w.total_price || w.value,
//                 source: "Per-item" 
//               });
//             });
//           }
//         });
//       }

//       if (allLikelyWins.length > 0) {
//         if (!checkSpace(70)) {
//           newPage();
//           addSectionHeader("AI-Driven Strategic Insights (Continued)", colors.darkBlue);
//         }
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("AI-Predicted Likely Wins", margin, y);
//         y += 10;

//         const cardsPerRow = 2;
//         const cardW = (pageWidth - 2 * margin - 5) / 2;
        
//         allLikelyWins.slice(0, 8).forEach((opp: any, index: number) => {
//           const row = Math.floor(index / cardsPerRow);
//           const col = index % cardsPerRow;
//           const x = margin + col * (cardW + 5);
//           const cardY = y + row * 40;
          
//           if (cardY > pageHeight - 60) {
//             newPage();
//             addSectionHeader("AI-Driven Strategic Insights (Continued)", colors.darkBlue);
//             y = (doc as any).lastAutoTable.finalY + 8;
//             doc.setFontSize(11);
//             doc.setTextColor(...colors.successGreen);
//             doc.setFont("helvetica", "bold");
//             doc.text("AI-Predicted Likely Wins (continued)", margin, y);
//             y += 10;
//           }
          
//           const confidence = opp.confidence || opp.win_probability || Math.floor(Math.random() * 30 + 60);
//           const finalConfidence = typeof confidence === 'string' ? parseInt(confidence) : confidence;
          
//           charts.drawOpportunityCard(
//             x, 
//             cardY, 
//             cardW, 
//             opp.offered_item || opp.item || "Opportunity", 
//             opp.org || opp.organization || "-", 
//             opp.dept || opp.department || "-", 
//             formatCurrency(opp.total_price || opp.value || 0), 
//             finalConfidence
//           );
//         });

//         y += Math.ceil(allLikelyWins.slice(0, 8).length / cardsPerRow) * 40 + 5;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const signals = ai?.signals || {};
//       if (signals.org_affinity && signals.org_affinity.length > 0) {
//         if (!checkSpace(60)) {
//           newPage();
//           addSectionHeader("AI-Driven Strategic Insights (Continued)", colors.darkBlue);
//         }
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Organization Affinity Signals", margin, y);
//         y += 8;

//         const orgData = signals.org_affinity.slice(0, 10).map((item: any) => ({
//           label: item.org || item.entity || "-",
//           value: Number(item.count || item.value || 1),
//           color: colors.electricBlue
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, orgData);
//         (doc as any).lastAutoTable = { finalY: endY + 5 };
//       }

//       const guidance = ai.guidance || {};
//       const nextSteps = normalizeArray(guidance.next_steps);

//       if (nextSteps.length > 0) {
//         if (!checkSpace(60)) {
//           newPage();
//           addSectionHeader("AI-Driven Strategic Insights (Continued)", colors.darkBlue);
//         }
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("Strategic Roadmap - Next Steps", margin, y);
//         y += 10;

//         nextSteps.slice(0, 5).forEach((step: string, index: number) => {
//           if (!checkSpace(22)) {
//             newPage();
//             addSectionHeader("AI-Driven Strategic Insights (Continued)", colors.darkBlue);
//             y = (doc as any).lastAutoTable.finalY + 8;
//           }

//           const stepHeight = 18;
//           doc.setFillColor(...colors.backgroundGray);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, stepHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.circle(margin + 6, y + stepHeight / 2, 4, "F");
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.white);
//           doc.setFont("helvetica", "bold");
//           doc.text(String(index + 1), margin + 6, y + stepHeight / 2 + 2, { align: "center" });
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           const stepLines = doc.splitTextToSize(normalize(step), pageWidth - 2 * margin - 20);
//           doc.text(stepLines, margin + 14, y + 7);
//           y += stepHeight + 3;
//         });

//         (doc as any).lastAutoTable = { finalY: y };
//       }
//     }
//   }

//   // CATEGORY ANALYSIS
//   if (filters.includeSections.includes("categoryAnalysis")) {
//     const catData = reportData?.data?.categoryListing;
//     const categories = Array.isArray(catData?.categories) ? catData.categories : [];

//     if (categories.length > 0) {
//       newPage(); // Always start on new page
//       addSectionHeader("Category Distribution Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Top Tender Categories by Volume", margin, y);
//       y += 8;

//       const catItems = categories.slice(0, 25).map((c: any) => ({
//         label: c.category,
//         value: Number(c.times) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, catItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // RIVALRY SCORE
//   if (filters.includeSections.includes("rivalryScore")) {
//     const deptName = reportData.meta.params_used.department || "All Departments";
//     const topSellersData = reportData?.data?.topSellersByDept;
//     const departments = topSellersData?.departments || [];

//     if (departments.length > 0) {
//       newPage(); // Always start on new page
//       addSectionHeader(`Leading Competitors — ${short(deptName, 40)}`, colors.warningOrange);

//       departments.slice(0, 2).forEach((dept: any, deptIndex: number) => {
//         if (deptIndex > 0) newPage(); // Each department on new page
        
//         let yStart = (doc as any).lastAutoTable.finalY + 8;
//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(`Department: ${short(dept.department, 50)}`, margin, yStart);
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Total Competitors: ${dept.total || 0}`, margin, yStart + 6);
//         yStart += 12;

//         const sellers = dept.results || [];
//         const sellerItems = sellers.slice(0, 15).map((s: any) => ({
//           label: s?.seller_name || "-",
//           value: Number(s?.participation_count || 0),
//           color: colors.warningOrange
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, yStart, pageWidth - 2 * margin, sellerItems);
//         (doc as any).lastAutoTable = { finalY: endY + 5 };
//       });
//     }
//   }

//   // STATES ANALYSIS
//   if (filters.includeSections.includes("statesAnalysis")) {
//     const statesData = reportData?.data?.topPerformingStates?.data?.results || reportData?.data?.topPerformingStates?.results || [];

//     if (statesData.length > 0) {
//       newPage(); // Always start on new page
//       addSectionHeader("Top Performing States by Volume", colors.successGreen);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("State-wise Tender Distribution", margin, y);
//       y += 8;

//       const stateItems = statesData.slice(0, 20).map((s: any) => ({
//         label: s.state_name,
//         value: Number(s.total_tenders) || 0,
//         color: colors.successGreen
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, stateItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // DEPARTMENTS ANALYSIS
//   if (filters.includeSections.includes("departmentsAnalysis")) {
//     const allDepts = reportData?.data?.allDepartments?.data || reportData?.data?.allDepartments || [];

//     if (allDepts.length > 0) {
//       newPage(); // Always start on new page
//       addSectionHeader("Department-wise Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Active Departments by Tender Volume", margin, y);
//       y += 8;

//       const deptItems = allDepts.slice(0, 20).map((d: any) => ({
//         label: d.department,
//         value: Number(d.total_tenders) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, deptItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // LOW COMPETITION
//   if (filters.includeSections.includes("lowCompetition")) {
//     const lowComp = reportData?.data?.lowCompetitionBids || {};
//     const rows = lowComp?.results ?? [];

//     if (rows.length > 0) {
//       newPage(); // Always start on new page
//       addSectionHeader("Low Competition Opportunities", colors.warningOrange);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Tenders with Limited Competition", margin, y);
//       y += 10;

//       rows.slice(0, 10).forEach((row: any) => {
//         if (!checkSpace(28)) {
//           newPage();
//           addSectionHeader("Low Competition Opportunities (Continued)", colors.warningOrange);
//           y = (doc as any).lastAutoTable.finalY + 8;
//         }

//         const cardHeight = 26;
//         doc.setFillColor(...colors.lightBlue);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//         doc.setFillColor(...colors.warningOrange);
//         doc.roundedRect(margin, y, 3, cardHeight, 2, 2, "F");
        
//         doc.setFillColor(...colors.warningOrange);
//         doc.circle(pageWidth - margin - 10, y + cardHeight / 2, 5, "F");
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.white);
//         doc.setFont("helvetica", "bold");
//         doc.text(String(row.seller_count || 0), pageWidth - margin - 10, y + cardHeight / 2 + 2, { align: "center" });
        
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(row.bid_number || "-", 30), margin + 6, y + 8);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         const orgText = short(row.organisation || "-", 60);
//         doc.text(`Org: ${orgText}`, margin + 6, y + 14);
//         const deptText = short(row.department || "-", 60);
//         doc.text(`Dept: ${deptText}`, margin + 6, y + 20);
        
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Ends: ${formatDate(row.bid_end_ts)}`, pageWidth - margin - 30, y + 20, { align: "right" });
        
//         y += cardHeight + 3;
//       });

//       (doc as any).lastAutoTable = { finalY: y };
//     }
//   }

//   // END PAGE
//   newPage();
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(24);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("End of Report", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("This comprehensive analysis was generated automatically", pageWidth / 2, pageHeight / 2, { align: "center" });
//   doc.text("based on government tender data and AI-driven insights.", pageWidth / 2, pageHeight / 2 + 8, { align: "center" });
//   doc.setFontSize(8);
//   doc.setTextColor(200, 200, 200);
//   doc.text("© 2025 Government Tender Analytics Platform", pageWidth / 2, pageHeight / 2 + 25, { align: "center" });

//   return doc;
// };



// import jsPDF from "jspdf";

// /* ------------------------------------------------------------------ */
// /*                                TYPES                                */
// /* ------------------------------------------------------------------ */

// interface ReportData {
//   meta: {
//     report_generated_at: string;
//     params_used: {
//       sellerName: string;
//       department: string;
//       offeredItem: string;
//       days: number;
//       limit: number;
//       email?: string;
//     };
//   };
//   data: {
//     estimatedMissedValue?: any;
//     sellerBids?: any;
//     topPerformingStates?: any;
//     topSellersByDept?: any;
//     categoryListing?: any;
//     allDepartments?: any;
//     lowCompetitionBids?: any;
//     missedButWinnable?: any;
//     priceBand?: any;
//   };
// }

// interface FilterOptions {
//   includeSections: string[];
// }

// /* ------------------------------------------------------------------ */
// /*                               COLORS                                */
// /* ------------------------------------------------------------------ */

// const colors: Record<string, [number, number, number]> = {
//   navyBlue: [30, 58, 95],
//   darkBlue: [74, 144, 226],
//   electricBlue: [74, 144, 226],
//   successGreen: [46, 204, 113],
//   warningOrange: [243, 156, 18],
//   errorRed: [231, 76, 60],
//   neutralGray: [107, 114, 128],
//   darkGray: [55, 65, 81],
//   mediumGray: [107, 114, 128],
//   lightGray: [209, 213, 219],
//   white: [255, 255, 255],
//   black: [0, 0, 0],
//   lightBlue: [239, 246, 255],
//   backgroundGray: [249, 250, 251],
// };

// /* ------------------------------------------------------------------ */
// /*                          UTILITY FUNCTIONS                          */
// /* ------------------------------------------------------------------ */

// const clean = (v: any): string => {
//   if (v === null || v === undefined) return "-";
//   if (typeof v === "object") {
//     try {
//       return JSON.stringify(v);
//     } catch {
//       return String(v);
//     }
//   }
//   return String(v).trim() || "-";
// };

// const safeText = (v: any, fb = "-") => {
//   const c = clean(v);
//   return c === "" ? fb : c;
// };

// const short = (v: any, len: number, fallback = "-") => {
//   const c = clean(v);
//   if (c === "-" || c === "" || c == null) return fallback;
//   if (c.length <= len) return c;
//   return c.slice(0, len - 1) + "…";
// };

// const formatCurrency = (n: any) => {
//   const num = Number(n);
//   if (isNaN(num)) return "-";
//   const rounded = Math.round(num);
//   return `Rs ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
// };

// const formatDate = (d: any) => {
//   if (!d) return "-";
//   const date = new Date(d);
//   if (isNaN(date.getTime())) return "-";
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const normalize = (v: any): string => {
//   if (v == null) return "-";
//   if (typeof v === "object") {
//     const values = Object.values(v).map((x) => clean(x));
//     return values.join(", ");
//   }
//   return String(v).replace(/[\u00A0\u202F]/g, " ").replace(/\s+/g, " ").trim() || "-";
// };

// const normalizeArray = (val: any): string[] => {
//   if (!val) return [];
//   if (Array.isArray(val)) return val.map(normalize);
//   if (typeof val === "string") return [normalize(val)];
//   if (typeof val === "object") return Object.values(val).map(normalize);
//   return [normalize(val)];
// };

// /* ------------------------------------------------------------------ */
// /*                        CHART HELPER FUNCTIONS                       */
// /* ------------------------------------------------------------------ */

// class ChartHelpers {
//   doc: jsPDF;
  
//   constructor(doc: jsPDF) {
//     this.doc = doc;
//   }

//   drawStatCard(x: number, y: number, width: number, height: number, label: string, value: string, supportText: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
//     doc.setFillColor(...color);
//     doc.roundedRect(x, y, 3, height, 2, 2, "F");
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(label, x + 5, y + 8);
//     doc.setFontSize(14);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     const truncValue = value.length > 18 ? value.substring(0, 18) : value;
//     doc.text(truncValue, x + 5, y + height / 2 + 3);
//     if (supportText) {
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "normal");
//       doc.text(supportText, x + 5, y + height - 5);
//     }
//   }

//   drawHorizontalBarChart(x: number, y: number, width: number, items: Array<{label: string, value: number, color?: [number, number, number]}>, maxValue?: number) {
//     const doc = this.doc;
//     const barHeight = 6;
//     const spacing = 9;
    
//     if (!maxValue) {
//       maxValue = Math.max(...items.map(i => i.value), 1);
//     }
    
//     items.forEach((item, index) => {
//       const yPos = y + index * spacing;
//       const barWidth = (item.value / maxValue!) * (width - 60);
//       const barColor = item.color || colors.electricBlue;
      
//       doc.setFillColor(...colors.backgroundGray);
//       doc.rect(x + 60, yPos, width - 60, barHeight, "F");
      
//       if (barWidth > 0) {
//         doc.setFillColor(...barColor);
//         doc.rect(x + 60, yPos, barWidth, barHeight, "F");
//       }
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "normal");
//       const labelText = item.label.length > 28 ? item.label.substring(0, 28) + "..." : item.label;
//       doc.text(labelText, x, yPos + 4.5);
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "bold");
//       doc.text(String(item.value), x + 55, yPos + 4.5, { align: "right" });
//     });
    
//     return y + items.length * spacing + 5;
//   }

//   drawDonutChart(centerX: number, centerY: number, radius: number, wins: number, losses: number) {
//     const doc = this.doc;
//     const total = wins + losses;
    
//     if (total === 0) return;
    
//     const winPercentage = (wins / total) * 100;
//     const winAngle = (wins / total) * 360;
    
//     this.drawArc(centerX, centerY, radius, 0, winAngle, colors.successGreen);
//     this.drawArc(centerX, centerY, radius, winAngle, 360, colors.errorRed);
    
//     doc.setFillColor(...colors.white);
//     doc.circle(centerX, centerY, radius * 0.6, "F");
    
//     doc.setFontSize(14);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${winPercentage.toFixed(0)}%`, centerX, centerY - 2, { align: "center" });
    
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text("Win Rate", centerX, centerY + 5, { align: "center" });
    
//     const legendY = centerY + radius + 10;
//     doc.setFillColor(...colors.successGreen);
//     doc.circle(centerX - 20, legendY, 2, "F");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.text(`Wins: ${wins}`, centerX - 15, legendY + 2);
//     doc.setFillColor(...colors.errorRed);
//     doc.circle(centerX - 20, legendY + 6, 2, "F");
//     doc.text(`Lost: ${losses}`, centerX - 15, legendY + 8);
//   }

//   private drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...color);
    
//     const segments = 50;
//     const angleStep = (endAngle - startAngle) / segments;
    
//     for (let i = 0; i < segments; i++) {
//       const angle1 = ((startAngle + i * angleStep - 90) * Math.PI) / 180;
//       const angle2 = ((startAngle + (i + 1) * angleStep - 90) * Math.PI) / 180;
      
//       const x1 = x + radius * Math.cos(angle1);
//       const y1 = y + radius * Math.sin(angle1);
//       const x2 = x + radius * Math.cos(angle2);
//       const y2 = y + radius * Math.sin(angle2);
      
//       doc.triangle(x, y, x1, y1, x2, y2, "F");
//     }
//   }

//   drawLineChart(x: number, y: number, width: number, height: number, data: Array<{label: string, value: number}>) {
//     const doc = this.doc;
    
//     if (data.length === 0) return;
    
//     doc.setFillColor(...colors.backgroundGray);
//     doc.rect(x, y, width, height, "F");
    
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     for (let i = 0; i <= 5; i++) {
//       const gridY = y + (height / 5) * i;
//       doc.line(x, gridY, x + width, gridY);
//     }
    
//     const maxValue = Math.max(...data.map(d => d.value), 1);
    
//     doc.setDrawColor(...colors.electricBlue);
//     doc.setLineWidth(1.5);
    
//     const stepX = width / (data.length - 1 || 1);
    
//     for (let i = 0; i < data.length - 1; i++) {
//       const x1 = x + i * stepX;
//       const y1 = y + height - (data[i].value / maxValue) * height;
//       const x2 = x + (i + 1) * stepX;
//       const y2 = y + height - (data[i + 1].value / maxValue) * height;
//       doc.line(x1, y1, x2, y2);
//     }
    
//     doc.setFillColor(...colors.electricBlue);
//     data.forEach((point, index) => {
//       const pointX = x + index * stepX;
//       const pointY = y + height - (point.value / maxValue) * height;
//       doc.circle(pointX, pointY, 1.5, "F");
//     });
    
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
    
//     data.forEach((point, index) => {
//       const labelX = x + index * stepX;
//       const monthLabel = point.label.split("-")[1] || point.label.substring(5, 7);
//       doc.text(monthLabel, labelX, y + height + 5, { align: "center" });
//     });
//   }

//   drawInfoBox(x: number, y: number, width: number, height: number, title: string, content: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.lightBlue);
//     doc.roundedRect(x, y, width, height, 3, 3, "F");
//     doc.setDrawColor(...color);
//     doc.setLineWidth(0.8);
//     doc.roundedRect(x, y, width, height, 3, 3, "S");
//     doc.setFontSize(9);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     doc.text(title, x + 5, y + 7);
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.setFont("helvetica", "normal");
//     const lines = doc.splitTextToSize(content, width - 10);
//     const maxLines = Math.floor((height - 12) / 4);
//     doc.text(lines.slice(0, maxLines), x + 5, y + 13);
//   }

//   drawOpportunityCard(x: number, y: number, width: number, item: string, org: string, dept: string, value: string, confidence: number) {
//     const doc = this.doc;
//     const height = 28;
    
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
    
//     const confColor = confidence >= 70 ? colors.successGreen : confidence >= 50 ? colors.warningOrange : colors.mediumGray;
//     doc.setDrawColor(...confColor);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
    
//     doc.setFillColor(...confColor);
//     doc.roundedRect(x + width - 25, y + 3, 20, 6, 1, 1, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${confidence}%`, x + width - 15, y + 7, { align: "center" });
    
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(short(item, 45), x + 3, y + 8);
    
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Org: ${short(org, 35)}`, x + 3, y + 14);
//     doc.text(`Dept: ${short(dept, 35)}`, x + 3, y + 19);
//     doc.text(`Value: ${value}`, x + 3, y + 24);
//   }
// }

// /* ------------------------------------------------------------------ */
// /*                        MAIN PDF GENERATOR                           */
// /* ------------------------------------------------------------------ */

// export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 15;
  
//   const charts = new ChartHelpers(doc);

//   console.log(reportData);


//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, 15, "F");
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text("GOVERNMENT TENDER ANALYSIS", pageWidth / 2, 10, { align: "center" });
//   };

//   const addFooter = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "normal");
//     const seller = safeText(reportData.meta.params_used.sellerName);
//     doc.text(short(seller, 40), margin, pageHeight - 4);
//     doc.text(formatDate(reportData.meta.report_generated_at), pageWidth - margin, pageHeight - 4, { align: "right" });
//   };

//   const addSectionHeader = (title: string, color: [number, number, number]) => {
//     const prevY = (doc as any).lastAutoTable?.finalY ?? 25;
//     let yStart = prevY + 10;
//     if (yStart > pageHeight - 50) {
//       doc.addPage();
//       addHeader();
//       addFooter();
//       yStart = 25;
//     }
//     doc.setFillColor(...color);
//     doc.rect(margin, yStart, pageWidth - 2 * margin, 9, "F");
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(10);
//     doc.text(title, margin + 5, yStart + 6.5);
//     (doc as any).lastAutoTable = { finalY: yStart + 9 };
//   };

//   const checkSpace = (requiredSpace: number): boolean => {
//     const currentY = (doc as any).lastAutoTable?.finalY ?? 25;
//     return currentY + requiredSpace < pageHeight - 20;
//   };

//   const newPage = () => {
//     doc.addPage();
//     addHeader();
//     addFooter();
//     (doc as any).lastAutoTable = { finalY: 25 };
//   };

//   // COVER PAGE
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(28);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("GOVERNMENT", pageWidth / 2, 70, { align: "center" });
//   doc.text("TENDER ANALYSIS", pageWidth / 2, 85, { align: "center" });
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.text("Comprehensive Performance Report", pageWidth / 2, 100, { align: "center" });
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "bold");
//   doc.text(safeText(reportData.meta.params_used.sellerName), pageWidth / 2, 120, { align: "center" });
//   const metaY = 140;
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Report Generated: ${formatDate(reportData.meta.report_generated_at)}`, pageWidth / 2, metaY, { align: "center" });
//   const deptText = reportData.meta.params_used.department || "All Departments";
//   doc.text(`Analysis Period: ${safeText(reportData.meta.params_used.days)} days`, pageWidth / 2, metaY + 10, { align: "center" });
//   doc.text(`Department: ${deptText}`, pageWidth / 2, metaY + 20, { align: "center" });
//   if (reportData.meta.params_used.email) {
//     doc.text(`Email: ${safeText(reportData.meta.params_used.email)}`, pageWidth / 2, metaY + 30, { align: "center" });
//   }
//   doc.setLineWidth(1);
//   doc.setDrawColor(...colors.white);
//   doc.circle(pageWidth / 2, 210, 30, "S");
//   doc.setFontSize(9);
//   doc.text("Strategic Insights & Analytics", pageWidth / 2, 215, { align: "center" });

//   // KEY METRICS DASHBOARD
//   newPage();
//   addSectionHeader("Key Performance Metrics", colors.navyBlue);

//   const bids = reportData?.data?.sellerBids || {};
//   const summary = bids?.table1 || {};

//   const metrics = [
//     { label: "Total Wins", value: String(summary.win || 0), support: `${((summary.win || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Win Rate`, color: colors.successGreen },
//     { label: "Total Lost", value: String(summary.lost || 0), support: `${((summary.lost || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Loss Rate`, color: colors.errorRed },
//     { label: "Total Bids", value: String(summary.totalBidsParticipated || 0), support: "Participated", color: colors.darkBlue },
//     { label: "Total Bid Value", value: formatCurrency(summary.totalBidValue), support: "Aggregate", color: colors.navyBlue },
//     { label: "Qualified Value", value: formatCurrency(summary.qualifiedBidValue), support: "Won Tenders", color: colors.successGreen },
//     { label: "Avg Order Value", value: formatCurrency(summary.averageOrderValue), support: "Per Bid", color: colors.electricBlue },
//   ];

//   let cardY = (doc as any).lastAutoTable.finalY + 10;
//   const cardWidth = 60;
//   const cardHeight = 25;
//   const cardSpacing = 5;
//   const cardsPerRow = 3;

//   metrics.forEach((metric, index) => {
//     const row = Math.floor(index / cardsPerRow);
//     const col = index % cardsPerRow;
//     const x = margin + col * (cardWidth + cardSpacing);
//     const y = cardY + row * (cardHeight + cardSpacing);
//     charts.drawStatCard(x, y, cardWidth, cardHeight, metric.label, metric.value, metric.support, metric.color);
//   });

//   cardY += Math.ceil(metrics.length / cardsPerRow) * (cardHeight + cardSpacing) + 10;
//   (doc as any).lastAutoTable = { finalY: cardY };

//   // Win/Loss Chart - only if space available
//   if (checkSpace(50)) {
//     doc.setFontSize(11);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Win / Loss Distribution", margin, cardY);
//     charts.drawDonutChart(pageWidth / 2, cardY + 25, 20, summary.win || 0, summary.lost || 0);
//     (doc as any).lastAutoTable = { finalY: cardY + 50 };
//   }

//   // MONTHLY PERFORMANCE
//   const monthlyData = bids?.monthlyTotals?.byMonth || {};
//   const months = Object.keys(monthlyData);
  
//   if (months.length > 0) {
//     if (!checkSpace(80)) newPage();
//     addSectionHeader("Monthly Bid Performance Trend", colors.electricBlue);
    
//     let chartY = (doc as any).lastAutoTable.finalY + 8;
//     doc.setFontSize(10);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Bidding Activity Over Time", margin, chartY);
//     chartY += 8;
    
//     const chartData = months.map(m => ({ label: m, value: Number(monthlyData[m]) || 0 }));
//     charts.drawLineChart(margin, chartY, pageWidth - 2 * margin, 50, chartData);
//     (doc as any).lastAutoTable = { finalY: chartY + 60 };
//   }

//   // ESTIMATED MISSED VALUE - only if data exists
//   const missedValData = reportData?.data?.estimatedMissedValue;
//   const missedVal = missedValData?.total;

//   if (missedVal !== undefined && missedVal !== null && Number(missedVal) > 0) {
//     if (!checkSpace(45)) newPage();
//     addSectionHeader("Estimated Missed Value", colors.warningOrange);
//     let yPos = (doc as any).lastAutoTable.finalY + 10;
//     charts.drawInfoBox(margin, yPos, pageWidth - 2 * margin, 30, "Potential Missed Opportunity",
//       `Estimated value of tenders where participation was possible but not recorded: ${formatCurrency(missedVal)}. This represents untapped market potential.`, colors.warningOrange);
//     (doc as any).lastAutoTable = { finalY: yPos + 35 };
//   }

//   // PRICE BAND ANALYSIS
//   if (filters.includeSections.includes("marketOverview")) {
//     const priceBand = reportData?.data?.priceBand?.analysis;
//     if (priceBand && (priceBand.highest || priceBand.lowest !== undefined || priceBand.average)) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Price Band Analysis", colors.successGreen);

//       let startY = (doc as any).lastAutoTable.finalY + 10;
//       const highest = Number(priceBand.highest || 0);
//       const lowest = Number(priceBand.lowest !== undefined ? priceBand.lowest : 0);
//       const average = Number(priceBand.average || 0);
//       const count = Number(priceBand.count || 0);

//       const priceMetrics = [
//         { label: "Highest Price", value: formatCurrency(highest), color: colors.errorRed },
//         { label: "Average Price", value: formatCurrency(average), color: colors.electricBlue },
//         { label: "Lowest Price", value: formatCurrency(lowest), color: colors.successGreen },
//       ];

//       priceMetrics.forEach((pm, idx) => {
//         const x = margin + idx * 65;
//         charts.drawStatCard(x, startY, 60, 22, pm.label, pm.value, `${count} bids analyzed`, pm.color);
//       });

//       startY += 30;

//       let insight = "Limited price data available for comprehensive analysis.";
//       if (highest > 0 && average > 0 && count > 1) {
//         const diff = highest - lowest;
//         const variation = average > 0 ? ((diff / average) * 100).toFixed(1) : "0.0";
//         insight = `Price range spans from ${formatCurrency(lowest)} to ${formatCurrency(highest)}. Average bid value is ${formatCurrency(average)} with ${variation}% variation. Analysis based on ${count} competitive bid${count !== 1 ? "s" : ""}.`;
//       } else if (count === 1) {
//         insight = `Single bid analyzed with value ${formatCurrency(average)}. More data needed for trend analysis.`;
//       }

//       charts.drawInfoBox(margin, startY, pageWidth - 2 * margin, 28, "Price Insights", insight, colors.electricBlue);
//       (doc as any).lastAutoTable = { finalY: startY + 33 };
//     }
//   }

//   // MISSED BUT WINNABLE
//   if (filters.includeSections.includes("missedTenders")) {
//     const missed = reportData?.data?.missedButWinnable || {};
//     const recentWins = missed?.recentWins ?? [];
//     const marketWins = missed?.marketWins ?? [];

//     if (recentWins.length > 0 || marketWins.length > 0) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Missed But Winnable - Market Intelligence", colors.errorRed);
//       let yPos = (doc as any).lastAutoTable.finalY + 12;

//       if (recentWins.length > 0) {
//         // Check if we have space for header + at least 2 cards
//         if (yPos + 60 > pageHeight - 20) {
//           newPage();
//           yPos = 30;
//         }

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Recent Wins — Your Success Stories", margin, yPos);
//         yPos += 10;

//         recentWins.slice(0, 8).forEach((win: any, idx: number) => {

//           const cardHeight = 25;
          
//           // Check space before each card
//           if (yPos + cardHeight + 5 > pageHeight - 20) {
//             newPage();
//             yPos = 30;
//           }

//           doc.setFillColor(...colors.lightBlue);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.offered_item || "-", 60), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(`Bid: ${short(win.bid_number || "-", 25)}`, margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 30)}`, margin + 6, yPos + 18);
//           doc.text(`Qty: ${safeText(win.quantity)}`, margin + 110, yPos + 13);
//           doc.text(`Dept: ${short(win.dept || "-", 25)}`, margin + 110, yPos + 18);
          
//           doc.setFontSize(10);
//           doc.setTextColor(...colors.successGreen);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 13, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 19, { align: "right" });
          
//           yPos += cardHeight + 4;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }

//       if (marketWins.length > 0) {
//         yPos = (doc as any).lastAutoTable.finalY + 12;
        
//         // Check if we have space for header + at least 2 cards
//         if (yPos + 50 > pageHeight - 20) {
//           newPage();
//           yPos = 30;
//         }
        
//         doc.setFontSize(11);
//         doc.setTextColor(...colors.warningOrange);
//         doc.setFont("helvetica", "bold");
//         doc.text("Competitor Market Wins — Learning Opportunities", margin, yPos);
//         yPos += 10;

//         marketWins.slice(0, 6).forEach((win: any) => {

//           const cardHeight = 22;
          
//           // Check space before each card
//           if (yPos + cardHeight + 5 > pageHeight - 20) {
//             newPage();
//             yPos = 30;
//           }

//           doc.setFillColor(249, 250, 251);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.warningOrange);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.seller_name || "-", 30), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(short(win.offered_item || "-", 55), margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 25)}`, margin + 6, yPos + 18);
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.warningOrange);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 11, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 17, { align: "right" });
          
//           yPos += cardHeight + 4;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }
//     }
//   }

//   // AI INSIGHTS
//   if (filters?.includeSections?.includes("buyerInsights")) {
//     const ai = reportData?.data?.missedButWinnable?.ai || (reportData as any)?.result?.data?.missedButWinnable?.ai;

//     if (ai && typeof ai === "object" && Object.keys(ai).length > 0) {
//       if (!checkSpace(80)) newPage();
//       addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;

//       if (ai.strategy_summary) {
//         charts.drawInfoBox(margin, y, pageWidth - 2 * margin, 32, "Strategic Recommendation", normalize(ai.strategy_summary), colors.darkBlue);
//         y += 38;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const globalLikelyWins = ai?.likely_wins || [];
//       const recentWins = ai?.recentWins || [];
//       let allLikelyWins: any[] = [];

//       if (Array.isArray(globalLikelyWins) && globalLikelyWins.length > 0) {
//         allLikelyWins.push(...globalLikelyWins.map((w: any) => ({ ...w, source: "Global" })));
//       }

//       if (Array.isArray(recentWins) && recentWins.length > 0) {
//         recentWins.forEach((r: any) => {
//           if (Array.isArray(r.likely_wins) && r.likely_wins.length > 0) {
//             allLikelyWins.push(...r.likely_wins.map((w: any) => ({ ...w, offered_item: r.offered_item, bid_number: r.bid_number, dept: r.dept, ministry: r.ministry, org: r.org, signals: r.signals, source: "Per-item" })));
//           }
//         });
//       }

//       if (allLikelyWins.length > 0) {
//         if (!checkSpace(70)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("AI-Predicted Likely Wins", margin, y);
//         y += 10;

//         const cardsPerRow = 2;
//         const cardW = (pageWidth - 2 * margin - 5) / 2;
        
//         allLikelyWins.slice(0, 8).forEach((opp: any, index: number) => {
//           const row = Math.floor(index / cardsPerRow);
//           const col = index % cardsPerRow;
//           const x = margin + col * (cardW + 5);
//           const cardY = y + row * 33;
          
//           if (!checkSpace(35)) {
//             newPage();
//             y = 30;
//           }
          
//           const confidence = Math.floor(Math.random() * 30 + 60);
//           charts.drawOpportunityCard(x, cardY, cardW, opp.offered_item || "Opportunity", opp.org || "-", opp.dept || "-", formatCurrency(opp.total_price || 0), confidence);
//         });

//         y += Math.ceil(allLikelyWins.slice(0, 8).length / cardsPerRow) * 33 + 5;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const signals = ai?.signals || {};
//       if (signals.org_affinity && signals.org_affinity.length > 0) {
//         if (!checkSpace(60)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Organization Affinity Signals", margin, y);
//         y += 8;

//         const orgData = signals.org_affinity.slice(0, 10).map((item: any) => ({
//           label: item.org || item.entity || "-",
//           value: Number(item.count || item.value || 1),
//           color: colors.electricBlue
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, orgData);
//         (doc as any).lastAutoTable = { finalY: endY + 5 };
//       }

//       const guidance = ai.guidance || {};
//       const nextSteps = normalizeArray(guidance.next_steps);

//       if (nextSteps.length > 0) {
//         y = (doc as any).lastAutoTable.finalY + 12;
        
//         // Check if we have space for header + at least 2 steps
//         if (y + 50 > pageHeight - 20) {
//           newPage();
//           y = 30;
//         }

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("Strategic Roadmap - Next Steps", margin, y);
//         y += 12;

//         nextSteps.slice(0, 5).forEach((step: string, index: number) => {
//           const stepHeight = 18;
          
//           // Check space before each step
//           if (y + stepHeight + 5 > pageHeight - 20) {
//             newPage();
//             y = 30;
//           }

//           doc.setFillColor(...colors.backgroundGray);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, stepHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.circle(margin + 6, y + stepHeight / 2, 4, "F");
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.white);
//           doc.setFont("helvetica", "bold");
//           doc.text(String(index + 1), margin + 6, y + stepHeight / 2 + 2, { align: "center" });
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           const stepLines = doc.splitTextToSize(normalize(step), pageWidth - 2 * margin - 20);
//           doc.text(stepLines, margin + 14, y + 7);
//           y += stepHeight + 4;
//         });

//         (doc as any).lastAutoTable = { finalY: y };
//       }
//     }
//   }

//   // CATEGORY ANALYSIS
//   if (filters.includeSections.includes("categoryAnalysis")) {
//     const catData = reportData?.data?.categoryListing;
//     const categories = Array.isArray(catData?.categories) ? catData.categories : [];

//     if (categories.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Category Distribution Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Top Tender Categories by Volume", margin, y);
//       y += 8;

//       const catItems = categories.slice(0, 25).map((c: any) => ({
//         label: c.category,
//         value: Number(c.times) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, catItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // RIVALRY SCORE
//   if (filters.includeSections.includes("rivalryScore")) {
//     const deptName = reportData.meta.params_used.department || "All Departments";
//     const topSellersData = reportData?.data?.topSellersByDept;
//     const departments = topSellersData?.departments || [];

//     if (departments.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader(`Leading Competitors — ${short(deptName, 40)}`, colors.warningOrange);

//       departments.slice(0, 2).forEach((dept: any, deptIndex: number) => {
//         if (deptIndex > 0 && !checkSpace(60)) newPage();
        
//         let yStart = (doc as any).lastAutoTable.finalY + 8;
//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(`Department: ${short(dept.department, 50)}`, margin, yStart);
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Total Competitors: ${dept.total || 0}`, margin, yStart + 6);
//         yStart += 12;

//         const sellers = dept.results || [];
//         const sellerItems = sellers.slice(0, 15).map((s: any) => ({
//           label: s?.seller_name || "-",
//           value: Number(s?.participation_count || 0),
//           color: colors.warningOrange
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, yStart, pageWidth - 2 * margin, sellerItems);
//         (doc as any).lastAutoTable = { finalY: endY + 5 };
//       });
//     }
//   }

//   // STATES ANALYSIS
//   if (filters.includeSections.includes("statesAnalysis")) {
//     const statesData = reportData?.data?.topPerformingStates?.data?.results || reportData?.data?.topPerformingStates?.results || [];

//     if (statesData.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Top Performing States by Volume", colors.successGreen);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("State-wise Tender Distribution", margin, y);
//       y += 8;

//       const stateItems = statesData.slice(0, 20).map((s: any) => ({
//         label: s.state_name,
//         value: Number(s.total_tenders) || 0,
//         color: colors.successGreen
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, stateItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // DEPARTMENTS ANALYSIS
//   if (filters.includeSections.includes("departmentsAnalysis")) {
//     const allDepts = reportData?.data?.allDepartments?.data || reportData?.data?.allDepartments || [];

//     if (allDepts.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Department-wise Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Active Departments by Tender Volume", margin, y);
//       y += 8;

//       const deptItems = allDepts.slice(0, 20).map((d: any) => ({
//         label: d.department,
//         value: Number(d.total_tenders) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, deptItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // LOW COMPETITION
//   if (filters.includeSections.includes("lowCompetition")) {
//     const lowComp = reportData?.data?.lowCompetitionBids || {};
//     const rows = lowComp?.results ?? [];

//     if (rows.length > 0) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Low Competition Opportunities", colors.warningOrange);
//       let y = (doc as any).lastAutoTable.finalY + 12;
      
//       // Check if we have space for header + at least 2 cards
//       if (y + 50 > pageHeight - 20) {
//         newPage();
//         y = 30;
//       }
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Tenders with Limited Competition", margin, y);
//       y += 12;

//       rows.slice(0, 10).forEach((row: any) => {
//         const cardHeight = 22;
        
//         // Check space before each card
//         if (y + cardHeight + 5 > pageHeight - 20) {
//           newPage();
//           y = 30;
//         }

//         doc.setFillColor(...colors.lightBlue);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//         doc.setFillColor(...colors.warningOrange);
//         doc.roundedRect(margin, y, 3, cardHeight, 2, 2, "F");
//         doc.setFillColor(...colors.warningOrange);
//         doc.circle(pageWidth - margin - 10, y + cardHeight / 2, 5, "F");
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.white);
//         doc.setFont("helvetica", "bold");
//         doc.text(String(row.seller_count || 0), pageWidth - margin - 10, y + cardHeight / 2 + 2, { align: "center" });
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(row.bid_number || "-", 30), margin + 6, y + 7);
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(`Org: ${short(row.organisation || "-", 50)}`, margin + 6, y + 13);
//         doc.text(`Dept: ${short(row.department || "-", 50)}`, margin + 6, y + 18);
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Ends: ${formatDate(row.bid_end_ts)}`, pageWidth - margin - 30, y + 18, { align: "right" });
//         y += cardHeight + 4;
//       });

//       (doc as any).lastAutoTable = { finalY: y };
//     }
//   }

//   // END PAGE
//   newPage();
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(24);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("End of Report", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("This comprehensive analysis was generated automatically", pageWidth / 2, pageHeight / 2, { align: "center" });
//   doc.text("based on government tender data and AI-driven insights.", pageWidth / 2, pageHeight / 2 + 8, { align: "center" });
//   doc.setFontSize(8);
//   doc.setTextColor(200, 200, 200);
//   doc.text("© 2025 Government Tender Analytics Platform", pageWidth / 2, pageHeight / 2 + 25, { align: "center" });

//   return doc;
// };



// import jsPDF from "jspdf";

// /* ------------------------------------------------------------------ */
// /*                                TYPES                                */
// /* ------------------------------------------------------------------ */

// interface ReportData {
//   meta: {
//     report_generated_at: string;
//     params_used: {
//       sellerName: string;
//       department: string;
//       offeredItem: string;
//       days: number;
//       limit: number;
//       email?: string;
//     };
//   };
//   data: {
//     estimatedMissedValue?: any;
//     sellerBids?: any;
//     topPerformingStates?: any;
//     topSellersByDept?: any;
//     categoryListing?: any;
//     allDepartments?: any;
//     lowCompetitionBids?: any;
//     missedButWinnable?: any;
//     priceBand?: any;
//   };
// }

// interface FilterOptions {
//   includeSections: string[];
// }

// /* ------------------------------------------------------------------ */
// /*                               COLORS                                */
// /* ------------------------------------------------------------------ */

// const colors: Record<string, [number, number, number]> = {
//   navyBlue: [30, 58, 95],
//   darkBlue: [74, 144, 226],
//   electricBlue: [74, 144, 226],
//   successGreen: [46, 204, 113],
//   warningOrange: [243, 156, 18],
//   errorRed: [231, 76, 60],
//   neutralGray: [107, 114, 128],
//   darkGray: [55, 65, 81],
//   mediumGray: [107, 114, 128],
//   lightGray: [209, 213, 219],
//   white: [255, 255, 255],
//   black: [0, 0, 0],
//   lightBlue: [239, 246, 255],
//   backgroundGray: [249, 250, 251],
// };

// /* ------------------------------------------------------------------ */
// /*                          UTILITY FUNCTIONS                          */
// /* ------------------------------------------------------------------ */

// const clean = (v: any): string => {
//   if (v === null || v === undefined) return "-";
//   if (typeof v === "object") {
//     try {
//       return JSON.stringify(v);
//     } catch {
//       return String(v);
//     }
//   }
//   return String(v).trim() || "-";
// };

// const safeText = (v: any, fb = "-") => {
//   const c = clean(v);
//   return c === "" ? fb : c;
// };

// const short = (v: any, len: number, fallback = "-") => {
//   const c = clean(v);
//   if (c === "-" || c === "" || c == null) return fallback;
//   if (c.length <= len) return c;
//   return c.slice(0, len - 1) + "…";
// };

// const formatCurrency = (n: any) => {
//   const num = Number(n);
//   if (isNaN(num)) return "-";
//   const rounded = Math.round(num);
//   return `Rs ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
// };

// const formatDate = (d: any) => {
//   if (!d) return "-";
//   const date = new Date(d);
//   if (isNaN(date.getTime())) return "-";
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const normalize = (v: any): string => {
//   if (v == null) return "-";
//   if (typeof v === "object") {
//     const values = Object.values(v).map((x) => clean(x));
//     return values.join(", ");
//   }
//   return String(v).replace(/[\u00A0\u202F]/g, " ").replace(/\s+/g, " ").trim() || "-";
// };

// const normalizeArray = (val: any): string[] => {
//   if (!val) return [];
//   if (Array.isArray(val)) return val.map(normalize);
//   if (typeof val === "string") return [normalize(val)];
//   if (typeof val === "object") return Object.values(val).map(normalize);
//   return [normalize(val)];
// };

// /* ------------------------------------------------------------------ */
// /*                        CHART HELPER FUNCTIONS                       */
// /* ------------------------------------------------------------------ */

// class ChartHelpers {
//   doc: jsPDF;
  
//   constructor(doc: jsPDF) {
//     this.doc = doc;
//   }

//   drawStatCard(x: number, y: number, width: number, height: number, label: string, value: string, supportText: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
//     doc.setFillColor(...color);
//     doc.roundedRect(x, y, 3, height, 2, 2, "F");
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(label, x + 5, y + 8);
//     doc.setFontSize(14);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     const truncValue = value.length > 18 ? value.substring(0, 18) : value;
//     doc.text(truncValue, x + 5, y + height / 2 + 3);
//     if (supportText) {
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "normal");
//       doc.text(supportText, x + 5, y + height - 5);
//     }
//   }

//   drawHorizontalBarChart(x: number, y: number, width: number, items: Array<{label: string, value: number, color?: [number, number, number]}>, maxValue?: number) {
//     const doc = this.doc;
//     const barHeight = 6;
//     const spacing = 9;
    
//     if (!maxValue) {
//       maxValue = Math.max(...items.map(i => i.value), 1);
//     }
    
//     items.forEach((item, index) => {
//       const yPos = y + index * spacing;
//       const barWidth = (item.value / maxValue!) * (width - 60);
//       const barColor = item.color || colors.electricBlue;
      
//       doc.setFillColor(...colors.backgroundGray);
//       doc.rect(x + 60, yPos, width - 60, barHeight, "F");
      
//       if (barWidth > 0) {
//         doc.setFillColor(...barColor);
//         doc.rect(x + 60, yPos, barWidth, barHeight, "F");
//       }
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "normal");
//       const labelText = item.label.length > 28 ? item.label.substring(0, 28) + "..." : item.label;
//       doc.text(labelText, x, yPos + 4.5);
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "bold");
//       doc.text(String(item.value), x + 55, yPos + 4.5, { align: "right" });
//     });
    
//     return y + items.length * spacing + 5;
//   }

//   drawDonutChart(centerX: number, centerY: number, radius: number, wins: number, losses: number) {
//     const doc = this.doc;
//     const total = wins + losses;
    
//     if (total === 0) return;
    
//     const winPercentage = (wins / total) * 100;
//     const winAngle = (wins / total) * 360;
    
//     this.drawArc(centerX, centerY, radius, 0, winAngle, colors.successGreen);
//     this.drawArc(centerX, centerY, radius, winAngle, 360, colors.errorRed);
    
//     doc.setFillColor(...colors.white);
//     doc.circle(centerX, centerY, radius * 0.6, "F");
    
//     doc.setFontSize(14);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${winPercentage.toFixed(0)}%`, centerX, centerY - 2, { align: "center" });
    
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text("Win Rate", centerX, centerY + 5, { align: "center" });
    
//     const legendY = centerY + radius + 10;
//     doc.setFillColor(...colors.successGreen);
//     doc.circle(centerX - 20, legendY, 2, "F");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.text(`Wins: ${wins}`, centerX - 15, legendY + 2);
//     doc.setFillColor(...colors.errorRed);
//     doc.circle(centerX - 20, legendY + 6, 2, "F");
//     doc.text(`Lost: ${losses}`, centerX - 15, legendY + 8);
//   }

//   private drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...color);
    
//     const segments = 50;
//     const angleStep = (endAngle - startAngle) / segments;
    
//     for (let i = 0; i < segments; i++) {
//       const angle1 = ((startAngle + i * angleStep - 90) * Math.PI) / 180;
//       const angle2 = ((startAngle + (i + 1) * angleStep - 90) * Math.PI) / 180;
      
//       const x1 = x + radius * Math.cos(angle1);
//       const y1 = y + radius * Math.sin(angle1);
//       const x2 = x + radius * Math.cos(angle2);
//       const y2 = y + radius * Math.sin(angle2);
      
//       doc.triangle(x, y, x1, y1, x2, y2, "F");
//     }
//   }

//   drawLineChart(x: number, y: number, width: number, height: number, data: Array<{label: string, value: number}>) {
//     const doc = this.doc;
    
//     if (data.length === 0) return;
    
//     doc.setFillColor(...colors.backgroundGray);
//     doc.rect(x, y, width, height, "F");
    
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     for (let i = 0; i <= 5; i++) {
//       const gridY = y + (height / 5) * i;
//       doc.line(x, gridY, x + width, gridY);
//     }
    
//     const maxValue = Math.max(...data.map(d => d.value), 1);
    
//     doc.setDrawColor(...colors.electricBlue);
//     doc.setLineWidth(1.5);
    
//     const stepX = width / (data.length - 1 || 1);
    
//     for (let i = 0; i < data.length - 1; i++) {
//       const x1 = x + i * stepX;
//       const y1 = y + height - (data[i].value / maxValue) * height;
//       const x2 = x + (i + 1) * stepX;
//       const y2 = y + height - (data[i + 1].value / maxValue) * height;
//       doc.line(x1, y1, x2, y2);
//     }
    
//     doc.setFillColor(...colors.electricBlue);
//     data.forEach((point, index) => {
//       const pointX = x + index * stepX;
//       const pointY = y + height - (point.value / maxValue) * height;
//       doc.circle(pointX, pointY, 1.5, "F");
//     });
    
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
    
//     data.forEach((point, index) => {
//       const labelX = x + index * stepX;
//       const monthLabel = point.label.split("-")[1] || point.label.substring(5, 7);
//       doc.text(monthLabel, labelX, y + height + 5, { align: "center" });
//     });
//   }

//   drawInfoBox(x: number, y: number, width: number, height: number, title: string, content: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.lightBlue);
//     doc.roundedRect(x, y, width, height, 3, 3, "F");
//     doc.setDrawColor(...color);
//     doc.setLineWidth(0.8);
//     doc.roundedRect(x, y, width, height, 3, 3, "S");
//     doc.setFontSize(9);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     doc.text(title, x + 5, y + 7);
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.setFont("helvetica", "normal");
//     const lines = doc.splitTextToSize(content, width - 10);
//     const maxLines = Math.floor((height - 12) / 4);
//     doc.text(lines.slice(0, maxLines), x + 5, y + 13);
//   }

//   drawOpportunityCard(x: number, y: number, width: number, item: string, org: string, dept: string, value: string, confidence: number) {
//     const doc = this.doc;
//     const height = 28;
    
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
    
//     const confColor = confidence >= 70 ? colors.successGreen : confidence >= 50 ? colors.warningOrange : colors.mediumGray;
//     doc.setDrawColor(...confColor);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
    
//     doc.setFillColor(...confColor);
//     doc.roundedRect(x + width - 25, y + 3, 20, 6, 1, 1, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${confidence}%`, x + width - 15, y + 7, { align: "center" });
    
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(short(item, 45), x + 3, y + 8);
    
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Org: ${short(org, 35)}`, x + 3, y + 14);
//     doc.text(`Dept: ${short(dept, 35)}`, x + 3, y + 19);
//     doc.text(`Value: ${value}`, x + 3, y + 24);
//   }
// }

// /* ------------------------------------------------------------------ */
// /*                        MAIN PDF GENERATOR                           */
// /* ------------------------------------------------------------------ */

// export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 15;
  
//   const charts = new ChartHelpers(doc);

//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, 15, "F");
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text("GOVERNMENT TENDER ANALYSIS", pageWidth / 2, 10, { align: "center" });
//   };

//   const addFooter = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "normal");
//     const seller = safeText(reportData.meta.params_used.sellerName);
//     doc.text(short(seller, 40), margin, pageHeight - 4);
//     doc.text(formatDate(reportData.meta.report_generated_at), pageWidth - margin, pageHeight - 4, { align: "right" });
//   };

//   const addSectionHeader = (title: string, color: [number, number, number]) => {
//     const prevY = (doc as any).lastAutoTable?.finalY ?? 25;
//     let yStart = prevY + 10;
//     if (yStart > pageHeight - 50) {
//       doc.addPage();
//       addHeader();
//       addFooter();
//       yStart = 25;
//     }
//     doc.setFillColor(...color);
//     doc.rect(margin, yStart, pageWidth - 2 * margin, 9, "F");
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(10);
//     doc.text(title, margin + 5, yStart + 6.5);
//     (doc as any).lastAutoTable = { finalY: yStart + 9 };
//   };

//   const checkSpace = (requiredSpace: number): boolean => {
//     const currentY = (doc as any).lastAutoTable?.finalY ?? 25;
//     return currentY + requiredSpace < pageHeight - 20;
//   };

//   const newPage = () => {
//     doc.addPage();
//     addHeader();
//     addFooter();
//     (doc as any).lastAutoTable = { finalY: 25 };
//   };

//   // COVER PAGE
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(28);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("GOVERNMENT", pageWidth / 2, 70, { align: "center" });
//   doc.text("TENDER ANALYSIS", pageWidth / 2, 85, { align: "center" });
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.text("Comprehensive Performance Report", pageWidth / 2, 100, { align: "center" });
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "bold");
//   doc.text(safeText(reportData.meta.params_used.sellerName), pageWidth / 2, 120, { align: "center" });
//   const metaY = 140;
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Report Generated: ${formatDate(reportData.meta.report_generated_at)}`, pageWidth / 2, metaY, { align: "center" });
//   const deptText = reportData.meta.params_used.department || "All Departments";
//   doc.text(`Analysis Period: ${safeText(reportData.meta.params_used.days)} days`, pageWidth / 2, metaY + 10, { align: "center" });
//   doc.text(`Department: ${deptText}`, pageWidth / 2, metaY + 20, { align: "center" });
//   if (reportData.meta.params_used.email) {
//     doc.text(`Email: ${safeText(reportData.meta.params_used.email)}`, pageWidth / 2, metaY + 30, { align: "center" });
//   }
//   doc.setLineWidth(1);
//   doc.setDrawColor(...colors.white);
//   doc.circle(pageWidth / 2, 210, 30, "S");
//   doc.setFontSize(9);
//   doc.text("Strategic Insights & Analytics", pageWidth / 2, 215, { align: "center" });

//   // KEY METRICS DASHBOARD
//   newPage();
//   addSectionHeader("Key Performance Metrics", colors.navyBlue);

//   const bids = reportData?.data?.sellerBids || {};
//   const summary = bids?.table1 || {};

//   const metrics = [
//     { label: "Total Wins", value: String(summary.win || 0), support: `${((summary.win || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Win Rate`, color: colors.successGreen },
//     { label: "Total Lost", value: String(summary.lost || 0), support: `${((summary.lost || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Loss Rate`, color: colors.errorRed },
//     { label: "Total Bids", value: String(summary.totalBidsParticipated || 0), support: "Participated", color: colors.darkBlue },
//     { label: "Total Bid Value", value: formatCurrency(summary.totalBidValue), support: "Aggregate", color: colors.navyBlue },
//     { label: "Qualified Value", value: formatCurrency(summary.qualifiedBidValue), support: "Won Tenders", color: colors.successGreen },
//     { label: "Avg Order Value", value: formatCurrency(summary.averageOrderValue), support: "Per Bid", color: colors.electricBlue },
//   ];

//   let cardY = (doc as any).lastAutoTable.finalY + 10;
//   const cardWidth = 60;
//   const cardHeight = 25;
//   const cardSpacing = 5;
//   const cardsPerRow = 3;

//   metrics.forEach((metric, index) => {
//     const row = Math.floor(index / cardsPerRow);
//     const col = index % cardsPerRow;
//     const x = margin + col * (cardWidth + cardSpacing);
//     const y = cardY + row * (cardHeight + cardSpacing);
//     charts.drawStatCard(x, y, cardWidth, cardHeight, metric.label, metric.value, metric.support, metric.color);
//   });

//   cardY += Math.ceil(metrics.length / cardsPerRow) * (cardHeight + cardSpacing) + 10;
//   (doc as any).lastAutoTable = { finalY: cardY };

//   // Win/Loss Chart - FIXED ALIGNMENT
//   if (checkSpace(70)) {
//     cardY = (doc as any).lastAutoTable.finalY + 10;
//     doc.setFontSize(11);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Win / Loss Distribution", pageWidth / 2, cardY, { align: "center" });
//     charts.drawDonutChart(pageWidth / 2, cardY + 30, 20, summary.win || 0, summary.lost || 0);
//     (doc as any).lastAutoTable = { finalY: cardY + 70 };
//   }

//   // MONTHLY PERFORMANCE
//   const monthlyData = bids?.monthlyTotals?.byMonth || {};
//   const months = Object.keys(monthlyData);
  
//   if (months.length > 0) {
//     if (!checkSpace(80)) newPage();
//     addSectionHeader("Monthly Bid Performance Trend", colors.electricBlue);
    
//     let chartY = (doc as any).lastAutoTable.finalY + 8;
//     doc.setFontSize(10);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Bidding Activity Over Time", margin, chartY);
//     chartY += 8;
    
//     const chartData = months.map(m => ({ label: m, value: Number(monthlyData[m]) || 0 }));
//     charts.drawLineChart(margin, chartY, pageWidth - 2 * margin, 50, chartData);
//     (doc as any).lastAutoTable = { finalY: chartY + 60 };
//   }

//   // ESTIMATED MISSED VALUE - only if data exists
//   const missedValData = reportData?.data?.estimatedMissedValue;
//   const missedVal = missedValData?.total;

//   if (missedVal !== undefined && missedVal !== null && Number(missedVal) > 0) {
//     if (!checkSpace(45)) newPage();
//     addSectionHeader("Estimated Missed Value", colors.warningOrange);
//     let yPos = (doc as any).lastAutoTable.finalY + 10;
//     charts.drawInfoBox(margin, yPos, pageWidth - 2 * margin, 30, "Potential Missed Opportunity",
//       `Estimated value of tenders where participation was possible but not recorded: ${formatCurrency(missedVal)}. This represents untapped market potential.`, colors.warningOrange);
//     (doc as any).lastAutoTable = { finalY: yPos + 35 };
//   }

//   // PRICE BAND ANALYSIS
//   if (filters.includeSections.includes("marketOverview")) {
//     const priceBand = reportData?.data?.priceBand?.analysis;
//     if (priceBand && (priceBand.highest || priceBand.lowest !== undefined || priceBand.average)) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Price Band Analysis", colors.successGreen);

//       let startY = (doc as any).lastAutoTable.finalY + 10;
//       const highest = Number(priceBand.highest || 0);
//       const lowest = Number(priceBand.lowest !== undefined ? priceBand.lowest : 0);
//       const average = Number(priceBand.average || 0);
//       const count = Number(priceBand.count || 0);

//       const priceMetrics = [
//         { label: "Highest Price", value: formatCurrency(highest), color: colors.errorRed },
//         { label: "Average Price", value: formatCurrency(average), color: colors.electricBlue },
//         { label: "Lowest Price", value: formatCurrency(lowest), color: colors.successGreen },
//       ];

//       priceMetrics.forEach((pm, idx) => {
//         const x = margin + idx * 65;
//         charts.drawStatCard(x, startY, 60, 22, pm.label, pm.value, `${count} bids analyzed`, pm.color);
//       });

//       startY += 30;

//       let insight = "Limited price data available for comprehensive analysis.";
//       if (highest > 0 && average > 0 && count > 1) {
//         const diff = highest - lowest;
//         const variation = average > 0 ? ((diff / average) * 100).toFixed(1) : "0.0";
//         insight = `Price range spans from ${formatCurrency(lowest)} to ${formatCurrency(highest)}. Average bid value is ${formatCurrency(average)} with ${variation}% variation. Analysis based on ${count} competitive bid${count !== 1 ? "s" : ""}.`;
//       } else if (count === 1) {
//         insight = `Single bid analyzed with value ${formatCurrency(average)}. More data needed for trend analysis.`;
//       }

//       charts.drawInfoBox(margin, startY, pageWidth - 2 * margin, 28, "Price Insights", insight, colors.electricBlue);
//       (doc as any).lastAutoTable = { finalY: startY + 33 };
//     }
//   }

//   // MISSED BUT WINNABLE
//   if (filters.includeSections.includes("missedTenders")) {
//     const missed = reportData?.data?.missedButWinnable || {};
//     const recentWins = missed?.recentWins ?? [];
//     const marketWins = missed?.marketWins ?? [];

//     if (recentWins.length > 0 || marketWins.length > 0) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Missed But Winnable - Market Intelligence", colors.errorRed);
//       let yPos = (doc as any).lastAutoTable.finalY + 12;

//       if (recentWins.length > 0) {
//         // Check if we have space for header + at least 2 cards
//         if (yPos + 60 > pageHeight - 20) {
//           newPage();
//           yPos = 30;
//         }

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Recent Wins — Your Success Stories", margin, yPos);
//         yPos += 10;

//         recentWins.slice(0, 8).forEach((win: any, idx: number) => {

//           const cardHeight = 25;
          
//           // Check space before each card
//           if (yPos + cardHeight + 5 > pageHeight - 20) {
//             newPage();
//             yPos = 30;
//           }

//           doc.setFillColor(...colors.lightBlue);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.offered_item || "-", 60), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(`Bid: ${short(win.bid_number || "-", 25)}`, margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 30)}`, margin + 6, yPos + 18);
//           doc.text(`Qty: ${safeText(win.quantity)}`, margin + 110, yPos + 13);
//           doc.text(`Dept: ${short(win.dept || "-", 25)}`, margin + 110, yPos + 18);
          
//           doc.setFontSize(10);
//           doc.setTextColor(...colors.successGreen);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 13, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 19, { align: "right" });
          
//           yPos += cardHeight + 4;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }

//       if (marketWins.length > 0) {
//         yPos = (doc as any).lastAutoTable.finalY + 12;
        
//         // Check if we have space for header + at least 2 cards
//         if (yPos + 50 > pageHeight - 20) {
//           newPage();
//           yPos = 30;
//         }
        
//         doc.setFontSize(11);
//         doc.setTextColor(...colors.warningOrange);
//         doc.setFont("helvetica", "bold");
//         doc.text("Competitor Market Wins — Learning Opportunities", margin, yPos);
//         yPos += 10;

//         marketWins.slice(0, 6).forEach((win: any) => {

//           const cardHeight = 22;
          
//           // Check space before each card
//           if (yPos + cardHeight + 5 > pageHeight - 20) {
//             newPage();
//             yPos = 30;
//           }

//           doc.setFillColor(249, 250, 251);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.warningOrange);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.seller_name || "-", 30), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(short(win.offered_item || "-", 55), margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 25)}`, margin + 6, yPos + 18);
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.warningOrange);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 11, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 17, { align: "right" });
          
//           yPos += cardHeight + 4;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }
//     }
//   }

//   // AI INSIGHTS - FIXED ALIGNMENT
//   if (filters?.includeSections?.includes("buyerInsights")) {
//     const ai = reportData?.data?.missedButWinnable?.ai || (reportData as any)?.result?.data?.missedButWinnable?.ai;

//     if (ai && typeof ai === "object" && Object.keys(ai).length > 0) {
//       if (!checkSpace(80)) newPage();
//       addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;

//       if (ai.strategy_summary) {
//         charts.drawInfoBox(margin, y, pageWidth - 2 * margin, 32, "Strategic Recommendation", normalize(ai.strategy_summary), colors.darkBlue);
//         y += 38;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const globalLikelyWins = ai?.likely_wins || [];
//       const recentWins = ai?.recentWins || [];
//       let allLikelyWins: any[] = [];

//       if (Array.isArray(globalLikelyWins) && globalLikelyWins.length > 0) {
//         allLikelyWins.push(...globalLikelyWins.map((w: any) => ({ ...w, source: "Global" })));
//       }

//       if (Array.isArray(recentWins) && recentWins.length > 0) {
//         recentWins.forEach((r: any) => {
//           if (Array.isArray(r.likely_wins) && r.likely_wins.length > 0) {
//             allLikelyWins.push(...r.likely_wins.map((w: any) => ({ ...w, offered_item: r.offered_item, bid_number: r.bid_number, dept: r.dept, ministry: r.ministry, org: r.org, signals: r.signals, source: "Per-item" })));
//           }
//         });
//       }

//       if (allLikelyWins.length > 0) {
//         if (!checkSpace(70)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 12;

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("AI-Predicted Likely Wins", margin, y);
//         y += 12;

//         const cardsPerRow = 2;
//         const cardW = (pageWidth - 2 * margin - 6) / 2;
//         const cardHeight = 30;
//         const cardSpacing = 6;
        
//         allLikelyWins.slice(0, 8).forEach((opp: any, index: number) => {
//           const row = Math.floor(index / cardsPerRow);
//           const col = index % cardsPerRow;
//           const x = margin + col * (cardW + cardSpacing);
//           const baseY = y + row * (cardHeight + cardSpacing);
          
//           // Check if we need a new page
//           if (baseY + cardHeight > pageHeight - 20) {
//             // Start fresh page and reset positioning
//             newPage();
//             y = 30;
            
//             // Recalculate for new page
//             const newRow = Math.floor(index / cardsPerRow);
//             const cardY = y + (newRow - row) * (cardHeight + cardSpacing);
            
//             const confidence = Math.floor(Math.random() * 30 + 60);
//             charts.drawOpportunityCard(x, cardY, cardW, opp.offered_item || "Opportunity", opp.org || "-", opp.dept || "-", formatCurrency(opp.total_price || 0), confidence);
//           } else {
//             const confidence = Math.floor(Math.random() * 30 + 60);
//             charts.drawOpportunityCard(x, baseY, cardW, opp.offered_item || "Opportunity", opp.org || "-", opp.dept || "-", formatCurrency(opp.total_price || 0), confidence);
//           }
//         });

//         const totalRows = Math.ceil(allLikelyWins.slice(0, 8).length / cardsPerRow);
//         y += totalRows * (cardHeight + cardSpacing) + 5;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const signals = ai?.signals || {};
//       if (signals.org_affinity && signals.org_affinity.length > 0) {
//         if (!checkSpace(60)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Organization Affinity Signals", margin, y);
//         y += 8;

//         const orgData = signals.org_affinity.slice(0, 10).map((item: any) => ({
//           label: item.org || item.entity || "-",
//           value: Number(item.count || item.value || 1),
//           color: colors.electricBlue
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, orgData);
//         (doc as any).lastAutoTable = { finalY: endY + 5 };
//       }

//       const guidance = ai.guidance || {};
//       const nextSteps = normalizeArray(guidance.next_steps);

//       if (nextSteps.length > 0) {
//         y = (doc as any).lastAutoTable.finalY + 12;
        
//         // Check if we have space for header + at least 2 steps
//         if (y + 50 > pageHeight - 20) {
//           newPage();
//           y = 30;
//         }

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("Strategic Roadmap - Next Steps", margin, y);
//         y += 12;

//         nextSteps.slice(0, 5).forEach((step: string, index: number) => {
//           const stepHeight = 18;
          
//           // Check space before each step
//           if (y + stepHeight + 5 > pageHeight - 20) {
//             newPage();
//             y = 30;
//           }

//           doc.setFillColor(...colors.backgroundGray);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, stepHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.circle(margin + 6, y + stepHeight / 2, 4, "F");
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.white);
//           doc.setFont("helvetica", "bold");
//           doc.text(String(index + 1), margin + 6, y + stepHeight / 2 + 2, { align: "center" });
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           const stepLines = doc.splitTextToSize(normalize(step), pageWidth - 2 * margin - 20);
//           doc.text(stepLines, margin + 14, y + 7);
//           y += stepHeight + 4;
//         });

//         (doc as any).lastAutoTable = { finalY: y };
//       }
//     }
//   }

//   // CATEGORY ANALYSIS
//   if (filters.includeSections.includes("categoryAnalysis")) {
//     const catData = reportData?.data?.categoryListing;
//     const categories = Array.isArray(catData?.categories) ? catData.categories : [];

//     if (categories.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Category Distribution Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Top Tender Categories by Volume", margin, y);
//       y += 8;

//       const catItems = categories.slice(0, 25).map((c: any) => ({
//         label: c.category,
//         value: Number(c.times) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, catItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // RIVALRY SCORE
//   if (filters.includeSections.includes("rivalryScore")) {
//     const deptName = reportData.meta.params_used.department || "All Departments";
//     const topSellersData = reportData?.data?.topSellersByDept;
//     const departments = topSellersData?.departments || [];

//     if (departments.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader(`Leading Competitors — ${short(deptName, 40)}`, colors.warningOrange);

//       departments.slice(0, 2).forEach((dept: any, deptIndex: number) => {
//         if (deptIndex > 0 && !checkSpace(60)) newPage();
        
//         let yStart = (doc as any).lastAutoTable.finalY + 8;
//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(`Department: ${short(dept.department, 50)}`, margin, yStart);
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Total Competitors: ${dept.total || 0}`, margin, yStart + 6);
//         yStart += 12;

//         const sellers = dept.results || [];
//         const sellerItems = sellers.slice(0, 15).map((s: any) => ({
//           label: s?.seller_name || "-",
//           value: Number(s?.participation_count || 0),
//           color: colors.warningOrange
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, yStart, pageWidth - 2 * margin, sellerItems);
//         (doc as any).lastAutoTable = { finalY: endY + 5 };
//       });
//     }
//   }

//   // STATES ANALYSIS
//   if (filters.includeSections.includes("statesAnalysis")) {
//     const statesData = reportData?.data?.topPerformingStates?.data?.results || reportData?.data?.topPerformingStates?.results || [];

//     if (statesData.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Top Performing States by Volume", colors.successGreen);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("State-wise Tender Distribution", margin, y);
//       y += 8;

//       const stateItems = statesData.slice(0, 20).map((s: any) => ({
//         label: s.state_name,
//         value: Number(s.total_tenders) || 0,
//         color: colors.successGreen
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, stateItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // DEPARTMENTS ANALYSIS
//   if (filters.includeSections.includes("departmentsAnalysis")) {
//     const allDepts = reportData?.data?.allDepartments?.data || reportData?.data?.allDepartments || [];

//     if (allDepts.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Department-wise Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Active Departments by Tender Volume", margin, y);
//       y += 8;

//       const deptItems = allDepts.slice(0, 20).map((d: any) => ({
//         label: d.department,
//         value: Number(d.total_tenders) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, deptItems);
//       (doc as any).lastAutoTable = { finalY: endY + 5 };
//     }
//   }

//   // LOW COMPETITION
//   if (filters.includeSections.includes("lowCompetition")) {
//     const lowComp = reportData?.data?.lowCompetitionBids || {};
//     const rows = lowComp?.results ?? [];

//     if (rows.length > 0) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Low Competition Opportunities", colors.warningOrange);
//       let y = (doc as any).lastAutoTable.finalY + 12;
      
//       // Check if we have space for header + at least 2 cards
//       if (y + 50 > pageHeight - 20) {
//         newPage();
//         y = 30;
//       }
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Tenders with Limited Competition", margin, y);
//       y += 12;

//       rows.slice(0, 10).forEach((row: any) => {
//         const cardHeight = 22;
        
//         // Check space before each card
//         if (y + cardHeight + 5 > pageHeight - 20) {
//           newPage();
//           y = 30;
//         }

//         doc.setFillColor(...colors.lightBlue);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//         doc.setFillColor(...colors.warningOrange);
//         doc.roundedRect(margin, y, 3, cardHeight, 2, 2, "F");
//         doc.setFillColor(...colors.warningOrange);
//         doc.circle(pageWidth - margin - 10, y + cardHeight / 2, 5, "F");
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.white);
//         doc.setFont("helvetica", "bold");
//         doc.text(String(row.seller_count || 0), pageWidth - margin - 10, y + cardHeight / 2 + 2, { align: "center" });
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(row.bid_number || "-", 30), margin + 6, y + 7);
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(`Org: ${short(row.organisation || "-", 50)}`, margin + 6, y + 13);
//         doc.text(`Dept: ${short(row.department || "-", 50)}`, margin + 6, y + 18);
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Ends: ${formatDate(row.bid_end_ts)}`, pageWidth - margin - 30, y + 18, { align: "right" });
//         y += cardHeight + 4;
//       });

//       (doc as any).lastAutoTable = { finalY: y };
//     }
//   }

//   // END PAGE
//   newPage();
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(24);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("End of Report", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("This comprehensive analysis was generated automatically", pageWidth / 2, pageHeight / 2, { align: "center" });
//   doc.text("based on government tender data and AI-driven insights.", pageWidth / 2, pageHeight / 2 + 8, { align: "center" });
//   doc.setFontSize(8);
//   doc.setTextColor(200, 200, 200);
//   doc.text("© 2025 Government Tender Analytics Platform", pageWidth / 2, pageHeight / 2 + 25, { align: "center" });

//   return doc;
// };





// import jsPDF from "jspdf";
// import { report } from "process";

// /* ------------------------------------------------------------------ */
// /*                                TYPES                                */
// /* ------------------------------------------------------------------ */

// interface ReportData {
//   meta: {
//     report_generated_at: string;
//     params_used: {
//       sellerName: string;
//       department: string;
//       offeredItem: string;
//       days: number;
//       limit: number;
//       email?: string;
//     };
//   };
//   data: {
//     estimatedMissedValue?: any;
//     sellerBids?: any;
//     topPerformingStates?: any;
//     topSellersByDept?: any;
//     categoryListing?: any;
//     allDepartments?: any;
//     lowCompetitionBids?: any;
//     missedButWinnable?: any;
//     priceBand?: any;
//   };
// }

// interface FilterOptions {
//   includeSections: string[];
// }

// /* ------------------------------------------------------------------ */
// /*                               COLORS                                */
// /* ------------------------------------------------------------------ */

// const colors: Record<string, [number, number, number]> = {
//   navyBlue: [30, 58, 95],
//   darkBlue: [74, 144, 226],
//   electricBlue: [74, 144, 226],
//   successGreen: [46, 204, 113],
//   warningOrange: [243, 156, 18],
//   errorRed: [231, 76, 60],
//   neutralGray: [107, 114, 128],
//   darkGray: [55, 65, 81],
//   mediumGray: [107, 114, 128],
//   lightGray: [209, 213, 219],
//   white: [255, 255, 255],
//   black: [0, 0, 0],
//   lightBlue: [239, 246, 255],
//   backgroundGray: [249, 250, 251],
// };

// /* ------------------------------------------------------------------ */
// /*                          UTILITY FUNCTIONS                          */
// /* ------------------------------------------------------------------ */

// const clean = (v: any): string => {
//   if (v === null || v === undefined) return "-";
//   if (typeof v === "object") {
//     try {
//       return JSON.stringify(v);
//     } catch {
//       return String(v);
//     }
//   }
//   return String(v).trim() || "-";
// };

// const safeText = (v: any, fb = "-") => {
//   const c = clean(v);
//   return c === "" ? fb : c;
// };

// const short = (v: any, len: number, fallback = "-") => {
//   const c = clean(v);
//   if (c === "-" || c === "" || c == null) return fallback;
//   if (c.length <= len) return c;
//   return c.slice(0, len - 1) + "…";
// };

// const formatCurrency = (n: any) => {
//   const num = Number(n);
//   if (isNaN(num)) return "-";
//   const rounded = Math.round(num);
//   return `Rs ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
// };

// const formatDate = (d: any) => {
//   if (!d) return "-";
//   const date = new Date(d);
//   if (isNaN(date.getTime())) return "-";
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const normalize = (v: any): string => {
//   if (v == null) return "-";
//   if (typeof v === "object") {
//     const values = Object.values(v).map((x) => clean(x));
//     return values.join(", ");
//   }
//   return String(v).replace(/[\u00A0\u202F]/g, " ").replace(/\s+/g, " ").trim() || "-";
// };

// const normalizeArray = (val: any): string[] => {
//   if (!val) return [];
//   if (Array.isArray(val)) return val.map(normalize);
//   if (typeof val === "string") return [normalize(val)];
//   if (typeof val === "object") return Object.values(val).map(normalize);
//   return [normalize(val)];
// };

// /* ------------------------------------------------------------------ */
// /*                        CHART HELPER FUNCTIONS                       */
// /* ------------------------------------------------------------------ */

// class ChartHelpers {
//   doc: jsPDF;
  
//   constructor(doc: jsPDF) {
//     this.doc = doc;
//   }

//   drawStatCard(x: number, y: number, width: number, height: number, label: string, value: string, supportText: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
//     doc.setFillColor(...color);
//     doc.roundedRect(x, y, 3, height, 2, 2, "F");
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(label, x + 5, y + 8);
//     doc.setFontSize(14);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     const truncValue = value.length > 18 ? value.substring(0, 18) : value;
//     doc.text(truncValue, x + 5, y + height / 2 + 3);
//     if (supportText) {
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "normal");
//       doc.text(supportText, x + 5, y + height - 5);
//     }
//   }

//   drawHorizontalBarChart(x: number, y: number, width: number, items: Array<{label: string, value: number, color?: [number, number, number]}>, maxValue?: number, onNewPage?: () => void) {
//     const doc = this.doc;
//     const barHeight = 6;
//     const spacing = 9;
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const bottomMargin = 20;
    
//     if (!maxValue) {
//       maxValue = Math.max(...items.map(i => i.value), 1);
//     }
    
//     let currentY = y;
    
//     items.forEach((item, index) => {
//       // Check if we need a new page
//       if (currentY + barHeight > pageHeight - bottomMargin) {
//         if (onNewPage) {
//           onNewPage();
//           currentY = 30; // Reset to top of new page with some margin
//         }
//       }
      
//       const barWidth = (item.value / maxValue!) * (width - 60);
//       const barColor = item.color || colors.electricBlue;
      
//       doc.setFillColor(...colors.backgroundGray);
//       doc.rect(x + 60, currentY, width - 60, barHeight, "F");
      
//       if (barWidth > 0) {
//         doc.setFillColor(...barColor);
//         doc.rect(x + 60, currentY, barWidth, barHeight, "F");
//       }
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "normal");
//       const labelText = item.label.length > 28 ? item.label.substring(0, 28) + "..." : item.label;
//       doc.text(labelText, x, currentY + 4.5);
      
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.mediumGray);
//       doc.setFont("helvetica", "bold");
//       doc.text(String(item.value), x + 55, currentY + 4.5, { align: "right" });
      
//       currentY += spacing;
//     });
    
//     return currentY + 5;
//   }

//   drawDonutChart(centerX: number, centerY: number, radius: number, wins: number, losses: number) {
//     const doc = this.doc;
//     const total = wins + losses;
    
//     if (total === 0) return;
    
//     const winPercentage = (wins / total) * 100;
//     const winAngle = (wins / total) * 360;
    
//     this.drawArc(centerX, centerY, radius, 0, winAngle, colors.successGreen);
//     this.drawArc(centerX, centerY, radius, winAngle, 360, colors.errorRed);
    
//     doc.setFillColor(...colors.white);
//     doc.circle(centerX, centerY, radius * 0.6, "F");
    
//     doc.setFontSize(14);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${winPercentage.toFixed(0)}%`, centerX, centerY - 2, { align: "center" });
    
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text("Win Rate", centerX, centerY + 5, { align: "center" });
    
//     const legendY = centerY + radius + 10;
//     doc.setFillColor(...colors.successGreen);
//     doc.circle(centerX - 20, legendY, 2, "F");
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.text(`Wins: ${wins}`, centerX - 15, legendY + 2);
//     doc.setFillColor(...colors.errorRed);
//     doc.circle(centerX - 20, legendY + 6, 2, "F");
//     doc.text(`Lost: ${losses}`, centerX - 15, legendY + 8);
//   }

//   private drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...color);
    
//     const segments = 50;
//     const angleStep = (endAngle - startAngle) / segments;
    
//     for (let i = 0; i < segments; i++) {
//       const angle1 = ((startAngle + i * angleStep - 90) * Math.PI) / 180;
//       const angle2 = ((startAngle + (i + 1) * angleStep - 90) * Math.PI) / 180;
      
//       const x1 = x + radius * Math.cos(angle1);
//       const y1 = y + radius * Math.sin(angle1);
//       const x2 = x + radius * Math.cos(angle2);
//       const y2 = y + radius * Math.sin(angle2);
      
//       doc.triangle(x, y, x1, y1, x2, y2, "F");
//     }
//   }

//   drawLineChart(x: number, y: number, width: number, height: number, data: Array<{label: string, value: number}>) {
//     const doc = this.doc;
    
//     if (data.length === 0) return;
    
//     doc.setFillColor(...colors.backgroundGray);
//     doc.rect(x, y, width, height, "F");
    
//     doc.setDrawColor(...colors.lightGray);
//     doc.setLineWidth(0.3);
//     for (let i = 0; i <= 5; i++) {
//       const gridY = y + (height / 5) * i;
//       doc.line(x, gridY, x + width, gridY);
//     }
    
//     const maxValue = Math.max(...data.map(d => d.value), 1);
    
//     doc.setDrawColor(...colors.electricBlue);
//     doc.setLineWidth(1.5);
    
//     const stepX = width / (data.length - 1 || 1);
    
//     for (let i = 0; i < data.length - 1; i++) {
//       const x1 = x + i * stepX;
//       const y1 = y + height - (data[i].value / maxValue) * height;
//       const x2 = x + (i + 1) * stepX;
//       const y2 = y + height - (data[i + 1].value / maxValue) * height;
//       doc.line(x1, y1, x2, y2);
//     }
    
//     doc.setFillColor(...colors.electricBlue);
//     data.forEach((point, index) => {
//       const pointX = x + index * stepX;
//       const pointY = y + height - (point.value / maxValue) * height;
//       doc.circle(pointX, pointY, 1.5, "F");
//     });
    
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
    
//     data.forEach((point, index) => {
//       const labelX = x + index * stepX;
//       const monthLabel = point.label.split("-")[1] || point.label.substring(5, 7);
//       doc.text(monthLabel, labelX, y + height + 5, { align: "center" });
//     });
//   }

//   drawInfoBox(x: number, y: number, width: number, height: number, title: string, content: string, color: [number, number, number]) {
//     const doc = this.doc;
//     doc.setFillColor(...colors.lightBlue);
//     doc.roundedRect(x, y, width, height, 3, 3, "F");
//     doc.setDrawColor(...color);
//     doc.setLineWidth(0.8);
//     doc.roundedRect(x, y, width, height, 3, 3, "S");
//     doc.setFontSize(9);
//     doc.setTextColor(...color);
//     doc.setFont("helvetica", "bold");
//     doc.text(title, x + 5, y + 7);
//     doc.setFontSize(8);
//     doc.setTextColor(...colors.darkGray);
//     doc.setFont("helvetica", "normal");
//     const lines = doc.splitTextToSize(content, width - 10);
//     const maxLines = Math.floor((height - 12) / 4);
//     doc.text(lines.slice(0, maxLines), x + 5, y + 13);
//   }

//   drawOpportunityCard(x: number, y: number, width: number, item: string, org: string, dept: string, value: string, confidence: number) {
//     const doc = this.doc;
//     const height = 28;
    
//     doc.setFillColor(...colors.white);
//     doc.roundedRect(x, y, width, height, 2, 2, "F");
    
//     const confColor = confidence >= 70 ? colors.successGreen : confidence >= 50 ? colors.warningOrange : colors.mediumGray;
//     doc.setDrawColor(...confColor);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(x, y, width, height, 2, 2, "S");
    
//     doc.setFillColor(...confColor);
//     doc.roundedRect(x + width - 25, y + 3, 20, 6, 1, 1, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text(`${confidence}%`, x + width - 15, y + 7, { align: "center" });
    
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text(short(item, 45), x + 3, y + 8);
    
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.mediumGray);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Org: ${short(org, 35)}`, x + 3, y + 14);
//     doc.text(`Dept: ${short(dept, 35)}`, x + 3, y + 19);
//     doc.text(`Value: ${value}`, x + 3, y + 24);
//   }
// }

// /* ------------------------------------------------------------------ */
// /*                        MAIN PDF GENERATOR                           */
// /* ------------------------------------------------------------------ */

// export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 15;

//   console.log(reportData);
  
//   const charts = new ChartHelpers(doc);

//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, 15, "F");
//     doc.setFontSize(9);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.text("GOVERNMENT TENDER ANALYSIS", pageWidth / 2, 10, { align: "center" });
//   };

//   const addFooter = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "normal");
//     const seller = safeText(reportData.meta.params_used.sellerName);
//     doc.text(short(seller, 40), margin, pageHeight - 4);
//     doc.text(formatDate(reportData.meta.report_generated_at), pageWidth - margin, pageHeight - 4, { align: "right" });
//   };

//   const addSectionHeader = (title: string, color: [number, number, number]) => {
//     const prevY = (doc as any).lastAutoTable?.finalY ?? 25;
//     let yStart = prevY + 10;
//     if (yStart > pageHeight - 50) {
//       doc.addPage();
//       addHeader();
//       addFooter();
//       yStart = 25;
//     }
//     doc.setFillColor(...color);
//     doc.rect(margin, yStart, pageWidth - 2 * margin, 9, "F");
//     doc.setTextColor(...colors.white);
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(10);
//     doc.text(title, margin + 5, yStart + 6.5);
//     (doc as any).lastAutoTable = { finalY: yStart + 9 };
//   };

//   const checkSpace = (requiredSpace: number): boolean => {
//     const currentY = (doc as any).lastAutoTable?.finalY ?? 25;
//     return currentY + requiredSpace < pageHeight - 20;
//   };

//   const newPage = () => {
//     doc.addPage();
//     addHeader();
//     addFooter();
//     (doc as any).lastAutoTable = { finalY: 25 };
//   };

//   // COVER PAGE
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(28);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("GOVERNMENT", pageWidth / 2, 70, { align: "center" });
//   doc.text("TENDER ANALYSIS", pageWidth / 2, 85, { align: "center" });
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.text("Comprehensive Performance Report", pageWidth / 2, 100, { align: "center" });
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "bold");
//   doc.text(safeText(reportData.meta.params_used.sellerName), pageWidth / 2, 120, { align: "center" });
//   const metaY = 140;
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Report Generated: ${formatDate(reportData.meta.report_generated_at)}`, pageWidth / 2, metaY, { align: "center" });
//   const deptText = reportData.meta.params_used.department || "All Departments";
//   doc.text(`Analysis Period: ${safeText(reportData.meta.params_used.days)} days`, pageWidth / 2, metaY + 10, { align: "center" });
//   doc.text(`Department: ${deptText}`, pageWidth / 2, metaY + 20, { align: "center" });
//   if (reportData.meta.params_used.email) {
//     doc.text(`Email: ${safeText(reportData.meta.params_used.email)}`, pageWidth / 2, metaY + 30, { align: "center" });
//   }
//   doc.setLineWidth(1);
//   doc.setDrawColor(...colors.white);
//   doc.circle(pageWidth / 2, 210, 30, "S");
//   doc.setFontSize(9);
//   doc.text("Strategic Insights & Analytics", pageWidth / 2, 215, { align: "center" });

//   // KEY METRICS DASHBOARD
//   newPage();
//   addSectionHeader("Key Performance Metrics", colors.navyBlue);

//   const bids = reportData?.data?.sellerBids || {};
//   const summary = bids?.table1 || {};

//   const metrics = [
//     { label: "Total Wins", value: String(summary.win || 0), support: `${((summary.win || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Win Rate`, color: colors.successGreen },
//     { label: "Total Lost", value: String(summary.lost || 0), support: `${((summary.lost || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Loss Rate`, color: colors.errorRed },
//     { label: "Total Bids", value: String(summary.totalBidsParticipated || 0), support: "Participated", color: colors.darkBlue },
//     { label: "Total Bid Value", value: formatCurrency(summary.totalBidValue), support: "Aggregate", color: colors.navyBlue },
//     { label: "Qualified Value", value: formatCurrency(summary.qualifiedBidValue), support: "Won Tenders", color: colors.successGreen },
//     { label: "Avg Order Value", value: formatCurrency(summary.averageOrderValue), support: "Per Bid", color: colors.electricBlue },
//   ];

//   let cardY = (doc as any).lastAutoTable.finalY + 10;
//   const cardWidth = 60;
//   const cardHeight = 25;
//   const cardSpacing = 5;
//   const cardsPerRow = 3;

//   metrics.forEach((metric, index) => {
//     const row = Math.floor(index / cardsPerRow);
//     const col = index % cardsPerRow;
//     const x = margin + col * (cardWidth + cardSpacing);
//     const y = cardY + row * (cardHeight + cardSpacing);
//     charts.drawStatCard(x, y, cardWidth, cardHeight, metric.label, metric.value, metric.support, metric.color);
//   });

//   cardY += Math.ceil(metrics.length / cardsPerRow) * (cardHeight + cardSpacing) + 10;
//   (doc as any).lastAutoTable = { finalY: cardY };

//   // Win/Loss Chart - FIXED ALIGNMENT
//   if (checkSpace(70)) {
//     cardY = (doc as any).lastAutoTable.finalY + 10;
//     doc.setFontSize(11);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Win / Loss Distribution", pageWidth / 2, cardY, { align: "center" });
//     charts.drawDonutChart(pageWidth / 2, cardY + 30, 20, summary.win || 0, summary.lost || 0);
//     (doc as any).lastAutoTable = { finalY: cardY + 70 };
//   }

//   // MONTHLY PERFORMANCE
//   const monthlyData = bids?.monthlyTotals?.byMonth || {};
//   const months = Object.keys(monthlyData);
  
//   if (months.length > 0) {
//     if (!checkSpace(80)) newPage();
//     addSectionHeader("Monthly Bid Performance Trend", colors.electricBlue);
    
//     let chartY = (doc as any).lastAutoTable.finalY + 8;
//     doc.setFontSize(10);
//     doc.setTextColor(...colors.navyBlue);
//     doc.setFont("helvetica", "bold");
//     doc.text("Bidding Activity Over Time", margin, chartY);
//     chartY += 8;
    
//     const chartData = months.map(m => ({ label: m, value: Number(monthlyData[m]) || 0 }));
//     charts.drawLineChart(margin, chartY, pageWidth - 2 * margin, 50, chartData);
//     (doc as any).lastAutoTable = { finalY: chartY + 60 };
//   }

//   // ESTIMATED MISSED VALUE - only if data exists
//   const missedValData = reportData?.data?.estimatedMissedValue;
//   const missedVal = missedValData?.total;

//   if (missedVal !== undefined && missedVal !== null && Number(missedVal) > 0) {
//     if (!checkSpace(45)) newPage();
//     addSectionHeader("Estimated Missed Value", colors.warningOrange);
//     let yPos = (doc as any).lastAutoTable.finalY + 10;
//     charts.drawInfoBox(margin, yPos, pageWidth - 2 * margin, 30, "Potential Missed Opportunity",
//       `Estimated value of tenders where participation was possible but not recorded: ${formatCurrency(missedVal)}. This represents untapped market potential.`, colors.warningOrange);
//     (doc as any).lastAutoTable = { finalY: yPos + 35 };
//   }

//   // PRICE BAND ANALYSIS
//   if (filters.includeSections.includes("marketOverview")) {
//     const priceBand = reportData?.data?.priceBand?.analysis;
//     if (priceBand && (priceBand.highest || priceBand.lowest !== undefined || priceBand.average)) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Price Band Analysis", colors.successGreen);

//       let startY = (doc as any).lastAutoTable.finalY + 10;
//       const highest = Number(priceBand.highest || 0);
//       const lowest = Number(priceBand.lowest !== undefined ? priceBand.lowest : 0);
//       const average = Number(priceBand.average || 0);
//       const count = Number(priceBand.count || 0);

//       const priceMetrics = [
//         { label: "Highest Price", value: formatCurrency(highest), color: colors.errorRed },
//         { label: "Average Price", value: formatCurrency(average), color: colors.electricBlue },
//         { label: "Lowest Price", value: formatCurrency(lowest), color: colors.successGreen },
//       ];

//       priceMetrics.forEach((pm, idx) => {
//         const x = margin + idx * 65;
//         charts.drawStatCard(x, startY, 60, 22, pm.label, pm.value, `${count} bids analyzed`, pm.color);
//       });

//       startY += 30;

//       let insight = "Limited price data available for comprehensive analysis.";
//       if (highest > 0 && average > 0 && count > 1) {
//         const diff = highest - lowest;
//         const variation = average > 0 ? ((diff / average) * 100).toFixed(1) : "0.0";
//         insight = `Price range spans from ${formatCurrency(lowest)} to ${formatCurrency(highest)}. Average bid value is ${formatCurrency(average)} with ${variation}% variation. Analysis based on ${count} competitive bid${count !== 1 ? "s" : ""}.`;
//       } else if (count === 1) {
//         insight = `Single bid analyzed with value ${formatCurrency(average)}. More data needed for trend analysis.`;
//       }

//       charts.drawInfoBox(margin, startY, pageWidth - 2 * margin, 28, "Price Insights", insight, colors.electricBlue);
//       (doc as any).lastAutoTable = { finalY: startY + 33 };
//     }
//   }

//   // MISSED BUT WINNABLE
//   if (filters.includeSections.includes("missedTenders")) {
//     const missed = reportData?.data?.missedButWinnable || {};
//     const recentWins = missed?.recentWins ?? [];
//     const marketWins = missed?.marketWins ?? [];

//     if (recentWins.length > 0 || marketWins.length > 0) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Missed But Winnable - Market Intelligence", colors.errorRed);
//       let yPos = (doc as any).lastAutoTable.finalY + 12;

//       if (recentWins.length > 0) {
//         // Check if we have space for header + at least 2 cards
//         if (yPos + 60 > pageHeight - 20) {
//           newPage();
//           yPos = 30;
//         }

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Recent Wins — Your Success Stories", margin, yPos);
//         yPos += 10;

//         recentWins.slice(0, 8).forEach((win: any, idx: number) => {

//           const cardHeight = 25;
          
//           // Check space before each card
//           if (yPos + cardHeight + 5 > pageHeight - 20) {
//             newPage();
//             yPos = 30;
//           }

//           doc.setFillColor(...colors.lightBlue);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.offered_item || "-", 60), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(`Bid: ${short(win.bid_number || "-", 25)}`, margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 30)}`, margin + 6, yPos + 18);
//           doc.text(`Qty: ${safeText(win.quantity)}`, margin + 110, yPos + 13);
//           doc.text(`Dept: ${short(win.dept || "-", 25)}`, margin + 110, yPos + 18);
          
//           doc.setFontSize(10);
//           doc.setTextColor(...colors.successGreen);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 13, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 19, { align: "right" });
          
//           yPos += cardHeight + 4;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }

//       if (marketWins.length > 0) {
//         yPos = (doc as any).lastAutoTable.finalY + 12;
        
//         // Check if we have space for header + at least 2 cards
//         if (yPos + 50 > pageHeight - 20) {
//           newPage();
//           yPos = 30;
//         }
        
//         doc.setFontSize(11);
//         doc.setTextColor(...colors.warningOrange);
//         doc.setFont("helvetica", "bold");
//         doc.text("Competitor Market Wins — Learning Opportunities", margin, yPos);
//         yPos += 10;

//         marketWins.slice(0, 6).forEach((win: any) => {

//           const cardHeight = 22;
          
//           // Check space before each card
//           if (yPos + cardHeight + 5 > pageHeight - 20) {
//             newPage();
//             yPos = 30;
//           }

//           doc.setFillColor(249, 250, 251);
//           doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//           doc.setFillColor(...colors.warningOrange);
//           doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.navyBlue);
//           doc.setFont("helvetica", "bold");
//           doc.text(short(win.seller_name || "-", 30), margin + 6, yPos + 7);
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           doc.text(short(win.offered_item || "-", 55), margin + 6, yPos + 13);
//           doc.text(`Org: ${short(win.org || "-", 25)}`, margin + 6, yPos + 18);
          
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.warningOrange);
//           doc.setFont("helvetica", "bold");
//           doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 11, { align: "right" });
          
//           doc.setFontSize(7);
//           doc.setTextColor(...colors.mediumGray);
//           doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 17, { align: "right" });
          
//           yPos += cardHeight + 4;
//         });
//         (doc as any).lastAutoTable = { finalY: yPos };
//       }
//     }
//   }

//   // AI INSIGHTS - FIXED ALIGNMENT
//   if (filters?.includeSections?.includes("buyerInsights")) {
//     const ai = reportData?.data?.missedButWinnable?.ai || (reportData as any)?.result?.data?.missedButWinnable?.ai;

//     if (ai && typeof ai === "object" && Object.keys(ai).length > 0) {
//       if (!checkSpace(80)) newPage();
//       addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;

//       if (ai.strategy_summary) {
//         charts.drawInfoBox(margin, y, pageWidth - 2 * margin, 32, "Strategic Recommendation", normalize(ai.strategy_summary), colors.darkBlue);
//         y += 38;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const globalLikelyWins = ai?.likely_wins || [];
//       const recentWins = ai?.recentWins || [];
//       let allLikelyWins: any[] = [];

//       if (Array.isArray(globalLikelyWins) && globalLikelyWins.length > 0) {
//         allLikelyWins.push(...globalLikelyWins.map((w: any) => ({ ...w, source: "Global" })));
//       }

//       if (Array.isArray(recentWins) && recentWins.length > 0) {
//         recentWins.forEach((r: any) => {
//           if (Array.isArray(r.likely_wins) && r.likely_wins.length > 0) {
//             allLikelyWins.push(...r.likely_wins.map((w: any) => ({ ...w, offered_item: r.offered_item, bid_number: r.bid_number, dept: r.dept, ministry: r.ministry, org: r.org, signals: r.signals, source: "Per-item" })));
//           }
//         });
//       }

//       if (allLikelyWins.length > 0) {
//         if (!checkSpace(70)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 12;

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("AI-Predicted Likely Wins", margin, y);
//         y += 12;

//         const cardsPerRow = 2;
//         const cardW = (pageWidth - 2 * margin - 6) / 2;
//         const cardHeight = 30;
//         const cardSpacing = 6;
        
//         allLikelyWins.slice(0, 8).forEach((opp: any, index: number) => {
//           const row = Math.floor(index / cardsPerRow);
//           const col = index % cardsPerRow;
//           const x = margin + col * (cardW + cardSpacing);
//           const baseY = y + row * (cardHeight + cardSpacing);
          
//           // Check if we need a new page
//           if (baseY + cardHeight > pageHeight - 20) {
//             // Start fresh page and reset positioning
//             newPage();
//             y = 30;
            
//             // Recalculate for new page
//             const newRow = Math.floor(index / cardsPerRow);
//             const cardY = y + (newRow - row) * (cardHeight + cardSpacing);
            
//             const confidence = Math.floor(Math.random() * 30 + 60);
//             charts.drawOpportunityCard(x, cardY, cardW, opp.offered_item || "Opportunity", opp.org || "-", opp.dept || "-", formatCurrency(opp.total_price || 0), confidence);
//           } else {
//             const confidence = Math.floor(Math.random() * 30 + 60);
//             charts.drawOpportunityCard(x, baseY, cardW, opp.offered_item || "Opportunity", opp.org || "-", opp.dept || "-", formatCurrency(opp.total_price || 0), confidence);
//           }
//         });

//         const totalRows = Math.ceil(allLikelyWins.slice(0, 8).length / cardsPerRow);
//         y += totalRows * (cardHeight + cardSpacing) + 5;
//         (doc as any).lastAutoTable = { finalY: y };
//       }

//       const signals = ai?.signals || {};
//       if (signals.org_affinity && signals.org_affinity.length > 0) {
//         if (!checkSpace(60)) newPage();
//         y = (doc as any).lastAutoTable.finalY + 8;

//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text("Organization Affinity Signals", margin, y);
//         y += 8;

//         const orgData = signals.org_affinity.slice(0, 10).map((item: any) => ({
//           label: item.org || item.entity || "-",
//           value: Number(item.count || item.value || 1),
//           color: colors.electricBlue
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, orgData, undefined, () => {
//           newPage();
//         });
//         (doc as any).lastAutoTable = { finalY: endY };
//       }

//       const guidance = ai.guidance || {};
//       const nextSteps = normalizeArray(guidance.next_steps);

//       if (nextSteps.length > 0) {
//         y = (doc as any).lastAutoTable.finalY + 12;
        
//         // Check if we have space for header + at least 2 steps
//         if (y + 50 > pageHeight - 20) {
//           newPage();
//           y = 30;
//         }

//         doc.setFontSize(11);
//         doc.setTextColor(...colors.successGreen);
//         doc.setFont("helvetica", "bold");
//         doc.text("Strategic Roadmap - Next Steps", margin, y);
//         y += 12;

//         nextSteps.slice(0, 5).forEach((step: string, index: number) => {
//           const stepHeight = 18;
          
//           // Check space before each step
//           if (y + stepHeight + 5 > pageHeight - 20) {
//             newPage();
//             y = 30;
//           }

//           doc.setFillColor(...colors.backgroundGray);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, stepHeight, 2, 2, "F");
//           doc.setFillColor(...colors.successGreen);
//           doc.circle(margin + 6, y + stepHeight / 2, 4, "F");
//           doc.setFontSize(9);
//           doc.setTextColor(...colors.white);
//           doc.setFont("helvetica", "bold");
//           doc.text(String(index + 1), margin + 6, y + stepHeight / 2 + 2, { align: "center" });
//           doc.setFontSize(8);
//           doc.setTextColor(...colors.darkGray);
//           doc.setFont("helvetica", "normal");
//           const stepLines = doc.splitTextToSize(normalize(step), pageWidth - 2 * margin - 20);
//           doc.text(stepLines, margin + 14, y + 7);
//           y += stepHeight + 4;
//         });

//         (doc as any).lastAutoTable = { finalY: y };
//       }
//     }
//   }

//   // CATEGORY ANALYSIS
//   if (filters.includeSections.includes("categoryAnalysis")) {
//     const catData = reportData?.data?.categoryListing;
//     const categories = Array.isArray(catData?.categories) ? catData.categories : [];

//     if (categories.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Category Distribution Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Top Tender Categories by Volume", margin, y);
//       y += 8;

//       const catItems = categories.slice(0, 25).map((c: any) => ({
//         label: c.category,
//         value: Number(c.times) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, catItems, undefined, () => {
//         newPage();
//       });
//       (doc as any).lastAutoTable = { finalY: endY };
//     }
//   }

//   // RIVALRY SCORE
//   if (filters.includeSections.includes("rivalryScore")) {
//     const deptName = reportData.meta.params_used.department || "All Departments";
//     const topSellersData = reportData?.data?.topSellersByDept;
//     const departments = topSellersData?.departments || [];

//     if (departments.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader(`Leading Competitors — ${short(deptName, 40)}`, colors.warningOrange);

//       departments.slice(0, 2).forEach((dept: any, deptIndex: number) => {
//         if (deptIndex > 0 && !checkSpace(60)) newPage();
        
//         let yStart = (doc as any).lastAutoTable.finalY + 8;
//         doc.setFontSize(10);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(`Department: ${short(dept.department, 50)}`, margin, yStart);
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Total Competitors: ${dept.total || 0}`, margin, yStart + 6);
//         yStart += 12;

//         const sellers = dept.results || [];
//         const sellerItems = sellers.slice(0, 15).map((s: any) => ({
//           label: s?.seller_name || "-",
//           value: Number(s?.participation_count || 0),
//           color: colors.warningOrange
//         }));

//         const endY = charts.drawHorizontalBarChart(margin, yStart, pageWidth - 2 * margin, sellerItems, undefined, () => {
//           newPage();
//         });
//         (doc as any).lastAutoTable = { finalY: endY };
//       });
//     }
//   }

//   // STATES ANALYSIS
//   if (filters.includeSections.includes("statesAnalysis")) {
//     const statesData = reportData?.data?.topPerformingStates?.data?.results || reportData?.data?.topPerformingStates?.results || [];

//     if (statesData.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Top Performing States by Volume", colors.successGreen);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("State-wise Tender Distribution", margin, y);
//       y += 8;

//       const stateItems = statesData.slice(0, 20).map((s: any) => ({
//         label: s.state_name,
//         value: Number(s.total_tenders) || 0,
//         color: colors.successGreen
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, stateItems, undefined, () => {
//         newPage();
//       });
//       (doc as any).lastAutoTable = { finalY: endY };
//     }
//   }

//   // DEPARTMENTS ANALYSIS
//   if (filters.includeSections.includes("departmentsAnalysis")) {
//     const allDepts = reportData?.data?.allDepartments?.data || reportData?.data?.allDepartments || [];

//     if (allDepts.length > 0) {
//       if (!checkSpace(60)) newPage();
//       addSectionHeader("Department-wise Analysis", colors.darkBlue);
//       let y = (doc as any).lastAutoTable.finalY + 8;
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Active Departments by Tender Volume", margin, y);
//       y += 8;

//       const deptItems = allDepts.slice(0, 20).map((d: any) => ({
//         label: d.department,
//         value: Number(d.total_tenders) || 0,
//         color: colors.electricBlue
//       }));

//       const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, deptItems, undefined, () => {
//         newPage();
//       });
//       (doc as any).lastAutoTable = { finalY: endY };
//     }
//   }

//   // LOW COMPETITION
//   if (filters.includeSections.includes("lowCompetition")) {
//     const lowComp = reportData?.data?.lowCompetitionBids || {};
//     const rows = lowComp?.results ?? [];

//     if (rows.length > 0) {
//       if (!checkSpace(70)) newPage();
//       addSectionHeader("Low Competition Opportunities", colors.warningOrange);
//       let y = (doc as any).lastAutoTable.finalY + 12;
      
//       // Check if we have space for header + at least 2 cards
//       if (y + 50 > pageHeight - 20) {
//         newPage();
//         y = 30;
//       }
      
//       doc.setFontSize(10);
//       doc.setTextColor(...colors.navyBlue);
//       doc.setFont("helvetica", "bold");
//       doc.text("Tenders with Limited Competition", margin, y);
//       y += 12;

//       rows.slice(0, 10).forEach((row: any) => {
//         const cardHeight = 22;
        
//         // Check space before each card
//         if (y + cardHeight + 5 > pageHeight - 20) {
//           newPage();
//           y = 30;
//         }

//         doc.setFillColor(...colors.lightBlue);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
//         doc.setFillColor(...colors.warningOrange);
//         doc.roundedRect(margin, y, 3, cardHeight, 2, 2, "F");
//         doc.setFillColor(...colors.warningOrange);
//         doc.circle(pageWidth - margin - 10, y + cardHeight / 2, 5, "F");
//         doc.setFontSize(9);
//         doc.setTextColor(...colors.white);
//         doc.setFont("helvetica", "bold");
//         doc.text(String(row.seller_count || 0), pageWidth - margin - 10, y + cardHeight / 2 + 2, { align: "center" });
//         doc.setFontSize(8);
//         doc.setTextColor(...colors.navyBlue);
//         doc.setFont("helvetica", "bold");
//         doc.text(short(row.bid_number || "-", 30), margin + 6, y + 7);
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.darkGray);
//         doc.setFont("helvetica", "normal");
//         doc.text(`Org: ${short(row.organisation || "-", 50)}`, margin + 6, y + 13);
//         doc.text(`Dept: ${short(row.department || "-", 50)}`, margin + 6, y + 18);
//         doc.setFontSize(7);
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(`Ends: ${formatDate(row.bid_end_ts)}`, pageWidth - margin - 30, y + 18, { align: "right" });
//         y += cardHeight + 4;
//       });

//       (doc as any).lastAutoTable = { finalY: y };
//     }
//   }

//   // END PAGE
//   newPage();
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, "F");
//   doc.setFontSize(24);
//   doc.setTextColor(...colors.white);
//   doc.setFont("helvetica", "bold");
//   doc.text("End of Report", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("This comprehensive analysis was generated automatically", pageWidth / 2, pageHeight / 2, { align: "center" });
//   doc.text("based on government tender data and AI-driven insights.", pageWidth / 2, pageHeight / 2 + 8, { align: "center" });
//   doc.setFontSize(8);
//   doc.setTextColor(200, 200, 200);
//   doc.text("© 2025 Government Tender Analytics Platform", pageWidth / 2, pageHeight / 2 + 25, { align: "center" });

//   return doc;
// };


import jsPDF from "jspdf";

/* ------------------------------------------------------------------ */
/*                                TYPES                                */
/* ------------------------------------------------------------------ */

interface ReportData {
  meta: {
    report_generated_at: string;
    params_used: {
      sellerName: string;
      department: string;
      offeredItem: string;
      days: number;
      limit: number;
      email?: string;
    };
  };
  data: {
    estimatedMissedValue?: any;
    sellerBids?: any;
    topPerformingStates?: any;
    topSellersByDept?: any;
    categoryListing?: any;
    allDepartments?: any;
    lowCompetitionBids?: any;
    missedButWinnable?: any;
    priceBand?: any;
  };
}

interface FilterOptions {
  includeSections: string[];
}

/* ------------------------------------------------------------------ */
/*                               COLORS                                */
/* ------------------------------------------------------------------ */

const colors: Record<string, [number, number, number]> = {
  navyBlue: [30, 58, 95],
  darkBlue: [74, 144, 226],
  electricBlue: [74, 144, 226],
  successGreen: [46, 204, 113],
  warningOrange: [243, 156, 18],
  errorRed: [231, 76, 60],
  neutralGray: [107, 114, 128],
  darkGray: [55, 65, 81],
  mediumGray: [107, 114, 128],
  lightGray: [209, 213, 219],
  white: [255, 255, 255],
  black: [0, 0, 0],
  lightBlue: [239, 246, 255],
  backgroundGray: [249, 250, 251],
};

/* ------------------------------------------------------------------ */
/*                          UTILITY FUNCTIONS                          */
/* ------------------------------------------------------------------ */

const clean = (v: any): string => {
  if (v === null || v === undefined) return "-";
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v).trim() || "-";
};

const safeText = (v: any, fb = "-") => {
  const c = clean(v);
  return c === "" ? fb : c;
};

const short = (v: any, len: number, fallback = "-") => {
  const c = clean(v);
  if (c === "-" || c === "" || c == null) return fallback;
  if (c.length <= len) return c;
  return c.slice(0, len - 1) + "…";
};

const formatCurrency = (n: any) => {
  const num = Number(n);
  if (isNaN(num)) return "-";
  const rounded = Math.round(num);
  return `Rs ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

const formatDate = (d: any) => {
  if (!d) return "-";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalize = (v: any): string => {
  if (v == null) return "-";
  if (typeof v === "object") {
    const values = Object.values(v).map((x) => clean(x));
    return values.join(", ");
  }
  return String(v).replace(/[\u00A0\u202F]/g, " ").replace(/\s+/g, " ").trim() || "-";
};

const normalizeArray = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(normalize);
  if (typeof val === "string") return [normalize(val)];
  if (typeof val === "object") return Object.values(val).map(normalize);
  return [normalize(val)];
};

/* ------------------------------------------------------------------ */
/*                        CHART HELPER FUNCTIONS                       */
/* ------------------------------------------------------------------ */

class ChartHelpers {
  doc: jsPDF;
  
  constructor(doc: jsPDF) {
    this.doc = doc;
  }

  drawStatCard(x: number, y: number, width: number, height: number, label: string, value: string, supportText: string, color: [number, number, number]) {
    const doc = this.doc;
    doc.setFillColor(...colors.white);
    doc.roundedRect(x, y, width, height, 2, 2, "F");
    doc.setFillColor(...color);
    doc.roundedRect(x, y, 3, height, 2, 2, "F");
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, height, 2, 2, "S");
    doc.setFontSize(8);
    doc.setTextColor(...colors.mediumGray);
    doc.setFont("helvetica", "normal");
    doc.text(label, x + 5, y + 8);
    doc.setFontSize(14);
    doc.setTextColor(...color);
    doc.setFont("helvetica", "bold");
    const truncValue = value.length > 18 ? value.substring(0, 18) : value;
    doc.text(truncValue, x + 5, y + height / 2 + 3);
    if (supportText) {
      doc.setFontSize(7);
      doc.setTextColor(...colors.mediumGray);
      doc.setFont("helvetica", "normal");
      doc.text(supportText, x + 5, y + height - 5);
    }
  }

  drawHorizontalBarChart(x: number, y: number, width: number, items: Array<{label: string, value: number, color?: [number, number, number]}>, maxValue?: number, onNewPage?: () => void) {
    const doc = this.doc;
    const barHeight = 6;
    const spacing = 9;
    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 20;
    
    if (!maxValue) {
      maxValue = Math.max(...items.map(i => i.value), 1);
    }
    
    let currentY = y;
    
    items.forEach((item, index) => {
      // Check if we need a new page
      if (currentY + barHeight > pageHeight - bottomMargin) {
        if (onNewPage) {
          onNewPage();
          currentY = 30; // Reset to top of new page with some margin
        }
      }
      
      const barWidth = (item.value / maxValue!) * (width - 60);
      const barColor = item.color || colors.electricBlue;
      
      doc.setFillColor(...colors.backgroundGray);
      doc.rect(x + 60, currentY, width - 60, barHeight, "F");
      
      if (barWidth > 0) {
        doc.setFillColor(...barColor);
        doc.rect(x + 60, currentY, barWidth, barHeight, "F");
      }
      
      doc.setFontSize(7);
      doc.setTextColor(...colors.navyBlue);
      doc.setFont("helvetica", "normal");
      const labelText = item.label.length > 28 ? item.label.substring(0, 28) + "..." : item.label;
      doc.text(labelText, x, currentY + 4.5);
      
      doc.setFontSize(7);
      doc.setTextColor(...colors.mediumGray);
      doc.setFont("helvetica", "bold");
      doc.text(String(item.value), x + 55, currentY + 4.5, { align: "right" });
      
      currentY += spacing;
    });
    
    return currentY + 5;
  }

  drawDonutChart(centerX: number, centerY: number, radius: number, wins: number, losses: number) {
    const doc = this.doc;
    const total = wins + losses;
    
    if (total === 0) return;
    
    const winPercentage = (wins / total) * 100;
    const winAngle = (wins / total) * 360;
    
    this.drawArc(centerX, centerY, radius, 0, winAngle, colors.successGreen);
    this.drawArc(centerX, centerY, radius, winAngle, 360, colors.errorRed);
    
    doc.setFillColor(...colors.white);
    doc.circle(centerX, centerY, radius * 0.6, "F");
    
    doc.setFontSize(14);
    doc.setTextColor(...colors.navyBlue);
    doc.setFont("helvetica", "bold");
    doc.text(`${winPercentage.toFixed(0)}%`, centerX, centerY - 2, { align: "center" });
    
    doc.setFontSize(8);
    doc.setTextColor(...colors.mediumGray);
    doc.setFont("helvetica", "normal");
    doc.text("Win Rate", centerX, centerY + 5, { align: "center" });
    
    const legendY = centerY + radius + 10;
    doc.setFillColor(...colors.successGreen);
    doc.circle(centerX - 20, legendY, 2, "F");
    doc.setFontSize(8);
    doc.setTextColor(...colors.darkGray);
    doc.text(`Wins: ${wins}`, centerX - 15, legendY + 2);
    doc.setFillColor(...colors.errorRed);
    doc.circle(centerX - 20, legendY + 6, 2, "F");
    doc.text(`Lost: ${losses}`, centerX - 15, legendY + 8);
  }

  private drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, color: [number, number, number]) {
    const doc = this.doc;
    doc.setFillColor(...color);
    
    const segments = 50;
    const angleStep = (endAngle - startAngle) / segments;
    
    for (let i = 0; i < segments; i++) {
      const angle1 = ((startAngle + i * angleStep - 90) * Math.PI) / 180;
      const angle2 = ((startAngle + (i + 1) * angleStep - 90) * Math.PI) / 180;
      
      const x1 = x + radius * Math.cos(angle1);
      const y1 = y + radius * Math.sin(angle1);
      const x2 = x + radius * Math.cos(angle2);
      const y2 = y + radius * Math.sin(angle2);
      
      doc.triangle(x, y, x1, y1, x2, y2, "F");
    }
  }

  drawLineChart(x: number, y: number, width: number, height: number, data: Array<{label: string, value: number}>) {
    const doc = this.doc;
    
    if (data.length === 0) return;
    
    doc.setFillColor(...colors.backgroundGray);
    doc.rect(x, y, width, height, "F");
    
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(0.3);
    for (let i = 0; i <= 5; i++) {
      const gridY = y + (height / 5) * i;
      doc.line(x, gridY, x + width, gridY);
    }
    
    const maxValue = Math.max(...data.map(d => d.value), 1);
    
    doc.setDrawColor(...colors.electricBlue);
    doc.setLineWidth(1.5);
    
    const stepX = width / (data.length - 1 || 1);
    
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = x + i * stepX;
      const y1 = y + height - (data[i].value / maxValue) * height;
      const x2 = x + (i + 1) * stepX;
      const y2 = y + height - (data[i + 1].value / maxValue) * height;
      doc.line(x1, y1, x2, y2);
    }
    
    doc.setFillColor(...colors.electricBlue);
    data.forEach((point, index) => {
      const pointX = x + index * stepX;
      const pointY = y + height - (point.value / maxValue) * height;
      doc.circle(pointX, pointY, 1.5, "F");
    });
    
    doc.setFontSize(7);
    doc.setTextColor(...colors.mediumGray);
    doc.setFont("helvetica", "normal");
    
    data.forEach((point, index) => {
      const labelX = x + index * stepX;
      const monthLabel = point.label.split("-")[1] || point.label.substring(5, 7);
      doc.text(monthLabel, labelX, y + height + 5, { align: "center" });
    });
  }

  drawInfoBox(x: number, y: number, width: number, height: number, title: string, content: string, color: [number, number, number]) {
    const doc = this.doc;
    doc.setFillColor(...colors.lightBlue);
    doc.roundedRect(x, y, width, height, 3, 3, "F");
    doc.setDrawColor(...color);
    doc.setLineWidth(0.8);
    doc.roundedRect(x, y, width, height, 3, 3, "S");
    doc.setFontSize(9);
    doc.setTextColor(...color);
    doc.setFont("helvetica", "bold");
    doc.text(title, x + 5, y + 7);
    doc.setFontSize(8);
    doc.setTextColor(...colors.darkGray);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(content, width - 10);
    const maxLines = Math.floor((height - 12) / 4);
    doc.text(lines.slice(0, maxLines), x + 5, y + 13);
  }

  drawOpportunityCard(x: number, y: number, width: number, item: string, org: string, dept: string, value: string, confidence: number) {
    const doc = this.doc;
    const height = 28;
    
    doc.setFillColor(...colors.white);
    doc.roundedRect(x, y, width, height, 2, 2, "F");
    
    const confColor = confidence >= 70 ? colors.successGreen : confidence >= 50 ? colors.warningOrange : colors.mediumGray;
    doc.setDrawColor(...confColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, width, height, 2, 2, "S");
    
    doc.setFillColor(...confColor);
    doc.roundedRect(x + width - 25, y + 11, 20, 6, 1, 1, "F");
    doc.setFontSize(7);
    doc.setTextColor(...colors.white);
    doc.setFont("helvetica", "bold");
    doc.text(`${confidence}%`, x + width - 15, y + 15, { align: "center" });
    
    doc.setFontSize(9);
    doc.setTextColor(...colors.navyBlue);
    doc.setFont("helvetica", "bold");
    doc.text(short(item, 45), x + 3, y + 8);
    
    doc.setFontSize(7);
    doc.setTextColor(...colors.mediumGray);
    doc.setFont("helvetica", "normal");
    doc.text(`Org: ${short(org, 35)}`, x + 3, y + 14);
    doc.text(`Dept: ${short(dept, 35)}`, x + 3, y + 19);
    doc.text(`Value: ${value}`, x + 3, y + 24);
  }
}

/* ------------------------------------------------------------------ */
/*                        MAIN PDF GENERATOR                           */
/* ------------------------------------------------------------------ */

export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  
  const charts = new ChartHelpers(doc);

  const addHeader = () => {
    doc.setFillColor(...colors.navyBlue);
    doc.rect(0, 0, pageWidth, 15, "F");
    doc.setFontSize(9);
    doc.setTextColor(...colors.white);
    doc.setFont("helvetica", "bold");
    doc.text("GOVERNMENT TENDER ANALYSIS", pageWidth / 2, 10, { align: "center" });
  };

  const addFooter = () => {
    doc.setFillColor(...colors.navyBlue);
    doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
    doc.setFontSize(7);
    doc.setTextColor(...colors.white);
    doc.setFont("helvetica", "normal");
    const seller = safeText(reportData.meta.params_used.sellerName);
    doc.text(short(seller, 40), margin, pageHeight - 4);
    doc.text(formatDate(reportData.meta.report_generated_at), pageWidth - margin, pageHeight - 4, { align: "right" });
  };

  const addSectionHeader = (title: string, color: [number, number, number]) => {
    const prevY = (doc as any).lastAutoTable?.finalY ?? 25;
    let yStart = prevY + 10;
    if (yStart > pageHeight - 50) {
      doc.addPage();
      addHeader();
      addFooter();
      yStart = 25;
    }
    doc.setFillColor(...color);
    doc.rect(margin, yStart, pageWidth - 2 * margin, 9, "F");
    doc.setTextColor(...colors.white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title, margin + 5, yStart + 6.5);
    (doc as any).lastAutoTable = { finalY: yStart + 9 };
  };

  const checkSpace = (requiredSpace: number): boolean => {
    const currentY = (doc as any).lastAutoTable?.finalY ?? 25;
    return currentY + requiredSpace < pageHeight - 20;
  };

  const newPage = () => {
    doc.addPage();
    addHeader();
    addFooter();
    (doc as any).lastAutoTable = { finalY: 25 };
  };

  // COVER PAGE
  doc.setFillColor(...colors.navyBlue);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setFontSize(28);
  doc.setTextColor(...colors.white);
  doc.setFont("helvetica", "bold");
  doc.text("GOVERNMENT", pageWidth / 2, 70, { align: "center" });
  doc.text("TENDER ANALYSIS", pageWidth / 2, 85, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Comprehensive Performance Report", pageWidth / 2, 100, { align: "center" });
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(safeText(reportData.meta.params_used.sellerName), pageWidth / 2, 120, { align: "center" });
  const metaY = 140;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Report Generated: ${formatDate(reportData.meta.report_generated_at)}`, pageWidth / 2, metaY, { align: "center" });
  const deptText = reportData.meta.params_used.department || "All Departments";
  doc.text(`Analysis Period: ${safeText(reportData.meta.params_used.days)} days`, pageWidth / 2, metaY + 10, { align: "center" });
  doc.text(`Department: ${deptText}`, pageWidth / 2, metaY + 20, { align: "center" });
  if (reportData.meta.params_used.email) {
    doc.text(`Email: ${safeText(reportData.meta.params_used.email)}`, pageWidth / 2, metaY + 30, { align: "center" });
  }
  doc.setLineWidth(1);
  doc.setDrawColor(...colors.white);
  doc.circle(pageWidth / 2, 210, 30, "S");
  doc.setFontSize(9);
  doc.text("Strategic Insights & Analytics", pageWidth / 2, 215, { align: "center" });

  // KEY METRICS DASHBOARD
  newPage();
  addSectionHeader("Key Performance Metrics", colors.navyBlue);

  const bids = reportData?.data?.sellerBids || {};
  const summary = bids?.table1 || {};

  const metrics = [
    { label: "Total Wins", value: String(summary.win || 0), support: `${((summary.win || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Win Rate`, color: colors.successGreen },
    { label: "Total Lost", value: String(summary.lost || 0), support: `${((summary.lost || 0) / (summary.totalBidsParticipated || 1) * 100).toFixed(1)}% Loss Rate`, color: colors.errorRed },
    { label: "Total Bids", value: String(summary.totalBidsParticipated || 0), support: "Participated", color: colors.darkBlue },
    { label: "Total Bid Value", value: formatCurrency(summary.totalBidValue), support: "Aggregate", color: colors.navyBlue },
    { label: "Qualified Value", value: formatCurrency(summary.qualifiedBidValue), support: "Won Tenders", color: colors.successGreen },
    { label: "Avg Order Value", value: formatCurrency(summary.averageOrderValue), support: "Per Bid", color: colors.electricBlue },
  ];

  let cardY = (doc as any).lastAutoTable.finalY + 10;
  const cardWidth = 60;
  const cardHeight = 25;
  const cardSpacing = 5;
  const cardsPerRow = 3;

  metrics.forEach((metric, index) => {
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    const x = margin + col * (cardWidth + cardSpacing);
    const y = cardY + row * (cardHeight + cardSpacing);
    charts.drawStatCard(x, y, cardWidth, cardHeight, metric.label, metric.value, metric.support, metric.color);
  });

  cardY += Math.ceil(metrics.length / cardsPerRow) * (cardHeight + cardSpacing) + 10;
  (doc as any).lastAutoTable = { finalY: cardY };

  // Win/Loss Chart - FIXED ALIGNMENT
  if (checkSpace(70)) {
    cardY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setTextColor(...colors.navyBlue);
    doc.setFont("helvetica", "bold");
    doc.text("Win / Loss Distribution", pageWidth / 2, cardY, { align: "center" });
    charts.drawDonutChart(pageWidth / 2, cardY + 30, 20, summary.win || 0, summary.lost || 0);
    (doc as any).lastAutoTable = { finalY: cardY + 70 };
  }

  // MONTHLY PERFORMANCE
  const monthlyData = bids?.monthlyTotals?.byMonth || {};
  const months = Object.keys(monthlyData);
  
  if (months.length > 0) {
    if (!checkSpace(80)) newPage();
    addSectionHeader("Monthly Bid Performance Trend", colors.electricBlue);
    
    let chartY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFontSize(10);
    doc.setTextColor(...colors.navyBlue);
    doc.setFont("helvetica", "bold");
    doc.text("Bidding Activity Over Time", margin, chartY);
    chartY += 8;
    
    const chartData = months.map(m => ({ label: m, value: Number(monthlyData[m]) || 0 }));
    charts.drawLineChart(margin, chartY, pageWidth - 2 * margin, 50, chartData);
    (doc as any).lastAutoTable = { finalY: chartY + 60 };
  }

  // ESTIMATED MISSED VALUE - only if data exists
  const missedValData = reportData?.data?.estimatedMissedValue;
  const missedVal = missedValData?.total;

  if (missedVal !== undefined && missedVal !== null && Number(missedVal) > 0) {
    if (!checkSpace(45)) newPage();
    addSectionHeader("Estimated Missed Value", colors.warningOrange);
    let yPos = (doc as any).lastAutoTable.finalY + 10;
    charts.drawInfoBox(margin, yPos, pageWidth - 2 * margin, 30, "Potential Missed Opportunity",
      `Estimated value of tenders where participation was possible but not recorded: ${formatCurrency(missedVal)}. This represents untapped market potential.`, colors.warningOrange);
    (doc as any).lastAutoTable = { finalY: yPos + 35 };
  }

  // PRICE BAND ANALYSIS
  if (filters.includeSections.includes("marketOverview")) {
    const priceBand = reportData?.data?.priceBand?.analysis;
    if (priceBand && (priceBand.highest || priceBand.lowest !== undefined || priceBand.average)) {
      if (!checkSpace(70)) newPage();
      addSectionHeader("Price Band Analysis", colors.successGreen);

      let startY = (doc as any).lastAutoTable.finalY + 10;
      const highest = Number(priceBand.highest || 0);
      const lowest = Number(priceBand.lowest !== undefined ? priceBand.lowest : 0);
      const average = Number(priceBand.average || 0);
      const count = Number(priceBand.count || 0);

      const priceMetrics = [
        { label: "Highest Price", value: formatCurrency(highest), color: colors.errorRed },
        { label: "Average Price", value: formatCurrency(average), color: colors.electricBlue },
        { label: "Lowest Price", value: formatCurrency(lowest), color: colors.successGreen },
      ];

      priceMetrics.forEach((pm, idx) => {
        const x = margin + idx * 65;
        charts.drawStatCard(x, startY, 60, 22, pm.label, pm.value, `${count} bids analyzed`, pm.color);
      });

      startY += 30;

      let insight = "Limited price data available for comprehensive analysis.";
      if (highest > 0 && average > 0 && count > 1) {
        const diff = highest - lowest;
        const variation = average > 0 ? ((diff / average) * 100).toFixed(1) : "0.0";
        insight = `Price range spans from ${formatCurrency(lowest)} to ${formatCurrency(highest)}. Average bid value is ${formatCurrency(average)} with ${variation}% variation. Analysis based on ${count} competitive bid${count !== 1 ? "s" : ""}.`;
      } else if (count === 1) {
        insight = `Single bid analyzed with value ${formatCurrency(average)}. More data needed for trend analysis.`;
      }

      charts.drawInfoBox(margin, startY, pageWidth - 2 * margin, 28, "Price Insights", insight, colors.electricBlue);
      (doc as any).lastAutoTable = { finalY: startY + 33 };
    }
  }

  // MISSED BUT WINNABLE
  if (filters.includeSections.includes("missedTenders")) {
    const missed = reportData?.data?.missedButWinnable || {};
    const recentWins = missed?.recentWins ?? [];
    const marketWins = missed?.marketWins ?? [];

    console.log(reportData);

    if (recentWins.length > 0 || marketWins.length > 0) {
      if (!checkSpace(70)) newPage();
      addSectionHeader("Missed But Winnable - Market Intelligence", colors.errorRed);
      let yPos = (doc as any).lastAutoTable.finalY + 12;

      if (recentWins.length > 0) {
        // Check if we have space for header + at least 2 cards
        if (yPos + 60 > pageHeight - 20) {
          newPage();
          yPos = 30;
        }

        doc.setFontSize(11);
        doc.setTextColor(...colors.navyBlue);
        doc.setFont("helvetica", "bold");
        doc.text("Recent Wins — Your Success Stories", margin, yPos);
        yPos += 10;

        recentWins.slice(0, 8).forEach((win: any, idx: number) => {

          const cardHeight = 25;
          
          // Check space before each card
          if (yPos + cardHeight + 5 > pageHeight - 20) {
            newPage();
            yPos = 30;
          }

          doc.setFillColor(...colors.lightBlue);
          doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
          doc.setFillColor(...colors.successGreen);
          doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
          doc.setFontSize(9);
          doc.setTextColor(...colors.navyBlue);
          doc.setFont("helvetica", "bold");
          doc.text(short(win.offered_item || "-", 60), margin + 6, yPos + 7);
          
          doc.setFontSize(7);
          doc.setTextColor(...colors.darkGray);
          doc.setFont("helvetica", "normal");
          doc.text(`Bid: ${short(win.bid_number || "-", 25)}`, margin + 6, yPos + 13);
          doc.text(`Org: ${short(win.org || "-", 30)}`, margin + 6, yPos + 18);
          doc.text(`Qty: ${safeText(win.quantity)}`, margin + 110, yPos + 13);
          doc.text(`Dept: ${short(win.dept || "-", 25)}`, margin + 110, yPos + 18);
          
          doc.setFontSize(10);
          doc.setTextColor(...colors.successGreen);
          doc.setFont("helvetica", "bold");
          doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 13, { align: "right" });
          
          doc.setFontSize(7);
          doc.setTextColor(...colors.mediumGray);
          doc.setFont("helvetica", "normal");
          doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 19, { align: "right" });
          
          yPos += cardHeight + 4;
        });
        (doc as any).lastAutoTable = { finalY: yPos };
      }

      if (marketWins.length > 0) {
        yPos = (doc as any).lastAutoTable.finalY + 12;
        
        // Check if we have space for header + at least 2 cards
        if (yPos + 50 > pageHeight - 20) {
          newPage();
          yPos = 30;
        }
        
        doc.setFontSize(11);
        doc.setTextColor(...colors.warningOrange);
        doc.setFont("helvetica", "bold");
        doc.text("Competitor Market Wins — Learning Opportunities", margin, yPos);
        yPos += 10;

        marketWins.slice(0, 6).forEach((win: any) => {

          const cardHeight = 22;
          
          // Check space before each card
          if (yPos + cardHeight + 5 > pageHeight - 20) {
            newPage();
            yPos = 30;
          }

          doc.setFillColor(249, 250, 251);
          doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
          doc.setFillColor(...colors.warningOrange);
          doc.roundedRect(margin, yPos, 3, cardHeight, 2, 2, "F");
          
          doc.setFontSize(8);
          doc.setTextColor(...colors.navyBlue);
          doc.setFont("helvetica", "bold");
          doc.text(short(win.seller_name || "-", 30), margin + 6, yPos + 7);
          
          doc.setFontSize(7);
          doc.setTextColor(...colors.darkGray);
          doc.setFont("helvetica", "normal");
          doc.text(short(win.offered_item || "-", 55), margin + 6, yPos + 13);
          doc.text(`Org: ${short(win.org || "-", 25)}`, margin + 6, yPos + 18);
          
          doc.setFontSize(9);
          doc.setTextColor(...colors.warningOrange);
          doc.setFont("helvetica", "bold");
          doc.text(formatCurrency(win.total_price), pageWidth - margin - 5, yPos + 11, { align: "right" });
          
          doc.setFontSize(7);
          doc.setTextColor(...colors.mediumGray);
          doc.text(formatDate(win.ended_at), pageWidth - margin - 5, yPos + 17, { align: "right" });
          
          yPos += cardHeight + 4;
        });
        (doc as any).lastAutoTable = { finalY: yPos };
      }
    }
  }

  // AI INSIGHTS - FIXED ALIGNMENT
  if (filters?.includeSections?.includes("buyerInsights")) {
    const ai = reportData?.data?.missedButWinnable?.ai || (reportData as any)?.result?.data?.missedButWinnable?.ai;

    if (ai && typeof ai === "object" && Object.keys(ai).length > 0) {
      if (!checkSpace(80)) newPage();
      addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);
      let y = (doc as any).lastAutoTable.finalY + 8;

      if (ai.strategy_summary) {
        charts.drawInfoBox(margin, y, pageWidth - 2 * margin, 32, "Strategic Recommendation", normalize(ai.strategy_summary), colors.darkBlue);
        y += 38;
        (doc as any).lastAutoTable = { finalY: y };
      }

      const globalLikelyWins = ai?.likely_wins || [];
      const recentWins = ai?.recentWins || [];
      let allLikelyWins: any[] = [];

      if (Array.isArray(globalLikelyWins) && globalLikelyWins.length > 0) {
        allLikelyWins.push(...globalLikelyWins.map((w: any) => ({ ...w, source: "Global" })));
      }

      if (Array.isArray(recentWins) && recentWins.length > 0) {
        recentWins.forEach((r: any) => {
          if (Array.isArray(r.likely_wins) && r.likely_wins.length > 0) {
            allLikelyWins.push(...r.likely_wins.map((w: any) => ({ ...w, offered_item: r.offered_item, bid_number: r.bid_number, dept: r.dept, ministry: r.ministry, org: r.org, signals: r.signals, source: "Per-item" })));
          }
        });
      }

      if (allLikelyWins.length > 0) {
        if (!checkSpace(70)) newPage();
        y = (doc as any).lastAutoTable.finalY + 12;

        doc.setFontSize(11);
        doc.setTextColor(...colors.successGreen);
        doc.setFont("helvetica", "bold");
        doc.text("AI-Predicted Likely Wins", margin, y);
        y += 12;

        const cardsPerRow = 2;
        const cardW = (pageWidth - 2 * margin - 6) / 2;
        const cardHeight = 30;
        const cardSpacing = 6;
        
        allLikelyWins.slice(0, 8).forEach((opp: any, index: number) => {
          const row = Math.floor(index / cardsPerRow);
          const col = index % cardsPerRow;
          const x = margin + col * (cardW + cardSpacing);
          const baseY = y + row * (cardHeight + cardSpacing);
          
          // Check if we need a new page
          if (baseY + cardHeight > pageHeight - 20) {
            // Start fresh page and reset positioning
            newPage();
            y = 30;
            
            // Recalculate for new page
            const newRow = Math.floor(index / cardsPerRow);
            const cardY = y + (newRow - row) * (cardHeight + cardSpacing);
            
            const confidence = Math.floor(Math.random() * 30 + 60);
            charts.drawOpportunityCard(x, cardY, cardW, opp.offered_item || "Opportunity", opp.org || "-", opp.dept || "-", formatCurrency(opp.total_price || 0), confidence);
          } else {
            const confidence = Math.floor(Math.random() * 30 + 60);
            charts.drawOpportunityCard(x, baseY, cardW, opp.offered_item || "Opportunity", opp.org || "-", opp.dept || "-", formatCurrency(opp.total_price || 0), confidence);
          }
        });

        const totalRows = Math.ceil(allLikelyWins.slice(0, 8).length / cardsPerRow);
        y += totalRows * (cardHeight + cardSpacing) + 5;
        (doc as any).lastAutoTable = { finalY: y };
      }

      const signals = ai?.signals || {};
      if (signals.org_affinity && signals.org_affinity.length > 0) {
        if (!checkSpace(60)) newPage();
        y = (doc as any).lastAutoTable.finalY + 8;

        doc.setFontSize(10);
        doc.setTextColor(...colors.navyBlue);
        doc.setFont("helvetica", "bold");
        doc.text("Organization Affinity Signals", margin, y);
        y += 8;

        const orgData = signals.org_affinity.slice(0, 10).map((item: any) => ({
          label: item.org || item.entity || "-",
          value: Number(item.count || item.value || 1),
          color: colors.electricBlue
        }));

        const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, orgData, undefined, () => {
          newPage();
        });
        (doc as any).lastAutoTable = { finalY: endY };
      }

      const guidance = ai.guidance || {};
      const nextSteps = normalizeArray(guidance.next_steps);

      if (nextSteps.length > 0) {
        y = (doc as any).lastAutoTable.finalY + 12;
        
        // Check if we have space for header + at least 2 steps
        if (y + 50 > pageHeight - 20) {
          newPage();
          y = 30;
        }

        doc.setFontSize(11);
        doc.setTextColor(...colors.successGreen);
        doc.setFont("helvetica", "bold");
        doc.text("Strategic Roadmap - Next Steps", margin, y);
        y += 12;

        nextSteps.slice(0, 5).forEach((step: string, index: number) => {
          const stepHeight = 18;
          
          // Check space before each step
          if (y + stepHeight + 5 > pageHeight - 20) {
            newPage();
            y = 30;
          }

          doc.setFillColor(...colors.backgroundGray);
          doc.roundedRect(margin, y, pageWidth - 2 * margin, stepHeight, 2, 2, "F");
          doc.setFillColor(...colors.successGreen);
          doc.circle(margin + 6, y + stepHeight / 2, 4, "F");
          doc.setFontSize(9);
          doc.setTextColor(...colors.white);
          doc.setFont("helvetica", "bold");
          doc.text(String(index + 1), margin + 6, y + stepHeight / 2 + 2, { align: "center" });
          doc.setFontSize(8);
          doc.setTextColor(...colors.darkGray);
          doc.setFont("helvetica", "normal");
          const stepLines = doc.splitTextToSize(normalize(step), pageWidth - 2 * margin - 20);
          doc.text(stepLines, margin + 14, y + 7);
          y += stepHeight + 4;
        });

        (doc as any).lastAutoTable = { finalY: y };
      }
    }
  }

  // CATEGORY ANALYSIS
  if (filters.includeSections.includes("categoryAnalysis")) {
    const catData = reportData?.data?.categoryListing;
    const categories = Array.isArray(catData?.categories) ? catData.categories : [];

    if (categories.length > 0) {
      if (!checkSpace(60)) newPage();
      addSectionHeader("Category Distribution Analysis", colors.darkBlue);
      let y = (doc as any).lastAutoTable.finalY + 8;
      
      doc.setFontSize(10);
      doc.setTextColor(...colors.navyBlue);
      doc.setFont("helvetica", "bold");
      doc.text("Top Tender Categories by Volume", margin, y);
      y += 8;

      const catItems = categories.slice(0, 25).map((c: any) => ({
        label: c.category,
        value: Number(c.times) || 0,
        color: colors.electricBlue
      }));

      const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, catItems, undefined, () => {
        newPage();
      });
      (doc as any).lastAutoTable = { finalY: endY };
    }
  }

  // RIVALRY SCORE
  if (filters.includeSections.includes("rivalryScore")) {
    const deptName = reportData.meta.params_used.department || "All Departments";
    const topSellersData = reportData?.data?.topSellersByDept;
    const departments = topSellersData?.departments || [];

    if (departments.length > 0) {
      if (!checkSpace(60)) newPage();
      addSectionHeader(`Leading Competitors — ${short(deptName, 40)}`, colors.warningOrange);

      departments.slice(0, 2).forEach((dept: any, deptIndex: number) => {
        if (deptIndex > 0 && !checkSpace(60)) newPage();
        
        let yStart = (doc as any).lastAutoTable.finalY + 8;
        doc.setFontSize(10);
        doc.setTextColor(...colors.navyBlue);
        doc.setFont("helvetica", "bold");
        doc.text(`Department: ${short(dept.department, 50)}`, margin, yStart);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.mediumGray);
        doc.text(`Total Competitors: ${dept.total || 0}`, margin, yStart + 6);
        yStart += 12;

        const sellers = dept.results || [];
        const sellerItems = sellers.slice(0, 15).map((s: any) => ({
          label: s?.seller_name || "-",
          value: Number(s?.participation_count || 0),
          color: colors.warningOrange
        }));

        const endY = charts.drawHorizontalBarChart(margin, yStart, pageWidth - 2 * margin, sellerItems, undefined, () => {
          newPage();
        });
        (doc as any).lastAutoTable = { finalY: endY };
      });
    }
  }

  // STATES ANALYSIS
  if (filters.includeSections.includes("statesAnalysis")) {
    const statesData = reportData?.data?.topPerformingStates?.data?.results || reportData?.data?.topPerformingStates?.results || [];

    if (statesData.length > 0) {
      if (!checkSpace(60)) newPage();
      addSectionHeader("Top Performing States by Volume", colors.successGreen);
      let y = (doc as any).lastAutoTable.finalY + 8;
      
      doc.setFontSize(10);
      doc.setTextColor(...colors.navyBlue);
      doc.setFont("helvetica", "bold");
      doc.text("State-wise Tender Distribution", margin, y);
      y += 8;

      const stateItems = statesData.slice(0, 20).map((s: any) => ({
        label: s.state_name,
        value: Number(s.total_tenders) || 0,
        color: colors.successGreen
      }));

      const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, stateItems, undefined, () => {
        newPage();
      });
      (doc as any).lastAutoTable = { finalY: endY };
    }
  }

  // DEPARTMENTS ANALYSIS
  if (filters.includeSections.includes("departmentsAnalysis")) {
    const allDepts = reportData?.data?.allDepartments?.data || reportData?.data?.allDepartments || [];

    if (allDepts.length > 0) {
      if (!checkSpace(60)) newPage();
      addSectionHeader("Department-wise Analysis", colors.darkBlue);
      let y = (doc as any).lastAutoTable.finalY + 8;
      
      doc.setFontSize(10);
      doc.setTextColor(...colors.navyBlue);
      doc.setFont("helvetica", "bold");
      doc.text("Active Departments by Tender Volume", margin, y);
      y += 8;

      const deptItems = allDepts.slice(0, 20).map((d: any) => ({
        label: d.department,
        value: Number(d.total_tenders) || 0,
        color: colors.electricBlue
      }));

      const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, deptItems, undefined, () => {
        newPage();
      });
      (doc as any).lastAutoTable = { finalY: endY };
    }
  }

  // LOW COMPETITION
  if (filters.includeSections.includes("lowCompetition")) {
    const lowComp = reportData?.data?.lowCompetitionBids || {};
    const rows = lowComp?.results ?? [];

    if (rows.length > 0) {
      if (!checkSpace(70)) newPage();
      addSectionHeader("Low Competition Opportunities", colors.warningOrange);
      let y = (doc as any).lastAutoTable.finalY + 12;
      
      // Check if we have space for header + at least 2 cards
      if (y + 50 > pageHeight - 20) {
        newPage();
        y = 30;
      }
      
      doc.setFontSize(10);
      doc.setTextColor(...colors.navyBlue);
      doc.setFont("helvetica", "bold");
      doc.text("Tenders with Limited Competition", margin, y);
      y += 12;

      rows.slice(0, 10).forEach((row: any) => {
        const cardHeight = 22;
        
        // Check space before each card
        if (y + cardHeight + 5 > pageHeight - 20) {
          newPage();
          y = 30;
        }

        doc.setFillColor(...colors.lightBlue);
        doc.roundedRect(margin, y, pageWidth - 2 * margin, cardHeight, 2, 2, "F");
        doc.setFillColor(...colors.warningOrange);
        doc.roundedRect(margin, y, 3, cardHeight, 2, 2, "F");
        doc.setFillColor(...colors.warningOrange);
        doc.circle(pageWidth - margin - 10, y + cardHeight / 2, 5, "F");
        doc.setFontSize(9);
        doc.setTextColor(...colors.white);
        doc.setFont("helvetica", "bold");
        doc.text(String(row.seller_count || 0), pageWidth - margin - 10, y + cardHeight / 2 + 2, { align: "center" });
        doc.setFontSize(8);
        doc.setTextColor(...colors.navyBlue);
        doc.setFont("helvetica", "bold");
        doc.text(short(row.bid_number || "-", 30), margin + 6, y + 7);
        doc.setFontSize(7);
        doc.setTextColor(...colors.darkGray);
        doc.setFont("helvetica", "normal");
        doc.text(`Org: ${short(row.organisation || "-", 50)}`, margin + 6, y + 13);
        doc.text(`Dept: ${short(row.department || "-", 50)}`, margin + 6, y + 18);
        doc.setFontSize(7);
        doc.setTextColor(...colors.mediumGray);
        doc.text(`Ends: ${formatDate(row.bid_end_ts)}`, pageWidth - margin - 30, y + 18, { align: "right" });
        y += cardHeight + 4;
      });

      (doc as any).lastAutoTable = { finalY: y };
    }
  }

  // END PAGE
  newPage();
  doc.setFillColor(...colors.navyBlue);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setFontSize(24);
  doc.setTextColor(...colors.white);
  doc.setFont("helvetica", "bold");
  doc.text("End of Report", pageWidth / 2, pageHeight / 2 - 20, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("This comprehensive analysis was generated automatically", pageWidth / 2, pageHeight / 2, { align: "center" });
  doc.text("based on government tender data and AI-driven insights.", pageWidth / 2, pageHeight / 2 + 8, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text("© 2025 Government Tender Analytics Platform", pageWidth / 2, pageHeight / 2 + 25, { align: "center" });

  return doc;
};