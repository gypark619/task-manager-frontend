import { useEffect, useState } from "react";

import TeamSearch from "../components/team/TeamSearch";
import TeamTable from "../components/team/TeamTable";
import TeamDetailForm from "../components/team/TeamDetailForm";

import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";

import AppLayout from "../components/layout/AppLayout";

import UserSelectModal from "../components/common/UserSelectModal";

import "../styles/layout.css";
import "../styles/form.css";
import "../styles/table.css";

import { getTeams, createTeam, updateTeam, deleteTeam } from "../api/teamApi";
import { getUsers } from "../api/userApi";

import useToast from "../hooks/useToast";

const TeamList = () => {
    // ===== State =====
    const [teams, setTeams] = useState([]);

    const [search, setSearch] = useState({
        teamName: "",
        useYn: ""
    });

    const [sort, setSort] = useState({
        field: "teamId",
        direction: "desc"
    });

    const DEFAULT_SIZE = 10;
    const [size, setSize] = useState(DEFAULT_SIZE);

    const [loading, setLoading] = useState(false);

    const [detail, setDetail] = useState({
        teamId: "",
        teamName: "",
        teamLeaderId: "",
        teamLeaderEmployeeNo: "",
        teamLeaderName: "",
        description: "",
        useYn: "Y"
    });

    const [selectedId, setSelectedId] = useState(null);
    const [checkedIds, setCheckedIds] = useState([]);

    const { toast, showError, showSuccess, showInfo, showWarning, clearToast } = useToast();

    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);

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
        
        fetchTeams(0, size, search, sort)
            .then(() => {
                showSuccess("조회 완료");
            });
    };

    const handleReset = () => {
        const resetSearch = {
            teamName: "",
            useYn: ""
        }

        const resetSort = {
            field: "teamId",
            direction: "desc"
        };

        setSearch(resetSearch);
        setSort(resetSort);
        setSize(DEFAULT_SIZE);

        setCheckedIds([]);
        resetDetailForm();
        setCurrentPage(0);

        fetchTeams(0, DEFAULT_SIZE, resetSearch, resetSort)
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
            teamLeaderEmployeeNo: team.teamLeaderEmployeeNo || "",
            teamLeaderName: team.teamLeaderName || "",
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

        const teamData = {
            teamName: detail.teamName,
            teamLeaderId: detail.teamLeaderId,
            description: detail.description,
            useYn: detail.useYn
        };

        if (selectedId) {
            updateTeam(selectedId, teamData)
                .then(() => {
                    showSuccess("수정 완료");
                    fetchTeams(currentPage, size, search, sort);
                })
                .catch((err) => {
                    console.error(err);
                    showError(err, "수정 중 오류 발생");
                });
        } else {
            createTeam(teamData)
                .then(() => {
                    showSuccess("등록 완료");
                    fetchTeams(0, size, search, sort);
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
            targetIds = [...checkedIds]
        } else if (selectedId) {
            targetIds = [selectedId]
        } else {
            showError("삭제할 사용자를 선택하세요.");
            return;
        }

        setConfirmMessage(`선택한 ${targetIds.length}건을 삭제하시겠습니까?`);
        setConfirmAction(() => () => confirmDelete(targetIds));
        setConfirmOpen(true);
    };

    const confirmDelete = (targetIds) => {
        Promise.all(targetIds.map((id) => deleteTeam(id)))
            .then(() => {
                showSuccess("삭제 완료");
                setCheckedIds([]);
                fetchTeams(currentPage, size, search, sort);

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
            teamLeaderEmployeeNo: "",
            teamLeaderName: "",
            description: "",
            useYn: "Y"
        });
    };

    const handleSearchLeader = () => {
        const params = {
            employeeNo: detail.teamLeaderEmployeeNo || "",
            name: detail.teamLeaderName || "",
            teamId: detail.teamId || "",
            page: 0,
            size: 10
        };

        getUsers(params).then((res) => {
            const users = res.data.content || [];

            if (users.length === 1) {
                const user = users[0];
                setDetail((prev) => ({
                    ...prev,
                    teamLeaderId: user.userId,
                    teamLeaderEmployeeNo: user.employeeNo,
                    teamLeaderName: user.name
                }));
                return;
            }

            setModalOpen(true);
        });
    };

    const fetchTeams = (
        page = 0, 
        pageSize = size, 
        searchParams = search, 
        sortParams = sort
    ) => {
        const params = {
            teamName: searchParams.teamName || undefined,
            useYn: searchParams.useYn || undefined,
            page,
            size: pageSize,
            sortField: sortParams.field,
            sortDirection: sortParams.direction
        }

        setLoading(true);

        return getTeams(params)
            .then(res => {
                setTeams(res.data.content);
                setCurrentPage(res.data.page);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "부서 목록 조회 실패");
                throw err;
            })
            .finally(() => {
                setLoading(false);
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

    
    // ===== useEffect =====
    useEffect(() => {
        fetchTeams(currentPage, size, search, sort);
    }, [currentPage, size, sort]);

    return (
        <AppLayout title="부서 관리">
            <div className="page">
                <div className="section">
                    <TeamSearch
                        search={search}
                        onChangeSearch={handleSearchChange}
                        handleSearch={handleSearch}
                        handleReset={handleReset}
                        loading={loading}
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
                        sort={sort}
                        onChangeSort={handleSortChange}
                        size={size}
                        onChangeSize={handleSizeChange}
                    />
                </div>

                <div className="pagination">
                    <button
                        disabled={startPage === 0}
                        onClick={() => fetchTeams(startPage - 1, size, search, sort)}
                    >
                        이전
                    </button>

                    {/* 페이지 번호 */}
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => fetchTeams(page, size, search, sort)}
                            className={currentPage === page ? "active" : ""}
                        >
                            {page + 1}
                        </button>
                    ))}

                    <button
                        disabled={endPage >= totalPages}
                        onClick={() => fetchTeams(endPage, size, search, sort)}
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
                        handleSearchLeader={handleSearchLeader}
                    />
                </div>

                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={clearToast}
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

                {modalOpen && (
                    <UserSelectModal
                        title="부서장 선택"
                        initialSearch={{
                            teamId: detail.teamId || "",
                            employeeNo: detail.teamLeaderEmployeeNo || "",
                            name: detail.teamLeaderName || ""
                        }}
                        onClose={() => setModalOpen(false)}
                        onSelect={(user) => {
                            setDetail((prev) => ({
                                ...prev,
                                teamLeaderId: user.userId,
                                teamLeaderEmployeeNo: user.employeeNo,
                                teamLeaderName: user.name
                            }));
                            setModalOpen(false);
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
};

export default TeamList;