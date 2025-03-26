import React from 'react';

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-cyan-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')]"></div>
        
        <div className="text-center px-4 max-w-4xl z-10">
          <div className="space-y-8 animate-fadeInUp">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              Transform Your Code with
              <span className="block mt-3 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                AFSPADE
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-200 font-light">
              Elevate your programming skills through AI-powered feedback and detailed performance analytics.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <a
                href="/register"
                className="px-8 py-4 text-lg font-semibold text-white bg-teal-500 rounded-lg shadow-lg hover:bg-teal-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose AFSPADE?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionize your learning process with our cutting-edge features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Automated Feedback',
                description: 'Receive instant, AI-powered feedback on your coding assignments to help you improve quickly.'
              },
              {
                icon: '🧠',
                title: 'Personalized Learning',
                description: 'Get tailored recommendations and resources based on your coding performance and learning style.'
              },
              {
                icon: '📈',
                title: 'Detailed Analytics',
                description: 'Track your progress with comprehensive analytics and identify areas for improvement.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-cyan-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-6 transition-transform duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-teal-400 font-bold text-lg">AFSPADE</h3>
              <p className="text-sm">
                Empowering developers through intelligent feedback systems
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-400">Product</h4>
              <ul className="space-y-2">
                <li><a href="/features" className="hover:text-teal-400 transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-teal-400 transition-colors">Pricing</a></li>
                <li><a href="/docs" className="hover:text-teal-400 transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-400">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="hover:text-teal-400 transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-teal-400 transition-colors">Blog</a></li>
                <li><a href="/careers" className="hover:text-teal-400 transition-colors">Careers</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-400">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://twitter.com" className="hover:text-teal-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="https://github.com" className="hover:text-teal-400 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AFSPADE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;