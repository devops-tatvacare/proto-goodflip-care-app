"use client"

import { motion } from "framer-motion"
import { Icon } from '@/components/ui/icon'

export function CareTeamTab() {
  const careTeamData = {
    primaryCoach: {
      id: "coach-sarah",
      name: "Sarah Miller",
      role: "Lead Health Coach",
      specialty: "Diabetes & Weight Management",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 4.9,
      experience: "8 years",
      lastContact: "2 hours ago",
      nextAvailable: "Today, 3:00 PM",
      badges: ["Certified Diabetes Educator", "Nutrition Specialist"],
      patients: 89,
      successRate: 94,
      isOnline: true,
      bio: "Passionate about helping patients achieve sustainable lifestyle changes through personalized coaching and evidence-based strategies."
    },
    supportTeam: [
      {
        id: "nurse-emily",
        name: "Emily Rodriguez",
        role: "Clinical Nurse",
        specialty: "Medication Management",
        avatar: "/placeholder.svg?height=50&width=50",
        rating: 4.8,
        lastContact: "Yesterday",
        nextAvailable: "Tomorrow, 10:00 AM",
        badges: ["RN", "Injection Training"],
        isOnline: false,
        bio: "Specializing in patient education and medication adherence support."
      },
      {
        id: "nutritionist-david",
        name: "David Chen",
        role: "Nutritionist",
        specialty: "Meal Planning & Metabolic Health",
        avatar: "/placeholder.svg?height=50&width=50",
        rating: 4.9,
        lastContact: "3 days ago",
        nextAvailable: "Friday, 11:00 AM",
        badges: ["Registered Dietitian", "Sports Nutrition"],
        isOnline: true,
        bio: "Expert in creating sustainable nutrition plans for metabolic health improvement."
      },
      {
        id: "pharmacist-lisa",
        name: "Lisa Thompson",
        role: "Clinical Pharmacist",
        specialty: "Drug Interactions & Side Effects",
        avatar: "/placeholder.svg?height=50&width=50",
        rating: 4.7,
        lastContact: "1 week ago",
        nextAvailable: "Monday, 2:00 PM",
        badges: ["PharmD", "Medication Therapy Management"],
        isOnline: false,
        bio: "Ensuring optimal medication outcomes through comprehensive pharmaceutical care."
      }
    ],
    teamStats: {
      totalInteractions: 47,
      avgResponseTime: "< 2 hours",
      satisfactionScore: 4.8,
      programCompletion: 96
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

  const CoachCard = ({ coach, isPrimary = false, index = 0 }: { coach: any, isPrimary?: boolean, index?: number }) => (
    <motion.div
      className="rounded-xl border shadow-sm p-4"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
        borderColor: isPrimary ? "var(--app-primary)" : "var(--border-color)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
    >
      {/* Compact Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full overflow-hidden border-2"
              style={{ borderColor: coach.isOnline ? "var(--status-success)" : "var(--border-color)" }}
            >
              <img
                src={coach.avatar}
                alt={coach.name}
                className="w-full h-full object-cover"
              />
            </div>
            {coach.isOnline && (
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                style={{ backgroundColor: "var(--status-success)" }}
              />
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                {coach.name}
              </h3>
              {isPrimary && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                  backgroundColor: "rgba(39, 116, 174, 0.1)",
                  color: "var(--app-primary)"
                }}>
                  Primary
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: "var(--app-primary)" }}>
              {coach.role}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-[var(--text-secondary)]">
            Last: {coach.lastContact}
          </div>
          <div className="text-xs" style={{ color: coach.isOnline ? "var(--status-success)" : "var(--text-muted)" }}>
            {coach.isOnline ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <motion.button
          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium"
          style={{
            backgroundColor: "var(--app-primary)",
            color: "var(--ds-text-inverse)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon name="forum" className="w-3 h-3" />
          Message
        </motion.button>

        <motion.button
          className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderColor: "var(--app-primary)",
            color: "var(--app-primary)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon name="phone" className="w-3 h-3" />
          Call
        </motion.button>
      </div>
    </motion.div>
  )


  return (
    <motion.div
      className="p-4 space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* Primary Coach */}
      <motion.div variants={itemVariants}>
        <CoachCard coach={careTeamData.primaryCoach} isPrimary={true} index={0} />
      </motion.div>

      {/* Support Team */}
      <motion.div variants={itemVariants}>
        <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Support Team
        </h3>
        <div className="space-y-3">
          {careTeamData.supportTeam.map((member, index) => (
            <CoachCard key={member.id} coach={member} index={index + 1} />
          ))}
        </div>
      </motion.div>

    </motion.div>
  )
}