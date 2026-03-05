"use client";

import { Dropdown, DropdownContent, DropdownTrigger, DropdownClose } from "@/components/ui/dropdown";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import React, { useState, useRef, useEffect } from "react";
import type { EmojiClickData } from "emoji-picker-react";
import { Theme } from "emoji-picker-react";

const EmojiPicker = dynamic(
  () => import("emoji-picker-react").then((mod) => mod.default),
  { ssr: false },
);

type ContactListTab = "chats" | "all" | "groups";
type FilterOption = "all" | "online" | "unread";

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "online", label: "Online only" },
  { value: "unread", label: "Unread only" },
];

const EMOJI_CDN_BASE = "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64";

function getUnified(emojiStr: string): string {
  const codes: string[] = [];
  for (let i = 0; i < emojiStr.length; ) {
    const cp = emojiStr.codePointAt(i)!;
    codes.push(cp.toString(16).toLowerCase());
    i += cp > 0xffff ? 2 : 1;
  }
  return codes.join("-");
}

function parseMessageWithEmojiImages(text: string): React.ReactNode[] {
  if (!text) return [];
  const segments = text.match(/\p{Extended_Pictographic}+|\P{Extended_Pictographic}+/gu);
  if (!segments) return [text];
  return segments.map((seg, i) => {
    if (/\p{Extended_Pictographic}/u.test(seg)) {
      const unified = getUnified(seg);
      return (
        <img
          key={`emoji-${i}-${unified}`}
          src={`${EMOJI_CDN_BASE}/${unified}.png`}
          alt={seg}
          className="inline-block size-5 align-baseline"
          loading="lazy"
          draggable={false}
        />
      );
    }
    return <React.Fragment key={`text-${i}`}>{seg}</React.Fragment>;
  });
}

/** Returns HTML string with emojis as Apple-style img tags (for contenteditable). */
function messageToHtml(text: string): string {
  if (!text) return "";
  const segments = text.match(/\p{Extended_Pictographic}+|\P{Extended_Pictographic}+/gu);
  if (!segments) return escapeHtml(text);
  return segments
    .map((seg) => {
      if (/\p{Extended_Pictographic}/u.test(seg)) {
        const unified = getUnified(seg);
        const alt = escapeAttr(seg);
        return `<img src="${EMOJI_CDN_BASE}/${unified}.png" alt="${alt}" class="inline-block size-5 align-baseline" draggable="false" data-emoji-alt="${alt}">`;
      }
      return escapeHtml(seg);
    })
    .join("");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/** Reads plain text + emoji (from img alt) from a contenteditable div. */
function getTextFromContentEditable(el: HTMLElement): string {
  let out = "";
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent ?? "";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.tagName === "IMG" && (el.getAttribute("data-emoji-alt") ?? el.getAttribute("alt"))) {
        out += el.getAttribute("data-emoji-alt") ?? el.getAttribute("alt") ?? "";
      } else {
        if (el.tagName === "BR") out += "\n";
        el.childNodes.forEach(walk);
      }
    }
  };
  el.childNodes.forEach(walk);
  return out;
}

export type Contact = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: { content: string; time: string };
  unreadCount: number;
};

export type MessageAttachment = {
  name: string;
  type: string;
  size: number;
  url: string;
};

export type ScheduledMeeting = {
  title: string;
  date: string;
  time: string;
  duration: string;
  notes?: string;
};

export type PollCard = {
  question: string;
  options: string[];
};

export type Message = {
  id: string;
  role: "user" | "contact";
  text: string;
  time: string;
  attachments?: MessageAttachment[];
  meetingCard?: ScheduledMeeting;
  pollCard?: PollCard;
};

type PendingAttachment = { id: string; file: File; url: string };

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileKind(type: string): "image" | "pdf" | "document" {
  if (type.startsWith("image/")) return "image";
  if (type === "application/pdf") return "pdf";
  return "document";
}

const CONTACTS: Contact[] = [
  {
    id: "support",
    name: "Support Team",
    role: "Support • Usually replies in minutes",
    avatar: "/images/user/user-01.png",
    isOnline: true,
    lastMessage: { content: "Thanks. I've found your order. What would you like to know?", time: "10:36 AM" },
    unreadCount: 0,
  },
  {
    id: "sales",
    name: "Sales",
    role: "Sales • B2B & Retail",
    avatar: "/images/user/user-03.png",
    isOnline: true,
    lastMessage: { content: "I'll send the quote by EOD.", time: "9:15 AM" },
    unreadCount: 2,
  },
  {
    id: "jacob",
    name: "Jacob Jones",
    role: "Retail Manager",
    avatar: "/images/user/user-01.png",
    isOnline: true,
    lastMessage: { content: "See you tomorrow at the meeting!", time: "2:30 PM" },
    unreadCount: 3,
  },
  {
    id: "wilium",
    name: "Wilium Smith",
    role: "Wholesale",
    avatar: "/images/user/user-03.png",
    isOnline: true,
    lastMessage: { content: "Thanks for the update", time: "10:15 AM" },
    unreadCount: 0,
  },
  {
    id: "johurul",
    name: "Johurul Haque",
    role: "Distribution",
    avatar: "/images/user/user-04.png",
    isOnline: false,
    lastMessage: { content: "What's up?", time: "Yesterday" },
    unreadCount: 0,
  },
  {
    id: "chowdhury",
    name: "M. Chowdhury",
    role: "Food Factory",
    avatar: "/images/user/user-05.png",
    isOnline: false,
    lastMessage: { content: "Where are you now?", time: "Yesterday" },
    unreadCount: 1,
  },
  {
    id: "akagami",
    name: "Akagami",
    role: "Restaurant",
    avatar: "/images/user/user-07.png",
    isOnline: false,
    lastMessage: { content: "Hey, how are you?", time: "Mon" },
    unreadCount: 0,
  },
];

const INITIAL_CONVERSATIONS: Record<string, Message[]> = {
  support: [
    { id: "1", role: "contact", text: "Hi! How can we help you today?", time: "10:32 AM" },
    { id: "2", role: "user", text: "I have a question about my recent order.", time: "10:33 AM" },
    { id: "3", role: "contact", text: "Sure, I'd be happy to help. Could you share your order number?", time: "10:34 AM" },
    { id: "4", role: "user", text: "It's #ORD-7842.", time: "10:35 AM" },
    { id: "5", role: "contact", text: "Thanks. I've found your order. What would you like to know?", time: "10:36 AM" },
  ],
  sales: [
    { id: "1", role: "contact", text: "Hi, this is Sales. How can I help?", time: "9:00 AM" },
    { id: "2", role: "user", text: "Can I get a quote for bulk order?", time: "9:05 AM" },
    { id: "3", role: "contact", text: "I'll send the quote by EOD.", time: "9:15 AM" },
  ],
  jacob: [
    { id: "1", role: "user", text: "Meeting at 3 PM?", time: "2:00 PM" },
    { id: "2", role: "contact", text: "See you tomorrow at the meeting!", time: "2:30 PM" },
  ],
  wilium: [
    { id: "1", role: "contact", text: "Thanks for the update", time: "10:15 AM" },
  ],
  johurul: [{ id: "1", role: "contact", text: "What's up?", time: "Yesterday" }],
  chowdhury: [{ id: "1", role: "contact", text: "Where are you now?", time: "Yesterday" }],
  akagami: [{ id: "1", role: "contact", text: "Hey, how are you?", time: "Mon" }],
};

export function LiveChatInterface() {
  const [contacts] = useState<Contact[]>(CONTACTS);
  const [search, setSearch] = useState("");
  const [listTab, setListTab] = useState<ContactListTab>("chats");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [attachmentSheetOpen, setAttachmentSheetOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [previewAttachment, setPreviewAttachment] = useState<{ url: string; name: string; type: string } | null>(null);
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: "30",
    notes: "",
  });
  const [pollFormOpen, setPollFormOpen] = useState(false);
  const [pollForm, setPollForm] = useState({ question: "", options: ["", ""] });
  /** Poll vote counts per message: messageId -> [count for option 0, count for option 1, ...] */
  const [pollVotes, setPollVotes] = useState<Record<string, number[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Record<string, Message[]>>(INITIAL_CONVERSATIONS);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useClickOutside<HTMLDivElement>(() => setEmojiPickerOpen(false));
  const syncInputFromPickerRef = useRef(false);
  const { resolvedTheme } = useTheme();

  const appendToInput = (text: string) => {
    syncInputFromPickerRef.current = true;
    setInputValue((v) => (v ? `${v} ${text}` : text));
    setAttachmentSheetOpen(false);
    messageInputRef.current?.focus();
  };

  const handleFilesClick = () => {
    setAttachmentSheetOpen(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const next: PendingAttachment[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setPendingAttachments((prev) => [...prev, ...next]);
    setAttachmentSheetOpen(false);
    e.target.value = "";
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => {
      const item = prev.find((a) => a.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((a) => a.id !== id);
    });
    if (previewAttachment) setPreviewAttachment(null);
  };

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const openPreview = (url: string, name: string, type: string) => {
    if (getFileKind(type) === "pdf") {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    if (getFileKind(type) === "image") {
      setPreviewAttachment({ url, name, type });
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };


  useEffect(() => {
    const el = messageInputRef.current;
    if (!el || !syncInputFromPickerRef.current) return;
    el.innerHTML = messageToHtml(inputValue);
    syncInputFromPickerRef.current = false;
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [inputValue]);

  const contactsWithChats = contacts.filter((c) => (conversations[c.id]?.length ?? 0) > 0);
  const listContacts = listTab === "chats" ? contactsWithChats : contacts;

  const filteredContacts = listContacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterOption === "online") return c.isOnline;
    if (filterOption === "unread") return c.unreadCount > 0;
    return true;
  });

  const selectedContact = selectedId ? contacts.find((c) => c.id === selectedId) : null;
  const messages = selectedId ? conversations[selectedId] ?? [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedId]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    const hasAttachments = pendingAttachments.length > 0;
    if ((!trimmed && !hasAttachments) || !selectedId) return;
    const text = trimmed || (hasAttachments ? `📎 Sent ${pendingAttachments.length} file(s)` : "");
    const attachments: MessageAttachment[] = pendingAttachments.map((a) => ({
      name: a.file.name,
      type: a.file.type,
      size: a.file.size,
      url: a.url,
    }));
    const newMsg: Message = {
      id: String(Date.now()),
      role: "user",
      text,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ...(attachments.length ? { attachments } : {}),
    };
    setConversations((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newMsg],
    }));
    syncInputFromPickerRef.current = true;
    setInputValue("");
    setPendingAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectContact = (id: string) => {
    setSelectedId(id);
  };

  const handleScheduleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.title.trim() || !scheduleForm.date || !scheduleForm.time || !selectedId) return;
    const meeting: ScheduledMeeting = {
      title: scheduleForm.title.trim(),
      date: scheduleForm.date,
      time: scheduleForm.time,
      duration: scheduleForm.duration,
      notes: scheduleForm.notes.trim() || undefined,
    };
    const newMsg: Message = {
      id: String(Date.now()),
      role: "user",
      text: "",
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      meetingCard: meeting,
    };
    setConversations((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newMsg],
    }));
    setScheduleForm({ title: "", date: "", time: "", duration: "30", notes: "" });
    setScheduleFormOpen(false);
    setAttachmentSheetOpen(false);
  };

  const handlePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const options = pollForm.options.filter((o) => o.trim());
    if (!pollForm.question.trim() || options.length < 2 || !selectedId) return;
    const newMsg: Message = {
      id: String(Date.now()),
      role: "user",
      text: "",
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      pollCard: { question: pollForm.question.trim(), options },
    };
    setConversations((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newMsg],
    }));
    setPollForm({ question: "", options: ["", ""] });
    setPollFormOpen(false);
    setAttachmentSheetOpen(false);
  };

  const addPollOption = () => {
    setPollForm((f) => ({ ...f, options: [...f.options, ""] }));
  };

  const updatePollOption = (index: number, value: string) => {
    setPollForm((f) => ({
      ...f,
      options: f.options.map((o, i) => (i === index ? value : o)),
    }));
  };

  const removePollOption = (index: number) => {
    if (pollForm.options.length <= 2) return;
    setPollForm((f) => ({ ...f, options: f.options.filter((_, i) => i !== index) }));
  };

  const handlePollVote = (messageId: string, optionIndex: number, optionCount: number) => {
    setPollVotes((prev) => {
      const current = prev[messageId] ?? Array(optionCount).fill(0);
      const next = [...current];
      if (next.length !== optionCount) next.length = optionCount;
      next[optionIndex] = (next[optionIndex] ?? 0) + 1;
      return { ...prev, [messageId]: next };
    });
  };

  const DURATION_OPTIONS = [
    { value: "15", label: "15 min" },
    { value: "30", label: "30 min" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-1 dark:border-gray-800 dark:bg-gray-dark dark:shadow-card sm:flex-row">
      {/* Contact list — left panel */}
      <aside className="flex w-full shrink-0 flex-col border-b border-gray-200 dark:border-gray-800 sm:w-[300px] sm:border-b-0 sm:border-r">
        <div className="shrink-0 p-3">
          <div className="flex gap-2">
            <label htmlFor="contact-search" className="sr-only">
              Search contacts
            </label>
            <input
              id="contact-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-2 px-3 py-2.5 text-sm text-dark placeholder:text-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-5"
            />
            <Dropdown isOpen={filterDropdownOpen} setIsOpen={setFilterDropdownOpen}>
              <DropdownTrigger className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-2 text-dark-6 hover:bg-gray-100 dark:border-gray-800 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-2">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="sr-only">Filter options</span>
              </DropdownTrigger>
              <DropdownContent align="end" className="min-w-[10rem] rounded-lg border border-gray-200 bg-white py-1 dark:border-gray-800 dark:bg-gray-dark">
                {FILTER_OPTIONS.map((opt) => (
                  <DropdownClose key={opt.value}>
                    <button
                      type="button"
                      onClick={() => setFilterOption(opt.value)}
                      className={cn(
                        "flex w-full items-center px-3 py-2 text-left text-sm",
                        filterOption === opt.value
                          ? "bg-primary/10 font-medium text-primary dark:bg-primary/20"
                          : "text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-2",
                      )}
                    >
                      {opt.label}
                    </button>
                  </DropdownClose>
                ))}
              </DropdownContent>
            </Dropdown>
          </div>
        </div>
        <div className="shrink-0 border-b border-gray-200 px-3 py-3 dark:border-gray-800">
          <div
            className="flex items-center rounded-lg bg-gray-100 p-0.5 dark:bg-dark-2"
            role="tablist"
            aria-label="Chat list view"
          >
            <button
              type="button"
              role="tab"
              aria-selected={listTab === "chats"}
              onClick={() => setListTab("chats")}
              className={cn(
                "min-w-[3.5rem] flex-1 rounded-md px-2 py-2 text-center text-sm font-medium transition-colors sm:min-w-0",
                listTab === "chats"
                  ? "bg-white text-primary shadow-sm dark:bg-gray-dark dark:text-primary"
                  : "text-dark-6 hover:text-dark dark:text-dark-5 dark:hover:text-white",
              )}
            >
              Chats
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={listTab === "all"}
              onClick={() => setListTab("all")}
              className={cn(
                "min-w-[3.5rem] flex-1 rounded-md px-2 py-2 text-center text-sm font-medium transition-colors sm:min-w-0",
                listTab === "all"
                  ? "bg-white text-primary shadow-sm dark:bg-gray-dark dark:text-primary"
                  : "text-dark-6 hover:text-dark dark:text-dark-5 dark:hover:text-white",
              )}
            >
              All Users
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={listTab === "groups"}
              onClick={() => setListTab("groups")}
              className={cn(
                "min-w-[3.5rem] flex-1 rounded-md px-2 py-2 text-center text-sm font-medium transition-colors sm:min-w-0",
                listTab === "groups"
                  ? "bg-white text-primary shadow-sm dark:bg-gray-dark dark:text-primary"
                  : "text-dark-6 hover:text-dark dark:text-dark-5 dark:hover:text-white",
              )}
            >
              Groups
            </button>
          </div>
        </div>
        {listTab === "groups" ? (
          <>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2">
              <ul className="space-y-0.5">
                {/* Placeholder: no groups yet — replace with real groups when wired */}
                <li className="py-12 text-center">
                  <p className="text-sm text-dark-6 dark:text-dark-5">No groups yet</p>
                  <p className="mt-1 text-xs text-dark-6 dark:text-dark-5">Create a group to get started</p>
                </li>
              </ul>
            </div>
            <div className="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800">
              <button
                type="button"
                onClick={() => {}}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 dark:hover:bg-primary/90"
              >
                <svg className="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create new group
              </button>
            </div>
          </>
        ) : (
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            <ul className="space-y-0.5 p-2">
              {filteredContacts.length === 0 ? (
                <li className="py-8 text-center text-sm text-dark-6 dark:text-dark-5">No contacts found</li>
              ) : (
                filteredContacts.map((contact) => (
                  <li key={contact.id}>
                    <button
                      type="button"
                      onClick={() => selectContact(contact.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors",
                        selectedId === contact.id
                          ? "bg-primary/10 text-primary dark:bg-primary/20"
                          : "hover:bg-gray-100 dark:hover:bg-dark-2",
                      )}
                    >
                      <div className="relative shrink-0">
                        <Image
                          src={contact.avatar}
                          width={44}
                          height={44}
                          className="size-11 rounded-full object-cover"
                          alt={contact.name}
                        />
                        {contact.isOnline && (
                          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-green dark:border-gray-dark" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-dark dark:text-white">{contact.name}</p>
                        <p className="truncate text-xs text-dark-6 dark:text-dark-5">{contact.role}</p>
                        {contact.unreadCount > 0 && (
                          <span className="mt-0.5 inline-flex rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </aside>

      {/* Chat area — right panel */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {selectedContact ? (
          <>
            {/* Chat header */}
            <header className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
              <div className="relative shrink-0">
                <Image
                  src={selectedContact.avatar}
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                  alt={selectedContact.name}
                />
                {selectedContact.isOnline && (
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-green dark:border-gray-dark" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-dark dark:text-white">{selectedContact.name}</h3>
                <p className="text-xs text-dark-6 dark:text-dark-5">{selectedContact.role}</p>
              </div>
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  selectedContact.isOnline
                    ? "bg-green/10 text-green dark:bg-green/20"
                    : "bg-gray-200 text-dark-6 dark:bg-dark-2 dark:text-dark-5",
                )}
              >
                <span
                  className={cn("size-1.5 rounded-full", selectedContact.isOnline ? "bg-green" : "bg-gray-400")}
                />
                {selectedContact.isOnline ? "Online" : "Offline"}
              </span>
            </header>

            {/* Messages — scrollable */}
            <div
              ref={messagesContainerRef}
              className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4"
              style={{ minHeight: 0 }}
            >
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5",
                        msg.role === "user"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-dark dark:bg-dark-2 dark:text-white",
                      )}
                    >
                      {msg.meetingCard ? (
                        <div
                          className={cn(
                            "min-w-[220px] max-w-[280px] overflow-hidden rounded-xl shadow-sm",
                            msg.role === "user"
                              ? "bg-white/15 ring-1 ring-white/25 backdrop-blur-sm"
                              : "bg-white/80 ring-1 ring-gray-200 dark:bg-dark-2/80 dark:ring-white/10",
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-2 px-3 py-2",
                              msg.role === "user" ? "bg-white/20" : "bg-primary/10 dark:bg-primary/20",
                            )}
                          >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/90 text-primary dark:bg-white/20">
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-wide opacity-90">Meeting</span>
                          </div>
                          <div className="p-3">
                            <h4 className="mb-3 line-clamp-2 text-base font-bold leading-tight">
                              {msg.meetingCard.title}
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2.5 text-sm">
                                <svg className="size-4 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>
                                  {new Date(msg.meetingCard.date + "T00:00:00").toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2.5 text-sm">
                                <svg className="size-4 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>
                                  {new Date(`2000-01-01T${msg.meetingCard.time}`).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}
                                  <span className="ml-1.5 opacity-75">
                                    · {DURATION_OPTIONS.find((o) => o.value === msg.meetingCard!.duration)?.label ?? `${msg.meetingCard.duration} min`}
                                  </span>
                                </span>
                              </div>
                            </div>
                            {msg.meetingCard.notes ? (
                              <p className="mt-2.5 line-clamp-2 rounded-lg bg-black/5 px-2.5 py-2 text-xs leading-relaxed opacity-90 dark:bg-white/5">
                                {msg.meetingCard.notes}
                              </p>
                            ) : null}
                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                className={cn(
                                  "flex-1 rounded-lg py-2 text-xs font-semibold shadow-sm transition",
                                  msg.role === "user"
                                    ? "bg-white text-primary hover:bg-white/95 dark:bg-white dark:text-primary dark:hover:bg-white/90"
                                    : "bg-primary text-white hover:bg-primary/90",
                                )}
                              >
                                Join
                              </button>
                              <button
                                type="button"
                                className={cn(
                                  "rounded-lg border py-2 px-3 text-xs font-medium transition",
                                  msg.role === "user"
                                    ? "border-white/40 bg-transparent hover:bg-white/10 dark:border-white/30"
                                    : "border-primary/50 bg-transparent text-primary hover:bg-primary/10 dark:border-primary/40",
                                )}
                              >
                                Add to calendar
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      {msg.pollCard ? (
                        <div
                          className={cn(
                            "min-w-[220px] max-w-[280px] overflow-hidden rounded-xl shadow-sm",
                            msg.role === "user"
                              ? "bg-white/15 ring-1 ring-white/25 backdrop-blur-sm"
                              : "bg-white/80 ring-1 ring-gray-200 dark:bg-dark-2/80 dark:ring-white/10",
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-2 px-3 py-2",
                              msg.role === "user" ? "bg-white/20" : "bg-primary/10 dark:bg-primary/20",
                            )}
                          >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/90 text-primary dark:bg-white/20">
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-wide opacity-90">Poll</span>
                          </div>
                          <div className="p-3">
                            <p className="mb-3 text-sm font-semibold leading-snug">
                              {msg.pollCard.question}
                            </p>
                            <ul className="space-y-1.5">
                              {(() => {
                                const votes = pollVotes[msg.id] ?? [];
                                const totalVotes = msg.pollCard.options.reduce(
                                  (sum, _, i) => sum + (votes[i] ?? 0),
                                  0,
                                );
                                return msg.pollCard.options.map((opt, i) => {
                                  const count = votes[i] ?? 0;
                                  const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                                  return (
                                    <li key={i}>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handlePollVote(msg.id, i, msg.pollCard!.options.length)
                                        }
                                        className={cn(
                                          "relative w-full overflow-hidden rounded-lg px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-white/50",
                                          msg.role === "user"
                                            ? "bg-white/10 hover:bg-white/20"
                                            : "bg-gray-100 hover:bg-gray-200 dark:bg-dark-2 dark:hover:bg-dark-2/80",
                                        )}
                                      >
                                        <span className="absolute inset-0 bg-current opacity-[0.08] transition-all"
                                          style={{ width: `${percent}%` }}
                                          aria-hidden
                                        />
                                        <span className="relative flex items-center gap-2">
                                          <span className="size-5 shrink-0 rounded-full border-2 border-current opacity-60" aria-hidden />
                                          <span className="min-w-0 flex-1 truncate">{opt}</span>
                                          {totalVotes > 0 && (
                                            <span className="shrink-0 text-xs font-medium opacity-80">
                                              {count} {count === 1 ? "vote" : "votes"}
                                              {percent > 0 && ` · ${percent}%`}
                                            </span>
                                          )}
                                        </span>
                                      </button>
                                    </li>
                                  );
                                });
                              })()}
                            </ul>
                          </div>
                        </div>
                      ) : null}
                      {msg.text ? (
                        <p className="text-sm leading-relaxed">
                          {parseMessageWithEmojiImages(msg.text)}
                        </p>
                      ) : null}
                      {msg.attachments && msg.attachments.length > 0 ? (
                        <div
                          className={cn(
                            "mt-2 space-y-2",
                            msg.text && (msg.role === "user" ? "border-t border-white/20 pt-2" : "border-t border-gray-300 pt-2 dark:border-dark-2"),
                          )}
                        >
                          {msg.attachments.map((att, i) => {
                            const kind = getFileKind(att.type);
                            return (
                              <div
                                key={`${att.name}-${i}`}
                                className={cn(
                                  "flex items-center gap-2 rounded-lg p-2",
                                  msg.role === "user" ? "bg-white/10" : "bg-gray-200/50 dark:bg-dark-2/50",
                                )}
                              >
                                {kind === "image" ? (
                                  <img
                                    src={att.url}
                                    alt=""
                                    className="size-10 shrink-0 rounded object-cover"
                                    aria-hidden
                                  />
                                ) : (
                                  <span className="flex size-10 shrink-0 items-center justify-center rounded bg-white/20 dark:bg-dark-2">
                                    {kind === "pdf" ? (
                                      <svg className="size-5 text-red-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                                      </svg>
                                    ) : (
                                      <svg className="size-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    )}
                                  </span>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium opacity-95">{att.name}</p>
                                  <p className="text-xs opacity-75">{formatFileSize(att.size)}</p>
                                </div>
                                <div className="flex shrink-0 gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (kind === "image") setPreviewAttachment({ url: att.url, name: att.name, type: att.type });
                                      else if (kind === "pdf") window.open(att.url, "_blank");
                                      else window.open(att.url, "_blank");
                                    }}
                                    className="rounded p-1 opacity-80 hover:opacity-100"
                                    title="Preview"
                                    aria-label={`Preview ${att.name}`}
                                  >
                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDownload(att.url, att.name)}
                                    className="rounded p-1 opacity-80 hover:opacity-100"
                                    title="Download"
                                    aria-label={`Download ${att.name}`}
                                  >
                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                      <p
                        className={cn(
                          "mt-1 text-right text-xs",
                          msg.role === "user" ? "text-white/80" : "text-dark-6 dark:text-dark-5",
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Pending attachments strip */}
            {pendingAttachments.length > 0 && (
              <div className="shrink-0 border-t border-gray-200 bg-gray-50/50 px-4 py-3 dark:border-gray-800 dark:bg-dark-2/30">
                <p className="mb-2 text-xs font-medium text-dark-6 dark:text-dark-5">Attached files</p>
                <div className="flex flex-wrap gap-2">
                  {pendingAttachments.map((a) => {
                    const kind = getFileKind(a.file.type);
                    return (
                      <div
                        key={a.id}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-dark"
                      >
                        {kind === "image" ? (
                          <img
                            src={a.url}
                            alt=""
                            className="size-10 shrink-0 rounded object-cover"
                            aria-hidden
                          />
                        ) : (
                          <span className="flex size-10 shrink-0 items-center justify-center rounded bg-gray-100 dark:bg-dark-2">
                            {kind === "pdf" ? (
                              <svg className="size-5 text-red-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                              </svg>
                            ) : (
                              <svg className="size-5 text-dark-6 dark:text-dark-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-dark dark:text-white">{a.file.name}</p>
                          <p className="text-xs text-dark-6 dark:text-dark-5">{formatFileSize(a.file.size)}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openPreview(a.url, a.file.name, a.file.type)}
                            className="rounded p-1.5 text-dark-6 hover:bg-gray-100 hover:text-dark dark:hover:bg-dark-2 dark:hover:text-white"
                            title="Preview"
                            aria-label={`Preview ${a.file.name}`}
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(a.url, a.file.name)}
                            className="rounded p-1.5 text-dark-6 hover:bg-gray-100 hover:text-dark dark:hover:bg-dark-2 dark:hover:text-white"
                            title="Download"
                            aria-label={`Download ${a.file.name}`}
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => removePendingAttachment(a.id)}
                            className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                            title="Remove"
                            aria-label={`Remove ${a.file.name}`}
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Image preview modal */}
            {previewAttachment && (
              <div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
                role="dialog"
                aria-modal="true"
                aria-label="Image preview"
              >
                <button
                  type="button"
                  onClick={() => setPreviewAttachment(null)}
                  className="absolute right-4 top-4 rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
                  aria-label="Close preview"
                >
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={previewAttachment.url}
                  alt={previewAttachment.name}
                  className="max-h-[90vh] max-w-full rounded-lg object-contain"
                />
              </div>
            )}

            {/* Input */}
            <div className="shrink-0 border-t border-gray-200 p-4 dark:border-gray-800">
              <div className="flex items-end gap-2">
                <div className="relative" ref={emojiPickerRef}>
                  <button
                    type="button"
                    onClick={() => setEmojiPickerOpen((o) => !o)}
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-2 text-dark-6 hover:bg-gray-100 dark:border-gray-800 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-2"
                    aria-label="Insert emoji"
                  >
                    <svg
                      className="size-5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  </button>
                  {emojiPickerOpen && (
                    <div className="absolute bottom-full left-0 z-50 mb-2 w-[min(352px,85vw)] rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-dark [&_.epr-main]:!rounded-xl [&_.epr-header]:!rounded-t-xl">
                      <EmojiPicker
                        theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
                        onEmojiClick={(data: EmojiClickData) => {
                          syncInputFromPickerRef.current = true;
                          setInputValue((v) => v + data.emoji);
                          setEmojiPickerOpen(false);
                          messageInputRef.current?.focus();
                        }}
                        width="100%"
                        height={360}
                        searchPlaceHolder="Search emoji..."
                        previewConfig={{ showPreview: false }}
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setAttachmentSheetOpen(true)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-2 text-dark-6 hover:bg-gray-100 dark:border-gray-800 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-2"
                  aria-label="Attach"
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <div
                  ref={messageInputRef}
                  contentEditable
                  role="textbox"
                  data-placeholder="Type your message..."
                  aria-label="Message"
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const text = getTextFromContentEditable(e.currentTarget);
                    setInputValue(text);
                  }}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-2 px-4 py-3 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-dark-2 dark:text-white",
                    "[&:empty::before]:cursor-text [&:empty::before]:content-[attr(data-placeholder)] [&:empty::before]:pointer-events-none [&:empty::before]:text-dark-6 dark:[&:empty::before]:text-dark-5",
                    "[&_img]:inline-block [&_img]:size-5 [&_img]:align-baseline [&_img]:select-none"
                  )}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputValue.trim() && !pendingAttachments.length}
                  className="shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary"
                  aria-label="Send message"
                >
                  Send
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="*/*"
              onChange={handleFileChange}
              className="sr-only"
              aria-hidden
            />
            <BottomSheet
              isOpen={attachmentSheetOpen}
              onClose={() => {
                setAttachmentSheetOpen(false);
                setScheduleFormOpen(false);
                setPollFormOpen(false);
              }}
              title={
                pollFormOpen ? "Create poll" : scheduleFormOpen ? "Schedule a meeting" : "Attach"
              }
              contained
            >
              {pollFormOpen ? (
                <form onSubmit={handlePollSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="poll-question" className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                      Question
                    </label>
                    <input
                      id="poll-question"
                      type="text"
                      value={pollForm.question}
                      onChange={(e) => setPollForm((f) => ({ ...f, question: e.target.value }))}
                      placeholder="Ask a question..."
                      required
                      className="w-full rounded-lg border border-gray-200 bg-gray-2 px-3 py-2.5 text-sm text-dark placeholder:text-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-5"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                      Options (at least 2)
                    </label>
                    <div className="space-y-2">
                      {pollForm.options.map((opt, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updatePollOption(i, e.target.value)}
                            placeholder={`Option ${i + 1}`}
                            className="flex-1 rounded-lg border border-gray-200 bg-gray-2 px-3 py-2.5 text-sm text-dark placeholder:text-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-5"
                          />
                          <button
                            type="button"
                            onClick={() => removePollOption(i)}
                            disabled={pollForm.options.length <= 2}
                            className="shrink-0 rounded-lg border border-gray-200 p-2.5 text-dark-6 hover:bg-gray-100 disabled:opacity-40 dark:border-gray-800 dark:text-dark-5 dark:hover:bg-dark-2"
                            aria-label={`Remove option ${i + 1}`}
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addPollOption}
                      className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-gray-300 py-2 px-3 text-sm font-medium text-dark-6 hover:border-primary hover:text-primary dark:border-gray-700 dark:text-dark-5 dark:hover:border-primary dark:hover:text-primary"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add option
                    </button>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPollFormOpen(false)}
                      className="flex-1 rounded-lg border border-gray-200 bg-gray-2 py-2.5 text-sm font-medium text-dark hover:bg-gray-100 dark:border-gray-800 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-2"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90"
                    >
                      Create & send
                    </button>
                  </div>
                </form>
              ) : scheduleFormOpen ? (
                <form onSubmit={handleScheduleMeetingSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="meeting-title" className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                      Title
                    </label>
                    <input
                      id="meeting-title"
                      type="text"
                      value={scheduleForm.title}
                      onChange={(e) => setScheduleForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Meeting title"
                      required
                      className="w-full rounded-lg border border-gray-200 bg-gray-2 px-3 py-2.5 text-sm text-dark placeholder:text-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="meeting-date" className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                        Date
                      </label>
                      <input
                        id="meeting-date"
                        type="date"
                        value={scheduleForm.date}
                        onChange={(e) => setScheduleForm((f) => ({ ...f, date: e.target.value }))}
                        required
                        className="w-full rounded-lg border border-gray-200 bg-gray-2 px-3 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-dark-2 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="meeting-time" className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                        Time
                      </label>
                      <input
                        id="meeting-time"
                        type="time"
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm((f) => ({ ...f, time: e.target.value }))}
                        required
                        className="w-full rounded-lg border border-gray-200 bg-gray-2 px-3 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-dark-2 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="meeting-duration" className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                      Duration
                    </label>
                    <select
                      id="meeting-duration"
                      value={scheduleForm.duration}
                      onChange={(e) => setScheduleForm((f) => ({ ...f, duration: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-2 px-3 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-dark-2 dark:text-white"
                    >
                      {DURATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="meeting-notes" className="mb-1.5 block text-sm font-medium text-dark dark:text-white">
                      Notes (optional)
                    </label>
                    <textarea
                      id="meeting-notes"
                      value={scheduleForm.notes}
                      onChange={(e) => setScheduleForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Add notes..."
                      rows={2}
                      className="w-full resize-none rounded-lg border border-gray-200 bg-gray-2 px-3 py-2.5 text-sm text-dark placeholder:text-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-5"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setScheduleFormOpen(false)}
                      className="flex-1 rounded-lg border border-gray-200 bg-gray-2 py-2.5 text-sm font-medium text-dark hover:bg-gray-100 dark:border-gray-800 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-2"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90"
                    >
                      Schedule & send
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={handleFilesClick}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-2"
                  >
                    <span className="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-2">
                      <svg className="size-5 text-dark-6 dark:text-dark-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <span className="font-medium">Files</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleFormOpen(true)}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-2"
                  >
                    <span className="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-2">
                      <svg className="size-5 text-dark-6 dark:text-dark-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="font-medium">Schedule a meeting</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPollFormOpen(true)}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-dark hover:bg-gray-100 dark:text-white dark:hover:bg-dark-2"
                  >
                    <span className="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-2">
                      <svg className="size-5 text-dark-6 dark:text-dark-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </span>
                    <span className="font-medium">Poll</span>
                  </button>
                </div>
              )}
            </BottomSheet>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-2">
              <svg
                className="size-10 text-dark-6 dark:text-dark-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-dark dark:text-white">Company communications</h3>
              <p className="mt-1 text-sm text-dark-6 dark:text-dark-5">
                Select a contact from the list to start a conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
