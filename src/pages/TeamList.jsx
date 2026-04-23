// React
import { useEffect, useMemo, useState } from "react";

// 페이지 전용 컴포넌트
import TeamSearch from "../components/team/TeamSearch";
import TeamTable from "../components/team/TeamTable";
import TeamDetailForm from "../components/team/TeamDetailForm";

// 공통 UI
import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";
import UserSelectModal from "../components/common/UserSelectModal";

// API
import { getTeams, createTeam, updateTeam, deleteTeam } from "../api/teamApi";

// hooks
import useToast from "../hooks/useToast";
import useConfirm from "../hooks/useConfirm";
import useUserSelectModal from "../hooks/useUserSelectModal";

// styles
import "../styles/layout.css";
import "../styles/form.css";
import "../styles/table.css";


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

    const EMPTY_DETAIL = {
        teamId: "",
        teamName: "",
        teamLeaderId: "",
        teamLeaderEmployeeNo: "",
        teamLeaderName: "",
        description: "",
        useYn: "Y"
    };

    const [detail, setDetail] = useState(EMPTY_DETAIL);
    const [originalDetail, setOriginalDetail] = useState(EMPTY_DETAIL);

    const [selectedId, setSelectedId] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [checkedIds, setCheckedIds] = useState([]);

    const { toast, showError, showSuccess, showInfo, showWarning, clearToast } = useToast();
    const { confirm, openConfirm, closeConfirm, handleConfirm } = useConfirm();

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const isDetailDisabled = !selectedId;

    const isDirty = useMemo(() => {
        return (
            detail.teamName !== originalDetail.teamName ||
            String(detail.teamLeaderId || "") !== String(originalDetail.teamLeaderId || "") ||
            detail.teamLeaderEmployeeNo !== originalDetail.teamLeaderEmployeeNo ||
            detail.teamLeaderName !== originalDetail.teamLeaderName ||
            detail.description !== originalDetail.description ||
            detail.useYn !== originalDetail.useYn
        );
    }, [detail, originalDetail]);

    const { modalOpen, initialSearch, openWithSearch, closeModal, handleSelect } =
        useUserSelectModal({
            onSelect: (user) => {
                setDetail((prev) => ({
                    ...prev,
                    teamLeaderId: user.userId,
                    teamLeaderEmployeeNo: user.employeeNo,
                    teamLeaderName: user.name
                }));
            },
            onError: () => {
                showError("사용자 조회 중 오류 발생");
            },
            onEmpty: () => {
                showInfo("조회된 사용자가 없습니다.");
            }
        });


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

    const applySelectedTeam = (team) => {
        const nextDetail = {
            teamId: team.teamId || "",
            teamName: team.teamName || "",
            teamLeaderId: team.teamLeaderId || "",
            teamLeaderEmployeeNo: team.teamLeaderEmployeeNo || "",
            teamLeaderName: team.teamLeaderName || "",
            description: team.description || "",
            useYn: team.useYn || "Y"
        };

        setIsNew(false);
        setSelectedId(team.teamId);
        setDetail(nextDetail);
        setOriginalDetail(nextDetail);
    };

    const handleSelectRow = (team) => {
        if (selectedId && team.teamId !== selectedId && (isNew || isDirty)) {
            showWarning("입력 중인 데이터가 있습니다. 저장 후 이동하세요.");
            return;
        }

        applySelectedTeam(team);
    };

    const handleAdd = () => {
        if (isNew || isDirty) {
            showWarning("입력 중인 데이터가 있습니다. 저장 후 다시 시도하세요.");
            return;
        }

        const tempTeamId = `NEW-${Date.now().toString().slice(-5)}`;

        setCheckedIds([]);
        setIsNew(true);
        setSelectedId(tempTeamId);

        setTeams((prev) => [
            {
                teamId: tempTeamId,
                teamName: "",
                teamLeaderId: "",
                teamLeaderEmployeeNo: "",
                teamLeaderName: "",
                description: "",
                useYn: "Y"
            },
            ...prev
        ]);

        setDetail(EMPTY_DETAIL);
        setOriginalDetail(EMPTY_DETAIL);

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

        if (!isNew && selectedId) {
            const focusTeamId = selectedId;

            updateTeam(selectedId, teamData)
                .then(() => {
                    showSuccess("수정 완료");
                    return fetchTeams(currentPage, size, search, sort, focusTeamId);
                })
                .catch((err) => {
                    console.error(err);
                    showError(err, "수정 중 오류 발생");
                });
        } else {
            createTeam(teamData)
                .then((res) => {
                    showSuccess("등록 완료");
                    return fetchTeams(0, size, search, sort, res.data.teamId);
                })
                .catch((err) => {
                    console.error(err);
                    showError(err, "등록 중 오류 발생");
                });
        }
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

    const handleDelete = () => {
        if (isNew && selectedId) {
            setTeams((prev) =>
                prev.filter((team) => team.teamId !== selectedId)
            );

            resetDetailForm();
            showSuccess("신규 행이 삭제되었습니다.");
            return;
        }

        let targetIds = [];

        if (checkedIds.length > 0) {
            targetIds = [...checkedIds]
        } else if (selectedId) {
            targetIds = [selectedId]
        } else {
            showError("삭제할 사용자를 선택하세요.");
            return;
        }

        openConfirm({
            message: `선택한 ${targetIds.length}건을 삭제하시겠습니까?`,
            onConfirm: () => confirmDelete(targetIds)
        });
    };

    const handleDetailChange = (field, value) => {
        setDetail((prev) => {
            const next = {
                ...prev,
                [field]: value
            };

            if (selectedId) {
                setTeams((prevTeams) =>
                    prevTeams.map((team) =>
                        team.teamId === selectedId
                            ? {
                                ...team,
                                teamName: next.teamName,
                                teamLeaderId: next.teamLeaderId,
                                teamLeaderEmployeeNo: next.teamLeaderEmployeeNo,
                                teamLeaderName: next.teamLeaderName,
                                description: next.description,
                                useYn: next.useYn
                            }
                            : team
                    )
                );
            }

            return next;
        });
    };
    
    const resetDetailForm = () => {
        setSelectedId(null);
        setIsNew(false);
        setDetail(EMPTY_DETAIL);
        setOriginalDetail(EMPTY_DETAIL);
    };

    const handleSearchLeader = () => {
        openWithSearch({
            employeeNo: detail.teamLeaderEmployeeNo || "",
            name: detail.teamLeaderName || "",
            teamId: detail.teamId || ""
        });
    };

    const fetchTeams = (
        page = 0,
        pageSize = size,
        searchParams = search,
        sortParams = sort,
        focusTeamId = null
    ) => {
        const params = {
            teamName: searchParams.teamName || undefined,
            useYn: searchParams.useYn || undefined,
            page,
            size: pageSize,
            sortField: sortParams.field,
            sortDirection: sortParams.direction
        };

        setLoading(true);

        return getTeams(params)
            .then((res) => {
                const content = res.data.content || [];

                setTeams(content);
                setCurrentPage(res.data.page);
                setTotalPages(res.data.totalPages);

                if (content.length > 0) {
                    const targetTeam = focusTeamId
                        ? content.find((team) => String(team.teamId) === String(focusTeamId))
                        : null;

                    if (targetTeam) {
                        applySelectedTeam(targetTeam);
                    } else {
                        applySelectedTeam(content[0]);
                    }
                } else {
                    resetDetailForm();
                }
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

    
    // ===== useEffect =====
    useEffect(() => {
        fetchTeams(currentPage, size, search, sort);
    }, [currentPage, size, sort]);

    return (
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

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChangePage={(page) => fetchTeams(page, size, search, sort)}
            />

            <div className="section">
                <TeamDetailForm
                    detail={detail}
                    onChangeDetail={handleDetailChange}
                    handleAdd={handleAdd}
                    handleSave={handleSave}
                    handleDelete={handleDelete}
                    handleSearchLeader={handleSearchLeader}
                    disabled={isDetailDisabled}
                />
            </div>

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={clearToast}
            />

            <ConfirmModal
                open={confirm.open}
                message={confirm.message}
                onCancel={closeConfirm}
                onConfirm={handleConfirm}
            />

            <UserSelectModal
                title="부서장 선택"
                open={modalOpen}
                initialSearch={initialSearch}
                onClose={closeModal}
                onSelect={handleSelect}
            />
        </div>
    );
};

export default TeamList;