import { Message, MessageFlow } from "./types"
import { ASSESSMENT_QUESTIONS, GENERATED_PLAN_DATA } from "./constants"

// Message Flow Templates for Different Actions
export const MESSAGE_FLOWS: Record<string, MessageFlow> = {
  "order-drug": {
    id: "order-drug",
    name: "Order Drug Flow",
    messages: [
      {
        content: "I'll help you order your Semaglutide prescription. Let me show you the available options and guide you through the process.",
        isUser: false,
        type: "unified-message",
        data: {
          type: "order-drug",
          title: "Order Your Prescription",
          message: "I'll help you order your Semaglutide prescription through your preferred pharmacy.",
          primaryAction: "Shop Now",
          secondaryAction: "Browse Options",
          sections: [
            {
              title: "Pharmacy Partners",
              items: [
                { title: "CVS Pharmacy", subtitle: "Free same-day delivery", action: "order-cvs" },
                { title: "Walgreens", subtitle: "24/7 pickup available", action: "order-walgreens" },
                { title: "Express Scripts", subtitle: "Mail order pharmacy", action: "order-express" }
              ]
            },
            {
              title: "Prescription Details",
              items: [
                { title: "Semaglutide 0.5mg", subtitle: "Starting dose - 4 pens", action: "view-details" },
                { title: "Dosing Schedule", subtitle: "Weekly injections", action: "view-schedule" }
              ]
            }
          ]
        }
      }
    ]
  },

  "take-injection": {
    id: "take-injection",
    name: "Take Injection Flow", 
    messages: [
      {
        content: "Let me guide you through your Semaglutide injection process with step-by-step instructions and safety tips.",
        isUser: false,
        type: "unified-message",
        data: {
          type: "administer-drug",
          title: "Semaglutide Injection Guide",
          message: "Follow these steps for safe and effective administration of your weekly Semaglutide injection.",
          primaryAction: "Start Injection",
          secondaryAction: "Watch Video",
          sections: [
            {
              title: "Pre-Injection Checklist",
              items: [
                { title: "Wash your hands", subtitle: "Use soap and warm water for 20 seconds", action: "check-hands" },
                { title: "Check expiration date", subtitle: "Ensure medication is not expired", action: "check-date" },
                { title: "Inspect the pen", subtitle: "Look for cracks or damage", action: "inspect-pen" }
              ]
            },
            {
              title: "Injection Steps",
              items: [
                { title: "Remove cap and attach needle", subtitle: "Use a new needle for each injection", action: "attach-needle" },
                { title: "Prime the pen", subtitle: "Remove air bubbles", action: "prime-pen" },
                { title: "Select injection site", subtitle: "Thigh, abdomen, or upper arm", action: "select-site" },
                { title: "Inject medication", subtitle: "Hold for 6 seconds after injection", action: "inject" }
              ]
            },
            {
              title: "Post-Injection Care", 
              items: [
                { title: "Dispose of needle safely", subtitle: "Use sharps container", action: "dispose-needle" },
                { title: "Record injection", subtitle: "Log date, time, and site", action: "log-injection" }
              ]
            }
          ]
        }
      }
    ]
  },

  "know-drug": {
    id: "know-drug",
    name: "Know Your Drug Flow",
    messages: [
      {
        content: "Here's comprehensive information about Semaglutide to help you understand your medication better.",
        isUser: false,
        type: "unified-message",
        data: {
          type: "drug-education",
          title: "Semaglutide: Complete Guide",
          message: "Understanding your medication is key to successful treatment. Here's everything you need to know about Semaglutide.",
          primaryAction: "Learn More",
          secondaryAction: "Ask Questions",
          sections: [
            {
              title: "How Semaglutide Works",
              items: [
                { title: "GLP-1 Receptor Agonist", subtitle: "Mimics natural hormone to regulate blood sugar", action: "learn-mechanism" },
                { title: "Slows Gastric Emptying", subtitle: "Helps you feel full longer", action: "learn-satiety" },
                { title: "Insulin Regulation", subtitle: "Improves insulin sensitivity", action: "learn-insulin" }
              ]
            },
            {
              title: "Benefits & Effects",
              items: [
                { title: "Weight Management", subtitle: "Average 10-15% body weight reduction", action: "view-weight-data" },
                { title: "Blood Sugar Control", subtitle: "Helps maintain healthy glucose levels", action: "view-glucose-data" },
                { title: "Cardiovascular Health", subtitle: "May reduce heart disease risk", action: "view-cardio-benefits" }
              ]
            },
            {
              title: "Important Safety Information",
              items: [
                { title: "Common Side Effects", subtitle: "Nausea, vomiting, diarrhea (usually temporary)", action: "view-side-effects" },
                { title: "Rare but Serious", subtitle: "Pancreatitis, kidney problems", action: "view-warnings" },
                { title: "Drug Interactions", subtitle: "Inform your doctor of all medications", action: "check-interactions" }
              ]
            }
          ]
        }
      }
    ]
  },

  "start-assessment": {
    id: "start-assessment", 
    name: "Health Assessment Flow",
    messages: [
      {
        content: "I'll help you create a personalized health plan. Let me ask you a few questions about your health, lifestyle, and goals.",
        isUser: false,
        type: "normal"
      }
      // Assessment questions will be dynamically added based on ASSESSMENT_QUESTIONS
    ]
  }
}

// Helper function to create assessment flow messages
export const createAssessmentFlow = (): Message[] => {
  const messages: Message[] = [
    {
      id: Date.now().toString(),
      content: "I'll help you create a personalized health plan. Let me ask you a few questions about your health, lifestyle, and goals.",
      isUser: false,
      timestamp: new Date(),
      type: "normal"
    }
  ]

  // Add each assessment question as a message
  ASSESSMENT_QUESTIONS.forEach((question, index) => {
    messages.push({
      id: (Date.now() + index + 1).toString(),
      content: `Question ${index + 1} of ${ASSESSMENT_QUESTIONS.length}: ${question.question}`,
      isUser: false,
      timestamp: new Date(),
      type: question.questionType === "single-choice" || question.questionType === "multiple-choice" 
        ? "assessment-choice" 
        : "assessment-input",
      data: {
        questionId: question.id,
        questionType: question.questionType,
        options: question.options,
        placeholder: question.placeholder
      },
      isActive: index === 0 // Only first question is active initially
    })
  })

  return messages
}

// Helper function to create AI generation and plan ready messages
export const createPlanGenerationFlow = (): Message[] => {
  return [
    {
      id: Date.now().toString(),
      content: "AI is analyzing your responses...",
      isUser: false,
      timestamp: new Date(),
      type: "ai-generation"
    },
    {
      id: (Date.now() + 1).toString(),
      content: "🎉 Great news! Your personalized health plan is ready. This comprehensive plan is tailored specifically to your goals, preferences, and health profile.",
      isUser: false,
      timestamp: new Date(),
      type: "plan-ready-card",
      data: GENERATED_PLAN_DATA
    }
  ]
}

// Action to Flow Mapping
export const ACTION_FLOW_MAP: Record<string, string> = {
  "order-drug": "order-drug",
  "take-injection": "take-injection", 
  "know-drug": "know-drug",
  "start-assessment": "start-assessment"
}

// Helper function to get flow messages for an action
export const getFlowMessages = (action: string): Message[] => {
  const flowId = ACTION_FLOW_MAP[action]
  if (!flowId) return []

  const flow = MESSAGE_FLOWS[flowId]
  if (!flow) return []

  if (flowId === "start-assessment") {
    return createAssessmentFlow()
  }

  return flow.messages.map((template, index) => ({
    ...template,
    id: (Date.now() + index).toString(),
    timestamp: new Date()
  }))
}

// Helper function to handle action clicks and return appropriate messages
export const handleActionFlow = (action: string): Message[] => {
  console.log("Handling action flow for:", action)
  return getFlowMessages(action)
}