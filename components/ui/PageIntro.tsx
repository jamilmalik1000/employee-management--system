import type { ReactNode } from "react";

interface PageIntroProps {
  description: ReactNode;
  actions?: ReactNode;
}

export default function PageIntro({ description, actions }: PageIntroProps) {
  return (
    <section className="page-intro" aria-label="Page summary">
      <p>{description}</p>
      {actions && <div className="page-intro-actions">{actions}</div>}
    </section>
  );
}
