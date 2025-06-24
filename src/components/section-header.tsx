import { Link } from "lucide-react";

interface SectionHeaderProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  id,
  children,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className="text-center">
      <h2 id={id} className={`text-3xl font-light text-gray-900 ${className}`}>
        <div className="group inline-flex items-center gap-2">
          {children}
          <a
            href={`#${id}`}
            className="text-gray-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-gray-600"
            aria-label={`Link to ${id} section`}
          >
            <Link size={20} />
          </a>
        </div>
      </h2>
    </div>
  );
}
