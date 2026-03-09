<?php
/**
 * db_connect.php – Conexiunea la baza de date MySQL
 * BorLock – Magazin online de tehnologie
 * 
 * Utilizează PDO (PHP Data Objects) pentru securitate maximă.
 * Fișierul trebuie inclus în toate celelalte fișiere PHP.
 * 
 * Configurare necesară:
 * - Pornire server MySQL (ex: XAMPP, WAMP)
 * - Creare baza de date: rulați database/borlock.sql
 */

// ============================================================
// CONFIGURARE CONEXIUNE
// ============================================================

/** Adresa serverului MySQL */
$host = 'localhost';

/** Portul MySQL (implicit 3306) */
$port = 3306;

/** Numele bazei de date */
$dbname = 'borlock';

/** Utilizatorul MySQL */
$username = 'root';

/** Parola MySQL (implicit goală pe XAMPP) */
$password = '';

/** Charset pentru caractere românești */
$charset = 'utf8mb4';

// ============================================================
// CREARE CONEXIUNE PDO
// ============================================================
try {
    // DSN (Data Source Name) – șirul de conexiune
    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";
    
    // Opțiuni PDO
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,  // Aruncă excepții la erori
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,         // Returnează array asociativ
        PDO::ATTR_EMULATE_PREPARES   => false,                    // Dezactivează emularea prepared statements
    ];
    
    // Creăm conexiunea
    $pdo = new PDO($dsn, $username, $password, $options);
    
} catch (PDOException $e) {
    // Eroare la conexiune – afișăm un mesaj prietenos
    http_response_code(503);
    
    // Returnăm eroare JSON dacă este apel AJAX
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Eroare de conexiune la baza de date. Verificați că serverul MySQL este pornit.'
        ]);
    } else {
        echo '<!DOCTYPE html>
        <html lang="ro">
        <head>
            <meta charset="UTF-8">
            <title>Eroare conexiune – BorLock</title>
            <style>
                body { font-family: Arial, sans-serif; background: #0a1628; color: white; 
                       display: flex; align-items: center; justify-content: center; 
                       min-height: 100vh; margin: 0; }
                .error-box { background: rgba(255,255,255,0.1); padding: 40px; 
                             border-radius: 12px; max-width: 500px; text-align: center; }
                h1 { color: #ef4444; }
                code { background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="error-box">
                <h1>⚠️ Eroare de conexiune</h1>
                <p>Nu se poate conecta la baza de date MySQL.</p>
                <p>Verificați că XAMPP/WAMP este pornit și că baza de date <code>borlock</code> există.</p>
                <p>Rulați fișierul <code>database/borlock.sql</code> pentru a crea baza de date.</p>
            </div>
        </body>
        </html>';
    }
    exit();
}

/**
 * Funcție helper pentru a executa query-uri cu parametri
 * 
 * @param string $sql – Query-ul SQL cu placeholders (?)
 * @param array $params – Parametrii pentru query
 * @return PDOStatement
 */
function dbQuery(string $sql, array $params = []): PDOStatement {
    global $pdo;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt;
}

/**
 * Funcție helper pentru a găsi un singur rând
 * 
 * @param string $sql
 * @param array $params
 * @return array|false
 */
function dbFetchOne(string $sql, array $params = []): array|false {
    return dbQuery($sql, $params)->fetch();
}

/**
 * Funcție helper pentru a găsi toate rândurile
 * 
 * @param string $sql
 * @param array $params
 * @return array
 */
function dbFetchAll(string $sql, array $params = []): array {
    return dbQuery($sql, $params)->fetchAll();
}
