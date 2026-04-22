// React
import { useEffect, useState } from "react";

// 외부/공통 컴포넌트
import AppLayout from "../components/layout/AppLayout";

// 페이지 전용 컴포넌트
import RoleSearch from "../components/role/RoleSearch";
import RoleTable from "../components/role/RoleTable";
import RoleDetailForm from "../components/role/RoleDetailForm";

// 공통 UI
import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";

// API
import { getRoles, createRole, updateRole, deleteRole } from "../api/roleApi";

// hooks
import useToast from "../hooks/useToast";
import useConfirm from "../hooks/useConfirm";

// styles
import "../styles/layout.css";
import "../styles/form.css";
import "../styles/table.css";


const RoleList = () => {
    // ===== State =====
    const [roles, setRoles] = useState([]);
    
    const [search, setSearch] = useState({
        roleName: ""
    });
    
    const [sort, setSort] = useState({
        field: "roleId",
        direction: "desc"
    });
    
    const DEFAULT_SIZE = 10;
    const [size, setSize] = useState(DEFAULT_SIZE);
    
    const [loading, setLoading] = useState(false);
    
    const [detail, setDetail] = useState({
        roleId: "",
        roleName: "",
        description: ""
    });
    
    const [selectedId, setSelectedId] = useState(null);
    const [checkedIds, setCheckedIds] = useState([]);
    
    const { toast, showError, showSuccess, showInfo, showWarning, clearToast } = useToast();
    const { confirm, openConfirm, closeConfirm, handleConfirm } = useConfirm();
    
    const [currentPage, setCurrentPage] = useState([]);
    const [totalPages, setTotalPages] = useState([]);


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

        fetchRoles(0, size, search, sort)
            .then(() => {
                showSuccess("조회 완료");
            });
    };

    const handleReset = () => {
        const resetSearch = {
            roleName: ""
        };

        const resetSort = {
            field: "roleId",
            direction: "desc"
        };

        setSearch(resetSearch);
        setSort(resetSort);
        setSize(DEFAULT_SIZE);

        setCheckedIds([]);
        resetDetailForm();
        setCurrentPage(0);

        fetchRoles(0, DEFAULT_SIZE, resetSearch, resetSort)
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
            setCheckedIds(roles.map((role) => role.roleId));
        } else {
            setCheckedIds([]);
        }
    };

    const handleSelectRow = (role) => {
        setSelectedId(role.roleId);

        setDetail({
            roleId: role.roleId || "",
            roleName: role.roleName || "",
            description: role.description || ""
        });
    }; 

    const handleAdd = () => {
        setCheckedIds([]);
        resetDetailForm();
        showInfo("신규 입력 상태입니다.");
    };

    const handleSave = () => {
        if (!detail.roleName) {
            showError("권한명은 필수입니다.");
            return;
        }

        const userData = {
            roleName: detail.roleName,
            description: detail.description
        };

        if (selectedId) {
            updateRole(selectedId, userData)
                .then(() => {
                    showSuccess("수정 완료");
                    fetchRoles(currentPage, size, search, sort);
                })
                .catch((err) => {
                    console.error(err);
                    showError(err, "수정 중 오류 발생");
                });
        } else {
            createRole(userData)
                .then(() => {
                    showSuccess("등록 완료");
                    fetchRoles(0, size, search, sort);
                    resetDetailForm();
                })
                .catch((err) => {
                    console.error(err);
                    showError(err, "등록 중 오류 발생");
                });
        }
    }; 

    const confirmDelete = (targetIds) => {
        Promise.all(targetIds.map((id) => deleteRole(id)))
            .then(() => {
                showSuccess("삭제 완료");
                setCheckedIds([]);
                fetchRoles(currentPage, size, search, sort);

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
        let targetIds = [];

        if (checkedIds.length > 0) {
            targetIds = [...checkedIds];
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
        setDetail((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const resetDetailForm = () => {
        setSelectedId(null);
        setDetail({
            roleId: "",
            roleName: "",
            description: ""
        });
    };

    const fetchRoles = (
        page = 0,
        pageSize = size,
        searchParams = search,
        sortParams = sort
    ) => {
        const params = {
            roleName: searchParams.roleName || undefined,
            page,
            size: pageSize,
            sortField: sortParams.field,
            sortDirection: sortParams.direction
        }

        setLoading(true);

        return getRoles(params)
            .then((res) => {
                setRoles(res.data.content);
                setCurrentPage(res.data.page);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "권한 목록 조회 실패");
                throw err;
            })
            .finally(() => {
                setLoading(false);
            });
    };


    // ===== useEffect =====
    useEffect(() => {
        fetchRoles(currentPage, size, search, sort);
    }, [currentPage, size, sort]);

    return (
        <AppLayout title="권한 관리">
            <div className="page">
                <div className="section">
                    <RoleSearch
                        search={search}
                        onChangeSearch={handleSearchChange}
                        handleSearch={handleSearch}
                        handleReset={handleReset}
                        loading={loading}
                    />
                </div>

                <div className="section">
                    <RoleTable
                        roles={roles}
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
                    onChangePage={(page) => fetchRoles(page, size, search, sort)}
                />

                <div className="section">
                    <RoleDetailForm
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
                    onClose={clearToast}
                />

                <ConfirmModal
                    open={confirm.open}
                    message={confirm.message}
                    onCancel={closeConfirm}
                    onConfirm={handleConfirm}
                />
            </div>
        </AppLayout>
    );
};

export default RoleList;