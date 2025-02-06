interface CaseBattleModeButtonProps {
  mode: number;
  currentMode: number;
  onClick: (mode: number) => void;
  children: React.ReactNode;
}
const CaseBattleModeButton = ({
  mode,
  currentMode,
  onClick,
  children,
}: CaseBattleModeButtonProps) => (
  <button
    className={`site-button black casebattle_set_mode ${currentMode === mode ? 'active' : ''}`}
    data-mode={mode}
    onClick={() => onClick(mode)}
  >
    {children}
  </button>
);

export default CaseBattleModeButton;
