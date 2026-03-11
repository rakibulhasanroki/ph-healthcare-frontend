export default function CommonProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <br />
      CommonProtectedLayout
      {children}
    </>
  );
}
