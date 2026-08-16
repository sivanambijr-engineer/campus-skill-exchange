import React, { useState } from 'react';

import { GoogleLogin } from '@react-oauth/google';

import { useApp } from '../context/AppContext';


export const Login = () => {

  const {
    googleLogin,
    showToast,
  } = useApp();


  const [loading, setLoading] =
    useState(false);


  const handleGoogleSuccess = async (
    credentialResponse
  ) => {

    console.log(
      '[GOOGLE] Credential received'
    );


    if (!credentialResponse?.credential) {

      showToast(
        'Google Sign-In Failed',
        'Google did not return a credential.',
        'error'
      );

      return;
    }


    setLoading(true);


    try {

      const user =
        await googleLogin(
          credentialResponse.credential
        );


      console.log(
        '[GOOGLE] Authentication successful'
      );


      showToast(
        'Login Successful',
        `Welcome, ${user.full_name || user.fullName}!`
      );


    } catch (error) {

      console.error(
        '[GOOGLE] Authentication failed:',
        error
      );


      showToast(
        'Google Sign-In Failed',
        error.message ||
          'Unable to authenticate with Google.',
        'error'
      );


    } finally {

      setLoading(false);

    }
  };


  const handleGoogleError = () => {

    console.error(
      '[GOOGLE] Google button failed'
    );


    showToast(
      'Google Sign-In Failed',
      'Google sign-in could not be completed.',
      'error'
    );
  };


  return (

    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="w-full max-w-md text-center">


        {/* LOGO */}

        <div className="mx-auto w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center rotate-3">

          <span className="text-3xl text-white font-bold -rotate-3">
            C
          </span>

        </div>


        {/* TITLE */}

        <div className="mt-6">

          <h1 className="font-display font-bold text-3xl text-white">
            Campus Skill Exchange
          </h1>

          <p className="text-slate-400 mt-2 text-sm">
            Trade skills with students on your campus.
          </p>

        </div>


        {/* GOOGLE LOGIN */}

        <div className="mt-8">

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">

            <h2 className="text-white font-semibold text-lg">
              Welcome
            </h2>

            <p className="text-slate-400 text-sm mt-2 mb-6">
              Continue with your Google account.
            </p>


            {loading ? (

              <div className="w-full py-3 rounded-xl bg-slate-700 text-slate-300 font-semibold">
                Verifying Google account...
              </div>

            ) : (

              <div className="flex justify-center">

                <GoogleLogin

                  onSuccess={
                    handleGoogleSuccess
                  }

                  onError={
                    handleGoogleError
                  }

                  useOneTap={false}

                  theme="outline"

                  size="large"

                  text="continue_with"

                  shape="rectangular"

                />

              </div>

            )}

          </div>

        </div>


        <p className="text-[10px] text-slate-500 max-w-xs mx-auto mt-6">
          Secure authentication powered by Google.
        </p>

      </div>

    </div>
  );
};