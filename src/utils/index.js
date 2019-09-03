
const Utils = {
    formatCurrency (amount, decimalCount = 8, decimal = ".", thousands = ",") {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 8 : decimalCount;
    
        const negativeSign = amount < 0 ? "-" : "";
    
        let i = parseFloat(parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()).toString()
        let j = (i.length > 3) ? i.length % 3 : 0;

        let decimalPart = decimalCount ? Math.abs(amount - i).toFixed(decimalCount).slice(2) : ""
        decimalPart = '0.' + decimalPart

        if(parseFloat(decimalPart) === 0) {
            decimalPart = ''
        } else {
            decimalPart = parseFloat(decimalPart).toString().substring(1,decimalPart.length)
        }

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + decimalPart;
    }
}

export default Utils