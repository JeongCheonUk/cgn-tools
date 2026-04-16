export type BroadcastDateType = "same" | "sunday" | "tuesday" | "wednesday";

// 실제 사용 시 이 파일을 programs.ts로 복사하고 데이터를 채워주세요.

// 요일별 주간 업로드 스케줄 (1=월, 2=화, 3=수, 4=목, 5=금)
export const weeklySchedule: {
  [key: number]: { name: string; codeName: string; broadcastDate: BroadcastDateType }[];
} = {
  1: [
    { name: "프로그램A", codeName: "PRGA_", broadcastDate: "same" },
    { name: "프로그램B", codeName: "PRGB", broadcastDate: "sunday" },
  ],
  3: [
    { name: "프로그램A", codeName: "PRGA_", broadcastDate: "same" },
    { name: "프로그램C", codeName: "PRGC", broadcastDate: "tuesday" },
  ],
};

// 경로생성기 / 모니터링 프로그램 목록
export const categories: {
  [key: string]: { name: string; code: number; codeName: string }[];
} = {
  카테고리1: [
    { name: "프로그램A", code: 1, codeName: "PRGA" },
    { name: "프로그램B", code: 2, codeName: "PRGB" },
  ],
  카테고리2: [
    { name: "프로그램C", code: 3, codeName: "PRGC" },
    { name: "프로그램D", code: 4, codeName: "PRGD" },
  ],
};
