import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Carousel } from "@/components/ui/carousel"

interface SpecialistCarouselProps {
  specialists: Array<{
    name: string
    role: string
    avatar: string
  }>
  currentIndex: number
  onPrev: () => void
  onNext: () => void
}

export function SpecialistCarousel({ specialists, currentIndex, onPrev, onNext }: SpecialistCarouselProps) {
  const currentSpecialist = specialists[currentIndex]

  return (
    <Carousel onPrev={onPrev} onNext={onNext}>
      <div className="text-center py-6">
        <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-lg">
          <AvatarImage src={currentSpecialist.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-[var(--app-primary)] text-[var(--ds-text-inverse)] text-lg">
            {currentSpecialist.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-bold text-lg text-[var(--text-primary)]">{currentSpecialist.name}</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">{currentSpecialist.role}</p>
        <Button className="w-full">Book Now</Button>
      </div>
    </Carousel>
  )
}
