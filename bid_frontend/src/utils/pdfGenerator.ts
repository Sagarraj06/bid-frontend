// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

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
//     sellerBids?: {
//       departmentCount?: Array<{ department: string; bid_count: number; revenue: number }>;
//       stateCount?: Array<{ state: string; bid_count: number; revenue: number }>;
//       monthlyTotals?: Array<{ month: string; bid_value: number }>;
//       sortedRows?: Array<{
//         participated_on: string;
//         offered_item: string;
//         seller_status: string;
//         rank: string;
//         total_price: number;
//         organisation: string;
//         department: string;
//       }>;
//       table1?: {
//         win: number;
//         lost: number;
//         totalBidValue: number;
//         qualifiedBidValue: number;
//         averageOrderValue: number;
//       };
//     };
//     estimatedMissedValue?: any;
//     priceBand?: { highest: number; lowest: number; average: number };
//     topPerformingStates?: {
//       results: Array<{ state_name: string; total_tenders: number }>;
//     };
//     topSellersByDept?: {
//       department: string;
//       total: number;
//       results: Array<{ seller_name: string; participation_count: number; rank: number }>;
//     };
//     categoryListing?: {
//       categories: Array<{ category: string; times: number }>;
//       metadata: { totalItems: number; totalCount: number; processingTime: number };
//     };
//     allDepartments?: Array<{ department: string; total_tenders: string | number }>;
//     lowCompetitionBids?: {
//       results: Array<{
//         bid_number: string;
//         quantity: number;
//         organisation: string;
//         department: string;
//         ministry: string;
//         bid_end_ts: string;
//         seller_count: number;
//       }>;
//       count: number;
//       generated_at: string;
//     };
//     missedButWinnable: {
//       seller: string;
//       recentWins: Array<{
//         bid_number: string;
//         offered_item: string;
//         quantity: number;
//         total_price: number;
//         org: string;
//         dept: string;
//         ministry: string;
//         ended_at: string;
//       }>;
//       marketWins: Array<{
//         bid_number: string;
//         seller_name: string;
//         offered_item: string;
//         quantity: number;
//         total_price: number;
//         org: string;
//         dept: string;
//         ministry: string;
//         ended_at: string;
//       }>;
//       ai: {
//         strategy_summary: string;
//         likely_wins?: Array<{
//           offered_item: string;
//           reason: string;
//           matching_market_wins: Array<{
//             original_b_id: number;
//             bid_number: string;
//             org: string;
//             dept: string;
//             ministry: string;
//             quantity: number;
//             price_hint: number;
//             confidence: string;
//           }>;
//         }>;
//         signals: {
//           org_affinity: Array<{ org: string; win_count?: number; signal: string }>;
//           dept_affinity: Array<{ dept: string; win_count?: number; signal: string }>;
//           ministry_affinity: Array<{ ministry: string; win_count?: number; signal: string }>;
//           quantity_ranges: Array<string>;
//           price_ranges: Array<string>;
//         };
//         guidance?: {
//           note: string;
//           next_steps: Array<string>;
//           expansion_areas: Array<string>;
//         };
//       };
//     };
//   };
// }

// interface FilterOptions {
//   includeSections: string[];
// }

// // Navy Blue to Black Gradient Color System (RGB)
// const colors = {
//   navyBlue: [30, 58, 95] as [number, number, number],
//   darkBlue: [74, 144, 226] as [number, number, number],
//   electricBlue: [74, 144, 226] as [number, number, number],
//   successGreen: [46, 204, 113] as [number, number, number],
//   warningOrange: [243, 156, 18] as [number, number, number],
//   errorRed: [231, 76, 60] as [number, number, number],
//   neutralGray: [107, 114, 128] as [number, number, number],
//   darkGray: [55, 65, 81] as [number, number, number],
//   mediumGray: [107, 114, 128] as [number, number, number],
//   lightGray: [209, 213, 219] as [number, number, number],
//   white: [255, 255, 255] as [number, number, number],
//   black: [0, 0, 0] as [number, number, number],
//   lightBlue: [239, 246, 255] as [number, number, number],
//   backgroundGray: [249, 250, 251] as [number, number, number],
// };

// const formatCurrency = (amount: number | string): string => {
//   const n = typeof amount === 'string' ? parseFloat(amount) : amount;
//   if (!n || isNaN(n) || n === 0) return '-';
//   return `Rs ${n.toLocaleString('en-IN')}`;
// };

// const formatDate = (dateString: string): string => {
//   if (!dateString || dateString === 'N/A' || dateString === 'undefined') return '-';
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return '-';
//     return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
//   } catch {
//     return '-';
//   }
// };

// const clean = (value: any): string => {
//   if (value == null || value === undefined || value === '') return '-';
//   const s = String(value);
//   // Remove all special Unicode characters and normalize text
//   return s
//     .replace(/[₹]/g, 'Rs ')
//     .replace(/[\u2018\u2019]/g, "'")
//     .replace(/[\u201C\u201D]/g, '"')
//     .replace(/\u00A0/g, ' ')
//     .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
//     .replace(/[\u2013\u2014]/g, '-') // Replace em/en dashes
//     .replace(/[\u2022\u2023\u2043]/g, '*') // Replace bullets
//     .replace(/[\u00E1\u00E9\u00ED\u00F3\u00FA]/g, (match) => {
//       const map = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };
//       return map[match] || match;
//     }) // Replace accented characters
//     .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
//     .replace(/\s+/g, ' ')
//     .trim() || '-';
// };

// export const generatePDF = async (
//   reportData: ReportData,
//   filters: FilterOptions
// ) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 12;
//   const HEADER_H = 18;
//   const FOOTER_H = 12;
//   const SAFE_TOP = HEADER_H + 5;
//   const SAFE_BOTTOM = pageHeight - FOOTER_H - 8;
//   let yPosition = SAFE_TOP;

//   // Helper function to check if a section should be included
//   const shouldIncludeSection = (sectionId: string): boolean => {
//     return filters.includeSections.includes(sectionId);
//   };

//   const addNewPage = () => {
//     doc.addPage();
//     yPosition = SAFE_TOP;
//     addPageHeader();
//     addPageFooter();
//   };

//   const addPageHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, 18, 'F');
    
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.white);
//     doc.text('GOVERNMENT TENDER ANALYSIS', pageWidth / 2, 11, { align: 'center' });
//   };

//   const addPageFooter = () => {
//     const pageNum = doc.getCurrentPageInfo().pageNumber;
    
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
    
//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...colors.white);
//     doc.text(clean(reportData.meta.params_used.sellerName), margin, pageHeight - 6);
//     doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
//     doc.text(formatDate(reportData.meta.report_generated_at), pageWidth - margin, pageHeight - 6, { align: 'right' });
//   };

//   const checkPageBreak = (requiredSpace: number): boolean => {
//     if (yPosition + requiredSpace > SAFE_BOTTOM) {
//       addNewPage();
//       return true;
//     }
//     return false;
//   };

//   const addSectionHeader = (title: string, color: [number, number, number] = colors.navyBlue) => {
//     checkPageBreak(15);
    
//     doc.setFillColor(...color);
//     doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
    
//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.white);
//     doc.text(title, margin + 4, yPosition + 7);
    
//     yPosition += 13;
//   };

//   // ============ COVER PAGE (Page 1) ============
  
//   // Navy blue to dark gradient background
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
//   // Decorative circles
//   doc.setFillColor(20, 40, 75);
//   doc.circle(pageWidth + 40, -20, 80, 'F');
//   doc.setFillColor(20, 40, 75);
//   doc.circle(-50, pageHeight / 2, 100, 'F');
//   doc.setFillColor(20, 40, 75);
//   doc.circle(pageWidth + 20, pageHeight + 30, 70, 'F');
  
//   // Title
//   doc.setFontSize(24);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...colors.white);
//   doc.text('GOVERNMENT', pageWidth / 2, 60, { align: 'center' });
//   doc.text('TENDER ANALYSIS', pageWidth / 2, 72, { align: 'center' });
  
//   // Subtitle box
//   yPosition = 90;
//   doc.setFillColor(25, 50, 85);
//   doc.roundedRect(margin + 10, yPosition, pageWidth - 2 * margin - 20, 14, 3, 3, 'F');
//   doc.setFontSize(12);
//   doc.setFont('helvetica', 'normal');
//   doc.setTextColor(...colors.electricBlue);
//   doc.text('Comprehensive Performance Report', pageWidth / 2, yPosition + 9, { align: 'center' });
  
//   // Company name box
//   yPosition = 115;
//   const companyBoxWidth = pageWidth - 60;
//   doc.setFillColor(15, 30, 55);
//   doc.roundedRect((pageWidth - companyBoxWidth) / 2, yPosition, companyBoxWidth, 20, 3, 3, 'F');
//   doc.setDrawColor(...colors.electricBlue);
//   doc.setLineWidth(0.5);
//   doc.roundedRect((pageWidth - companyBoxWidth) / 2, yPosition, companyBoxWidth, 20, 3, 3, 'S');
  
//   doc.setFontSize(18);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...colors.electricBlue);
//   doc.text(clean(reportData.meta.params_used.sellerName), pageWidth / 2, yPosition + 13, { align: 'center' });
  
//   // Metadata
//   yPosition = 150;
//   doc.setFontSize(10);
//   doc.setFont('helvetica', 'normal');
//   doc.setTextColor(...colors.white);
//   doc.text('Report Generated: ' + formatDate(reportData.meta.report_generated_at), pageWidth / 2, yPosition, { align: 'center' });
  
//   yPosition += 8;
//   doc.text('Analysis Period: ' + reportData.meta.params_used.days + ' days', pageWidth / 2, yPosition, { align: 'center' });
  
//   yPosition += 8;
//   doc.text('Department: ' + clean(reportData.meta.params_used.department), pageWidth / 2, yPosition, { align: 'center' });
  
//   yPosition += 12;
//   doc.setFontSize(9);
//   doc.text('Offered Items:', pageWidth / 2, yPosition, { align: 'center' });
//   yPosition += 6;
//   const itemLines = doc.splitTextToSize(clean(reportData.meta.params_used.offeredItem || 'Various items'), pageWidth - 40);
//   doc.text(itemLines.slice(0, 3), pageWidth / 2, yPosition, { align: 'center' });

//   // ============ PAGE 1: MISSED BUT WINNABLE - RECENT WINS ============
//   if (shouldIncludeSection('missedTenders')) {
//     addNewPage();
//     addSectionHeader('Missed But Winnable - Market Intelligence', colors.darkBlue);
    
//     const recentWins = reportData.data.missedButWinnable?.recentWins || [];
  
//   if (recentWins.length > 0) {
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Recent Wins by ' + clean(reportData.meta.params_used.sellerName), margin, yPosition);
//     yPosition += 8;

//     const winsTableData = recentWins.map((win: any) => [
//       clean(win.bid_number).substring(0, 25) || '-',
//       clean(win.offered_item).substring(0, 40) || '-',
//       (win.quantity || 0).toString(),
//       formatCurrency(win.total_price || 0),
//       clean(win.org).substring(0, 30) || '-',
//       clean(win.dept).substring(0, 35) || '-',
//       win.ended_at ? formatDate(win.ended_at) : '-'
//     ]);

//       autoTable(doc, {
//         startY: yPosition,
//         head: [['Bid Number', 'Item Category', 'Qty', 'Total Price', 'Organization', 'Department', 'End Date']],
//         body: winsTableData,
//         theme: 'striped',
//         headStyles: {
//           fillColor: colors.darkBlue,
//           textColor: colors.white,
//           fontSize: 8,
//           fontStyle: 'bold',
//           halign: 'center',
//           cellPadding: 3
//         },
//         bodyStyles: {
//           fontSize: 7,
//           cellPadding: 2.5,
//           minCellHeight: 8
//         },
//         columnStyles: {
//           0: { cellWidth: 26 },
//           1: { cellWidth: 48 },
//           2: { cellWidth: 12, halign: 'right' },
//           3: { cellWidth: 25, halign: 'right' },
//           4: { cellWidth: 33 },
//           5: { cellWidth: 33 },
//           6: { cellWidth: 20, halign: 'center' }
//         },
//         margin: { left: margin - 3, right: margin, top: SAFE_TOP },
//         showHead: 'everyPage',
//         didDrawPage: (data: any) => {
//           if (data.pageNumber > data.table.startPageNumber) {
//             addPageHeader();
//             addPageFooter();
//           }
//         }
//       });

//     yPosition = (doc as any).lastAutoTable.finalY + 10;
//   }

//   // Competitor Market Wins
//   const marketWins = reportData.data.missedButWinnable?.marketWins || [];
  
//   if (marketWins.length > 0) {
//     checkPageBreak(60);
    
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Competitor Market Wins', margin, yPosition);
//     yPosition += 8;

//     const marketTableData = marketWins.map((win: any) => [
//       clean(win.bid_number).substring(0, 25) || '-',
//       clean(win.seller_name).substring(0, 30) || '-',
//       clean(win.offered_item).substring(0, 35) || '-',
//       (win.quantity || 0).toString(),
//       formatCurrency(win.total_price || 0),
//       clean(win.org).substring(0, 30) || '-',
//       clean(win.dept).substring(0, 30) || '-',
//       win.ended_at ? formatDate(win.ended_at) : '-'
//     ]);

//     autoTable(doc, {
//       startY: yPosition,
//       head: [['Bid Number', 'Seller Name', 'Item', 'Qty', 'Price', 'Organization', 'Department', 'End Date']],
//       body: marketTableData,
//       theme: 'striped',
//       headStyles: {
//         fillColor: colors.warningOrange,
//         textColor: colors.white,
//         fontSize: 7,
//         fontStyle: 'bold',
//         halign: 'center',
//         cellPadding: 3
//       },
//       bodyStyles: {
//         fontSize: 6.5,
//         cellPadding: 2,
//         minCellHeight: 7
//       },
//       columnStyles: {
//         0: { cellWidth: 24 },
//         1: { cellWidth: 28 },
//         2: { cellWidth: 32 },
//         3: { cellWidth: 10, halign: 'right' },
//         4: { cellWidth: 22, halign: 'right' },
//         5: { cellWidth: 28 },
//         6: { cellWidth: 28 },
//         7: { cellWidth: 18, halign: 'center' }
//       },
//       margin: { left: margin, right: margin, top: SAFE_TOP },
//       showHead: 'everyPage',
//       didDrawPage: (data: any) => {
//         if (data.pageNumber > data.table.startPageNumber) {
//           addPageHeader();
//           addPageFooter();
//         }
//       }
//     });

//     yPosition = (doc as any).lastAutoTable.finalY + 8;
//   }
//   }

//   // ============ PAGE 2: AI-POWERED STRATEGIC INSIGHTS ============
//   if (shouldIncludeSection('buyerInsights')) {
//     addNewPage();
//     addSectionHeader('AI-Driven Intelligence & Strategy', colors.electricBlue);

//   const ai = reportData.data.missedButWinnable?.ai;

//   if (ai?.strategy_summary) {
//     doc.setFillColor(239, 246, 255);
//     doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 3, 3, 'F');
//     doc.setDrawColor(...colors.electricBlue);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 3, 3, 'S');
    
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('AI Strategy Summary', margin + 4, yPosition + 6);
    
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...colors.darkGray);
//     const summaryLines = doc.splitTextToSize(clean(ai.strategy_summary), pageWidth - 2 * margin - 8);
//     doc.text(summaryLines, margin + 4, yPosition + 12);
    
//     yPosition += 45;
//   }

//   // Likely Wins Section - ENHANCED WITH ALL DATA
//   if (ai?.likely_wins && ai.likely_wins.length > 0) {
//     checkPageBreak(20);
    
//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Likely Wins - High Probability Opportunities', margin, yPosition);
//     yPosition += 10;

//     ai.likely_wins.forEach((win, index) => {
//       checkPageBreak(60);
      
//       // Win item box with better spacing
//       const boxHeight = 40;
//       doc.setFillColor(240, 253, 244);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, boxHeight, 2, 2, 'F');
//       doc.setDrawColor(...colors.successGreen);
//       doc.setLineWidth(0.5);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, boxHeight, 2, 2, 'S');
      
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.successGreen);
//       doc.text(`Opportunity ${index + 1}:`, margin + 3, yPosition + 6);
      
//       doc.setTextColor(...colors.darkGray);
//       const itemText = clean(win.offered_item);
//       const itemLines = doc.splitTextToSize(itemText, pageWidth - 2 * margin - 35);
//       doc.text(itemLines.slice(0, 1), margin + 30, yPosition + 6);
      
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Win Probability Reason:', margin + 3, yPosition + 13);
      
//       doc.setFont('helvetica', 'normal');
//       const reasonLines = doc.splitTextToSize(clean(win.reason), pageWidth - 2 * margin - 8);
//       doc.text(reasonLines.slice(0, 5), margin + 3, yPosition + 18);
      
//       yPosition += boxHeight + 3;

//       // Matching market opportunities table - DISPLAY ALL DATA
//       if (win.matching_market_wins && win.matching_market_wins.length > 0) {
//         checkPageBreak(30);
        
//         // Show ALL matching wins, not limited
//         const matchData = win.matching_market_wins.map(m => [
//           clean(m.bid_number),
//           clean(m.org).substring(0, 32),
//           clean(m.dept).substring(0, 30),
//           (m.quantity || 0).toString(),
//           formatCurrency(m.price_hint || 0),
//           clean(m.confidence || 'medium').toUpperCase()
//         ]);

//         autoTable(doc, {
//           startY: yPosition,
//           head: [['Bid Number', 'Organization', 'Department', 'Qty', 'Price Hint', 'Confidence']],
//           body: matchData,
//           theme: 'grid',
//           headStyles: {
//             fillColor: colors.successGreen,
//             textColor: colors.white,
//             fontSize: 7,
//             fontStyle: 'bold',
//             halign: 'center'
//           },
//           bodyStyles: {
//             fontSize: 7,
//             cellPadding: 1.5
//           },
//           columnStyles: {
//             0: { cellWidth: 26 },
//             1: { cellWidth: 38 },
//             2: { cellWidth: 36 },
//             3: { cellWidth: 12, halign: 'right' },
//             4: { cellWidth: 26, halign: 'right' },
//             5: { cellWidth: 22, halign: 'center', fontStyle: 'bold' }
//           },
//           margin: { left: margin - 3, right: margin, top: SAFE_TOP },
//           didDrawPage: () => {
//             addPageHeader();
//             addPageFooter();
//           }
//         });

//         yPosition = (doc as any).lastAutoTable.finalY + 6;
//       }
//     });
//   }

//   // ============ PAGE 3: AFFINITY SIGNALS & ORGANIZATIONAL INTELLIGENCE ============
//   addNewPage();
//   addSectionHeader('Strategic Affinity Signals', colors.darkBlue);

//   const signals = ai?.signals;

//   if (signals?.org_affinity && signals.org_affinity.length > 0) {
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Organization Affinity', margin, yPosition);
//     yPosition += 6;

//     signals.org_affinity.slice(0, 5).forEach((aff) => {
//       doc.setFillColor(239, 246, 255);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');
      
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkBlue);
//       const orgText = clean(aff.org).substring(0, 45);
//       doc.text(orgText, margin + 3, yPosition + 5);
      
//       if (aff.win_count) {
//         doc.setTextColor(...colors.successGreen);
//         doc.text(`${aff.win_count} wins`, pageWidth - margin - 20, yPosition + 5);
//       }
      
//       doc.setFontSize(7);
//       doc.setFont('helvetica', 'italic');
//       doc.setTextColor(...colors.mediumGray);
//       const signalLines = doc.splitTextToSize(clean(aff.signal), pageWidth - 2 * margin - 8);
//       doc.text(signalLines[0], margin + 3, yPosition + 9);
      
//       yPosition += 14;
//     });
//   }

//   yPosition += 4;

//   if (signals?.dept_affinity && signals.dept_affinity.length > 0) {
//     checkPageBreak(60);
    
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Department Affinity', margin, yPosition);
//     yPosition += 6;

//     signals.dept_affinity.slice(0, 5).forEach((aff) => {
//       doc.setFillColor(254, 243, 199);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');
      
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.warningOrange);
//       const deptText = clean(aff.dept).substring(0, 45);
//       doc.text(deptText, margin + 3, yPosition + 5);
      
//       if (aff.win_count) {
//         doc.setTextColor(...colors.successGreen);
//         doc.text(`${aff.win_count} wins`, pageWidth - margin - 20, yPosition + 5);
//       }
      
//       doc.setFontSize(7);
//       doc.setFont('helvetica', 'italic');
//       doc.setTextColor(...colors.mediumGray);
//       const signalLines = doc.splitTextToSize(clean(aff.signal), pageWidth - 2 * margin - 8);
//       doc.text(signalLines[0], margin + 3, yPosition + 9);
      
//       yPosition += 14;
//     });
//   }

//   yPosition += 4;

//   if (signals?.ministry_affinity && signals.ministry_affinity.length > 0) {
//     checkPageBreak(60);
    
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Ministry Affinity', margin, yPosition);
//     yPosition += 6;

//     signals.ministry_affinity.slice(0, 5).forEach((aff) => {
//       doc.setFillColor(243, 232, 255);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');
      
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(138, 43, 226);
//       const minText = clean(aff.ministry).substring(0, 45);
//       doc.text(minText, margin + 3, yPosition + 5);
      
//       if (aff.win_count) {
//         doc.setTextColor(...colors.successGreen);
//         doc.text(`${aff.win_count} wins`, pageWidth - margin - 20, yPosition + 5);
//       }
      
//       doc.setFontSize(7);
//       doc.setFont('helvetica', 'italic');
//       doc.setTextColor(...colors.mediumGray);
//       const signalLines = doc.splitTextToSize(clean(aff.signal), pageWidth - 2 * margin - 8);
//       doc.text(signalLines[0], margin + 3, yPosition + 9);
      
//       yPosition += 14;
//     });
//   }

//   // Quantity & Price Ranges
//   yPosition += 4;
//   checkPageBreak(80);
  
//   doc.setFontSize(9);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...colors.darkGray);
//   doc.text('Quantity & Price Range Patterns', margin, yPosition);
//   yPosition += 8;

//   // Calculate dynamic heights based on content
//   const boxWidth = (pageWidth - 2 * margin - 5) / 2;
//   let quantityBoxHeight = 15;
//   let priceBoxHeight = 15;

//   if (signals?.quantity_ranges && signals.quantity_ranges.length > 0) {
//     // Calculate required height for quantity ranges
//     let totalLines = 0;
//     signals.quantity_ranges.forEach((range) => {
//       const lines = doc.splitTextToSize('- ' + clean(range), boxWidth - 6);
//       totalLines += lines.length;
//     });
//     quantityBoxHeight = Math.max(15, 10 + (totalLines * 4));

//     doc.setFillColor(240, 253, 244);
//     doc.roundedRect(margin, yPosition, boxWidth, quantityBoxHeight, 2, 2, 'F');
    
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.successGreen);
//     doc.text('Quantity Ranges:', margin + 3, yPosition + 5);
    
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.darkGray);
    
//     let currentY = yPosition + 10;
//     signals.quantity_ranges.forEach((range) => {
//       const rangeLines = doc.splitTextToSize('- ' + clean(range), boxWidth - 6);
//       doc.text(rangeLines, margin + 3, currentY);
//       currentY += (rangeLines.length * 4);
//     });
//   }

//   if (signals?.price_ranges && signals.price_ranges.length > 0) {
//     // Calculate required height for price ranges
//     let totalLines = 0;
//     signals.price_ranges.forEach((range) => {
//       const lines = doc.splitTextToSize('- ' + clean(range), boxWidth - 6);
//       totalLines += lines.length;
//     });
//     priceBoxHeight = Math.max(15, 10 + (totalLines * 4));

//     doc.setFillColor(254, 243, 199);
//     doc.roundedRect((pageWidth / 2) + 2.5, yPosition, boxWidth, priceBoxHeight, 2, 2, 'F');
    
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.warningOrange);
//     doc.text('Price Ranges:', (pageWidth / 2) + 5.5, yPosition + 5);
    
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(7);
//     doc.setTextColor(...colors.darkGray);
    
//     let currentY = yPosition + 10;
//     signals.price_ranges.forEach((range) => {
//       const rangeLines = doc.splitTextToSize('- ' + clean(range), boxWidth - 6);
//       doc.text(rangeLines, (pageWidth / 2) + 5.5, currentY);
//       currentY += (rangeLines.length * 4);
//     });
//   }

//   yPosition += Math.max(quantityBoxHeight, priceBoxHeight) + 5;

//   // ============ PAGE 4: STRATEGIC GUIDANCE & RECOMMENDATIONS ============
//   addNewPage();
//   addSectionHeader('Strategic Roadmap & Action Items', colors.successGreen);

//   const guidance = ai?.guidance;

//   if (guidance?.note) {
//     doc.setFillColor(254, 243, 199);
//     doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 3, 3, 'F');
//     doc.setDrawColor(...colors.warningOrange);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 3, 3, 'S');
    
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.warningOrange);
//     doc.text('Guidance Note', margin + 4, yPosition + 6);
    
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...colors.darkGray);
//     const noteLines = doc.splitTextToSize(clean(guidance.note), pageWidth - 2 * margin - 8);
//     doc.text(noteLines, margin + 4, yPosition + 12);
    
//     yPosition += 35;
//   }

//   if (guidance?.next_steps && guidance.next_steps.length > 0) {
//     checkPageBreak(20);
    
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Next Steps - Action Plan', margin, yPosition);
//     yPosition += 8;

//     guidance.next_steps.forEach((step, index) => {
//       checkPageBreak(25);
      
//       doc.setFillColor(240, 253, 244);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 2, 2, 'F');
//       doc.setDrawColor(...colors.successGreen);
//       doc.setLineWidth(0.3);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 2, 2, 'S');
      
//       doc.setFontSize(10);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.successGreen);
//       doc.text(`${index + 1}.`, margin + 3, yPosition + 6);
      
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(...colors.darkGray);
//       const stepLines = doc.splitTextToSize(clean(step), pageWidth - 2 * margin - 12);
//       doc.text(stepLines, margin + 8, yPosition + 6);
      
//       yPosition += 23;
//     });
//   }

//   if (guidance?.expansion_areas && guidance.expansion_areas.length > 0) {
//     checkPageBreak(20);
    
//     yPosition += 5;
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Expansion Opportunities', margin, yPosition);
//     yPosition += 8;

//     guidance.expansion_areas.forEach((area) => {
//       checkPageBreak(18);
      
//       doc.setFillColor(239, 246, 255);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 2, 2, 'F');
      
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(...colors.darkGray);
//       const areaLines = doc.splitTextToSize('- ' + clean(area), pageWidth - 2 * margin - 8);
//       doc.text(areaLines, margin + 4, yPosition + 5);
      
//       yPosition += 18;
//     });
//   }
//   }

//   // ============ PAGE 5: PRICE BAND ANALYSIS ============
//   if (shouldIncludeSection('marketOverview')) {
//     addNewPage();
//     addSectionHeader('Price Band Analysis', colors.successGreen);

//   const priceBand = reportData.data.priceBand;

//   if (priceBand) {
//     // Price Band Table
//     autoTable(doc, {
//       startY: yPosition,
//       head: [['Price Category', 'Amount']],
//       body: [
//         ['Highest Price', formatCurrency(priceBand.highest)],
//         ['Average Price', formatCurrency(Math.round(priceBand.average))],
//         ['Lowest Price', formatCurrency(priceBand.lowest)]
//       ],
//       theme: 'grid',
//       headStyles: {
//         fillColor: [72, 187, 120],
//         textColor: 255,
//         fontSize: 9,
//         fontStyle: 'bold',
//         halign: 'left'
//       },
//       bodyStyles: {
//         fontSize: 8,
//         cellPadding: 4
//       },
//       columnStyles: {
//         0: { cellWidth: 60, fontStyle: 'bold' },
//         1: { cellWidth: 'auto', halign: 'right' }
//       },
//       margin: { left: margin }
//     });
    
//     yPosition = (doc as any).lastAutoTable.finalY + 15;

//     // Add insights box
//     const insightBoxHeight = 25;
//     doc.setFillColor(239, 246, 255);
//     doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, insightBoxHeight, 3, 3, 'F');
//     doc.setDrawColor(...colors.electricBlue);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, insightBoxHeight, 3, 3, 'S');
    
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.electricBlue);
//     doc.text('Price Insights:', margin + 4, yPosition + 6);
    
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...colors.darkGray);
//     const priceRange = priceBand.highest - priceBand.lowest;
//     const priceVariation = ((priceRange / priceBand.average) * 100).toFixed(1);
//     const insightText = `Price range spans ${formatCurrency(priceRange)} with ${priceVariation}% variation from average. ` +
//       `Target competitive pricing around ${formatCurrency(Math.round(priceBand.lowest * 1.05))} to ${formatCurrency(Math.round(priceBand.average * 0.95))} for optimal positioning.`;
//     const insightLines = doc.splitTextToSize(insightText, pageWidth - 2 * margin - 8);
//     doc.text(insightLines, margin + 4, yPosition + 12);
    
//     yPosition += insightBoxHeight + 5;
//   }
//   }

//   // ============ PAGE 6: CATEGORY DISTRIBUTION ============
//   if (shouldIncludeSection('categoryAnalysis')) {
//     addNewPage();
//     addSectionHeader('Category-wise Tender Distribution', colors.darkBlue);

//   const categoryData = reportData.data.categoryListing;

//   if (categoryData?.categories && categoryData.categories.length > 0) {
//     const categories = categoryData.categories;
//     const maxTimes = Math.max(...categories.map(c => c.times));

//     // Shift bars further to the left and keep numbers inside the bar
//     const chartOffset = 32; // was 50
//     const rightPad = 6;     // keep small right padding
//     const barAreaWidth = pageWidth - 2 * margin - chartOffset - rightPad;

//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Tender Categories by Volume', margin, yPosition);
//     yPosition += 10;

//     categories.forEach((cat) => {
//       const barX = margin + chartOffset;
//       const barWidth = Math.max(0, Math.min(barAreaWidth, (cat.times / maxTimes) * barAreaWidth));

//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(...colors.darkGray);
//       const catName = clean(cat.category).substring(0, 25);
//       doc.text(catName, margin, yPosition);

//       // Value label positioned to the left of the bar to prevent overlap
//       doc.setFont('helvetica', 'bold');
//       doc.setFontSize(7.5);
//       doc.setTextColor(...colors.darkBlue);
//       const valueText = cat.times.toLocaleString();
//       const valueWidth = doc.getTextWidth(valueText);
//       doc.text(valueText, barX - valueWidth - 2, yPosition);

//       // Background track
//       doc.setFillColor(...colors.lightGray);
//       doc.roundedRect(barX, yPosition - 5, barAreaWidth, 8, 1, 1, 'F');

//       // Value bar
//       doc.setFillColor(...colors.darkBlue);
//       doc.roundedRect(barX, yPosition - 5, barWidth, 8, 1, 1, 'F');

//       yPosition += 12;
//     });

//     yPosition += 10;
//   }
//   }

//   // ============ PAGE 7: TOP SELLERS BY DEPARTMENT ============
//   if (shouldIncludeSection('rivalryScore')) {
//     addNewPage();
//     addSectionHeader('Leading Competitors - ' + clean(reportData.meta.params_used.department), colors.warningOrange);

//   const topSellers = reportData.data.topSellersByDept;

//   if (topSellers?.results && topSellers.results.length > 0) {
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Top 10 Sellers by Participation Count', margin, yPosition);
//     yPosition += 10;

//     const sellerTableData = topSellers.results.slice(0, 10).map((seller, index) => {
//       const rank = seller.rank || (index + 1);
//       let rankDisplay = rank.toString();
      
//       // Use simple text instead of emojis to avoid encoding issues
//       if (index === 0) rankDisplay = '1st';
//       else if (index === 1) rankDisplay = '2nd';
//       else if (index === 2) rankDisplay = '3rd';
//       else rankDisplay = `${rank}`;
      
//       return [
//         rankDisplay,
//         clean(seller.seller_name).substring(0, 60),
//         (seller.participation_count || 0).toLocaleString()
//       ];
//     });

//     autoTable(doc, {
//       startY: yPosition,
//       head: [['Rank', 'Seller Name', 'Participation Count']],
//       body: sellerTableData,
//       theme: 'striped',
//       headStyles: {
//         fillColor: colors.warningOrange,
//         textColor: colors.white,
//         fontSize: 9,
//         fontStyle: 'bold',
//         halign: 'center'
//       },
//       bodyStyles: {
//         fontSize: 8,
//         cellPadding: 3
//       },
//       columnStyles: {
//         0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
//         1: { cellWidth: 130 },
//         2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
//       },
//       margin: { left: margin, right: margin, top: SAFE_TOP },
//       didDrawPage: () => {
//         addPageHeader();
//         addPageFooter();
//       }
//     });

//     yPosition = (doc as any).lastAutoTable.finalY + 8;
//   }
//   }

//   // ============ PAGE 8: TOP PERFORMING STATES ============
//   if (shouldIncludeSection('statesAnalysis')) {
//     addNewPage();
//     addSectionHeader('Top Performing States by Tender Volume', colors.successGreen);

//   const statesData = reportData.data.topPerformingStates;

//   if (statesData?.results && statesData.results.length > 0) {
//     const states = statesData.results.slice(0, 29);
//     const maxTenders = Math.max(...states.map(s => s.total_tenders));

//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('State-wise Tender Distribution (Top 29 States)', margin, yPosition);
//     yPosition += 10;

//     states.forEach((state, index) => {
//       checkPageBreak(10);
      
//       const barAreaWidth = pageWidth - 2 * margin - 65;
//       const barWidth = ((state.total_tenders / maxTenders) * barAreaWidth);
      
//       let fillColor: [number, number, number] = colors.successGreen;
//       if (index < 5) {
//         fillColor = colors.darkBlue;
//       }
      
//       doc.setFontSize(7);
//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(...colors.darkGray);
//       const stateText = clean(state.state_name).substring(0, 25);
//       doc.text(stateText, margin, yPosition);
      
//       // Draw numerical value on the left side of the bar
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...fillColor);
//       const valueText = state.total_tenders.toLocaleString();
//       const valueWidth = doc.getTextWidth(valueText);
//       doc.text(valueText, margin + 60 - valueWidth - 2, yPosition);
      
//       doc.setFillColor(...colors.lightGray);
//       doc.roundedRect(margin + 60, yPosition - 4, barAreaWidth, 6, 1, 1, 'F');
      
//       doc.setFillColor(...fillColor);
//       doc.roundedRect(margin + 60, yPosition - 4, barWidth, 6, 1, 1, 'F');
      
//       yPosition += 9;
//     });
//   }
//   }

//   // ============ PAGE 9: DEPARTMENTAL LANDSCAPE ============
//   if (shouldIncludeSection('departmentsAnalysis')) {
//     addNewPage();
//     addSectionHeader('All Departments - Tender Volume Overview', colors.darkBlue);

//   const allDepts = reportData.data.allDepartments;

//   if (allDepts && allDepts.length > 0) {
//     const depts = allDepts.slice(0, 20);
//     const maxTenders = Math.max(...depts.map(d => typeof d.total_tenders === 'string' ? parseInt(d.total_tenders) : d.total_tenders));

//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Department-wise Tender Distribution (Top 20)', margin, yPosition);
//     yPosition += 10;

//     depts.forEach((dept) => {
//       checkPageBreak(10);
      
//       const tenderCount = typeof dept.total_tenders === 'string' ? parseInt(dept.total_tenders) : dept.total_tenders;
//       const barAreaWidth = pageWidth - 2 * margin - 75;
//       const barWidth = ((tenderCount / maxTenders) * barAreaWidth);
      
//       doc.setFontSize(7);
//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(...colors.darkGray);
//       const deptText = clean(dept.department).substring(0, 32);
//       doc.text(deptText, margin, yPosition);
      
//       // Draw numerical value on the left side of the bar
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkBlue);
//       const valueText = tenderCount.toLocaleString();
//       const valueWidth = doc.getTextWidth(valueText);
//       doc.text(valueText, margin + 70 - valueWidth - 2, yPosition);
      
//       doc.setFillColor(...colors.lightGray);
//       doc.roundedRect(margin + 70, yPosition - 4, barAreaWidth, 6, 1, 1, 'F');
      
//       doc.setFillColor(...colors.darkBlue);
//       doc.roundedRect(margin + 70, yPosition - 4, barWidth, 6, 1, 1, 'F');
      
//       yPosition += 9;
//     });
//   }
//   }

//   // ============ PAGE 10: LOW COMPETITION OPPORTUNITIES ============
//   if (shouldIncludeSection('lowCompetition')) {
//     addNewPage();
//     addSectionHeader('Low Competition Bids - Strategic Opportunities', colors.successGreen);

//   const lowCompBids = reportData.data.lowCompetitionBids;

//   if (lowCompBids?.results && lowCompBids.results.length > 0) {
//     const bids = lowCompBids.results.slice(0, 25);

//     const summaryCardHeight = 20;
//     doc.setFillColor(240, 253, 244);
//     doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, summaryCardHeight, 2, 2, 'F');
//     doc.setDrawColor(...colors.successGreen);
//     doc.setLineWidth(0.5);
//     doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, summaryCardHeight, 2, 2, 'S');
    
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.mediumGray);
//     doc.text('Total Low Competition Bids: ', margin + 5, yPosition + 8);
//     doc.setTextColor(...colors.successGreen);
//     doc.text(lowCompBids.count.toLocaleString(), margin + 65, yPosition + 8);
    
//     doc.setTextColor(...colors.mediumGray);
//     doc.text('Generated At: ', margin + 5, yPosition + 15);
//     doc.setTextColor(...colors.darkGray);
//     doc.text(formatDate(lowCompBids.generated_at), margin + 35, yPosition + 15);
    
//     yPosition += summaryCardHeight + 6;

//     // Add note about data
//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'italic');
//     doc.setTextColor(...colors.mediumGray);
//     doc.text('Note: "-" indicates data not available from source system. Low seller count indicates opportunity.', margin, yPosition);
//     yPosition += 6;

//     const bidTableData = bids.map((bid) => [
//       clean(bid.bid_number).substring(0, 23),
//       (bid.quantity || 0).toLocaleString(),
//       clean(bid.organisation).substring(0, 30) || '-',
//       clean(bid.department).substring(0, 28) || '-',
//       clean(bid.ministry).substring(0, 25) || '-',
//       bid.bid_end_ts ? formatDate(bid.bid_end_ts) : '-',
//       (bid.seller_count || 0).toString()
//     ]);

//     autoTable(doc, {
//       startY: yPosition,
//       head: [['Bid Number', 'Qty', 'Organization', 'Department', 'Ministry', 'Bid End Date', 'Sellers']],
//       body: bidTableData,
//       theme: 'grid',
//       headStyles: {
//         fillColor: colors.successGreen,
//         textColor: colors.white,
//         fontSize: 7.5,
//         fontStyle: 'bold',
//         halign: 'center',
//         cellPadding: 2.5
//       },
//       bodyStyles: {
//         fontSize: 7,
//         cellPadding: 2,
//         lineColor: [209, 213, 219],
//         lineWidth: 0.2
//       },
//       columnStyles: {
//         0: { cellWidth: 24 },
//         1: { cellWidth: 11, halign: 'right', fontStyle: 'bold' },
//         2: { cellWidth: 33 },
//         3: { cellWidth: 32 },
//         4: { cellWidth: 28 },
//         5: { cellWidth: 20, halign: 'center' },
//         6: { cellWidth: 13, halign: 'center', fontStyle: 'bold', textColor: [231, 76, 60], fillColor: [254, 242, 242] }
//       },
//       margin: { left: margin - 2, right: margin - 2, top: SAFE_TOP },
//       didDrawPage: () => {
//         addPageHeader();
//         addPageFooter();
//       }
//     });

//     yPosition = (doc as any).lastAutoTable.finalY + 8;
//   }
//   }

//   // ============ PAGES 11-12: SELLER BID PERFORMANCE ANALYSIS ============
//   if (shouldIncludeSection('bidsSummary')) {
//     const sellerBids = reportData.data.sellerBids;

//     if (sellerBids) {
//       addNewPage();
//       addSectionHeader(clean(reportData.meta.params_used.sellerName) + ' - Bidding Performance Deep Dive', colors.electricBlue);

//     // Performance Summary Cards
//     if (sellerBids.table1) {
//       const t1 = sellerBids.table1;
//       const cardWidth = (pageWidth - 2 * margin - 15) / 3;
//       const cardHeight = 25;
//       let cardX = margin;
      
//       const cardsData = [
//         { label: 'Total Wins', value: t1.win.toLocaleString(), color: colors.successGreen, bgColor: [240, 253, 244] },
//         { label: 'Total Lost', value: t1.lost.toLocaleString(), color: colors.errorRed, bgColor: [254, 226, 226] },
//         { label: 'Win Rate', value: `${((t1.win / (t1.win + t1.lost)) * 100).toFixed(1)}%`, color: colors.darkBlue, bgColor: [239, 246, 255] }
//       ];

//       cardsData.forEach((card, index) => {
//       doc.setFillColor(card.bgColor[0], card.bgColor[1], card.bgColor[2]);
//       doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 2, 2, 'F');
        
//         doc.setFontSize(16);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...card.color);
//         doc.text(card.value, cardX + cardWidth / 2, yPosition + 13, { align: 'center' });
        
//         doc.setFontSize(8);
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(card.label, cardX + cardWidth / 2, yPosition + 20, { align: 'center' });
        
//         cardX += cardWidth + 5;
//       });
      
//       yPosition += cardHeight + 6;

//       cardX = margin;
//       const cardsData2 = [
//         { label: 'Total Bid Value', value: formatCurrency(t1.totalBidValue), color: colors.warningOrange, bgColor: [254, 243, 199] },
//         { label: 'Qualified Bid Value', value: formatCurrency(t1.qualifiedBidValue), color: colors.successGreen, bgColor: [240, 253, 244] },
//         { label: 'Avg Order Value', value: formatCurrency(t1.averageOrderValue), color: [138, 43, 226], bgColor: [243, 232, 255] }
//       ];

//       cardsData2.forEach((card, index) => {
//         doc.setFillColor(card.bgColor[0], card.bgColor[1], card.bgColor[2]);
//         doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 2, 2, 'F');
        
//         doc.setFontSize(11);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(card.color[0], card.color[1], card.color[2]);
//         const valueText = card.value.length > 18 ? card.value.substring(0, 18) : card.value;
//         doc.text(valueText, cardX + cardWidth / 2, yPosition + 13, { align: 'center' });
        
//         doc.setFontSize(8);
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(...colors.mediumGray);
//         doc.text(card.label, cardX + cardWidth / 2, yPosition + 20, { align: 'center' });
        
//         cardX += cardWidth + 5;
//       });
      
//       yPosition += cardHeight + 10;
//     }

//     // Departmental Performance
//     if (sellerBids.departmentCount && sellerBids.departmentCount.length > 0) {
//       checkPageBreak(20);
      
//       doc.setFontSize(10);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Revenue by Department', margin, yPosition);
//       yPosition += 8;

//       const deptTableData = sellerBids.departmentCount
//         .sort((a, b) => b.revenue - a.revenue)
//         .map((dept) => [
//           clean(dept.department).substring(0, 50),
//           dept.bid_count.toLocaleString(),
//           formatCurrency(dept.revenue)
//         ]);

//       const totalRevenue = sellerBids.departmentCount.reduce((sum, d) => sum + d.revenue, 0);
//       deptTableData.push([
//         'TOTAL',
//         sellerBids.departmentCount.reduce((sum, d) => sum + d.bid_count, 0).toLocaleString(),
//         formatCurrency(totalRevenue)
//       ]);

//       autoTable(doc, {
//         startY: yPosition,
//         head: [['Department', 'Bid Count', 'Revenue']],
//         body: deptTableData,
//         theme: 'striped',
//         headStyles: {
//           fillColor: colors.darkBlue,
//           textColor: colors.white,
//           fontSize: 8,
//           fontStyle: 'bold'
//         },
//         bodyStyles: {
//           fontSize: 8,
//           cellPadding: 2.5
//         },
//         columnStyles: {
//           0: { cellWidth: 120 },
//           1: { cellWidth: 30, halign: 'right' },
//           2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
//         },
//         margin: { left: margin, right: margin, top: SAFE_TOP },
//         didDrawPage: () => {
//           addPageHeader();
//           addPageFooter();
//         }
//       });

//       yPosition = (doc as any).lastAutoTable.finalY + 10;
//     }

//     // State-wise Analysis
//     if (sellerBids.stateCount && sellerBids.stateCount.length > 0) {
//       checkPageBreak(20);
      
//       doc.setFontSize(10);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Bids by State', margin, yPosition);
//       yPosition += 8;

//       const stateTableData = sellerBids.stateCount
//         .sort((a, b) => b.revenue - a.revenue)
//         .slice(0, 15)
//         .map((state) => [
//           clean(state.state).substring(0, 40),
//           state.bid_count.toLocaleString(),
//           formatCurrency(state.revenue)
//         ]);

//       autoTable(doc, {
//         startY: yPosition,
//         head: [['State', 'Bid Count', 'Revenue']],
//         body: stateTableData,
//         theme: 'grid',
//         headStyles: {
//           fillColor: colors.successGreen,
//           textColor: colors.white,
//           fontSize: 8,
//           fontStyle: 'bold'
//         },
//         bodyStyles: {
//           fontSize: 8,
//           cellPadding: 2
//         },
//         columnStyles: {
//           0: { cellWidth: 100 },
//           1: { cellWidth: 30, halign: 'right' },
//           2: { cellWidth: 50, halign: 'right' }
//         },
//         margin: { left: margin, right: margin, top: SAFE_TOP },
//         didDrawPage: () => {
//           addPageHeader();
//           addPageFooter();
//         }
//       });

//       yPosition = (doc as any).lastAutoTable.finalY + 8;
//     }

//     // Monthly Trends
//     if (sellerBids.monthlyTotals && sellerBids.monthlyTotals.length > 0) {
//       addNewPage();
//       addSectionHeader('Monthly Bidding Trends', colors.warningOrange);

//       const monthlyTableData = sellerBids.monthlyTotals.map((month) => [
//         clean(month.month),
//         formatCurrency(month.bid_value)
//       ]);

//       autoTable(doc, {
//         startY: yPosition,
//         head: [['Month', 'Bid Value']],
//         body: monthlyTableData,
//         theme: 'striped',
//         headStyles: {
//           fillColor: colors.warningOrange,
//           textColor: colors.white,
//           fontSize: 9,
//           fontStyle: 'bold'
//         },
//         bodyStyles: {
//           fontSize: 8,
//           cellPadding: 3
//         },
//         columnStyles: {
//           0: { cellWidth: 50 },
//           1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
//         },
//         margin: { left: margin, right: margin, top: SAFE_TOP },
//         didDrawPage: () => {
//           addPageHeader();
//           addPageFooter();
//         }
//       });

//       yPosition = (doc as any).lastAutoTable.finalY + 8;
//     }

//     // ============ PAGES 13-14: DETAILED BID HISTORY ============
//     if (sellerBids.sortedRows && sellerBids.sortedRows.length > 0) {
//       addNewPage();
//       addSectionHeader('Bid-by-Bid Performance History', colors.electricBlue);

//       // Add note about data availability
//       doc.setFontSize(7);
//       doc.setFont('helvetica', 'italic');
//       doc.setTextColor(...colors.mediumGray);
//       doc.text('Note: "-" indicates data not available from source system', margin, yPosition);
//       yPosition += 6;

//       const bidHistoryData = sellerBids.sortedRows.map((row) => {
//         const r: any = row as any;
//         const status = clean(r.seller_status ?? r.status);
//         const organisation = clean(r.organisation ?? r.org).substring(0, 28) || '-';
//         const department = clean(r.department ?? r.dept).substring(0, 28) || '-';
//         const price = r.total_price != null ? formatCurrency(r.total_price) : '-';
//         return [
//           row.participated_on ? formatDate(row.participated_on) : '-',
//           clean(row.offered_item).substring(0, 42),
//           status || '-',
//           clean(row.rank) || '-',
//           price,
//           organisation,
//           department
//         ];
//       });

//       autoTable(doc, {
//         startY: yPosition,
//         head: [['Date', 'Item', 'Status', 'Rank', 'Price', 'Organization', 'Department']],
//         body: bidHistoryData,
//         theme: 'grid',
//         headStyles: {
//           fillColor: colors.electricBlue,
//           textColor: colors.white,
//           fontSize: 7.5,
//           fontStyle: 'bold',
//           halign: 'center',
//           cellPadding: 3
//         },
//         bodyStyles: {
//           fontSize: 7,
//           cellPadding: 2.5,
//           lineColor: [209, 213, 219],
//           lineWidth: 0.2,
//           minCellHeight: 8
//         },
//         columnStyles: {
//           0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
//           1: { cellWidth: 46 },
//           2: { cellWidth: 16, halign: 'center' },
//           3: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
//           4: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
//           5: { cellWidth: 32 },
//           6: { cellWidth: 30 }
//         },
//         margin: { left: margin - 2, right: margin - 2, top: SAFE_TOP },
//         showHead: 'everyPage',
//         willDrawCell: (data: any) => {
//           if (data.section === 'body' && data.column.index === 2) {
//             const status = data.cell.raw;
//             if (status === 'Qualified') {
//               data.cell.styles.textColor = colors.successGreen;
//             } else if (status && status.toLowerCase().includes('disqualified')) {
//               data.cell.styles.textColor = colors.errorRed;
//             }
//           }
//           if (data.section === 'body' && data.column.index === 3) {
//             const rank = data.cell.raw;
//             if (rank === 'L1') {
//               data.cell.styles.fillColor = [240, 253, 244];
//               data.cell.styles.textColor = colors.successGreen;
//             } else if (rank === 'L2') {
//               data.cell.styles.fillColor = [254, 243, 199];
//               data.cell.styles.textColor = colors.warningOrange;
//             }
//           }
//         },
//         didDrawPage: (data: any) => {
//           if (data.pageNumber > data.table.startPageNumber) {
//             addPageHeader();
//             addPageFooter();
//           }
//         }
//       });

//       yPosition = (doc as any).lastAutoTable.finalY + 8;
//     }
//   }
//   }

//   return doc;
// };



import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    sellerBids?: {
      departmentCount?: Array<{ department: string; bid_count: number; revenue: number }>;
      stateCount?: Array<{ state: string; bid_count: number; revenue: number }>;
      monthlyTotals?: Array<{ month: string; bid_value: number }>;
      sortedRows?: Array<{
        participated_on: string;
        offered_item: string;
        seller_status?: string;
        status?: string;
        rank?: string;
        total_price?: number;
        organisation?: string;
        org?: string;
        department?: string;
        dept?: string;
      }>;
      table1?: {
        win: number;
        lost: number;
        totalBidValue: number;
        qualifiedBidValue: number;
        averageOrderValue: number;
      };
    };
    estimatedMissedValue?: any;
    priceBand?: { highest?: number; lowest?: number; average?: number };
    topPerformingStates?: {
      results: Array<{ state_name: string; total_tenders: number }>;
    };
    topSellersByDept?: {
      department: string;
      total: number;
      results: Array<{ seller_name: string; participation_count: number; rank?: number }>;
    };
    categoryListing?: {
      categories: Array<{ category: string; times: number }>;
      metadata: { totalItems: number; totalCount: number; processingTime: number };
    };
    allDepartments?: Array<{ department: string; total_tenders: string | number }>;
    lowCompetitionBids?: {
      results: Array<{
        bid_number?: string;
        quantity?: number;
        organisation?: string;
        department?: string;
        ministry?: string;
        bid_end_ts?: string;
        seller_count?: number;
      }>;
      count: number;
      generated_at: string;
    };
    missedButWinnable: {
      seller: string;
      recentWins: Array<{
        bid_number?: string;
        offered_item?: string;
        quantity?: number;
        total_price?: number;
        org?: string;
        dept?: string;
        ministry?: string;
        ended_at?: string;
      }>;
      marketWins: Array<{
        bid_number?: string;
        seller_name?: string;
        offered_item?: string;
        quantity?: number;
        total_price?: number;
        org?: string;
        dept?: string;
        ministry?: string;
        ended_at?: string;
      }>;
      ai: {
        strategy_summary?: string;
        likely_wins?: Array<{
          offered_item?: string;
          reason?: string;
          matching_market_wins?: Array<{
            original_b_id?: number;
            bid_number?: string;
            org?: string;
            dept?: string;
            ministry?: string;
            quantity?: number;
            price_hint?: number;
            confidence?: string;
          }>;
        }>;
        signals?: {
          org_affinity?: Array<{ org?: string; win_count?: number; signal?: string }>;
          dept_affinity?: Array<{ dept?: string; win_count?: number; signal?: string }>;
          ministry_affinity?: Array<{ ministry?: string; win_count?: number; signal?: string }>;
          quantity_ranges?: Array<string | { min?: number; max?: number }>;
          price_ranges?: Array<string | { min?: number; max?: number }>;
        };
        guidance?: {
          note?: string;
          next_steps?: Array<string>;
          expansion_areas?: Array<string>;
        };
      };
    };
  };
}

interface FilterOptions {
  includeSections: string[];
}

/* ------------------------------------------------------------------ */
/*                         COLOR SYSTEM (RGB)                          */
/* ------------------------------------------------------------------ */
const colors = {
  navyBlue: [30, 58, 95] as [number, number, number],
  darkBlue: [74, 144, 226] as [number, number, number],
  electricBlue: [74, 144, 226] as [number, number, number],
  successGreen: [46, 204, 113] as [number, number, number],
  warningOrange: [243, 156, 18] as [number, number, number],
  errorRed: [231, 76, 60] as [number, number, number],
  neutralGray: [107, 114, 128] as [number, number, number],
  darkGray: [55, 65, 81] as [number, number, number],
  mediumGray: [107, 114, 128] as [number, number, number],
  lightGray: [209, 213, 219] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  black: [0, 0, 0] as [number, number, number],
  lightBlue: [239, 246, 255] as [number, number, number],
  backgroundGray: [249, 250, 251] as [number, number, number],
};

/* ------------------------------------------------------------------ */
/*                         UTILITY HELPERS                             */
/* ------------------------------------------------------------------ */
const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v: any) => typeof v === 'number' && !isNaN(v);
const toNumber = (v: any): number | null => {
  if (isNum(v)) return v as number;
  if (v == null) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
};

const clampStr = (s: string, max = 999): string => (s.length > max ? s.slice(0, max) : s);

/** Robust clean: handles objects/arrays safely and normalizes text */
const clean = (value: any): string => {
  if (value === null || value === undefined) return '-';
  if (Array.isArray(value)) {
    const flat = value.map((v) => {
      if (v === null || v === undefined) return '';
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
      if (isObj(v)) {
        // stringify common {min,max} or {from,to}
        const min = (v as any).min ?? (v as any).from;
        const max = (v as any).max ?? (v as any).to;
        if (min !== undefined || max !== undefined) return `${min ?? ''}-${max ?? ''}`;
        try {
          return JSON.stringify(v);
        } catch {
          return '';
        }
      }
      return String(v);
    });
    return flat.filter(Boolean).join(', ') || '-';
  }
  if (isObj(value)) {
    // Friendly stringify for common range shapes
    const min = (value as any).min ?? (value as any).from;
    const max = (value as any).max ?? (value as any).to;
    if (min !== undefined || max !== undefined) {
      return `${min ?? ''}-${max ?? ''}`;
    }
    try {
      return JSON.stringify(value);
    } catch {
      return '-';
    }
  }
  const s = String(value);
  return (
    s
      .replace(/[₹]/g, 'Rs ')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u00A0/g, ' ')
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/[\u2022\u2023\u2043]/g, '*')
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/\s+/g, ' ')
      .trim() || '-'
  );
};

const safeText = (v: any, fallback = '-'): string => {
  const c = clean(v);
  return c === '-' ? fallback : c;
};

const short = (v: any, len: number, fallback = '-') => {
  const c = clean(v);
  return c === '-' ? fallback : clampStr(c, len);
};

const formatCurrency = (amount: number | string | null | undefined): string => {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (n == null) return '-';
  const num = Number(n);
  if (!isFinite(num) || num === 0) return '-';
  try {
    return `Rs ${num.toLocaleString('en-IN')}`;
  } catch {
    return `Rs ${num}`;
  }
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString || dateString === 'N/A' || dateString === 'undefined') return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .replace(/ /g, '-');
  } catch {
    return '-';
  }
};

const rangeToStr = (r: any): string => {
  if (typeof r === 'string') return clean(r);
  if (Array.isArray(r)) return clean(r);
  if (isObj(r)) {
    const min = (r as any).min ?? (r as any).from;
    const max = (r as any).max ?? (r as any).to;
    if (min == null && max == null) return clean(r);
    return `${min ?? ''}-${max ?? ''}`;
  }
  return clean(r);
};

const tableDefaults = {
  theme: 'striped' as const,
  headStyles: {
    halign: 'center' as const,
    fontStyle: 'bold' as const,
  },
  bodyStyles: {
    fontSize: 7,
    cellPadding: 2,
    minCellHeight: 8,
    overflow: 'linebreak' as const,
    valign: 'middle' as const,
  },
};

/* ------------------------------------------------------------------ */
/*                            MAIN EXPORT                              */
/* ------------------------------------------------------------------ */
export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const HEADER_H = 18;
  const FOOTER_H = 12;
  const SAFE_TOP = HEADER_H + 5;
  const SAFE_BOTTOM = pageHeight - FOOTER_H - 8;
  let yPosition = SAFE_TOP;

  const shouldIncludeSection = (sectionId: string): boolean =>
    filters?.includeSections?.includes(sectionId) ?? false;

  const addPageHeader = () => {
    doc.setFillColor(...colors.navyBlue);
    doc.rect(0, 0, pageWidth, HEADER_H, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text('GOVERNMENT TENDER ANALYSIS', pageWidth / 2, 11, { align: 'center' });
  };

  const addPageFooter = () => {
    const pageNum = (doc as any).getCurrentPageInfo?.().pageNumber ?? (doc as any).internal?.getNumberOfPages?.();
    doc.setFillColor(...colors.navyBlue);
    doc.rect(0, pageHeight - FOOTER_H, pageWidth, FOOTER_H, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.white);
    doc.text(safeText(reportData?.meta?.params_used?.sellerName), margin, pageHeight - 6);
    doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
    doc.text(formatDate(reportData?.meta?.report_generated_at), pageWidth - margin, pageHeight - 6, { align: 'right' });
  };

  const addNewPage = () => {
    doc.addPage();
    yPosition = SAFE_TOP;
    addPageHeader();
    addPageFooter();
  };

  const checkPageBreak = (requiredSpace: number): boolean => {
    if (yPosition + requiredSpace > SAFE_BOTTOM) {
      addNewPage();
      return true;
    }
    return false;
  };

  const addSectionHeader = (title: string, color: [number, number, number] = colors.navyBlue) => {
    checkPageBreak(15);
    doc.setFillColor(...color);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text(title, margin + 4, yPosition + 7);
    yPosition += 13;
  };

  /* ---------------------------- COVER PAGE ---------------------------- */
  doc.setFillColor(...colors.navyBlue);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative circles
  doc.setFillColor(20, 40, 75);
  doc.circle(pageWidth + 40, -20, 80, 'F');
  doc.circle(-50, pageHeight / 2, 100, 'F');
  doc.circle(pageWidth + 20, pageHeight + 30, 70, 'F');

  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.white);
  doc.text('GOVERNMENT', pageWidth / 2, 60, { align: 'center' });
  doc.text('TENDER ANALYSIS', pageWidth / 2, 72, { align: 'center' });

  // Subtitle
  yPosition = 90;
  doc.setFillColor(25, 50, 85);
  doc.roundedRect(margin + 10, yPosition, pageWidth - 2 * margin - 20, 14, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.electricBlue);
  doc.text('Comprehensive Performance Report', pageWidth / 2, yPosition + 9, { align: 'center' });

  // Company
  yPosition = 115;
  const companyBoxWidth = pageWidth - 60;
  doc.setFillColor(15, 30, 55);
  doc.roundedRect((pageWidth - companyBoxWidth) / 2, yPosition, companyBoxWidth, 20, 3, 3, 'F');
  doc.setDrawColor(...colors.electricBlue);
  doc.setLineWidth(0.5);
  doc.roundedRect((pageWidth - companyBoxWidth) / 2, yPosition, companyBoxWidth, 20, 3, 3, 'S');
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.electricBlue);
  doc.text(safeText(reportData?.meta?.params_used?.sellerName), pageWidth / 2, yPosition + 13, { align: 'center' });

  // Metadata
  yPosition = 150;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.white);
  doc.text('Report Generated: ' + formatDate(reportData?.meta?.report_generated_at), pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;
  doc.text('Analysis Period: ' + (reportData?.meta?.params_used?.days ?? '-') + ' days', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;
  doc.text('Department: ' + safeText(reportData?.meta?.params_used?.department, '-'), pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 12;
  doc.setFontSize(9);
  doc.text('Offered Items:', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 6;
  const itemLines = doc.splitTextToSize(
    short(reportData?.meta?.params_used?.offeredItem ?? 'Various items', 200),
    pageWidth - 40
  );
  doc.text(itemLines.slice(0, 3), pageWidth / 2, yPosition, { align: 'center' });

  /* ---------------- MISSED BUT WINNABLE — RECENT & MARKET WINS ---------------- */
  if (shouldIncludeSection('missedTenders')) {
    addNewPage();
    addSectionHeader('Missed But Winnable - Market Intelligence', colors.darkBlue);

    const recentWins = reportData?.data?.missedButWinnable?.recentWins ?? [];
    if (recentWins.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('Recent Wins by ' + safeText(reportData?.meta?.params_used?.sellerName), margin, yPosition);
      yPosition += 8;

      const winsTableData = recentWins.map((win) => [
        short(win?.bid_number, 25),
        short(win?.offered_item, 60),
        String(win?.quantity ?? 0),
        formatCurrency(win?.total_price ?? 0),
        short(win?.org, 30),
        short(win?.dept, 35),
        formatDate(win?.ended_at),
      ]);

      autoTable(doc, {
        ...tableDefaults,
        startY: yPosition,
        head: [['Bid Number', 'Item Category', 'Qty', 'Total Price', 'Organization', 'Department', 'End Date']],
        body: winsTableData,
        headStyles: { ...tableDefaults.headStyles, fillColor: colors.darkBlue, textColor: colors.white, fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 26 },
          1: { cellWidth: 60 },
          2: { cellWidth: 12, halign: 'right' },
          3: { cellWidth: 25, halign: 'right' },
          4: { cellWidth: 33 },
          5: { cellWidth: 33 },
          6: { cellWidth: 20, halign: 'center' },
        },
        margin: { left: margin - 3, right: margin, top: SAFE_TOP },
        showHead: 'everyPage',
        didDrawPage: (data: any) => {
          if (data.pageNumber > data.table.startPageNumber) {
            addPageHeader();
            addPageFooter();
          }
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    const marketWins = reportData?.data?.missedButWinnable?.marketWins ?? [];
    if (marketWins.length > 0) {
      checkPageBreak(60);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('Competitor Market Wins', margin, yPosition);
      yPosition += 8;

      const marketTableData = marketWins.map((win) => [
        short(win?.bid_number, 25),
        short(win?.seller_name, 30),
        short(win?.offered_item, 45),
        String(win?.quantity ?? 0),
        formatCurrency(win?.total_price ?? 0),
        short(win?.org, 30),
        short(win?.dept, 30),
        formatDate(win?.ended_at),
      ]);

      autoTable(doc, {
        ...tableDefaults,
        startY: yPosition,
        head: [['Bid Number', 'Seller Name', 'Item', 'Qty', 'Price', 'Organization', 'Department', 'End Date']],
        body: marketTableData,
        headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 7 },
        bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 6.5 },
        columnStyles: {
          0: { cellWidth: 24 },
          1: { cellWidth: 28 },
          2: { cellWidth: 45 },
          3: { cellWidth: 10, halign: 'right' },
          4: { cellWidth: 22, halign: 'right' },
          5: { cellWidth: 28 },
          6: { cellWidth: 28 },
          7: { cellWidth: 18, halign: 'center' },
        },
        margin: { left: margin, right: margin, top: SAFE_TOP },
        showHead: 'everyPage',
        didDrawPage: (data: any) => {
          if (data.pageNumber > data.table.startPageNumber) {
            addPageHeader();
            addPageFooter();
          }
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 8;
    }
  }

  /* -------------------------- AI-POWERED INSIGHTS -------------------------- */
  if (shouldIncludeSection('buyerInsights')) {
    addNewPage();
    addSectionHeader('AI-Driven Intelligence & Strategy', colors.electricBlue);

    const ai = reportData?.data?.missedButWinnable?.ai ?? {};

    if (ai?.strategy_summary) {
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 3, 3, 'F');
      doc.setDrawColor(...colors.electricBlue);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 3, 3, 'S');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('AI Strategy Summary', margin + 4, yPosition + 6);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.darkGray);
      const summaryLines = doc.splitTextToSize(safeText(ai.strategy_summary), pageWidth - 2 * margin - 8);
      doc.text(summaryLines, margin + 4, yPosition + 12);

      yPosition += 45;
    }

    // Likely wins
    if (Array.isArray(ai?.likely_wins) && ai.likely_wins.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('Likely Wins - High Probability Opportunities', margin, yPosition);
      yPosition += 10;

      ai.likely_wins.forEach((win: any, index: number) => {
        checkPageBreak(60);
        const boxHeight = 40;
        doc.setFillColor(240, 253, 244);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, boxHeight, 2, 2, 'F');
        doc.setDrawColor(...colors.successGreen);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, boxHeight, 2, 2, 'S');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.successGreen);
        doc.text(`Opportunity ${index + 1}:`, margin + 3, yPosition + 6);

        doc.setTextColor(...colors.darkGray);
        const itemText = short(win?.offered_item, 120);
        const itemLines2 = doc.splitTextToSize(itemText, pageWidth - 2 * margin - 35);
        doc.text(itemLines2.slice(0, 1), margin + 30, yPosition + 6);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.darkGray);
        doc.text('Win Probability Reason:', margin + 3, yPosition + 13);

        doc.setFont('helvetica', 'normal');
        const reasonLines = doc.splitTextToSize(safeText(win?.reason), pageWidth - 2 * margin - 8);
        doc.text(reasonLines.slice(0, 5), margin + 3, yPosition + 18);

        yPosition += boxHeight + 3;

        // Matching market wins table
        const mmw = Array.isArray(win?.matching_market_wins) ? win.matching_market_wins : [];
        if (mmw.length > 0) {
          checkPageBreak(30);
          const matchData = mmw.map((m: any) => [
            short(m?.bid_number, 26),
            short(m?.org, 32),
            short(m?.dept, 30),
            String(m?.quantity ?? 0),
            formatCurrency(m?.price_hint ?? 0),
            short((m?.confidence ?? '').toString().toUpperCase(), 12, 'MEDIUM'),
          ]);

          autoTable(doc, {
            ...tableDefaults,
            startY: yPosition,
            head: [['Bid Number', 'Organization', 'Department', 'Qty', 'Price Hint', 'Confidence']],
            body: matchData,
            theme: 'grid',
            headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 7 },
            bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7, cellPadding: 1.5 },
            columnStyles: {
              0: { cellWidth: 26 },
              1: { cellWidth: 38 },
              2: { cellWidth: 36 },
              3: { cellWidth: 12, halign: 'right' },
              4: { cellWidth: 26, halign: 'right' },
              5: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
            },
            margin: { left: margin - 3, right: margin, top: SAFE_TOP },
            didDrawPage: () => {
              addPageHeader();
              addPageFooter();
            },
          });

          yPosition = (doc as any).lastAutoTable.finalY + 6;
        }
      });
    }

    /* ------------------- Strategic Affinity Signals ------------------- */
    addNewPage();
    addSectionHeader('Strategic Affinity Signals', colors.darkBlue);
    const signals = ai?.signals ?? {};

    if (Array.isArray(signals?.org_affinity) && signals.org_affinity.length > 0) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('Organization Affinity', margin, yPosition);
      yPosition += 6;

      signals.org_affinity.slice(0, 5).forEach((aff) => {
        doc.setFillColor(239, 246, 255);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.darkBlue);
        doc.text(short(aff?.org, 45), margin + 3, yPosition + 5);

        if (toNumber(aff?.win_count) != null) {
          doc.setTextColor(...colors.successGreen);
          doc.text(`${toNumber(aff?.win_count)}`, pageWidth - margin - 10, yPosition + 5, { align: 'right' });
        }

        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(...colors.mediumGray);
        const line = doc.splitTextToSize(safeText(aff?.signal), pageWidth - 2 * margin - 8);
        doc.text(line[0] ?? '-', margin + 3, yPosition + 9);

        yPosition += 14;
      });
    }

    yPosition += 4;

    if (Array.isArray(signals?.dept_affinity) && signals.dept_affinity.length > 0) {
      checkPageBreak(60);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('Department Affinity', margin, yPosition);
      yPosition += 6;

      signals.dept_affinity.slice(0, 5).forEach((aff) => {
        doc.setFillColor(254, 243, 199);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.warningOrange);
        doc.text(short(aff?.dept, 45), margin + 3, yPosition + 5);

        if (toNumber(aff?.win_count) != null) {
          doc.setTextColor(...colors.successGreen);
          doc.text(`${toNumber(aff?.win_count)}`, pageWidth - margin - 10, yPosition + 5, { align: 'right' });
        }

        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(...colors.mediumGray);
        const line = doc.splitTextToSize(safeText(aff?.signal), pageWidth - 2 * margin - 8);
        doc.text(line[0] ?? '-', margin + 3, yPosition + 9);

        yPosition += 14;
      });
    }

    yPosition += 4;

    if (Array.isArray(signals?.ministry_affinity) && signals.ministry_affinity.length > 0) {
      checkPageBreak(60);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('Ministry Affinity', margin, yPosition);
      yPosition += 6;

      signals.ministry_affinity.slice(0, 5).forEach((aff) => {
        doc.setFillColor(243, 232, 255);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(138, 43, 226);
        doc.text(short(aff?.ministry, 45), margin + 3, yPosition + 5);

        if (toNumber(aff?.win_count) != null) {
          doc.setTextColor(...colors.successGreen);
          doc.text(`${toNumber(aff?.win_count)}`, pageWidth - margin - 10, yPosition + 5, { align: 'right' });
        }

        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(...colors.mediumGray);
        const line = doc.splitTextToSize(safeText(aff?.signal), pageWidth - 2 * margin - 8);
        doc.text(line[0] ?? '-', margin + 3, yPosition + 9);

        yPosition += 14;
      });
    }

    // Quantity & Price Ranges
    yPosition += 4;
    checkPageBreak(80);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.darkGray);
    doc.text('Quantity & Price Range Patterns', margin, yPosition);
    yPosition += 8;

    const boxWidth = (pageWidth - 2 * margin - 5) / 2;
    let quantityBoxHeight = 15;
    let priceBoxHeight = 15;

    const qtyRanges = Array.isArray(signals?.quantity_ranges) ? signals.quantity_ranges : [];
    const priceRanges = Array.isArray(signals?.price_ranges) ? signals.price_ranges : [];

    if (qtyRanges.length > 0) {
      let totalLines = 0;
      qtyRanges.forEach((r) => {
        const lines = doc.splitTextToSize('- ' + rangeToStr(r), boxWidth - 6);
        totalLines += lines.length;
      });
      quantityBoxHeight = Math.max(15, 10 + totalLines * 4);

      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin, yPosition, boxWidth, quantityBoxHeight, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.successGreen);
      doc.text('Quantity Ranges:', margin + 3, yPosition + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...colors.darkGray);
      let currentY = yPosition + 10;
      qtyRanges.forEach((r) => {
        const rangeLines = doc.splitTextToSize('- ' + rangeToStr(r), boxWidth - 6);
        doc.text(rangeLines, margin + 3, currentY);
        currentY += rangeLines.length * 4;
      });
    }

    if (priceRanges.length > 0) {
      let totalLines = 0;
      priceRanges.forEach((r) => {
        const lines = doc.splitTextToSize('- ' + rangeToStr(r), boxWidth - 6);
        totalLines += lines.length;
      });
      priceBoxHeight = Math.max(15, 10 + totalLines * 4);

      doc.setFillColor(254, 243, 199);
      doc.roundedRect(pageWidth / 2 + 2.5, yPosition, boxWidth, priceBoxHeight, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.warningOrange);
      doc.text('Price Ranges:', pageWidth / 2 + 5.5, yPosition + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...colors.darkGray);
      let currentY = yPosition + 10;
      priceRanges.forEach((r) => {
        const rangeLines = doc.splitTextToSize('- ' + rangeToStr(r), boxWidth - 6);
        doc.text(rangeLines, pageWidth / 2 + 5.5, currentY);
        currentY += rangeLines.length * 4;
      });
    }

    yPosition += Math.max(quantityBoxHeight, priceBoxHeight) + 5;

    /* ---------------- Strategic Roadmap & Action Items ---------------- */
    addNewPage();
    addSectionHeader('Strategic Roadmap & Action Items', colors.successGreen);

    const guidance = ai?.guidance ?? {};

    if (guidance?.note) {
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 3, 3, 'F');
      doc.setDrawColor(...colors.warningOrange);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 3, 3, 'S');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.warningOrange);
      doc.text('Guidance Note', margin + 4, yPosition + 6);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.darkGray);
      const noteLines = doc.splitTextToSize(safeText(guidance.note), pageWidth - 2 * margin - 8);
      doc.text(noteLines, margin + 4, yPosition + 12);

      yPosition += 35;
    }

    if (Array.isArray(guidance?.next_steps) && guidance.next_steps.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('Next Steps - Action Plan', margin, yPosition);
      yPosition += 8;

      guidance.next_steps.forEach((step, index) => {
        checkPageBreak(25);
        doc.setFillColor(240, 253, 244);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 2, 2, 'F');
        doc.setDrawColor(...colors.successGreen);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 2, 2, 'S');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.successGreen);
        doc.text(`${index + 1}.`, margin + 3, yPosition + 6);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.darkGray);
        const stepLines = doc.splitTextToSize(safeText(step), pageWidth - 2 * margin - 12);
        doc.text(stepLines, margin + 8, yPosition + 6);

        yPosition += 23;
      });
    }

    if (Array.isArray(guidance?.expansion_areas) && guidance.expansion_areas.length > 0) {
      checkPageBreak(20);
      yPosition += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('Expansion Opportunities', margin, yPosition);
      yPosition += 8;

      guidance.expansion_areas.forEach((area) => {
        checkPageBreak(18);
        doc.setFillColor(239, 246, 255);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.darkGray);
        const areaLines = doc.splitTextToSize('- ' + safeText(area), pageWidth - 2 * margin - 8);
        doc.text(areaLines, margin + 4, yPosition + 5);
        yPosition += 18;
      });
    }
  }

  /* ----------------------------- PRICE BAND ----------------------------- */
  if (shouldIncludeSection('marketOverview')) {
    addNewPage();
    addSectionHeader('Price Band Analysis', colors.successGreen);

    const priceBand = reportData?.data?.priceBand;
    if (priceBand && (isNum(priceBand.highest) || isNum(priceBand.lowest) || isNum(priceBand.average))) {
      const highest = toNumber(priceBand.highest);
      const lowest = toNumber(priceBand.lowest);
      const average = toNumber(priceBand.average);

      autoTable(doc, {
        ...tableDefaults,
        startY: yPosition,
        head: [['Price Category', 'Amount']],
        body: [
          ['Highest Price', formatCurrency(highest)],
          ['Average Price', formatCurrency(average)],
          ['Lowest Price', formatCurrency(lowest)],
        ],
        theme: 'grid',
        headStyles: { ...tableDefaults.headStyles, fillColor: [72, 187, 120], textColor: 255, fontSize: 9, halign: 'left' },
        bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 8, cellPadding: 4 },
        columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold' }, 1: { cellWidth: 'auto', halign: 'right' } },
        margin: { left: margin },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      const insightBoxHeight = 25;
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, insightBoxHeight, 3, 3, 'F');
      doc.setDrawColor(...colors.electricBlue);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, insightBoxHeight, 3, 3, 'S');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.electricBlue);
      doc.text('Price Insights:', margin + 4, yPosition + 6);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.darkGray);

      let insightText = '-';
      if (highest != null && lowest != null && average != null && average !== 0) {
        const priceRange = highest - lowest;
        const priceVariation = ((priceRange / average) * 100).toFixed(1);
        insightText =
          `Price range spans ${formatCurrency(priceRange)} with ${priceVariation}% variation from average. ` +
          `Target competitive pricing around ${formatCurrency(Math.round(lowest * 1.05))} to ${formatCurrency(Math.round(average * 0.95))} for optimal positioning.`;
      } else {
        insightText = 'Insufficient price data to compute meaningful insights.';
      }

      const insightLines = doc.splitTextToSize(insightText, pageWidth - 2 * margin - 8);
      doc.text(insightLines, margin + 4, yPosition + 12);
      yPosition += insightBoxHeight + 5;
    }
  }

  /* ------------------------- CATEGORY DISTRIBUTION ------------------------- */
  if (shouldIncludeSection('categoryAnalysis')) {
    addNewPage();
    addSectionHeader('Category-wise Tender Distribution', colors.darkBlue);

    const categoryData = reportData?.data?.categoryListing;
    const categories = categoryData?.categories ?? [];

    if (categories.length > 0) {
      const maxTimes = Math.max(...categories.map((c) => c.times || 0));
      const chartOffset = 32;
      const rightPad = 6;
      const barAreaWidth = pageWidth - 2 * margin - chartOffset - rightPad;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('Tender Categories by Volume', margin, yPosition);
      yPosition += 10;

      categories.forEach((cat) => {
        const barX = margin + chartOffset;
        const barWidth = maxTimes > 0 ? Math.max(0, Math.min(barAreaWidth, (cat.times / maxTimes) * barAreaWidth)) : 0;

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.darkGray);
        doc.text(short(cat?.category, 25), margin, yPosition);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...colors.darkBlue);
        const valueText = (cat?.times ?? 0).toLocaleString();
        const valueWidth = doc.getTextWidth(valueText);
        doc.text(valueText, barX - valueWidth - 2, yPosition);

        doc.setFillColor(...colors.lightGray);
        doc.roundedRect(barX, yPosition - 5, barAreaWidth, 8, 1, 1, 'F');
        doc.setFillColor(...colors.darkBlue);
        doc.roundedRect(barX, yPosition - 5, barWidth, 8, 1, 1, 'F');

        yPosition += 12;
      });

      yPosition += 10;
    }
  }

  /* ----------------------- TOP SELLERS BY DEPARTMENT ----------------------- */
  if (shouldIncludeSection('rivalryScore')) {
    addNewPage();
    addSectionHeader('Leading Competitors - ' + safeText(reportData?.meta?.params_used?.department), colors.warningOrange);

    const topSellers = reportData?.data?.topSellersByDept;
    if (topSellers?.results && topSellers.results.length > 0) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('Top 10 Sellers by Participation Count', margin, yPosition);
      yPosition += 10;

      const sellerTableData = topSellers.results.slice(0, 10).map((seller, index) => {
        const rank = seller.rank ?? index + 1;
        const rankDisplay = index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${rank}`;
        return [rankDisplay, short(seller?.seller_name, 60), (seller?.participation_count ?? 0).toLocaleString()];
      });

      autoTable(doc, {
        ...tableDefaults,
        startY: yPosition,
        head: [['Rank', 'Seller Name', 'Participation Count']],
        body: sellerTableData,
        headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
          1: { cellWidth: 130 },
          2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
        },
        margin: { left: margin, right: margin, top: SAFE_TOP },
        didDrawPage: () => {
          addPageHeader();
          addPageFooter();
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 8;
    }
  }

  /* ---------------------- TOP PERFORMING STATES ---------------------- */
  if (shouldIncludeSection('statesAnalysis')) {
    addNewPage();
    addSectionHeader('Top Performing States by Tender Volume', colors.successGreen);

    const statesData = reportData?.data?.topPerformingStates;
    if (statesData?.results && statesData.results.length > 0) {
      const states = statesData.results.slice(0, 29);
      const maxTenders = Math.max(...states.map((s) => s.total_tenders || 0));

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('State-wise Tender Distribution (Top 29 States)', margin, yPosition);
      yPosition += 10;

      states.forEach((state, index) => {
        checkPageBreak(10);
        const barAreaWidth = pageWidth - 2 * margin - 65;
        const barWidth = maxTenders > 0 ? (state.total_tenders / maxTenders) * barAreaWidth : 0;
        let fillColor: [number, number, number] = colors.successGreen;
        if (index < 5) fillColor = colors.darkBlue;

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.darkGray);
        doc.text(short(state?.state_name, 25), margin, yPosition);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...fillColor);
        const valueText = (state?.total_tenders ?? 0).toLocaleString();
        const valueWidth = doc.getTextWidth(valueText);
        doc.text(valueText, margin + 60 - valueWidth - 2, yPosition);

        doc.setFillColor(...colors.lightGray);
        doc.roundedRect(margin + 60, yPosition - 4, barAreaWidth, 6, 1, 1, 'F');
        doc.setFillColor(...fillColor);
        doc.roundedRect(margin + 60, yPosition - 4, barWidth, 6, 1, 1, 'F');

        yPosition += 9;
      });
    }
  }

  /* ------------------------- DEPARTMENT LANDSCAPE ------------------------- */
  if (shouldIncludeSection('departmentsAnalysis')) {
    addNewPage();
    addSectionHeader('All Departments - Tender Volume Overview', colors.darkBlue);

    const allDepts = reportData?.data?.allDepartments ?? [];
    if (allDepts.length > 0) {
      const depts = allDepts.slice(0, 20);
      const counts = depts.map((d) => (typeof d.total_tenders === 'string' ? parseInt(d.total_tenders) : d.total_tenders || 0));
      const maxTenders = Math.max(...counts);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.darkGray);
      doc.text('Department-wise Tender Distribution (Top 20)', margin, yPosition);
      yPosition += 10;

      depts.forEach((dept, i) => {
        checkPageBreak(10);
        const tenderCount = counts[i] ?? 0;
        const barAreaWidth = pageWidth - 2 * margin - 75;
        const barWidth = maxTenders > 0 ? (tenderCount / maxTenders) * barAreaWidth : 0;

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.darkGray);
        doc.text(short(dept?.department, 32), margin, yPosition);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.darkBlue);
        const valueText = tenderCount.toLocaleString();
        const valueWidth = doc.getTextWidth(valueText);
        doc.text(valueText, margin + 70 - valueWidth - 2, yPosition);

        doc.setFillColor(...colors.lightGray);
        doc.roundedRect(margin + 70, yPosition - 4, barAreaWidth, 6, 1, 1, 'F');
        doc.setFillColor(...colors.darkBlue);
        doc.roundedRect(margin + 70, yPosition - 4, barWidth, 6, 1, 1, 'F');

        yPosition += 9;
      });
    }
  }

  /* --------------------- LOW COMPETITION OPPORTUNITIES --------------------- */
  if (shouldIncludeSection('lowCompetition')) {
    addNewPage();
    addSectionHeader('Low Competition Bids - Strategic Opportunities', colors.successGreen);

    const lowCompBids = reportData?.data?.lowCompetitionBids;
    if (lowCompBids?.results && lowCompBids.results.length > 0) {
      const bids = lowCompBids.results.slice(0, 25);

      const summaryCardHeight = 20;
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, summaryCardHeight, 2, 2, 'F');
      doc.setDrawColor(...colors.successGreen);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, summaryCardHeight, 2, 2, 'S');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.mediumGray);
      doc.text('Total Low Competition Bids: ', margin + 5, yPosition + 8);
      doc.setTextColor(...colors.successGreen);
      doc.text(String(lowCompBids.count ?? 0), margin + 65, yPosition + 8);

      doc.setTextColor(...colors.mediumGray);
      doc.text('Generated At: ', margin + 5, yPosition + 15);
      doc.setTextColor(...colors.darkGray);
      doc.text(formatDate(lowCompBids.generated_at), margin + 35, yPosition + 15);

      yPosition += summaryCardHeight + 6;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...colors.mediumGray);
      doc.text('Note: "-" indicates data not available from source system. Low seller count indicates opportunity.', margin, yPosition);
      yPosition += 6;

      const bidTableData = bids.map((bid) => [
        short(bid?.bid_number, 23),
        (bid?.quantity ?? 0).toLocaleString(),
        short(bid?.organisation, 30),
        short(bid?.department, 28),
        short(bid?.ministry, 25),
        formatDate(bid?.bid_end_ts),
        String(bid?.seller_count ?? 0),
      ]);

      autoTable(doc, {
        ...tableDefaults,
        startY: yPosition,
        head: [['Bid Number', 'Qty', 'Organization', 'Department', 'Ministry', 'Bid End Date', 'Sellers']],
        body: bidTableData,
        theme: 'grid',
        headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 7.5 },
        bodyStyles: { ...tableDefaults.bodyStyles, lineColor: [209, 213, 219], lineWidth: 0.2 },
        columnStyles: {
          0: { cellWidth: 24 },
          1: { cellWidth: 11, halign: 'right', fontStyle: 'bold' },
          2: { cellWidth: 33 },
          3: { cellWidth: 32 },
          4: { cellWidth: 28 },
          5: { cellWidth: 20, halign: 'center' },
          6: { cellWidth: 13, halign: 'center', fontStyle: 'bold', textColor: [231, 76, 60], fillColor: [254, 242, 242] },
        },
        margin: { left: margin - 2, right: margin - 2, top: SAFE_TOP },
        didDrawPage: () => {
          addPageHeader();
          addPageFooter();
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 8;
    }
  }

  /* ----------------- SELLER BID PERFORMANCE + HISTORY ----------------- */
  if (shouldIncludeSection('bidsSummary')) {
    const sellerBids = reportData?.data?.sellerBids;
    if (sellerBids) {
      addNewPage();
      addSectionHeader(safeText(reportData?.meta?.params_used?.sellerName) + ' - Bidding Performance Deep Dive', colors.electricBlue);

      if (sellerBids.table1) {
        const t1 = sellerBids.table1;
        const cardWidth = (pageWidth - 2 * margin - 15) / 3;
        const cardHeight = 25;
        let cardX = margin;

        const cardsData = [
          { label: 'Total Wins', value: (t1.win ?? 0).toLocaleString(), color: colors.successGreen, bgColor: [240, 253, 244] as [number, number, number] },
          { label: 'Total Lost', value: (t1.lost ?? 0).toLocaleString(), color: colors.errorRed, bgColor: [254, 226, 226] as [number, number, number] },
          {
            label: 'Win Rate',
            value:
              t1.win != null && t1.lost != null && t1.win + t1.lost > 0
                ? `${((t1.win / (t1.win + t1.lost)) * 100).toFixed(1)}%`
                : '-',
            color: colors.darkBlue,
            bgColor: [239, 246, 255] as [number, number, number],
          },
        ];

        cardsData.forEach((card) => {
          doc.setFillColor(...card.bgColor);
          doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 2, 2, 'F');

          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...card.color);
          doc.text(card.value, cardX + cardWidth / 2, yPosition + 13, { align: 'center' });

          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.mediumGray);
          doc.text(card.label, cardX + cardWidth / 2, yPosition + 20, { align: 'center' });

          cardX += cardWidth + 5;
        });

        yPosition += cardHeight + 6;

        cardX = margin;
        const cardsData2 = [
          { label: 'Total Bid Value', value: formatCurrency(t1.totalBidValue), color: colors.warningOrange, bgColor: [254, 243, 199] as [number, number, number] },
          { label: 'Qualified Bid Value', value: formatCurrency(t1.qualifiedBidValue), color: colors.successGreen, bgColor: [240, 253, 244] as [number, number, number] },
          { label: 'Avg Order Value', value: formatCurrency(t1.averageOrderValue), color: [138, 43, 226] as [number, number, number], bgColor: [243, 232, 255] as [number, number, number] },
        ];

        cardsData2.forEach((card) => {
          doc.setFillColor(...card.bgColor);
          doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 2, 2, 'F');

          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...card.color);
          const valueText = (card.value || '').length > 18 ? card.value.slice(0, 18) : card.value;
          doc.text(valueText || '-', cardX + cardWidth / 2, yPosition + 13, { align: 'center' });

          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.mediumGray);
          doc.text(card.label, cardX + cardWidth / 2, yPosition + 20, { align: 'center' });

          cardX += cardWidth + 5;
        });

        yPosition += cardHeight + 10;
      }

      // Departmental Performance
      if (sellerBids.departmentCount && sellerBids.departmentCount.length > 0) {
        checkPageBreak(20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.darkGray);
        doc.text('Revenue by Department', margin, yPosition);
        yPosition += 8;

        const deptSorted = [...sellerBids.departmentCount].sort((a, b) => (b?.revenue ?? 0) - (a?.revenue ?? 0));
        const deptTableData = deptSorted.map((dept) => [
          short(dept?.department, 50),
          (dept?.bid_count ?? 0).toLocaleString(),
          formatCurrency(dept?.revenue ?? 0),
        ]);

        const totalRevenue = deptSorted.reduce((sum, d) => sum + (d?.revenue ?? 0), 0);
        const totalBids = deptSorted.reduce((sum, d) => sum + (d?.bid_count ?? 0), 0);
        deptTableData.push(['TOTAL', totalBids.toLocaleString(), formatCurrency(totalRevenue)]);

        autoTable(doc, {
          ...tableDefaults,
          startY: yPosition,
          head: [['Department', 'Bid Count', 'Revenue']],
          body: deptTableData,
          headStyles: { ...tableDefaults.headStyles, fillColor: colors.darkBlue, textColor: colors.white, fontSize: 8 },
          columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 30, halign: 'right' }, 2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' } },
          margin: { left: margin, right: margin, top: SAFE_TOP },
          didDrawPage: () => {
            addPageHeader();
            addPageFooter();
          },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // State-wise Analysis
      if (sellerBids.stateCount && sellerBids.stateCount.length > 0) {
        checkPageBreak(20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.darkGray);
        doc.text('Bids by State', margin, yPosition);
        yPosition += 8;

        const stateTableData = [...sellerBids.stateCount]
          .sort((a, b) => (b?.revenue ?? 0) - (a?.revenue ?? 0))
          .slice(0, 15)
          .map((state) => [short(state?.state, 40), (state?.bid_count ?? 0).toLocaleString(), formatCurrency(state?.revenue ?? 0)]);

        autoTable(doc, {
          ...tableDefaults,
          startY: yPosition,
          head: [['State', 'Bid Count', 'Revenue']],
          body: stateTableData,
          theme: 'grid',
          headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 8 },
          columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 30, halign: 'right' }, 2: { cellWidth: 50, halign: 'right' } },
          margin: { left: margin, right: margin, top: SAFE_TOP },
          didDrawPage: () => {
            addPageHeader();
            addPageFooter();
          },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 8;
      }

      // Monthly Trends
      if (sellerBids.monthlyTotals && sellerBids.monthlyTotals.length > 0) {
        addNewPage();
        addSectionHeader('Monthly Bidding Trends', colors.warningOrange);

        const monthlyTableData = sellerBids.monthlyTotals.map((month) => [short(month?.month, 20), formatCurrency(month?.bid_value ?? 0)]);

        autoTable(doc, {
          ...tableDefaults,
          startY: yPosition,
          head: [['Month', 'Bid Value']],
          body: monthlyTableData,
          headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 9 },
          bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 8, cellPadding: 3 },
          columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' } },
          margin: { left: margin, right: margin, top: SAFE_TOP },
          didDrawPage: () => {
            addPageHeader();
            addPageFooter();
          },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 8;
      }

      // Detailed Bid History
      if (sellerBids.sortedRows && sellerBids.sortedRows.length > 0) {
        addNewPage();
        addSectionHeader('Bid-by-Bid Performance History', colors.electricBlue);

        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(...colors.mediumGray);
        doc.text('Note: "-" indicates data not available from source system', margin, yPosition);
        yPosition += 6;

        const bidHistoryData = sellerBids.sortedRows.map((row) => {
          const status = clean(row?.seller_status ?? row?.status);
          const organisation = short(row?.organisation ?? row?.org, 28);
          const department = short(row?.department ?? row?.dept, 28);
          const price = row?.total_price != null ? formatCurrency(row.total_price) : '-';
          return [
            formatDate(row?.participated_on),
            short(row?.offered_item, 60),
            status || '-',
            short(row?.rank, 6),
            price,
            organisation,
            department,
          ];
        });

        autoTable(doc, {
          ...tableDefaults,
          startY: yPosition,
          head: [['Date', 'Item', 'Status', 'Rank', 'Price', 'Organization', 'Department']],
          body: bidHistoryData,
          theme: 'grid',
          headStyles: { ...tableDefaults.headStyles, fillColor: colors.electricBlue, textColor: colors.white, fontSize: 7.5, cellPadding: 3 },
          bodyStyles: { ...tableDefaults.bodyStyles, cellPadding: 2.5, lineColor: [209, 213, 219], lineWidth: 0.2 },
          columnStyles: {
            0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
            1: { cellWidth: 60 },
            2: { cellWidth: 16, halign: 'center' },
            3: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
            4: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
            5: { cellWidth: 32 },
            6: { cellWidth: 30 },
          },
          margin: { left: margin - 2, right: margin - 2, top: SAFE_TOP },
          showHead: 'everyPage',
          willDrawCell: (data: any) => {
            if (data.section === 'body' && data.column.index === 2) {
              const statusVal = (data.cell.raw || '').toString().toLowerCase();
              if (statusVal === 'qualified') data.cell.styles.textColor = colors.successGreen;
              else if (statusVal.includes('disqualified')) data.cell.styles.textColor = colors.errorRed;
            }
            if (data.section === 'body' && data.column.index === 3) {
              const rankVal = (data.cell.raw || '').toString().toUpperCase();
              if (rankVal === 'L1') {
                data.cell.styles.fillColor = [240, 253, 244];
                data.cell.styles.textColor = colors.successGreen;
              } else if (rankVal === 'L2') {
                data.cell.styles.fillColor = [254, 243, 199];
                data.cell.styles.textColor = colors.warningOrange;
              }
            }
          },
          didDrawPage: (data: any) => {
            if (data.pageNumber > data.table.startPageNumber) {
              addPageHeader();
              addPageFooter();
            }
          },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 8;
      }
    }
  }

  return doc;
};