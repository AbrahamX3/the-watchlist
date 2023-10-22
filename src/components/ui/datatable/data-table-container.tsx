export default function TableContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container w-full pb-6">{children}</div>;
}
