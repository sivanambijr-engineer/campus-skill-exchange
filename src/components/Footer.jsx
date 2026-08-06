import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-10 mt-16 text-slate-400 text-xs">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Main Footer */}

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">


          {/* Brand */}

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/30 to-indigo-500/30 text-brand-400 flex items-center justify-center text-lg border border-brand-500/30">
              ⚡
            </div>


            <div>

              <h3 className="font-display font-bold text-sm text-white">
                Campus Skill Exchange
              </h3>

              <p className="text-slate-500 text-[11px]">
                AI-powered peer learning network
              </p>

            </div>

          </div>





          {/* Links */}

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-slate-400">

            <a
              href="#how"
              className="hover:text-brand-400 transition-colors"
            >
              🤖 AI Matching
            </a>


            <a
              href="#trust"
              className="hover:text-brand-400 transition-colors"
            >
              🛡 Trust & Safety
            </a>


            <a
              href="#guidelines"
              className="hover:text-brand-400 transition-colors"
            >
              📚 Guidelines
            </a>


            <a
              href="#support"
              className="hover:text-brand-400 transition-colors"
            >
              💬 Support
            </a>

          </div>


        </div>






        {/* Bottom Section */}

        <div className="mt-8 pt-6 border-t border-slate-800/70 flex flex-col md:flex-row items-center justify-between gap-3">


          <p className="text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} Campus Skill Exchange.
            <span className="text-slate-400">
              {' '}Empowering students to learn, teach and collaborate.
            </span>
          </p>



          <div className="text-slate-500 text-center">

            Built with ❤️ by
            <span className="text-brand-400 font-semibold">
              {' '}Siva · Vishnu · Esha · Krissy
            </span>

          </div>


        </div>


      </div>

    </footer>
  );
};