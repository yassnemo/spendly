import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useUserTransactions, useUserBudgets, useUserGoals } from "@/hooks/useUserData";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  PieChart,
  BarChart3,
  Plus,
  FileText,
  LogOut,
  Menu,
  X,
  Home,
  CreditCard,
  Wallet,
  Settings,
  Bell,
  Search
} from "lucide-react";

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Fetch real user data
  const { data: transactions = [], isLoading: transactionsLoading } = useUserTransactions();
  const { data: budgets = [], isLoading: budgetsLoading } = useUserBudgets();
  const { data: goals = [], isLoading: goalsLoading } = useUserGoals();

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "budgets", label: "Budgets", icon: Wallet },
    { id: "goals", label: "Goals", icon: Target },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "upload", label: "Upload CSV", icon: Upload },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Calculate real data from user's transactions and budgets
  const dashboardData = useMemo(() => {
    const totalBalance = transactions.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.amount);
      return transaction.type === 'income' ? sum + amount : sum - amount;
    }, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const monthlySpent = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const monthlyBudget = budgets
      .filter(b => b.period === 'monthly')
      .reduce((sum, b) => sum + parseFloat(b.amount), 0);

    const savingsGoal = goals.reduce((sum, g) => sum + parseFloat(g.targetAmount), 0);
    const currentSavings = goals.reduce((sum, g) => sum + parseFloat(g.currentAmount || "0"), 0);

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);

    return {
      totalBalance,
      monthlyBudget: monthlyBudget || 0,
      spent: monthlySpent,
      savings: currentSavings,
      savingsGoal: savingsGoal || 0,
      transactions: recentTransactions
    };
  }, [transactions, budgets, goals]);

  const spendingPercentage = dashboardData.monthlyBudget > 0 
    ? (dashboardData.spent / dashboardData.monthlyBudget) * 100 
    : 0;
  const savingsPercentage = dashboardData.savingsGoal > 0 
    ? (dashboardData.savings / dashboardData.savingsGoal) * 100 
    : 0;

  const isLoading = transactionsLoading || budgetsLoading || goalsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-space text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid lg:grid-cols-4 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Balance</h3>
              <DollarSign className="w-6 h-6 text-mint" />
            </div>
            <div className="text-4xl font-bold text-mint mb-2">
              <AnimatedCounter value={dashboardData.totalBalance} prefix="$" />
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-mint" />
              Real-time balance
            </div>
          </GlassCard>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Monthly Budget</h3>
              <BarChart3 className="w-6 h-6 text-coral" />
            </div>
            <div className="text-2xl font-bold text-coral mb-2">
              <AnimatedCounter value={dashboardData.monthlyBudget} prefix="$" />
            </div>
            <div className="text-sm text-gray-400">
              {spendingPercentage.toFixed(0)}% used
            </div>
            <Progress value={spendingPercentage} className="mt-2" />
          </GlassCard>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Savings Goal</h3>
              <Target className="w-6 h-6 text-teal" />
            </div>
            <div className="text-2xl font-bold text-teal mb-2">
              <AnimatedCounter value={dashboardData.savings} prefix="$" />
            </div>
            <div className="text-sm text-gray-400">
              Target: ${dashboardData.savingsGoal.toLocaleString()}
            </div>
            <Progress value={savingsPercentage} className="mt-2" />
          </GlassCard>
        </motion.div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Spending Trends</h3>
              <PieChart className="w-6 h-6 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <div className="text-xl font-medium">Interactive Chart</div>
                <div className="text-sm">Upload transactions to see your spending analysis</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              {dashboardData.transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No transactions yet</p>
                  <p className="text-sm">Upload your bank statement to get started</p>
                </div>
              ) : (
                dashboardData.transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-coral to-teal rounded-full flex items-center justify-center">
                        {transaction.type === "income" ? (
                          <TrendingUp className="w-5 h-5 text-white" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-400">{transaction.category}</div>
                      </div>
                    </div>
                    <div className={`font-semibold ${transaction.type === "income" ? "text-mint" : "text-coral"}`}>
                      {transaction.type === "income" ? "+" : ""}${Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "transactions":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Transactions</h2>
              <MagneticButton className="px-4 py-2 rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </MagneticButton>
            </div>
            <GlassCard className="p-6">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
                  <p className="text-gray-400">Upload your bank statement to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-coral to-teal rounded-full flex items-center justify-center">
                          {transaction.type === "income" ? (
                            <TrendingUp className="w-6 h-6 text-white" />
                          ) : (
                            <TrendingDown className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{transaction.description}</div>
                          <div className="text-sm text-gray-400">{transaction.category}</div>
                          <div className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${transaction.type === "income" ? "text-mint" : "text-coral"}`}>
                          {transaction.type === "income" ? "+" : ""}${Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                        </div>
                        <Badge variant={transaction.type === "income" ? "default" : "secondary"}>
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        );
      case "upload":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Upload Bank Statement</h2>
            <GlassCard className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-coral to-teal rounded-2xl flex items-center justify-center">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload CSV File</h3>
              <p className="text-gray-400 mb-6">
                Drag your CSV file here or click to browse. We'll automatically categorize your transactions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton className="px-8 py-3 rounded-xl">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </MagneticButton>
                <MagneticButton variant="secondary" className="px-8 py-3 rounded-xl">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Sample
                </MagneticButton>
              </div>
            </GlassCard>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Coming Soon</h2>
            <GlassCard className="p-12 text-center">
              <div className="text-gray-400">This feature is under development</div>
            </GlassCard>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-deep-space text-white flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-64 bg-white/5 backdrop-blur-md border-r border-white/10 z-50"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-coral to-teal rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-semibold">Spendly</span>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-coral to-teal text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-white/5 rounded-lg mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-coral to-teal rounded-full flex items-center justify-center text-sm font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {user?.displayName || user?.email?.split("@")[0]}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="w-full bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-14"}`}>
        {/* Top Bar */}
        <header className="bg-white/5 backdrop-blur-md border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-300 hover:text-white"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {greeting}, <span className="text-coral">{user?.displayName || "there"}!</span>
                </h1>
                <p className="text-gray-400 text-sm">Here's your financial overview</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="py-6 px-6 border-t border-white/10 mt-8">
          <div className="text-center text-gray-400">
            <p className="text-xs">
              Built with ❤️ by{" "}
              <a 
                href="https://yerradouani.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-coral hover:text-coral/80 font-medium transition-colors"
              >
                Yassine Erradouani
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};