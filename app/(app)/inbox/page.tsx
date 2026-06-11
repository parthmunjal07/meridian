export default function InboxPage() {
  return (
    <>
      {/* Pane 2: List View */}
      <div className="w-96 border-r border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="h-16 flex items-center px-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Inbox</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Email Item Stubs */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 cursor-pointer transition-colors">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-medium text-sm text-zinc-200">Sender Name</span>
                <span className="text-xs text-zinc-500">10:00 AM</span>
              </div>
              <p className="text-sm font-medium text-white truncate">Subject of the email</p>
              <p className="text-sm text-zinc-400 truncate">Preview of the email body goes here...</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pane 3: Detail View */}
      <div className="flex-1 bg-black flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <div className="flex gap-4">
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">Reply</button>
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">Forward</button>
            <button className="text-sm text-zinc-400 hover:text-white transition-colors">Archive</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Subject of the email</h1>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <p className="font-medium text-white">Sender Name <span className="text-zinc-500 font-normal">&lt;sender@example.com&gt;</span></p>
                  <p className="text-sm text-zinc-500">to me</p>
                </div>
              </div>
              <span className="text-sm text-zinc-500">Oct 24, 2026, 10:00 AM</span>
            </div>
            <div className="prose prose-invert max-w-none text-zinc-300">
              <p>Hello,</p>
              <p>This is the content of the email detail pane. The layout is structured as a three-pane view (Sidebar, List, Detail) typical of fast email clients like Superhuman.</p>
              <p>Best,<br/>Sender</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
