import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
	name: 'truncate',
	standalone: true,
})
export class TruncatePipe implements PipeTransform {
	transform(value: string, limit = 25, ellipsis = '...'): string {
		if (value.length <= limit) {
			return value;
		}
		return value.slice(0, limit) + ellipsis;
	}
}
