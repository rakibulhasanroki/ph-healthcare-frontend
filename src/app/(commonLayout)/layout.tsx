export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="max-w-11/12 m-auto pt-8">{children}</div>;
}
