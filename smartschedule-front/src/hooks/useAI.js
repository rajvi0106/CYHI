import { useAI as useAIContext } from '../context/AIContext';

export const useAI = () => {
  return useAIContext();
};