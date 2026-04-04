import {
  BriefcaseBusiness,
  CircleDollarSign,
  Clapperboard,
  HandCoins,
  HeartPulse,
  Plane,
  Receipt,
  ShoppingBag,
  UtensilsCrossed,
} from 'lucide-react'

const ICONS = {
  Food: UtensilsCrossed,
  Transport: Plane,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: Clapperboard,
  Health: HeartPulse,
  Salary: BriefcaseBusiness,
  Freelance: HandCoins,
  Other: CircleDollarSign,
}

/**
 * @param {{ category: string, size?: number, className?: string }} props
 */
export function CategoryIcon({ category, size = 15, className = '' }) {
  const Icon = ICONS[category] ?? CircleDollarSign
  return (
    <Icon
      size={size}
      strokeWidth={2}
      className={className}
      aria-hidden
    />
  )
}
