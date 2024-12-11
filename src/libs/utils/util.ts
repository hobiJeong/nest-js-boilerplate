export const generateNanoid = async (size?: number) => {
  const { nanoid } = await import('nanoid');
  return nanoid(size);
};

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { ValueObject } from '@src/libs/ddd/value-object.base';
import { Entity } from '../ddd/entity.base';

const isEntity = (obj: unknown): obj is Entity<unknown> => {
  /**
   * 'instanceof Entity' causes error here for some reason.
   * Probably creates some circular dependency. This is a workaround
   * until I find a solution :)
   */
  return (
    Object.prototype.hasOwnProperty.call(obj, 'toObject') &&
    Object.prototype.hasOwnProperty.call(obj, 'id') &&
    ValueObject.isValueObject((obj as Entity<unknown>).id)
  );
};

const convertToPlainObject = (item: any): any => {
  if (ValueObject.isValueObject(item)) {
    return item.unpack();
  }
  if (isEntity(item)) {
    return item.toObject();
  }
  return item;
};

/**
 * Converts Entity/Value Objects props to a plain object.
 * Useful for testing and debugging.
 * @param props
 */
export const convertPropsToObject = (props: any): any => {
  const propsCopy = structuredClone(props);

  // eslint-disable-next-line guard-for-in
  for (const prop in propsCopy) {
    if (Array.isArray(propsCopy[prop])) {
      propsCopy[prop] = (propsCopy[prop] as Array<unknown>).map((item) => {
        return convertToPlainObject(item);
      });
    }
    propsCopy[prop] = convertToPlainObject(propsCopy[prop]);
  }

  return propsCopy;
};

export const isNil = (value: unknown): value is null | undefined => {
  return value === undefined || value === null;
};
