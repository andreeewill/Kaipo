import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // Check format YYYY-MM-DD
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(value)) return false;

          const [year, month, day] = value.split('-');
          const date = new Date(+year, +month - 1, +day);

          // Verify the date components match the input (prevents invalid dates like 2023-02-31)
          const isValidDate =
            date.getDate() === +day &&
            date.getMonth() === +month - 1 &&
            date.getFullYear() === +year;

          return isValidDate && !isNaN(date.getTime());
        },
      },
    });
  };
}
