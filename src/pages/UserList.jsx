// React
import { useEffect, useMemo, useState } from "react";

// 외부/공통 컴포넌트
import AppLayout from "../components/layout/AppLayout";

// 페이지 전용 컴포넌트
import UserSearch from "../components/user/UserSearch";
import UserTable from "../components/user/UserTable";
import UserDetailForm from "../components/user/UserDetailForm";

// 공통 UI
import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";

// API
import { getUsers, createUser, updateUser, deleteUser, getUserRoles, saveUserRoles } from "../api/userApi";
import { getTeams } from "../api/teamApi";
import { getPositions } from "../api/positionApi";
import { getRoles } from "../api/roleApi";

// constants
import { EMAIL_DOMAIN_OPTIONS, STATUS_OPTIONS } from "../constants/optionUtils";

// hooks
import useToast from "../hooks/useToast";
import useConfirm from "../hooks/useConfirm";

// styles
import "../styles/layout.css";
import "../styles/form.css";
import "../styles/table.css";


const UserList = () => {
    // ===== State =====
    const [users, setUsers] = useState([]);

    const [teams, setTeams] = useState([]);
    const [positions, setPositions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState([]);

    const [search, setSearch] = useState({
        name: "",
        teamId: "",
        positionId: "",
        status: ""
    });

    const [sort, setSort] = useState({
        field: "userId",
        direction: "desc"
    });

    const DEFAULT_SIZE = 10;
    const [size, setSize] = useState(DEFAULT_SIZE);

    const [loading, setLoading] = useState(false);

    const EMPTY_DETAIL = {
        userId: "",
        employeeNo: "",
        loginId: "",
        name: "",
        emailId: "",
        emailDomain: "",
        phone: "",
        officePhone: "",
        teamId: "",
        positionId: "",
        status: "ACTIVE"
    };

    const [detail, setDetail] = useState(EMPTY_DETAIL);
    const [originalDetail, setOriginalDetail] = useState(EMPTY_DETAIL);

    const [emailDomainType, setEmailDomainType] = useState("direct");

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
            detail.employeeNo !== originalDetail.employeeNo ||
            detail.loginId !== originalDetail.loginId ||
            detail.name !== originalDetail.name ||
            detail.emailId !== originalDetail.emailId ||
            detail.emailDomain !== originalDetail.emailDomain ||
            detail.phone !== originalDetail.phone ||
            detail.officePhone !== originalDetail.officePhone ||
            String(detail.teamId || "") !== String(originalDetail.teamId || "") ||
            String(detail.positionId || "") !== String(originalDetail.positionId || "") ||
            detail.status !== originalDetail.status
        );
    }, [detail, originalDetail]);

    const statusLabelMap = useMemo(() => {
        return STATUS_OPTIONS.reduce((acc, option) => {
            acc[option.value] = option.label;
            return acc;
        }, {});
    }, []);

    const teamNameMap = useMemo(() => {
        return teams.reduce((acc, team) => {
            acc[String(team.teamId)] = team.teamName;
            return acc;
        }, {});
    }, [teams]);

    const positionNameMap = useMemo(() => {
        return positions.reduce((acc, position) => {
            acc[String(position.positionId)] = position.positionName;
            return acc;
        }, {});
    }, [positions]);

    // ===== 공통 함수 =====
    const enrichUserRow = (user) => {
        return {
            ...user,
            teamName: teamNameMap[String(user.teamId)] || user.teamName || "",
            positionName: positionNameMap[String(user.positionId)] || user.positionName || "",
            statusName: statusLabelMap[user.status] || ""
        };
    };

    const applySelectedUser = (user) => {
        const email = user.email || "";
        const [emailId, ...domainParts] = email.split("@");

        const nextDetail = {
            userId: user.userId || "",
            employeeNo: user.employeeNo || "",
            loginId: user.loginId || "",
            name: user.name || "",
            emailId: emailId || "",
            emailDomain: domainParts.join("@") || "",
            phone: user.phone || "",
            officePhone: user.officePhone || "",
            teamId: user.teamId || "",
            positionId: user.positionId || "",
            status: user.status || "ACTIVE"
        };

        const matched = EMAIL_DOMAIN_OPTIONS.find(
            (opt) => opt.value !== "direct" && opt.value === nextDetail.emailDomain
        );

        setIsNew(false);
        setSelectedId(user.userId);
        setDetail(nextDetail);
        setOriginalDetail(nextDetail);
        setEmailDomainType(matched ? nextDetail.emailDomain : "direct");
    };

    const loadUserRoles = (userId) => {
        return getUserRoles(userId).then((res) => {
            setSelectedRoleIds(res.data.map(String));
        });
    };

    const createEmptyUserRow = (tempUserId) => ({
        userId: tempUserId,
        employeeNo: "",
        loginId: "",
        name: "",
        teamName: "",
        positionName: "",
        statusName: statusLabelMap.ACTIVE || "",
        email: "",
        phone: "",
        officePhone: "",
        teamId: "",
        positionId: "",
        status: "ACTIVE"
    });

    const updateUserRow = (next) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.userId === selectedId
                    ? {
                        ...user,
                        employeeNo: next.employeeNo,
                        loginId: next.loginId,
                        name: next.name,
                        phone: next.phone,
                        officePhone: next.officePhone,
                        teamId: next.teamId,
                        positionId: next.positionId,
                        status: next.status,
                        email:
                            next.emailId || next.emailDomain
                                ? `${next.emailId}${next.emailDomain ? `@${next.emailDomain}` : ""}`
                                : "",
                        teamName: teamNameMap[String(next.teamId)] || "",
                        positionName: positionNameMap[String(next.positionId)] || "",
                        statusName: statusLabelMap[next.status] || ""
                    }
                    : user
            )
        );
    };

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

        fetchUsers(0, size, search, sort)
            .then(() => {
                showSuccess("조회 완료");
            });
    };

    const handleReset = () => {
        const resetSearch = {
            name: "",
            teamId: "",
            positionId: "",
            status: ""
        };

        const resetSort = {
            field: "userId",
            direction: "desc"
        };
        
        setSearch(resetSearch);
        setSort(resetSort);
        setSize(DEFAULT_SIZE);

        setCheckedIds([]);
        resetDetailForm();
        setCurrentPage(0);

        fetchUsers(0, DEFAULT_SIZE, resetSearch, resetSort)
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
            setCheckedIds(users.map((user) => user.userId));
        } else {
            setCheckedIds([]);
        }
    };

    const handleSelectRow = (user) => {
        if (selectedId && user.userId !== selectedId && (isNew || isDirty)) {
            showWarning("입력 중인 데이터가 있습니다. 저장 후 이동하세요.");
            return;
        }

        applySelectedUser(user);
        loadUserRoles(user.userId);
    };

    const handleAdd = () => {
        if (isNew || isDirty) {
            showWarning("입력 중인 데이터가 있습니다. 저장 후 다시 시도하세요.");
            return;
        }

        const tempUserId = `NEW-${Date.now().toString().slice(-5)}`;

        setCheckedIds([]);
        setIsNew(true);
        setSelectedId(tempUserId);

        setUsers((prev) => [createEmptyUserRow(tempUserId), ...prev]);

        setDetail(EMPTY_DETAIL);
        setOriginalDetail(EMPTY_DETAIL);
        setSelectedRoleIds([]);
        setEmailDomainType("direct");

        showInfo("신규 입력 상태입니다.");
    };

    const handleRoleCheck = (roleId, checked) => {
        const id = String(roleId);

        setSelectedRoleIds((prev) =>
            checked
                ? prev.includes(id) ? prev : [...prev, id]
                : prev.filter((v) => v !== id)
        );
    };

    const handleSaveUserRoles = (userId, roleIds) => {
        return saveUserRoles(userId, roleIds);
    };

    const isValidEmail = (email = "") => {
        if (!email) {
            return true;
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSave = () => {
        if (!detail.employeeNo || !detail.loginId || !detail.name) {
            showError("사번, 로그인ID, 이름은 필수입니다.");
            return;
        }

        const emailId = detail.emailId.trim();
        const emailDomain = detail.emailDomain.trim();

        const email =
            emailId || emailDomain
                ? `${emailId}${emailDomain ? `@${emailDomain}` : ""}`
                : "";

        if ((emailId && !emailDomain) || (!emailId && emailDomain)) {
            showError("이메일 아이디와 도메인을 모두 입력하세요.");
            return;
        }

        if (email && !isValidEmail(email)) {
            showError("이메일 형식이 올바르지 않습니다.");
            return;
        }

        const userData = {
            employeeNo: detail.employeeNo,
            loginId: detail.loginId,
            name: detail.name,
            email: email,
            phone: detail.phone,
            officePhone: detail.officePhone,
            teamId: detail.teamId ? Number(detail.teamId) : null,
            positionId: detail.positionId ? Number(detail.positionId) : null,
            status: detail.status
        };

        if (!isNew && selectedId) {
            const focusUserId = selectedId;

            updateUser(selectedId, userData)
                .then(() => handleSaveUserRoles(selectedId, selectedRoleIds))
                .then(() => {
                    showSuccess("수정 완료");
                    return fetchUsers(currentPage, size, search, sort, focusUserId);
                })
                .catch((err) => {
                    console.error(err);
                    const message =
                        err.response?.data?.message || "수정 중 오류 발생";

                    showError(message);
                });
        } else {
            let createdUserId = null;

            createUser(userData)
                .then((res) => {
                    createdUserId = res.data.userId;
                    return handleSaveUserRoles(createdUserId, selectedRoleIds);
                })
                .then(() => {
                    showSuccess("등록 완료");
                    return fetchUsers(0, size, search, sort, createdUserId);
                })
                .catch((err) => {
                    console.error(err);
                    const message =
                        err.response?.data?.message || "등록 중 오류 발생";

                    showError(message);
                });
        }
    };
    
    const confirmDelete = (targetIds) => {
        Promise.all(targetIds.map((id) => deleteUser(id)))
            .then(() => {
                showSuccess("삭제 완료");
                setCheckedIds([]);
                return fetchUsers(currentPage, size, search, sort);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "삭제 중 오류 발생");
            });
    };

    const handleDelete = () => {
        if (isNew && selectedId) {
            setUsers((prev) =>
                prev.filter((user) => user.userId !== selectedId)
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
                updateUserRow(next);
            }

            return next;
        });
    };

    const handleEmailIdChange = (value) => {
        handleDetailChange("emailId", value);
    };

    const handleEmailDomainChange = (value) => {
        handleDetailChange("emailDomain", value);
    };

    const handleEmailDomainTypeChange = (value) => {
        setEmailDomainType(value);

        if (value === "direct") return;

        handleDetailChange("emailDomain", value);
    };

    const resetDetailForm = () => {
        setSelectedId(null);
        setIsNew(false);
        setDetail(EMPTY_DETAIL);
        setOriginalDetail(EMPTY_DETAIL);
        setSelectedRoleIds([]);
        setEmailDomainType("direct");
    };

    const fetchUsers = (
        page = 0, 
        pageSize = size, 
        searchParams = search, 
        sortParams = sort,
        focusUserId = null
    ) => {
        const params = {
            name: searchParams.name || undefined,
            teamId: searchParams.teamId ? Number(searchParams.teamId) : undefined,
            positionId: searchParams.positionId ? Number(searchParams.positionId) : undefined,
            status: searchParams.status || undefined,
            page,
            size: pageSize,
            sortField: sortParams.field,
            sortDirection: sortParams.direction
        };

        setLoading(true);

        return getUsers(params)
            .then((res) => {
                const content = (res.data.content || []).map((user) => enrichUserRow(user));

                setUsers(content);
                setCurrentPage(res.data.page);
                setTotalPages(res.data.totalPages);

                if (content.length > 0) {
                    const targetUser = focusUserId
                        ? content.find((user) => String(user.userId) === String(focusUserId))
                        : null;

                    if (targetUser) {
                        applySelectedUser(targetUser);
                        return loadUserRoles(targetUser.userId);
                    } else {
                        applySelectedUser(content[0]);
                        return loadUserRoles(content[0].userId);
                    }
                } else {
                    resetDetailForm();
                }
            })
            .catch((err) => {
                console.error(err);
                showError(err, "사용자 목록 조회 실패");
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

    const fetchPositionOptions = () => {
        return getPositions({
            page: 0,
            size: 100,
            sortField: "positionLevel",
            sortDirection: "desc"
        })
            .then((res) => {
                setPositions(res.data.content);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "직급 목록 조회 실패");
            });
    };

    const fetchRoleOptions = () => {
        return getRoles({
            page: 0,
            size: 100,
            sortField: "roleName",
            sortDirection: "asc"
        })
            .then((res) => {
                setRoles(res.data.content);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "권한 목록 조회 실패");
            });
    };

    
    // ===== useEffect =====
    useEffect(() => {
        fetchUsers(currentPage, size, search, sort);
        fetchTeamOptions();
        fetchPositionOptions();
        fetchRoleOptions();
    }, [currentPage, size, sort]);

    const teamOptions = teams.map((team) => ({
        value: String(team.teamId),
        label: team.teamName
    }));

    const positionOptions = positions.map((position) => ({
        value: String(position.positionId),
        label: position.positionName
    }));

    const roleOptions = roles.map((role) => ({
        value: String(role.roleId),
        label: role.roleName
    }));

    return (
        <AppLayout title="사용자 관리">
            <div className="page">
                <div className="section">
                    <UserSearch
                        search={search}
                        onChangeSearch={handleSearchChange}
                        handleSearch={handleSearch}
                        handleReset={handleReset}
                        loading={loading}
                        teamOptions={teamOptions}
                        positionOptions={positionOptions}
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
                        sort={sort}
                        onChangeSort={handleSortChange}
                        size={size}
                        onChangeSize={handleSizeChange}
                    />
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChangePage={(page) => fetchUsers(page, size, search, sort)}
                />

                <div className="section">
                    <UserDetailForm
                        detail={detail}
                        onChangeDetail={handleDetailChange}
                        handleAdd={handleAdd}
                        handleSave={handleSave}
                        handleDelete={handleDelete}
                        teamOptions={teamOptions}
                        positionOptions={positionOptions}
                        roleOptions={roleOptions}
                        selectedRoleIds={selectedRoleIds}
                        handleRoleCheck={handleRoleCheck}
                        emailDomainType={emailDomainType}
                        emailDomainOptions={EMAIL_DOMAIN_OPTIONS}
                        onChangeEmailId={handleEmailIdChange}
                        onChangeEmailDomain={handleEmailDomainChange}
                        onChangeEmailDomainType={handleEmailDomainTypeChange}
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
        </AppLayout>
    );
};

export default UserList;