import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ProfileSectionProps {
  name: string;
  imageUrl?: string | null;
  children?: React.ReactNode;
}

export function ProfileSection({
  name,
  imageUrl,
  children,
}: ProfileSectionProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-11">
          <AvatarImage src={imageUrl ?? undefined} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{name}</span>
          <Badge variant="secondary" className="w-fit">
            카카오 로그인
          </Badge>
        </div>
      </div>
      {children}
    </div>
  );
}
