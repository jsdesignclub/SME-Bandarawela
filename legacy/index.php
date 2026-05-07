<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SME Registration | Divisional Secretariat</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-color: #2563eb;
            --secondary-color: #64748b;
            --success-color: #22c55e;
            --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-gradient);
            min-height: 100vh;
            color: #1e293b;
        }

        .registration-container {
            max-width: 800px;
            margin: 50px auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .header-banner {
            background: url('sme_banner.png') center/cover no-repeat;
            height: 200px;
            position: relative;
        }

        .header-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
            color: white;
        }

        .step-progress {
            display: flex;
            justify-content: space-between;
            padding: 30px 50px;
            background: #f1f5f9;
            border-bottom: 1px solid #e2e8f0;
        }

        .step {
            text-align: center;
            position: relative;
            flex: 1;
        }

        .step-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #cbd5e1;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            z-index: 2;
            position: relative;
            transition: all 0.3s ease;
        }

        .step.active .step-icon {
            background: var(--primary-color);
            box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.2);
        }

        .step.completed .step-icon {
            background: var(--success-color);
        }

        .step-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--secondary-color);
        }

        .step.active .step-label {
            color: var(--primary-color);
        }

        .form-section {
            padding: 40px;
            display: none;
        }

        .form-section.active {
            display: block;
            animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .form-label {
            font-weight: 600;
            color: #475569;
            margin-bottom: 8px;
        }

        .form-control {
            border-radius: 10px;
            padding: 12px 15px;
            border: 2px solid #e2e8f0;
            transition: all 0.3s ease;
        }

        .form-control:focus {
            border-color: var(--primary-color);
            box-shadow: none;
        }

        .btn-next, .btn-submit {
            background: var(--primary-color);
            color: white;
            padding: 12px 30px;
            border-radius: 10px;
            font-weight: 600;
            border: none;
            transition: all 0.3s ease;
        }

        .btn-next:hover, .btn-submit:hover {
            background: #1d4ed8;
            transform: translateY(-2px);
        }

        .btn-prev {
            background: #f1f5f9;
            color: #64748b;
            padding: 12px 30px;
            border-radius: 10px;
            font-weight: 600;
            border: none;
        }

        .invalid-feedback {
            font-size: 0.8rem;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="registration-container">
        <div class="header-banner">
            <div class="header-overlay">
                <h2 class="mb-0">SME Registration System</h2>
                <p class="mb-0 opacity-75">Divisional Secretariat Bandarawela</p>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="step-progress">
            <div class="step active" id="step1-indicator">
                <div class="step-icon"><i class="fas fa-user"></i></div>
                <div class="step-label">Personal</div>
            </div>
            <div class="step" id="step2-indicator">
                <div class="step-icon"><i class="fas fa-briefcase"></i></div>
                <div class="step-label">Business</div>
            </div>
            <div class="step" id="step3-indicator">
                <div class="step-icon"><i class="fas fa-coins"></i></div>
                <div class="step-label">Financial</div>
            </div>
        </div>

        <form id="smeForm" action="process.php" method="POST" novalidate>
            <!-- Step 1: Personal Details -->
            <div class="form-section active" id="step1">
                <h4 class="mb-4">Personal Details</h4>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Name with Initials</label>
                        <input type="text" name="personal[nameWithInitials]" class="form-control" required placeholder="J.D. Perera">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">NIC Number</label>
                        <input type="text" name="personal[nic]" id="nicInput" class="form-control" required placeholder="199012345678 or 901234567V">
                        <div class="invalid-feedback">Please enter a valid NIC (9 or 12 characters).</div>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Full Name</label>
                        <input type="text" name="personal[fullName]" class="form-control" required placeholder="John Doe Perera">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Address</label>
                        <textarea name="personal[address]" class="form-control" rows="2" required></textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Phone Number</label>
                        <input type="tel" name="personal[phone]" id="phoneInput" class="form-control" required placeholder="0712345678">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">WhatsApp Number</label>
                        <input type="tel" name="personal[whatsapp]" class="form-control" placeholder="0712345678">
                    </div>
                </div>
                <div class="mt-4 text-end">
                    <button type="button" class="btn-next" onclick="nextStep(2)">Next Step <i class="fas fa-arrow-right ms-2"></i></button>
                </div>
            </div>

            <!-- Step 2: Business Details -->
            <div class="form-section" id="step2">
                <h4 class="mb-4">Business Details</h4>
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label">Business Name</label>
                        <input type="text" name="business[name]" class="form-control" required>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Business Address</label>
                        <textarea name="business[address]" class="form-control" rows="2" required></textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Registration No</label>
                        <input type="text" name="business[regNo]" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Registration Date</label>
                        <input type="date" name="business[regDate]" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">No. of Employees</label>
                        <input type="number" name="business[employees]" class="form-control" required min="1">
                    </div>
                </div>
                <div class="mt-4 d-flex justify-content-between">
                    <button type="button" class="btn-prev" onclick="prevStep(1)"><i class="fas fa-arrow-left me-2"></i> Previous</button>
                    <button type="button" class="btn-next" onclick="nextStep(3)">Next Step <i class="fas fa-arrow-right ms-2"></i></button>
                </div>
            </div>

            <!-- Step 3: Financials & Compliance -->
            <div class="form-section" id="step3">
                <h4 class="mb-4">Financials & Compliance</h4>
                <div class="row g-3">
                    <div class="col-md-12">
                        <label class="form-label">Product Name</label>
                        <input type="text" name="financials[productName]" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Monthly Production Volume</label>
                        <input type="text" name="financials[productionVolume]" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Monthly Sales (LKR)</label>
                        <input type="number" name="financials[monthlySales]" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Monthly Income (LKR)</label>
                        <input type="number" name="financials[monthlyIncome]" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Total Investment (LKR)</label>
                        <input type="number" name="financials[totalInvestment]" class="form-control" required>
                    </div>
                    
                    <hr class="my-4">
                    
                    <div class="col-12">
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" name="compliance[accountingRecords]" id="accRecords">
                            <label class="form-check-label" for="accRecords">Accounting Records Maintained?</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" name="compliance[productionProcess]" id="prodProcess">
                            <label class="form-check-label" for="prodProcess">Production Process Documented?</label>
                        </div>
                    </div>
                </div>
                <div class="mt-4 d-flex justify-content-between">
                    <button type="button" class="btn-prev" onclick="prevStep(2)"><i class="fas fa-arrow-left me-2"></i> Previous</button>
                    <button type="submit" class="btn-submit">Submit Registration <i class="fas fa-paper-plane ms-2"></i></button>
                </div>
            </div>
        </form>
    </div>
</div>

<script>
    function nextStep(step) {
        if (validateStep(step - 1)) {
            document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
            document.getElementById('step' + step).classList.add('active');
            
            document.querySelectorAll('.step').forEach((s, idx) => {
                if (idx < step) s.classList.add('completed');
                if (idx === step - 1) s.classList.add('active');
                else s.classList.remove('active');
            });
        }
    }

    function prevStep(step) {
        document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
        document.getElementById('step' + step).classList.add('active');
        
        document.querySelectorAll('.step').forEach((s, idx) => {
            if (idx >= step) s.classList.remove('completed');
            if (idx === step - 1) s.classList.add('active');
            else s.classList.remove('active');
        });
    }

    function validateStep(step) {
        const currentSection = document.getElementById('step' + step);
        const inputs = currentSection.querySelectorAll('input[required], textarea[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                valid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        if (step === 1) {
            const nic = document.getElementById('nicInput').value;
            const phone = document.getElementById('phoneInput').value;
            
            // NIC Validation (9 or 12 chars)
            if (!/^[0-9]{9}[vVxX]$/.test(nic) && !/^[0-9]{12}$/.test(nic)) {
                document.getElementById('nicInput').classList.add('is-invalid');
                valid = false;
            }

            // Phone Validation (10 digits)
            if (!/^0[0-9]{9}$/.test(phone)) {
                document.getElementById('phoneInput').classList.add('is-invalid');
                valid = false;
            }
        }

        return valid;
    }
</script>

</body>
</html>
