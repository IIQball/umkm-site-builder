import { ShieldCheck, Truck, Award, Star, CheckCircle, ArrowRight } from 'lucide-svelte';

export function getFeatureIcon(iconName: string | undefined) {
  switch (iconName?.toLowerCase()) {
    case 'shield':
    case 'shieldcheck':
      return ShieldCheck;
    case 'truck':
      return Truck;
    case 'award':
      return Award;
    case 'star':
      return Star;
    case 'arrow':
    case 'arrowright':
      return ArrowRight;
    default:
      return CheckCircle;
  }
}
