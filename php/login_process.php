<?php
/**
 * login_process.php – Procesarea autentificării utilizatorului
 * BorLock – Magazin online de tehnologie
 * 
 * Acceptă POST: email, password
 * Returnează JSON sau redirecționează utilizatorul
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
// COLECTARE ȘI VALIDARE DATE FORMULAR
// ============================================================

// Obținem datele trimise (suportăm atât form-data cât și JSON)
$rawInput = file_get_contents('php://input');
$jsonInput = json_decode($rawInput, true);

$email    = trim($jsonInput['email'] ?? $_POST['email'] ?? '');
$password = $jsonInput['password'] ?? $_POST['password'] ?? '';

// Validare câmpuri obligatorii
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Email-ul și parola sunt obligatorii.'
    ]);
    exit();
}

// Validare format email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Adresa de email nu este validă.'
    ]);
    exit();
}

// ============================================================
// VERIFICARE UTILIZATOR ÎN BAZA DE DATE
// ============================================================
try {
    // Căutăm utilizatorul după email (case-insensitive)
    $user = dbFetchOne(
        'SELECT id, name, email, password FROM users WHERE LOWER(email) = LOWER(?)',
        [$email]
    );
    
    if (!$user) {
        // Utilizatorul nu există – mesaj generic (securitate)
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Email sau parolă incorectă.'
        ]);
        exit();
    }
    
    // Verificăm parola cu password_verify() (bcrypt)
    if (!password_verify($password, $user['password'])) {
        // Parolă greșită – același mesaj generic
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Email sau parolă incorectă.'
        ]);
        exit();
    }
    
    // ============================================================
    // LOGIN REUȘIT – Setăm sesiunea
    // ============================================================
    $_SESSION['user_id']    = $user['id'];
    $_SESSION['user_name']  = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['logged_in']  = true;
    $_SESSION['login_time'] = time();
    
    // Regenerăm ID-ul sesiunii pentru securitate (previne session fixation)
    session_regenerate_id(true);
    
    // Returnăm succes
    echo json_encode([
        'success'  => true,
        'message'  => 'Autentificare reușită! Bine ai venit, ' . $user['name'] . '!',
        'user'     => [
            'id'    => $user['id'],
            'name'  => $user['name'],
            'email' => $user['email']
        ],
        'redirect' => '../index.html'
    ]);
    
} catch (PDOException $e) {
    // Eroare baza de date – nu expunem detalii tehnice utilizatorului
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Eroare internă. Vă rugăm să încercați din nou.'
    ]);
    
    // Logăm eroarea în server (în producție)
    error_log('BorLock Login Error: ' . $e->getMessage());
}
