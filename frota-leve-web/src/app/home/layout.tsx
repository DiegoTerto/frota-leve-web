
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
          <main className="flex-1 mt-4 p-6">
            {children}
          </main>
      </div>
    </div>
  );
}
