import XLSX from 'xlsx';
import fs from 'fs';

const PROJECT_ID = "my-first-project-955f6";
const API_KEY = "AIzaSyA5ulR8LY8S0Xj9z6wfwTzp-kkhDfQ8Nvs";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/`;

/**
 * Helper to map JS objects to Firestore's complex Value types
 */
function mapToFirestore(data) {
    const fields = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object' && value !== null) {
            fields[key] = { mapValue: { fields: mapToFirestore(value) } };
        } else if (typeof value === 'boolean') {
            fields[key] = { booleanValue: value };
        } else if (typeof value === 'number') {
            fields[key] = { doubleValue: value };
        } else {
            fields[key] = { stringValue: String(value) };
        }
    }
    return fields;
}

const importData = async () => {
    try {
        const filePath = './data/Business name list.xlsx';
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log(`Importing ${rawData.length} rows using REST API...`);

        for (const row of rawData) {
            const bizName = row['Business Name'] || row['Full Name'] || row['Name with initials'];
            
            // Skip rows that have no identifying name
            if (!bizName) {
                console.log("Skipping empty/invalid row...");
                continue;
            }

            const entry = {
                PersonalDetails: {
                    nameWithInitials: row['Name with initials'] || '',
                    fullName: row['Full Name'] || '',
                    nic: '',
                    address: row['Address '] || '',
                    phone: String(row['Phone '] || ''),
                    whatsapp: String(row['whatsapp'] || '')
                },
                BusinessDetails: {
                    name: row['Business Name'] || '',
                    address: row['Address '] || '',
                    regNo: row['Reg.No'] || '',
                    regDate: '',
                    employees: 0,
                    gsDivision: row['GS division'] || '',
                    gsNo: row['GS No'] || '',
                    businessType: row['business type'] || ''
                },
                Financials: {
                    productName: row['business type'] || '',
                    productionVolume: '',
                    monthlySales: 0,
                    monthlyIncome: 0,
                    totalInvestment: 0
                },
                Compliance: {
                    accountingRecords: false,
                    productionProcess: false
                },
                createdAt: new Date().toISOString()
            };

            const firestoreData = { fields: mapToFirestore(entry) };
            const url = `${BASE_URL}enterprises?key=${API_KEY}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(firestoreData)
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error(`Failed to import ${bizName}: ${errText}`);
            } else {
                console.log(`Imported: ${bizName}`);
            }

            // Small delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log("Import finished!");
    } catch (e) {
        console.error("Error:", e);
    }
};

importData();
