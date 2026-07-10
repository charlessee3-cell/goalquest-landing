import dynamic from 'next/dynamic';
import type { QuestMapProps } from './QuestMap';

const QuestMap = dynamic(() => import('./QuestMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl border border-border bg-background flex items-center justify-center"
      style={{ height: '320px' }}
    >
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function QuestMapDynamic(props: QuestMapProps) {
  return <QuestMap {...props} />;
}
