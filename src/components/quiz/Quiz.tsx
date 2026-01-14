import { useState } from "react";
import { WelcomeStep } from "./steps/WelcomeStep";
import { CompanySizeStep } from "./steps/CompanySizeStep";
import { SegmentStep } from "./steps/SegmentStep";
import { CertificationStep } from "./steps/CertificationStep";
import { ObjectiveStep } from "./steps/ObjectiveStep";
import { TimelineStep } from "./steps/TimelineStep";
import { ContactStep, ContactData } from "./steps/ContactStep";
import { ResultStep } from "./steps/ResultStep";

type Step =
  | "welcome"
  | "companySize"
  | "segment"
  | "certification"
  | "objective"
  | "timeline"
  | "contact"
  | "result";

interface QuizData {
  companySize: string;
  segment: string;
  certification: string;
  objectives: string[];
  timeline: string;
  contact: ContactData | null;
}

const stepOrder: Step[] = [
  "welcome",
  "companySize",
  "segment",
  "certification",
  "objective",
  "timeline",
  "contact",
  "result",
];

export const Quiz = () => {
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [data, setData] = useState<QuizData>({
    companySize: "",
    segment: "",
    certification: "",
    objectives: [],
    timeline: "",
    contact: null,
  });

  const totalSteps = 6;

  const getStepNumber = (step: Step): number => {
    const steps: Record<Step, number> = {
      welcome: 0,
      companySize: 1,
      segment: 2,
      certification: 3,
      objective: 4,
      timeline: 5,
      contact: 6,
      result: 6,
    };
    return steps[step];
  };

  const goToNextStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSelectAndNext = (field: keyof QuizData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setTimeout(goToNextStep, 300);
  };

  const handleContactSubmit = (contactData: ContactData) => {
    setData((prev) => ({ ...prev, contact: contactData }));
    console.log("Quiz completed:", { ...data, contact: contactData });
    setCurrentStep("result");
  };

  switch (currentStep) {
    case "welcome":
      return <WelcomeStep onNext={goToNextStep} />;

    case "companySize":
      return (
        <CompanySizeStep
          currentStep={getStepNumber(currentStep)}
          totalSteps={totalSteps}
          selected={data.companySize}
          onSelect={(value) => handleSelectAndNext("companySize", value)}
          onBack={goToPreviousStep}
        />
      );

    case "segment":
      return (
        <SegmentStep
          currentStep={getStepNumber(currentStep)}
          totalSteps={totalSteps}
          selected={data.segment}
          onSelect={(value) => handleSelectAndNext("segment", value)}
          onBack={goToPreviousStep}
        />
      );

    case "certification":
      return (
        <CertificationStep
          currentStep={getStepNumber(currentStep)}
          totalSteps={totalSteps}
          selected={data.certification}
          onSelect={(value) => handleSelectAndNext("certification", value)}
          onBack={goToPreviousStep}
        />
      );

    case "objective":
      return (
        <ObjectiveStep
          currentStep={getStepNumber(currentStep)}
          totalSteps={totalSteps}
          selected={data.objectives}
          onSelect={(values) => setData((prev) => ({ ...prev, objectives: values }))}
          onNext={goToNextStep}
          onBack={goToPreviousStep}
        />
      );

    case "timeline":
      return (
        <TimelineStep
          currentStep={getStepNumber(currentStep)}
          totalSteps={totalSteps}
          selected={data.timeline}
          onSelect={(value) => handleSelectAndNext("timeline", value)}
          onBack={goToPreviousStep}
        />
      );

    case "contact":
      return (
        <ContactStep
          currentStep={getStepNumber(currentStep)}
          totalSteps={totalSteps}
          onSubmit={handleContactSubmit}
          onBack={goToPreviousStep}
        />
      );

    case "result":
      return <ResultStep name={data.contact?.name || "Visitante"} />;

    default:
      return <WelcomeStep onNext={goToNextStep} />;
  }
};
