import { useRef, useState } from "react";

const INITIAL_TOAST = { message: "", type: "" };

const useToast = () => {
    const [toast, setToast] = useState(INITIAL_TOAST);
    const timeoutRef = useRef(null);

    const clearToast = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setToast(INITIAL_TOAST);
    };

    const showToast = (message, type) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setToast({ message, type });

        timeoutRef.current = setTimeout(() => {
            setToast(INITIAL_TOAST);
            timeoutRef.current = null;
        }, 4000);
    };

    const showError = (errOrMessage, fallbackMessage = "오류가 발생했습니다.") => {
        let message;

        if (typeof errOrMessage === "string") {
            message = errOrMessage;
        } else {
            message = errOrMessage?.response?.data?.message ?? fallbackMessage;
        }

        showToast(message, "error");
    };

    const showSuccess = (message) => {
        showToast(message, "success");
    };

    const showInfo = (message) => {
        showToast(message, "info");
    };

    const showWarning = (message) => {
        showToast(message, "warning");
    };

    return {
        toast,
        showError,
        showSuccess,
        showInfo,
        showWarning,
        clearToast
    };
};

export default useToast;