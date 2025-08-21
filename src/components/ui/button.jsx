export function Button({ children, className = "", variant = "default", ...props }) {
  const base = "rounded-2xl px-3 py-2 text-sm border transition";
  const styles =
    variant === "outline"
      ? "bg-white text-slate-700 border-slate-200"
      : "bg-black text-white border-black";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
