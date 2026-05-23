'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * En-tête de page réutilisable avec titre, description, icône et action.
 */
const PageHeader = ({ title, description, icon, action }: PageHeaderProps) => {
  return (
    <motion.div
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C63FF]/10 text-[#6C63FF]">
            {icon}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-[#F0F0F8]">{title}</h1>

          {description && (
            <p className="mt-0.5 text-sm text-[#8888AA]">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && <div>{action}</div>}
    </motion.div>
  );
};

export default PageHeader;