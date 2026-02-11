"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Icon } from '@/components/ui/icon'

export function SettingsTab() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [dataBackupEnabled, setDataBackupEnabled] = useState(true)
  const [biometricsEnabled, setBiometricsEnabled] = useState(true)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  const settingsData = {
    profile: {
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1985-03-15",
      emergencyContact: "Sarah Johnson - +1 (555) 987-6543"
    },
    privacy: {
      dataRetentionDays: 365,
      shareWithCareTeam: true,
      anonymousAnalytics: true,
      marketingCommunications: false
    },
    notifications: {
      medicationReminders: true,
      appointmentReminders: true,
      healthInsights: true,
      programUpdates: true,
      emergencyAlerts: true
    },
    dataExport: {
      lastExport: "2024-01-05",
      availableFormats: ["PDF", "CSV", "JSON"],
      includeOptions: [
        "Health metrics",
        "Medication history", 
        "Appointment records",
        "Chat history",
        "Program progress"
      ]
    },
    device: {
      appVersion: "3.8.11",
      lastSync: "2 minutes ago",
      storageUsed: "127 MB",
      cacheSize: "23 MB"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const ToggleSwitch = ({ enabled, onToggle, label, description }: { 
    enabled: boolean, 
    onToggle: (value: boolean) => void, 
    label: string,
    description?: string 
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
          {label}
        </div>
        {description && (
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {description}
          </div>
        )}
      </div>
      <motion.button
        className="relative w-12 h-6 rounded-full border transition-all duration-200"
        style={{
          backgroundColor: enabled ? "var(--app-primary)" : "rgba(156, 163, 175, 0.3)",
          borderColor: enabled ? "var(--app-primary)" : "var(--border-color)"
        }}
        onClick={() => onToggle(!enabled)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute w-5 h-5 bg-[var(--ds-surface-primary)] rounded-full shadow-sm"
          animate={{
            x: enabled ? 26 : 2,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ top: "1px" }}
        />
      </motion.button>
    </div>
  )

  const SettingItem = ({ icon: Icon, title, value, onClick, showChevron = true }: {
    icon: any,
    title: string,
    value: string,
    onClick?: () => void,
    showChevron?: boolean
  }) => (
    <motion.div
      className="flex items-center justify-between py-3 cursor-pointer hover:bg-black/5 rounded-lg px-2 transition-colors"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
        <div>
          <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
            {title}
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {value}
          </div>
        </div>
      </div>
      {showChevron && (
        <Icon name="chevronRight" className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
      )}
    </motion.div>
  )

  const StatCard = ({ icon: Icon, label, value, color = "var(--app-primary)" }: {
    icon: any,
    label: string,
    value: string,
    color?: string
  }) => (
    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}>
      <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
      <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {label}
      </div>
    </div>
  )

  return (
    <motion.div
      className="p-4 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Settings */}
      <motion.div
        className="rounded-xl border shadow-sm p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          borderColor: "var(--border-color)"
        }}
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Icon name="person" className="w-5 h-5" style={{ color: "var(--app-primary)" }} />
          Profile Information
        </h3>
        <div className="space-y-1">
          <SettingItem icon={User} title="Full Name" value={settingsData.profile.name} />
          <SettingItem icon={User} title="Email Address" value={settingsData.profile.email} />
          <SettingItem icon={Smartphone} title="Phone Number" value={settingsData.profile.phone} />
          <SettingItem icon={Heart} title="Date of Birth" value={settingsData.profile.dateOfBirth} />
          <SettingItem icon={Shield} title="Emergency Contact" value={settingsData.profile.emergencyContact} />
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        className="rounded-xl border shadow-sm p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          borderColor: "var(--border-color)"
        }}
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Icon name="notifications" className="w-5 h-5" style={{ color: "var(--app-primary)" }} />
          Notifications
        </h3>
        <div className="space-y-2">
          <ToggleSwitch
            enabled={settingsData.notifications.medicationReminders}
            onToggle={() => {}}
            label="Medication Reminders"
            description="Daily injection and dose alerts"
          />
          <ToggleSwitch
            enabled={settingsData.notifications.appointmentReminders}
            onToggle={() => {}}
            label="Appointment Reminders"
            description="Upcoming consultations and check-ins"
          />
          <ToggleSwitch
            enabled={settingsData.notifications.healthInsights}
            onToggle={() => {}}
            label="Health Insights"
            description="Weekly progress summaries"
          />
          <ToggleSwitch
            enabled={settingsData.notifications.programUpdates}
            onToggle={() => {}}
            label="Program Updates"
            description="New features and improvements"
          />
          <ToggleSwitch
            enabled={settingsData.notifications.emergencyAlerts}
            onToggle={() => {}}
            label="Emergency Alerts"
            description="Critical health notifications"
          />
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        className="rounded-xl border shadow-sm p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          borderColor: "var(--border-color)"
        }}
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Icon name="shield" className="w-5 h-5" style={{ color: "var(--app-primary)" }} />
          Privacy & Security
        </h3>
        <div className="space-y-2">
          <ToggleSwitch
            enabled={biometricsEnabled}
            onToggle={setBiometricsEnabled}
            label="Biometric Authentication"
            description="Face ID / Touch ID for app access"
          />
          <ToggleSwitch
            enabled={settingsData.privacy.shareWithCareTeam}
            onToggle={() => {}}
            label="Share with Care Team"
            description="Allow care team to access your health data"
          />
          <ToggleSwitch
            enabled={settingsData.privacy.anonymousAnalytics}
            onToggle={() => {}}
            label="Anonymous Analytics"
            description="Help improve app performance"
          />
          <ToggleSwitch
            enabled={settingsData.privacy.marketingCommunications}
            onToggle={() => {}}
            label="Marketing Communications"
            description="Receive promotional messages"
          />
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                Show Sensitive Data
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Display health metrics and personal information
              </div>
            </div>
            <motion.button
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className="p-2 rounded-lg hover:bg-black/5 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {showSensitiveData ? (
                <Icon name="eyeOff" className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
              ) : (
                <Icon name="eye" className="w-4 h-4" style={{ color: "var(--app-primary)" }} />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        className="rounded-xl border shadow-sm p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          borderColor: "var(--border-color)"
        }}
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Icon name="database" className="w-5 h-5" style={{ color: "var(--app-primary)" }} />
          Data Management
        </h3>
        <div className="space-y-1">
          <SettingItem 
            icon={Download} 
            title="Export Health Data" 
            value={`Last export: ${settingsData.dataExport.lastExport}`}
          />
          <SettingItem 
            icon={Clock} 
            title="Data Retention" 
            value={`${settingsData.privacy.dataRetentionDays} days`}
          />
          <ToggleSwitch
            enabled={dataBackupEnabled}
            onToggle={setDataBackupEnabled}
            label="Automatic Backup"
            description="Backup data to secure cloud storage"
          />
        </div>
      </motion.div>

      {/* App Information */}
      <motion.div
        className="rounded-xl border shadow-sm p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          borderColor: "var(--border-color)"
        }}
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <SettingsIcon className="w-5 h-5" style={{ color: "var(--app-primary)" }} />
          App Information
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <StatCard icon={Activity} label="App Version" value={settingsData.device.appVersion} />
          <StatCard icon={Clock} label="Last Sync" value={settingsData.device.lastSync} />
          <StatCard icon={Database} label="Storage Used" value={settingsData.device.storageUsed} />
          <StatCard icon={Smartphone} label="Cache Size" value={settingsData.device.cacheSize} />
        </div>
        <div className="space-y-1">
          <SettingItem 
            icon={Download} 
            title="Check for Updates" 
            value="You're on the latest version"
            showChevron={false}
          />
          <SettingItem 
            icon={Trash2} 
            title="Clear Cache" 
            value="Free up storage space"
          />
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        className="rounded-xl border shadow-sm p-4"
        style={{
          backgroundColor: "rgba(239, 68, 68, 0.05)",
          backdropFilter: "blur(8px)",
          borderColor: "rgba(239, 68, 68, 0.2)"
        }}
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--status-error)" }}>
          <Icon name="delete" className="w-5 h-5" />
          Account Management
        </h3>
        <div className="space-y-1">
          <motion.button
            className="w-full text-left py-3 px-2 rounded-lg hover:bg-red-50 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="font-medium text-sm" style={{ color: "var(--status-error)" }}>
              Deactivate Account
            </div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Temporarily disable your account
            </div>
          </motion.button>
          <motion.button
            className="w-full text-left py-3 px-2 rounded-lg hover:bg-red-50 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="font-medium text-sm" style={{ color: "var(--status-error)" }}>
              Delete Account
            </div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Permanently delete your account and all data
            </div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}