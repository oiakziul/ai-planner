interface PageHeroProps {
  title: string
  subtitle: string
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <>
      <h1 className="text-foreground mb-1 text-2xl font-semibold sm:text-3xl backdrop-blur-md rounded-lg">
        {title}
      </h1>
      <p className="text-muted-foreground mb-8 text-sm backdrop-blur-md rounded-lg">{subtitle}</p>
    </>
  )
}