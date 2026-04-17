import { SvgTrash } from '@/components/icons/components/trash';
import { MasterCenter } from '@/components/layout/master';
import { ErrorBlock } from '@/components/layout/error-block';

export default function NotFound() {
  return (
    <MasterCenter>
      <ErrorBlock icon={<SvgTrash />} code="404" name="page not found" />
    </MasterCenter>
  );
}
