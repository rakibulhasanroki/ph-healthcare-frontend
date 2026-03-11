export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <br />
      CommonLayout
      {children}
    </>
  );
}
