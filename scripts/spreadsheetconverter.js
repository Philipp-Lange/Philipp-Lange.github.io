var spreadUnits = 1;

function convertDate(date) {
    var parts = date.split('/');
    if (parts[2].length == 2) {
        parts[2] = '20' + parts[2];
    }
    return parts[0] + '/' + parts[1] + '/' + parts[2];
}

async function convertSpreadsheet() {
    const file = document.getElementById('file-upload').files[0];
    const data = await file.arrayBuffer();
    var workbook = XLSX.read(data);
    var worksheet = workbook.Sheets['Financial Review'];

    var output = fillOutput(worksheet);

    let csvData = csvMaker(output);
    console.log(csvData);
    download(csvData);
}

function convertValue(value) {
    //var sUnits = document.getElementById("spread-units").value;
    var mUnits = document.getElementById("moodys-units").value;

    return value * spreadUnits / mUnits;
}

function csvMaker(data) {
    let csv = '';
    let keys = Object.keys(data);
    csv += keys.join(',') + '\n';

    const rows = data[keys[0]].length;
    for (let i = 0; i < rows; i++) {
        const row = keys.map(key => data[key][i]);
        csv += row.join(',') + '\n';
    }

    return csv;
}

function download(data) {
    var link = document.createElement('a');
    const file = new Blob([data], { type: 'text/csv' });
    link.href = URL.createObjectURL(file);
    link.download = 'output.csv';
    link.click();
    URL.revokeObjectURL(link.href);
}

function getNextChar(char) {
    return String.fromCharCode(char.charCodeAt(0) + 1);
}

function getPreviousChar(char) {
    return String.fromCharCode(char.charCodeAt(0) - 1);
}

function getValue(worksheet, target) {
    if (target.includes("A")) {
        return "";
    }
    if (worksheet[target] === undefined) {
        return 0;
    } else {
        let value = worksheet[target].v
        return convertValue(value);
    }
}

function fillOutput(worksheet) {
    const lastCol = document.getElementById('most-recent-col').value;
    var currentCol = 'B';
    var output = initialiseOutput();
    spreadUnits = worksheet['A6'].v;

    while (currentCol <= lastCol) {
        var previousCol = getPreviousChar(currentCol);
        output.entityInternationalName.push(worksheet[currentCol + '14'].v);
        output.entityIdentifierbvd.push(document.getElementById("company-number").value);
        output.financialStatementDate.push(convertDate(worksheet[currentCol.concat('', '11')].w));
        output.asOfDate.push("");
        output.primaryIndustryClassification.push("");
        output.primaryIndustry.push("");
        output.primaryCountry.push("");
        output.primaryStateProvince.push("");
        output.currency.push(worksheet['A2'].v);

        // Moody's appears to overwrite this value anyway with whatever is already saved for that entity
        output.entityLegalForm.push("");

        // Moody's doesn't seem to parse this data correctly so just leaving it blank for now
        output.auditQuality.push("");

        // not including restricted cash as Moody's says "most liquid". Restricted cash may have not always be liquid, and if it is only under certain conditions
        output.cashAndMarketableSecurities.push(getValue(worksheet, currentCol + '18') + getValue(worksheet, currentCol + '20'));
        output.cashAndMarketableSecuritiesPreviousYear.push(getValue(worksheet, previousCol + '18') + getValue(worksheet, previousCol + '20'));


        output.totalAccountsReceivable.push(getValue(worksheet, currentCol + '21'));
        output.totalAccountsReceivablePreviousYear.push(getValue(worksheet, previousCol + '21'));
        output.totalInventory.push(getValue(worksheet, currentCol + '22'));
        output.totalInventoryPreviousYear.push(getValue(worksheet, previousCol + '22'));
        output.totalCurrentAssets.push(getValue(worksheet, currentCol + '27'));
        output.totalCurrentAssetsPreviousYear.push(getValue(worksheet, previousCol + '27'));
        output.totalAccumulatedDepreciation.push("");
        output.totalAccumulatedDepreciationPreviousYear.push("");
        output.totalFixedAssets.push(getValue(worksheet, currentCol + '28') + getValue(worksheet, currentCol + '29'));
        output.totalFixedAssetsPreviousYear.push(getValue(worksheet, previousCol + '28') + getValue(worksheet, previousCol + '29'));
        output.totalIntangibleAssets.push(getValue(worksheet, currentCol + '30'));
        output.totalAssets.push(getValue(worksheet, currentCol + '36'));
        output.totalAssetsPreviousYear.push(getValue(worksheet, previousCol + '36'));
        output.notesPayable.push("");
        output.debtCurrentMaturities.push(getValue(worksheet, currentCol + '44') + getValue(worksheet, currentCol + '45'));
        output.shortTermDebt.push(getValue(worksheet, currentCol + '43') + getValue(worksheet, currentCol + '44') + getValue(worksheet, currentCol + '45'));
        output.shortTermDebtPreviousYear.push(getValue(worksheet, previousCol + '43') + getValue(worksheet, previousCol + '44') + getValue(worksheet, previousCol + '45'));
        output.totalAccountsPayable.push(getValue(worksheet, currentCol + '41'));
        output.totalAccountsPayablePreviousYear.push(getValue(worksheet, previousCol + '41'));
        output.totalCurrentLiabilities.push(getValue(worksheet, currentCol + '52'));
        output.totalCurrentLiabilitiesPreviousYear.push(getValue(worksheet, previousCol + '52'));
        output.totalLongTermDebt.push(getValue(worksheet, currentCol + '53') + getValue(worksheet, currentCol + '54'));
        output.totalLongTermDebtPreviousYear.push(getValue(worksheet, previousCol + '53') + getValue(worksheet, previousCol + '54'));
        output.totalNonCurrentLiabilities.push(getValue(worksheet, currentCol + '61') - getValue(worksheet, currentCol + '52'));
        output.totalNonCurrentLiabilitiesPreviousYear.push(getValue(worksheet, previousCol + '61') - getValue(worksheet, previousCol + '52'));
        output.totalProvisions.push(getValue(worksheet, currentCol + '42'));
        output.totalLiabilities.push(getValue(worksheet, currentCol + '61'));
        output.totalLiabilitiesPreviousYear.push(getValue(worksheet, previousCol + '61'));
        output.retainedEarnings.push("");
        output.netWorth.push(getValue(worksheet, currentCol + '76'));
        output.netSales.push(getValue(worksheet, currentCol + '80'));
        output.netSalesPreviousYear.push(getValue(worksheet, previousCol + '80'));
        output.totalCostOfGoodsSold.push(getValue(worksheet, currentCol + '81'));
        output.grossIncome.push(getValue(worksheet, currentCol + '82'));
        output.totalWageExpense.push("");
        output.totalAmortizationAndDepreciation.push(getValue(worksheet, currentCol + '92') + getValue(worksheet, currentCol + '93'));
        output.totalOperatingExpense.push(getValue(worksheet, currentCol + '94'));
        output.totalOperatingProfit.push(getValue(worksheet, currentCol + '95'));
        output.totalOperatingProfitPreviousYear.push(getValue(worksheet, previousCol + '95'));
        output.financeCosts.push(getValue(worksheet, currentCol + '96'));
        output.profitBeforeTaxesAndExtraordinaryExpenses.push(getValue(worksheet, currentCol + '106') + getValue(worksheet, currentCol + '98'));
        output.profitBeforeTaxesAndExtraordinaryExpensesPreviousYear.push(getValue(worksheet, previousCol + '106') + getValue(worksheet, previousCol + '98'));
        output.currentIncomeTaxExpense.push(getValue(worksheet, currentCol + '98'));
        output.totalExtraordinaryItems.push("");
        output.netIncome.push(getValue(worksheet, currentCol + '106'));
        output.netIncomePreviousYear.push(getValue(worksheet, previousCol + '106'));
        output.ebitda.push(getValue(worksheet, currentCol + '104'));
        output.entityType.push("");
        output.entityStatus.push("");
        output.entityStatusDate.push("");
        output.numberOfEmployees.push("");
        currentCol = getNextChar(currentCol);
    }

    return output;
}

function initialiseOutput() {
    var output = {
        entityInternationalName: [],
        entityIdentifierbvd: [],
        financialStatementDate: [],
        asOfDate: [],
        primaryIndustryClassification: [],
        primaryIndustry: [],
        primaryCountry: [],
        primaryStateProvince: [],
        currency: [],
        entityLegalForm: [],
        auditQuality: [],
        cashAndMarketableSecurities: [],
        cashAndMarketableSecuritiesPreviousYear: [],
        totalAccountsReceivable: [],
        totalAccountsReceivablePreviousYear: [],
        totalInventory: [],
        totalInventoryPreviousYear: [],
        totalCurrentAssets: [],
        totalCurrentAssetsPreviousYear: [],
        totalAccumulatedDepreciation: [],
        totalAccumulatedDepreciationPreviousYear: [],
        totalFixedAssets: [],
        totalFixedAssetsPreviousYear: [],
        totalIntangibleAssets: [],
        totalAssets: [],
        totalAssetsPreviousYear: [],
        notesPayable: [],
        debtCurrentMaturities: [],
        shortTermDebt: [],
        shortTermDebtPreviousYear: [],
        totalAccountsPayable: [],
        totalAccountsPayablePreviousYear: [],
        totalCurrentLiabilities: [],
        totalCurrentLiabilitiesPreviousYear: [],
        totalLongTermDebt: [],
        totalLongTermDebtPreviousYear: [],
        totalNonCurrentLiabilities: [],
        totalNonCurrentLiabilitiesPreviousYear: [],
        totalProvisions: [],
        totalLiabilities: [],
        totalLiabilitiesPreviousYear: [],
        retainedEarnings: [],
        netWorth: [],
        netSales: [],
        netSalesPreviousYear: [],
        totalCostOfGoodsSold: [],
        grossIncome: [],
        totalWageExpense: [],
        totalAmortizationAndDepreciation: [],
        totalOperatingExpense: [],
        totalOperatingProfit: [],
        totalOperatingProfitPreviousYear: [],
        financeCosts: [],
        profitBeforeTaxesAndExtraordinaryExpenses: [],
        profitBeforeTaxesAndExtraordinaryExpensesPreviousYear: [],
        currentIncomeTaxExpense: [],
        totalExtraordinaryItems: [],
        netIncome: [],
        netIncomePreviousYear: [],
        ebitda: [],
        entityType: [],
        entityStatus: [],
        entityStatusDate: [],
        numberOfEmployees: [],
    };
    return output;
}

document.getElementById('convert-btn').addEventListener('click', convertSpreadsheet, false);