<?php
/**
 * Firebase Configuration for SME Registration System (REST API Version)
 * 
 * This version uses standard PHP cURL and does not require Composer 
 * or the Firebase Admin SDK.
 */

class FirebaseConfig {
    const PROJECT_ID = "my-first-project-955f6";
    const API_KEY = "AIzaSyA5ulR8LY8S0Xj9z6wfwTzp-kkhDfQ8Nvs"; // From your JS config
    const BASE_URL = "https://firestore.googleapis.com/v1/projects/" . self::PROJECT_ID . "/databases/(default)/documents/";

    public static function post($collection, $data) {
        $url = self::BASE_URL . $collection . "?key=" . self::API_KEY;
        
        // Convert PHP associative array to Firestore JSON structure
        $firestoreData = ['fields' => self::mapToFirestore($data)];
        $json = json_encode($firestoreData);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        
        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($status >= 400) {
            throw new Exception("Firebase Error: " . $response);
        }

        return json_decode($response, true);
    }

    public static function get($collection) {
        $url = self::BASE_URL . $collection . "?key=" . self::API_KEY;
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($status >= 400) {
            throw new Exception("Firebase Error: " . $response);
        }

        $data = json_decode($response, true);
        return $data['documents'] ?? [];
    }

    /**
     * Helper to map PHP arrays to Firestore's complex Value types
     */
    private static function mapToFirestore($data) {
        $fields = [];
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $fields[$key] = ['mapValue' => ['fields' => self::mapToFirestore($value)]];
            } elseif (is_bool($value)) {
                $fields[$key] = ['booleanValue' => $value];
            } elseif (is_numeric($value)) {
                $fields[$key] = ['doubleValue' => (float)$value];
            } else {
                $fields[$key] = ['stringValue' => (string)$value];
            }
        }
        return $fields;
    }

    /**
     * Helper to simplify Firestore document data for the frontend
     */
    public static function simplify($doc) {
        if (!isset($doc['fields'])) return [];
        return self::mapFromFirestore($doc['fields']);
    }

    private static function mapFromFirestore($fields) {
        $data = [];
        foreach ($fields as $key => $value) {
            if (isset($value['mapValue'])) {
                $data[$key] = self::mapFromFirestore($value['mapValue']['fields']);
            } elseif (isset($value['stringValue'])) {
                $data[$key] = $value['stringValue'];
            } elseif (isset($value['booleanValue'])) {
                $data[$key] = $value['booleanValue'];
            } elseif (isset($value['doubleValue'])) {
                $data[$key] = $value['doubleValue'];
            } elseif (isset($value['integerValue'])) {
                $data[$key] = $value['integerValue'];
            }
        }
        return $data;
    }
}
?>
