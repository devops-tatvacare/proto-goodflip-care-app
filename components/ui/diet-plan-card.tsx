import React, { useState } from 'react'
import { MaterialIcon } from '@/components/ui/material-icon'

interface DietPlanItem {
  id: string
  category: string
  item: string
  completed: boolean
}

interface DietPlanCardProps {
  mealType: string
  onComplete: (completedItems: DietPlanItem[]) => void
}

const DietPlanCard: React.FC<DietPlanCardProps> = ({ mealType, onComplete }) => {
  const [dietItems, setDietItems] = useState<DietPlanItem[]>(() => {
    // Sample diet plan items based on meal type
    const mealPlans = {
      breakfast: [
        { id: '1', category: 'Protein', item: '2 eggs or 1 cup Greek yogurt', completed: false },
        { id: '2', category: 'Carbs', item: '1 slice whole grain toast or 1/2 cup oatmeal', completed: false },
        { id: '3', category: 'Fats', item: '1 tbsp olive oil or 1/4 avocado', completed: false },
        { id: '4', category: 'Vegetables', item: '1 cup spinach or mixed greens', completed: false },
        { id: '5', category: 'Hydration', item: '1 glass water before meal', completed: false }
      ],
      lunch: [
        { id: '1', category: 'Protein', item: '4 oz lean meat, fish, or tofu', completed: false },
        { id: '2', category: 'Carbs', item: '1/2 cup brown rice or quinoa', completed: false },
        { id: '3', category: 'Vegetables', item: '2 cups mixed vegetables', completed: false },
        { id: '4', category: 'Fats', item: '1 tbsp healthy oils or nuts', completed: false },
        { id: '5', category: 'Fiber', item: 'Include beans or legumes', completed: false }
      ],
      dinner: [
        { id: '1', category: 'Protein', item: '4 oz lean protein source', completed: false },
        { id: '2', category: 'Vegetables', item: '3 cups non-starchy vegetables', completed: false },
        { id: '3', category: 'Carbs', item: '1/3 cup complex carbs (optional)', completed: false },
        { id: '4', category: 'Fats', item: '1 tbsp healthy fats', completed: false },
        { id: '5', category: 'Portion', item: 'Stop eating when 80% full', completed: false }
      ],
      snacks: [
        { id: '1', category: 'Protein', item: 'Handful of nuts or seeds', completed: false },
        { id: '2', category: 'Fiber', item: '1 apple or berries', completed: false },
        { id: '3', category: 'Hydration', item: 'Glass of water', completed: false }
      ]
    }
    
    return mealPlans[mealType as keyof typeof mealPlans] || mealPlans.lunch
  })

  const toggleItem = (id: string) => {
    const updatedItems = dietItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    setDietItems(updatedItems)
  }

  const completedCount = dietItems.filter(item => item.completed).length
  const totalCount = dietItems.length
  const isComplete = completedCount === totalCount

  const handleConfirmPlan = () => {
    onComplete(dietItems)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 capitalize">
          {mealType} Diet Plan
        </h3>
        <div className="flex items-center gap-2">
          <div className="text-base font-semibold text-green-600">
            {completedCount}/{totalCount}
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">items</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {dietItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`flex items-center p-2.5 rounded-lg border cursor-pointer transition-all ${
              item.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 ${
                item.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300'
              }`}
            >
              {item.completed && <MaterialIcon icon="check" size={14} color="white" />}
            </div>
            <div className="flex-1">
              <div className={`text-xs font-medium ${
                item.completed ? 'text-green-800' : 'text-gray-700'
              }`}>
                {item.category}
              </div>
              <div className={`text-xs ${
                item.completed ? 'text-green-600' : 'text-gray-600'
              }`}>
                {item.item}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round((completedCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Complete button */}
      <button
        onClick={handleConfirmPlan}
        disabled={!isComplete}
        className={`w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
          isComplete
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isComplete ? '✅ Complete Diet Plan Log' : 'Complete all items to continue'}
      </button>
      
      {isComplete && (
        <div className="mt-2 text-center text-xs text-green-600 font-medium">
          🎉 Great job following your diet plan!
        </div>
      )}
    </div>
  )
}

export default DietPlanCard