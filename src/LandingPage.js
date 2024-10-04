import React from 'react';
import { ArrowRight, Code, Zap, Shield, BarChart, Users } from 'lucide-react';
import Logo from './Logo';

const Feature = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4">
    <Icon className="w-12 h-12 mb-4 text-blue-400" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

const LandingPage = ({ setView, token }) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Revolutionize Your Code Reviews with AI
        </h1>
        <p className="text-2xl mb-8 max-w-3xl mx-auto">
          <b>Reveu.AI</b> supercharges your development workflow with AI-powered code reviews, 
          catching bugs, ensuring best practices, and boosting team productivity.
        </p>
        {token ? (
          <button
            onClick={() => setView('dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center mx-auto"
          >
            Get Started Now <ArrowRight className="ml-2" />
          </button>
        ) : (
          <button
            onClick={() => setView('login')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center mx-auto"
          >
            Start Free Trial <ArrowRight className="ml-2" />
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Feature 
          icon={Code}
          title="AI-Powered Code Analysis"
          description="Our advanced AI reviews your code in real-time, identifying bugs, security vulnerabilities, and style inconsistencies before they make it to production."
        />
        <Feature 
          icon={Zap}
          title="Lightning-Fast Reviews"
          description="Reduce review time by up to 80% with automated checks and suggestions, allowing your team to focus on complex logic and architecture."
        />
        <Feature 
          icon={Shield}
          title="Enforce Best Practices"
          description="Automatically ensure your team follows industry best practices and your own custom rules, maintaining high code quality across all projects."
        />
        <Feature 
          icon={BarChart}
          title="Insightful Metrics"
          description="Gain valuable insights into your development process with comprehensive metrics on code quality, review times, and team performance."
        />
        <Feature 
          icon={Users}
          title="Seamless Collaboration"
          description="Integrate with your existing workflow and tools, fostering better communication and knowledge sharing among team members."
        />
        <Feature 
          icon={ArrowRight}
          title="Continuous Improvement"
          description="Our AI learns from your team's patterns and preferences, continuously improving its recommendations and adapting to your unique needs."
        />
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl font-semibold mb-4">Ready to Transform Your Code Review Process?</h2>
        <p className="text-xl mb-8">
          Join thousands of developers and teams who have elevated their code quality with <b>Reveu.AI</b>
        </p>
        {token ? (
          <button
            onClick={() => setView('dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Go to Dashboard
          </button>
        ) : (
          <button
            onClick={() => setView('login')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Start Your Free Trial
          </button>
        )}
      </div>
    </div>
  );
};

export default LandingPage;