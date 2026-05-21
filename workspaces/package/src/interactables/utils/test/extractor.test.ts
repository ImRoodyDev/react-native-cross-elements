import {extractPadding} from '../extractor';

describe('extractPadding', () => {
	it('should handle no padding', () => {
		expect(extractPadding({})).toEqual({
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		});
	});

	it('should handle padding as a number', () => {
		expect(extractPadding({padding: 10})).toEqual({
			top: 10,
			right: 10,
			bottom: 10,
			left: 10,
		});
	});

	it('should handle padding as a string', () => {
		expect(extractPadding({padding: '10px'})).toEqual({
			top: '10px',
			right: '10px',
			bottom: '10px',
			left: '10px',
		});
	});

	it('should handle padding with different units', () => {
		expect(extractPadding({padding: '10px 5px 15px 20px'})).toEqual({
			top: '10px',
			right: '5px',
			bottom: '15px',
			left: '20px',
		});
	});

	it('should handle padding with shorthand notation', () => {
		expect(extractPadding({padding: '10px 5px'})).toEqual({
			top: '10px',
			right: '5px',
			bottom: '10px',
			left: '5px',
		});
	});

	it('should handle paddingVertical and paddingHorizontal', () => {
		expect(extractPadding({paddingVertical: 10, paddingHorizontal: 20})).toEqual({
			top: 10,
			right: 20,
			bottom: 10,
			left: 20,
		});
	});

	it('should handle paddingTop, paddingRight, paddingBottom, paddingLeft', () => {
		expect(
			extractPadding({
				paddingTop: 10,
				paddingRight: 20,
				paddingBottom: 30,
				paddingLeft: 40,
			})
		).toEqual({
			top: 10,
			right: 20,
			bottom: 30,
			left: 40,
		});
	});

	it('should handle topPadding, rightPadding, bottomPadding, leftPadding', () => {
		expect(
			extractPadding({
				topPadding: 10,
				rightPadding: 20,
				bottomPadding: 30,
				leftPadding: 40,
			})
		).toEqual({
			top: 10,
			right: 20,
			bottom: 30,
			left: 40,
		});
	});

	it('should handle mixed padding properties', () => {
		expect(
			extractPadding({
				padding: 5,
				paddingTop: 10,
				rightPadding: 20,
				paddingBottom: 30,
				leftPadding: 40,
			})
		).toEqual({
			top: 10,
			right: 20,
			bottom: 30,
			left: 40,
		});
	});

	it('should handle paddingStart and paddingEnd', () => {
		expect(
			extractPadding({
				paddingStart: 10,
				paddingEnd: 20,
			})
		).toEqual({
			top: 0,
			right: 20,
			bottom: 0,
			left: 10,
		});
	});

	it('should handle paddingX and paddingY', () => {
		expect(
			extractPadding({
				paddingX: 10,
				paddingY: 20,
			})
		).toEqual({
			top: 20,
			right: 10,
			bottom: 20,
			left: 10,
		});
	});

	it('should handle aliases p, px, py, pt, pr, pb, pl', () => {
		expect(
			extractPadding({
				p: 5,
				px: 10,
				py: 15,
				pt: 20,
				pr: 25,
				pb: 30,
				pl: 35,
			})
		).toEqual({
			top: 20,
			right: 25,
			bottom: 30,
			left: 35,
		});
	});

	it('should handle mixed values and aliases with correct precedence', () => {
		expect(
			extractPadding({
				padding: 5,
				px: 10,
				paddingVertical: 15,
				pt: 20,
				rightPadding: 25,
			})
		).toEqual({
			top: 20,
			right: 25,
			bottom: 15,
			left: 10,
		});
	});

	it('should handle trackStyle array', () => {
		expect(extractPadding([{padding: 5}, {paddingTop: 10}])).toEqual({
			top: 10,
			right: 5,
			bottom: 5,
			left: 5,
		});
	});

	it('should handle null and undefined values', () => {
		expect(extractPadding({paddingTop: null, paddingRight: undefined, paddingBottom: 0})).toEqual({
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		});
	});

	it('should handle rem values', () => {
		expect(extractPadding({padding: '1rem'})).toEqual({
			top: '1rem',
			right: '1rem',
			bottom: '1rem',
			left: '1rem',
		});
	});
});

