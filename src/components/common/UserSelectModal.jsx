import { useEffect, useState } from "react";
import { getUsers } from "../../api/userApi";
import { getTeams } from "../../api/teamApi";
import "../../styles/form.css";
import "./UserSelectModal.css";

import {
    withEmptyOption
} from "../../constants/optionUtils";

function UserSelectModal({ title = "사용자 선택", initialSearch, onClose, onSelect }) {
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);

    const [search, setSearch] = useState({
        employeeNo: initialSearch?.employeeNo || "",
        name: initialSearch?.name || "",
        teamId: initialSearch?.teamId || "",
        positionId: ""
    });

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const handleChange = (key, value) => {
        setSearch((prev) => ({ ...prev, [key]: value }));
    };

    const fetchUsers = (pageParam = page, searchParam = search) => {
        getUsers({ ...searchParam, page: pageParam, size: 10 }).then((res) => {
            setUsers(res.data.content);
            setPage(res.data.page);
            setTotalPages(res.data.totalPages);
        });
    };

    useEffect(() => {
        const nextSearch = {
            employeeNo: initialSearch?.employeeNo || "",
            name: initialSearch?.name || "",
            teamId: initialSearch?.teamId || "",
            positionId: ""
        };

        setSearch(nextSearch);

        getUsers({ ...nextSearch, page: 0, size: 10 }).then(res => {
            setUsers(res.data.content);
            setPage(res.data.page);
            setTotalPages(res.data.totalPages);
        });

        getTeams({ size: 1000 }).then(res => {
            setTeams(res.data.content);
        });
    }, [initialSearch]);

    const teamOptions = teams.map(team => ({
        value: String(team.teamId),
        label: team.teamName
    }));

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                </div>

                <div className="modal-body">
                    <div className="modal-search-box">
                        <div className="modal-search-row">
                            <div className="modal-search-fields">
                                <div className="modal-search-item">
                                    <label className="form-label">사번</label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        value={search.employeeNo}
                                        onChange={(e) => handleChange("employeeNo", e.target.value)}
                                    />
                                </div>

                                <div className="modal-search-item">
                                    <label className="form-label">이름</label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        value={search.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                    />
                                </div>

                                <div className="modal-search-item">
                                    <label className="form-label">부서</label>
                                    <select
                                        className="form-select"
                                        value={search.teamId}
                                        onChange={(e) => handleChange("teamId", e.target.value)}
                                    >
                                        {withEmptyOption(teamOptions, "전체").map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="modal-search-actions">
                                <button
                                    type="button"
                                    className="button button-primary"
                                    onClick={() => {
                                        setPage(0);
                                        fetchUsers(0);
                                    }}
                                >
                                    조회
                                </button>
                                <button
                                    type="button"
                                    className="button"
                                    onClick={() => {
                                        const resetSearch = {
                                            employeeNo: "",
                                            name: "",
                                            teamId: "",
                                            positionId: ""
                                        };
                                        setSearch(resetSearch);
                                        setPage(0);
                                        fetchUsers(0, resetSearch);
                                    }}
                                >
                                    초기화
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="modal-table-box">
                        <div className="modal-table-header">
                            <h3 className="modal-table-title">사용자 목록</h3>
                        </div>

                        <div className="modal-table-container">
                            <table className="modal-data-table">
                                <thead>
                                    <tr>
                                        <th className="modal-text-center">사번</th>
                                        <th className="modal-text-center">이름</th>
                                        <th className="modal-text-center">부서</th>
                                        <th className="modal-text-center">직급</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user.userId}
                                            className="modal-data-row"
                                            onClick={() => onSelect(user)}
                                        >
                                            <td className="modal-text-center">{user.employeeNo}</td>
                                            <td className="modal-text-left">{user.name}</td>
                                            <td className="modal-text-center">{user.teamName || ""}</td>
                                            <td className="modal-text-center">{user.positionName || ""}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <div className="modal-pagination">
                        <button
                            type="button"
                            className="modal-page-button"
                            disabled={page === 0}
                            onClick={() => fetchUsers(page - 1)}
                        >
                            이전
                        </button>

                        <span className="modal-page-info">{page + 1} / {totalPages}</span>

                        <button
                            type="button"
                            className="modal-page-button"
                            disabled={page + 1 >= totalPages}
                            onClick={() => fetchUsers(page + 1)}
                        >
                            다음
                        </button>
                    </div>

                    <button
                        type="button"
                        className="button"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserSelectModal;