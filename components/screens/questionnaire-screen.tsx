"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { motion } from 'framer-motion'

interface QuestionnaireScreenProps {
  onBack: () => void
  onSubmit: (data: any) => void
}

export function QuestionnaireScreen({ onBack, onSubmit }: QuestionnaireScreenProps) {
  const [formData, setFormData] = useState({
    exerciseFrequency: "",
    dietPreference: "",
    goals: [] as string[],
    alcoholPreference: "",
    currentWeight: "",
    targetWeight: "",
    height: "",
    age: "",
    medicalConditions: [] as string[],
    foodAllergies: "",
    mealTimes: [] as string[],
    labsUploaded: false,
  })

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const calculateBMI = () => {
    if (formData.currentWeight && formData.height) {
      const weight = parseFloat(formData.currentWeight)
      const height = parseFloat(formData.height) / 100 // convert cm to meters
      if (weight > 0 && height > 0) {
        return (weight / (height * height)).toFixed(1)
      }
    }
    return null
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" }
    if (bmi < 25) return { category: "Normal weight", color: "text-green-600" }
    if (bmi < 30) return { category: "Overweight", color: "text-orange-600" }
    return { category: "Obese", color: "text-red-600" }
  }

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
    }))
  }

  const toggleMedicalCondition = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalConditions: prev.medicalConditions.includes(condition)
        ? prev.medicalConditions.filter((c) => c !== condition)
        : [...prev.medicalConditions, condition],
    }))
  }

  const toggleMealTime = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      mealTimes: prev.mealTimes.includes(time) ? prev.mealTimes.filter((t) => t !== time) : [...prev.mealTimes, time],
    }))
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--app-login-gradient)' }}>
      {/* Fixed Header Only */}
      <div className="flex items-center justify-between py-4 px-4">
        {/* Back Button - Circular */}
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)" }}
        >
          <Icon name="arrowLeft" className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
        </button>
        
        {/* Title Section */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-[var(--card-header-text)]">
            Health Assessment
          </h1>
          <p className="text-sm text-[var(--ds-text-secondary)] mt-1">Complete your health profile</p>
        </div>
        
        {/* Right spacer for balance */}
        <div className="w-10 h-10"></div>
      </div>

      {/* Scrollable Content */}
      <motion.div 
        className="flex-1 overflow-y-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="p-3 space-y-4">
          {/* Hero Image Section - Now in scrollable area */}
          <div className="flex justify-center pb-3">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--icon-bg-primary)" }}
              >
                <Icon name="clipboardList" className="w-10 h-10" style={{ color: "var(--app-primary)" }} />
              </div>
            </div>
          </div>

        {/* Assessment Introduction Card */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
        <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-lg">
          <CardContent className="p-4 text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: "var(--app-primary-light, #e3f2fd)" }}
            >
              <Icon name="clipboardList" className="w-6 h-6" style={{ color: "var(--app-primary)" }} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Semaglutide Program Assessment</h2>
            <p className="text-[var(--ds-text-secondary)] text-sm mb-3">
              Complete this personalized assessment to get your AI-generated 30-day plan
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-[var(--ds-text-secondary)] mb-3">
              <span>All questions</span>
              <span>•</span>
              <span>2-3 minutes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ backgroundColor: "var(--app-primary)", width: "100%" }}
              ></div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Question 1: Exercise Frequency */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
        <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--ds-text-inverse)]"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                1
              </div>
              <h3 className="text-base font-semibold text-gray-900">Exercise Frequency</h3>
            </div>
            <p className="text-[var(--ds-text-secondary)] text-sm mb-3">How often do you currently exercise?</p>
            <div className="space-y-2">
              {["Never", "1-2 times per week", "3-4 times per week", "5+ times per week", "Daily"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[var(--ds-border-default)] hover:bg-[var(--ds-surface-secondary)] cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="exerciseFrequency"
                    value={option}
                    checked={formData.exerciseFrequency === option}
                    onChange={(e) => setFormData((prev) => ({ ...prev, exerciseFrequency: e.target.value }))}
                    className="w-4 h-4"
                    style={{ accentColor: "var(--app-primary)" }}
                  />
                  <span className="text-gray-700 text-sm">{option}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Question 2: Diet Preferences */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
        <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--ds-text-inverse)]"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                2
              </div>
              <h3 className="text-base font-semibold text-gray-900">Dietary Preferences</h3>
            </div>
            <p className="text-[var(--ds-text-secondary)] text-sm mb-3">What are your dietary preferences?</p>
            <div className="space-y-2">
              {["Vegetarian", "Non-Vegetarian", "Vegan", "Pescatarian", "No specific preference"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[var(--ds-border-default)] hover:bg-[var(--ds-surface-secondary)] cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="dietPreference"
                    value={option}
                    checked={formData.dietPreference === option}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dietPreference: e.target.value }))}
                    className="w-4 h-4"
                    style={{ accentColor: "var(--app-primary)" }}
                  />
                  <span className="text-gray-700 text-sm">{option}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Question 3: Goals */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
        <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--ds-text-inverse)]"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                3
              </div>
              <h3 className="text-base font-semibold text-gray-900">Primary Goals</h3>
            </div>
            <p className="text-[var(--ds-text-secondary)] text-sm mb-3">What are your primary goals? (Select all that apply)</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Weight Loss",
                "Improved Energy",
                "Better Sleep",
                "Reduced Cravings",
                "Healthier Habits",
                "Medical Compliance",
              ].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${
                    formData.goals.includes(goal)
                      ? "text-[var(--ds-text-inverse)] border-transparent"
                      : "text-gray-700 border-gray-300 hover:bg-[var(--ds-surface-secondary)]"
                  }`}
                  style={formData.goals.includes(goal) ? { backgroundColor: "var(--app-primary)" } : {}}
                  onClick={() => toggleGoal(goal)}
                >
                  {goal}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Question 4: Physical Information */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
        <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--ds-text-inverse)]"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                4
              </div>
              <h3 className="text-base font-semibold text-gray-900">Physical Information</h3>
            </div>
            <p className="text-[var(--ds-text-secondary)] text-sm mb-3">Help us understand your physical profile</p>
            
            {/* Height and Age Row */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter height"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Age (years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter age"
                />
              </div>
            </div>

            {/* Weight Row */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  value={formData.currentWeight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, currentWeight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter weight"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Target Weight (kg)</label>
                <input
                  type="number"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, targetWeight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter target"
                />
              </div>
            </div>

            {/* BMI Display */}
            {(() => {
              const bmi = calculateBMI()
              if (bmi) {
                const bmiNum = parseFloat(bmi)
                const { category, color } = getBMICategory(bmiNum)
                return (
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Your BMI:</span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">{bmi}</span>
                        <div className={`text-xs font-medium ${color}`}>{category}</div>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            })()}
          </CardContent>
        </Card>
        </motion.div>

        {/* Question 5: Alcohol Preferences */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
        <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--ds-text-inverse)]"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                5
              </div>
              <h3 className="text-base font-semibold text-gray-900">Alcohol Consumption</h3>
            </div>
            <p className="text-[var(--ds-text-secondary)] text-sm mb-3">How often do you consume alcohol?</p>
            <div className="relative">
              <select
                value={formData.alcoholPreference}
                onChange={(e) => setFormData((prev) => ({ ...prev, alcoholPreference: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-[var(--ds-surface-primary)]"
              >
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="rarely">Rarely (few times a year)</option>
                <option value="occasionally">Occasionally (1-2 times a month)</option>
                <option value="regularly">Regularly (1-2 times a week)</option>
                <option value="frequently">Frequently (3+ times a week)</option>
              </select>
              <Icon name="chevronDown" className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Question 6: Medical Conditions */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
        <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--ds-text-inverse)]"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                6
              </div>
              <h3 className="text-base font-semibold text-gray-900">Medical Conditions</h3>
            </div>
            <p className="text-[var(--ds-text-secondary)] text-sm mb-3">Do you have any of these conditions? (Select all that apply)</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Diabetes",
                "High Blood Pressure",
                "Heart Disease",
                "Thyroid Issues",
                "PCOS",
                "Sleep Apnea",
                "None",
              ].map((condition) => (
                <button
                  key={condition}
                  type="button"
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${
                    formData.medicalConditions.includes(condition)
                      ? "text-[var(--ds-text-inverse)] border-transparent"
                      : "text-gray-700 border-gray-300 hover:bg-[var(--ds-surface-secondary)]"
                  }`}
                  style={
                    formData.medicalConditions.includes(condition) ? { backgroundColor: "var(--app-primary)" } : {}
                  }
                  onClick={() => toggleMedicalCondition(condition)}
                >
                  {condition}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Question 7: Food Allergies */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
        <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--ds-text-inverse)]"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                7
              </div>
              <h3 className="text-base font-semibold text-gray-900">Food Allergies & Intolerances</h3>
            </div>
            <p className="text-[var(--ds-text-secondary)] text-sm mb-3">
              List any food allergies, intolerances, or foods you prefer to avoid
            </p>
            <textarea
              value={formData.foodAllergies}
              onChange={(e) => setFormData((prev) => ({ ...prev, foodAllergies: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="e.g., Nuts, dairy, gluten, shellfish..."
            />
          </CardContent>
        </Card>
        </motion.div>

        {/* Question 8: Preferred Meal Times */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
        <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--ds-text-inverse)]"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                8
              </div>
              <h3 className="text-base font-semibold text-gray-900">Preferred Meal Times</h3>
            </div>
            <p className="text-[var(--ds-text-secondary)] text-sm mb-3">When do you prefer to have your meals? (Select all that apply)</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Early Breakfast (6-7 AM)",
                "Regular Breakfast (7-9 AM)",
                "Mid-Morning Snack",
                "Lunch (12-2 PM)",
                "Afternoon Snack",
                "Early Dinner (5-7 PM)",
                "Late Dinner (7-9 PM)",
              ].map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${
                    formData.mealTimes.includes(time)
                      ? "text-[var(--ds-text-inverse)] border-transparent"
                      : "text-gray-700 border-gray-300 hover:bg-[var(--ds-surface-secondary)]"
                  }`}
                  style={formData.mealTimes.includes(time) ? { backgroundColor: "var(--app-primary)" } : {}}
                  onClick={() => toggleMealTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Question 9: Upload Recent Labs */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
        <Card className="shadow-sm border-0 bg-[var(--ds-surface-primary)] rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--ds-text-inverse)]"
                style={{ backgroundColor: "var(--app-primary)" }}
              >
                9
              </div>
              <h3 className="text-base font-semibold text-gray-900">Lab Reports</h3>
            </div>
            <p className="text-[var(--ds-text-secondary)] text-sm mb-3">
              Upload your recent lab reports for more personalized recommendations (Optional)
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <Icon name="upload" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-[var(--ds-text-secondary)] mb-2">Drag and drop your lab reports here, or click to browse</p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-transparent"
                onClick={() => setFormData((prev) => ({ ...prev, labsUploaded: true }))}
              >
                Choose Files
              </Button>
              {formData.labsUploaded && (
                <p className="text-xs text-green-600 mt-2 font-medium">✓ Lab reports uploaded successfully</p>
              )}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Submit Button */}
        <motion.div 
          className="pb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <Button
            onClick={handleSubmit}
            className="w-full font-semibold py-3 text-sm"
            style={{ backgroundColor: "var(--app-primary)" }}
            disabled={!formData.exerciseFrequency || !formData.dietPreference}
          >
            Generate My Personalized Plan
          </Button>
        </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
