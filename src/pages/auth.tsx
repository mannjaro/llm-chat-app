import { type FormEventHandler, useEffect } from "react";
import { useAuth } from "../hooks/cognito";

function Auth() {
  const { isSignedIn, step, fetchSession, signIn, signOut, confirmSignIn } =
    useAuth();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email: string = form.get("email")?.toString() || "";
    const password = form.get("password")?.toString() || "";
    signIn(email, password);
  };

  const handleConfirmSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = form.get("newPassword")?.toString() || "";
    confirmSignIn({ challengeResponse: password });
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <h2 className="font-bold text-2xl py-4">Login</h2>
      {!isSignedIn && (
        <div className="w-full max-w-xs mx-auto">
          <form
            onSubmit={handleSubmit}
            className="shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="email"
                placeholder="test@example.com"
              />
            </div>
            <div className="mb-6 ">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="password"
                placeholder="******************"
              />
            </div>
            <button
              type="submit"
              value="submit"
              className="transition duration-200 text-white font-bold px-4 py-2 bg-sky-500 hover:bg-sky-700 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </form>
        </div>
      )}
      {step?.nextStep.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED" && (
        <>
          <p>CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED</p>
          <form onSubmit={handleConfirmSubmit}>
            <label>New Password</label>
            <input type="password" name="newPassword" />
            <button type="submit" value="submit">
              Change Password
            </button>
          </form>
        </>
      )}
      {isSignedIn && (
        <>
          <div className="w-full max-w-xs mx-auto">
            <p className="py-2">You are signed In!</p>
            <button
              type="submit"
              onClick={handleSignOut}
              className="transition duration-200 text-white font-bold px-4 py-2 bg-sky-500 hover:bg-sky-700 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default Auth;
