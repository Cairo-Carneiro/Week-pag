import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

type StatusType = 'confirmado' | 'atenção' | 'pendente';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const configs = {
    confirmado: {
      icon: CheckCircle2,
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      label: 'Confirmado',
    },
    atenção: {
      icon: AlertCircle,
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      label: 'Atenção',
    },
    pendente: {
      icon: Clock,
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      label: 'Pendente',
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} font-medium`}
    >
      <Icon size={iconSizes[size]} />
      {config.label}
    </span>
  );
}
