import React, { useEffect, useState } from "react";

import UserSearch from "../components/user/UserSearch";
import UserTable from "../components/user/UserTable";
import UserDetailForm from "../components/user/UserDetailForm";

import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";

import AppLayout from "../components/layout/AppLayout";

import "../styles/layout.css";
import "../styles/form.css";
import "../styles/table.css";

import api from "../api/axios";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";
import { getTeams } from "../api/teamApi";
import { getPositions } from "../api/positionApi";
import { getRoles } from "../api/roleApi";

const UserList = () => {
    // ===== State =====
    const [users, setUsers] = useState([]);

    const [teams, setTeams] = useState([]);
    const [positions, setPositions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]);

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

    const DEFAULT_SIZE = 10;
    const [size, setSize] = useState(DEFAULT_SIZE);

    const [loading, setLoading] = useState(false);

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


    // ===== Handler (이벤트/액션) =====
    const handleSearchChange = (field, value) => {
        setSearch((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = () => {
        setCheckedIds([]);
        resetDetailForm();

        fetchUsers(0, size, search, sort)
            .then(() => {
                showSuccess("조회 완료");
            });
    };

    const handleReset = () => {
        const resetSearch = {
            name: "",
            teamId: "",
            positionId: "",
            status: ""
        };

        const resetSort = {
            field: "userId",
            direction: "desc"
        };
        
        setSearch(resetSearch);
        setSort(resetSort);
        setSize(DEFAULT_SIZE);

        setCheckedIds([]);
        resetDetailForm();
        setCurrentPage(0);

        fetchUsers(0, DEFAULT_SIZE, resetSearch, resetSort)
            .then(() => {
                showSuccess("초기화 완료");
            });
    };

    const handleSortChange = (field, direction) => {
        setCurrentPage(0);
        setSort({ field, direction });
    };

    const handleSizeChange = (newSize) => {
        setCurrentPage(0);
        setSize(newSize);
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
            teamId: detail.teamId ? Number(detail.teamId) : null,
            positionId: detail.positionId ? Number(detail.positionId) : null,
            status: detail.status
        };

        if (selectedId) {
            updateUser(selectedId, userData)
                .then(() => {
                    showSuccess("수정 완료");
                    fetchUsers(currentPage, size, search, sort);
                })
                .catch((err) => {
                    console.error(err);
                    showError(err, "수정 중 오류 발생");
                });
        } else {
            createUser(userData)
                .then(() => {
                    showSuccess("등록 완료");
                    fetchUsers(0, size, search, sort);
                    resetDetailForm();
                })
                .catch((err) => {
                    console.error(err);
                    showError(err, "등록 중 오류 발생");
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
        Promise.all(targetIds.map((id) => deleteUser(id)))
            .then(() => {
                showSuccess("삭제 완료");
                setCheckedIds([]);
                fetchUsers(currentPage, size, search, sort);

                if (selectedId && targetIds.includes(selectedId)) {
                    resetDetailForm();
                }
            })
            .catch((err) => {
                console.error(err);
                showError(err, "삭제 중 오류 발생");
            });
    };

    const handleDetailChange = (field, value) => {
        setDetail((prev) => ({
            ...prev,
            [field]: value
        }));
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

    const fetchUsers = (
        page = 0, 
        pageSize = size, 
        searchParams = search, 
        sortParams = sort
    ) => {
        const params = {
            name: searchParams.name || undefined,
            teamId: searchParams.teamId ? Number(searchParams.teamId) : undefined,
            positionId: searchParams.positionId ? Number(searchParams.positionId) : undefined,
            status: searchParams.status || undefined,
            page,
            size: pageSize,
            sortField: sortParams.field,
            sortDirection: sortParams.direction
        };

        setLoading(true);

        return getUsers(params)
            .then((res) => {
                setUsers(res.data.content);
                setCurrentPage(res.data.page);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "사용자 목록 조회 실패");
                throw err;
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchTeamOptions = () => {
        return getTeams({
            page: 0,
            size: 100,
            sortField: "teamName",
            sortDirection: "asc"
        })
            .then((res) => {
                setTeams(res.data.content);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "부서 목록 조회 실패");
            });
    };

    const fetchPositionOptions = () => {
        return getPositions({
            page: 0,
            size: 100,
            sortField: "positionName",
            sortDirection: "asc"
        })
            .then((res) => {
                setPositions(res.data.content);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "직급 목록 조회 실패");
            });
    };

    const fetchRoleOptions = () => {
        return getRoles({
            page: 0,
            size: 100,
            sortField: "roleName",
            sortDirection: "asc"
        })
            .then((res) => {
                setRoles(res.data.content);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "권한 목록 조회 실패");
            });
    };


    // ===== Utils / 계산 =====
    const [pageGroupSize] = useState(5);
    const currentGroup = Math.floor(currentPage / pageGroupSize);
    const startPage = currentGroup * pageGroupSize;
    const endPage = Math.min(startPage + pageGroupSize, totalPages);

    const pageNumbers = Array.from(
        { length: endPage - startPage },
        (_, i) => startPage + i
    );

    const showError = (errOrMessage, fallbackMessage = "오류가 발생했습니다.") => {
        let message;

        if (typeof errOrMessage === "string") {
            message = errOrMessage;
        } else {
            message = errOrMessage?.response?.data?.message ?? fallbackMessage;
        }
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
    
    // ===== useEffect =====
    useEffect(() => {
        fetchUsers(currentPage, size, search, sort);
        fetchTeamOptions();
        fetchPositionOptions();
        fetchRoleOptions();
    }, [currentPage, size, sort]);

    const teamOptions = teams.map((team) => ({
        value: String(team.teamId),
        label: team.teamName
    }));

    const positionOptions = positions.map((position) => ({
        value: String(position.positionId),
        label: position.positionName
    }));

    const roleOptions = roles.map((role) => ({
        value: String(role.roleId),
        label: role.roleName
    }));

    return (
        <AppLayout title="사용자 관리">
            <div className="page">
                <div className="section">
                    <UserSearch
                        search={search}
                        onChangeSearch={handleSearchChange}
                        handleSearch={handleSearch}
                        handleReset={handleReset}
                        loading={loading}
                        teamOptions={teamOptions}
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
                        sort={sort}
                        onChangeSort={handleSortChange}
                        size={size}
                        onChangeSize={handleSizeChange}
                    />
                </div>

                <div className="pagination">
                    <button
                        disabled={startPage === 0}
                        onClick={() => fetchUsers(startPage - 1, size, search, sort)}
                    >
                        이전
                    </button>

                    {/* 페이지 번호 */}
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => fetchUsers(page, size, search, sort)}
                            className={currentPage === page ? "active" : ""}
                        >
                            {page + 1}
                        </button>
                    ))}

                    <button
                        disabled={endPage >= totalPages}
                        onClick={() => fetchUsers(endPage, size, search, sort)}
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
                        teamOptions={teamOptions}
                        positionOptions={positionOptions}
                        roleOptions={roleOptions}
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
        </AppLayout>
    );
};

export default UserList;