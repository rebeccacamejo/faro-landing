interface Props {
  title: string;
  children: React.ReactNode;
}

export default function Callout({ title, children }: Props) {
  return (
    <div className="my-8 border-l-4 border-brass bg-cream-deep rounded-r-lg px-6 py-5">
      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-charcoal/50 mb-3">
        {title}
      </p>
      <div className="font-sans text-base text-charcoal leading-relaxed [&_ul]:mt-2 [&_ul]:space-y-1.5 [&_li]:flex [&_li]:gap-2 [&_li]:before:content-['·'] [&_li]:before:text-brass [&_li]:before:font-bold [&_li]:before:shrink-0">
        {children}
      </div>
    </div>
  );
}
