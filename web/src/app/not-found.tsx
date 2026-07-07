import { MasterCenter } from '@/components/layout/master';
import { ErrorBlock } from '@/components/layout/error-block';
import { CircleOff } from 'lucide-react';

export default function NotFound() {
  return (
    <MasterCenter>
      <ErrorBlock
        icon={<CircleOff strokeWidth={1.5} className="text-destructive" />}
        code="404"
        name="page not found"
      />
    </MasterCenter>
  );
}
