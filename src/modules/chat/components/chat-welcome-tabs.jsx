import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Code, GraduationCap, Newspaper, Sparkles } from "lucide-react";
import React, { useState } from "react";

const CHAT_TAB_MESSAGE = [
  {
    tabName: "Create",
    icon: <Sparkles className="h-4 w-4" />,
    messages: [
      "Write a short story about a robot discovering emotions",
      "Help me outline a sci-fi novel set in a post-apocalyptic world",
      "Create a character profile for a complex villain with sympathetic motives",
      "Give me 5 creative writing prompts for flash fiction",
    ],
  },
  {
    tabName: "Explore",
    icon: <Newspaper className="h-4 w-4" />,
    messages: [
      "Good books for fans of Rick Rubin",
      "Countries ranked by number of corgis",
      "Most successful companies in the world",
      "How much does Claude cost?",
    ],
  },
  {
    tabName: "Code",
    icon: <Code className="h-4 w-4" />,
    messages: [
      "Write code to invert a binary search tree in Python",
      "What is the difference between Promise.all and Promise.allSettled?",
      "Explain React's useEffect cleanup function",
      "Best practices for error handling in async/await",
    ],
  },
  {
    tabName: "Learn",
    icon: <GraduationCap className="h-4 w-4" />,
    messages: [
      "Beginner's guide to TypeScript",
      "Explain the CAP theorem in distributed systems",
      "Why is AI so expensive?",
      "Are black holes real?",
    ],
  },
];
const ChatWelcomeTabs = ({ userName, onMessageSelect }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-4xl font-semibold">
          How can i help you ,{" "}
          {userName.slice(0, userName.indexOf(" ")) || userName}?
        </h1>

        <div className="flex flex-wrap gap-2 w-full">
          {CHAT_TAB_MESSAGE.map((tab, index) => (
            <Button
              key={tab.tabName}
              variant={activeTab === index ? "default" : "secondary"}
              onClick={() => setActiveTab(index)}
              className="w-[110px] justify-start"
            >
              {tab.icon}
              <span className="ml-2">{tab.tabName}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-3 w-full min-h-[240px]">
          {CHAT_TAB_MESSAGE[activeTab].messages.map((message, index) => (
            <div key={index}>
                <button
                onClick={()=>onMessageSelect(message)}
                   className="w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out py-2"
                >
                    {message}
                </button>
                  {index < CHAT_TAB_MESSAGE[activeTab].messages.length - 1 && (
                <Separator />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWelcomeTabs;
