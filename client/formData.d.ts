// FormData 타입 확장 (Ambient Modules 참고)
declare global {
  interface FormDataValue {
    uri: string;
    name: string;
    type?: string;
  }

  interface FormData {
    append(name: string, value: FormDataValue, fileName?: string): void;
    set(name: string, value: FormDataValue, fileName?: string): void;
  }
}
export {};
