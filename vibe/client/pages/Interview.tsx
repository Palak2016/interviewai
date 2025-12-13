import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/utils/button";
import {
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Volume2,
  ArrowLeft,
  Loader2,
  ChevronRight
} from "lucide-react";
import { InterviewQuestion, InterviewFeedback } from "@shared/api";
import { INTERVIEW_CATEGORIES, Category } from "../data/questions"; // Make sure path is correct

const convertBlobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, { type: blob.type });
};

export default function Interview() {
  // Added "category" to the step type
  const [step, setStep] = useState<"category" | "select" | "recording" | "feedback">("category");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [transcription, setTranscription] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlaybackRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access your microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleReset = () => {
    setAudioURL("");
    setTranscription("");
  };

  const handleAnalyze = async () => {
    if (!audioURL || !selectedQuestion) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch(audioURL);
      const audioBlob = await response.blob();
      const audioFile = new File([audioBlob], "interview_recording.wav", { type: "audio/wav" });

      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("question", selectedQuestion.question);

      const analysisResponse = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!analysisResponse.ok) {
        throw new Error(`Analysis failed: ${analysisResponse.statusText}`);
      }

      const data: InterviewFeedback = await analysisResponse.json();

      setTranscription(data.transcription);
      setFeedback(data);
      setStep("feedback");

    } catch (error) {
      console.error("Error analyzing interview:", error);
      alert("Error analyzing your response. Is the backend server running?");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50 to-brand-100">
      {/* Navigation */}
      <nav className="border-b border-brand-200/50 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link to="/" className="text-brand-600 hover:text-brand-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-lg font-semibold text-brand-900">
            {step === 'category' ? 'Select Category' : 
             step === 'select' ? selectedCategory?.title : 
             'Interview Practice'}
          </span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Step 0: Category Selection */}
        {step === "category" && (
          <div>
             <h1 className="text-3xl font-bold text-brand-900 mb-2">
              Choose a Topic
            </h1>
            <p className="text-gray-600 mb-8">
              Select a programming language or computer science concept to practice.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INTERVIEW_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setStep("select");
                  }}
                  className="bg-white border border-brand-200 rounded-2xl p-6 hover:border-brand-400 hover:shadow-md transition-all text-left group flex flex-col h-full"
                >
                  <div className="mb-4 w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                    <cat.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-900 mb-2">{cat.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{cat.description}</p>
                  <div className="flex items-center text-brand-600 font-medium text-sm mt-auto">
                    View 25 Questions <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Select Question */}
        {step === "select" && selectedCategory && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setStep("category");
                  setSelectedCategory(null);
                }}
                className="text-gray-500 hover:text-brand-600 -ml-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </div>

            <h1 className="text-3xl font-bold text-brand-900 mb-2">
              {selectedCategory.title} Questions
            </h1>
            <p className="text-gray-600 mb-8">
              Select a question to practice your {selectedCategory.title} skills.
            </p>

            <div className="grid gap-4">
              {selectedCategory.questions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setStep("recording");
                  }}
                  className="w-full text-left bg-white border border-brand-200 rounded-2xl p-6 hover:border-brand-400 hover:bg-brand-50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                        q.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        q.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                      </span>
                      <p className="text-lg text-brand-900 font-semibold group-hover:text-brand-700">
                        {q.question}
                      </p>
                    </div>
                    <div className="text-brand-400 group-hover:text-brand-600 self-center">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Recording */}
        {step === "recording" && selectedQuestion && (
          <div>
             <div className="flex items-center gap-2 mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setStep("select")}
                className="text-gray-500 hover:text-brand-600 -ml-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {selectedCategory?.title}
              </Button>
            </div>

            <div className="mb-8">
              <p className="text-sm text-brand-600 font-medium mb-2">
                {selectedQuestion.category} •{" "}
                {selectedQuestion.difficulty.charAt(0).toUpperCase() +
                  selectedQuestion.difficulty.slice(1)}
              </p>
              <h1 className="text-3xl font-bold text-brand-900">
                {selectedQuestion.question}
              </h1>
              <p className="text-gray-600 mt-4">
                Take your time to think and speak naturally. Your response will
                be analyzed for clarity, confidence, and adherence to the STAR
                method.
              </p>
            </div>

            <div className="bg-white rounded-3xl border-2 border-brand-200 p-12">
              <div className="flex flex-col items-center justify-center">
                {/* Recording Controls */}
                {!audioURL && (
                  <div className="flex flex-col items-center gap-8 w-full">
                    <div className="text-center">
                      <div
                        className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${isRecording ? "bg-red-100 animate-pulse" : "bg-brand-100"}`}
                      >
                        {isRecording ? (
                          <MicOff className="w-12 h-12 text-red-600" />
                        ) : (
                          <Mic className="w-12 h-12 text-brand-600" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {isRecording
                          ? "Recording in progress..."
                          : "Ready to record"}
                      </p>
                      {isRecording && (
                        <p className="text-sm text-gray-500">
                          Speak clearly and naturally for best results
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      {!isRecording ? (
                        <Button
                          onClick={startRecording}
                          size="lg"
                          className="bg-brand-600 hover:bg-brand-700 text-white gap-2"
                        >
                          <Mic className="w-5 h-5" />
                          Start Recording
                        </Button>
                      ) : (
                        <Button
                          onClick={stopRecording}
                          size="lg"
                          className="bg-red-600 hover:bg-red-700 text-white gap-2"
                        >
                          <MicOff className="w-5 h-5" />
                          Stop Recording
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Playback and Analysis */}
                {audioURL && (
                  <div className="flex flex-col items-center gap-8 w-full">
                    <div className="text-center">
                      <p className="text-green-600 font-semibold mb-4">
                        ✓ Recording captured!
                      </p>
                      <p className="text-gray-600 mb-6">
                        Preview your answer before submitting for analysis
                      </p>
                    </div>

                    <div className="w-full">
                      <audio
                        ref={audioPlaybackRef}
                        src={audioURL}
                        controls
                        className="w-full mb-6"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        size="lg"
                        className="border-brand-300 text-brand-700 hover:bg-brand-50 gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Re-record
                      </Button>
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        size="lg"
                        className="bg-brand-600 hover:bg-brand-700 text-white gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Analyze & Get Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Feedback */}
        {step === "feedback" && feedback && (
          <div>
            <h1 className="text-3xl font-bold text-brand-900 mb-8">
              Your Feedback
            </h1>

            {/* Confidence Score */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl border border-brand-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Confidence Score</span>
                  <Volume2 className="w-5 h-5 text-brand-600" />
                </div>
                <div className="text-4xl font-bold text-brand-600 mb-2">
                  {feedback.confidenceScore.score.toFixed(1)}/10
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(feedback.confidenceScore.score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-brand-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Clarity</span>
                  <Volume2 className="w-5 h-5 text-brand-600" />
                </div>
                <div className="text-4xl font-bold text-brand-600 mb-2">
                  {feedback.confidenceScore.clarity.toFixed(1)}/10
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(feedback.confidenceScore.clarity / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-brand-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Overall Rating</span>
                  <Volume2 className="w-5 h-5 text-brand-600" />
                </div>
                <div className="text-4xl font-bold text-brand-600 mb-2">
                  {feedback.overallRating.toFixed(1)}/10
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-600 h-2 rounded-full transition-all"
                    style={{ width: `${(feedback.overallRating / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Transcription */}
            <div className="bg-white rounded-2xl border border-brand-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-brand-900 mb-4">
                Your Transcription
              </h3>
              <p className="text-gray-700 leading-relaxed">{transcription}</p>
            </div>

            {/* AI Critique */}
            <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl border border-brand-200 p-8 mb-8">
              <h3 className="text-lg font-semibold text-brand-900 mb-4">
                AI Critique
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {feedback.critique}
              </p>
            </div>

            {/* STAR Analysis */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl border border-brand-200 p-6">
                <h4 className="font-semibold text-brand-900 mb-3">Situation</h4>
                <p className="text-gray-700 text-sm">
                  {feedback.starAnalysis.situation}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-brand-200 p-6">
                <h4 className="font-semibold text-brand-900 mb-3">Task</h4>
                <p className="text-gray-700 text-sm">
                  {feedback.starAnalysis.task}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-brand-200 p-6">
                <h4 className="font-semibold text-brand-900 mb-3">Action</h4>
                <p className="text-gray-700 text-sm">
                  {feedback.starAnalysis.action}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-brand-200 p-6">
                <h4 className="font-semibold text-brand-900 mb-3">Result</h4>
                <p className="text-gray-700 text-sm">
                  {feedback.starAnalysis.result}
                </p>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
                <h4 className="font-semibold text-green-900 mb-4">Strengths</h4>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-green-800 flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-orange-50 rounded-2xl border border-orange-200 p-6">
                <h4 className="font-semibold text-orange-900 mb-4">
                  Areas to Improve
                </h4>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-orange-800 flex gap-2"
                    >
                      <span className="text-orange-600 font-bold">→</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hesitation Details */}
            {feedback.confidenceScore.hesitationDetails.length > 0 && (
              <div className="bg-white rounded-2xl border border-brand-200 p-6 mb-8">
                <h4 className="font-semibold text-brand-900 mb-4">
                  Hesitation Analysis (
                  {feedback.confidenceScore.hesitationWords} detected)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {feedback.confidenceScore.hesitationDetails.map(
                    (word, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-100 text-orange-800 text-sm rounded-full px-3 py-1"
                      >
                        {word}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setStep("select"); // Go back to question selection
                  setAudioURL("");
                  setTranscription("");
                  setFeedback(null);
                }}
                size="lg"
                className="bg-brand-600 hover:bg-brand-700 text-white gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Try Another Question
              </Button>
              <Button
                onClick={() => {
                    setStep("category"); // Go back to main menu
                    setSelectedQuestion(null);
                    setSelectedCategory(null);
                    setAudioURL("");
                    setTranscription("");
                    setFeedback(null);
                }}
                size="lg"
                variant="outline"
                className="border-brand-300 text-brand-700 hover:bg-brand-50"
              >
                ← Main Menu
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}