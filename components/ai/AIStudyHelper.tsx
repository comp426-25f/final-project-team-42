/**
 * AI Study Helper Modal Component
 * Allows users to paste notes to get AI-generated summaries, quizzes, and flashcards
 */

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Brain,
  FileText,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

// Types
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Flashcard {
  front: string;
  back: string;
}

interface AIResult {
  summary?: string;
  quiz?: QuizQuestion[];
  flashcards?: Flashcard[];
}

export default function AIStudyHelper() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AIResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [provider, setProvider] = useState<"openai" | "gemini">("gemini");
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const validateText = (text: string, maxLength: number = 15000) => {
    if (!text || text.trim().length === 0) {
      return {
        valid: false,
        error: "Please provide some text to analyze.",
      };
    }

    if (text.length > maxLength) {
      return {
        valid: false,
        error: `Text exceeds maximum length of ${maxLength} characters.`,
      };
    }

    return { valid: true };
  };

  // Load API key and provider from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProvider = localStorage.getItem("ai_provider") as
        | "openai"
        | "gemini";
      const savedKey = localStorage.getItem(
        `${savedProvider || "gemini"}_api_key`,
      );

      if (savedProvider) {
        setProvider(savedProvider);
      }

      if (savedKey) {
        setApiKey(savedKey);
      } else {
        setShowApiKeyInput(true);
      }
    }
  }, []);

  /**
   * Save API key and provider to localStorage
   */
  const handleSaveApiKey = (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${provider}_api_key`, key);
      localStorage.setItem("ai_provider", provider);
      setApiKey(key);
      setShowApiKeyInput(false);
      setError("");
    }
  };

  /**
   * Clear saved API key
   */
  const handleClearApiKey = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${provider}_api_key`);
      setApiKey("");
      setShowApiKeyInput(true);
    }
  };

  /**
   * Handle provider change
   */
  const handleProviderChange = (newProvider: "openai" | "gemini") => {
    setProvider(newProvider);
    // Load the saved key for the new provider
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem(`${newProvider}_api_key`);
      if (savedKey) {
        setApiKey(savedKey);
        setShowApiKeyInput(false);
      } else {
        setApiKey("");
        setShowApiKeyInput(true);
      }
    }
  };

  /**
   * Submit text to AI API for processing
   */
  const handleSubmit = async (type: "summary" | "quiz" | "flashcards") => {
    // Check if API key is provided
    if (!apiKey || apiKey.trim().length === 0) {
      const providerLabel = provider === "openai" ? "OpenAI" : "Gemini";
      setError(`Please provide your ${providerLabel} API key first`);
      setShowApiKeyInput(true);
      return;
    }

    // Validate text
    const validation = validateText(inputText);
    if (!validation.valid) {
      setError(validation.error || "Invalid text");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          type,
          provider: provider, // Send selected provider
          apiKey: apiKey, // Send user's API key
          options: {
            numQuestions: 5,
            numFlashcards: 10,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      if (data.success && data.data) {
        setResult(data.data);
        setError("");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset the modal to initial state
   */
  const handleReset = () => {
    setInputText("");
    setResult(null);
    setError("");
    setSelectedAnswers({});
    setFlippedCards({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Toggle flashcard flip
   */
  const toggleFlashcard = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Brain className="h-4 w-4" />
          AI Study Helper
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Study Helper
          </DialogTitle>
          <DialogDescription>
            Paste your notes to generate summaries, quiz questions, and
            flashcards
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* API Key Section */}
          {showApiKeyInput ? (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="mb-1 text-sm font-semibold">
                      AI Provider API Key Required
                    </h3>
                    <p className="text-muted-foreground mb-3 text-xs">
                      Choose your AI provider and enter your API key. Your key
                      is stored locally in your browser only.
                    </p>

                    {/* Provider Selection */}
                    <div className="mb-3">
                      <Label className="mb-1 text-xs">Select AI Provider</Label>
                      <Select
                        value={provider}
                        onValueChange={(value) =>
                          handleProviderChange(value as "openai" | "gemini")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini">
                            <div className="flex flex-col items-start">
                              <span className="font-medium">Google Gemini</span>
                              <span className="text-muted-foreground text-xs">
                                FREE - 1,500 requests/day
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="openai">
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                OpenAI GPT-3.5
                              </span>
                              <span className="text-muted-foreground text-xs">
                                Paid - ~$0.002/request
                              </span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* API Key Input */}
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder={
                          provider === "gemini" ? "AIza..." : "sk-proj-..."
                        }
                        value={apiKey}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setApiKey(e.target.value)
                        }
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleSaveApiKey(apiKey)}
                        disabled={!apiKey.trim()}
                        size="sm"
                      >
                        Save Key
                      </Button>
                    </div>

                    {/* Provider-specific instructions */}
                    <p className="text-muted-foreground mt-2 text-xs">
                      {provider === "gemini" ? (
                        <>
                          Get your FREE Gemini key from:{" "}
                          <a
                            href="https://makersuite.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            makersuite.google.com/app/apikey
                          </a>
                        </>
                      ) : (
                        <>
                          Get your OpenAI key from:{" "}
                          <a
                            href="https://platform.openai.com/api-keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            platform.openai.com/api-keys
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800 dark:text-green-200">
                  {provider === "gemini" ? "Gemini" : "OpenAI"} API Key
                  configured ({apiKey.substring(0, 8)}...)
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKeyInput(true)}
                  className="text-xs"
                >
                  Change Provider
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearApiKey}
                  className="text-xs"
                >
                  Change Key
                </Button>
              </div>
            </div>
          )}

          {/* Input Section */}
          {!result && !showApiKeyInput && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="text-input">Paste Your Notes</Label>
                <Textarea
                  id="text-input"
                  placeholder="Paste your study notes here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={10}
                  className="mt-2"
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  {inputText.length} / 15,000 characters
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 border-destructive/20 flex items-start gap-2 rounded-md border p-3">
                  <XCircle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => handleSubmit("summary")}
                  disabled={loading || !inputText.trim()}
                  className="gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  Generate Summary
                </Button>
                <Button
                  onClick={() => handleSubmit("quiz")}
                  disabled={loading || !inputText.trim()}
                  variant="outline"
                  className="gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
                  Generate Quiz
                </Button>
                <Button
                  onClick={() => handleSubmit("flashcards")}
                  disabled={loading || !inputText.trim()}
                  variant="outline"
                  className="gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate Flashcards
                </Button>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="space-y-4">
              {/* Summary Result */}
              {result.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{result.summary}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quiz Result */}
              {result.quiz && result.quiz.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-green-500" />
                      Quiz Questions
                    </CardTitle>
                    <CardDescription>
                      Test your knowledge with these questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.quiz.map((q, idx) => (
                      <div
                        key={idx}
                        className="space-y-3 rounded-lg border p-4"
                      >
                        <p className="font-medium">
                          {idx + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((option, optIdx) => {
                            const isSelected = selectedAnswers[idx] === optIdx;
                            const isCorrect = q.correctAnswer === optIdx;
                            const showResult =
                              selectedAnswers[idx] !== undefined;

                            return (
                              <button
                                key={optIdx}
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({
                                    ...prev,
                                    [idx]: optIdx,
                                  }))
                                }
                                className={`w-full rounded border p-3 text-left transition-colors ${
                                  showResult && isCorrect
                                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                                    : showResult && isSelected
                                      ? "border-red-500 bg-red-50 dark:bg-red-950"
                                      : isSelected
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                                        : "hover:bg-muted"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{option}</span>
                                  {showResult && isCorrect && (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  )}
                                  {showResult && isSelected && !isCorrect && (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {selectedAnswers[idx] !== undefined &&
                          q.explanation && (
                            <div className="bg-muted rounded p-3 text-sm">
                              <p className="mb-1 font-medium">Explanation:</p>
                              <p>{q.explanation}</p>
                            </div>
                          )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Flashcards Result */}
              {result.flashcards && result.flashcards.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      Flashcards
                    </CardTitle>
                    <CardDescription>
                      Click cards to flip and review
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {result.flashcards.map((card, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleFlashcard(idx)}
                          className="perspective-1000 h-40 cursor-pointer"
                        >
                          <div
                            className={`transform-style-3d relative h-full w-full transition-transform duration-500 ${
                              flippedCards[idx] ? "rotate-y-180" : ""
                            }`}
                          >
                            {/* Front of card */}
                            <div className="border-primary bg-card absolute inset-0 flex items-center justify-center rounded-lg border-2 p-4 backface-hidden">
                              <p className="text-center font-medium">
                                {card.front}
                              </p>
                            </div>
                            {/* Back of card */}
                            <div className="border-secondary bg-secondary/20 absolute inset-0 flex rotate-y-180 items-center justify-center rounded-lg border-2 p-4 backface-hidden">
                              <p className="text-center">{card.back}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
              >
                Generate Another
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
