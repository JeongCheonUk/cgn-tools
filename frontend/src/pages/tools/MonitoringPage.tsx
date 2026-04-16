import { useState, useRef, useEffect } from "react";
import "./tools.css";
import { categories } from "../../config/programs";

const qualityOptions = [
    { name: "고화질", code: "h1280x720" },
    { name: "중화질", code: "h854x480" },
    { name: "저화질", code: "h640x360" },
    { name: "오디오", code: "h" },
];

type CategoryKey = keyof typeof categories;

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

function MonitoringPage() {
    const [videoUrl, setVideoUrl] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");
    const [error, setError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentVolume, setCurrentVolume] = useState(0.5);

    const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("큐티");
    const [selectedProgram, setSelectedProgram] = useState(categories["큐티"][0]);
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [selectedQuality, setSelectedQuality] = useState(qualityOptions[0]);

    const handleCategoryChange = (category: CategoryKey) => {
        setSelectedCategory(category);
        const programs = categories[category];
        if (programs && programs.length > 0) {
            setSelectedProgram(programs[0]);
        }
    };

    const handleVolumeChange = () => {
        if (videoRef.current) {
            setCurrentVolume(videoRef.current.volume);
        }
    };

    useEffect(() => {
        if (currentUrl && videoRef.current) {
            videoRef.current.volume = currentVolume;
            videoRef.current.load();
            videoRef.current.play().catch((err) => {
                console.log("자동 재생 실패:", err);
            });
        }
    }, [currentUrl, currentVolume]);

    const generateUrl = () => {
        const [year, month, day] = selectedDate.split("-");
        const yearShort = year.slice(2);
        const dateStr = `${yearShort}${month}${day}`;
        const url = `https://${import.meta.env.VITE_CLOUDFRONT_VIDEO_DOMAIN}/_NewMP4/${selectedProgram.code}/${selectedProgram.codeName}${dateStr}.${selectedQuality.code}.mp4`;
        setVideoUrl(url);
        setError(false);
        setCurrentUrl(url);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (videoUrl.trim()) {
            let url = videoUrl.trim();
            if (url.startsWith('/')) {
                url = `https://${import.meta.env.VITE_CLOUDFRONT_VIDEO_DOMAIN}${url}`;
            } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = `https://${url}`;
            }
            setError(false);
            setCurrentUrl(url);
        }
    };

    const currentPrograms = categories[selectedCategory];

    return (
        <div className="page-container">
            <div className="options-container">
                <div className="option-group">
                    <label>카테고리 선택</label>
                    <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value as CategoryKey)} className="select-input">
                        {Object.keys(categories).map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="option-group">
                    <label>프로그램 선택</label>
                    <select value={selectedProgram.name} onChange={(e) => { const p = currentPrograms.find((p) => p.name === e.target.value); if (p) setSelectedProgram(p); }} className="select-input">
                        {currentPrograms.map((program) => (
                            <option key={program.code} value={program.name}>{program.name}</option>
                        ))}
                    </select>
                </div>
                <div className="option-group">
                    <label>날짜 선택</label>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="date-input" min="2020-01-01" max="2030-12-31" />
                </div>
                <div className="option-group">
                    <label>화질</label>
                    <select value={selectedQuality.name} onChange={(e) => { const q = qualityOptions.find((q) => q.name === e.target.value); if (q) setSelectedQuality(q); }} className="select-input">
                        {qualityOptions.map((quality) => (
                            <option key={quality.code} value={quality.name}>{quality.name}</option>
                        ))}
                    </select>
                </div>
                <button onClick={generateUrl} className="generate-btn">URL 생성</button>
            </div>

            <div className="video-container">
                {error && currentUrl ? <div className="error-message">없는 영상입니다</div> : null}
                {currentUrl && (
                    <video ref={videoRef} src={currentUrl} controls onError={() => setError(true)} onLoadedData={() => setError(false)} onVolumeChange={handleVolumeChange} className="video-player">
                        브라우저가 비디오 태그를 지원하지 않습니다.
                    </video>
                )}
                {!currentUrl && !error && (
                    <div className="placeholder">
                        옵션을 선택하고 URL 생성 버튼을 누르거나<br />직접 영상 URL을 입력하고 재생 버튼을 눌러주세요
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="input-form">
                <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="영상 URL을 입력하세요" className="url-input" />
                <button type="submit" className="submit-btn">재생</button>
            </form>

            <div className="info-box">
                <h3>💡 사용 방법</h3>
                <ul>
                    <li>카테고리, 프로그램, 날짜, 화질을 선택하세요</li>
                    <li>'URL 생성' 버튼을 클릭하면 자동으로 영상이 재생됩니다</li>
                    <li>직접 URL을 입력하여 재생할 수도 있습니다</li>
                    <li>영상 볼륨 상태는 세션 중 유지됩니다</li>
                </ul>
            </div>
        </div>
    );
}

export default MonitoringPage;
