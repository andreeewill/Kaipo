import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsDateLessThan(
  maxDays: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateLessThan',
      target: object.constructor,
      propertyName,
      constraints: [maxDays],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Allow empty values, use @IsNotEmpty if required

          // Validate YYYY-MM-DD format
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(value)) {
            return false;
          }

          const inputDate = new Date(value);

          // Check if date is valid
          if (isNaN(inputDate.getTime())) {
            return false;
          }

          // Get current date in UTC+8 timezone (client timezone)
          const now = new Date();
          const utc8Today = new Date(now.getTime() + 7 * 60 * 60 * 1000);
          utc8Today.setHours(0, 0, 0, 0);

          // Parse input date as UTC+8 date
          const inputDateUtc8 = new Date(value + 'T00:00:00+07:00');

          const timeDifference = inputDateUtc8.getTime() - utc8Today.getTime();
          const daysDifference = Math.ceil(
            timeDifference / (1000 * 60 * 60 * 24),
          );

          const [maxDaysConstraint] = args.constraints;

          return daysDifference <= maxDaysConstraint;
        },
        defaultMessage(args: ValidationArguments) {
          const [maxDays] = args.constraints;
          return `${args.property} tidak bisa lebih dari ${maxDays} hari dari sekarang`;
        },
      },
    });
  };
}
