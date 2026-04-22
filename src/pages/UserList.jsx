// React
import { useEffect, useState } from "react";

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
import { EMAIL_DOMAIN_OPTIONS } from "../constants/optionUtils";

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

    const [detail, setDetail] = useState({
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
    });

    const [emailDomainType, setEmailDomainType] = useState("direct");

    const [selectedId, setSelectedId] = useState(null);
    const [checkedIds, setCheckedIds] = useState([]);

    const { toast, showError, showSuccess, showInfo, showWarning, clearToast } = useToast();
    const { confirm, openConfirm, closeConfirm, handleConfirm } = useConfirm();

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


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
        setSelectedId(user.userId);

        const email = user.email || "";
        const [emailId, ...domainParts] = email.split("@");

        setDetail({
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
        });

        const domain = domainParts.join("@");
        const matched = EMAIL_DOMAIN_OPTIONS.find(
            (opt) => opt.value !== "direct" && opt.value === domain
        );

        setEmailDomainType(matched ? domain : "direct");

        getUserRoles(user.userId).then(res => {
            setSelectedRoleIds(res.data.map(String));
        });
    };

    const handleAdd = () => {
        setCheckedIds([]);
        resetDetailForm();
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
    }

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

        if (selectedId) {
            updateUser(selectedId, userData)
                .then(() => handleSaveUserRoles(selectedId, selectedRoleIds))
                .then(() => {
                    showSuccess("수정 완료");
                    fetchUsers(currentPage, size, search, sort);
                })
                .catch((err) => {
                    console.error(err);
                    const message =
                        err.response?.data?.message || "수정 중 오류 발생";

                    showError(message);
                });
        } else {
            createUser(userData)
                .then((res) => handleSaveUserRoles(res.data.userId, selectedRoleIds))
                .then(() => {
                    showSuccess("등록 완료");
                    fetchUsers(0, size, search, sort);
                    resetDetailForm();
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
                fetchUsers(currentPage, size, search, sort);

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
        setDetail((prev) => ({
            ...prev,
            [field]: value
        }));
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
        setDetail({
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
        });
        setSelectedRoleIds([]);
        setEmailDomainType("direct");
    };

    const fetchUsers = (
        page = 0, 
        pageSize = size, 
        searchParams = search, 
        sortParams = sort
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
                setUsers(res.data.content);
                setCurrentPage(res.data.page);
                setTotalPages(res.data.totalPages);
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
            sortField: "positionName",
            sortDirection: "asc"
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