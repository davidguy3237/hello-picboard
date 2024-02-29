export default function TestLayout({
  children,
  parallel,
}: {
  children: React.ReactNode;
  parallel: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {parallel}
    </div>
  );
}
