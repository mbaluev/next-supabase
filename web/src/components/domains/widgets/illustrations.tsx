'use client';

import { SvgTrash } from '@/components/icons/components/trash';
import { SvgFiles } from '@/components/icons/components/files';
import { SvgSpam } from '@/components/icons/components/spam';
import { SvgSync } from '@/components/icons/components/sync';
import { cn } from '@/utils/cn';
import { Widget, WidgetContent, WidgetProps } from '@/components/layout/widget';
import { ErrorBlock } from '@/components/layout/error-block';

export const WidgetIllustrations = (props: WidgetProps) => {
  return (
    <Widget {...props}>
      <WidgetContent className="@container/illustrations">
        <div
          className={cn(
            'w-full p-10 grid gap-10',
            'grid-cols-1',
            '@2xl/illustrations:grid-cols-2 @4xl/illustrations:grid-cols-3',
            '@6xl/illustrations:grid-cols-4 @8xl/illustrations:grid-cols-5'
          )}
        >
          <ErrorBlock
            icon={<SvgTrash />}
            code="trash"
            name="messages that have been in trash more than 30 days will be deleted"
          />
          <ErrorBlock
            icon={<SvgFiles />}
            code="files"
            name="designed to store, organize, manage, and track your files efficiently"
          />
          <ErrorBlock
            icon={<SvgSpam />}
            code="spam"
            name="stores unwanted, suspicious, or potentially harmful emails detected"
          />
          <ErrorBlock
            icon={<SvgSync />}
            code="sync"
            name="ensures that data remains consistent and up to date across the universe"
          />
        </div>
      </WidgetContent>
    </Widget>
  );
};
