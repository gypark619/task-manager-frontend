import React, { useEffect, useState } from "react";
import api from "../api/axios";
import UserSearch from "../components/UserSearch";
import UserTable from "../components/UserTable";
import UserDetailForm from "../components/UserDetailForm";

import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

import "./UserList.css";

const UserList = () => {
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState({
        name: "",
        teamId: "",
        positionId: "",
        status: ""
    });

    const [sort, setSort] = useState({
        field: "userId",
        direction: "desc"
    });

    const [detail, setDetail] = useState({
        userId: "",
        employeeNo: "",
        loginId: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        officePhone: "",
        teamId: "",
        positionId: "",
        status: "ACTIVE"
    });

    const [selectedId, setSelectedId] = useState(null);
    const [checkedIds, setCheckedIds] = useState([]);

    const [toast, setToast] = useState({ message: "", type: "" });
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageGroupSize] = useState(5);

    const currentGroup = Math.floor(currentPage / pageGroupSize);
    const startPage = currentGroup * pageGroupSize;
    const endPage = Math.min(startPage + pageGroupSize, totalPages);

    const pageNumbers = Array.from(
        { length: endPage - startPage },
        (_, i) => startPage + i
    );

    const handleSearchChange = (field, value) => {
        setSearch((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSortChange = (field, direction) => {
        setSort({
            field,
            direction
        });
    };

    const handleDetailChange = (field, value) => {
        setDetail((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const showError = (message) => {
        setToast({ message, type: "error" });
        setTimeout(() => setToast({ message: "", type: "" }), 4000);
    };

    const showSuccess = (message) => {
        setToast({ message, type: "success" });
        setTimeout(() => setToast({ message: "", type: "" }), 4000);
    };
    
    const showInfo = (message) => {
        setToast({ message, type: "info" });
        setTimeout(() => setToast({ message: "", type: "" }), 4000);
    };

    const showWarning = (message) => {
        setToast({ message, type: "warning" });
        setTimeout(() => setToast({ message: "", type: "" }), 4000);
    };

    const resetDetailForm = () => {
        setSelectedId(null);
        setDetail({
            userId: "",
            employeeNo: "",
            loginId: "",
            password: "",
            name: "",
            email: "",
            phone: "",
            officePhone: "",
            teamId: "",
            positionId: "",
            status: "ACTIVE"
        });
    };

    const fetchUsers = (page = 0) => {
        const params = {
            name: search.name || undefined,
            teamId: search.teamId ? Number(search.teamId) : undefined,
            positionId: search.positionId ? Number(search.positionId) : undefined,
            status: search.status || undefined,
            page,
            size: 10,
            sortField: sort.field,
            sortDirection: sort.direction
        };

        return api.get("/users", { params })
            .then((res) => {
                setUsers(res.data.content);
                setCurrentPage(res.data.page);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => {
                console.error(err);
                showError("사용자 목록 조회 실패");
                throw err;
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = () => {
        setCheckedIds([]);
        resetDetailForm();

        fetchUsers(0)
            .then(() => {
                showSuccess("조회 완료");
            })
            .catch((err) => {
                console.error(err);
                showError("조회 중 오류 발생");
            });
    };

    const handleReset = () => {
        setSearch({
            name: "",
            teamId: "",
            positionId: "",
            status: ""
        });

        setSort({
            field: "userId",
            direction: "desc"
        });

        setCheckedIds([]);
        resetDetailForm();
        setCurrentPage(0);

        fetchUsers(0)
            .then(() => {
                showSuccess("초기화 완료");
            });
    };

    const handleSelectRow = (user) => {
        setSelectedId(user.userId);
        
        setDetail({
            userId: user.userId || "",
            employeeNo: user.employeeNo || "",
            loginId: user.loginId || "",
            password: "",
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            officePhone: user.officePhone || "",
            teamId: user.teamId || "",
            positionId: user.positionId || "",
            status: user.status || "ACTIVE"
        });
    };

    const handleCheck = (id) => {
        setCheckedIds((prev) =>
            prev.includes(id)
                ? prev.filter((checkedId) => checkedId !== id)
                : [...prev, id]
        );
    };

    const handleCheckAll = (e) => {
        if (e.target.checked) {
            setCheckedIds(users.map((user) => user.userId));
        } else {
            setCheckedIds([]);
        }
    };

    const handleAdd = () => {
        setCheckedIds([]);
        resetDetailForm();
        showInfo("신규 입력 상태입니다.");
    };

    const handleSave = () => {
        if (!detail.employeeNo || !detail.loginId || !detail.name) {
            showError("사번, 로그인ID, 이름은 필수입니다.");
            return;
        }

        const userData = {
            employeeNo: detail.employeeNo,
            loginId: detail.loginId,
            name: detail.name,
            email: detail.email,
            phone: detail.phone,
            officePhone: detail.officePhone,
            teamId: detail.teamId,
            positionId: detail.positionId,
            status: detail.status
        };

        if (selectedId) {
            api.put(`/users/${selectedId}`, userData)
                .then(() => {
                    showSuccess("수정 완료");
                    fetchUsers();
                })
                .catch((err) => {
                    console.error(err);

                    if (err.response?.status === 404) {
                        showError("선택한 사용자가 존재하지 않습니다.");
                    } else {
                        showError("수정 중 오류 발생");
                    }
                });
        } else {
            api.post("/users", userData)
                .then(() => {
                    showSuccess("등록 완료");
                    fetchUsers();
                    resetDetailForm();
                })
                .catch((err) => {
                    console.error(err);
                    showError("등록 중 오류 발생");
                });
        }
    };

    const handleDelete = () => {
        let targetIds = [];

        if (checkedIds.length > 0) {
            targetIds = [...checkedIds];
        } else if (selectedId) {
            targetIds = [selectedId];
        } else {
            showError("삭제할 사용자를 선택하세요.");
            return;
        }

        setConfirmMessage(`선택한 ${targetIds.length}건을 삭제하시겠습니까?`);
        setConfirmAction(() => () => confirmDelete(targetIds));
        setConfirmOpen(true);
    };

    const confirmDelete = (targetIds) => {
        Promise.all(targetIds.map((id) => api.delete(`/users/${id}`)))
            .then(() => {
                showSuccess("삭제 완료");
                setCheckedIds([]);
                fetchUsers();

                if (selectedId && targetIds.includes(selectedId)) {
                    resetDetailForm();
                }
            })
            .catch((err) => {
                console.error(err);

                if (err.response?.status === 404) {
                    showError("이미 삭제되었거나 존재하지 않는 사용자입니다.");
                } else {
                    showError("삭제 중 오류 발생");
                }
            });
    };

    return (
        <div className="page">
            <h1 className="page-title">사용자 관리</h1>

            <div className="section">
                <UserSearch
                    search={search}
                    onChangeSearch={handleSearchChange}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                    sort={sort}
                    onChangeSort={handleSortChange}
                />
            </div>

            <div className="section">
                <UserTable
                    users={users}
                    checkedIds={checkedIds}
                    selectedId={selectedId}
                    handleCheck={handleCheck}
                    handleCheckAll={handleCheckAll}
                    handleSelect={handleSelectRow}
                />
            </div>

            <div className="pagination">
                <button
                    disabled={startPage === 0}
                    onClick={() => fetchUsers(startPage - 1)}
                >
                    이전
                </button>

                {/* 페이지 번호 */}
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => fetchUsers(page)}
                        className={currentPage === page ? "active" : ""}
                    >
                        {page + 1}
                    </button>
                ))}

                <button
                    disabled={endPage >= totalPages}
                    onClick={() => fetchUsers(endPage)}
                >
                    다음
                </button>
            </div>

            <div className="section">
                <UserDetailForm
                    detail={detail}
                    onChangeDetail={handleDetailChange}
                    handleAdd={handleAdd}
                    handleSave={handleSave}
                    handleDelete={handleDelete}
                />
            </div>

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: "", type: "" })}
            />

            <ConfirmModal
                open={confirmOpen}
                message={confirmMessage}
                onCancel={() => {
                    setConfirmOpen(false);
                    setConfirmMessage("");
                    setConfirmAction(null);
                }}
                onConfirm={() => {
                    setConfirmOpen(false);
                    if (confirmAction) {
                        confirmAction();
                    }
                    setConfirmMessage("");
                    setConfirmAction(null);
                }}
            />
        </div>
    );
};

export default UserList;