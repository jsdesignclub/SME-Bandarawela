<?php
require_once 'config.php';

try {
    $documents = FirebaseConfig::get('enterprises');
} catch (Exception $e) {
    die("Error fetching data: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SME Dashboard | Admin View</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #1e293b; }
        .dashboard-card { background: white; border-radius: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: none; margin-top: 30px; }
        .search-container { position: relative; max-width: 400px; }
        .search-container i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .search-input { padding-left: 45px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .table-custom thead th { background-color: #f1f5f9; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; padding: 15px; }
        .table-custom tbody td { padding: 15px; vertical-align: middle; border-bottom: 1px solid #f1f5f9; }
        .badge-employees { background-color: #e0f2fe; color: #0369a1; font-weight: 600; padding: 5px 10px; border-radius: 6px; }
        .btn-view { color: #2563eb; background: #eff6ff; border: none; padding: 5px 12px; border-radius: 6px; font-size: 0.85rem; }
    </style>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
        <a class="navbar-brand fw-bold" href="#">DS SME Admin</a>
        <div class="ms-auto">
            <a href="index.php" class="btn btn-outline-light btn-sm"><i class="fas fa-plus me-1"></i> New Registration</a>
        </div>
    </div>
</nav>

<div class="container mb-5">
    <div class="dashboard-card p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0">Registered SMEs</h4>
            <div class="search-container">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" class="form-control search-input" placeholder="Search by NIC or Business Name...">
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-custom" id="smeTable">
                <thead>
                    <tr>
                        <th>NIC</th>
                        <th>Owner Name</th>
                        <th>Business Name</th>
                        <th>Employees</th>
                        <th>Monthly Income</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    foreach ($documents as $doc): 
                        $data = FirebaseConfig::simplify($doc);
                        if (empty($data)) continue;
                        $personal = $data['PersonalDetails'] ?? [];
                        $business = $data['BusinessDetails'] ?? [];
                        $financials = $data['Financials'] ?? [];
                    ?>
                    <tr>
                        <td class="fw-semibold"><?php echo htmlspecialchars($personal['nic'] ?? 'N/A'); ?></td>
                        <td><?php echo htmlspecialchars($personal['nameWithInitials'] ?? 'N/A'); ?></td>
                        <td><?php echo htmlspecialchars($business['name'] ?? 'N/A'); ?></td>
                        <td><span class="badge-employees"><?php echo (int)($business['employees'] ?? 0); ?></span></td>
                        <td>Rs. <?php echo number_format((float)($financials['monthlyIncome'] ?? 0), 2); ?></td>
                        <td>
                            <button class="btn-view" onclick="alert('Details: <?php echo addslashes($business['name'] ?? ''); ?>')">
                                <i class="fas fa-eye me-1"></i> Details
                            </button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    document.getElementById('searchInput').addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const rows = document.querySelectorAll('#smeTable tbody tr');
        rows.forEach(row => {
            const nic = row.cells[0].textContent.toLowerCase();
            const biz = row.cells[2].textContent.toLowerCase();
            row.style.display = (nic.includes(filter) || biz.includes(filter)) ? '' : 'none';
        });
    });
</script>

</body>
</html>
