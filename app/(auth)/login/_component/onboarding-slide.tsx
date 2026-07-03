interface OnboardingSlideProps {
  title: string;
  body: string;
}

export function OnboardingSlide({ title, body }: OnboardingSlideProps) {
  return (
    <div className="flex flex-col items-center gap-8 px-9 text-center">
      <div className="bg-peach/60 h-56 w-56 rounded-3xl" />
      <div className="flex flex-col gap-3">
        <h2 className="text-[21px] font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-[15px] leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
}
