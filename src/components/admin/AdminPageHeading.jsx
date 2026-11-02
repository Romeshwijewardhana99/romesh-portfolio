export default function AdminPageHeading({ eyebrow = "Portfolio CMS", title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="admin-eyebrow">{eyebrow}</p>
        <h1 className="admin-page-title mt-3">{title}<span className="text-[#35936B]">.</span></h1>
        {description && <p className="admin-page-description mt-3 max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0 self-start sm:self-auto">{action}</div>}
    </div>
  );
}
