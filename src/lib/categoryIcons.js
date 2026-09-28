import { Music2, Presentation, Wrench, Dumbbell, Image } from 'lucide-react'

export const CATEGORY_ICONS = {
  konser: Music2,
  seminar: Presentation,
  workshop: Wrench,
  olahraga: Dumbbell,
  exhibition: Image,
}

export function getCategoryIcon(slug) {
  return CATEGORY_ICONS[slug] || Music2
}
