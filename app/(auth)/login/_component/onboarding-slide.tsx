import Image from 'next/image';

interface OnboardingSlideProps {
  title: string;
  body: string;
  image: string;
}

export function OnboardingSlide({ title, body, image }: OnboardingSlideProps) {
  return (
    <div className="flex flex-col items-center gap-8 px-9 text-center">
      <div className="bg-gr-secondary/60 relative h-56 w-56 overflow-hidden rounded-3xl">
        <Image src={image} alt="" fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-[21px] font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-[15px] leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
}
