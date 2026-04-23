// React
import { useEffect, useMemo, useState } from "react";

// 페이지 전용 컴포넌트
import PositionSearch from "../components/position/PositionSearch";
import PositionTable from "../components/position/PositionTable";
import PositionDetailForm from "../components/position/PositionDetailForm";

// 공통 UI
import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";

// API
import { getPositions, createPosition, updatePosition, deletePosition } from "../api/positionApi";

// hooks
import useToast from "../hooks/useToast";
import useConfirm from "../hooks/useConfirm";

// styles
import "../styles/layout.css";
import "../styles/form.css";
import "../styles/table.css";


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

    const EMPTY_DETAIL = {
        positionId: "",
        positionName: "",
        positionLevel: "",
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
            detail.positionName !== originalDetail.positionName ||
            String(detail.positionLevel || "") !== String(originalDetail.positionLevel || "") ||
            detail.useYn !== originalDetail.useYn
        );
    }, [detail, originalDetail]);


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

    const applySelectedPosition = (position) => {
        const nextDetail = {
            positionId: position.positionId || "",
            positionName: position.positionName || "",
            positionLevel: position.positionLevel || "",
            useYn: position.useYn || "Y"
        };

        setIsNew(false);
        setSelectedId(position.positionId);
        setDetail(nextDetail);
        setOriginalDetail(nextDetail);
    };

    const handleSelectRow = (position) => {
        if (selectedId && position.positionId !== selectedId && (isNew || isDirty)) {
            showWarning("입력 중인 데이터가 있습니다. 저장 후 이동하세요.");
            return;
        }

        applySelectedPosition(position);
    };

    const handleAdd = () => {
        if (isNew || isDirty) {
            showWarning("입력 중인 데이터가 있습니다. 저장 후 다시 시도하세요.");
            return;
        }

        const tempPositionId = `NEW-${Date.now().toString().slice(-5)}`;

        setCheckedIds([]);
        setIsNew(true);
        setSelectedId(tempPositionId);

        setPositions((prev) => [
            {
                positionId: tempPositionId,
                positionName: "",
                positionLevel: "",
                useYn: "Y"
            },
            ...prev
        ]);

        setDetail(EMPTY_DETAIL);
        setOriginalDetail(EMPTY_DETAIL);

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

        if (!isNew && selectedId) {
            const focusPositionId = selectedId;

            updatePosition(selectedId, userData)
                .then(() => {
                    showSuccess("수정 완료");
                    return fetchPositions(currentPage, size, search, sort, focusPositionId);
                })
                .catch((err) => {
                    console.error(err);
                    showError(err, "수정 중 오류 발생");
                });
        } else {
            createPosition(userData)
                .then((res) => {
                    showSuccess("등록 완료");
                    return fetchPositions(0, size, search, sort, res.data.positionId);
                })
                .catch((err) => {
                    console.error(err);
                    showError(err, "등록 중 오류 발생");
                });
        }
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

    const handleDelete = () => {
        if (isNew && selectedId) {
            setPositions((prev) =>
                prev.filter((position) => position.positionId !== selectedId)
            );

            resetDetailForm();
            showSuccess("신규 행이 삭제되었습니다.");
            return;
        }

        let targetIds = [];

        if (checkedIds.length > 0) {
            targetIds = [...checkedIds];
        } else if (selectedId) {
            targetIds = [selectedId];
        } else {
            showError("삭제할 직급을 선택하세요.");
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
                setPositions((prevPositions) =>
                    prevPositions.map((position) =>
                        position.positionId === selectedId
                            ? {
                                ...position,
                                positionName: next.positionName,
                                positionLevel: next.positionLevel,
                                useYn: next.useYn
                            }
                            : position
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

    const fetchPositions = (
        page = 0,
        pageSize = size,
        searchParams = search,
        sortParams = sort,
        focusPositionId = null
    ) => {
        const params = {
            positionName: searchParams.positionName || undefined,
            useYn: searchParams.useYn || undefined,
            page,
            size: pageSize,
            sortField: sortParams.field,
            sortDirection: sortParams.direction
        };

        setLoading(true);

        return getPositions(params)
            .then((res) => {
                const content = res.data.content || [];

                setPositions(content);
                setCurrentPage(res.data.page);
                setTotalPages(res.data.totalPages);

                if (content.length > 0) {
                    const targetPosition = focusPositionId
                        ? content.find((position) => String(position.positionId) === String(focusPositionId))
                        : null;

                    if (targetPosition) {
                        applySelectedPosition(targetPosition);
                    } else {
                        applySelectedPosition(content[0]);
                    }
                } else {
                    resetDetailForm();
                }
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


    // ===== useEffect =====
    useEffect(() => {
        fetchPositions(currentPage, size, search, sort);
    }, [currentPage, size, sort]);

    return (
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

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChangePage={(page) => fetchPositions(page, size, search, sort)}
            />

            <div className="section">
                <PositionDetailForm
                    detail={detail}
                    onChangeDetail={handleDetailChange}
                    handleAdd={handleAdd}
                    handleSave={handleSave}
                    handleDelete={handleDelete}
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
        </div>
    );
};

export default PositionList;