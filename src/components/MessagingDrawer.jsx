import React, { useState, useEffect, useRef } from 'react';
import { marketplaceStore } from '../services/marketplaceStore';

export default function MessagingDrawer({ isOpen, onClose, defaultListingId = null }) {
  const [messages, setMessages] = useState(marketplaceStore.getMessages());
  const [selectedListingId, setSelectedListingId] = useState(defaultListingId || 'sf-201');
  const [inputBody, setInputBody] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsub = marketplaceStore.subscribe(() => {
      setMessages(marketplaceStore.getMessages());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (defaultListingId) {
      setSelectedListingId(defaultListingId);
    }
  }, [defaultListingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedListingId]);

  if (!isOpen) return null;

  // Group unique conversations by listing
  const listingsMap = {};
  messages.forEach((m) => {
    if (!listingsMap[m.listingId]) {
      listingsMap[m.listingId] = {
        listingId: m.listingId,
        listingTitle: m.listingTitle || 'Listing Inquiry',
        lastMessage: m.body,
        lastTime: m.timestamp,
      };
    } else {
      listingsMap[m.listingId].lastMessage = m.body;
      listingsMap[m.listingId].lastTime = m.timestamp;
    }
  });

  const conversationList = Object.values(listingsMap);
  const currentThreadMessages = messages.filter((m) => m.listingId === selectedListingId);
  const activeListing = marketplaceStore.getListingById(selectedListingId) || {
    title: listingsMap[selectedListingId]?.listingTitle || 'Property Inquiry',
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputBody.trim()) return;

    marketplaceStore.sendThreadMessage({
      listingId: selectedListingId,
      listingTitle: activeListing.title,
      body: inputBody.trim(),
    });
    setInputBody('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">
        {/* Drawer Header */}
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-gray-900 flex items-center justify-center font-black text-sm">
              💬
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">StayFinder In-App Messaging</h3>
              <p className="text-[10px] text-gray-400">Scoped listing communication & system notifications</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Thread Selector Tabs if multiple threads exist */}
        {conversationList.length > 1 && (
          <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50 px-2 py-1.5 gap-1">
            {conversationList.map((c) => (
              <button
                key={c.listingId}
                type="button"
                onClick={() => setSelectedListingId(c.listingId)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-bold truncate max-w-[150px] transition ${
                  selectedListingId === c.listingId
                    ? 'bg-white text-emerald-800 shadow-xs border border-gray-200'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {c.listingTitle}
              </button>
            ))}
          </div>
        )}

        {/* Listing Context Banner */}
        <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs">
          <div className="truncate mr-2">
            <span className="font-bold text-emerald-950 block truncate">{activeListing.title}</span>
            <span className="text-[10px] text-emerald-700">All communications are monitored for anti-fraud safety</span>
          </div>
          <span className="shrink-0 text-[10px] font-black uppercase text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
            Verified Thread
          </span>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
          {currentThreadMessages.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-xs">
              No messages yet in this listing thread. Send a message below to reach the lister!
            </div>
          ) : (
            currentThreadMessages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 shadow-2xs my-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 mb-1">
                      <span>⚡ SYSTEM EVENT</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-xs font-semibold">{msg.body}</p>
                  </div>
                );
              }

              const isMe = msg.senderName.includes(marketplaceStore.getCurrentUser().name);
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-gray-500">{msg.senderName}</span>
                    <span className="text-[9px] text-gray-400">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-xs'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {msg.body}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={inputBody}
            onChange={(e) => setInputBody(e.target.value)}
            placeholder="Type a message or inquiry regarding this property..."
            className="flex-1 text-xs rounded-xl border border-gray-300 px-3 py-2.5 focus:outline-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputBody.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
