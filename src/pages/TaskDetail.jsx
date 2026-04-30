// React
import { useEffect, useState } from "react";

// API
import { getTask } from "../api/taskApi";
import { getTeams } from "../api/teamApi";
import { getTaskStatuses } from "../api/taskStatusApi";

// hooks
import useToast from "../hooks/useToast";

// styles
import "../styles/layout.css";
import "../styles/form.css";
import "../styles/task.css";

import UserSelectField from "../components/common/UserSelectField";
import { PRIORITY_OPTIONS, withEmptyOption } from "../constants/optionUtils";

const emptyTask = {
    title: "",
    statusId: "",
    priority: "",
    progress: 0,
    teamId: "",
    assigneeId: "",
    assigneeName: "",
    parentTaskId: "",
    startDate: "",
    dueDate: "",
    description: ""
};

const TaskDetail = ({ taskId, openTab }) => {
    const [task, setTask] = useState(emptyTask);
    const [teams, setTeams] = useState([]);
    const [taskStatuses, setTaskStatuses] = useState([]);
    const [isDirty, setIsDirty] = useState(false);

    const { showError } = useToast();

    const handleChange = (field, value) => {
        setIsDirty(true);

        setTask((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBackToList = () => {
        if (isDirty) {
            const confirmed = window.confirm(
                "변경사항이 있습니다. 저장하지 않고 목록으로 이동하시겠습니까?"
            );

            if (!confirmed) return;
        }

        openTab("tasks", "업무 관리");
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

    const fetchTaskStatusOptions = () => {
        return getTaskStatuses()
            .then((res) => {
                setTaskStatuses(res.data);
            })
            .catch((err) => {
                console.error(err);
                showError(err, "상태 목록 조회 실패");
            });
    };

    useEffect(() => {
        fetchTeamOptions();
        fetchTaskStatusOptions();

        if (!taskId) {
            setTask(emptyTask);
            setIsDirty(false);
            return;
        }

        getTask(taskId)
            .then((res) => {
                setTask({
                    ...emptyTask,
                    ...res.data
                });
                setIsDirty(false);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [taskId]);

    const teamOptions = teams.map((team) => ({
        value: String(team.teamId),
        label: team.teamName
    }));

    const taskStatusOptions = taskStatuses.map((taskStatus) => ({
        value: String(taskStatus.statusId),
        label: taskStatus.statusName
    }));

    return (
        <div className="page task-detail-page">
            <div className="section">
                <div className="detail-box section-card">
                    <div className="detail-header">
                        <h3>{taskId ? "업무 상세" : "업무 등록"}</h3>

                        <div className="detail-button-group">
                            <button className="button button-primary" type="button">
                                저장
                            </button>

                            {taskId && (
                                <button className="button button-delete" type="button">
                                    삭제
                                </button>
                            )}

                            <button
                                className="button"
                                type="button"
                                onClick={handleBackToList}
                            >
                                목록
                            </button>
                        </div>
                    </div>

                    <div className="detail-grid">
                        <div className="detail-field detail-col-4">
                            <label className="form-label required">업무명</label>
                            <input
                                className="form-input"
                                value={task.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                            />
                        </div>

                        <div className="detail-field detail-col-4">
                            <label className="form-label">상위업무명</label>
                            <input
                                className="form-input"
                                value={task.parentTaskId}
                                onChange={(e) => handleChange("parentTaskId", e.target.value)}
                            />
                        </div>

                        <div className="detail-field detail-col-1">
                            <label className="form-label">상태</label>
                            <select
                                className="form-select"
                                value={task.statusId}
                                onChange={(e) => handleChange("statusId", e.target.value)}
                            >
                                {withEmptyOption(taskStatusOptions, "선택").map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="detail-field detail-col-1">
                            <label className="form-label">우선순위</label>
                            <select
                                className="form-select"
                                value={task.priority}
                                onChange={(e) => handleChange("priority", e.target.value)}
                            >
                                {withEmptyOption(PRIORITY_OPTIONS, "선택").map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="detail-field detail-col-1">
                            <label className="form-label">진행률</label>
                            <input
                                className="form-input"
                                type="number"
                                value={task.progress}
                                onChange={(e) => handleChange("progress", e.target.value)}
                            />
                        </div>

                        <div className="detail-field detail-col-1">
                            <label className="form-label">기간</label>
                            <div className="detail-field-inline">
                                <input
                                    className="form-input"
                                    type="date"
                                    value={task.startDate}
                                    onChange={(e) => handleChange("startDate", e.target.value)}
                                />
                                <span>~</span>
                                <input
                                    className="form-input"
                                    type="date"
                                    value={task.dueDate}
                                    onChange={(e) => handleChange("dueDate", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="detail-field detail-col-1">
                            <label className="form-label">담당팀</label>
                            <select
                                className="form-select"
                                value={task.teamId}
                                onChange={(e) => handleChange("teamId", e.target.value)}
                            >
                                {withEmptyOption(teamOptions, "선택").map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="detail-field detail-col-1">
                            <label className="form-label">담당자</label>
                            <UserSelectField
                                employeeNo={task.assigneeId}
                                userName={task.assigneeName}
                                onChangeEmployeeNo={(value) => handleChange("assigneeId", value)}
                                onChangeUserName={(value) => handleChange("assigneeName", value)}
                            />
                        </div>

                        <div className="detail-col-4 task-file-section">
                            <div className="task-file-row">
                                <label className="form-label">첨부파일1</label>
                                <button className="task-file-link" type="button">
                                    첨부파일명이 표시됩니다.pdf
                                </button>
                                <button className="button task-file-button" type="button">파일선택</button>
                                <button className="button task-file-button" type="button">파일삭제</button>
                            </div>

                            <div className="task-file-row">
                                <label className="form-label">첨부파일2</label>
                                <button className="task-file-link" type="button">
                                    첨부파일명이 표시됩니다.pdf
                                </button>
                                <button className="button task-file-button" type="button">파일선택</button>
                                <button className="button task-file-button" type="button">파일삭제</button>
                            </div>
                        </div>

                        <div className="detail-field detail-col-4">
                            <label className="form-label">업무 내용</label>
                            <textarea
                                className="form-input form-textarea"
                                value={task.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                            />
                        </div>

                        <div className="detail-field detail-col-4">
                            <label className="form-label">업무 기록</label>
                            <textarea
                                className="form-input form-textarea"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;