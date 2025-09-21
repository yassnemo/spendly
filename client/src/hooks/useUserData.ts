import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { Transaction, Budget, Goal, User } from "@shared/schema";

export function useUserTransactions() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['/api/transactions/user', user?.uid],
    queryFn: async () => {
      if (!user) throw new Error('No user logged in');
      
      // First get the user from our database
      const userResponse = await fetch(`/api/users/firebase/${user.uid}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      const userData: User = await userResponse.json();
      
      // Then get their transactions
      const response = await fetch(`/api/transactions/user/${userData.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      return response.json() as Promise<Transaction[]>;
    },
    enabled: !!user,
  });
}

export function useUserBudgets() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['/api/budgets/user', user?.uid],
    queryFn: async () => {
      if (!user) throw new Error('No user logged in');
      
      const userResponse = await fetch(`/api/users/firebase/${user.uid}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      const userData: User = await userResponse.json();
      
      const response = await fetch(`/api/budgets/user/${userData.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }
      return response.json() as Promise<Budget[]>;
    },
    enabled: !!user,
  });
}

export function useUserGoals() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['/api/goals/user', user?.uid],
    queryFn: async () => {
      if (!user) throw new Error('No user logged in');
      
      const userResponse = await fetch(`/api/users/firebase/${user.uid}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      const userData: User = await userResponse.json();
      
      const response = await fetch(`/api/goals/user/${userData.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      return response.json() as Promise<Goal[]>;
    },
    enabled: !!user,
  });
}

export function useUserProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['/api/users/firebase', user?.uid],
    queryFn: async () => {
      if (!user) throw new Error('No user logged in');
      
      const response = await fetch(`/api/users/firebase/${user.uid}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json() as Promise<User>;
    },
    enabled: !!user,
  });
}