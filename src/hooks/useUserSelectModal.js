import { useState } from "react";
import { getUsers } from "../api/userApi";

const useUserSelectModal = ({ onSelect, onError, onEmpty }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [initialSearch, setInitialSearch] = useState({});

    const closeModal = () => {
        setModalOpen(false);
        setInitialSearch({});
    };

    const handleSelect = (user) => {
        onSelect(user);
        closeModal();
    };

    const openWithSearch = (searchParams = {}) => {
        return getUsers({
            ...searchParams,
            page: 0,
            size: 10
        })
            .then((res) => {
                const users = res.data.content || [];

                if (users.length === 1) {
                    onSelect(users[0]);
                    return;
                }

                if (users.length === 0) {
                    if (onEmpty) {
                        onEmpty();
                    }
                    return;
                }

                setInitialSearch(searchParams);
                setModalOpen(true);
            })
            .catch((err) => {
                console.error(err);
                if (onError) {
                    onError(err);
                }
            });
    };

    return {
        modalOpen,
        initialSearch,
        openWithSearch,
        closeModal,
        handleSelect
    };
};

export default useUserSelectModal;