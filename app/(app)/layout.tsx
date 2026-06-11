import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full overflow-hidden bg-black text-white">
        {/* Pane 1: Sidebar */}
        <Sidebar />
        
        {/* Panes 2 & 3: Main Application Area */}
        <div className="flex flex-1 flex-row overflow-hidden">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
