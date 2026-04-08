import React, { useEffect, useState } from "react";
import api from "../api/axios";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import "./UserList.css";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [employeeNo, setEmployeeNo] = useState("");
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [checkedIds, setCheckedIds] = useState([]);

    const fetchUsers = () => {
        api.get("/users")
            .then((res) => {
                setUsers(res.data);
            })
            .catch(() => {
                showError("사용자 목록 조회 실패");
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 폼 초기화
    const resetForm = () => {
        setSelectedId(null);
        setEmployeeNo("");
        setLoginId("");
        setPassword("");
        setName("");
    };

    const handleSubmit = () => {
        if (!employeeNo || !loginId || !password || !name) {
            setError("필수값 입력");
            return;
        }

        const userData = {
            employeeNo,
            loginId,
            password,
            name
        };

        if (selectedId) {
            // 수정
            api.put(`/users/${selectedId}`, userData)
                .then(() => {
                    handleSaveSuccess("수정 완료");
                })
                .catch((err) => {
                    console.error(err);
                    showError("수정 중 오류 발생");
                });
        } else {
            // 등록
            api.post("/users", userData)
                .then(() => {
                    handleSaveSuccess("등록 완료");
                })
                .catch((err) => {
                    console.error(err);
                    showError("등록 중 오류 발생");
                });
        }
    };

    const handleSelect = (user) => {
        setSelectedId(user.id);
        setEmployeeNo(user.employeeNo || "");
        setLoginId(user.loginId || "");
        setPassword(user.password || "");
        setName(user.name || "");
        setError("");
        setSuccess("");
    };

    // 체크박스 토글
    const handleCheck = (id) => {
        setCheckedIds((prev) =>
            prev.includes(id)
                ? prev.filter((checkedId) => checkedId !== id)
                : [...prev, id]
        );
    };

    // 전체 선택
    const handleCheckAll = (e) => {
        if (e.target.checked) {
            setCheckedIds(users.map((user) => user.id));
        } else {
            setCheckedIds([]);
        }
    };

    const handleCancel = () => {
        resetForm();
        setError("");
        setSuccess("");
    };

    const showError = (message) => {
        setError(message);
        setSuccess("");
    };

    const showSuccess = (message) => {
        setSuccess(message);
        setError("");
    };

    const handleSaveSuccess = (message) => {
        showSuccess(message);
        fetchUsers();
        resetForm();
    };

    const handleDeleteUnified = () => {
        let targetIds = [];

        if (checkedIds.length > 0) {
            // 체크박스 우선
            targetIds = [...checkedIds];
        } else if (selectedId) {
            // 선택된 row
            targetIds = [selectedId];
        } else {
            showError("삭제할 사용자를 선택하세요.");
            return;
        }

        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        Promise.all(
            targetIds.map((id) => api.delete(`/users/${id}`))
        )
            .then(() => {
                showSuccess("삭제 완료");

                setCheckedIds([]);
                fetchUsers();

                if (selectedId && targetIds.includes(selectedId)) {
                    resetForm();
                }
            })
            .catch((err) => {
                console.error(err);
                showError("삭제 중 오류 발생");
            });
    };

    return (
        <div className="page">
            <h1>User List</h1>

            <div className="section">
                <UserForm
                    employeeNo={employeeNo}
                    setEmployeeNo={setEmployeeNo}
                    loginId={loginId}
                    setLoginId={setLoginId}
                    password={password}
                    setPassword={setPassword}
                    name={name}
                    setName={setName}
                    selectedId={selectedId}
                    handleSubmit={handleSubmit}
                    handleCancel={handleCancel}
                />
            </div>

            <div className="section">
                <button
                    className="button button-delete"
                    type="button"
                    onClick={handleDeleteUnified}
                    disabled={checkedIds.length === 0 && !selectedId}
                >
                    {checkedIds.length > 0
                        ? `선택 삭제 (${checkedIds.length})`
                        : "삭제"}
                </button>
            </div>

            <div className="message-area">
                <p className={error ? "message-error" : "message-success"}>
                    {error || success || "\u00A0"}
                </p>
            </div>

            <div>
                <UserTable
                    users={users}
                    checkedIds={checkedIds}
                    handleCheck={handleCheck}
                    handleCheckAll={handleCheckAll}
                    handleSelect={handleSelect}
                    selectedId={selectedId}
                />
            </div>

        </div>
    );
};

export default UserList;