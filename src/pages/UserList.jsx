import React, { useEffect, useState } from "react";
import api from "../api/axios";
import UserSearch from "../components/UserSearch";
import UserTable from "../components/UserTable";
import UserDetailForm from "../components/UserDetailForm";
import "./UserList.css";

const UserList = () => {
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState({
        name: "",
        loginId: ""
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

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSearchChange = (field, value) => {
        setSearch((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDetailChange = (field, value) => {
        setDetail((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const showError = (message) => {
        setError(message);
        setSuccess("");
    };

    const showSuccess = (message) => {
        setSuccess(message);
        setError("");
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

    const fetchUsers = () => {
        return api.get("/users")
            .then((res) => {
                setUsers(res.data);
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
        api.get("/users")
            .then((res) => {
                const filteredUsers = res.data.filter((user) => {
                    const matchName =
                        !search.name || (user.name || "").includes(search.name);

                    const matchLoginId =
                        !search.loginId || (user.loginId || "").includes(search.loginId);

                    return matchName && matchLoginId;
                });

                setUsers(filteredUsers);
                setCheckedIds([]);
                resetDetailForm();
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
            loginId: ""
        });

        setCheckedIds([]);
        resetDetailForm();

        fetchUsers()
            .then(() => {
                showSuccess("초기화 완료");
            });
    };

    const handleSelectRow = (user) => {
        setSelectedId(user.id);
        
        setDetail({
            userId: user.id || "",
            employeeNo: user.employeeNo || "",
            loginId: user.loginId || "",
            password: user.password || "",
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            officePhone: user.officePhone || "",
            teamId: user.teamId || "",
            positionId: user.positionId || "",
            status: user.status || "ACTIVE"
        });

        setError("");
        setSuccess("");
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
            setCheckedIds(users.map((user) => user.id));
        } else {
            setCheckedIds([]);
        }
    };

    const handleAdd = () => {
        setCheckedIds([]);
        resetDetailForm();
        showSuccess("신규 입력 상태입니다.");
    };

    const handleSave = () => {
        if (!detail.employeeNo || !detail.loginId || !detail.password || !detail.name) {
            showError("사번, 로그인ID, 비밀번호, 이름은 필수입니다.");
            return;
        }

        const userData = {
            employeeNo: detail.employeeNo,
            loginId: detail.loginId,
            password: detail.password,
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
                    showError("수정 중 오류 발생");
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

        if (!window.confirm("정말 삭제하시겠습니까?")) return;

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
                showError("삭제 중 오류 발생");
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

            <div className="message-area">
                <p className={error ? "message-error" : "message-success"}>
                    {error || success || "\u00A0"}
                </p>
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
        </div>
    );
};

export default UserList;