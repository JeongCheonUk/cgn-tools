import { useState } from "react";
import "./tools.css";
import { weeklySchedule, type BroadcastDateType } from "../../config/programs";

const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

const getWeekDates = (): Date[] => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return Array.from({ length: 5 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return date;
    });
};

const getDateStr = (date: Date): string => {
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
};

const formatDisplayDate = (date: Date): string => `${date.getMonth() + 1}/${date.getDate()}`;

const getBroadcastDate = (uploadDate: Date, type: BroadcastDateType): Date => {
    const dayOfWeek = uploadDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(uploadDate);
    monday.setDate(uploadDate.getDate() + diff);
    switch (type) {
        case "same": return new Date(uploadDate);
        case "sunday": { const d = new Date(monday); d.setDate(monday.getDate() - 1); return d; }
        case "tuesday": { const d = new Date(monday); d.setDate(monday.getDate() + 1); return d; }
        case "wednesday": { const d = new Date(monday); d.setDate(monday.getDate() + 2); return d; }
    }
};

const getThumbnailUrl = (codeName: string, date: Date, specialDawn = false): string => {
    let dateStr = getDateStr(date);
    if (specialDawn && codeName === "DawnService_") {
        const year = String(date.getFullYear()).slice(2);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        dateStr = `${year}-${month}${day}`;
    }
    const thumbDomain = import.meta.env.VITE_CLOUDFRONT_THUMB_DOMAIN;
    return `https://${thumbDomain}/thumb/${codeName}${dateStr}.png`;
};

function ImageUploadPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<{ success: boolean; filename?: string; message?: string } | null>(null);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
    const [specialDawn, setSpecialDawn] = useState(false);
    const [lightbox, setLightbox] = useState<{ url: string; name: string } | null>(null);

    const weekDates = getWeekDates();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "image/png") {
                setUploadResult({ success: false, message: "PNG 파일만 업로드 가능합니다." });
                setSelectedFile(null);
                setPreviewUrl(null);
                return;
            }
            setSelectedFile(file);
            setUploadResult(null);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) { setUploadResult({ success: false, message: "파일을 선택해주세요." }); return; }
        const originalFilename = selectedFile.name.replace(/\.png$/i, "");
        setUploading(true);
        setUploadResult(null);
        try {
            const formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("filename", originalFilename);
            const workersUrl = import.meta.env.VITE_WORKERS_URL || ''
            const response = await fetch(`${workersUrl}/api/upload`, { method: "POST", body: formData });
            const data = await response.json();
            if (response.ok) {
                setUploadResult({ success: true, filename: data.filename || `${originalFilename}.png`, message: "업로드 성공!" });
            } else {
                setUploadResult({ success: false, message: data.error || "업로드 실패" });
            }
        } catch (error) {
            console.error("업로드 에러:", error);
            setUploadResult({ success: false, message: "업로드 중 오류가 발생했습니다." });
        } finally {
            setUploading(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadResult(null);
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const getCdnUrl = () => uploadResult?.filename ? `https://${import.meta.env.VITE_CLOUDFRONT_THUMB_DOMAIN}/thumb/${uploadResult.filename}` : "";

    return (
        <>
        <div className="page-container">
            <h2 className="page-title">썸네일 이미지 업로드</h2>
            <div className="upload-page-layout">
                <div className="upload-left-panel">
                    <div className="simple-upload-section">
                        {!uploadResult?.success && (
                            <>
                                <div className="file-select-area">
                                    <input id="file-input" type="file" accept="image/png" onChange={handleFileChange} className="file-input" />
                                </div>
                                {previewUrl && (
                                    <div className="preview-container">
                                        <p className="preview-label">미리보기</p>
                                        <img src={previewUrl} alt="미리보기" className="preview-image" />
                                        <p className="file-name">파일명: {selectedFile?.name}</p>
                                    </div>
                                )}
                                <div className="upload-button-area">
                                    <button onClick={handleUpload} disabled={!selectedFile || uploading} className="large-upload-btn">
                                        {uploading ? "업로드 중..." : "업로드"}
                                    </button>
                                </div>
                            </>
                        )}
                        {uploadResult && (
                            <div className={`upload-result-box ${uploadResult.success ? "success" : "error"}`}>
                                {uploadResult.success ? (
                                    <>
                                        <div className="result-icon">✅</div>
                                        <h3 className="result-title">업로드 성공!</h3>
                                        <div className="cdn-image-container">
                                            <p className="cdn-image-label">업로드된 이미지</p>
                                            <img src={getCdnUrl()} alt="업로드된 이미지" className="cdn-image" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                                            <p className="cdn-url">{getCdnUrl().replace("https://", "")}</p>
                                        </div>
                                        <button onClick={handleReset} className="reset-btn">새 파일 업로드</button>
                                    </>
                                ) : (
                                    <>
                                        <div className="result-icon">❌</div>
                                        <h3 className="result-title">업로드 실패</h3>
                                        <p className="result-message">{uploadResult.message}</p>
                                        <button onClick={handleReset} className="reset-btn">다시 시도</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="info-box">
                        <h3>💡 사용 방법</h3>
                        <ul>
                            <li>PNG 이미지 파일을 선택하세요</li>
                            <li>'업로드' 버튼을 클릭하면 S3에 자동으로 저장됩니다</li>
                            <li>업로드 성공 시 CDN에서 이미지를 확인할 수 있습니다</li>
                            <li>같은 파일명으로 업로드하면 덮어쓰기 됩니다</li>
                        </ul>
                    </div>
                </div>
                <div className="weekly-checker-panel">
                    <div className="weekly-checker-header">
                        <h3 className="weekly-checker-title">이번주 업로드 현황</h3>
                        <button className={`dawn-toggle-btn${specialDawn ? " active" : ""}`} onClick={() => { setSpecialDawn((v) => !v); setFailedImages(new Set()); }}>
                            {specialDawn ? "작은예수 40일" : "일반 새벽기도"}
                        </button>
                    </div>
                    {weekDates.map((date) => {
                        const dayOfWeek = date.getDay();
                        const programs = weeklySchedule[dayOfWeek];
                        if (!programs) return null;
                        return (
                            <div key={dayOfWeek} className="weekly-day-section">
                                <div className="weekly-day-header">
                                    <span className="day-name">{dayNames[dayOfWeek]}요일</span>
                                    <span className="day-date">{formatDisplayDate(date)}</span>
                                </div>
                                <div className="thumbnail-grid">
                                    {programs.map((program) => {
                                        const broadcastDate = getBroadcastDate(date, program.broadcastDate);
                                        const url = getThumbnailUrl(program.codeName, broadcastDate, specialDawn);
                                        const isSpecialKey = specialDawn && program.codeName === "DawnService_";
                                        const year = String(broadcastDate.getFullYear()).slice(2);
                                        const month = String(broadcastDate.getMonth() + 1).padStart(2, "0");
                                        const day = String(broadcastDate.getDate()).padStart(2, "0");
                                        const keyDateStr = isSpecialKey ? `${year}-${month}${day}` : getDateStr(broadcastDate);
                                        const key = `${program.codeName}-${keyDateStr}`;
                                        const failed = failedImages.has(key);
                                        return (
                                            <div key={key} className="thumbnail-card">
                                                {!failed ? (
                                                    <img src={url} alt={program.name} className="thumbnail-img" onError={() => setFailedImages((prev) => new Set(prev).add(key))} onClick={() => setLightbox({ url, name: program.name })} />
                                                ) : (
                                                    <div className="thumbnail-placeholder">미업로드</div>
                                                )}
                                                <span className="thumbnail-name">{program.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
        {lightbox && (
            <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
                <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                    <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
                    <img src={lightbox.url} alt={lightbox.name} className="lightbox-img" />
                    <p className="lightbox-name">{lightbox.name}</p>
                </div>
            </div>
        )}
        </>
    );
}

export default ImageUploadPage;
