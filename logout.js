import { signOut } from "firebase/auth";
import { authService } from "./fbase";

document.getElementById("logout")?.addEventListener("click", () => {
  signOut(authService)
    .then(() => {
      // Sign-out successful.
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/";
    })
    .catch((error) => {
      // An error happened.
      alert("로그아웃에 실패했습니다.");
    });
});
