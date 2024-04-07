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
      <h2>SignIn</h2>
      {!isSignedIn && (
        <form onSubmit={handleSubmit}>
          <label>E-mail</label>
          <input type="email" name="email" />
          <label>Password</label>
          <input type="password" name="password" />
          <button type="submit" value="submit">
            Login
          </button>
        </form>
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
          <p>You are signed In!</p>
          <button type="submit" onClick={handleSignOut}>
            Sign Out
          </button>
        </>
      )}
    </>
  );
}

export default Auth;
