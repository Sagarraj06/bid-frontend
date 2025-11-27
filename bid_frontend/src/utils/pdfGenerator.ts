import jsPDF from "jspdf";

/* ------------------------------------------------------------------ */
/*                                TYPES                                */
/* ------------------------------------------------------------------ */

interface ReportData {
  meta: {
    report_generated_at: string;
    params_used: {
      sellerName: string;
      department?: string;
      offeredItem?: string;
      days?: number;
      limit?: number;
      email?: string;
    };
  };
  data: Record<string, any>;
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
  if (Number.isNaN(num)) return "-";
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
  return String(v)
    .replace(/[\u00A0\u202F]/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "-";
};

const normalizeArray = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(normalize);
  if (typeof val === "string") return [normalize(val)];
  if (typeof val === "object") return Object.values(val).map(normalize);
  return [normalize(val)];
};

/* ------------------------------------------------------------------ */
/*                      SAFETY + SMALL HELPERS                         */
/* ------------------------------------------------------------------ */

const safeNumber = (v: any, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const safeArray = (v: any) => (Array.isArray(v) ? v : v ? [v] : []);

/* ------------------------------------------------------------------ */
/*                        CHART HELPER FUNCTIONS                       */
/* ------------------------------------------------------------------ */

class ChartHelpers {
  doc: jsPDF;

  constructor(doc: jsPDF) {
    this.doc = doc;
  }

  /* Simple stat card used across dashboard */
  drawStatCard(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    value: string,
    supportText: string,
    color: [number, number, number]
  ) {
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

  /* Horizontal bar chart — handles new pages through callback */
  drawHorizontalBarChart(
    x: number,
    y: number,
    width: number,
    items: Array<{ label: string; value: number; color?: [number, number, number] }>,
    maxValue?: number,
    onNewPage?: () => void
  ) {
    const doc = this.doc;
    const barHeight = 6;
    const spacing = 9;
    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 20;

    if (!maxValue) {
      maxValue = Math.max(...items.map((i) => i.value), 1);
    }

    let currentY = y;

    items.forEach((item) => {
      if (currentY + barHeight > pageHeight - bottomMargin) {
        if (onNewPage) {
          onNewPage();
          currentY = 30;
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

  /* Donut chart (approximation using triangles) */
  drawDonutChart(centerX: number, centerY: number, radius: number, wins: number, losses: number) {
    const doc = this.doc;
    const total = wins + losses;
    if (total === 0) return;

    const winAngle = (wins / total) * 360;
    this.drawArc(centerX, centerY, radius, 0, winAngle, colors.successGreen);
    this.drawArc(centerX, centerY, radius, winAngle, 360, colors.errorRed);

    doc.setFillColor(...colors.white);
    doc.circle(centerX, centerY, radius * 0.6, "F");

    doc.setFontSize(14);
    doc.setTextColor(...colors.navyBlue);
    doc.setFont("helvetica", "bold");
    doc.text(`${((wins / total) * 100).toFixed(0)}%`, centerX, centerY - 2, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(...colors.mediumGray);
    doc.setFont("helvetica", "normal");
    doc.text("Win Rate", centerX, centerY + 5, { align: "center" });

    const legendY = centerY + radius + 10;
    doc.setFillColor(...colors.successGreen);
    doc.circle(centerX - 20, legendY, 2, "F");
    doc.setFontSize(8);
    doc.setTextColor(...colors.darkGray);
    doc.setFont("helvetica", "normal");
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

  drawLineChart(x: number, y: number, width: number, height: number, data: Array<{ label: string; value: number }>) {
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

    const maxValue = Math.max(...data.map((d) => d.value), 1);

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

    const confColor =
      confidence >= 70 ? colors.successGreen : confidence >= 50 ? colors.warningOrange : colors.mediumGray;
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

  /* Helpers used by many sections */
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

  const safeLastY = (fallback = 25) => (doc as any).lastAutoTable?.finalY ?? fallback;

  const addSectionHeader = (title: string, color: [number, number, number]) => {
    const prevY = safeLastY();
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
    const currentY = safeLastY();
    return currentY + requiredSpace < pageHeight - 20;
  };

  const newPage = () => {
    doc.addPage();
    addHeader();
    addFooter();
    (doc as any).lastAutoTable = { finalY: 25 };
  };

  /* AI helpers */
  const confidenceToNum = (c: any) => {
    if (typeof c === "number") return Math.max(0, Math.min(100, Math.round(c)));
    const s = String(c || "").toLowerCase();
    if (s === "high") return 92;
    if (s === "medium") return 72;
    if (s === "low") return 48;
    return 65;
  };

  const ensureSignalLabel = (item: any) => {
    if (!item) return "-";
    if (typeof item === "string") return item;
    return item.org || item.entity || item.label || JSON.stringify(item);
  };

  /* ---------------------- COVER PAGE ---------------------- */
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

  /* ---------------------- KEY METRICS ---------------------- */
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

  let cardY = safeLastY() + 10;
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

  /* ---------------------- WIN/LOSS DONUT ---------------------- */
  if (checkSpace(70)) {
    cardY = safeLastY() + 10;
    doc.setFontSize(11);
    doc.setTextColor(...colors.navyBlue);
    doc.setFont("helvetica", "bold");
    doc.text("Win / Loss Distribution", pageWidth / 2, cardY, { align: "center" });
    charts.drawDonutChart(pageWidth / 2, cardY + 30, 20, summary.win || 0, summary.lost || 0);
    (doc as any).lastAutoTable = { finalY: cardY + 70 };
  }

  /* ---------------------- MONTHLY TREND ---------------------- */
  const monthlyData = bids?.monthlyTotals?.byMonth || {};
  const months = Object.keys(monthlyData);

  if (months.length > 0) {
    if (!checkSpace(80)) newPage();
    addSectionHeader("Monthly Bid Performance Trend", colors.electricBlue);
    let chartY = safeLastY() + 8;
    doc.setFontSize(10);
    doc.setTextColor(...colors.navyBlue);
    doc.setFont("helvetica", "bold");
    doc.text("Bidding Activity Over Time", margin, chartY);
    chartY += 8;

    const chartData = months.map((m) => ({ label: m, value: Number(monthlyData[m]) || 0 }));
    charts.drawLineChart(margin, chartY, pageWidth - 2 * margin, 50, chartData);
    (doc as any).lastAutoTable = { finalY: chartY + 60 };
  }

  /* ---------------------- ESTIMATED MISSED VALUE ---------------------- */
  const missedValData = reportData?.data?.estimatedMissedValue;
  const missedVal = missedValData?.total;

  if (missedVal !== undefined && missedVal !== null && Number(missedVal) > 0) {
    if (!checkSpace(45)) newPage();
    addSectionHeader("Estimated Missed Value", colors.warningOrange);
    let yPos = safeLastY() + 10;
    charts.drawInfoBox(
      margin,
      yPos,
      pageWidth - 2 * margin,
      32,
      "Potential Missed Opportunity",
      `Estimated value of tenders where participation was possible but not recorded: ${formatCurrency(missedVal)}. This represents untapped market potential.`,
      colors.warningOrange
    );
    (doc as any).lastAutoTable = { finalY: yPos + 36 };
  }

  /* ---------------------- PRICE BAND (conditionally displayed) ---------------------- */
  if (filters.includeSections.includes("marketOverview")) {
    const priceBand = reportData?.data?.priceBand?.analysis;
    if (priceBand && (priceBand.highest || priceBand.lowest !== undefined || priceBand.average)) {
      if (!checkSpace(70)) newPage();
      addSectionHeader("Price Band Analysis", colors.successGreen);

      let startY = safeLastY() + 10;
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

  /* ---------------------- MISSED BUT WINNABLE (recent & market wins) ---------------------- */
  if (filters.includeSections.includes("missedTenders")) {
    const missed = reportData?.data?.missedButWinnable || {};
    const recentWins = safeArray(missed?.recentWins || []);
    const marketWins = safeArray(missed?.marketWins || []);

    if (recentWins.length > 0 || marketWins.length > 0) {
      if (!checkSpace(70)) newPage();
      addSectionHeader("Missed But Winnable - Market Intelligence", colors.errorRed);
      let yPos = safeLastY() + 12;

      if (recentWins.length > 0) {
        if (yPos + 60 > pageHeight - 20) {
          newPage();
          yPos = 30;
        }

        doc.setFontSize(11);
        doc.setTextColor(...colors.navyBlue);
        doc.setFont("helvetica", "bold");
        doc.text("Recent Wins — Your Success Stories", margin, yPos);
        yPos += 10;

        recentWins.slice(0, 8).forEach((win: any) => {
          const cardHeight = 25;
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
          doc.text(`Org: ${short(win.org || win.organisation || "-", 30)}`, margin + 6, yPos + 18);
          doc.text(`Qty: ${safeText(win.quantity)}`, margin + 110, yPos + 13);
          doc.text(`Dept: ${short(win.dept || win.department || "-", 25)}`, margin + 110, yPos + 18);

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
        yPos = safeLastY() + 12;
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
          doc.text(`Org: ${short(win.org || win.organisation || "-", 25)}`, margin + 6, yPos + 18);

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

  
  if (filters?.includeSections?.includes("buyerInsights")) {
    // Discover the AI root (supports both `data` and `result.data` shapes)
    const root =
      (reportData as any)?.result?.data?.missedButWinnable ||
      reportData?.data?.missedButWinnable ||
      null;

    const aiRaw = root?.ai ?? null;
    if (aiRaw && typeof aiRaw === "object") {
      // Normalize keys across camel/snake/capitalized variations
      const ai = {
        strategy_summary: aiRaw.strategy_summary || aiRaw.strategySummary || aiRaw.summary || "",
        likely_wins:
          aiRaw.likely_wins || aiRaw.likelyWins || aiRaw.Likely_wins || aiRaw.LikelyWins || [],
        recentWins:
          aiRaw.recentWins ||
          aiRaw.RecentWins ||
          root?.recentWins ||
          root?.recent_wins ||
          [],
        guidance: aiRaw.guidance || aiRaw.Guidance || {},
        signals: aiRaw.signals || aiRaw.Signals || {},
      };

      if (!checkSpace(80)) newPage();
      addSectionHeader("AI-Driven Strategic Insights", colors.darkBlue);
      let y = safeLastY() + 8;

      // ============================================
      // STRATEGY SUMMARY
      // ============================================
      if (ai.strategy_summary) {
        const lines = doc.splitTextToSize(normalize(ai.strategy_summary), pageWidth - 2 * margin - 10);
        const boxHeight = Math.max(38, Math.min(80, 8 + lines.length * 4));
        charts.drawInfoBox(margin, y, pageWidth - 2 * margin, boxHeight, "Strategic Recommendation", normalize(ai.strategy_summary), colors.darkBlue);
        y += boxHeight + 6;
        (doc as any).lastAutoTable = { finalY: y };
      }

      /* Build unified opportunities list */
      const globalLikelyWins = Array.isArray(ai.likely_wins) ? ai.likely_wins : [];
      const recentWins = Array.isArray(ai.recentWins) ? ai.recentWins : [];

      let allLikelyWins: any[] = [];

      // Global AI suggestions
      allLikelyWins.push(
        ...globalLikelyWins.map((w: any) => ({
          offered_item: w.offered_item || w.offeredItem || w.offered || "Opportunity",
          bid_number: w.bid_number || w.bidNumber || w.bid || "-",
          org: w.organisation || w.org || w.organization || "-",
          dept: w.department || w.dept || "-",
          ministry: w.ministry || "-",
          total_price: w.suggested_price || w.suggestedPrice || w.total_price || 0,
          confidence_raw: w.confidence || w.confidence_score || null,
          reasons: w.reasons || w.reason || [],
          source: "AI",
        }))
      );

      // Include recent wins
      allLikelyWins.push(
        ...recentWins.map((r: any) => ({
          offered_item: r.offered_item || r.offeredItem || r.offered || "-",
          bid_number: r.bid_number || r.bidNumber || r.bid_id || "-",
          org: r.org || r.organisation || "-",
          dept: r.dept || r.department || "-",
          ministry: r.ministry || "-",
          total_price: r.total_price || r.total || 0,
          confidence_raw: r.confidence || null,
          reasons: [],
          source: "RecentWin",
        }))
      );

      // Sort opportunities
      allLikelyWins = allLikelyWins
        .map((o) => ({ ...o, confidence_num: confidenceToNum(o.confidence_raw) }))
        .sort((a, b) => b.confidence_num - a.confidence_num || (safeNumber(b.total_price) - safeNumber(a.total_price)));

      // ============================================
      // ENHANCED OPPORTUNITY CARD DRAWING FUNCTION (FIXED)
      // ============================================
      function drawEnhancedOpportunityCard(
        x: number,
        y: number,
        width: number,
        height: number,
        item: string,
        org: string,
        dept: string,
        price: string,
        confidence: number,
        bidNumber: string
      ) {
        // Card background
        doc.setFillColor(250, 251, 252);
        doc.roundedRect(x, y, width, height, 2, 2, "F");
        
        // Border
        doc.setDrawColor(200, 210, 220);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, y, width, height, 2, 2, "S");

        let currentY = y + 3.5;

        // Confidence badge (top right)
        const badgeWidth = 30;
        const badgeHeight = 6;
        const confidenceColor = confidence >= 80 ? [34, 197, 94] : confidence >= 60 ? [59, 130, 246] : [234, 179, 8];
        doc.setFillColor(...confidenceColor);
        doc.roundedRect(x + width - badgeWidth - 3, currentY, badgeWidth, badgeHeight, 1.5, 1.5, "F");
        doc.setFontSize(6.5);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text(`${confidence}% Match`, x + width - badgeWidth / 2 - 3, currentY + 4.2, { align: "center" });

        currentY += badgeHeight + 2.5;

        // Item title (single line with ellipsis)
        doc.setFontSize(7.5);
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        
        const maxItemWidth = width - 8;
        let displayText = item;
        
        // Check if text is too long
        if (doc.getTextWidth(displayText) > maxItemWidth) {
          // Truncate and add ellipsis
          while (doc.getTextWidth(displayText + "...") > maxItemWidth && displayText.length > 0) {
            displayText = displayText.substring(0, displayText.length - 1);
          }
          displayText = displayText + "...";
        }
        
        doc.text(displayText, x + 4, currentY);
        currentY += 4;

        // Organization (single line, truncated)
        doc.setFontSize(6.5);
        doc.setTextColor(71, 85, 105);
        doc.setFont("helvetica", "normal");
        let orgText = `Org: ${org}`;
        if (doc.getTextWidth(orgText) > maxItemWidth) {
          while (doc.getTextWidth(orgText + "...") > maxItemWidth && orgText.length > 5) {
            orgText = orgText.substring(0, orgText.length - 1);
          }
          orgText = orgText + "...";
        }
        doc.text(orgText, x + 4, currentY);
        currentY += 3.5;

        // Department (single line, truncated)
        let deptText = `Dept: ${dept}`;
        if (doc.getTextWidth(deptText) > maxItemWidth) {
          while (doc.getTextWidth(deptText + "...") > maxItemWidth && deptText.length > 6) {
            deptText = deptText.substring(0, deptText.length - 1);
          }
          deptText = deptText + "...";
        }
        doc.text(deptText, x + 4, currentY);
        currentY += 4.5;

        // Price (left) and Bid number (right) on same line
        doc.setFontSize(8);
        doc.setTextColor(...colors.successGreen);
        doc.setFont("helvetica", "bold");
        doc.text(price, x + 4, currentY);
        
        // Bid number (right aligned)
        doc.setFontSize(5.5);
        doc.setTextColor(148, 163, 184);
        doc.setFont("helvetica", "normal");
        const bidText = bidNumber.replace("GEM/", "").substring(0, 20);
        doc.text(bidText, x + width - 4, currentY, { align: "right" });
      }

      // ============================================
      // DRAW OPPORTUNITY CARDS (2 per row) - FIXED
      // ============================================
      if (allLikelyWins.length > 0) {
        if (!checkSpace(70)) newPage();
        y = safeLastY() + 10;

        doc.setFontSize(11);
        doc.setTextColor(...colors.successGreen);
        doc.setFont("helvetica", "bold");
        doc.text("AI-Predicted Likely Wins", margin, y);
        y += 9;

        const cardsPerRow = 2;
        const cardW = (pageWidth - 2 * margin - 4) / cardsPerRow;
        const cardH = 30; // FIXED HEIGHT - reduced from 42
        const cardSpacing = 4; // Reduced spacing

        const slice = allLikelyWins.slice(0, 8);
        let currentRow = 0;
        
        slice.forEach((opp: any, index: number) => {
          const row = Math.floor(index / cardsPerRow);
          const col = index % cardsPerRow;
          const x = margin + col * (cardW + cardSpacing);
          let cardY = y + row * (cardH + cardSpacing);

          // Check if we need a new page
          if (cardY + cardH > pageHeight - 20) {
            newPage();
            y = 30;
            currentRow = 0;
            cardY = y;
          }

          const confidence = confidenceToNum(opp.confidence_raw);
          
          // Validate all data
          const safeItem = normalize(opp.offered_item || "Opportunity");
          const safeOrg = normalize(opp.org || "-");
          const safeDept = normalize(opp.dept || "-");
          const safePrice = formatCurrency(opp.total_price || 0);
          const safeBid = opp.bid_number || "-";
          
          drawEnhancedOpportunityCard(
            x,
            cardY,
            cardW,
            cardH,
            safeItem,
            safeOrg,
            safeDept,
            safePrice,
            confidence,
            safeBid
          );
        });

        const totalRows = Math.ceil(slice.length / cardsPerRow);
        y += totalRows * (cardH + cardSpacing) + 6;
        (doc as any).lastAutoTable = { finalY: y };
      }

      // ============================================
      // DETAILED INSIGHTS - REASONS SECTION (FIXED)
      // ============================================
      if (globalLikelyWins.length > 0) {
        let sy = safeLastY() + 10;
        if (sy + 60 > pageHeight - 20) {
          newPage();
          sy = 30;
        }

        doc.setFontSize(10);
        doc.setTextColor(...colors.navyBlue);
        doc.setFont("helvetica", "bold");
        doc.text("Opportunity Insights & Key Reasons", margin, sy);
        sy += 8;

        // Display top 3 opportunities (reduced from 5)
        globalLikelyWins.slice(0, 3).forEach((win: any, index: number) => {
          const reasons = Array.isArray(win.reasons) ? win.reasons : [];
          const reasonText = reasons.length > 0 
            ? reasons.slice(0, 2).join(" • ") // Max 2 reasons
            : "High match based on historical wins and similar tender patterns";
          
          const maxWidth = pageWidth - 2 * margin - 8;
          const itemText = normalize(win.offered_item || win.offeredItem || "N/A");
          
          // Truncate item to single line
          let displayItem = itemText;
          if (doc.getTextWidth(displayItem) > maxWidth) {
            const itemLines = doc.splitTextToSize(itemText, maxWidth);
            displayItem = itemLines[0];
            if (itemLines.length > 1) {
              displayItem = displayItem.substring(0, displayItem.length - 3) + "...";
            }
          }
          
          // Limit reason lines
          const reasonLines = doc.splitTextToSize(normalize(reasonText), maxWidth);
          const displayReasons = reasonLines.slice(0, 2);
          
          const boxHeight = 20; // FIXED HEIGHT
          
          if (sy + boxHeight > pageHeight - 20) {
            newPage();
            sy = 30;
          }

          // Box background
          doc.setFillColor(248, 250, 252);
          doc.roundedRect(margin, sy, pageWidth - 2 * margin, boxHeight, 2, 2, "F");
          
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.3);
          doc.roundedRect(margin, sy, pageWidth - 2 * margin, boxHeight, 2, 2, "S");

          let currentY = sy + 4;

          // Item name (single line)
          doc.setFontSize(7.5);
          doc.setTextColor(30, 41, 59);
          doc.setFont("helvetica", "bold");
          doc.text(displayItem, margin + 4, currentY);
          currentY += 4;

          // Organization and value
          doc.setFontSize(6.5);
          doc.setTextColor(71, 85, 105);
          doc.setFont("helvetica", "normal");
          const orgText = `${win.organisation || win.org || "N/A"} • ${formatCurrency(win.suggested_price || win.suggestedPrice || 0)}`;
          doc.text(orgText, margin + 4, currentY);
          currentY += 3.5;

          // Confidence badge
          const confidence = confidenceToNum(win.confidence || win.confidence_score);
          const badgeWidth = 28;
          const badgeX = pageWidth - margin - badgeWidth - 4;
          const confidenceColor = confidence >= 80 ? [34, 197, 94] : confidence >= 60 ? [59, 130, 246] : [234, 179, 8];
          doc.setFillColor(...confidenceColor);
          doc.roundedRect(badgeX, sy + 3, badgeWidth, 6, 1.5, 1.5, "F");
          doc.setFontSize(6.5);
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.text(`${confidence}% Match`, badgeX + badgeWidth / 2, sy + 6.5, { align: "center" });

          // Reasons (max 2 lines)
          doc.setFontSize(6.5);
          doc.setTextColor(100, 116, 139);
          doc.setFont("helvetica", "italic");
          displayReasons.forEach((line: string) => {
            doc.text(line, margin + 4, currentY);
            currentY += 3;
          });

          sy += boxHeight + 3.5;
        });

        (doc as any).lastAutoTable = { finalY: sy };
      }

      // ============================================
      // ORG AFFINITY with PROPER COUNT DISPLAY
      // ============================================
      const signals = ai.signals || {};
      const orgAff = signals.org_affinities || signals.org_affinity || signals.orgAffinities || [];

      if (safeArray(orgAff).length > 0) {
        if (!checkSpace(60)) newPage();
        let sy = safeLastY() + 10;
        
        doc.setFontSize(10);
        doc.setTextColor(...colors.navyBlue);
        doc.setFont("helvetica", "bold");
        doc.text("Organization Affinity Signals", margin, sy);
        sy += 8;

        // Calculate actual win counts from recentWins
        const orgCounts = new Map<string, number>();
        recentWins.forEach((win: any) => {
          const org = win.org || win.organisation || "Unknown";
          orgCounts.set(org, (orgCounts.get(org) || 0) + 1);
        });

        // Build org data with actual counts
        const orgData = safeArray(orgAff).slice(0, 10).map((item: any) => {
          let label = "";
          let value = 1;
          
          if (typeof item === "string") {
            label = item;
            value = orgCounts.get(item) || 1;
          } else {
            label = ensureSignalLabel(item);
            value = Number(item.count || item.value || orgCounts.get(label) || 1);
          }
          
          return { 
            label, 
            value, 
            color: colors.electricBlue 
          };
        });

        // Sort by value descending
        orgData.sort((a, b) => b.value - a.value);

        const endY = charts.drawHorizontalBarChart(
          margin, 
          sy, 
          pageWidth - 2 * margin, 
          orgData, 
          undefined, 
          () => newPage()
        );
        (doc as any).lastAutoTable = { finalY: endY };
      }

      // ============================================
      // NEXT STEPS - STRATEGIC ROADMAP (OPTIMIZED)
      // ============================================
      const nextSteps = normalizeArray(ai.guidance?.next_steps || ai.guidance?.NextSteps || []);
      if (nextSteps.length > 0) {
        let sy = safeLastY() + 10;
        if (sy + 50 > pageHeight - 20) {
          newPage();
          sy = 30;
        }

        doc.setFontSize(11);
        doc.setTextColor(...colors.successGreen);
        doc.setFont("helvetica", "bold");
        doc.text("Strategic Roadmap - Next Steps", margin, sy);
        sy += 10;

        nextSteps.slice(0, 4).forEach((step: string, index: number) => {
          const maxTextWidth = pageWidth - 2 * margin - 18;
          const lines = doc.splitTextToSize(normalize(step), maxTextWidth);
          const stepHeight = Math.max(16, 6 + lines.length * 3.5);
          
          if (sy + stepHeight > pageHeight - 20) {
            newPage();
            sy = 30;
          }

          // Background box
          doc.setFillColor(...colors.backgroundGray);
          doc.roundedRect(margin, sy, pageWidth - 2 * margin, stepHeight, 2, 2, "F");

          // Number circle
          doc.setFillColor(...colors.successGreen);
          doc.circle(margin + 5.5, sy + 8, 3.5, "F");

          doc.setFontSize(8.5);
          doc.setTextColor(...colors.white);
          doc.setFont("helvetica", "bold");
          doc.text(String(index + 1), margin + 5.5, sy + 10, { align: "center" });

          // Step text
          doc.setFontSize(7.5);
          doc.setTextColor(...colors.darkGray);
          doc.setFont("helvetica", "normal");
          
          let textY = sy + 6;
          lines.forEach((line: string) => {
            doc.text(line, margin + 13, textY);
            textY += 3.5;
          });

          sy += stepHeight + 3.5;
        });

        (doc as any).lastAutoTable = { finalY: sy };
      }

      // ============================================
      // EXPANSION AREAS - GROWTH OPPORTUNITIES (OPTIMIZED)
      // ============================================
      const expansionAreas = normalizeArray(ai.guidance?.expansion_areas || ai.guidance?.ExpansionAreas || []);
      if (expansionAreas.length > 0) {
        let sy = safeLastY() + 10;
        if (sy + 40 > pageHeight - 20) {
          newPage();
          sy = 30;
        }

        doc.setFontSize(10);
        doc.setTextColor(...colors.darkBlue);
        doc.setFont("helvetica", "bold");
        doc.text("Growth & Expansion Opportunities", margin, sy);
        sy += 7;

        expansionAreas.slice(0, 4).forEach((area: string, index: number) => {
          const maxWidth = pageWidth - 2 * margin - 10;
          const lines = doc.splitTextToSize(normalize(area), maxWidth);
          
          if (sy + 8 > pageHeight - 20) {
            newPage();
            sy = 30;
          }

          // Bullet point
          doc.setFillColor(...colors.electricBlue);
          doc.circle(margin + 3, sy + 2, 1.5, "F");

          doc.setFontSize(7.5);
          doc.setTextColor(...colors.darkGray);
          doc.setFont("helvetica", "normal");
          doc.text(lines, margin + 8, sy + 3);

          sy += lines.length * 3.5 + 3;
        });

        (doc as any).lastAutoTable = { finalY: sy };
      }
    }
  }

      

  /* ---------------------- CATEGORY ANALYSIS ---------------------- */
  if (filters.includeSections.includes("categoryAnalysis")) {
    const catData = reportData?.data?.categoryListing;
    const categories = Array.isArray(catData?.categories) ? catData.categories : [];

    if (categories.length > 0) {
      if (!checkSpace(60)) newPage();
      addSectionHeader("Category Distribution Analysis", colors.darkBlue);
      let y = safeLastY() + 8;

      doc.setFontSize(10);
      doc.setTextColor(...colors.navyBlue);
      doc.setFont("helvetica", "bold");
      doc.text("Top Tender Categories by Volume", margin, y);
      y += 8;

      const catItems = categories.slice(0, 25).map((c: any) => ({
        label: c.category,
        value: Number(c.times) || 0,
        color: colors.electricBlue,
      }));

      const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, catItems, undefined, () => newPage());
      (doc as any).lastAutoTable = { finalY: endY };
    }
  }

  /* ---------------------- RIVALRY / TOP SELLERS ---------------------- */
  if (filters.includeSections.includes("rivalryScore")) {
    const deptName = reportData.meta.params_used.department || "All Departments";
    const topSellersData = reportData?.data?.topSellersByDept;
    const departments = topSellersData?.departments || [];

    if (departments.length > 0) {
      if (!checkSpace(60)) newPage();
      addSectionHeader(`Leading Competitors — ${short(deptName, 40)}`, colors.warningOrange);

      departments.slice(0, 2).forEach((dept: any) => {
        if (!checkSpace(60)) newPage();
        let yStart = safeLastY() + 8;
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
          color: colors.warningOrange,
        }));

        const endY = charts.drawHorizontalBarChart(margin, yStart, pageWidth - 2 * margin, sellerItems, undefined, () => newPage());
        (doc as any).lastAutoTable = { finalY: endY };
      });
    }
  }

  /* ---------------------- STATES ANALYSIS ---------------------- */
  if (filters.includeSections.includes("statesAnalysis")) {
    const statesData = reportData?.data?.topPerformingStates?.data?.results || reportData?.data?.topPerformingStates?.results || [];

    if (statesData.length > 0) {
      if (!checkSpace(60)) newPage();
      addSectionHeader("Top Performing States by Volume", colors.successGreen);
      let y = safeLastY() + 8;

      doc.setFontSize(10);
      doc.setTextColor(...colors.navyBlue);
      doc.setFont("helvetica", "bold");
      doc.text("State-wise Tender Distribution", margin, y);
      y += 8;

      const stateItems = statesData.slice(0, 20).map((s: any) => ({
        label: s.state_name,
        value: Number(s.total_tenders) || 0,
        color: colors.successGreen,
      }));

      const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, stateItems, undefined, () => newPage());
      (doc as any).lastAutoTable = { finalY: endY };
    }
  }

  /* ---------------------- DEPARTMENTS ANALYSIS ---------------------- */
  if (filters.includeSections.includes("departmentsAnalysis")) {
    const allDepts = reportData?.data?.allDepartments?.data || reportData?.data?.allDepartments || [];

    if (allDepts.length > 0) {
      if (!checkSpace(60)) newPage();
      addSectionHeader("Department-wise Analysis", colors.darkBlue);
      let y = safeLastY() + 8;

      doc.setFontSize(10);
      doc.setTextColor(...colors.navyBlue);
      doc.setFont("helvetica", "bold");
      doc.text("Active Departments by Tender Volume", margin, y);
      y += 8;

      const deptItems = allDepts.slice(0, 20).map((d: any) => ({
        label: d.department,
        value: Number(d.total_tenders) || 0,
        color: colors.electricBlue,
      }));

      const endY = charts.drawHorizontalBarChart(margin, y, pageWidth - 2 * margin, deptItems, undefined, () => newPage());
      (doc as any).lastAutoTable = { finalY: endY };
    }
  }

  /* ---------------------- LOW COMPETITION ---------------------- */
  if (filters.includeSections.includes("lowCompetition")) {
    const lowComp = reportData?.data?.lowCompetitionBids || {};
    const rows = lowComp?.results ?? [];

    if (rows.length > 0) {
      if (!checkSpace(70)) newPage();
      addSectionHeader("Low Competition Opportunities", colors.warningOrange);
      let y = safeLastY() + 12;

      doc.setFontSize(10);
      doc.setTextColor(...colors.navyBlue);
      doc.setFont("helvetica", "bold");
      doc.text("Tenders with Limited Competition", margin, y);
      y += 12;

      rows.slice(0, 10).forEach((row: any) => {
        const cardHeight = 22;
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

  /* ---------------------- END PAGE ---------------------- */
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
