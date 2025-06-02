export default {
    title: 'FileKeeper',
    errors: {
        networkFailed: 'אין חיבור לאינטרנט',
        emailAlreadyInUse: 'האימייל כבר קיים במערכת',
        generalRegisteritionError: 'לא ניתן להירשם כעת, אנא נסה שנית',
        dbCreateUserFailed: 'לא ניתן ליצור את המשתמש כעת, אנא נסה שנית',
        sharingNotAvailable: 'שיתוף לא זמין במכשיר הזה',
        sharingFailed: 'שגיאה בשיתוף הקובץ',
        NoFileProvided: 'לא סופק קובץ',
        unexpected: 'לא ניתן לטעון את המשתמש כעת, אנא נסה שנית',
        unknown: 'אירעה שגיאה לא ידועה',
    },
    alert: {
        close: 'סגור',
        titleError: 'שגיאה',
    },
    onboarding: {
        page1: {
            title: 'ברוכים הבאים\nלאפליקציה לניהול מסמכים',
            description: 'הדרך הפשוטה והמהירה לנהל את כל \nהמסמכים שלכם במקום אחד ובנוחות מלאה.',
            button: 'בואו נתחיל!',
        },
        page2: {
            title: 'על האפליקציה',
            descriptionPart1:
                'האפליקציה שלנו מאפשרת לכם לאחסן קבצים ותמונות בצורה חכמה באמצעות בינה מלאכותית.\n' +
                '\n' +
                'בעת העלאת קובץ, הוא יקוטלג אוטומטית\n לאחת מארבע קטגוריות :\n',
            boldText: 'תחבורה, פיננסי, השכלה או רפואה.',
            descriptionPart2:
                '\n\nבנוסף, תוכלו להתאים את סידור המסמכים \nבאופן אישי, כך שניהול המסמכים יתאים בדיוק לצרכים ולהעדפות שלכם.',
            button: 'הרשמו עכשיו'
        }



    },
    registrationScreen: {
        inputs: {
            namePlaceholder: 'שם',
            emailPlaceholder: 'אימייל',
            passwordPlaceholder: 'סיסמה',
            confirmPasswordPlaceholder: 'אימות סיסמה',
            genderMale: 'זכר',
            genderFemale: 'נקבה',
        },
        buttons: {
            register: 'הרשם',
        },
        validation: {
            nameRequired: 'יש למלא שם',
            emailRequired: 'יש למלא אימייל',
            emailInvalid: 'אימייל לא תקין',
            passwordRequired: 'יש למלא סיסמה',
            passwordMinLength: 'הסיסמה חייבת להיות באורך של לפחות 8 תווים',
            passwordPattern: 'הסיסמה חייבת להכיל אותיות באנגלית, מספרים או סימנים מיוחדים בלבד',
            confirmPasswordRequired: 'יש לאמת את הסיסמה',
            confirmPasswordMismatch: 'הסיסמאות אינן תואמות',
            genderRequired: 'יש לבחור מגדר',
        },
    },
    fileScreen: {
        share: 'שתף',
        rename: 'שנה שם',
        favorite: 'מועדפים',
        noFile: 'לא נבחר קובץ',
    },
    loginScreen: {
        placeholders: {
            email: 'אימייל',
            password: 'סיסמה',
        },
        buttons: {
            login: 'התחבר',
            forgotPassword: 'שכחתי סיסמה',
        },
        validation: {
            emailInvalid: 'אימייל לא תקין',
            emailRequired: 'יש למלא אימייל',
            passwordRequired: 'יש למלא סיסמה',
            passwordMinLength: 'הסיסמה חייבת להיות באורך של לפחות 8 תווים',
            invalidCredentials: 'האימייל או הסיסמה אינם נכונים',
        }
    },

};
