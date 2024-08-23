import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Color } from '@ionic/core';

export class TableButton {
    icon?: IconProp;
    translationKey: string;
    color?: Color;

    constructor(translationKey: string, icon?: IconProp, color?: Color) {
        this.translationKey = translationKey;
        this.icon = icon;
        this.color = color;
    }
}
