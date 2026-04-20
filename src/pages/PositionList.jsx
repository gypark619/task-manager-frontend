import { useEffect, useState } from "react";

import PositionSearch from "../components/position/PositionSearch";
import PositionTable from "../components/position/PositionTable";
import PositionDetailForm from "../components/position/PositionDetailForm";

import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";

import AppLayout from "../components/layout/AppLayout";

import "../styles/layout.css";
import "../styles/form.css";
import "../styles/table.css";

import { getPositions, createPosition, updatePosition, deletePosition } from "../api/positionApi";

const PositionList = () => {
    // ===== State =====
    const [positions, setPositions] = useState([]);
    
    const [search, setSearch] = useState({
        positionName: "",
        useYn: ""
    });
    
    const [sort, setSort] = useState({
        field: "positionId",
        direction: "desc"
    });
    
    const DEFAULT_SIZE = 10;
    const [size, setSize] = useState(DEFAULT_SIZE);
    
    const [loading, setLoading] = useState(false);
    
    const [detail, setDetail] = useState({
        positionId: "",
        positionName: "",
        positionLevel: "",
        useYn: "Y"
    });
    
    const [selectedId, setSelectedId] = useState(null);
    const [checkedIds, setCheckedIds] = useState([]);
    
    const [toast, setToast] = useState({ message: "", type: "" });
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    
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

        fetchPositions(0, size, search, sort)
            .then(() => {
                showSuccess("조회 완료");
            });
    };

    const handleReset = () => {
        const resetSearch = {
            positionName: "",
            useYn: ""
        };

        const resetSort = {
            field: "positionId",
            direction: "desc"
        };

        setSearch(resetSearch);
        setSort(resetSort);
        setSize(DEFAULT_SIZE);

        setCheckedIds([]);
        resetDetailForm();
        setCurrentPage(0);

        fetchPositions(0, DEFAULT_SIZE, resetSearch, resetSort)
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
            setCheckedIds(positions.map((position) => position.positionId));
        } else {
            setCheckedIds([]);
        }
    };

    const handleSelectRow = (position) => {
        setSelectedId(position.positionId);

        setDetail({
            positionId: position.positionId || "",
            positionName: position.positionName || "",
            positionLevel: position.positionLevel || "",
            useYn: position.useYn || "Y"
        });
    }; 

    const handleAdd = () => {
        setCheckedIds([]);
        resetDetailForm();
        showInfo("신규 입력 상태입니다.");
    };

    const handleSave = () => {
        if (!detail.positionName || !detail.positionLevel || !detail.useYn) {
            showError("직급명, 직급 레벨, 사용여부는 필수입니다.");
            return;
        }

        const userData = {
            positionName: detail.positionName,
            positionLevel: detail.positionLevel ? Number(detail.positionLevel) : null,
            useYn: detail.useYn
        };

        if (selectedId) {
            updatePosition(selectedId, userData)
                .then(() => {
                    showSuccess("수정 완료");
                    fetchPositions(currentPage, size, search, sort);
                })
                .catch((err) => {
                    console.error(err);
                    showError(err, "수정 중 오류 발생");
                });
        } else {
            createPosition(userData)
                .then(() => {
                    showSuccess("등록 완료");
                    fetchPositions(0, size, search, sort);
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
        Promise.all(targetIds.map((id) => deletePosition(id)))
            .then(() => {
                showSuccess("삭제 완료");
                setCheckedIds([]);
                fetchPositions(currentPage, size, search, sort);

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
            positionId: "",
            positionName: "",
            positionLevel: "",
            useYn: "Y"
        });
    };

    const fetchPositions = (
        page = 0,
        pageSize = size,
        searchParams = search,
        sortParams = sort
    ) => {
        const params = {
            positionName: searchParams.positionName || undefined,
            useYn: searchParams.useYn || undefined,
            page,
            size: pageSize,
            sortField: sortParams.field,
            sortDirection: sortParams.direction
        }

        setLoading(true);

        return getPositions(params)
            .then((res) => {
                setPositions(res.data.content);
                setCurrentPage(res.data.page);
                setTotalPages(res.data.totalPages);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "직급 목록 조회 실패");
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
        fetchPositions(currentPage, size, search, sort);
    }, [currentPage, size, sort]);

    return (
        <AppLayout title="직급 관리">
            <div className="page">
                <div className="section">
                    <PositionSearch
                        search={search}
                        onChangeSearch={handleSearchChange}
                        handleSearch={handleSearch}
                        handleReset={handleReset}
                        loading={loading}
                    />
                </div>

                <div className="section">
                    <PositionTable
                        positions={positions}
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
                        onClick={() => fetchPositions(startPage - 1, size, search, sort)}
                    >
                        이전
                    </button>

                    {/* 페이지 번호 */}
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => fetchPositions(page, size, search, sort)}
                            className={currentPage === page ? "active" : ""}
                        >
                            {page + 1}
                        </button>
                    ))}

                    <button
                        disabled={endPage >= totalPages}
                        onClick={() => fetchPositions(endPage, size, search, sort)}
                    >
                        다음
                    </button>
                </div>

                <div className="section">
                    <PositionDetailForm
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

export default PositionList;