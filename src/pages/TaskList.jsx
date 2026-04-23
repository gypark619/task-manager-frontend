// React
import { useEffect, useState } from "react";

// 페이지 전용 컴포넌트
import TaskSearch from "../components/task/TaskSearch";
import TaskTable from "../components/task/TaskTable";

// 공통 UI
import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";
import UserSelectModal from "../components/common/UserSelectModal";

// API
import { getTasks, deleteTask } from "../api/taskApi";
import { getTeams } from "../api/teamApi";

// hooks
import useToast from "../hooks/useToast";
import useConfirm from "../hooks/useConfirm";
import useUserSelectModal from "../hooks/useUserSelectModal";

// styles
import "../styles/layout.css";
import "../styles/form.css";
import "../styles/table.css";


const TaskList = () => {
    // ===== State =====
    const [tasks, setTasks] = useState([]);

    const [teams, setTeams] = useState([]);
    
    const [search, setSearch] = useState({
        title: "",
        statusId: "",
        teamId: "",
        assigneeId: "",
        assigneeName: "",
        startDate: "",
        dueDate: ""
    });
    
    const [sort, setSort] = useState({
        field: "taskId",
        direction: "desc"
    });
    
    const DEFAULT_SIZE = 10;
    const [size, setSize] = useState(DEFAULT_SIZE);
    
    const [loading, setLoading] = useState(false);
    
    const [selectedId, setSelectedId] = useState(null);
    const [checkedIds, setCheckedIds] = useState([]);
    
    const { toast, showError, showSuccess, showInfo, showWarning, clearToast } = useToast();
    const { confirm, openConfirm, closeConfirm, handleConfirm } = useConfirm();
    
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const deleteDisabled = tasks.length === 0;

    const { modalOpen, initialSearch, openWithSearch, closeModal, handleSelect } =
        useUserSelectModal({
            onSelect: (user) => {
                setSearch((prev) => ({
                    ...prev,
                    assigneeId: user.userId,
                    assigneeName: user.name
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
        setSelectedId(null);

        fetchTasks(0, size, search, sort)
            .then(() => {
                showSuccess("조회 완료");
            });
    };

    const handleReset = () => {
        const resetSearch = {
            title: "",
            statusId: "",
            teamId: "",
            assigneeId: "",
            assigneeName: "",
            startDate: "",
            dueDate: ""
        };

        const resetSort = {
            field: "taskId",
            direction: "desc"
        };

        setSearch(resetSearch);
        setSort(resetSort);
        setSize(DEFAULT_SIZE);

        setCheckedIds([]);
        setSelectedId(null);
        setCurrentPage(0);

        fetchTasks(0, DEFAULT_SIZE, resetSearch, resetSort)
            .then(() => {
                showSuccess("초기화 완료");
            });
    };

    const handleSearchAssignee = () => {
        openWithSearch({
            assigneeId: search.assigneeId || "",
            assigneeName: search.assigneeName || ""
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
            setCheckedIds(tasks.map((task) => task.taskId));
        } else {
            setCheckedIds([]);
        }
    };

    const handleSelectRow = (task) => {
        setSelectedId(task.taskId);
    };

    const handleNew = () => {
        setCheckedIds([]);
        showInfo("신규 기능 준비 중입니다.");
    };

    const confirmDelete = (targetIds) => {
        Promise.all(targetIds.map((id) => deleteTask(id)))
            .then(() => {
                showSuccess("삭제 완료");
                setCheckedIds([]);
                setSelectedId(null);
                fetchTasks(currentPage, size, search, sort);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "삭제 중 오류 발생");
            });
    };

    const handleDelete = () => {
        let targetIds = [];

        if (checkedIds.length > 0) {
            targetIds = [...checkedIds];
        } else if (selectedId) {
            targetIds = [selectedId]
        } else {
            showError("삭제할 업무를 선택하세요.");
            return;
        }

        openConfirm({
            message: `선택한 ${targetIds.length}건을 삭제하시겠습니까?`,
            onConfirm: () => confirmDelete(targetIds)
        });
    };

    const fetchTasks = (
        page = 0,
        pageSize = size,
        searchParams = search,
        sortParams = sort
    ) => {
        const params = {
            title: searchParams.title || undefined,
            statusId: searchParams.statusId || undefined,
            teamId: searchParams.teamId || undefined,
            assigneeId: searchParams.assigneeId || undefined,
            assigneeName: searchParams.assigneeName || undefined,
            startDate: searchParams.startDate || undefined,
            dueDate: searchParams.dueDate || undefined,
            page,
            size: pageSize,
            sortField: sortParams.field,
            sortDirection: sortParams.direction
        };

        setLoading(true);

        return getTasks(params)
            .then((res) => {
                const content = res.data.content || [];

                setTasks(content);
                setCurrentPage(res.data.page);
                setTotalPages(res.data.totalPages);

                if (content.length > 0) {
                    setSelectedId(content[0].taskId);
                } else {
                    setSelectedId(null);
                }
            })
            .catch((err) => {
                console.error(err);
                showError(err, "업무 목록 조회 실패");
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


    // ===== useEffect =====
    useEffect(() => {
        fetchTasks(currentPage, size, search, sort);
    }, [currentPage, size, sort]);

    useEffect(() => {
        fetchTeamOptions();
    }, []);

    const teamOptions = teams.map((team) => ({
        value: String(team.teamId),
        label: team.teamName
    }));

    return (
        <div className="page">
            <div className="section">
                <TaskSearch
                    search={search}
                    onChangeSearch={handleSearchChange}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                    loading={loading}
                    teamOptions={teamOptions}
                    handleSearchAssignee={handleSearchAssignee}
                />
            </div>

            <div className="section">
                <TaskTable
                    tasks={tasks}
                    checkedIds={checkedIds}
                    selectedId={selectedId}
                    handleCheck={handleCheck}
                    handleCheckAll={handleCheckAll}
                    handleSelect={handleSelectRow}
                    sort={sort}
                    onChangeSort={handleSortChange}
                    size={size}
                    onChangeSize={handleSizeChange}
                    handleNew={handleNew}
                    handleDelete={handleDelete}
                    disabled={deleteDisabled}
                />
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChangePage={setCurrentPage}
            />

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

export default TaskList;