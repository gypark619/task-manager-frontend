import { useState } from "react";

const INITIAL_CONFIRM = {
    open: false,
    message: "",
    onConfirm: null
};

const useConfirm = () => {
    const [confirm, setConfirm] = useState(INITIAL_CONFIRM);

    const openConfirm = ({ message, onConfirm }) => {
        setConfirm({
            open: true,
            message,
            onConfirm
        });
    };

    const closeConfirm = () => {
        setConfirm(INITIAL_CONFIRM);
    };

    const handleConfirm = () => {
        if (confirm.onConfirm) {
            confirm.onConfirm();
        }
        closeConfirm();
    };

    return {
        confirm,
        openConfirm,
        closeConfirm,
        handleConfirm
    };
};

export default useConfirm;