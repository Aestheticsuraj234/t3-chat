"use client";
import { useChat } from "@ai-sdk/react";
import { useGetChatById } from "@/modules/chat/hooks/chat";
import { Fragment, useState, useEffect, useMemo, useRef } from "react";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";

import { Spinner } from "@/components/ui/spinner";
import { ModelSelector } from "@/modules/chat/components/model-selector";
import { useAIModels } from "@/modules/ai-agent/hook/ai-agent";
import { useChatStore } from "@/modules/chat/store/chat-store";
import { useSearchParams, useRouter } from "next/navigation";

import { RotateCcwIcon, StopCircleIcon } from "lucide-react";
const MessageWithForm = ({ chatId }) => {
  const { data: models, isPending: isModelLoading } = useAIModels();
  const { data, isPending } = useGetChatById(chatId);
  const { hasChatBeenTriggered, markChatAsTriggered } = useChatStore();

  const [selectedModel, setSelectedModel] = useState(data?.data?.model);
  const [input, setInput] = useState("");


  const hasAutoTriggered = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";




  const initialMessages = useMemo(() => {
    if (!data?.data?.messages) return [];

    return data.data.messages
      .filter((msg) => msg.content && msg.content.trim() !== "" && msg.id)
      .map((msg) => {
        try {
          const parts = JSON.parse(msg.content);

          return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            parts: Array.isArray(parts)
              ? parts
              : [{ type: "text", text: msg.content }],
            createdAt: msg.createdAt,
          };
        } catch (error) {
          return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            parts: [{ type: "text", text: msg.content }],
            createdAt: msg.createdAt,
          };
        }
      });
  }, [data]);

  const { stop, messages, status, sendMessage, regenerate } = useChat({
    initialMessages: [],
    api: "/api/chat",
  });


  useEffect(()=>{
    if(data?.data?.model && !selectedModel){
      setSelectedModel(data.data.model)
    }
  }, [data , selectedModel])

  useEffect(()=>{
    if (hasAutoTriggered.current) return;
    if (!shouldAutoTrigger) return;
    if (hasChatBeenTriggered(chatId)) return;
    if (!selectedModel) return;
    if (initialMessages.length === 0) return;

    const lastMessage = initialMessages[initialMessages.length -1];

    if(lastMessage.role !=="user") return;

    hasAutoTriggered.current = true;
    markChatAsTriggered(chatId)

      sendMessage(
      { text: null },
      {
        body: {
          model: selectedModel,
          chatId,
          skipUserMessage: true,
        },
      }
    );

    router.replace(`/chat/${chatId}` , {scroll:false})
  } , [
    shouldAutoTrigger,
    chatId,
    selectedModel,
    initialMessages,
    markChatAsTriggered,
    hasChatBeenTriggered,
    sendMessage,
    router,
  ])


  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  const handleSubmit = () => {
    if (!input.trim()) return;

    sendMessage(
      { text: input },
      {
        body: {
          model: selectedModel,
          chatId,
        },
      }
    );

    setInput("");
  };

  const handleRetry = () => {
    regenerate();
  };

  const handleStop = () => {
    stop();
  };

  const messageToRender = [...initialMessages, ...messages];

  console.log(messageToRender);

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <Conversation className={"h-full"}>
          <ConversationContent>
            {messageToRender.length === 0 ? (
              <>
                <div className="flex items-center justify-center h-full text-gray-500">
                  Start a coversation...
                </div>
              </>
            ) : (
              messageToRender.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Message
                            from={message.role}
                            key={`${message.id}-${i}`}
                          >
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                        );

                      case "reasoning":
                        return (
                          <Reasoning
                            className="max-w-2xl px-4 py-4 border border-muted rounded-md bg-muted/50"
                            key={`${message.id}-${i}`}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent className="mt-2 italic font-light text-muted-foreground">
                              {part.text}
                            </ReasoningContent>
                          </Reasoning>
                        );
                    }
                  })}
                </Fragment>
              ))
            )}
            {status === "streaming" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner />
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className={"mt-4"}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              // disabled={status === "" }
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools className={"flex items-center gap-2"}>
              {isModelLoading ? (
                <Spinner />
              ) : (
                <ModelSelector
                  models={models?.models}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                />
              )}
              {status === "streaming" ? (
                <PromptInputButton onClick={handleStop}>
                  <StopCircleIcon size={16} />
                  <span>Stop</span>
                </PromptInputButton>
              ) : (
                messageToRender.length > 0 && (
                  <PromptInputButton onClick={handleRetry}>
                    <RotateCcwIcon size={16} />
                    <span>Retry</span>
                  </PromptInputButton>
                )
              )}
            </PromptInputTools>

            <PromptInputSubmit status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default MessageWithForm;
