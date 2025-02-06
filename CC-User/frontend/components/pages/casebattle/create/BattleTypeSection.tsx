interface BattleTypeSectionProps {
  title: string;
  children: React.ReactNode;
}
const BattleTypeSection = ({ title, children }: BattleTypeSectionProps) => (
  <div className='flex column items-start gap-4'>
    <div className='text-color text-bold'>{title}</div>
    <div className='flex row gap-2'>{children}</div>
  </div>
);
export default BattleTypeSection;
