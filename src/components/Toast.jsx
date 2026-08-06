import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast = () => {

  const { toastMessage } = useApp();


  if (!toastMessage) return null;



  const getIcon = () => {

    const title = toastMessage.title?.toLowerCase() || '';

    if (title.includes('success') || title.includes('added')) {
      return '✅';
    }

    if (title.includes('swap')) {
      return '🔄';
    }

    if (title.includes('match')) {
      return '🤖';
    }

    if (title.includes('message')) {
      return '💬';
    }

    return '✨';

  };




  return (

    <div
      className="
        fixed
        bottom-6
        right-6
        z-50
        animate-slide-up
      "
    >


      <div
        className="
          w-[340px]
          glass-card

          bg-slate-900/95

          border
          border-slate-700/80

          rounded-2xl

          shadow-2xl
          shadow-brand-500/20

          p-4

          flex
          gap-3

          backdrop-blur-xl
        "
      >



        {/* Icon */}

        <div
          className="
            w-10
            h-10

            rounded-xl

            bg-gradient-to-br
            from-brand-500/30
            to-indigo-500/30

            border
            border-brand-500/30

            flex
            items-center
            justify-center

            text-xl

            flex-shrink-0
          "
        >

          {getIcon()}

        </div>





        {/* Content */}

        <div className="flex-1">


          <h4
            className="
              text-sm
              font-bold
              text-white
              leading-tight
            "
          >

            {toastMessage.title}

          </h4>



          <p
            className="
              text-xs
              text-slate-400
              mt-1
              leading-relaxed
            "
          >

            {toastMessage.description}

          </p>


        </div>





        {/* Status Dot */}

        <div
          className="
            w-2
            h-2
            rounded-full
            bg-emerald-400
            mt-1
            animate-pulse
          "
        />


      </div>


    </div>

  );

};