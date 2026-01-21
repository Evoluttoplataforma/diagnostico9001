import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { QuizButton } from "../QuizButton";
import { PillarScore } from "../quizData";
import jsPDF from "jspdf";

interface DownloadPDFButtonProps {
  name: string;
  company?: string;
  score: number;
  pillarScores: PillarScore[];
  diagnosisSummary?: {
    paragraph1: string;
    paragraph2: string;
  };
  checklist?: Record<string, string[]>;
  diagnosisTitle: string;
}

export const DownloadPDFButton = ({
  name,
  company,
  score,
  pillarScores,
  diagnosisSummary,
  checklist,
  diagnosisTitle,
}: DownloadPDFButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = 20;

      // Header
      pdf.setFillColor(245, 130, 13); // Primary color
      pdf.rect(0, 0, pageWidth, 35, "F");
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("Diagnostico de Maturidade Empresarial", margin, 24);

      yPos = 50;

      // Company Info Box
      pdf.setFillColor(249, 250, 251);
      pdf.roundedRect(margin, yPos, contentWidth, 30, 3, 3, "F");
      
      pdf.setTextColor(17, 24, 39);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(name, margin + 5, yPos + 10);
      
      if (company) {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(107, 114, 128);
        pdf.text(company, margin + 5, yPos + 18);
      }
      
      pdf.setFontSize(10);
      pdf.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, margin + 5, yPos + 26);

      yPos += 40;

      // Score Section
      pdf.setFillColor(255, 251, 235);
      pdf.roundedRect(margin, yPos, contentWidth, 40, 3, 3, "F");
      
      pdf.setTextColor(245, 130, 13);
      pdf.setFontSize(36);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${score}%`, pageWidth / 2, yPos + 22, { align: "center" });
      
      pdf.setTextColor(17, 24, 39);
      pdf.setFontSize(14);
      pdf.text(diagnosisTitle, pageWidth / 2, yPos + 34, { align: "center" });

      yPos += 50;

      // Pillar Scores
      pdf.setTextColor(17, 24, 39);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Pontuação por Pilar", margin, yPos);
      yPos += 10;

      pillarScores.forEach((pillar) => {
        const barWidth = (pillar.score / 100) * (contentWidth - 50);
        
        // Pillar name
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(75, 85, 99);
        pdf.text(pillar.name, margin, yPos + 4);
        
        // Score value
        pdf.setFont("helvetica", "bold");
        pdf.text(`${pillar.score}%`, pageWidth - margin - 10, yPos + 4);
        
        // Background bar
        pdf.setFillColor(229, 231, 235);
        pdf.roundedRect(margin + 35, yPos, contentWidth - 50, 5, 2, 2, "F");
        
        // Progress bar
        const color = pillar.score >= 70 ? [34, 197, 94] : pillar.score >= 40 ? [250, 204, 21] : [239, 68, 68];
        pdf.setFillColor(color[0], color[1], color[2]);
        if (barWidth > 0) {
          pdf.roundedRect(margin + 35, yPos, barWidth, 5, 2, 2, "F");
        }
        
        yPos += 12;
      });

      yPos += 10;

      // Diagnosis Summary
      if (diagnosisSummary) {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(17, 24, 39);
        pdf.text("Diagnóstico", margin, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(75, 85, 99);
        
        const lines1 = pdf.splitTextToSize(diagnosisSummary.paragraph1, contentWidth);
        pdf.text(lines1, margin, yPos);
        yPos += lines1.length * 5 + 5;

        const lines2 = pdf.splitTextToSize(diagnosisSummary.paragraph2, contentWidth);
        pdf.text(lines2, margin, yPos);
        yPos += lines2.length * 5 + 10;
      }

      // Check if we need a new page
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      // Action Plan Checklist
      if (checklist) {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(17, 24, 39);
        pdf.text("Plano de Acao", margin, yPos);
        yPos += 15;

        const checklistWidth = contentWidth - 15;
        let pillarIndex = 1;

        Object.entries(checklist).forEach(([pillar, actions]) => {
          // Check for page break - need space for pillar header + all actions
          const estimatedHeight = 12 + (actions.length * 18);
          if (yPos + estimatedHeight > 270) {
            pdf.addPage();
            yPos = 25;
          }

          // Pillar header with number
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(245, 130, 13);
          pdf.text(`${pillarIndex}. ${pillar}`, margin, yPos);
          yPos += 8;

          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(60, 60, 60);
          
          actions.forEach((action) => {
            // Check for page break before each action
            if (yPos > 270) {
              pdf.addPage();
              yPos = 25;
            }
            
            // Use simple dash instead of unicode checkbox
            const actionText = `- ${action}`;
            const actionLines = pdf.splitTextToSize(actionText, checklistWidth);
            
            actionLines.forEach((line: string, lineIndex: number) => {
              if (lineIndex === 0) {
                pdf.text(line, margin + 5, yPos);
              } else {
                pdf.text(line, margin + 8, yPos); // Indent continuation lines
              }
              yPos += 5;
            });
            yPos += 3;
          });
          
          yPos += 8;
          pillarIndex++;
        });
      }

      // Footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(156, 163, 175);
        pdf.text(
          "Templum Consultoria | www.templum.com.br | +55 11 4003-5284",
          pageWidth / 2,
          pdf.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      const fileName = `diagnostico-${name.split(" ")[0].toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <QuizButton
      onClick={generatePDF}
      disabled={isGenerating}
      variant="outline"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Gerando PDF...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Baixar relatório em PDF
        </>
      )}
    </QuizButton>
  );
};
