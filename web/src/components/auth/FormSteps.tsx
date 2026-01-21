import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
  icon: LucideIcon;
}

interface FormStepsProps {
  steps: Step[];
  currentStep: number;
}

const FormSteps: React.FC<FormStepsProps> = ({ steps, currentStep }) => {
  return (
    <div className="px-8 pt-8 pb-4">
      <div className="relative flex justify-between">
        {/* Progress line */}
        <div className="absolute left-0 right-0 h-1 bg-gray-200 top-5 -z-10" />
        <motion.div
          className="absolute left-0 h-1 top-5 bg-primary-500 -z-10"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
        />

        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col items-center"
            >
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-primary-500 border-primary-500"
                      : isActive
                      ? "bg-white border-primary-500"
                      : "bg-white border-gray-300"
                  }
                  shadow-lg
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <step.icon
                    className={`
                    w-5 h-5
                    ${isActive ? "text-primary-500" : "text-gray-400"}
                  `}
                  />
                )}
              </motion.div>

              <div className="mt-3 text-center">
                <div
                  className={`
                  text-xs font-semibold
                  ${
                    isActive
                      ? "text-primary-600"
                      : isCompleted
                      ? "text-primary-500"
                      : "text-gray-500"
                  }
                `}
                >
                  Step {step.number}
                </div>
                <div
                  className={`
                  text-sm font-medium mt-1
                  ${
                    isActive
                      ? "text-gray-900"
                      : isCompleted
                      ? "text-gray-700"
                      : "text-gray-500"
                  }
                `}
                >
                  {step.title}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FormSteps;
