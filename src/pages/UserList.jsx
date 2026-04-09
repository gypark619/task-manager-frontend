import React, { useEffect, useState } from "react";
import api from "../api/axios";
import UserSearch from "../components/UserSearch";
import UserTable from "../components/UserTable";
import UserDetailForm from "../components/UserDetailForm";
import "./UserList.css";

const UserList = () => {
    const [users, setUsers] = useState([]);

    const [searchName, setSearchName] = useState("");
    const [searchLoginId, setSearchLoginId] = useState("");

    const [detailId, setDetailId] = useState("");
    const [detailEmployeeNo, setDetailEmployeeNo] = useState("");
    const [detailLoginId, setDetailLoginId] = useState("");
    const [detailPassword, setDetailPassword] = useState("");
    const [detailName, setDetailName] = useState("");

    const [selectedId, setSelectedId] = useState(null);
    const [checkedIds, setCheckedIds] = useState([]);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        setDetailId("");
        setDetailEmployeeNo("");
        setDetailLoginId("");
        setDetailPassword("");
        setDetailName("");
    };

    const fetchUsers = () => {
        api.get("/users")
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => {
                console.error(err);
                showError("사용자 목록 조회 실패");
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
                        !searchName || (user.name || "").includes(searchName);

                    const matchLoginId =
                        !searchLoginId || (user.loginId || "").includes(searchLoginId);

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
        setSearchName("");
        setSearchLoginId("");

        setCheckedIds([]);
        resetDetailForm();

        fetchUsers();   // 전체 목록 다시 조회
        showSuccess("초기화 완료");
    };

    const handleSelectRow = (user) => {
        setSelectedId(user.id);
        setDetailId(user.id || "");
        setDetailEmployeeNo(user.employeeNo || "");
        setDetailLoginId(user.loginId || "");
        setDetailPassword(user.password || "");
        setDetailName(user.name || "");
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
        if (!detailEmployeeNo || !detailLoginId || !detailPassword || !detailName) {
            showError("사번, 로그인ID, 비밀번호, 이름은 필수입니다.");
            return;
        }

        const userData = {
            employeeNo: detailEmployeeNo,
            loginId: detailLoginId,
            password: detailPassword,
            name: detailName
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
                    searchName={searchName}
                    setSearchName={setSearchName}
                    searchLoginId={searchLoginId}
                    setSearchLoginId={setSearchLoginId}
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
                    detailId={detailId}
                    detailEmployeeNo={detailEmployeeNo}
                    detailLoginId={detailLoginId}
                    detailPassword={detailPassword}
                    detailName={detailName}
                    setDetailEmployeeNo={setDetailEmployeeNo}
                    setDetailLoginId={setDetailLoginId}
                    setDetailPassword={setDetailPassword}
                    setDetailName={setDetailName}
                    handleAdd={handleAdd}
                    handleSave={handleSave}
                    handleDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default UserList;