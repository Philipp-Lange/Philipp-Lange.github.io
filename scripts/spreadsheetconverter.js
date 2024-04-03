function convertDate(date) {
    var parts = date.split('/');

    parts[2] = '20' + parts[2];

    return parts[0] + '/' + parts[1] + '/' + parts[2];

}

async function convertSpreadsheet(e) {
    console.log('button was pressed');

    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    var workbook = XLSX.read(data);
    var worksheet = workbook.Sheets['Financial Review'];

    var output = makeOutput(worksheet);

    let csvData = csvMaker(output);
    console.log(csvData);
    download(csvData);
}

function csvMaker(data) {
    let csvRows = [];

    let headers = Object.keys(data);
    csvRows.push(headers.join(','));
    let values = Object.values(data).join(',');
    csvRows.push(values);
    return csvRows.join('\n');
}

function download(data) {
    var link = document.createElement('a');
    const file = new Blob([data], { type: 'text/csv' });
    link.href = URL.createObjectURL(file);
    link.download = 'output.csv';
    link.click();
    URL.revokeObjectURL(link.href);
}

function getAuditQuality(financialType) {
    if (financialType == "Audited") {
        return financialType;
    } else {
        return "Unkown";
    }
}

function getValue(worksheet, target) {
    if (worksheet[target] === undefined) {
        return 0;
    } else {
        return worksheet[target].v;
    }
}

function makeOutput(worksheet) {
    var currentCol = document.getElementById('current-col').value;
    var previousCol = document.getElementById('previous-col').value;

    var output = [];
    output.entityInternationalName = worksheet[currentCol + '14'].v;
    output.entityIdentifierbvd = document.getElementById("company-number").value;
    output.financialStatementDate = convertDate(worksheet[currentCol.concat('', '11')].w);
    output.asOfDate = "";
    output.primaryIndustryClassification = document.getElementById("primary-industry-classification").value;
    output.primaryIndustry = document.getElementById("primary-industry").value;
    output.primaryCountry = document.getElementById("primary-country").value;
    output.primaryStateProvince = "";
    output.currency = worksheet['A2'].v;
    output.entityLegalForm = document.getElementById("entity-legal-form").value;
    output.auditQuality = getAuditQuality(worksheet[currentCol + '12'].w);
    output.cashAndMarketableSecurities = getValue(worksheet, currentCol + '18');
    output.cashAndMarketableSecuritiesPreviousYear = getValue(worksheet, previousCol + '18');
    output.totalAccountsReceivable = getValue(worksheet, currentCol + '21');
    output.totalAccountsReceivablePreviousYear = getValue(worksheet, previousCol + '21');
    output.totalInventory = getValue(worksheet, currentCol + '22');
    output.totalInventoryPreviousYear = getValue(worksheet, previousCol + '22');
    output.totalCurrentAssets = getValue(worksheet, currentCol + '27');
    output.totalCurrentAssetsPreviousYear = getValue(worksheet, previousCol + '27');
    output.totalAccumulatedDepreciation = "";
    output.totalAccumulatedDepreciationPreviousYear = "";
    output.totalFixedAssets = getValue(worksheet, currentCol + '28') + getValue(worksheet, currentCol + '29');
    output.totalFixedAssetsPreviousYear = getValue(worksheet, previousCol + '28') + getValue(worksheet, previousCol + '29');
    output.totalIntangibleAssets = getValue(worksheet, currentCol + '30');
    output.totalAssets = getValue(worksheet, currentCol + '36');
    output.totalAssetsPreviousYear = getValue(worksheet, previousCol + '36');
    output.notesPayable = getValue(worksheet, currentCol + '44');
    output.debtCurrentMaturities = getValue(worksheet, currentCol + '44') + getValue(worksheet, currentCol + '29');
    output.shortTermDebt = "";
    output.shortTermDebtPreviousYear = "";
    output.totalAccountsPayable = getValue(worksheet, currentCol + '41');
    output.totalAccountsPayablePreviousYear = getValue(worksheet, previousCol + '41');
    output.totalCurrentLiabilities = getValue(worksheet, currentCol + '52');
    output.totalCurrentLiabilitiesPreviousYear = getValue(worksheet, previousCol + '52');
    output.totalLongTermDebt = getValue(worksheet, currentCol + '53') + getValue(worksheet, currentCol + '54');
    output.totalLongTermDebtPreviousYear = getValue(worksheet, previousCol + '53') + getValue(worksheet, previousCol + '54');
    output.totalNonCurrentLiabilities = getValue(worksheet, currentCol + '61') - getValue(worksheet, currentCol + '52');
    output.totalNonCurrentLiabilitiesPreviousYear = getValue(worksheet, previousCol + '61') - getValue(worksheet, previousCol + '52');
    output.totalProvisions = getValue(worksheet, currentCol + '42');
    output.totalLiabilities = getValue(worksheet, currentCol + '61');
    output.totalLiabilitiesPreviousYear = getValue(worksheet, previousCol + '61');
    output.retainedEarnings = "";
    output.netWorth = getValue(worksheet, currentCol + '76');
    output.netSales = getValue(worksheet, currentCol + '80');
    output.netSalesPreviousYear = getValue(worksheet, previousCol + '80');
    output.totalCostOfGoodsSold = getValue(worksheet, currentCol + '81');
    output.grossIncome = getValue(worksheet, currentCol + '82');
    output.totalWageExpense = "";
    output.totalAmortizationAndDepreciation = getValue(worksheet, currentCol + '92') + getValue(worksheet, currentCol + '93');
    output.totalOperatingExpense = getValue(worksheet, currentCol + '94');
    output.totalOperatingProfit = getValue(worksheet, currentCol + '95');
    output.totalOperatingProfitPreviousYear = getValue(worksheet, previousCol + '95');
    output.financeCost = getValue(worksheet, currentCol + '96');
    output.profitBeforeTaxesAndExtraordinaryExpenses = getValue(worksheet, currentCol + '106') + getValue(worksheet, currentCol + '98');
    output.profitBeforeTaxesAndExtraordinaryExpensesPreviousYear = getValue(worksheet, previousCol + '106') + getValue(worksheet, previousCol + '98');
    output.currentIncomeTaxExpense = getValue(worksheet, currentCol + '98');
    output.totalExtraordinaryItems = "";
    output.netIncome = getValue(worksheet, currentCol + '106');
    output.netIncomePreviousYear = getValue(worksheet, previousCol + '106');
    output.ebitda = getValue(worksheet, currentCol + '104');
    output.entityType = "";
    output.entityStatus = "";
    output.entityStatusDate = "";
    output.numberOfEmployees = "";

    return output;
}

document.getElementById('file-upload').addEventListener('change', convertSpreadsheet, false);
