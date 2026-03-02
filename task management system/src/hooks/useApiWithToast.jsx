import { toast } from "react-toastify";

const useApiWithToast = () => {
  const execute = async (apiCall, options = {}) => {
    const {
      loadingMessage = "Processing...",
      successMessage,
      errorMessage = "Something went wrong",
      onSuccess,
    } = options;

    const toastId = toast.loading(loadingMessage);

    try {
      const response = await apiCall();

      toast.update(toastId, {
        render:
          response?.data?.message ||
          successMessage ||
          "Operation successful",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      if (onSuccess) onSuccess(response);

      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || errorMessage;

      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });

      throw error;
    }
  };

  return { execute };
};

export default useApiWithToast;