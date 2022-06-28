
import { camelCase, snakeCase } from "lodash";

// Recursively convert object keys into cameCase
// Solution found from: https://stackoverflow.com/a/50620653
export const camelCaseKeys: any = (obj: any) => {
	if (Array.isArray(obj)) {
		return obj.map((v) => camelCaseKeys(v));
	} else if (obj != null && obj.constructor === Object) {
		return Object.keys(obj).reduce(
			(result, key) => ({
				...result,
				[camelCase(key)]: camelCaseKeys(obj[key]),
			}),
			{}
		);
	}
	return obj;
};

// Recursively convert objets keys into snake_case
export const snakeCaseKeys: any = (obj: any) => {
	if (Array.isArray(obj)) {
		return obj.map((v) => snakeCaseKeys(v));
	} else if (obj != null && obj.constructor === Object) {
		return Object.keys(obj).reduce(
			(result, key) => ({
				...result,
				[snakeCase(key)]: snakeCaseKeys(obj[key]),
			}),
			{}
		);
	}
	return obj;
};
