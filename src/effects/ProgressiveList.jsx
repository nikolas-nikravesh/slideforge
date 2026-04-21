import { Appear } from 'spectacle';
import { BulletList } from '../content/BulletList';

export function ProgressiveList({ items, fontSize, gap }) {
  return items.map((item, idx) => (
    <Appear
      key={idx}
      priority={idx + 1}
      inactiveStyle={{ opacity: '0', visibility: 'hidden', display: 'block' }}
      activeStyle={{ opacity: '1', visibility: 'visible', display: 'block' }}
    >
      <BulletList items={[item]} fontSize={fontSize} gap={gap} />
    </Appear>
  ));
}
