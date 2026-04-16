import { useState } from "react";
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

interface GeneratedUrls { [key: string]: string }

function PathGeneratorPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("큐티");
  const [selectedProgram, setSelectedProgram] = useState(categories["큐티"][0]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [generatedUrls, setGeneratedUrls] = useState<GeneratedUrls>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  };

  const getFileName = (path: string) => {
    const full = path.split("/").pop() || "";
    return full.replace(/\.(mp4|png)$/, "");
  };

  const handleCategoryChange = (category: CategoryKey) => {
    setSelectedCategory(category);
    const programs = categories[category];
    if (programs && programs.length > 0) setSelectedProgram(programs[0]);
  };

  const generateUrls = () => {
    const [year, month, day] = selectedDate.split("-");
    const yearShort = year.slice(2);
    const dateStr = selectedProgram.code === 35 ? `${yearShort}-${month}${day}` : `${yearShort}${month}${day}`;
    const urls: GeneratedUrls = {};
    const videoDomain = import.meta.env.VITE_CLOUDFRONT_VIDEO_DOMAIN;
    const thumbDomain = import.meta.env.VITE_CLOUDFRONT_THUMB_DOMAIN;
    qualityOptions.forEach((quality) => {
      urls[quality.name] = `${videoDomain}/_NewMP4/${selectedProgram.code}/${selectedProgram.codeName}${dateStr}.${quality.code}.mp4`;
    });
    urls["썸네일"] = `${thumbDomain}/thumb/${selectedProgram.codeName}${dateStr}.png`;
    setGeneratedUrls(urls);
  };

  const currentPrograms = categories[selectedCategory];
  const displayOrder = ["고화질", "중화질", "저화질", "오디오", "썸네일"];

  const getPageTitle = () => {
    if (Object.keys(generatedUrls).length === 0) return "경로 생성기";
    const [year, month, day] = selectedDate.split("-");
    return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${selectedProgram.name} (${selectedProgram.code})`;
  };

  return (
    <div className="page-container">
      <h2 className="page-title">{getPageTitle()}</h2>
      <div className="options-container">
        <div className="option-group">
          <label>카테고리 선택</label>
          <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value as CategoryKey)} className="select-input">
            {Object.keys(categories).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="option-group">
          <label>프로그램 선택</label>
          <select value={selectedProgram.name} onChange={(e) => { const p = currentPrograms.find((p) => p.name === e.target.value); if (p) setSelectedProgram(p); }} className="select-input">
            {currentPrograms.map((p) => <option key={p.code} value={p.name}>{p.name}</option>)}
          </select>
        </div>
        <div className="option-group">
          <label>날짜 선택</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="date-input" min="2020-01-01" max="2030-12-31" />
        </div>
        <button onClick={generateUrls} className="generate-btn">경로 생성</button>
      </div>

      {Object.keys(generatedUrls).length > 0 && (
        <div className="generated-urls-box">
          {displayOrder.map((qualityName) =>
            generatedUrls[qualityName] && (
              <div key={qualityName} className="url-row">
                <span className="url-label">{qualityName}</span>
                <input type="text" value={generatedUrls[qualityName]} readOnly className="url-path-input" />
                <button className={`copy-btn copy-btn-name${copiedKey === qualityName + "-name" ? " copied" : ""}`} onClick={() => copyToClipboard(getFileName(generatedUrls[qualityName]), qualityName + "-name")}>
                  {copiedKey === qualityName + "-name" ? "✓" : "파일명"}
                </button>
                <button className={`copy-btn copy-btn-path${copiedKey === qualityName + "-path" ? " copied" : ""}`} onClick={() => copyToClipboard(generatedUrls[qualityName], qualityName + "-path")}>
                  {copiedKey === qualityName + "-path" ? "✓" : "전체경로"}
                </button>
              </div>
            )
          )}
          <div className="url-row date-row">
            <span className="url-label">방영일자</span>
            <span className="date-value">{selectedDate}</span>
            <button className={`copy-btn${copiedKey === "airdate" ? " copied" : ""}`} onClick={() => copyToClipboard(selectedDate, "airdate")}>
              {copiedKey === "airdate" ? "✓" : "복사"}
            </button>
          </div>
        </div>
      )}

      <div className="info-box">
        <h3>💡 사용 방법</h3>
        <ul>
          <li>원하는 카테고리, 프로그램, 날짜를 선택하세요</li>
          <li>'경로 생성' 버튼을 클릭하면 모든 화질의 URL이 생성됩니다</li>
          <li><strong>파일명</strong> 버튼: 확장자를 제외한 파일명만 클립보드에 복사합니다</li>
          <li><strong>전체경로</strong> 버튼: 전체 URL 경로를 클립보드에 복사합니다</li>
          <li><strong>방영일자</strong> 복사 버튼: 선택한 날짜를 yyyy-MM-dd 형식으로 복사합니다</li>
        </ul>
      </div>
    </div>
  );
}

export default PathGeneratorPage;
