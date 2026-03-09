<?php
/**
 * cart_handler.php – Gestionarea coșului de cumpărături prin PHP
 * BorLock – Magazin online de tehnologie
 * 
 * Endpoint-uri disponibile (via POST cu câmpul 'action'):
 * - add    : Adaugă un produs în coș
 * - remove : Elimină un produs din coș
 * - update : Actualizează cantitatea unui produs
 * - get    : Returnează toate produsele din coș
 * - clear  : Golește coșul
 * 
 * Notă: Versiunea JavaScript (cart.js) folosește localStorage și nu
 * necesită serverul. Acest fișier este pentru funcționalitatea
 * server-side cu sesiuni PHP.
 */

// Porneste sesiunea
session_start();

// Setăm header pentru răspuns JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

// Includem conexiunea la DB
require_once __DIR__ . '/db_connect.php';

// ============================================================
// VERIFICARE AUTENTIFICARE (opțional – coșul funcționează și fără login)
// ============================================================
$userId = $_SESSION['user_id'] ?? null;

// Obținem acțiunea cerută
$rawInput = file_get_contents('php://input');
$jsonInput = json_decode($rawInput, true);

$action    = $jsonInput['action']     ?? $_POST['action']     ?? $_GET['action']     ?? 'get';
$productId = (int)($jsonInput['product_id'] ?? $_POST['product_id'] ?? 0);
$quantity  = (int)($jsonInput['quantity']   ?? $_POST['quantity']   ?? 1);

// ============================================================
// RUTARE ACȚIUNI
// ============================================================
switch ($action) {

    case 'add':
        /**
         * Adaugă un produs în coș
         */
        if (!$productId) {
            sendError('ID produs invalid.');
        }
        
        if ($quantity < 1) $quantity = 1;
        
        try {
            // Verificăm că produsul există și are stoc
            $product = dbFetchOne(
                'SELECT id, name, stock FROM products WHERE id = ?',
                [$productId]
            );
            
            if (!$product) {
                sendError('Produsul nu există.', 404);
            }
            
            if ($product['stock'] <= 0) {
                sendError('Produsul nu mai este în stoc.', 400);
            }
            
            if ($userId) {
                // Utilizator autentificat – salvăm în DB
                $existingItem = dbFetchOne(
                    'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
                    [$userId, $productId]
                );
                
                if ($existingItem) {
                    // Actualizăm cantitatea
                    dbQuery(
                        'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
                        [$quantity, $existingItem['id']]
                    );
                } else {
                    // Adăugăm produs nou în coș
                    dbQuery(
                        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                        [$userId, $productId, $quantity]
                    );
                }
            }
            
            sendSuccess('Produs adăugat în coș!', ['product_id' => $productId, 'quantity' => $quantity]);
            
        } catch (PDOException $e) {
            sendError('Eroare la adăugarea în coș.');
        }
        break;

    case 'remove':
        /**
         * Elimină un produs din coș
         */
        if (!$productId) {
            sendError('ID produs invalid.');
        }
        
        try {
            if ($userId) {
                dbQuery(
                    'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
                    [$userId, $productId]
                );
            }
            
            sendSuccess('Produs eliminat din coș.');
            
        } catch (PDOException $e) {
            sendError('Eroare la eliminarea din coș.');
        }
        break;

    case 'update':
        /**
         * Actualizează cantitatea unui produs din coș
         */
        if (!$productId) {
            sendError('ID produs invalid.');
        }
        
        if ($quantity < 1) {
            // Dacă cantitatea e 0, eliminăm produsul
            if ($userId) {
                dbQuery(
                    'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
                    [$userId, $productId]
                );
            }
            sendSuccess('Produs eliminat din coș.');
        }
        
        try {
            if ($userId) {
                dbQuery(
                    'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                    [$quantity, $userId, $productId]
                );
            }
            
            sendSuccess('Cantitate actualizată.', ['quantity' => $quantity]);
            
        } catch (PDOException $e) {
            sendError('Eroare la actualizarea cantității.');
        }
        break;

    case 'get':
        /**
         * Returnează toate produsele din coș cu detalii
         */
        try {
            if (!$userId) {
                sendSuccess('Coș gol (utilizator neautentificat).', ['items' => [], 'total' => 0]);
                break;
            }
            
            // Join cu tabelul de produse pentru a obține detaliile
            $cartItems = dbFetchAll(
                'SELECT c.id as cart_id, c.quantity, 
                        p.id, p.name, p.price, p.old_price, p.image, p.stock,
                        cat.name as category_name
                 FROM cart c
                 JOIN products p ON c.product_id = p.id
                 LEFT JOIN categories cat ON p.category_id = cat.id
                 WHERE c.user_id = ?
                 ORDER BY c.added_at DESC',
                [$userId]
            );
            
            // Calculăm totalul
            $total = array_sum(array_map(
                fn($item) => $item['price'] * $item['quantity'],
                $cartItems
            ));
            
            sendSuccess('Coș returnat cu succes.', [
                'items' => $cartItems,
                'total' => $total,
                'count' => count($cartItems)
            ]);
            
        } catch (PDOException $e) {
            sendError('Eroare la obținerea coșului.');
        }
        break;

    case 'clear':
        /**
         * Golește coșul utilizatorului
         */
        try {
            if ($userId) {
                dbQuery('DELETE FROM cart WHERE user_id = ?', [$userId]);
            }
            
            sendSuccess('Coșul a fost golit.');
            
        } catch (PDOException $e) {
            sendError('Eroare la golirea coșului.');
        }
        break;

    default:
        sendError("Acțiune necunoscută: {$action}.", 400);
}

// ============================================================
// FUNCȚII HELPER PENTRU RĂSPUNSURI
// ============================================================

/**
 * Trimite un răspuns de succes
 * @param string $message
 * @param array $data
 */
function sendSuccess(string $message, array $data = []): void {
    echo json_encode(array_merge(
        ['success' => true, 'message' => $message],
        $data
    ));
    exit();
}

/**
 * Trimite un răspuns de eroare
 * @param string $message
 * @param int $httpCode
 */
function sendError(string $message, int $httpCode = 400): void {
    http_response_code($httpCode);
    echo json_encode(['success' => false, 'message' => $message]);
    exit();
}
