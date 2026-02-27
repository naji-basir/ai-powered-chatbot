const TypingIndicator = () => {
  return (
    <div className="self-start px-4 py-3 text-gray-400 dark:text-gray-300 rounded-2xl bg-gray-50 dark:bg-slate-700 animate-pulse rounded-bl-none">
      <div className="flex items-center gap-2">
        <Dot className="[animation-delay:-0.3s]" />
        <Dot className="[animation-delay:-0.15s]" />
        <Dot />
      </div>
    </div>
  );
};

type DotProps = {
  className?: string;
};

const Dot = ({ className }: DotProps) => (
  <div
    className={`w-2 h-2 bg-gray-400 rounded-full animate-bounce ${className}`}
  ></div>
);
export default TypingIndicator;
