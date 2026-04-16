import { useState } from 'react';
import './tools.css';

const BIBLE_BOOKS: { [key: string]: string } = {
    '창': '창세기', '출': '출애굽기', '레': '레위기', '민': '민수기', '신': '신명기',
    '수': '여호수아', '삿': '사사기', '룻': '룻기', '삼상': '사무엘상', '삼하': '사무엘하',
    '왕상': '열왕기상', '왕하': '열왕기하', '대상': '역대상', '대하': '역대하', '스': '에스라',
    '느': '느헤미야', '에': '에스더', '욥': '욥기', '시': '시편', '잠': '잠언',
    '전': '전도서', '아': '아가', '사': '이사야', '렘': '예레미야', '애': '예레미야애가',
    '겔': '에스겔', '단': '다니엘', '호': '호세아', '욜': '요엘', '암': '아모스',
    '옵': '오바댜', '욘': '요나', '미': '미가', '나': '나훔', '합': '하박국',
    '습': '스바냐', '학': '학개', '슥': '스가랴', '말': '말라기',
    '마': '마태복음', '막': '마가복음', '눅': '누가복음', '요': '요한복음', '행': '사도행전',
    '롬': '로마서', '고전': '고린도전서', '고후': '고린도후서', '갈': '갈라디아서', '엡': '에베소서',
    '빌': '빌립보서', '골': '골로새서', '살전': '데살로니가전서', '살후': '데살로니가후서',
    '딤전': '디모데전서', '딤후': '디모데후서', '딤': '디도서', '몬': '빌레몬서', '히': '히브리서',
    '약': '야고보서', '벧전': '베드로전서', '벧후': '베드로후서', '요일': '요한일서',
    '요이': '요한이서', '요삼': '요한삼서', '유': '유다서', '계': '요한계시록',
};

const ENGLISH_BIBLE_BOOKS: { [key: string]: string } = {
    'Gen': 'Genesis', 'Ge': 'Genesis', 'Exod': 'Exodus', 'Exo': 'Exodus', 'Ex': 'Exodus',
    'Lev': 'Leviticus', 'Num': 'Numbers', 'Deut': 'Deuteronomy', 'De': 'Deuteronomy', 'Dt': 'Deuteronomy',
    'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth', 'Ru': 'Ruth',
    '1 Sam': '1 Samuel', '1Sam': '1 Samuel', '2 Sam': '2 Samuel', '2Sam': '2 Samuel',
    '1 Kgs': '1 Kings', '1Kgs': '1 Kings', '2 Kgs': '2 Kings', '2Kgs': '2 Kings',
    '1 Chr': '1 Chronicles', '1Chr': '1 Chronicles', '2 Chr': '2 Chronicles', '2Chr': '2 Chronicles',
    'Ezra': 'Ezra', 'Neh': 'Nehemiah', 'Esth': 'Esther', 'Job': 'Job',
    'Ps': 'Psalms', 'Psa': 'Psalms', 'Prov': 'Proverbs', 'Pro': 'Proverbs', 'Pr': 'Proverbs',
    'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon',
    'Isa': 'Isaiah', 'Is': 'Isaiah', 'Jer': 'Jeremiah', 'Lam': 'Lamentations',
    'Ezek': 'Ezekiel', 'Dan': 'Daniel', 'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos',
    'Jonah': 'Jonah', 'Jon': 'Jonah', 'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk',
    'Zeph': 'Zephaniah', 'Hag': 'Haggai', 'Zech': 'Zechariah', 'Mal': 'Malachi',
    'Matt': 'Matthew', 'Mat': 'Matthew', 'Mt': 'Matthew', 'Mark': 'Mark', 'Mk': 'Mark',
    'Luke': 'Luke', 'Lk': 'Luke', 'John': 'John', 'Jn': 'John', 'Acts': 'Acts',
    'Rom': 'Romans', '1 Cor': '1 Corinthians', '1Cor': '1 Corinthians', '2 Cor': '2 Corinthians', '2Cor': '2 Corinthians',
    'Gal': 'Galatians', 'Eph': 'Ephesians', 'Phil': 'Philippians', 'Col': 'Colossians',
    '1 Thess': '1 Thessalonians', '1Thess': '1 Thessalonians', '2 Thess': '2 Thessalonians', '2Thess': '2 Thessalonians',
    '1 Tim': '1 Timothy', '1Tim': '1 Timothy', '2 Tim': '2 Timothy', '2Tim': '2 Timothy',
    'Titus': 'Titus', 'Tit': 'Titus', 'Phlm': 'Philemon', 'Heb': 'Hebrews',
    'Jas': 'James', '1 Pet': '1 Peter', '1Pet': '1 Peter', '2 Pet': '2 Peter', '2Pet': '2 Peter',
    '1 John': '1 John', '1John': '1 John', '2 John': '2 John', '3 John': '3 John',
    'Jude': 'Jude', 'Rev': 'Revelation', 'Re': 'Revelation',
};

function TextParserPage() {
    const [inputText, setInputText] = useState('');
    const [parsedText, setParsedText] = useState('');

    const parseAndSetText = (text: string) => {
        if (!text.trim()) { setParsedText(''); return; }
        let result = text;
        const koreanPattern = /([가-힣]+)\s*(\d+):(\d+)(?:~(\d+))?/g;
        let match;
        while ((match = koreanPattern.exec(text)) !== null) {
            const [fullMatch, bookAbbr, chapter, startVerse, endVerse] = match;
            const bookName = BIBLE_BOOKS[bookAbbr];
            if (bookName) {
                let replacement = `${bookName} ${chapter}장 ${startVerse}절`;
                if (endVerse) replacement += `~${endVerse}절`;
                result = result.replace(fullMatch, replacement);
            }
        }
        const englishPattern = /([1-3]?\s?[A-Za-z]+)\.?\s+(\d+):(\d+)(?:[-~](\d+))?/g;
        while ((match = englishPattern.exec(result)) !== null) {
            const [fullMatch, bookAbbr, chapter, startVerse, endVerse] = match;
            const cleanedAbbr = bookAbbr.trim().replace(/\.$/, '');
            const bookName = ENGLISH_BIBLE_BOOKS[cleanedAbbr];
            if (bookName) {
                let replacement = `${bookName} ${chapter}:${startVerse}`;
                if (endVerse) replacement += `-${endVerse}`;
                result = result.replace(fullMatch, replacement);
            }
        }
        setParsedText(result);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value.replace(/\n/g, '');
        setInputText(value);
        parseAndSetText(value);
    };

    return (
        <div className="page-container">
            <h2 className="page-title">본문 파싱</h2>
            <div className="parser-section">
                <div className="parser-input-area">
                    <label className="parser-label">약어 입력 (한글/영어)</label>
                    <textarea value={inputText} onChange={handleInputChange} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} placeholder="예: 사 12:3~5 또는 Gen 1:1" className="parser-textarea" rows={1} />
                </div>
                {parsedText && (
                    <div className="parser-output-area">
                        <label className="parser-label">변환 결과</label>
                        <div className="parser-result">{parsedText}</div>
                    </div>
                )}
                <div className="parser-examples">
                    <h3>💡 사용 방법</h3>
                    <ul>
                        <li>한글 또는 영어 성경 약어를 입력하면 자동으로 변환됩니다</li>
                        <li>한글 형식: [약어] [장]:[절] 또는 [약어] [장]:[절]~[절]</li>
                        <li>영어 형식: [약어] [장]:[절] 또는 [약어] [장]:[절]-[절]</li>
                    </ul>
                    <h3 style={{ marginTop: '24px' }}>예시</h3>
                    <ul>
                        <li><code>사 12:3~5</code> → 이사야 12장 3절~5절</li>
                        <li><code>마 5:10</code> → 마태복음 5장 10절</li>
                        <li><code>Gen 1:1</code> → Genesis 1:1</li>
                        <li><code>1 Cor 13:4-7</code> → 1 Corinthians 13:4-7</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TextParserPage;
