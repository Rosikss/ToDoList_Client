import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";

interface ValidationErrorResponse {
  errors: Record<string, string[]>;
}

export default function showErrorMessage(error: AxiosError) {
  const data = error.response?.data as ValidationErrorResponse | undefined;
  if (data?.errors) {
    for (const messages of Object.values(data.errors)) {
      if (Array.isArray(messages)) {
        messages.forEach((message) => {
          showToast(message);
        });
      }
    }
  }
}

function showToast(message: string) {
  toast.error(message, {
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
