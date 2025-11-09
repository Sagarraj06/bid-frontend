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
//         seller_status?: string;
//         status?: string;
//         rank?: string;
//         total_price?: number;
//         organisation?: string;
//         org?: string;
//         department?: string;
//         dept?: string;
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
//     priceBand?: { highest?: number; lowest?: number; average?: number };
//     topPerformingStates?: {
//       results: Array<{ state_name: string; total_tenders: number }>;
//     };
//     topSellersByDept?: {
//       department: string;
//       total: number;
//       results: Array<{ seller_name: string; participation_count: number; rank?: number }>;
//     };
//     categoryListing?: {
//       categories: Array<{ category: string; times: number }>;
//       metadata: { totalItems: number; totalCount: number; processingTime: number };
//     };
//     allDepartments?: Array<{ department: string; total_tenders: string | number }>;
//     lowCompetitionBids?: {
//       results: Array<{
//         bid_number?: string;
//         quantity?: number;
//         organisation?: string;
//         department?: string;
//         ministry?: string;
//         bid_end_ts?: string;
//         seller_count?: number;
//       }>;
//       count: number;
//       generated_at: string;
//     };
//     missedButWinnable: {
//       seller: string;
//       recentWins: Array<{
//         bid_number?: string;
//         offered_item?: string;
//         quantity?: number;
//         total_price?: number;
//         org?: string;
//         dept?: string;
//         ministry?: string;
//         ended_at?: string;
//       }>;
//       marketWins: Array<{
//         bid_number?: string;
//         seller_name?: string;
//         offered_item?: string;
//         quantity?: number;
//         total_price?: number;
//         org?: string;
//         dept?: string;
//         ministry?: string;
//         ended_at?: string;
//       }>;
//       ai: {
//         strategy_summary?: string;
//         likely_wins?: Array<{
//           offered_item?: string;
//           reason?: string;
//           matching_market_wins?: Array<{
//             original_b_id?: number;
//             bid_number?: string;
//             org?: string;
//             dept?: string;
//             ministry?: string;
//             quantity?: number;
//             price_hint?: number;
//             confidence?: string;
//           }>;
//         }>;
//         signals?: {
//           org_affinity?: Array<{ org?: string; win_count?: number; signal?: string }>;
//           dept_affinity?: Array<{ dept?: string; win_count?: number; signal?: string }>;
//           ministry_affinity?: Array<{ ministry?: string; win_count?: number; signal?: string }>;
//           quantity_ranges?: Array<string | { min?: number; max?: number }>;
//           price_ranges?: Array<string | { min?: number; max?: number }>;
//         };
//         guidance?: {
//           note?: string;
//           next_steps?: Array<string>;
//           expansion_areas?: Array<string>;
//         };
//       };
//     };
//   };
// }

// interface FilterOptions {
//   includeSections: string[];
// }

// /* ------------------------------------------------------------------ */
// /*                         COLOR SYSTEM (RGB)                          */
// /* ------------------------------------------------------------------ */
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

// /* ------------------------------------------------------------------ */
// /*                         UTILITY HELPERS                             */
// /* ------------------------------------------------------------------ */
// const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);
// const isNum = (v: any) => typeof v === 'number' && !isNaN(v);
// const toNumber = (v: any): number | null => {
//   if (isNum(v)) return v as number;
//   if (v == null) return null;
//   const n = Number(v);
//   return isNaN(n) ? null : n;
// };

// const clampStr = (s: string, max = 999): string => (s.length > max ? s.slice(0, max) : s);

// /** Robust clean: handles objects/arrays safely and normalizes text */
// const clean = (value: any): string => {
//   if (value === null || value === undefined) return '-';
//   if (Array.isArray(value)) {
//     const flat = value.map((v) => {
//       if (v === null || v === undefined) return '';
//       if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
//       if (isObj(v)) {
//         // stringify common {min,max} or {from,to}
//         const min = (v as any).min ?? (v as any).from;
//         const max = (v as any).max ?? (v as any).to;
//         if (min !== undefined || max !== undefined) return `${min ?? ''}-${max ?? ''}`;
//         try {
//           return JSON.stringify(v);
//         } catch {
//           return '';
//         }
//       }
//       return String(v);
//     });
//     return flat.filter(Boolean).join(', ') || '-';
//   }
//   if (isObj(value)) {
//     // Friendly stringify for common range shapes
//     const min = (value as any).min ?? (value as any).from;
//     const max = (value as any).max ?? (value as any).to;
//     if (min !== undefined || max !== undefined) {
//       return `${min ?? ''}-${max ?? ''}`;
//     }
//     try {
//       return JSON.stringify(value);
//     } catch {
//       return '-';
//     }
//   }
//   const s = String(value);
//   return (
//     s
//       .replace(/[₹]/g, 'Rs ')
//       .replace(/[\u2018\u2019]/g, "'")
//       .replace(/[\u201C\u201D]/g, '"')
//       .replace(/\u00A0/g, ' ')
//       .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
//       .replace(/[\u2013\u2014]/g, '-')
//       .replace(/[\u2022\u2023\u2043]/g, '*')
//       .replace(/[^\x20-\x7E]/g, '')
//       .replace(/\s+/g, ' ')
//       .trim() || '-'
//   );
// };

// const safeText = (v: any, fallback = '-'): string => {
//   const c = clean(v);
//   return c === '-' ? fallback : c;
// };

// const short = (v: any, len: number, fallback = '-') => {
//   const c = clean(v);
//   return c === '-' ? fallback : clampStr(c, len);
// };

// const formatCurrency = (amount: number | string | null | undefined): string => {
//   const n = typeof amount === 'string' ? parseFloat(amount) : amount;
//   if (n == null) return '-';
//   const num = Number(n);
//   if (!isFinite(num) || num === 0) return '-';
//   try {
//     return `Rs ${num.toLocaleString('en-IN')}`;
//   } catch {
//     return `Rs ${num}`;
//   }
// };

// const formatDate = (dateString: string | null | undefined): string => {
//   if (!dateString || dateString === 'N/A' || dateString === 'undefined') return '-';
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return '-';
//     return date
//       .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//       .replace(/ /g, '-');
//   } catch {
//     return '-';
//   }
// };

// const rangeToStr = (r: any): string => {
//   if (typeof r === 'string') return clean(r);
//   if (Array.isArray(r)) return clean(r);
//   if (isObj(r)) {
//     const min = (r as any).min ?? (r as any).from;
//     const max = (r as any).max ?? (r as any).to;
//     if (min == null && max == null) return clean(r);
//     return `${min ?? ''}-${max ?? ''}`;
//   }
//   return clean(r);
// };

// const tableDefaults = {
//   theme: 'striped' as const,
//   headStyles: {
//     halign: 'center' as const,
//     fontStyle: 'bold' as const,
//   },
//   bodyStyles: {
//     fontSize: 7,
//     cellPadding: 2,
//     minCellHeight: 8,
//     overflow: 'linebreak' as const,
//     valign: 'middle' as const,
//   },
// };

// /* ------------------------------------------------------------------ */
// /*                            MAIN EXPORT                              */
// /* ------------------------------------------------------------------ */
// export const generatePDF = async (reportData: ReportData, filters: FilterOptions) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 12;
//   const HEADER_H = 18;
//   const FOOTER_H = 12;
//   const SAFE_TOP = HEADER_H + 5;
//   const SAFE_BOTTOM = pageHeight - FOOTER_H - 8;
//   let yPosition = SAFE_TOP;

//   const shouldIncludeSection = (sectionId: string): boolean =>
//     filters?.includeSections?.includes(sectionId) ?? false;

//   const addPageHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, HEADER_H, 'F');
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.white);
//     doc.text('GOVERNMENT TENDER ANALYSIS', pageWidth / 2, 11, { align: 'center' });
//   };

//   const addPageFooter = () => {
//     const pageNum = (doc as any).getCurrentPageInfo?.().pageNumber ?? (doc as any).internal?.getNumberOfPages?.();
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - FOOTER_H, pageWidth, FOOTER_H, 'F');
//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...colors.white);
//     doc.text(safeText(reportData?.meta?.params_used?.sellerName), margin, pageHeight - 6);
//     doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
//     doc.text(formatDate(reportData?.meta?.report_generated_at), pageWidth - margin, pageHeight - 6, { align: 'right' });
//   };

//   const addNewPage = () => {
//     doc.addPage();
//     yPosition = SAFE_TOP;
//     addPageHeader();
//     addPageFooter();
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

//   /* ---------------------------- COVER PAGE ---------------------------- */
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, 'F');

//   // Decorative circles
//   doc.setFillColor(20, 40, 75);
//   doc.circle(pageWidth + 40, -20, 80, 'F');
//   doc.circle(-50, pageHeight / 2, 100, 'F');
//   doc.circle(pageWidth + 20, pageHeight + 30, 70, 'F');

//   // Title
//   doc.setFontSize(24);
//   doc.setFont('helvetica', 'bold');
//   doc.setTextColor(...colors.white);
//   doc.text('GOVERNMENT', pageWidth / 2, 60, { align: 'center' });
//   doc.text('TENDER ANALYSIS', pageWidth / 2, 72, { align: 'center' });

//   // Subtitle
//   yPosition = 90;
//   doc.setFillColor(25, 50, 85);
//   doc.roundedRect(margin + 10, yPosition, pageWidth - 2 * margin - 20, 14, 3, 3, 'F');
//   doc.setFontSize(12);
//   doc.setFont('helvetica', 'normal');
//   doc.setTextColor(...colors.electricBlue);
//   doc.text('Comprehensive Performance Report', pageWidth / 2, yPosition + 9, { align: 'center' });

//   // Company
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
//   doc.text(safeText(reportData?.meta?.params_used?.sellerName), pageWidth / 2, yPosition + 13, { align: 'center' });

//   // Metadata
//   yPosition = 150;
//   doc.setFontSize(10);
//   doc.setFont('helvetica', 'normal');
//   doc.setTextColor(...colors.white);
//   doc.text('Report Generated: ' + formatDate(reportData?.meta?.report_generated_at), pageWidth / 2, yPosition, { align: 'center' });
//   yPosition += 8;
//   doc.text('Analysis Period: ' + (reportData?.meta?.params_used?.days ?? '-') + ' days', pageWidth / 2, yPosition, { align: 'center' });
//   yPosition += 8;
//   doc.text('Department: ' + safeText(reportData?.meta?.params_used?.department, '-'), pageWidth / 2, yPosition, { align: 'center' });

//   yPosition += 12;
//   doc.setFontSize(9);
//   doc.text('Offered Items:', pageWidth / 2, yPosition, { align: 'center' });
//   yPosition += 6;
//   const itemLines = doc.splitTextToSize(
//     short(reportData?.meta?.params_used?.offeredItem ?? 'Various items', 200),
//     pageWidth - 40
//   );
//   doc.text(itemLines.slice(0, 3), pageWidth / 2, yPosition, { align: 'center' });

//   /* ---------------- MISSED BUT WINNABLE — RECENT & MARKET WINS ---------------- */
//   if (shouldIncludeSection('missedTenders')) {
//     addNewPage();
//     addSectionHeader('Missed But Winnable - Market Intelligence', colors.darkBlue);

//     const recentWins = reportData?.data?.missedButWinnable?.recentWins ?? [];
//     if (recentWins.length > 0) {
//       doc.setFontSize(10);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Recent Wins by ' + safeText(reportData?.meta?.params_used?.sellerName), margin, yPosition);
//       yPosition += 8;

//       const winsTableData = recentWins.map((win) => [
//         short(win?.bid_number, 25),
//         short(win?.offered_item, 60),
//         String(win?.quantity ?? 0),
//         formatCurrency(win?.total_price ?? 0),
//         short(win?.org, 30),
//         short(win?.dept, 35),
//         formatDate(win?.ended_at),
//       ]);

//       autoTable(doc, {
//         ...tableDefaults,
//         startY: yPosition,
//         head: [['Bid Number', 'Item Category', 'Qty', 'Total Price', 'Organization', 'Department', 'End Date']],
//         body: winsTableData,
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.darkBlue, textColor: colors.white, fontSize: 8 },
//         columnStyles: {
//           0: { cellWidth: 26 },
//           1: { cellWidth: 60 },
//           2: { cellWidth: 12, halign: 'right' },
//           3: { cellWidth: 25, halign: 'right' },
//           4: { cellWidth: 33 },
//           5: { cellWidth: 33 },
//           6: { cellWidth: 20, halign: 'center' },
//         },
//         margin: { left: margin - 3, right: margin, top: SAFE_TOP },
//         showHead: 'everyPage',
//         didDrawPage: (data: any) => {
//           if (data.pageNumber > data.table.startPageNumber) {
//             addPageHeader();
//             addPageFooter();
//           }
//         },
//       });

//       yPosition = (doc as any).lastAutoTable.finalY + 10;
//     }

//     const marketWins = reportData?.data?.missedButWinnable?.marketWins ?? [];
//     if (marketWins.length > 0) {
//       checkPageBreak(60);
//       doc.setFontSize(10);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Competitor Market Wins', margin, yPosition);
//       yPosition += 8;

//       const marketTableData = marketWins.map((win) => [
//         short(win?.bid_number, 25),
//         short(win?.seller_name, 30),
//         short(win?.offered_item, 45),
//         String(win?.quantity ?? 0),
//         formatCurrency(win?.total_price ?? 0),
//         short(win?.org, 30),
//         short(win?.dept, 30),
//         formatDate(win?.ended_at),
//       ]);

//       autoTable(doc, {
//         ...tableDefaults,
//         startY: yPosition,
//         head: [['Bid Number', 'Seller Name', 'Item', 'Qty', 'Price', 'Organization', 'Department', 'End Date']],
//         body: marketTableData,
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 7 },
//         bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 6.5 },
//         columnStyles: {
//           0: { cellWidth: 24 },
//           1: { cellWidth: 28 },
//           2: { cellWidth: 45 },
//           3: { cellWidth: 10, halign: 'right' },
//           4: { cellWidth: 22, halign: 'right' },
//           5: { cellWidth: 28 },
//           6: { cellWidth: 28 },
//           7: { cellWidth: 18, halign: 'center' },
//         },
//         margin: { left: margin, right: margin, top: SAFE_TOP },
//         showHead: 'everyPage',
//         didDrawPage: (data: any) => {
//           if (data.pageNumber > data.table.startPageNumber) {
//             addPageHeader();
//             addPageFooter();
//           }
//         },
//       });

//       yPosition = (doc as any).lastAutoTable.finalY + 8;
//     }
//   }

//   /* -------------------------- AI-POWERED INSIGHTS -------------------------- */
//   if (shouldIncludeSection('buyerInsights')) {
//     addNewPage();
//     addSectionHeader('AI-Driven Intelligence & Strategy', colors.electricBlue);

//     const ai = reportData?.data?.missedButWinnable?.ai ?? {};

//     if (ai?.strategy_summary) {
//       doc.setFillColor(239, 246, 255);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 3, 3, 'F');
//       doc.setDrawColor(...colors.electricBlue);
//       doc.setLineWidth(0.5);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 3, 3, 'S');

//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('AI Strategy Summary', margin + 4, yPosition + 6);

//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(...colors.darkGray);
//       const summaryLines = doc.splitTextToSize(safeText(ai.strategy_summary), pageWidth - 2 * margin - 8);
//       doc.text(summaryLines, margin + 4, yPosition + 12);

//       yPosition += 45;
//     }

//     // Likely wins
//     if (Array.isArray(ai?.likely_wins) && ai.likely_wins.length > 0) {
//       checkPageBreak(20);
//       doc.setFontSize(11);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Likely Wins - High Probability Opportunities', margin, yPosition);
//       yPosition += 10;

//       ai.likely_wins.forEach((win: any, index: number) => {
//         checkPageBreak(60);
//         const boxHeight = 40;
//         doc.setFillColor(240, 253, 244);
//         doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, boxHeight, 2, 2, 'F');
//         doc.setDrawColor(...colors.successGreen);
//         doc.setLineWidth(0.5);
//         doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, boxHeight, 2, 2, 'S');

//         doc.setFontSize(9);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...colors.successGreen);
//         doc.text(`Opportunity ${index + 1}:`, margin + 3, yPosition + 6);

//         doc.setTextColor(...colors.darkGray);
//         const itemText = short(win?.offered_item, 120);
//         const itemLines2 = doc.splitTextToSize(itemText, pageWidth - 2 * margin - 35);
//         doc.text(itemLines2.slice(0, 1), margin + 30, yPosition + 6);

//         doc.setFontSize(8);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...colors.darkGray);
//         doc.text('Win Probability Reason:', margin + 3, yPosition + 13);

//         doc.setFont('helvetica', 'normal');
//         const reasonLines = doc.splitTextToSize(safeText(win?.reason), pageWidth - 2 * margin - 8);
//         doc.text(reasonLines.slice(0, 5), margin + 3, yPosition + 18);

//         yPosition += boxHeight + 3;

//         // Matching market wins table
//         const mmw = Array.isArray(win?.matching_market_wins) ? win.matching_market_wins : [];
//         if (mmw.length > 0) {
//           checkPageBreak(30);
//           const matchData = mmw.map((m: any) => [
//             short(m?.bid_number, 26),
//             short(m?.org, 32),
//             short(m?.dept, 30),
//             String(m?.quantity ?? 0),
//             formatCurrency(m?.price_hint ?? 0),
//             short((m?.confidence ?? '').toString().toUpperCase(), 12, 'MEDIUM'),
//           ]);

//           autoTable(doc, {
//             ...tableDefaults,
//             startY: yPosition,
//             head: [['Bid Number', 'Organization', 'Department', 'Qty', 'Price Hint', 'Confidence']],
//             body: matchData,
//             theme: 'grid',
//             headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 7 },
//             bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7, cellPadding: 1.5 },
//             columnStyles: {
//               0: { cellWidth: 26 },
//               1: { cellWidth: 38 },
//               2: { cellWidth: 36 },
//               3: { cellWidth: 12, halign: 'right' },
//               4: { cellWidth: 26, halign: 'right' },
//               5: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
//             },
//             margin: { left: margin - 3, right: margin, top: SAFE_TOP },
//             didDrawPage: () => {
//               addPageHeader();
//               addPageFooter();
//             },
//           });

//           yPosition = (doc as any).lastAutoTable.finalY + 6;
//         }
//       });
//     }

//     /* ------------------- Strategic Affinity Signals ------------------- */
//     addNewPage();
//     addSectionHeader('Strategic Affinity Signals', colors.darkBlue);
//     const signals = ai?.signals ?? {};

//     if (Array.isArray(signals?.org_affinity) && signals.org_affinity.length > 0) {
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Organization Affinity', margin, yPosition);
//       yPosition += 6;

//       signals.org_affinity.slice(0, 5).forEach((aff) => {
//         doc.setFillColor(239, 246, 255);
//         doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');

//         doc.setFontSize(8);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...colors.darkBlue);
//         doc.text(short(aff?.org, 45), margin + 3, yPosition + 5);

//         if (toNumber(aff?.win_count) != null) {
//           doc.setTextColor(...colors.successGreen);
//           doc.text(`${toNumber(aff?.win_count)}`, pageWidth - margin - 10, yPosition + 5, { align: 'right' });
//         }

//         doc.setFontSize(7);
//         doc.setFont('helvetica', 'italic');
//         doc.setTextColor(...colors.mediumGray);
//         const line = doc.splitTextToSize(safeText(aff?.signal), pageWidth - 2 * margin - 8);
//         doc.text(line[0] ?? '-', margin + 3, yPosition + 9);

//         yPosition += 14;
//       });
//     }

//     yPosition += 4;

//     if (Array.isArray(signals?.dept_affinity) && signals.dept_affinity.length > 0) {
//       checkPageBreak(60);
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Department Affinity', margin, yPosition);
//       yPosition += 6;

//       signals.dept_affinity.slice(0, 5).forEach((aff) => {
//         doc.setFillColor(254, 243, 199);
//         doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');

//         doc.setFontSize(8);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...colors.warningOrange);
//         doc.text(short(aff?.dept, 45), margin + 3, yPosition + 5);

//         if (toNumber(aff?.win_count) != null) {
//           doc.setTextColor(...colors.successGreen);
//           doc.text(`${toNumber(aff?.win_count)}`, pageWidth - margin - 10, yPosition + 5, { align: 'right' });
//         }

//         doc.setFontSize(7);
//         doc.setFont('helvetica', 'italic');
//         doc.setTextColor(...colors.mediumGray);
//         const line = doc.splitTextToSize(safeText(aff?.signal), pageWidth - 2 * margin - 8);
//         doc.text(line[0] ?? '-', margin + 3, yPosition + 9);

//         yPosition += 14;
//       });
//     }

//     yPosition += 4;

//     if (Array.isArray(signals?.ministry_affinity) && signals.ministry_affinity.length > 0) {
//       checkPageBreak(60);
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Ministry Affinity', margin, yPosition);
//       yPosition += 6;

//       signals.ministry_affinity.slice(0, 5).forEach((aff) => {
//         doc.setFillColor(243, 232, 255);
//         doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 2, 2, 'F');

//         doc.setFontSize(8);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(138, 43, 226);
//         doc.text(short(aff?.ministry, 45), margin + 3, yPosition + 5);

//         if (toNumber(aff?.win_count) != null) {
//           doc.setTextColor(...colors.successGreen);
//           doc.text(`${toNumber(aff?.win_count)}`, pageWidth - margin - 10, yPosition + 5, { align: 'right' });
//         }

//         doc.setFontSize(7);
//         doc.setFont('helvetica', 'italic');
//         doc.setTextColor(...colors.mediumGray);
//         const line = doc.splitTextToSize(safeText(aff?.signal), pageWidth - 2 * margin - 8);
//         doc.text(line[0] ?? '-', margin + 3, yPosition + 9);

//         yPosition += 14;
//       });
//     }

//     // Quantity & Price Ranges
//     yPosition += 4;
//     checkPageBreak(80);
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.darkGray);
//     doc.text('Quantity & Price Range Patterns', margin, yPosition);
//     yPosition += 8;

//     const boxWidth = (pageWidth - 2 * margin - 5) / 2;
//     let quantityBoxHeight = 15;
//     let priceBoxHeight = 15;

//     const qtyRanges = Array.isArray(signals?.quantity_ranges) ? signals.quantity_ranges : [];
//     const priceRanges = Array.isArray(signals?.price_ranges) ? signals.price_ranges : [];

//     if (qtyRanges.length > 0) {
//       let totalLines = 0;
//       qtyRanges.forEach((r) => {
//         const lines = doc.splitTextToSize('- ' + rangeToStr(r), boxWidth - 6);
//         totalLines += lines.length;
//       });
//       quantityBoxHeight = Math.max(15, 10 + totalLines * 4);

//       doc.setFillColor(240, 253, 244);
//       doc.roundedRect(margin, yPosition, boxWidth, quantityBoxHeight, 2, 2, 'F');
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.successGreen);
//       doc.text('Quantity Ranges:', margin + 3, yPosition + 5);

//       doc.setFont('helvetica', 'normal');
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.darkGray);
//       let currentY = yPosition + 10;
//       qtyRanges.forEach((r) => {
//         const rangeLines = doc.splitTextToSize('- ' + rangeToStr(r), boxWidth - 6);
//         doc.text(rangeLines, margin + 3, currentY);
//         currentY += rangeLines.length * 4;
//       });
//     }

//     if (priceRanges.length > 0) {
//       let totalLines = 0;
//       priceRanges.forEach((r) => {
//         const lines = doc.splitTextToSize('- ' + rangeToStr(r), boxWidth - 6);
//         totalLines += lines.length;
//       });
//       priceBoxHeight = Math.max(15, 10 + totalLines * 4);

//       doc.setFillColor(254, 243, 199);
//       doc.roundedRect(pageWidth / 2 + 2.5, yPosition, boxWidth, priceBoxHeight, 2, 2, 'F');
//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.warningOrange);
//       doc.text('Price Ranges:', pageWidth / 2 + 5.5, yPosition + 5);

//       doc.setFont('helvetica', 'normal');
//       doc.setFontSize(7);
//       doc.setTextColor(...colors.darkGray);
//       let currentY = yPosition + 10;
//       priceRanges.forEach((r) => {
//         const rangeLines = doc.splitTextToSize('- ' + rangeToStr(r), boxWidth - 6);
//         doc.text(rangeLines, pageWidth / 2 + 5.5, currentY);
//         currentY += rangeLines.length * 4;
//       });
//     }

//     yPosition += Math.max(quantityBoxHeight, priceBoxHeight) + 5;

//     /* ---------------- Strategic Roadmap & Action Items ---------------- */
//     addNewPage();
//     addSectionHeader('Strategic Roadmap & Action Items', colors.successGreen);

//     const guidance = ai?.guidance ?? {};

//     if (guidance?.note) {
//       doc.setFillColor(254, 243, 199);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 3, 3, 'F');
//       doc.setDrawColor(...colors.warningOrange);
//       doc.setLineWidth(0.5);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 30, 3, 3, 'S');

//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.warningOrange);
//       doc.text('Guidance Note', margin + 4, yPosition + 6);

//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(...colors.darkGray);
//       const noteLines = doc.splitTextToSize(safeText(guidance.note), pageWidth - 2 * margin - 8);
//       doc.text(noteLines, margin + 4, yPosition + 12);

//       yPosition += 35;
//     }

//     if (Array.isArray(guidance?.next_steps) && guidance.next_steps.length > 0) {
//       checkPageBreak(20);
//       doc.setFontSize(10);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Next Steps - Action Plan', margin, yPosition);
//       yPosition += 8;

//       guidance.next_steps.forEach((step, index) => {
//         checkPageBreak(25);
//         doc.setFillColor(240, 253, 244);
//         doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 2, 2, 'F');
//         doc.setDrawColor(...colors.successGreen);
//         doc.setLineWidth(0.3);
//         doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 20, 2, 2, 'S');

//         doc.setFontSize(10);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...colors.successGreen);
//         doc.text(`${index + 1}.`, margin + 3, yPosition + 6);

//         doc.setFontSize(8);
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(...colors.darkGray);
//         const stepLines = doc.splitTextToSize(safeText(step), pageWidth - 2 * margin - 12);
//         doc.text(stepLines, margin + 8, yPosition + 6);

//         yPosition += 23;
//       });
//     }

//     if (Array.isArray(guidance?.expansion_areas) && guidance.expansion_areas.length > 0) {
//       checkPageBreak(20);
//       yPosition += 5;
//       doc.setFontSize(10);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Expansion Opportunities', margin, yPosition);
//       yPosition += 8;

//       guidance.expansion_areas.forEach((area) => {
//         checkPageBreak(18);
//         doc.setFillColor(239, 246, 255);
//         doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 15, 2, 2, 'F');
//         doc.setFontSize(8);
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(...colors.darkGray);
//         const areaLines = doc.splitTextToSize('- ' + safeText(area), pageWidth - 2 * margin - 8);
//         doc.text(areaLines, margin + 4, yPosition + 5);
//         yPosition += 18;
//       });
//     }
//   }

//   /* ----------------------------- PRICE BAND ----------------------------- */
//   if (shouldIncludeSection('marketOverview')) {
//     addNewPage();
//     addSectionHeader('Price Band Analysis', colors.successGreen);

//     const priceBand = reportData?.data?.priceBand;
//     if (priceBand && (isNum(priceBand.highest) || isNum(priceBand.lowest) || isNum(priceBand.average))) {
//       const highest = toNumber(priceBand.highest);
//       const lowest = toNumber(priceBand.lowest);
//       const average = toNumber(priceBand.average);

//       autoTable(doc, {
//         ...tableDefaults,
//         startY: yPosition,
//         head: [['Price Category', 'Amount']],
//         body: [
//           ['Highest Price', formatCurrency(highest)],
//           ['Average Price', formatCurrency(average)],
//           ['Lowest Price', formatCurrency(lowest)],
//         ],
//         theme: 'grid',
//         headStyles: { ...tableDefaults.headStyles, fillColor: [72, 187, 120], textColor: 255, fontSize: 9, halign: 'left' },
//         bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 8, cellPadding: 4 },
//         columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold' }, 1: { cellWidth: 'auto', halign: 'right' } },
//         margin: { left: margin },
//       });

//       yPosition = (doc as any).lastAutoTable.finalY + 15;

//       const insightBoxHeight = 25;
//       doc.setFillColor(239, 246, 255);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, insightBoxHeight, 3, 3, 'F');
//       doc.setDrawColor(...colors.electricBlue);
//       doc.setLineWidth(0.5);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, insightBoxHeight, 3, 3, 'S');

//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.electricBlue);
//       doc.text('Price Insights:', margin + 4, yPosition + 6);

//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(...colors.darkGray);

//       let insightText = '-';
//       if (highest != null && lowest != null && average != null && average !== 0) {
//         const priceRange = highest - lowest;
//         const priceVariation = ((priceRange / average) * 100).toFixed(1);
//         insightText =
//           `Price range spans ${formatCurrency(priceRange)} with ${priceVariation}% variation from average. ` +
//           `Target competitive pricing around ${formatCurrency(Math.round(lowest * 1.05))} to ${formatCurrency(Math.round(average * 0.95))} for optimal positioning.`;
//       } else {
//         insightText = 'Insufficient price data to compute meaningful insights.';
//       }

//       const insightLines = doc.splitTextToSize(insightText, pageWidth - 2 * margin - 8);
//       doc.text(insightLines, margin + 4, yPosition + 12);
//       yPosition += insightBoxHeight + 5;
//     }
//   }

//   /* ------------------------- CATEGORY DISTRIBUTION ------------------------- */
//   if (shouldIncludeSection('categoryAnalysis')) {
//     addNewPage();
//     addSectionHeader('Category-wise Tender Distribution', colors.darkBlue);

//     const categoryData = reportData?.data?.categoryListing;
//     const categories = categoryData?.categories ?? [];

//     if (categories.length > 0) {
//       const maxTimes = Math.max(...categories.map((c) => c.times || 0));
//       const chartOffset = 32;
//       const rightPad = 6;
//       const barAreaWidth = pageWidth - 2 * margin - chartOffset - rightPad;

//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Tender Categories by Volume', margin, yPosition);
//       yPosition += 10;

//       categories.forEach((cat) => {
//         const barX = margin + chartOffset;
//         const barWidth = maxTimes > 0 ? Math.max(0, Math.min(barAreaWidth, (cat.times / maxTimes) * barAreaWidth)) : 0;

//         doc.setFontSize(8);
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(...colors.darkGray);
//         doc.text(short(cat?.category, 25), margin, yPosition);

//         doc.setFont('helvetica', 'bold');
//         doc.setFontSize(7.5);
//         doc.setTextColor(...colors.darkBlue);
//         const valueText = (cat?.times ?? 0).toLocaleString();
//         const valueWidth = doc.getTextWidth(valueText);
//         doc.text(valueText, barX - valueWidth - 2, yPosition);

//         doc.setFillColor(...colors.lightGray);
//         doc.roundedRect(barX, yPosition - 5, barAreaWidth, 8, 1, 1, 'F');
//         doc.setFillColor(...colors.darkBlue);
//         doc.roundedRect(barX, yPosition - 5, barWidth, 8, 1, 1, 'F');

//         yPosition += 12;
//       });

//       yPosition += 10;
//     }
//   }

//   /* ----------------------- TOP SELLERS BY DEPARTMENT ----------------------- */
//   if (shouldIncludeSection('rivalryScore')) {
//     addNewPage();
//     addSectionHeader('Leading Competitors - ' + safeText(reportData?.meta?.params_used?.department), colors.warningOrange);

//     const topSellers = reportData?.data?.topSellersByDept;
//     if (topSellers?.results && topSellers.results.length > 0) {
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Top 10 Sellers by Participation Count', margin, yPosition);
//       yPosition += 10;

//       const sellerTableData = topSellers.results.slice(0, 10).map((seller, index) => {
//         const rank = seller.rank ?? index + 1;
//         const rankDisplay = index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${rank}`;
//         return [rankDisplay, short(seller?.seller_name, 60), (seller?.participation_count ?? 0).toLocaleString()];
//       });

//       autoTable(doc, {
//         ...tableDefaults,
//         startY: yPosition,
//         head: [['Rank', 'Seller Name', 'Participation Count']],
//         body: sellerTableData,
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 9 },
//         columnStyles: {
//           0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
//           1: { cellWidth: 130 },
//           2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
//         },
//         margin: { left: margin, right: margin, top: SAFE_TOP },
//         didDrawPage: () => {
//           addPageHeader();
//           addPageFooter();
//         },
//       });

//       yPosition = (doc as any).lastAutoTable.finalY + 8;
//     }
//   }

//   /* ---------------------- TOP PERFORMING STATES ---------------------- */
//   if (shouldIncludeSection('statesAnalysis')) {
//     addNewPage();
//     addSectionHeader('Top Performing States by Tender Volume', colors.successGreen);

//     const statesData = reportData?.data?.topPerformingStates;
//     if (statesData?.results && statesData.results.length > 0) {
//       const states = statesData.results.slice(0, 29);
//       const maxTenders = Math.max(...states.map((s) => s.total_tenders || 0));

//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('State-wise Tender Distribution (Top 29 States)', margin, yPosition);
//       yPosition += 10;

//       states.forEach((state, index) => {
//         checkPageBreak(10);
//         const barAreaWidth = pageWidth - 2 * margin - 65;
//         const barWidth = maxTenders > 0 ? (state.total_tenders / maxTenders) * barAreaWidth : 0;
//         let fillColor: [number, number, number] = colors.successGreen;
//         if (index < 5) fillColor = colors.darkBlue;

//         doc.setFontSize(7);
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(...colors.darkGray);
//         doc.text(short(state?.state_name, 25), margin, yPosition);

//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...fillColor);
//         const valueText = (state?.total_tenders ?? 0).toLocaleString();
//         const valueWidth = doc.getTextWidth(valueText);
//         doc.text(valueText, margin + 60 - valueWidth - 2, yPosition);

//         doc.setFillColor(...colors.lightGray);
//         doc.roundedRect(margin + 60, yPosition - 4, barAreaWidth, 6, 1, 1, 'F');
//         doc.setFillColor(...fillColor);
//         doc.roundedRect(margin + 60, yPosition - 4, barWidth, 6, 1, 1, 'F');

//         yPosition += 9;
//       });
//     }
//   }

//   /* ------------------------- DEPARTMENT LANDSCAPE ------------------------- */
//   if (shouldIncludeSection('departmentsAnalysis')) {
//     addNewPage();
//     addSectionHeader('All Departments - Tender Volume Overview', colors.darkBlue);

//     const allDepts = reportData?.data?.allDepartments ?? [];
//     if (allDepts.length > 0) {
//       const depts = allDepts.slice(0, 20);
//       const counts = depts.map((d) => (typeof d.total_tenders === 'string' ? parseInt(d.total_tenders) : d.total_tenders || 0));
//       const maxTenders = Math.max(...counts);

//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.darkGray);
//       doc.text('Department-wise Tender Distribution (Top 20)', margin, yPosition);
//       yPosition += 10;

//       depts.forEach((dept, i) => {
//         checkPageBreak(10);
//         const tenderCount = counts[i] ?? 0;
//         const barAreaWidth = pageWidth - 2 * margin - 75;
//         const barWidth = maxTenders > 0 ? (tenderCount / maxTenders) * barAreaWidth : 0;

//         doc.setFontSize(7);
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(...colors.darkGray);
//         doc.text(short(dept?.department, 32), margin, yPosition);

//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...colors.darkBlue);
//         const valueText = tenderCount.toLocaleString();
//         const valueWidth = doc.getTextWidth(valueText);
//         doc.text(valueText, margin + 70 - valueWidth - 2, yPosition);

//         doc.setFillColor(...colors.lightGray);
//         doc.roundedRect(margin + 70, yPosition - 4, barAreaWidth, 6, 1, 1, 'F');
//         doc.setFillColor(...colors.darkBlue);
//         doc.roundedRect(margin + 70, yPosition - 4, barWidth, 6, 1, 1, 'F');

//         yPosition += 9;
//       });
//     }
//   }

//   /* --------------------- LOW COMPETITION OPPORTUNITIES --------------------- */
//   if (shouldIncludeSection('lowCompetition')) {
//     addNewPage();
//     addSectionHeader('Low Competition Bids - Strategic Opportunities', colors.successGreen);

//     const lowCompBids = reportData?.data?.lowCompetitionBids;
//     if (lowCompBids?.results && lowCompBids.results.length > 0) {
//       const bids = lowCompBids.results.slice(0, 25);

//       const summaryCardHeight = 20;
//       doc.setFillColor(240, 253, 244);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, summaryCardHeight, 2, 2, 'F');
//       doc.setDrawColor(...colors.successGreen);
//       doc.setLineWidth(0.5);
//       doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, summaryCardHeight, 2, 2, 'S');

//       doc.setFontSize(8);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(...colors.mediumGray);
//       doc.text('Total Low Competition Bids: ', margin + 5, yPosition + 8);
//       doc.setTextColor(...colors.successGreen);
//       doc.text(String(lowCompBids.count ?? 0), margin + 65, yPosition + 8);

//       doc.setTextColor(...colors.mediumGray);
//       doc.text('Generated At: ', margin + 5, yPosition + 15);
//       doc.setTextColor(...colors.darkGray);
//       doc.text(formatDate(lowCompBids.generated_at), margin + 35, yPosition + 15);

//       yPosition += summaryCardHeight + 6;
//       doc.setFontSize(7);
//       doc.setFont('helvetica', 'italic');
//       doc.setTextColor(...colors.mediumGray);
//       doc.text('Note: "-" indicates data not available from source system. Low seller count indicates opportunity.', margin, yPosition);
//       yPosition += 6;

//       const bidTableData = bids.map((bid) => [
//         short(bid?.bid_number, 23),
//         (bid?.quantity ?? 0).toLocaleString(),
//         short(bid?.organisation, 30),
//         short(bid?.department, 28),
//         short(bid?.ministry, 25),
//         formatDate(bid?.bid_end_ts),
//         String(bid?.seller_count ?? 0),
//       ]);

//       autoTable(doc, {
//         ...tableDefaults,
//         startY: yPosition,
//         head: [['Bid Number', 'Qty', 'Organization', 'Department', 'Ministry', 'Bid End Date', 'Sellers']],
//         body: bidTableData,
//         theme: 'grid',
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 7.5 },
//         bodyStyles: { ...tableDefaults.bodyStyles, lineColor: [209, 213, 219], lineWidth: 0.2 },
//         columnStyles: {
//           0: { cellWidth: 24 },
//           1: { cellWidth: 11, halign: 'right', fontStyle: 'bold' },
//           2: { cellWidth: 33 },
//           3: { cellWidth: 32 },
//           4: { cellWidth: 28 },
//           5: { cellWidth: 20, halign: 'center' },
//           6: { cellWidth: 13, halign: 'center', fontStyle: 'bold', textColor: [231, 76, 60], fillColor: [254, 242, 242] },
//         },
//         margin: { left: margin - 2, right: margin - 2, top: SAFE_TOP },
//         didDrawPage: () => {
//           addPageHeader();
//           addPageFooter();
//         },
//       });

//       yPosition = (doc as any).lastAutoTable.finalY + 8;
//     }
//   }

//   /* ----------------- SELLER BID PERFORMANCE + HISTORY ----------------- */
//   if (shouldIncludeSection('bidsSummary')) {
//     const sellerBids = reportData?.data?.sellerBids;
//     if (sellerBids) {
//       addNewPage();
//       addSectionHeader(safeText(reportData?.meta?.params_used?.sellerName) + ' - Bidding Performance Deep Dive', colors.electricBlue);

//       if (sellerBids.table1) {
//         const t1 = sellerBids.table1;
//         const cardWidth = (pageWidth - 2 * margin - 15) / 3;
//         const cardHeight = 25;
//         let cardX = margin;

//         const cardsData = [
//           { label: 'Total Wins', value: (t1.win ?? 0).toLocaleString(), color: colors.successGreen, bgColor: [240, 253, 244] as [number, number, number] },
//           { label: 'Total Lost', value: (t1.lost ?? 0).toLocaleString(), color: colors.errorRed, bgColor: [254, 226, 226] as [number, number, number] },
//           {
//             label: 'Win Rate',
//             value:
//               t1.win != null && t1.lost != null && t1.win + t1.lost > 0
//                 ? `${((t1.win / (t1.win + t1.lost)) * 100).toFixed(1)}%`
//                 : '-',
//             color: colors.darkBlue,
//             bgColor: [239, 246, 255] as [number, number, number],
//           },
//         ];

//         cardsData.forEach((card) => {
//           doc.setFillColor(...card.bgColor);
//           doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 2, 2, 'F');

//           doc.setFontSize(16);
//           doc.setFont('helvetica', 'bold');
//           doc.setTextColor(...card.color);
//           doc.text(card.value, cardX + cardWidth / 2, yPosition + 13, { align: 'center' });

//           doc.setFontSize(8);
//           doc.setFont('helvetica', 'normal');
//           doc.setTextColor(...colors.mediumGray);
//           doc.text(card.label, cardX + cardWidth / 2, yPosition + 20, { align: 'center' });

//           cardX += cardWidth + 5;
//         });

//         yPosition += cardHeight + 6;

//         cardX = margin;
//         const cardsData2 = [
//           { label: 'Total Bid Value', value: formatCurrency(t1.totalBidValue), color: colors.warningOrange, bgColor: [254, 243, 199] as [number, number, number] },
//           { label: 'Qualified Bid Value', value: formatCurrency(t1.qualifiedBidValue), color: colors.successGreen, bgColor: [240, 253, 244] as [number, number, number] },
//           { label: 'Avg Order Value', value: formatCurrency(t1.averageOrderValue), color: [138, 43, 226] as [number, number, number], bgColor: [243, 232, 255] as [number, number, number] },
//         ];

//         cardsData2.forEach((card) => {
//           doc.setFillColor(...card.bgColor);
//           doc.roundedRect(cardX, yPosition, cardWidth, cardHeight, 2, 2, 'F');

//           doc.setFontSize(11);
//           doc.setFont('helvetica', 'bold');
//           doc.setTextColor(...card.color);
//           const valueText = (card.value || '').length > 18 ? card.value.slice(0, 18) : card.value;
//           doc.text(valueText || '-', cardX + cardWidth / 2, yPosition + 13, { align: 'center' });

//           doc.setFontSize(8);
//           doc.setFont('helvetica', 'normal');
//           doc.setTextColor(...colors.mediumGray);
//           doc.text(card.label, cardX + cardWidth / 2, yPosition + 20, { align: 'center' });

//           cardX += cardWidth + 5;
//         });

//         yPosition += cardHeight + 10;
//       }

//       // Departmental Performance
//       if (sellerBids.departmentCount && sellerBids.departmentCount.length > 0) {
//         checkPageBreak(20);
//         doc.setFontSize(10);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...colors.darkGray);
//         doc.text('Revenue by Department', margin, yPosition);
//         yPosition += 8;

//         const deptSorted = [...sellerBids.departmentCount].sort((a, b) => (b?.revenue ?? 0) - (a?.revenue ?? 0));
//         const deptTableData = deptSorted.map((dept) => [
//           short(dept?.department, 50),
//           (dept?.bid_count ?? 0).toLocaleString(),
//           formatCurrency(dept?.revenue ?? 0),
//         ]);

//         const totalRevenue = deptSorted.reduce((sum, d) => sum + (d?.revenue ?? 0), 0);
//         const totalBids = deptSorted.reduce((sum, d) => sum + (d?.bid_count ?? 0), 0);
//         deptTableData.push(['TOTAL', totalBids.toLocaleString(), formatCurrency(totalRevenue)]);

//         autoTable(doc, {
//           ...tableDefaults,
//           startY: yPosition,
//           head: [['Department', 'Bid Count', 'Revenue']],
//           body: deptTableData,
//           headStyles: { ...tableDefaults.headStyles, fillColor: colors.darkBlue, textColor: colors.white, fontSize: 8 },
//           columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 30, halign: 'right' }, 2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' } },
//           margin: { left: margin, right: margin, top: SAFE_TOP },
//           didDrawPage: () => {
//             addPageHeader();
//             addPageFooter();
//           },
//         });

//         yPosition = (doc as any).lastAutoTable.finalY + 10;
//       }

//       // State-wise Analysis
//       if (sellerBids.stateCount && sellerBids.stateCount.length > 0) {
//         checkPageBreak(20);
//         doc.setFontSize(10);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...colors.darkGray);
//         doc.text('Bids by State', margin, yPosition);
//         yPosition += 8;

//         const stateTableData = [...sellerBids.stateCount]
//           .sort((a, b) => (b?.revenue ?? 0) - (a?.revenue ?? 0))
//           .slice(0, 15)
//           .map((state) => [short(state?.state, 40), (state?.bid_count ?? 0).toLocaleString(), formatCurrency(state?.revenue ?? 0)]);

//         autoTable(doc, {
//           ...tableDefaults,
//           startY: yPosition,
//           head: [['State', 'Bid Count', 'Revenue']],
//           body: stateTableData,
//           theme: 'grid',
//           headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 8 },
//           columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 30, halign: 'right' }, 2: { cellWidth: 50, halign: 'right' } },
//           margin: { left: margin, right: margin, top: SAFE_TOP },
//           didDrawPage: () => {
//             addPageHeader();
//             addPageFooter();
//           },
//         });

//         yPosition = (doc as any).lastAutoTable.finalY + 8;
//       }

//       // Monthly Trends
//       if (sellerBids.monthlyTotals && sellerBids.monthlyTotals.length > 0) {
//         addNewPage();
//         addSectionHeader('Monthly Bidding Trends', colors.warningOrange);

//         const monthlyTableData = sellerBids.monthlyTotals.map((month) => [short(month?.month, 20), formatCurrency(month?.bid_value ?? 0)]);

//         autoTable(doc, {
//           ...tableDefaults,
//           startY: yPosition,
//           head: [['Month', 'Bid Value']],
//           body: monthlyTableData,
//           headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 9 },
//           bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 8, cellPadding: 3 },
//           columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' } },
//           margin: { left: margin, right: margin, top: SAFE_TOP },
//           didDrawPage: () => {
//             addPageHeader();
//             addPageFooter();
//           },
//         });

//         yPosition = (doc as any).lastAutoTable.finalY + 8;
//       }

//       // Detailed Bid History
//       if (sellerBids.sortedRows && sellerBids.sortedRows.length > 0) {
//         addNewPage();
//         addSectionHeader('Bid-by-Bid Performance History', colors.electricBlue);

//         doc.setFontSize(7);
//         doc.setFont('helvetica', 'italic');
//         doc.setTextColor(...colors.mediumGray);
//         doc.text('Note: "-" indicates data not available from source system', margin, yPosition);
//         yPosition += 6;

//         const bidHistoryData = sellerBids.sortedRows.map((row) => {
//           const status = clean(row?.seller_status ?? row?.status);
//           const organisation = short(row?.organisation ?? row?.org, 28);
//           const department = short(row?.department ?? row?.dept, 28);
//           const price = row?.total_price != null ? formatCurrency(row.total_price) : '-';
//           return [
//             formatDate(row?.participated_on),
//             short(row?.offered_item, 60),
//             status || '-',
//             short(row?.rank, 6),
//             price,
//             organisation,
//             department,
//           ];
//         });

//         autoTable(doc, {
//           ...tableDefaults,
//           startY: yPosition,
//           head: [['Date', 'Item', 'Status', 'Rank', 'Price', 'Organization', 'Department']],
//           body: bidHistoryData,
//           theme: 'grid',
//           headStyles: { ...tableDefaults.headStyles, fillColor: colors.electricBlue, textColor: colors.white, fontSize: 7.5, cellPadding: 3 },
//           bodyStyles: { ...tableDefaults.bodyStyles, cellPadding: 2.5, lineColor: [209, 213, 219], lineWidth: 0.2 },
//           columnStyles: {
//             0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
//             1: { cellWidth: 60 },
//             2: { cellWidth: 16, halign: 'center' },
//             3: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
//             4: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
//             5: { cellWidth: 32 },
//             6: { cellWidth: 30 },
//           },
//           margin: { left: margin - 2, right: margin - 2, top: SAFE_TOP },
//           showHead: 'everyPage',
//           willDrawCell: (data: any) => {
//             if (data.section === 'body' && data.column.index === 2) {
//               const statusVal = (data.cell.raw || '').toString().toLowerCase();
//               if (statusVal === 'qualified') data.cell.styles.textColor = colors.successGreen;
//               else if (statusVal.includes('disqualified')) data.cell.styles.textColor = colors.errorRed;
//             }
//             if (data.section === 'body' && data.column.index === 3) {
//               const rankVal = (data.cell.raw || '').toString().toUpperCase();
//               if (rankVal === 'L1') {
//                 data.cell.styles.fillColor = [240, 253, 244];
//                 data.cell.styles.textColor = colors.successGreen;
//               } else if (rankVal === 'L2') {
//                 data.cell.styles.fillColor = [254, 243, 199];
//                 data.cell.styles.textColor = colors.warningOrange;
//               }
//             }
//           },
//           didDrawPage: (data: any) => {
//             if (data.pageNumber > data.table.startPageNumber) {
//               addPageHeader();
//               addPageFooter();
//             }
//           },
//         });

//         yPosition = (doc as any).lastAutoTable.finalY + 8;
//       }
//     }
//   }

//   return doc;
// };

// generatePdfReport.ts
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// /* ========================================================================== */
// /*                              TYPES (ROBUST)                                 */
// /*  — Aligned to the real payload you shared.                                  */
// /*  — Many fields are unioned to handle slight API drift.                      */
// /* ========================================================================== */

// interface MissedWin {
//   bid_id?: string;
//   original_b_id?: string | number;
//   bid_number?: string;
//   offered_item?: string;
//   quantity?: number;
//   total_price?: number;
//   seller_name?: string;
//   org?: string;
//   dept?: string;
//   ministry?: string;
//   ended_at?: string;
// }

// interface AIPotentialOpp {
//   matching_market_win?: MissedWin;
//   reason?: string;
//   confidence?: string;
// }

// interface AILikelyWin {
//   original_b_id?: string | number;
//   bid_number?: string;
//   offered_item?: string;
//   potential_opportunities?: AIPotentialOpp[];
// }

// interface AISignalsEntry {
//   name?: string;        // <— your sample uses { name, frequency }
//   frequency?: string;
// }

// interface AISignals {
//   org_affinity?: AISignalsEntry[];
//   dept_affinity?: AISignalsEntry[];
//   ministry_affinity?: AISignalsEntry[];
//   quantity_ranges?: string | any[];  // string in your sample
//   price_ranges?: string | any[];     // string in your sample
// }

// interface AIGuidance {
//   note?: string;
//   next_steps?: string[];
//   expansion_areas?: string[];
// }

// interface AIBlock {
//   strategy_summary?: string;
//   likely_wins?: AILikelyWin[];
//   signals?: AISignals;
//   guidance?: AIGuidance;
// }

// interface MissedButWinnableBlock {
//   seller?: string;
//   recentWins?: MissedWin[];
//   marketWins?: MissedWin[];
//   ai?: AIBlock;
//   meta?: any;
// }

// interface PriceBand {
//   q?: string;
//   mode?: string;
//   limit?: number;
//   rowsFetched?: number;
//   analysis?: {
//     highest?: number;
//     lowest?: number;
//     average?: number;
//     count?: number;
//     total?: number;
//     currency?: string | null;
//   };
//   meta?: {
//     processingTimeMs?: number;
//     timestamp?: string;
//   };
// }

// interface CategoryListing {
//   categories?: Array<{ category?: string; times?: number }>;
//   metadata?: {
//     totalItems?: number;
//     totalCount?: number;
//     categoryCount?: number;
//     processingTime?: number;
//     timestamp?: string;
//   };
// }

// interface TopSellersDeptItem {
//   seller_name?: string;
//   participation_count?: number;
//   rank?: number;
// }
// interface TopSellersDepartment {
//   department?: string;
//   total?: number;
//   results?: TopSellersDeptItem[];
// }
// interface TopSellersByDept {
//   seller_name?: string;
//   totalTopDepartments?: number;
//   departments?: TopSellersDepartment[]; // <— real sample structure
//   meta?: any;
// }

// interface TopPerformingStates {
//   source?: string;
//   refreshed?: boolean;
//   data?: {
//     generated_at?: string;
//     ttl_seconds?: number;
//     count?: number;
//     results?: Array<{ state_name?: string; total_tenders?: number }>;
//   };
//   meta?: any;
// }

// interface AllDepartmentsBlock {
//   error?: boolean;
//   status?: string;
//   reason?: string;
//   results?: any[]; // if present
// }

// interface EstimatedMissedValue {
//   seller?: string;
//   days?: number;
//   maxResults?: number;
//   total?: number;
//   processingTimeMs?: number;
//   results?: any[];
// }

// interface LowCompetitionBid {
//   id?: string;
//   original_b_id?: string;
//   bid_number?: string;
//   quantity?: number;
//   bid_start_ts?: string;
//   bid_end_ts?: string;
//   bid_opening_ts?: string;
//   organisation?: string;
//   department?: string;
//   ministry?: string;
//   address?: string;
//   seller_count?: number | string;
// }
// interface LowCompetitionBids {
//   source?: string;
//   generated_at?: string;
//   ttl_seconds?: number;
//   count?: number;
//   results?: LowCompetitionBid[];
// }

// interface SellerBidsBlock {
//   query?: string;
//   mode?: string;
//   limit?: number;
//   offset?: number;
//   totalHits?: number;
//   rowsFetched?: number;
//   meta?: any;

//   // REAL shape in your sample uses maps:
//   departmentCount?: {
//     departmentCount?: Record<string, number>;
//     revenue?: Record<string, number>;
//   };

//   // REAL shape in your sample — only "Unknown"
//   stateCount?: {
//     stateCounts?: Record<string, number>;
//     stateRevenue?: Record<string, number>;
//     totalStates?: number;
//     totalRevenue?: number;
//     totalBids?: number;
//   };

//   monthlyTotals?: {
//     labels?: string[];
//     values?: number[];
//     byMonth?: Record<string, number>;
//     total?: number;
//     start?: string;
//     end?: string;
//   };

//   sortedRows?: Array<{
//     seller_name?: string;
//     offered_item?: string;
//     participated_on?: string;
//     seller_status?: string;
//     rank?: string;
//     total_price?: number | null;
//     organisation?: string;
//     department?: string;
//     ministry?: string;
//   }>;

//   table1?: {
//     win?: number;
//     lost?: number;
//     totalBidValue?: number;
//     qualifiedBidValue?: number;
//     disqualifiedBidValue?: number;
//     totalBidsParticipated?: number;
//     averageOrderValue?: number;
//     qualifiedBreakdown?: Record<string, number>;
//   };
// }

// interface ReportData {
//   meta?: {
//     report_generated_at?: string;
//     params_used?: {
//       sellerName?: string;
//       department?: string;
//       offeredItem?: string;
//       days?: number;
//       limit?: number;
//       perItem?: number;
//       offset?: number;
//       mode?: string;
//       email?: string;
//     };
//     processingTimeMs?: number;
//     requests_completed?: number;
//     requests_failed?: number;
//     requests_total?: number;
//   };
//   data?: {
//     missedButWinnable?: MissedButWinnableBlock;
//     priceBand?: PriceBand;
//     categoryListing?: CategoryListing;
//     topSellersByDept?: TopSellersByDept;
//     topPerformingStates?: TopPerformingStates;
//     allDepartments?: AllDepartmentsBlock;
//     estimatedMissedValue?: EstimatedMissedValue;
//     lowCompetitionBids?: LowCompetitionBids;
//     sellerBids?: SellerBidsBlock;
//   };
// }

// interface FilterOptions {
//   includeSections?: string[];
// }

// /* ========================================================================== */
// /*                                COLOR PALETTE                               */
// /* ========================================================================== */
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

// /* ========================================================================== */
// /*                               UTIL HELPERS                                 */
// /* ========================================================================== */
// const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);
// const isNum = (v: any) => typeof v === 'number' && !isNaN(v);

// const clampStr = (s: string, max = 999): string => (s.length > max ? s.slice(0, max) : s);

// const clean = (value: any): string => {
//   if (value === null || value === undefined) return '-';
//   if (Array.isArray(value)) {
//     const flat = value.map((v) => {
//       if (v === null || v === undefined) return '';
//       if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
//       if (isObj(v)) {
//         const min = (v as any).min ?? (v as any).from;
//         const max = (v as any).max ?? (v as any).to;
//         if (min !== undefined || max !== undefined) return `${min ?? ''}-${max ?? ''}`;
//         try { return JSON.stringify(v); } catch { return ''; }
//       }
//       return String(v);
//     });
//     return flat.filter(Boolean).join(', ') || '-';
//   }
//   if (isObj(value)) {
//     const min = (value as any).min ?? (value as any).from;
//     const max = (value as any).max ?? (value as any).to;
//     if (min !== undefined || max !== undefined) return `${min ?? ''}-${max ?? ''}`;
//     try { return JSON.stringify(value); } catch { return '-'; }
//   }
//   const s = String(value);
//   return (
//     s
//       .replace(/[₹]/g, 'Rs ')
//       .replace(/[\u2018\u2019]/g, "'")
//       .replace(/[\u201C\u201D]/g, '"')
//       .replace(/\u00A0/g, ' ')
//       .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
//       .replace(/[\u2013\u2014]/g, '-')
//       .replace(/[\u2022\u2023\u2043]/g, '*')
//       .replace(/[^\x20-\x7E]/g, '')
//       .replace(/\s+/g, ' ')
//       .trim() || '-'
//   );
// };

// const safeText = (v: any, fallback = '-'): string => {
//   const c = clean(v);
//   return c === '-' ? fallback : c;
// };

// const short = (v: any, len: number, fallback = '-') => {
//   const c = clean(v);
//   return c === '-' ? fallback : clampStr(c, len);
// };

// const toNumber = (v: any): number | null => {
//   if (typeof v === 'number') return isFinite(v) ? v : null;
//   if (typeof v === 'string' && v.trim() !== '') {
//     const n = Number(v);
//     return isFinite(n) ? n : null;
//   }
//   return null;
// };

// const formatCurrency = (amount: number | string | null | undefined): string => {
//   const n = typeof amount === 'string' ? parseFloat(amount) : amount ?? null;
//   if (n === null || !isFinite(Number(n))) return '-';
//   // Show Rs 0 for zero — you asked for exact data, not blank.
//   const num = Number(n);
//   try {
//     return `Rs ${num.toLocaleString('en-IN')}`;
//   } catch {
//     return `Rs ${num}`;
//   }
// };

// const formatDate = (dateString?: string | null): string => {
//   if (!dateString || dateString === 'N/A' || dateString === 'undefined') return '-';
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return '-';
//     return date
//       .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//       .replace(/ /g, '-');
//   } catch {
//     return '-';
//   }
// };

// const tableDefaults = {
//   theme: 'striped' as const,
//   headStyles: { halign: 'center' as const, fontStyle: 'bold' as const },
//   bodyStyles: { fontSize: 7, cellPadding: 2, minCellHeight: 8, overflow: 'linebreak' as const, valign: 'middle' as const },
// };

// const arr = <T = any>(v: any): T[] => (Array.isArray(v) ? v : []);
// const asMap = (v: any): Record<string, any> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, any>) : {});
// const nonEmpty = (s?: string | null) => !!s && s.trim().length > 0;

// /* ========================================================================== */
// /*                              MAIN EXPORT                                    */
// /* ========================================================================== */
// export const generatePDF = async (reportData: ReportData, filters?: FilterOptions) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 12;
//   const HEADER_H = 18;
//   const FOOTER_H = 12;
//   const SAFE_TOP = HEADER_H + 5;
//   const SAFE_BOTTOM = pageHeight - FOOTER_H - 8;
//   let y = SAFE_TOP;

//   // If no filters specified, include everything
//   const include = (sectionId: string): boolean => {
//     if (!filters || !filters.includeSections || filters.includeSections.length === 0) return true;
//     return filters.includeSections.includes(sectionId);
//   };

//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, HEADER_H, 'F');
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.white);
//     doc.text('GOVERNMENT TENDER ANALYSIS', pageWidth / 2, 11, { align: 'center' });
//   };

//   const addFooter = () => {
//     const pageNum =
//       (doc as any).getCurrentPageInfo?.().pageNumber ??
//       (doc as any).internal?.getNumberOfPages?.() ??
//       (doc as any).internal?.pages?.length ??
//       1;
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - FOOTER_H, pageWidth, FOOTER_H, 'F');
//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...colors.white);
//     doc.text(safeText(reportData?.meta?.params_used?.sellerName), margin, pageHeight - 6);
//     doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
//     doc.text(formatDate(reportData?.meta?.report_generated_at), pageWidth - margin, pageHeight - 6, { align: 'right' });
//   };

//   const newPage = () => {
//     doc.addPage();
//     y = SAFE_TOP;
//     addHeader();
//     addFooter();
//   };

//   const need = (space: number) => {
//     if (y + space > SAFE_BOTTOM) {
//       newPage();
//       return true;
//     }
//     return false;
//   };

//   const section = (title: string, color: [number, number, number] = colors.navyBlue) => {
//     need(15);
//     doc.setFillColor(...color);
//     doc.rect(margin, y, pageWidth - 2 * margin, 10, 'F');
//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.white);
//     doc.text(title, margin + 4, y + 7);
//     y += 13;
//   };

//   /* =============================== COVER =============================== */
//   doc.setFillColor(...colors.navyBlue);
//   doc.rect(0, 0, pageWidth, pageHeight, 'F');

//   // Decorative shapes
//   doc.setFillColor(20, 40, 75); doc.circle(pageWidth + 40, -20, 80, 'F');
//   doc.circle(-50, pageHeight / 2, 100, 'F');
//   doc.circle(pageWidth + 20, pageHeight + 30, 70, 'F');

//   // Title
//   doc.setFontSize(24); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.white);
//   doc.text('GOVERNMENT', pageWidth / 2, 60, { align: 'center' });
//   doc.text('TENDER ANALYSIS', pageWidth / 2, 72, { align: 'center' });

//   // Subtitle
//   y = 90;
//   doc.setFillColor(25, 50, 85);
//   doc.roundedRect(margin + 10, y, pageWidth - 2 * margin - 20, 14, 3, 3, 'F');
//   doc.setFontSize(12); doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.electricBlue);
//   doc.text('Comprehensive Performance Report', pageWidth / 2, y + 9, { align: 'center' });

//   // Company
//   y = 115;
//   const companyBoxWidth = pageWidth - 60;
//   doc.setFillColor(15, 30, 55);
//   doc.roundedRect((pageWidth - companyBoxWidth) / 2, y, companyBoxWidth, 20, 3, 3, 'F');
//   doc.setDrawColor(...colors.electricBlue);
//   doc.setLineWidth(0.5);
//   doc.roundedRect((pageWidth - companyBoxWidth) / 2, y, companyBoxWidth, 20, 3, 3, 'S');
//   doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.electricBlue);
//   doc.text(safeText(reportData?.meta?.params_used?.sellerName || 'Company'), pageWidth / 2, y + 13, { align: 'center' });

//   // Meta
//   y = 150;
//   doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.white);
//   doc.text('Report Generated: ' + formatDate(reportData?.meta?.report_generated_at), pageWidth / 2, y, { align: 'center' });
//   y += 8;
//   doc.text('Analysis Period: ' + (reportData?.meta?.params_used?.days ?? '-').toString() + ' days', pageWidth / 2, y, { align: 'center' });
//   y += 8;
//   doc.text('Department Filter: ' + safeText(reportData?.meta?.params_used?.department || 'All'), pageWidth / 2, y, { align: 'center' });

//   y += 12;
//   doc.setFontSize(9);
//   doc.text('Offered Items:', pageWidth / 2, y, { align: 'center' });
//   y += 6;
//   const itemLines = doc.splitTextToSize(
//     short(reportData?.meta?.params_used?.offeredItem || 'Various', 200),
//     pageWidth - 40
//   );
//   doc.text(itemLines.slice(0, 3), pageWidth / 2, y, { align: 'center' });

//   // Start standard pages
//   newPage();

//   /* ===================== MISSED BUT WINNABLE: WINS ===================== */
//   if (include('missedTenders')) {
//     section('Missed But Winnable - Market Intelligence', colors.darkBlue);

//     const recentWins = arr<MissedWin>(reportData?.data?.missedButWinnable?.recentWins);
//     if (recentWins.length) {
//       doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//       doc.text('Recent Wins by ' + safeText(reportData?.meta?.params_used?.sellerName), margin, y); y += 8;

//       const rows = recentWins.map(w => [
//         short(w.bid_number, 25),
//         short(w.offered_item, 60),
//         String(w.quantity ?? 0),
//         formatCurrency(w.total_price ?? 0),
//         short(w.org, 30),
//         short(w.dept, 35),
//         formatDate(w.ended_at),
//       ]);

//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Bid Number', 'Item Category', 'Qty', 'Total Price', 'Organization', 'Department', 'End Date']],
//         body: rows,
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.darkBlue, textColor: colors.white, fontSize: 8 },
//         columnStyles: {
//           0: { cellWidth: 26 },
//           1: { cellWidth: 60 },
//           2: { cellWidth: 12, halign: 'right' },
//           3: { cellWidth: 25, halign: 'right' },
//           4: { cellWidth: 33 },
//           5: { cellWidth: 33 },
//           6: { cellWidth: 20, halign: 'center' },
//         },
//         margin: { left: margin - 3, right: margin, top: SAFE_TOP },
//         showHead: 'everyPage',
//         didDrawPage: (data: any) => { if (data.pageNumber > data.table.startPageNumber) { addHeader(); addFooter(); } },
//       });
//       y = (doc as any).lastAutoTable.finalY + 10;
//     }

//     const marketWins = arr<MissedWin>(reportData?.data?.missedButWinnable?.marketWins);
//     if (marketWins.length) {
//       need(20);
//       doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//       doc.text('Competitor Market Wins', margin, y); y += 8;

//       const rows = marketWins.map(w => [
//         short(w.bid_number, 25),
//         short(w.seller_name, 30),
//         short(w.offered_item, 45),
//         String(w.quantity ?? 0),
//         formatCurrency(w.total_price ?? 0),
//         short(w.org, 30),
//         short(w.dept, 30),
//         formatDate(w.ended_at),
//       ]);

//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Bid Number', 'Seller Name', 'Item', 'Qty', 'Price', 'Organization', 'Department', 'End Date']],
//         body: rows,
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 7 },
//         bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 6.5 },
//         columnStyles: {
//           0: { cellWidth: 24 },
//           1: { cellWidth: 28 },
//           2: { cellWidth: 45 },
//           3: { cellWidth: 10, halign: 'right' },
//           4: { cellWidth: 22, halign: 'right' },
//           5: { cellWidth: 28 },
//           6: { cellWidth: 28 },
//           7: { cellWidth: 18, halign: 'center' },
//         },
//         margin: { left: margin, right: margin, top: SAFE_TOP },
//         showHead: 'everyPage',
//         didDrawPage: (data: any) => { if (data.pageNumber > data.table.startPageNumber) { addHeader(); addFooter(); } },
//       });
//       y = (doc as any).lastAutoTable.finalY + 8;
//     }
//   }

//   /* ========================== AI: INSIGHTS ============================ */
//   if (include('buyerInsights')) {
//     const ai = reportData?.data?.missedButWinnable?.ai;
//     if (ai) {
//       newPage();
//       section('AI-Driven Intelligence & Strategy', colors.electricBlue);

//       // Strategy summary
//       if (nonEmpty(ai.strategy_summary)) {
//         doc.setFillColor(239, 246, 255);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, 40, 3, 3, 'F');
//         doc.setDrawColor(...colors.electricBlue); doc.setLineWidth(0.5);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, 40, 3, 3, 'S');

//         doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//         doc.text('AI Strategy Summary', margin + 4, y + 6);

//         doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray);
//         const lines = doc.splitTextToSize(safeText(ai.strategy_summary), pageWidth - 2 * margin - 8);
//         doc.text(lines, margin + 4, y + 12);
//         y += 45;
//       }

//       // Likely wins (each with nested potential opportunities)
//       const likely = arr<AILikelyWin>(ai.likely_wins);
//       if (likely.length) {
//         need(20);
//         doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//         doc.text('Likely Wins - High Probability Opportunities', margin, y); y += 10;

//         likely.forEach((win, i) => {
//           need(40);
//           const boxH = 38;
//           doc.setFillColor(240, 253, 244);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, boxH, 2, 2, 'F');
//           doc.setDrawColor(...colors.successGreen); doc.setLineWidth(0.5);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, boxH, 2, 2, 'S');

//           doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.successGreen);
//           doc.text(`Opportunity ${i + 1}:`, margin + 3, y + 6);

//           doc.setTextColor(...colors.darkGray);
//           const itemText = short(win?.offered_item, 120);
//           const itemLines2 = doc.splitTextToSize(itemText, pageWidth - 2 * margin - 35);
//           doc.text(itemLines2.slice(0, 1), margin + 30, y + 6);

//           // Nested potential opportunities list/table
//           const opps = arr<AIPotentialOpp>(win?.potential_opportunities);
//           if (opps.length) {
//             const rows = opps.map(o => {
//               const m = o.matching_market_win || {};
//               return [
//                 short(m.bid_number, 22),
//                 short(m.seller_name, 24),
//                 short(m.offered_item, 42),
//                 String(m.quantity ?? 0),
//                 formatCurrency(m.total_price ?? 0),
//                 short(m.org, 20),
//                 short(o.confidence, 8),
//               ];
//             });
//             y += boxH + 3;
//             autoTable(doc, {
//               ...tableDefaults,
//               startY: y,
//               head: [['Bid', 'Seller', 'Item', 'Qty', 'Price', 'Org', 'Conf']],
//               body: rows,
//               theme: 'grid',
//               headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 7 },
//               bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7, cellPadding: 1.6 },
//               columnStyles: {
//                 0: { cellWidth: 24 },
//                 1: { cellWidth: 27 },
//                 2: { cellWidth: 48 },
//                 3: { cellWidth: 10, halign: 'right' },
//                 4: { cellWidth: 22, halign: 'right' },
//                 5: { cellWidth: 22 },
//                 6: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
//               },
//               margin: { left: margin, right: margin, top: SAFE_TOP },
//               didDrawPage: () => { addHeader(); addFooter(); },
//             });
//             y = (doc as any).lastAutoTable.finalY + 6;
//           } else {
//             // If no nested list, still advance below the box
//             y += boxH + 6;
//           }
//         });
//       }

//       // Signals
//       newPage();
//       section('Strategic Affinity Signals', colors.darkBlue);
//       const sig = ai.signals || {};

//       const renderAffinity = (title: string, list?: AISignalsEntry[], accent: [number, number, number]) => {
//         if (!list || !list.length) return;
//         doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//         doc.text(title, margin, y); y += 6;

//         const rows = list.map(s => [short(s.name, 60), short(s.frequency, 20)]);
//         autoTable(doc, {
//           ...tableDefaults,
//           startY: y,
//           head: [['Name', 'Frequency']],
//           body: rows,
//           theme: 'grid',
//           headStyles: { ...tableDefaults.headStyles, fillColor: accent, textColor: colors.white, fontSize: 8 },
//           bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7, cellPadding: 2 },
//           columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 40, halign: 'right' } },
//           margin: { left: margin, right: margin, top: SAFE_TOP },
//           didDrawPage: () => { addHeader(); addFooter(); },
//         });
//         y = (doc as any).lastAutoTable.finalY + 8;
//       };

//       renderAffinity('Organization Affinity', sig.org_affinity, colors.darkBlue);
//       renderAffinity('Department Affinity', sig.dept_affinity, colors.warningOrange);
//       renderAffinity('Ministry Affinity', sig.ministry_affinity, [138, 43, 226]);

//       // Quantity & Price ranges (strings in your sample)
//       need(40);
//       doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//       doc.text('Quantity & Price Range Patterns', margin, y); y += 8;

//       const boxW = (pageWidth - 2 * margin - 5) / 2;

//       const qtyStr = nonEmpty(String(sig.quantity_ranges || '')) ? String(sig.quantity_ranges) : '-';
//       const priceStr = nonEmpty(String(sig.price_ranges || '')) ? String(sig.price_ranges) : '-';

//       // Qty box
//       const qtyLines = doc.splitTextToSize(qtyStr, boxW - 6);
//       const qtyH = Math.max(15, 10 + qtyLines.length * 4);
//       doc.setFillColor(240, 253, 244); doc.roundedRect(margin, y, boxW, qtyH, 2, 2, 'F');
//       doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.successGreen);
//       doc.text('Quantity Ranges:', margin + 3, y + 5);
//       doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...colors.darkGray);
//       doc.text(qtyLines, margin + 3, y + 10);

//       // Price box
//       const priceLines = doc.splitTextToSize(priceStr, boxW - 6);
//       const priceH = Math.max(15, 10 + priceLines.length * 4);
//       doc.setFillColor(254, 243, 199); doc.roundedRect(pageWidth / 2 + 2.5, y, boxW, priceH, 2, 2, 'F');
//       doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.warningOrange);
//       doc.text('Price Ranges:', pageWidth / 2 + 5.5, y + 5);
//       doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...colors.darkGray);
//       doc.text(priceLines, pageWidth / 2 + 5.5, y + 10);

//       y += Math.max(qtyH, priceH) + 6;

//       // Guidance
//       newPage();
//       section('Strategic Roadmap & Action Items', colors.successGreen);
//       const guidance = ai.guidance || {};

//       if (nonEmpty(guidance?.note)) {
//         const noteLines = doc.splitTextToSize(safeText(guidance.note), pageWidth - 2 * margin - 8);
//         const h = Math.max(30, 10 + noteLines.length * 4);
//         doc.setFillColor(254, 243, 199); doc.roundedRect(margin, y, pageWidth - 2 * margin, h, 3, 3, 'F');
//         doc.setDrawColor(...colors.warningOrange); doc.setLineWidth(0.5);
//         doc.roundedRect(margin, y, pageWidth - 2 * margin, h, 3, 3, 'S');

//         doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.warningOrange);
//         doc.text('Guidance Note', margin + 4, y + 6);
//         doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray);
//         doc.text(noteLines, margin + 4, y + 12);
//         y += h + 8;
//       }

//       const steps = arr<string>(guidance.next_steps);
//       if (steps.length) {
//         doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//         doc.text('Next Steps - Action Plan', margin, y); y += 8;

//         steps.forEach((s, i) => {
//           need(20);
//           doc.setFillColor(240, 253, 244); doc.roundedRect(margin, y, pageWidth - 2 * margin, 20, 2, 2, 'F');
//           doc.setDrawColor(...colors.successGreen); doc.setLineWidth(0.3);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, 20, 2, 2, 'S');

//           doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.successGreen);
//           doc.text(`${i + 1}.`, margin + 3, y + 6);

//           doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray);
//           const lines = doc.splitTextToSize(safeText(s), pageWidth - 2 * margin - 12);
//           doc.text(lines, margin + 8, y + 6);

//           y += 23;
//         });
//       }

//       const expand = arr<string>(guidance.expansion_areas);
//       if (expand.length) {
//         need(15); y += 5;
//         doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//         doc.text('Expansion Opportunities', margin, y); y += 8;

//         expand.forEach((s) => {
//           need(15);
//           doc.setFillColor(239, 246, 255);
//           doc.roundedRect(margin, y, pageWidth - 2 * margin, 15, 2, 2, 'F');
//           doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray);
//           const lines = doc.splitTextToSize('- ' + safeText(s), pageWidth - 2 * margin - 8);
//           doc.text(lines, margin + 4, y + 5);
//           y += 18;
//         });
//       }
//     }
//   }

//   /* ============================ PRICE BAND ============================ */
//   if (include('marketOverview')) {
//     newPage();
//     section('Price Band Analysis', colors.successGreen);

//     const pb = reportData?.data?.priceBand?.analysis;
//     if (pb && (isNum(pb.highest) || isNum(pb.lowest) || isNum(pb.average))) {
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Price Category', 'Amount']],
//         body: [
//           ['Highest Price', formatCurrency(pb.highest)],
//           ['Average Price', formatCurrency(pb.average)],
//           ['Lowest Price', formatCurrency(pb.lowest)],
//         ],
//         theme: 'grid',
//         headStyles: { ...tableDefaults.headStyles, fillColor: [72, 187, 120], textColor: 255, fontSize: 9, halign: 'left' },
//         bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 8, cellPadding: 4 },
//         columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold' }, 1: { cellWidth: 'auto', halign: 'right' } },
//         margin: { left: margin },
//       });
//       y = (doc as any).lastAutoTable.finalY + 12;

//       // Insight box (handles zeros correctly)
//       const highest = toNumber(pb.highest);
//       const lowest = toNumber(pb.lowest);
//       const average = toNumber(pb.average);

//       const insight = (() => {
//         if (highest != null && lowest != null && average != null && average !== 0) {
//           const priceRange = highest - lowest;
//           const priceVariation = ((priceRange / average) * 100).toFixed(1);
//           return `Price range spans ${formatCurrency(priceRange)} with ${priceVariation}% variation from average. `
//             + `Target competitive pricing around ${formatCurrency(Math.round((lowest ?? 0) * 1.05))} to `
//             + `${formatCurrency(Math.round((average ?? 0) * 0.95))} for optimal positioning.`;
//         }
//         return 'Insufficient price data to compute meaningful insights.';
//       })();

//       const insightLines = doc.splitTextToSize(insight, pageWidth - 2 * margin - 8);
//       const h = Math.max(25, 10 + insightLines.length * 4);
//       doc.setFillColor(239, 246, 255);
//       doc.roundedRect(margin, y, pageWidth - 2 * margin, h, 3, 3, 'F');
//       doc.setDrawColor(...colors.electricBlue); doc.setLineWidth(0.5);
//       doc.roundedRect(margin, y, pageWidth - 2 * margin, h, 3, 3, 'S');

//       doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.electricBlue);
//       doc.text('Price Insights:', margin + 4, y + 6);
//       doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray);
//       doc.text(insightLines, margin + 4, y + 12);
//       y += h + 5;
//     }
//   }

//   /* ======================== CATEGORY DISTRIBUTION ===================== */
//   if (include('categoryAnalysis')) {
//     newPage();
//     section('Category-wise Tender Distribution', colors.darkBlue);

//     const cats = arr(reportData?.data?.categoryListing?.categories);
//     if (cats.length) {
//       const maxTimes = Math.max(...cats.map(c => c?.times || 0));
//       const chartOffset = 32;
//       const rightPad = 6;
//       const barArea = pageWidth - 2 * margin - chartOffset - rightPad;

//       doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//       doc.text('Tender Categories by Volume', margin, y); y += 10;

//       cats.forEach((c) => {
//         const barX = margin + chartOffset;
//         const val = c?.times ?? 0;
//         const w = maxTimes > 0 ? Math.max(0, Math.min(barArea, (val / maxTimes) * barArea)) : 0;

//         doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray);
//         doc.text(short(c?.category, 25), margin, y);
//         doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...colors.darkBlue);
//         const valueText = val.toLocaleString(); const valueWidth = doc.getTextWidth(valueText);
//         doc.text(valueText, barX - valueWidth - 2, y);

//         doc.setFillColor(...colors.lightGray);
//         doc.roundedRect(barX, y - 5, barArea, 8, 1, 1, 'F');
//         doc.setFillColor(...colors.darkBlue);
//         doc.roundedRect(barX, y - 5, w, 8, 1, 1, 'F');
//         y += 12;
//       });
//       y += 8;
//     }
//   }

//   /* =================== TOP SELLERS BY DEPARTMENT ====================== */
//   if (include('rivalryScore')) {
//     newPage();
//     section('Leading Competitors - Top Departments', colors.warningOrange);

//     const ts = reportData?.data?.topSellersByDept;
//     const depts = arr<TopSellersDepartment>(ts?.departments);
//     if (depts.length) {
//       depts.forEach((dept) => {
//         need(16);
//         const title = `Department: ${safeText(dept?.department)} (Total: ${(dept?.total ?? 0).toLocaleString()})`;
//         doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//         doc.text(title, margin, y); y += 8;

//         const top = arr<TopSellersDeptItem>(dept?.results).slice(0, 10);
//         const body = top.map((s, idx) => {
//           const rank = s.rank ?? idx + 1;
//           const suffix = rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th';
//           return [`${rank}${suffix}`, short(s.seller_name, 60), (s.participation_count ?? 0).toLocaleString()];
//         });

//         autoTable(doc, {
//           ...tableDefaults,
//           startY: y,
//           head: [['Rank', 'Seller Name', 'Participation Count']],
//           body,
//           headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 9 },
//           columnStyles: {
//             0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
//             1: { cellWidth: 120 },
//             2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
//           },
//           margin: { left: margin, right: margin, top: SAFE_TOP },
//           didDrawPage: () => { addHeader(); addFooter(); },
//         });
//         y = (doc as any).lastAutoTable.finalY + 10;
//       });
//     } else {
//       doc.setFontSize(8); doc.setTextColor(...colors.mediumGray);
//       doc.text('No department rivalry data available.', margin, y); y += 8;
//     }
//   }

//   /* ===================== TOP PERFORMING STATES ======================== */
//   if (include('statesAnalysis')) {
//     newPage();
//     section('Top Performing States by Tender Volume', colors.successGreen);

//     const states = arr(reportData?.data?.topPerformingStates?.data?.results);
//     if (states.length) {
//       const max = Math.max(...states.map(s => s?.total_tenders || 0));

//       doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//       doc.text(`State-wise Tender Distribution (Top ${states.length})`, margin, y); y += 10;

//       states.forEach((s, i) => {
//         need(9);
//         const area = pageWidth - 2 * margin - 65;
//         const w = max > 0 ? (Number(s.total_tenders || 0) / max) * area : 0;
//         let fill: [number, number, number] = colors.successGreen;
//         if (i < 5) fill = colors.darkBlue;

//         doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray);
//         doc.text(short(s.state_name, 25), margin, y);

//         doc.setFont('helvetica', 'bold'); doc.setTextColor(...fill);
//         const valText = (s.total_tenders ?? 0).toLocaleString(); const wText = doc.getTextWidth(valText);
//         doc.text(valText, margin + 60 - wText - 2, y);

//         doc.setFillColor(...colors.lightGray);
//         doc.roundedRect(margin + 60, y - 4, area, 6, 1, 1, 'F');
//         doc.setFillColor(...fill);
//         doc.roundedRect(margin + 60, y - 4, w, 6, 1, 1, 'F');

//         y += 9;
//       });
//     } else {
//       doc.setFontSize(8); doc.setTextColor(...colors.mediumGray);
//       doc.text('No state performance data available.', margin, y); y += 8;
//     }
//   }

//   /* ====================== LOW COMPETITION BIDS ======================== */
//   if (include('lowCompetition')) {
//     newPage();
//     section('Low Competition Bids - Strategic Opportunities', colors.successGreen);

//     const low = reportData?.data?.lowCompetitionBids;
//     const bids = arr<LowCompetitionBid>(low?.results).slice(0, 25);

//     const cardH = 20;
//     doc.setFillColor(240, 253, 244);
//     doc.roundedRect(margin, y, pageWidth - 2 * margin, cardH, 2, 2, 'F');
//     doc.setDrawColor(...colors.successGreen); doc.setLineWidth(0.5);
//     doc.roundedRect(margin, y, pageWidth - 2 * margin, cardH, 2, 2, 'S');

//     doc.setFontSize(8); doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...colors.mediumGray); doc.text('Total Low Competition Bids:', margin + 5, y + 8);
//     doc.setTextColor(...colors.successGreen); doc.text(String(low?.count ?? 0), margin + 70, y + 8);

//     doc.setTextColor(...colors.mediumGray);
//     doc.text('Generated At:', margin + 5, y + 15);
//     doc.setTextColor(...colors.darkGray);
//     doc.text(formatDate(low?.generated_at), margin + 35, y + 15);

//     y += cardH + 6;

//     doc.setFontSize(7); doc.setFont('helvetica', 'italic'); doc.setTextColor(...colors.mediumGray);
//     doc.text('Note: "-" indicates data not available. Low seller count indicates opportunity.', margin, y); y += 6;

//     if (bids.length) {
//       const rows = bids.map(b => [
//         short(b.bid_number, 23),
//         (b.quantity ?? 0).toLocaleString(),
//         short(b.organisation, 30),
//         short(b.department, 28),
//         short(b.ministry, 25),
//         formatDate(b.bid_end_ts),
//         String(b.seller_count ?? 0),
//       ]);

//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Bid Number', 'Qty', 'Organization', 'Department', 'Ministry', 'Bid End Date', 'Sellers']],
//         body: rows,
//         theme: 'grid',
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 7.5 },
//         bodyStyles: { ...tableDefaults.bodyStyles, lineColor: [209, 213, 219], lineWidth: 0.2 },
//         columnStyles: {
//           0: { cellWidth: 24 },
//           1: { cellWidth: 11, halign: 'right', fontStyle: 'bold' },
//           2: { cellWidth: 33 },
//           3: { cellWidth: 32 },
//           4: { cellWidth: 28 },
//           5: { cellWidth: 20, halign: 'center' },
//           6: { cellWidth: 13, halign: 'center', fontStyle: 'bold', textColor: [231, 76, 60], fillColor: [254, 242, 242] },
//         },
//         margin: { left: margin - 2, right: margin - 2, top: SAFE_TOP },
//         didDrawPage: () => { addHeader(); addFooter(); },
//       });
//       y = (doc as any).lastAutoTable.finalY + 8;
//     } else {
//       doc.setFontSize(8); doc.setTextColor(...colors.mediumGray);
//       doc.text('No low competition bids available.', margin, y); y += 8;
//     }
//   }

//   /* =================== SELLER BIDS PERFORMANCE ======================== */
//   if (include('bidsSummary')) {
//     const sb = reportData?.data?.sellerBids;
//     if (sb) {
//       newPage();
//       section(`${safeText(reportData?.meta?.params_used?.sellerName || sb.query)} - Bidding Performance Deep Dive`, colors.electricBlue);

//       // KPI Cards
//       if (sb.table1) {
//         const t1 = sb.table1;
//         const cardW = (pageWidth - 2 * margin - 15) / 3;
//         const cardH = 25;
//         let x = margin;

//         const cards1 = [
//           { label: 'Total Wins', value: (t1.win ?? 0).toLocaleString(), color: colors.successGreen, bg: [240, 253, 244] as [number, number, number] },
//           { label: 'Total Lost', value: (t1.lost ?? 0).toLocaleString(), color: colors.errorRed, bg: [254, 226, 226] as [number, number, number] },
//           {
//             label: 'Win Rate',
//             value: (t1.win ?? 0) + (t1.lost ?? 0) > 0 ? `${(((t1.win ?? 0) / ((t1.win ?? 0) + (t1.lost ?? 0))) * 100).toFixed(1)}%` : '-',
//             color: colors.darkBlue,
//             bg: [239, 246, 255] as [number, number, number],
//           },
//         ];

//         cards1.forEach(c => {
//           doc.setFillColor(...c.bg); doc.roundedRect(x, y, cardW, cardH, 2, 2, 'F');
//           doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(...c.color);
//           doc.text(c.value, x + cardW / 2, y + 13, { align: 'center' });
//           doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.mediumGray);
//           doc.text(c.label, x + cardW / 2, y + 20, { align: 'center' });
//           x += cardW + 5;
//         });

//         y += cardH + 6; x = margin;

//         const cards2 = [
//           { label: 'Total Bid Value', value: formatCurrency(t1.totalBidValue), color: colors.warningOrange, bg: [254, 243, 199] as [number, number, number] },
//           { label: 'Qualified Bid Value', value: formatCurrency(t1.qualifiedBidValue), color: colors.successGreen, bg: [240, 253, 244] as [number, number, number] },
//           { label: 'Avg Order Value', value: formatCurrency(t1.averageOrderValue), color: [138, 43, 226] as [number, number, number], bg: [243, 232, 255] as [number, number, number] },
//         ];

//         cards2.forEach(c => {
//           doc.setFillColor(...c.bg); doc.roundedRect(x, y, cardW, cardH, 2, 2, 'F');
//           doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...c.color);
//           const val = (c.value || '').length > 18 ? c.value.slice(0, 18) : (c.value || '-');
//           doc.text(val, x + cardW / 2, y + 13, { align: 'center' });
//           doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.mediumGray);
//           doc.text(c.label, x + cardW / 2, y + 20, { align: 'center' });
//           x += cardW + 5;
//         });

//         y += cardH + 10;
//       }

//       // Departmental Performance (maps -> rows)
//       const depMap = sb.departmentCount?.departmentCount || {};
//       const revMap = sb.departmentCount?.revenue || {};
//       const depKeys = Object.keys(depMap);
//       if (depKeys.length) {
//         need(18);
//         doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//         doc.text('Revenue by Department', margin, y); y += 8;

//         const rows = depKeys
//           .map(k => ({ department: k, bid_count: depMap[k] ?? 0, revenue: revMap[k] ?? 0 }))
//           .sort((a, b) => (b.revenue - a.revenue))
//           .map(d => [short(d.department, 50), (d.bid_count ?? 0).toLocaleString(), formatCurrency(d.revenue ?? 0)]);

//         // Totals
//         const totRevenue = depKeys.reduce((s, k) => s + (revMap[k] ?? 0), 0);
//         const totBids = depKeys.reduce((s, k) => s + (depMap[k] ?? 0), 0);
//         rows.push(['TOTAL', totBids.toLocaleString(), formatCurrency(totRevenue)]);

//         autoTable(doc, {
//           ...tableDefaults,
//           startY: y,
//           head: [['Department', 'Bid Count', 'Revenue']],
//           body: rows,
//           headStyles: { ...tableDefaults.headStyles, fillColor: colors.darkBlue, textColor: colors.white, fontSize: 8 },
//           columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 30, halign: 'right' }, 2: { cellWidth: 40, halign: 'right', fontStyle: 'bold' } },
//           margin: { left: margin, right: margin, top: SAFE_TOP },
//           didDrawPage: () => { addHeader(); addFooter(); },
//         });
//         y = (doc as any).lastAutoTable.finalY + 10;
//       }

//       // State-wise (maps -> rows)
//       const stateMap = sb.stateCount?.stateCounts || {};
//       const stateRev = sb.stateCount?.stateRevenue || {};
//       const stateKeys = Object.keys(stateMap);
//       if (stateKeys.length) {
//         need(18);
//         doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//         doc.text('Bids by State', margin, y); y += 8;

//         const rows = stateKeys
//           .map(k => ({ state: k, bids: stateMap[k] ?? 0, revenue: stateRev[k] ?? 0 }))
//           .sort((a, b) => b.revenue - a.revenue)
//           .slice(0, 15)
//           .map(s => [short(s.state, 40), (s.bids ?? 0).toLocaleString(), formatCurrency(s.revenue ?? 0)]);

//         autoTable(doc, {
//           ...tableDefaults,
//           startY: y,
//           head: [['State', 'Bid Count', 'Revenue']],
//           body: rows,
//           theme: 'grid',
//           headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 8 },
//           columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 30, halign: 'right' }, 2: { cellWidth: 50, halign: 'right' } },
//           margin: { left: margin, right: margin, top: SAFE_TOP },
//           didDrawPage: () => { addHeader(); addFooter(); },
//         });
//         y = (doc as any).lastAutoTable.finalY + 8;
//       }

//       // Monthly Trends (labels + values -> rows)
//       const mt = sb.monthlyTotals;
//       const labels = arr<string>(mt?.labels);
//       const values = arr<number>(mt?.values);
//       if (labels.length && values.length && labels.length === values.length) {
//         newPage();
//         section('Monthly Bidding Trends', colors.warningOrange);

//         const rows = labels.map((m, idx) => [short(m, 20), formatCurrency(values[idx] ?? 0)]);
//         autoTable(doc, {
//           ...tableDefaults,
//           startY: y,
//           head: [['Month', 'Bid Value']],
//           body: rows,
//           headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 9 },
//           bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 8, cellPadding: 3 },
//           columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' } },
//           margin: { left: margin, right: margin, top: SAFE_TOP },
//           didDrawPage: () => { addHeader(); addFooter(); },
//         });
//         y = (doc as any).lastAutoTable.finalY + 8;
//       }

//       // Detailed Bid History
//       const rows = arr(sb.sortedRows).map(r => [
//         formatDate(r.participated_on),
//         short(r.offered_item, 60),
//         clean(r.seller_status) || '-',
//         short(r.rank, 6),
//         r.total_price != null ? formatCurrency(r.total_price) : '-',
//         short(r.organisation, 32),
//         short(r.department, 30),
//       ]);
//       if (rows.length) {
//         newPage();
//         section('Bid-by-Bid Performance History', colors.electricBlue);

//         doc.setFontSize(7); doc.setFont('helvetica', 'italic'); doc.setTextColor(...colors.mediumGray);
//         doc.text('Note: "-" indicates data not available from source system', margin, y); y += 6;

//         autoTable(doc, {
//           ...tableDefaults,
//           startY: y,
//           head: [['Date', 'Item', 'Status', 'Rank', 'Price', 'Organization', 'Department']],
//           body: rows,
//           theme: 'grid',
//           headStyles: { ...tableDefaults.headStyles, fillColor: colors.electricBlue, textColor: colors.white, fontSize: 7.5, cellPadding: 3 },
//           bodyStyles: { ...tableDefaults.bodyStyles, cellPadding: 2.5, lineColor: [209, 213, 219], lineWidth: 0.2 },
//           columnStyles: {
//             0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
//             1: { cellWidth: 60 },
//             2: { cellWidth: 16, halign: 'center' },
//             3: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
//             4: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
//             5: { cellWidth: 32 },
//             6: { cellWidth: 30 },
//           },
//           margin: { left: margin - 2, right: margin - 2, top: SAFE_TOP },
//           showHead: 'everyPage',
//           willDrawCell: (data: any) => {
//             if (data.section === 'body' && data.column.index === 2) {
//               const st = (data.cell.raw || '').toString().toLowerCase();
//               if (st === 'qualified') data.cell.styles.textColor = colors.successGreen;
//               else if (st.includes('disqualified')) data.cell.styles.textColor = colors.errorRed;
//             }
//             if (data.section === 'body' && data.column.index === 3) {
//               const rk = (data.cell.raw || '').toString().toUpperCase();
//               if (rk === 'L1') { data.cell.styles.fillColor = [240, 253, 244]; data.cell.styles.textColor = colors.successGreen; }
//               else if (rk === 'L2') { data.cell.styles.fillColor = [254, 243, 199]; data.cell.styles.textColor = colors.warningOrange; }
//             }
//           },
//           didDrawPage: (data: any) => { if (data.pageNumber > data.table.startPageNumber) { addHeader(); addFooter(); } },
//         });
//         y = (doc as any).lastAutoTable.finalY + 8;
//       }
//     }
//   }

//   /* ===================== ESTIMATED MISSED VALUE ======================= */
//   if (include('estimatedMissedValue')) {
//     const emv = reportData?.data?.estimatedMissedValue;
//     if (emv) {
//       newPage();
//       section('Estimated Missed Value (EMV)', [128, 128, 128] as any);

//       const cardH = 20;
//       doc.setFillColor(...colors.backgroundGray);
//       doc.roundedRect(margin, y, pageWidth - 2 * margin, cardH, 2, 2, 'F');

//       doc.setFontSize(8); doc.setTextColor(...colors.mediumGray);
//       doc.text('Window:', margin + 5, y + 8); doc.setTextColor(...colors.darkGray);
//       doc.text(`${emv.days ?? '-'} days`, margin + 26, y + 8);

//       doc.setTextColor(...colors.mediumGray);
//       doc.text('Total Estimated Missed:', margin + 5, y + 15); doc.setTextColor(...colors.errorRed);
//       doc.text(formatCurrency(emv.total ?? 0), margin + 55, y + 15);

//       y += cardH + 8;

//       const results = arr(emv.results);
//       if (!results.length) {
//         doc.setFontSize(8); doc.setTextColor(...colors.mediumGray);
//         doc.text('No missed-but-valuable tenders detected in this window.', margin, y); y += 8;
//       }
//     }
//   }

//   /* =========================== ALL DEPARTMENTS ======================== */
//   if (include('departmentsAnalysis')) {
//     newPage();
//     section('All Departments - Tender Volume Overview', colors.darkBlue);

//     const ad = reportData?.data?.allDepartments;
//     if (ad && ad.error) {
//       doc.setFontSize(8); doc.setTextColor(...colors.errorRed);
//       doc.text(`Unavailable: ${safeText(ad.reason)}`, margin, y); y += 8;
//     } else if (ad?.results && ad.results.length) {
//       // If you later provide results here, render similarly to states with bars
//       const list = arr<{ department?: string; total_tenders?: number | string }>(ad.results);
//       if (list.length) {
//         const nums = list.map(d => Number(typeof d.total_tenders === 'string' ? parseInt(d.total_tenders) : d.total_tenders || 0));
//         const max = Math.max(...nums);
//         doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray);
//         doc.text('Department-wise Tender Distribution', margin, y); y += 10;

//         list.slice(0, 20).forEach((d, i) => {
//           need(10);
//           const cnt = Number(typeof d.total_tenders === 'string' ? parseInt(d.total_tenders) : d.total_tenders || 0);
//           const area = pageWidth - 2 * margin - 75;
//           const w = max > 0 ? (cnt / max) * area : 0;

//           doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray);
//           doc.text(short(d?.department, 32), margin, y);
//           doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkBlue);
//           const t = cnt.toLocaleString(); const tw = doc.getTextWidth(t);
//           doc.text(t, margin + 70 - tw - 2, y);

//           doc.setFillColor(...colors.lightGray);
//           doc.roundedRect(margin + 70, y - 4, area, 6, 1, 1, 'F');
//           doc.setFillColor(...colors.darkBlue);
//           doc.roundedRect(margin + 70, y - 4, w, 6, 1, 1, 'F');

//           y += 9;
//         });
//       } else {
//         doc.setFontSize(8); doc.setTextColor(...colors.mediumGray);
//         doc.text('No department list found.', margin, y); y += 8;
//       }
//     } else {
//       doc.setFontSize(8); doc.setTextColor(...colors.mediumGray);
//       doc.text('Department data not provided by source.', margin, y); y += 8;
//     }
//   }

//   // Always draw header/footer on the first normal page too
//   doc.setPage(1);
//   addHeader();
//   addFooter();
//   const totalPages = (doc as any).internal?.getNumberOfPages?.() ?? 1;
//   for (let i = 2; i <= totalPages; i++) {
//     doc.setPage(i);
//     addHeader();
//     addFooter();
//   }

//   return doc;
// };


// Part 1/3 — Setup + Helpers + Cover Page (paste as-is)



  
// import jsPDF from 'jspdf';
// import autoTable, { RowInput } from 'jspdf-autotable';

// /** ============ TYPES (Loosely typed to survive API shape changes) ============ **/
// type AnyObj = Record<string, any>;

// interface ReportData {
//   meta?: AnyObj;
//   data?: AnyObj;
// }

// /** ========================= COLOR PALETTE ========================= **/
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
// };

// /** ========================= SAFE HELPERS ========================= **/
// const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);
// const toNumber = (v: any): number | null => {
//   if (v == null || v === '') return null;
//   const n = Number(v);
//   return isFinite(n) ? n : null;
// };
// const asArray = <T = any>(v: any): T[] => {
//   if (Array.isArray(v)) return v as T[];
//   if (v == null) return [];
//   if (isObj(v)) return Object.values(v) as T[];
//   return [];
// };
// const clean = (value: any): string => {
//   if (value === null || value === undefined) return '-';
//   if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(', ') || '-';
//   if (isObj(value)) { try { return JSON.stringify(value); } catch { return '-'; } }
//   const s = String(value)
//     .replace(/[₹]/g, 'Rs ')
//     .replace(/[\u2018\u2019]/g, "'")
//     .replace(/[\u201C\u201D]/g, '"')
//     .replace(/\u00A0/g, ' ')
//     .replace(/[\u2013\u2014]/g, '-')
//     .replace(/[\u2022\u2023\u2043]/g, '*')
//     .replace(/\s+/g, ' ')
//     .trim();
//   return s || '-';
// };
// const short = (v: any, len = 60) => {
//   const s = clean(v);
//   return s.length > len ? s.slice(0, len - 1) + '…' : s;
// };
// const formatCurrency = (amount: any): string => {
//   const n = toNumber(amount);
//   if (n == null) return '-';
//   try { return `Rs ${n.toLocaleString('en-IN')}`; } catch { return `Rs ${n}`; }
// };
// const formatDate = (d: any): string => {
//   if (!d) return '-';
//   const dt = new Date(d);
//   if (isNaN(dt.getTime())) return clean(d);
//   try {
//     return dt
//       .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//       .replace(/ /g, '-');
//   } catch { return dt.toISOString().slice(0, 10); }
// };
// const safeGet = (obj: AnyObj, path: string[], fallback?: any) => {
//   try { return path.reduce((o, k) => (o && k in o ? o[k] : undefined), obj) ?? fallback; }
//   catch { return fallback; }
// };

// /** ========================= AUTOTABLE HELPERS ========================= **/
// const tableDefaults = {
//   theme: 'striped' as const,
//   headStyles: { halign: 'center' as const, fontStyle: 'bold' as const, fontSize: 8 },
//   bodyStyles: {
//     fontSize: 7,
//     cellPadding: 2,
//     minCellHeight: 8,
//     overflow: 'linebreak' as const,
//     valign: 'middle' as const,
//   },
// };

// function autoFitWidths(doc: jsPDF, margin: number, widths: number[]) {
//   const printable = doc.internal.pageSize.getWidth() - margin * 2;
//   const sum = widths.reduce((a, b) => a + b, 0);
//   if (sum <= printable) return widths;
//   const scale = printable / sum;
//   return widths.map(w => Math.max(8, Math.floor(w * scale)));
// }
// function leftShiftedTableMargin(margin: number, safeTop: number) {
//   return { left: Math.max(8, margin - 6), right: margin + 6, top: safeTop };
// }

// /** ========================= MAIN ========================= **/
// export const generatePDF = async (reportData: ReportData) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   const margin = 14;
//   const HEADER_H = 18;
//   const FOOTER_H = 12;
//   const SAFE_TOP = HEADER_H + 6;
//   const SAFE_BOTTOM = pageHeight - FOOTER_H - 8;

//   let y = SAFE_TOP;

//   /** ---------- Header / Footer ---------- **/
//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, HEADER_H, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text('GOVERNMENT TENDER ANALYSIS', pageWidth / 2, 11, { align: 'center' });
//   };
//   const addFooter = () => {
//     const pageNum =
//       (doc as any).getCurrentPageInfo?.().pageNumber ??
//       (doc as any).internal?.getNumberOfPages?.();
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - FOOTER_H, pageWidth, FOOTER_H, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
//     const seller = safeGet(reportData, ['meta', 'params_used', 'sellerName'], '-');
//     doc.text(clean(seller), margin, pageHeight - 6);
//     doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
//     const genAt = safeGet(reportData, ['meta', 'report_generated_at']);
//     doc.text(formatDate(genAt), pageWidth - margin, pageHeight - 6, { align: 'right' });
//   };
//   const addPage = () => { doc.addPage(); y = SAFE_TOP; addHeader(); addFooter(); };
//   const needSpace = (h: number) => { if (y + h > SAFE_BOTTOM) { addPage(); return true; } return false; };
//   const section = (title: string, color: [number, number, number]) => {
//     needSpace(16);
//     doc.setFillColor(...color);
//     doc.rect(margin, y, pageWidth - margin * 2, 10, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
//     doc.text(title, margin + 4, y + 7);
//     y += 14;
//   };

//   /** ---------- Cover ---------- **/
//   doc.setFillColor(...colors.navyBlue); doc.rect(0, 0, pageWidth, pageHeight, 'F');
//   doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.white); doc.setFontSize(24);
//   doc.text('GOVERNMENT', pageWidth / 2, 58, { align: 'center' });
//   doc.text('TENDER ANALYSIS', pageWidth / 2, 72, { align: 'center' });
//   doc.setFillColor(25, 50, 85);
//   doc.roundedRect(margin + 10, 90, pageWidth - (margin + 10) * 2, 14, 3, 3, 'F');
//   doc.setTextColor(...colors.electricBlue); doc.setFont('helvetica', 'normal'); doc.setFontSize(12);
//   doc.text('Comprehensive Performance Report', pageWidth / 2, 100, { align: 'center' });

//   const sellerName = clean(safeGet(reportData, ['meta', 'params_used', 'sellerName'], '—'));
//   doc.setTextColor(...colors.white); doc.setFontSize(18);
//   doc.text(sellerName, pageWidth / 2, 125, { align: 'center' });

//   doc.setFontSize(10);
//   const genAt = formatDate(safeGet(reportData, ['meta', 'report_generated_at']));
//   const days = clean(safeGet(reportData, ['meta', 'params_used', 'days'], '-'));
//   const dept = clean(safeGet(reportData, ['meta', 'params_used', 'department'], '-')) || '-';
//   doc.text(`Report Generated: ${genAt}`, pageWidth / 2, 150, { align: 'center' });
//   doc.text(`Analysis Period: ${days} days`, pageWidth / 2, 158, { align: 'center' });
//   doc.text(`Department: ${dept || '-'}`, pageWidth / 2, 166, { align: 'center' });

//   addPage();
//   /** ===================================================================
//    *                       MISSED BUT WINNABLE
//    *  =================================================================== */
//   const mbw = safeGet(reportData, ['data', 'missedButWinnable'], {}) || {};
//   const recentWins = asArray<any>(mbw.recentWins);
//   const marketWins = asArray<any>(mbw.marketWins);

//   section('Missed But Winnable - Market Intelligence', colors.darkBlue);
//   if (recentWins.length) {
//     doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text(`Recent Wins — ${sellerName}`, margin, y); y += 8;

//     const rows: RowInput[] = recentWins.map((w) => ([
//       short(w.bid_number, 26),
//       short(w.offered_item, 60),
//       String(w.quantity ?? 0),
//       formatCurrency(w.total_price),
//       short(w.org, 30),
//       short(w.dept, 35),
//       formatDate(w.ended_at),
//     ]));

//     const widths = autoFitWidths(doc, margin, [24, 62, 12, 24, 32, 36, 20]);
//     autoTable(doc, {
//       ...tableDefaults,
//       startY: y,
//       head: [['Bid Number', 'Item', 'Qty', 'Price', 'Organization', 'Department', 'End Date']],
//       body: rows,
//       margin: leftShiftedTableMargin(margin, SAFE_TOP),
//       headStyles: { ...tableDefaults.headStyles, fillColor: colors.darkBlue, textColor: colors.white, fontSize: 8 },
//       columnStyles: {
//         0: { cellWidth: widths[0] },
//         1: { cellWidth: widths[1] },
//         2: { cellWidth: widths[2], halign: 'right' },
//         3: { cellWidth: widths[3], halign: 'right' },
//         4: { cellWidth: widths[4] },
//         5: { cellWidth: widths[5] },
//         6: { cellWidth: widths[6], halign: 'center' },
//       },
//       didDrawPage: () => { addHeader(); addFooter(); },
//     });
//     y = (doc as any).lastAutoTable.finalY + 10;
//   }

//   if (marketWins.length) {
//     needSpace(14);
//     doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text('Competitor Market Wins', margin, y); y += 8;

//     const rows: RowInput[] = marketWins.map((w) => ([
//       short(w.bid_number, 22),
//       short(w.seller_name, 24),
//       short(w.offered_item, 46),
//       String(w.quantity ?? 0),
//       formatCurrency(w.total_price),
//       short(w.org, 30),
//       short(w.dept, 30),
//       formatDate(w.ended_at),
//     ]));

//     const widths = autoFitWidths(doc, margin, [23, 26, 46, 10, 22, 30, 30, 18]);
//     autoTable(doc, {
//       ...tableDefaults,
//       startY: y,
//       head: [['Bid', 'Seller', 'Item', 'Qty', 'Price', 'Org', 'Dept', 'End']],
//       body: rows,
//       margin: leftShiftedTableMargin(margin, SAFE_TOP),
//       headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 8 },
//       bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 6.8 },
//       columnStyles: {
//         0: { cellWidth: widths[0] },
//         1: { cellWidth: widths[1] },
//         2: { cellWidth: widths[2] },
//         3: { cellWidth: widths[3], halign: 'right' },
//         4: { cellWidth: widths[4], halign: 'right' },
//         5: { cellWidth: widths[5] },
//         6: { cellWidth: widths[6] },
//         7: { cellWidth: widths[7], halign: 'center' },
//       },
//       didDrawPage: () => { addHeader(); addFooter(); },
//     });
//     y = (doc as any).lastAutoTable.finalY + 10;
//   }

//   /** ===================================================================
//    *                             AI INSIGHTS
//    *  =================================================================== */
//   const ai =
//     safeGet(reportData, ['data', 'ai']) ||
//     safeGet(reportData, ['ai']) ||
//     {};

//   if (Object.keys(ai).length) {
//     addPage();
//     section('AI Strategy Summary', colors.electricBlue);

//     // Strategy Summary Card
//     const summary = clean(ai.strategy_summary);
//     if (summary !== '-') {
//       const h = 36;
//       doc.setFillColor(241, 245, 249);
//       doc.roundedRect(margin, y, pageWidth - margin * 2, h, 3, 3, 'F');
//       doc.setDrawColor(...colors.electricBlue);
//       doc.roundedRect(margin, y, pageWidth - margin * 2, h, 3, 3, 'S');
//       doc.setTextColor(...colors.darkGray);
//       doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
//       const lines = doc.splitTextToSize(summary, pageWidth - margin * 2 - 8);
//       doc.text(lines, margin + 4, y + 7);
//       y += h + 8;
//     }

//     /** -------- Likely Wins (cards + table) -------- */
//     const likelyWins = asArray<any>(ai.likely_wins)
//       .filter((w) => clean(w.item ?? w.offered_item ?? '-') !== '-' || asArray(w.matching_market_wins).length);

//     if (likelyWins.length) {
//       doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...colors.darkGray);
//       doc.text('Likely Wins - High Probability Opportunities', margin, y);
//       y += 6;

//       likelyWins.forEach((win: any, idx: number) => {
//         needSpace(64);
//         const boxH = 44;

//         // Card
//         doc.setFillColor(240, 253, 244);
//         doc.setDrawColor(...colors.successGreen);
//         doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, 'F');
//         doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, 'S');

//         // Title
//         doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...colors.successGreen);
//         doc.text(`Opportunity ${idx + 1}:`, margin + 4, y + 6);

//         // Item (no truncation for long labels)
//         doc.setTextColor(...colors.darkGray);
//         const itemText = clean(win.item ?? win.offered_item ?? '-');
//         const itemLines = doc.splitTextToSize(itemText, pageWidth - margin * 2 - 38);
//         doc.text(itemLines, margin + 30, y + 6);

//         // Reason
//         doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...colors.darkGray);
//         doc.text('Win Probability Reason:', margin + 4, y + 14);
//         doc.setFont('helvetica', 'normal');
//         const reason = clean(win.reason ?? '-');
//         const rLines = doc.splitTextToSize(reason, pageWidth - margin * 2 - 8);
//         doc.text(rLines, margin + 4, y + 19);

//         y += boxH + 6;

//         // Table under card
//         const mmw = asArray<any>(win.matching_market_wins);
//         if (mmw.length) {
//           if (y + 46 > SAFE_BOTTOM) addPage();

//           const conf = String(win.confidence ?? '').toUpperCase() || '-';
//           const body: RowInput[] = mmw.map((m) => ([
//             short(m.bid_number, 30),
//             clean(m.org ?? m.organisation ?? '-'),
//             clean(m.dept ?? m.department ?? '-'),
//             clean(m.quantity ?? '-'),
//             formatCurrency(m.total_price ?? '-'),
//             conf,
//           ]));

//           const widths = autoFitWidths(doc, margin, [44, 64, 64, 18, 28, 20]);
//           autoTable(doc, {
//             ...tableDefaults,
//             startY: y,
//             head: [['Bid Number', 'Organization', 'Department', 'Qty', 'Price', 'Confidence']],
//             body: body,
//             theme: 'grid',
//             margin: leftShiftedTableMargin(margin, SAFE_TOP),
//             headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 8 },
//             bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7, cellPadding: 2 },
//             columnStyles: {
//               0: { cellWidth: widths[0] },
//               1: { cellWidth: widths[1] },
//               2: { cellWidth: widths[2] },
//               3: { cellWidth: widths[3], halign: 'right' },
//               4: { cellWidth: widths[4], halign: 'right' },
//               5: { cellWidth: widths[5], fontStyle: 'bold', halign: 'center' },
//             },
//             didDrawPage: () => { addHeader(); addFooter(); },
//           });
//           y = (doc as any).lastAutoTable.finalY + 10;
//         }
//       });
//     }

//     /** ----------------- Strategic Affinity Signals (values on LEFT) ----------------- */
//     addPage();
//     section('Strategic Affinity Signals', colors.darkBlue);

//     const signals = ai.signals ?? {};
//     const orgAff = asArray<any>(signals.org_affinity);
//     const deptAff = asArray<any>(signals.dept_affinity);
//     const minAff = asArray<any>(signals.ministry_affinity);

//     const drawBars = (items: any[], labelKey: string, valueKey: string, maxBars = 6) => {
//       const data = items
//         .map((x) => ({
//           label: clean(x[labelKey] ?? '-'),
//           val: Number(x[valueKey] ?? x.count ?? 0),
//         }))
//         .filter(d => d.val >= 0)
//         .sort((a, b) => b.val - a.val)
//         .slice(0, maxBars);

//       if (!data.length) { doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(...colors.mediumGray); doc.text('No data available', margin, y); y += 8; return; }

//       const maxVal = Math.max(...data.map(d => d.val), 1);
//       const labelColW = 110;
//       const valColW = 18;
//       const barX = margin + labelColW + valColW + 6;
//       const barW = pageWidth - barX - margin;

//       data.forEach((d) => {
//         needSpace(12);
//         doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...colors.darkGray);
//         const lbl = doc.splitTextToSize(d.label, labelColW - 2);
//         doc.text(Array.isArray(lbl) ? lbl[0] : lbl, margin, y);

//         doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...colors.darkBlue);
//         doc.text(String(d.val), margin + labelColW + valColW, y, { align: 'right' });

//         doc.setFillColor(...colors.lightGray);
//         doc.roundedRect(barX, y - 4.5, barW, 7, 1.5, 1.5, 'F');

//         const w = Math.max(0, (d.val / maxVal) * barW);
//         doc.setFillColor(...colors.darkBlue);
//         doc.roundedRect(barX, y - 4.5, w, 7, 1.5, 1.5, 'F');

//         y += 9;
//       });
//       y += 4;
//     };

//     doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
//     doc.text('Organization Affinity', margin, y); y += 8;
//     drawBars(orgAff, 'org_name', 'count');

//     doc.text('Department Affinity', margin, y); y += 8;
//     drawBars(deptAff, 'dept_name', 'count');

//     doc.text('Ministry Affinity', margin, y); y += 8;
//     drawBars(minAff, 'ministry_name', 'count');

//     // Quantity & Price ranges (string fallback)
//     needSpace(20);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...colors.darkGray);
//     doc.text('Quantity & Price Range Patterns', margin, y); y += 7;
//     doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
//     const qtyRange = clean(signals.quantity_range ?? '-');
//     const priceRange = clean(signals.price_range ?? '-');
//     doc.text(`Quantity Range: ${qtyRange}`, margin, y); y += 6;
//     doc.text(`Price Range: ${priceRange}`, margin, y); y += 4;

//     /** ----------------- Guidance ----------------- */
//     addPage();
//     section('Strategic Roadmap & Action Items', colors.successGreen);
//     const nextSteps = asArray<string>(safeGet(ai, ['guidance', 'next_steps']));
//     const expAreas = asArray<string>(safeGet(ai, ['guidance', 'expansion_areas']));

//     if (nextSteps.length) {
//       doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//       doc.text('Next Steps - Action Plan', margin, y); y += 6;
//       nextSteps.forEach((s, i) => {
//         needSpace(16);
//         doc.setFillColor(240, 253, 244);
//         doc.setDrawColor(...colors.successGreen);
//         doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'F');
//         doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'S');
//         doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.successGreen); doc.setFontSize(9);
//         doc.text(`${i + 1}.`, margin + 4, y + 6);
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray); doc.setFontSize(8);
//         const lines = doc.splitTextToSize(clean(s), pageWidth - margin * 2 - 14);
//         doc.text(lines, margin + 12, y + 6);
//         y += 18;
//       });
//     }

//     if (expAreas.length) {
//       needSpace(10);
//       doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//       doc.text('Expansion Opportunities', margin, y); y += 6;
//       expAreas.forEach((s) => {
//         needSpace(14);
//         doc.setFillColor(239, 246, 255);
//         doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 2, 2, 'F');
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray); doc.setFontSize(8);
//         const lines = doc.splitTextToSize('- ' + clean(s), pageWidth - margin * 2 - 8);
//         doc.text(lines, margin + 4, y + 5);
//         y += 16;
//       });
//     }
//   }
// // FULL CODE — no omissions, no splits — paste this entire file into your project

// import jsPDF from 'jspdf';
// import autoTable, { RowInput } from 'jspdf-autotable';

// /** ============ TYPES (Loosely typed to survive API shape changes) ============ **/
// type AnyObj = Record<string, any>;

// interface ReportData {
//   meta?: AnyObj;
//   data?: AnyObj;
// }

// /** ========================= COLOR PALETTE ========================= **/
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
// };

// /** ========================= SAFE HELPERS ========================= **/
// const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);
// const toNumber = (v: any): number | null => {
//   if (v == null || v === '') return null;
//   const n = Number(v);
//   return isFinite(n) ? n : null;
// };
// const asArray = <T = any>(v: any): T[] => {
//   if (Array.isArray(v)) return v as T[];
//   if (v == null) return [];
//   if (isObj(v)) return Object.values(v) as T[];
//   return [];
// };
// const clean = (value: any): string => {
//   if (value === null || value === undefined) return '-';
//   if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(', ') || '-';
//   if (isObj(value)) { try { return JSON.stringify(value); } catch { return '-'; } }
//   const s = String(value)
//     .replace(/[₹]/g, 'Rs ')
//     .replace(/[\u2018\u2019]/g, "'")
//     .replace(/[\u201C\u201D]/g, '"')
//     .replace(/\u00A0/g, ' ')
//     .replace(/[\u2013\u2014]/g, '-')
//     .replace(/[\u2022\u2023\u2043]/g, '*')
//     .replace(/\s+/g, ' ')
//     .trim();
//   return s || '-';
// };
// const short = (v: any, len = 60) => {
//   const s = clean(v);
//   return s.length > len ? s.slice(0, len - 1) + '…' : s;
// };
// const formatCurrency = (amount: any): string => {
//   const n = toNumber(amount);
//   if (n == null) return '-';
//   try { return `Rs ${n.toLocaleString('en-IN')}`; } catch { return `Rs ${n}`; }
// };
// const formatDate = (d: any): string => {
//   if (!d) return '-';
//   const dt = new Date(d);
//   if (isNaN(dt.getTime())) return clean(d);
//   try {
//     return dt
//       .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//       .replace(/ /g, '-');
//   } catch { return dt.toISOString().slice(0, 10); }
// };
// const safeGet = (obj: AnyObj, path: string[], fallback?: any) => {
//   try { return path.reduce((o, k) => (o && k in o ? o[k] : undefined), obj) ?? fallback; }
//   catch { return fallback; }
// };

// /** ========================= AUTOTABLE HELPERS ========================= **/
// const tableDefaults = {
//   theme: 'striped' as const,
//   headStyles: { halign: 'center' as const, fontStyle: 'bold' as const, fontSize: 8 },
//   bodyStyles: {
//     fontSize: 7,
//     cellPadding: 2,
//     minCellHeight: 8,
//     overflow: 'linebreak' as const,
//     valign: 'middle' as const,
//   },
// };

// function autoFitWidths(doc: jsPDF, margin: number, widths: number[]) {
//   const printable = doc.internal.pageSize.getWidth() - margin * 2;
//   const sum = widths.reduce((a, b) => a + b, 0);
//   if (sum <= printable) return widths;
//   const scale = printable / sum;
//   return widths.map(w => Math.max(8, Math.floor(w * scale)));
// }
// function leftShiftedTableMargin(margin: number, safeTop: number) {
//   return { left: Math.max(8, margin - 6), right: margin + 6, top: safeTop };
// }

// /** ========================= MAIN ========================= **/
// export const generatePDF = async (reportData: ReportData) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   const margin = 14;
//   const HEADER_H = 18;
//   const FOOTER_H = 12;
//   const SAFE_TOP = HEADER_H + 6;
//   const SAFE_BOTTOM = pageHeight - FOOTER_H - 8;

//   let y = SAFE_TOP;

//   /** ---------- Header / Footer ---------- **/
//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, HEADER_H, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text('GOVERNMENT TENDER ANALYSIS', pageWidth / 2, 11, { align: 'center' });
//   };
//   const addFooter = () => {
//     const pageNum =
//       (doc as any).getCurrentPageInfo?.().pageNumber ??
//       (doc as any).internal?.getNumberOfPages?.();
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - FOOTER_H, pageWidth, FOOTER_H, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
//     const seller = safeGet(reportData, ['meta', 'params_used', 'sellerName'], '-');
//     doc.text(clean(seller), margin, pageHeight - 6);
//     doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
//     const genAt = safeGet(reportData, ['meta', 'report_generated_at']);
//     doc.text(formatDate(genAt), pageWidth - margin, pageHeight - 6, { align: 'right' });
//   };
//   const addPage = () => { doc.addPage(); y = SAFE_TOP; addHeader(); addFooter(); };
//   const needSpace = (h: number) => { if (y + h > SAFE_BOTTOM) { addPage(); return true; } return false; };
//   const section = (title: string, color: [number, number, number]) => {
//     needSpace(16);
//     doc.setFillColor(...color);
//     doc.rect(margin, y, pageWidth - margin * 2, 10, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
//     doc.text(title, margin + 4, y + 7);
//     y += 14;
//   };

//   /** ---------- Cover ---------- **/
//   doc.setFillColor(...colors.navyBlue); doc.rect(0, 0, pageWidth, pageHeight, 'F');
//   doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.white); doc.setFontSize(24);
//   doc.text('GOVERNMENT', pageWidth / 2, 58, { align: 'center' });
//   doc.text('TENDER ANALYSIS', pageWidth / 2, 72, { align: 'center' });
//   doc.setFillColor(25, 50, 85);
//   doc.roundedRect(margin + 10, 90, pageWidth - (margin + 10) * 2, 14, 3, 3, 'F');
//   doc.setTextColor(...colors.electricBlue); doc.setFont('helvetica', 'normal'); doc.setFontSize(12);
//   doc.text('Comprehensive Performance Report', pageWidth / 2, 100, { align: 'center' });

//   const sellerName = clean(safeGet(reportData, ['meta', 'params_used', 'sellerName'], '—'));
//   doc.setTextColor(...colors.white); doc.setFontSize(18);
//   doc.text(sellerName, pageWidth / 2, 125, { align: 'center' });

//   doc.setFontSize(10);
//   const genAt = formatDate(safeGet(reportData, ['meta', 'report_generated_at']));
//   const days = clean(safeGet(reportData, ['meta', 'params_used', 'days'], '-'));
//   const dept = clean(safeGet(reportData, ['meta', 'params_used', 'department'], '-')) || '-';
//   doc.text(`Report Generated: ${genAt}`, pageWidth / 2, 150, { align: 'center' });
//   doc.text(`Analysis Period: ${days} days`, pageWidth / 2, 158, { align: 'center' });
//   doc.text(`Department: ${dept || '-'}`, pageWidth / 2, 166, { align: 'center' });

//   addPage();

//   /** ===================================================================
//    *                       MISSED BUT WINNABLE
//    *  =================================================================== */
//   const mbw = safeGet(reportData, ['data', 'missedButWinnable'], {}) || {};
//   const recentWins = asArray<any>(mbw.recentWins);
//   const marketWins = asArray<any>(mbw.marketWins);

//   section('Missed But Winnable - Market Intelligence', colors.darkBlue);

//   if (recentWins.length) {
//     doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text(`Recent Wins — ${sellerName}`, margin, y); y += 8;

//     const rows: RowInput[] = recentWins.map((w) => ([
//       short(w.bid_number, 26),
//       short(w.offered_item, 60),
//       String(w.quantity ?? 0),
//       formatCurrency(w.total_price),
//       short(w.org, 30),
//       short(w.dept, 35),
//       formatDate(w.ended_at),
//     ]));

//     const widths = autoFitWidths(doc, margin, [24, 62, 12, 24, 32, 36, 20]);
//     autoTable(doc, {
//       ...tableDefaults,
//       startY: y,
//       head: [['Bid Number', 'Item', 'Qty', 'Price', 'Organization', 'Department', 'End Date']],
//       body: rows,
//       margin: leftShiftedTableMargin(margin, SAFE_TOP),
//       headStyles: { ...tableDefaults.headStyles, fillColor: colors.darkBlue, textColor: colors.white, fontSize: 8 },
//       columnStyles: {
//         0: { cellWidth: widths[0] },
//         1: { cellWidth: widths[1] },
//         2: { cellWidth: widths[2], halign: 'right' },
//         3: { cellWidth: widths[3], halign: 'right' },
//         4: { cellWidth: widths[4] },
//         5: { cellWidth: widths[5] },
//         6: { cellWidth: widths[6], halign: 'center' },
//       },
//       didDrawPage: (d: any) => { if (d.pageNumber > d.table.startPageNumber) { addHeader(); addFooter(); } },
//     });
//     y = (doc as any).lastAutoTable.finalY + 10;
//   }

//   if (marketWins.length) {
//     needSpace(14);
//     doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text('Competitor Market Wins', margin, y); y += 8;

//     const rows: RowInput[] = marketWins.map((w) => ([
//       short(w.bid_number, 22),
//       short(w.seller_name, 24),
//       short(w.offered_item, 46),
//       String(w.quantity ?? 0),
//       formatCurrency(w.total_price),
//       short(w.org, 30),
//       short(w.dept, 30),
//       formatDate(w.ended_at),
//     ]));

//     const widths = autoFitWidths(doc, margin, [23, 26, 46, 10, 22, 30, 30, 18]);
//     autoTable(doc, {
//       ...tableDefaults,
//       startY: y,
//       head: [['Bid', 'Seller', 'Item', 'Qty', 'Price', 'Org', 'Dept', 'End']],
//       body: rows,
//       margin: leftShiftedTableMargin(margin, SAFE_TOP),
//       headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 8 },
//       bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 6.8 },
//       columnStyles: {
//         0: { cellWidth: widths[0] },
//         1: { cellWidth: widths[1] },
//         2: { cellWidth: widths[2] },
//         3: { cellWidth: widths[3], halign: 'right' },
//         4: { cellWidth: widths[4], halign: 'right' },
//         5: { cellWidth: widths[5] },
//         6: { cellWidth: widths[6] },
//         7: { cellWidth: widths[7], halign: 'center' },
//       },
//       didDrawPage: () => { addHeader(); addFooter(); },
//     });
//     y = (doc as any).lastAutoTable.finalY + 10;
//   }

//   /** ===================================================================
//    *                             AI INSIGHTS
//    *  =================================================================== */
//   const ai =
//     safeGet(reportData, ['data', 'ai']) ||
//     safeGet(reportData, ['data', 'missedButWinnable', 'ai']) ||  // 🔥 FIXED
//     safeGet(reportData, ['ai']) ||
//     {};

//   if (Object.keys(ai).length) {
//     addPage();
//     section('AI Strategy Summary', colors.electricBlue);

//     // Strategy Summary Card
//     const summary = clean(ai.strategy_summary);
//     if (summary !== '-') {
//       const h = 36;
//       doc.setFillColor(241, 245, 249);
//       doc.roundedRect(margin, y, pageWidth - margin * 2, h, 3, 3, 'F');
//       doc.setDrawColor(...colors.electricBlue);
//       doc.roundedRect(margin, y, pageWidth - margin * 2, h, 3, 3, 'S');
//       doc.setTextColor(...colors.darkGray);
//       doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
//       const lines = doc.splitTextToSize(summary, pageWidth - margin * 2 - 8);
//       doc.text(lines, margin + 4, y + 7);
//       y += h + 8;
//     }

//     /** -------- Likely Wins (cards + table) -------- */
//     const likelyWins = asArray<any>(ai.likely_wins)
//       .filter((w) => clean(w.offered_item ?? w.item ?? w.item_categories ?? '-') !== '-' || asArray(w.matching_market_wins).length);

//     if (likelyWins.length) {
//       doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...colors.darkGray);
//       doc.text('Likely Wins - High Probability Opportunities', margin, y);
//       y += 6;

//       likelyWins.forEach((win: any, idx: number) => {
//         needSpace(64);
//         const boxH = 44;

//         doc.setFillColor(240, 253, 244);
//         doc.setDrawColor(...colors.successGreen);
//         doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, 'F');
//         doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, 'S');

//         doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...colors.successGreen);
//         doc.text(`Opportunity ${idx + 1}:`, margin + 4, y + 6);

//         doc.setTextColor(...colors.darkGray);
//         const itemText = clean(win.item ?? win.offered_item ?? win.item_categories ?? '-');
//         const itemLines = doc.splitTextToSize(itemText, pageWidth - margin * 2 - 38);
//         doc.text(itemLines, margin + 30, y + 6);

//         doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...colors.darkGray);
//         doc.text('Win Probability Reason:', margin + 4, y + 14);
//         doc.setFont('helvetica', 'normal');
//         const reason = clean(win.reason ?? win.win_probability_reason ?? '-');
//         const rLines = doc.splitTextToSize(reason, pageWidth - margin * 2 - 8);
//         doc.text(rLines, margin + 4, y + 19);

//         y += boxH + 6;

//         const mmw = asArray<any>(win.matching_market_wins);
//         if (mmw.length) {
//           if (y + 46 > SAFE_BOTTOM) addPage();

//           const conf = String(win.confidence ?? '').toUpperCase() || '-';
//           const body: RowInput[] = mmw.map((m) => ([
//             short(m.bid_number, 30),
//             clean(m.org ?? m.organisation ?? '-'),
//             clean(m.dept ?? m.department ?? '-'),
//             clean(m.quantity ?? m.qty ?? '-'),
//             clean(m.total_price ?? m.price_hint ?? '-'),
//             conf,
//           ]));

//           const widths = autoFitWidths(doc, margin, [44, 64, 64, 18, 28, 20]);
//           autoTable(doc, {
//             ...tableDefaults,
//             startY: y,
//             head: [['Bid Number', 'Organization', 'Department', 'Qty', 'Price', 'Confidence']],
//             body: body,
//             theme: 'grid',
//             margin: leftShiftedTableMargin(margin, SAFE_TOP),
//             headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 8 },
//             bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7, cellPadding: 2 },
//             columnStyles: {
//               0: { cellWidth: widths[0] },
//               1: { cellWidth: widths[1] },
//               2: { cellWidth: widths[2] },
//               3: { cellWidth: widths[3], halign: 'right' },
//               4: { cellWidth: widths[4], halign: 'right' },
//               5: { cellWidth: widths[5], fontStyle: 'bold', halign: 'center' },
//             },
//             didDrawPage: () => { addHeader(); addFooter(); },
//           });
//           y = (doc as any).lastAutoTable.finalY + 10;
//         }
//       });
//     }

//     /** ----------------- Strategic Affinity Signals (values on LEFT) ----------------- */
//     addPage();
//     section('Strategic Affinity Signals', colors.darkBlue);

//     const signals = ai.signals ?? {};
//     const orgAff = asArray<any>(signals.org_affinity);
//     const deptAff = asArray<any>(signals.dept_affinity);
//     const minAff = asArray<any>(signals.ministry_affinity);

//     const drawBars = (items: any[], labelKey: string, valueKey: string, maxBars = 6) => {
//       const data = items
//         .map((x) => {
//           const label = clean(x[labelKey] ?? x.name ?? x.org ?? x.dept ?? x.ministry ?? '-');
//           const val = Number(x[valueKey] ?? x.wins ?? x.win_count ?? x.count ?? 0) || 0;
//           return { label, val };
//         })
//         .filter(d => d.val >= 0)
//         .sort((a, b) => b.val - a.val)
//         .slice(0, maxBars);

//       if (!data.length) {
//         doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(...colors.mediumGray);
//         doc.text('No data available', margin, y); y += 8; return;
//       }

//       const maxVal = Math.max(...data.map(d => d.val), 1);
//       const labelColW = 110;
//       const valColW = 18;
//       const barX = margin + labelColW + valColW + 6;
//       const barW = pageWidth - barX - margin;

//       data.forEach((d) => {
//         needSpace(12);

//         doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...colors.darkGray);
//         const lbl = doc.splitTextToSize(d.label, labelColW - 2);
//         doc.text(Array.isArray(lbl) ? lbl[0] : lbl, margin, y);

//         doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...colors.darkBlue);
//         doc.text(String(d.val), margin + labelColW + valColW, y, { align: 'right' });

//         doc.setFillColor(...colors.lightGray);
//         doc.roundedRect(barX, y - 4.5, barW, 7, 1.5, 1.5, 'F');

//         const w = Math.max(0, (d.val / maxVal) * barW);
//         doc.setFillColor(...colors.darkBlue);
//         doc.roundedRect(barX, y - 4.5, w, 7, 1.5, 1.5, 'F');

//         y += 9;
//       });
//       y += 4;
//     };

//     doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);

//     doc.text('Organization Affinity', margin, y); y += 8;
//     drawBars(orgAff.map((o: any) => ({ org_name: o.org_name ?? o.name ?? o.org, wins: o.wins ?? o.win_count ?? 0 })), 'org_name', 'wins');

//     doc.text('Department Affinity', margin, y); y += 8;
//     drawBars(deptAff.map((o: any) => ({ dept_name: o.dept_name ?? o.name ?? o.dept, wins: o.wins ?? o.win_count ?? 0 })), 'dept_name', 'wins');

//     doc.text('Ministry Affinity', margin, y); y += 8;
//     drawBars(minAff.map((o: any) => ({ ministry_name: o.ministry_name ?? o.name ?? o.ministry, wins: o.wins ?? o.win_count ?? 0 })), 'ministry_name', 'wins');

//     needSpace(20);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...colors.darkGray);
//     doc.text('Quantity & Price Range Patterns', margin, y); y += 7;
//     doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
//     const qtyRange = clean(signals.quantity_range) || '-';
//     const priceRange = clean(signals.price_range) || '-';
//     doc.text(`Quantity Range: ${qtyRange}`, margin, y); y += 6;
//     doc.text(`Price Range: ${priceRange}`, margin, y); y += 4;

//     /** ----------------- Guidance ----------------- */
//     addPage();
//     section('Strategic Roadmap & Action Items', colors.successGreen);
//     const nextSteps = asArray<string>(safeGet(ai, ['guidance', 'next_steps']));
//     const expAreas = asArray<string>(safeGet(ai, ['guidance', 'expansion_areas']));

//     if (nextSteps.length) {
//       doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//       doc.text('Next Steps - Action Plan', margin, y); y += 6;
//       nextSteps.forEach((s, i) => {
//         needSpace(16);
//         doc.setFillColor(240, 253, 244);
//         doc.setDrawColor(...colors.successGreen);
//         doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'F');
//         doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'S');
//         doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.successGreen); doc.setFontSize(9);
//         doc.text(`${i + 1}.`, margin + 4, y + 6);
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray); doc.setFontSize(8);
//         const lines = doc.splitTextToSize(clean(s), pageWidth - margin * 2 - 14);
//         doc.text(lines, margin + 12, y + 6);
//         y += 18;
//       });
//     }

//     if (expAreas.length) {
//       needSpace(10);
//       doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//       doc.text('Expansion Opportunities', margin, y); y += 6;
//       expAreas.forEach((s) => {
//         needSpace(14);
//         doc.setFillColor(239, 246, 255);
//         doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 2, 2, 'F');
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray); doc.setFontSize(8);
//         const lines = doc.splitTextToSize('- ' + clean(s), pageWidth - margin * 2 - 8);
//         doc.text(lines, margin + 4, y + 5);
//         y += 16;
//       });
//     }
//   }

//   /** ===================================================================
//    *                     CATEGORY DISTRIBUTION (bars)
//    *  =================================================================== */
//   const cat = safeGet(reportData, ['data', 'categoryListing']) || {};
//   const categories = asArray<any>(cat.categories);
//   if (categories.length) {
//     addPage();
//     section('Category-wise Tender Distribution', colors.darkBlue);

//     doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray); doc.setFontSize(9);
//     doc.text('Tender Categories by Volume', margin, y); y += 8;

//     const maxTimes = Math.max(...categories.map((c) => Number(c.times || 0)), 1);
//     const labelColW = 110;
//     const valColW = 18;
//     const barX = margin + labelColW + valColW + 6;
//     const barW = pageWidth - barX - margin;

//     categories.forEach((c) => {
//       needSpace(10);
//       const label = clean(c.category);
//       const val = Number(c.times || 0);

//       doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...colors.darkGray);
//       const lbl = doc.splitTextToSize(label, labelColW - 2);
//       doc.text(Array.isArray(lbl) ? lbl[0] : lbl, margin, y);

//       doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...colors.darkBlue);
//       doc.text(String(val), margin + labelColW + valColW, y, { align: 'right' });

//       doc.setFillColor(...colors.lightGray);
//       doc.roundedRect(barX, y - 4.5, barW, 7, 1.5, 1.5, 'F');

//       const w = Math.max(0, (val / maxTimes) * barW);
//       doc.setFillColor(...colors.darkBlue);
//       doc.roundedRect(barX, y - 4.5, w, 7, 1.5, 1.5, 'F');

//       y += 9;
//     });
//     y += 6;
//   }

//   /** ===================================================================
//    *                  TOP SELLERS BY DEPT (if present)
//    *  =================================================================== */
//   const topSellersByDept = safeGet(reportData, ['data', 'topSellersByDept']);
//   if (topSellersByDept?.departments?.length) {
//     addPage();
//     section('Leading Competitors - ' + (dept || '-'), colors.warningOrange);

//     const firstDept = topSellersByDept.departments[0];
//     if (firstDept?.results?.length) {
//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray); doc.setFontSize(9);
//       doc.text('Top Sellers by Participation Count', margin, y); y += 8;

//       const rows: RowInput[] = firstDept.results.slice(0, 10).map((s: any, i: number) => {
//         const rank = s.rank ?? i + 1;
//         const rankDisp = i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : String(rank);
//         return [rankDisp, clean(s.seller_name), (s.participation_count ?? 0).toLocaleString()];
//       });

//       const widths = autoFitWidths(doc, margin, [18, 120, 30]);
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Rank', 'Seller Name', 'Participation']],
//         body: rows,
//         margin: leftShiftedTableMargin(margin, SAFE_TOP),
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 8.5 },
//         columnStyles: {
//           0: { cellWidth: widths[0], halign: 'center', fontStyle: 'bold' },
//           1: { cellWidth: widths[1] },
//           2: { cellWidth: widths[2], halign: 'right', fontStyle: 'bold' },
//         },
//         didDrawPage: () => { addHeader(); addFooter(); },
//       });
//       y = (doc as any).lastAutoTable.finalY + 8;
//     }
//   }

//   /** ===================================================================
//    *               SELLER BIDS SUMMARY (cards + tables)
//    *  =================================================================== */
//   const sellerBids = safeGet(reportData, ['data', 'sellerBids']) || {};
//   if (Object.keys(sellerBids).length) {
//     addPage();
//     section(`${sellerName} - Bidding Performance Deep Dive`, colors.electricBlue);

//     const t1 = sellerBids.table1 || {};
//     const hasT1 = Object.keys(t1).length > 0;
//     if (hasT1) {
//       const cardW = (pageWidth - margin * 2 - 10) / 3;
//       const cardH = 24;
//       let x = margin;

//       const firstRow = [
//         { label: 'Total Wins', val: (t1.win ?? 0).toLocaleString(), color: colors.successGreen, bg: [240, 253, 244] as [number, number, number] },
//         { label: 'Total Lost', val: (t1.lost ?? 0).toLocaleString(), color: colors.errorRed, bg: [254, 226, 226] as [number, number, number] },
//         {
//           label: 'Win Rate',
//           val: (t1.win != null && t1.lost != null && (t1.win + t1.lost) > 0) ? `${((t1.win / (t1.win + t1.lost)) * 100).toFixed(1)}%` : '-',
//           color: colors.darkBlue, bg: [239, 246, 255] as [number, number, number],
//         },
//       ];
//       firstRow.forEach((c) => {
//         doc.setFillColor(...c.bg); doc.roundedRect(x, y, cardW, cardH, 2, 2, 'F');
//         doc.setFont('helvetica', 'bold'); doc.setTextColor(...c.color); doc.setFontSize(14);
//         doc.text(c.val, x + cardW / 2, y + 13, { align: 'center' });
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.mediumGray); doc.setFontSize(8);
//         doc.text(c.label, x + cardW / 2, y + 20, { align: 'center' });
//         x += cardW + 5;
//       });
//       y += cardH + 8;

//       x = margin;
//       const secondRow = [
//         { label: 'Total Bid Value', val: formatCurrency(t1.totalBidValue), color: colors.warningOrange, bg: [254, 243, 199] as [number, number, number] },
//         { label: 'Qualified Bid Value', val: formatCurrency(t1.qualifiedBidValue), color: colors.successGreen, bg: [240, 253, 244] as [number, number, number] },
//         { label: 'Avg Order Value', val: formatCurrency(t1.averageOrderValue), color: [138, 43, 226] as [number, number, number], bg: [243, 232, 255] as [number, number, number] },
//       ];
//       secondRow.forEach((c) => {
//         doc.setFillColor(...c.bg); doc.roundedRect(x, y, cardW, cardH, 2, 2, 'F');
//         doc.setFont('helvetica', 'bold'); doc.setTextColor(...c.color); doc.setFontSize(11);
//         const v = (c.val || '').slice(0, 22);
//         doc.text(v || '-', x + cardW / 2, y + 13, { align: 'center' });
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.mediumGray); doc.setFontSize(8);
//         doc.text(c.label, x + cardW / 2, y + 20, { align: 'center' });
//         x += cardW + 5;
//       });
//       y += cardH + 10;
//     }

//     const deptCountsObj = sellerBids.departmentCount || {};
//     const deptsList = (() => {
//       if (Array.isArray(deptCountsObj)) return deptCountsObj;
//       const counts = deptCountsObj.departmentCount || {};
//       const revs = deptCountsObj.revenue || {};
//       const names = Array.from(new Set([...Object.keys(counts), ...Object.keys(revs)]));
//       return names.map((name) => ({
//         department: name,
//         bid_count: counts[name] ?? 0,
//         revenue: revs[name] ?? 0,
//       }));
//     })();

//     if (deptsList.length) {
//       needSpace(12);
//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray); doc.setFontSize(10);
//       doc.text('Revenue by Department', margin, y); y += 8;

//       const sorted = [...deptsList].sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0));
//       const rows: RowInput[] = sorted.map((d) => [
//         clean(d.department),
//         (d.bid_count ?? 0).toLocaleString(),
//         formatCurrency(d.revenue ?? 0),
//       ]);
//       const totalRev = sorted.reduce((s, d) => s + (Number(d.revenue) || 0), 0);
//       const totalBids = sorted.reduce((s, d) => s + (Number(d.bid_count) || 0), 0);
//       rows.push(['TOTAL', totalBids.toLocaleString(), formatCurrency(totalRev)]);

//       const widths = autoFitWidths(doc, margin, [120, 28, 36]);
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Department', 'Bid Count', 'Revenue']],
//         body: rows,
//         margin: leftShiftedTableMargin(margin, SAFE_TOP),
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.darkBlue, textColor: colors.white, fontSize: 8 },
//         columnStyles: { 0: { cellWidth: widths[0] }, 1: { cellWidth: widths[1], halign: 'right' }, 2: { cellWidth: widths[2], halign: 'right', fontStyle: 'bold' } },
//         didDrawPage: () => { addHeader(); addFooter(); },
//       });
//       y = (doc as any).lastAutoTable.finalY + 10;
//     }

//     const stateCountsObj = sellerBids.stateCount || {};
//     const stateRows = (() => {
//       if (Array.isArray(stateCountsObj)) return stateCountsObj;
//       const counts = stateCountsObj.stateCounts || {};
//       const revs = stateCountsObj.stateRevenue || {};
//       const names = Array.from(new Set([...Object.keys(counts), ...Object.keys(revs)]));
//       return names.map((name) => ({
//         state: name,
//         bid_count: counts[name] ?? 0,
//         revenue: revs[name] ?? 0,
//       }));
//     })();

//     if (stateRows.length) {
//       needSpace(12);
//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray); doc.setFontSize(10);
//       doc.text('Bids by State', margin, y); y += 8;

//       const rows: RowInput[] = [...stateRows]
//         .sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0))
//         .slice(0, 15)
//         .map((s) => [clean(s.state), (s.bid_count ?? 0).toLocaleString(), formatCurrency(s.revenue ?? 0)]);

//       const widths = autoFitWidths(doc, margin, [100, 28, 44]);
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['State', 'Bid Count', 'Revenue']],
//         body: rows,
//         theme: 'grid',
//         margin: leftShiftedTableMargin(margin, SAFE_TOP),
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 8 },
//         columnStyles: { 0: { cellWidth: widths[0] }, 1: { cellWidth: widths[1], halign: 'right' }, 2: { cellWidth: widths[2], halign: 'right' } },
//         didDrawPage: () => { addHeader(); addFooter(); },
//       });
//       y = (doc as any).lastAutoTable.finalY + 8;
//     }
//   }

//   /** ===================================================================
//    *               PRICE BAND (grid + insight)
//    *  =================================================================== */
//   const priceBand = safeGet(reportData, ['data', 'priceBand', 'analysis']) ?? safeGet(reportData, ['data', 'priceBand']);
//   if (priceBand) {
//     addPage();
//     section('Price Band Analysis', colors.successGreen);

//     const highest = toNumber(priceBand.highest);
//     const lowest = toNumber(priceBand.lowest);
//     const average = toNumber(priceBand.average);

//     if (highest != null || lowest != null || average != null) {
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Price Category', 'Amount']],
//         body: [
//           ['Highest Price', formatCurrency(highest)],
//           ['Average Price', formatCurrency(average)],
//           ['Lowest Price', formatCurrency(lowest)],
//         ],
//         theme: 'grid',
//         margin: leftShiftedTableMargin(margin, SAFE_TOP),
//         headStyles: { ...tableDefaults.headStyles, fillColor: [72, 187, 120], textColor: 255, fontSize: 9, halign: 'left' },
//         columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold' }, 1: { cellWidth: 'auto', halign: 'right' } },
//       });
//       y = (doc as any).lastAutoTable.finalY + 12;

//       const boxH = 22;
//       doc.setFillColor(239, 246, 255);
//       doc.setDrawColor(...colors.electricBlue);
//       doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, 'F');
//       doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, 'S');

//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.electricBlue); doc.setFontSize(8);
//       doc.text('Price Insights:', margin + 4, y + 6);

//       doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray);
//       let insight = 'Insufficient price data to compute meaningful insights.';
//       if (highest != null && lowest != null && average && average !== 0) {
//         const range = highest - lowest;
//         const varPct = ((range / average) * 100).toFixed(1);
//         insight = `Price range spans ${formatCurrency(range)} with ${varPct}% variation. ` +
//           `Target competitive pricing ~ ${formatCurrency(Math.round((lowest ?? 0) * 1.05))} to ${formatCurrency(Math.round((average ?? 0) * 0.95))}.`;
//       }
//       const lines = doc.splitTextToSize(insight, pageWidth - margin * 2 - 8);
//       doc.text(lines, margin + 4, y + 12);
//       y += boxH + 6;
//     }
//   }

//   /** ===================================================================
//    *                  STATES ANALYSIS (bars) — values LEFT
//    *  =================================================================== */
//   const states = asArray<any>(safeGet(reportData, ['data', 'topPerformingStates', 'data', 'results']));
//   if (states.length) {
//     addPage();
//     section('Top Performing States by Tender Volume', colors.successGreen);

//     const list = states.slice(0, 29);
//     const maxVal = Math.max(...list.map((s) => Number(s.total_tenders || 0)), 1);
//     const labelColW = 110;
//     const valColW = 18;
//     const barX = margin + labelColW + valColW + 6;
//     const barW = pageWidth - barX - margin;

//     doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray); doc.setFontSize(9);
//     doc.text('State-wise Tender Distribution (Top 29)', margin, y); y += 8;

//     list.forEach((st) => {
//       needSpace(9);
//       const label = clean(st.state_name);
//       const val = Number(st.total_tenders || 0);

//       doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...colors.darkGray);
//       const lbl = doc.splitTextToSize(label, labelColW - 2);
//       doc.text(Array.isArray(lbl) ? lbl[0] : lbl, margin, y);

//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkBlue);
//       doc.text(String(val), margin + labelColW + valColW, y, { align: 'right' });

//       doc.setFillColor(...colors.lightGray);
//       doc.roundedRect(barX, y - 4, barW, 6, 1, 1, 'F');

//       const w = Math.max(0, (val / maxVal) * barW);
//       doc.setFillColor(...colors.successGreen);
//       doc.roundedRect(barX, y - 4, w, 6, 1, 1, 'F');

//       y += 8;
//     });
//   }

//   return doc;
// }
// ✅ Full working code — just copy-paste and use in your project!
// Place this file in: /src/utils/pdfGenerator.ts







// import jsPDF from 'jspdf';
// import autoTable, { RowInput } from 'jspdf-autotable';

// /** ============ TYPES (Loosely typed to survive API shape changes) ============ **/
// type AnyObj = Record<string, any>;

// interface ReportData {
//   meta?: AnyObj;
//   data?: AnyObj;
// }

// /** ========================= COLOR PALETTE ========================= **/
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
// };

// /** ========================= SAFE HELPERS ========================= **/
// const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);
// const toNumber = (v: any): number | null => {
//   if (v == null || v === '') return null;
//   const n = Number(v);
//   return isFinite(n) ? n : null;
// };
// const asArray = <T = any>(v: any): T[] => {
//   if (Array.isArray(v)) return v as T[];
//   if (v == null) return [];
//   if (isObj(v)) return Object.values(v) as T[];
//   return [];
// };
// const clean = (value: any): string => {
//   if (value === null || value === undefined) return '-';
//   if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(', ') || '-';
//   if (isObj(value)) { try { return JSON.stringify(value); } catch { return '-'; } }
//   const s = String(value)
//     .replace(/[₹]/g, 'Rs ')
//     .replace(/[\u2018\u2019]/g, "'")
//     .replace(/[\u201C\u201D]/g, '"')
//     .replace(/\u00A0/g, ' ')
//     .replace(/[\u2013\u2014]/g, '-')
//     .replace(/[\u2022\u2023\u2043]/g, '*')
//     .replace(/\s+/g, ' ')
//     .trim();
//   return s || '-';
// };
// const short = (v: any, len = 60) => {
//   const s = clean(v);
//   return s.length > len ? s.slice(0, len - 1) + '…' : s;
// };
// const formatCurrency = (amount: any): string => {
//   const n = toNumber(amount);
//   if (n == null) return '-';
//   try { return `Rs ${n.toLocaleString('en-IN')}`; } catch { return `Rs ${n}`; }
// };
// const formatDate = (d: any): string => {
//   if (!d) return '-';
//   const dt = new Date(d);
//   if (isNaN(dt.getTime())) return clean(d);
//   try {
//     return dt
//       .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//       .replace(/ /g, '-');
//   } catch { return dt.toISOString().slice(0, 10); }
// };
// const safeGet = (obj: AnyObj, path: string[], fallback?: any) => {
//   try { return path.reduce((o, k) => (o && k in o ? o[k] : undefined), obj) ?? fallback; }
//   catch { return fallback; }
// };

// /** ========================= AUTOTABLE HELPERS ========================= **/
// const tableDefaults = {
//   theme: 'striped' as const,
//   headStyles: { halign: 'center' as const, fontStyle: 'bold' as const, fontSize: 8 },
//   bodyStyles: {
//     fontSize: 7,
//     cellPadding: 2,
//     minCellHeight: 8,
//     overflow: 'linebreak' as const,
//     valign: 'middle' as const,
//   },
// };

// function autoFitWidths(doc: jsPDF, margin: number, widths: number[]) {
//   const printable = doc.internal.pageSize.getWidth() - margin * 2;
//   const sum = widths.reduce((a, b) => a + b, 0);
//   if (sum <= printable) return widths;
//   const scale = printable / sum;
//   return widths.map(w => Math.max(8, Math.floor(w * scale)));
// }
// function leftShiftedTableMargin(margin: number, safeTop: number) {
//   return { left: Math.max(8, margin - 6), right: margin + 6, top: safeTop };
// }

// /** ========================= MAIN ========================= **/
// export const generatePDF = async (reportData: ReportData) => {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   const margin = 14;
//   const HEADER_H = 18;
//   const FOOTER_H = 12;
//   const SAFE_TOP = HEADER_H + 6;
//   const SAFE_BOTTOM = pageHeight - FOOTER_H - 8;

//   let y = SAFE_TOP;

//   /** ---------- Header / Footer ---------- **/
//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageWidth, HEADER_H, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text('GOVERNMENT TENDER ANALYSIS', pageWidth / 2, 11, { align: 'center' });
//   };
//   const addFooter = () => {
//     const pageNum =
//       (doc as any).getCurrentPageInfo?.().pageNumber ??
//       (doc as any).internal?.getNumberOfPages?.();
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageHeight - FOOTER_H, pageWidth, FOOTER_H, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
//     const seller = safeGet(reportData, ['meta', 'params_used', 'sellerName'], '-');
//     doc.text(clean(seller), margin, pageHeight - 6);
//     doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
//     const genAt = safeGet(reportData, ['meta', 'report_generated_at']);
//     doc.text(formatDate(genAt), pageWidth - margin, pageHeight - 6, { align: 'right' });
//   };
//   const addPage = () => { doc.addPage(); y = SAFE_TOP; addHeader(); addFooter(); };
//   const needSpace = (h: number) => { if (y + h > SAFE_BOTTOM) { addPage(); return true; } return false; };
//   const section = (title: string, color: [number, number, number]) => {
//     needSpace(16);
//     doc.setFillColor(...color);
//     doc.rect(margin, y, pageWidth - margin * 2, 10, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
//     doc.text(title, margin + 4, y + 7);
//     y += 14;
//   };

//   /** ---------- Cover ---------- **/
//   doc.setFillColor(...colors.navyBlue); doc.rect(0, 0, pageWidth, pageHeight, 'F');
//   doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.white); doc.setFontSize(24);
//   doc.text('GOVERNMENT', pageWidth / 2, 58, { align: 'center' });
//   doc.text('TENDER ANALYSIS', pageWidth / 2, 72, { align: 'center' });
//   doc.setFillColor(25, 50, 85);
//   doc.roundedRect(margin + 10, 90, pageWidth - (margin + 10) * 2, 14, 3, 3, 'F');
//   doc.setTextColor(...colors.electricBlue); doc.setFont('helvetica', 'normal'); doc.setFontSize(12);
//   doc.text('Comprehensive Performance Report', pageWidth / 2, 100, { align: 'center' });

//   const sellerName = clean(safeGet(reportData, ['meta', 'params_used', 'sellerName'], '—'));
//   doc.setTextColor(...colors.white); doc.setFontSize(18);
//   doc.text(sellerName, pageWidth / 2, 125, { align: 'center' });

//   doc.setFontSize(10);
//   const genAt = formatDate(safeGet(reportData, ['meta', 'report_generated_at']));
//   const days = clean(safeGet(reportData, ['meta', 'params_used', 'days'], '-'));
//   const dept = clean(safeGet(reportData, ['meta', 'params_used', 'department'], '-')) || '-';
//   doc.text(`Report Generated: ${genAt}`, pageWidth / 2, 150, { align: 'center' });
//   doc.text(`Analysis Period: ${days} days`, pageWidth / 2, 158, { align: 'center' });
//   doc.text(`Department: ${dept || '-'}`, pageWidth / 2, 166, { align: 'center' });

//   addPage();

//   /**
//    * ===================================================================
//    * 1. MISSED BUT WINNABLE
//    * ===================================================================
//    */
//   const mbw = safeGet(reportData, ['data', 'missedButWinnable'], {}) || {};
//   const recentWins = asArray<any>(mbw.recentWins);
//   const marketWins = asArray<any>(mbw.marketWins);

//   section('Missed But Winnable - Market Intelligence', colors.darkBlue);

//   if (recentWins.length) {
//     doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text(`Recent Wins — ${sellerName}`, margin, y); y += 8;

//     const rows: RowInput[] = recentWins.map((w) => ([
//       short(w.bid_number, 26),
//       short(w.offered_item, 60),
//       String(w.quantity ?? 0),
//       formatCurrency(w.total_price),
//       short(w.org, 30),
//       short(w.dept, 35),
//       formatDate(w.ended_at),
//     ]));

//     const widths = autoFitWidths(doc, margin, [24, 62, 12, 24, 32, 36, 20]);
//     autoTable(doc, {
//       ...tableDefaults,
//       startY: y,
//       head: [['Bid Number', 'Item', 'Qty', 'Price', 'Organization', 'Department', 'End Date']],
//       body: rows,
//       margin: leftShiftedTableMargin(margin, SAFE_TOP),
//       headStyles: { ...tableDefaults.headStyles, fillColor: colors.darkBlue, textColor: colors.white, fontSize: 8 },
//       columnStyles: {
//         0: { cellWidth: widths[0] },
//         1: { cellWidth: widths[1] },
//         2: { cellWidth: widths[2], halign: 'right' },
//         3: { cellWidth: widths[3], halign: 'right' },
//         4: { cellWidth: widths[4] },
//         5: { cellWidth: widths[5] },
//         6: { cellWidth: widths[6], halign: 'center' },
//       },
//       didDrawPage: () => { addHeader(); addFooter(); },
//     });
//     y = (doc as any).lastAutoTable.finalY + 10;
//   }

//   if (marketWins.length) {
//     needSpace(14);
//     doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text('Competitor Market Wins', margin, y); y += 8;

//     const rows: RowInput[] = marketWins.map((w) => ([
//       short(w.bid_number, 22),
//       short(w.seller_name, 24),
//       short(w.offered_item, 46),
//       String(w.quantity ?? 0),
//       formatCurrency(w.total_price),
//       short(w.org, 30),
//       short(w.dept, 30),
//       formatDate(w.ended_at),
//     ]));

//     const widths = autoFitWidths(doc, margin, [23, 26, 46, 10, 22, 30, 30, 18]);
//     autoTable(doc, {
//       ...tableDefaults,
//       startY: y,
//       head: [['Bid', 'Seller', 'Item', 'Qty', 'Price', 'Org', 'Dept', 'End']],
//       body: rows,
//       margin: leftShiftedTableMargin(margin, SAFE_TOP),
//       headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 8 },
//       bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 6.8 },
//       columnStyles: {
//         0: { cellWidth: widths[0] },
//         1: { cellWidth: widths[1] },
//         2: { cellWidth: widths[2] },
//         3: { cellWidth: widths[3], halign: 'right' },
//         4: { cellWidth: widths[4], halign: 'right' },
//         5: { cellWidth: widths[5] },
//         6: { cellWidth: widths[6] },
//         7: { cellWidth: widths[7], halign: 'center' },
//       },
//       didDrawPage: () => { addHeader(); addFooter(); },
//     });
//     y = (doc as any).lastAutoTable.finalY + 10;
//   }

//   /**
//    * ===================================================================
//    * 2. AI INSIGHTS
//    * ===================================================================
//    */
//   const ai =
//     safeGet(reportData, ['data', 'ai']) ||
//     safeGet(reportData, ['data', 'missedButWinnable', 'ai']) ||  // ✅ Handles nested case
//     safeGet(reportData, ['ai']) ||
//     {};

//   if (Object.keys(ai).length) {
//     addPage();
//     section('AI Strategy Summary', colors.electricBlue);

//     // Strategy Summary Card
//     const summary = clean(ai.strategy_summary);
//     if (summary !== '-') {
//       const h = 36;
//       doc.setFillColor(241, 245, 249);
//       doc.roundedRect(margin, y, pageWidth - margin * 2, h, 3, 3, 'F');
//       doc.setDrawColor(...colors.electricBlue);
//       doc.roundedRect(margin, y, pageWidth - margin * 2, h, 3, 3, 'S');
//       doc.setTextColor(...colors.darkGray);
//       doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
//       const lines = doc.splitTextToSize(summary, pageWidth - margin * 2 - 8);
//       doc.text(lines, margin + 4, y + 7);
//       y += h + 8;
//     }

//     /** -------- Likely Wins (cards + table) -------- */
//     const likelyWins = asArray<any>(ai.likely_wins)
//       .filter((w) => clean(w.offered_item ?? w.item ?? w.item_categories ?? '-') !== '-' || asArray(w.matching_market_wins).length);

//     if (likelyWins.length) {
//       doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...colors.darkGray);
//       doc.text('Likely Wins - High Probability Opportunities', margin, y);
//       y += 6;

//       likelyWins.forEach((win: any, idx: number) => {
//         needSpace(64);
//         const boxH = 44;

//         doc.setFillColor(240, 253, 244);
//         doc.setDrawColor(...colors.successGreen);
//         doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, 'F');
//         doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, 'S');

//         doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...colors.successGreen);
//         doc.text(`Opportunity ${idx + 1}:`, margin + 4, y + 6);

//         doc.setTextColor(...colors.darkGray);
//         const itemText = clean(win.item ?? win.offered_item ?? win.item_categories ?? '-');
//         const itemLines = doc.splitTextToSize(itemText, pageWidth - margin * 2 - 38);
//         doc.text(itemLines, margin + 30, y + 6);

//         doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...colors.darkGray);
//         doc.text('Win Probability Reason:', margin + 4, y + 14);
//         doc.setFont('helvetica', 'normal');
//         const reason = clean(win.reason ?? win.win_probability_reason ?? '-');
//         const rLines = doc.splitTextToSize(reason, pageWidth - margin * 2 - 8);
//         doc.text(rLines, margin + 4, y + 19);

//         y += boxH + 6;

//         const mmw = asArray<any>(win.matching_market_wins);
//         if (mmw.length) {
//           if (y + 46 > SAFE_BOTTOM) addPage();

//           const conf = String(win.confidence ?? '').toUpperCase() || '-';
//           const body: RowInput[] = mmw.map((m) => ([
//             short(m.bid_number, 30),
//             clean(m.org ?? m.organisation ?? '-'),
//             clean(m.dept ?? m.department ?? '-'),
//             clean(m.quantity ?? m.qty ?? '-'),
//             clean(m.total_price ?? m.price_hint ?? '-'),
//             conf,
//           ]));

//           const widths = autoFitWidths(doc, margin, [44, 64, 64, 18, 28, 20]);
//           autoTable(doc, {
//             ...tableDefaults,
//             startY: y,
//             head: [['Bid Number', 'Organization', 'Department', 'Qty', 'Price', 'Confidence']],
//             body: body,
//             theme: 'grid',
//             margin: leftShiftedTableMargin(margin, SAFE_TOP),
//             headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 8 },
//             bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7, cellPadding: 2 },
//             columnStyles: {
//               0: { cellWidth: widths[0] },
//               1: { cellWidth: widths[1] },
//               2: { cellWidth: widths[2] },
//               3: { cellWidth: widths[3], halign: 'right' },
//               4: { cellWidth: widths[4], halign: 'right' },
//               5: { cellWidth: widths[5], fontStyle: 'bold', halign: 'center' },
//             },
//             didDrawPage: () => { addHeader(); addFooter(); },
//           });
//           y = (doc as any).lastAutoTable.finalY + 10;
//         }
//       });
//     }

//     /**
//      * Strategic Affinity Signals
//      */
//     addPage();
//     section('Strategic Affinity Signals', colors.darkBlue);

//     const signals = ai.signals ?? {};
//     const orgAff = asArray<any>(signals.org_affinity);
//     const deptAff = asArray<any>(signals.dept_affinity);
//     const minAff = asArray<any>(signals.ministry_affinity);

//     const drawBars = (items: any[], labelKey: string, valueKey: string, maxBars = 6) => {
//       const data = items
//         .map((x) => {
//           const label = clean(x[labelKey] ?? x.name ?? x.org ?? x.dept ?? x.ministry ?? '-');
//           const val = Number(x[valueKey] ?? x.wins ?? x.win_count ?? x.count ?? 0) || 0;
//           return { label, val };
//         })
//         .filter(d => d.val >= 0)
//         .sort((a, b) => b.val - a.val)
//         .slice(0, maxBars);

//       if (!data.length) {
//         doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(...colors.mediumGray);
//         doc.text('No data available', margin, y); y += 8; return;
//       }

//       const maxVal = Math.max(...data.map(d => d.val), 1);
//       const labelColW = 110;
//       const valColW = 18;
//       const barX = margin + labelColW + valColW + 6;
//       const barW = pageWidth - barX - margin;

//       data.forEach((d) => {
//         needSpace(12);

//         doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...colors.darkGray);
//         const lbl = doc.splitTextToSize(d.label, labelColW - 2);
//         doc.text(Array.isArray(lbl) ? lbl[0] : lbl, margin, y);

//         doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...colors.darkBlue);
//         doc.text(String(d.val), margin + labelColW + valColW, y, { align: 'right' });

//         doc.setFillColor(...colors.lightGray);
//         doc.roundedRect(barX, y - 4.5, barW, 7, 1.5, 1.5, 'F');

//         const w = Math.max(0, (d.val / maxVal) * barW);
//         doc.setFillColor(...colors.darkBlue);
//         doc.roundedRect(barX, y - 4.5, w, 7, 1.5, 1.5, 'F');

//         y += 9;
//       });
//       y += 4;
//     };

//     doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);

//     doc.text('Organization Affinity', margin, y); y += 8;
//     drawBars(orgAff, 'org_name', 'count');

//     doc.text('Department Affinity', margin, y); y += 8;
//     drawBars(deptAff, 'dept_name', 'count');

//     doc.text('Ministry Affinity', margin, y); y += 8;
//     drawBars(minAff, 'ministry_name', 'count');

//     needSpace(20);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...colors.darkGray);
//     doc.text('Quantity & Price Range Patterns', margin, y); y += 7;
//     doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
//     const qtyRange = clean(signals.quantity_range ?? '-');
//     const priceRange = clean(signals.price_range ?? '-');
//     doc.text(`Quantity Range: ${qtyRange}`, margin, y); y += 6;
//     doc.text(`Price Range: ${priceRange}`, margin, y); y += 4;

//     /** ----------------- Guidance ----------------- */
//     addPage();
//     section('Strategic Roadmap & Action Items', colors.successGreen);
//     const nextSteps = asArray<string>(safeGet(ai, ['guidance', 'next_steps']));
//     const expAreas = asArray<string>(safeGet(ai, ['guidance', 'expansion_areas']));

//     if (nextSteps.length) {
//       doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//       doc.text('Next Steps - Action Plan', margin, y); y += 6;
//       nextSteps.forEach((s, i) => {
//         needSpace(16);
//         doc.setFillColor(240, 253, 244);
//         doc.setDrawColor(...colors.successGreen);
//         doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'F');
//         doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'S');
//         doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.successGreen); doc.setFontSize(9);
//         doc.text(`${i + 1}.`, margin + 4, y + 6);
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray); doc.setFontSize(8);
//         const lines = doc.splitTextToSize(clean(s), pageWidth - margin * 2 - 14);
//         doc.text(lines, margin + 12, y + 6);
//         y += 18;
//       });
//     }

//     if (expAreas.length) {
//       needSpace(10);
//       doc.setTextColor(...colors.darkGray); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//       doc.text('Expansion Opportunities', margin, y); y += 6;
//       expAreas.forEach((s) => {
//         needSpace(14);
//         doc.setFillColor(239, 246, 255);
//         doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 2, 2, 'F');
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray); doc.setFontSize(8);
//         const lines = doc.splitTextToSize('- ' + clean(s), pageWidth - margin * 2 - 8);
//         doc.text(lines, margin + 4, y + 5);
//         y += 16;
//       });
//     }
//   }

//   /**
//    * ===================================================================
//    * 3. CATEGORY DISTRIBUTION
//    * ===================================================================
//    */
//   const cat = safeGet(reportData, ['data', 'categoryListing']) || {};
//   const categories = asArray<any>(cat.categories);
//   if (categories.length) {
//     addPage();
//     section('Category-wise Tender Distribution', colors.darkBlue);

//     doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray); doc.setFontSize(9);
//     doc.text('Tender Categories by Volume', margin, y); y += 8;

//     const maxTimes = Math.max(...categories.map((c) => Number(c.times || 0)), 1);
//     const labelColW = 110;
//     const valColW = 18;
//     const barX = margin + labelColW + valColW + 6;
//     const barW = pageWidth - barX - margin;

//     categories.forEach((c) => {
//       needSpace(10);
//       const label = clean(c.category);
//       const val = Number(c.times || 0);

//       doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...colors.darkGray);
//       const lbl = doc.splitTextToSize(label, labelColW - 2);
//       doc.text(Array.isArray(lbl) ? lbl[0] : lbl, margin, y);

//       doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...colors.darkBlue);
//       doc.text(String(val), margin + labelColW + valColW, y, { align: 'right' });

//       doc.setFillColor(...colors.lightGray);
//       doc.roundedRect(barX, y - 4.5, barW, 7, 1.5, 1.5, 'F');

//       const w = Math.max(0, (val / maxTimes) * barW);
//       doc.setFillColor(...colors.darkBlue);
//       doc.roundedRect(barX, y - 4.5, w, 7, 1.5, 1.5, 'F');

//       y += 9;
//     });
//     y += 6;
//   }

//   /**
//    * ===================================================================
//    * 4. TOP SELLERS BY DEPARTMENT
//    * ===================================================================
//    */
//   const topSellersByDept = safeGet(reportData, ['data', 'topSellersByDept']);
//   if (topSellersByDept?.departments?.length) {
//     addPage();
//     section('Leading Competitors - ' + (dept || '-'), colors.warningOrange);

//     const firstDept = topSellersByDept.departments[0];
//     if (firstDept?.results?.length) {
//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray); doc.setFontSize(9);
//       doc.text('Top Sellers by Participation Count', margin, y); y += 8;

//       const rows: RowInput[] = firstDept.results.slice(0, 10).map((s: any, i: number) => {
//         const rank = s.rank ?? i + 1;
//         const rankDisp = i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : String(rank);
//         return [rankDisp, clean(s.seller_name), (s.participation_count ?? 0).toLocaleString()];
//       });

//       const widths = autoFitWidths(doc, margin, [18, 120, 30]);
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Rank', 'Seller Name', 'Participation']],
//         body: rows,
//         margin: leftShiftedTableMargin(margin, SAFE_TOP),
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.warningOrange, textColor: colors.white, fontSize: 8.5 },
//         columnStyles: {
//           0: { cellWidth: widths[0], halign: 'center', fontStyle: 'bold' },
//           1: { cellWidth: widths[1] },
//           2: { cellWidth: widths[2], halign: 'right', fontStyle: 'bold' },
//         },
//         didDrawPage: () => { addHeader(); addFooter(); },
//       });
//       y = (doc as any).lastAutoTable.finalY + 8;
//     }
//   }

//   /**
//    * ===================================================================
//    * 5. SELLER BIDS SUMMARY
//    * ===================================================================
//    */
//   const sellerBids = safeGet(reportData, ['data', 'sellerBids']) || {};
//   if (Object.keys(sellerBids).length) {
//     addPage();
//     section(`${sellerName} - Bidding Performance Deep Dive`, colors.electricBlue);

//     const t1 = sellerBids.table1 || {};
//     const hasT1 = Object.keys(t1).length > 0;
//     if (hasT1) {
//       const cardW = (pageWidth - margin * 2 - 10) / 3;
//       const cardH = 24;
//       let x = margin;

//       const firstRow = [
//         { label: 'Total Wins', val: (t1.win ?? 0).toLocaleString(), color: colors.successGreen, bg: [240, 253, 244] as [number, number, number] },
//         { label: 'Total Lost', val: (t1.lost ?? 0).toLocaleString(), color: colors.errorRed, bg: [254, 226, 226] as [number, number, number] },
//         {
//           label: 'Win Rate',
//           val: (t1.win != null && t1.lost != null && (t1.win + t1.lost) > 0) ? `${((t1.win / (t1.win + t1.lost)) * 100).toFixed(1)}%` : '-',
//           color: colors.darkBlue, bg: [239, 246, 255] as [number, number, number],
//         },
//       ];
//       firstRow.forEach((c) => {
//         doc.setFillColor(...c.bg); doc.roundedRect(x, y, cardW, cardH, 2, 2, 'F');
//         doc.setFont('helvetica', 'bold'); doc.setTextColor(...c.color); doc.setFontSize(14);
//         doc.text(c.val, x + cardW / 2, y + 13, { align: 'center' });
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.mediumGray); doc.setFontSize(8);
//         doc.text(c.label, x + cardW / 2, y + 20, { align: 'center' });
//         x += cardW + 5;
//       });
//       y += cardH + 8;

//       x = margin;
//       const secondRow = [
//         { label: 'Total Bid Value', val: formatCurrency(t1.totalBidValue), color: colors.warningOrange, bg: [254, 243, 199] as [number, number, number] },
//         { label: 'Qualified Bid Value', val: formatCurrency(t1.qualifiedBidValue), color: colors.successGreen, bg: [240, 253, 244] as [number, number, number] },
//         { label: 'Avg Order Value', val: formatCurrency(t1.averageOrderValue), color: [138, 43, 226] as [number, number, number], bg: [243, 232, 255] as [number, number, number] },
//       ];
//       secondRow.forEach((c) => {
//         doc.setFillColor(...c.bg); doc.roundedRect(x, y, cardW, cardH, 2, 2, 'F');
//         doc.setFont('helvetica', 'bold'); doc.setTextColor(...c.color); doc.setFontSize(11);
//         const v = (c.val || '').slice(0, 22);
//         doc.text(v || '-', x + cardW / 2, y + 13, { align: 'center' });
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.mediumGray); doc.setFontSize(8);
//         doc.text(c.label, x + cardW / 2, y + 20, { align: 'center' });
//         x += cardW + 5;
//       });
//       y += cardH + 10;
//     }

//     const deptCountsObj = sellerBids.departmentCount || {};
//     const deptsList = (() => {
//       if (Array.isArray(deptCountsObj)) return deptCountsObj;
//       const counts = deptCountsObj.departmentCount || {};
//       const revs = deptCountsObj.revenue || {};
//       const names = Array.from(new Set([...Object.keys(counts), ...Object.keys(revs)]));
//       return names.map((name) => ({
//         department: name,
//         bid_count: counts[name] ?? 0,
//         revenue: revs[name] ?? 0,
//       }));
//     })();

//     if (deptsList.length) {
//       needSpace(12);
//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray); doc.setFontSize(10);
//       doc.text('Revenue by Department', margin, y); y += 8;

//       const sorted = [...deptsList].sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0));
//       const rows: RowInput[] = sorted.map((d) => [
//         clean(d.department),
//         (d.bid_count ?? 0).toLocaleString(),
//         formatCurrency(d.revenue ?? 0),
//       ]);
//       const totalRev = sorted.reduce((s, d) => s + (Number(d.revenue) || 0), 0);
//       const totalBids = sorted.reduce((s, d) => s + (Number(d.bid_count) || 0), 0);
//       rows.push(['TOTAL', totalBids.toLocaleString(), formatCurrency(totalRev)]);

//       const widths = autoFitWidths(doc, margin, [120, 28, 36]);
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Department', 'Bid Count', 'Revenue']],
//         body: rows,
//         margin: leftShiftedTableMargin(margin, SAFE_TOP),
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.darkBlue, textColor: colors.white, fontSize: 8 },
//         columnStyles: { 0: { cellWidth: widths[0] }, 1: { cellWidth: widths[1], halign: 'right' }, 2: { cellWidth: widths[2], halign: 'right', fontStyle: 'bold' } },
//         didDrawPage: () => { addHeader(); addFooter(); },
//       });
//       y = (doc as any).lastAutoTable.finalY + 10;
//     }

//     const stateCountsObj = sellerBids.stateCount || {};
//     const stateRows = (() => {
//       if (Array.isArray(stateCountsObj)) return stateCountsObj;
//       const counts = stateCountsObj.stateCounts || {};
//       const revs = stateCountsObj.stateRevenue || {};
//       const names = Array.from(new Set([...Object.keys(counts), ...Object.keys(revs)]));
//       return names.map((name) => ({
//         state: name,
//         bid_count: counts[name] ?? 0,
//         revenue: revs[name] ?? 0,
//       }));
//     })();

//     if (stateRows.length) {
//       needSpace(12);
//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray); doc.setFontSize(10);
//       doc.text('Bids by State', margin, y); y += 8;

//       const rows: RowInput[] = [...stateRows]
//         .sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0))
//         .slice(0, 15)
//         .map((s) => [clean(s.state), (s.bid_count ?? 0).toLocaleString(), formatCurrency(s.revenue ?? 0)]);

//       const widths = autoFitWidths(doc, margin, [100, 28, 44]);
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['State', 'Bid Count', 'Revenue']],
//         body: rows,
//         theme: 'grid',
//         margin: leftShiftedTableMargin(margin, SAFE_TOP),
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.successGreen, textColor: colors.white, fontSize: 8 },
//         columnStyles: { 0: { cellWidth: widths[0] }, 1: { cellWidth: widths[1], halign: 'right' }, 2: { cellWidth: widths[2], halign: 'right' } },
//         didDrawPage: () => { addHeader(); addFooter(); },
//       });
//       y = (doc as any).lastAutoTable.finalY + 8;
//     }
//   }

//   /**
//    * ===================================================================
//    * 6. PRICE BAND ANALYSIS
//    * ===================================================================
//    */
//   const priceBand = safeGet(reportData, ['data', 'priceBand', 'analysis']) ?? safeGet(reportData, ['data', 'priceBand']);
//   if (priceBand) {
//     addPage();
//     section('Price Band Analysis', colors.successGreen);

//     const highest = toNumber(priceBand.highest);
//     const lowest = toNumber(priceBand.lowest);
//     const average = toNumber(priceBand.average);

//     if (highest != null || lowest != null || average != null) {
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Price Category', 'Amount']],
//         body: [
//           ['Highest Price', formatCurrency(highest)],
//           ['Average Price', formatCurrency(average)],
//           ['Lowest Price', formatCurrency(lowest)],
//         ],
//         theme: 'grid',
//         margin: leftShiftedTableMargin(margin, SAFE_TOP),
//         headStyles: { ...tableDefaults.headStyles, fillColor: [72, 187, 120], textColor: 255, fontSize: 9, halign: 'left' },
//         columnStyles: { 0: { cellWidth: 60, fontStyle: 'bold' }, 1: { cellWidth: 'auto', halign: 'right' } },
//       });
//       y = (doc as any).lastAutoTable.finalY + 12;

//       const boxH = 22;
//       doc.setFillColor(239, 246, 255);
//       doc.setDrawColor(...colors.electricBlue);
//       doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, 'F');
//       doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, 'S');

//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.electricBlue); doc.setFontSize(8);
//       doc.text('Price Insights:', margin + 4, y + 6);

//       doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.darkGray);
//       let insight = 'Insufficient price data to compute meaningful insights.';
//       if (highest != null && lowest != null && average && average !== 0) {
//         const range = highest - lowest;
//         const varPct = ((range / average) * 100).toFixed(1);
//         insight = `Price range spans ${formatCurrency(range)} with ${varPct}% variation. ` +
//           `Target competitive pricing ~ ${formatCurrency(Math.round((lowest ?? 0) * 1.05))} to ${formatCurrency(Math.round((average ?? 0) * 0.95))}.`;
//       }
//       const lines = doc.splitTextToSize(insight, pageWidth - margin * 2 - 8);
//       doc.text(lines, margin + 4, y + 12);
//       y += boxH + 6;
//     }
//   }

//   /**
//    * ===================================================================
//    * 7. STATES PERFORMANCE (bars)
//    * ===================================================================
//    */
//   const states = asArray<any>(safeGet(reportData, ['data', 'topPerformingStates', 'data', 'results']));
//   if (states.length) {
//     addPage();
//     section('Top Performing States by Tender Volume', colors.successGreen);

//     const list = states.slice(0, 29);
//     const maxVal = Math.max(...list.map((s) => Number(s.total_tenders || 0)), 1);
//     const labelColW = 110;
//     const valColW = 18;
//     const barX = margin + labelColW + valColW + 6;
//     const barW = pageWidth - barX - margin;

//     doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkGray); doc.setFontSize(9);
//     doc.text('State-wise Tender Distribution (Top 29)', margin, y); y += 8;

//     list.forEach((st) => {
//       needSpace(9);
//       const label = clean(st.state_name);
//       const val = Number(st.total_tenders || 0);

//       doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...colors.darkGray);
//       const lbl = doc.splitTextToSize(label, labelColW - 2);
//       doc.text(Array.isArray(lbl) ? lbl[0] : lbl, margin, y);

//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.darkBlue);
//       doc.text(String(val), margin + labelColW + valColW, y, { align: 'right' });

//       doc.setFillColor(...colors.lightGray);
//       doc.roundedRect(barX, y - 4, barW, 6, 1, 1, 'F');

//       const w = Math.max(0, (val / maxVal) * barW);
//       doc.setFillColor(...colors.successGreen);
//       doc.roundedRect(barX, y - 4, w, 6, 1, 1, 'F');

//       y += 8;
//     });
//   }

//   return doc;
// };

// ===============================
// /src/utils/pdfGenerator.ts
// Updated: 2025-11-09
// Fixes: Likely Wins + Strategic Affinity Signals not rendering fully,
//        robust path detection (camelCase / snake_case / nested under missedButWinnable.ai),
//        dynamic text wrapping + table widths + pagination,
//        safe rendering even when fields are "Unknown" or null.
// ===============================




//............................................................

// import jsPDF from 'jspdf';
// import autoTable, { RowInput } from 'jspdf-autotable';

// type AnyObj = Record<string, any>;
// interface ReportData {
//   meta?: AnyObj;
//   data?: AnyObj;
// }

// /** ========================= COLOR PALETTE ========================= **/
// const colors = {
//   navyBlue: [30, 58, 95] as [number, number, number],
//   blue: [74, 144, 226] as [number, number, number],
//   success: [34, 197, 94] as [number, number, number],
//   warn: [245, 158, 11] as [number, number, number],
//   danger: [239, 68, 68] as [number, number, number],
//   text: [31, 41, 55] as [number, number, number],
//   mid: [107, 114, 128] as [number, number, number],
//   light: [209, 213, 219] as [number, number, number],
//   wash: [243, 244, 246] as [number, number, number],
//   white: [255, 255, 255] as [number, number, number],
// };

// /** ========================= SAFE HELPERS ========================= **/
// const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);

// const clean = (value: any): string => {
//   if (value === null || value === undefined) return '-';
//   if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(', ') || '-';
//   if (isObj(value)) {
//     try { return JSON.stringify(value); } catch { return '-'; }
//   }
//   const s = String(value)
//     .replace(/[₹]/g, 'Rs ')
//     .replace(/[\u2018\u2019]/g, "'")
//     .replace(/[\u201C\u201D]/g, '"')
//     .replace(/\u00A0/g, ' ')
//     .replace(/[\u2013\u2014]/g, '-')
//     .replace(/[\u2022\u2023\u2043]/g, '*')
//     .replace(/\s+/g, ' ')
//     .trim();
//   return s || '-';
// };

// const asArray = <T = any>(v: any): T[] => {
//   if (Array.isArray(v)) return v as T[];
//   if (!v) return [];
//   if (isObj(v)) return Object.values(v) as T[];
//   return [];
// };

// const toNum = (v: any): number | null => {
//   if (v === null || v === undefined || v === '') return null;
//   const n = Number(v);
//   return Number.isFinite(n) ? n : null;
// };

// const currency = (amount: any): string => {
//   const n = toNum(amount);
//   if (n == null) return '-';
//   try { return `Rs ${n.toLocaleString('en-IN')}`; } catch { return `Rs ${n}`; }
// };

// const dateFmt = (d: any): string => {
//   if (!d) return '-';
//   const dt = new Date(d);
//   if (Number.isNaN(dt.getTime())) return clean(d);
//   try {
//     return dt
//       .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//       .replace(/ /g, '-');
//   } catch {
//     return dt.toISOString().slice(0, 10);
//   }
// };

// const get = (obj: AnyObj, path: (string | number)[], fallback?: any) => {
//   try { return path.reduce((o, k) => (o && (k as any) in o ? o[k as any] : undefined), obj) ?? fallback; }
//   catch { return fallback; }
// };

// /** ========================= AUTOTABLE HELPERS ========================= **/
// const tableDefaults = {
//   theme: 'striped' as const,
//   headStyles: { halign: 'center' as const, fontStyle: 'bold' as const, fontSize: 8 },
//   bodyStyles: {
//     fontSize: 7,
//     cellPadding: 2,
//     minCellHeight: 8,
//     overflow: 'linebreak' as const,
//     valign: 'middle' as const,
//   },
// };

// function fitWidths(doc: jsPDF, margin: number, widths: number[]) {
//   const printable = doc.internal.pageSize.getWidth() - margin * 2;
//   const sum = widths.reduce((a, b) => a + b, 0);
//   if (sum <= printable) return widths;
//   const scale = printable / sum;
//   return widths.map(w => Math.max(10, Math.floor(w * scale)));
// }

// function shiftedMargin(margin: number, top: number) {
//   // shifts table a bit left to create more visible space (per your screenshots)
//   return { left: Math.max(8, margin - 6), right: margin + 6, top };
// }

// /** ========================= MAIN ========================= **/
// export const generatePDF = async (
//   reportData: ReportData,
//   opts?: { sellerName?: string }
// ) => {
//   const doc = new jsPDF();
//   const pageW = doc.internal.pageSize.getWidth();
//   const pageH = doc.internal.pageSize.getHeight();

//   const margin = 14;
//   const HEADER_H = 18;
//   const FOOTER_H = 12;
//   const SAFE_TOP = HEADER_H + 6;
//   const SAFE_BOTTOM = pageH - FOOTER_H - 8;

//   let y = SAFE_TOP;

//   /** ---------- Header / Footer ---------- **/
//   const addHeader = () => {
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, 0, pageW, HEADER_H, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text('GOVERNMENT TENDER ANALYSIS', pageW / 2, 11, { align: 'center' });
//   };
//   const addFooter = () => {
//     const pageNum =
//       (doc as any).getCurrentPageInfo?.().pageNumber ??
//       (doc as any).internal?.getNumberOfPages?.();
//     doc.setFillColor(...colors.navyBlue);
//     doc.rect(0, pageH - FOOTER_H, pageW, FOOTER_H, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
//     const sellerMeta = get(reportData, ['meta', 'params_used', 'sellerName'], '-');
//     doc.text(clean(sellerMeta), margin, pageH - 6);
//     doc.text(`Page ${pageNum}`, pageW / 2, pageH - 6, { align: 'center' });
//     const genAt = get(reportData, ['meta', 'report_generated_at']);
//     doc.text(dateFmt(genAt), pageW - margin, pageH - 6, { align: 'right' });
//   };
//   const addPage = () => { doc.addPage(); y = SAFE_TOP; addHeader(); addFooter(); };
//   const need = (h: number) => { if (y + h > SAFE_BOTTOM) { addPage(); return true; } return false; };
//   const section = (title: string, color: [number, number, number]) => {
//     need(16);
//     doc.setFillColor(...color);
//     doc.rect(margin, y, pageW - margin * 2, 10, 'F');
//     doc.setTextColor(...colors.white);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
//     doc.text(title, margin + 4, y + 7);
//     y += 14;
//   };

//   /** ---------- Cover ---------- **/
//   const sellerFromOpts = clean(opts?.sellerName ?? get(reportData, ['meta', 'params_used', 'sellerName'], '—'));
//   doc.setFillColor(...colors.navyBlue); doc.rect(0, 0, pageW, pageH, 'F');
//   doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.white); doc.setFontSize(24);
//   doc.text('GOVERNMENT', pageW / 2, 58, { align: 'center' });
//   doc.text('TENDER ANALYSIS', pageW / 2, 72, { align: 'center' });
//   doc.setFillColor(25, 50, 85);
//   doc.roundedRect(margin + 10, 90, pageW - (margin + 10) * 2, 14, 3, 3, 'F');
//   doc.setTextColor(...colors.blue); doc.setFont('helvetica', 'normal'); doc.setFontSize(12);
//   doc.text('Comprehensive Performance Report', pageW / 2, 100, { align: 'center' });

//   doc.setTextColor(...colors.white); doc.setFontSize(18);
//   doc.text(sellerFromOpts, pageW / 2, 125, { align: 'center' });

//   doc.setFontSize(10);
//   const genAt = dateFmt(get(reportData, ['meta', 'report_generated_at']));
//   const days = clean(get(reportData, ['meta', 'params_used', 'days'], '-'));
//   const deptParam = clean(get(reportData, ['meta', 'params_used', 'department'], '-')) || '-';
//   doc.text(`Report Generated: ${genAt}`, pageW / 2, 150, { align: 'center' });
//   doc.text(`Analysis Period: ${days} days`, pageW / 2, 158, { align: 'center' });
//   doc.text(`Department: ${deptParam || '-'}`, pageW / 2, 166, { align: 'center' });

//   addPage();

//   /**
//    * ===================================================================
//    * 1. Missed But Winnable (Recent Wins + Market Wins)
//    * ===================================================================
//    */
//   const mbw = get(reportData, ['data', 'missedButWinnable'], {}) || {};
//   const recentWins = asArray<any>(mbw.recentWins);
//   const marketWins = asArray<any>(mbw.marketWins);

//   section('Missed But Winnable - Market Intelligence', colors.blue);

//   if (recentWins.length) {
//     doc.setTextColor(...colors.text); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text(`Recent Wins — ${sellerFromOpts}`, margin, y); y += 8;

//     const body: RowInput[] = recentWins.map((w) => ([
//       clean(w.bid_number),
//       truncate(doc, w.offered_item || w.item, pageW, margin, 60),
//       String(w.quantity ?? 0),
//       currency(w.total_price),
//       clean(w.org),
//       clean(w.dept),
//       dateFmt(w.ended_at),
//     ]));

//     const widths = fitWidths(doc, margin, [28, 64, 12, 26, 34, 36, 22]);
//     autoTable(doc, {
//       ...tableDefaults,
//       startY: y,
//       head: [['Bid Number', 'Item', 'Qty', 'Price', 'Organization', 'Department', 'End Date']],
//       body,
//       margin: shiftedMargin(margin, SAFE_TOP),
//       headStyles: { ...tableDefaults.headStyles, fillColor: colors.blue, textColor: colors.white, fontSize: 8 },
//       columnStyles: {
//         0: { cellWidth: widths[0] },
//         1: { cellWidth: widths[1] },
//         2: { cellWidth: widths[2], halign: 'right' },
//         3: { cellWidth: widths[3], halign: 'right' },
//         4: { cellWidth: widths[4] },
//         5: { cellWidth: widths[5] },
//         6: { cellWidth: widths[6], halign: 'center' },
//       },
//       didDrawPage: () => { addHeader(); addFooter(); },
//     });
//     y = (doc as any).lastAutoTable.finalY + 10;
//   }

//   if (marketWins.length) {
//     need(14);
//     doc.setTextColor(...colors.text); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//     doc.text('Competitor Market Wins', margin, y); y += 8;

//     const body: RowInput[] = marketWins.map((w) => ([
//       clean(w.bid_number),
//       truncate(doc, w.seller_name, pageW, margin, 28),
//       truncate(doc, w.offered_item || w.item, pageW, margin, 48),
//       String(w.quantity ?? 0),
//       currency(w.total_price),
//       clean(w.org),
//       clean(w.dept),
//       dateFmt(w.ended_at),
//     ]));

//     const widths = fitWidths(doc, margin, [24, 28, 48, 12, 26, 30, 30, 20]);
//     autoTable(doc, {
//       ...tableDefaults,
//       startY: y,
//       head: [['Bid', 'Seller', 'Item', 'Qty', 'Price', 'Org', 'Dept', 'End']],
//       body,
//       margin: shiftedMargin(margin, SAFE_TOP),
//       headStyles: { ...tableDefaults.headStyles, fillColor: colors.warn, textColor: colors.white, fontSize: 8 },
//       bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 6.9 },
//       columnStyles: {
//         0: { cellWidth: widths[0] },
//         1: { cellWidth: widths[1] },
//         2: { cellWidth: widths[2] },
//         3: { cellWidth: widths[3], halign: 'right' },
//         4: { cellWidth: widths[4], halign: 'right' },
//         5: { cellWidth: widths[5] },
//         6: { cellWidth: widths[6] },
//         7: { cellWidth: widths[7], halign: 'center' },
//       },
//       didDrawPage: () => { addHeader(); addFooter(); },
//     });
//     y = (doc as any).lastAutoTable.finalY + 10;
//   }

//   /**
//    * ===================================================================
//    * 2. AI (Strategy Summary + Likely Wins + Strategic Affinity + Guidance)
//    *    NOTE: In your payload, AI sits under data.missedButWinnable.ai
//    * ===================================================================
//    */
//   const ai =
//     get(reportData, ['data', 'missedButWinnable', 'ai']) ||
//     get(reportData, ['data', 'ai']) ||
//     get(reportData, ['ai']) ||
//     {};

//   if (Object.keys(ai).length) {
//     addPage();
//     section('AI Strategy Summary', colors.blue);

//     const summary = clean(ai.strategy_summary || ai.strategySummary || ai.summary || '');
//     if (summary !== '-') {
//       const boxW = pageW - margin * 2;
//       const lines = doc.splitTextToSize(summary, boxW - 10);
//       const boxH = Math.max(22, 8 + lines.length * 4.2);

//       doc.setFillColor(...colors.wash);
//       doc.roundedRect(margin, y, boxW, boxH, 3, 3, 'F');
//       doc.setDrawColor(...colors.blue);
//       doc.roundedRect(margin, y, boxW, boxH, 3, 3, 'S');

//       doc.setTextColor(...colors.text); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
//       doc.text(lines, margin + 5, y + 7);
//       y += boxH + 8;
//     }

//     // ---- Likely Wins
//     const likelyWins = asArray<any>(ai.likely_wins || ai.likelyWins || ai.likely || []);
//     if (likelyWins.length) {
//       doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...colors.text);
//       doc.text('Likely Wins - High Probability Opportunities', margin, y); y += 6;

//       for (let i = 0; i < likelyWins.length; i++) {
//         const win = likelyWins[i];

//         const itemText = clean(win.item || win.offered_item || win.item_categories || '-');
//         const reasonText = clean(win.reason || win.win_probability_reason || win.winReason || '-');

//         // measure
//         const itemLines = doc.splitTextToSize(itemText, pageW - margin * 2 - 12);
//         const reasonLines = doc.splitTextToSize(reasonText, pageW - margin * 2 - 12);
//         const boxH = 14 + itemLines.length * 4 + reasonLines.length * 4 + 6; // dynamic height

//         need(boxH + 14); // ensure space for box + optional table header
//         doc.setFillColor(240, 253, 244);
//         doc.setDrawColor(...colors.success);
//         doc.roundedRect(margin, y, pageW - margin * 2, boxH, 2.5, 2.5, 'F');
//         doc.roundedRect(margin, y, pageW - margin * 2, boxH, 2.5, 2.5, 'S');

//         doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...colors.success);
//         doc.text(`Opportunity ${i + 1}`, margin + 4, y + 6);

//         doc.setTextColor(...colors.text); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
//         doc.text('Item:', margin + 4, y + 12);
//         doc.setFont('helvetica', 'normal');
//         doc.text(itemLines, margin + 18, y + 12);

//         doc.setFont('helvetica', 'bold'); doc.text('Reason:', margin + 4, y + 12 + itemLines.length * 4 + 4);
//         doc.setFont('helvetica', 'normal');
//         doc.text(reasonLines, margin + 24, y + 12 + itemLines.length * 4 + 4);

//         // confidence tag (small)
//         const conf = String(win.confidence || '').toUpperCase();
//         if (conf) {
//           const tagW = Math.max(18, doc.getTextWidth(conf) + 8);
//           doc.setFillColor(...colors.white);
//           doc.roundedRect(pageW - margin - tagW - 2, y + 3, tagW, 7, 2, 2, 'F');
//           doc.setDrawColor(...colors.success);
//           doc.roundedRect(pageW - margin - tagW - 2, y + 3, tagW, 7, 2, 2, 'S');
//           doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...colors.success);
//           doc.text(conf, pageW - margin - tagW / 2 - 2, y + 8, { align: 'center' });
//         }

//         y += boxH + 6;

//         // Nested matching_market_wins table
//         const mmw = asArray<any>(win.matching_market_wins || win.matchingMarketWins);
//         if (mmw.length) {
//           if (y + 46 > SAFE_BOTTOM) addPage();
//           const body: RowInput[] = mmw.map((m) => ([
//             clean(m.bid_number || m.bidNumber),
//             clean(m.org || m.organization || m.organisation),
//             clean(m.dept || m.department),
//             String(m.quantity ?? 0),
//             currency(m.total_price || m.price_hint || m.price),
//             conf || '-', // repeat confidence for visibility
//           ]));
//           const widths = fitWidths(doc, margin, [38, 68, 60, 16, 26, 20]);
//           autoTable(doc, {
//             ...tableDefaults,
//             startY: y,
//             head: [['Bid Number', 'Organization', 'Department', 'Qty', 'Price', 'Confidence']],
//             body,
//             theme: 'grid',
//             margin: shiftedMargin(margin, SAFE_TOP),
//             headStyles: { ...tableDefaults.headStyles, fillColor: colors.success, textColor: colors.white, fontSize: 8 },
//             bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7, cellPadding: 2 },
//             columnStyles: {
//               0: { cellWidth: widths[0] },
//               1: { cellWidth: widths[1] },
//               2: { cellWidth: widths[2] },
//               3: { cellWidth: widths[3], halign: 'right' },
//               4: { cellWidth: widths[4], halign: 'right' },
//               5: { cellWidth: widths[5], fontStyle: 'bold', halign: 'center' },
//             },
//             didDrawPage: () => { addHeader(); addFooter(); },
//           });
//           y = (doc as any).lastAutoTable.finalY + 10;
//         }
//       }
//     }

//     // ---- Strategic Affinity Signals
//     addPage();
//     section('Strategic Affinity Signals', colors.blue);

//     const signals = ai.signals || ai.affinitySignals || {};
//     const orgAff = asArray<any>(signals.org_affinity || signals.orgAffinity || []);
//     const deptAff = asArray<any>(signals.dept_affinity || signals.deptAffinity || []);
//     const minAff = asArray<any>(signals.ministry_affinity || signals.ministryAffinity || []);

//     doc.setTextColor(...colors.text); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);

//     doc.text('Organization Affinity', margin, y); y += 8;
//     drawBars(doc, orgAff, {
//       yRef: () => y,
//       setY: (ny) => { y = ny; },
//       labelKeyCandidates: ['org_name', 'name'],
//       valueKeyCandidates: ['count', 'wins', 'win_count'],
//       pageW, margin, SAFE_BOTTOM,
//     });

//     doc.text('Department Affinity', margin, y); y += 8;
//     drawBars(doc, deptAff, {
//       yRef: () => y,
//       setY: (ny) => { y = ny; },
//       labelKeyCandidates: ['dept_name', 'name'],
//       valueKeyCandidates: ['count', 'wins', 'win_count'],
//       pageW, margin, SAFE_BOTTOM,
//     });

//     doc.text('Ministry Affinity', margin, y); y += 8;
//     drawBars(doc, minAff, {
//       yRef: () => y,
//       setY: (ny) => { y = ny; },
//       labelKeyCandidates: ['ministry_name', 'name'],
//       valueKeyCandidates: ['count', 'wins', 'win_count'],
//       pageW, margin, SAFE_BOTTOM,
//     });

//     if (y + 20 > SAFE_BOTTOM) addPage();
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...colors.text);
//     doc.text('Quantity & Price Range Patterns', margin, y); y += 7;
//     doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
//     const qtyRange = clean(signals.quantity_range || signals.quantityRange || '-');
//     const priceRange = clean(signals.price_range || signals.priceRange || '-');
//     doc.text(`Quantity Range: ${qtyRange}`, margin, y); y += 6;
//     doc.text(`Price Range: ${priceRange}`, margin, y); y += 4;

//     // ---- Strategic Roadmap
//     addPage();
//     section('Strategic Roadmap & Action Items', colors.success);

//     const nextSteps = asArray<string>(
//       get(ai, ['guidance', 'next_steps']) || get(ai, ['guidance', 'nextSteps']) || ai.next_steps || ai.nextSteps || []
//     );
//     const expAreas = asArray<string>(
//       get(ai, ['guidance', 'expansion_areas']) || get(ai, ['guidance', 'expansionAreas']) || ai.expansion_areas || ai.expansionAreas || []
//     );

//     if (nextSteps.length) {
//       doc.setTextColor(...colors.text); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//       doc.text('Next Steps - Action Plan', margin, y); y += 6;
//       for (let i = 0; i < nextSteps.length; i++) {
//         const s = clean(nextSteps[i]);
//         const lines = doc.splitTextToSize(s, pageW - margin * 2 - 14);
//         const boxH = 10 + lines.length * 4;

//         need(boxH + 4);
//         doc.setFillColor(240, 253, 244);
//         doc.setDrawColor(...colors.success);
//         doc.roundedRect(margin, y, pageW - margin * 2, boxH, 2, 2, 'F');
//         doc.roundedRect(margin, y, pageW - margin * 2, boxH, 2, 2, 'S');

//         doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.success); doc.setFontSize(9);
//         doc.text(`${i + 1}.`, margin + 4, y + 6);
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.text); doc.setFontSize(8);
//         doc.text(lines, margin + 12, y + 6);
//         y += boxH + 6;
//       }
//     }

//     if (expAreas.length) {
//       if (y + 10 > SAFE_BOTTOM) addPage();
//       doc.setTextColor(...colors.text); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//       doc.text('Expansion Opportunities', margin, y); y += 6;
//       for (const s of expAreas) {
//         const text = `• ${clean(s)}`;
//         const lines = doc.splitTextToSize(text, pageW - margin * 2 - 8);
//         const boxH = 8 + lines.length * 4;
//         need(boxH + 4);
//         doc.setFillColor(239, 246, 255);
//         doc.roundedRect(margin, y, pageW - margin * 2, boxH, 2, 2, 'F');
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.text); doc.setFontSize(8);
//         doc.text(lines, margin + 4, y + 5);
//         y += boxH + 6;
//       }
//     }
//   }

//   /**
//    * ===================================================================
//    * 3. Category Distribution
//    * ===================================================================
//    */
//   const cat = get(reportData, ['data', 'categoryListing']) || {};
//   const categories = asArray<any>(cat.categories);
//   if (categories.length) {
//     addPage();
//     section('Category-wise Tender Distribution', colors.blue);

//     doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.text); doc.setFontSize(9);
//     doc.text('Tender Categories by Volume', margin, y); y += 8;

//     const vals = categories.map(c => Number(c.times || 0));
//     const maxTimes = Math.max(1, ...vals);

//     y = drawBarList(doc, categories, {
//       yStart: y,
//       margin,
//       pageW,
//       SAFE_BOTTOM,
//       labelPicker: (c: any) => clean(c.category),
//       valuePicker: (c: any) => Number(c.times || 0),
//       maxBars: 20,
//       maxVal: maxTimes,
//     }) + 6;
//   }

//   /**
//    * ===================================================================
//    * 4. Top Sellers by Department
//    * ===================================================================
//    */
//   const ts = get(reportData, ['data', 'topSellersByDept']);
//   if (ts?.departments?.length) {
//     addPage();
//     section('Leading Competitors - ' + (deptParam || '-'), colors.warn);

//     const firstDept = ts.departments[0];
//     if (firstDept?.results?.length) {
//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.text); doc.setFontSize(9);
//       doc.text('Top Sellers by Participation Count', margin, y); y += 8;

//       const rows: RowInput[] = firstDept.results.slice(0, 10).map((s: any, i: number) => {
//         const rank = s.rank ?? i + 1;
//         const disp = i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : String(rank);
//         return [disp, clean(s.seller_name), (s.participation_count ?? 0).toLocaleString()];
//       });

//       const widths = fitWidths(doc, margin, [18, 120, 30]);
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Rank', 'Seller Name', 'Participation']],
//         body: rows,
//         margin: shiftedMargin(margin, SAFE_TOP),
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.warn, textColor: colors.white, fontSize: 8.5 },
//         columnStyles: {
//           0: { cellWidth: widths[0], halign: 'center', fontStyle: 'bold' },
//           1: { cellWidth: widths[1] },
//           2: { cellWidth: widths[2], halign: 'right', fontStyle: 'bold' },
//         },
//         didDrawPage: () => { addHeader(); addFooter(); },
//       });
//       y = (doc as any).lastAutoTable.finalY + 8;
//     }
//   }

//   /**
//    * ===================================================================
//    * 5. Seller Bids Summary
//    * ===================================================================
//    */
//   const sellerBids = get(reportData, ['data', 'sellerBids']) || {};
//   if (Object.keys(sellerBids).length) {
//     addPage();
//     section(`${sellerFromOpts} - Bidding Performance Deep Dive`, colors.blue);

//     const t1 = sellerBids.table1 || {};
//     if (Object.keys(t1).length) {
//       const cardW = (pageW - margin * 2 - 10) / 3;
//       const cardH = 24;
//       let x = margin;

//       const firstRow = [
//         { label: 'Total Wins', val: (t1.win ?? 0).toLocaleString(), color: colors.success, bg: [240, 253, 244] as [number, number, number] },
//         { label: 'Total Lost', val: (t1.lost ?? 0).toLocaleString(), color: colors.danger, bg: [254, 226, 226] as [number, number, number] },
//         {
//           label: 'Win Rate',
//           val: (t1.win != null && t1.lost != null && (t1.win + t1.lost) > 0)
//             ? `${((t1.win / (t1.win + t1.lost)) * 100).toFixed(1)}%` : '-',
//           color: colors.blue, bg: [239, 246, 255] as [number, number, number],
//         },
//       ];
//       firstRow.forEach((c) => {
//         doc.setFillColor(...c.bg); doc.roundedRect(x, y, cardW, cardH, 2, 2, 'F');
//         doc.setFont('helvetica', 'bold'); doc.setTextColor(...c.color); doc.setFontSize(14);
//         doc.text(c.val, x + cardW / 2, y + 13, { align: 'center' });
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.mid); doc.setFontSize(8);
//         doc.text(c.label, x + cardW / 2, y + 20, { align: 'center' });
//         x += cardW + 5;
//       });
//       y += cardH + 10;

//       x = margin;
//       const secondRow = [
//         { label: 'Total Bid Value', val: currency(t1.totalBidValue), color: colors.warn, bg: [254, 243, 199] as [number, number, number] },
//         { label: 'Qualified Bid Value', val: currency(t1.qualifiedBidValue), color: colors.success, bg: [240, 253, 244] as [number, number, number] },
//         { label: 'Avg Order Value', val: currency(t1.averageOrderValue), color: [138, 43, 226] as [number, number, number], bg: [243, 232, 255] as [number, number, number] },
//       ];
//       secondRow.forEach((c) => {
//         doc.setFillColor(...c.bg); doc.roundedRect(x, y, cardW, cardH, 2, 2, 'F');
//         doc.setFont('helvetica', 'bold'); doc.setTextColor(...c.color); doc.setFontSize(11);
//         const v = (c.val || '').slice(0, 22);
//         doc.text(v || '-', x + cardW / 2, y + 13, { align: 'center' });
//         doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.mid); doc.setFontSize(8);
//         doc.text(c.label, x + cardW / 2, y + 20, { align: 'center' });
//         x += cardW + 5;
//       });
//       y += cardH + 12;
//     }

//     // Revenue by Department (from sellerBids.departmentCount)
//     const deptCountsObj = sellerBids.departmentCount || {};
//     const deptRows = (() => {
//       if (Array.isArray(deptCountsObj)) return deptCountsObj;
//       const counts = deptCountsObj.departmentCount || {};
//       const revs = deptCountsObj.revenue || {};
//       const names = Array.from(new Set([...Object.keys(counts), ...Object.keys(revs)]));
//       return names.map((name) => ({
//         department: name,
//         bid_count: counts[name] ?? 0,
//         revenue: revs[name] ?? 0,
//       }));
//     })();

//     if (deptRows.length) {
//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.text); doc.setFontSize(10);
//       doc.text('Revenue by Department', margin, y); y += 8;

//       const sorted = [...deptRows].sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0));
//       const body: RowInput[] = sorted.map((d) => [
//         clean(d.department),
//         (d.bid_count ?? 0).toLocaleString(),
//         currency(d.revenue ?? 0),
//       ]);
//       // totals
//       const totalRev = sorted.reduce((s, d) => s + (Number(d.revenue) || 0), 0);
//       const totalBids = sorted.reduce((s, d) => s + (Number(d.bid_count) || 0), 0);
//       body.push(['TOTAL', totalBids.toLocaleString(), currency(totalRev)]);

//       const widths = fitWidths(doc, margin, [120, 28, 36]);
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['Department', 'Bid Count', 'Revenue']],
//         body,
//         margin: shiftedMargin(margin, SAFE_TOP),
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.blue, textColor: colors.white, fontSize: 8 },
//         columnStyles: { 0: { cellWidth: widths[0] }, 1: { cellWidth: widths[1], halign: 'right' }, 2: { cellWidth: widths[2], halign: 'right', fontStyle: 'bold' } },
//         didDrawPage: () => { addHeader(); addFooter(); },
//       });
//       y = (doc as any).lastAutoTable.finalY + 10;
//     }

//     // Bids by State (even when only "Unknown")
//     const stateCountObj = sellerBids.stateCount || {};
//     const stateRows = (() => {
//       if (Array.isArray(stateCountObj)) return stateCountObj;
//       const counts = stateCountObj.stateCounts || {};
//       const revs = stateCountObj.stateRevenue || {};
//       const names = Array.from(new Set([...Object.keys(counts), ...Object.keys(revs)]));
//       return names.map((name) => ({
//         state: name,
//         bid_count: counts[name] ?? 0,
//         revenue: revs[name] ?? 0,
//       }));
//     })();

//     if (stateRows.length) {
//       if (y + 20 > SAFE_BOTTOM) addPage();
//       doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.text); doc.setFontSize(10);
//       doc.text('Bids by State', margin, y); y += 8;

//       const body: RowInput[] = [...stateRows]
//         .sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0))
//         .slice(0, 20)
//         .map((s) => [clean(s.state), (s.bid_count ?? 0).toLocaleString(), currency(s.revenue ?? 0)]);

//       const widths = fitWidths(doc, margin, [100, 28, 44]);
//       autoTable(doc, {
//         ...tableDefaults,
//         startY: y,
//         head: [['State', 'Bid Count', 'Revenue']],
//         body,
//         theme: 'grid',
//         margin: shiftedMargin(margin, SAFE_TOP),
//         headStyles: { ...tableDefaults.headStyles, fillColor: colors.success, textColor: colors.white, fontSize: 8 },
//         columnStyles: { 0: { cellWidth: widths[0] }, 1: { cellWidth: widths[1], halign: 'right' }, 2: { cellWidth: widths[2], halign: 'right' } },
//         didDrawPage: () => { addHeader(); addFooter(); },
//       });
//       y = (doc as any).lastAutoTable.finalY + 8;
//     }
//   }

//   return doc;
// };

// /** ========================= TEXT & CHART UTILS ========================= **/

// function truncate(doc: jsPDF, v: any, pageW: number, margin: number, targetChars = 48) {
//   const s = clean(v);
//   if (s === '-') return s;
//   if (s.length <= targetChars) return s;
//   // extra safety: split to size relative to printable width
//   const lines = doc.splitTextToSize(s, pageW - margin * 2 - 12);
//   const first = Array.isArray(lines) ? lines[0] : s.slice(0, targetChars);
//   return first.length < s.length ? first + '…' : first;
// }

// function drawBars(
//   doc: jsPDF,
//   items: any[],
//   cfg: {
//     yRef: () => number,
//     setY: (y: number) => void,
//     labelKeyCandidates: string[],
//     valueKeyCandidates: string[],
//     pageW: number,
//     margin: number,
//     SAFE_BOTTOM: number,
//     maxBars?: number
//   }
// ) {
//   const {
//     yRef, setY, labelKeyCandidates, valueKeyCandidates, pageW, margin, SAFE_BOTTOM, maxBars = 6,
//   } = cfg;

//   const pickLabel = (obj: any) => {
//     for (const k of labelKeyCandidates) if (obj && obj[k] != null) return clean(obj[k]);
//     return clean(obj?.name ?? obj?.title ?? '-');
//   };
//   const pickValue = (obj: any) => {
//     for (const k of valueKeyCandidates) {
//       const n = toNum(obj?.[k]);
//       if (n != null) return n;
//     }
//     return 0;
//   };

//   const data = items
//     .map(x => ({ label: pickLabel(x), val: pickValue(x) }))
//     .filter(d => d.label !== '-' && Number.isFinite(d.val))
//     .sort((a, b) => b.val - a.val)
//     .slice(0, maxBars);

//   if (!data.length) {
//     doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(...colors.mid);
//     doc.text('No data available', margin, yRef() + 1);
//     setY(yRef() + 10);
//     return;
//   }

//   const maxVal = Math.max(1, ...data.map(d => d.val));
//   const labelColW = 110;
//   const valColW = 18;
//   const barX = margin + labelColW + valColW + 6;
//   const barW = pageW - barX - margin;

//   for (const d of data) {
//     if (yRef() + 12 > SAFE_BOTTOM) { doc.addPage(); addHeaderFooter(doc); setY(HEADER_PAD()); }
//     // label
//     doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...colors.text);
//     const lbl = doc.splitTextToSize(d.label, labelColW - 2);
//     const labelToDraw = Array.isArray(lbl) ? String(lbl[0]) : d.label;
//     doc.text(labelToDraw, margin, yRef());

//     // value
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...colors.blue);
//     doc.text(String(d.val), margin + labelColW + valColW, yRef(), { align: 'right' });

//     // background bar
//     doc.setFillColor(...colors.light);
//     doc.roundedRect(barX, yRef() - 4.5, barW, 7, 1.5, 1.5, 'F');

//     // value bar
//     const w = Math.max(0, (d.val / maxVal) * barW);
//     doc.setFillColor(...colors.blue);
//     doc.roundedRect(barX, yRef() - 4.5, w, 7, 1.5, 1.5, 'F');

//     setY(yRef() + 9);
//   }
//   setY(yRef() + 4);

//   // Local helpers to re-add header/footer when we paginate inside bar drawer
//   function HEADER_PAD() { return 18 + 6; /* HEADER_H + 6 */ }
//   function addHeaderFooter(d: jsPDF) {
//     const pageW = d.internal.pageSize.getWidth();
//     const pageH = d.internal.pageSize.getHeight();
//     const HEADER_H = 18, FOOTER_H = 12;

//     // header
//     d.setFillColor(...colors.navyBlue);
//     d.rect(0, 0, pageW, HEADER_H, 'F');
//     d.setTextColor(...colors.white);
//     d.setFont('helvetica', 'bold'); d.setFontSize(10);
//     d.text('GOVERNMENT TENDER ANALYSIS', pageW / 2, 11, { align: 'center' });

//     // footer
//     const pageNum =
//       (d as any).getCurrentPageInfo?.().pageNumber ??
//       (d as any).internal?.getNumberOfPages?.();
//     d.setFillColor(...colors.navyBlue);
//     d.rect(0, pageH - FOOTER_H, pageW, FOOTER_H, 'F');
//     d.setTextColor(...colors.white);
//     d.setFont('helvetica', 'normal'); d.setFontSize(7);
//     d.text(`Page ${pageNum}`, pageW / 2, pageH - 6, { align: 'center' });
//   }
// }

// function drawBarList(
//   doc: jsPDF,
//   items: any[],
//   cfg: {
//     yStart: number,
//     margin: number,
//     pageW: number,
//     SAFE_BOTTOM: number,
//     labelPicker: (item: any) => string,
//     valuePicker: (item: any) => number,
//     maxBars?: number,
//     maxVal?: number,
//   }
// ) {
//   const { yStart, margin, pageW, SAFE_BOTTOM, labelPicker, valuePicker, maxBars = 20 } = cfg;
//   let y = yStart;

//   const data = items
//     .map((c) => ({ label: labelPicker(c), val: valuePicker(c) }))
//     .filter(d => d.label !== '-' && Number.isFinite(d.val))
//     .sort((a, b) => b.val - a.val)
//     .slice(0, maxBars);

//   if (!data.length) {
//     doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(...colors.mid);
//     doc.text('No data available', margin, y + 1);
//     return y + 10;
//   }

//   const maxVal = Math.max(1, ...data.map(d => d.val));
//   const labelColW = 110;
//   const valColW = 18;
//   const barX = margin + labelColW + valColW + 6;
//   const barW = pageW - barX - margin;

//   for (const d of data) {
//     if (y + 12 > SAFE_BOTTOM) {
//       doc.addPage(); y = 18 + 6; // header padding
//       // header
//       doc.setFillColor(...colors.navyBlue);
//       doc.rect(0, 0, pageW, 18, 'F');
//       doc.setTextColor(...colors.white);
//       doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
//       doc.text('GOVERNMENT TENDER ANALYSIS', pageW / 2, 11, { align: 'center' });
//       // footer
//       const pageNum =
//         (doc as any).getCurrentPageInfo?.().pageNumber ??
//         (doc as any).internal?.getNumberOfPages?.();
//       doc.setFillColor(...colors.navyBlue);
//       doc.rect(0, doc.internal.pageSize.getHeight() - 12, pageW, 12, 'F');
//       doc.setTextColor(...colors.white);
//       doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
//       doc.text(`Page ${pageNum}`, pageW / 2, doc.internal.pageSize.getHeight() - 6, { align: 'center' });
//     }

//     doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...colors.text);
//     const lbl = doc.splitTextToSize(d.label, labelColW - 2);
//     doc.text(Array.isArray(lbl) ? lbl[0] : d.label, margin, y);

//     doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...colors.blue);
//     doc.text(String(d.val), margin + labelColW + valColW, y, { align: 'right' });

//     doc.setFillColor(...colors.light);
//     doc.roundedRect(barX, y - 4.5, barW, 7, 1.5, 1.5, 'F');

//     const w = Math.max(0, (d.val / maxVal) * barW);
//     doc.setFillColor(...colors.blue);
//     doc.roundedRect(barX, y - 4.5, w, 7, 1.5, 1.5, 'F');

//     y += 9;
//   }
//   return y + 4;
// }

// src/utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

/** ========================= TYPES ========================= **/
type AnyObj = Record<string, any>;

export interface ReportData {
  meta?: {
    report_generated_at?: string;
    params_used?: AnyObj;
  };
  data?: AnyObj;
}

/** ========================= COLORS ========================= **/
const colors = {
  white: [255, 255, 255] as [number, number, number],
  text: [33, 37, 41] as [number, number, number],
  mid: [100, 116, 139] as [number, number, number],
  light: [148, 163, 184] as [number, number, number],
  line: [226, 232, 240] as [number, number, number],
  wash: [247, 250, 255] as [number, number, number],

  blue: [37, 99, 235] as [number, number, number],
  green: [5, 150, 105] as [number, number, number],
  red: [220, 38, 38] as [number, number, number],
  orange: [217, 119, 6] as [number, number, number],

  success: [16, 185, 129] as [number, number, number],
  warn: [234, 179, 8] as [number, number, number],
};

/** ========================= UTILS ========================= **/
const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);

// Tiny safe getter that supports string path or array path
const get = (obj: AnyObj, path: (string | number)[] | string, dflt?: any) => {
  if (!obj) return dflt;
  const parts = Array.isArray(path) ? path : String(path).split('.');
  let cur: any = obj;
  for (const p of parts) {
    if (cur == null) return dflt;
    cur = cur[p as any];
  }
  return cur ?? dflt;
};

const asArray = <T = any>(v: any): T[] => {
  if (v == null) return [];
  if (Array.isArray(v)) return v as T[];
  return [v as T];
};

const clean = (v: any) => {
  if (v == null) return '-';
  if (typeof v === 'string') {
    const s = v.replace(/\s+/g, ' ').trim();
    return s.length ? s : '-';
  }
  if (typeof v === 'number') return `${v}`;
  return JSON.stringify(v);
};

const toNum = (v: any): number | undefined => {
  if (v == null) return undefined;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : undefined;
};

const currency = (v: any, symbol = '₹') => {
  const n = toNum(v);
  if (n == null) return '-';
  // Indian number format
  const s = Math.round(n).toString();
  const last3 = s.slice(-3);
  const other = s.slice(0, -3);
  const withCommas = other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (other ? ',' : '') + last3;
  return `${symbol}${withCommas}`;
};

const percent = (num: number, den: number) => {
  if (!den) return '-';
  return `${((num / den) * 100).toFixed(1)}%`;
};

/** ============ PICKERS (robust for multiple backend shapes) ============ **/
const pick = (obj: AnyObj, ...candidates: (string | (string | number)[])[]) => {
  for (const c of candidates) {
    const path = Array.isArray(c) ? c : (c as string).split('.');
    const v = get(obj, path);
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return undefined;
};

const toUpperSafe = (v: any, dflt: string) => {
  const s = String(v ?? dflt).trim();
  return s ? s.toUpperCase() : dflt.toUpperCase();
};

/** ========================= PAGE / LAYOUT ========================= **/
const pageW = 210;
const pageH = 297;
const margin = 12;
const SAFE_TOP = 18;
const SAFE_BOTTOM = pageH - 18;

let doc: jsPDF;
let y = SAFE_TOP;

const addHeader = () => {
  doc.setDrawColor(...colors.line);
  doc.setLineWidth(0.2);
  doc.line(margin, SAFE_TOP - 8, pageW - margin, SAFE_TOP - 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...colors.blue);
  doc.text('Bid Intelligence Report', margin, SAFE_TOP - 11);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.mid);
  doc.setFontSize(8);
  doc.text(`Generated ${new Date().toLocaleString()}`, pageW - margin, SAFE_TOP - 11, { align: 'right' });
};

const addFooter = () => {
  const p = doc.getNumberOfPages();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...colors.mid);
  doc.text(`Page ${p}`, pageW / 2, pageH - 8, { align: 'center' });
};

const addPage = () => {
  if (doc.getNumberOfPages() > 0) {
    doc.addPage();
  }
  addHeader();
  addFooter();
  y = SAFE_TOP;
};

const need = (h: number) => {
  if (y + h > SAFE_BOTTOM) addPage();
};

const section = (title: string, color: [number, number, number] = colors.blue) => {
  need(14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...color);
  doc.text(title, margin, y);
  y += 6;
  doc.setDrawColor(...colors.line);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
};

const tableDefaults = {
  theme: 'grid' as const,
  styles: { font: 'helvetica', fontSize: 8, cellPadding: 3, lineColor: colors.line },
  headStyles: { fillColor: colors.blue, textColor: colors.white, fontStyle: 'bold' as const },
  bodyStyles: { textColor: colors.text },
  margin: { left: margin, right: margin },
};

const fitWidths = (theDoc: jsPDF, m: number, base: number[]) => {
  const total = base.reduce((a, b) => a + b, 0);
  const room = pageW - m * 2;
  const ratio = room / total;
  return base.map((n) => Math.floor(n * ratio));
};

const shiftedMargin = (m: number, safeTop: number) => ({
  left: m,
  right: m,
  top: safeTop,
  bottom: pageH - SAFE_BOTTOM,
});

/** ========================= MAIN EXPORT ========================= **/
export function generateBidReport(reportData: ReportData): jsPDF {
  // Initialize
  doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  addHeader(); addFooter();

  /** ------------ COVER ------------- */
  section('Cover');
  {
    const seller = clean(pick(reportData, 'meta.params_used.sellerName', ['meta','params_used','seller'], ['data','seller']) ?? 'N/A');
    const days = pick(reportData, 'meta.params_used.days') ?? '-';
    const limit = pick(reportData, 'meta.params_used.limit') ?? '-';
    const generated = clean(pick(reportData, 'meta.report_generated_at') ?? new Date().toISOString());

    doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(...colors.text);
    doc.text(seller, margin, y + 10);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...colors.mid);
    doc.text(`Analysis Window: ${days} days • Limit: ${limit} • Generated: ${generated}`, margin, y + 16);

    y += 24;

    // quick chips
    const chips: string[] = [];
    const department = clean(pick(reportData, 'meta.params_used.department') ?? '—');
    const offeredItem = clean(pick(reportData, 'meta.params_used.offeredItem') ?? '—');
    const mode = clean(pick(reportData, 'meta.params_used.mode') ?? 'contains');

    chips.push(`Department: ${department}`);
    chips.push(`Offered Item: ${offeredItem}`);
    chips.push(`Query Mode: ${mode}`);

    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...colors.text);
    doc.text('Parameters', margin, y); y += 8;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8);

    let cx = margin;
    for (const c of chips) {
      const w = doc.getTextWidth(c) + 8;
      if (cx + w > pageW - margin) { y += 8; cx = margin; }
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(...colors.line);
      doc.roundedRect(cx, y - 5, w, 7, 2, 2, 'FD');
      doc.text(c, cx + 4, y);
      cx += w + 4;
    }
    y += 10;
  }

  /** ------------ MISSED BUT WINNABLE / RECENT WINS ------------- */
  section('Missed But Winnable & Market Context', colors.blue);
  {
    const mbw = pick(reportData, 'data.missedButWinnable') as AnyObj || {};
    const recentWins = asArray<any>(pick(mbw, 'recentWins', ['wins','recent'])) || [];
    const marketWins = asArray<any>(pick(mbw, 'marketWins', ['market','wins'])) || [];

    if (recentWins.length) {
      const widths = fitWidths(doc, margin, [34, 68, 50, 14, 26]);
      autoTable(doc, {
        ...tableDefaults,
        startY: y,
        head: [['Bid No', 'Item', 'Org / Dept', 'Qty', 'Price']],
        body: recentWins.map<RowInput>((r) => ([
          clean(pick(r, 'bid_number', 'bidNo', 'id') ?? ''),
          clean(pick(r, 'offered_item', 'item') ?? ''),
          `${clean(pick(r, 'org', 'organisation', 'organization') ?? '')} / ${clean(pick(r,'dept','department') ?? '')}`,
          String(toNum(pick(r, 'quantity')) ?? 0),
          currency(pick(r, 'total_price', 'value')),
        ])),
        columnStyles: {
          0: { cellWidth: widths[0] },
          1: { cellWidth: widths[1] },
          2: { cellWidth: widths[2] },
          3: { cellWidth: widths[3], halign: 'right' },
          4: { cellWidth: widths[4], halign: 'right' },
        },
        didDrawPage: () => { addHeader(); addFooter(); },
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    if (marketWins.length) {
      need(12);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.text); doc.setFontSize(10);
      doc.text('Market Wins (Similar Items)', margin, y); y += 4;
      const widths2 = fitWidths(doc, margin, [34, 62, 48, 14, 26]);
      autoTable(doc, {
        ...tableDefaults,
        startY: y,
        head: [['Bid No', 'Item', 'Org / Dept', 'Qty', 'Price']],
        body: marketWins.map<RowInput>((r) => ([
          clean(pick(r, 'bid_number', 'bidNo', 'id') ?? ''),
          clean(pick(r, 'offered_item', 'item') ?? ''),
          `${clean(pick(r, 'org', 'organisation', 'organization') ?? '')} / ${clean(pick(r,'dept','department') ?? '')}`,
          String(toNum(pick(r, 'quantity')) ?? 0),
          currency(pick(r, 'total_price', 'value')),
        ])),
        columnStyles: {
          0: { cellWidth: widths2[0] },
          1: { cellWidth: widths2[1] },
          2: { cellWidth: widths2[2] },
          3: { cellWidth: widths2[3], halign: 'right' },
          4: { cellWidth: widths2[4], halign: 'right' },
        },
        didDrawPage: () => { addHeader(); addFooter(); },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  /** ------------ AI SECTION (robust pickers) ------------- */
  {
    // addPage();
    // section('AI Strategy Summary', colors.blue);

    // const ai =
    //   (pick(reportData as AnyObj, ['data','missedButWinnable','ai'], ['data','ai'], 'ai') as AnyObj) || {};

    // // summary
    // {
    //   const summary = clean(
    //     pick(ai, 'strategy_summary', 'summary', 'overview', ['guidance','summary']) ?? ''
    //   );
    //   if (summary !== '-') {
    //     const boxW = pageW - margin * 2;
    //     const lines = doc.splitTextToSize(summary, boxW - 10);
    //     const boxH = Math.max(22, 8 + (lines as string[]).length * 4.2);
    //     doc.setFillColor(...colors.wash);
    //     doc.roundedRect(margin, y, boxW, boxH, 3, 3, 'F');
    //     doc.setDrawColor(...colors.blue);
    //     doc.roundedRect(margin, y, boxW, boxH, 3, 3, 'S');
    //     doc.setTextColor(...colors.text); doc.setFont('helvetica','normal'); doc.setFontSize(8);
    //     doc.text(lines as string[], margin + 5, y + 7);
    //     y += boxH + 8;
    //   }
    // }

    // ---------- Likely Wins (handles both likely_wins and likelyWins) ----------
    // {
    //   const lwArr =
    //     asArray<any>(pick(ai, 'likely_wins', 'likelyWins', ['opportunities','likely'])) || [];

    //   if (lwArr.length) {
    //     doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(...colors.text);
    //     doc.text('Likely Wins - High Probability Opportunities', margin, y); y += 6;

    //     for (let i = 0; i < lwArr.length; i++) {
    //       const win = lwArr[i];

    //       const itemText = clean(pick(win, 'item', 'offered_item', 'title', 'name', ['item','text']) ?? '');
    //       const reasonText = clean(pick(win, 'reason', 'why', 'rationale', 'details', 'explanation') ?? '-');
    //       const confidence = toUpperSafe(pick(win, 'confidence', 'confidence_score', 'score'), 'MEDIUM');

    //       const itemLines = doc.splitTextToSize(itemText, pageW - margin * 2 - 12);
    //       const reasonLines = doc.splitTextToSize(reasonText, pageW - margin * 2 - 12);
    //       const boxH = 14 + (itemLines as string[]).length * 4 + (reasonLines as string[]).length * 4 + 6;

    //       need(boxH + 14);
    //       doc.setFillColor(240,253,244);
    //       doc.setDrawColor(...colors.success);
    //       doc.roundedRect(margin, y, pageW - margin * 2, boxH, 2.5, 2.5, 'F');
    //       doc.roundedRect(margin, y, pageW - margin * 2, boxH, 2.5, 2.5, 'S');

    //       doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(...colors.success);
    //       doc.text(`Opportunity ${i + 1}`, margin + 4, y + 6);

    //       doc.setTextColor(...colors.text); doc.setFont('helvetica','bold'); doc.setFontSize(8);
    //       doc.text('Item:', margin + 4, y + 12);
    //       doc.setFont('helvetica','normal');
    //       doc.text(itemLines as string[], margin + 18, y + 12);

    //       doc.setFont('helvetica','bold'); doc.text('Reason:', margin + 4, y + 12 + (itemLines as string[]).length * 4 + 4);
    //       doc.setFont('helvetica','normal');
    //       doc.text(reasonLines as string[], margin + 24, y + 12 + (itemLines as string[]).length * 4 + 4);

    //       // confidence tag
    //       const tagW = Math.max(18, doc.getTextWidth(confidence) + 8);
    //       doc.setFillColor(...colors.white);
    //       doc.roundedRect(pageW - margin - tagW - 2, y + 3, tagW, 7, 2, 2, 'F');
    //       doc.setDrawColor(...colors.success);
    //       doc.roundedRect(pageW - margin - tagW - 2, y + 3, tagW, 7, 2, 2, 'S');
    //       doc.setFont('helvetica','bold'); doc.setFontSize(7);
    //       if (confidence === 'HIGH') doc.setTextColor(...colors.success);
    //       else if (confidence === 'MEDIUM') doc.setTextColor(...colors.warn);
    //       else doc.setTextColor(...colors.mid);
    //       doc.text(confidence, pageW - margin - tagW / 2 - 2, y + 8, { align: 'center' });

    //       y += boxH + 6;

    //       // matching market wins (support multiple shapes)
    //       const mmw = asArray<any>(
    //         pick(win, 'matching_market_wins', 'matchingMarketWins', 'matches', ['related','market_wins'])
    //       );
    //       if (mmw.length) {
    //         if (y + 46 > SAFE_BOTTOM) addPage();
    //         const body: RowInput[] = mmw.map((m) => ([
    //           clean(pick(m, 'bid_number', 'bidNo', 'bid', 'original_b_id') ?? ''),
    //           clean(pick(m, 'org', 'organization', 'organisation') ?? ''),
    //           clean(pick(m, 'dept', 'department') ?? ''),
    //           String(toNum(pick(m, 'quantity', 'qty')) ?? 0),
    //           currency(pick(m, 'total_price', 'value', 'price')),
    //           confidence,
    //         ]));
    //         const widths = fitWidths(doc, margin, [38, 68, 60, 16, 26, 20]);
    //         autoTable(doc, {
    //           ...tableDefaults,
    //           startY: y,
    //           head: [['Bid Number', 'Organization', 'Department', 'Qty', 'Price', 'Confidence']],
    //           body,
    //           theme: 'grid',
    //           margin: shiftedMargin(margin, SAFE_TOP),
    //           headStyles: { ...tableDefaults.headStyles, fillColor: colors.success, textColor: colors.white, fontSize: 8 },
    //           bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7, cellPadding: 2 },
    //           columnStyles: {
    //             0: { cellWidth: widths[0] },
    //             1: { cellWidth: widths[1] },
    //             2: { cellWidth: widths[2] },
    //             3: { cellWidth: widths[3], halign: 'right' },
    //             4: { cellWidth: widths[4], halign: 'right' },
    //             5: { cellWidth: widths[5], fontStyle: 'bold', halign: 'center' },
    //           },
    //           didDrawPage: () => { addHeader(); addFooter(); },
    //         });
    //         y = (doc as any).lastAutoTable.finalY + 10;
    //       }
    //     }
    //   }
    // }

    // // ---------- Strategic Affinity Signals (snake_case + camelCase) ----------
    // addPage();
    // section('Strategic Affinity Signals', colors.blue);

    // {
    //   const signals = (pick(ai, 'signals', 'affinity', 'stats') as AnyObj) || {};
    //   const orgAff = asArray<any>(pick(signals, 'org_affinity', 'orgAffinity'));
    //   const deptAff = asArray<any>(pick(signals, 'dept_affinity', 'deptAffinity'));
    //   const minAff  = asArray<any>(pick(signals, 'ministry_affinity', 'ministryAffinity'));

    //   const renderAff = (
    //     title: string,
    //     rows: any[],
    //     pickName: (r:any)=>string,
    //     pickCount: (r:any)=>number,
    //     pickTotal: (r:any)=>any,
    //     pickAvg: (r:any)=>any
    //   ) => {
    //     if (!rows?.length) return;
    //     doc.setTextColor(...colors.text); doc.setFont('helvetica','bold'); doc.setFontSize(10);
    //     doc.text(title, margin, y); y += 7;

    //     const body: RowInput[] = rows.map((r) => [
    //       clean(pickName(r)),
    //       (toNum(pickCount(r)) || 0).toString(),
    //       currency(pickTotal(r)),
    //       currency(pickAvg(r)),
    //     ]);

    //     const widths = fitWidths(doc, margin, [85, 20, 35, 35]);
    //     autoTable(doc, {
    //       ...tableDefaults,
    //       startY: y,
    //       head: [['Name', 'Count', 'Total Value', 'Avg Value']],
    //       body,
    //       margin: shiftedMargin(margin, SAFE_TOP),
    //       headStyles: { ...tableDefaults.headStyles, fillColor: colors.blue, textColor: colors.white, fontSize: 8 },
    //       bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7.5 },
    //       columnStyles: {
    //         0: { cellWidth: widths[0] },
    //         1: { cellWidth: widths[1], halign: 'center', fontStyle: 'bold' },
    //         2: { cellWidth: widths[2], halign: 'right' },
    //         3: { cellWidth: widths[3], halign: 'right' },
    //       },
    //       didDrawPage: () => { addHeader(); addFooter(); },
    //     });
    //     y = (doc as any).lastAutoTable.finalY + 10;
    //   };

    //   renderAff(
    //     'Organization Affinity',
    //     orgAff,
    //     (o) => pick(o, 'org_name', 'organization', 'organisation', 'name') as string,
    //     (o) => (toNum(pick(o, 'count', 'times')) ?? 0),
    //     (o) => pick(o, 'total_value', 'total', 'sum'),
    //     (o) => pick(o, 'average_value', 'avg', 'mean'),
    //   );

    //   if (y + 40 > SAFE_BOTTOM) addPage();

    //   renderAff(
    //     'Department Affinity',
    //     deptAff,
    //     (d) => pick(d, 'dept_name', 'department', 'name') as string,
    //     (d) => (toNum(pick(d, 'count', 'times')) ?? 0),
    //     (d) => pick(d, 'total_value', 'total', 'sum'),
    //     (d) => pick(d, 'average_value', 'avg', 'mean'),
    //   );

    //   if (y + 40 > SAFE_BOTTOM) addPage();

    //   renderAff(
    //     'Ministry Affinity',
    //     minAff,
    //     (m) => pick(m, 'ministry_name', 'ministry', 'name') as string,
    //     (m) => (toNum(pick(m, 'count', 'times')) ?? 0),
    //     (m) => pick(m, 'total_value', 'total', 'sum'),
    //     (m) => pick(m, 'average_value', 'avg', 'mean'),
    //   );

    //   // Qty & Price ranges (support both formats)
    //   if (y + 20 > SAFE_BOTTOM) addPage();
    //   doc.setFont('helvetica','bold'); doc.setTextColor(...colors.text); doc.setFontSize(9);
    //   doc.text('Quantity & Price Range Patterns', margin, y); y += 7;

    //   const qtyRange = clean(pick(signals, 'quantity_range', 'quantityRange') ?? '-');
    //   const priceRangeRaw = pick(signals, 'price_range', 'priceRange');

    //   let priceRange = '-';
    //   if (priceRangeRaw) {
    //     if (typeof priceRangeRaw === 'string' && priceRangeRaw.includes('-')) {
    //       const parts = priceRangeRaw.split('-').map((p: string) => p.trim());
    //       const minP = toNum(parts[0]); const maxP = toNum(parts[1]);
    //       priceRange = `${currency(minP)} - ${currency(maxP)}`;
    //     } else {
    //       priceRange = clean(priceRangeRaw).replace(/INR/gi, 'Rs');
    //     }
    //   }

    //   doc.setFont('helvetica','normal'); doc.setFontSize(8);
    //   doc.text(`Quantity Range: ${qtyRange}`, margin, y); y += 6;
    //   doc.text(`Price Range: ${priceRange}`, margin, y); y += 10;
    // }

    // ---------- AI SECTION (Summary, Likely Wins, and Affinity) ----------
addPage();
section('AI Strategy Summary', colors.blue);

const missed = get(reportData, ['data', 'missedButWinnable'], {});
const ai = missed.ai || {};

// Helper to safely pick field from multiple paths
const pick = (obj: AnyObj, ...candidates: (string | (string | number)[])[]) => {
  for (const c of candidates) {
    const path = Array.isArray(c) ? c : (c as string).split('.');
    const v = get(obj, path);
    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  }
  return undefined;
};

const toUpperSafe = (v: any, dflt: string) => {
  const s = String(v ?? dflt).trim();
  return s ? s.toUpperCase() : dflt.toUpperCase();
};

// ---------- AI Summary ----------
const summary = clean(pick(ai, 'strategy_summary') ?? '');
if (summary !== '-') {
  const boxW = pageW - margin * 2;
  const lines = doc.splitTextToSize(summary, boxW - 10);
  const boxH = Math.max(22, 8 + (lines as string[]).length * 4.2);
  doc.setFillColor(...colors.wash);
  doc.roundedRect(margin, y, boxW, boxH, 3, 3, 'F');
  doc.setDrawColor(...colors.blue);
  doc.roundedRect(margin, y, boxW, boxH, 3, 3, 'S');
  doc.setTextColor(...colors.text); doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  doc.text(lines as string[], margin + 5, y + 7);
  y += boxH + 8;
}

// ---------- Likely Wins ----------
const lwArr = asArray<any>(pick(ai, 'likely_wins')) || [];

if (lwArr.length) {
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...colors.text);
  doc.text('Likely Wins - High Probability Opportunities', margin, y); y += 6;

  for (let i = 0; i < lwArr.length; i++) {
    const win = lwArr[i];
    const itemText = clean(pick(win, 'item', 'offered_item') ?? '');
    const reasonText = clean(pick(win, 'reason') ?? '-');
    const confidence = toUpperSafe(pick(win, 'confidence'), 'MEDIUM');
    console.log(itemText);
    console.log(reasonText);
    console.log({confidence});

    const itemLines = doc.splitTextToSize(itemText, pageW - margin * 2 - 12);
    const reasonLines = doc.splitTextToSize(reasonText, pageW - margin * 2 - 12);
    const boxH = 14 + (itemLines as string[]).length * 4 + (reasonLines as string[]).length * 4 + 6;

    need(boxH + 14);
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(...colors.success);
    doc.roundedRect(margin, y, pageW - margin * 2, boxH, 2.5, 2.5, 'F');
    doc.roundedRect(margin, y, pageW - margin * 2, boxH, 2.5, 2.5, 'S');

    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...colors.success);
    doc.text(`Opportunity ${i + 1}`, margin + 4, y + 6);

    doc.setTextColor(...colors.text); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.text('Item:', margin + 4, y + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(itemLines as string[], margin + 18, y + 12);

    doc.setFont('helvetica', 'bold'); doc.text('Reason:', margin + 4, y + 12 + (itemLines as string[]).length * 4 + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(reasonLines as string[], margin + 24, y + 12 + (itemLines as string[]).length * 4 + 4);

    const tagW = Math.max(18, doc.getTextWidth(confidence) + 8);
    doc.setFillColor(...colors.white);
    doc.roundedRect(pageW - margin - tagW - 2, y + 3, tagW, 7, 2, 2, 'F');
    doc.setDrawColor(...colors.success);
    doc.roundedRect(pageW - margin - tagW - 2, y + 3, tagW, 7, 2, 2, 'S');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7);
    if (confidence === 'HIGH') doc.setTextColor(...colors.success);
    else if (confidence === 'MEDIUM') doc.setTextColor(...colors.warn);
    else doc.setTextColor(...colors.mid);
    doc.text(confidence, pageW - margin - tagW / 2 - 2, y + 8, { align: 'center' });

    y += boxH + 6;
  }
}

// ---------- Strategic Affinity Signals ----------
// addPage();
// section('Strategic Affinity Signals', colors.blue);

// const signals = ai.signals || {};
// const orgAff = asArray<any>(signals.org_affinity);
// const deptAff = asArray<any>(signals.dept_affinity);
// const minAff = asArray<any>(signals.ministry_affinity);

// const renderAffTable = (title: string, rows: any[]) => {
//   if (!rows?.length) return;
//   doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...colors.text);
//   doc.text(title, margin, y); y += 7;

//   const body: RowInput[] = rows.map((r) => [
//     clean(r.org_name || r.dept_name || r.ministry_name || '-'),
//     (r.count ?? 0).toString(),
//     currency(r.total_value),
//     currency(r.average_value),
//   ]);

//   const widths = fitWidths(doc, margin, [85, 20, 35, 35]);
//   autoTable(doc, {
//     ...tableDefaults,
//     startY: y,
//     head: [['Name', 'Count', 'Total Value', 'Avg Value']],
//     body,
//     margin: shiftedMargin(margin, SAFE_TOP),
//     headStyles: { ...tableDefaults.headStyles, fillColor: colors.blue, textColor: colors.white, fontSize: 8 },
//     bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7.5 },
//     columnStyles: {
//       0: { cellWidth: widths[0] },
//       1: { cellWidth: widths[1], halign: 'center', fontStyle: 'bold' },
//       2: { cellWidth: widths[2], halign: 'right' },
//       3: { cellWidth: widths[3], halign: 'right' },
//     },
//     didDrawPage: () => { addHeader(); addFooter(); },
//   });
//   y = (doc as any).lastAutoTable.finalY + 10;
// };

// renderAffTable('Organization Affinity', orgAff);
// renderAffTable('Department Affinity', deptAff);
// renderAffTable('Ministry Affinity', minAff);

// doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.text); doc.setFontSize(9);
// doc.text('Quantity & Price Range Patterns', margin, y); y += 7;

// const qtyRange = clean(signals.quantity_range ?? '-');
// const priceRangeRaw = signals.price_range;

// let priceRange = '-';
// if (priceRangeRaw) {
//   if (typeof priceRangeRaw === 'string' && priceRangeRaw.includes('-')) {
//     const parts = priceRangeRaw.split('-').map((p: string) => p.trim());
//     const minP = toNum(parts[0]); const maxP = toNum(parts[1]);
//     priceRange = `${currency(minP)} - ${currency(maxP)}`;
//   } else {
//     priceRange = clean(priceRangeRaw).replace(/INR/gi, 'Rs');
//   }
// }

// doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
// doc.text(`Quantity Range: ${qtyRange}`, margin, y); y += 6;
// doc.text(`Price Range: ${priceRange}`, margin, y); y += 10;
//   }

// ---------- Strategic Affinity Signals ----------
addPage();
section('Strategic Affinity Signals', colors.blue);

const signals = ai.signals || {};

// Fix affinity arrays: wrap the strings into objects expected by the table
const orgAff = signals.org_affinities?.map((o: string) => ({ org_name: o })) ?? [];
const deptAff = signals.dept_affinities?.map((d: string) => ({ dept_name: d })) ?? [];
const minAff = signals.ministry_affinities?.map((m: string) => ({ ministry_name: m })) ?? [];

const renderAffTable = (title: string, rows: any[], key: string) => {
  if (!rows?.length) return;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...colors.text);
  doc.text(title, margin, y); y += 7;

  // Create table rows
  const body: RowInput[] = rows.map((r) => [
    clean(r[key] ?? '-'),
    '-', '-', '-', // No numerical data in your current response
  ]);

  const widths = fitWidths(doc, margin, [115, 30, 35, 35]);
  autoTable(doc, {
    ...tableDefaults,
    startY: y,
    head: [['Name', 'Count', 'Total Value', 'Avg Value']],
    body,
    margin: shiftedMargin(margin, SAFE_TOP),
    headStyles: { ...tableDefaults.headStyles, fillColor: colors.blue, textColor: colors.white, fontSize: 8 },
    bodyStyles: { ...tableDefaults.bodyStyles, fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: widths[0] },
      1: { cellWidth: widths[1], halign: 'center' },
      2: { cellWidth: widths[2], halign: 'right' },
      3: { cellWidth: widths[3], halign: 'right' },
    },
    didDrawPage: () => { addHeader(); addFooter(); },
  });
  y = (doc as any).lastAutoTable.finalY + 10;
};

renderAffTable('Organization Affinity', orgAff, 'org_name');
renderAffTable('Department Affinity', deptAff, 'dept_name');
renderAffTable('Ministry Affinity', minAff, 'ministry_name');

// ---- Quantity & Price Range ----
doc.setFont('helvetica', 'bold'); doc.setTextColor(...colors.text); doc.setFontSize(9);
doc.text('Quantity & Price Range Patterns', margin, y); y += 7;

const qtyRange = clean(signals.quantity_range_recent_wins ?? '-');
const priceRange = clean(signals.total_price_range_recent_wins)?.replace(/INR/gi, 'Rs') ?? '-';

doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
doc.text(`Quantity Range: ${qtyRange}`, margin, y); y += 6;
doc.text(`Price Range: ${priceRange}`, margin, y); y += 10;
  }
  /** ------------ PRICE BAND ------------- */
  addPage();
  section('Price Band Analysis', colors.blue);
  {
    const pb = pick(reportData, 'data.priceBand') as AnyObj || {};
    const analysis = pick(pb, 'analysis') as AnyObj || {};
    const highest = currency(pick(analysis, 'highest'));
    const lowest = currency(pick(analysis, 'lowest'));
    const avg = currency(pick(analysis, 'average'));
    const count = toNum(pick(analysis, 'count')) ?? 0;
    const total = currency(pick(analysis, 'total'));

    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...colors.text);
    doc.text('Summary', margin, y); y += 6;
    const lines = [
      `Highest: ${highest}`,
      `Lowest: ${lowest}`,
      `Average: ${avg}`,
      `Count: ${count}`,
      `Total: ${total}`,
    ];
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...colors.mid);
    doc.text(lines, margin, y);
    y += 20;
  }

  /** ------------ CATEGORY DISTRIBUTION ------------- */
  section('Category Distribution', colors.blue);
  {
    const cl = pick(reportData, 'data.categoryListing') as AnyObj || {};
    const cats = asArray<any>(pick(cl, 'categories')) || [];
    if (cats.length) {
      const widths = fitWidths(doc, margin, [90, 30, 30]);
      autoTable(doc, {
        ...tableDefaults,
        startY: y,
        head: [['Category', 'Times', 'Share']],
        body: cats.map<RowInput>((c) => {
          const times = toNum(pick(c, 'times')) ?? 0;
          const total = toNum(get(cl, ['metadata','totalCount'], 0)) || cats.reduce((acc, r) => acc + (r?.times || 0), 0);
          return [clean(pick(c, 'category','name') ?? ''), String(times), percent(times, total)];
        }),
        columnStyles: {
          0: { cellWidth: widths[0] },
          1: { cellWidth: widths[1], halign: 'right' },
          2: { cellWidth: widths[2], halign: 'right' },
        },
        didDrawPage: () => { addHeader(); addFooter(); },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  /** ------------ TOP SELLERS BY DEPARTMENT ------------- */
  addPage();
  section('Top Sellers by Department', colors.blue);
  {
    const ts = pick(reportData, 'data.topSellersByDept') as AnyObj || {};
    const depts = asArray<any>(pick(ts, 'departments')) || [];
    for (const d of depts) {
      need(14);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...colors.text);
      doc.text(clean(pick(d, 'department','name') ?? ''), margin, y); y += 6;

      const results = asArray<any>(pick(d, 'results')) || [];
      if (!results.length) continue;

      const widths = fitWidths(doc, margin, [80, 30, 20]);
      autoTable(doc, {
        ...tableDefaults,
        startY: y,
        head: [['Seller', 'Participations', 'Rank']],
        body: results.map<RowInput>((r) => ([
          clean(pick(r, 'seller_name','seller') ?? ''),
          String(toNum(pick(r, 'participation_count','count')) ?? 0),
          String(toNum(pick(r, 'rank')) ?? '-'),
        ])),
        columnStyles: {
          0: { cellWidth: widths[0] },
          1: { cellWidth: widths[1], halign: 'right' },
          2: { cellWidth: widths[2], halign: 'center' },
        },
        didDrawPage: () => { addHeader(); addFooter(); },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  /** ------------ TOP PERFORMING STATES ------------- */
  addPage();
  section('Top Performing States', colors.blue);
  {
    const tps = pick(reportData, 'data.topPerformingStates.data.results') as AnyObj[] || [];
    if (tps.length) {
      const widths = fitWidths(doc, margin, [90, 40]);
      autoTable(doc, {
        ...tableDefaults,
        startY: y,
        head: [['State', 'Total Tenders']],
        body: tps.map<RowInput>((r) => ([
          clean(pick(r, 'state_name', 'state') ?? ''),
          String(toNum(pick(r, 'total_tenders','tenders')) ?? 0),
        ])),
        columnStyles: {
          0: { cellWidth: widths[0] },
          1: { cellWidth: widths[1], halign: 'right' },
        },
        didDrawPage: () => { addHeader(); addFooter(); },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  /** ------------ LOW COMPETITION BIDS ------------- */
  addPage();
  section('Low Competition Bids', colors.blue);
  {
    const lcb = pick(reportData, 'data.lowCompetitionBids.results') as AnyObj[] || [];
    if (lcb.length) {
      const widths = fitWidths(doc, margin, [32, 66, 50, 18, 20]);
      autoTable(doc, {
        ...tableDefaults,
        startY: y,
        head: [['Bid No', 'Org / Dept', 'Ministry', 'Qty', 'Sellers']],
        body: lcb.map<RowInput>((r) => ([
          clean(pick(r, 'bid_number', 'bidNo') ?? ''),
          `${clean(pick(r, 'organisation','organization') ?? '')} / ${clean(pick(r,'department','dept') ?? '')}`,
          clean(pick(r, 'ministry') ?? ''),
          String(toNum(pick(r, 'quantity')) ?? 0),
          String(toNum(pick(r, 'seller_count')) ?? 0),
        ])),
        columnStyles: {
          0: { cellWidth: widths[0] },
          1: { cellWidth: widths[1] },
          2: { cellWidth: widths[2] },
          3: { cellWidth: widths[3], halign: 'right' },
          4: { cellWidth: widths[4], halign: 'right' },
        },
        didDrawPage: () => { addHeader(); addFooter(); },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  /** ------------ SELLER BIDS DEEP DIVE ------------- */
  addPage();
  section('Seller Bids Deep Dive', colors.blue);
  {
    const sb = pick(reportData, 'data.sellerBids') as AnyObj || {};

    // By Department
    {
      const deptCount = pick(sb, 'departmentCount.departmentCount') as AnyObj || {};
      const deptRevenue = pick(sb, 'departmentCount.revenue') as AnyObj || {};
      const depts = Object.keys(deptCount);
      if (depts.length) {
        const widths = fitWidths(doc, margin, [84, 28, 30, 30]);
        autoTable(doc, {
          ...tableDefaults,
          startY: y,
          head: [['Department', 'Count', 'Revenue', 'Avg']],
          body: depts.map<RowInput>((d) => {
            const c = toNum(deptCount[d]) ?? 0;
            const rev = toNum(deptRevenue[d]) ?? 0;
            const avg = c ? rev / c : 0;
            return [d, String(c), currency(rev), currency(avg)];
          }),
          columnStyles: {
            0: { cellWidth: widths[0] },
            1: { cellWidth: widths[1], halign: 'right' },
            2: { cellWidth: widths[2], halign: 'right' },
            3: { cellWidth: widths[3], halign: 'right' },
          },
          didDrawPage: () => { addHeader(); addFooter(); },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }
    }

    // Monthly totals
    {
      const labels = asArray<string>(pick(sb, 'monthlyTotals.labels')) || [];
      const values = asArray<number>(pick(sb, 'monthlyTotals.values')) || [];
      if (labels.length && values.length) {
        const widths = fitWidths(doc, margin, [40, 40]);
        autoTable(doc, {
          ...tableDefaults,
          startY: y,
          head: [['Month', 'Value']],
          body: labels.map<RowInput>((m, i) => ([m, currency(values[i])])),
          columnStyles: {
            0: { cellWidth: widths[0] },
            1: { cellWidth: widths[1], halign: 'right' },
          },
          didDrawPage: () => { addHeader(); addFooter(); },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }
    }

    // Sorted rows (sample)
    {
      const rows = asArray<any>(pick(sb, 'sortedRows')) || [];
      if (rows.length) {
        const widths = fitWidths(doc, margin, [34, 54, 42, 16, 26]);
        autoTable(doc, {
          ...tableDefaults,
          startY: y,
          head: [['Bidder', 'Item', 'Org/Dept', 'Rank', 'Price']],
          body: rows.map<RowInput>((r) => ([
            clean(pick(r, 'seller_name') ?? ''),
            clean(pick(r, 'offered_item') ?? ''),
            `${clean(pick(r,'organisation','organization') ?? '')} / ${clean(pick(r,'department','dept') ?? '')}`,
            clean(pick(r, 'rank') ?? ''),
            currency(pick(r, 'total_price')),
          ])),
          columnStyles: {
            0: { cellWidth: widths[0] },
            1: { cellWidth: widths[1] },
            2: { cellWidth: widths[2] },
            3: { cellWidth: widths[3], halign: 'center' },
            4: { cellWidth: widths[4], halign: 'right' },
          },
          didDrawPage: () => { addHeader(); addFooter(); },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }
    }

    // Totals table
    {
      const t1 = pick(sb, 'table1') as AnyObj || {};
      const win = toNum(pick(t1, 'win')) ?? 0;
      const lost = toNum(pick(t1, 'lost')) ?? 0;
      const total = win + lost;

      const widths = fitWidths(doc, margin, [40, 30, 30, 30, 30]);
      autoTable(doc, {
        ...tableDefaults,
        startY: y,
        head: [['Wins', 'Losses', 'Total', 'Win %', 'AoV']],
        body: [[
          String(win),
          String(lost),
          String(total),
          total ? `${((win / total) * 100).toFixed(1)}%` : '-',
          currency(pick(t1, 'averageOrderValue')),
        ]],
        columnStyles: {
          0: { cellWidth: widths[0], halign: 'right' },
          1: { cellWidth: widths[1], halign: 'right' },
          2: { cellWidth: widths[2], halign: 'right' },
          3: { cellWidth: widths[3], halign: 'right' },
          4: { cellWidth: widths[4], halign: 'right' },
        },
        didDrawPage: () => { addHeader(); addFooter(); },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  /** ------------ RECENT ACTIVITY ------------- */
  addPage();
  section('Recent Activity (From Metadata)', colors.blue);
  {
    const meta = pick(reportData, 'meta') as AnyObj || {};
    const lines: string[] = [];

    const pt = toNum(pick(meta, 'processingTimeMs')) ?? toNum(pick(reportData, 'data.missedButWinnable.meta.processingTimeMs')) ?? undefined;
    const rc = toNum(pick(meta, 'requests_completed')) ?? undefined;
    const rf = toNum(pick(meta, 'requests_failed')) ?? undefined;
    const rt = toNum(pick(meta, 'requests_total')) ?? undefined;

    if (pt != null) lines.push(`Processing time: ${pt} ms`);
    if (rc != null && rt != null) lines.push(`Requests: ${rc}/${rt} completed`);
    if (rf != null) lines.push(`Failures: ${rf}`);

    if (lines.length) {
      doc.setFont('helvetica', 'normal'); doc.setTextColor(...colors.mid); doc.setFontSize(9);
      doc.text(lines, margin, y);
      y += lines.length * 6 + 4;
    }
  }

  // FINAL: return document (INSIDE function)
  return doc;
}

export default generateBidReport;
