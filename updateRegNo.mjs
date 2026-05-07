import XLSX from 'xlsx';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA5ulR8LY8S0Xj9z6wfwTzp-kkhDfQ8Nvs",
  projectId: "my-first-project-955f6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const updateRegNos = async () => {
    try {
        console.log("Reading Excel file...");
        const workbook = XLSX.readFile('./data/Business name list.xlsx');
        const sheetName = workbook.SheetNames[0];
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log("Fetching documents from Firestore...");
        const snapshot = await getDocs(collection(db, 'enterprises'));
        const docs = snapshot.docs;
        console.log(`Found ${docs.length} documents.`);

        let updatedCount = 0;

        for (const docSnap of docs) {
            const data = docSnap.data();
            const bizName = data.BusinessDetails?.name;
            const ownerName = data.PersonalDetails?.nameWithInitials;

            // Find matching row in Excel
            const match = rawData.find(row => 
                (bizName && row['Business Name'] === bizName) || 
                (ownerName && row['Name with initials'] === ownerName)
            );

            if (match && match['Reg.No']) {
                const newRegNo = match['Reg.No'];
                // Only update if it's currently empty or different
                if (data.BusinessDetails?.regNo !== newRegNo) {
                    await updateDoc(doc(db, 'enterprises', docSnap.id), {
                        'BusinessDetails.regNo': newRegNo
                    });
                    updatedCount++;
                    console.log(`Updated Reg.No for ${bizName || ownerName}: ${newRegNo}`);
                }
            }
        }

        console.log(`Finished updating. Total records updated: ${updatedCount}`);
    } catch (e) {
        console.error("Error:", e);
    }
};

updateRegNos();
