import React from 'react';
import { SymptomBodySelector } from '@/components/body-selector/SymptomBodySelector';
import DietLogger from '@/components/diet-logger/DietLogger';

// Define the type for a workflow configuration
export type Workflow = {
  intentId: string; // The ID of the intent (e.g., 'log_symptom')
  initialMessage: string; // The bot's first message when this workflow starts
  component: React.ComponentType<{ onComplete: (data: any) => void }>; // The React component to render for this workflow
  // Add any other workflow-specific properties here
};

// The central registry mapping intent IDs to their workflow configurations
export const workflowRegistry: Record<string, Workflow> = {
  'log symptom': {
    intentId: 'log_symptom',
    initialMessage: "Okay, let's log a symptom. Where are you feeling it?",
    component: SymptomBodySelector,
  },
  'log diet': {
    intentId: 'log_diet',
    initialMessage: "Got it. What did you eat?",
    component: DietLogger,
  },
  // Add more workflows here as needed
  // 'check health metrics': {
  //   intentId: 'check_health_metrics',
  //   initialMessage: "Which health metrics are you interested in?",
  //   component: HealthMetricsViewer, // Assuming you have such a component
  // },
};
