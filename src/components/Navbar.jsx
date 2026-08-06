import React from 'react';
import { useApp } from '../context/AppContext';

export const Navbar = () => {

  const {
    currentUser,
    activeTab,
    setActiveTab,
    swaps,
    setIsAddSkillModalOpen,
    isConnectedToBackend
  } = useApp();


  const pendingCount = swaps.filter(
    swap =>
      swap.status === 'PENDING' &&
      swap.recipientId === currentUser.id
  ).length;



  const navItem = (tab, label, icon, color = "brand") => {

    const active = activeTab === tab;

    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`
          px-3.5 py-2 rounded-xl text-sm font-medium transition-all
          ${active
            ? `bg-slate-800 text-${color}-400 border border-${color}-500/30 shadow-md`
            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }
        `}
      >

        {icon} {label}

      </button>
    );
  };



  return (

    <header className="
      sticky top-0 z-40 w-full
      bg-slate-950/85 backdrop-blur-xl
      border-b border-slate-800/80
    ">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        <div className="flex items-center justify-between h-20">



          {/* BRAND */}


          <div
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center gap-3 cursor-pointer"
          >

            <div className="
              w-12 h-12 rounded-2xl
              bg-gradient-to-br from-brand-500 to-indigo-600
              flex items-center justify-center
              text-white text-2xl
              shadow-xl shadow-brand-500/30
            ">
              ⚡
            </div>



            <div>

              <div className="flex items-center gap-2">

                <h1 className="
                  text-white text-xl font-bold tracking-tight
                ">
                  Campus Skill Exchange
                </h1>


                <span className="
                  text-[10px]
                  px-2 py-1 rounded-full
                  bg-purple-500/20
                  text-purple-300
                  border border-purple-500/30
                  font-bold
                ">
                  AI
                </span>


              </div>



              <div className="flex items-center gap-2 mt-1">

                <span className="text-xs text-slate-400">
                  {currentUser.campusName}
                </span>


                <span className={`
                  text-[10px]
                  px-2 py-0.5 rounded-full
                  border font-semibold

                  ${
                    isConnectedToBackend
                    ?
                    'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    :
                    'bg-blue-500/10 text-blue-300 border-blue-500/30'
                  }

                `}>

                  {isConnectedToBackend
                    ? '🟢 Live Network'
                    : '⚡ Demo Mode'
                  }

                </span>


              </div>


            </div>


          </div>





          {/* NAVIGATION */}


          <nav className="
            hidden lg:flex
            items-center gap-1
          ">


            {navItem(
              'marketplace',
              'Explore Skills',
              '🔍'
            )}



            {navItem(
              'aimatches',
              'AI Matches',
              '🤖',
              'purple'
            )}



            <button
              onClick={() => setActiveTab('aimatches')}
              className="
                -ml-2
                px-2 py-1
                text-[10px]
                rounded-full
                bg-purple-500/20
                text-purple-300
                border border-purple-500/30
              "
            >
              98%
            </button>




            <button
              onClick={() => setActiveTab('dashboard')}
              className={`
                relative
                px-3.5 py-2 rounded-xl
                text-sm font-medium transition-all

                ${
                  activeTab === 'dashboard'
                  ?
                  'bg-slate-800 text-brand-400 border border-brand-500/30'
                  :
                  'text-slate-300 hover:bg-slate-800/60'
                }
              `}
            >

              🔄 Swaps


              {pendingCount > 0 && (

                <span className="
                  absolute -top-2 -right-2
                  w-5 h-5
                  rounded-full
                  bg-rose-500
                  text-white
                  text-[10px]
                  flex items-center justify-center
                  animate-bounce
                ">
                  {pendingCount}
                </span>

              )}

            </button>



            {navItem(
              'chat',
              'Messages',
              '💬'
            )}



          </nav>






          {/* RIGHT ACTIONS */}



          <div className="flex items-center gap-3">



            <div className="
              hidden xl:flex
              items-center gap-2
              px-4 py-2
              rounded-full
              bg-amber-500/10
              border border-amber-500/20
              text-xs
              text-amber-300
              font-semibold
            ">

              ⭐ {currentUser.reputationScore}
              <span className="text-slate-600">
                |
              </span>
              🔥 {currentUser.karmaPoints}

            </div>





            <button

              onClick={() => setIsAddSkillModalOpen(true)}

              className="
                px-4 py-2.5
                rounded-xl
                text-sm
                font-semibold
                text-white

                bg-gradient-to-r
                from-brand-500
                to-indigo-600

                shadow-lg
                shadow-brand-500/25

                hover:scale-105
                transition
              "
            >

              + Add Skill

            </button>





            <div
  onClick={() => setActiveTab('profile')}
  className={`
    relative
    cursor-pointer
    transition-all

    ${
      activeTab === 'profile'
        ? 'scale-105'
        : 'hover:scale-105'
    }
  `}
>

  <div
    className={`
      w-11 h-11
      rounded-full
      flex items-center justify-center

      bg-gradient-to-br
      from-brand-500
      via-indigo-500
      to-purple-600

      text-white
      text-sm
      font-bold
      uppercase

      border-2

      ${
        activeTab === 'profile'
          ? 'border-brand-300 shadow-lg shadow-brand-500/40'
          : 'border-slate-700'
      }
    `}
  >
    {currentUser.avatarInitials}
  </div>

  <span
    className="
      absolute
      bottom-0
      right-0

      w-3 h-3
      rounded-full

      bg-emerald-400
      border-2 border-slate-950
    "
  />

</div>
          </div>



        </div>


      </div>


    </header>

  );
};