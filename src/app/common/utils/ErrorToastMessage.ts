import { Bounce, toast } from "react-toastify";

export default function showErrorMessage(error: any) {
  const typedError = error as Error;
  toast.error(typedError.message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
}
