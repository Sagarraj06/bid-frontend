
// import { useState, useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { CreditBadge } from "@/components/CreditBadge";
// import { ArrowLeft, FileText, Loader2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { generatePDF } from "@/utils/pdfGenerator";
// import { saveReport } from "@/utils/reportStorage";
// import { enqueueJob, startPollingJob, resumePendingJob } from "@/utils/reportJob";

// const GenerateReport = () => {
//   const { user, updateCredits } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [formData, setFormData] = useState({
//     sellerName: "",
//     department: "",
//     offeredItem: "",
//     days: 60,
//     limit: 10,
//     email: user?.email || "",
//   });

//   const isFormValid = formData.sellerName && formData.email;

//   // ♻️ Automatically resume pending job on reload
//   useEffect(() => {
//     resumePendingJob(async (finalData) => {
//       if (finalData.status === "completed") {
//         const reportData = finalData.result || finalData.data;
//         if (!reportData) {
//           toast({
//             title: "No Report Data Found",
//             description: "The resumed job completed, but no data was returned.",
//             variant: "destructive",
//           });
//           return;
//         }

//         try {
//           const pdfDoc = await generatePDF(reportData, {
//             includeSections: [
//               "bidsSummary",
//               "marketOverview",
//               "topPerformer",
//               "missedTenders",
//               "buyerInsights",
//               "rivalryScore",
//               "lowCompetition",
//               "categoryAnalysis",
//               "statesAnalysis",
//               "departmentsAnalysis",
//             ],
//           });
//           const fileName = `Resumed_Report_${new Date()
//             .toISOString()
//             .split("T")[0]}.pdf`;
//           pdfDoc.save(fileName);
//           toast({
//             title: "Report Completed!",
//             description: "Your resumed report was successfully downloaded.",
//           });
//         } catch (err: any) {
//           toast({
//             title: "Error Resuming Report",
//             description: err.message,
//             variant: "destructive",
//           });
//         }
//       }
//     });
//   }, [toast]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     if (user.credits < 1) {
//       toast({
//         title: "Insufficient Credits",
//         description: `You need 1 credit to generate a report. Current balance: ${user.credits}`,
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsGenerating(true);

//     try {
//       const payload = {
//         ...formData,
//         filters: {
//           includeSections: [
//             "bidsSummary",
//             "marketOverview",
//             "topPerformer",
//             "missedTenders",
//             "buyerInsights",
//             "rivalryScore",
//             "lowCompetition",
//             "categoryAnalysis",
//             "statesAnalysis",
//             "departmentsAnalysis",
//           ],
//         },
//         userId: user.email,
//       };

//       console.log("📤 Sending job request:", payload);

//       // Step 1️⃣ — Start the job
//       const jobId = await enqueueJob(payload);
//       toast({
//         title: "Report Generation Started",
//         description: `Job ID: ${jobId}. This may take a few minutes.`,
//       });

//       // Step 2️⃣ — Start polling
//       startPollingJob(
//         jobId,
//         (update) => {
//           console.log("📡 Job update:", update.status);
//         },
//         async (finalData) => {
//           if (finalData.status === "completed") {
//             console.log("✅ Job complete:", finalData);
//             const reportData = finalData.result || finalData.data || null;

//             if (!reportData) {
//               toast({
//                 title: "No Report Data Found",
//                 description: "The job completed, but no report data was returned.",
//                 variant: "destructive",
//               });
//               setIsGenerating(false);
//               return;
//             }

//             try {
//               // Step 3️⃣ — Generate PDF
//               const pdfDoc = await generatePDF(reportData, {
//                 includeSections: payload.filters.includeSections,
//               });
//               const fileName = `${formData.sellerName.replace(/\s+/g, "_")}_Report_${new Date()
//                 .toISOString()
//                 .split("T")[0]}.pdf`;

//               pdfDoc.save(fileName);

//               // Step 4️⃣ — Save to history
//               saveReport({
//                 id:
//                   (window.crypto && "randomUUID" in window.crypto
//                     ? (window.crypto as any).randomUUID()
//                     : Math.random().toString(36).slice(2)),
//                 userEmail: user.email,
//                 sellerName: formData.sellerName,
//                 department: formData.department,
//                 offeredItem: formData.offeredItem,
//                 createdAt: new Date().toISOString(),
//                 fileName,
//               });

//               updateCredits(user.credits - 1);

//               toast({
//                 title: "Report Generated Successfully!",
//                 description: `Your report has been downloaded as ${fileName}`,
//               });

//               setTimeout(() => navigate("/dashboard"), 2000);
//             } catch (pdfErr: any) {
//               console.error("PDF generation error:", pdfErr);
//               toast({
//                 title: "PDF Generation Failed",
//                 description: pdfErr.message,
//                 variant: "destructive",
//               });
//             }
//           } else {
//             toast({
//               title: "Report Job Failed",
//               description: finalData.error || `Status: ${finalData.status}`,
//               variant: "destructive",
//             });
//           }

//           setIsGenerating(false);
//         }
//       );
//     } catch (err: any) {
//       console.error("Job enqueue error:", err);
//       toast({
//         title: "Error Starting Job",
//         description: err.message,
//         variant: "destructive",
//       });
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="bg-card border-b shadow-sm">
//         <div className="container mx-auto px-6 py-5">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => navigate("/dashboard")}
//                 className="hover:bg-muted"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Dashboard
//               </Button>
//               <div className="h-8 w-px bg-border" />
//               <div className="flex items-center gap-3">
//                 <div className="p-2.5 bg-primary rounded-lg">
//                   <FileText className="h-6 w-6 text-primary-foreground" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-bold text-foreground">
//                     Generate Analysis Report
//                   </h1>
//                   <p className="text-sm text-muted-foreground">
//                     Government Tender Performance Analysis
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <CreditBadge />
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="container mx-auto px-6 py-8 max-w-5xl">
//         <form onSubmit={handleSubmit}>
//           <Card className="mb-6 border-2">
//             <CardHeader className="bg-muted/30 border-b">
//               <CardTitle className="text-2xl">Report Configuration</CardTitle>
//               <CardDescription className="text-base">
//                 Enter the required information to generate your comprehensive
//                 tender analysis report (1 Credit per report)
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6 p-6">
//               {/* Seller Name */}
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="sellerName"
//                   className="text-base font-semibold"
//                 >
//                   Seller/Company Name *
//                 </Label>
//                 <Input
//                   id="sellerName"
//                   placeholder="Enter company name (e.g., RAJHANS IMPEX)"
//                   value={formData.sellerName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, sellerName: e.target.value })
//                   }
//                   className="h-11"
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-base font-semibold">
//                   Report Delivery Email *
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="your.email@company.com"
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   className="h-11"
//                   required
//                 />
//                 <p className="text-sm text-muted-foreground">
//                   The generated report will be sent to this email address
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Submit */}
//           <Card className="border-2 bg-muted/30">
//             <CardContent className="p-6">
//               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//                 <div className="space-y-1">
//                   <p className="text-base font-semibold">
//                     Report Generation Cost: 1 Credit
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     Your current credit balance:{" "}
//                     <span className="font-semibold text-foreground">
//                       {user?.credits || 0} credits
//                     </span>
//                   </p>
//                   {user && user.credits < 1 && (
//                     <p className="text-sm text-destructive font-medium mt-2">
//                       Insufficient credits available. Please contact your
//                       administrator to purchase additional credits.
//                     </p>
//                   )}
//                 </div>
//                 <Button
//                   type="submit"
//                   size="lg"
//                   disabled={!isFormValid || isGenerating || !user || user.credits < 1}
//                   className="min-w-[200px] h-12 text-base font-semibold"
//                 >
//                   {isGenerating ? (
//                     <>
//                       <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                       Generating Report...
//                     </>
//                   ) : (
//                     <>
//                       <FileText className="h-5 w-5 mr-2" />
//                       Generate Analysis Report
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </form>
//       </main>
//     </div>
//   );
// };

// export default GenerateReport;


import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditBadge } from "@/components/CreditBadge";
import { ArrowLeft, FileText, Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdfGenerator";
import { saveReport } from "@/utils/reportStorage";
import { enqueueJob, startPollingJob, resumePendingJob } from "@/utils/reportJob";

const GenerateReport = () => {
  const { user, updateCredits } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  
  // 🔍 Search & Autocomplete States
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // 🛑 Ref to skip search when user clicks a suggestion
  const skipSearchRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    sellerName: "",
    department: "",
    offeredItem: "",
    days: 60,
    limit: 10,
    email: user?.email || "",
  });

  const isFormValid = formData.sellerName && formData.email;

  // 🖱️ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // ♻️ Resume Job Logic
  useEffect(() => {
    resumePendingJob(async (finalData) => {
      if (finalData.status === "completed") {
        const reportData = finalData.result || finalData.data;
        if (!reportData) return;
        try {
          const pdfDoc = await generatePDF(reportData, {
            includeSections: ["bidsSummary", "marketOverview", "topPerformer", "missedTenders", "buyerInsights", "rivalryScore", "lowCompetition", "categoryAnalysis", "statesAnalysis", "departmentsAnalysis"],
          });
          pdfDoc.save(`Resumed_Report_${new Date().toISOString().split("T")[0]}.pdf`);
          toast({ title: "Report Completed!", description: "Resumed report downloaded." });
        } catch (err: any) {
          console.error(err);
        }
      }
    });
  }, [toast]);

  // ⏳ DEBOUNCED SEARCH EFFECT (Fixes 429 Errors)
  useEffect(() => {
    // If the change was triggered by selecting an item, do not search
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    // 1. Define the fetch logic
    const fetchSuggestions = async () => {
      if (!formData.sellerName || formData.sellerName.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        // const response = await fetch(`/sellers/search?q=${encodeURIComponent(formData.sellerName)}`);
        
        const response = await fetch(`/api/sellers/search?q=${encodeURIComponent(formData.sellerName)}`);

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          // Only show suggestions if we have results
          if (data.length > 0) {
            setShowSuggestions(true);
          } else {
            setShowSuggestions(false);
          }
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    // 2. Set a timer to wait 300ms before calling the API
    const timerId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    // 3. Cleanup: If user types again before 300ms, cancel the previous timer
    return () => clearTimeout(timerId);

  }, [formData.sellerName]); // Runs whenever sellerName changes


  // ⚡ Handle Input Change (Just updates state, Effect handles the fetch)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, sellerName: e.target.value });
  };

  // 🎯 Select from Dropdown
  const handleSelectSuggestion = (name: string) => {
    skipSearchRef.current = true; // Tell the effect to ignore this update
    setFormData({ ...formData, sellerName: name });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;

    if (!isFormValid) {
      toast({ title: "Missing Info", description: "Please enter Seller Name and Email.", variant: "destructive" });
      return;
    }

    if (user.credits < 1) {
      toast({ title: "Insufficient Credits", description: "You need 1 credit.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setShowSuggestions(false);

    try {
      const payload = {
        ...formData,
        filters: { includeSections: ["bidsSummary", "marketOverview", "topPerformer", "missedTenders", "buyerInsights", "rivalryScore", "lowCompetition", "categoryAnalysis", "statesAnalysis", "departmentsAnalysis"] },
        userId: user.email,
      };

      const jobId = await enqueueJob(payload);
      toast({ title: "Report Generation Started", description: `Job ID: ${jobId}` });

      startPollingJob(
        jobId,
        (update) => console.log("Job Update:", update.status),
        async (finalData) => {
          if (finalData.status === "completed") {
            const reportData = finalData.result || finalData.data;
            if (!reportData) {
               setIsGenerating(false);
               return;
            }
            try {
              const pdfDoc = await generatePDF(reportData, { includeSections: payload.filters.includeSections });
              const fileName = `${formData.sellerName.replace(/\s+/g, "_")}_Report.pdf`;
              pdfDoc.save(fileName);
              
              saveReport({
                id: Math.random().toString(36).slice(2),
                userEmail: user.email,
                sellerName: formData.sellerName,
                department: formData.department,
                offeredItem: formData.offeredItem,
                createdAt: new Date().toISOString(),
                fileName,
              });
              
              updateCredits(user.credits - 1);
              toast({ title: "Success!", description: "Report downloaded." });
              setTimeout(() => navigate("/dashboard"), 2000);
            } catch (err: any) {
              toast({ title: "PDF Error", description: err.message, variant: "destructive" });
            }
          } else {
            toast({ title: "Job Failed", description: "Could not generate report.", variant: "destructive" });
          }
          setIsGenerating(false);
        }
      );
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h1 className="text-xl font-bold">Generate Analysis Report</h1>
          </div>
          <CreditBadge />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <form onSubmit={handleSubmit}>
          <Card className="mb-6 border-2">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              
              {/* Seller Name + Search Button + Dropdown */}
              <div className="space-y-2 relative" ref={wrapperRef}>
                <Label htmlFor="sellerName" className="text-base font-semibold">Seller/Company Name *</Label>
                
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <Input
                      id="sellerName"
                      placeholder="Start typing company name..."
                      value={formData.sellerName}
                      onChange={handleNameChange}
                      onFocus={() => formData.sellerName.length >= 3 && setShowSuggestions(true)}
                      autoComplete="off"
                      className="h-11"
                      required
                    />
                    
                    {/* 🔽 Dropdown List */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-y-auto">
                        <ul className="py-1">
                          {suggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              onClick={() => handleSelectSuggestion(suggestion)}
                              className="px-4 py-2 text-sm cursor-pointer hover:bg-muted transition-colors"
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* 🔍 Search Button */}
                  <Button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={!formData.sellerName || isGenerating}
                    className="h-11 px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                    Search & Generate
                  </Button>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">Delivery Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
};

export default GenerateReport;