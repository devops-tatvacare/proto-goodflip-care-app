// Context screen UI components - smart, reusable, data-driven
// Clean separation of UI logic from business logic

import React from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Icon } from '@/components/ui/icon'
import { ContextSection, PatientProfile, HealthContextData, AIPersonalizationData } from "./context-data"

// Context Header Component - Clean, centered, consistent with program screen
export const ContextHeader = () => (
  <div className="flex flex-col items-center text-center mb-6">
    <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/30 backdrop-blur-sm relative overflow-hidden mb-4" 
         style={{ background: 'linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-light) 50%, var(--app-secondary) 100%)' }}>
      
      {/* Subtle inner glow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
      
      {/* User Profile Icon */}
      <div className="relative z-10 flex flex-col items-center text-[var(--ds-text-inverse)]">
        <Icon name="person" className="w-8 h-8 text-[var(--ds-text-inverse)] drop-shadow-sm" strokeWidth={1.5} />
      </div>
    </div>
    
    {/* Text Description Below Avatar */}
    <h2 className="text-lg font-semibold text-gray-800 mb-2">Patient Context</h2>
    <p className="text-sm text-gray-700 leading-relaxed max-w-sm">
      Your personalized health profile and AI preferences for optimal care.
    </p>
  </div>
)

// Context Section Card Component - Consistent with other screens
interface ContextSectionCardProps {
  section: ContextSection
  isExpanded: boolean
  onToggle: () => void
  children?: React.ReactNode
}

export const ContextSectionCard: React.FC<ContextSectionCardProps> = ({
  section,
  isExpanded,
  onToggle,
  children
}) => {
  const IconComponent = section.icon

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-[var(--ds-surface-primary)] rounded-xl overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between text-left"
        >
          <CardTitle className="text-base font-semibold flex items-center gap-2.5 text-[var(--card-header-text)]">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--app-primary)] to-[var(--app-primary-hover)] flex items-center justify-center">
              <IconComponent className="w-3 h-3 text-[var(--ds-text-inverse)]" />
            </div>
            {section.title}
          </CardTitle>
          {isExpanded ? 
            <Icon name="chevronDown" className="w-4 h-4 text-gray-400" /> : 
            <Icon name="chevronRight" className="w-4 h-4 text-gray-400" />
          }
        </button>
        
        {/* Description always visible in header */}
        <p className="text-sm text-[var(--ds-text-secondary)] mt-1.5 font-medium">{section.description}</p>
      </div>
      
      {/* Content area - shows preview when collapsed, full details when expanded */}
      <CardContent className="px-4 pt-0 pb-3">
        {!isExpanded ? (
          /* Preview items when collapsed - tight chip design with proper enclosure */
          <div className="flex flex-wrap gap-1.5">
            {section.previewItems.map((item, index) => (
              <div 
                key={index} 
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border"
                style={{
                  backgroundColor: "var(--chip-bg-primary)",
                  color: "var(--chip-text-primary)",
                  borderColor: "var(--chip-border-primary)"
                }}
              >
                <item.icon className="w-3 h-3" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        ) : (
          /* Full details when expanded */
          children
        )}
      </CardContent>
    </Card>
  )
}

// Patient Profile Form Component
interface PatientProfileFormProps {
  profile: PatientProfile
  onChange?: (profile: PatientProfile) => void
}

export const PatientProfileForm: React.FC<PatientProfileFormProps> = ({ 
  profile, 
  onChange 
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Name</label>
        <input 
          type="text" 
          defaultValue={profile.name}
          className="w-full px-3 py-2 text-sm border border-[var(--ds-border-default)] rounded-lg focus:ring-2 focus:ring-[var(--app-primary)]/20 focus:border-[var(--app-primary)]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Age</label>
        <input 
          type="number" 
          defaultValue={profile.age}
          className="w-full px-3 py-2 text-sm border border-[var(--ds-border-default)] rounded-lg focus:ring-2 focus:ring-[var(--app-primary)]/20 focus:border-[var(--app-primary)]"
        />
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-3">
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Height (cm)</label>
        <input 
          type="number" 
          defaultValue={profile.height}
          className="w-full px-3 py-2 text-sm border border-[var(--ds-border-default)] rounded-lg focus:ring-2 focus:ring-[var(--app-primary)]/20 focus:border-[var(--app-primary)]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Weight (kg)</label>
        <input 
          type="number" 
          defaultValue={profile.weight}
          className="w-full px-3 py-2 text-sm border border-[var(--ds-border-default)] rounded-lg focus:ring-2 focus:ring-[var(--app-primary)]/20 focus:border-[var(--app-primary)]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">BMI</label>
        <input 
          type="text" 
          value={profile.bmi.toFixed(1)}
          className="w-full px-3 py-2 text-sm border border-[var(--ds-border-default)] rounded-lg bg-gray-50"
          disabled
        />
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-700">Medical Conditions</label>
      <div className="flex flex-wrap gap-2">
        {profile.conditions.map((condition, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--chip-bg-primary)",
              color: "var(--chip-text-primary)"
            }}
          >
            {condition}
          </span>
        ))}
      </div>
    </div>
  </div>
)

// Health Context Display Component
interface HealthContextDisplayProps {
  healthContext: HealthContextData
}

export const HealthContextDisplay: React.FC<HealthContextDisplayProps> = ({ healthContext }) => (
  <div className="space-y-6">
    {/* Current Medications */}
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900">Current Medications</h4>
      <div className="space-y-2">
        {healthContext.currentMedications.map((med, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">{med.name}</div>
              <div className="text-xs text-[var(--ds-text-secondary)]">{med.dosage} • {med.frequency}</div>
            </div>
            {med.lastTaken && (
              <div className="text-xs text-[var(--ds-text-secondary)]">Last: {med.lastTaken}</div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Recent Vitals */}
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900">Recent Vitals</h4>
      <div className="grid grid-cols-1 gap-2">
        {healthContext.vitals.map((vital, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">{vital.label}</div>
              <div className="text-xs text-[var(--ds-text-secondary)]">Updated {vital.lastUpdated}</div>
            </div>
            <div className={`text-sm font-medium ${
              vital.status === 'normal' ? 'text-green-600' :
              vital.status === 'elevated' ? 'text-orange-600' : 'text-blue-600'
            }`}>
              {vital.value}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Allergies & Emergency Contacts */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-900">Allergies</h4>
        <div className="space-y-1">
          {healthContext.allergies.map((allergy, index) => (
            <span 
              key={index}
              className="inline-block px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md mr-2"
            >
              {allergy}
            </span>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-900">Emergency Contacts</h4>
        <div className="space-y-1">
          {healthContext.emergencyContacts.map((contact, index) => (
            <div key={index} className="text-xs">
              <div className="font-medium text-gray-900">{contact.name}</div>
              <div className="text-[var(--ds-text-secondary)]">{contact.relationship} • {contact.phone}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// AI Personalization Settings Component
interface AIPersonalizationSettingsProps {
  settings: AIPersonalizationData
  onChange?: (settings: AIPersonalizationData) => void
}

export const AIPersonalizationSettings: React.FC<AIPersonalizationSettingsProps> = ({
  settings,
  onChange
}) => (
  <div className="space-y-6">
    {/* Communication Style */}
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900">Communication Style</h4>
      <div className="flex gap-2">
        {(['formal', 'casual', 'medical'] as const).map(style => (
          <button
            key={style}
            className={`px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
              settings.communicationStyle === style
                ? 'bg-[var(--app-primary)] text-[var(--ds-text-inverse)]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </button>
        ))}
      </div>
    </div>

    {/* Reminder Frequency */}
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900">Reminder Frequency</h4>
      <div className="flex gap-2">
        {(['low', 'medium', 'high'] as const).map(freq => (
          <button
            key={freq}
            className={`px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
              settings.reminderFrequency === freq
                ? 'bg-[var(--app-primary)] text-[var(--ds-text-inverse)]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {freq.charAt(0).toUpperCase() + freq.slice(1)}
          </button>
        ))}
      </div>
    </div>

    {/* Data Sharing Preferences */}
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900">Data Sharing</h4>
      <div className="space-y-2">
        {Object.entries(settings.dataSharing).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
            </span>
            <input
              type="checkbox"
              checked={value}
              className="w-4 h-4"
              style={{ accentColor: "var(--app-primary)" }}
            />
          </label>
        ))}
      </div>
    </div>

    {/* Preferences */}
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900">Preferences</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Units</label>
          <select 
            defaultValue={settings.preferences.units}
            className="w-full px-3 py-2 text-sm border border-[var(--ds-border-default)] rounded-lg focus:ring-2 focus:ring-[var(--app-primary)]/20"
          >
            <option value="metric">Metric</option>
            <option value="imperial">Imperial</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Language</label>
          <select 
            defaultValue={settings.preferences.language}
            className="w-full px-3 py-2 text-sm border border-[var(--ds-border-default)] rounded-lg focus:ring-2 focus:ring-[var(--app-primary)]/20"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>
      </div>
    </div>
  </div>
)