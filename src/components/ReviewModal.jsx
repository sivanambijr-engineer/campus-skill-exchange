import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ReviewModal = () => {

  const {
    reviewModalTargetSwap,
    setReviewModalTargetSwap,
    submitReview
  } = useApp();


  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverStar, setHoverStar] = useState(0);



  if (!reviewModalTargetSwap) return null;



  const handleSubmit = (e) => {

    e.preventDefault();

    submitReview(
      reviewModalTargetSwap.id,
      reviewModalTargetSwap.recipientId,
      rating,
      comment.trim()
    );

  };



  const ratingText = {

    5: "Outstanding learning experience ⭐",
    4: "Great collaboration 👍",
    3: "Good experience",
    2: "Needs improvement",
    1: "Poor experience"

  };




  return (

    <div className="
      fixed inset-0 z-50
      flex items-center justify-center
      p-4
      bg-slate-950/80
      backdrop-blur-md
      animate-fade-in
    ">


      <div className="
        glass-card
        bg-slate-900
        border border-slate-700/80
        rounded-3xl
        p-6 sm:p-8
        max-w-md
        w-full
        shadow-2xl
        relative
      ">



        {/* Close */}

        <button
          onClick={() => setReviewModalTargetSwap(null)}
          className="
            absolute top-5 right-5
            w-8 h-8
            rounded-full
            bg-slate-800
            text-slate-400
            hover:text-white
            transition
          "
        >
          ✕
        </button>





        {/* Header */}

        <div className="flex items-center gap-3 mb-6">


          <div className="
            w-12 h-12
            rounded-2xl
            bg-amber-500/20
            text-amber-400
            border border-amber-500/30
            flex items-center justify-center
            text-2xl
          ">
            ⭐
          </div>



          <div>

            <h2 className="
              text-xl
              font-bold
              text-white
            ">
              Complete Skill Review
            </h2>


            <p className="
              text-xs
              text-slate-400
            ">
              Share feedback about {reviewModalTargetSwap.recipientName}
            </p>


          </div>


        </div>






        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >





          {/* Rating */}

          <div className="
            p-5
            rounded-2xl
            bg-slate-800/60
            border border-slate-700/60
            text-center
          ">


            <label className="
              text-xs
              font-semibold
              text-slate-300
              block
              mb-3
            ">
              How was the skill exchange?
            </label>




            <div className="
              flex
              justify-center
              gap-2
            ">


              {[1,2,3,4,5].map((star)=>(

                <button
                  key={star}
                  type="button"
                  onClick={()=>setRating(star)}
                  onMouseEnter={()=>setHoverStar(star)}
                  onMouseLeave={()=>setHoverStar(0)}
                  className="
                    text-3xl
                    transition
                    hover:scale-125
                  "
                >

                  <span className={

                    (hoverStar || rating) >= star
                    ?
                    "text-amber-400"
                    :
                    "text-slate-600"

                  }>

                    ★

                  </span>


                </button>


              ))}


            </div>




            <p className="
              mt-3
              text-sm
              font-bold
              text-amber-400
            ">

              {rating}.0 — {ratingText[rating]}

            </p>



          </div>







          {/* Reputation Preview */}

          <div className="
            flex items-center gap-3
            px-4 py-3
            rounded-xl
            bg-emerald-500/10
            border border-emerald-500/20
          ">


            <span className="text-xl">
              🏆
            </span>


            <p className="
              text-xs
              text-emerald-300
            ">

              Your review helps build a trusted campus learning community.

            </p>


          </div>







          {/* Comment */}


          <div>


            <label className="
              text-xs
              font-semibold
              text-slate-300
              block
              mb-1.5
            ">
              Feedback
            </label>


            <textarea

              rows="4"

              value={comment}

              onChange={(e)=>setComment(e.target.value)}

              placeholder="Mention teaching quality, communication, and learning experience..."

              className="
                w-full
                glass-input
                text-sm
                text-white
                rounded-xl
                p-3
                bg-slate-800
                resize-none
                focus:outline-none
              "

              required

            />


          </div>







          {/* Buttons */}

          <div className="flex gap-3 pt-2">


            <button

              type="button"

              onClick={()=>setReviewModalTargetSwap(null)}

              className="
                flex-1
                py-3
                rounded-xl
                text-xs
                font-semibold
                text-slate-400
                bg-slate-800
                hover:bg-slate-700
              "

            >

              Cancel

            </button>





            <button

              type="submit"

              className="
                flex-1
                py-3
                rounded-xl
                text-xs
                font-semibold
                text-white

                bg-gradient-to-r
                from-amber-500
                to-orange-600

                shadow-lg
                shadow-amber-500/20

                hover:scale-105
                transition
              "

            >

              Submit ⭐

            </button>



          </div>



        </form>



      </div>



    </div>

  );

};