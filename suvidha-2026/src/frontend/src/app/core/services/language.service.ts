import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private currentLang = signal<string>('EN');
    
    // Translations object
    private translations: any = {
        EN: {
            LANGUAGE: {
                SELECT: 'Select Language / भाषा चुनें',
                ENGLISH: 'English',
                DEFAULT: 'Default',
                HINDI: 'हिंदी',
                HINDI_DESC: 'राजभाषा',
                CANCEL: 'Cancel / रद्द करें'
            },
            LOGIN: {
                TITLE: 'Login',
                SUBTITLE: 'Enter your 10-digit mobile number',
                BTN: 'VERIFY & PROCEED',
                SIDE_TITLE: 'Secure Citizen Authentication',
                SIDE_DESC: 'Access electricity, water, gas, and municipal services securely.'
            },
            OTP: {
                TITLE: 'Enter OTP',
                SUBTITLE_PREFIX: 'Sent to +91',
                BTN: 'CONFIRM OTP',
                RESEND: 'Resend OTP (30s)',
                SIDE_TITLE: 'Identity Verification',
                SIDE_DESC: 'We have sent a 4-digit One Time Password (OTP) to your mobile.'
            },
            DASHBOARD: {
                WELCOME: 'Namaste, Arjun',
                LAST_LOGIN: 'Last Login: Today, 10:45 AM',
                TOTAL_DUE: 'Total Outstanding',
                PAY_BILLS: 'Pay Bills',
                TRACK: 'Track Request',
                LOGOUT: 'Secure Logout'
            },
            SERVICES: {
                ELECTRICITY: 'Electricity Services',
                WATER: 'Water & Sanitation',
                GAS: 'Gas Services',
                MUNICIPAL: 'Municipal Complaints'
            },
            RECEIPT: {
                SUCCESS: 'Payment Successful',
                HOME: 'Collect & Home'
            }
        },
        HI: {
            LANGUAGE: {
                SELECT: 'भाषा चुनें / Select Language',
                ENGLISH: 'English',
                DEFAULT: 'डिफ़ॉल्ट',
                HINDI: 'हिंदी',
                HINDI_DESC: 'राजभाषा',
                CANCEL: 'रद्द करें / Cancel'
            },
            LOGIN: {
                TITLE: 'लॉगिन',
                SUBTITLE: 'अपना 10-अंकीय मोबाइल नंबर दर्ज करें',
                BTN: 'सत्यापित करें',
                SIDE_TITLE: 'सुरक्षित नागरिक प्रमाणीकरण',
                SIDE_DESC: 'बिजली, पानी, गैस और नगरपालिका सेवाओं का उपयोग करें।'
            },
            OTP: {
                TITLE: 'OTP दर्ज करें',
                SUBTITLE_PREFIX: 'OTP भेजा गया: +91',
                BTN: 'OTP पुष्टि करें',
                RESEND: 'OTP पुनः भेजें (30s)',
                SIDE_TITLE: 'पहचान सत्यापन',
                SIDE_DESC: 'हमने आपके मोबाइल पर 4 अंकों का वन टाइम पासवर्ड (OTP) भेजा है।'
            },
            DASHBOARD: {
                WELCOME: 'नमस्ते, अर्जुन',
                LAST_LOGIN: 'पिछला लॉगिन: आज, 10:45 AM',
                TOTAL_DUE: 'कुल बकाया राशि',
                PAY_BILLS: 'बिल भुगतान',
                TRACK: 'अनुरोध ट्रैक करें',
                LOGOUT: 'सुरक्षित लॉगआउट'
            },
            SERVICES: {
                ELECTRICITY: 'बिजली सेवाएँ',
                WATER: 'पानी और स्वच्छता',
                GAS: 'गैस सेवाएँ',
                MUNICIPAL: 'नगर निगम शिकायत'
            },
            RECEIPT: {
                SUCCESS: 'भुगतान सफल',
                HOME: 'रसीद लें और घर जाएँ'
            }
        }
    };

    constructor() {
        // Load saved language or default to EN
        const saved = localStorage.getItem('language');
        if (saved) {
            this.currentLang.set(saved);
        }
    }

    getLanguage(): string {
        return this.currentLang();
    }

    setLanguage(lang: string) {
        this.currentLang.set(lang);
        localStorage.setItem('language', lang);
    }

    translate(key: string): string {
        // Simple key-based translation: 'LOGIN.TITLE' -> returns translated string
        const keys = key.split('.');
        let result: any = this.translations[this.currentLang()];
        
        for (const k of keys) {
            result = result ? result[k] : null;
        }
        
        return result || key;
    }
}

