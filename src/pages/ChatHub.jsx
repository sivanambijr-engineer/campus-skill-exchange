import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ChatHub = () => {
  const {
    swaps,
    messages,
    currentUser,
    activeChatSwapId,
    setActiveChatSwapId,
    sendMessage
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');

  // -------------------------------------------------------
  // Safety check
  // -------------------------------------------------------

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        Please log in to access your conversations.
      </div>
    );
  }

  // -------------------------------------------------------
  // Only swaps involving the authenticated user
  // -------------------------------------------------------

  const mySwaps = swaps.filter(
    swap =>
      swap.requesterId === currentUser.id ||
      swap.recipientId === currentUser.id
  );

  // -------------------------------------------------------
  // Active conversation
  // -------------------------------------------------------

  const activeSwap =
    mySwaps.find(
      swap => swap.id === activeChatSwapId
    ) || mySwaps[0];

  const activeMessages =
    activeSwap
      ? messages[activeSwap.id] || []
      : [];

  // -------------------------------------------------------
  // Get the OTHER student
  //
  // This is the critical fix.
  // -------------------------------------------------------

  const getOtherUser = (swap) => {
    if (!swap) return null;

    const isRequester =
      swap.requesterId === currentUser.id;

    if (isRequester) {
      return {
        name:
          swap.recipientName ||
          'Student',

        avatar:
          swap.recipientAvatar ||
          ''
      };
    }

    return {
      name:
        swap.requesterName ||
        'Student',

      avatar:
        swap.requesterAvatar ||
        ''
    };
  };

  // -------------------------------------------------------
  // Send message
  // -------------------------------------------------------

  const handleSend = async (e) => {
    e.preventDefault();

    const trimmedMessage = inputMsg.trim();

    if (!trimmedMessage || !activeSwap) {
      return;
    }

    try {
      await sendMessage(
        activeSwap.id,
        trimmedMessage
      );

      setInputMsg('');
    } catch (error) {
      console.error(
        'Failed to send message:',
        error
      );
    }
  };

  return (
    <div className="flex h-full min-h-0">

      {/* ===================================================
          LEFT SIDEBAR
          =================================================== */}

      <div className="w-full md:w-80 border-r border-slate-800 bg-slate-950/60 flex flex-col">

        <div className="p-4 border-b border-slate-800">
          <h2 className="font-display font-bold text-base text-white">
            Active Swap Conversations
          </h2>

          <p className="text-xs text-slate-400">
            Direct chat with your skill partners
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">

          {mySwaps.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No swap conversations yet.
            </div>
          ) : (
            mySwaps.map(swap => {

              const isSelected =
                swap.id === activeChatSwapId;

              const otherUser =
                getOtherUser(swap);

              const swapMessages =
                messages[swap.id] || [];

              const lastMsg =
                swapMessages[
                  swapMessages.length - 1
                ];

              return (
                <div
                  key={swap.id}
                  onClick={() =>
                    setActiveChatSwapId(swap.id)
                  }
                  className={`p-4 cursor-pointer transition-colors flex items-start gap-3 ${
                    isSelected
                      ? 'bg-brand-500/10 border-l-4 border-brand-500'
                      : 'hover:bg-slate-900/60'
                  }`}
                >

                  {/* Avatar */}

                  {otherUser?.avatar ? (
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 flex-shrink-0">
                      {otherUser?.name
                        ?.charAt(0)
                        ?.toUpperCase() || '?'}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center justify-between">

                      <h4 className="font-semibold text-xs text-white truncate">
                        {otherUser?.name || 'Student'}
                      </h4>

                      <span className="text-[10px] text-slate-500">
                        {lastMsg?.timestamp || 'Active'}
                      </span>

                    </div>

                    <p className="text-xs text-brand-400 font-medium truncate mt-0.5">
                      {swap.offeredSkill} ↔ {swap.desiredSkill}
                    </p>

                    <p className="text-xs text-slate-400 truncate mt-1">
                      {lastMsg
                        ? lastMsg.content
                        : 'Tap to open discussion'}
                    </p>

                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>


      {/* ===================================================
          RIGHT CHAT PANE
          =================================================== */}

      {activeSwap ? (

        <div className="flex-1 flex flex-col bg-slate-900/80 min-w-0">

          {(() => {
            const otherUser =
              getOtherUser(activeSwap);

            return (
              <>
                {/* =========================================
                    CHAT HEADER
                    ========================================= */}

                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">

                  <div className="flex items-center gap-3 min-w-0">

                    {otherUser?.avatar ? (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 flex-shrink-0">
                        {otherUser?.name
                          ?.charAt(0)
                          ?.toUpperCase() || '?'}
                      </div>
                    )}

                    <div className="min-w-0">

                      <h3 className="font-display font-bold text-sm text-white truncate">
                        {otherUser?.name || 'Student'}
                      </h3>

                      <p className="text-xs text-emerald-400 font-medium truncate">
                        Meeting: {activeSwap.meetingLocation || 'Not specified'}
                        {' '}
                        ({activeSwap.proposedTime || 'Not specified'})
                      </p>

                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex-shrink-0">
                    {activeSwap.status}
                  </span>

                </div>


                {/* =========================================
                    MESSAGE STREAM
                    ========================================= */}

                <div className="flex-1 p-4 overflow-y-auto space-y-4">

                  <div className="text-center my-4">

                    <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                      🔒 Swap Thread • In-Person meeting scheduled at{' '}
                      {activeSwap.meetingLocation || 'Not specified'}
                    </span>

                  </div>

                  {activeMessages.length === 0 ? (

                    <div className="text-center text-xs text-slate-500 py-8">
                      No messages yet. Start the conversation.
                    </div>

                  ) : (

                    activeMessages.map(msg => {

                      const isMe =
                        String(msg.senderId) ===
                        String(currentUser.id);

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${
                            isMe
                              ? 'items-end'
                              : 'items-start'
                          }`}
                        >

                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              isMe
                                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-br-none shadow-md'
                                : 'glass-card bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                            }`}
                          >

                            <span className="block text-[10px] opacity-75 font-semibold mb-1">
                              {msg.senderName}
                            </span>

                            {msg.content}

                          </div>

                          <span className="text-[10px] text-slate-500 mt-1 px-1">
                            {msg.timestamp}
                          </span>

                        </div>
                      );
                    })
                  )}

                </div>


                {/* =========================================
                    MESSAGE INPUT
                    ========================================= */}

                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-slate-800 flex gap-3 bg-slate-950/60"
                >

                  <input
                    type="text"
                    value={inputMsg}
                    onChange={e =>
                      setInputMsg(e.target.value)
                    }
                    placeholder="Type your message to coordinate swap details..."
                    className="flex-1 glass-input text-xs sm:text-sm text-white rounded-xl px-4 py-3 bg-slate-900"
                  />

                  <button
                    type="submit"
                    disabled={!inputMsg.trim()}
                    className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand-600/30 transition-all"
                  >
                    Send 🚀
                  </button>

                </form>

              </>
            );
          })()}

        </div>

      ) : (

        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          Select a conversation from the left to start messaging.
        </div>

      )}

    </div>
  );
};