import { memo } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Plus, Minus } from "lucide-react";

interface DashboardPreviewProps {
  totalBalance: number;
  monthlyBudget: number;
  currentSpending: number;
  spendingPercentage: number;
  spendingCategories: Array<{
    name: string;
    amount: number;
    color: string;
    icon: string;
  }>;
  onAddToBalance: () => void;
  onSubtractFromBalance: () => void;
  onCategoryClick: (name: string) => void;
}

export const DashboardPreview = memo(({
  totalBalance,
  monthlyBudget,
  currentSpending,
  spendingPercentage,
  spendingCategories,
  onAddToBalance,
  onSubtractFromBalance,
  onCategoryClick
}: DashboardPreviewProps) => {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <GlassCard className="p-4 shadow-2xl max-w-md mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Dashboard</h3>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
          
          {/* Balance Overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-400">Balance</div>
              <div className="text-xl font-bold text-mint flex items-center justify-center gap-1">
                <AnimatedCounter value={totalBalance} prefix="$" />
                <div className="flex">
                  <button 
                    onClick={onAddToBalance}
                    className="p-0.5 rounded bg-green-500/10 hover:bg-green-500/20"
                  >
                    <Plus className="w-2.5 h-2.5 text-green-500" />
                  </button>
                  <button 
                    onClick={onSubtractFromBalance}
                    className="p-0.5 rounded bg-red-500/10 hover:bg-red-500/20 ml-1"
                  >
                    <Minus className="w-2.5 h-2.5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-gray-400">Budget</div>
              <div className="text-xl font-bold text-coral">
                <AnimatedCounter value={monthlyBudget} prefix="$" />
              </div>
            </div>
          </div>
          
          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Spent: ${currentSpending.toLocaleString()}</span>
              <span>{Math.round(spendingPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-coral to-teal h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${spendingPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <div className="text-xs text-gray-400 mb-2">Top Categories</div>
            <div className="space-y-2">
              {spendingCategories.slice(0, 3).map((category, idx) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => onCategoryClick(category.name)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{category.icon}</span>
                    <span className="text-xs text-gray-300">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-white">${category.amount}</span>
                    <div className="w-8 h-1.5 bg-gray-700 rounded-full">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(category.amount / 640) * 100}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.05 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
});

DashboardPreview.displayName = "DashboardPreview";