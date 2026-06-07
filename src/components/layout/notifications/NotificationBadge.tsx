'use client';

interface NotificationBadgeProps {
  count: number;
}

export default function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5470] text-[10px] font-bold text-white ring-2 ring-[#0A0A0F] animate-pulse">
      {count > 99 ? '99+' : count}
    </span>
  );
}
