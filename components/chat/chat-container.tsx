import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatComposer, { type ComposerMode } from '@/components/ui/chat-composer'
import { CHAT_UI } from '@/lib/chat-config'
import { UnifiedMessageContainer } from '@/components/ui/unified-message-container'
import { LAYOUT, ANIMATION } from '@/lib/design-tokens'
import { useChatState } from '@/hooks/use-chat-state' // Import useChatState
import type { Workflow } from '@/lib/workflow-registry' // Import Workflow type

export function ChatContainer({
  className = '',
}: { className?: string }) {
  const [chatState, chatActions] = useChatState();
  const { messages, inputValue, composerMode, isTransitioning, activeWorkflow } = chatState;
  const { setInputValue, addMessage, setComposerMode, startWorkflow, completeWorkflow } = chatActions;

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [messages])

  const handleSendMessage = async () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    addMessage(userMessage, true); // Add user's message to UI immediately
    setInputValue(''); // Clear input
    setComposerMode('transcribing-send'); // Show transcribing state while processing

    try {
      const response = await fetch('/api/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { intent, score } = await response.json();

      // Check if a specific workflow should be triggered
      if (score > 0.7) { // You can adjust this confidence threshold
        startWorkflow(intent); // This will also add the bot's initial message
      } else {
        // Fallback for general questions or low confidence
        addMessage("I'm not sure how to help with that yet. Can you rephrase?", false);
        setComposerMode('idle');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage("Oops! Something went wrong. Please try again.", false);
      setComposerMode('idle');
    }
  };

  const handleEnterSend = () => {
    if (!isTransitioning && inputValue.trim()) {
      handleSendMessage();
    }
  };

  const handleStartRecording = () => {
    // Placeholder for actual recording logic
    setComposerMode('recording');
    addMessage("Recording started... (Placeholder)", false);
  };

  const handleStopRecording = () => {
    // Placeholder for actual recording logic
    setComposerMode('transcribing-stop');
    addMessage("Recording stopped. Transcribing... (Placeholder)", false);
  };

  const handlePickGallery = () => {
    // Placeholder for gallery pick logic
    addMessage("Gallery opened... (Placeholder)", false);
  };

  const disabledComposer = isTransitioning || !!activeWorkflow; // Disable composer if transitioning or workflow is active

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-full ${className}`}
      style={{
        maxHeight: LAYOUT.chat.containerMaxHeight,
      }}
    >
      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto scroll-smooth"
        style={{ padding: LAYOUT.chat.messagesPadding }}
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && !activeWorkflow ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: ANIMATION.duration.normal,
                ease: ANIMATION.timing,
              }}
              className="flex items-center justify-center h-full min-h-[200px]"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--app-primary)]/10 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-[var(--app-primary)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">K</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-[var(--ds-text-primary)] mb-2">
                  Ask Kaira
                </h3>
                <p className="text-sm text-[var(--ds-text-secondary)] max-w-xs">
                  I'm here to help with your health journey. What would you like to know?
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: ANIMATION.duration.normal,
                    ease: ANIMATION.timing,
                    delay: index * 0.05, // Stagger animation
                  }}
                  layout
                >
                  <UnifiedMessageContainer
                    content={message.content}
                    isUser={message.isUser}
                    suggestions={message.suggestions}
                    showSuggestions={message.showSuggestions}
                    // onSuggestionClick={onSuggestionClick} // Removed as it's not used in this context
                    timestamp={message.timestamp}
                  />
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>

        {/* NEW: Render active workflow component */}
        {activeWorkflow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION.duration.normal, ease: ANIMATION.timing }}
            className="mt-4"
          >
            <activeWorkflow.component onComplete={completeWorkflow} />
          </motion.div>
        )}
      </div>

      {/* Chat Composer */}
      <motion.div
        className="flex-shrink-0 relative z-10"
        style={{ padding: LAYOUT.chat.composerPadding }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isTransitioning ? 0.5 : 1, y: 0 }}
        transition={{
          duration: ANIMATION.duration.fast,
          ease: ANIMATION.timing,
        }}
      >
        <ChatComposer
          mode={composerMode}
          value={inputValue}
          onChange={setInputValue}
          onEnterSend={handleEnterSend}
          onSend={handleSendMessage}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          onPickGallery={handlePickGallery}
          // audioData={audioData} // Removed as it's not managed here anymore
          // recordingTime={recordingTime} // Removed as it's not managed here anymore
          disabled={disabledComposer}
          placeholder={CHAT_UI.PLACEHOLDER}
        />
      </motion.div>
    </div>
  )
}
