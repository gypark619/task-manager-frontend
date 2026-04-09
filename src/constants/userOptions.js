export const TEAM_OPTIONS = [
    { value: "", label: "선택" },
    { value: "1", label: "개발팀" },
    { value: "2", label: "총무팀" },
    { value: "3", label: "디자인팀" }
];

export const POSITION_OPTIONS = [
    { value: "", label: "선택" },
    { value: "1", label: "사원" },
    { value: "2", label: "대리" },
    { value: "3", label: "과장" },
    { value: "4", label: "부장" }
];

export const STATUS_OPTIONS = [
    { value: "", label: "선택" },
    { value: "ACTIVE", label: "재직" },
    { value: "SUSPENDED", label: "휴직" },
    { value: "INACTIVE", label: "퇴직" }
];

export const getOptionLabel = (options, value) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const found = options.find(
        (option) => option.value === String(value)
    );

    return found ? found.label : "";
};