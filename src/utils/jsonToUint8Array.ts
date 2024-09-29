export default function jsonToUint8Array(jsonData: JSON): Uint8Array {
  // JSON 객체를 문자열로 변환
  const jsonString: string = JSON.stringify(jsonData);

  // 문자열을 UTF-8로 인코딩된 Uint8Array로 변환
  const encoder = new TextEncoder();
  return encoder.encode(jsonString);
}
