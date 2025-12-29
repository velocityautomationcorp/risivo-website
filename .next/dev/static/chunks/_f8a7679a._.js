(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hooks/useAiChat.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAiChat",
    ()=>useAiChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useAiChat({ subAccountId, userId, conversationId: initialConversationId, onError }) {
    _s();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [conversationId, setConversationId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialConversationId);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAiChat.useCallback[scrollToBottom]": ()=>{
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }["useAiChat.useCallback[scrollToBottom]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAiChat.useEffect": ()=>{
            scrollToBottom();
        }
    }["useAiChat.useEffect"], [
        messages,
        scrollToBottom
    ]);
    // Load conversation history
    const loadConversation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAiChat.useCallback[loadConversation]": async (convId)=>{
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(`/api/v1/ai/chat?conversationId=${convId}`);
                if (!response.ok) {
                    throw new Error('Failed to load conversation');
                }
                const data = await response.json();
                if (data.success && data.conversation) {
                    // Parse messages from conversation
                    const loadedMessages = data.conversation.messages || [];
                    setMessages(loadedMessages);
                    setConversationId(convId);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load conversation';
                setError(errorMessage);
                onError?.(err instanceof Error ? err : new Error(errorMessage));
            } finally{
                setIsLoading(false);
            }
        }
    }["useAiChat.useCallback[loadConversation]"], [
        onError
    ]);
    // Send a new message
    const sendMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAiChat.useCallback[sendMessage]": async (content)=>{
            if (!content.trim() || isLoading) return;
            const userMessage = {
                id: `msg_${Date.now()}_user`,
                role: 'user',
                content: content.trim(),
                timestamp: new Date()
            };
            // Add user message immediately
            setMessages({
                "useAiChat.useCallback[sendMessage]": (prev)=>[
                        ...prev,
                        userMessage
                    ]
            }["useAiChat.useCallback[sendMessage]"]);
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/v1/ai/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: content.trim(),
                        subAccountId,
                        userId,
                        conversationId
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to send message');
                }
                const data = await response.json();
                if (data.success) {
                    // Add AI response
                    const aiMessage = {
                        id: data.data?.message?.id || `msg_${Date.now()}_ai`,
                        role: 'assistant',
                        content: data.data?.message?.content || data.response || 'I processed your request.',
                        timestamp: new Date(data.data?.message?.createdAt || Date.now()),
                        functionCalls: data.functionCalls?.map({
                            "useAiChat.useCallback[sendMessage]": (fc)=>({
                                    name: fc.name,
                                    arguments: fc.args,
                                    result: fc.response,
                                    status: 'success'
                                })
                        }["useAiChat.useCallback[sendMessage]"])
                    };
                    setMessages({
                        "useAiChat.useCallback[sendMessage]": (prev)=>[
                                ...prev,
                                aiMessage
                            ]
                    }["useAiChat.useCallback[sendMessage]"]);
                    // Update conversation ID if this was the first message
                    if (data.data?.conversationId && !conversationId) {
                        setConversationId(data.data.conversationId);
                    }
                } else {
                    throw new Error(data.error || 'Failed to get AI response');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
                setError(errorMessage);
                onError?.(err instanceof Error ? err : new Error(errorMessage));
                // Add error message to chat
                const errorMsg = {
                    id: `msg_${Date.now()}_error`,
                    role: 'assistant',
                    content: `Sorry, I encountered an error: ${errorMessage}`,
                    timestamp: new Date()
                };
                setMessages({
                    "useAiChat.useCallback[sendMessage]": (prev)=>[
                            ...prev,
                            errorMsg
                        ]
                }["useAiChat.useCallback[sendMessage]"]);
            } finally{
                setIsLoading(false);
            }
        }
    }["useAiChat.useCallback[sendMessage]"], [
        subAccountId,
        userId,
        conversationId,
        isLoading,
        onError
    ]);
    // Clear all messages
    const clearMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAiChat.useCallback[clearMessages]": ()=>{
            setMessages([]);
            setConversationId(undefined);
            setError(null);
        }
    }["useAiChat.useCallback[clearMessages]"], []);
    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
        loadConversation
    };
}
_s(useAiChat, "Qjr5vww7slc//KED7fYqm9D0E00=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ai/MessageBubble.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageBubble",
    ()=>MessageBubble
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const timestamp = typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[80%]`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${isUser ? 'bg-blue-600' : 'bg-gradient-to-br from-purple-600 to-pink-600'}`,
                    children: isUser ? '👤' : '🤖'
                }, void 0, false, {
                    fileName: "[project]/components/ai/MessageBubble.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `rounded-2xl px-4 py-3 ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900 border border-gray-200'}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm leading-relaxed whitespace-pre-wrap",
                                children: message.content
                            }, void 0, false, {
                                fileName: "[project]/components/ai/MessageBubble.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ai/MessageBubble.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this),
                        message.functionCalls && message.functionCalls.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: message.functionCalls.map((func, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FunctionCallDisplay, {
                                    functionCall: func
                                }, index, false, {
                                    fileName: "[project]/components/ai/MessageBubble.tsx",
                                    lineNumber: 55,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/ai/MessageBubble.tsx",
                            lineNumber: 53,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`,
                            children: timestamp.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })
                        }, void 0, false, {
                            fileName: "[project]/components/ai/MessageBubble.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ai/MessageBubble.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ai/MessageBubble.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ai/MessageBubble.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_c = MessageBubble;
function FunctionCallDisplay({ functionCall }) {
    const statusIcons = {
        pending: '⏳',
        success: '✅',
        error: '❌'
    };
    const statusColors = {
        pending: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border p-3 text-xs ${statusColors[functionCall.status]}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: statusIcons[functionCall.status]
                    }, void 0, false, {
                        fileName: "[project]/components/ai/MessageBubble.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold",
                        children: [
                            "Function: ",
                            functionCall.name,
                            "()"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai/MessageBubble.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai/MessageBubble.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            functionCall.result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 font-mono text-xs opacity-80",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                    className: "whitespace-pre-wrap",
                    children: typeof functionCall.result === 'string' ? functionCall.result : JSON.stringify(functionCall.result, null, 2)
                }, void 0, false, {
                    fileName: "[project]/components/ai/MessageBubble.tsx",
                    lineNumber: 92,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ai/MessageBubble.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ai/MessageBubble.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_c1 = FunctionCallDisplay;
var _c, _c1;
__turbopack_context__.k.register(_c, "MessageBubble");
__turbopack_context__.k.register(_c1, "FunctionCallDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ai/TypingIndicator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TypingIndicator",
    ()=>TypingIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function TypingIndicator() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-start mb-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start gap-3 max-w-[80%]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-purple-600 to-pink-600",
                    children: "🤖"
                }, void 0, false, {
                    fileName: "[project]/components/ai/TypingIndicator.tsx",
                    lineNumber: 10,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                                style: {
                                    animationDelay: '0ms'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/ai/TypingIndicator.tsx",
                                lineNumber: 17,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                                style: {
                                    animationDelay: '150ms'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/ai/TypingIndicator.tsx",
                                lineNumber: 18,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                                style: {
                                    animationDelay: '300ms'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/ai/TypingIndicator.tsx",
                                lineNumber: 19,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai/TypingIndicator.tsx",
                        lineNumber: 16,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ai/TypingIndicator.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ai/TypingIndicator.tsx",
            lineNumber: 8,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ai/TypingIndicator.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = TypingIndicator;
var _c;
__turbopack_context__.k.register(_c, "TypingIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/theme/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ==========================================
// RISIVO CRM - Theme System Type Definitions
// ==========================================
/**
 * Complete theme configuration for a sub-account
 * All colors follow CSS color format (hex, rgb, hsl)
 */ __turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/theme/defaults.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ==========================================
// RISIVO CRM - Default Theme Configuration
// ==========================================
__turbopack_context__.s([
    "RISIVO_DEFAULT_THEME",
    ()=>RISIVO_DEFAULT_THEME,
    "applyThemeToDocument",
    ()=>applyThemeToDocument,
    "darkenColor",
    ()=>darkenColor,
    "generateColorVariants",
    ()=>generateColorVariants,
    "generateThemeCSS",
    ()=>generateThemeCSS,
    "getContrastingTextColor",
    ()=>getContrastingTextColor,
    "getThemeValue",
    ()=>getThemeValue,
    "isLightColor",
    ()=>isLightColor,
    "lightenColor",
    ()=>lightenColor,
    "themeToCSSVariables",
    ()=>themeToCSSVariables,
    "themeToInlineStyle",
    ()=>themeToInlineStyle
]);
const RISIVO_DEFAULT_THEME = {
    subAccountId: 'default',
    // Logo (default RISIVO logo)
    logoUrl: '/risivo-logo.png',
    logoWidth: 150,
    logoHeight: 34,
    // Favicon (browser tab icon)
    faviconUrl: '/risivo-favicon.png',
    // Primary Colors - RISIVO Blue
    primaryColor: '#3B82F6',
    primaryHover: '#2563EB',
    primaryForeground: '#FFFFFF',
    primaryAccent: '#60A5FA',
    // Secondary Colors - RISIVO Green
    secondaryColor: '#10B981',
    secondaryHover: '#059669',
    secondaryForeground: '#FFFFFF',
    // Background Colors
    backgroundColor: '#F9FAFB',
    surfaceColor: '#FFFFFF',
    surfaceHover: '#F3F4F6',
    // Text Colors
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    // Border Colors
    borderColor: '#E5E7EB',
    borderHover: '#D1D5DB',
    // Status Colors
    successColor: '#10B981',
    warningColor: '#F59E0B',
    errorColor: '#EF4444',
    infoColor: '#3B82F6',
    // Sidebar (inherits from primary by default)
    sidebarBg: '#3B82F6',
    sidebarText: '#FFFFFF',
    sidebarHover: 'rgba(255, 255, 255, 0.2)',
    sidebarActive: '#FFFFFF',
    sidebarActiveForeground: '#111827',
    // Button
    buttonPrimaryBg: '#10B981',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondaryBg: '#FFFFFF',
    buttonSecondaryText: '#3B82F6',
    // Header
    headerBg: '#FFFFFF',
    headerText: '#374151',
    headerBorder: '#E5E7EB',
    // Input
    inputBg: '#FFFFFF',
    inputBorder: '#D1D5DB',
    inputFocus: '#3B82F6',
    inputText: '#111827',
    inputPlaceholder: '#9CA3AF',
    // Modal
    modalBg: '#FFFFFF',
    overlayBg: 'rgba(0, 0, 0, 0.5)',
    // Shadow
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    // Border Radius
    borderRadiusSmall: '0.375rem',
    borderRadiusMedium: '0.5rem',
    borderRadiusLarge: '0.75rem',
    borderRadiusFull: '9999px',
    // Typography
    fontFamily: 'var(--font-poppins), system-ui, sans-serif',
    fontSizeBase: '14px',
    fontWeightNormal: '400',
    fontWeightMedium: '500',
    fontWeightBold: '700',
    // Meta
    colorSource: 'preset',
    presetName: 'risivo',
    // Brand Voice (empty by default)
    brandVoiceToneName: null,
    brandVoiceTargetAudience: null,
    brandVoicePersonality: null,
    brandVoiceWritingStyle: null,
    brandVoiceKeyPhrases: null,
    brandVoiceAvoidPhrases: null,
    brandVoiceSampleCopy: null
};
function themeToCSSVariables(theme) {
    const merged = {
        ...RISIVO_DEFAULT_THEME,
        ...theme
    };
    return {
        // Primary
        '--theme-primary': merged.primaryColor,
        '--theme-primary-hover': merged.primaryHover,
        '--theme-primary-foreground': merged.primaryForeground,
        '--theme-primary-accent': merged.primaryAccent || merged.primaryColor,
        // Secondary
        '--theme-secondary': merged.secondaryColor,
        '--theme-secondary-hover': merged.secondaryHover,
        '--theme-secondary-foreground': merged.secondaryForeground,
        // Background
        '--theme-background': merged.backgroundColor,
        '--theme-surface': merged.surfaceColor,
        '--theme-surface-hover': merged.surfaceHover,
        // Text
        '--theme-text-primary': merged.textPrimary,
        '--theme-text-secondary': merged.textSecondary,
        '--theme-text-muted': merged.textMuted,
        // Border
        '--theme-border': merged.borderColor,
        '--theme-border-hover': merged.borderHover,
        // Status
        '--theme-success': merged.successColor,
        '--theme-warning': merged.warningColor,
        '--theme-error': merged.errorColor,
        '--theme-info': merged.infoColor,
        // Sidebar
        '--theme-sidebar-bg': merged.sidebarBg || merged.primaryColor,
        '--theme-sidebar-text': merged.sidebarText || merged.primaryForeground,
        '--theme-sidebar-hover': merged.sidebarHover || 'rgba(255, 255, 255, 0.2)',
        '--theme-sidebar-active': merged.sidebarActive,
        '--theme-sidebar-active-foreground': merged.sidebarActiveForeground,
        // Button
        '--theme-button-primary-bg': merged.buttonPrimaryBg || merged.secondaryColor,
        '--theme-button-primary-text': merged.buttonPrimaryText,
        '--theme-button-secondary-bg': merged.buttonSecondaryBg,
        '--theme-button-secondary-text': merged.buttonSecondaryText || merged.primaryColor,
        // Header
        '--theme-header-bg': merged.headerBg,
        '--theme-header-text': merged.headerText,
        '--theme-header-border': merged.headerBorder,
        // Input
        '--theme-input-bg': merged.inputBg,
        '--theme-input-border': merged.inputBorder,
        '--theme-input-focus': merged.inputFocus || merged.primaryColor,
        '--theme-input-text': merged.inputText,
        '--theme-input-placeholder': merged.inputPlaceholder,
        // Modal
        '--theme-modal-bg': merged.modalBg,
        '--theme-overlay-bg': merged.overlayBg,
        // Shadow
        '--theme-shadow': merged.shadowColor,
        // Radius
        '--theme-radius-sm': merged.borderRadiusSmall,
        '--theme-radius-md': merged.borderRadiusMedium,
        '--theme-radius-lg': merged.borderRadiusLarge,
        '--theme-radius-full': merged.borderRadiusFull,
        // Typography
        '--theme-font-family': merged.fontFamily,
        '--theme-font-size-base': merged.fontSizeBase,
        '--theme-font-normal': merged.fontWeightNormal,
        '--theme-font-medium': merged.fontWeightMedium,
        '--theme-font-bold': merged.fontWeightBold
    };
}
function generateThemeCSS(theme) {
    const variables = themeToCSSVariables(theme);
    const cssVars = Object.entries(variables).map(([key, value])=>`  ${key}: ${value};`).join('\n');
    return `:root {\n${cssVars}\n}`;
}
function themeToInlineStyle(theme) {
    const variables = themeToCSSVariables(theme);
    const style = {};
    Object.entries(variables).forEach(([key, value])=>{
        // Convert CSS variable name to camelCase for inline styles
        style[key] = value;
    });
    return style;
}
function applyThemeToDocument(theme) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const variables = themeToCSSVariables(theme);
    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value])=>{
        root.style.setProperty(key, value);
    });
}
function getThemeValue(variableName) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}
function lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1).toUpperCase();
}
function darkenColor(hex, percent) {
    return lightenColor(hex, -percent);
}
function generateColorVariants(baseColor) {
    return {
        base: baseColor,
        hover: darkenColor(baseColor, 10),
        light: lightenColor(baseColor, 20),
        dark: darkenColor(baseColor, 20)
    };
}
function isLightColor(hex) {
    const color = hex.replace('#', '');
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}
function getContrastingTextColor(bgColor) {
    return isLightColor(bgColor) ? '#111827' : '#FFFFFF';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/theme/color-extractor.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ==========================================
// RISIVO CRM - Logo Color Extraction Utility
// ==========================================
__turbopack_context__.s([
    "extractColorsFromImage",
    ()=>extractColorsFromImage,
    "extractColorsFromImageSafe",
    ()=>extractColorsFromImageSafe,
    "generateThemeFromColors",
    ()=>generateThemeFromColors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme/defaults.ts [app-client] (ecmascript)");
;
async function extractColorsFromImage(imageUrl) {
    return new Promise((resolve, reject)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = ()=>{
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not create canvas context'));
                    return;
                }
                // Scale down for performance (max 100x100)
                const scale = Math.min(100 / img.width, 100 / img.height, 1);
                canvas.width = Math.floor(img.width * scale);
                canvas.height = Math.floor(img.height * scale);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const colors = analyzePixelData(imageData.data);
                resolve(colors);
            } catch (error) {
                reject(error);
            }
        };
        img.onerror = ()=>{
            reject(new Error('Failed to load image'));
        };
        img.src = imageUrl;
    });
}
/**
 * Analyze pixel data to extract dominant colors
 */ function analyzePixelData(data) {
    const colorCounts = new Map();
    // Sample every 4th pixel for performance
    for(let i = 0; i < data.length; i += 16){
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        // Skip transparent or near-white/black pixels
        if (a < 128) continue;
        if (r > 240 && g > 240 && b > 240) continue;
        if (r < 15 && g < 15 && b < 15) continue;
        // Quantize colors to reduce unique values
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;
        const key = `${qr},${qg},${qb}`;
        const existing = colorCounts.get(key);
        if (existing) {
            existing.count++;
        } else {
            colorCounts.set(key, {
                count: 1,
                r: qr,
                g: qg,
                b: qb
            });
        }
    }
    // Sort by frequency
    const sortedColors = Array.from(colorCounts.entries()).sort((a, b)=>b[1].count - a[1].count).slice(0, 10);
    // Convert to hex
    const palette = sortedColors.map(([_, { r, g, b }])=>rgbToHex(r, g, b));
    // Categorize colors by vibrancy
    const { vibrant, muted, dark, light } = categorizeColors(sortedColors);
    return {
        dominant: palette[0] || '#3B82F6',
        palette,
        vibrant: vibrant || palette[0],
        muted: muted || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["darkenColor"])(palette[0] || '#3B82F6', 20),
        darkVibrant: dark?.vibrant,
        darkMuted: dark?.muted,
        lightVibrant: light?.vibrant,
        lightMuted: light?.muted
    };
}
/**
 * Convert RGB to hex
 */ function rgbToHex(r, g, b) {
    return '#' + [
        r,
        g,
        b
    ].map((x)=>Math.min(255, Math.max(0, x)).toString(16).padStart(2, '0')).join('').toUpperCase();
}
/**
 * Calculate color saturation
 */ function getSaturation(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return max === 0 ? 0 : (max - min) / max;
}
/**
 * Calculate color lightness
 */ function getLightness(r, g, b) {
    return (Math.max(r, g, b) + Math.min(r, g, b)) / 510;
}
/**
 * Categorize colors into vibrant, muted, dark, light
 */ function categorizeColors(colors) {
    let vibrant;
    let muted;
    const dark = {};
    const light = {};
    for (const [_, { r, g, b }] of colors){
        const saturation = getSaturation(r, g, b);
        const lightness = getLightness(r, g, b);
        const hex = rgbToHex(r, g, b);
        // Vibrant: High saturation
        if (saturation > 0.5 && !vibrant) {
            vibrant = hex;
        }
        // Muted: Low saturation
        if (saturation < 0.3 && saturation > 0.1 && !muted) {
            muted = hex;
        }
        // Dark variants
        if (lightness < 0.35) {
            if (saturation > 0.5 && !dark.vibrant) {
                dark.vibrant = hex;
            }
            if (saturation < 0.3 && !dark.muted) {
                dark.muted = hex;
            }
        }
        // Light variants
        if (lightness > 0.65) {
            if (saturation > 0.5 && !light.vibrant) {
                light.vibrant = hex;
            }
            if (saturation < 0.3 && !light.muted) {
                light.muted = hex;
            }
        }
    }
    return {
        vibrant,
        muted,
        dark,
        light
    };
}
function generateThemeFromColors(colors, options = {}) {
    const { preferDarkSidebar = true, preserveStatusColors = true } = options;
    // Primary color: Use dominant or vibrant
    const primaryColor = colors.vibrant || colors.dominant;
    const primaryVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateColorVariants"])(primaryColor);
    // Secondary color: Use second most common or complementary
    const secondaryColor = colors.palette[1] || colors.muted || generateComplementaryColor(primaryColor);
    const secondaryVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateColorVariants"])(secondaryColor);
    // Sidebar color: Use dark vibrant if available, or darken primary
    let sidebarBg = primaryColor;
    if (preferDarkSidebar && colors.darkVibrant) {
        sidebarBg = colors.darkVibrant;
    } else if (preferDarkSidebar) {
        sidebarBg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["darkenColor"])(primaryColor, 15);
    }
    const theme = {
        // Primary
        primaryColor,
        primaryHover: primaryVariants.hover,
        primaryForeground: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getContrastingTextColor"])(primaryColor),
        primaryAccent: primaryVariants.light,
        // Secondary
        secondaryColor,
        secondaryHover: secondaryVariants.hover,
        secondaryForeground: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getContrastingTextColor"])(secondaryColor),
        // Sidebar
        sidebarBg,
        sidebarText: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getContrastingTextColor"])(sidebarBg),
        sidebarHover: `rgba(255, 255, 255, 0.2)`,
        // Button uses secondary as primary action
        buttonPrimaryBg: secondaryColor,
        buttonPrimaryText: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getContrastingTextColor"])(secondaryColor),
        buttonSecondaryText: primaryColor,
        // Input focus uses primary
        inputFocus: primaryColor,
        // Meta
        colorSource: 'logo_extracted'
    };
    // Optionally preserve standard status colors
    if (!preserveStatusColors) {
        theme.successColor = secondaryColor;
        theme.infoColor = primaryColor;
    }
    return theme;
}
/**
 * Generate a complementary color
 */ function generateComplementaryColor(hex) {
    const color = hex.replace('#', '');
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    // Convert to HSL
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(Math.max(r, g, b) / 255){
            case max:
                h = ((g - b) / 255 / d + (g < b ? 6 : 0)) / 6;
                break;
            case g / 255:
                h = ((b - r) / 255 / d + 2) / 6;
                break;
            case b / 255:
                h = ((r - g) / 255 / d + 4) / 6;
                break;
        }
    }
    // Rotate hue by 180 degrees for complementary
    h = (h + 0.5) % 1;
    // Convert back to RGB
    if (s === 0) {
        r = g = b = Math.round(l * 255);
    } else {
        const hue2rgb = (p, q, t)=>{
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
        g = Math.round(hue2rgb(p, q, h) * 255);
        b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
    }
    return rgbToHex(r, g, b);
}
async function extractColorsFromImageSafe(imageUrl) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return extractColorsFromImage(imageUrl);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/theme/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// ==========================================
// RISIVO CRM - Theme System Exports
// ==========================================
// Types
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme/types.ts [app-client] (ecmascript)");
// Default theme and utilities
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme/defaults.ts [app-client] (ecmascript)");
// Color extraction
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$color$2d$extractor$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme/color-extractor.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useTheme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useTheme",
    ()=>useTheme
]);
// ==========================================
// RISIVO CRM - Theme Management Hook
// ==========================================
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/theme/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme/defaults.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useTheme(options = {}) {
    _s();
    const { subAccountId: initialSubAccountId, autoApply = true, onThemeChange, onError } = options;
    // State
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RISIVO_DEFAULT_THEME"]);
    const [presets, setPresets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [presetsLoading, setPresetsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentSubAccountId, setCurrentSubAccountId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialSubAccountId);
    // Compute CSS variables
    const cssVariables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useTheme.useMemo[cssVariables]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["themeToCSSVariables"])(theme)
    }["useTheme.useMemo[cssVariables]"], [
        theme
    ]);
    // Apply theme to document
    const applyToDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTheme.useCallback[applyToDocument]": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyThemeToDocument"])(theme);
        }
    }["useTheme.useCallback[applyToDocument]"], [
        theme
    ]);
    // Auto-apply when theme changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTheme.useEffect": ()=>{
            if (autoApply && ("TURBOPACK compile-time value", "object") !== 'undefined') {
                applyToDocument();
                window.__RISIVO_THEME_APPLIED__ = true;
            }
            onThemeChange?.(theme);
        }
    }["useTheme.useEffect"], [
        theme,
        autoApply,
        applyToDocument,
        onThemeChange
    ]);
    // Load theme from API
    const loadTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTheme.useCallback[loadTheme]": async (subAccountId)=>{
            setIsLoading(true);
            setError(null);
            setCurrentSubAccountId(subAccountId);
            try {
                const response = await fetch(`/api/v1/themes?subAccountId=${subAccountId}`);
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Failed to load theme');
                }
                setTheme(data.data);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load theme';
                setError(message);
                onError?.(err instanceof Error ? err : new Error(message));
            } finally{
                setIsLoading(false);
            }
        }
    }["useTheme.useCallback[loadTheme]"], [
        onError
    ]);
    // Load presets
    const loadPresets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTheme.useCallback[loadPresets]": async ()=>{
            setPresetsLoading(true);
            try {
                const response = await fetch('/api/v1/themes?presets=true');
                const data = await response.json();
                if (data.success) {
                    setPresets(data.data);
                }
            } catch (err) {
                console.error('Failed to load presets:', err);
            } finally{
                setPresetsLoading(false);
            }
        }
    }["useTheme.useCallback[loadPresets]"], []);
    // Save theme to API
    const saveTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTheme.useCallback[saveTheme]": async (updates)=>{
            if (!currentSubAccountId) {
                throw new Error('No sub-account selected');
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/v1/themes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        subAccountId: currentSubAccountId,
                        theme: updates
                    })
                });
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Failed to save theme');
                }
                setTheme(data.data);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to save theme';
                setError(message);
                onError?.(err instanceof Error ? err : new Error(message));
                throw err;
            } finally{
                setIsLoading(false);
            }
        }
    }["useTheme.useCallback[saveTheme]"], [
        currentSubAccountId,
        onError
    ]);
    // Apply preset
    const applyPreset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTheme.useCallback[applyPreset]": async (presetName)=>{
            if (!currentSubAccountId) {
                throw new Error('No sub-account selected');
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/v1/themes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        subAccountId: currentSubAccountId,
                        applyPreset: presetName
                    })
                });
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Failed to apply preset');
                }
                setTheme(data.data);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to apply preset';
                setError(message);
                onError?.(err instanceof Error ? err : new Error(message));
                throw err;
            } finally{
                setIsLoading(false);
            }
        }
    }["useTheme.useCallback[applyPreset]"], [
        currentSubAccountId,
        onError
    ]);
    // Extract colors from logo
    const extractColorsFromLogo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTheme.useCallback[extractColorsFromLogo]": async (logoUrl)=>{
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/v1/themes/extract-colors', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        logoUrl
                    })
                });
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Failed to extract colors');
                }
                return data.data.suggestedTheme;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to extract colors';
                setError(message);
                onError?.(err instanceof Error ? err : new Error(message));
                throw err;
            } finally{
                setIsLoading(false);
            }
        }
    }["useTheme.useCallback[extractColorsFromLogo]"], [
        onError
    ]);
    // Reset theme to default
    const resetTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTheme.useCallback[resetTheme]": async ()=>{
            if (!currentSubAccountId) {
                setTheme(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2f$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RISIVO_DEFAULT_THEME"]);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/v1/themes?subAccountId=${currentSubAccountId}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Failed to reset theme');
                }
                setTheme(data.data);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to reset theme';
                setError(message);
                onError?.(err instanceof Error ? err : new Error(message));
                throw err;
            } finally{
                setIsLoading(false);
            }
        }
    }["useTheme.useCallback[resetTheme]"], [
        currentSubAccountId,
        onError
    ]);
    // Update single color (local state only, call saveTheme to persist)
    const updateColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTheme.useCallback[updateColor]": (key, value)=>{
            setTheme({
                "useTheme.useCallback[updateColor]": (prev)=>({
                        ...prev,
                        [key]: value
                    })
            }["useTheme.useCallback[updateColor]"]);
        }
    }["useTheme.useCallback[updateColor]"], []);
    // Initial load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTheme.useEffect": ()=>{
            loadPresets();
            if (initialSubAccountId) {
                loadTheme(initialSubAccountId);
            }
        }
    }["useTheme.useEffect"], [
        initialSubAccountId,
        loadPresets,
        loadTheme
    ]);
    return {
        // State
        theme,
        cssVariables,
        isLoading,
        error,
        presets,
        presetsLoading,
        // Actions
        loadTheme,
        saveTheme,
        applyPreset,
        extractColorsFromLogo,
        resetTheme,
        // Utilities
        updateColor,
        applyToDocument
    };
}
_s(useTheme, "aUGF3i9wI4290Mc6VB7K2/HaHoY=");
const __TURBOPACK__default__export__ = useTheme;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/theme/DynamicFavicon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DynamicFavicon",
    ()=>DynamicFavicon,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useDynamicFavicon",
    ()=>useDynamicFavicon
]);
// ==========================================
// RISIVO CRM - Dynamic Favicon Component
// ==========================================
// Updates the browser tab favicon based on sub-account theme
// Supports PNG, SVG, and ICO formats
// Uses safe DOM manipulation to avoid React reconciliation errors
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
// Unique ID for our managed favicon link
const FAVICON_ID = 'risivo-dynamic-favicon';
/**
 * Safely update or create favicon link in head
 * This function is safe to call during navigation
 */ function updateFaviconLink(iconUrl) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Determine the mime type based on the URL
    const getMimeType = (url)=>{
        if (url.startsWith('data:')) {
            const match = url.match(/^data:([^;]+);/);
            return match ? match[1] : 'image/png';
        }
        if (url.endsWith('.svg')) return 'image/svg+xml';
        if (url.endsWith('.ico')) return 'image/x-icon';
        return 'image/png';
    };
    const mimeType = getMimeType(iconUrl);
    // For data URLs, use directly; for regular URLs, add cache buster
    const finalUrl = iconUrl.startsWith('data:') ? iconUrl : `${iconUrl}?v=${Date.now()}`;
    // Try to find our existing managed link
    let existingLink = document.getElementById(FAVICON_ID);
    if (existingLink) {
        // Update existing link - this is safe during navigation
        existingLink.href = finalUrl;
        existingLink.type = mimeType;
    } else {
        // Create new favicon link with ID for future updates
        const link = document.createElement('link');
        link.id = FAVICON_ID;
        link.rel = 'icon';
        link.type = mimeType;
        link.href = finalUrl;
        document.head.appendChild(link);
    }
}
function DynamicFavicon({ faviconUrl, fallbackUrl = '/risivo-favicon.png' }) {
    _s();
    const previousUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DynamicFavicon.useEffect": ()=>{
            const iconUrl = faviconUrl || fallbackUrl;
            // Skip if URL hasn't changed
            if (previousUrl.current === iconUrl) return;
            previousUrl.current = iconUrl;
            // Safely update favicon
            updateFaviconLink(iconUrl);
        }
    }["DynamicFavicon.useEffect"], [
        faviconUrl,
        fallbackUrl
    ]);
    // This component doesn't render anything visible
    return null;
}
_s(DynamicFavicon, "VGCWtlab+HNmLbPWpRUQXAfqco0=");
_c = DynamicFavicon;
function useDynamicFavicon() {
    const setFavicon = (url)=>{
        updateFaviconLink(url);
    };
    const resetFavicon = (defaultUrl = '/risivo-favicon.png')=>{
        updateFaviconLink(defaultUrl);
    };
    return {
        setFavicon,
        resetFavicon
    };
}
const __TURBOPACK__default__export__ = DynamicFavicon;
var _c;
__turbopack_context__.k.register(_c, "DynamicFavicon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/theme/ThemeInitializer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeScript",
    ()=>ThemeScript,
    "useThemeCache",
    ()=>useThemeCache
]);
// ==========================================
// RISIVO CRM - Theme Initializer Component
// Prevents Flash of Unstyled Content (FOUC)
// by applying cached theme before paint
// ==========================================
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
function ThemeScript({ subAccountId }) {
    _s();
    // useLayoutEffect runs synchronously BEFORE the browser paints
    // This prevents the flash of default theme
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "ThemeScript.useLayoutEffect": ()=>{
            try {
                const CACHE_TTL = 3600000 // 1 hour
                ;
                const cacheKey = `risivo_theme_${subAccountId}`;
                const timestampKey = `${cacheKey}_timestamp`;
                const cached = localStorage.getItem(cacheKey);
                const timestamp = localStorage.getItem(timestampKey);
                // Check if cache is valid
                if (cached && timestamp && Date.now() - parseInt(timestamp) < CACHE_TTL) {
                    const theme = JSON.parse(cached);
                    const root = document.documentElement;
                    // Apply ALL CSS variables immediately
                    // Sidebar colors (most visible)
                    if (theme.sidebarBg) root.style.setProperty('--theme-sidebar-bg', theme.sidebarBg);
                    if (theme.sidebarText) root.style.setProperty('--theme-sidebar-text', theme.sidebarText);
                    if (theme.sidebarHover) root.style.setProperty('--theme-sidebar-hover', theme.sidebarHover);
                    if (theme.sidebarActive) root.style.setProperty('--theme-sidebar-active', theme.sidebarActive);
                    if (theme.sidebarActiveForeground) root.style.setProperty('--theme-sidebar-active-foreground', theme.sidebarActiveForeground);
                    if (theme.sidebarTextMuted) root.style.setProperty('--theme-sidebar-text-muted', theme.sidebarTextMuted);
                    // Primary colors
                    if (theme.primaryColor) root.style.setProperty('--theme-primary', theme.primaryColor);
                    if (theme.primaryHover) root.style.setProperty('--theme-primary-hover', theme.primaryHover);
                    if (theme.primaryForeground) root.style.setProperty('--theme-primary-foreground', theme.primaryForeground);
                    if (theme.primaryAccent) root.style.setProperty('--theme-primary-accent', theme.primaryAccent);
                    // Secondary colors
                    if (theme.secondaryColor) root.style.setProperty('--theme-secondary', theme.secondaryColor);
                    if (theme.secondaryHover) root.style.setProperty('--theme-secondary-hover', theme.secondaryHover);
                    if (theme.secondaryForeground) root.style.setProperty('--theme-secondary-foreground', theme.secondaryForeground);
                    // Button colors
                    if (theme.buttonPrimaryBg) root.style.setProperty('--theme-button-primary-bg', theme.buttonPrimaryBg);
                    if (theme.buttonPrimaryText) root.style.setProperty('--theme-button-primary-text', theme.buttonPrimaryText);
                    if (theme.buttonSecondaryBg) root.style.setProperty('--theme-button-secondary-bg', theme.buttonSecondaryBg);
                    if (theme.buttonSecondaryText) root.style.setProperty('--theme-button-secondary-text', theme.buttonSecondaryText);
                    // Background colors
                    if (theme.backgroundColor) root.style.setProperty('--theme-background', theme.backgroundColor);
                    if (theme.surfaceColor) root.style.setProperty('--theme-surface', theme.surfaceColor);
                    if (theme.surfaceHover) root.style.setProperty('--theme-surface-hover', theme.surfaceHover);
                    // Text colors
                    if (theme.textPrimary) root.style.setProperty('--theme-text-primary', theme.textPrimary);
                    if (theme.textSecondary) root.style.setProperty('--theme-text-secondary', theme.textSecondary);
                    if (theme.textMuted) root.style.setProperty('--theme-text-muted', theme.textMuted);
                    // Border colors
                    if (theme.borderColor) root.style.setProperty('--theme-border', theme.borderColor);
                    if (theme.borderHover) root.style.setProperty('--theme-border-hover', theme.borderHover);
                    // Header
                    if (theme.headerBg) root.style.setProperty('--theme-header-bg', theme.headerBg);
                    if (theme.headerText) root.style.setProperty('--theme-header-text', theme.headerText);
                    if (theme.headerBorder) root.style.setProperty('--theme-header-border', theme.headerBorder);
                    // Input
                    if (theme.inputBg) root.style.setProperty('--theme-input-bg', theme.inputBg);
                    if (theme.inputBorder) root.style.setProperty('--theme-input-border', theme.inputBorder);
                    if (theme.inputFocus) root.style.setProperty('--theme-input-focus', theme.inputFocus);
                    if (theme.inputText) root.style.setProperty('--theme-input-text', theme.inputText);
                    if (theme.inputPlaceholder) root.style.setProperty('--theme-input-placeholder', theme.inputPlaceholder);
                    // Modal
                    if (theme.modalBg) root.style.setProperty('--theme-modal-bg', theme.modalBg);
                    if (theme.overlayBg) root.style.setProperty('--theme-overlay-bg', theme.overlayBg);
                    // Shadow
                    if (theme.shadowColor) root.style.setProperty('--theme-shadow', theme.shadowColor);
                    // Status colors
                    if (theme.successColor) root.style.setProperty('--theme-success', theme.successColor);
                    if (theme.warningColor) root.style.setProperty('--theme-warning', theme.warningColor);
                    if (theme.errorColor) root.style.setProperty('--theme-error', theme.errorColor);
                    if (theme.infoColor) root.style.setProperty('--theme-info', theme.infoColor);
                    console.log('[Theme] Applied cached theme for', subAccountId);
                }
            } catch (e) {
                console.warn('[Theme] Failed to apply cached theme:', e);
            }
        }
    }["ThemeScript.useLayoutEffect"], [
        subAccountId
    ]);
    return null;
}
_s(ThemeScript, "n7/vCynhJvM+pLkyL2DMQUF0odM=");
_c = ThemeScript;
function useThemeCache(subAccountId, theme, isLoading) {
    _s1();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useThemeCache.useEffect": ()=>{
            if (!isLoading && theme && theme.subAccountId !== 'default') {
                try {
                    localStorage.setItem(`risivo_theme_${subAccountId}`, JSON.stringify(theme));
                    localStorage.setItem(`risivo_theme_${subAccountId}_timestamp`, Date.now().toString());
                    console.log('[Theme] Cached theme for', subAccountId);
                } catch (e) {
                    console.warn('[Theme] Failed to cache theme:', e);
                }
            }
        }
    }["useThemeCache.useEffect"], [
        theme,
        isLoading,
        subAccountId
    ]);
}
_s1(useThemeCache, "OD7bBpZva5O2jO+Puf00hKivP7c=");
var _c;
__turbopack_context__.k.register(_c, "ThemeScript");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/sub-account/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SubAccountLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAiChat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAiChat.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2f$MessageBubble$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai/MessageBubble.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2f$TypingIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai/TypingIndicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTheme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useTheme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$DynamicFavicon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme/DynamicFavicon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$ThemeInitializer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme/ThemeInitializer.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
// Mock addon subscriptions for this sub-account
const subAccountAddons = [
    {
        id: 'addon-power-dialer',
        name: 'Power Dialer',
        isActive: true
    },
    {
        id: 'addon-ai-tools',
        name: 'AI Tools Pro',
        isActive: true
    },
    {
        id: 'addon-social-planner',
        name: 'Social Planner',
        isActive: false
    }
];
// Check if addon is active
const hasAddon = (addonId)=>{
    const addon = subAccountAddons.find((a)=>a.id === addonId);
    return addon?.isActive ?? false;
};
// Risivo Hub Sub-Account ID - This is the core/master sub-account that has Platform Admin access
const RISIVO_HUB_SUB_ACCOUNT_ID = 'sub-001';
// Mock Sub-Account Data (Risivo Hub - Master Sub-Account)
// NOTE: Colors are now managed via CSS variables from the theme system
const currentSubAccount = {
    id: 'sub-001',
    name: 'Risivo Hub',
    type: 'Master',
    companyId: 'comp-001',
    companyName: 'Risivo',
    logo: '/risivo-logo.png',
    isRisivoHub: true
};
// Mock user data - to determine if user is company admin
const currentUser = {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@risivo.com',
    role: 'Sub-Account Owner',
    isCompanyAdmin: true
};
// Mock Users for this sub-account only
const subAccountUsers = [
    {
        id: 'user-001',
        name: 'John Smith',
        email: 'john.smith@risivo.com',
        role: 'Sub-Account Owner',
        status: 'Active',
        lastLogin: '2024-12-18 12:15'
    },
    {
        id: 'user-002',
        name: 'Sarah Johnson',
        email: 'sarah@risivo.com',
        role: 'Admin',
        status: 'Active',
        lastLogin: '2024-12-18 10:00'
    },
    {
        id: 'user-003',
        name: 'Mike Williams',
        email: 'mike@risivo.com',
        role: 'Manager',
        status: 'Active',
        lastLogin: '2024-12-18 09:30'
    },
    {
        id: 'user-004',
        name: 'Emily Brown',
        email: 'emily@risivo.com',
        role: 'User',
        status: 'Active',
        lastLogin: '2024-12-18 11:20'
    },
    {
        id: 'user-005',
        name: 'David Lee',
        email: 'david@risivo.com',
        role: 'User',
        status: 'Active',
        lastLogin: '2024-12-17 16:45'
    }
];
// Logo component - uses theme.logoUrl directly (no localStorage during SSR)
function LogoDisplay({ logoUrl, fallbackUrl, altText }) {
    // Always use the same initial value for SSR and client to avoid hydration mismatch
    const displayUrl = logoUrl || fallbackUrl;
    // Use img for data URLs, Image for regular URLs
    if (displayUrl?.startsWith('data:')) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: displayUrl,
            alt: altText,
            className: "h-8 w-auto max-w-[150px] object-contain"
        }, void 0, false, {
            fileName: "[project]/app/sub-account/layout.tsx",
            lineNumber: 95,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        src: displayUrl,
        alt: altText,
        width: 150,
        height: 34,
        className: "h-8 w-auto",
        priority: true
    }, void 0, false, {
        fileName: "[project]/app/sub-account/layout.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_c = LogoDisplay;
function SubAccountLayout({ children }) {
    _s();
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAccountSwitcher, setShowAccountSwitcher] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showUserMenu, setShowUserMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHelpPanel, setShowHelpPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showLoginAsModal, setShowLoginAsModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [subAccountSearch, setSubAccountSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loginAsSearch, setLoginAsSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showChecklistModal, setShowChecklistModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showChatbot, setShowChatbot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPowerDialerDropdown, setShowPowerDialerDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasAssignedCampaigns, setHasAssignedCampaigns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true) // Mock: set to true to show blinking
    ;
    const [powerDialerClicked, setPowerDialerClicked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false) // Stops blinking after click
    ;
    const hasPowerDialerAddon = hasAddon('addon-power-dialer');
    const [showRobotPopup, setShowRobotPopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false) // No popup anymore, chatbot is in header
    ;
    const [chatMessage, setChatMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const messagesContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Theme Integration - Auto-applies CSS variables to document
    const { theme, isLoading: themeLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTheme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])({
        subAccountId: currentSubAccount.id,
        autoApply: true
    });
    // Cache theme to localStorage for instant loading on next visit
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$ThemeInitializer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeCache"])(currentSubAccount.id, theme, themeLoading);
    // AI Chat Integration
    const { messages, isLoading, error, sendMessage, clearMessages } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAiChat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAiChat"])({
        subAccountId: currentSubAccount.id,
        userId: currentUser.id,
        onError: {
            "SubAccountLayout.useAiChat": (err)=>console.error('AI Chat error:', err)
        }["SubAccountLayout.useAiChat"]
    });
    // Auto-scroll to bottom when new messages arrive
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SubAccountLayout.useEffect": ()=>{
            if (showChatbot && messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
        }
    }["SubAccountLayout.useEffect"], [
        messages,
        isLoading,
        showChatbot
    ]);
    // Onboarding checklist tasks (sub-account specific)
    const [checklistTasks, setChecklistTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: 1,
            title: 'Complete sub-account profile',
            description: 'Add logo, name, and details',
            completed: false,
            required: true
        },
        {
            id: 2,
            title: 'Add team members',
            description: 'Invite at least one team member',
            completed: true,
            required: true
        },
        {
            id: 3,
            title: 'Set up lead engine',
            description: 'Configure your lead capture settings',
            completed: false,
            required: true
        },
        {
            id: 4,
            title: 'Configure AI chatbot',
            description: 'Customize your AI assistant settings',
            completed: false,
            required: true
        },
        {
            id: 5,
            title: 'Connect calendar',
            description: 'Sync your calendar for appointments',
            completed: false,
            required: true
        },
        {
            id: 6,
            title: 'Explore conversations',
            description: 'Visit conversations to see communication tools',
            completed: true,
            required: false
        },
        {
            id: 7,
            title: 'Set up payment methods',
            description: 'Add payment options for clients',
            completed: false,
            required: false
        }
    ]);
    const totalRequired = checklistTasks.filter((t)=>t.required).length;
    const completedRequired = checklistTasks.filter((t)=>t.required && t.completed).length;
    const allRequiredCompleted = completedRequired === totalRequired;
    const checklistProgress = Math.round(completedRequired / totalRequired * 100);
    const handleToggleTask = (taskId)=>{
        setChecklistTasks((prev)=>prev.map((task)=>task.id === taskId ? {
                    ...task,
                    completed: !task.completed
                } : task));
    };
    const handleOpenChatbot = ()=>{
        setShowChatbot(true);
    };
    // Determine if current sub-account is Risivo Hub (has Platform Admin access)
    const isRisivoHub = currentSubAccount.id === RISIVO_HUB_SUB_ACCOUNT_ID || currentSubAccount.isRisivoHub;
    // Complete Sub-Account Navigation Structure
    // Based on CLIENT_SUBACCOUNT_MENU_STRUCTURE.md documentation
    // Note: Social Command and PPC Ads are INSIDE Marketing as tabs, not separate menu items
    const navigation = [
        {
            name: 'Dashboard',
            href: '/sub-account/dashboard',
            icon: '📊'
        },
        {
            name: 'Conversations',
            href: '/sub-account/conversations',
            icon: '💬'
        },
        {
            name: 'Calendars',
            href: '/sub-account/calendars',
            icon: '📅'
        },
        {
            name: 'Contacts',
            href: '/sub-account/contacts',
            icon: '👥'
        },
        {
            name: 'Lead Engine',
            href: '/sub-account/lead-engine',
            icon: '🎯'
        },
        {
            name: 'Revenue Engine',
            href: '/sub-account/revenue-engine',
            icon: '💰'
        },
        {
            name: 'AI Tools',
            href: '/sub-account/ai-tools',
            icon: '🤖'
        },
        {
            name: 'Project Management',
            href: '/sub-account/project-management',
            icon: '📋'
        },
        {
            name: 'Marketing',
            href: '/sub-account/marketing',
            icon: '📣'
        },
        {
            name: 'Accelerators',
            href: '/sub-account/accelerators',
            icon: '⚡'
        },
        {
            name: 'Digital Hub',
            href: '/sub-account/digital-hub',
            icon: '🌐'
        },
        {
            name: 'Memberships',
            href: '/sub-account/memberships',
            icon: '🎓'
        },
        {
            name: 'Media Vault',
            href: '/sub-account/media-vault',
            icon: '🗄️'
        },
        {
            name: 'Reputation',
            href: '/sub-account/reputation',
            icon: '⭐'
        },
        {
            name: 'Reporting',
            href: '/sub-account/reporting',
            icon: '📈'
        },
        {
            name: 'Addon Store',
            href: '/sub-account/addon-store',
            icon: '🛒'
        },
        {
            name: 'Settings',
            href: '/sub-account/settings',
            icon: '⚙️'
        }
    ];
    // Platform Admin Navigation - Only visible for Risivo Hub
    // These replace the separate /admin/* and /super-admin/* routes
    const platformAdminNavigation = [
        {
            name: 'Platform Overview',
            href: '/sub-account/platform-admin',
            icon: '👑'
        },
        {
            name: 'Agencies',
            href: '/sub-account/platform-admin/agencies',
            icon: '🏢'
        },
        {
            name: 'Clients',
            href: '/sub-account/platform-admin/clients',
            icon: '🏪'
        },
        {
            name: 'Users',
            href: '/sub-account/platform-admin/users',
            icon: '👤'
        },
        {
            name: 'Staff',
            href: '/sub-account/platform-admin/staff',
            icon: '💼'
        },
        {
            name: 'Support Tickets',
            href: '/sub-account/platform-admin/support',
            icon: '🎫'
        },
        {
            name: 'Newsletters',
            href: '/sub-account/platform-admin/newsletters',
            icon: '📧'
        },
        {
            name: 'Platform Settings',
            href: '/sub-account/platform-admin/settings',
            icon: '⚙️'
        }
    ];
    // Filter users based on search (only within this sub-account)
    const filteredSubAccountUsers = subAccountUsers.filter((user)=>user.name.toLowerCase().includes(loginAsSearch.toLowerCase()) || user.email.toLowerCase().includes(loginAsSearch.toLowerCase()));
    // Handle Login As
    const handleLoginAs = (user)=>{
        console.log('Admin logging in as:', user);
        setShowLoginAsModal(false);
        setLoginAsSearch('');
    // TODO: Implement actual login as functionality
    };
    // Handle jump to sub-account
    const handleJumpToSubAccount = (subAccountId)=>{
        console.log('Jumping to sub-account:', subAccountId);
        setShowAccountSwitcher(false);
    // TODO: Navigate to sub-account dashboard
    };
    // Close modals
    const handleCloseAccountSwitcher = ()=>{
        setShowAccountSwitcher(false);
        setTimeout(()=>{
            setSubAccountSearch('');
        }, 300);
    };
    const handleCloseLoginAsModal = ()=>{
        setShowLoginAsModal(false);
        setTimeout(()=>{
            setLoginAsSearch('');
        }, 300);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen",
        style: {
            backgroundColor: 'var(--theme-background)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$DynamicFavicon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicFavicon"], {
                faviconUrl: theme.faviconUrl,
                fallbackUrl: "/risivo-favicon.png"
            }, void 0, false, {
                fileName: "[project]/app/sub-account/layout.tsx",
                lineNumber: 268,
                columnNumber: 7
            }, this),
            sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-40 lg:hidden",
                style: {
                    backgroundColor: 'var(--theme-overlay-bg)'
                },
                onClick: ()=>setSidebarOpen(false)
            }, void 0, false, {
                fileName: "[project]/app/sub-account/layout.tsx",
                lineNumber: 275,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `,
                style: {
                    backgroundColor: 'var(--theme-sidebar-bg)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col h-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center px-4 py-4",
                            style: {
                                borderBottom: '1px solid var(--theme-sidebar-hover)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LogoDisplay, {
                                    logoUrl: theme.logoUrl,
                                    fallbackUrl: currentSubAccount.logo,
                                    altText: currentSubAccount.name
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 295,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium mt-2 text-center",
                                    style: {
                                        color: 'var(--theme-sidebar-text)',
                                        opacity: 0.8
                                    },
                                    children: currentSubAccount.name
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 300,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 293,
                            columnNumber: 11
                        }, this),
                        currentUser.isCompanyAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-3 border-b border-white/20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowAccountSwitcher(true),
                                className: "w-full flex items-center justify-between px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/80 text-sm",
                                                children: "🏪"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 313,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-left",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-white text-sm font-medium",
                                                        children: currentSubAccount.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 315,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-white/70 text-xs",
                                                        children: "Switch to Company"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 316,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 314,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 312,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4 text-white/70",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M8 7h12M8 12h12m-7 5h7"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 320,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 319,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 308,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 307,
                            columnNumber: 13
                        }, this),
                        !currentUser.isCompanyAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-3 border-b border-white/20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white/80 text-sm",
                                        children: "🏪"
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 330,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white text-sm font-medium",
                                                children: currentSubAccount.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 332,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white/70 text-xs",
                                                children: [
                                                    currentSubAccount.type,
                                                    " • ",
                                                    subAccountUsers.length,
                                                    " users"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 333,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 331,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 329,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 328,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex-1 px-4 py-6 space-y-1.5 overflow-y-auto",
                            children: [
                                navigation.map((item)=>{
                                    const isActive = pathname === item.href;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all font-poppins",
                                        style: {
                                            backgroundColor: isActive ? 'var(--theme-sidebar-active)' : 'transparent',
                                            color: isActive ? 'var(--theme-sidebar-active-foreground)' : 'var(--theme-sidebar-text)',
                                            boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                                        },
                                        onMouseEnter: (e)=>{
                                            if (!isActive) {
                                                e.currentTarget.style.backgroundColor = 'var(--theme-sidebar-hover)';
                                            }
                                        },
                                        onMouseLeave: (e)=>{
                                            if (!isActive) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }
                                        },
                                        onClick: ()=>setSidebarOpen(false),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg flex-shrink-0 w-5 inline-flex items-center justify-center",
                                                children: item.icon
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 365,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "leading-tight flex-1",
                                                children: item.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 366,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, item.name, true, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 344,
                                        columnNumber: 17
                                    }, this);
                                }),
                                isRisivoHub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "my-4 pt-4",
                                            style: {
                                                borderTop: '1px solid var(--theme-sidebar-hover)'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold uppercase tracking-wider px-3",
                                                style: {
                                                    color: 'var(--theme-sidebar-text)',
                                                    opacity: 0.6
                                                },
                                                children: "👑 Platform Admin"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 376,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 375,
                                            columnNumber: 17
                                        }, this),
                                        platformAdminNavigation.map((item)=>{
                                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                className: "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all font-poppins",
                                                style: {
                                                    backgroundColor: isActive ? 'var(--theme-sidebar-active)' : 'transparent',
                                                    color: isActive ? 'var(--theme-sidebar-active-foreground)' : 'var(--theme-sidebar-text)',
                                                    boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                                                },
                                                onMouseEnter: (e)=>{
                                                    if (!isActive) {
                                                        e.currentTarget.style.backgroundColor = 'var(--theme-sidebar-hover)';
                                                    }
                                                },
                                                onMouseLeave: (e)=>{
                                                    if (!isActive) {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                    }
                                                },
                                                onClick: ()=>setSidebarOpen(false),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-lg flex-shrink-0 w-5 inline-flex items-center justify-center",
                                                        children: item.icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 409,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "leading-tight flex-1",
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 410,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, item.name, true, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 388,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 340,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4",
                            style: {
                                borderTop: '1px solid var(--theme-sidebar-hover)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 px-4 py-3 rounded-lg",
                                style: {
                                    backgroundColor: 'var(--theme-sidebar-hover)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                                        style: {
                                            backgroundColor: 'var(--theme-sidebar-active)',
                                            color: 'var(--theme-sidebar-active-foreground)'
                                        },
                                        children: "JS"
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 421,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium truncate",
                                                style: {
                                                    color: 'var(--theme-sidebar-text)'
                                                },
                                                children: "John Smith"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 428,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs truncate",
                                                style: {
                                                    color: 'var(--theme-sidebar-text)',
                                                    opacity: 0.7
                                                },
                                                children: "Company Owner"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 429,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 427,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{},
                                        className: "transition-colors",
                                        style: {
                                            color: 'var(--theme-sidebar-text)',
                                            opacity: 0.7
                                        },
                                        title: "Sign Out",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 438,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 437,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 431,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 420,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 419,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/sub-account/layout.tsx",
                    lineNumber: 291,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/sub-account/layout.tsx",
                lineNumber: 283,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:pl-64 flex flex-col min-h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "sticky top-0 z-30 shadow-sm",
                        style: {
                            backgroundColor: 'var(--theme-header-bg)',
                            borderBottom: '1px solid var(--theme-header-border)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100",
                                    onClick: ()=>setSidebarOpen(true),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M4 6h16M4 12h16M4 18h16"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 464,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 463,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 458,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 max-w-2xl mx-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "h-5 w-5 text-gray-400",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 473,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 472,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 471,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "search",
                                                placeholder: "Search...",
                                                className: "block w-full pl-10 pr-3 py-2 rounded-lg leading-5 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm",
                                                style: {
                                                    backgroundColor: 'var(--theme-input-bg)',
                                                    border: '1px solid var(--theme-input-border)',
                                                    color: 'var(--theme-input-text)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 476,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 470,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 469,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        !allRequiredCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowChecklistModal(true),
                                            className: "relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg",
                                            title: "Onboarding Checklist",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: `w-6 h-6 ${!allRequiredCompleted ? 'animate-pulse text-green-600' : ''}`,
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 499,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 498,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-bold",
                                                    children: [
                                                        completedRequired,
                                                        "/",
                                                        totalRequired
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 501,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 493,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        if (hasPowerDialerAddon) {
                                                            setPowerDialerClicked(true);
                                                            setShowPowerDialerDropdown(!showPowerDialerDropdown);
                                                        } else {
                                                            setShowPowerDialerDropdown(!showPowerDialerDropdown);
                                                        }
                                                    },
                                                    className: `relative p-2 rounded-lg transition-all ${hasPowerDialerAddon ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50' : 'text-gray-300 hover:text-gray-400 hover:bg-gray-100'}`,
                                                    title: hasPowerDialerAddon ? 'Power Dialer' : 'Power Dialer (Addon Required)',
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: `w-6 h-6 ${hasPowerDialerAddon && hasAssignedCampaigns && !powerDialerClicked ? 'text-blue-600 animate-pulse' : ''}`,
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 531,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 526,
                                                            columnNumber: 19
                                                        }, this),
                                                        hasPowerDialerAddon && hasAssignedCampaigns && !powerDialerClicked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 535,
                                                            columnNumber: 21
                                                        }, this),
                                                        hasPowerDialerAddon && hasAssignedCampaigns && !powerDialerClicked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 538,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 509,
                                                    columnNumber: 17
                                                }, this),
                                                showPowerDialerDropdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50",
                                                    children: hasPowerDialerAddon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "px-4 py-2 border-b border-gray-100",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "font-semibold text-gray-900 flex items-center gap-2",
                                                                        children: [
                                                                            "📞 Power Dialer",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full",
                                                                                children: "Active"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                                lineNumber: 550,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 548,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-gray-500 mt-1",
                                                                        children: "Quick access to your dialing campaigns"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 552,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 547,
                                                                columnNumber: 25
                                                            }, this),
                                                            hasAssignedCampaigns ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "px-4 py-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-blue-600 font-medium mb-2",
                                                                                children: "📢 You have campaigns waiting"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                                lineNumber: 557,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "space-y-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "p-2 bg-blue-50 rounded-lg text-sm",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "font-medium text-gray-900",
                                                                                                children: "Q4 Sales Outreach"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                                                lineNumber: 560,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "text-xs text-gray-500",
                                                                                                children: "23 contacts remaining"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                                                lineNumber: 561,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                                        lineNumber: 559,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "p-2 bg-gray-50 rounded-lg text-sm",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "font-medium text-gray-900",
                                                                                                children: "Follow-up Campaign"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                                                lineNumber: 564,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "text-xs text-gray-500",
                                                                                                children: "8 contacts remaining"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                                                lineNumber: 565,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                                        lineNumber: 563,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                                lineNumber: 558,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 556,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "px-4 py-2 border-t border-gray-100",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                            href: "/sub-account/conversations/power-dialer",
                                                                            onClick: ()=>setShowPowerDialerDropdown(false),
                                                                            className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium",
                                                                            children: "🎧 Open Power Dialer"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                                            lineNumber: 570,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 569,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "px-4 py-4 text-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-gray-500 text-sm mb-3",
                                                                        children: "No active campaigns"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 581,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                        href: "/sub-account/conversations/power-dialer",
                                                                        onClick: ()=>setShowPowerDialerDropdown(false),
                                                                        className: "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium",
                                                                        children: "➕ Create Campaign"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 582,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 580,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "px-4 py-4 text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-6 h-6 text-gray-400",
                                                                    fill: "none",
                                                                    viewBox: "0 0 24 24",
                                                                    stroke: "currentColor",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 596,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                                    lineNumber: 595,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 594,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "font-semibold text-gray-900 mb-1",
                                                                children: "Power Dialer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 599,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-500 mb-4",
                                                                children: "Unlock automated outbound calling with the Power Dialer addon."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 600,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: "/sub-account/addon-store?addon=power-dialer",
                                                                onClick: ()=>setShowPowerDialerDropdown(false),
                                                                className: "inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium",
                                                                children: "🔓 Subscribe Now"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 603,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-gray-400 mt-2",
                                                                children: "Starting at $49/month"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 610,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 593,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 544,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 508,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-6 h-6",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 620,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 619,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 622,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 618,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowHelpPanel(true),
                                            className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg",
                                            title: "Help & Knowledge Base",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-6 h-6",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 632,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 631,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 626,
                                            columnNumber: 15
                                        }, this),
                                        !showChatbot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleOpenChatbot,
                                            className: "p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors relative",
                                            title: "AI Assistant",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xl",
                                                    children: "🤖"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 643,
                                                    columnNumber: 19
                                                }, this),
                                                showRobotPopup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 645,
                                                    columnNumber: 21
                                                }, this),
                                                showRobotPopup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 648,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 638,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowUserMenu(!showUserMenu),
                                                    className: "hidden sm:flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold",
                                                            children: "JS"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 659,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-4 h-4 text-gray-400",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M19 9l-7 7-7-7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 663,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 662,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 655,
                                                    columnNumber: 17
                                                }, this),
                                                showUserMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2",
                                                            onClick: ()=>{
                                                                setShowLoginAsModal(true);
                                                                setShowUserMenu(false);
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-4 h-4",
                                                                    fill: "none",
                                                                    viewBox: "0 0 24 24",
                                                                    stroke: "currentColor",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 678,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                                    lineNumber: 677,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Login As..."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 670,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                                            className: "my-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 682,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2",
                                                            onClick: ()=>{},
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-4 h-4",
                                                                    fill: "none",
                                                                    viewBox: "0 0 24 24",
                                                                    stroke: "currentColor",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 688,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                                    lineNumber: 687,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Log Out"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 683,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 669,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 654,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 490,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 456,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/sub-account/layout.tsx",
                        lineNumber: 449,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 p-4 sm:p-6 lg:p-8",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/app/sub-account/layout.tsx",
                        lineNumber: 700,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/sub-account/layout.tsx",
                lineNumber: 447,
                columnNumber: 7
            }, this),
            showAccountSwitcher && currentUser.isCompanyAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl shadow-2xl w-full max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold text-gray-900",
                                    children: "Switch Account"
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 711,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCloseAccountSwitcher,
                                    className: "text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M6 18L18 6M6 6l12 12"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 717,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 716,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 712,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 710,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-2 border-blue-500 rounded-lg p-4 bg-blue-50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg",
                                                children: "🏪"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 727,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold text-gray-900",
                                                        children: currentSubAccount.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 731,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-600",
                                                        children: [
                                                            currentSubAccount.type,
                                                            " • Current"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 732,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 730,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full",
                                                children: "Active"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 734,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 726,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 725,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/company/dashboard",
                                    className: "block border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 hover:bg-green-50 transition-all",
                                    onClick: ()=>setShowAccountSwitcher(false),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white text-lg",
                                                children: "🏢"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 747,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold text-gray-900",
                                                        children: currentSubAccount.companyName
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 751,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-600",
                                                        children: "Company Dashboard"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 752,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 750,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-gray-400",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M9 5l7 7-7 7"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 755,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 754,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 746,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 741,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 723,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-600 text-center",
                                children: "You're a company admin, so you can switch between accounts"
                            }, void 0, false, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 763,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 762,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/sub-account/layout.tsx",
                    lineNumber: 708,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/sub-account/layout.tsx",
                lineNumber: 707,
                columnNumber: 9
            }, this),
            showLoginAsModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold text-gray-900",
                                    children: "Login As User"
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 777,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCloseLoginAsModal,
                                    className: "text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M6 18L18 6M6 6l12 12"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 783,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 782,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 778,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 776,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-b border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "h-5 w-5 text-gray-400",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 793,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 792,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 791,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "search",
                                            placeholder: "Search users by name or email...",
                                            value: loginAsSearch,
                                            onChange: (e)=>setLoginAsSearch(e.target.value),
                                            className: "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
                                            autoFocus: true
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 796,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 790,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500 mt-2",
                                    children: [
                                        filteredSubAccountUsers.length,
                                        " user",
                                        filteredSubAccountUsers.length === 1 ? '' : 's',
                                        " found in ",
                                        currentSubAccount.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 805,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 789,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto p-6",
                            children: filteredSubAccountUsers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center py-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "mx-auto h-12 w-12 text-gray-400",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 815,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 814,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-4 text-sm text-gray-500",
                                        children: [
                                            'No users found matching "',
                                            loginAsSearch,
                                            '"'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 817,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 813,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: filteredSubAccountUsers.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:bg-green-50 transition-all",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0",
                                                                    children: user.name.split(' ').map((n)=>n[0]).join('')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                                    lineNumber: 829,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1 min-w-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "font-semibold text-gray-900",
                                                                            children: user.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                                            lineNumber: 833,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-gray-600",
                                                                            children: user.email
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                                            lineNumber: 834,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                                    lineNumber: 832,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : user.role === 'Manager' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`,
                                                                    children: user.role
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                                    lineNumber: 836,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 828,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-3 space-y-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-4 text-xs text-gray-400 mt-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "ID: ",
                                                                            user.id
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 846,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 847,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "Last login: ",
                                                                            user.lastLogin
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 848,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 849,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: user.status === 'Active' ? 'text-green-600 font-medium' : 'text-gray-400',
                                                                        children: user.status
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                                        lineNumber: 850,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 845,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 844,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 827,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleLoginAs(user),
                                                    className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors whitespace-nowrap",
                                                    children: "Login As"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 856,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 826,
                                            columnNumber: 23
                                        }, this)
                                    }, user.id, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 822,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 820,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 811,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between text-sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-600",
                                            children: [
                                                "Select a user within ",
                                                currentSubAccount.name,
                                                " to login as"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 873,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 mt-1",
                                            children: "⚠️ Your admin session will be preserved and you can return anytime"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 876,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 872,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 871,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 870,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/sub-account/layout.tsx",
                    lineNumber: 774,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/sub-account/layout.tsx",
                lineNumber: 773,
                columnNumber: 9
            }, this),
            showHelpPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-black/30 z-40",
                        onClick: ()=>setShowHelpPanel(false)
                    }, void 0, false, {
                        fileName: "[project]/app/sub-account/layout.tsx",
                        lineNumber: 889,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 flex flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between p-6 border-b border-gray-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-gray-900",
                                        children: "Help & Support"
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 896,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowHelpPanel(false),
                                        className: "text-gray-400 hover:text-gray-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-6 h-6",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 902,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 901,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 897,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 895,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 border-b border-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "search",
                                            placeholder: "Search help articles...",
                                            className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 910,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "h-4 w-4 text-gray-400",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 917,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 916,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 915,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 909,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 908,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto p-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-semibold text-gray-900 mb-3",
                                                    children: "Quick Start"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 927,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: "#",
                                                                className: "text-green-600 hover:text-green-800 text-sm",
                                                                children: "Getting Started with RISIVO"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 930,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 929,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: "#",
                                                                className: "text-green-600 hover:text-green-800 text-sm",
                                                                children: "Managing Sub-Accounts"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 933,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 932,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: "#",
                                                                className: "text-green-600 hover:text-green-800 text-sm",
                                                                children: "Lead Engine Guide"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 936,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 935,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 928,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 926,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-semibold text-gray-900 mb-3",
                                                    children: "AI Features"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 942,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: "#",
                                                                className: "text-green-600 hover:text-green-800 text-sm",
                                                                children: "AI Translation Guide"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 945,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 944,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: "#",
                                                                className: "text-green-600 hover:text-green-800 text-sm",
                                                                children: "Content Generation"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 948,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 947,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: "#",
                                                                className: "text-green-600 hover:text-green-800 text-sm",
                                                                children: "Chatbot Setup"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 951,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 950,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 943,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 941,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-semibold text-gray-900 mb-3",
                                                    children: "Support"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 957,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: "#",
                                                                className: "text-green-600 hover:text-green-800 text-sm",
                                                                children: "Contact Support"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 960,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 959,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: "#",
                                                                className: "text-green-600 hover:text-green-800 text-sm",
                                                                children: "Submit a Ticket"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 963,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 962,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: "#",
                                                                className: "text-green-600 hover:text-green-800 text-sm",
                                                                children: "Video Tutorials"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 966,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/sub-account/layout.tsx",
                                                            lineNumber: 965,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 958,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 956,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 925,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 924,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 border-t border-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium",
                                    children: "Contact Support Team"
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 975,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 974,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/sub-account/layout.tsx",
                        lineNumber: 893,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            showChecklistModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-gray-900",
                                            children: "Onboarding Checklist"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 990,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600 mt-1",
                                            children: "Complete these tasks to get started"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 991,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 989,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowChecklistModal(false),
                                    className: "text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M6 18L18 6M6 6l12 12"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 998,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 997,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 993,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 988,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 py-4 bg-gray-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-medium text-gray-700",
                                            children: "Progress"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 1006,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-bold text-green-600",
                                            children: [
                                                checklistProgress,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 1007,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 1005,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full bg-gray-200 rounded-full h-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-green-600 h-2 rounded-full transition-all duration-300",
                                        style: {
                                            width: `${checklistProgress}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1010,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 1009,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-600 mt-2",
                                    children: [
                                        completedRequired,
                                        " of ",
                                        totalRequired,
                                        " required tasks completed"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 1015,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 1004,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-3",
                            children: checklistTasks.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `p-4 border-2 rounded-lg transition-all ${task.completed ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200 hover:border-green-300'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleToggleTask(task.id),
                                                className: `flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-green-600 border-green-600' : 'border-gray-300 hover:border-green-500'}`,
                                                children: task.completed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-4 h-4 text-white",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 3,
                                                        d: "M5 13l4 4L19 7"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 1042,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 1041,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 1032,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: `font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`,
                                                                children: task.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 1048,
                                                                columnNumber: 25
                                                            }, this),
                                                            task.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full",
                                                                children: "Required"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                                lineNumber: 1052,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 1047,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600 mt-1",
                                                        children: task.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 1057,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 1046,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1031,
                                        columnNumber: 19
                                    }, this)
                                }, task.id, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 1023,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 1021,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg",
                            children: allRequiredCompleted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-green-600 font-semibold mb-2",
                                        children: "🎉 All required tasks completed!"
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1068,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "You're all set to start using RISIVO CRM"
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1069,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 1067,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600 text-center",
                                children: "Complete all required tasks to unlock the full experience"
                            }, void 0, false, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 1072,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 1065,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/sub-account/layout.tsx",
                    lineNumber: 986,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/sub-account/layout.tsx",
                lineNumber: 985,
                columnNumber: 9
            }, this),
            showChatbot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border-2 border-green-300 flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl",
                                        children: "🤖"
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1089,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold",
                                                children: "Sarah - AI Assistant"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 1091,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs opacity-90",
                                                children: "Online • Ready to help"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 1092,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1090,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 1088,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: clearMessages,
                                        className: "text-white hover:bg-white hover:bg-opacity-20 rounded p-1",
                                        title: "Clear conversation",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 1102,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 1101,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1096,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowChatbot(false),
                                        className: "text-white hover:bg-white hover:bg-opacity-20 rounded p-1",
                                        title: "Close chat",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 1111,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 1110,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1105,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 1095,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/sub-account/layout.tsx",
                        lineNumber: 1087,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesContainerRef,
                        className: "flex-1 p-4 overflow-y-auto bg-gray-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                messages.length === 0 && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center justify-center h-full text-center py-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-3xl",
                                                children: "🤖"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 1124,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 1123,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-gray-900 mb-1",
                                            children: "Hi! I'm Sarah"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 1126,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600 mb-4 px-4",
                                            children: "I'm your AI marketing assistant. How can I help you today?"
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 1127,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 gap-2 w-full px-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>sendMessage('Create a pipeline for real estate leads'),
                                                    className: "px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-left text-sm transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-medium text-gray-900",
                                                        children: "Create a pipeline"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 1135,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 1131,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>sendMessage('Add a new contact'),
                                                    className: "px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-left text-sm transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-medium text-gray-900",
                                                        children: "Add contact"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 1141,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 1137,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>sendMessage('Help me set up an automation workflow'),
                                                    className: "px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-left text-sm transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-medium text-gray-900",
                                                        children: "Create workflow"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/sub-account/layout.tsx",
                                                        lineNumber: 1147,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/sub-account/layout.tsx",
                                                    lineNumber: 1143,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 1130,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 1122,
                                    columnNumber: 17
                                }, this),
                                messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2f$MessageBubble$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageBubble"], {
                                        message: message
                                    }, message.id, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1155,
                                        columnNumber: 17
                                    }, this)),
                                isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2f$TypingIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypingIndicator"], {}, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 1159,
                                    columnNumber: 29
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-sm",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 1163,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: messagesEndRef
                                }, void 0, false, {
                                    fileName: "[project]/app/sub-account/layout.tsx",
                                    lineNumber: 1169,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/sub-account/layout.tsx",
                            lineNumber: 1119,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/sub-account/layout.tsx",
                        lineNumber: 1118,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-t border-gray-200 bg-white rounded-b-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
                                        title: "Upload file",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5 text-gray-600",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 1182,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 1181,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1177,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
                                        title: "Voice input",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5 text-gray-600",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 1190,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 1189,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1185,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        className: "hidden",
                                        id: "chatbot-file-upload",
                                        accept: "image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1193,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 1176,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: chatMessage,
                                        onChange: (e)=>setChatMessage(e.target.value),
                                        placeholder: "Type your message...",
                                        className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm",
                                        disabled: isLoading,
                                        onKeyPress: async (e)=>{
                                            if (e.key === 'Enter' && chatMessage.trim() && !isLoading) {
                                                const message = chatMessage;
                                                setChatMessage('');
                                                await sendMessage(message);
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1203,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed",
                                        disabled: !chatMessage.trim() || isLoading,
                                        onClick: async ()=>{
                                            if (chatMessage.trim() && !isLoading) {
                                                const message = chatMessage;
                                                setChatMessage('');
                                                await sendMessage(message);
                                            }
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            }, void 0, false, {
                                                fileName: "[project]/app/sub-account/layout.tsx",
                                                lineNumber: 1230,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/sub-account/layout.tsx",
                                            lineNumber: 1229,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/sub-account/layout.tsx",
                                        lineNumber: 1218,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/sub-account/layout.tsx",
                                lineNumber: 1202,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/sub-account/layout.tsx",
                        lineNumber: 1174,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/sub-account/layout.tsx",
                lineNumber: 1085,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/sub-account/layout.tsx",
        lineNumber: 266,
        columnNumber: 5
    }, this);
}
_s(SubAccountLayout, "WvwJXrd9ahOcJgqDgxU8xpxyB9k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTheme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$ThemeInitializer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeCache"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAiChat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAiChat"]
    ];
});
_c1 = SubAccountLayout;
var _c, _c1;
__turbopack_context__.k.register(_c, "LogoDisplay");
__turbopack_context__.k.register(_c1, "SubAccountLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_f8a7679a._.js.map