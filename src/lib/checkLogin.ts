export const CheckLogin = (val: boolean, navigate?: (path: string) => void) => {
  if (!val) {
    if (typeof navigate === "function") {
      navigate("/login");
    } else if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return false;
  }
  return true;
};