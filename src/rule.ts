/**
 * @file Rule class for use with createRule and withMessage
 * @author Nick Krause
 */
import { Fail } from "./fail";
import { Success } from "./success";
import { CustomValidatorOptions, ValidationCheck, ValidationRule } from "./types";

class Rule<
	ValueType,
	TransformReturns = any,
	FormValues extends Record<string, any> | undefined = undefined,
> implements ValidationRule<ValueType>
{
	message: string | ((v?: ValueType) => string);
	opts: CustomValidatorOptions<ValueType, TransformReturns>;

	constructor(opts: CustomValidatorOptions<ValueType, TransformReturns>) {
		this.opts = opts;
	}

	check: ValidationCheck<ValueType, FormValues> = (value) => {
		if (this.opts.condition(value)) {
			// Rule and createRule accept an optional function (delayed) parameter
			// called transform that allows us to change the value
			// before it is passed onto the next check.
			if (this.opts.transform) {
				return Success.of(this.opts.transform(value) as Exclude<never, TransformReturns>);
			}

			return Success.of(value);
		} else {
			return typeof this.opts.message === "function"
				? Fail.of(value, [this.opts.message(value)].flat())
				: Fail.of(value, [this.opts.message].flat());
		}
	};
}

/**
 * Exposed interface to create a rule
 */
const createRule = <
	Opts extends CustomValidatorOptions<any, any>,
	FormValues extends Record<string, any> | undefined = undefined,
>(
	opts: Opts,
) => {
	return new Rule<
		Parameters<Opts["condition"]>[0],
		Opts["transform"] extends undefined ? never : ReturnType<Opts["transform"]>,
		FormValues
	>(opts);
};

/**
 * Method to overwrite the message of a rule.
 * Useful if you'd like to use a built-in, but want to change the ultimate message
 * that comes out of a failed check.
 * @param message
 */
const withMessage =
	<ValueType>(message: string | ((v?: ValueType) => string)) =>
	(rule: ValidationRule<ValueType>) =>
		new Rule({ ...rule.opts, message });

export { createRule, Rule, withMessage };
