<?php
/**
 * register_process.php – Procesarea înregistrării utilizatorului
 * BorLock – Magazin online de tehnologie
 * 
 * Acceptă POST: name, email, password, confirm_password
 * Parolele sunt hash-uite cu bcrypt (password_hash)
 * Returnează JSON
 */

// Porneste sesiunea
session_start();

// Setăm header pentru răspuns JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// ============================================================
// VERIFICARE METODĂ HTTP
// ============================================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Metodă HTTP nepermisă. Folosiți POST.'
    ]);
    exit();
}

// Includem conexiunea la DB
require_once __DIR__ . '/db_connect.php';

// ============================================================
// COLECTARE DATE FORMULAR
// ============================================================
$rawInput = file_get_contents('php://input');
$jsonInput = json_decode($rawInput, true);

$name            = trim($jsonInput['name']             ?? $_POST['name']             ?? '');
$email           = trim($jsonInput['email']            ?? $_POST['email']            ?? '');
$password        = $jsonInput['password']              ?? $_POST['password']         ?? '';
$confirmPassword = $jsonInput['confirm_password']      ?? $_POST['confirm_password'] ?? '';

// ============================================================
// VALIDARE DATE PE SERVER
// ============================================================
$errors = [];

// Validare nume
if (empty($name)) {
    $errors[] = 'Numele este obligatoriu.';
} elseif (strlen($name) < 3) {
    $errors[] = 'Numele trebuie să aibă cel puțin 3 caractere.';
} elseif (strlen($name) > 100) {
    $errors[] = 'Numele nu poate depăși 100 de caractere.';
}

// Validare email
if (empty($email)) {
    $errors[] = 'Adresa de email este obligatorie.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Adresa de email nu este validă.';
} elseif (strlen($email) > 150) {
    $errors[] = 'Adresa de email este prea lungă.';
}

// Validare parolă
if (empty($password)) {
    $errors[] = 'Parola este obligatorie.';
} elseif (strlen($password) < 8) {
    $errors[] = 'Parola trebuie să aibă cel puțin 8 caractere.';
} elseif (strlen($password) > 255) {
    $errors[] = 'Parola este prea lungă.';
}

// Validare confirmare parolă
if (!empty($password) && $password !== $confirmPassword) {
    $errors[] = 'Parolele nu coincid.';
}

// Dacă există erori de validare, le returnăm
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors),
        'errors'  => $errors
    ]);
    exit();
}

// ============================================================
// VERIFICARE EMAIL UNIC
// ============================================================
try {
    // Verificăm dacă email-ul există deja în baza de date
    $existingUser = dbFetchOne(
        'SELECT id FROM users WHERE LOWER(email) = LOWER(?)',
        [$email]
    );
    
    if ($existingUser) {
        http_response_code(409); // 409 Conflict
        echo json_encode([
            'success' => false,
            'message' => 'Această adresă de email este deja înregistrată. Încearcă să te autentifici.'
        ]);
        exit();
    }
    
    // ============================================================
    // HASH PAROLĂ CU BCRYPT
    // ============================================================
    // password_hash() folosește bcrypt cu salt aleatoriu
    // PASSWORD_DEFAULT folosește cel mai sigur algoritm disponibil
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT, ['cost' => 12]);
    
    // ============================================================
    // INSERARE UTILIZATOR ÎN BAZA DE DATE
    // ============================================================
    dbQuery(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [$name, $email, $hashedPassword]
    );
    
    // Obținem ID-ul utilizatorului creat
    global $pdo;
    $newUserId = (int) $pdo->lastInsertId();
    
    // ============================================================
    // SETARE SESIUNE (opțional – autentificare automată după înregistrare)
    // ============================================================
    $_SESSION['user_id']    = $newUserId;
    $_SESSION['user_name']  = $name;
    $_SESSION['user_email'] = $email;
    $_SESSION['logged_in']  = true;
    $_SESSION['login_time'] = time();
    
    session_regenerate_id(true);
    
    // Returnăm succes
    echo json_encode([
        'success'  => true,
        'message'  => "Cont creat cu succes! Bine ai venit, {$name}!",
        'user'     => [
            'id'    => $newUserId,
            'name'  => $name,
            'email' => $email
        ],
        'redirect' => '../index.html'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Eroare internă la crearea contului. Vă rugăm să încercați din nou.'
    ]);
    
    error_log('BorLock Register Error: ' . $e->getMessage());
}
