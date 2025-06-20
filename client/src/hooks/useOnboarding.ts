import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
      const userOnboardingKey = `onboarding_completed_${user.id}`;
      const hasUserCompletedOnboarding = localStorage.getItem(userOnboardingKey);
      
      // Check if this is a first-time user
      if (!hasCompletedOnboarding && !hasUserCompletedOnboarding) {
        setIsFirstVisit(true);
        // Show onboarding after a brief delay
        const timer = setTimeout(() => {
          setShowOnboarding(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user]);

  const completeOnboarding = () => {
    if (user) {
      const userOnboardingKey = `onboarding_completed_${user.id}`;
      localStorage.setItem(userOnboardingKey, 'true');
    }
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
    setIsFirstVisit(false);
  };

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    if (user) {
      const userOnboardingKey = `onboarding_completed_${user.id}`;
      localStorage.setItem(userOnboardingKey, 'true');
    }
    localStorage.setItem('onboarding_completed', 'true');
    setIsFirstVisit(false);
  };

  return {
    showOnboarding,
    isFirstVisit,
    completeOnboarding,
    startOnboarding,
    skipOnboarding,
    setShowOnboarding
  };
}