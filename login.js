import { authService, GoogleAuthProvider, signInWithPopup } from "./fbase";

document.getElementById("googleLogin")?.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(authService, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      localStorage.setItem("token", credential.accessToken);
      // The signed-in user info.
      const atIndex = result.user.email.indexOf("@");
      const nickName = result.user.email.slice(0, atIndex);
      localStorage.setItem("user", nickName);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      window.location.href = "home";
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      alert("로그인에 실패했습니다.");
    });
});
