import LoadingSpinner from '@/components/shared/LoadingSpinner';

/** Loading UI affiché pendant le chargement du dashboard */
export default function DashboardLoading() {
  return (
    <div className="flex h-96 items-center justify-center">
      <LoadingSpinner size="lg" text="Chargement..." />
    </div>
  );
}
