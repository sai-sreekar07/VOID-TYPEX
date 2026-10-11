import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, Handshake, Check, DollarSign } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { CreatorProfile, AuthenticatedUser, BrandInvitation } from '../types';

export interface ChatMessageItem {
  id: string;
  roomId: string;
  creatorId: string;
  creatorName: string;
  senderId: string;
  senderName: string;
  senderRole: 'creator' | 'brand';
  text: string;
  timestamp: string;
}

interface CreatorBrandChatDrawerProps {
  creator: CreatorProfile | null;
  activeInvitation?: BrandInvitation | null;
  currentUser: AuthenticatedUser | null;
  persona: 'brand' | 'creator';
  onClose: () => void;
  onAcceptInvitation?: (invitation: BrandInvitation) => void;
  onMakeDeal?: (invitation: BrandInvitation, dealAmount: number, dealDeliverables: string) => void;
}

export const CreatorBrandChatDrawer: React.FC<CreatorBrandChatDrawerProps> = ({
  creator,
  activeInvitation,
  currentUser,
  persona,
  onClose,
  onAcceptInvitation,
  onMakeDeal,
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [showDealBox, setShowDealBox] = useState<boolean>(false);
  const [dealAmount, setDealAmount] = useState<string>('');
  const [dealDeliverables, setDealDeliverables] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeInvitation) {
      setDealAmount(String(activeInvitation.dealAmount || activeInvitation.proposedBudget));
      setDealDeliverables(activeInvitation.dealDeliverables || activeInvitation.deliverables);
    } else if (creator) {
      setDealAmount(String(creator.projectMinimum || 15000));
      setDealDeliverables('4K 60fps Commercial Master + Project Stems');
    }
  }, [activeInvitation, creator]);

  useEffect(() => {
    if (!creator) return;

    fetch(`/api/chat/${creator.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.error('Chat history load error:', err));

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/chat`;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      setWsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'chat:init' && Array.isArray(payload.messages)) {
          const filtered = payload.messages.filter(
            (m: ChatMessageItem) => m.roomId === creator.id
          );
          setMessages(filtered);
        } else if (
          (payload.type === 'message:created' || payload.type === 'invitation:updated') &&
          payload.message &&
          payload.message.roomId === creator.id
        ) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.message.id)) return prev;
            return [...prev, payload.message];
          });
        }
      } catch (e) {
        console.error('WS parse error:', e);
      }
    };

    socket.onclose = () => {
      setWsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [creator]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!creator) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const senderName = currentUser
      ? currentUser.name
      : persona === 'brand'
      ? activeInvitation?.brandName || 'Brand Partner'
      : creator.name;
    const senderRole = currentUser ? currentUser.role : persona;
    const senderId = currentUser ? currentUser.id : `session_${persona}`;

    const messagePayload = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      creatorId: creator.id,
      creatorName: creator.name,
      senderId,
      senderName,
      senderRole,
      text: trimmed,
    };

    setInputText('');

    const optimisticMsg: ChatMessageItem = {
      ...messagePayload,
      roomId: creator.id,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'message:send',
          ...messagePayload,
        })
      );
    } else {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload),
      });
    }

    if (auth.currentUser) {
      try {
        await addDoc(collection(db, 'messages'), {
          senderUid: auth.currentUser.uid,
          senderName: senderName.slice(0, 100),
          senderRole,
          recipientCreatorId: creator.id.slice(0, 128),
          recipientCreatorName: creator.name.slice(0, 100),
          text: trimmed.slice(0, 1000),
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'messages');
      }
    }
  };

  const handleConfirmDealInChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeInvitation && onMakeDeal) {
      onMakeDeal(activeInvitation, Number(dealAmount) || activeInvitation.proposedBudget, dealDeliverables);
      setShowDealBox(false);
    }
  };

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] shadow-hard-lg flex flex-col"
      role="dialog"
      aria-label={`Direct Chat with ${creator.name}`}
    >
      {/* Chat Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={creator.avatar}
            alt={creator.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-xl object-cover border border-[var(--border-subtle)] shrink-0"
          />
          <div className="min-w-0">
            <h3 className="font-display font-bold text-sm text-[var(--text-main)] break-words">
              {creator.name}
            </h3>
            <p className="text-xs font-mono text-[var(--text-muted)] truncate">
              {creator.handle} · {wsConnected ? 'Direct Channel Ready' : 'Synced'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close chat"
          className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Invitation & Deal Status Bar inside Chat */}
      {activeInvitation ? (
        <div className="px-4 py-3 bg-[var(--bg-tertiary)] border-b border-[var(--border-subtle)] text-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-bold text-[var(--accent-primary)] truncate">
              Invite: {activeInvitation.projectTitle}
            </span>
            <span className="font-mono font-bold text-emerald-400 shrink-0">
              ${(activeInvitation.dealAmount || activeInvitation.proposedBudget).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] text-[var(--text-muted)]">
              Status: <strong className="text-[var(--text-main)]">{activeInvitation.status}</strong>
            </span>

            {activeInvitation.status === 'Pending' && persona === 'creator' && onAcceptInvitation && (
              <button
                type="button"
                onClick={() => onAcceptInvitation(activeInvitation)}
                className="px-3 py-1 rounded-lg bg-emerald-500 text-black font-bold text-[11px] cursor-pointer"
              >
                Accept Invite
              </button>
            )}

            {activeInvitation.status === 'Accepted' && onMakeDeal && (
              <button
                type="button"
                onClick={() => setShowDealBox((prev) => !prev)}
                className="px-3 py-1 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Handshake className="w-3 h-3" />
                <span>{showDealBox ? 'Close Deal Form' : 'Make a Deal'}</span>
              </button>
            )}
          </div>

          {showDealBox && (
            <form onSubmit={handleConfirmDealInChat} className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <DollarSign className="w-3 h-3 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={dealAmount}
                    onChange={(e) => setDealAmount(e.target.value)}
                    placeholder="Deal USD"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg pl-7 pr-2 py-1.5 text-xs font-mono text-[var(--text-main)]"
                    required
                  />
                </div>
                <input
                  type="text"
                  value={dealDeliverables}
                  onChange={(e) => setDealDeliverables(e.target.value)}
                  placeholder="Deliverables"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[var(--text-main)]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Lock In Final Deal</span>
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="px-4 py-3 bg-[var(--bg-tertiary)] border-b border-[var(--border-subtle)] text-xs space-y-1">
          <div className="font-mono text-[var(--accent-primary)] font-semibold">
            Brief Definition & AI Tools
          </div>
          <p className="text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {creator.bio}
          </p>
          <div className="font-mono text-[11px] text-[var(--text-main)] pt-0.5 truncate">
            Tools: {creator.tools.join(' · ')}
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="py-16 text-center space-y-2 text-xs text-[var(--text-muted)]">
            <MessageSquare className="w-6 h-6 mx-auto text-[var(--accent-primary)] opacity-80" />
            <p>Start a direct conversation with {creator.name} regarding your campaign brief and deal terms.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isCreatorSender = msg.senderRole === 'creator';
            return (
              <div
                key={msg.id}
                className={`flex flex-col space-y-1 ${
                  isCreatorSender ? 'items-start' : 'items-end'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
                  <span className="font-semibold text-[var(--text-main)]">
                    {msg.senderName}
                  </span>
                  <span>·</span>
                  <span>{msg.senderRole === 'creator' ? 'Creator' : 'Brand'}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isCreatorSender
                      ? 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-main)]'
                      : 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-medium'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Starters */}
      <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          'I accept the invite! Let’s finalize our deal.',
          'Can we lock the deal at $18,500 for 4K delivery?',
          'Share your target timeline and deliverables.',
        ].map((quickText) => (
          <button
            key={quickText}
            type="button"
            onClick={() => setInputText(quickText)}
            className="px-2.5 py-1 rounded-lg bg-[var(--bg-tertiary)] hover:border-[var(--accent-primary)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {quickText}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message as ${
            currentUser ? currentUser.name : persona === 'brand' ? 'Brand' : 'Creator'
          }...`}
          className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
