/**
 * 配列からランダムに1つ要素を返す関数
 * @param arr 任意の配列
 * @returns 配列からランダムに選ばれた要素
 */
export function RandomPick<T>(arr: [T, ...T[]]): T;
export function RandomPick<T>(arr: T[]): T | undefined;
export function RandomPick<T>(arr: T[]): T | undefined {
	if (!arr.length) return undefined;
	const idx = Math.floor(Math.random() * arr.length);
	return arr[idx];
}
