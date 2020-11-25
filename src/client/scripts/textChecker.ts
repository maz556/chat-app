import FormType from "../../server/formEnum";

function checkText(inputText: string): FormType {
    console.log("::: Running checkText :::", inputText);
    if (!(inputText && /\S/.test(inputText))) {
        return FormType.INV;
    }
    if (/https?:\/\/*.*/.test(inputText)) {
        return FormType.URL;
    }
    return FormType.TEXT;
}

export { checkText as default };
