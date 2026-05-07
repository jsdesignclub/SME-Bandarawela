<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $personal = $_POST['personal'] ?? [];
    $business = $_POST['business'] ?? [];
    $financials = $_POST['financials'] ?? [];
    $compliance = $_POST['compliance'] ?? [];

    // --- Server-side Validation ---
    $errors = [];

    // NIC Validation
    $nic = $personal['nic'] ?? '';
    if (!preg_match('/^[0-9]{9}[vVxX]$/', $nic) && !preg_match('/^[0-9]{12}$/', $nic)) {
        $errors[] = "Invalid NIC format.";
    }

    // Phone Validation
    $phone = $personal['phone'] ?? '';
    if (!preg_match('/^0[0-9]{9}$/', $phone)) {
        $errors[] = "Invalid phone number format.";
    }

    if (!empty($errors)) {
        die("Validation Errors: " . implode(", ", $errors));
    }

    // --- Data Preparation ---
    $data = [
        'PersonalDetails' => [
            'nameWithInitials' => $personal['nameWithInitials'],
            'fullName'         => $personal['fullName'],
            'nic'              => $nic,
            'address'          => $personal['address'],
            'phone'            => $phone,
            'whatsapp'         => $personal['whatsapp'] ?: $phone
        ],
        'BusinessDetails' => [
            'name'             => $business['name'],
            'address'          => $business['address'],
            'regNo'            => $business['regNo'],
            'regDate'          => $business['regDate'],
            'employees'        => (int)$business['employees']
        ],
        'Financials' => [
            'productName'      => $financials['productName'],
            'productionVolume' => $financials['productionVolume'],
            'monthlySales'     => (float)$financials['monthlySales'],
            'monthlyIncome'    => (float)$financials['monthlyIncome'],
            'totalInvestment'  => (float)$financials['totalInvestment']
        ],
        'Compliance' => [
            'accountingRecords' => isset($compliance['accountingRecords']),
            'productionProcess' => isset($compliance['productionProcess'])
        ],
        'createdAt' => date('c') // ISO 8601 string
    ];

    try {
        FirebaseConfig::post('enterprises', $data);
        
        // Success Redirect
        echo "<script>
                alert('SME Registration Successful!');
                window.location.href = 'index.php';
              </script>";
    } catch (Exception $e) {
        die("Error: " . $e->getMessage());
    }
} else {
    header("Location: index.php");
    exit();
}
?>
