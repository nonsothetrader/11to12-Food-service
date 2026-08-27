import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Search, 
  Send, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Clock, 
  MessageSquare, 
  Filter
} from 'lucide-react';
import { useAppStore } from '../../lib/useAppStore';
import { InboxMessage } from '../../lib/store';

export default function InboxManagement() {
  const { store, actions } = useAppStore();
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const filteredMessages = store.inbox.filter(m => filterType === 'All' || m.type === filterType);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyInput.trim()) return;
    actions.replyInboxMessage(selectedMessage.id, replyInput);
    setSelectedMessage({ ...selectedMessage, replyText: replyInput, status: 'Resolved' });
    setReplyInput('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] text-[10px] font-black uppercase tracking-wider">
              Desk Drop Support & Inquiries
            </span>
            <span className="text-xs text-[#1E140A]/50 font-mono">
              {store.inbox.filter(m => m.status === 'New').length} New Unread Messages
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E140A] tracking-tight font-display mt-1">
            Inbox & Support Tickets
          </h1>
          <p className="text-xs text-[#1E140A]/70 mt-0.5">
            Manage corporate catering requests, temporary desk change tickets, and subscriber feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Corporate', 'Desk Drop Change', 'Inquiry'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === cat
                  ? 'bg-[#1E140A] text-white'
                  : 'bg-white border border-[#1E140A]/10 text-[#1E140A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredMessages.map((msg) => {
            const isSelected = selectedMessage?.id === msg.id;
            return (
              <button
                key={msg.id}
                type="button"
                onClick={() => {
                  setSelectedMessage(msg);
                  setReplyInput('');
                  if (msg.status === 'New') {
                    actions.updateInboxStatus(msg.id, 'Read');
                  }
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E140A] text-white shadow-md'
                    : 'bg-white border-[#1E140A]/10 hover:border-[#FF5500]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    msg.type === 'Corporate' 
                      ? 'bg-purple-100 text-purple-900' 
                      : msg.type === 'Desk Drop Change' 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {msg.type}
                  </span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                <h4 className={`font-bold text-xs mt-2 line-clamp-1 ${isSelected ? 'text-white' : 'text-[#1E140A]'}`}>
                  {msg.subject}
                </h4>
                <div className={`text-[11px] mt-0.5 line-clamp-2 ${isSelected ? 'text-stone-300' : 'text-[#1E140A]/60'}`}>
                  {msg.message}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-current/10 text-[10px]">
                  <span className="font-bold">{msg.name}</span>
                  <span className={`px-1.5 py-0.5 rounded font-mono ${
                    msg.status === 'Resolved' 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : msg.status === 'New' 
                      ? 'bg-[#FF5500]/20 text-[#FF5500]' 
                      : 'text-stone-400'
                  }`}>
                    {msg.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Message Detail & Reply Box */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-3xl border border-[#1E140A]/10 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E140A]/10">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#FF5500] tracking-wider">
                    {selectedMessage.type} Ticket
                  </span>
                  <h3 className="text-xl font-black font-display text-[#1E140A] mt-0.5">
                    {selectedMessage.subject}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => actions.updateInboxStatus(selectedMessage.id, selectedMessage.status === 'Resolved' ? 'Read' : 'Resolved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    selectedMessage.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 hover:bg-stone-200 text-[#1E140A]'
                  }`}
                >
                  {selectedMessage.status === 'Resolved' ? '✓ Resolved' : 'Mark Resolved'}
                </button>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF4EB] text-xs">
                <div>
                  <div className="text-[10px] text-[#1E140A]/50 font-bold uppercase">From</div>
                  <div className="font-bold text-[#1E140A]">{selectedMessage.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#1E140A]/50 font-bold uppercase">Email / Phone</div>
                  <div className="font-mono text-[#1E140A]">{selectedMessage.email}</div>
                  <div className="font-mono text-[11px] text-[#1E140A]/70">{selectedMessage.phone}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#1E140A]/50 font-bold uppercase">Company / Office</div>
                  <div className="font-bold text-[#1E140A]">{selectedMessage.company || 'Private Subscriber'}</div>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#1E140A]/70 uppercase tracking-wider">
                  Customer Message:
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#1E140A]/10 text-xs text-[#1E140A] leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Existing Reply if any */}
              {selectedMessage.replyText && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5 text-xs text-emerald-950">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>HQ Reply Sent to {selectedMessage.email}:</span>
                  </div>
                  <p className="leading-relaxed">{selectedMessage.replyText}</p>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-4 border-t border-[#1E140A]/10">
                <label className="block text-xs font-bold text-[#1E140A]">
                  Compose Live Response:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={`Write response to ${selectedMessage.name}...`}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#1E140A]/15 bg-[#FAF4EB] text-xs text-[#1E140A] focus:outline-none focus:border-[#FF5500]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Response & Resolve</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#1E140A]/10 p-12 text-center text-xs text-[#1E140A]/50 h-full flex flex-col justify-center items-center">
              <Mail className="w-8 h-8 text-[#1E140A]/20 mb-2" />
              <span>Select a message from the list to view details and send replies.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
