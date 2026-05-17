export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[calc(100vh-0px)] flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-green-50/30 px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
