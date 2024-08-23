import { Type } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export class Helper {
    /**
     * Converts an API generated model to a FormGroup
     * @returns FormGroup
     */

    static apiModelToFormGroup<T>(type: Type<T>): FormGroup<{
        [Property in keyof T]: FormControl<T[Property]>;
    }> {
        if (!(type as any).fromJS) {
            console.error('Model needs .fromJS() method to be converted');

            return null as any;
        }

        const updateValues = (obj: any): boolean => {
            let hasChanges = false;

            Object.keys(obj)

                .filter((k) => k !== '_discriminator')

                .forEach((k) => {
                    if (obj[k] === undefined) {
                        obj[k] = {};

                        hasChanges = true;
                    } else if (Object.getOwnPropertyNames(obj[k]).length) {
                        hasChanges = hasChanges || updateValues(obj[k]);
                    }
                });

            return hasChanges;
        };

        const normalize = (obj: any) => {
            delete obj._discriminator;

            Object.keys(obj).forEach((k) => {
                if (Object.getOwnPropertyNames(obj[k]).length) {
                    normalize(obj[k]);
                } else {
                    obj[k] = undefined;
                }
            });
        };

        const prepareApiModel = (type: Type<T>): any => {
            let obj = (type as any).fromJS();

            let hasChanges = true;

            while (hasChanges) {
                hasChanges = updateValues(obj);

                if (hasChanges) {
                    obj = (type as any).fromJS(obj);
                }
            }

            (type as any).fromJS(normalize(obj));

            return obj;
        };

        const objectToForm = (obj: any) => {
            let formObj: any[] | FormArray<any> | FormGroup<{}>;

            if (Array.isArray(obj)) {
                formObj = [];

                obj.forEach((it) => {
                    (formObj as any[]).push(typeof it === 'object' && it.constructor.name !== 'Date' ? objectToForm(it) : new FormControl(it));
                });

                formObj = new FormArray(formObj);
            } else {
                formObj = {} as any;

                Object.keys(obj).forEach((key) => {
                    (formObj as any)[key] =
                        typeof obj[key] === 'object' && obj[key] !== null && obj[key].constructor.name !== 'Date'
                            ? objectToForm(obj[key])
                            : new FormControl(obj[key]);
                });

                formObj = new FormGroup(formObj as any);
            }

            return formObj;
        };

        const obj = prepareApiModel(type);

        delete obj._discriminator;

        return objectToForm(obj) as any;
    }

    static fillFormWithValues(formGroup: FormGroup, obj: any) {
        Object.keys(formGroup.controls).forEach((k) => {
            formGroup.get(k).setValue(obj[k]);
        });
    }

    static reorderFormGroup<T>(formGroup: FormGroup, type: Type<T>) {
        if (!(type as any).fromJS) {
            console.error('Model needs .fromJS() method to be converted');

            return null as any;
        }

        let obj = (type as any).fromJS();
        Object.keys(obj).forEach((k) => {
            const control = formGroup.get(k);
            formGroup.setControl(k, control);
        });
    }
}
