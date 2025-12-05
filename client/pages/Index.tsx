import { Link } from "react-router-dom";
import { Button } from "@/components/ui/utils/button";
import { Mic, Zap, BarChart3, Shield, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50 to-brand-100">
      {/* Navigation */}
      <nav className="border-b border-brand-200/50 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-900">
              InterviewAI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/interview">
              <Button
                variant="outline"
                className="text-brand-700 border-brand-200 hover:bg-brand-50"
              >
                Start Interview
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-brand-900 mb-6 leading-tight">
            Master Your Interview Skills with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700">
              AI Coaching
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Practice behavioral interviews with instant AI feedback. Get scored
            on confidence, clarity, and STAR method adherence. No expensive
            coaches required.
          </p>
          <Link to="/interview">
            <Button
              size="lg"
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 h-12 text-lg gap-2"
            >
              Start Practicing Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 my-20">
          <div className="bg-white rounded-2xl p-8 border border-brand-100 hover:border-brand-200 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-brand-900 mb-2">
              Record Your Answer
            </h3>
            <p className="text-gray-600">
              Speak naturally and record your response to behavioral interview
              questions in a distraction-free environment.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-brand-100 hover:border-brand-200 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-brand-900 mb-2">
              Instant AI Analysis
            </h3>
            <p className="text-gray-600">
              Our AI listens to your answer and analyzes it using the STAR
              method (Situation, Task, Action, Result) framework.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-brand-100 hover:border-brand-200 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-brand-900 mb-2">
              Detailed Feedback
            </h3>
            <p className="text-gray-600">
              Get scoring on confidence, clarity, and actionable improvements
              with confidence scores based on speech patterns.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl border border-brand-200 p-12 my-20">
          <h2 className="text-3xl font-bold text-brand-900 mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h4 className="font-semibold text-brand-900 mb-2">
                Choose a Question
              </h4>
              <p className="text-gray-600 text-sm">
                Select from beginner to advanced behavioral interview questions.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h4 className="font-semibold text-brand-900 mb-2">
                Record Your Answer
              </h4>
              <p className="text-gray-600 text-sm">
                Speak your response naturally into your microphone.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h4 className="font-semibold text-brand-900 mb-2">
                Get AI Feedback
              </h4>
              <p className="text-gray-600 text-sm">
                Receive detailed analysis of your response with a confidence
                score.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h4 className="font-semibold text-brand-900 mb-2">
                Improve & Retry
              </h4>
              <p className="text-gray-600 text-sm">
                Track your progress and retake questions to improve your score.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-12 my-20 items-center">
          <div>
            <h2 className="text-3xl font-bold text-brand-900 mb-6">
              Why Choose InterviewAI?
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Shield className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-brand-900">
                    Private & Secure
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Your interview recordings and feedback are kept private.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <Zap className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-brand-900">
                    Instant Feedback
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Get AI feedback within seconds, not hours or days.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <BarChart3 className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-brand-900">
                    Track Progress
                  </h4>
                  <p className="text-gray-600 text-sm">
                    See your improvement over time with detailed analytics.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-8 text-white">
            <div className="space-y-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <p className="text-sm font-semibold opacity-90 mb-2">
                  Average Score Improvement
                </p>
                <p className="text-4xl font-bold">+35%</p>
                <p className="text-sm opacity-75">After 5 practice sessions</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <p className="text-sm font-semibold opacity-90 mb-2">
                  Interview Success Rate
                </p>
                <p className="text-4xl font-bold">89%</p>
                <p className="text-sm opacity-75">
                  Users pass their real interviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Start practicing now with instant AI feedback. No sign-up required.
          </p>
          <Link to="/interview">
            <Button
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50 px-8 h-12 text-lg gap-2"
            >
              Start Your First Interview
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            InterviewAI © 2024 • Powered by OpenAI Whisper & Advanced LLMs
          </p>
        </div>
      </footer>
    </div>
  );
}
