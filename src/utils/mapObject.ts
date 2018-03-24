export default function mapObject<TValue, UValue>(
  obj: { [key: string]: TValue },
  fn: (value: TValue, key: string) => UValue,
) {
  const result: { [key: string]: UValue } = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = fn(obj[key], key);
    }
  }
  return result;
}
