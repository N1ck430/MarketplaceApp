export class TableColumn {
    id: string;
    textTranslationKey: string;
    sortValue?: any;

    constructor(id: string, textTranslationKey: string, sortValue?: any) {
        this.id = id;
        this.textTranslationKey = textTranslationKey;
        this.sortValue = sortValue;
    }
}
