import React, { useEffect, useState } from "react";

import TeamSearch from "../components/team/TeamSearch";
import TeamTable from "../components/team/TeamTable";
import TeamDetailForm from "../components/team/TeamDetailForm";

import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";

import AppLayout from "../components/layout/AppLayout";

import "./UserList.css";

import api from "../api/axios";
import { getTeams } from "../api/teamApi";

const TeamList = () => {
    // ===== State =====
    const [teams, setTeams] = useState([]);

    const [search, setSearch] = useState({
        teamName: "",
        useYn: ""
    });

    const [sort, setSort] = useState({
        field: "userId",
        direction: "desc"
    });

    const [loading, setLoading] = useState(false);

    const [detail, setDetail] = useState({
        teamId: "",
        teamName: "",
        teamLeaderId: "",
        description: "",
        useYn: "Y"
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

    const handleSortChange = (field, direction) => {};

    const handleSearch = () => {
        setCheckedIds([]);
        resetDetailForm();
        
        fetchTeams(0)
            .then(() => {
                showSuccess("조회 완료");
            });
    };

    const handleReset = () => {};

    const handleCheck = (id) => {
        setCheckedIds((prev) =>
            prev.includes(id)
                ? prev.filter((checkedId) => checkedId !== id)
                : [...prev, id]
        );
    };

    const handleCheckAll = (e) => {
        if (e.target.checked) {
            setCheckedIds(teams.map((team) => team.teamId));
        } else {
            setCheckedIds([]);
        }
    };

    const handleSelectRow = (team) => {
        setSelectedId(team.teamId);

        setDetail({
            teamId: team.teamId || "",
            teamName: team.teamName || "",
            teamLeaderId: team.teamLeaderId || "",
            description: team.description || "",
            useYn: team.useYn || "Y"
        });
    };

    const handleAdd = () => {
        setCheckedIds([]);
        resetDetailForm();
        showInfo("신규 입력 상태입니다.");
    };

    const handleSave = () => {
        if (!detail.teamName || !detail.useYn) {
            showError("부서명, 사용 여부는 필수입니다.");
            return;
        }

        if(selectedId) {
            api.put(`teams/${selectedId}`, detail)
                .then(() => {
                    showSuccess("수정 완료");
                    fetchTeams();
                })
        } else {
            api.post("/teams", detail)
                .then(() => {
                    showSuccess("등록 완료");
                    fetchTeams();
                    resetDetailForm();
                });
        }
    };

    const handleDelete = () => {
        api.delete(`/teams/${selectedId}`)
            .then(() => fetchTeams());
    };

    const handleDetailChange = (field, value) => {
        setDetail((perv) => ({
            ...perv,
            [field]: value
        }));
    };
    
    const resetDetailForm = () => {
        setSelectedId(null);
        setDetail({
            teamId: "",
            teamName: "",
            teamLeaderId: "",
            description: "",
            useYn: "Y"
        });
    };

    const fetchTeams = (page = 0) => {
        const params = {
            teamName: search.teamName || "",
            useYn: search.useYn || "",
            page,
            size: 10
        }

        return getTeams(params)
            .then(res => {
                setTeams(res.data.content)
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
        fetchTeams();
    }, []);

    return (
        <AppLayout title="부서 관리">
            <div className="page">
                <div className="section">
                    <TeamSearch
                        search={search}
                        onChangeSearch={handleSearchChange}
                        handleSearch={handleSearch}
                        handleReset={handleReset}
                    />
                </div>

                <div className="section">
                    <TeamTable
                        teams={teams}
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
                        onClick={() => fetchTeams(startPage - 1)}
                    >
                        이전
                    </button>

                    {/* 페이지 번호 */}
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => fetchTeams(page)}
                            className={currentPage === page ? "active" : ""}
                        >
                            {page + 1}
                        </button>
                    ))}

                    <button
                        disabled={endPage >= totalPages}
                        onClick={() => fetchTeams(endPage)}
                    >
                        다음
                    </button>
                </div>

                <div className="section">
                    <TeamDetailForm
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
        </AppLayout>
    );
};

export default TeamList;